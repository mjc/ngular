import Ngular from "ngular-metal/core";
import {dasherize} from "ngular-runtime/system/string";

QUnit.module('NgularStringUtils.dasherize');

if (!Ngular.EXTEND_PROTOTYPES && !Ngular.EXTEND_PROTOTYPES.String) {
  QUnit.test("String.prototype.dasherize is not modified without EXTEND_PROTOTYPES", function() {
    ok("undefined" === typeof String.prototype.dasherize, 'String.prototype helper disabled');
  });
}

QUnit.test("dasherize normal string", function() {
  deepEqual(dasherize('my favorite items'), 'my-favorite-items');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('my favorite items'.dasherize(), 'my-favorite-items');
  }
});

QUnit.test("does nothing with dasherized string", function() {
  deepEqual(dasherize('css-class-name'), 'css-class-name');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('css-class-name'.dasherize(), 'css-class-name');
  }
});

QUnit.test("dasherize underscored string", function() {
  deepEqual(dasherize('action_name'), 'action-name');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('action_name'.dasherize(), 'action-name');
  }
});

QUnit.test("dasherize camelcased string", function() {
  deepEqual(dasherize('innerHTML'), 'inner-html');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('innerHTML'.dasherize(), 'inner-html');
  }
});

QUnit.test("dasherize string that is the property name of Object.prototype", function() {
  deepEqual(dasherize('toString'), 'to-string');
  if (Ngular.EXTEND_PROTOTYPES) {
    deepEqual('toString'.dasherize(), 'to-string');
  }
});
