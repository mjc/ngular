import Ngular from 'ngular-metal/core';
import MutableArrayTests from 'ngular-runtime/tests/suites/mutable_array';
import ArrayController from "ngular-runtime/controllers/array_controller";
import { set } from 'ngular-metal/property_set';
import { get } from 'ngular-metal/property_get';

QUnit.module("ngular-runtime/controllers/array_controller_test");

MutableArrayTests.extend({
  name: 'Ngular.ArrayController',

  newObject(ary) {
    var ret = ary ? ary.slice() : this.newFixture(3);
    return ArrayController.create({
      model: Ngular.A(ret)
    });
  },

  mutate(obj) {
    obj.pushObject(Ngular.get(obj, 'length')+1);
  },

  toArray(obj) {
    return obj.toArray ? obj.toArray() : obj.slice();
  }
}).run();

QUnit.module("ngular-runtime: array_controller");

QUnit.test("defaults its `model` to an empty array", function () {
  var Controller = ArrayController.extend();
  deepEqual(Controller.create().get("model"), [], "`ArrayController` defaults its model to an empty array");
  equal(Controller.create().get('firstObject'), undefined, 'can fetch firstObject');
  equal(Controller.create().get('lastObject'), undefined, 'can fetch lastObject');
});

QUnit.test("Ngular.ArrayController length property works even if model was not set initially", function() {
  var controller = ArrayController.create();
  controller.pushObject('item');
  equal(controller.get('length'), 1);
});

QUnit.test('works properly when model is set to an Ngular.A()', function() {
  var controller = ArrayController.create();

  set(controller, 'model', Ngular.A(['red', 'green']));

  deepEqual(get(controller, 'model'), ['red', 'green'], "can set model as an Ngular.Array");
});

QUnit.test('works properly when model is set to a plain array', function() {
  var controller = ArrayController.create();

  if (Ngular.EXTEND_PROTOTYPES) {
    set(controller, 'model', ['red', 'green']);

    deepEqual(get(controller, 'model'), ['red', 'green'], "can set model as a plain array");
  } else {
    expectAssertion(function() {
      set(controller, 'model', ['red', 'green']);
    }, /ArrayController expects `model` to implement the Ngular.Array mixin. This can often be fixed by wrapping your model with `Ngular\.A\(\)`./);
  }
});
