import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('infinite-scroller', 'Integration | Component | infinite scroller', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`{{infinite-scroller}}`);

  assert.equal(this.$('.infinite-scroller').length, 1,
    'infinite scroller component has an appropriate class name');
});
