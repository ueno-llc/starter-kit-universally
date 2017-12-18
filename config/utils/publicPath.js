import * as EnvVars from './envVars';

const host = EnvVars.string('HOST', 'localhost');
const port = EnvVars.number('PORT', 3000);
const publicUrl = EnvVars.string('PUBLIC_URL');
const clientDevServerPort = EnvVars.number('CLIENT_DEV_PORT', 7331);
const clientDevProxy = EnvVars.bool('CLIENT_DEV_PROXY', false);
const NODE_ENV = EnvVars.string('NODE_ENV', 'development');

export function getPublicUrl() {
  if (clientDevProxy && publicUrl) {
    return `${publicUrl}/webpack`;
  } else if (clientDevProxy) {
    return `http://${host}:${port}/webpack`;
  } else if (publicUrl) {
    return publicUrl;
  }
  return `http://${host}:${clientDevServerPort}`;
}

export function getPublicPath(clientBundleWebPath) {
  if (NODE_ENV === 'development') {
    // As we run a seperate development server for our client and server
    // bundles we need to use an absolute http path for the public path.
    return `${getPublicUrl()}${clientBundleWebPath}`;
  }
  // Otherwise we expect our bundled client to be served from this path.
  return clientBundleWebPath;
}
