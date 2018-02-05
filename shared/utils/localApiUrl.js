import config from './config';

/*
 * Resolves the api url for the client or server
 */
export default
typeof window === 'undefined'
  // Server
  ? config('localApiUrl')
  // Client
  : '/api';
