import Mixin from '@ember/object/mixin';
import { later } from '@ember/runloop';
import RSVP from 'rsvp';
import { inject as injectController } from '@ember/controller';
import generateThings from '../utils/generate-things';

export default Mixin.create({
  appController: injectController('application'),

  init() {
    this._super(...arguments);
    this.set('page', 1);
    this.set('perPage', 20);
    this.set('things', this._generateThings());
  },

  _generateThings() {
    const start = this.getWithDefault('things.length', 1);
    const end   = this.get('page') * this.get('perPage');
    return generateThings(start, end);
  },

  actions: {
    loadMore() {
      return new RSVP.Promise(resolve => {
        later(() => {
          this.incrementProperty('page');
          this.get('things').pushObjects(this._generateThings());
          resolve();
        }, this.get('appController.loadDelay'));
      });
    }
  }
});
