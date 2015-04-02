import run from "ngular-metal/run_loop";
import Test from "ngular-testing/test";
import Adapter from "ngular-testing/adapters/adapter";
import QUnitAdapter from "ngular-testing/adapters/qunit";
import NgularApplication from "ngular-application/system/application";

var App, originalAdapter;

QUnit.module("ngular-testing Adapters", {
  setup() {
    originalAdapter = Test.adapter;
  },
  teardown() {
    run(App, App.destroy);
    App.removeTestHelpers();
    App = null;

    Test.adapter = originalAdapter;
  }
});

QUnit.test("Setting a test adapter manually", function() {
  expect(1);
  var CustomAdapter;

  CustomAdapter = Adapter.extend({
    asyncStart() {
      ok(true, "Correct adapter was used");
    }
  });

  run(function() {
    App = NgularApplication.create();
    Test.adapter = CustomAdapter.create();
    App.setupForTesting();
  });

  Test.adapter.asyncStart();
});

QUnit.test("QUnitAdapter is used by default", function() {
  expect(1);

  Test.adapter = null;

  run(function() {
    App = NgularApplication.create();
    App.setupForTesting();
  });

  ok(Test.adapter instanceof QUnitAdapter);
});
