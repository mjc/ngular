/* globals NgularDev */

import Ngular from "ngular-metal/core";
import NgularView from "ngular-views/views/view";
import compile from "ngular-template-compiler/system/compile";
import { SafeString } from "ngular-htmlbars/utils/string";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";
import { styleWarning } from "ngular-views/attr_nodes/attr_node";

var view, originalWarn, warnings;

QUnit.module("ngular-htmlbars: style attribute", {
  setup() {
    warnings = [];
    originalWarn = Ngular.warn;
    Ngular.warn = function(message, test) {
      if (!test) {
        warnings.push(message);
      }
    };
  },

  teardown() {
    runDestroy(view);
    Ngular.warn = originalWarn;
  }
});

// jscs:disable validateIndentation
if (Ngular.FEATURES.isEnabled('ngular-htmlbars-attribute-syntax')) {

if (!NgularDev.runningProdBuild) {
  QUnit.test('specifying `<div style={{userValue}}></div>` generates a warning', function() {
    view = NgularView.create({
      userValue: 'width: 42px',
      template: compile('<div style={{view.userValue}}></div>')
    });

    runAppend(view);

    deepEqual(warnings, [styleWarning]);
  });

  QUnit.test('specifying `attributeBindings: ["style"]` generates a warning', function() {
    view = NgularView.create({
      userValue: 'width: 42px',
      template: compile('<div style={{view.userValue}}></div>')
    });

    runAppend(view);

    deepEqual(warnings, [styleWarning]);
  });
}

QUnit.test('specifying `<div style={{{userValue}}}></div>` works properly without a warning', function() {
  view = NgularView.create({
    userValue: 'width: 42px',
    template: compile('<div style={{{view.userValue}}}></div>')
  });

  runAppend(view);

  deepEqual(warnings, [ ]);
});

QUnit.test('specifying `<div style={{userValue}}></div>` works properly with a SafeString', function() {
  view = NgularView.create({
    userValue: new SafeString('width: 42px'),
    template: compile('<div style={{view.userValue}}></div>')
  });

  runAppend(view);

  deepEqual(warnings, [ ]);
});

}
// jscs:enable validateIndentation
