import fs from 'fs';

const VERBOSE = false; // log every event from webpack
const FILE = null; // set as filename to write samples there

function output({ id, name, category, sinceLast, sinceStart }, important) {
  if (VERBOSE) {
    console.log(`⏱ \t ${id} \t ${name} \t ${category} \t ${sinceLast} \t ${sinceStart}`);
  }

  if (important && !VERBOSE) {
    console.log(`⏱  ${name} in ${category} finished in ${sinceLast} (${sinceStart})`);
  }

  if (FILE && important) {
    fs.writeFile(FILE, `⏱ \t ${id} \t ${name} \t ${category} \t ${sinceLast} \t ${sinceStart}\n`, { flag: 'a' }, (err) => {
      if (err) {
        return console.log('error writing', err);
      }
    });
  }
}

function timer(name = '', category = '', timers = []) {
  timers.push({ name, start: process.hrtime() });

  let id = timers.length;
  const important = name.indexOf('done') === 0 || name.indexOf('invalid') === 0 || name.indexOf('finish-modules') === 0;

  if (timers.length === 1) {
    output({ id, name, category, sinceLast: 0, sinceStart: 0 });
    return;
  }

  const last = timers[timers.length - 2];

  const sinceLastDiff = process.hrtime(last.start);
  const sinceStartDiff = process.hrtime(timers[0].start);

  let sinceLastNs = (sinceLastDiff[0] * 1e9) + sinceLastDiff[1];
  let sinceStartNs = (sinceStartDiff[0] * 1e9) + sinceStartDiff[1];

  // event that says a file is invalid, i.e. we're recompiling
  if (name.indexOf('invalid') === 0) {
    sinceLastNs = 0;
    sinceStartNs = 0;
    id = 1;
    output(`⏱ \t Resetting for ${name}`);
    timers.splice(0);
    timers.push({ name, start: process.hrtime() });
  }

  const sinceLastMs = (sinceLastNs / 1e6).toFixed(3);
  const sinceStartMs = (sinceStartNs / 1e6).toFixed(3);

  output({ id, name, category, sinceLast: sinceLastMs, sinceStart: sinceStartMs }, important);
}

export default timer;
