import "ngular-routing-htmlbars";
import run from "ngular-metal/run_loop";
import NgularView from "ngular-views/views/view";
import compile from "ngular-template-compiler/system/compile";
import { set } from "ngular-metal/property_set";
import Controller from "ngular-runtime/controllers/controller";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var view;

QUnit.module("ngular-routing-htmlbars: link-to helper", {
  teardown() {
    runDestroy(view);
  }
});


QUnit.test("should be able to be inserted in DOM when the router is not present", function() {
  var template = "{{#link-to 'index'}}Go to Index{{/link-to}}";
  view = NgularView.create({
    template: compile(template)
  });

  runAppend(view);

  equal(view.$().text(), 'Go to Index');
});

QUnit.test("re-renders when title changes", function() {
  var template = "{{link-to title routeName}}";
  view = NgularView.create({
    controller: {
      title: 'foo',
      routeName: 'index'
    },
    template: compile(template)
  });

  runAppend(view);

  equal(view.$().text(), 'foo');

  run(function() {
    set(view, 'controller.title', 'bar');
  });

  equal(view.$().text(), 'bar');
});

QUnit.test("can read bound title", function() {
  var template = "{{link-to title routeName}}";
  view = NgularView.create({
    controller: {
      title: 'foo',
      routeName: 'index'
    },
    template: compile(template)
  });

  runAppend(view);

  equal(view.$().text(), 'foo');
});

QUnit.test("escaped inline form (double curlies) escapes link title", function() {
  view = NgularView.create({
    title: "<b>blah</b>",
    template: compile("{{link-to view.title}}")
  });

  runAppend(view);

  equal(view.$('b').length, 0, 'no <b> were found');
});

QUnit.test("unescaped inline form (triple curlies) does not escape link title", function() {
  view = NgularView.create({
    title: "<b>blah</b>",
    template: compile("{{{link-to view.title}}}")
  });

  runAppend(view);

  equal(view.$('b').length, 1, '<b> was found');
});

QUnit.test("unwraps controllers", function() {
  var template = "{{#link-to 'index' view.otherController}}Text{{/link-to}}";

  view = NgularView.create({
    otherController: Controller.create({
      model: 'foo'
    }),

    template: compile(template)
  });

  expectDeprecation(function() {
    runAppend(view);
  }, /Providing `{{link-to}}` with a param that is wrapped in a controller is deprecated./);

  equal(view.$().text(), 'Text');
});
