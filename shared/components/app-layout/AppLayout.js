import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from './AppLayout.scss';
import 'styles/fonts.css';

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
