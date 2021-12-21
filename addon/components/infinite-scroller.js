import Component from '@glimmer/component';
import { resolve } from 'rsvp';
import { debounce, cancel } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import Modifier from 'ember-modifier';
const { round } = Math;

function setElement(component) {
  return class extends Modifier {
    didInstall() {
      component.registerScroller(this.args.positional[0] ?? this.element);
    }

    willDestroy() {
      super.willDestroy();
      component.deregisterScroller();
    }
  };
}

export default class InfiniteScrollerComponent extends Component {
  debug = false;
  scroller = null;
  debounceId = null;

  @tracked isLoading = false;
  @tracked isScrollable = false;

  setElement = setElement(this);

  get api() {
    return {
      setElement: this._setElement,
      isScrollable: this.isScrollable,
      isLoading: this.isLoading,
      loadMore: this.loadMore
    };
  }

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

  handleScroll = () => {
    this.debounceId = debounce(this, '_checkShouldLoadMore', this.debounce);
  };

  loadMore = () => {
    this.isLoading = true;

    resolve(this.args.onLoadMore?.()).finally(() => {
      this.isLoading = false;

      this._checkScrollable();
    });
  };

  // TODO: Expose the `setElement` modifier
  // Issue: https://github.com/ember-modifier/ember-modifier/issues/78
  _setElement = (element) => {
    if (this.scroller) {
      this.deregisterScroller();
    }

    this.registerScroller(element);
  };

  registerScroller(element) {
    console.log('register', element);
    this.scroller = element;

    this._checkScrollable();
    this._startListening();
  }

  deregisterScroller() {
    console.log('deregister', this.scroller);
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
}
