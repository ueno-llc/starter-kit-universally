import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { JobProvider, createJobContext } from 'react-jobs';
import asyncBootstrapper from 'react-async-bootstrapper';
import { clearChunks } from 'react-universal-component/server';
import { toJS } from 'mobx';
import { Provider, useStaticRendering } from 'mobx-react';
import Helmet from 'react-helmet';
import Store from 'store';
import timing from 'utils/timing';
import App from 'App';

import addHash from './addHashToCspHeader';
import ServerHTML from './ServerHTML';

useStaticRendering(true);

/**
 * React application middleware, with server-side rendering.
 */
export default function reactApplicationMiddleware(request, response) {
  // Add script hashes
  // See the server/middleware/security.js for more info.
  const hashFunction = addHash(response);

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
    <JobProvider jobContext={jobContext}>
      <StaticRouter location={request.url} context={reactRouterContext}>
        <Provider {...store}>
          <App />
        </Provider>
      </StaticRouter>
    </JobProvider>
  );

  // Measure the time it takes to complete the async boostrapper runtime.
  const { end: endRuntimeTiming } = timing.start('Server runtime');

  // Needed for react-jobs
  asyncBootstrapper(app)
    .then(() => {
      const { end: endRenderTiming } = timing.start('Render app');

      clearChunks();
      const appString = renderToString(app);

      endRenderTiming();

      const html = renderToStaticMarkup(
        <ServerHTML
          reactAppString={appString}
          addHash={hashFunction}
          helmet={Helmet.rewind()}
          routerState={reactRouterContext}
          jobsState={jobContext.getState()}
          appState={toJS(store)}
        />,
      );

      // Check if the router context contains a redirect, if so we need to set
      // the specific status and redirect header and end the response.
      if (reactRouterContext.url) {
        response
          .status(reactRouterContext.status || 302)
          .setHeader('Location', reactRouterContext.url);
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
    })
    .catch((err) => {
      console.warn('Error bootstrapping react app', err);
      response.status(500).send('Error bootstrapping app');
    });
}
