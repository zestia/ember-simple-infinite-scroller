import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | infinite scroller', function(hooks) {
  setupTest(hooks);

  test('debug', function(assert) {
    const service = this.owner.lookup('service:-infinite-scroller');
    assert.strictEqual(service.debug, false);
  });
});
