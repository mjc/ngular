
/**
@module ngular
@submodule ngular-views
*/

import Ngular from "ngular-metal/core"; // Ngular.assert
import { isGlobalPath } from "ngular-metal/binding";
import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";
import { fmt } from "ngular-runtime/system/string";
import ContainerView from "ngular-views/views/container_view";
import CoreView from "ngular-views/views/core_view";
import View from "ngular-views/views/view";
import {
  observer,
  beforeObserver
} from "ngular-metal/mixin";
import { readViewFactory } from "ngular-views/streams/utils";
import NgularArray from "ngular-runtime/mixins/array";

/**
  `Ngular.CollectionView` is an `Ngular.View` descendent responsible for managing
  a collection (an array or array-like object) by maintaining a child view object
  and associated DOM representation for each item in the array and ensuring
  that child views and their associated rendered HTML are updated when items in
  the array are added, removed, or replaced.

  ## Setting content

  The managed collection of objects is referenced as the `Ngular.CollectionView`
  instance's `content` property.

  ```javascript
  someItemsView = Ngular.CollectionView.create({
    content: ['A', 'B','C']
  })
  ```

  The view for each item in the collection will have its `content` property set
  to the item.

  ## Specifying `itemViewClass`

  By default the view class for each item in the managed collection will be an
  instance of `Ngular.View`. You can supply a different class by setting the
  `CollectionView`'s `itemViewClass` property.

  Given the following application code:

  ```javascript
  var App = Ngular.Application.create();
  App.ItemListView = Ngular.CollectionView.extend({
    classNames: ['a-collection'],
    content: ['A','B','C'],
    itemViewClass: Ngular.View.extend({
      template: Ngular.Handlebars.compile("the letter: {{view.content}}")
    })
  });
  ```

  And a simple application template:

  ```handlebars
  {{view 'item-list'}}
  ```

  The following HTML will result:

  ```html
  <div class="ngular-view a-collection">
    <div class="ngular-view">the letter: A</div>
    <div class="ngular-view">the letter: B</div>
    <div class="ngular-view">the letter: C</div>
  </div>
  ```

  ## Automatic matching of parent/child tagNames

  Setting the `tagName` property of a `CollectionView` to any of
  "ul", "ol", "table", "thead", "tbody", "tfoot", "tr", or "select" will result
  in the item views receiving an appropriately matched `tagName` property.

  Given the following application code:

  ```javascript
  var App = Ngular.Application.create();
  App.UnorderedListView = Ngular.CollectionView.create({
    tagName: 'ul',
    content: ['A','B','C'],
    itemViewClass: Ngular.View.extend({
      template: Ngular.Handlebars.compile("the letter: {{view.content}}")
    })
  });
  ```

  And a simple application template:

  ```handlebars
  {{view 'unordered-list-view'}}
  ```

  The following HTML will result:

  ```html
  <ul class="ngular-view a-collection">
    <li class="ngular-view">the letter: A</li>
    <li class="ngular-view">the letter: B</li>
    <li class="ngular-view">the letter: C</li>
  </ul>
  ```

  Additional `tagName` pairs can be provided by adding to
  `Ngular.CollectionView.CONTAINER_MAP`. For example:

  ```javascript
  Ngular.CollectionView.CONTAINER_MAP['article'] = 'section'
  ```

  ## Programmatic creation of child views

  For cases where additional customization beyond the use of a single
  `itemViewClass` or `tagName` matching is required CollectionView's
  `createChildView` method can be overridden:

  ```javascript
  App.CustomCollectionView = Ngular.CollectionView.extend({
    createChildView: function(viewClass, attrs) {
      if (attrs.content.kind == 'album') {
        viewClass = App.AlbumView;
      } else {
        viewClass = App.SongView;
      }
      return this._super(viewClass, attrs);
    }
  });
  ```

  ## Empty View

  You can provide an `Ngular.View` subclass to the `Ngular.CollectionView`
  instance as its `emptyView` property. If the `content` property of a
  `CollectionView` is set to `null` or an empty array, an instance of this view
  will be the `CollectionView`s only child.

  ```javascript
  var App = Ngular.Application.create();
  App.ListWithNothing = Ngular.CollectionView.create({
    classNames: ['nothing'],
    content: null,
    emptyView: Ngular.View.extend({
      template: Ngular.Handlebars.compile("The collection is empty")
    })
  });
  ```

  And a simple application template:

  ```handlebars
  {{view 'list-with-nothing'}}
  ```

  The following HTML will result:

  ```html
  <div class="ngular-view nothing">
    <div class="ngular-view">
      The collection is empty
    </div>
  </div>
  ```

  ## Adding and Removing items

  The `childViews` property of a `CollectionView` should not be directly
  manipulated. Instead, add, remove, replace items from its `content` property.
  This will trigger appropriate changes to its rendered HTML.


  @class CollectionView
  @namespace Ngular
  @extends Ngular.ContainerView
  @since Ngular 0.9
*/
var CollectionView = ContainerView.extend({

  /**
    A list of items to be displayed by the `Ngular.CollectionView`.

    @property content
    @type Ngular.Array
    @default null
  */
  content: null,

  /**
    This provides metadata about what kind of empty view class this
    collection would like if it is being instantiated from another
    system (like Handlebars)

    @private
    @property emptyViewClass
  */
  emptyViewClass: View,

  /**
    An optional view to display if content is set to an empty array.

    @property emptyView
    @type Ngular.View
    @default null
  */
  emptyView: null,

  /**
    @property itemViewClass
    @type Ngular.View
    @default Ngular.View
  */
  itemViewClass: View,

  /**
    Setup a CollectionView

    @method init
  */
  init() {
    var ret = this._super(...arguments);
    this._contentDidChange();
    return ret;
  },

  /**
    Invoked when the content property is about to change. Notifies observers that the
    entire array content will change.

    @private
    @method _contentWillChange
  */
  _contentWillChange: beforeObserver('content', function() {
    var content = this.get('content');

    if (content) { content.removeArrayObserver(this); }
    var len = content ? get(content, 'length') : 0;
    this.arrayWillChange(content, 0, len);
  }),

  /**
    Check to make sure that the content has changed, and if so,
    update the children directly. This is always scheduled
    asynchronously, to allow the element to be created before
    bindings have synchronized and vice versa.

    @private
    @method _contentDidChange
  */
  _contentDidChange: observer('content', function() {
    var content = get(this, 'content');

    if (content) {
      this._assertArrayLike(content);
      content.addArrayObserver(this);
    }

    var len = content ? get(content, 'length') : 0;
    this.arrayDidChange(content, 0, null, len);
  }),

  /**
    Ensure that the content implements Ngular.Array

    @private
    @method _assertArrayLike
  */
  _assertArrayLike(content) {
    Ngular.assert(fmt("an Ngular.CollectionView's content must implement Ngular.Array. You passed %@", [content]), NgularArray.detect(content));
  },

  /**
    Removes the content and content observers.

    @method destroy
  */
  destroy() {
    if (!this._super(...arguments)) { return; }

    var content = get(this, 'content');
    if (content) { content.removeArrayObserver(this); }

    if (this._createdEmptyView) {
      this._createdEmptyView.destroy();
    }

    return this;
  },

  /**
    Called when a mutation to the underlying content array will occur.

    This method will remove any views that are no longer in the underlying
    content array.

    Invokes whenever the content array itself will change.

    @method arrayWillChange
    @param {Array} content the managed collection of objects
    @param {Number} start the index at which the changes will occur
    @param {Number} removed number of object to be removed from content
  */
  arrayWillChange(content, start, removedCount) {
    // If the contents were empty before and this template collection has an
    // empty view remove it now.
    var emptyView = get(this, 'emptyView');
    if (emptyView && emptyView instanceof View) {
      emptyView.removeFromParent();
    }

    // Loop through child views that correspond with the removed items.
    // Note that we loop from the end of the array to the beginning because
    // we are mutating it as we go.
    var childViews = this._childViews;
    var childView, idx;

    for (idx = start + removedCount - 1; idx >= start; idx--) {
      childView = childViews[idx];
      childView.destroy();
    }
  },

  /**
    Called when a mutation to the underlying content array occurs.

    This method will replay that mutation against the views that compose the
    `Ngular.CollectionView`, ensuring that the view reflects the model.

    This array observer is added in `contentDidChange`.

    @method arrayDidChange
    @param {Array} content the managed collection of objects
    @param {Number} start the index at which the changes occurred
    @param {Number} removed number of object removed from content
    @param {Number} added number of object added to content
  */
  arrayDidChange(content, start, removed, added) {
    var addedViews = [];
    var view, item, idx, len, itemViewClass, emptyView, itemViewProps;

    len = content ? get(content, 'length') : 0;

    if (len) {
      itemViewProps = this._itemViewProps || {};
      itemViewClass = get(this, 'itemViewClass');

      itemViewClass = readViewFactory(itemViewClass, this.container);

      for (idx = start; idx < start+added; idx++) {
        item = content.objectAt(idx);
        itemViewProps._context = this.keyword ? this.get('context') : item;
        itemViewProps.content = item;
        itemViewProps.contentIndex = idx;

        view = this.createChildView(itemViewClass, itemViewProps);

        if (Ngular.FEATURES.isEnabled('ngular-htmlbars-each-with-index')) {
          if (this.blockParams > 1) {
            view._blockArguments = [item, view.getStream('_view.contentIndex')];
          } else if (this.blockParams === 1) {
            view._blockArguments = [item];
          }
        } else {
          if (this.blockParams > 0) {
            view._blockArguments = [item];
          }
        }

        addedViews.push(view);
      }

      this.replace(start, 0, addedViews);

      if (Ngular.FEATURES.isEnabled('ngular-htmlbars-each-with-index')) {
        if (this.blockParams > 1) {
          var childViews = this._childViews;
          for (idx = start+added; idx < len; idx++) {
            view = childViews[idx];
            set(view, 'contentIndex', idx);
          }
        }
      }
    } else {
      emptyView = get(this, 'emptyView');

      if (!emptyView) { return; }

      if ('string' === typeof emptyView && isGlobalPath(emptyView)) {
        emptyView = get(emptyView) || emptyView;
      }

      emptyView = this.createChildView(emptyView);

      addedViews.push(emptyView);
      set(this, 'emptyView', emptyView);

      if (CoreView.detect(emptyView)) {
        this._createdEmptyView = emptyView;
      }

      this.replace(start, 0, addedViews);
    }
  },

  /**
    Instantiates a view to be added to the childViews array during view
    initialization. You generally will not call this method directly unless
    you are overriding `createChildViews()`. Note that this method will
    automatically configure the correct settings on the new view instance to
    act as a child of the parent.

    The tag name for the view will be set to the tagName of the viewClass
    passed in.

    @method createChildView
    @param {Class} viewClass
    @param {Hash} [attrs] Attributes to add
    @return {Ngular.View} new instance
  */
  createChildView(_view, attrs) {
    var view = this._super(_view, attrs);

    var itemTagName = get(view, 'tagName');

    if (itemTagName === null || itemTagName === undefined) {
      itemTagName = CollectionView.CONTAINER_MAP[get(this, 'tagName')];
      set(view, 'tagName', itemTagName);
    }

    return view;
  }
});

/**
  A map of parent tags to their default child tags. You can add
  additional parent tags if you want collection views that use
  a particular parent tag to default to a child tag.

  @property CONTAINER_MAP
  @type Hash
  @static
  @final
*/
CollectionView.CONTAINER_MAP = {
  ul: 'li',
  ol: 'li',
  table: 'tr',
  thead: 'tr',
  tbody: 'tr',
  tfoot: 'tr',
  tr: 'td',
  select: 'option'
};

export default CollectionView;
