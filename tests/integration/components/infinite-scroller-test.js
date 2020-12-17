import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { defer, reject } from 'rsvp';
import { later } from '@ember/runloop';
import generateThings from 'dummy/utils/generate-things';
import {
  render,
  settled,
  triggerEvent,
  find,
  findAll,
  click,
  waitFor,
  waitUntil
} from '@ember/test-helpers';

module('infinite-scroller', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.loadMoreCount = 0;
    this.things = generateThings(1, 20);

    this.handleLoadMore = () => {
      this.loadMoreCount++;
      this.things.pushObjects(generateThings(21, 40));
    };
  });

  test('it renders', async function (assert) {
    assert.expect(1);

    await render(hbs`<InfiniteScroller />`);

    assert.dom('.infinite-scroller').exists('has an appropriate class name');
  });

  test('scrollable class', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <InfiniteScroller class="example-1">
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    assert.dom('.infinite-scroller').hasClass('infinite-scroller--scrollable');

    await render(hbs`<InfiniteScroller class="example-1" />`);

    assert
      .dom('.infinite-scroller')
      .doesNotHaveClass('infinite-scroller--scrollable');
  });

  test('load more action', async function (assert) {
    assert.expect(2);

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

    find('.infinite-scroller').scrollTop = 450;

    later(() => {
      assert
        .dom('.thing')
        .exists(
          { count: 20 },
          'has not fired load more action due to debouncing of scroll event'
        );
    }, 100);

    await waitUntil(() => findAll('.thing').length === 40);

    assert.equal(
      this.loadMoreCount,
      1,
      'fires load more action at the element scroll boundary'
    );
  });

  test('load more action (whilst loading)', async function (assert) {
    assert.expect(1);

    this.handleSlowLoadMore = () => {
      this.handleLoadMore();
      return new Promise((resolve) => later(resolve, 1000));
    };

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @onLoadMore={{this.handleSlowLoadMore}}
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    find('.infinite-scroller').scrollTop = 450;

    await waitUntil(() => findAll('.thing').length === 40);

    find('.infinite-scroller').scrollTop = 1200;

    await settled();

    assert.equal(
      this.loadMoreCount,
      1,
      'does not fire load more action if already loading more'
    );
  });

  test('load more action (leeway)', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @leeway="50%"
        @onLoadMore={{this.handleLoadMore}}
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    find('.infinite-scroller').scrollTop = 225;

    await waitUntil(() => findAll('.thing').length === 40);

    assert.equal(
      this.loadMoreCount,
      1,
      'fires load more action at the custom element scroll boundary'
    );
  });

  test('load more action (debounce)', async function (assert) {
    assert.expect(3);

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

    find('.infinite-scroller').scrollTop = 450;

    later(() => {
      assert.equal(this.loadMoreCount, 0, 'not fired yet');

      assert
        .dom('.thing')
        .exists(
          { count: 20 },
          'has not fired action due to custom debouncing of scroll event'
        );
    }, 50);

    await waitUntil(() => findAll('.thing').length === 40);

    assert.equal(
      this.loadMoreCount,
      1,
      'fires load more action after being debounced'
    );
  });

  test('load more action (document)', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <InfiniteScroller
        class="example-2"
        @element={{this.document}}
        @onLoadMore={{this.handleLoadMore}}
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    await triggerEvent(document, 'scroll');

    assert.equal(this.loadMoreCount, 0, 'load more action not fired yet');

    await triggerEvent(document, 'scroll');

    assert.equal(
      this.loadMoreCount,
      1,
      'load more action fires when the bottom of the element comes into view'
    );
  });

  test('loading class name', async function (assert) {
    assert.expect(3);

    const willLoad = defer();

    this.handleLoadMore = () => willLoad.promise;

    await render(hbs`
      <InfiniteScroller
        @onLoadMore={{this.handleLoadMore}} as |scroller|
      >
        <button type="button" {{on "click" scroller.loadMore}}>
          Load more
        </button>
      </InfiniteScroller>
    `);

    assert
      .dom('.infinite-scroller')
      .doesNotHaveClass(
        'infinite-scroller--loading',
        'precondition: is not loading'
      );

    await click('button');

    assert
      .dom('.infinite-scroller')
      .hasClass(
        'infinite-scroller--loading',
        'a loading class is added whilst the action is being performed'
      );

    willLoad.resolve();

    await settled();

    assert
      .dom('.infinite-scroller')
      .doesNotHaveClass(
        'infinite-scroller--loading',
        'loading class name is removed after the action resolves'
      );
  });

  test('yielded loading state', async function (assert) {
    assert.expect(3);

    const willLoad = defer();

    this.handleLoadMore = () => willLoad.promise;

    await render(hbs`
      <InfiniteScroller
        @onLoadMore={{this.handleLoadMore}} as |scroller|
      >
        <span>{{scroller.isLoading}}</span>

        <button type="button" {{on "click" scroller.loadMore}}>
          Load more
        </button>
      </InfiniteScroller>
    `);

    assert.dom('span').hasText('false', 'precondition: not loading');

    click('button');

    await waitFor('.infinite-scroller');

    assert.dom('span').hasText('true', 'yields a hash with the loading state');

    willLoad.resolve();

    await settled();

    assert.dom('span').hasText('false', 'loading state is updated');
  });

  test('yielded error', async function (assert) {
    assert.expect(2);

    this.handleLoadMore = () => reject(new Error('Fail'));

    await render(hbs`
      <InfiniteScroller
        @onLoadMore={{this.handleLoadMore}} as |scroller|
      >
        {{#if scroller.error}}
          <p>{{scroller.error.message}}</p>
        {{/if}}

        <button type="button" {{on "click" scroller.loadMore}}>
          Load more
        </button>
      </InfiniteScroller>
    `);

    assert
      .dom('.infinite-scroller')
      .doesNotContainText('Fail', 'precondition: no error message');

    await click('button');

    assert
      .dom('.infinite-scroller')
      .containsText('Fail', 'yields a hash with the last rejection error');
  });

  test('yielded loadMore action', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <InfiniteScroller
        @onLoadMore={{this.handleLoadMore}} as |scroller|
      >
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}

        <button type="button" {{on "click" scroller.loadMore}}>
          Load more
        </button>
      </InfiniteScroller>
    `);

    await click('button');

    assert
      .dom('.thing')
      .exists(
        { count: 40 },
        'yields an action that can trigger the load more action'
      );
  });

  test('destroying (does not blow up)', async function (assert) {
    assert.expect(0);

    this.showScroller = true;

    const willLoad = defer();

    this.handleLoadMore = () => {
      this.set('showScroller', false);
      return willLoad.promise;
    };

    await render(hbs`
      {{#if this.showScroller}}
        <InfiniteScroller
          @onLoadMore={{this.handleLoadMore}} as |scroller|
        >
          <button type="button" {{on "click" scroller.loadMore}}>
            Load more
          </button>
        </InfiniteScroller>
      {{/if}}
    `);

    await click('button');

    willLoad.resolve();
  });

  test('no promise (does not blow up)', async function (assert) {
    assert.expect(0);

    this.handleLoadMore = () => null;

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
  });

  test('destroying during debounce (does not blow up)', async function (assert) {
    assert.expect(0);

    this.show = true;

    this.handleLoadMore = () => null;

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

    find('.infinite-scroller').scrollTop = 450;

    later(() => {
      this.set('show', false);
    }, 25);
  });

  test('custom element', async function (assert) {
    assert.expect(1);

    await render(hbs`
      <InfiniteScroller
        @selector=".internal-element"
        @onLoadMore={{this.handleLoadMore}}
      >
        <div class="non-scrollable-element">
          <div class="internal-element">
            {{#each this.things as |thing|}}
              <div class="thing">{{thing.name}}</div>
            {{/each}}
          </div>
        </div>
      </InfiniteScroller>
    `);

    find('.internal-element').scrollTop = 450;

    await waitUntil(() => findAll('.thing').length === 40);

    assert.equal(
      this.loadMoreCount,
      1,
      'fires load more action at the custom element scroll boundary'
    );
  });

  test('is scrollable', async function (assert) {
    assert.expect(2);

    this.things = generateThings(1, 2);

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
            class="load-more"
            {{on "click" scroller.loadMore}}
          >
            Load more
          </button>
        {{/unless}}
      </InfiniteScroller>
    `);

    assert
      .dom('.load-more')
      .exists(
        'load more button shows because infinite scroller component ' +
          'determined that there is no scroll movement available'
      );

    await click('.load-more');

    assert
      .dom('.load-more')
      .doesNotExist(
        'infinite scroller component re-computes whether or not there is scroll movement available'
      );
  });
});
