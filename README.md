# ember-simple-infinite-scroller

<a href="http://emberobserver.com/addons/ember-simple-infinite-scroller"><img src="http://emberobserver.com/badges/ember-simple-infinite-scroller.svg"></a> &nbsp; <a href="https://david-dm.org/amk221/ember-simple-infinite-scroller#badge-embed"><img src="https://david-dm.org/amk221/ember-simple-infinite-scroller.svg"></a> &nbsp; <a href="https://david-dm.org/amk221/ember-simple-infinite-scroller#dev-badge-embed"><img src="https://david-dm.org/amk221/ember-simple-infinite-scroller/dev-status.svg"></a> &nbsp; <a href="https://codeclimate.com/github/amk221/ember-simple-infinite-scroller"><img src="https://codeclimate.com/github/amk221/ember-simple-infinite-scroller/badges/gpa.svg" /></a> &nbsp; <a href="http://travis-ci.org/amk221/ember-simple-infinite-scroller"><img src="https://travis-ci.org/amk221/ember-simple-infinite-scroller.svg?branch=master"></a>

This Ember addon provides a simple component that fires an action whenever it is scrolled to the bottom.
Allowing you to load more data. It is not coupled to Ember-Data like some other infinite scrolling implementations.

### Installation
```
ember install ember-simple-infinite-scroller
```

### Example usage

```handlebars
{{#infinite-scroller on-load-more=(action 'loadMore') as |scroller|}}
  {{#each things as |thing|}}
    ...
  {{/each}}
  {{if scroller.isLoading 'Please wait...'}}
{{/infinite-scroller}}
```

## Configuration

<table>
  <tr>
    <th>Attribute</th>
    <th>Description</th>
    <th>Default</th>
  </tr>
  <tr>
    <td>on-load-more</td>
    <td>Action to perform when the bottom is scrolled to</td>
    <td></td>
  </tr>
  <tr>
    <td>use-document</td>
    <td>Goes off document scroll rather than the element's scroll position</td>
    <td><code>false</code></td>
  </tr>
  <tr>
    <td>trigger-at</td>
    <td>A percentage of the scrollable height to consider as the 'bottom'</td>
    <td><code>"100%"</code></td>
  </tr>
  <tr>
    <td>scroll-debounce</td>
    <td>Milliseconds delay used to check if the bottom has been scrolled to</td>
    <td><code>100</code> ms</td>
  </tr>
</table>


##### Element vs Document scroll

Either make your component scrollable:

```css
.my-element {
  max-height: 300px;
  overflow: auto;
}
```

**OR**

Set `use-document=true` if your component is not scrollable.

```handlebars
{{#infinite-scroller use-document=true}}
  {{! action will fire when the document is scrolled to the bottom }}
{{/infinite-scroller}}
```


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
    <td>error</td>
    <td>The caught error from the last attempt to load more</td>
  </tr>
  <tr>
    <td>loadMore</td>
    <td>Action for manually loading more</td>
  </tr>
</table>

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
