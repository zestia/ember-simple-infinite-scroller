import Component from '@glimmer/component';
import { service } from '@ember/service';
import RouteTemplate from 'ember-route-template';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import InfiniteScroller from '@zestia/ember-simple-infinite-scroller/components/infinite-scroller';

class Example2Template extends Component {
  @service application;

  <template>
    <p>
      An action is fired when document is scrolled to the very bottom
    </p>
    <p>
      Note that if there is no scroll movement available (due to lack of enough
      items to cause overflow), you can display a button to manually load more.
    </p>

    <InfiniteScroller
      class="example-2"
      @percentDown={{100}}
      @onLoadMore={{this.application.handleLoadMore}}
      @element={{this.application.document}}
      as |scroller|
    >
      {{#each this.application.things as |thing|}}
        <div class="thing">
          {{thing.name}}
        </div>
      {{/each}}

      {{#unless scroller.isScrollable}}
        <button type="button" {{on "click" (fn scroller.loadMore "DOWN")}}>
          Load more
        </button>
      {{/unless}}

      {{#if scroller.isLoading}}
        <div class="status">
          Loading...
        </div>
      {{/if}}
    </InfiniteScroller>
  </template>
}

export default RouteTemplate(Example2Template);
