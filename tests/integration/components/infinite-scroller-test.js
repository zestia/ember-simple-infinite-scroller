import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { defer, reject } from 'rsvp';
import { later, run } from '@ember/runloop';
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

module('infinite-scroller', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.infiniteScroller = this.owner.lookup('service:-infinite-scroller');
    this.infiniteScroller.debug = true;
    this.infiniteScroller.raf = run;
    this.loadedMore = false;

    this.set('things', generateThings(1, 20));

    this.set('loadMore', () => {
      this.loadedMore = true;
      this.get('things').pushObjects(generateThings(21, 40));
    });
  });

  test('it renders', async function(assert) {
    assert.expect(1);

    await render(hbs`<InfiniteScroller />`);

    assert
      .dom('.infinite-scroller')
      .exists(
        { count: 1 },
        'infinite scroller component has an appropriate class name'
      );
  });

  test('scrollable class', async function(assert) {
    assert.expect(2);

    await render(hbs`
      <InfiniteScroller class="example-1">
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    assert.dom('.infinite-scroller').hasClass('infinite-scroller--scrollable');

    await render(hbs`
      <InfiniteScroller class="example-1" />
    `);

    assert
      .dom('.infinite-scroller')
      .doesNotHaveClass('infinite-scroller--scrollable');
  });

  test('load more action', async function(assert) {
    assert.expect(2);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @onLoadMore={{this.loadMore}}>
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

    assert.ok(
      this.loadedMore,
      'fires load more action at the element scroll boundary'
    );
  });

  test('load more action (whilst loading)', async function(assert) {
    assert.expect(1);

    let called = 0;

    this.set('slowLoadMore', () => {
      called++;
      this.loadMore();
      return new Promise(resolve => later(resolve, 1000));
    });

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @onLoadMore={{this.slowLoadMore}}>
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
      called,
      1,
      'does not fire load more action if already loading more'
    );
  });

  test('load more action (leeway)', async function(assert) {
    assert.expect(1);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @leeway="50%"
        @onLoadMore={{this.loadMore}}>
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    find('.infinite-scroller').scrollTop = 225;

    await waitUntil(() => findAll('.thing').length === 40);

    assert.ok(
      this.loadedMore,
      'fires load more action at the custom element scroll boundary'
    );
  });

  test('load more action (scrollDebounce)', async function(assert) {
    assert.expect(2);

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @scrollDebounce={{50}}
        @onLoadMore={{this.loadMore}}>
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
          'has not fired action due to custom debouncing of scroll event'
        );
    }, 50);

    await waitUntil(() => findAll('.thing').length === 40);

    assert.ok(this.loadedMore, 'fires load more action after being debounced');
  });

  test('load more action (useDocument)', async function(assert) {
    assert.expect(2);

    // This test needs to be run in QUnit's devmode so that the CSS is correct.

    // Hack make the 'viewport' small, so the bottom of infinite scroll component is
    // computed as 'past the fold'.
    const fakeDocumentElement = {
      clientHeight: 600
    };

    this.set('infiniteScroller.documentElement', fakeDocumentElement);

    await render(hbs`
      <InfiniteScroller
        class="example-2"
        @useDocument={{true}}
        @onLoadMore={{this.loadMore}}>
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      </InfiniteScroller>
    `);

    const el = find('.infinite-scroller');

    await triggerEvent(this.infiniteScroller.document, 'scroll');

    assert.ok(!this.loadedMore, 'load more action not fired yet');

    // Hack to adjust element's `getBoundingClientRect().bottom`
    // because we can't scroll the document in the test AFAIK
    // This magic value means the distance between bottom of the element
    // and the bottom of the viewport will be zero, and so the load more
    // action will fire.
    el.style.marginTop = `-${this.infiniteScroller._log[0].pixelsToBottom}px`;

    await triggerEvent(this.infiniteScroller.document, 'scroll');

    assert.ok(
      this.loadedMore,
      'load more action fires when the bottom of the element comes into view'
    );
  });

  test('loading class name', async function(assert) {
    assert.expect(3);

    const willLoad = defer();

    this.set('loadMore', () => {
      return willLoad.promise;
    });

    await render(hbs`
      <InfiniteScroller @onLoadMore={{this.loadMore}} as |scroller|>
        <button type="button" {{on "click" scroller.loadMore}}>Load more</button>
      </InfiniteScroller>
    `);

    assert.ok(
      !find('.infinite-scroller').classList.contains(
        'infinite-scroller--loading'
      ),
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

    assert.ok(
      !find('.infinite-scroller').classList.contains(
        'infinite-scroller--loading'
      ),
      'loading class name is removed after the action resolves'
    );
  });

  test('yielded loading state', async function(assert) {
    assert.expect(3);

    const willLoad = defer();

    this.set('loadMore', () => {
      return willLoad.promise;
    });

    await render(hbs`
      <InfiniteScroller @onLoadMore={{this.loadMore}} as |scroller|>
        <span>{{scroller.isLoading}}</span>
        <button type="button" {{on "click" scroller.loadMore}}>Load more</button>
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

  test('yielded error', async function(assert) {
    assert.expect(2);

    this.set('loadMore', () => {
      return reject(new Error('Fail'));
    });

    await render(hbs`
      <InfiniteScroller @onLoadMore={{this.loadMore}} as |scroller|>
        {{#if scroller.error}}
          <p>{{scroller.error.message}}</p>
        {{/if}}
        <button type="button" {{on "click" scroller.loadMore}}>Load more</button>
      </InfiniteScroller>
    `);

    assert.ok(
      !find('.infinite-scroller').textContent.match('Fail'),
      'precondition: no error message'
    );

    await click('button');

    assert.ok(
      find('.infinite-scroller').textContent.match('Fail'),
      'yields a hash with the last rejection error'
    );
  });

  test('yielded loadMore action', async function(assert) {
    assert.expect(1);

    await render(hbs`
      <InfiniteScroller @onLoadMore={{this.loadMore}} as |scroller|>
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
        <button type="button" {{on "click" scroller.loadMore}}>Load more</button>
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

  test('destroying (does not blow up)', async function(assert) {
    assert.expect(0);

    this.set('showScroller', true);

    const willLoad = defer();

    this.set('loadMore', () => {
      this.set('showScroller', false);
      return willLoad.promise;
    });

    await render(hbs`
      {{#if this.showScroller}}
        <InfiniteScroller @onLoadMore={{this.loadMore}} as |scroller|>
          <button type="button" {{on "click" scroller.loadMore}}>Load more</button>
        </InfiniteScroller>
      {{/if}}
    `);

    await click('button');

    willLoad.resolve();
  });

  test('no promise (does not blow up)', async function(assert) {
    assert.expect(0);

    this.set('loadMore', () => {
      return null;
    });

    await render(hbs`
      <InfiniteScroller @onLoadMore={{this.loadMore}} as |scroller|>
        <button type="button" {{on "click" scroller.loadMore}}>Load more</button>
      </InfiniteScroller>
    `);

    await click('button');
  });

  test('destroying during debounce (does not blow up)', async function(assert) {
    assert.expect(0);

    this.set('show', true);

    this.set('loadMore', () => {
      return null;
    });

    await render(hbs`
      {{#if this.show}}
        <InfiniteScroller
          class="example-1"
          @scrollDebounce={{50}}
          @onLoadMore={{this.loadMore}}>
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

  test('custom element', async function(assert) {
    assert.expect(1);

    await render(hbs`
      <InfiniteScroller
        @selector=".internal-element"
        @onLoadMore={{this.loadMore}}>

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

    assert.ok(
      this.loadedMore,
      'fires load more action at the custom element scroll boundary'
    );
  });

  test('is scrollable', async function(assert) {
    assert.expect(2);

    this.set('things', generateThings(1, 2));

    await render(hbs`
      <InfiniteScroller
        class="example-1"
        @onLoadMore={{this.loadMore}} as |scroller|>
        {{#each this.things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
        {{#unless scroller.isScrollable}}
          <button type="button" {{on "click" scroller.loadMore}} class="load-more">Load more</button>
        {{/unless}}
      </InfiniteScroller>
    `);

    assert
      .dom('.load-more')
      .exists(
        'load more button shows because infinite scroller component determined that there is no scroll movement available'
      );

    await click('.load-more');

    assert
      .dom('.load-more')
      .doesNotExist(
        'infinite scroller component re-computes whether or not there is scroll movement available'
      );
  });
});
