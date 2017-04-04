import { asyncComponent } from 'react-async-component';

export default asyncComponent({
  resolve: () => System.import('./PlanetsDetail'),
  ssrMode: 'boundary',
  name: 'PlanetsDetail',
});
