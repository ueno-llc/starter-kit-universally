import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';
import _ from 'lodash';
import { copy, remove, outputJson } from 'fs-extra';
import colors from 'colors/safe';
import config from '../../../config';
import configFactory from '../../webpack/configFactory';


const rootDir = appRootDir.get();

const reactAppPath = path.join(rootDir, 'shared/MainApp.js');
const outputDir = path.join(rootDir, config('buildOutputPath'), 'static');
const tempOutputDir = path.join(outputDir, 'temp');
const clientOutputDir = path.join(outputDir, 'client');
const publicDir = path.join(rootDir, 'public');

function copyPublicDir() {
  return copy(publicDir, outputDir);
}

function runWebpackCompiler(webpackConfig) {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        console.error(err);
        reject(err);
      } else if (stats.hasErrors()) {
        console.log(stats.toString({ colors: true }));
        reject();
      } else {
        console.log(stats.toString({ colors: true }));
        // Save the build stats to a file so it can be used for serving css chunks
        if (webpackConfig.target === 'web') {
          fs.writeFileSync('build/stats.json', JSON.stringify(stats.toJson()));
        }
        resolve();
      }
    });
  });
}

// generate node bundles to a temporary directory. One is the server which we'll launch in the the
// next script to generate html files. The other transpiles just the react app without css so we can
// determine the route configuration.
function compileServer() {
  const webpackConfig = configFactory({ target: 'server', optimize: true });
  webpackConfig.entry.App = reactAppPath;
  webpackConfig.output.path = tempOutputDir;
  return runWebpackCompiler(webpackConfig);
}

// now compile the client bundles. They're exactly what the static site will serve,
// so we put them right into the destination directory.
function compileClient() {
  const webpackConfig = configFactory({ target: 'client', optimize: true });
  webpackConfig.output.path = clientOutputDir;
  return runWebpackCompiler(webpackConfig);
}

async function generateRouteConfig() {
  const { allIndex, routes } = config('staticSiteGeneration');
  const { basePaths, ignoredPaths, customRoutes } = routes;

  const basePathsToUse = _.filter(basePaths, basePath => !_.includes(ignoredPaths, basePath));
  const baseConfigs = _.map(basePathsToUse, (routePath) => {
    let destination;
    if (routePath === '') {
      destination = 'index.html';
    } else {
      destination = allIndex ? `${routePath}/index.html` : `${routePath}.html`;
    }
    return { source: routePath, destination };
  });
  const allRoutes = _.concat(baseConfigs, customRoutes);
  const outputFileName = path.join(tempOutputDir, 'routes.json');
  await outputJson(outputFileName, allRoutes, { spaces: 2 });
}

let failed = false;
remove(outputDir)
  .then(copyPublicDir)
  .then(compileServer)
  .then(compileClient)
  .then(generateRouteConfig)
  .then(() => {
    console.log(colors.green(`SUCCESS: static site generated in ${outputDir}`));
  })
  .catch((err) => {
    console.error(err);
    console.error(colors.red('ERROR while generating static site'));
    failed = true;
  })
  .then(() => {
    const exitCode = failed ? -1 : 0;
    process.exit(exitCode);
  });
