import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Segment from '../../components/segment';

export default class NotFound extends Component {
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
