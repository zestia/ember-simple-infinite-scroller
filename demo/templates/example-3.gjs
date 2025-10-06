import Component from '@glimmer/component';
import { service } from '@ember/service';
import RouteTemplate from 'ember-route-template';
import InfiniteScroller from '@zestia/ember-simple-infinite-scroller/components/infinite-scroller';

class Example3Template extends Component {
  @service application;

  <template>
    <p>
      An action is fired when the infinite scroll component is scrolled to 50%
    </p>

    <InfiniteScroller
      class="example-3"
      @percentDown={{50}}
      @onLoadMore={{this.application.handleLoadMore}}
      @debounce={{10}}
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

export default RouteTemplate(Example3Template);
