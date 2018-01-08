import config from './config';

/*
 * Resolves the api url for the client or server
 */
export default function getLocalApiUrl() {
  return typeof window === 'undefined'
    // Server
    ? config('localApiUrl')
    // Client
    : '/api';
}
