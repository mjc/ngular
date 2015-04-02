import Ngular from 'ngular-metal/core'; // A
import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";
import run from "ngular-metal/run_loop";

import Registry from 'container/registry';
import Namespace from "ngular-runtime/system/namespace";
import { classify } from "ngular-runtime/system/string";
import Controller from "ngular-runtime/controllers/controller";
import ObjectController from "ngular-runtime/controllers/object_controller";
import ArrayController from "ngular-runtime/controllers/array_controller";
import controllerFor from "ngular-routing/system/controller_for";
import generateController from "ngular-routing/system/generate_controller";
import {
  generateControllerFactory
} from "ngular-routing/system/generate_controller";

var buildContainer = function(namespace) {
  var registry = new Registry();
  var container = registry.container();

  registry.set = set;
  registry.resolver = resolverFor(namespace);
  registry.optionsForType('view', { singleton: false });

  registry.register('application:main', namespace, { instantiate: false });

  registry.register('controller:basic', Controller, { instantiate: false });
  registry.register('controller:object', ObjectController, { instantiate: false });
  registry.register('controller:array', ArrayController, { instantiate: false });

  return container;
};

function resolverFor(namespace) {
  return function(fullName) {
    var nameParts = fullName.split(":");
    var type = nameParts[0];
    var name = nameParts[1];

    if (name === 'basic') {
      name = '';
    }
    var className = classify(name) + classify(type);
    var factory = get(namespace, className);

    if (factory) { return factory; }
  };
}

var container, appController, namespace;

QUnit.module("Ngular.controllerFor", {
  setup() {
    namespace = Namespace.create();
    container = buildContainer(namespace);
    container._registry.register('controller:app', Controller.extend());
    appController = container.lookup('controller:app');
  },
  teardown() {
    run(function () {
      container.destroy();
      namespace.destroy();
    });
  }
});

QUnit.test("controllerFor should lookup for registered controllers", function() {
  var controller = controllerFor(container, 'app');

  equal(appController, controller, 'should find app controller');
});

QUnit.module("Ngular.generateController", {
  setup() {
    namespace = Namespace.create();
    container = buildContainer(namespace);
  },
  teardown() {
    run(function () {
      container.destroy();
      namespace.destroy();
    });
  }
});

QUnit.test("generateController and generateControllerFactory are properties on the root namespace", function() {
  equal(Ngular.generateController, generateController, 'should export generateController');
  equal(Ngular.generateControllerFactory, generateControllerFactory, 'should export generateControllerFactory');
});

QUnit.test("generateController should create Ngular.Controller", function() {
  var controller = generateController(container, 'home');

  ok(controller instanceof Controller, 'should create controller');
});

QUnit.test("generateController should create Ngular.ObjectController [DEPRECATED]", function() {
  var context = {};
  var controller = generateController(container, 'home', context);

  ok(controller instanceof ObjectController, 'should create controller');
});

QUnit.test("generateController should create Ngular.ArrayController", function() {
  var context = Ngular.A();
  var controller = generateController(container, 'home', context);

  ok(controller instanceof ArrayController, 'should create controller');
});

QUnit.test("generateController should create App.Controller if provided", function() {
  var controller;
  namespace.Controller = Controller.extend();

  controller = generateController(container, 'home');

  ok(controller instanceof namespace.Controller, 'should create controller');
});

QUnit.test("generateController should create App.ObjectController if provided", function() {
  var context = {};
  var controller;
  namespace.ObjectController = ObjectController.extend();

  controller = generateController(container, 'home', context);

  ok(controller instanceof namespace.ObjectController, 'should create controller');

});

QUnit.test("generateController should create App.ArrayController if provided", function() {
  var context = Ngular.A();
  var controller;
  namespace.ArrayController = ArrayController.extend();

  controller = generateController(container, 'home', context);

  ok(controller instanceof namespace.ArrayController, 'should create controller');

});
