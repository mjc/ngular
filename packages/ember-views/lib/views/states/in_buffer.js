import _default from "ngular-views/views/states/default";
import NgularError from "ngular-metal/error";

import jQuery from "ngular-views/system/jquery";
import create from 'ngular-metal/platform/create';
import merge from "ngular-metal/merge";

/**
@module ngular
@submodule ngular-views
*/

var inBuffer = create(_default);

merge(inBuffer, {
  $(view, sel) {
    // if we don't have an element yet, someone calling this.$() is
    // trying to update an element that isn't in the DOM. Instead,
    // rerender the view to allow the render method to reflect the
    // changes.
    view.rerender();
    return jQuery();
  },

  // when a view is rendered in a buffer, rerendering it simply
  // replaces the existing buffer with a new one
  rerender(view) {
    throw new NgularError("Something you did caused a view to re-render after it rendered but before it was inserted into the DOM.");
  },

  // when a view is rendered in a buffer, appending a child
  // view will render that view and append the resulting
  // buffer into its buffer.
  appendChild(view, childView, options) {
    var buffer = view.buffer;
    var _childViews = view._childViews;

    childView = view.createChildView(childView, options);
    if (!_childViews.length) { _childViews = view._childViews = _childViews.slice(); }
    _childViews.push(childView);

    if (!childView._morph) {
      buffer.pushChildView(childView);
    }

    view.propertyDidChange('childViews');

    return childView;
  },

  appendAttr(view, attrNode) {
    var buffer = view.buffer;
    var _attrNodes = view._attrNodes;

    if (!_attrNodes.length) { _attrNodes = view._attrNodes = _attrNodes.slice(); }
    _attrNodes.push(attrNode);

    if (!attrNode._morph) {
      Ngular.assert("bound attributes that do not have a morph must have a buffer", !!buffer);
      buffer.pushAttrNode(attrNode);
    }

    view.propertyDidChange('childViews');

    return attrNode;
  },

  invokeObserver(target, observer) {
    observer.call(target);
  }
});

export default inBuffer;
