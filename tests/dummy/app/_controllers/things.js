import { later } from '@ember/runloop';
import { Promise } from 'rsvp';
import { action } from '@ember/object';
import Controller, { inject as injectController } from '@ember/controller';
import generateThings from '../utils/generate-things';
import { tracked } from '@glimmer/tracking';

export default class ThingsController extends Controller {
  @injectController('application') appController;

  @tracked page = 1;
  @tracked things;
  perPage = 10;

  constructor() {
    super(...arguments);
    this.things = this._generateThings();
  }

  @action
  handleLoadMore() {
    return new Promise((resolve) => {
      later(() => {
        this.page++;
        this.things = [...this.things, ...this._generateThings()];
        resolve();
      }, this.appController.loadDelay);
    });
  }

  _generateThings() {
    const start = this.things ? this.things.length + 1 : 0;
    const end = this.page * this.perPage;
    return generateThings(start, end);
  }
}
