import React, { Component } from 'react';
import PropTypes from 'prop-types';

import s from './Navigation.scss';

export default class Navigation extends Component {

  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <nav className={s.navigation}>
        <ul className={s.navigation__list}>
          {React.Children.map(this.props.children, component => (
            <li className={s.navigation__item}>
              {React.cloneElement(component, {
                className: s.navigation__link,
              })}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
