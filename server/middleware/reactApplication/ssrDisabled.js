import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useStaticRendering } from 'mobx-react';
import Helmet from 'react-helmet';

import addHash from './addHashToCspHeader';
import ServerHTML from './ServerHTML';

useStaticRendering(true);

/**
 * React application middleware without server-side rendering
 */
export default function reactApplicationMiddleware(request, response) {
  // Add script hashes
  // See the server/middleware/security.js for more info.
  const hashFunction = addHash(response);

  if (process.env.BUILD_FLAG_IS_DEV === 'true') {
    console.info('==> Handling react route without SSR');
  }
  // SSR is disabled so we will return an "empty" html page and
  // rely on the client to initialize and render the react application.
  const html = renderToStaticMarkup(<ServerHTML helmet={Helmet.rewind()} addHash={hashFunction} />);

  response.status(200).send(`<!DOCTYPE html>${html}`);
}
