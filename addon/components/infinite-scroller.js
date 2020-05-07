import Component from '@glimmer/component';
import { debounce, cancel, scheduleOnce } from '@ember/runloop';
import { action } from '@ember/object';
import { resolve } from 'rsvp';
import { inject } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class InfiniteScrollerComponent extends Component {
  @inject('-infinite-scroller') _infiniteScroller;

  @tracked error = null;
  @tracked isLoading = false;
  @tracked isScrollable = false;
  domElement = null;

  get selector() {
    return this.args.selector || null;
  }

  get useDocument() {
    return this.args.useDocument || false;
  }

  get scrollDebounce() {
    return this.args.scrollDebounce || 100;
  }

  get leeway() {
    return parseInt(this.args.leeway || '0%', 10);
  }

  @action
  handleInsertElement(element) {
    this._registerElement(element);
    this._scheduleCheckScrollable();
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
    this.domElement = element;
  }

  _deregisterElement() {
    this.domElement = null;
  }

  _isScrollable() {
    let element = this._scroller();

    if (this.useDocument) {
      element = this._documentElement();
    }

    if (!element) {
      return;
    }

    return element.scrollHeight > element.clientHeight;
  }

  _scheduleCheckScrollable() {
    scheduleOnce('afterRender', this, '_checkScrollable');
  }

  _checkScrollable() {
    this.isScrollable = this._isScrollable();
  }

  _listen() {
    this._scrollHandler = this._scroll.bind(this);
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

  _log() {
    this._infiniteScroller.log(...arguments);
  }

  _document() {
    return this._infiniteScroller.document;
  }

  _documentElement() {
    return this._infiniteScroller.documentElement;
  }

  _listener() {
    if (this.useDocument) {
      return this._document();
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

    this._log(state);

    return state.shouldLoadMore;
  }

  _detectBottomOfElementInDocument() {
    const scroller = this._scroller();
    const clientHeight = this._infiniteScroller.documentElement.clientHeight;
    const bottom = scroller.getBoundingClientRect().bottom;
    const leeway = this.leeway;
    const pixelsToBottom = bottom - clientHeight;
    const percentageToBottom = (pixelsToBottom / bottom) * 100;
    const reachedBottom = percentageToBottom <= leeway;

    return {
      clientHeight,
      bottom,
      leeway,
      pixelsToBottom,
      percentageToBottom,
      reachedBottom,
    };
  }

  _detectBottomOfElement() {
    const scroller = this._scroller();
    const scrollHeight = scroller.scrollHeight;
    const scrollTop = scroller.scrollTop;
    const clientHeight = scroller.clientHeight;
    const bottom = scrollHeight - clientHeight;
    const leeway = this.leeway;
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
      reachedBottom,
    };
  }

  _loadMore() {
    const action = this.args.onLoadMore;

    if (typeof action !== 'function') {
      return;
    }

    this.error = null;
    this.isLoading = true;

    resolve(action())
      .catch(this._loadError.bind(this))
      .finally(this._loadFinished.bind(this));
  }

  _loadError(error) {
    this.error = error;
  }

  _loadFinished() {
    this.isLoading = false;

    this._scheduleCheckScrollable();
  }
}
