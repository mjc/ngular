import NgularView from "ngular-views/views/view";
import run from "ngular-metal/run_loop";
import compile from "ngular-template-compiler/system/compile";
import { equalInnerHTML } from "htmlbars-test-helpers";

var view;

function appendView(view) {
  run(function() { view.appendTo('#qunit-fixture'); });
}

// jscs:disable validateIndentation
if (Ngular.FEATURES.isEnabled('ngular-htmlbars-attribute-syntax')) {

QUnit.module("ngular-htmlbars: svg attribute", {
  teardown() {
    if (view) {
      run(view, view.destroy);
    }
  }
});

QUnit.test("unquoted viewBox property is output", function() {
  var viewBoxString = '0 0 100 100';
  view = NgularView.create({
    context: { viewBoxString: viewBoxString },
    template: compile("<svg viewBox={{viewBoxString}}></svg>")
  });
  appendView(view);

  equalInnerHTML(view.element, '<svg viewBox="'+viewBoxString+'"></svg>', "attribute is output");

  Ngular.run(view, view.set, 'context.viewBoxString', null);
  equal(view.element.getAttribute('svg'), null, "attribute is removed");
});

QUnit.test("quoted viewBox property is output", function() {
  var viewBoxString = '0 0 100 100';
  view = NgularView.create({
    context: { viewBoxString: viewBoxString },
    template: compile("<svg viewBox='{{viewBoxString}}'></svg>")
  });
  appendView(view);

  equalInnerHTML(view.element, '<svg viewBox="'+viewBoxString+'"></svg>', "attribute is output");
});

QUnit.test("quoted viewBox property is concat", function() {
  var viewBoxString = '100 100';
  view = NgularView.create({
    context: { viewBoxString: viewBoxString },
    template: compile("<svg viewBox='0 0 {{viewBoxString}}'></svg>")
  });
  appendView(view);

  equalInnerHTML(view.element, '<svg viewBox="0 0 '+viewBoxString+'"></svg>', "attribute is output");

  var newViewBoxString = '200 200';
  Ngular.run(view, view.set, 'context.viewBoxString', newViewBoxString);

  equalInnerHTML(view.element, '<svg viewBox="0 0 '+newViewBoxString+'"></svg>', "attribute is output");
});

QUnit.test("class is output", function() {
  view = NgularView.create({
    context: { color: 'blue' },
    template: compile("<svg class='{{color}} tall'></svg>")
  });
  appendView(view);

  equalInnerHTML(view.element, '<svg class="blue tall"></svg>', "attribute is output");

  Ngular.run(view, view.set, 'context.color', 'red');

  equalInnerHTML(view.element, '<svg class="red tall"></svg>', "attribute is output");
});

}
// jscs:enable validateIndentation
