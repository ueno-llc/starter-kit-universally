import React, { Component, Fragment } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import config from 'utils/config';
import MobxDevTools from 'mobx-react-devtools';

import GridOverlay from 'components/grid-overlay';

import GsapToolsContainer from './GsapToolsContainer';

const showDevTools = process.env.BUILD_FLAG_IS_DEV === 'true' || config('herokuDevtools');
const LOCAL_STORAGE_KEY_VISIBLE = '_devtoolsVisible';

@observer
class DevTools extends Component {

  @observable
  display = false;

  componentDidMount() {
    this.display = (localStorage.getItem(LOCAL_STORAGE_KEY_VISIBLE) === 'true');

    document.addEventListener('keydown', this.keydownRef = this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownRef);
  }

  onKeyDown = (e) => {
    if (e.ctrlKey && e.keyCode === 75) {
      this.onToggleDisplay();
    }
  }

  onToggleDisplay = () => {
    this.display = !this.display;

    localStorage.setItem(LOCAL_STORAGE_KEY_VISIBLE, this.display);
  }

  render() {
    return (
      <Fragment>
        <MobxDevTools noPanel={!this.display} />
        <GridOverlay noPanel={!this.display} columns={12} baseline={16} />
        <GsapToolsContainer noPanel={!this.display} />
      </Fragment>
    );
  }
}

export default showDevTools ? DevTools : (() => null);
