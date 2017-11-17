import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';

import GridHelper from './components/grid';

export default class Grid extends PureComponent {

  render() {
    return (
      <div>
        <Helmet title="Grid" />

        <GridHelper />
      </div>
    );
  }
}
