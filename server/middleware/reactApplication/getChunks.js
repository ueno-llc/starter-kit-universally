import flushChunks from 'webpack-flush-chunks';
import getClientWebpackStats from './getClientWebpackStats';

const webpackStats = getClientWebpackStats();
const cache = {};

export default (chunkNames) => {
  const key = JSON.stringify(chunkNames);

  if (process.env.BUILD_FLAG_IS_DEV === 'false' && cache[key]) {
    return cache[key];
  }

  const {
    cssHashRaw,
    scripts,
    stylesheets,
    publicPath,
  } = flushChunks(webpackStats, { chunkNames, after: ['index'] });

  cache[key] = {
    cssHashRaw,
    scripts: scripts.map(s => `${publicPath}/${s}`),
    stylesheets: stylesheets.map(s => `${publicPath}/${s}`),
  };

  return cache[key];
};
