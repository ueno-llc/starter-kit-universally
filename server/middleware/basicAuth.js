import auth from 'basic-auth';
import config from '../../config';

function split(str) {
  const colonIndex = str.indexOf(':');

  // default to empty name and incoming str as password
  let name = '';
  let pass = str;

  if (colonIndex > 0) {
    name = str.substr(0, colonIndex);
    pass = str.substr(colonIndex + 1);
  }

  return { name, pass };
}

export default function basicAuthMiddleware(req, res, next) {
  const credentials = auth(req);

  const authString = config('passwordProtect');

  const { name, pass } = split(authString);

  if (!credentials || credentials.name !== name || credentials.pass !== pass) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="ueno"',
    });

    return res.end();
  }

  next();
}
