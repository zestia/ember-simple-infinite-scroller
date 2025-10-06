import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import generateThings from '../utils/generate-things';

export default class ApplicationService extends Service {
  document = document;

  @tracked loadDelay = 0;

  @tracked page = 1;
  @tracked things;
  perPage = 10;

  setLoadDelay = ({ target: { value } }) => {
    this.loadDelay = value;
  };

  handleLoadMore = (direction) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (direction === 'DOWN' && this.page < 10) {
          this.page++;
          this.things = [
            ...this.things,
            ...this.#generateThingsForPage(this.page)
          ];
        }

        if (direction === 'UP' && this.page > 1) {
          this.page--;
          this.things = [
            ...this.#generateThingsForPage(this.page),
            ...this.things
          ];
        }

        resolve();
      }, this.loadDelay);
    });
  };

  setPage(page = 1) {
    this.page = page;
    this.things = this.#generateThingsForPage(page);
  }

  #generateThingsForPage(page) {
    const start = (page - 1) * 10 + 1;
    const end = page * this.perPage;
    return generateThings(start, end);
  }
}
