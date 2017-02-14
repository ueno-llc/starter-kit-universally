import React, { Component, PropTypes } from 'react';
import autobind from 'core-decorators/lib/autobind';
import s from './GridOverlay.scss';

// Key to store visibility state of the grid overlay
const LOCAL_STORAGE_KEY = '_devtoolsGridVisible';

/**
 * Grid Overlay component
 */
export default class GridOverlay extends Component {

  static propTypes = {
    columns: PropTypes.number,
  };

  static defaultProps = {
    columns: 12,
  };

  // Initial state
  state = {
    isVisible: false,
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
   * Fired when the grid is meant to be toggled.
   * @return {void}
   */
  @autobind
  onToggle() {
    const isVisible = !this.state.isVisible;
    localStorage.setItem(LOCAL_STORAGE_KEY, isVisible);
    this.setState({ isVisible });
  }

  /**
   * Setup will set correct column count and check if it should be visible or not.
   * @param {object} Properties, if other than this.props
   * @return {void}
   */
  setup(props = null) {
    const { columns } = props || this.props;
    const isVisible = (localStorage.getItem(LOCAL_STORAGE_KEY) === 'true');
    this.setState({ isVisible });
    this.grid.style.setProperty('--grid-column-count', columns);
  }

  /**
   * Render the grid and button to toggle
   * @return {Component}
   */
  render() {
    const { columns } = this.props;
    const { isVisible } = this.state;

    return (
      <div className={s('grid', { isVisible })} ref={el => (this.grid = el)}>
        <div className={s.grid__container}>
          <div className={s.grid__row} data-columns={columns}>
            {Array(columns).fill(0).map((_, i) => (
              <div key={`grid_column_${i}`} className={s.grid__column}>
                <div className={s.grid__visualize} />
              </div>
            ))}
          </div>
        </div>

        <button className={s('grid__button', { isVisible })} onClick={this.onToggle}>
          Grid
        </button>
      </div>
    );
  }
}
