import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service application;
  @service router;

  activate() {
    this.router.on('routeDidChange', (transition) => {
      if (transition.to.name === 'example-5') {
        this.application.setPage(5);

        return;
      }

      this.application.setPage(1);
    });
  }
}
