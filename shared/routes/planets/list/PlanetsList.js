import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { computed } from 'mobx';
import { withJob } from 'react-jobs';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { autobind } from 'core-decorators';

import Segment from 'components/segment';
import Button from 'components/button';

const LoadingComponent = () => (
  <Segment>
    <div>Loading list of planets....</div>
  </Segment>
);

@inject('planets')
@withJob({
  work: ({ match, planets }) => planets.fetchAll({ page: Number(match.params.page || 1) }),
  shouldWorkAgain: (prev, next) => prev.match.params.page !== next.match.params.page,
  LoadingComponent,
})
export default class Planets extends Component {

  static propTypes = {
    jobResult: PropTypes.shape({
      results: PropTypes.array,
      count: PropTypes.number,
      previous: PropTypes.string,
      next: PropTypes.string,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
    match: PropTypes.shape({
      params: PropTypes.shape({
        page: PropTypes.string,
      }),
    }),
  };

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

    // this.context.history.push()
    const { match, history } = this.props;
    history.push(match.path.replace(':page', page));
  }

  /**
   * @var {observableObject} Current page
   */
  @computed
  get page() {
    return Number(this.props.match.params.page || 1);
  }

  /**
   * @var {Number} Calculate every time the current page changes.
   */
  @computed
  get from() {
    return (this.page * 10) - 9;
  }

  /**
   * @var {Number} Calculate every time the current page changes.
   */
  @computed
  get to() {
    return Math.min(this.page * 10, this.props.jobResult.count);
  }

  /**
   * Render method
   * @return {React.Component}
   */
  render() {
    const { results, count, previous, next } = this.props.jobResult;
    return (
      <div>
        <Helmet title="Planets" />

        <Segment>
          <div>
            <p>Showing {this.from}-{this.to} of {count} planets available.</p>

            <ul>
              {results.map(({ name, url }) => (
                <li key={`planet_${name}`}>
                  <Link to={`/planets/detail/${url.match(/(\d+)\/$/)[1]}`}>{name}</Link>
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
        </Segment>
      </div>
    );
  }
}
