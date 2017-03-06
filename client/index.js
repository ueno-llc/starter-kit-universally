/* eslint-disable global-require */
/* eslint-disable no-console */

import React from 'react';
import { render } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import { withAsyncComponents } from 'react-async-component';
import { Provider } from 'mobx-react';
import { toJS } from 'mobx';
import stringify from 'json-stringify-safe';
import Store from 'store';
import App from '../shared';

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

// eslint-disable-next-line
let store = window.store = new Store(window.__INITIAL_STATE__);

// Does the user's browser support the HTML5 history API?
const supportsHistory = 'pushState' in window.history;

/**
 * Renders the given React Application component.
 */
function renderApp(TheApp) {
  // Firstly, define our full application component, wrapping the given
  // component app with a browser based version of react router.
  const app = (
    <Provider {...store}>
      <BrowserRouter forceRefresh={!supportsHistory}>
        <TheApp />
      </BrowserRouter>
    </Provider>
  );

  // We use the react-async-component in order to support code splitting of
  // our bundle output. It's important to use this helper.
  // @see https://github.com/ctrlplusb/react-async-component
  withAsyncComponents(app).then(({ appWithAsyncComponents }) =>
    render(appWithAsyncComponents, container),
  );
}

// Execute the first render of our app.
renderApp(App);

// This registers our service worker for asset caching and offline support.
// Keep this as the last item, just in case the code execution failed (thanks
// to react-boilerplate for that tip.)
require('./registerServiceWorker');

// The following is needed so that we can support hot reloading our application.
if (process.env.BUILD_FLAG_IS_DEV && module.hot) {

  if (module.hot.data && module.hot.data.store) {
    // Create new store with previous store state
    store = new Store(JSON.parse(module.hot.data.store));
  }

  module.hot.dispose((data) => {
    // Deserialize store and keep in hot module data for next replacement
    data.store = stringify(toJS(store)); // eslint-disable-line
  });

  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js');
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept(
    () => renderApp(require('../shared').default),
  );

  const consoleWarn = console.warn;

  console.warn = (first, ...args) => {
    const noStoreChange = /Provided store (.*) has changed/;
    if (first && noStoreChange.test(first)) return;
    consoleWarn.call(console, first, ...args);
  };
}
