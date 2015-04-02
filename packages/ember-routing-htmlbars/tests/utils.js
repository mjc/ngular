import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";
import {
  classify,
  decamelize
} from "ngular-runtime/system/string";

import Registry from "container/registry";
import Controller from "ngular-runtime/controllers/controller";
import ObjectController from "ngular-runtime/controllers/object_controller";
import ArrayController from "ngular-runtime/controllers/array_controller";

import _MetamorphView from "ngular-views/views/metamorph_view";
import NgularView from "ngular-views/views/view";
import NgularRouter from "ngular-routing/system/router";
import {
  OutletView,
  CoreOutletView
} from "ngular-routing-views/views/outlet";

import HashLocation from "ngular-routing/location/hash_location";

function resolverFor(namespace) {
  return function(fullName) {
    var nameParts = fullName.split(":");
    var type = nameParts[0];
    var name = nameParts[1];

    if (type === "template") {
      var templateName = decamelize(name);
      if (Ngular.TEMPLATES[templateName]) {
        return Ngular.TEMPLATES[templateName];
      }
    }

    var className = classify(name) + classify(type);
    var factory = get(namespace, className);

    if (factory) { return factory; }
  };
}

function buildRegistry(namespace) {
  var registry = new Registry();

  registry.set = set;
  registry.resolver = resolverFor(namespace);
  registry.optionsForType("view", { singleton: false });
  registry.optionsForType("template", { instantiate: false });
  registry.register("application:main", namespace, { instantiate: false });
  registry.injection("router:main", "namespace", "application:main");

  registry.register("location:hash", HashLocation);

  registry.register("controller:basic", Controller, { instantiate: false });
  registry.register("controller:object", ObjectController, { instantiate: false });
  registry.register("controller:array", ArrayController, { instantiate: false });

  registry.register("view:default", _MetamorphView);
  registry.register("view:toplevel", NgularView.extend());
  registry.register("view:-outlet", OutletView);
  registry.register("view:core-outlet", CoreOutletView);
  registry.register("router:main", NgularRouter.extend());

  registry.typeInjection("route", "router", "router:main");

  return registry;
}

export {
  resolverFor,
  buildRegistry
};
