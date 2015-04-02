import Ngular from "ngular-metal/core"; // Ngular.lookup
import _MetamorphView from "ngular-views/views/metamorph_view";
import NgularView from "ngular-views/views/view";
import handlebarsGet from "ngular-htmlbars/compat/handlebars-get";
import { Registry } from "ngular-runtime/system/container";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

import NgularHandlebars from "ngular-htmlbars/compat";

var compile = NgularHandlebars.compile;

var originalLookup = Ngular.lookup;
var TemplateTests, registry, container, lookup, view;

QUnit.module("ngular-htmlbars: Ngular.Handlebars.get", {
  setup() {
    Ngular.lookup = lookup = {};
    registry = new Registry();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
    registry.optionsForType('helper', { instantiate: false });
    registry.register('view:default', _MetamorphView);
    registry.register('view:toplevel', NgularView.extend());
  },

  teardown() {
    runDestroy(container);
    runDestroy(view);
    registry = container = view = null;

    Ngular.lookup = lookup = originalLookup;
    TemplateTests = null;
  }
});

QUnit.test('it can lookup a path from the current context', function() {
  expect(1);

  registry.register('helper:handlebars-get', function(path, options) {
    var context = options.contexts && options.contexts[0] || this;

    ignoreDeprecation(function() {
      equal(handlebarsGet(context, path, options), 'bar');
    });
  });

  view = NgularView.create({
    container: container,
    controller: {
      foo: 'bar'
    },
    template: compile('{{handlebars-get "foo"}}')
  });

  runAppend(view);
});

QUnit.test('it can lookup a path from the current keywords', function() {
  expect(1);

  registry.register('helper:handlebars-get', function(path, options) {
    var context = options.contexts && options.contexts[0] || this;

    ignoreDeprecation(function() {
      equal(handlebarsGet(context, path, options), 'bar');
    });
  });

  view = NgularView.create({
    container: container,
    controller: {
      foo: 'bar'
    },
    template: compile('{{#with foo as bar}}{{handlebars-get "bar"}}{{/with}}')
  });

  runAppend(view);
});

QUnit.test('it can lookup a path from globals', function() {
  expect(1);

  lookup.Blammo = { foo: 'blah' };

  registry.register('helper:handlebars-get', function(path, options) {
    var context = options.contexts && options.contexts[0] || this;

    ignoreDeprecation(function() {
      equal(handlebarsGet(context, path, options), lookup.Blammo.foo);
    });
  });

  view = NgularView.create({
    container: container,
    controller: { },
    template: compile('{{handlebars-get "Blammo.foo"}}')
  });

  runAppend(view);
});

QUnit.test('it raises a deprecation warning on use', function() {
  expect(1);

  registry.register('helper:handlebars-get', function(path, options) {
    var context = options.contexts && options.contexts[0] || this;

    expectDeprecation(function() {
      handlebarsGet(context, path, options);
    }, 'Usage of Ngular.Handlebars.get is deprecated, use a Component or Ngular.Handlebars.makeBoundHelper instead.');
  });

  view = NgularView.create({
    container: container,
    controller: {
      foo: 'bar'
    },
    template: compile('{{handlebars-get "foo"}}')
  });

  runAppend(view);
});
