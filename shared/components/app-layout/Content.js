import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import s from './Content.scss';

export default class Content extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;

    return (
      <main className={s.content}>
        {children}
      </main>
    );
  }
}
