import Ngular from 'ngular-metal/core';
import NgularView from 'ngular-views/views/view';
import compile from 'ngular-template-compiler/system/compile';
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var originalLookup, originalLog, logCalls, lookup, view;

QUnit.module('ngular-htmlbars: {{#log}} helper', {
  setup() {
    Ngular.lookup = lookup = { Ngular: Ngular };

    originalLog = Ngular.Logger.log;
    logCalls = [];
    Ngular.Logger.log = function(arg) {
      logCalls.push(arg);
    };
  },

  teardown() {
    runDestroy(view);

    view = null;

    Ngular.Logger.log = originalLog;
    Ngular.lookup = originalLookup;
  }
});

QUnit.test('should be able to log a property', function() {
  var context = {
    value: 'one'
  };

  view = NgularView.create({
    context: context,
    template: compile('{{log value}}')
  });

  runAppend(view);

  equal(view.$().text(), '', 'shouldn\'t render any text');
  equal(logCalls[0], 'one', 'should call log with value');
});

QUnit.test('should be able to log a view property', function() {
  view = NgularView.create({
    template: compile('{{log view.value}}'),
    value: 'one'
  });

  runAppend(view);

  equal(view.$().text(), '', 'shouldn\'t render any text');
  equal(logCalls[0], 'one', 'should call log with value');
});

QUnit.test('should be able to log `this`', function() {
  view = NgularView.create({
    context: 'one',
    template: compile('{{log this}}')
  });

  runAppend(view);

  equal(view.$().text(), '', 'shouldn\'t render any text');
  equal(logCalls[0], 'one', 'should call log with item one');
});
