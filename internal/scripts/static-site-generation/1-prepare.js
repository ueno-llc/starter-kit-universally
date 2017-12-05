import path from 'path';
import appRootDir from 'app-root-dir';
import _ from 'lodash';
import { copy, remove, outputJson } from 'fs-extra';
import colors from 'colors/safe';
import config from '../../../config';

const rootDir = appRootDir.get();
const buildDir = path.join(rootDir, config('buildOutputPath'));

const outputDir = path.join(buildDir, 'static');
const tempOutputDir = path.join(outputDir, 'temp');
const clientOutputDir = path.join(outputDir, 'client');
const publicDir = path.join(rootDir, 'public');

function copyPublicDir() {
  return copy(publicDir, outputDir);
}

function copyClient() {
  return copy(path.join(buildDir, 'client'), clientOutputDir);
}

function generateRouteConfig() {
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

  return outputJson(outputFileName, allRoutes, { spaces: 2 });
}

let failed = false;

remove(outputDir)
  .then(copyPublicDir)
  .then(copyClient)
  .then(generateRouteConfig)
  .catch((err) => {
    console.error(err);
    console.error(colors.red('ERROR while generating static site'));
    failed = true;
  })
  .then(() => {
    process.exit(failed ? -1 : 0);
  });
