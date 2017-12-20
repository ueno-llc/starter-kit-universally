import flushChunks from 'webpack-flush-chunks';
import getClientWebpackStats from './getClientWebpackStats';

const webpackStats = getClientWebpackStats();

export default (chunkNames) => {
  const {
    cssHashRaw,
    scripts,
    stylesheets,
    publicPath,
  } = flushChunks(webpackStats, { chunkNames });

  return {
    cssHashRaw,
    scripts: scripts.map(s => `${publicPath}/${s}`),
    stylesheets: stylesheets.map(s => `${publicPath}/${s}`),
  };
};
