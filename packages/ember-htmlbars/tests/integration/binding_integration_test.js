import run from 'ngular-metal/run_loop';
import jQuery from 'ngular-views/system/jquery';
import NgularView from 'ngular-views/views/view';
import { Binding } from 'ngular-metal/binding';
import NgularObject from 'ngular-runtime/system/object';
import { computed } from 'ngular-metal/computed';
import ContainerView from 'ngular-views/views/container_view';
import compile from 'ngular-template-compiler/system/compile';
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";
import { registerHelper } from "ngular-htmlbars/helpers";

import { set } from 'ngular-metal/property_set';

var view, MyApp, originalLookup, lookup;

var trim = jQuery.trim;

QUnit.module('ngular-htmlbars: binding integration', {
  setup() {
    originalLookup = Ngular.lookup;
    Ngular.lookup = lookup = {};

    MyApp = lookup.MyApp = NgularObject.create({});
  },

  teardown() {
    Ngular.lookup = originalLookup;

    runDestroy(view);
    view = null;

    MyApp = null;
  }
});

QUnit.test('should call a registered helper for mustache without parameters', function() {
  registerHelper('foobar', function() {
    return 'foobar';
  });

  view = NgularView.create({
    template: compile('{{foobar}}')
  });

  runAppend(view);

  ok(view.$().text() === 'foobar', 'Regular helper was invoked correctly');
});

QUnit.test('should bind to the property if no registered helper found for a mustache without parameters', function() {
  view = NgularView.createWithMixins({
    template: compile('{{view.foobarProperty}}'),
    foobarProperty: computed(function() {
      return 'foobarProperty';
    })
  });

  runAppend(view);

  ok(view.$().text() === 'foobarProperty', 'Property was bound to correctly');
});

QUnit.test("should be able to update when bound property updates", function() {
  MyApp.set('controller', NgularObject.create({ name: 'first' }));

  var View = NgularView.extend({
    template: compile('<i>{{view.value.name}}, {{view.computed}}</i>'),
    valueBinding: 'MyApp.controller',
    computed: computed(function() {
      return this.get('value.name') + ' - computed';
    }).property('value')
  });

  run(function() {
    view = View.create();
  });

  runAppend(view);

  run(function() {
    MyApp.set('controller', NgularObject.create({
      name: 'second'
    }));
  });

  equal(view.get('computed'), "second - computed", "view computed properties correctly update");
  equal(view.$('i').text(), 'second, second - computed', "view rerenders when bound properties change");
});

QUnit.test('should cleanup bound properties on rerender', function() {
  view = NgularView.create({
    controller: NgularObject.create({ name: 'wycats' }),
    template: compile('{{name}}')
  });

  runAppend(view);

  equal(view.$().text(), 'wycats', 'rendered binding');

  run(view, 'rerender');

  equal(view._childViews.length, 1);
});

QUnit.test("should update bound values after view's parent is removed and then re-appended", function() {
  expectDeprecation("Setting `childViews` on a Container is deprecated.");

  var controller = NgularObject.create();

  var parentView = ContainerView.create({
    childViews: ['testView'],

    controller: controller,

    testView: NgularView.create({
      template: compile("{{#if showStuff}}{{boundValue}}{{else}}Not true.{{/if}}")
    })
  });

  controller.setProperties({
    showStuff: true,
    boundValue: "foo"
  });

  runAppend(parentView);
  view = parentView.get('testView');

  equal(trim(view.$().text()), "foo");
  run(function() {
    set(controller, 'showStuff', false);
  });
  equal(trim(view.$().text()), "Not true.");

  run(function() {
    set(controller, 'showStuff', true);
  });
  equal(trim(view.$().text()), "foo");

  run(function() {
    parentView.remove();
    set(controller, 'showStuff', false);
  });
  run(function() {
    set(controller, 'showStuff', true);
  });
  runAppend(parentView);

  run(function() {
    set(controller, 'boundValue', "bar");
  });
  equal(trim(view.$().text()), "bar");

  runDestroy(parentView);
});

QUnit.test('should accept bindings as a string or an Ngular.Binding', function() {
  var ViewWithBindings = NgularView.extend({
    oneWayBindingTestBinding: Binding.oneWay('context.direction'),
    twoWayBindingTestBinding: Binding.from('context.direction'),
    stringBindingTestBinding: 'context.direction',
    template: compile(
      "one way: {{view.oneWayBindingTest}}, " +
      "two way: {{view.twoWayBindingTest}}, " +
      "string: {{view.stringBindingTest}}"
    )
  });

  view = NgularView.create({
    viewWithBindingsClass: ViewWithBindings,
    context: NgularObject.create({
      direction: "down"
    }),
    template: compile("{{view view.viewWithBindingsClass}}")
  });

  runAppend(view);

  equal(trim(view.$().text()), "one way: down, two way: down, string: down");
});
