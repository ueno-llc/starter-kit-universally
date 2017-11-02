import fs from 'fs';
import _isArray from 'lodash/isArray';
import appRootDir from 'app-root-dir';
import path from 'path';
import webpack from 'webpack';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin'; // here so you can see what chunks are built
import config from '../';
import { removeNil } from '../../internal/utils/arrays';
import { ifElse } from '../../internal/utils/logic';
import { happyPackPlugin } from '../../internal/utils';


function externals() {

  // UENO: Define externals
  // We don't want our node_modules to be bundled with any bundle that is
  // targetting the node environment, prefering them to be resolved via
  // native node module system.

  // Some of our node_modules may contain files that depend on our
  // webpack loaders, e.g. CSS or SASS.
  // For these cases please make sure that the file extensions are
  // registered within the following configuration setting.
  const whitelist = [
    /\.bin/,
    'source-map-support/register',
    'react-universal-component',
    'webpack-flush-chunks',
  ]
    // And any items that have been whitelisted in the config need
    // to be included in the bundling process too.
    .concat(config('nodeExternalsFileTypeWhitelist') || []);

  return fs
    .readdirSync(path.resolve(appRootDir.get(), 'node_modules'))
    .filter(x => !whitelist.some((w) => {
      if (w instanceof RegExp) {
        return w.test(x);
      }
      return x === w;
    }))
    .reduce((ext, mod) => {
      // mark this module as external
      // https://webpack.js.org/configuration/externals
      ext[mod] = `commonjs ${mod}`;
      return ext;
    }, {});
}

export default (webpackConfig, buildOptions) => {
  const { target, optimize = false, localIdentName } = buildOptions;

  const isProd = optimize;
  const isDev = !isProd;
  const isClient = target === 'client';
  const isNode = !isClient;

  const ifNode = ifElse(isNode);
  const ifClient = ifElse(isClient);
  const ifDevClient = ifElse(isDev && isClient);

  // Overwrite the externals because apparently `webpack-node-externals` does not
  // work well with `webpack-flush-chunks`
  if (isNode) {
    webpackConfig.externals = externals();
  }

  // Remove ExtractTextPlugin
  const etpIndex = webpackConfig.plugins.findIndex(p => p instanceof ExtractTextPlugin);
  if (etpIndex > -1) {
    webpackConfig.plugins.splice(etpIndex, 1);
  }
  // Add some plugins for css code splitting
  webpackConfig.plugins.push(
    ...removeNil([
      ifDevClient(new WriteFilePlugin()),
      ifClient(new ExtractCssChunks()),
      ifClient(
        new webpack.optimize.CommonsChunkPlugin({
          names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
          filename: isDev ? '[name].js' : '[name]-[chunkhash].js',
          minChunks: Infinity,
        }),
      ),
      ifNode(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      ),
    ],
  ));

  // Overwrite happypack css dev plugin. Adds css chunks to the dev build.
  const happyPackDevclientCssIndex = webpackConfig.plugins.findIndex(r => r.id === 'happypack-devclient-css');
  if (happyPackDevclientCssIndex > 1) {
    webpackConfig.plugins.splice(
      happyPackDevclientCssIndex,
      1,
      happyPackPlugin({
        name: 'happypack-devclient-css',
        loaders: [
          'classnames-loader',
          ...ExtractCssChunks.extract({
            fallback: 'style-loader',
            use: [
              `css-loader?sourceMap=1&modules=1&importLoaders=1&localIdentName=${localIdentName}`,
              'postcss-loader?sourceMap=1',
              'sass-loader?sourceMap=1&outputStyle=expanded',
            ],
          }),
        ],
      }),
    );
  }

  // Overwrite css loader ExtractTextPlugin
  const cssRule = webpackConfig.module.rules.find(r => r.test.test('.css'));
  if (cssRule && _isArray(cssRule.use)) {
    // Find plugin
    const pluginIndex = cssRule.use.findIndex(u =>
      Object.prototype.hasOwnProperty.call(u, 'loader') && /extract-text-webpack-plugin/.test(u.loader));
    if (pluginIndex > -1) {
      const loaders = ExtractCssChunks.extract({
        fallback: 'style-loader',
        use: [
          `css-loader?modules=1&importLoaders=1&localIdentName=${localIdentName}`,
          'postcss-loader',
          'sass-loader?outputStyle=expanded',
        ],
      });
      cssRule.use.splice(
        pluginIndex,
        loaders.length,
        ...loaders,
      );
    }
  }

  // Overwrite node_modules css loader ExtractTextPlugin
  const nmCssRule = webpackConfig.module.rules.find(r => r.test.test('node_modules.css'));
  if (nmCssRule && _isArray(nmCssRule.use)) {
    // Find plugin
    const pluginIndex = cssRule.use.findIndex(u =>
      Object.prototype.hasOwnProperty.call(u, 'loader') && /extract-text-webpack-plugin/.test(u.loader));

    if (pluginIndex > -1) {
      const loaders = ExtractCssChunks.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader'],
      });
      cssRule.use.splice(
        pluginIndex,
        loaders.length,
        ...loaders,
      );
    }
  }

  return webpackConfig;
};
