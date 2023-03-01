import Component from '@glimmer/component';
import { resolve } from 'rsvp';
import { debounce, cancel } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { action } from '@ember/object';
const { seal, assign } = Object;
const { round } = Math;

export default class InfiniteScrollerComponent extends Component {
  @tracked isLoading = false;
  @tracked isScrollable = false;

  debug;
  scroller;
  debounceId;

  setScroller = modifier(
    (element, [positionalElement]) => {
      this._registerScroller(positionalElement ?? element);

      return () => this._deregisterScroller();
    },
    { eager: false }
  );

  get debounce() {
    return this.args.debounce ?? 100;
  }

  get percent() {
    return this.args.percent ?? 100;
  }

  get normalisedScrollerElement() {
    if (this.scroller instanceof Document) {
      return this.scroller.documentElement;
    } else {
      return this.scroller;
    }
  }

  @action
  handleScroll() {
    this.debounceId = debounce(this, '_checkShouldLoadMore', this.debounce);
  }

  @action
  loadMore() {
    this.isLoading = true;

    resolve(this.args.onLoadMore?.()).finally(() => {
      this.isLoading = false;

      this._checkScrollable();
    });
  }

  _registerScroller(element) {
    this.scroller = element;

    this._startListening();
    this._checkScrollable();
  }

  _deregisterScroller() {
    this._stopListening();
    cancel(this.debounceId);
    this.scroller = null;
  }

  _startListening() {
    this.scroller.addEventListener('scroll', this.handleScroll);
  }

  _stopListening() {
    this.scroller.removeEventListener('scroll', this.handleScroll);
  }

  _checkShouldLoadMore() {
    const scrollState = this._getScrollState();
    const shouldLoadMore = scrollState.reachedBottom && !this.isLoading;

    this._debug({ ...scrollState, shouldLoadMore });

    if (shouldLoadMore) {
      this.loadMore();
    }
  }

  _checkScrollable() {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    const scrollState = this._getScrollState();

    this._debug({ ...scrollState });

    this.isScrollable = scrollState.isScrollable;
  }

  _debug(state) {
    if (!this.debug) {
      return;
    }

    console.table([state]); // eslint-disable-line
  }

  _getScrollState() {
    const element = this.normalisedScrollerElement;
    const scrollHeight = element.scrollHeight;
    const scrollTop = element.scrollTop;
    const clientHeight = element.clientHeight;
    const isScrollable = scrollHeight > clientHeight;
    const bottom = scrollHeight - clientHeight;
    const percent = this.percent;
    const percentScrolled = round((scrollTop / bottom) * 100);
    const reachedBottom = percentScrolled >= percent;

    return {
      isScrollable,
      scrollHeight,
      clientHeight,
      scrollTop,
      bottom,
      percent,
      percentScrolled,
      reachedBottom
    };
  }

  get _api() {
    return {
      isScrollable: this.isScrollable,
      isLoading: this.isLoading,
      loadMore: this.loadMore
    };
  }

  api = new Proxy(this, {
    get(target, key) {
      return target._api[key];
    },
    set() {}
  });
}
