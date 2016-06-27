import Component from 'ember-component';
import { guidFor } from 'ember-metal/utils';
import { bind, debounce } from 'ember-runloop';
import RSVP from 'rsvp';
import jQuery from 'jquery';

export default Component.extend({
  classNames: ['infinite-scroller'],
  classNameBindings: ['isLoading'],

  $document: jQuery(document),
  $window:   jQuery(window),

  init() {
    this._super(...arguments);
    this.set('scrollEventName', 'scroll.' + guidFor(this));
  },

  didInsertElement() {
    this._super(...arguments);

    let useDoc = this.getAttr('use-document');
    this.$scroller = useDoc ? this.$document : this.$();

    this.$scroller.on(this.get('scrollEventName'), args => {
      debounce(this, '_scrollingElement', args, 250);
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$scroller.off(this.get('scrollEventName'));
  },

  _scrollerHeight() {
    if (this.getAttr('use-document')) {
      return this.$window.height();
    } else {
      return this.$scroller.height();
    }
  },

  _scrollableHeight() {
    if (this.getAttr('use-document')) {
      return this.$document.height();
    } else {
      return this.get('element').scrollHeight;
    }
  },

  _scrollTop() {
    if (this.getAttr('use-document')) {
      return this.$document.scrollTop();
    } else {
      return this.$().scrollTop();
    }
  },

  _scrollerBottom() {
    return this._scrollableHeight() - this._scrollerHeight();
  },

  _reachedBottom() {
    return this._scrollTop() === this._scrollerBottom();
  },

  _scrollingElement() {
    if (this._shouldLoadMore()) {
      this._loadMore();
    }
  },

  _shouldLoadMore() {
    return this._reachedBottom() && !this.get('isLoading');
  },

  _loadMore() {
    this.set('error', null);
    this.set('isLoading', true);
    RSVP.resolve(this.getAttr('on-load-more')())
      .catch(bind(this, '_loadError'))
      .finally(bind(this, '_loadFinished'));
  },

  _loadError(error) {
    if (this.get('isDestroyed')) {
      return;
    }
    this.set('error', error);
  },

  _loadFinished() {
    if (this.get('isDestroyed')) {
      return;
    }
    this.set('isLoading', false);
  }
});