import Component from '@ember/component';
import layout from '../templates/components/infinite-scroller';
import { bind, debounce, cancel } from '@ember/runloop';
import { resolve } from 'rsvp';
import { inject } from '@ember/service';

export default Component.extend({
  _infiniteScroller: inject('-infinite-scroller'),

  layout,
  classNames: ['infinite-scroller'],
  classNameBindings: ['isLoading'],

  onLoadMore: null,
  useElement: null,
  useDocument: false,
  scrollDebounce: 100,
  leeway: '0%',

  didInsertElement() {
    this._super(...arguments);
    this._listen();
  },

  willDestroyElement() {
    this._super(...arguments);
    this._stopListening();
  },

  actions: {
    loadMore() {
      this._loadMore();
    }
  },

  _listen() {
    this._scrollHandler = bind(this, '_scroll');
    this._listener().addEventListener('scroll', this._scrollHandler);
  },

  _stopListening() {
    this._listener().removeEventListener('scroll', this._scrollHandler);
    cancel(this._scrollDebounceId);
  },

  _scroll(e) {
    this._scrollDebounceId = debounce(this, '_debouncedScroll', e, this.scrollDebounce);
  },

  _debouncedScroll() {
    if (this._shouldLoadMore()) {
      this._loadMore();
    }
  },

  _leeway() {
    return parseInt(this.leeway, 10);
  },

  _listener() {
    if (this.useDocument) {
      return this._infiniteScroller.document;
    } else {
      return this._element();
    }
  },

  _element() {
    if (this.selector) {
      return this.element.querySelector(this.selector);
    } else {
      return this.element;
    }
  },

  _shouldLoadMore() {
    let state;

    if (this.useDocument) {
      state = this._detectBottomOfElementInDocument();
    } else {
      state = this._detectBottomOfElement();
    }

    state.shouldLoadMore = state.reachedBottom && !this.isLoading;

    if (this._infiniteScroller.debug) {
      this._infiniteScroller.log(state);
    }

    return state.shouldLoadMore;
  },

  _detectBottomOfElementInDocument() {
    const clientHeight = this._infiniteScroller.documentElement.clientHeight;
    const bottom = this._element().getBoundingClientRect().bottom;
    const leeway = this._leeway();
    const pixelsToBottom = bottom - clientHeight;
    const percentageToBottom = (pixelsToBottom / bottom) * 100;
    const reachedBottom = percentageToBottom <= leeway;

    return {
      clientHeight,
      bottom,
      leeway,
      pixelsToBottom,
      percentageToBottom,
      reachedBottom
    };
  },

  _detectBottomOfElement() {
    const scrollHeight = this._element().scrollHeight;
    const scrollTop = this._element().scrollTop;
    const clientHeight = this._element().clientHeight;
    const bottom = scrollHeight - clientHeight;
    const leeway = this._leeway();
    const pixelsToBottom = bottom - scrollTop;
    const percentageToBottom = (pixelsToBottom / bottom) * 100;
    const reachedBottom = percentageToBottom <= leeway;

    return {
      scrollHeight,
      scrollTop,
      clientHeight,
      bottom,
      leeway,
      pixelsToBottom,
      percentageToBottom,
      reachedBottom
    };
  },

  _loadMore() {
    this.set('error', null);
    this.set('isLoading', true);
    resolve(this.onLoadMore())
      .catch(bind(this, '_loadError'))
      .finally(bind(this, '_loadFinished'));
  },

  _loadError(error) {
    if (this.isDestroyed) {
      return;
    }

    this.set('error', error);
  },

  _loadFinished() {
    if (this.isDestroyed) {
      return;
    }

    this.set('isLoading', false);
  }
});
