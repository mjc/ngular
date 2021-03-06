import run from 'ngular-metal/run_loop';
import get from 'ngular-metal/property_get';
import NgularObject from 'ngular-runtime/system/object';
import Mixin from 'ngular-metal/mixin';

QUnit.module('Ngular.Mixin#reopen');

QUnit.test('using reopen() to add more properties to a simple', function() {
  var MixinA = Mixin.create({ foo: 'FOO', baz: 'BAZ' });
  MixinA.reopen({ bar: 'BAR', foo: 'FOO2' });
  var obj = {};
  MixinA.apply(obj);

  equal(get(obj, 'foo'), 'FOO2', 'mixin() should override');
  equal(get(obj, 'baz'), 'BAZ', 'preserve MixinA props');
  equal(get(obj, 'bar'), 'BAR', 'include MixinB props');
});

QUnit.test('using reopen() and calling _super where there is not a super function does not cause infinite recursion', function() {
  var Taco = NgularObject.extend({
    createBreakfast() {
      // There is no original createBreakfast function.
      // Calling the wrapped _super function here
      // used to end in an infinite call loop
      this._super.apply(this, arguments);
      return "Breakfast!";
    }
  });

  Taco.reopen({
    createBreakfast() {
      return this._super.apply(this, arguments);
    }
  });

  var taco = Taco.create();

  var result;
  run(function() {
    try {
      result = taco.createBreakfast();
    } catch(e) {
      result = "Your breakfast was interrupted by an infinite stack error.";
    }
  });

  equal(result, "Breakfast!");
});

