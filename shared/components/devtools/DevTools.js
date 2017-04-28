import React from 'react';

const showDevTools = process.env.BUILD_FLAG_IS_DEV === 'true';
const MobxDevTools = showDevTools && require('mobx-react-devtools').default;
const GridOverlay = showDevTools && require('components/grid-overlay').default;

const DevTools = showDevTools ? () => (
  <div>
    <MobxDevTools />
    <GridOverlay columns={12} baseline={16} />
  </div>
) : (() => null);

export default DevTools;
