import React, { Component } from 'react';
import Helmet from 'react-helmet';

import Segment from 'components/segment';

export default class About extends Component {
  render() {
    return (
      <div>
        <Helmet title="About" />
        <Segment>
          <h1>About</h1>
        </Segment>
      </div>
    );
  }
}
