import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component';
import { JobProvider, createJobContext } from 'react-jobs';
import asyncBootstrapper from 'react-async-bootstrapper';
import { Provider, useStaticRendering } from 'mobx-react';
import Helmet from 'react-helmet';
import Store from 'store';
import timing from 'utils/timing';
import sha256 from 'sha256';
import App from 'App';

import ServerHTML from './ServerHTML';

useStaticRendering(true);

/**
 * React application middleware, with server-side rendering.
 */
export default function reactApplicationMiddleware(request, response) {
  // Add script hashes
  // See the server/middleware/security.js for more info.
  const addHash = (content) => {
    response.setHeader(
      'content-security-policy',
      response.getHeader('content-security-policy')
        .split(';')
        .map(directive => directive.indexOf('script-src') >= 0 ?
          `${directive} sha256-${sha256(content)}` : directive)
        .join(';'),
    );
    return content;
  };

  // Create a context for our AsyncComponentProvider.
  const asyncComponentsContext = createAsyncContext();

  // Create a context for <StaticRouter>, which will allow us to
  // query for the results of the render.
  const reactRouterContext = {};

  // Create the job context for our provider, this grants
  // us the ability to track the resolved jobs to send back to the client.
  const jobContext = createJobContext();

  // Initialize the store
  const store = new Store();

  // Declare our React application.
  const app = (
    <AsyncComponentProvider asyncContext={asyncComponentsContext}>
      <JobProvider jobContext={jobContext}>
        <StaticRouter location={request.url} context={reactRouterContext}>
          <Provider {...store}>
            <App />
          </Provider>
        </StaticRouter>
      </JobProvider>
    </AsyncComponentProvider>
  );

  // Measure the time it takes to complete the async boostrapper runtime.
  const { end: endRuntimeTiming } = timing.start('Server runtime');

  // Pass our app into the react-async-component helper so that any async
  // components are resolved for the render.
  asyncBootstrapper(app).then(() => {
    const { end: endRenderTiming } = timing.start('Render app');
    const appString = renderToString(app);
    endRenderTiming();

    const html = renderToStaticMarkup(
      <ServerHTML
        reactAppString={appString}
        addHash={addHash}
        helmet={Helmet.rewind()}
        routerState={reactRouterContext}
        jobsState={jobContext.getState()}
        asyncComponentsState={asyncComponentsContext.getState()}
      />,
    );

    // Check if the router context contains a redirect, if so we need to set
    // the specific status and redirect header and end the response.
    if (reactRouterContext.url) {
      response.status(302).setHeader('Location', reactRouterContext.url);
      response.end();
      return;
    }

    // End the measurement
    endRuntimeTiming();

    // Set server timings header for Chrome network tab timings.
    response.set('Server-Timing', timing.toString());

    response
      .status(reactRouterContext.status || 200)
      .send(`<!DOCTYPE html>${html}`);
  });
}
