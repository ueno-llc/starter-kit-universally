import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { withJob } from 'react-jobs';
import { Link } from 'react-router-dom';

@inject('planets')
@withJob({
  work: ({ planets }) => planets.fetchAll(),
})
export default class RelatedPlanets extends Component {

  static propTypes = {
    jobResult: PropTypes.shape({
      results: PropTypes.array,
      count: PropTypes.number,
      previous: PropTypes.string,
      next: PropTypes.string,
    }),
    planet: PropTypes.object,
  };

  render() {
    const { jobResult, planet } = this.props;

    // Calculate difference of two diameters
    const diff = (a, b) => Math.abs(b.diameter - a.diameter);

    // Remove current planet, sort similar sizes, limit to 3.
    const items = jobResult.results
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
}
