import create from 'ngular-metal/platform/create';
import copy from "ngular-runtime/copy";

QUnit.module("Ngular Copy Method");

QUnit.test("Ngular.copy null", function() {
  var obj = { field: null };

  equal(copy(obj, true).field, null, "null should still be null");
});

QUnit.test("Ngular.copy date", function() {
  var date = new Date(2014, 7, 22);
  var dateCopy = copy(date);

  equal(date.getTime(), dateCopy.getTime(), "dates should be equivalent");
});

QUnit.test("Ngular.copy null prototype object", function() {
  var obj = create(null);

  obj.foo = 'bar';

  equal(copy(obj).foo, 'bar', 'bar should still be bar');
});
