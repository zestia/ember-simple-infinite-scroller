import Component from '@ember/component';
import layout from '../templates/components/infinite-scroller';
import { bind, debounce, cancel } from '@ember/runloop';
import { resolve } from 'rsvp';
import { inject } from '@ember/service';
const { round } = Math;

export default Component.extend({
  _infiniteScroller: inject('-infinite-scroller'),

  layout,
  classNames: ['infinite-scroller'],
  classNameBindings: ['isLoading'],

  debug: false,

  didInsertElement() {
    this._super(...arguments);
    this.set('_scrollHandler', bind(this, '_scroll'));
    this._listener().addEventListener('scroll', this.get('_scrollHandler'));
  },

  willDestroyElement() {
    this._super(...arguments);
    this._listener().removeEventListener('scroll', this.get('_scrollHandler'));
    cancel(this.get('_scrollDebounceId'));
  },

  actions: {
    loadMore() {
      this._loadMore();
    }
  },

  _scroll(e) {
    this.set('_scrollDebounceId', debounce(this, '_debouncedScroll', e, this._scrollDebounce()));
  },

  _debouncedScroll() {
    if (this.get('debug')) {
      this._debug();
    }

    if (this._shouldLoadMore()) {
      this._loadMore();
    }
  },

  _listener() {
    if (this.get('use-document')) {
      return this.get('_infiniteScroller.document');
    } else if (this.get('use-element')) {
      return this.get('element').querySelector(this.get('use-element'));
    } else {
      return this.get('element');
    }
  },

  _element() {
    if (this.get('use-document')) {
      return this.get('_infiniteScroller.documentElement');
    } else if (this.get('use-element')) {
      return this.get('element').querySelector(this.get('use-element'));
    } else {
      return this.get('element');
    }
  },

  _scrollDebounce() {
    return this.get('scroll-debounce') || 100;
  },

  _scrollerHeight() {
    return this._element().clientHeight;
  },

  _scrollableHeight() {
    return this._element().scrollHeight;
  },

  _scrollTop() {
    return this._element().scrollTop;
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

  _debug() {
    /* eslint-disable no-console */
    console.table([{
      'scroller height': this._scrollerHeight(),
      'scrollable height': this._scrollableHeight(),
      'scroll top': this._scrollTop(),
      'scroller bottom': this._scrollerBottom(),
      'scroll percentage': this._scrollPercentage(),
      'reached bottom': this._reachedBottom(),
      'should load more': this._shouldLoadMore(),
      'scroll debounce': this._scrollDebounce(),
      'trigger at': this._triggerAt()
    }]);
  },

  _loadMore() {
    this.set('error', null);
    this.set('isLoading', true);
    resolve(this.get('on-load-more')())
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
