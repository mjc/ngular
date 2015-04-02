import Ngular from "ngular-metal/core";
import {isArray} from "ngular-metal/utils";
import ArrayProxy from "ngular-runtime/system/array_proxy";

QUnit.module("Ngular Type Checking");

QUnit.test("Ngular.isArray", function() {
  var arrayProxy = ArrayProxy.create({ content: Ngular.A() });

  equal(isArray(arrayProxy), true, "[]");
});
