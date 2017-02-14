import React, { PropTypes } from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';

// Layout
import AppLayout, { Content } from 'components/app-layout';
import Header from 'components/header';
import Navigation from 'components/navigation';

// Routes
import Home from './routes/home';
import About from './routes/about';
import Planets from './routes/planets';
import PlanetDetails from './routes/planet-details';
import NotFound from './routes/not-found';

export default function App({ children }) {
  return (
    <AppLayout>
      <Header>
        <Navigation>
          <Link to="/">Home</Link>
          <Link to="/planets">Planets</Link>
          <Link to="/about">About</Link>
        </Navigation>
      </Header>
      <Content>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/planets" component={Planets} />
          <Route path="/planets/:id" component={PlanetDetails} />
          <Route component={NotFound} />
        </Switch>
        {children}
      </Content>
    </AppLayout>
  );
}

App.propTypes = {
  children: PropTypes.node,
};
