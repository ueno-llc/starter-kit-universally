/**
 * This file resolves the webpack stats.
 */

import fs from 'fs';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import config from '../../../config';

let resultCache;

/**
 * Retrieves the webpack stats file.
 *
 */
export default function getClientBundleEntryAssets() {
  // Return the json cache if it exists.
  // In development mode we always read the file from disk to avoid
  // any cases where an older version gets cached.
  if (process.env.BUILD_FLAG_IS_DEV === 'false' && resultCache) {
    return resultCache;
  }

  const webpackStatsFilePath = pathResolve(
    appRootDir.get(),
    config('bundles.client.outputPath'),
    '../stats.json',
  );

  if (!fs.existsSync(webpackStatsFilePath)) {
    throw new Error(
      `We could not find the "${webpackStatsFilePath}" file, which contains a list of the assets of the client bundle.  Please ensure that the client bundle has been built.`,
    );
  }

  const readAssetsJSONFile = () => JSON.parse(fs.readFileSync(webpackStatsFilePath, 'utf8'));
  const assetsJSONCache = readAssetsJSONFile();

  resultCache = assetsJSONCache;
  return resultCache;
}
