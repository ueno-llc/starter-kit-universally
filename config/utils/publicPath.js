export function getPublicUrl({ clientDevProxy, publicUrl, host, port, clientDevServerPort }) {
  if (clientDevProxy && publicUrl) {
    return `${publicUrl}/webpack`;
  } else if (clientDevProxy) {
    return `http://${host}:${port}/webpack`;
  } else if (publicUrl) {
    return publicUrl;
  }

  return `http://${host}:${clientDevServerPort}`;
}

export function getPublicPath(clientBundleWebPath, params) {
  if (params.NODE_ENV === 'development') {
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
export function constructLocalApiUrl({ baseUrl, host, port, herokuAppName }) {
  if (baseUrl) {
    return `${baseUrl}/api`;
  }

  // Used on Heroku PR apps
  if (herokuAppName) {
    return `https://${herokuAppName}.herokuapp.com/api`;
  }

  return `http://${host}:${port}/api`;
}
