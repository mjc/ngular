import Renderer from "ngular-views/system/renderer";
import DOMHelper from "dom-helper";

import {
  cloneStates,
  states
} from "ngular-views/views/states";
import NgularObject from "ngular-runtime/system/object";
import Evented from "ngular-runtime/mixins/evented";
import ActionHandler from "ngular-runtime/mixins/action_handler";

import { get } from "ngular-metal/property_get";
import { computed } from "ngular-metal/computed";

import { typeOf } from "ngular-metal/utils";

function K() { return this; }

// Normally, the renderer is injected by the container when the view is looked
// up. However, if someone creates a view without looking it up via the
// container (e.g. `Ngular.View.create().append()`) then we create a fallback
// DOM renderer that is shared. In general, this path should be avoided since
// views created this way cannot run in a node environment.
var renderer;

/**
  `Ngular.CoreView` is an abstract class that exists to give view-like behavior
  to both Ngular's main view class `Ngular.View` and other classes that don't need
  the fully functionaltiy of `Ngular.View`.

  Unless you have specific needs for `CoreView`, you will use `Ngular.View`
  in your applications.

  @class CoreView
  @namespace Ngular
  @extends Ngular.Object
  @deprecated Use `Ngular.View` instead.
  @uses Ngular.Evented
  @uses Ngular.ActionHandler
*/
var CoreView = NgularObject.extend(Evented, ActionHandler, {
  isView: true,
  isVirtual: false,

  _states: cloneStates(states),

  init() {
    this._super.apply(this, arguments);
    this._state = 'preRender';
    this.currentState = this._states.preRender;
    this._isVisible = get(this, 'isVisible');

    // Fallback for legacy cases where the view was created directly
    // via `create()` instead of going through the container.
    if (!this.renderer) {
      renderer = renderer || new Renderer(new DOMHelper());
      this.renderer = renderer;
    }
  },

  /**
    If the view is currently inserted into the DOM of a parent view, this
    property will point to the parent of the view.

    @property parentView
    @type Ngular.View
    @default null
  */
  parentView: computed('_parentView', function() {
    var parent = this._parentView;

    if (parent && parent.isVirtual) {
      return get(parent, 'parentView');
    } else {
      return parent;
    }
  }),

  _state: null,

  _parentView: null,

  // return the current view, not including virtual views
  concreteView: computed('parentView', function() {
    if (!this.isVirtual) {
      return this;
    } else {
      return get(this, 'parentView.concreteView');
    }
  }),

  instrumentName: 'core_view',

  instrumentDetails(hash) {
    hash.object = this.toString();
    hash.containerKey = this._debugContainerKey;
    hash.view = this;
  },

  /**
    Override the default event firing from `Ngular.Evented` to
    also call methods with the given name.

    @method trigger
    @param name {String}
    @private
  */
  trigger() {
    this._super.apply(this, arguments);
    var name = arguments[0];
    var method = this[name];
    if (method) {
      var length = arguments.length;
      var args = new Array(length - 1);
      for (var i = 1; i < length; i++) {
        args[i - 1] = arguments[i];
      }
      return method.apply(this, args);
    }
  },

  has(name) {
    return typeOf(this[name]) === 'function' || this._super(name);
  },

  destroy() {
    var parent = this._parentView;

    if (!this._super(...arguments)) { return; }


    // destroy the element -- this will avoid each child view destroying
    // the element over and over again...
    if (!this.removedFromDOM && this._renderer) {
      this._renderer.remove(this, true);
    }

    // remove from parent if found. Don't call removeFromParent,
    // as removeFromParent will try to remove the element from
    // the DOM again.
    if (parent) { parent.removeChild(this); }

    this._transitionTo('destroying', false);

    return this;
  },

  clearRenderedChildren: K,
  _transitionTo: K,
  destroyElement: K
});

CoreView.reopenClass({
  isViewClass: true
});

export var DeprecatedCoreView = CoreView.extend({
  init() {
    Ngular.deprecate('Ngular.CoreView is deprecated. Please use Ngular.View.', false);
    this._super.apply(this, arguments);
  }
});

export default CoreView;
