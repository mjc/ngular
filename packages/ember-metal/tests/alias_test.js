import alias from "ngular-metal/alias";
import { defineProperty } from "ngular-metal/properties";
import { get } from 'ngular-metal/property_get';
import { set } from 'ngular-metal/property_set';
import { meta } from 'ngular-metal/utils';
import { isWatching } from "ngular-metal/watching";
import { addObserver, removeObserver } from "ngular-metal/observer";

var obj, count;

QUnit.module('ngular-metal/alias', {
  setup() {
    obj = { foo: { faz: 'FOO' } };
    count = 0;
  },
  teardown() {
    obj = null;
  }
});

function incrementCount() {
  count++;
}

QUnit.test('should proxy get to alt key', function() {
  defineProperty(obj, 'bar', alias('foo.faz'));
  equal(get(obj, 'bar'), 'FOO');
});

QUnit.test('should proxy set to alt key', function() {
  defineProperty(obj, 'bar', alias('foo.faz'));
  set(obj, 'bar', 'BAR');
  equal(get(obj, 'foo.faz'), 'BAR');
});

QUnit.test('basic lifecycle', function() {
  defineProperty(obj, 'bar', alias('foo.faz'));
  var m = meta(obj);
  addObserver(obj, 'bar', incrementCount);
  equal(m.deps['foo.faz'].bar, 1);
  removeObserver(obj, 'bar', incrementCount);
  equal(m.deps['foo.faz'].bar, 0);
});

QUnit.test('begins watching alt key as soon as alias is watched', function() {
  defineProperty(obj, 'bar', alias('foo.faz'));
  addObserver(obj, 'bar', incrementCount);
  ok(isWatching(obj, 'foo.faz'));
  set(obj, 'foo.faz', 'BAR');
  equal(count, 1);
});

QUnit.test('immediately sets up dependencies if already being watched', function() {
  addObserver(obj, 'bar', incrementCount);
  defineProperty(obj, 'bar', alias('foo.faz'));
  ok(isWatching(obj, 'foo.faz'));
  set(obj, 'foo.faz', 'BAR');
  equal(count, 1);
});

QUnit.test('setting alias on self should fail assertion', function() {
  expectAssertion(function() {
    defineProperty(obj, 'bar', alias('bar'));
  }, "Setting alias 'bar' on self");
});
