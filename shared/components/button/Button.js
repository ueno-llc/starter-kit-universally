import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import s from './Button.scss';

/**
 * Button Component
 * feel free to modify to fit the project.
 */
export default class Button extends Component {

  static propTypes = {
    to: PropTypes.string,
    alt: PropTypes.bool,
    flat: PropTypes.bool,
    large: PropTypes.bool,
    small: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
  };

  render() {
    const {
      to,
      alt,
      flat,
      large,
      small,
      children,
      className,
      disabled,
      ...rest
    } = this.props;

    // Some flags
    const isLink = (typeof to !== 'undefined');
    const isExternal = isLink && /^((https?:)?\/\/|[0-9a-zA-Z]+:)/.test(to);

    // Extend className of the rest
    rest.className = s('button', className, {
      alt,
      flat,
      large,
      small,
      disabled,
    });

    rest.disabled = disabled;

    if (isExternal) {
      // http, https, //, mailto, etc.
      return <a href={to} {...rest}>{children}</a>;
    }

    if (isLink) {
      // Everything else
      return <Link to={to} {...rest}>{children}</Link>;
    }

    // Default
    return <button {...rest}>{children}</button>;
  }
}
