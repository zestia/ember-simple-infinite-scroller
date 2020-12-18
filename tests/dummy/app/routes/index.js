import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default class IndexRoute extends Route {
  @inject router;

  redirect() {
    return this.router.transitionTo('example-1');
  }
}
