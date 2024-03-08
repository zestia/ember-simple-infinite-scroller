import { later } from '@ember/runloop';
import { action } from '@ember/object';
import Controller, { inject as injectController } from '@ember/controller';
import generateThings from 'dummy/utils/generate-things';
import { tracked } from '@glimmer/tracking';

export default class ThingsController extends Controller {
  @injectController('application') appController;

  @tracked page = 1;
  @tracked things = this._generateThingsForPage(1);
  perPage = 10;

  @action
  handleLoadMore(direction) {
    return new Promise((resolve) => {
      later(() => {
        if (direction === 'DOWN' && this.page < 10) {
          this.page++;
          this.things = [
            ...this.things,
            ...this._generateThingsForPage(this.page)
          ];
        }

        if (direction === 'UP' && this.page > 1) {
          this.page--;
          this.things = [
            ...this._generateThingsForPage(this.page),
            ...this.things
          ];
        }

        resolve();
      }, this.appController.loadDelay);
    });
  }

  _generateThingsForPage(page) {
    const start = (page - 1) * 10 + 1;
    const end = page * this.perPage;
    return generateThings(start, end);
  }
}
