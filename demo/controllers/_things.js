import { action } from '@ember/object';
import Controller, { inject as injectController } from '@ember/controller';
import generateThings from '../utils/generate-things';
import { tracked } from '@glimmer/tracking';

export default class ThingsController extends Controller {
  @injectController('application') appController;

  @tracked page = 1;
  @tracked things;
  perPage = 10;

  constructor() {
    super(...arguments);
    this.things = this.generateThingsForPage(1);
  }

  @action
  handleLoadMore(direction) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (direction === 'DOWN' && this.page < 10) {
          this.page++;
          this.things = [
            ...this.things,
            ...this.generateThingsForPage(this.page)
          ];
        }

        if (direction === 'UP' && this.page > 1) {
          this.page--;
          this.things = [
            ...this.generateThingsForPage(this.page),
            ...this.things
          ];
        }

        resolve();
      }, this.appController.loadDelay);
    });
  }

  generateThingsForPage(page) {
    const start = (page - 1) * 10 + 1;
    const end = page * this.perPage;
    return generateThings(start, end);
  }
}
