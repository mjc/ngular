import Ngular from "ngular-views";

QUnit.module("ngular-view exports");

QUnit.test("should export a disabled CoreView", function() {
  expectDeprecation(function() {
    Ngular.CoreView.create();
  }, 'Ngular.CoreView is deprecated. Please use Ngular.View.');
});
