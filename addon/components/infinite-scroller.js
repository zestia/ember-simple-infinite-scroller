import Component from '@ember/component';
import { bind, debounce, cancel } from '@ember/runloop';
import layout from '../templates/components/infinite-scroller';
import { action, get, set } from '@ember/object';
import { resolve } from 'rsvp';
import { inject } from '@ember/service';

export default class InfiniteScrollerComponent extends Component {
  @inject('-infinite-scroller') _infiniteScroller;

  layout = layout;
  tagName = '';

  // Arguments

  onLoadMore = null;
  selector = null;
  useDocument = false;
  scrollDebounce = 100;
  leeway = '0%';

  // State

  error = null;
  isLoading = false;
  isScrollable = false;
  domElement = null;

  @action
  handleInsertElement(element) {
    this._registerElement(element);
    this._checkScrollable();
    this._listen();
  }

  @action
  handleDestroyElement() {
    this._stopListening();
    this._deregisterElement();
  }

  @action
  loadMore() {
    this._loadMore();
  }

  _registerElement(element) {
    set(this, 'domElement', element);
  }

  _deregisterElement() {
    set(this, 'domElement', null);
  }

  _isScrollable() {
    return this._scroller().scrollHeight > this._scroller().clientHeight;
  }

  _checkScrollable() {
    set(this, 'isScrollable', this._isScrollable());
  }

  _listen() {
    this._scrollHandler = bind(this, '_scroll');
    this._listener().addEventListener('scroll', this._scrollHandler);
  }

  _stopListening() {
    this._listener().removeEventListener('scroll', this._scrollHandler);
    cancel(this._scrollDebounceId);
  }

  _scroll(e) {
    this._scrollDebounceId = debounce(
      this,
      '_debouncedScroll',
      e,
      this.scrollDebounce
    );
  }

  _debouncedScroll() {
    if (this._shouldLoadMore()) {
      this._loadMore();
    }
  }

  _leeway() {
    return parseInt(this.leeway, 10);
  }

  _listener() {
    if (this.useDocument) {
      return get(this, '_infiniteScroller').document;
    } else {
      return this._scroller();
    }
  }

  _scroller() {
    if (this.selector) {
      return this.domElement.querySelector(this.selector);
    } else {
      return this.domElement;
    }
  }

  _shouldLoadMore() {
    let state;

    if (this.useDocument) {
      state = this._detectBottomOfElementInDocument();
    } else {
      state = this._detectBottomOfElement();
    }

    state.shouldLoadMore = state.reachedBottom && !this.isLoading;

    get(this, '_infiniteScroller').log(state);

    return state.shouldLoadMore;
  }

  _detectBottomOfElementInDocument() {
    const clientHeight = get(this, '_infiniteScroller').documentElement
      .clientHeight;
    const bottom = this._scroller().getBoundingClientRect().bottom;
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
  }

  _detectBottomOfElement() {
    const scrollHeight = this._scroller().scrollHeight;
    const scrollTop = this._scroller().scrollTop;
    const clientHeight = this._scroller().clientHeight;
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
  }

  _loadMore() {
    set(this, 'error', null);
    set(this, 'isLoading', true);

    resolve(this.onLoadMore())
      .catch(bind(this, '_loadError'))
      .finally(bind(this, '_loadFinished'));
  }

  _loadError(error) {
    if (this.isDestroyed) {
      return;
    }

    set(this, 'error', error);
  }

  _loadFinished() {
    if (this.isDestroyed) {
      return;
    }

    set(this, 'isLoading', false);
  }
}
