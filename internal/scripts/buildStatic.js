import { removeSync, copySync, writeFileSync } from 'fs-extra';
import superagent from 'superagent';
import _ from 'lodash';
import server from '../../build/server';

const destinationDir = './build/static/';
const builtClientBundles = './build/client/';

const routes = ['', 'grid', 'planets', 'about'];

removeSync(destinationDir);
copySync(builtClientBundles, `${destinationDir}/client`);


function renderRoute(routeName) {
  const fileName = routeName.length > 0 ? `${routeName}.html` : 'index.html';
  return superagent
    .get(`http://localhost:3000/${routeName}`)
    .then((res) => {
      writeFileSync(`${destinationDir}/${fileName}`, res.text);
    });
}

server.on('listening', () => {
  console.log('Server is running, start to call html routes')
  const promises = _.map(routes, renderRoute);
  Promise.all(promises).then(() => {
    server.close();
    console.log(`static site generated in ${destinationDir}`);
  });
});
