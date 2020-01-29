import Service from '@ember/service';

export default class InfiniteScrollerService extends Service {
  isFastBoot = typeof FastBoot !== 'undefined';
  debug = false;
  _log = [];

  init() {
    super.init(...arguments);

    if (!this.isFastBoot) {
      this.document = document;
      this.documentElement = document.documentElement;
    }
  }

  log(state) {
    if (this.debug) {
      this._log.push(state);

      // eslint-disable-next-line
      console.table([state]);
    }
  }
}
