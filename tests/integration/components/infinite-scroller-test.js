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

module('infinite-scroller', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.infiniteScroller = this.owner.lookup('service:-infinite-scroller');
    this.infiniteScroller.debug = true;
    this.loadedMore = false;

    this.set('things', generateThings(1, 20));

    this.set('loadMore', () => {
      this.loadedMore = true;
      this.get('things').pushObjects(generateThings(21, 40));
    });
  });

  test('it renders', async function(assert) {
    assert.expect(1);

    await render(hbs`{{infinite-scroller}}`);

    assert
      .dom('.infinite-scroller')
      .exists({ count: 1 }, 'infinite scroller component has an appropriate class name');
  });

  test('load more action', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#infinite-scroller
        class="example-1"
        onLoadMore=this.loadMore}}
        {{#each things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      {{/infinite-scroller}}
    `);

    find('.infinite-scroller').scrollTop = 450;

    later(() => {
      assert
        .dom('.thing')
        .exists({ count: 20 }, 'has not fired load more action due to debouncing of scroll event');
    }, 100);

    await waitUntil(() => findAll('.thing').length === 40);

    assert.ok(this.loadedMore, 'fires load more action at the element scroll boundary');
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
      {{#infinite-scroller
        class="example-1"
        onLoadMore=this.slowLoadMore}}
        {{#each things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      {{/infinite-scroller}}
    `);

    find('.infinite-scroller').scrollTop = 450;

    await waitUntil(() => findAll('.thing').length === 40);

    find('.infinite-scroller').scrollTop = 1200;

    await settled();

    assert.equal(called, 1, 'does not fire load more action if already loading more');
  });

  test('load more action (leeway)', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#infinite-scroller
        class="example-1"
        leeway="50%"
        onLoadMore=this.loadMore}}
        {{#each things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      {{/infinite-scroller}}
    `);

    find('.infinite-scroller').scrollTop = 225;

    await waitUntil(() => findAll('.thing').length === 40);

    assert.ok(this.loadedMore, 'fires load more action at the custom element scroll boundary');
  });

  test('load more action (scrollDebounce)', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#infinite-scroller
        class="example-1"
        scrollDebounce=50
        onLoadMore=this.loadMore}}
        {{#each things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      {{/infinite-scroller}}
    `);

    find('.infinite-scroller').scrollTop = 450;

    later(() => {
      assert
        .dom('.thing')
        .exists({ count: 20 }, 'has not fired action due to custom debouncing of scroll event');
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
      {{#infinite-scroller
        class="example-2"
        useDocument=true
        onLoadMore=this.loadMore}}
        {{#each things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      {{/infinite-scroller}}
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
      {{#infinite-scroller onLoadMore=this.loadMore as |scroller|}}
        <button onclick={{action scroller.loadMore}}>Load more</button>
      {{/infinite-scroller}}
    `);

    assert.ok(
      !find('.infinite-scroller').classList.contains('is-loading'),
      'precondition: is not loading'
    );

    await click('button');

    assert
      .dom('.infinite-scroller')
      .hasClass('is-loading', 'a loading class is added whilst the action is being performed');

    willLoad.resolve();

    await settled();

    assert.ok(
      !find('.infinite-scroller').classList.contains('is-loading'),
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
      {{#infinite-scroller onLoadMore=this.loadMore as |scroller|}}
        <span>{{scroller.isLoading}}</span>
        <button onclick={{action scroller.loadMore}}>Load more</button>
      {{/infinite-scroller}}
    `);

    assert.dom('span').hasText('false',
      'precondition: not loading');

    click('button');

    await waitFor('.infinite-scroller');

    assert.dom('span').hasText('true',
      'yields a hash with the loading state');

    willLoad.resolve();

    await settled();

    assert.dom('span').hasText('false',
      'loading state is updated');
  });

  test('yielded error', async function(assert) {
    assert.expect(2);

    this.set('loadMore', () => {
      return reject(new Error('Fail'));
    });

    await render(hbs`
      {{#infinite-scroller onLoadMore=this.loadMore as |scroller|}}
        {{#if scroller.error}}
          <p>{{scroller.error.message}}</p>
        {{/if}}
        <button onclick={{action scroller.loadMore}}>Load more</button>
      {{/infinite-scroller}}
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
      {{#infinite-scroller onLoadMore=this.loadMore as |scroller|}}
        {{#each things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
        <button onclick={{action scroller.loadMore}}>Load more</button>
      {{/infinite-scroller}}
    `);

    await click('button');

    assert
      .dom('.thing')
      .exists({ count: 40 }, 'yields an action that can trigger the load more action');
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
      {{#if showScroller}}
        {{#infinite-scroller onLoadMore=this.loadMore as |scroller|}}
          <button onclick={{action scroller.loadMore}}>Load more</button>
        {{/infinite-scroller}}
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
      {{#infinite-scroller onLoadMore=this.loadMore as |scroller|}}
        <button onclick={{action scroller.loadMore}}>Load more</button>
      {{/infinite-scroller}}
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
      {{#if show}}
        {{#infinite-scroller
          class="example-1"
          scrollDebounce=50
          onLoadMore=this.loadMore}}
          {{#each things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        {{/infinite-scroller}}
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
      {{#infinite-scroller
        selector=".internal-element"
        onLoadMore=this.loadMore}}

        <div class="non-scrollable-element">
          <div class="internal-element">
            {{#each things as |thing|}}
              <div class="thing">{{thing.name}}</div>
            {{/each}}
          </div>
        </div>

      {{/infinite-scroller}}
    `);

    find('.internal-element').scrollTop = 450;

    await waitUntil(() => findAll('.thing').length === 40);

    assert.ok(this.loadedMore, 'fires load more action at the custom element scroll boundary');
  });
});
