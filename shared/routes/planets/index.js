import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import PlanetsList from './list';
import PlanetsDetail from './details';

const PlanetsRoutes = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={`${match.url}/detail/:id`} component={PlanetsDetail} />
      <Route exact path={`${match.url}/page/:page`} component={PlanetsList} />
      <Redirect to={`${match.url}/page/1`} />
    </Switch>
  </div>
);

PlanetsRoutes.propTypes = {
  match: PropTypes.object,
};

export default PlanetsRoutes;
