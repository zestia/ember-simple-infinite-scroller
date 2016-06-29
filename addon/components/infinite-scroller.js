import Component from 'ember-component';
import layout from '../templates/components/infinite-scroller';
import { guidFor } from 'ember-metal/utils';
import { bind, debounce } from 'ember-runloop';
import RSVP from 'rsvp';
import inject from 'ember-service/inject';
const { round } = Math;

export default Component.extend({
  layout,
  classNames: ['infinite-scroller'],
  classNameBindings: ['isLoading'],

  _infiniteScroller: inject('-infinite-scroller'),

  init() {
    this._super(...arguments);
    this.set('scrollEventName', 'scroll.' + guidFor(this));
  },

  didInsertElement() {
    this._super(...arguments);
    this.$scroller().on(this.get('scrollEventName'), args => {
      debounce(this, '_scrollingElement', args, this._scrollDebounce());
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$scroller().off(this.get('scrollEventName'));
  },

  _scrollDebounce() {
    return this.getAttr('scroll-debounce') || 100;
  },

  $scroller() {
    if (this.getAttr('use-document')) {
      return this.get('_infiniteScroller').$document();
    } else {
      return this.$();
    }
  },

  _scrollerHeight() {
    if (this.getAttr('use-document')) {
      return this.get('_infiniteScroller').$window().height();
    } else {
      return this.$scroller().height();
    }
  },

  _scrollableHeight() {
    if (this.getAttr('use-document')) {
      return this.get('_infiniteScroller').$document().height();
    } else {
      return this.get('element').scrollHeight;
    }
  },

  _scrollTop() {
    if (this.getAttr('use-document')) {
      return this.get('_infiniteScroller').$document().scrollTop();
    } else {
      return this.$().scrollTop();
    }
  },

  _scrollerBottom() {
    return this._scrollableHeight() - this._scrollerHeight();
  },

  _scrollPercentage() {
    return round(this._scrollTop() / this._scrollerBottom() * 100);
  },

  _triggerAt() {
    return parseInt(this.getAttr('trigger-at') || '100%', 10);
  },

  _reachedBottom() {
    return this._scrollPercentage() >= this._triggerAt();
  },

  _shouldLoadMore() {
    return this._reachedBottom() && !this.get('isLoading');
  },

  _scrollingElement() {
    if (this._shouldLoadMore()) {
      this._loadMore();
    }
  },

  _loadMore() {
    this.set('error', null);
    this.set('isLoading', true);
    RSVP.resolve(this.getAttr('on-load-more')())
      .catch(bind(this, '_loadError'))
      .finally(bind(this, '_loadFinished'));
  },

  _loadError(error) {
    if (this.get('isDestroyed')) {
      return;
    }
    this.set('error', error);
  },

  _loadFinished() {
    if (this.get('isDestroyed')) {
      return;
    }
    this.set('isLoading', false);
  },

  actions: {
    loadMore() {
      this._loadMore();
    }
  }
});