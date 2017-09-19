import colors from 'colors/safe';
import { removeSync, copySync, outputFileSync } from 'fs-extra';
import superagent from 'superagent';
import _ from 'lodash';
import path from 'path';

// this import actually launches the server as well as providing a reference to it
import server from '../../build/server';
import config from '../../config';

function getStaticRoutesToGenerate() {
  const { baseRoutes, ignoredBaseRoutes, extraRoutes } = config('staticSiteGeneration');
  const filteredBaseRoutes =
    _.filter(baseRoutes, route => !_.includes(ignoredBaseRoutes, route.source));
  return _.concat(filteredBaseRoutes, extraRoutes);
}

const destinationDir = './build/static/';
const builtClientBundles = './build/client/';
const clientAssets = './public/';

removeSync(destinationDir);
copySync(clientAssets, destinationDir);
copySync(builtClientBundles, `${destinationDir}/client`);


function renderRoute(routeConfig) {
  return superagent
    .get(`http://localhost:3000/${routeConfig.source}`)
    // if we're generating an expected error route (e.g. the 404 page)
    // we should ignore the error and use the response on the error
    .catch((err) => {
      if (routeConfig.ignoreGetError && err.response) {
        return err.response;
      }
      throw err;
    })
    .then((res) => {
      outputFileSync(path.join(destinationDir, routeConfig.destination), res.text);
    });
}

server.on('listening', () => {
  let failed = false;
  console.log('Server is running, start to call html routes');
  const promises = _.map(getStaticRoutesToGenerate(), renderRoute);
  Promise.all(promises)
    .then(() => {
      console.log(colors.green(`SUCCESS: static site generated in ${destinationDir}`));
    })
    .catch((err) => {
      console.error(err);
      console.error(colors.red('ERROR while generating static site'));
      failed = true;
    })
    .then(() => server.close())
    .then(() => {
      const exitCode = failed ? -1 : 0;
      process.exit(exitCode);
    });
});
