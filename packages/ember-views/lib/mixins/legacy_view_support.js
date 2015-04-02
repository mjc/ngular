/**
@module ngular
@submodule ngular-views
*/
import Ngular from 'ngular-metal/core';
import { Mixin } from "ngular-metal/mixin";
import { get } from "ngular-metal/property_get";

/**
  @class LegacyViewSupport
  @namespace Ngular
*/
var LegacyViewSupport = Mixin.create({
  beforeRender(buffer) {},

  afterRender(buffer) {},

  mutateChildViews(callback) {
    var childViews = this._childViews;
    var idx = childViews.length;
    var view;

    while (--idx >= 0) {
      view = childViews[idx];
      callback(this, view, idx);
    }

    return this;
  },

  /**
    Removes all children from the `parentView`.

    @method removeAllChildren
    @return {Ngular.View} receiver
  */
  removeAllChildren() {
    return this.mutateChildViews(function(parentView, view) {
      parentView.removeChild(view);
    });
  },

  destroyAllChildren() {
    return this.mutateChildViews(function(parentView, view) {
      view.destroy();
    });
  },

  /**
    Return the nearest ancestor whose parent is an instance of
    `klass`.

    @method nearestChildOf
    @param {Class} klass Subclass of Ngular.View (or Ngular.View itself)
    @return Ngular.View
    @deprecated
  */
  nearestChildOf(klass) {
    Ngular.deprecate("nearestChildOf has been deprecated.");

    var view = get(this, 'parentView');

    while (view) {
      if (get(view, 'parentView') instanceof klass) { return view; }
      view = get(view, 'parentView');
    }
  },

  /**
    Return the nearest ancestor that is an instance of the provided
    class.

    @method nearestInstanceOf
    @param {Class} klass Subclass of Ngular.View (or Ngular.View itself)
    @return Ngular.View
    @deprecated
  */
  nearestInstanceOf(klass) {
    Ngular.deprecate("nearestInstanceOf is deprecated and will be removed from future releases. Use nearestOfType.");
    var view = get(this, 'parentView');

    while (view) {
      if (view instanceof klass) { return view; }
      view = get(view, 'parentView');
    }
  }
});

export default LegacyViewSupport;
