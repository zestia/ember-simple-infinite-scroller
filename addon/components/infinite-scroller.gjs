import Component from '@glimmer/component';
import { resolve } from 'rsvp';
import { debounce, cancel } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { action } from '@ember/object';
import { isPresent } from '@ember/utils';
const { round } = Math;
const UP = 'UP';
const DOWN = 'DOWN';

export default class InfiniteScrollerComponent extends Component {
  @tracked isLoading = false;
  @tracked scrollState = {};
  @tracked lastScrollState = {};

  debug = false;
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

  get shouldLoadMore() {
    if (this.isLoading) {
      return false;
    }

    if (
      isPresent(this.args.percentDown) &&
      this.scrollState.direction === DOWN &&
      this.scrollState.percentScrolled >= this.args.percentDown
    ) {
      return true;
    }

    if (
      isPresent(this.args.percentUp) &&
      this.scrollState.direction === UP &&
      this.scrollState.percentScrolled <= this.args.percentUp
    ) {
      return true;
    }

    return false;
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
  loadMore(direction) {
    this.isLoading = true;

    resolve(this.args.onLoadMore?.(direction)).finally(() => {
      this.isLoading = false;
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
    this.observer = new MutationObserver(this._checkScrollable.bind(this));
    this.observer.observe(this.scroller, { childList: true });
  }

  _stopListening() {
    this.scroller.removeEventListener('scroll', this.handleScroll);
    this.observer.disconnect();
  }

  _checkShouldLoadMore() {
    this.lastScrollState = this.scrollState;
    this.scrollState = this._getScrollState();

    this._debug();

    if (this.shouldLoadMore) {
      this.loadMore(this.scrollState.direction);
    }
  }

  _checkScrollable() {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    this.scrollState = this._getScrollState();
  }

  _debug() {
    if (!this.debug) {
      return;
    }

    const state = {
      ...this.scrollState,
      shouldLoadMore: this.shouldLoadMore
    };

    console.table([state]); // eslint-disable-line
  }

  _getScrollState() {
    const element = this.normalisedScrollerElement;
    const scrollHeight = element.scrollHeight;
    const scrollTop = element.scrollTop;
    const clientHeight = element.clientHeight;
    const isScrollable = scrollHeight > clientHeight;
    const bottom = scrollHeight - clientHeight;
    const percentScrolled = round((scrollTop / bottom) * 100);
    const scrollingDown = element.scrollTop > this.lastScrollState.scrollTop;
    const scrollingUp = element.scrollTop < this.lastScrollState.scrollTop;
    const direction = scrollingDown ? DOWN : scrollingUp ? UP : null;

    return {
      isScrollable,
      scrollHeight,
      clientHeight,
      scrollTop,
      bottom,
      percentScrolled,
      direction
    };
  }

  get _api() {
    return {
      isScrollable: this.scrollState.isScrollable,
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

  <template>
    <div
      class="infinite-scroller"
      data-loading="{{this.isLoading}}"
      data-scrollable="{{this.scrollState.isScrollable}}"
      ...attributes
      {{this.setScroller @element}}
    >
      {{yield this.api}}
    </div>
  </template>
}
