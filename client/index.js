import React from 'react';
import { render } from 'react-dom';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import asyncBootstrapper from 'react-async-bootstrapper';
import { AsyncComponentProvider } from 'react-async-component';
import { JobProvider } from 'react-jobs';
import { Provider } from 'mobx-react';
import { toJS } from 'mobx';
import stringify from 'json-stringify-safe';
import ReactGA from 'react-ga';
import Store from 'store';
import App from 'App';

import config from 'utils/config';
import ReactHotLoader from './components/ReactHotLoader';

// Initialize Google Analytics
const gaId = config('gaId');
if (gaId) {
  ReactGA.initialize(gaId);
}

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

let store = new Store();
window.store = store;

// Does the user's browser support the HTML5 history API?
// If the user's browser doesn't support the HTML5 history API then we
// will force full page refreshes on each page change.
const supportsHistory = 'pushState' in window.history;

// Get any rehydrateState for the async components.
// eslint-disable-next-line no-underscore-dangle
const asyncComponentsRehydrateState = window.__ASYNC_COMPONENTS_REHYDRATE_STATE__;

// Get any "rehydrate" state sent back by the server
// eslint-disable-next-line no-underscore-dangle
const rehydrateState = window.__JOBS_STATE__;

/**
 * Renders the given React Application component.
 */
function renderApp(TheApp) {
  // Firstly, define our full application component, wrapping the given
  // component app with a browser based version of react router.
  const app = (
    <ReactHotLoader>
      <AsyncComponentProvider rehydrateState={asyncComponentsRehydrateState}>
        <JobProvider rehydrateState={rehydrateState}>
          <Provider {...store}>
            <BrowserRouter forceRefresh={!supportsHistory}>
              <TheApp />
            </BrowserRouter>
          </Provider>
        </JobProvider>
      </AsyncComponentProvider>
    </ReactHotLoader>
  );

  // We use the react-async-component in order to support code splitting of
  // our bundle output. It's important to use this helper.
  // @see https://github.com/ctrlplusb/react-async-component
  asyncBootstrapper(app).then(() => render(app, container));
}

// Execute the first render of our app.
renderApp(App);

// This registers our service worker for asset caching and offline support.
// Keep this as the last item, just in case the code execution failed (thanks
// to react-boilerplate for that tip.)
require('./registerServiceWorker');

// The following is needed so that we can support hot reloading our application.
if (process.env.BUILD_FLAG_IS_DEV === 'true' && module.hot) {
  if (module.hot.data && module.hot.data.store) {
    // Create new store with previous store state
    store = new Store(JSON.parse(module.hot.data.store));
  }

  module.hot.dispose((data) => {
    // Deserialize store and keep in hot module data for next replacement
    data.store = stringify(toJS(store));
  });

  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js');
  // Any changes to our App will cause a hotload re-render.
  module.hot.accept(() => renderApp(require('App').default));

  const consoleWarn = console.warn;

  console.warn = (first, ...args) => {
    const noStoreChange = /Provided store (.*) has changed/;
    if (first && noStoreChange.test(first)) return;
    consoleWarn.call(console, first, ...args);
  };
}
