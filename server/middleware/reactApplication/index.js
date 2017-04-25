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

import config from '../../../config';
import App from '../../../shared';
import ServerHTML from './ServerHTML';

useStaticRendering(true);

/**
 * React application middleware, supports server side rendering.
 */
export default function reactApplicationMiddleware(request, response) {
  // Ensure a nonce has been provided to us.
  // See the server/middleware/security.js for more info.
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = response.locals.nonce;

  // It's possible to disable SSR, which can be useful in development mode.
  // In this case traditional client side only rendering will occur.
  if (config('disableSSR')) {
    if (process.env.BUILD_FLAG_IS_DEV === 'true') {
      // eslint-disable-next-line no-console
      console.log('==> Handling react route without SSR');
    }
    // SSR is disabled so we will return an "empty" html page and
    // rely on the client to initialize and render the react application.
    const html = renderToStaticMarkup(<ServerHTML helmet={Helmet.rewind()} nonce={nonce} />);
    response.status(200).send(`<!DOCTYPE html>${html}`);
    return;
  }

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
        nonce={nonce}
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
