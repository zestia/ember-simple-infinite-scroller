import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import generateThings from '../../demo-app/utils/generate-things';
import { scrollToPercentage } from '@zestia/ember-simple-infinite-scroller/test-helpers/scroll-to-percentage';
import InfiniteScroller from '@zestia/ember-simple-infinite-scroller/components/infinite-scroller';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { modifier } from 'ember-modifier';
import {
  render,
  find,
  rerender,
  settled,
  click,
  setupOnerror,
  resetOnerror,
} from '@ember/test-helpers';
import '../../demo-app/styles.css';

module('infinite-scroller', function (hooks) {
  setupRenderingTest(hooks);

  let willLoad;
  let handleLoadMore;
  let state;

  hooks.beforeEach(function (assert) {
    state = new (class {
      @tracked things = generateThings(1, 20);
      @tracked show = true;
      @tracked customElement;
    })();

    handleLoadMore = (direction) => {
      assert.step(`load more: ${direction}`);
      willLoad = Promise.withResolvers();
      return willLoad.promise;
    };
  });

  test('it renders', async function (assert) {
    assert.expect(1);

    await render(<template><InfiniteScroller /></template>);

    assert.dom('.infinite-scroller').exists('has an appropriate class name');
  });

  test('load more action (success)', async function (assert) {
    assert.expect(3);

    await render(
      <template>
        <InfiniteScroller
          class="example-1"
          @onLoadMore={{handleLoadMore}}
          @percentDown={{100}}
        >
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      </template>,
    );

    const willScroll = scrollToPercentage('.infinite-scroller', 100);

    setTimeout(() => {
      assert.verifySteps(
        [],
        'has not fired load more action due to debouncing of scroll event',
      );
    }, 100);

    await willScroll;

    assert.verifySteps(['load more: DOWN']);
  });

  test('load more action (failure)', async function (assert) {
    assert.expect(3);

    const example = new Error('example failure');

    setupOnerror((error) => {
      if (error === example) {
        return;
      }

      throw error;
    });

    await render(
      <template>
        <InfiniteScroller
          class="example-1"
          @onLoadMore={{handleLoadMore}}
          @percentDown={{100}}
        >
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      </template>,
    );

    await scrollToPercentage('.infinite-scroller', 100);

    willLoad.reject(example);

    await settled();

    assert
      .dom('.infinite-scroller')
      .hasAttribute(
        'data-loading',
        'false',
        'is no longer considered loading if loading fails',
      );

    assert.verifySteps(['load more: DOWN']);

    resetOnerror();
  });

  test('load more action (whilst loading)', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <InfiniteScroller
          class="example-1"
          @onLoadMore={{handleLoadMore}}
          @percentDown={{100}}
        >
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      </template>,
    );

    scrollToPercentage('.infinite-scroller', 100);
    await scrollToPercentage('.infinite-scroller', 100);

    assert.verifySteps(['load more: DOWN'], 'does not fire if already loading');
  });

  test('load more action (percent down)', async function (assert) {
    assert.expect(3);

    await render(
      <template>
        <InfiniteScroller
          class="example-1"
          @percentDown={{80}}
          @onLoadMore={{handleLoadMore}}
        >
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      </template>,
    );

    await scrollToPercentage('.infinite-scroller', 79);

    assert.verifySteps([], 'not scrolled enough');

    await scrollToPercentage('.infinite-scroller', 80);

    assert.verifySteps(['load more: DOWN']);
  });

  test('load more action (percent up)', async function (assert) {
    assert.expect(4);

    await render(
      <template>
        <InfiniteScroller
          class="example-1"
          @percentUp={{20}}
          @onLoadMore={{handleLoadMore}}
        >
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      </template>,
    );

    await scrollToPercentage('.infinite-scroller', 80);

    assert.verifySteps([]);

    await scrollToPercentage('.infinite-scroller', 21);

    assert.verifySteps([]);

    await scrollToPercentage('.infinite-scroller', 20);

    assert.verifySteps(['load more: UP']);
  });

  test('load more action (debounce)', async function (assert) {
    assert.expect(3);

    await render(
      <template>
        <InfiniteScroller
          class="example-1"
          @debounce={{50}}
          @percentDown={{100}}
          @onLoadMore={{handleLoadMore}}
        >
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      </template>,
    );

    const willScroll = scrollToPercentage('.infinite-scroller', 100);

    setTimeout(() => {
      assert.verifySteps([], 'not fired yet');
    }, 50);

    await willScroll;

    assert.verifySteps(
      ['load more: DOWN'],
      'fires load more action after being debounced',
    );
  });

  test('load more action (document)', async function (assert) {
    assert.expect(2);

    const { document } = window;

    await render(
      <template>
        {{! template-lint-disable no-forbidden-elements }}
        {{! prettier-ignore }}
        <style>
        /* We want to test that the scroll event fires on the document, so the
        document must be scrollable, make it so by 1px. */
        :root {
          height: calc(100vh + 1px);
        }
      </style>

        <InfiniteScroller
          class="example-2"
          @element={{document}}
          @percentDown={{100}}
          @onLoadMore={{handleLoadMore}}
        />
      </template>,
    );

    await scrollToPercentage(document.documentElement, 100);

    assert.verifySteps(['load more: DOWN']);
  });

  test('scrollable attr', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <InfiniteScroller class="example-1">
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      </template>,
    );

    assert.dom('.infinite-scroller').hasAttribute('data-scrollable', 'true');

    await render(<template><InfiniteScroller class="example-1" /></template>);

    assert.dom('.infinite-scroller').hasAttribute('data-scrollable', 'false');
  });

  test('loading attr', async function (assert) {
    assert.expect(5);

    await render(
      <template>
        <InfiniteScroller
          class="example-1"
          @onLoadMore={{handleLoadMore}}
          @percentDown={{100}}
        >
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      </template>,
    );

    assert
      .dom('.infinite-scroller')
      .hasAttribute('data-loading', 'false', 'precondition: is not loading');

    await scrollToPercentage('.infinite-scroller', 100);

    assert
      .dom('.infinite-scroller')
      .hasAttribute(
        'data-loading',
        'true',
        'a loading class is added whilst the action is being performed',
      );

    willLoad.resolve();

    await settled();

    assert
      .dom('.infinite-scroller')
      .hasAttribute(
        'data-loading',
        'false',
        'loading class name is removed after the action resolves',
      );

    assert.verifySteps(['load more: DOWN']);
  });

  test('yielded loadMore action', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        <InfiniteScroller @onLoadMore={{handleLoadMore}} as |scroller|>
          <button type="button" {{on "click" (fn scroller.loadMore "DOWN")}}>
            Load more
          </button>
        </InfiniteScroller>
      </template>,
    );

    await click('button');

    assert.verifySteps(['load more: DOWN']);
  });

  test('yielded loading state', async function (assert) {
    assert.expect(7);

    await render(
      <template>
        <InfiniteScroller
          class="example-1"
          @onLoadMore={{handleLoadMore}}
          @percentDown={{100}}
          as |scroller|
        >
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}

          Loading:
          {{scroller.isLoading}}

          Direction:
          {{if scroller.direction scroller.direction "UNKNOWN"}}
        </InfiniteScroller>
      </template>,
    );

    assert
      .dom('.infinite-scroller')
      .containsText('Loading: false', 'precondition: not loading');

    assert.dom('.infinite-scroller').containsText('Direction: UNKNOWN');

    await scrollToPercentage('.infinite-scroller', 100);

    assert.dom('.infinite-scroller').containsText('Direction: DOWN');

    assert
      .dom('.infinite-scroller')
      .containsText('Loading: true', 'yields a hash with the loading state');

    willLoad.resolve();

    await settled();

    assert
      .dom('.infinite-scroller')
      .containsText('Loading: false', 'loading state is updated');

    assert.verifySteps(['load more: DOWN']);
  });

  test('destroying (does not blow up)', async function (assert) {
    assert.expect(2);

    await render(
      <template>
        {{#if state.show}}
          <InfiniteScroller
            class="example-1"
            @onLoadMore={{handleLoadMore}}
            @percentDown={{100}}
          >
            {{#each state.things as |thing|}}
              <div class="thing">{{thing.name}}</div>
            {{/each}}
          </InfiniteScroller>
        {{/if}}
      </template>,
    );

    await scrollToPercentage('.infinite-scroller', 100);

    state.show = false;

    willLoad.resolve();

    assert.verifySteps(['load more: DOWN']);
  });

  test('no promise (does not blow up)', async function (assert) {
    assert.expect(0);

    handleLoadMore = () => null;

    await render(
      <template>
        <InfiniteScroller
          class="example-1"
          @onLoadMore={{handleLoadMore}}
          @percentDown={{100}}
        >
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      </template>,
    );

    await scrollToPercentage('.infinite-scroller', 100);
  });

  test('destroying during debounce (does not blow up)', async function (assert) {
    assert.expect(1);

    await render(
      <template>
        {{#if state.show}}
          <InfiniteScroller
            class="example-1"
            @debounce={{50}}
            @onLoadMore={{handleLoadMore}}
            @percentDown={{100}}
          >
            {{#each state.things as |thing|}}
              <div class="thing">{{thing.name}}</div>
            {{/each}}
          </InfiniteScroller>
        {{/if}}
      </template>,
    );

    const willScroll = scrollToPercentage('.infinite-scroller', 100);

    setTimeout(() => {
      state.show = false;
    }, 25);

    await willScroll;

    assert.verifySteps([]);
  });

  test('is scrollable', async function (assert) {
    assert.expect(4);

    state.things = [];

    await render(
      <template>
        <InfiniteScroller
          class="example-1"
          @onLoadMore={{handleLoadMore}}
          @percentDown={{100}}
          as |scroller|
        >
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}

          {{#unless scroller.isScrollable}}
            <button type="button" {{on "click" (fn scroller.loadMore "DOWN")}}>
              Load more
            </button>
          {{/unless}}
        </InfiniteScroller>
      </template>,
    );

    assert
      .dom('button')
      .exists(
        'load more button shows because infinite scroller component ' +
          'determined that there is no scroll movement available',
      );

    await click('button');

    state.things = generateThings(1, 20);

    await rerender();

    willLoad.resolve();

    await settled();

    assert
      .dom('button')
      .doesNotExist(
        'infinite scroller component re-computes whether or not there is scroll movement available',
      );

    assert.verifySteps(['load more: DOWN']);
  });

  test('is scrollable re-computation', async function (assert) {
    assert.expect(2);

    state.things = [];

    await render(
      <template>
        <InfiniteScroller class="example-1">
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </InfiniteScroller>
      </template>,
    );

    assert.dom('.infinite-scroller').hasAttribute('data-scrollable', 'false');

    state.things = generateThings(1, 20);

    await rerender();

    assert.dom('.infinite-scroller').hasAttribute('data-scrollable', 'true');
  });

  test('custom element via element argument', async function (assert) {
    assert.expect(4);

    const setCustomElement = modifier(
      (element) => (state.customElement = element),
    );

    await render(
      <template>
        <div class="external-element one" {{setCustomElement}}>
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </div>

        <div class="external-element two">
          {{#each state.things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </div>

        <InfiniteScroller
          @element={{state.customElement}}
          @onLoadMore={{handleLoadMore}}
          @percentDown={{100}}
        />
      </template>,
    );

    await scrollToPercentage('.external-element.one', 100);

    assert.verifySteps(['load more: DOWN']);

    willLoad.resolve();

    state.customElement = find('.two');

    await scrollToPercentage('.external-element.two', 100);

    assert.verifySteps(
      ['load more: DOWN'],
      'load action fires again, because scrollable element has been re-registered',
    );
  });

  test('api', async function (assert) {
    assert.expect(4);

    let api;

    const capture = (_api) => (api = _api);

    await render(
      <template>
        <InfiniteScroller as |scroller|>
          {{capture scroller}}
        </InfiniteScroller>
      </template>,
    );

    assert.false(api.isScrollable);
    assert.false(api.isLoading);
    assert.strictEqual(typeof api.loadMore, 'function');
    assert.strictEqual(api.direction, null);
  });
});
