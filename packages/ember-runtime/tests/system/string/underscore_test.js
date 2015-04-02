import Ngular from "ngular-metal/core";
import {underscore} from "ngular-runtime/system/string";

QUnit.module('NgularStringUtils.underscore');

if (!Ngular.EXTEND_PROTOTYPES && !Ngular.EXTEND_PROTOTYPES.String) {
  QUnit.test("String.prototype.underscore is not available without EXTEND_PROTOTYPES", function() {
    ok("undefined" === typeof String.prototype.underscore, 'String.prototype helper disabled');
  });
}

QUnit.test("with normal string", function() {
  deepEqual(underscore('my favorite items'), 'my_favorite_items');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('my favorite items'.underscore(), 'my_favorite_items');
  }
});

QUnit.test("with dasherized string", function() {
  deepEqual(underscore('css-class-name'), 'css_class_name');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('css-class-name'.underscore(), 'css_class_name');
  }
});

QUnit.test("does nothing with underscored string", function() {
  deepEqual(underscore('action_name'), 'action_name');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('action_name'.underscore(), 'action_name');
  }
});

QUnit.test("with camelcased string", function() {
  deepEqual(underscore('innerHTML'), 'inner_html');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('innerHTML'.underscore(), 'inner_html');
  }
});
