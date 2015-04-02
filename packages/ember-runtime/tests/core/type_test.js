import {typeOf} from "ngular-metal/utils";
import NgularObject from "ngular-runtime/system/object";

QUnit.module("Ngular Type Checking");

QUnit.test("Ngular.typeOf", function() {
  var a = null;
  var arr = [1,2,3];
  var obj = {};
  var object = NgularObject.create({ method() {} });

  equal(typeOf(undefined), 'undefined', "item of type undefined");
  equal(typeOf(a), 'null', "item of type null");
  equal(typeOf(arr), 'array', "item of type array");
  equal(typeOf(obj), 'object', "item of type object");
  equal(typeOf(object), 'instance', "item of type instance");
  equal(typeOf(object.method), 'function', "item of type function");
  equal(typeOf(NgularObject), 'class', "item of type class");
  equal(typeOf(new Error()), 'error', "item of type error");
});
