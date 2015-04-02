import NgularView from "ngular-views/views/view";
import run from "ngular-metal/run_loop";
import NgularObject from "ngular-runtime/system/object";
import compile from "ngular-template-compiler/system/compile";
import { equalInnerHTML } from "htmlbars-test-helpers";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var view;

QUnit.module("ngular-htmlbars: hooks/text_node_test", {
  teardown() {
    runDestroy(view);
  }
});

QUnit.test("property is output", function() {
  view = NgularView.create({
    context: { name: 'erik' },
    template: compile("ohai {{name}}")
  });
  runAppend(view);

  equalInnerHTML(view.element, 'ohai erik', "property is output");
});

QUnit.test("path is output", function() {
  view = NgularView.create({
    context: { name: { firstName: 'erik' } },
    template: compile("ohai {{name.firstName}}")
  });
  runAppend(view);

  equalInnerHTML(view.element, 'ohai erik', "path is output");
});

QUnit.test("changed property updates", function() {
  var context = NgularObject.create({ name: 'erik' });
  view = NgularView.create({
    context: context,
    template: compile("ohai {{name}}")
  });
  runAppend(view);

  equalInnerHTML(view.element, 'ohai erik', "precond - original property is output");

  run(context, context.set, 'name', 'mmun');

  equalInnerHTML(view.element, 'ohai mmun', "new property is output");
});
