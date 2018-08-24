import Component from '@ember/component';
import layout from '../templates/components/infinite-scroller';
import { bind, debounce, cancel } from '@ember/runloop';
import { resolve } from 'rsvp';
import { inject } from '@ember/service';
import { getWithDefault, trySet } from '@ember/object';

export default Component.extend({
  _infiniteScroller: inject('-infinite-scroller'),

  layout,
  classNames: ['infinite-scroller'],
  classNameBindings: ['isLoading'],

  debug: true,

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
    this._scrollDebounceId = debounce(this, '_debouncedScroll', e, this._scrollDebounce());
  },

  _debouncedScroll() {
    if (this._shouldLoadMore()) {
      this._loadMore();
    }
  },

  _scrollDebounce() {
    return getWithDefault(this, 'scrollDebounce', 100);
  },

  _leeway() {
    return parseInt(getWithDefault(this, 'leeway', '0%'), 10);
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
    if (this.useDocument) {
      return this._bottomOfElementHasBecomeVisbleInDocument();
    } else {
      return this._bottomOfElementHasBecomeVisible();
    }
  },

  _bottomOfElementHasBecomeVisbleInDocument() {
    const clientHeight = this._infiniteScroller.document.documentElement.clientHeight;
    const bottom = this._element().getBoundingClientRect().bottom;
    const leeway = this._leeway();
    const pixelsToBottom = bottom - clientHeight;
    const percentageToBottom = (pixelsToBottom / bottom) * 100;
    const reachedBottom = percentageToBottom <= leeway;

    if (this.debug) {
      /* eslint-disable no-console */
      console.table([
        {
          clientHeight,
          bottom,
          pixelsToBottom,
          leeway,
          percentageToBottom,
          reachedBottom
        }
      ]);
    }

    return reachedBottom;
  },

  _bottomOfElementHasBecomeVisible() {
    const scrollHeight = this._element().scrollHeight;
    const scrollTop = this._element().scrollTop;
    const clientHeight = this._element().clientHeight;
    const bottom = scrollHeight - clientHeight;
    const leeway = this._leeway();
    const pixelsToBottom = bottom - scrollTop;
    const percentageToBottom = (pixelsToBottom / bottom) * 100;
    const reachedBottom = percentageToBottom <= leeway;

    if (this.debug) {
      /* eslint-disable no-console */
      console.table([
        {
          scrollHeight,
          scrollTop,
          clientHeight,
          bottom,
          pixelsToBottom,
          leeway,
          percentageToBottom,
          reachedBottom
        }
      ]);
    }

    return reachedBottom;
  },

  _loadMore() {
    this.set('error', null);
    this.set('isLoading', true);
    resolve(this.onLoadMore())
      .catch(bind(this, '_loadError'))
      .finally(bind(this, '_loadFinished'));
  },

  _loadError(error) {
    trySet(this, 'error', error);
  },

  _loadFinished() {
    trySet(this, 'isLoading', false);
  }
});
