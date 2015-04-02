import get from 'ngular-metal/property_get';
import {
  Mixin,
  mixin
} from 'ngular-metal/mixin';

QUnit.module('Ngular.Mixin.apply');

function K() {}

QUnit.test('using apply() should apply properties', function() {
  var MixinA = Mixin.create({ foo: 'FOO', baz: K });
  var obj = {};
  mixin(obj, MixinA);

  equal(get(obj, 'foo'), "FOO", 'should apply foo');
  equal(get(obj, 'baz'), K, 'should apply foo');
});

QUnit.test('applying anonymous properties', function() {
  var obj = {};
  mixin(obj, {
    foo: 'FOO',
    baz: K
  });

  equal(get(obj, 'foo'), "FOO", 'should apply foo');
  equal(get(obj, 'baz'), K, 'should apply foo');
});

QUnit.test('applying null values', function() {
  expectAssertion(function() {
    mixin({}, null);
  });
});

QUnit.test('applying a property with an undefined value', function() {
  var obj = { tagName: '' };
  mixin(obj, { tagName: undefined });

  strictEqual(get(obj, 'tagName'), '');
});
