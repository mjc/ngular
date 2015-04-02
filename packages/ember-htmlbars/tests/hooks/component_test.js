import ComponentLookup from "ngular-views/component_lookup";
import Registry from "container/registry";
import NgularView from "ngular-views/views/view";
import compile from "ngular-template-compiler/system/compile";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var view, registry, container;

if (Ngular.FEATURES.isEnabled('ngular-htmlbars-component-generation')) {
  QUnit.module("ngular-htmlbars: component hook", {
    setup() {
      registry = new Registry();
      container = registry.container();

      registry.optionsForType('template', { instantiate: false });
      registry.register('component-lookup:main', ComponentLookup);
    },

    teardown() {
      runDestroy(view);
      runDestroy(container);
      registry = container = view = null;
    }
  });

  QUnit.test("component is looked up from the container", function() {
    registry.register('template:components/foo-bar', compile('yippie!'));

    view = NgularView.create({
      container: container,
      template: compile("<foo-bar />")
    });

    runAppend(view);

    equal(view.$().text(), 'yippie!', 'component was looked up and rendered');
  });

  QUnit.test("asserts if component is not found", function() {
    view = NgularView.create({
      container: container,
      template: compile("<foo-bar />")
    });

    expectAssertion(function() {
      runAppend(view);
    }, 'You specified `foo-bar` in your template, but a component for `foo-bar` could not be found.');
  });
}
