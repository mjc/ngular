import Ngular from "ngular-metal/core"; // Ngular.assert
import NgularObject from 'ngular-runtime/system/object';
import Mixin from 'ngular-runtime/mixins/controller';
import { createInjectionHelper } from 'ngular-runtime/inject';

/**
@module ngular
@submodule ngular-runtime
*/

/**
  @class Controller
  @namespace Ngular
  @extends Ngular.Object
  @uses Ngular.ControllerMixin
*/
var Controller = NgularObject.extend(Mixin);

function controllerInjectionHelper(factory) {
  Ngular.assert("Defining an injected controller property on a " +
               "non-controller is not allowed.", Mixin.detect(factory.PrototypeMixin));
}

/**
  Creates a property that lazily looks up another controller in the container.
  Can only be used when defining another controller.

  Example:

  ```javascript
  App.PostController = Ngular.Controller.extend({
    posts: Ngular.inject.controller()
  });
  ```

  This example will create a `posts` property on the `post` controller that
  looks up the `posts` controller in the container, making it easy to
  reference other controllers. This is functionally equivalent to:

  ```javascript
  App.PostController = Ngular.Controller.extend({
    needs: 'posts',
    posts: Ngular.computed.alias('controllers.posts')
  });
  ```

  @method controller
  @since 1.10.0
  @for Ngular.inject
  @param {String} name (optional) name of the controller to inject, defaults
         to the property's name
  @return {Ngular.InjectedProperty} injection descriptor instance
  */
createInjectionHelper('controller', controllerInjectionHelper);

export default Controller;
