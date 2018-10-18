# @zestia/ember-simple-infinite-scroller

<a href="http://emberobserver.com/addons/ember-simple-infinite-scroller"><img src="http://emberobserver.com/badges/ember-simple-infinite-scroller.svg"></a> &nbsp; <a href="https://david-dm.org/zestia/ember-simple-infinite-scroller#badge-embed"><img src="https://david-dm.org/zestia/ember-simple-infinite-scroller.svg"></a> &nbsp; <a href="https://david-dm.org/zestia/ember-simple-infinite-scroller#dev-badge-embed"><img src="https://david-dm.org/zestia/ember-simple-infinite-scroller/dev-status.svg"></a> &nbsp; <a href="http://travis-ci.org/zestia/ember-simple-infinite-scroller"><img src="https://travis-ci.org/zestia/ember-simple-infinite-scroller.svg?branch=master"></a>

This Ember addon provides a simple component that fires an action whenever it is scrolled to the bottom.
Allowing you to load more data. It is not coupled to Ember-Data like some other infinite scrolling implementations.

### Installation
```
ember install @zestia/ember-simple-infinite-scroller
```

### Example usage

```handlebars
<InfiniteScroller @onLoadMore={{action "loadMore"}} as |scroller|>
  {{#each things as |thing|}}
    ...
  {{/each}}
  {{if scroller.isLoading "Please wait..."}}
</InfiniteScroller>
```

### Demo

<a href="https://zestia.github.io/ember-simple-infinite-scroller/#/example-1">
  https://zestia.github.io/ember-simple-infinite-scroller/
</a>

### Notes

* Does not use jQuery
* Supports use with FastBoot

## Configuration

<table>
  <tr>
    <th>Argument</th>
    <th>Description</th>
    <th>Default</th>
  </tr>
  <tr>
    <td>onLoadMore</td>
    <td>Action to perform when the bottom is scrolled into view</td>
    <td><code>null</code></td>
  </tr>
  <tr>
    <td>selector</td>
    <td>Monitors the scrolling of a specific child element, e.g. <code>selector=".foo-bar"</code></td>
    <td><code>null</code></td>
  </tr>
  <tr>
    <td>useDocument</td>
    <td>Monitors the document scroll position rather than the element's scroll position.</td>
    <td><code>false</code></td>
  </tr>
  <tr>
    <td>leeway</td>
    <td>Percentage distance away from the bottom</td>
    <td><code>"0%"</code></td>
  </tr>
  <tr>
    <td>scrollDebounce</td>
    <td>Milliseconds delay used to check if the bottom has been reached</td>
    <td><code>100</code> ms</td>
  </tr>
</table>

### Yielded API

The component will yield a hash that provides:

<table>
  <tr>
    <th>Property</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>isLoading</td>
    <td>True when the promise for more data has not resolved yet</td>
  </tr>
  <tr>
    <td>canScroll</td>
    <td>True when scroll element can be scrolled</td>
  </tr>
  <tr>
    <td>error</td>
    <td>The caught error from the last attempt to load more</td>
  </tr>
  <tr>
    <td>loadMore</td>
    <td>Action for manually loading more</td>
  </tr>
</table>

##### Element vs Document scroll

Either make your component scrollable:

```css
.my-element {
  max-height: 300px;
  overflow-y: auto;
}
```

**OR**

Set `useDocument=true` if your component is not scrollable.

### Performance

Please read: https://github.com/TryGhost/Ghost/issues/7934

You may need to add this to `app/app.js`

```javascript
customEvents: {
  touchstart: null,
  touchmove: null,
  touchend: null,
  touchcancel: null
}
```

### Other scenarios

If your scrollable element is displaying 10 things, but they don't cause the element to overflow,
then the user won't ever be able to load more - because they won't be able to scroll and therefore
the `onLoadMore` action will never fire.

To account for this, you can display a button for manually loading more...

```handlebars
<InfiniteScroller @onLoadMore={{action "loadMore"}} as |scroller|>
  {{#each this.things as |thing|}}
    ...
  {{/each}}

  {{#if this.hasMoreThings}}
    {{#if scroller.canScroll}}
      Loading more...
    {{else}}
      <button onclick={{action scroller.loadMore}}>Load more</button>
    {{/if}}
  {{/if}}
</InfiniteScroller>
```
