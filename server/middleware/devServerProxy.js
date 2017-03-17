import config from '../../config';

export default (prefix = '/webpack') => {
  const proxy = require('http-proxy-middleware');
  return proxy(prefix, {
    target: `http://${config('host')}:${config('clientDevServerPort')}`,
    changeOrigin: true,
    ws: true,
    pathRewrite: (path) => {
      if (path === '/webpack/__webpack_hmr') return '/__webpack_hmr';
      return path.replace(/^\/webpack/, '');
    },
  });
};
