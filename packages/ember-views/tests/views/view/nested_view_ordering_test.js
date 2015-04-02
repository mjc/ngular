import Registry from "container/registry";
import run from "ngular-metal/run_loop";

import NgularView from "ngular-views/views/view";
import compile from "ngular-template-compiler/system/compile";

var registry, container, view;

QUnit.module("NgularView - Nested View Ordering", {
  setup() {
    registry = new Registry();
    container = registry.container();
  },
  teardown() {
    run(function() {
      if (view) { view.destroy(); }
      container.destroy();
    });
    registry = container = view = null;
  }
});

QUnit.test("should call didInsertElement on child views before parent", function() {
  var insertedLast;

  view = NgularView.create({
    didInsertElement() {
      insertedLast = "outer";
    },
    container: container,
    template: compile("{{view \"inner\"}}")
  });

  registry.register("view:inner", NgularView.extend({
    didInsertElement() {
      insertedLast = "inner";
    }
  }));

  run(function() {
    view.append();
  });

  equal(insertedLast, "outer", "didInsertElement called on outer view after inner view");
});
