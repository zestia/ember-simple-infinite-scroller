import Component from '@glimmer/component';
import { resolve } from 'rsvp';
import { debounce, cancel } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { isPresent } from '@ember/utils';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { g, i } from 'decorator-transforms/runtime-esm';

/* eslint-disable ember/no-runloop */
const {
  round
} = Math;
const START = 'START';
const END = 'END';
class InfiniteScrollerComponent extends Component {
  static {
    g(this.prototype, "isLoading", [tracked], function () {
      return false;
    });
  }
  #isLoading = (i(this, "isLoading"), void 0);
  static {
    g(this.prototype, "scrollState", [tracked], function () {
      return {};
    });
  }
  #scrollState = (i(this, "scrollState"), void 0);
  static {
    g(this.prototype, "lastScrollState", [tracked], function () {
      return {};
    });
  }
  #lastScrollState = (i(this, "lastScrollState"), void 0);
  debug = false;
  scroller;
  scrollId;
  resizeId;
  setScroller = modifier((element, [positionalElement]) => {
    this.#registerScroller(positionalElement ?? element);
    return () => this.#deregisterScroller();
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
    if (isPresent(this.args.percentEnd) && this.scrollState.direction === END && this.scrollState.percentScrolled >= this.args.percentEnd) {
      return true;
    }
    if (isPresent(this.args.percentStart) && this.scrollState.direction === START && this.scrollState.percentScrolled <= this.args.percentStart) {
      return true;
    }
    return false;
  }
  #handleScroll = () => {
    this.scrollId = debounce(this, this.#checkShouldLoadMore, this.debounce);
  };
  #handleMutate = () => {
    this.#checkScrollable();
  };
  #handleResize = () => {
    this.resizeId = debounce(this, this.#checkScrollable, this.debounce);
  };
  loadMore = direction => {
    this.isLoading = true;
    resolve(this.args.onLoadMore?.(direction)).finally(() => {
      this.isLoading = false;
    });
  };
  #registerScroller(element) {
    this.scroller = element;
    this.#startListening();
    this.#checkScrollable();
  }
  #deregisterScroller() {
    this.#stopListening();
    cancel(this.scrollId);
    cancel(this.resizeId);
    this.scroller = null;
  }
  #startListening() {
    this.scroller.addEventListener('scroll', this.#handleScroll);
    this.mutationObserver = new MutationObserver(this.#handleMutate);
    this.mutationObserver.observe(this.scroller, {
      childList: true,
      subtree: true
    });
    this.resizeObserver = new ResizeObserver(this.#handleResize);
    this.resizeObserver.observe(this.scroller);
  }
  #stopListening() {
    this.scroller.removeEventListener('scroll', this.#handleScroll);
    this.mutationObserver.disconnect();
    this.resizeObserver.disconnect();
  }
  #checkShouldLoadMore() {
    this.lastScrollState = this.scrollState;
    this.scrollState = this.#getScrollState();
    this.#debug();
    if (this.shouldLoadMore) {
      this.loadMore(this.scrollState.direction);
    }
  }
  #checkScrollable() {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }
    this.scrollState = this.#getScrollState();
  }
  #debug() {
    if (!this.debug) {
      return;
    }
    const state = {
      ...this.scrollState,
      shouldLoadMore: this.shouldLoadMore
    };
    console.table([state]); // eslint-disable-line
  }
  #getScrollState() {
    const element = this.scroller;
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
    const unchanged = this.lastScrollState.direction ?? null;
    const direction = scrollingEnd ? END : scrollingStart ? START : unchanged;
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
  get #api() {
    return {
      isScrollable: this.scrollState.isScrollable,
      direction: this.scrollState.direction,
      isLoading: this.isLoading,
      loadMore: this.loadMore
    };
  }
  api = new Proxy(this, {
    get(target, key) {
      return target.#api[key];
    },
    set() {}
  });
  static {
    setComponentTemplate(precompileTemplate("<div class=\"infinite-scroller\" data-loading=\"{{this.isLoading}}\" data-scrollable=\"{{this.scrollState.isScrollable}}\" ...attributes {{this.setScroller @element}}>\n  {{yield this.api}}\n</div>", {
      strictMode: true
    }), this);
  }
}

export { InfiniteScrollerComponent as default };
//# sourceMappingURL=infinite-scroller.js.map
