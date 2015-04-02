import NgularError from "ngular-metal/error";

function K() { return this; }

/**
@module ngular
@submodule ngular-views
*/
export default {
  // appendChild is only legal while rendering the buffer.
  appendChild() {
    throw new NgularError("You can't use appendChild outside of the rendering process");
  },

  $() {
    return undefined;
  },

  getElement() {
    return null;
  },

  // Handle events from `Ngular.EventDispatcher`
  handleEvent() {
    return true; // continue event propagation
  },

  destroyElement(view) {
    if (view._renderer) {
      view._renderer.remove(view, false);
    }

    return view;
  },

  rerender: K,
  invokeObserver: K
};
