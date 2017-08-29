import timer from './timer';

function TimerPlugin(options) {
  const opts = options || {};
  this.category = opts.category;
  this.timers = opts.timers || [];

  timer('start', this.category, this.timers);
}

TimerPlugin.prototype.apply = function apply(compiler) {
  const t = (name) => {
    timer(name, this.category, this.timers);
  };

  t('TimerPlugin applied');

  this.moduleCount = 0;

  compiler.plugin('compilation', (c) => {
    if (c.compiler.isChild()) {
      return;
    }

    t('compilation', this.category);
    this.modules = [];

    c.plugin('build-module', (m) => {
      this.moduleCount = this.moduleCount + 1;
      this.modules.push(m.identifier());
    });
    c.plugin('finish-modules', () => {
      t(`finish-modules ${this.moduleCount}`);
      this.moduleCount = 0;
    });

    c.plugin('seal', () => { t('seal'); });
    c.plugin('additional-pass', () => { t('additional-pass'); });
    c.plugin('optimize', () => { t('optimize'); });
    c.plugin('optimize-modules-basic', () => { t('optimize-modules-basic'); });
    c.plugin('optimize-modules-advanced', () => { t('optimize-modules-advanced'); });
    c.plugin('optimize-chunks-basic', () => { t('optimize-chunks-basic'); });
    c.plugin('optimize-chunks', () => { t('optimize-chunks'); });
    c.plugin('optimize-chunks-advanced', () => { t('optimize-chunks-advanced'); });
    c.plugin('revive-modules', () => { t('revive-modules'); });
    c.plugin('optimize-module-order', () => { t('optimize-module-order'); });
    c.plugin('optimize-module-ids', () => { t('optimize-module-ids'); });
    c.plugin('revive-chunks', () => { t('revive-chunks'); });
    c.plugin('optimize-chunk-order', () => { t('optimize-chunk-order'); });
    c.plugin('optimize-chunk-ids', () => { t('optimize-chunk-ids'); });
    c.plugin('before-hash', () => { t('before-hash'); });
    c.plugin('before-module-assets', () => { t('before-module-assets'); });
    c.plugin('before-chunk-assets', () => { t('before-chunk-assets'); });
    c.plugin('additional-chunk-assets', () => { t('additional-chunk-assets'); });
    c.plugin('record', () => { t('record'); });
    c.plugin('optimize-tree', (a, b, cb) => { t('optimize-tree'); cb(); });
    c.plugin('additional-assets', (cb) => { t('additional-assets'); cb(); });
    c.plugin('optimize-chunk-assets', (a, cb) => { t('optimize-chunk-assets'); cb(); });
    c.plugin('optimize-assets', (a, cb) => { t('optimize-assets'); cb(); });
    c.plugin('invalid', () => { t('invalid'); });
  });

  compiler.plugin('environment', () => { t('environment'); });
  compiler.plugin('after-environment', () => { t('after-environment'); });
  compiler.plugin('compile', () => { t('compile'); });
  compiler.plugin('make', (c, cb) => { t('make'); cb(); });
  compiler.plugin('run', (c, cb) => { t('run'); cb(); });
  compiler.plugin('before-compile', (c, cb) => { t('before-compile'); cb(); });
  compiler.plugin('after-compile', (c, cb) => { t('after-compile'); cb(); });
  compiler.plugin('emit', (c, cb) => { t('emit'); cb(); });
  compiler.plugin('after-emit', (c, cb) => { t('after-emit'); cb(); });
  compiler.plugin('done', () => { t('done'); });
  compiler.plugin('watch-run', (watcher, cb) => {
    t('watch-run');

    if (!this.hasRegisteredInvalid) {
      watcher.compiler.plugin('invalid', (file) => { t(`invalid ${file}`); });
      this.hasRegisteredInvalid = true;
    }
    cb();
  });
};

export default TimerPlugin;
