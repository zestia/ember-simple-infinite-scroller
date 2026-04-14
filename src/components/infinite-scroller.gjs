/* eslint-disable ember/no-runloop */

import Component from '@glimmer/component';
import { resolve } from 'rsvp';
import { debounce, cancel } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { isPresent } from '@ember/utils';
const { round } = Math;
const START = 'START';
const END = 'END';

export default class InfiniteScrollerComponent extends Component {
  @tracked isLoading = false;
  @tracked scrollState = {};
  @tracked lastScrollState = {};

  debug = false;
  scroller;
  debounceId;

  setScroller = modifier((element, [positionalElement]) => {
    this._registerScroller(positionalElement ?? element);

    return () => this._deregisterScroller();
  });

  get axis() {
    return this.args.axis ?? 'vertical';
  }

  get debounce() {
    return this.args.debounce ?? 100;
  }

  get shouldLoadMore() {
    if (this.isLoading) {
      return false;
    }

    if (
      isPresent(this.args.percentEnd) &&
      this.scrollState.direction === END &&
      this.scrollState.percentScrolled >= this.args.percentEnd
    ) {
      return true;
    }

    if (
      isPresent(this.args.percentStart) &&
      this.scrollState.direction === START &&
      this.scrollState.percentScrolled <= this.args.percentStart
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

  handleScroll = () => {
    this.debounceId = debounce(this, '_checkShouldLoadMore', this.debounce);
  };

  loadMore = (direction) => {
    this.isLoading = true;

    resolve(this.args.onLoadMore?.(direction)).finally(() => {
      this.isLoading = false;
    });
  };

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
    this.observer.observe(this.scroller, { childList: true, subtree: true });
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
    const horizontal = this.axis === 'horizontal';
    const scrollOffset = horizontal ? element.scrollLeft : element.scrollTop;
    const scrollSize = horizontal ? element.scrollWidth : element.scrollHeight;
    const clientSize = horizontal ? element.clientWidth : element.clientHeight;
    const isScrollable = scrollSize > clientSize;
    const maxScroll = scrollSize - clientSize;
    const scrollRatio = maxScroll === 0 ? 0 : scrollOffset / maxScroll;
    const percentScrolled = round(scrollRatio * 100);
    const lastScrollOffset = this.lastScrollState.scrollOffset ?? 0;
    const scrollingEnd = scrollOffset > lastScrollOffset;
    const scrollingStart = scrollOffset < lastScrollOffset;
    const direction = scrollingEnd ? END : scrollingStart ? START : null;

    return {
      isScrollable,
      scrollSize,
      clientSize,
      scrollOffset,
      maxScroll,
      percentScrolled,
      direction
    };
  }

  get _api() {
    return {
      isScrollable: this.scrollState.isScrollable,
      direction: this.scrollState.direction,
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
