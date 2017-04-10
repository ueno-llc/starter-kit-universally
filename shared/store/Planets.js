import { extendObservable } from 'mobx';
import timing from 'utils/timing';

/**
 * This store planets.
 */
export default class Planets {

  /**
   * Constructor
   * @param {object} Domain store
   */
  constructor({ planets = {} }, network) {
    this.fetch = network.fetch;
    extendObservable(this, planets);
  }

  /**
   * @var {string} API endpoint
   */
  apiUrl = 'https://swapi.co/api/planets';

  /**
   * Fetch all planets
   * @param {Number} Page number
   * @return {Promise}
   */
  @timing.promise
  fetchAll({ page = 1 } = {}) {
    return this.fetch(`${this.apiUrl}/?page=${page}`);
  }

  /**
   * Fetch planet by id
   * @param {string} Planet Id
   * @return {Promise}
   */
  @timing.promise
  fetchById(id) {
    return this.fetch(`${this.apiUrl}/${id}/`);
  }
}
