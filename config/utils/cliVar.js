/**
 * Helper for resolving args passed via cli.
 */
export default function cliVarString(name, defaultVal) {
  const args = process.argv.slice(2);
  const index = args.findIndex(arg => arg.includes(`--${name}`));

  if (index > -1) {
    const [key, val] = args[index].split('=');

    if (val) {
      return val;
    }

    if (key) {
      // The option was passed but no value given
      // User must be turning on a flag
      return true;
    }
  }

  return defaultVal;
}
