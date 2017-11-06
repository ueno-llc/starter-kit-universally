import fs from 'fs';
import path from 'path';
import appRootDir from 'app-root-dir';
import CliVar from '../utils/cliVar';

export default (webpackConfig, buildOptions) => {
  const { mode } = buildOptions;

  // we assume resolve to be an object with an `alias` object we can add to
  const { resolve } = webpackConfig;

  // Hook up possible single route development
  const route = CliVar('route');
  if (mode === 'development' && route) {
    const routePath = path.resolve(appRootDir.get(), `shared/routes/${route}`);

    // we can call sync function here since it's only in development
    const routeIsValid = route && route !== '' && fs.existsSync(routePath);

    if (routeIsValid) {
      const resolvedApp = path.resolve(appRootDir.get(), 'shared/SingleRouteApp');

      resolve.alias.route = routePath;
      resolve.alias.App = resolvedApp;

      console.info(`==> Routing all requests to the "${route}" route`);
    } else {
      console.warn(`Unable to resolve route "${route}" at ${routePath}`);
      resolve.alias.App = path.resolve(appRootDir.get(), 'shared/MainApp');
    }
  } else {
    resolve.alias.App = path.resolve(appRootDir.get(), 'shared/MainApp');
  }

  return webpackConfig;
};
