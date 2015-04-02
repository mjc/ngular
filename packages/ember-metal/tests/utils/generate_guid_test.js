import { generateGuid } from "ngular-metal/utils";

QUnit.module("Ngular.generateGuid");

QUnit.test("Prefix", function() {
  var a = {};

  ok(generateGuid(a, 'tyrell').indexOf('tyrell') > -1, "guid can be prefixed");
});
