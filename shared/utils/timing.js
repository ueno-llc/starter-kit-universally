import camelCase from 'lodash/camelCase';

class Timing {

  timings = new Map();

  start(...args) {
    let key = args[0];
    let name = args[1];

    if (name === undefined) {
      name = key;
      key = camelCase(key);
    }

    this.timings.set(key, {
      name,
      start: process.hrtime(),
    });

    return {
      end: () => this.end(key),
      cancel: () => this.cancel(key),
    };
  }

  end(key) {
    const timing = this.timings.get(key);
    timing.end = process.hrtime();
  }

  cancel(key) {
    this.timings.delete(key);
  }

  clear() {
    this.timings.clear();
  }

  promise = (target, name, descriptor) => {
    if (typeof window !== 'undefined') {
      return target;
    }

    const start = this.start.bind(this);
    const inst = target.constructor;
    const displayName = inst.displayName || inst.name || '~unknown';
    const key = `${displayName}.${name}`;
    const method = descriptor.value;

    descriptor.value = function promiseTiming(...args) {
      const { end, cancel } = start(key);
      return method.apply(this, args)
      .then((data) => {
        end();
        return data;
      })
      .catch((err) => {
        cancel();
        throw err;
      });
    };
  }

  diff([as, ans], [bs, bns]) {
    let ns = (ans - bns);
    let s = (as - bs);
    if (ns < 0) {
      s -= 1;
      ns += 1e9;
    }
    return [s, ns];
  }

  toString() {
    const arr = [];
    this.timings.forEach(({ name, start, end }, key) => {
      const [s, ns] = this.diff(end, start);
      arr.push(`${key}=${(s + (ns / 1000000000)).toFixed(3)}; "${name}"`);
    });
    return arr.join(', ');
  }
}

const timing = new Timing();
export default timing;
