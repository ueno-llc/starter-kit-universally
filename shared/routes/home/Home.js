import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import config from 'utils/config';

import Segment from 'components/segment';
import Button from 'components/button';

export default class Home extends PureComponent {

  render() {
    return (
      <div>
        <Helmet title="Home" />

        <Segment>
          <h1>Features</h1>
          <p>Some of the most interesting features of our starter kit</p>

          <ul>
            <li>React, react-router, server-side rendering</li>
            <li>MobX for state management</li>
            <li>SCSS and CSS modules</li>
            <li>Webpack 3+</li>
            <li>DevTools (ctrl + l in dev env)</li>
            <li>GsapTools (See demo <a href="https://ueno-llc.github.io/gsap-tools">here</a>)</li>
            <li>Env. variable exposes on client side: <em>{config('welcomeMessage')}</em></li>
          </ul>
        </Segment>

        <Segment>
          <Button>Button</Button>
          <Button to="http://ueno.co">Ueno.co</Button>
          <Button to="/about">About</Button>
        </Segment>
      </div>
    );
  }
}
