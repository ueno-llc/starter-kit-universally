/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import autobind from 'core-decorators/lib/autobind';

import s from './GridOverlay.scss';

// Key to store visibility state of the grid overlay
const LOCAL_STORAGE_KEY_HORIZONTAL = '_devtoolsHorizontalGridVisible';
const LOCAL_STORAGE_KEY_VERTICAL = '_devtoolsVerticalGridVisible';

/**
 * Grid Overlay component
 */
@observer
export default class GridOverlay extends Component {

  static propTypes = {
    columns: PropTypes.number,
    noPanel: PropTypes.bool,
  };

  static defaultProps = {
    columns: 12,
    baseline: 16,
    noPanel: true,
  };

  @observable
  isHorizontalVisible = false;

  @observable
  isVerticalVisible = false;

  // Initial state
  state = {
    horizontalIsVisible: false,
    verticalIsVisible: false,
  };

  /**
   * Fired when component is mounted on the client
   * Should setup the grid overlay correctly.
   * @return {void}
   */
  componentDidMount() {
    this.setup();

    document.addEventListener('keydown', this.keydownRef = this.onKeyDown);
  }

  /**
   * Remove the key event.
   * @return {void}
   */
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownRef);
  }

  /**
   * Fired column count is changed on the fly.
   * Re-initialize the component.
   * @param {object} Properties
   * @return {void}
   */
  componentWillReceiveProps(props) {
    this.setup(props);
  }

  /**
   * Let's display the grid with the same shortcut as Sketch.
   * Because why not
   * @return {void}
   */
  @autobind
  onKeyDown(e) {
    if (e.ctrlKey && e.keyCode === 76) {
      this.onToggleVertical();
    }
  }

  /**
   * Fired when the horizontal grid is meant to be toggled.
   * @return {void}
   */
  @autobind
  onToggleHorizontal() {
    this.isHorizontalVisible = !this.isHorizontalVisible;
    localStorage.setItem(LOCAL_STORAGE_KEY_HORIZONTAL, this.isHorizontalVisible);
  }

  /**
   * Fired when the vertical grid is meant to be toggled.
   * @return {void}
   */
  @autobind
  onToggleVertical() {
    this.isVerticalVisible = !this.isVerticalVisible;
    localStorage.setItem(LOCAL_STORAGE_KEY_VERTICAL, this.isVerticalVisible);
  }

  /**
   * Setup will set correct column count and check if it should be visible or not.
   * @param {object} Properties, if other than this.props
   * @return {void}
   */
  setup(props = null) {
    const { columns, baseline } = props || this.props;

    this.isHorizontalVisible = (localStorage.getItem(LOCAL_STORAGE_KEY_HORIZONTAL) === 'true');
    this.isVerticalVisible = (localStorage.getItem(LOCAL_STORAGE_KEY_VERTICAL) === 'true');

    this.grid.style.setProperty('--grid-column-count', columns);
    this.grid.style.setProperty('--grid-baseline', `${baseline}px`);
    this.grid.style.setProperty('--grid-baseline-calc', baseline);
  }

  /**
   * Render the grid and button to toggle
   * @return {Component}
   */
  render() {
    const { columns, noPanel } = this.props;
    const verticalIsVisible = this.isVerticalVisible;
    const horizontalIsVisible = this.isHorizontalVisible;

    return (
      <div
        className={s('grid', { horizontalIsVisible }, { verticalIsVisible })}
        ref={(el) => { this.grid = el; }}
      >
        <div className={s.grid__container}>
          <div className={s.grid__row} data-columns={columns}>
            {Array(columns).fill(0).map((_, i) => (
              <div key={`grid_column_${i}`} className={s.grid__column}>
                <div className={s.grid__visualize} />
              </div>
            ))}
          </div>
        </div>

        {!noPanel ? [
          <button key="v" className={s('grid__button', { verticalIsVisible })} onClick={this.onToggleVertical}>
            <svg className={s.grid__button__svg} width="14px" height="14px" viewBox="0 0 14 14">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <rect x="0" y="0" width="2" height="14" />
                <rect x="4" y="0" width="2" height="14" />
                <rect x="8" y="0" width="2" height="14" />
                <rect x="12" y="0" width="2" height="14" />
              </g>
            </svg>
          </button>,
          <button key="h" className={s('grid__button', { horizontalIsVisible })} onClick={this.onToggleHorizontal}>
            <svg className={s.grid__button__svg} width="14px" height="14px" viewBox="0 0 14 14">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(7.000000, 7.000000) rotate(-270.000000) translate(-7.000000, -7.000000)">
                <rect x="0" y="0" width="2" height="14" />
                <rect x="4" y="0" width="2" height="14" />
                <rect x="8" y="0" width="2" height="14" />
                <rect x="12" y="0" width="2" height="14" />
              </g>
            </svg>
          </button>,
        ] : null}
      </div>
    );
  }
}
