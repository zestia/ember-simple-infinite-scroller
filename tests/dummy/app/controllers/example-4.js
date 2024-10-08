import ThingsController from 'dummy/controllers/_things';
import { modifier } from 'ember-modifier';
import { tracked } from '@glimmer/tracking';

export default class extends ThingsController {
  @tracked scroller;

  setScroller = modifier((element) => (this.scroller = element));
}
