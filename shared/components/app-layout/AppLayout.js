import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'styles/fonts.css';

import s from './AppLayout.scss';

export default class AppLayout extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <div className={s.layout}>
        {this.props.children}
      </div>
    );
  }
}
