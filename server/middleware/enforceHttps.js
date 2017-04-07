
export default function enforceHttpsMiddleware(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.get('host')}${req.url}`);
  }
  next();
}
