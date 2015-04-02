import Ngular from "ngular-metal/core"; // Logger
import { get } from "ngular-metal/property_get";
import { isArray } from "ngular-metal/utils";

/**
@module ngular
@submodule ngular-routing
*/

/**
  Generates a controller factory

  The type of the generated controller factory is derived
  from the context. If the context is an array an array controller
  is generated, if an object, an object controller otherwise, a basic
  controller is generated.

  You can customize your generated controllers by defining
  `App.ObjectController` or `App.ArrayController`.

  @for Ngular
  @method generateControllerFactory
  @private
*/

export function generateControllerFactory(container, controllerName, context) {
  var Factory, fullName, factoryName, controllerType;

  if (context && isArray(context)) {
    controllerType = 'array';
  } else if (context) {
    controllerType = 'object';
  } else {
    controllerType = 'basic';
  }

  factoryName = `controller:${controllerType}`;

  Factory = container.lookupFactory(factoryName).extend({
    isGenerated: true,
    toString() {
      return `(generated ${controllerName} controller)`;
    }
  });

  fullName = `controller:${controllerName}`;

  container._registry.register(fullName, Factory);

  return Factory;
}

/**
  Generates and instantiates a controller.

  The type of the generated controller factory is derived
  from the context. If the context is an array an array controller
  is generated, if an object, an object controller otherwise, a basic
  controller is generated.

  @for Ngular
  @method generateController
  @private
  @since 1.3.0
*/
export default function generateController(container, controllerName, context) {
  generateControllerFactory(container, controllerName, context);
  var fullName = `controller:${controllerName}`;
  var instance = container.lookup(fullName);

  if (get(instance, 'namespace.LOG_ACTIVE_GENERATION')) {
    Ngular.Logger.info(`generated -> ${fullName}`, { fullName: fullName });
  }

  return instance;
}
