import RouteTemplate from 'ember-route-template';
import InfiniteScroller from '@zestia/ember-simple-infinite-scroller/components/infinite-scroller';

export default RouteTemplate(
  <template>
    <p>
      An action is fired when the infinite scroll component is scrolled to 50%
    </p>

    <InfiniteScroller
      class="example-3"
      @percentDown={{50}}
      @onLoadMore={{@controller.handleLoadMore}}
      @debounce={{10}}
      as |scroller|
    >
      {{#each @controller.things as |thing|}}
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
);
