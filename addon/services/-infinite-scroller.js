import Service from '@ember/service';
import { computed } from '@ember/object';

const isFastBoot = typeof FastBoot !== 'undefined';

export default Service.extend({
  document: computed(function() {
    return isFastBoot ? null : document;
  }),

  documentElement: computed('document', function() {
    const doc = this.get('document');
    return doc ? doc.documentElement : null;
  }),
});
