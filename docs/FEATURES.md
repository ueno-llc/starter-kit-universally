# Features

This React Starter Kit is packed with great features.

## Global list

  - `react` as the view.
  - `react-router` v4 as the router.
  - `express` server.
  - `jest` as the test framework.
  - `ESlint` with Ueno's configuration. Stop worrying about code style consistency.
  - `SASS` and `CSS modules`.
  - Code splitting.
  - Server Side Rendering.
  - Progressive Web Application ready.
  - Long term browser caching.
  - `Webpack` v3.
  - ES2017+ support.
  - Hot reloading of ALL changes.
  - SEO friendly with `react-helmet`.

## Code splitting

Code splitting is enabled by default. We use `react-universal-component` and other related modules to do both JS and CSS chunks. To code split, all you have to do is wrap a component with `react-universal-component`. An example of this can be found in `shared/routes/grid/index.js`. To disable code splitting you just need to change the file to:

```js
export default from './Grid';
```

## Static site build

You can generate a static site by configuring the appropriate staticSiteGeneration values in `config/values.js`. Then run `yarn build:static` and the static pages will be generated in build/static.

To see the generated site, use `yarn start:static` or copy the `build/static` directory to the web server of your choice. Note that any error pages (e.g. 404.html) will not work without some server intelligence to send requests to the correct file.

More information on the internals of the static site build are in the directory's [README](../internal/scripts/static-site-generation/README.md).

## Hot reloading with state and decorators

By default we're using [`react-jobs`](https://github.com/ctrlplusb/react-jobs) for async stuff with server-side rendering. If we mix that with `mobx` and decorators suddenly hot reloading with state will stop working. This is due to a bug in [`react-hot-loader`](https://github.com/gaearon/react-hot-loader/issues/378) when higher-order components are composed. So instead of doing:

```js
@inject('store')
@withJob({ work: ({ store }) => store.fetch() })
export default class Thing extends PureComponent {}
```
and not have stateful hot reloading, instead do

```js
class Thing extends PureComponent {}

const thingWithJob = withJob({ work: ({ store }) => store.fetch() })(Thing);
export default inject('store')(thingWithJob);
```

If your stateful component `withJob` doesn't contain another component in its sub-tree, you can get away with having a `@withJob` decorator.

## Single route development

If you’re working on a single route and don’t want to build the entire app you can do so by using the `--route` argument, for example:

```bash
yarn dev --route=about
```
`about` being the folder name of the targeted route (inside `shared/routes`). This can be very useful when the app gets bigger and rebuilds and HMR start to get slower.
