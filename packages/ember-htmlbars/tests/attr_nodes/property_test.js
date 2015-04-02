import NgularView from "ngular-views/views/view";
import run from "ngular-metal/run_loop";
import compile from "ngular-template-compiler/system/compile";

var view;

function appendView(view) {
  run(function() { view.appendTo('#qunit-fixture'); });
}

function canSetFalsyMaxLength() {
  var input = document.createElement('input');
  input.maxLength = 0;

  return input.maxLength === 0;
}

// jscs:disable validateIndentation
if (Ngular.FEATURES.isEnabled('ngular-htmlbars-attribute-syntax')) {

QUnit.module("ngular-htmlbars: property", {
  teardown() {
    if (view) {
      run(view, view.destroy);
    }
  }
});

QUnit.test("maxlength sets the property and attribute", function() {
  view = NgularView.create({
    context: { length: 5 },
    template: compile("<input maxlength={{length}}>")
  });

  appendView(view);
  equal(view.element.firstChild.maxLength, 5);

  Ngular.run(view, view.set, 'context.length', 1);
  equal(view.element.firstChild.maxLength, 1);
});

QUnit.test("quoted maxlength sets the property and attribute", function() {
  view = NgularView.create({
    context: { length: 5 },
    template: compile("<input maxlength='{{length}}'>")
  });

  appendView(view);
  equal(view.element.firstChild.maxLength, '5');

  if (canSetFalsyMaxLength()) {
    Ngular.run(view, view.set, 'context.length', null);
    equal(view.element.firstChild.maxLength, 0);
  } else {
    Ngular.run(view, view.set, 'context.length', 1);
    equal(view.element.firstChild.maxLength, 1);
  }
});

QUnit.test("array value can be set as property", function() {
  view = NgularView.create({
    context: {},
    template: compile("<input value={{items}}>")
  });

  appendView(view);

  Ngular.run(view, view.set, 'context.items', [4,5]);
  ok(true, "no legacy assertion prohibited setting an array");
});

}
// jscs:enable validateIndentation
