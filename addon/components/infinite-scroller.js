import Component from '@glimmer/component';
import { debounce, cancel, scheduleOnce } from '@ember/runloop';
import { action } from '@ember/object';
import { resolve } from 'rsvp';
import { tracked } from '@glimmer/tracking';
const { round } = Math;

export default class InfiniteScrollerComponent extends Component {
  debug = true;
  scroller = null;

  @tracked error = null;
  @tracked isLoading = false;
  @tracked isScrollable = false;

  get debounce() {
    return this.args.debounce ?? 100;
  }

  get leeway() {
    return parseInt(this.args.leeway ?? '0%', 10);
  }

  get normalisedScrollerElement() {
    if (this.scroller instanceof Document) {
      return this.scroller.documentElement;
    } else {
      return this.scroller;
    }
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

  _scheduleCheckScrollable() {
    scheduleOnce('afterRender', this, '_checkScrollable');
  }

  _startListening() {
    this._scrollHandler = this._handleScroll.bind(this);

    this.scroller.addEventListener('scroll', this._scrollHandler);
  }

  _stopListening() {
    this.scroller.removeEventListener('scroll', this._scrollHandler);

    cancel(this._debounceId);
  }

  _handleScroll(e) {
    this._debounceId = debounce(this, '_checkShouldLoadMore', e, this.debounce);
  }

  _checkShouldLoadMore() {
    const scrollState = this._getScrollState();
    const shouldLoadMore = scrollState.reachedBottom && !this.isLoading;

    this._debug({ ...scrollState, shouldLoadMore });

    if (shouldLoadMore) {
      this._loadMore();
    }
  }

  _checkScrollable() {
    const scrollState = this._getScrollState();

    this._debug({ ...scrollState });

    console.log(document.querySelectorAll('.thing').length);

    this.isScrollable = scrollState.isScrollable;
  }

  _debug(state) {
    if (!this.debug) {
      return;
    }

    console.table([state]); // eslint-disable-line
  }

  _percentage(a, b) {
    if (a === 0 && b === 0) {
      return 0;
    }

    return round((a / b) * 100);
  }

  _getScrollState() {
    const element = this.normalisedScrollerElement;
    const scrollHeight = element.scrollHeight;
    const scrollTop = element.scrollTop;
    const clientHeight = element.clientHeight;
    const isScrollable = scrollHeight > clientHeight;
    const bottom = scrollHeight - clientHeight;
    const leeway = this.leeway;
    const pixelsToBottom = bottom - scrollTop;
    const percentageToBottom = this._percentage(pixelsToBottom, bottom);
    const reachedBottom = percentageToBottom <= leeway;

    return {
      scrollHeight,
      scrollTop,
      clientHeight,
      isScrollable,
      bottom,
      leeway,
      pixelsToBottom,
      percentageToBottom,
      reachedBottom
    };
  }

  _loadMore() {
    this.error = null;
    this.isLoading = true;

    resolve(this._invokeAction('onLoadMore'))
      .catch(this._handleLoadError.bind(this))
      .finally(this._handleLoadFinished.bind(this));
  }

  _invokeAction(name, ...args) {
    const action = this.args[name];

    if (typeof action === 'function') {
      action(...args);
    }
  }

  _handleLoadError(error) {
    this.error = error;
  }

  _handleLoadFinished() {
    this.isLoading = false;

    this._scheduleCheckScrollable();
  }
}
