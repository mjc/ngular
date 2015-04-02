import _default from "ngular-views/views/states/default";
import run from "ngular-metal/run_loop";
import merge from "ngular-metal/merge";
import create from 'ngular-metal/platform/create';
import jQuery from "ngular-views/system/jquery";
import NgularError from "ngular-metal/error";

/**
@module ngular
@submodule ngular-views
*/

import { get } from "ngular-metal/property_get";

var hasElement = create(_default);

merge(hasElement, {
  $(view, sel) {
    var elem = view.get('concreteView').element;
    return sel ? jQuery(sel, elem) : jQuery(elem);
  },

  getElement(view) {
    var parent = get(view, 'parentView');
    if (parent) { parent = get(parent, 'element'); }
    if (parent) { return view.findElementInParentElement(parent); }
    return jQuery("#" + get(view, 'elementId'))[0];
  },

  // once the view has been inserted into the DOM, rerendering is
  // deferred to allow bindings to synchronize.
  rerender(view) {
    if (view._root._morph && !view._elementInserted) {
      throw new NgularError("Something you did caused a view to re-render after it rendered but before it was inserted into the DOM.");
    }
    // TODO: should be scheduled with renderer
    run.scheduleOnce('render', function () {
      if (view.isDestroying) {
        return;
      }

      view._renderer.renderTree(view, view._parentView);
    });
  },

  // once the view is already in the DOM, destroying it removes it
  // from the DOM, nukes its element, and puts it back into the
  // preRender state if inDOM.

  destroyElement(view) {
    view._renderer.remove(view, false);
    return view;
  },

  // Handle events from `Ngular.EventDispatcher`
  handleEvent(view, eventName, evt) {
    if (view.has(eventName)) {
      // Handler should be able to re-dispatch events, so we don't
      // preventDefault or stopPropagation.
      return view.trigger(eventName, evt);
    } else {
      return true; // continue event propagation
    }
  },

  invokeObserver(target, observer) {
    observer.call(target);
  }
});

export default hasElement;
