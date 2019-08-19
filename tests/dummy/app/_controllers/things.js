import { later } from '@ember/runloop';
import { Promise } from 'rsvp';
import Controller, {
  inject as injectController
} from '@ember/controller';
import generateThings from '../utils/generate-things';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('page', 1);
    this.set('perPage', 20);
    this.set('things', this._generateThings());
  },

  appController: injectController('application'),

  actions: {
    loadMore() {
      return new Promise(resolve => {
        later(() => {
          this.incrementProperty('page');
          this.get('things').pushObjects(this._generateThings());
          resolve();
        }, this.get('appController.loadDelay'));
      });
    }
  },

  _generateThings() {
    const start = this.getWithDefault('things.length', 0) + 1;
    const end = this.get('page') * this.get('perPage');
    return generateThings(start, end);
  }
});
