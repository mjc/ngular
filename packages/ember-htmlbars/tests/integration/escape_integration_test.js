import run from 'ngular-metal/run_loop';
import NgularView from 'ngular-views/views/view';
import compile from 'ngular-template-compiler/system/compile';

import { set } from 'ngular-metal/property_set';
import o_create from 'ngular-metal/platform/create';
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var view;

QUnit.module('ngular-htmlbars: Integration with Globals', {
  teardown() {
    runDestroy(view);

    view = null;
  }
});

QUnit.test('should read from a global-ish simple local path without deprecation', function() {
  view = NgularView.create({
    context: { NotGlobal: 'Gwar' },
    template: compile('{{NotGlobal}}')
  });

  expectNoDeprecation();
  runAppend(view);

  equal(view.$().text(), 'Gwar');
});

QUnit.test('should read a number value', function() {
  var context = { aNumber: 1 };
  view = NgularView.create({
    context: context,
    template: compile('{{aNumber}}')
  });

  runAppend(view);
  equal(view.$().text(), '1');

  run(function() {
    set(context, 'aNumber', 2);
  });

  equal(view.$().text(), '2');
});

QUnit.test('should read an escaped number value', function() {
  var context = { aNumber: 1 };
  view = NgularView.create({
    context: context,
    template: compile('{{{aNumber}}}')
  });

  runAppend(view);
  equal(view.$().text(), '1');

  run(function() {
    set(context, 'aNumber', 2);
  });

  equal(view.$().text(), '2');
});

QUnit.test('should read from an Object.create(null)', function() {
  // Use ngular's polyfill for Object.create
  var nullObject = o_create(null);
  nullObject['foo'] = 'bar';
  view = NgularView.create({
    context: { nullObject: nullObject },
    template: compile('{{nullObject.foo}}')
  });

  runAppend(view);
  equal(view.$().text(), 'bar');

  run(function() {
    set(nullObject, 'foo', 'baz');
  });

  equal(view.$().text(), 'baz');
});

QUnit.test('should escape HTML in primitive value contexts when using normal mustaches', function() {
  view = NgularView.create({
    context: '<b>Max</b><b>James</b>',
    template: compile('{{this}}')
  });

  runAppend(view);

  equal(view.$('b').length, 0, 'does not create an element');
  equal(view.$().text(), '<b>Max</b><b>James</b>', 'inserts entities, not elements');

  run(function() {
    set(view, 'context', '<i>Max</i><i>James</i>');
  });

  equal(view.$().text(), '<i>Max</i><i>James</i>', 'updates with entities, not elements');
  equal(view.$('i').length, 0, 'does not create an element when value is updated');
});

QUnit.test('should not escape HTML in primitive value contexts when using triple mustaches', function() {
  view = NgularView.create({
    context: '<b>Max</b><b>James</b>',
    template: compile('{{{this}}}')
  });

  runAppend(view);

  equal(view.$('b').length, 2, 'creates an element');

  run(function() {
    set(view, 'context', '<i>Max</i><i>James</i>');
  });

  equal(view.$('i').length, 2, 'creates an element when value is updated');
});
