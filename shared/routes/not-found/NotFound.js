import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Segment from 'components/segment';

export default class NotFound extends Component {

  static contextTypes = {
    router: PropTypes.shape({
      staticContext: PropTypes.object,
    }).isRequired,
  };

  componentWillMount() {
    const { staticContext } = this.context.router;
    if (staticContext) {
      staticContext.missed = true;
    }
  }

  render() {
    return (
      <div>
        <Helmet title="404 Not Found" />
        <Segment>
          <h1>Page was not found</h1>
        </Segment>
      </div>
    );
  }
}
