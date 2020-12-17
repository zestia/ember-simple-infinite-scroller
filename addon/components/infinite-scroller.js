import Component from '@glimmer/component';
import { debounce, cancel, scheduleOnce } from '@ember/runloop';
import { action } from '@ember/object';
import { resolve } from 'rsvp';
import { tracked } from '@glimmer/tracking';

export default class InfiniteScrollerComponent extends Component {
  debug = true;
  scroller = null;

  @tracked error = null;
  @tracked isLoading = false;
  @tracked isScrollable = false;

  get scrollDebounce() {
    return this.args.scrollDebounce ?? 100;
  }

  get leeway() {
    return parseInt(this.args.leeway ?? '0%', 10);
  }

  @action
  handleInsertElement(element) {
    if (!this.scroller) {
      this._registerScroller(this.args.element ?? element);
    }

    this._scheduleCheckScrollable();
  }

  @action
  handleDestroyElement() {
    this._deregisterScroller();
  }

  @action
  loadMore() {
    this._loadMore();
  }

  @action
  setElement(element) {
    this._registerScroller(element);
  }

  _registerScroller(element) {
    if (this.scroller) {
      this._stopListening();
    }

    this.scroller = element;

    this._startListening();
  }

  _deregisterScroller() {
    this._stopListening();
    this.scroller = null;
  }

  _isScrollable() {
    return this.scroller.scrollHeight > this.scroller.clientHeight;
  }

  _scheduleCheckScrollable() {
    scheduleOnce('afterRender', this, '_checkScrollable');
  }

  _checkScrollable() {
    this.isScrollable = this._isScrollable();
  }

  _startListening() {
    this._scrollHandler = this._handleScroll.bind(this);

    this.scroller.addEventListener('scroll', this._scrollHandler);
  }

  _stopListening() {
    this.scroller.removeEventListener('scroll', this._scrollHandler);

    cancel(this._scrollDebounceId);
  }

  _handleScroll(e) {
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

  _log(state) {
    if (this.debug) {
      console.table([state]); // eslint-disable-line
    }
  }

  _shouldLoadMore() {
    const state = this._detectBottomOfScroller();

    const shouldLoadMore = state.reachedBottom && !this.isLoading;

    this._log({ ...state, shouldLoadMore });

    return shouldLoadMore;
  }

  _detectBottomOfScroller() {
    const scroller = this.scroller;
    const scrollHeight = scroller.scrollHeight;
    const scrollTop = scroller.scrollTop;
    const clientHeight = scroller.clientHeight;
    const bottom = scrollHeight - clientHeight;
    const leeway = this.leeway;
    const pixelsToBottom = bottom - scrollTop;
    const percentageToBottom = this._percentage(pixelsToBottom, bottom);
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

  _percentage(a, b) {
    if (a === 0 && b === 0) {
      return 0;
    }

    return (a / b) * 100;
  }

  _loadMore() {
    this.error = null;
    this.isLoading = true;

    resolve(this._invokeAction('onLoadMore'))
      .catch(this._loadError.bind(this))
      .finally(this._loadFinished.bind(this));
  }

  _invokeAction(name, ...args) {
    const action = this.args[name];

    if (typeof action === 'function') {
      action(...args);
    }
  }

  _loadError(error) {
    this.error = error;
  }

  _loadFinished() {
    this.isLoading = false;

    this._scheduleCheckScrollable();
  }
}
