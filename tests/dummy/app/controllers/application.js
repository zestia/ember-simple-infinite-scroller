import Controller from '@ember/controller';
import { action, set } from '@ember/object';

export default class ApplicationController extends Controller {
  loadDelay = 0;

  @action
  setLoadDelay({ target: { value } }) {
    set(this, 'loadDelay', value);
  }
}
