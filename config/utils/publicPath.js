// Only used for development
export function getPublicUrl({ remoteUrl, host, clientDevServerPort }) {
  if (remoteUrl) {
    return `${remoteUrl}/webpack`;
  }
  // Normal development url
  return `http://${host}:${clientDevServerPort}`;
}

// Returns the public path of the app’s assets.
// The returned path must have a trailing slash.
export function getPublicPath({
  NODE_ENV,
  clientBundleWebPath,
  ...params
}) {
  if (NODE_ENV === 'development') {
    // As we run a seperate development server for our client and server
    // bundles we need to use an absolute http path for the public path.
    return `${getPublicUrl(params)}${clientBundleWebPath}`;
  }

  // Otherwise we expect our bundled client to be served from this path.
  return clientBundleWebPath;
}

/**
 * Construct a fully qualified URL to a local API if we have any.
 * Assumes we're using HTTP in dev and HTTPS when not
 */
export function getLocalApiUrl({ baseUrl, host, port, herokuAppName }) {
  if (baseUrl) {
    return `${baseUrl}/api`;
  }

  // Used on Heroku PR apps
  if (herokuAppName) {
    return `https://${herokuAppName}.herokuapp.com/api`;
  }

  return `http://${host}:${port}/api`;
}
