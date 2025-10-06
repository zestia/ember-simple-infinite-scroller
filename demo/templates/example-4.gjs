import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import RouteTemplate from 'ember-route-template';
import InfiniteScroller from '@zestia/ember-simple-infinite-scroller/components/infinite-scroller';
import { modifier } from 'ember-modifier';

class Example4Template extends Component {
  @service application;

  @tracked scroller;

  setScroller = modifier((element) => (this.scroller = element));

  <template>
    <p>
      An action is fired when a specific element is scrolled to the very bottom
    </p>

    <InfiniteScroller
      class="example-4"
      @percentDown={{100}}
      @element={{this.scroller}}
      @onLoadMore={{this.application.handleLoadMore}}
      as |scroller|
    >
      <div class="internal-element" {{this.setScroller}}>
        {{#each this.application.things as |thing|}}
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
}

export default RouteTemplate(Example4Template);
