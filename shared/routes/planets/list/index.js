import { asyncComponent } from 'react-async-component';

export default asyncComponent({
  resolve: () => System.import('./PlanetsList'),
  ssrMode: 'boundary',
  name: 'PlanetsList',
});
