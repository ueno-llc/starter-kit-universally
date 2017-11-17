import path from 'path';
import appRootDir from 'app-root-dir';
import config from '../';

export default (webpackConfig, buildOptions) => {
  const { target } = buildOptions;

  if (target === 'server') {
    const moduleName = config('disableSSR') ? 'ssrDisabled' : 'ssrEnabled';
    const modulePath = `server/middleware/reactApplication/${moduleName}`;
    const resolvedPath = path.resolve(appRootDir.get(), modulePath);

    webpackConfig.resolve.alias.reactApplication = resolvedPath;
  }
};
