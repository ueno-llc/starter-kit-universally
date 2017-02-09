import React, { Component } from 'react';
import Segment from 'components/segment';
import Helmet from 'react-helmet';

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
