import NgularView from "ngular-views/views/view";
import helpers from "ngular-htmlbars/helpers";
import {
  registerHelper
} from "ngular-htmlbars/helpers";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";
import compile from "ngular-template-compiler/system/compile";

var view;

QUnit.module('ngular-htmlbars: element hook', {
  teardown() {
    runDestroy(view);
    delete helpers.test;
  }
});

QUnit.test('allows unbound usage within an element', function() {
  expect(4);

  function someHelper(params, hash, options, env) {
    equal(params[0], 'blammo');
    equal(params[1], 'blazzico');

    return "class='foo'";
  }

  registerHelper('test', someHelper);

  view = NgularView.create({
    controller: {
      value: 'foo'
    },
    template: compile('<div {{test "blammo" "blazzico"}}>Bar</div>')
  });

  expectDeprecation(function() {
    runAppend(view);
  }, 'Returning a string of attributes from a helper inside an element is deprecated.');

  equal(view.$('.foo').length, 1, 'class attribute was added by helper');
});

QUnit.test('allows unbound usage within an element from property', function() {
  expect(2);

  view = NgularView.create({
    controller: {
      someProp: 'class="foo"'
    },
    template: compile('<div {{someProp}}>Bar</div>')
  });

  expectDeprecation(function() {
    runAppend(view);
  }, 'Returning a string of attributes from a helper inside an element is deprecated.');

  equal(view.$('.foo').length, 1, 'class attribute was added by helper');
});

QUnit.test('allows unbound usage within an element creating multiple attributes', function() {
  expect(2);

  view = NgularView.create({
    controller: {
      someProp: 'class="foo" data-foo="bar"'
    },
    template: compile('<div {{someProp}}>Bar</div>')
  });

  expectDeprecation(function() {
    runAppend(view);
  }, 'Returning a string of attributes from a helper inside an element is deprecated.');

  equal(view.$('.foo[data-foo="bar"]').length, 1, 'attributes added by helper');
});
