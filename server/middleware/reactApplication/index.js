
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { withAsyncComponents } from 'react-async-component';
import { Provider, useStaticRendering } from 'mobx-react';
import Helmet from 'react-helmet';
import Store from 'store';

import getConfig from '../../../config/get';
import App from '../../../shared';

import ServerHTML from './ServerHTML';

useStaticRendering(true);

/**
 * React application middleware, supports server side rendering.
 */
function reactApplicationMiddleware(request, response) {
  // We should have had a nonce provided to us.  See the server/index.js for
  // more information on what this is.
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response');
  }
  const nonce = response.locals.nonce;

  // It's possible to disable SSR, which can be useful in development mode.
  // In this case traditional client side only rendering will occur.
  if (getConfig('disableSSR')) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('==> Handling react route without SSR');
    }
    // SSR is disabled so we will just return an empty html page and will
    // rely on the client to initialize and render the react application.
    const html = renderToStaticMarkup(<ServerHTML nonce={nonce} />);
    response.status(200).send(html);
    return;
  }

  // First create a context for <StaticRouter>, which will allow us to
  // query for the results of the render.
  // const reactRouterContext = createServerRenderContext();
  const store = new Store();
  const context = {};

  // Create our React application.
  const app = (
    <StaticRouter location={request.url} context={context}>
      <Provider {...store}>
        <App />
      </Provider>
    </StaticRouter>
  );

  // Wrap our app with react-async-component helper so that our async components
  // will be resolved and rendered with the response.
  withAsyncComponents(app).then(({ appWithAsyncComponents, state, STATE_IDENTIFIER }) => {
    // Render the app to a string.
    const reactAppString = renderToString(appWithAsyncComponents);

    // Generate the html response.
    const html = renderToStaticMarkup(
      <ServerHTML
        reactAppString={reactAppString}
        nonce={nonce}
        helmet={Helmet.rewind()}
        asyncComponents={{ state, STATE_IDENTIFIER }}
      />,
    );

    // Get the render result from the server render context.
    // const renderResult = reactRouterContext.getResult();
    // const renderResult = { missed: false, redirect: false };

    // Check if the render result contains a redirect, if so we need to set
    // the specific status and redirect header and end the response.
    if (context.url) {
      response.status(301).setHeader('Location', context.url);
      response.end();
      return;
    }

    response
      .status(200)
      .send(`<!DOCTYPE html>${html}`);
  });
}

export default reactApplicationMiddleware;
