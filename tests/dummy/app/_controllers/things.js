import { later } from '@ember/runloop';
import { Promise } from 'rsvp';
import { action, set, get } from '@ember/object';
import Controller, {
  inject as injectController
} from '@ember/controller';
import generateThings from '../utils/generate-things';

export default class ThingsController extends Controller {
  @injectController('application') appController;

  init() {
    super.init(...arguments);
    set(this, 'page', 1);
    set(this, 'perPage', 10);
    set(this, 'things', this._generateThings());
  }

  @action
  loadMore() {
    return new Promise((resolve) => {
      later(() => {
        this.incrementProperty('page');
        this.things.pushObjects(this._generateThings());
        resolve();
      }, get(this, 'appController.loadDelay'));
    });
  }

  _generateThings() {
    const start = this.things ? this.things.length + 1 : 0;
    const end = this.page * this.perPage;
    return generateThings(start, end);
  }
}
