import { Component } from 'react';
import PropTypes from 'prop-types';
import { fbPageView, twPageView, gaPageView } from 'utils/analytics';

export default class Analytics extends Component {

  static propTypes = {
    location: PropTypes.object,
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location.pathname !== this.props.location.pathname) {
      this.trackPageView(newProps.location);
    }
  }

  componentDidMount() {
    const { location } = this.props;
    this.trackPageView(location);
  }

  trackPageView(location) {
    gaPageView(location.pathname);
    fbPageView();
    twPageView();
  }

  render() {
    return null;
  }
}
