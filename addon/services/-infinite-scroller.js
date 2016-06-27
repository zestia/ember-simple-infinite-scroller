import Service from 'ember-service';
import jQuery from 'jquery';

export default Service.extend({
  $document() {
    return jQuery(document);
  },

  $window() {
    return jQuery(window);
  }
});
