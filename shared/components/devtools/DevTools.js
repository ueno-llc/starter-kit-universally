import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import autobind from 'core-decorators/lib/autobind';
import config from 'utils/config';

const showDevTools = process.env.BUILD_FLAG_IS_DEV === 'true' || config('herokuDevtools');
const MobxDevTools = showDevTools && require('mobx-react-devtools').default;
const GridOverlay = showDevTools && require('components/grid-overlay').default;

const LOCAL_STORAGE_KEY_VISIBLE = '_devtoolsVisible';

@observer
class DevTools extends Component {
  @observable display = false;

  componentDidMount() {
    this.display = (localStorage.getItem(LOCAL_STORAGE_KEY_VISIBLE) === 'true');

    document.addEventListener('keydown', this.keydownRef = this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownRef);
  }

  @autobind
  onKeyDown(e) {
    if (e.ctrlKey && e.keyCode === 75) {
      this.onToggleDisplay();
    }
  }

  @autobind
  onToggleDisplay() {
    this.display = !this.display;

    localStorage.setItem(LOCAL_STORAGE_KEY_VISIBLE, this.display);
  }

  render() {
    return (
      <div>
        <MobxDevTools noPanel={!this.display} />
        <GridOverlay noPanel={!this.display} columns={12} baseline={16} />
      </div>
    );
  }
}

export default showDevTools ? DevTools : (() => null);
