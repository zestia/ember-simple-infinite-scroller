import Service from '@ember/service';

export default Service.extend({
  debug: false,

  document,
  documentElement: document.documentElement,

  init() {
    this._super(...arguments);
    this.set('_log', []);
  },

  log(state) {
    /* eslint-disable no-console */
    this._log.push(state);
    console.table([state]);
  }
});
