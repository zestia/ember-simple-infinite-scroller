import Component from '@glimmer/component';
import { resolve } from 'rsvp';
import { debounce, cancel } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { action } from '@ember/object';
const { round } = Math;
const UP = 'UP';
const DOWN = 'DOWN';

export default class InfiniteScrollerComponent extends Component {
  @tracked isLoading = false;
  @tracked scrollState = {};
  @tracked lastScrollState = {};

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

  get shouldLoadMore() {
    return this.scrollState.reachedBottom && !this.isLoading;
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

    this._debug();
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
    const percent = this.percent;
    const percentScrolled = round((scrollTop / bottom) * 100);
    const reachedBottom = percentScrolled >= percent;
    const scrollingDown = element.scrollTop > this.lastScrollState.scrollTop;
    const direction = scrollingDown ? DOWN : UP;

    return {
      isScrollable,
      scrollHeight,
      clientHeight,
      scrollTop,
      bottom,
      percent,
      percentScrolled,
      reachedBottom,
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
