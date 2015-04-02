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

QUnit.module("ngular-htmlbars: boolean attribute", {
  teardown() {
    if (view) {
      run(view, view.destroy);
    }
  }
});

QUnit.test("disabled property can be set true", function() {
  view = NgularView.create({
    context: { isDisabled: true },
    template: compile("<input disabled={{isDisabled}}>")
  });
  appendView(view);

  equal(view.element.firstChild.hasAttribute('disabled'), true, 'attribute is output');
  equal(view.element.firstChild.disabled, true,
        'boolean property is set true');
});

QUnit.test("disabled property can be set false with a blank string", function() {
  view = NgularView.create({
    context: { isDisabled: '' },
    template: compile("<input disabled={{isDisabled}}>")
  });
  appendView(view);

  equal(view.element.firstChild.hasAttribute('disabled'), false, 'attribute is not output');
  equal(view.element.firstChild.disabled, false,
        'boolean property is set false');
});

QUnit.test("disabled property can be set false", function() {
  view = NgularView.create({
    context: { isDisabled: false },
    template: compile("<input disabled={{isDisabled}}>")
  });
  appendView(view);

  equalInnerHTML(view.element, '<input>',
                 "attribute is not output");
  equal(view.element.firstChild.disabled, false,
        'boolean property is set false');
});

QUnit.test("disabled property can be set true with a string", function() {
  view = NgularView.create({
    context: { isDisabled: "oh, no a string" },
    template: compile("<input disabled={{isDisabled}}>")
  });
  appendView(view);

  equal(view.element.firstChild.hasAttribute('disabled'), true, 'attribute is output');
  equal(view.element.firstChild.disabled, true,
        'boolean property is set true');
});

QUnit.test("disabled attribute turns a value to a string", function() {
  view = NgularView.create({
    context: { isDisabled: false },
    template: compile("<input disabled='{{isDisabled}}'>")
  });
  appendView(view);

  equal(view.element.firstChild.hasAttribute('disabled'), true, 'attribute is output');
  equal(view.element.firstChild.disabled, true,
        'boolean property is set true');
});

QUnit.test("disabled attribute preserves a blank string value", function() {
  view = NgularView.create({
    context: { isDisabled: '' },
    template: compile("<input disabled='{{isDisabled}}'>")
  });
  appendView(view);

  equalInnerHTML(view.element, '<input>',
                 "attribute is not output");
  equal(view.element.firstChild.disabled, false,
        'boolean property is set false');
});

}
// jscs:enable validateIndentation
