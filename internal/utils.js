import HappyPack from 'happypack';
import colors from 'colors/safe';
import { execSync } from 'child_process';
import appRootDir from 'app-root-dir';
import config from '../config';

// Generates a HappyPack plugin.
// @see https://github.com/amireh/happypack/
export function happyPackPlugin({ name, loaders }) {
  return new HappyPack({
    id: name,
    verbose: false,
    threads: 4,
    loaders,
  });
}

// Get level verbosity
// 3 = verbose, 0 = off
function toLevel(str) {
  switch (str) {
    case 'info': return 3;
    case 'warn': return 2;
    case 'error': return 1;
    default: return 0;
  }
}

export function log(options) {
  const title = `${options.title.toUpperCase()}`;
  const level = options.level || 'info';
  const notify = config('notifier');

  if (options.notify && toLevel(notify) >= toLevel(level)) {
    require('node-notifier').notify({
      title,
      message: options.message,
    });
  }

  const msg = `==> ${title} -> ${options.message}`;

  switch (level) {
    case 'warn': console.log(colors.yellow(msg)); break;
    case 'error': console.log(colors.bgRed.white(msg)); break;
    case 'info':
    default: console.log(colors.green(msg));
  }
}

export function exec(command) {
  execSync(command, { stdio: 'inherit', cwd: appRootDir.get() });
}
