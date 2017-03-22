import proxy from 'http-proxy-middleware';
import config from '../../config';

const prefix = '/webpack';

export default proxy(prefix, {
  target: `http://${config('host')}:${config('clientDevServerPort')}`,
  changeOrigin: true,
  ws: true,
  pathRewrite(path) {
    if (path === '/webpack/__webpack_hmr') return '/__webpack_hmr';
    if (path.indexOf(prefix) === 0) return path.substr(prefix.length);
    return prefix;
  },
});
