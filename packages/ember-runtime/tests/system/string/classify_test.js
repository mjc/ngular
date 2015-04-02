import Ngular from "ngular-metal/core";
import {classify} from "ngular-runtime/system/string";

QUnit.module('NgularStringUtils.classify');

if (!Ngular.EXTEND_PROTOTYPES && !Ngular.EXTEND_PROTOTYPES.String) {
  QUnit.test("String.prototype.classify is not modified without EXTEND_PROTOTYPES", function() {
    ok("undefined" === typeof String.prototype.classify, 'String.prototype helper disabled');
  });
}

QUnit.test("classify normal string", function() {
  deepEqual(classify('my favorite items'), 'MyFavoriteItems');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('my favorite items'.classify(), 'MyFavoriteItems');
  }
});

QUnit.test("classify dasherized string", function() {
  deepEqual(classify('css-class-name'), 'CssClassName');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('css-class-name'.classify(), 'CssClassName');
  }
});

QUnit.test("classify underscored string", function() {
  deepEqual(classify('action_name'), 'ActionName');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('action_name'.classify(), 'ActionName');
  }
});

QUnit.test("does nothing with classified string", function() {
  deepEqual(classify('InnerHTML'), 'InnerHTML');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('InnerHTML'.classify(), 'InnerHTML');
  }
});
