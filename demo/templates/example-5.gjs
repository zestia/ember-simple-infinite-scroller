import RouteTemplate from 'ember-route-template';
import InfiniteScroller from '@zestia/ember-simple-infinite-scroller/components/infinite-scroller';

export default RouteTemplate(
  <template>
    <p>
      An action is fired when infinite scroll component is scrolled to the very
      top
    </p>

    <InfiniteScroller
      class="example-1"
      @percentUp={{0}}
      @onLoadMore={{@controller.handleLoadMore}}
      as |scroller|
    >
      {{#if scroller.isLoading}}
        <div class="status">
          Loading...
        </div>
      {{/if}}
      {{#each @controller.things as |thing|}}
        <div class="thing" {{@controller.scrollIntoView}}>
          {{thing.name}}
        </div>
      {{/each}}
    </InfiniteScroller>
  </template>
);
