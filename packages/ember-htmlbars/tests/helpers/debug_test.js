import Ngular from "ngular-metal/core"; // Ngular.lookup
import NgularLogger from "ngular-metal/logger";
import NgularView from "ngular-views/views/view";
import compile from "ngular-template-compiler/system/compile";

import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var originalLookup = Ngular.lookup;
var lookup;
var originalLog, logCalls;
var view;

QUnit.module("Handlebars {{log}} helper", {
  setup() {
    Ngular.lookup = lookup = { Ngular: Ngular };

    originalLog = NgularLogger.log;
    logCalls = [];
    NgularLogger.log = function() { logCalls.push.apply(logCalls, arguments); };
  },

  teardown() {
    runDestroy(view);
    view = null;

    NgularLogger.log = originalLog;
    Ngular.lookup = originalLookup;
  }
});

QUnit.test("should be able to log multiple properties", function() {
  var context = {
    value: 'one',
    valueTwo: 'two'
  };

  view = NgularView.create({
    context: context,
    template: compile('{{log value valueTwo}}')
  });

  runAppend(view);

  equal(view.$().text(), "", "shouldn't render any text");
  equal(logCalls[0], 'one');
  equal(logCalls[1], 'two');
});

QUnit.test("should be able to log primitives", function() {
  var context = {
    value: 'one',
    valueTwo: 'two'
  };

  view = NgularView.create({
    context: context,
    template: compile('{{log value "foo" 0 valueTwo true}}')
  });

  runAppend(view);

  equal(view.$().text(), "", "shouldn't render any text");
  strictEqual(logCalls[0], 'one');
  strictEqual(logCalls[1], 'foo');
  strictEqual(logCalls[2], 0);
  strictEqual(logCalls[3], 'two');
  strictEqual(logCalls[4], true);
});
