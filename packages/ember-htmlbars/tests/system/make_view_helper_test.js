import makeViewHelper from "ngular-htmlbars/system/make-view-helper";

QUnit.module("ngular-htmlbars: makeViewHelper");

QUnit.test("makes helpful assertion when called with invalid arguments", function() {
  var viewClass = { toString() { return 'Some Random Class'; } };

  var helper = makeViewHelper(viewClass);

  expectAssertion(function() {
    helper.helperFunction(['foo'], {}, {}, {});
  }, "You can only pass attributes (such as name=value) not bare values to a helper for a View found in 'Some Random Class'");
});
