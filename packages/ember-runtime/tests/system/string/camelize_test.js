import Ngular from "ngular-metal/core";
import {camelize} from "ngular-runtime/system/string";

QUnit.module('NgularStringUtils.camelize');

if (!Ngular.EXTEND_PROTOTYPES && !Ngular.EXTEND_PROTOTYPES.String) {
  QUnit.test("String.prototype.camelize is not modified without EXTEND_PROTOTYPES", function() {
    ok("undefined" === typeof String.prototype.camelize, 'String.prototype helper disabled');
  });
}

QUnit.test("camelize normal string", function() {
  deepEqual(camelize('my favorite items'), 'myFavoriteItems');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('my favorite items'.camelize(), 'myFavoriteItems');
  }
});

QUnit.test("camelize capitalized string", function() {
  deepEqual(camelize('I Love Ramen'), 'iLoveRamen');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('I Love Ramen'.camelize(), 'iLoveRamen');
  }
});

QUnit.test("camelize dasherized string", function() {
  deepEqual(camelize('css-class-name'), 'cssClassName');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('css-class-name'.camelize(), 'cssClassName');
  }
});

QUnit.test("camelize underscored string", function() {
  deepEqual(camelize('action_name'), 'actionName');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('action_name'.camelize(), 'actionName');
  }
});

QUnit.test("camelize dot notation string", function() {
  deepEqual(camelize('action.name'), 'actionName');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('action.name'.camelize(), 'actionName');
  }
});

QUnit.test("does nothing with camelcased string", function() {
  deepEqual(camelize('innerHTML'), 'innerHTML');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('innerHTML'.camelize(), 'innerHTML');
  }
});
