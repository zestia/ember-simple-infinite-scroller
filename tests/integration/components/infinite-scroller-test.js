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

    this.set('things', generateThings(1, 20));

    this.set('loadMore', () => {
      this.get('things').pushObjects(generateThings(21, 40));
    });
  });

  test('it renders', async function(assert) {
    assert.expect(1);

    await render(hbs`{{infinite-scroller}}`);

    assert.equal(findAll('.infinite-scroller').length, 1,
      'infinite scroller component has an appropriate class name');
  });

  test('load more action', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#infinite-scroller
        class="example-1"
        on-load-more=(action loadMore) as |scroller|}}
        {{#each things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      {{/infinite-scroller}}
    `);

    find('.infinite-scroller').scrollTop = 450;

    later(() => {
      assert.equal(findAll('.thing').length, 20,
        'has not fired load more action due to debouncing of scroll event');
    }, 100);

    await waitUntil(() => findAll('.thing').length === 40);

    assert.ok(true,
      'fires load more action at the element scroll boundary');
  });

  test('load more action (trigger-at)', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#infinite-scroller
        class="example-1"
        trigger-at="50%"
        on-load-more=(action loadMore) as |scroller|}}
        {{#each things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      {{/infinite-scroller}}
    `);

    find('.infinite-scroller').scrollTop = 225;

    await waitUntil(() => findAll('.thing').length === 40);

    assert.ok(true,
      'fires load more action at the custom element scroll boundary');
  });

  test('load more action (scroll-debounce)', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#infinite-scroller
        class="example-1"
        scroll-debounce=50
        on-load-more=(action loadMore) as |scroller|}}
        {{#each things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      {{/infinite-scroller}}
    `);

    find('.infinite-scroller').scrollTop = 450;

    later(() => {
      assert.equal(findAll('.thing').length, 20,
        'has not fired action due to custom debouncing of scroll event');
    }, 50);

    await waitUntil(() => findAll('.thing').length === 40);

    assert.ok(true,
      'fires load more action after being debounced');
  });

  test('load more action (use-document)', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#infinite-scroller
        class="example-2"
        use-document=true
        on-load-more=(action loadMore) as |scroller|}}
        {{#each things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
      {{/infinite-scroller}}
    `);

    const fakeDocumentElement = {
      scrollTop: 1000,
      scrollHeight: 1000,
      clientHeight: 500
    };

    this.set('infiniteScroller.documentElement', fakeDocumentElement);

    await triggerEvent(document, 'scroll');

    await waitUntil(() => findAll('.thing').length === 40);

    assert.ok(true,
      'fires load more action at the window scroll boundary');
  });

  test('loading class name', async function(assert) {
    assert.expect(3);

    const willLoad = defer();

    this.set('loadMore', () => {
      return willLoad.promise;
    });

    await render(hbs`
      {{#infinite-scroller on-load-more=(action loadMore) as |scroller|}}
        <button onclick={{action scroller.loadMore}}>Load more</button>
      {{/infinite-scroller}}
    `);

    assert.ok(!find('.infinite-scroller').classList.contains('is-loading'),
      'precondition: is not loading');

    await click('button');

    assert.ok(find('.infinite-scroller').classList.contains('is-loading'),
      'a loading class is added whilst the action is being performed');

    willLoad.resolve();

    await settled();

    assert.ok(!find('.infinite-scroller').classList.contains('is-loading'),
      'loading class name is removed after the action resolves');
  });

  test('yielded loading state', async function(assert) {
    assert.expect(3);

    const willLoad = defer();

    this.set('loadMore', () => {
      return willLoad.promise;
    });

    await render(hbs`
      {{#infinite-scroller on-load-more=(action loadMore) as |scroller|}}
        {{#if scroller.isLoading}}
          <p>Please wait...</p>
        {{/if}}
        <button onclick={{action scroller.loadMore}}>Load more</button>
      {{/infinite-scroller}}
    `);

    assert.ok(!find('.infinite-scroller').textContent.match('Please wait...'),
      'precondition: is not loading');

    click('button');

    await waitFor('.infinite-scroller');

    assert.ok(find('.infinite-scroller').textContent.match('Please wait...'),
      'yields a hash with the loading state');

    willLoad.resolve();

    await settled();

    assert.ok(!find('.infinite-scroller').textContent.match('Please wait...'),
      'loading state is updated');
  });

  test('yielded error', async function(assert) {
    assert.expect(2);

    this.set('loadMore', () => {
      return reject(new Error('Fail'));
    });

    await render(hbs`
      {{#infinite-scroller on-load-more=(action loadMore) as |scroller|}}
        {{#if scroller.error}}
          <p>{{scroller.error.message}}</p>
        {{/if}}
        <button onclick={{action scroller.loadMore}}>Load more</button>
      {{/infinite-scroller}}
    `);

    assert.ok(!find('.infinite-scroller').textContent.match('Fail'),
      'precondition: no error message');

    await click('button');

    assert.ok(find('.infinite-scroller').textContent.match('Fail'),
      'yields a hash with the last rejection error');
  });

  test('yielded loadMore action', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#infinite-scroller on-load-more=(action loadMore) as |scroller|}}
        {{#each things as |thing|}}
          <div class="thing">{{thing.name}}</div>
        {{/each}}
        <button onclick={{action scroller.loadMore}}>Load more</button>
      {{/infinite-scroller}}
    `);

    await click('button');

    assert.equal(findAll('.thing').length, 40,
      'yields an action that can trigger the load more action');
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
        {{#infinite-scroller on-load-more=(action loadMore) as |scroller|}}
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
      {{#infinite-scroller on-load-more=(action loadMore) as |scroller|}}
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
          scroll-debounce=50
          on-load-more=(action loadMore) as |scroller|}}
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
      use-element=".external-element"
      on-load-more=(action loadMore)}}

      <div class = "non-scrollable-element">
        <div class="external-element">
          {{#each things as |thing|}}
            <div class="thing">{{thing.name}}</div>
          {{/each}}
        </div>
      </div>

      {{/infinite-scroller}}
    `);

    find('.external-element').scrollTop = 450;

    await waitUntil(() => findAll('.thing').length === 40);

    assert.ok(true,
      'fires load more action at the custom element scroll boundary');
  });
});
