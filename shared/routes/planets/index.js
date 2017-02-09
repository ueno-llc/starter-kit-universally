import { createAsyncComponent } from 'react-async-component';

export default createAsyncComponent({
  resolve: () => System.import('./Planets'),
  ssrMode: 'boundary',
  name: 'Planets',
});
