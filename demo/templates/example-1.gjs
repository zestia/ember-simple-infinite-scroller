import Component from '@glimmer/component';
import { service } from '@ember/service';
import RouteTemplate from 'ember-route-template';
import InfiniteScroller from '@zestia/ember-simple-infinite-scroller/components/infinite-scroller';

class Example1Template extends Component {
  @service application;

  <template>
    <p>
      An action is fired when infinite scroll component is scrolled to the very
      bottom
    </p>

    <InfiniteScroller
      class="example-1"
      @percentDown={{100}}
      @onLoadMore={{this.application.handleLoadMore}}
      as |scroller|
    >
      {{#each this.application.things as |thing|}}
        <div class="thing">
          {{thing.name}}
        </div>
      {{/each}}
      {{#if scroller.isLoading}}
        <div class="status">
          Loading...
        </div>
      {{/if}}
    </InfiniteScroller>
  </template>
}

export default RouteTemplate(Example1Template);
