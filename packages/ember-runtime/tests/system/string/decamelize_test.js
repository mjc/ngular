import Ngular from "ngular-metal/core";
import {decamelize} from "ngular-runtime/system/string";

QUnit.module('NgularStringUtils.decamelize');

if (!Ngular.EXTEND_PROTOTYPES && !Ngular.EXTEND_PROTOTYPES.String) {
  QUnit.test("String.prototype.decamelize is not modified without EXTEND_PROTOTYPES", function() {
    ok("undefined" === typeof String.prototype.decamelize, 'String.prototype helper disabled');
  });
}

QUnit.test("does nothing with normal string", function() {
  deepEqual(decamelize('my favorite items'), 'my favorite items');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('my favorite items'.decamelize(), 'my favorite items');
  }
});

QUnit.test("does nothing with dasherized string", function() {
  deepEqual(decamelize('css-class-name'), 'css-class-name');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('css-class-name'.decamelize(), 'css-class-name');
  }
});

QUnit.test("does nothing with underscored string", function() {
  deepEqual(decamelize('action_name'), 'action_name');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('action_name'.decamelize(), 'action_name');
  }
});

QUnit.test("converts a camelized string into all lower case separated by underscores.", function() {
  deepEqual(decamelize('innerHTML'), 'inner_html');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('innerHTML'.decamelize(), 'inner_html');
  }
});

QUnit.test("decamelizes strings with numbers", function() {
  deepEqual(decamelize('size160Url'), 'size160_url');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('size160Url'.decamelize(), 'size160_url');
  }
});
