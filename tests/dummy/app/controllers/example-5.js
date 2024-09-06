import ThingsController from 'dummy/controllers/_things';
import { modifier } from 'ember-modifier';
import { tracked } from '@glimmer/tracking';

export default class extends ThingsController {
  @tracked page = 5;
  @tracked things;

  constructor() {
    super(...arguments);
    this.things = this.generateThingsForPage(5);
  }

  scrollIntoView = modifier((element) => element.scrollIntoView());
}
