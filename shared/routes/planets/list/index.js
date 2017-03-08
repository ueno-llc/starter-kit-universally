import { createAsyncComponent } from 'react-async-component';

export default createAsyncComponent({
  resolve: () => System.import('./PlanetsList'),
  ssrMode: 'boundary',
  name: 'PlanetsList',
});
