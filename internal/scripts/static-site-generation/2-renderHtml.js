/*
    launches the already transpiled node server at build/server/index.js and traverses the
    routes specified in build/static/temp/routes.json, writing them to files.
 */

import colors from 'colors/safe';
import appRootDir from 'app-root-dir';
import { remove, outputFile } from 'fs-extra';
import superagent from 'superagent';
import _ from 'lodash';
import path from 'path';
import routeConfig from '../../../build/static/temp/routes.json'; // eslint-disable-line import/no-unresolved
import config from '../../../config';

// this import actually launches the server as well as providing a reference to it
import server from '../../../build/server';

const rootDir = appRootDir.get();
const outputDir = path.join(rootDir, config('buildOutputPath'), 'static');
const tempDir = path.join(outputDir, 'temp');

function renderRouteToHtmlFile({ source, destination, ignoreGetError }) {
  return superagent
    .get(`http://localhost:3000/${source}`)
    // if we're generating an expected error route (e.g. the 404 page)
    // we should ignore the error and use the response on the error
    .catch((err) => {
      if (ignoreGetError && err.response) {
        return err.response;
      }
      throw err;
    })
    .then((res) => {
      outputFile(path.join(outputDir, destination), res.text);
    });
}

async function generateHtmlFiles() {
  const promises = _.map(routeConfig, renderRouteToHtmlFile);

  try {
    await Promise.all(promises);
    console.log(colors.green(`SUCCESS: static site generated in ${outputDir}`));
  } catch (err) {
    console.error(err);
    console.error(colors.red('ERROR while generating static site'));
    throw err;
  }

  try {
    await server.close();
  } catch (err) {
    console.log(err);
    console.log(colors.yellow('Server failed to shut down after html generation... ignoring.'));
  }
}

console.log('Waiting for server to start');
server.on('listening', () => {
  let exitCode = 0;

  console.log('Server is running, will call html routes to generate files');
  generateHtmlFiles()
    .then(() => {
      console.log('removing temp dir');
      return remove(tempDir);
    })
    .catch(() => { exitCode = -1; })
    .then(() => {
      process.exit(exitCode);
    });
});
