import React from 'react';
import Helmet from 'react-helmet';
import { Switch, Route, Link } from 'react-router-dom';
import config from 'utils/config';

// Layout
import AppLayout, { Content } from 'components/app-layout';
import Header from 'components/header';
import Navigation from 'components/navigation';
import DevTools from 'components/devtools';

// Routes
import SingleRoute from 'route';

export default function App() {
  return (
    <AppLayout>
      <Helmet {...config('helmet')} />
      <Header>
        <Navigation>
          <Link to="/">Home</Link>
          <Link to="/planets">Planets</Link>
          <Link to="/about">About</Link>
        </Navigation>
      </Header>
      <Content>
        <Switch>
          <Route component={SingleRoute} />
        </Switch>
        <DevTools />
      </Content>
    </AppLayout>
  );
}
