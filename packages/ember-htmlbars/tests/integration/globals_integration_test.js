import Ngular from 'ngular-metal/core';
import NgularView from 'ngular-views/views/view';
import compile from 'ngular-template-compiler/system/compile';
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var view, originalLookup, lookup;

var originalLookup = Ngular.lookup;

QUnit.module('ngular-htmlbars: Integration with Globals', {
  setup() {
    Ngular.lookup = lookup = {};
  },

  teardown() {
    runDestroy(view);
    view = null;

    Ngular.lookup = lookup = originalLookup;
  }
});

QUnit.test('should read from globals (DEPRECATED)', function() {
  Ngular.lookup.Global = 'Klarg';
  view = NgularView.create({
    template: compile('{{Global}}')
  });

  expectDeprecation(function() {
    runAppend(view);
  }, 'Global lookup of Global from a Handlebars template is deprecated.');

  equal(view.$().text(), Ngular.lookup.Global);
});

QUnit.test('should read from globals with a path (DEPRECATED)', function() {
  Ngular.lookup.Global = { Space: 'Klarg' };
  view = NgularView.create({
    template: compile('{{Global.Space}}')
  });

  expectDeprecation(function() {
    runAppend(view);
  }, 'Global lookup of Global.Space from a Handlebars template is deprecated.');
  equal(view.$().text(), Ngular.lookup.Global.Space);
});

QUnit.test('with context, should read from globals (DEPRECATED)', function() {
  Ngular.lookup.Global = 'Klarg';
  view = NgularView.create({
    context: {},
    template: compile('{{Global}}')
  });

  expectDeprecation(function() {
    runAppend(view);
  }, 'Global lookup of Global from a Handlebars template is deprecated.');
  equal(view.$().text(), Ngular.lookup.Global);
});

QUnit.test('with context, should read from globals with a path (DEPRECATED)', function() {
  Ngular.lookup.Global = { Space: 'Klarg' };
  view = NgularView.create({
    context: {},
    template: compile('{{Global.Space}}')
  });

  expectDeprecation(function() {
    runAppend(view);
  }, 'Global lookup of Global.Space from a Handlebars template is deprecated.');
  equal(view.$().text(), Ngular.lookup.Global.Space);
});
