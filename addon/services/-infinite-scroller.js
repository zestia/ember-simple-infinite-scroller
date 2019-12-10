import Service from '@ember/service';

export default Service.extend({
  isFastBoot: typeof FastBoot !== 'undefined',
  debug: true,

  init() {
    this._super(...arguments);

    this.set('_log', []);

    if (!this.isFastBoot) {
      this.set('document', document);
      this.set('documentElement', document.documentElement);
    }
  },

  log(state) {
    if (this.debug) {
      this._log.push(state);

      // eslint-disable-next-line
      console.table([state]);
    }
  }
});
