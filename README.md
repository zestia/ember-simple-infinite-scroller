# ember-infinite-scroller

<a href="http://emberobserver.com/addons/ember-infinite-scroller"><img src="http://emberobserver.com/badges/ember-infinite-scroller.svg"></a> &nbsp; <a href="https://david-dm.org/amk221/ember-infinite-scroller#badge-embed"><img src="https://david-dm.org/amk221/ember-infinite-scroller.svg"></a> &nbsp; <a href="https://david-dm.org/amk221/ember-infinite-scroller#dev-badge-embed"><img src="https://david-dm.org/amk221/ember-infinite-scroller/dev-status.svg"></a> &nbsp; <a href="https://codeclimate.com/github/amk221/ember-infinite-scroller"><img src="https://codeclimate.com/github/amk221/ember-infinite-scroller/badges/gpa.svg" /></a> &nbsp; <a href="http://travis-ci.org/amk221/ember-infinite-scroller"><img src="https://travis-ci.org/amk221/ember-infinite-scroller.svg?branch=master"></a>

This Ember addon provides a simple component that fires an action whenever it is scrolled to the bottom.
Allowing you to load more data. It is not coupled to Ember-Data like some other infinite scrolling implementations.

### Installation
```
ember install ember-infinite-scroller
```

### Example usage

```handlebars
{{#infinite-scroller on-load-more=(action 'loadMore') as |scroller|}}
  {{#each things as |thing|}}
    ...
  {{/each}}
  {{#if scroller.isLoading 'Please wait...'}}
{{/infinite-scroller}}
```

### With Ember-Data

```javascript
actions: {
  loadMore() {
    this.incrementProperty('page');
    return this.get('store').query('things', {
      page: this.get('page')
    }).then(things => {
      this.set('things', this.get('store').peekAll('thing'));
    });
  }
}
```

### Without Ember-Data

```javascript
actions: {
  loadMore() {
    this.incrementProperty('page');
    return jQuery.ajax('/things', {
      data: {
        page: this.get('page')
      }
    }).then(things => {
      this.get('things').pushObjects(things);
    });
  }
}
```

## Configuration

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
{{/infinite-scroller
```
