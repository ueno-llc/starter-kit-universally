/* eslint-disable global-require */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { withAsyncComponents } from 'react-async-component';
import { Provider } from 'mobx-react';
import { toJS } from 'mobx';
import stringify from 'json-stringify-safe';
import Store from 'store';
import ReactHotLoader from './components/ReactHotLoader';
import App from '../shared';

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

// eslint-disable-next-line
let store = window.store = new Store(window.__INITIAL_STATE__);

function renderApp(TheApp) {
  const app = (
    <ReactHotLoader>
      <Provider {...store}>
        <BrowserRouter>
          <TheApp />
        </BrowserRouter>
      </Provider>
    </ReactHotLoader>
  );

  // We use the react-async-component in order to support super easy code splitting
  // within our application.  It's important to use this helper
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
if (process.env.NODE_ENV === 'development' && module.hot) {

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
}
