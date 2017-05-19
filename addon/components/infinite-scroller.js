import Component from 'ember-component';
import layout from '../templates/components/infinite-scroller';
import { guidFor } from 'ember-metal/utils';
import { bind, debounce, cancel } from 'ember-runloop';
import RSVP from 'rsvp';
import inject from 'ember-service/inject';
const { round } = Math;

export default Component.extend({
  layout,
  classNames: ['infinite-scroller'],
  classNameBindings: ['isLoading'],

  debug: false,

  _infiniteScroller: inject('-infinite-scroller'),

  init() {
    this._super(...arguments);
    const guid = guidFor(this);
    this.set('scrollEventName', `scroll.${guid}`);
  },

  didInsertElement() {
    this._super(...arguments);
    this.$scroller().on(this.get('scrollEventName'), e => {
      this.set('_scrollDebounceCancelId',
        debounce(this, '_scrollingElement', e, this._scrollDebounce())
      );
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$scroller().off(this.get('scrollEventName'));
    cancel(this.get('_scrollDebounceCancelId'));
  },

  _scrollDebounce() {
    return this.get('scroll-debounce') || 100;
  },

  $scroller() {
    if (this.get('use-document')) {
      return this.get('_infiniteScroller').$document();
    } else {
      return this.$();
    }
  },

  _scrollerHeight() {
    if (this.get('use-document')) {
      return this.get('_infiniteScroller').$window().height();
    } else {
      return this.$scroller().outerHeight();
    }
  },

  _scrollableHeight() {
    if (this.get('use-document')) {
      return this.get('_infiniteScroller').$document().outerHeight();
    } else {
      return this.get('element').scrollHeight;
    }
  },

  _scrollTop() {
    if (this.get('use-document')) {
      return this.get('_infiniteScroller').$document().scrollTop();
    } else {
      return this.$().scrollTop();
    }
  },

  _scrollerBottom() {
    return this._scrollableHeight() - this._scrollerHeight();
  },

  _scrollPercentage() {
    return round(this._scrollTop() / this._scrollerBottom() * 100);
  },

  _triggerAt() {
    return parseInt(this.get('trigger-at') || '100%', 10);
  },

  _reachedBottom() {
    return this._scrollPercentage() >= this._triggerAt();
  },

  _shouldLoadMore() {
    return this._reachedBottom() && !this.get('isLoading');
  },

  _scrollingElement() {
    if (this.get('debug')) {
      this._debug();
    }
    if (this._shouldLoadMore()) {
      this._loadMore();
    }
  },

  _debug() {
    /* eslint-disable no-console */
    console.log();
    console.log('scroll debounce', this._scrollDebounce());
    console.log('trigger at', this._triggerAt());
    console.log('scroll percentage', this._scrollPercentage());
    console.log('reached bottom', this._reachedBottom());
    console.log('should load more', this._shouldLoadMore());
  },

  _loadMore() {
    this.set('error', null);
    this.set('isLoading', true);
    RSVP.resolve(this.get('on-load-more')())
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
  },

  actions: {
    loadMore() {
      this._loadMore();
    }
  }
});
