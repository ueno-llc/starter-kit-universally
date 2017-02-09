import { action, observable, ObservableMap, extendObservable } from 'mobx';
import { autobind } from 'core-decorators';
// import serverWait from 'mobx-server-wait';
import fetch from 'isomorphic-fetch';

/**
 * This store handles network requests.
 */
export default class Network {

  /**
   * Constructor
   * @param {object} Domain store
   */
  constructor({ network = {} }) {
    extendObservable(this, {
      ...network,
      history: observable.map(network.history),
    });
  }

  /**
   * @var {bool} Network loading indicator
   */
  @observable
  isLoading = false;

  /**
   * Keep a history map of network requests for
   * throttling them.
   * @var {Map} The key is url.
   */
  @observable
  history = new ObservableMap();

  /**
   * Extended fetch method with credentials needed
   * to make http requests to the API.
   * @param {string} Url
   * @param {object} Options
   * @return {Promise}
   */
  @autobind
  // @serverWait
  fetch(url, { force = false } = {}) {

    if (this.history.has(url) && !force) {
      const { data } = this.history.get(url);
      return Promise.resolve(data);
    }

    this.isLoading = true;

    return fetch(url)
    .then(res => res.json())
    .then(((data) => {
      const ts = new Date().getTime();
      this.isLoading = false;
      this.history.set(url, { data, ts });
      return data;
    }))
    .catch(action((err) => {
      this.isLoading = false;
      throw err;
    }));
  }
}
