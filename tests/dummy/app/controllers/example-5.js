import ThingsController from 'dummy/_controllers/things';
import { modifier } from 'ember-modifier';
import { tracked } from '@glimmer/tracking';

export default class extends ThingsController {
  @tracked page = 4;
  @tracked things = this._generateThingsForPage(5);

  scrollIntoView = modifier((element) => element.scrollIntoView(), {
    eager: false
  });
}
