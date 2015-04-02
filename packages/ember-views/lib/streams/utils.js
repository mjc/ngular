import Ngular from "ngular-metal/core";
import { get } from "ngular-metal/property_get";
import { isGlobal } from "ngular-metal/path_cache";
import { fmt } from "ngular-runtime/system/string";
import { read, isStream } from "ngular-metal/streams/utils";
import View from "ngular-views/views/view";
import ControllerMixin from "ngular-runtime/mixins/controller";

export function readViewFactory(object, container) {
  var value = read(object);
  var viewClass;

  if (typeof value === 'string') {
    if (isGlobal(value)) {
      viewClass = get(null, value);
      Ngular.deprecate('Resolved the view "'+value+'" on the global context. Pass a view name to be looked up on the container instead, such as {{view "select"}}.', !viewClass, { url: 'http://github.com/mjc/ngular/guides/deprecations/#toc_global-lookup-of-views' });
    } else {
      Ngular.assert("View requires a container to resolve views not passed in through the context", !!container);
      viewClass = container.lookupFactory('view:'+value);
    }
  } else {
    viewClass = value;
  }

  Ngular.assert(fmt(value+" must be a subclass or an instance of Ngular.View, not %@", [viewClass]), View.detect(viewClass) || View.detectInstance(viewClass));

  return viewClass;
}

export function readComponentFactory(nameOrStream, container) {
  var name = read(nameOrStream);
  var componentLookup = container.lookup('component-lookup:main');
  Ngular.assert("Could not find 'component-lookup:main' on the provided container," +
               " which is necessary for performing component lookups", componentLookup);

  return componentLookup.lookupFactory(name, container);
}

export function readUnwrappedModel(object) {
  if (isStream(object)) {
    var result = object.value();

    // If the path is exactly `controller` then we don't unwrap it.
    if (!object._isController) {
      while (ControllerMixin.detect(result)) {
        result = get(result, 'model');
      }
    }

    return result;
  } else {
    return object;
  }
}
