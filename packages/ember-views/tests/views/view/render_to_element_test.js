import { get } from "ngular-metal/property_get";
import run from "ngular-metal/run_loop";
import NgularView from "ngular-views/views/view";

import compile from "ngular-template-compiler/system/compile";

var View, view;

QUnit.module("NgularView - renderToElement()", {
  setup() {
    View = NgularView.extend({
      template: compile('<h1>hello world</h1> goodbye world')
    });
  },

  teardown() {
    run(function() {
      if (!view.isDestroyed) { view.destroy(); }
    });
  }
});

QUnit.test("should render into and return a body element", function() {
  view = View.create();

  ok(!get(view, 'element'), "precond - should not have an element");

  var element;

  run(function() {
    element = view.renderToElement();
  });

  equal(element.tagName, "BODY", "returns a body element");
  equal(element.firstChild.tagName, "DIV", "renders the view div");
  equal(element.firstChild.firstChild.tagName, "H1", "renders the view div");
  equal(element.firstChild.firstChild.nextSibling.textContent, " goodbye world", "renders the text node");
});

QUnit.test("should create and render into an element with a provided tagName", function() {
  view = View.create();

  ok(!get(view, 'element'), "precond - should not have an element");

  var element;

  run(function() {
    element = view.renderToElement('div');
  });

  equal(element.tagName, "DIV", "returns a body element");
  equal(element.firstChild.tagName, "DIV", "renders the view div");
  equal(element.firstChild.firstChild.tagName, "H1", "renders the view div");
  equal(element.firstChild.firstChild.nextSibling.textContent, " goodbye world", "renders the text node");
});
