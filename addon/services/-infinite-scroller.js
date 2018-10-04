import Service from '@ember/service';


export default Service.extend({
  isFastBoot: typeof FastBoot !== 'undefined',
  debug: false,

  init() {
    this._super(...arguments);

    this.set('_log', []);

    if (!this.isFastBoot) {
      this.set('document', document);
      this.set('documentElement', document.documentElement);
    }
  },

  log(state) {
    this._log.push(state);

    if (this.debug) {
      /* eslint-disable no-console */
      console.table([state]);
    }
  }
});
