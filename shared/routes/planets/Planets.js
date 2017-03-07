import React, { Component } from 'react';
import { PropTypes as MobxPropTypes, observer, inject } from 'mobx-react';
import { observable, computed } from 'mobx';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import Segment from 'components/segment';
import Button from 'components/button';
import { autobind } from 'core-decorators';

@inject(['planets'])
@observer
export default class Planets extends Component {

  static propTypes = {
    planets: MobxPropTypes.observableObject,
  };

  /**
   * Fired when component will mount.
   * @return {void}
   */
  componentWillMount() {
    // This component is lazy loaded.
    // We want to wait for the real componentWillMount to fire.
    // Otherwise `forceUpdate` warning will appear.
    if (!this.context.ASYNC_WALKER_BOUNDARY) {
      this.planets = this.props.planets.fetchAll();
    }
  }

  /**
   * Fired when pagination buttons are clicked.
   * @param {Event} Click-event.
   * @return {void}
   */
  @autobind
  onClickPage(e) {
    // Prevent default click behaviour
    e.preventDefault();

    // Extract wanted url from node's dataset.
    const { url } = e.currentTarget.dataset;
    const pagestr = url.match(/page=(\d+)/);
    const page = parseInt(pagestr && pagestr[1], 10) || 1;

    // Fetch the next wanted page. (it may or may not already exist in the cache).
    this.planets = this.props.planets.fetchAll({ page });

    // Set current page
    this.page = page;
  }

  /**
   * @var {observableObject} Promise that contains fetched data.
   */
  @observable
  planets = null;

  /**
   * @var {observableObject} Current page
   */
  @observable
  page = 1;

  /**
   * @var {Number} Calculate every time the current page changes.
   */
  @computed
  get from() { return (this.page * 10) - 9; }

  /**
   * @var {Number} Calculate every time the current page changes.
   */
  @computed
  get to() { return this.page * 10; }

  /**
   * Render method
   * @return {React.Component}
   */
  render() {
    return (
      <div>
        <Helmet title="Planets" />

        <Segment>
          {this.planets && this.planets.case({
            pending: () => (<div>Loading planets...</div>),
            rejected: error => (<div>Could fetch planets: {error.message}</div>),
            fulfilled: ({ results, count, previous, next }) => (
              <div>
                <p>Showing {this.from}-{Math.min(this.to, count)} of {count} planets available.</p>

                <ul>
                  {results.map(({ name, url }) => (
                    <li key={`planet_${name}`}>
                      <Link to={`/planets/${url.match(/(\d+)\/$/)[1]}`}>{name}</Link>
                    </li>
                  ))}
                </ul>

                <nav>
                  <Button disabled={!previous} data-url={previous} onClick={this.onClickPage}>
                    Previous
                  </Button>
                  <Button disabled={!next} data-url={next} onClick={this.onClickPage}>
                    Next
                  </Button>
                </nav>
              </div>
            ),
          })}
        </Segment>
      </div>
    );
  }
}
