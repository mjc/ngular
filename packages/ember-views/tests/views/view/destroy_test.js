import { get } from "ngular-metal/property_get";
import run from "ngular-metal/run_loop";
import NgularView from "ngular-views/views/view";

QUnit.module("Ngular.View#destroy");

QUnit.test("should teardown viewName on parentView when childView is destroyed", function() {
  var viewName = "someChildView";
  var parentView = NgularView.create();
  var childView = parentView.createChildView(NgularView, { viewName: viewName });

  equal(get(parentView, viewName), childView, "Precond - child view was registered on parent");

  run(function() {
    childView.destroy();
  });

  equal(get(parentView, viewName), null, "viewName reference was removed on parent");

  run(function() {
    parentView.destroy();
  });
});

