/**
 * This module is responsible for generating the HTML page response for
 * the react application middleware.
 */

/* eslint-disable react/no-danger */
/* eslint-disable react/no-array-index-key */

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import { flushChunkNames } from 'react-universal-component/server';

import HTML from 'components/html';
import config from 'utils/config';
import Analytics from 'utils/analytics';

import getClientBundleEntryAssets from './getClientBundleEntryAssets';
import getChunks from './getChunks';
import getManifest from './getManifest';

import ifElse from '../../../internal/utils/logic/ifElse';
import removeNil from '../../../internal/utils/arrays/removeNil';
import ClientConfig from '../../../config/components/ClientConfig';

function KeyedComponent({ children }) {
  return Children.only(children);
}

const facebookPixel = config('facebookPixel');
const twitterPixel = config('twitterPixel');
const analytics = new Analytics({ facebookPixel, twitterPixel });

// Resolve the assets (js/css) for the client bundle's entry chunk.
const clientEntryAssets = getClientBundleEntryAssets();

const webpackManifest = getManifest();

function stylesheetTag(stylesheetFilePath) {
  return (
    <link href={stylesheetFilePath} media="screen, projection" rel="stylesheet" type="text/css" />
  );
}

function scriptTag(jsFilePath) {
  return <script type="text/javascript" src={jsFilePath} />;
}

function ServerHTML(props) {
  const {
    jobsState,
    routerState,
    helmet,
    addHash,
    reactAppString,
    appState,
  } = props;

  // Creates an inline script definition that is protected by the nonce.
  const inlineScript = body => (
    <script type="text/javascript" dangerouslySetInnerHTML={{ __html: addHash(body) }} />
  );

  const chunkNames = flushChunkNames();

  const {
    cssHashRaw = {},
    scripts,
    stylesheets,
  } = getChunks(chunkNames);

  const headerElements = removeNil([
    // Renames html class from no-js to js
    inlineScript('document.documentElement.className=document.documentElement.className.replace("no-js","js")'),
    ifElse(facebookPixel)(() => inlineScript(analytics.facebook)),
    ifElse(twitterPixel)(() => inlineScript(analytics.twitter)),
    ...ifElse(helmet)(() => helmet.meta.toComponent(), []),
    ...ifElse(helmet)(() => helmet.title.toComponent(), []),
    ...ifElse(helmet)(() => helmet.base.toComponent(), []),
    ...ifElse(helmet)(() => helmet.link.toComponent(), []),
    ifElse(clientEntryAssets && clientEntryAssets.css)(
      () => stylesheetTag(clientEntryAssets.css),
    ),
    ...ifElse(helmet)(() => helmet.style.toComponent(), []),
    ifElse(webpackManifest)(() => inlineScript(`window.__WEBPACK_MANIFEST__=${serialize(webpackManifest, { isJSON: true })};`)),
    ...ifElse(stylesheets)(() => stylesheets.map(s => stylesheetTag(s)), []),
  ]);

  const bodyElements = removeNil([
    ifElse(facebookPixel)(() => analytics.facebookNoscript),
    // Binds the client configuration object to the window object so
    // that we can safely expose some configuration values to the
    // client bundle that gets executed in the browser.
    <ClientConfig addHash={addHash} />,
    ifElse(jobsState)(() => inlineScript(`window.__JOBS_STATE__=${serialize(jobsState, { isJSON: true })}`)),
    ifElse(routerState)(() => inlineScript(`window.__ROUTER_STATE__=${serialize(routerState, { isJSON: true })}`)),
    ifElse(appState)(() => inlineScript(`window.__APP_STATE__=${serialize(appState, { isJSON: true })}`)),
    // Enable the polyfill io script?
    // This can't be configured within a react-helmet component as we
    // may need the polyfill's before our client JS gets parsed.
    // The gated flag is added for feature detection,
    // preventing wrong feature set in chrome simulator
    ifElse(config('polyfillIO.enabled'))(
      () =>
        scriptTag(`${config('polyfillIO.url')}?features=${config('polyfillIO.features').join(',')}&flags=gated`),
    ),
    // When we are in development mode our development server will
    // generate a vendor DLL in order to dramatically reduce our
    // compilation times.  Therefore we need to inject the path to the
    // vendor dll bundle below.
    ifElse(
      process.env.BUILD_FLAG_IS_DEV === 'true' && config('bundles.client.devVendorDLL.enabled'),
    )(() =>
      scriptTag(
        `${config('bundles.client.webPath')}${config(
          'bundles.client.devVendorDLL.name',
        )}.js?t=${Date.now()}`,
      )),
    inlineScript(`window.__CSS_CHUNKS__=${serialize(cssHashRaw)}`),
    ...ifElse(scripts)(() => scripts.map(s => scriptTag(s)), []),
    ifElse(clientEntryAssets && clientEntryAssets.js)(
      () => scriptTag(clientEntryAssets.js),
    ),
    ...ifElse(helmet)(() => helmet.script.toComponent(), []),
  ]);

  return (
    <HTML
      htmlAttributes={ifElse(helmet)(() => helmet.htmlAttributes.toComponent(), null)}
      headerElements={headerElements.map((x, idx) =>
        (
          <KeyedComponent key={idx}>
            {x}
          </KeyedComponent>
        ))}
      bodyElements={bodyElements.map((x, idx) =>
        (
          <KeyedComponent key={idx}>
            {x}
          </KeyedComponent>
        ))}
      appBodyString={reactAppString}
    />
  );
}

ServerHTML.propTypes = {
  jobsState: PropTypes.object,
  routerState: PropTypes.object,
  helmet: PropTypes.object,
  addHash: PropTypes.func,
  reactAppString: PropTypes.string,
  appState: PropTypes.object,
};

export default ServerHTML;
