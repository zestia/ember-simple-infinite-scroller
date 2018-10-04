import Service from '@ember/service';
import { computed } from '@ember/object';

const isFastBoot = typeof FastBoot !== 'undefined';

export default Service.extend({
  debug: false,
  
  document: computed(function() {
    return isFastBoot ? null : document;
  }),

  documentElement: computed('document', function() {
    const doc = this.get('document');
    return doc ? doc.documentElement : null;
  }),
  
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
