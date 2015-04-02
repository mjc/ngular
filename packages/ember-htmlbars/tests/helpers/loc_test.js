import NgularView from 'ngular-views/views/view';
import compile from "ngular-template-compiler/system/compile";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

function buildView(template, context) {
  return NgularView.create({
    template: compile(template),
    context: (context || {})
  });
}

var oldString;

QUnit.module('ngular-htmlbars: {{#loc}} helper', {
  setup() {
    oldString = Ngular.STRINGS;
    Ngular.STRINGS = {
      '_Howdy Friend': 'Hallo Freund'
    };
  },

  teardown() {
    Ngular.STRINGS = oldString;
  }
});

QUnit.test('let the original value through by default', function() {
  var view = buildView('{{loc "Hiya buddy!"}}');
  runAppend(view);

  equal(view.$().text(), 'Hiya buddy!');

  runDestroy(view);
});

QUnit.test('localize a simple string', function() {
  var view = buildView('{{loc "_Howdy Friend"}}');
  runAppend(view);

  equal(view.$().text(), 'Hallo Freund');

  runDestroy(view);
});

QUnit.test('localize takes passed formats into an account', function() {
  var view = buildView('{{loc "%@, %@" "Hello" "Mr. Pitkin"}}');
  runAppend(view);

  equal(view.$().text(), 'Hello, Mr. Pitkin', 'the value of localizationKey is correct');

  runDestroy(view);
});

QUnit.test('localize throws an assertion if the second parameter is a binding', function() {
  var view = buildView('{{loc "Hello %@" name}}', {
    name: 'Bob Foster'
  });

  expectAssertion(function() {
    runAppend(view);
  }, /You cannot pass bindings to `loc` helper/);

  runDestroy(view);
});

QUnit.test('localize a binding throws an assertion', function() {
  var view = buildView('{{loc localizationKey}}', {
    localizationKey: 'villain'
  });

  expectAssertion(function() {
    runAppend(view);
  }, /You cannot pass bindings to `loc` helper/);

  runDestroy(view);
});
