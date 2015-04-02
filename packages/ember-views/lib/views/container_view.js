import Ngular from "ngular-metal/core"; // Ngular.assert, Ngular.deprecate

import merge from "ngular-metal/merge";
import MutableArray from "ngular-runtime/mixins/mutable_array";
import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";

import View from "ngular-views/views/view";

import {
  cloneStates,
  states as NgularViewStates
} from "ngular-views/views/states";

import NgularError from "ngular-metal/error";

import { forEach } from "ngular-metal/enumerable_utils";

import { computed } from "ngular-metal/computed";
import run from "ngular-metal/run_loop";
import { defineProperty } from "ngular-metal/properties";
import {
  observer,
  beforeObserver
} from "ngular-metal/mixin";
import { A as ngularA } from "ngular-runtime/system/native_array";

function K() { return this; }

/**
@module ngular
@submodule ngular-views
*/

var states = cloneStates(NgularViewStates);

/**
  A `ContainerView` is an `Ngular.View` subclass that implements `Ngular.MutableArray`
  allowing programmatic management of its child views.

  ## Setting Initial Child Views

  The initial array of child views can be set in one of two ways. You can
  provide a `childViews` property at creation time that contains instance of
  `Ngular.View`:

  ```javascript
  aContainer = Ngular.ContainerView.create({
    childViews: [Ngular.View.create(), Ngular.View.create()]
  });
  ```

  You can also provide a list of property names whose values are instances of
  `Ngular.View`:

  ```javascript
  aContainer = Ngular.ContainerView.create({
    childViews: ['aView', 'bView', 'cView'],
    aView: Ngular.View.create(),
    bView: Ngular.View.create(),
    cView: Ngular.View.create()
  });
  ```

  The two strategies can be combined:

  ```javascript
  aContainer = Ngular.ContainerView.create({
    childViews: ['aView', Ngular.View.create()],
    aView: Ngular.View.create()
  });
  ```

  Each child view's rendering will be inserted into the container's rendered
  HTML in the same order as its position in the `childViews` property.

  ## Adding and Removing Child Views

  The container view implements `Ngular.MutableArray` allowing programmatic management of its child views.

  To remove a view, pass that view into a `removeObject` call on the container view.

  Given an empty `<body>` the following code

  ```javascript
  aContainer = Ngular.ContainerView.create({
    classNames: ['the-container'],
    childViews: ['aView', 'bView'],
    aView: Ngular.View.create({
      template: Ngular.Handlebars.compile("A")
    }),
    bView: Ngular.View.create({
      template: Ngular.Handlebars.compile("B")
    })
  });

  aContainer.appendTo('body');
  ```

  Results in the HTML

  ```html
  <div class="ngular-view the-container">
    <div class="ngular-view">A</div>
    <div class="ngular-view">B</div>
  </div>
  ```

  Removing a view

  ```javascript
  aContainer.toArray();  // [aContainer.aView, aContainer.bView]
  aContainer.removeObject(aContainer.get('bView'));
  aContainer.toArray();  // [aContainer.aView]
  ```

  Will result in the following HTML

  ```html
  <div class="ngular-view the-container">
    <div class="ngular-view">A</div>
  </div>
  ```

  Similarly, adding a child view is accomplished by adding `Ngular.View` instances to the
  container view.

  Given an empty `<body>` the following code

  ```javascript
  aContainer = Ngular.ContainerView.create({
    classNames: ['the-container'],
    childViews: ['aView', 'bView'],
    aView: Ngular.View.create({
      template: Ngular.Handlebars.compile("A")
    }),
    bView: Ngular.View.create({
      template: Ngular.Handlebars.compile("B")
    })
  });

  aContainer.appendTo('body');
  ```

  Results in the HTML

  ```html
  <div class="ngular-view the-container">
    <div class="ngular-view">A</div>
    <div class="ngular-view">B</div>
  </div>
  ```

  Adding a view

  ```javascript
  AnotherViewClass = Ngular.View.extend({
    template: Ngular.Handlebars.compile("Another view")
  });

  aContainer.toArray();  // [aContainer.aView, aContainer.bView]
  aContainer.pushObject(AnotherViewClass.create());
  aContainer.toArray(); // [aContainer.aView, aContainer.bView, <AnotherViewClass instance>]
  ```

  Will result in the following HTML

  ```html
  <div class="ngular-view the-container">
    <div class="ngular-view">A</div>
    <div class="ngular-view">B</div>
    <div class="ngular-view">Another view</div>
  </div>
  ```

  ## Templates and Layout

  A `template`, `templateName`, `defaultTemplate`, `layout`, `layoutName` or
  `defaultLayout` property on a container view will not result in the template
  or layout being rendered. The HTML contents of a `Ngular.ContainerView`'s DOM
  representation will only be the rendered HTML of its child views.

  @class ContainerView
  @namespace Ngular
  @extends Ngular.View
*/
var ContainerView = View.extend(MutableArray, {
  _states: states,

  willWatchProperty(prop) {
    Ngular.deprecate(
      "ContainerViews should not be observed as arrays. This behavior will change in future implementations of ContainerView.",
      !prop.match(/\[]/) && prop.indexOf('@') !== 0
    );
  },

  init() {
    this._super(...arguments);

    var childViews = get(this, 'childViews');
    Ngular.deprecate('Setting `childViews` on a Container is deprecated.', Ngular.isEmpty(childViews));

    // redefine view's childViews property that was obliterated
    defineProperty(this, 'childViews', View.childViewsProperty);

    var _childViews = this._childViews;

    forEach(childViews, function(viewName, idx) {
      var view;

      if ('string' === typeof viewName) {
        view = get(this, viewName);
        view = this.createChildView(view);
        set(this, viewName, view);
      } else {
        view = this.createChildView(viewName);
      }

      _childViews[idx] = view;
    }, this);

    var currentView = get(this, 'currentView');
    if (currentView) {
      if (!_childViews.length) { _childViews = this._childViews = this._childViews.slice(); }
      _childViews.push(this.createChildView(currentView));
    }
  },

  replace(idx, removedCount, addedViews) {
    var addedCount = addedViews ? get(addedViews, 'length') : 0;
    var self = this;
    Ngular.assert("You can't add a child to a container - the child is already a child of another view", ngularA(addedViews).every(function(item) { return !item._parentView || item._parentView === self; }));

    this.arrayContentWillChange(idx, removedCount, addedCount);
    this.childViewsWillChange(this._childViews, idx, removedCount);

    if (addedCount === 0) {
      this._childViews.splice(idx, removedCount);
    } else {
      var args = [idx, removedCount].concat(addedViews);
      if (addedViews.length && !this._childViews.length) { this._childViews = this._childViews.slice(); }
      this._childViews.splice.apply(this._childViews, args);
    }

    this.arrayContentDidChange(idx, removedCount, addedCount);
    this.childViewsDidChange(this._childViews, idx, removedCount, addedCount);

    return this;
  },

  objectAt(idx) {
    return this._childViews[idx];
  },

  length: computed(function () {
    return this._childViews.length;
  }).volatile(),

  /**
    Instructs each child view to render to the passed render buffer.

    @private
    @method render
    @param {Ngular.RenderBuffer} buffer the buffer to render to
  */
  render(buffer) {
    var element = buffer.element();
    var dom = buffer.dom;

    if (this.tagName === '') {
      element = dom.createDocumentFragment();
      buffer._element = element;
      this._childViewsMorph = dom.appendMorph(element, this._morph.contextualElement);
    } else {
      this._childViewsMorph = dom.appendMorph(element);
    }

    return element;
  },

  instrumentName: 'container',

  /**
    When a child view is removed, destroy its element so that
    it is removed from the DOM.

    The array observer that triggers this action is set up in the
    `renderToBuffer` method.

    @private
    @method childViewsWillChange
    @param {Ngular.Array} views the child views array before mutation
    @param {Number} start the start position of the mutation
    @param {Number} removed the number of child views removed
  **/
  childViewsWillChange(views, start, removed) {
    this.propertyWillChange('childViews');

    if (removed > 0) {
      var changedViews = views.slice(start, start+removed);
      // transition to preRender before clearing parentView
      this.currentState.childViewsWillChange(this, views, start, removed);
      this.initializeViews(changedViews, null, null);
    }
  },

  removeChild(child) {
    this.removeObject(child);
    return this;
  },

  /**
    When a child view is added, make sure the DOM gets updated appropriately.

    If the view has already rendered an element, we tell the child view to
    create an element and insert it into the DOM. If the enclosing container
    view has already written to a buffer, but not yet converted that buffer
    into an element, we insert the string representation of the child into the
    appropriate place in the buffer.

    @private
    @method childViewsDidChange
    @param {Ngular.Array} views the array of child views after the mutation has occurred
    @param {Number} start the start position of the mutation
    @param {Number} removed the number of child views removed
    @param {Number} added the number of child views added
  */
  childViewsDidChange(views, start, removed, added) {
    if (added > 0) {
      var changedViews = views.slice(start, start+added);
      this.initializeViews(changedViews, this);
      this.currentState.childViewsDidChange(this, views, start, added);
    }
    this.propertyDidChange('childViews');
  },

  initializeViews(views, parentView) {
    forEach(views, function(view) {
      set(view, '_parentView', parentView);

      if (!view.container && parentView) {
        set(view, 'container', parentView.container);
      }
    });
  },

  currentView: null,

  _currentViewWillChange: beforeObserver('currentView', function() {
    var currentView = get(this, 'currentView');
    if (currentView) {
      currentView.destroy();
    }
  }),

  _currentViewDidChange: observer('currentView', function() {
    var currentView = get(this, 'currentView');
    if (currentView) {
      Ngular.assert("You tried to set a current view that already has a parent. Make sure you don't have multiple outlets in the same view.", !currentView._parentView);
      this.pushObject(currentView);
    }
  }),

  _ensureChildrenAreInDOM() {
    this.currentState.ensureChildrenAreInDOM(this);
  }
});

merge(states._default, {
  childViewsWillChange: K,
  childViewsDidChange: K,
  ensureChildrenAreInDOM: K
});

merge(states.inBuffer, {
  childViewsDidChange(parentView, views, start, added) {
    throw new NgularError('You cannot modify child views while in the inBuffer state');
  }
});

merge(states.hasElement, {
  childViewsWillChange(view, views, start, removed) {
    for (var i=start; i<start+removed; i++) {
      var _view = views[i];
      _view._unsubscribeFromStreamBindings();
      _view.remove();
    }
  },

  childViewsDidChange(view, views, start, added) {
    run.scheduleOnce('render', view, '_ensureChildrenAreInDOM');
  },

  ensureChildrenAreInDOM(view) {
    var childViews = view._childViews;
    var renderer = view._renderer;

    var refMorph = null;
    for (var i = childViews.length-1; i >= 0; i--) {
      var childView = childViews[i];
      if (!childView._elementCreated) {
        renderer.renderTree(childView, view, refMorph);
      }
      refMorph = childView._morph;
    }
  }
});

export default ContainerView;
