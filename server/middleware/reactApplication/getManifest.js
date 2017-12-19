/**
 * This file resolves the manifest file
 */

import fs from 'fs';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import config from 'utils/config';

let resultCache;

/**
 * Retrieves the manifest file.
 *
 */
export default function getManifest() {
  // No manifest on dev
  if (process.env.BUILD_FLAG_IS_DEV === 'true') {
    return null;
  }
  // Return the json cache if it exists.
  if (resultCache) {
    return resultCache;
  }

  const manifestFilePath = pathResolve(
    appRootDir.get(),
    config('bundles.client.outputPath'),
    '../manifest.json',
  );

  if (!fs.existsSync(manifestFilePath)) {
    console.warn('We could not find the webpack manifest file.');
    return null;
  }

  const readAssetsJSONFile = () => JSON.parse(fs.readFileSync(manifestFilePath, 'utf8'));
  const assetsJSONCache = readAssetsJSONFile();

  resultCache = assetsJSONCache;

  return resultCache;
}
