import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked loadDelay = 0;

  @action
  setLoadDelay({ target: { value } }) {
    this.loadDelay = value;
  }
}
