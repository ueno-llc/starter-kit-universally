import Network from './Network';
import Planets from './Planets';

export default class Store {
  constructor(state = {}) {
    this.network = new Network(state);
    this.planets = new Planets(state, this.network);
  }
}
