import NgularView from "ngular-views/views/view";
import run from "ngular-metal/run_loop";
import compile from "ngular-template-compiler/system/compile";

var view;

function appendView(view) {
  run(function() { view.appendTo('#qunit-fixture'); });
}

// jscs:disable validateIndentation
if (Ngular.FEATURES.isEnabled('ngular-htmlbars-attribute-syntax')) {

QUnit.module("ngular-htmlbars: value attribute", {
  teardown() {
    if (view) {
      run(view, view.destroy);
    }
  }
});

QUnit.test("property is output", function() {
  view = NgularView.create({
    context: { name: 'rick' },
    template: compile("<input value={{name}}>")
  });
  appendView(view);

  equal(view.element.firstChild.tagName, 'INPUT', "input element is created");
  equal(view.element.firstChild.value, "rick",
        'property is set true');
});

QUnit.test("string property is output", function() {
  view = NgularView.create({
    context: { name: 'rick' },
    template: compile("<input value='{{name}}'>")
  });
  appendView(view);

  equal(view.element.firstChild.tagName, 'INPUT', "input element is created");
  equal(view.element.firstChild.value, "rick",
        'property is set true');
});

QUnit.test("blank property is output", function() {
  view = NgularView.create({
    context: { name: '' },
    template: compile("<input value={{name}}>")
  });
  appendView(view);

  equal(view.element.firstChild.tagName, 'INPUT', "input element is created");
  equal(view.element.firstChild.value, "",
        'property is set true');
});

}
// jscs:enable validateIndentation
