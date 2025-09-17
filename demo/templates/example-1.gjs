import RouteTemplate from 'ember-route-template';
import InfiniteScroller from '@zestia/ember-simple-infinite-scroller/components/infinite-scroller';

export default RouteTemplate(
  <template>
    <p>
      An action is fired when infinite scroll component is scrolled to the very
      bottom
    </p>

    <InfiniteScroller
      class="example-1"
      @percentDown={{100}}
      @onLoadMore={{@controller.handleLoadMore}}
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
