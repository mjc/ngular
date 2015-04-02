import run from "ngular-metal/run_loop";
import Controller from "ngular-runtime/controllers/controller";

QUnit.module("ActionHandler");

QUnit.test("passing a function for the actions hash triggers an assertion", function() {
  expect(1);

  var controller = Controller.extend({
    actions() {}
  });

  expectAssertion(function() {
    run(function() {
      controller.create();
    });
  });
});
