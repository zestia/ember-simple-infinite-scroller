import Service from '@ember/service';

export default class InfiniteScrollerService extends Service {
  isFastBoot = typeof FastBoot !== 'undefined';
  debug = false;
  _log = [];

  constructor() {
    super(...arguments);

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
