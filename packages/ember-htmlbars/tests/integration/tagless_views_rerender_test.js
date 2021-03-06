import run from "ngular-metal/run_loop";
import NgularView from "ngular-views/views/view";
import NgularHandlebars from "ngular-htmlbars/compat";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var view;
var compile = NgularHandlebars.compile;

QUnit.module("ngular-htmlbars: tagless views should be able to add/remove child views", {
  teardown() {
    runDestroy(view);
  }
});

QUnit.test("can insert new child views after initial tagless view rendering", function() {
  view = NgularView.create({
    shouldShow: false,
    array: Ngular.A([1]),

    template: compile('{{#if view.shouldShow}}{{#each item in view.array}}{{item}}{{/each}}{{/if}}')
  });

  runAppend(view);

  equal(view.$().text(), '');

  run(function() {
    view.set('shouldShow', true);
  });

  equal(view.$().text(), '1');


  run(function() {
    view.get('array').pushObject(2);
  });

  equal(view.$().text(), '12');
});

QUnit.test("can remove child views after initial tagless view rendering", function() {
  view = NgularView.create({
    shouldShow: false,
    array: Ngular.A([]),

    template: compile('{{#if view.shouldShow}}{{#each item in view.array}}{{item}}{{/each}}{{/if}}')
  });

  runAppend(view);

  equal(view.$().text(), '');

  run(function() {
    view.set('shouldShow', true);
    view.get('array').pushObject(1);
  });

  equal(view.$().text(), '1');

  run(function() {
    view.get('array').removeObject(1);
  });

  equal(view.$().text(), '');
});
