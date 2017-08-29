/**
 * Helper for resolving args passed via cli.
 */
export default function cliVarString(name, defaultVal) {
  let val = defaultVal;
  const args = process.argv.slice(2);

  const index = args.findIndex(arg => arg.includes(`--${name}`));

  if (index > -1) {
    val = args[index].split('=')[1];
  }

  return val;
}
