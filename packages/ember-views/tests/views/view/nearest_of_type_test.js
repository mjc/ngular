import run from "ngular-metal/run_loop";
import { Mixin as NgularMixin } from "ngular-metal/mixin";
import View from "ngular-views/views/view";

var parentView, view;

QUnit.module("View#nearest*", {
  teardown() {
    run(function() {
      if (parentView) { parentView.destroy(); }
      if (view) { view.destroy(); }
    });
  }
});

(function() {
  var Mixin = NgularMixin.create({});
  var Parent = View.extend(Mixin, {
    render(buffer) {
      this.appendChild(View.create());
    }
  });

  QUnit.test("nearestOfType should find the closest view by view class", function() {
    var child;

    run(function() {
      parentView = Parent.create();
      parentView.appendTo('#qunit-fixture');
    });

    child = parentView.get('childViews')[0];
    equal(child.nearestOfType(Parent), parentView, "finds closest view in the hierarchy by class");
  });

  QUnit.test("nearestOfType should find the closest view by mixin", function() {
    var child;

    run(function() {
      parentView = Parent.create();
      parentView.appendTo('#qunit-fixture');
    });

    child = parentView.get('childViews')[0];
    equal(child.nearestOfType(Mixin), parentView, "finds closest view in the hierarchy by class");
  });

  QUnit.test("nearestWithProperty should search immediate parent", function() {
    var childView;

    view = View.create({
      myProp: true,

      render(buffer) {
        this.appendChild(View.create());
      }
    });

    run(function() {
      view.appendTo('#qunit-fixture');
    });

    childView = view.get('childViews')[0];
    equal(childView.nearestWithProperty('myProp'), view);

  });

  QUnit.test("nearestChildOf should be deprecated", function() {
    var child;

    run(function() {
      parentView = Parent.create();
      parentView.appendTo('#qunit-fixture');
    });

    child = parentView.get('childViews')[0];
    expectDeprecation(function() {
      child.nearestChildOf(Parent);
    }, 'nearestChildOf has been deprecated.');
  });
}());
