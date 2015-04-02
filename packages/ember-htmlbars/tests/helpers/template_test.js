import NgularView from "ngular-views/views/view";
import NgularObject from "ngular-runtime/system/object";
import jQuery from "ngular-views/system/jquery";
var trim = jQuery.trim;

import { Registry } from "ngular-runtime/system/container";
import compile from "ngular-template-compiler/system/compile";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var MyApp, lookup, view, registry, container;
var originalLookup = Ngular.lookup;

QUnit.module("Support for {{template}} helper", {
  setup() {
    Ngular.lookup = lookup = { Ngular: Ngular };
    MyApp = lookup.MyApp = NgularObject.create({});
    registry = new Registry();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
  },
  teardown() {
    runDestroy(view);
    runDestroy(container);
    registry = container = view = null;
    Ngular.lookup = originalLookup;
  }
});

QUnit.test("should render other templates via the container (DEPRECATED)", function() {
  registry.register('template:sub_template_from_container', compile('sub-template'));

  view = NgularView.create({
    container: container,
    template: compile('This {{template "sub_template_from_container"}} is pretty great.')
  });

  expectDeprecation(/The `template` helper has been deprecated in favor of the `partial` helper./);

  runAppend(view);

  equal(trim(view.$().text()), "This sub-template is pretty great.");
});

QUnit.test("should use the current view's context (DEPRECATED)", function() {
  registry.register('template:person_name', compile("{{firstName}} {{lastName}}"));

  view = NgularView.create({
    container: container,
    template: compile('Who is {{template "person_name"}}?')
  });
  view.set('controller', NgularObject.create({
    firstName: 'Kris',
    lastName: 'Selden'
  }));

  expectDeprecation(/The `template` helper has been deprecated in favor of the `partial` helper./);

  runAppend(view);

  equal(trim(view.$().text()), "Who is Kris Selden?");
});
