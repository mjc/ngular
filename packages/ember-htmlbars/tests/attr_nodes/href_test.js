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

QUnit.module("ngular-htmlbars: href attribute", {
  teardown() {
    if (view) {
      run(view, view.destroy);
    }
  }
});

QUnit.test("href is set", function() {
  view = NgularView.create({
    context: { url: 'http://example.com' },
    template: compile("<a href={{url}}></a>")
  });
  appendView(view);

  equalInnerHTML(view.element, '<a href="http://example.com"></a>',
                 "attribute is output");
});

}
// jscs:enable validateIndentation
