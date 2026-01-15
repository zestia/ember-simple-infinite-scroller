import Component from '@glimmer/component';
import { service } from '@ember/service';
import RouteTemplate from 'ember-route-template';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';

class ApplicationTemplate extends Component {
  @service application;

  <template>
    <h1>
      @zestia/ember-simple-infinite-scroller
    </h1>

    <LinkTo @route="example-1">
      Example 1
    </LinkTo>
    |
    <LinkTo @route="example-2">
      Example 2
    </LinkTo>
    |
    <LinkTo @route="example-3">
      Example 3
    </LinkTo>
    |
    <LinkTo @route="example-4">
      Example 4
    </LinkTo>
    |
    <LinkTo @route="example-5">
      Example 5
    </LinkTo>

    <p>
      <label>
        Load delay:
        <br />
        <input
          value={{this.application.loadDelay}}
          type="number"
          {{on "input" this.application.setLoadDelay}}
        />
      </label>
    </p>

    {{outlet}}

    {{! template-lint-disable no-inline-styles }}
    <a href="https://github.com/zestia/ember-simple-infinite-scroller">
      <img
        style="position: absolute; top: 0; right: 0; border: 0;"
        width="149"
        height="149"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"
        class="attachment-full size-full"
        alt="Fork me on GitHub"
        data-recalc-dims="1"
      />
    </a>
  </template>
}

export default RouteTemplate(ApplicationTemplate);
