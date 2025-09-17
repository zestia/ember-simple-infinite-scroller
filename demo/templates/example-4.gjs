import RouteTemplate from 'ember-route-template';
import InfiniteScroller from '@zestia/ember-simple-infinite-scroller/components/infinite-scroller';

export default RouteTemplate(
  <template>
    <p>
      An action is fired when a specific element is scrolled to the very bottom
    </p>

    <InfiniteScroller
      class="example-4"
      @percentDown={{100}}
      @element={{@controller.scroller}}
      @onLoadMore={{@controller.handleLoadMore}}
      as |scroller|
    >
      <div class="internal-element" {{@controller.setScroller}}>
        {{#each @controller.things as |thing|}}
          <div class="thing">
            {{thing.name}}
          </div>
        {{/each}}
      </div>
      {{#if scroller.isLoading}}
        <div class="status">
          Loading...
        </div>
      {{/if}}
    </InfiniteScroller>
  </template>
);
