import Component from '@ember/component';
import layout from '../templates/components/infinite-scroller';
import { bind, debounce, cancel } from '@ember/runloop';
import { resolve } from 'rsvp';
import { inject } from '@ember/service';
const { round } = Math;

export default Component.extend({
  layout,
  classNames: ['infinite-scroller'],
  classNameBindings: ['isLoading'],

  debug: true,

  _infiniteScroller: inject('-infinite-scroller'),

  didInsertElement() {
    this._super(...arguments);
    this.set('_scrollHandler', bind(this, '_scroll'));
    this.scroller().addEventListener('scroll', this.get('_scrollHandler'));
  },

  willDestroyElement() {
    this._super(...arguments);
    this.scroller().removeEventListener('scroll', this.get('_scrollHandler'));
    cancel(this.get('_scrollDebounceId'));
  },

  _scroll(e) {
    this.set(
      '_scrollDebounceId',
      debounce(this, '_debouncedScroll', e, this._scrollDebounce())
    );
  },

  _debouncedScroll() {
    if (this.get('debug')) {
      this._debug();
    }
    if (this._shouldLoadMore()) {
      this._loadMore();
    }
  },

  _scrollDebounce() {
    return this.get('scroll-debounce') || 100;
  },

  scroller() {
    if (this.get('use-document')) {
      return this.get('_infiniteScroller.documentElement');
    } else {
      return this.get('element');
    }
  },

  _scrollerHeight() {
    if (this.get('use-document')) {
      return this.get('_infiniteScroller.window.innerHeight');
    } else {
      return this.scroller().offsetHeight;
    }
  },

  _scrollableHeight() {
    if (this.get('use-document')) {
      return this.get('_infiniteScroller.documentElement.offsetHeight');
    } else {
      return this.get('element.scrollHeight');
    }
  },

  _scrollTop() {
    if (this.get('use-document')) {
      return this.get('_infiniteScroller.documentElement.scrollTop');
    } else {
      return this.get('element.scrollTop');
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
  },

  actions: {
    loadMore() {
      this._loadMore();
    }
  }
});
