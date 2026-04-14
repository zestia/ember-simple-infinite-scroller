# @zestia/ember-simple-infinite-scroller

<!-- [![Ember Observer][ember-observer-badge]][ember-observer-url] -->
<!-- [![GitHub Actions][github-actions-badge]][github-actions-url] -->

[npm-badge]: https://img.shields.io/npm/v/@zestia/ember-simple-infinite-scroller.svg
[npm-badge-url]: https://www.npmjs.com/package/@zestia/ember-simple-infinite-scroller
[github-actions-badge]: https://github.com/zestia/ember-simple-infinite-scroller/workflows/CI/badge.svg
[github-actions-url]: https://github.com/zestia/ember-simple-infinite-scroller/actions
[ember-observer-badge]: https://emberobserver.com/badges/-zestia-ember-simple-infinite-scroller.svg
[ember-observer-url]: https://emberobserver.com/addons/@zestia/ember-simple-infinite-scroller

This Ember addon provides a simple component that fires an action whenever it is scrolled to a specified percentage. Supports both vertical and horizontal scrolling, allowing you to load more data.

## Installation

```
ember install @zestia/ember-simple-infinite-scroller
```

Add the following to `~/.npmrc` to pull @zestia scoped packages from Github instead of NPM.

```
@zestia:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<YOUR_GH_TOKEN>
```

## Demo

https://zestia.github.io/ember-simple-infinite-scroller

## Example

```handlebars
<InfiniteScroller
  @axis='vertical'
  @percentEnd={{100}}
  @onLoadMore={{this.loadMore}}
  as |scroller|
>
  {{#each things as |thing|}}
    ...
  {{/each}}
  {{if scroller.isLoading 'Please wait...'}}
</InfiniteScroller>
```

## Features

- Very simple! ✔︎
- Bidirectional ✔︎
- Vertical and horizontal ✔︎
- Not coupled to Ember Data ✔︎
- Supports use with FastBoot ✔︎

## Notes

- This addon intentionally does not come with any styles.

## `InfiniteScroller`

### Arguments

#### `@onLoadMore`

Required. Fired when the element has been scrolled to the specified percentage.

#### `@element`

Optional. By default the scroll position of the component's own DOM element is monitored. You can use this argument to change the element, to monitor the document for example.

#### `@axis`

Optional. The scroll axis to monitor. `"vertical"` (default) or `"horizontal"`.

#### `@percentEnd`

Optional. The distance that has to be scrolled toward the end before the load more action is fired. 100% means the very end (bottom for vertical, right for horizontal).

#### `@percentStart`

Optional. The distance that has to be scrolled toward the start before the load more action is fired. 0% means the very start (top for vertical, left for horizontal).

#### `@debounce`

Optional. Milliseconds delay for when to check if more needs to be loaded. Defaults to every `100`ms

### API

#### `isLoading`

Whether the promise for more data has resolved yet

#### `direction`

The direction scrolled that caused `onLoadMore` to fire. Either `"START"` or `"END"`.

#### `isScrollable`

Whether the element is overflowing or not. If it's not, then the user will not be able to scroll to load more. In such a case, you can use this boolean to provide a button to manually load more.

#### `loadMore`

Call this to manually load more

## Testing

A test helper is provided to help scrolling your element

<details>
  <summary>Example</summary>

```javascript
import { scrollToPercentage } from '@zestia/ember-simple-infinite-scroller/test-helpers/scroll-to-percentage';

test('loading more', async function () {
  await visit('/');
  await scrollToPercentage('.infinite-scroller', 100);
});
```

</details>

## Performance

Please read: https://github.com/TryGhost/Ghost/issues/7934

You may need to add the below code to `app/app.js`

<details>
  <summary>View</summary>

```javascript
customEvents = {
  touchstart: null,
  touchmove: null,
  touchend: null,
  touchcancel: null
};
```

</details>
