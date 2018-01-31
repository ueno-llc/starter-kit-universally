import fs from 'fs';
import _isArray from 'lodash/isArray';
import _get from 'lodash/get';
import appRootDir from 'app-root-dir';
import path from 'path';
import webpack from 'webpack';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ChunkManifestWebpackPlugin from 'chunk-manifest-webpack-plugin';
import NameAllModulesPlugin from 'name-all-modules-plugin';

import config from '../';
import { removeNil } from '../../internal/utils/arrays';
import { ifElse } from '../../internal/utils/logic';

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
  const ifProdClient = ifElse(isProd && isClient);

  // Overwrite the externals because apparently `webpack-node-externals` does not
  // work well with `webpack-flush-chunks`
  if (isNode) {
    webpackConfig.externals = [externals()];
  }

  // Remove ExtractTextPlugin
  const etpIndex = webpackConfig.plugins.findIndex(p => p instanceof ExtractTextPlugin);

  if (etpIndex > -1) {
    webpackConfig.plugins.splice(etpIndex, 1);
  }

  // Add some plugins for css code splitting
  webpackConfig.plugins.push(
    ...removeNil([

      // NamedModulesPlugin, NamedChunksPlugin and NameAllModulesPlugin (see below) are all here to
      // deal with chunk hashes.
      // See https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
      ifClient(new webpack.NamedModulesPlugin()),

      ifClient(
        new webpack.NamedChunksPlugin((chunk) => {
          if (chunk.name) {
            return chunk.name;
          }
          return chunk.mapModules(m => path.relative(m.context, m.request)).join('_');
        }),
      ),

      ifClient(new ExtractCssChunks({
        filename: isDev ? '[name].js' : '[name]-[contenthash].css',
      })),

      ifProdClient(new ChunkManifestWebpackPlugin({
        filename: '../manifest.json',
        manifestVariable: '__WEBPACK_MANIFEST__',
      })),

      // To make sure chunk hashes stay the same if their contents don’t change
      // see: https://webpack.js.org/guides/caching/#module-identifiers
      ifClient(new webpack.HashedModuleIdsPlugin()),

      // Add vendor code chunk
      ifProdClient(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          filename: '[name]-[chunkhash].js',
          // Put all node_modules into one chunk
          // see: https://webpack.js.org/plugins/commons-chunk-plugin/#passing-the-minchunks-property-a-function
          minChunks: module => module.context && module.context.includes('node_modules'),
        }),
      ),

      // Add webpack boilerplate chunk
      ifClient(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'bootstrap', // needed to put webpack bootstrap code before chunks
          filename: isDev ? '[name].js' : '[name]-[chunkhash].js',
        }),
      ),

      ifClient(new NameAllModulesPlugin()),

      // We only want one server chunk
      ifNode(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      ),
    ]),
  );

  const { rules } = webpackConfig.module;
  const moduleRules = [..._get(rules, '0.oneOf', rules)];

  // Overwrite css loader ExtractTextPlugin
  const cssRule = moduleRules.find(r => r.test.test('.css'));

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
  const nmCssRule = moduleRules.find(r =>
    r.test.test('node_modules.css') &&
    (!r.exclude || !r.exclude.test('node_modules.css')));

  if (nmCssRule && _isArray(nmCssRule.use)) {
    // Find plugin
    const pluginIndex = nmCssRule.use.findIndex(u =>
      Object.prototype.hasOwnProperty.call(u, 'loader') && /extract-text-webpack-plugin/.test(u.loader));

    if (pluginIndex > -1) {
      const loaders = ExtractCssChunks.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'postcss-loader'],
      });

      nmCssRule.use.splice(
        pluginIndex,
        loaders.length,
        ...loaders,
      );
    }
  }

  return webpackConfig;
};
