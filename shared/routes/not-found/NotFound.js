import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import Segment from 'components/segment';

export default class NotFound extends Component {

  static propTypes = {
    staticContext: PropTypes.object, // eslint-disable-line
  };

  componentWillMount() {
    const { staticContext } = this.props;
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
