import { removeSync, copySync, writeFileSync } from 'fs-extra';
import superagent from 'superagent';
import _ from 'lodash';

// this import actually launches the server as well as providing a reference to it
import server from '../../build/server';
import { getStaticRoutesToGenerate } from '../../shared/routes/routeSummary';

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
      writeFileSync(`${destinationDir}/${routeConfig.destination}`, res.text);
    });
}

server.on('listening', () => {
  console.log('Server is running, start to call html routes');
  const promises = _.map(getStaticRoutesToGenerate(), renderRoute);
  Promise.all(promises).finally(() => {
    server.close();
    console.log(`static site generated in ${destinationDir}`);
  });
});
