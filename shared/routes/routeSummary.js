// This file is used at build-time when generating the static site. It is not referenced by the
// client or server. In the future, we will use the react routes code to generate the base routes by
// inspecting the react router and auto generating the array for all non-dynamic routes.

import _ from 'lodash';

const baseRoutes = [{
  source: '',
  destination: 'index.html',
}, {
  source: 'grid',
  destination: 'grid.html',
}, {
  source: 'planets',
  destination: 'planets.html',
}, {
  source: 'about',
  destination: 'about.html',
}];

// when the base routes are generated at build time, this array of strings will give the source
// for any of the base routes that should not be used to produce a static page;
const baseRoutesToIgnore = [];

// these are routes that won't be generated at build time but should still generated
const extraRoutes = [{
  source: 'this-is-an-invalid-url-to-generate-a-404-page',
  destination: '404.html',
  ignoreGetError: true,
}];

export function getRouteSummary() {
  return { baseRoutes, baseRoutesToIgnore, extraRoutes };
}

export function getStaticRoutesToGenerate() {
  const filteredBaseRoutes =
    _.filter(baseRoutes, route => !_.includes(baseRoutesToIgnore, route.source));
  return _.concat(filteredBaseRoutes, extraRoutes);
}
