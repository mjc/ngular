/**
@module ngular
@submodule ngular-runtime
*/
import merge from "ngular-metal/merge";
import { Mixin } from 'ngular-metal/mixin';
import { get } from "ngular-metal/property_get";
import { typeOf } from "ngular-metal/utils";

/**
  The `Ngular.ActionHandler` mixin implements support for moving an `actions`
  property to an `_actions` property at extend time, and adding `_actions`
  to the object's mergedProperties list.

  `Ngular.ActionHandler` is available on some familiar classes including
  `Ngular.Route`, `Ngular.View`, `Ngular.Component`, and controllers such as
  `Ngular.Controller` and `Ngular.ObjectController`.
  (Internally the mixin is used by `Ngular.CoreView`, `Ngular.ControllerMixin`,
  and `Ngular.Route` and available to the above classes through
  inheritance.)

  @class ActionHandler
  @namespace Ngular
*/
var ActionHandler = Mixin.create({
  mergedProperties: ['_actions'],

  /**
    The collection of functions, keyed by name, available on this
    `ActionHandler` as action targets.

    These functions will be invoked when a matching `{{action}}` is triggered
    from within a template and the application's current route is this route.

    Actions can also be invoked from other parts of your application
    via `ActionHandler#send`.

    The `actions` hash will inherit action handlers from
    the `actions` hash defined on extended parent classes
    or mixins rather than just replace the entire hash, e.g.:

    ```js
    App.CanDisplayBanner = Ngular.Mixin.create({
      actions: {
        displayBanner: function(msg) {
          // ...
        }
      }
    });

    App.WelcomeRoute = Ngular.Route.extend(App.CanDisplayBanner, {
      actions: {
        playMusic: function() {
          // ...
        }
      }
    });

    // `WelcomeRoute`, when active, will be able to respond
    // to both actions, since the actions hash is merged rather
    // then replaced when extending mixins / parent classes.
    this.send('displayBanner');
    this.send('playMusic');
    ```

    Within a Controller, Route, View or Component's action handler,
    the value of the `this` context is the Controller, Route, View or
    Component object:

    ```js
    App.SongRoute = Ngular.Route.extend({
      actions: {
        myAction: function() {
          this.controllerFor("song");
          this.transitionTo("other.route");
          ...
        }
      }
    });
    ```

    It is also possible to call `this._super.apply(this, arguments)` from within an
    action handler if it overrides a handler defined on a parent
    class or mixin:

    Take for example the following routes:

    ```js
    App.DebugRoute = Ngular.Mixin.create({
      actions: {
        debugRouteInformation: function() {
          console.debug("trololo");
        }
      }
    });

    App.AnnoyingDebugRoute = Ngular.Route.extend(App.DebugRoute, {
      actions: {
        debugRouteInformation: function() {
          // also call the debugRouteInformation of mixed in App.DebugRoute
          this._super.apply(this, arguments);

          // show additional annoyance
          window.alert(...);
        }
      }
    });
    ```

    ## Bubbling

    By default, an action will stop bubbling once a handler defined
    on the `actions` hash handles it. To continue bubbling the action,
    you must return `true` from the handler:

    ```js
    App.Router.map(function() {
      this.resource("album", function() {
        this.route("song");
      });
    });

    App.AlbumRoute = Ngular.Route.extend({
      actions: {
        startPlaying: function() {
        }
      }
    });

    App.AlbumSongRoute = Ngular.Route.extend({
      actions: {
        startPlaying: function() {
          // ...

          if (actionShouldAlsoBeTriggeredOnParentRoute) {
            return true;
          }
        }
      }
    });
    ```

    @property actions
    @type Hash
    @default null
  */

  /**
    Moves `actions` to `_actions` at extend time. Note that this currently
    modifies the mixin themselves, which is technically dubious but
    is practically of little consequence. This may change in the future.

    @private
    @method willMergeMixin
  */
  willMergeMixin(props) {
    var hashName;

    if (!props._actions) {
      Ngular.assert("'actions' should not be a function", typeof(props.actions) !== 'function');

      if (typeOf(props.actions) === 'object') {
        hashName = 'actions';
      } else if (typeOf(props.events) === 'object') {
        Ngular.deprecate('Action handlers contained in an `events` object are deprecated in favor' +
                        ' of putting them in an `actions` object', false);
        hashName = 'events';
      }

      if (hashName) {
        props._actions = merge(props._actions || {}, props[hashName]);
      }

      delete props[hashName];
    }
  },

  /**
    Triggers a named action on the `ActionHandler`. Any parameters
    supplied after the `actionName` string will be passed as arguments
    to the action target function.

    If the `ActionHandler` has its `target` property set, actions may
    bubble to the `target`. Bubbling happens when an `actionName` can
    not be found in the `ActionHandler`'s `actions` hash or if the
    action target function returns `true`.

    Example

    ```js
    App.WelcomeRoute = Ngular.Route.extend({
      actions: {
        playTheme: function() {
           this.send('playMusic', 'theme.mp3');
        },
        playMusic: function(track) {
          // ...
        }
      }
    });
    ```

    @method send
    @param {String} actionName The action to trigger
    @param {*} context a context to send with the action
  */
  send(actionName, ...args) {
    var target;

    if (this._actions && this._actions[actionName]) {
      var shouldBubble = this._actions[actionName].apply(this, args) === true;
      if (!shouldBubble) { return; }
    }

    if (target = get(this, 'target')) {
      Ngular.assert("The `target` for " + this + " (" + target +
                   ") does not have a `send` method", typeof target.send === 'function');
      target.send(...arguments);
    }
  }
});

export default ActionHandler;
