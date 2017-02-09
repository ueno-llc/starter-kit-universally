import { createAsyncComponent } from 'react-async-component';

export default createAsyncComponent({
  resolve: () => System.import('./PlanetDetails'),
  ssrMode: 'boundary',
  name: 'PlanetDetails',
});
