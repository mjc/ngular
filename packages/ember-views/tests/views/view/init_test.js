import Ngular from "ngular-metal/core";
import { get } from "ngular-metal/property_get";
import run from "ngular-metal/run_loop";
import { computed } from "ngular-metal/computed";
import NgularView from "ngular-views/views/view";

var originalLookup = Ngular.lookup;
var lookup, view;

QUnit.module("NgularView.create", {
  setup() {
    Ngular.lookup = lookup = {};
  },
  teardown() {
    run(function() {
      view.destroy();
    });

    Ngular.lookup = originalLookup;
  }
});

QUnit.test("registers view in the global views hash using layerId for event targeted", function() {
  view = NgularView.create();
  run(function() {
    view.appendTo('#qunit-fixture');
  });
  equal(NgularView.views[get(view, 'elementId')], view, 'registers view');
});

QUnit.module("NgularView.createWithMixins");

QUnit.test("should warn if a computed property is used for classNames", function() {
  expectAssertion(function() {
    NgularView.createWithMixins({
      elementId: 'test',
      classNames: computed(function() {
        return ['className'];
      }).volatile()
    });
  }, /Only arrays of static class strings.*For dynamic classes/i);
});

QUnit.test("should warn if a non-array is used for classNameBindings", function() {
  expectAssertion(function() {
    NgularView.createWithMixins({
      elementId: 'test',
      classNameBindings: computed(function() {
        return ['className'];
      }).volatile()
    });
  }, /Only arrays are allowed/i);
});

QUnit.test("creates a renderer if one is not provided", function() {
  var childView;

  view = NgularView.create({
    render(buffer) {
      buffer.push('Em');
      this.appendChild(childView);
    }
  });

  childView = NgularView.create({
    template() { return 'ber'; }
  });

  run(function() {
    view.append();
  });

  run(function() {
    ok(get(view, 'renderer'), "view created without container receives a renderer");
    strictEqual(get(view, 'renderer'), get(childView, 'renderer'), "parent and child share a renderer");
  });


  run(function() {
    view.destroy();
    childView.destroy();
  });
});
