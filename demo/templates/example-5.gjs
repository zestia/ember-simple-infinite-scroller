import Component from '@glimmer/component';
import { service } from '@ember/service';
import RouteTemplate from 'ember-route-template';
import InfiniteScroller from '@zestia/ember-simple-infinite-scroller/components/infinite-scroller';
import { modifier } from 'ember-modifier';

const scrollIntoView = modifier((element) => element.scrollIntoView());

class Example5Template extends Component {
  @service application;

  <template>
    <p>
      An action is fired when infinite scroll component is scrolled to the very
      top
    </p>

    <InfiniteScroller
      class="example-1"
      @percentUp={{0}}
      @onLoadMore={{this.application.handleLoadMore}}
      as |scroller|
    >
      {{#if scroller.isLoading}}
        <div class="status">
          Loading...
        </div>
      {{/if}}
      {{#each this.application.things as |thing|}}
        <div class="thing" {{scrollIntoView}}>
          {{thing.name}}
        </div>
      {{/each}}
    </InfiniteScroller>
  </template>
}

export default RouteTemplate(Example5Template);
