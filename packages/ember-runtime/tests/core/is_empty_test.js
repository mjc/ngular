import Ngular from "ngular-metal/core";
import isEmpty from 'ngular-metal/is_empty';
import ArrayProxy from "ngular-runtime/system/array_proxy";

QUnit.module("Ngular.isEmpty");

QUnit.test("Ngular.isEmpty", function() {
  var arrayProxy = ArrayProxy.create({ content: Ngular.A() });

  equal(true, isEmpty(arrayProxy), "for an ArrayProxy that has empty content");
});
