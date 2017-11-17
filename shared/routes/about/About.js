import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';

import Segment from 'components/segment';

export default class About extends PureComponent {

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
