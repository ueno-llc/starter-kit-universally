import React from 'react';
import Helmet from 'react-helmet';
import { Switch, Route, Link } from 'react-router-dom';
import config from 'utils/config';

// Layout
import AppLayout, { Content } from 'components/app-layout';
import Header from 'components/header';
import Navigation from 'components/navigation';
import DevTools from 'components/devtools';
import Analytics from 'components/analytics';

// Routes
import Home from './routes/home';
import Grid from './routes/grid';
import About from './routes/about';
import Planets from './routes/planets';
import NotFound from './routes/not-found';

export default function App() {
  return (
    <AppLayout>
      <Helmet {...config('helmet')} />
      <Header>
        <Navigation>
          <Link to="/">Home</Link>
          <Link to="/grid">Grid</Link>
          <Link to="/planets">Planets</Link>
          <Link to="/about">About</Link>
        </Navigation>
      </Header>
      <Content>
        <Route component={Analytics} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/grid" component={Grid} />
          <Route exact path="/about" component={About} />
          <Route path="/planets" component={Planets} />
          <Route component={NotFound} />
        </Switch>
        <DevTools />
      </Content>
    </AppLayout>
  );
}
