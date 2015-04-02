import { hasPropertyAccessors } from "ngular-metal/platform/define_property";
import { computed } from 'ngular-metal/computed';
import { defineProperty } from "ngular-metal/properties";
import { deprecateProperty } from "ngular-metal/deprecate_property";

QUnit.module('Ngular.defineProperty');

QUnit.test('toString', function() {

  var obj = {};
  defineProperty(obj, 'toString', undefined, function() { return 'FOO'; });
  equal(obj.toString(), 'FOO', 'should replace toString');
});

QUnit.test("for data properties, didDefineProperty hook should be called if implemented", function() {
  expect(2);

  var obj = {
    didDefineProperty(obj, keyName, value) {
      equal(keyName, 'foo', "key name should be foo");
      equal(value, 'bar', "value should be bar");
    }
  };

  defineProperty(obj, 'foo', undefined, "bar");
});

QUnit.test("for descriptor properties, didDefineProperty hook should be called if implemented", function() {
  expect(2);

  var computedProperty = computed(function() { return this; });

  var obj = {
    didDefineProperty(obj, keyName, value) {
      equal(keyName, 'foo', "key name should be foo");
      strictEqual(value, computedProperty, "value should be passed descriptor");
    }
  };

  defineProperty(obj, 'foo', computedProperty);
});

if (hasPropertyAccessors) {

  QUnit.module('Ngular.deprecateProperty');

  QUnit.test("enables access to deprecated property and returns the value of the new property", function() {
    expect(3);
    var obj = { foo: 'bar' };

    deprecateProperty(obj, 'baz', 'foo');

    expectDeprecation();
    equal(obj.baz, obj.foo, 'baz and foo are equal');

    obj.foo = 'blammo';
    equal(obj.baz, obj.foo, 'baz and foo are equal');
  });

  QUnit.test("deprecatedKey is not enumerable", function() {
    expect(2);
    var obj = { foo: 'bar', blammo: 'whammy' };

    deprecateProperty(obj, 'baz', 'foo');

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        notEqual(prop, 'baz');
      }
    }
  });

  QUnit.test("enables setter to deprecated property and updates the value of the new property", function() {
    expect(3);
    var obj = { foo: 'bar' };

    deprecateProperty(obj, 'baz', 'foo');

    expectDeprecation();
    obj.baz = 'bloop';
    equal(obj.foo, 'bloop', 'updating baz updates foo');
    equal(obj.baz, obj.foo, 'baz and foo are equal');
  });
}
