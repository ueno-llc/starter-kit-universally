/**
 * This is used by the HtmlWebpackPlugin to generate an html page that we will
 * use as a fallback for our service worker when the user is offline.  It will
 * embed all the required asset paths needed to bootstrap the application
 * in an offline session.
 */

import React from 'react';
import Helmet from 'react-helmet';
import { renderToStaticMarkup } from 'react-dom/server';
import HTML from 'components/html';

module.exports = function generate(context) {
  const { config, ClientConfig } = context.htmlWebpackPlugin.options.custom;

  const html = renderToStaticMarkup(
    <HTML
      helmet={<Helmet {...config('helmet')} /> && Helmet.rewind()}
      bodyElements={<ClientConfig nonce="OFFLINE_PAGE_NONCE_PLACEHOLDER" />}
    />,
  );

  return `<!DOCTYPE html>${html}`;
};
