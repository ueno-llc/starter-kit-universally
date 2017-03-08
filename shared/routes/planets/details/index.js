import { createAsyncComponent } from 'react-async-component';

export default createAsyncComponent({
  resolve: () => System.import('./PlanetsDetail'),
  ssrMode: 'boundary',
  name: 'PlanetsDetail',
});
