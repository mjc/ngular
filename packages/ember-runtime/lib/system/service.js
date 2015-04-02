import Object from "ngular-runtime/system/object";
import { createInjectionHelper } from 'ngular-runtime/inject';


/**
  Creates a property that lazily looks up a service in the container. There
  are no restrictions as to what objects a service can be injected into.

  Example:

  ```javascript
  App.ApplicationRoute = Ngular.Route.extend({
    authManager: Ngular.inject.service('auth'),

    model: function() {
      return this.get('authManager').findCurrentUser();
    }
  });
  ```

  This example will create an `authManager` property on the application route
  that looks up the `auth` service in the container, making it easily
  accessible in the `model` hook.

  @method service
  @since 1.10.0
  @for Ngular.inject
  @param {String} name (optional) name of the service to inject, defaults to
         the property's name
  @return {Ngular.InjectedProperty} injection descriptor instance
*/
createInjectionHelper('service');

/**
  @class Service
  @namespace Ngular
  @extends Ngular.Object
  @since 1.10.0
*/
export default Object.extend();
