/**
 * Helper for resolving environment specific configuration files.
 *
 * It resolves .env files that are supported by the `dotenv` library.
 *
 * Please read the application configuration docs for more info.
 */

import appRootDir from 'app-root-dir';
import colors from 'colors/safe';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import ifElse from '../../internal/utils/logic/ifElse';
import removeNil from '../../internal/utils/arrays/removeNil';
import env from './processEnv';

// PRIVATES

function registerEnvFile() {
  const NODE_ENV = env.NODE_ENV;
  const envFile = '.env';

  // This is the order in which we will try to resolve an environment configuration
  // file.
  const envFileResolutionOrder = removeNil([
    // Is there an environment config file at the app root for our target
    // environment name?
    // e.g. /projects/react-universally/.env.staging
    ifElse(NODE_ENV)(path.resolve(appRootDir.get(), `${envFile}.${NODE_ENV}`)),
    // Is there an environment config file at the app root?
    // e.g. /projects/react-universally/.env
    path.resolve(appRootDir.get(), envFile),
  ]);

  // Find the first env file path match.
  const envFilePath = envFileResolutionOrder.find(filePath => fs.existsSync(filePath));

  // If we found an env file match the register it.
  if (envFilePath) {
    console.log( // eslint-disable-line no-console
      colors.bgBlue.white(`==> Registering environment variables from: ${envFilePath}`),
    );
    dotenv.config({ path: envFilePath });
  }
}

// Ensure that we first register any environment variables from an existing
// env file.
registerEnvFile();

// EXPORTED HELPERS

/**
 * Gets a string environment variable by the given name.
 *
 * @param  {String} name - The name of the environment variable.
 * @param  {String} defaultVal - The default value to use.
 *
 * @return {String} The value.
 */
export function string(name, defaultVal) {
  return env[name] || defaultVal;
}

/**
 * Gets a number environment variable by the given name.
 *
 * @param  {String} name - The name of the environment variable.
 * @param  {number} defaultVal - The default value to use.
 *
 * @return {number} The value.
 */
export function number(name, defaultVal) {
  return env[name]
    ? parseInt(env[name], 10)
    : defaultVal;
}

export function bool(name, defaultVal) {
  return env[name]
    ? env[name] === 'true' || env[name] === '1'
    : defaultVal;
}
