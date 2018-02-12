/**
 * This is a proxy loader that copies the settings from `file-loader` in the webpack config.
 * This loader should be used when you need to bypass the `svg-to-jsx-loader`.
 */

import loaderUtils from 'loader-utils';

export default () => null;

export function pitch(request) {
  this.cacheable();

  const fileLoader = this.options.module.rules[0].oneOf.find(l => l.loader === 'file-loader');
  const requestString = loaderUtils.stringifyRequest(this, `!file-loader?${JSON.stringify(fileLoader.query)}!${request}`);

  return `module.exports = require(${requestString});`;
}
