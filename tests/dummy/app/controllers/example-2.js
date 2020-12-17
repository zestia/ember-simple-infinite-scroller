import ThingsController from '../_controllers/things';

export default class Example2Controller extends ThingsController {
  get documentElement() {
    return document;
  }
}
