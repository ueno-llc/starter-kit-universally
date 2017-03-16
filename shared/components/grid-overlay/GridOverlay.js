/* eslint-disable react/no-array-index-key */
import React, { Component, PropTypes } from 'react';
import autobind from 'core-decorators/lib/autobind';
import s from './GridOverlay.scss';

// Key to store visibility state of the grid overlay
const LOCAL_STORAGE_KEY_HORIZONTAL = '_devtoolsHorizontalGridVisible';
const LOCAL_STORAGE_KEY_VERTICAL = '_devtoolsVerticalGridVisible';

/**
 * Grid Overlay component
 */
export default class GridOverlay extends Component {

  static propTypes = {
    columns: PropTypes.number,
  };

  static defaultProps = {
    columns: 12,
    baseline: 16,
  };

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
   * Fired when the horizontal grid is meant to be toggled.
   * @return {void}
   */
  @autobind
  onToggleHorizontal() {
    const isVisible = !this.state.horizontalIsVisible;
    localStorage.setItem(LOCAL_STORAGE_KEY_HORIZONTAL, isVisible);
    this.setState({ horizontalIsVisible: isVisible });
  }

  /**
   * Fired when the vertical grid is meant to be toggled.
   * @return {void}
   */
  @autobind
  onToggleVertical() {
    const isVisible = !this.state.verticalIsVisible;
    localStorage.setItem(LOCAL_STORAGE_KEY_VERTICAL, isVisible);
    this.setState({ verticalIsVisible: isVisible });
  }

  /**
   * Setup will set correct column count and check if it should be visible or not.
   * @param {object} Properties, if other than this.props
   * @return {void}
   */
  setup(props = null) {
    const { columns, baseline } = props || this.props;

    const horizontalIsVisible = (localStorage.getItem(LOCAL_STORAGE_KEY_HORIZONTAL) === 'true');
    const verticalIsVisible = (localStorage.getItem(LOCAL_STORAGE_KEY_VERTICAL) === 'true');

    this.setState({
      horizontalIsVisible,
      verticalIsVisible,
    });

    this.grid.style.setProperty('--grid-column-count', columns);
    this.grid.style.setProperty('--grid-baseline', `${baseline}px`);
    this.grid.style.setProperty('--grid-baseline-calc', baseline);
  }

  /**
   * Render the grid and button to toggle
   * @return {Component}
   */
  render() {
    const { columns } = this.props;
    const { horizontalIsVisible, verticalIsVisible } = this.state;

    return (
      <div
        className={s('grid', { horizontalIsVisible }, { verticalIsVisible })}
        ref={el => (this.grid = el)}
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

        <button className={s('grid__button', { verticalIsVisible })} onClick={this.onToggleVertical}>
          Grid vertical
        </button>

        <button className={s('grid__button', { horizontalIsVisible })} onClick={this.onToggleHorizontal}>
          Grid horizontal
        </button>
      </div>
    );
  }
}
