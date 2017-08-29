import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Container from 'components/container';

import s from './Segment.scss';

/**
 * Segment component
 */
export default class Segment extends Component {

  static propTypes = {
    container: PropTypes.bool,
    children: PropTypes.node,
  };

  static defaultProps = {
    container: true,
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {
    const {
      children,
      container,
    } = this.props;

    const content = container ? (<Container>{children}</Container>) : children;

    return (
      <section className={s.segment}>
        {content}
      </section>
    );
  }
}
