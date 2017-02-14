import React from 'react';

// eslint-disable-next-line
let DevTools = () => null;

/* eslint global-require: 0 */
if (process.env.NODE_ENV !== 'production') {

  // You are free to add any dev tools needed here.
  // They are required on runtime, so deps can be added in devDeps as needed.
  const MobxDevTools = require('mobx-react-devtools').default;
  const GridOverlay = require('../grid-overlay').default;

  DevTools = () => (
    <div>
      <MobxDevTools />
      <GridOverlay columns={12} />
    </div>
  );
}

export default DevTools;
