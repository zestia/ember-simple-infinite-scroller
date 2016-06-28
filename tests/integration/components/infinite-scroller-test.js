import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import RSVP from 'rsvp';
import jQuery from 'jquery';
import { later } from 'ember-runloop';
import generateThings from 'dummy/utils/generate-things';
import wait from 'ember-test-helpers/wait';


moduleForComponent('infinite-scroller', 'Integration | Component | infinite scroller', {
  integration: true,
  beforeEach() {
    this.inject.service('-infinite-scroller', { as: 'infiniteScroller' });
  }
});


test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`{{infinite-scroller}}`);

  assert.equal(this.$('.infinite-scroller').length, 1,
    'infinite scroller component has an appropriate class name');
});


test('load more action', function(assert) {
  assert.expect(2);

  this.set('things', generateThings(1, 20));

  this.on('loadMore', () => {
    this.get('things').pushObjects(generateThings(21, 40));
  });

  this.render(hbs`
    {{#infinite-scroller class="example-1" on-load-more=(action 'loadMore') as |scroller|}}
      {{#each things as |thing|}}
        <div class="thing">{{thing.name}}</div>
      {{/each}}
    {{/infinite-scroller}}
  `);

  this.$('.infinite-scroller').scrollTop(450);

  later(() => {
    assert.equal(this.$('.thing').length, 20,
      'has not fired load more action due to debouncing of scroll event');
  }, 100);

  return wait().then(() => {
    assert.equal(this.$('.thing').length, 40,
      'fires load more action at the element scroll boundary');
  });
});


test('load more action (trigger-at)', function(assert) {
  assert.expect(1);

  this.set('things', generateThings(1, 20));

  this.on('loadMore', () => {
    this.get('things').pushObjects(generateThings(21, 40));
  });

  this.render(hbs`
    {{#infinite-scroller class="example-1" trigger-at='50%' on-load-more=(action 'loadMore') as |scroller|}}
      {{#each things as |thing|}}
        <div class="thing">{{thing.name}}</div>
      {{/each}}
    {{/infinite-scroller}}
  `);

  this.$('.infinite-scroller').scrollTop(225);

  return wait().then(() => {
    assert.equal(this.$('.thing').length, 40,
      'fires load more action at the custom element scroll boundary');
  });
});


test('load more action (scroll-debounce)', function(assert) {
  assert.expect(2);

  this.set('things', generateThings(1, 20));

  this.on('loadMore', () => {
    this.get('things').pushObjects(generateThings(21, 40));
  });

  this.render(hbs`
    {{#infinite-scroller class="example-1" scroll-debounce=50 on-load-more=(action 'loadMore') as |scroller|}}
      {{#each things as |thing|}}
        <div class="thing">{{thing.name}}</div>
      {{/each}}
    {{/infinite-scroller}}
  `);

  this.$('.infinite-scroller').scrollTop(450);

  later(() => {
    assert.equal(this.$('.thing').length, 20,
      'has not fired load more action due to custom debouncing of scroll event');
  }, 50);

  return wait().then(() => {
    assert.equal(this.$('.thing').length, 40,
      'fires load more action after being debounced');
  });
});


test('load more action (use-document)', function(assert) {
  assert.expect(1);

  let $window = {
    height() {
      return 500;
    }
  };

  let $document = jQuery('<div/>', {
    css: {
      maxHeight: 1000,
      overflow: 'scroll'
    }
  });

  let $spacer = jQuery('<div/>', {
    css: {
      height: 2000,
    }
  });

  $document.append($spacer);
  jQuery('body').append($document);

  this.get('infiniteScroller').$window   = () => $window;
  this.get('infiniteScroller').$document = () => $document;

  this.set('things', generateThings(1, 10));

  this.on('loadMore', () => {
    this.get('things').pushObjects(generateThings(11, 20));
  });

  this.render(hbs`
    {{#infinite-scroller use-document=true on-load-more=(action 'loadMore') as |scroller|}}
      {{#each things as |thing|}}
        <div class="thing">{{thing.name}}</div>
      {{/each}}
    {{/infinite-scroller}}
  `);

  this.get('infiniteScroller').$document().scrollTop(500).trigger('scroll');

  return wait().then(() => {
    assert.equal(this.$('.thing').length, 20,
      'fires load more action at the window scroll boundary');
  });
});


test('loading class name', function(assert) {
  assert.expect(3);

  let willLoad = RSVP.defer();

  this.on('loadMore', () => {
    return willLoad.promise;
  });

  this.render(hbs`
    {{#infinite-scroller on-load-more=(action 'loadMore') as |scroller|}}
      <button onclick={{action scroller.loadMore}}>Load more</button>
    {{/infinite-scroller}}
  `);

  assert.equal(this.$('.infinite-scroller.is-loading').length, 0,
    'precondition: is not loading');

  this.$('button').trigger('click');

  assert.equal(this.$('.infinite-scroller.is-loading').length, 1,
    'a loading class is added whilst the action is being performed');

  willLoad.resolve();

  return wait().then(() => {
    assert.equal(this.$('.infinite-scroller.is-loading').length, 0,
      'loading class name is removed after the action resolves');
  });
});


test('yielded loading state', function(assert) {
  assert.expect(3);

  let willLoad = RSVP.defer();

  this.on('loadMore', () => {
    return willLoad.promise;
  });

  this.render(hbs`
    {{#infinite-scroller on-load-more=(action 'loadMore') as |scroller|}}
      {{#if scroller.isLoading}}
        <p>Please wait...</p>
      {{/if}}
      <button onclick={{action scroller.loadMore}}>Load more</button>
    {{/infinite-scroller}}
  `);

  assert.ok(!this.$().html().match('Please wait..'),
    'precondition: is not loading');

  this.$('button').trigger('click');

  assert.ok(this.$().html().match('Please wait..'),
    'yields a hash with the loading state');

  willLoad.resolve();

  return wait().then(() => {
    assert.ok(!this.$().html().match('Please wait..'),
      'loading state is updated');
  });
});


test('yielded error', function(assert) {
  assert.expect(2);

  this.on('loadMore', () => {
    return RSVP.reject(new Error('Fail'));
  });

  this.render(hbs`
    {{#infinite-scroller on-load-more=(action 'loadMore') as |scroller|}}
      {{#if scroller.error}}
        <p>{{scroller.error.message}}</p>
      {{/if}}
      <button onclick={{action scroller.loadMore}}>Load more</button>
    {{/infinite-scroller}}
  `);

  assert.ok(!this.$().html().match('Fail'),
    'precondition: no error message');

  this.$('button').trigger('click');

  assert.ok(this.$().html().match('Fail'),
    'yields a hash with the last rejection error');
});


test('yielded loadMore action', function(assert) {
  assert.expect(2);

  this.on('loadMore', () => {
    this.set('things', generateThings(1, 5));
    return RSVP.resolve();
  });

  this.render(hbs`
    {{#infinite-scroller on-load-more=(action 'loadMore') as |scroller|}}
      {{#each things as |thing|}}
        <div class="thing">{{thing.name}}</div>
      {{/each}}
      <button onclick={{action scroller.loadMore}}>Load more</button>
    {{/infinite-scroller}}
  `);

  assert.equal(this.$('.thing').length, 0,
    'precondition: no things rendered');

  this.$('button').trigger('click');

  assert.equal(this.$('.thing').length, 5,
    'yields an action that can trigger the load more action');
});


test('destroying (does not blow up)', function(assert) {
  assert.expect(0);

  this.set('showScroller', true);

  let willLoad = RSVP.defer();

  this.on('loadMore', () => {
    this.set('showScroller', false);
    return willLoad.promise;
  });

  this.render(hbs`
    {{#if showScroller}}
      {{#infinite-scroller on-load-more=(action 'loadMore') as |scroller|}}
        <button onclick={{action scroller.loadMore}}>Load more</button>
      {{/infinite-scroller}}
    {{/if}}
  `);

  this.$('button').trigger('click');

  willLoad.resolve();

  return wait();
});


test('no promise (does not blow up)', function(assert) {
  assert.expect(0);

  this.on('loadMore', () => {
    return null;
  });

  this.render(hbs`
    {{#infinite-scroller on-load-more=(action 'loadMore') as |scroller|}}
      <button onclick={{action scroller.loadMore}}>Load more</button>
    {{/infinite-scroller}}
  `);

  this.$('button').trigger('click');

  return wait();
});
