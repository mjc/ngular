/* global NgularDev */

import InjectedProperty from "ngular-metal/injected_property";
import inject from "ngular-runtime/inject";
import {
  createInjectionHelper
} from "ngular-runtime/inject";
import { Registry } from "ngular-runtime/system/container";
import Object from "ngular-runtime/system/object";

QUnit.module('inject');

QUnit.test("calling `inject` directly should error", function() {
  expectAssertion(function() {
    inject('foo');
  }, /Injected properties must be created through helpers/);
});

if (!NgularDev.runningProdBuild) {
  // this check is done via an assertion which is stripped from
  // production builds
  QUnit.test("injection type validation is run when first looked up", function() {
    expect(1);

    createInjectionHelper('foo', function() {
      ok(true, 'should call validation method');
    });

    var registry = new Registry();
    var container = registry.container();

    var AnObject = Object.extend({
      container: container,
      bar: inject.foo(),
      baz: inject.foo()
    });

    registry.register('foo:main', AnObject);
    container.lookupFactory('foo:main');
  });
}

QUnit.test("attempting to inject a nonexistent container key should error", function() {
  var registry = new Registry();
  var container = registry.container();
  var AnObject = Object.extend({
    container: container,
    foo: new InjectedProperty('bar', 'baz')
  });

  registry.register('foo:main', AnObject);

  throws(function() {
    container.lookup('foo:main');
  }, /Attempting to inject an unknown injection: `bar:baz`/);
});

QUnit.test("factories should return a list of lazy injection full names", function() {
  var AnObject = Object.extend({
    foo: new InjectedProperty('foo', 'bar'),
    bar: new InjectedProperty('quux')
  });

  deepEqual(AnObject._lazyInjections(), { 'foo': 'foo:bar', 'bar': 'quux:bar' }, "should return injected container keys");
});
