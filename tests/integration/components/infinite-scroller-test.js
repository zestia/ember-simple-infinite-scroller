import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { defer } from 'rsvp';
import { later } from '@ember/runloop';
import generateThings from 'dummy/utils/generate-things';
import { modifier } from 'ember-modifier';
import { scrollToPercentage } from '@zestia/ember-simple-infinite-scroller/test-support/helpers';
import {
  render,
  settled,
  click,
  setupOnerror,
  resetOnerror
} from '@ember/test-helpers';
const { keys, isSealed } = Object;

module('infinite-scroller', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function (assert) {
    this.handleLoadMore = () => {
      assert.step('load more');
      this.willLoad = defer();
      return this.willLoad.promise;
    };
  });

  test('it renders', async function (assert) {
    assert.expect(1);

    await render(hbs`<InfiniteScroller />`);

    assert.dom('.infinite-scroller').exists('has an appropriate class name');
  });

  test('scrollable class', async function (assert) {
    assert.expect(2);

    this.things = generateThings(1, 20);

    await render(hbs`
      <InfiniteScroller class="example-1">
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    assert.dom('.infinite-scroller').hasAttribute('data-scrollable', 'true');

    await render(hbs`<InfiniteScroller class="example-1" />`);

    assert.dom('.infinite-scroller').hasAttribute('data-scrollable', 'false');
  });

  test('load more action (success)', async function (assert) {
    assert.expect(3);

    this.things = generateThings(1, 20);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @onLoadMore={{this.handleLoadMore}}
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    const promise = scrollToPercentage('.infinite-scroller', 100);

    later(() => {
      assert.verifySteps(
        [],
        'has not fired load more action due to debouncing of scroll event'
      );
    }, 100);

    await promise;

    assert.verifySteps(['load more']);
  });

  test('load more action (failure)', async function (assert) {
    assert.expect(3);

    const example = new Error();
    example.message = 'example failure';

    setupOnerror((error) => {
      if (error === example) {
        return;
      }

      throw error;
    });

    this.things = generateThings(1, 20);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @onLoadMore={{this.handleLoadMore}}
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    await scrollToPercentage('.infinite-scroller', 100);

    this.willLoad.reject(example);

    await settled();

    assert
      .dom('.infinite-scroller')
      .hasAttribute(
        'data-loading',
        'false',
        'is no longer considered loading if loading fails'
      );

    assert.verifySteps(['load more']);

    resetOnerror();
  });

  test('load more action (whilst loading)', async function (assert) {
    assert.expect(2);

    this.things = generateThings(1, 20);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @onLoadMore={{this.handleLoadMore}}
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    await scrollToPercentage('.infinite-scroller', 100);
    await scrollToPercentage('.infinite-scroller', 100);

    assert.verifySteps(['load more'], 'does not fire if already loading');
  });

  test('load more action (percent)', async function (assert) {
    assert.expect(3);

    this.things = generateThings(1, 20);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @percent={{60}}
        @onLoadMore={{this.handleLoadMore}}
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    await scrollToPercentage('.infinite-scroller', 59);

    assert.verifySteps([], 'not scrolled enough');

    await scrollToPercentage('.infinite-scroller', 60);

    assert.verifySteps(['load more']);
  });

  test('load more action (debounce)', async function (assert) {
    assert.expect(3);

    this.things = generateThings(1, 20);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @debounce={{50}}
        @onLoadMore={{this.handleLoadMore}}
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    const promise = scrollToPercentage('.infinite-scroller', 100);

    later(() => {
      assert.verifySteps([], 'not fired yet');
    }, 50);

    await promise;

    assert.verifySteps(
      ['load more'],
      'fires load more action after being debounced'
    );
  });

  test('load more action (document)', async function (assert) {
    assert.expect(2);

    this.document = document;

    await render(hbs`
    {{! template-lint-disable no-forbidden-elements }}
    <style>
      /*
      We want to test that the scroll event fires on the document,
      so the document must be scrollable, make it so by 1px.
      */

      :root {
        height: calc(100vh + 1px);
      }
      </style>

      <InfiniteScroller
        class="example-2"
        @element={{this.document}}
        @onLoadMore={{this.handleLoadMore}}
      />
    `);

    await scrollToPercentage(document.documentElement, 100);

    assert.verifySteps(['load more']);
  });

  test('loading class name', async function (assert) {
    assert.expect(5);

    this.things = generateThings(1, 20);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @onLoadMore={{this.handleLoadMore}}
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    assert
      .dom('.infinite-scroller')
      .hasAttribute('data-loading', 'false', 'precondition: is not loading');

    await scrollToPercentage('.infinite-scroller', 100);

    assert
      .dom('.infinite-scroller')
      .hasAttribute(
        'data-loading',
        'true',
        'a loading class is added whilst the action is being performed'
      );

    this.willLoad.resolve();

    await settled();

    assert
      .dom('.infinite-scroller')
      .hasAttribute(
        'data-loading',
        'false',
        'loading class name is removed after the action resolves'
      );

    assert.verifySteps(['load more']);
  });

  test('yielded loadMore action', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <InfiniteScroller
        @onLoadMore={{this.handleLoadMore}} as |scroller|
      >
        <button type="button" {{on "click" scroller.loadMore}}>
          Load more
        </button>
      </InfiniteScroller>
    `);

    await click('button');

    assert.verifySteps(['load more']);
  });

  test('yielded loading state', async function (assert) {
    assert.expect(5);

    this.things = generateThings(1, 20);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @onLoadMore={{this.handleLoadMore}} as |scroller|
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}

        Loading: {{scroller.isLoading}}
      </InfiniteScroller>
    `);

    assert
      .dom('.infinite-scroller')
      .containsText('Loading: false', 'precondition: not loading');

    await scrollToPercentage('.infinite-scroller', 100);

    assert
      .dom('.infinite-scroller')
      .containsText('Loading: true', 'yields a hash with the loading state');

    this.willLoad.resolve();

    await settled();

    assert
      .dom('.infinite-scroller')
      .containsText('Loading: false', 'loading state is updated');

    assert.verifySteps(['load more']);
  });

  test('destroying (does not blow up)', async function (assert) {
    assert.expect(2);

    this.things = generateThings(1, 20);

    this.show = true;

    await render(hbs`
      {{#if this.show}}
        <InfiniteScroller
          class="example-1"
          @onLoadMore={{this.handleLoadMore}}
        >
          {{#each this.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      {{/if}}
    `);

    await scrollToPercentage('.infinite-scroller', 100);

    this.set('show', false);

    this.willLoad.resolve();

    assert.verifySteps(['load more']);
  });

  test('no promise (does not blow up)', async function (assert) {
    assert.expect(0);

    this.handleLoadMore = () => null;

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @onLoadMore={{this.handleLoadMore}}
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    await scrollToPercentage('.infinite-scroller', 100);
  });

  test('destroying during debounce (does not blow up)', async function (assert) {
    assert.expect(1);

    this.show = true;

    await render(hbs`
      {{#if this.show}}
        <InfiniteScroller
          class="example-1"
          @debounce={{50}}
          @onLoadMore={{this.handleLoadMore}}
        >
          {{#each this.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      {{/if}}
    `);

    const promise = scrollToPercentage('.infinite-scroller', 100);

    later(() => {
      this.set('show', false);
    }, 25);

    await promise;

    assert.verifySteps([]);
  });

  test('is scrollable', async function (assert) {
    assert.expect(4);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @onLoadMore={{this.handleLoadMore}} as |scroller|
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}

        {{#unless scroller.isScrollable}}
          <button
            type="button"
            {{on "click" scroller.loadMore}}
          >
            Load more
          </button>
        {{/unless}}
      </InfiniteScroller>
    `);

    assert
      .dom('button')
      .exists(
        'load more button shows because infinite scroller component ' +
          'determined that there is no scroll movement available'
      );

    await click('button');

    this.set('things', generateThings(1, 20));

    this.willLoad.resolve();

    await settled();

    assert
      .dom('button')
      .doesNotExist(
        'infinite scroller component re-computes whether or not there is scroll movement available'
      );

    assert.verifySteps(['load more']);
  });

  test('custom element via element argument', async function (assert) {
    assert.expect(4);

    this.things = generateThings(1, 20);

    this.setDiv1 = modifier((element) => this.set('div1', element), {
      eager: false
    });

    this.setDiv2 = modifier((element) => this.set('div2', element), {
      eager: false
    });

    await render(hbs`
      <div class="external-element one" {{this.setDiv1}}>
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </div>

      <div class="external-element two" {{this.setDiv2}}>
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </div>

      <InfiniteScroller
        @element={{this.customElement}}
        @onLoadMore={{this.handleLoadMore}}
      />
    `);

    this.set('customElement', this.div1);

    await scrollToPercentage('.external-element.one', 100);

    assert.verifySteps(['load more']);

    this.willLoad.resolve();

    this.set('customElement', this.div2);

    await scrollToPercentage('.external-element.two', 100);

    assert.verifySteps(
      ['load more'],
      'load action fires again, because scrollable element has been re-registered'
    );
  });

  test('api', async function (assert) {
    assert.expect(2);

    this.capture = (api) => (this.api = api);

    await render(hbs`
      <InfiniteScroller as |scroller|>
        {{this.capture scroller}}
      </InfiniteScroller>
    `);

    assert.deepEqual(keys(this.api), ['isScrollable', 'isLoading', 'loadMore']);
    assert.true(isSealed(this.api));
  });
});
