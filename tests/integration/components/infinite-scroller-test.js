import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { defer } from 'rsvp';
import { later } from '@ember/runloop';
import generateThings from 'dummy/utils/generate-things';
import { render, settled, find, click, scrollTo } from '@ember/test-helpers';

module('infinite-scroller', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function (assert) {
    this.handleLoadMore = () => {
      assert.step('load more');
      this.willLoad = defer();
      return this.willLoad.promise;
    };

    this.scrollToPercentage = (selector, percentage) => {
      const el = find(selector);
      const y = ((el.scrollHeight - el.clientHeight) / 100) * percentage;
      return scrollTo(el, 0, y);
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

    assert.dom('.infinite-scroller').hasClass('infinite-scroller--scrollable');

    await render(hbs`<InfiniteScroller class="example-1" />`);

    assert
      .dom('.infinite-scroller')
      .doesNotHaveClass('infinite-scroller--scrollable');
  });

  test('load more action', async function (assert) {
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

    const promise = this.scrollToPercentage('.infinite-scroller', 100);

    later(() => {
      assert.verifySteps(
        [],
        'has not fired load more action due to debouncing of scroll event'
      );
    }, 100);

    await promise;

    assert.verifySteps(['load more']);
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

    await this.scrollToPercentage('.infinite-scroller', 100);
    await this.scrollToPercentage('.infinite-scroller', 100);

    assert.verifySteps(['load more'], 'does not fire if already loading');
  });

  test('load more action (leeway)', async function (assert) {
    assert.expect(3);

    this.things = generateThings(1, 20);

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

    await this.scrollToPercentage('.infinite-scroller', 49);

    assert.verifySteps([], 'not scrolled enough');

    await this.scrollToPercentage('.infinite-scroller', 50);

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

    const promise = this.scrollToPercentage('.infinite-scroller', 100);

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
    <style>
      /*
      We want to test that the scroll event fires on the document,
      so the document must be scrollable, make it so by 1px.
      */

      #ember-testing-container {
        height: calc(100vh + 1px);
        max-height: unset;
      }
      </style>

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

    await this.scrollToPercentage(document.documentElement, 100);

    assert.verifySteps(['load more']);
  });

  test('custom element via argument', async function (assert) {
    assert.expect(2);

    this.things = generateThings(1, 20);

    this.setElement = (element) => this.set('customElement', element);

    await render(hbs`
      <div class="external-element" {{did-insert this.setElement}}>
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </div>

      <InfiniteScroller
        @element={{this.customElement}}
        @onLoadMore={{this.handleLoadMore}}
      />
    `);

    await this.scrollToPercentage('.external-element', 100);

    assert.verifySteps(['load more']);
  });

  test('custom element via registration', async function (assert) {
    assert.expect(2);

    this.things = generateThings(1, 20);

    await render(hbs`
      <InfiniteScroller
        @onLoadMore={{this.handleLoadMore}}
        as |scroller|
      >
        <div class="internal-element" {{did-insert scroller.setElement}}>
          {{#each this.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </div>
      </InfiniteScroller>
    `);

    await this.scrollToPercentage('.internal-element', 100);

    assert.verifySteps(['load more']);
  });

  test('loading class name', async function (assert) {
    assert.expect(5);

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

    this.willLoad.resolve();

    await settled();

    assert
      .dom('.infinite-scroller')
      .doesNotHaveClass(
        'infinite-scroller--loading',
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

    await click('button');

    assert.dom('span').hasText('true', 'yields a hash with the loading state');

    this.willLoad.resolve();

    await settled();

    assert.dom('span').hasText('false', 'loading state is updated');

    assert.verifySteps(['load more']);
  });

  test('destroying (does not blow up)', async function (assert) {
    assert.expect(2);

    this.show = true;

    await render(hbs`
      {{#if this.show}}
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

    this.set('show', false);

    this.willLoad.resolve();

    assert.verifySteps(['load more']);
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

    const promise = this.scrollToPercentage('.infinite-scroller', 100);

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

  test('changing element argument', async function (assert) {
    assert.expect(3);

    this.things = generateThings(1, 20);

    this.setDiv1 = (element) => {
      this.set('div1', element);
      this.set('customElement', this.div1);
    };

    this.setDiv2 = (element) => {
      this.set('div2', element);
    };

    await render(hbs`
      <div class="external-element" {{did-insert this.setDiv1}}>
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </div>

      <div class="external-element" {{did-insert this.setDiv2}}>
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </div>

      <InfiniteScroller
        @element={{this.customElement}}
        @onLoadMore={{this.handleLoadMore}}
      />
    `);

    await this.scrollToPercentage('.external-element:nth-child(1)', 100);

    this.willLoad.resolve();

    assert.verifySteps(['load more']);

    this.set('customElement', this.div2);

    await this.scrollToPercentage('.external-element:nth-child(2)', 100);

    assert.verifySteps(
      [],
      'only fires load action once, because the scroll listeners are not' +
        'reconfigured when element changes.'
    );
  });
});
