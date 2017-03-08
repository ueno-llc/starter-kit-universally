import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import Segment from 'components/segment';
import autobind from 'core-decorators/lib/autobind';

@inject(['planets'])
@observer
export default class PlanetsDetail extends Component {

  /**
   * Fired when component will mount.
   * @return {void}
   */
  componentWillMount() {
    // This component is lazy loaded.
    // We want to wait for the real componentWillMount to fire.
    // Otherwise `forceUpdate` warning will appear.
    if (!this.context.ASYNC_WALKER_BOUNDARY) {
      // Fetch initial data needed
      this.fetchData(this.props);
    }
  }

  componentWillReceiveProps(props) {
    this.fetchData(props);
  }

  fetchData(props) {
    const { planets, match } = props;
    this.planets = planets.fetchAll();
    this.planet = planets.fetchById(match.params.id);
  }

  /**
   * Render related section of the page
   *
   * @param {object} Data needed to render the section
   * @return {React.Component}
   */
  @autobind
  renderRelated({ results }) {

    // Calculate difference of two diameters
    const diff = (a, b) => Math.abs(b.diameter - a.diameter);
    const planet = this.planet.value;

    // Remove current planet, sort similar sizes, limit to 3.
    const items = results
      .filter(p => p.url !== planet.url)
      .sort((a, b) => diff(a, planet) - diff(b, planet))
      .slice(0, 3);

    return (
      <div>
        <h3>Planets with similar diameter</h3>
        <ul>
          {items.map(related => (
            <li key={`related_${related.name}`}>
              <Link to={`/planets/detail/${related.url.match(/(\d+)\/$/)[1]}`}>
                {related.name} ({related.diameter})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  /**
   * Render method
   * @return {React.Component}
   */
  render() {
    return (
      <div>
        <Helmet title="Planet loading..." />
        <Segment>
          {this.planet && this.planet.case({
            pending: () => (<div>Loading planet...</div>),
            rejected: error => (<div>Error fetching planet: {error.message}</div>),
            fulfilled: ({ name, gravity, terrain, climate, population, diameter }) => (
              <div>
                <Helmet title={`Planet ${name}`} />
                <h1>{name}</h1>
                <ul>
                  <li><strong>Gravity:</strong> {gravity}</li>
                  <li><strong>Terrain:</strong> {terrain}</li>
                  <li><strong>Climate:</strong> {climate}</li>
                  <li><strong>Population:</strong> {population}</li>
                  <li><strong>Diameter:</strong> {diameter}</li>
                </ul>
                <Link to="/planets">Go back</Link>
                <hr />
                {this.planets.case({
                  pending: () => (<div>Loading related planets...</div>),
                  rejected: error => (<div>Could fetch related planets: {error.message}</div>),
                  fulfilled: this.renderRelated,
                })}
              </div>
            ),
          })}
        </Segment>
      </div>
    );
  }
}
