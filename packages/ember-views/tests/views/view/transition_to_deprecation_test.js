import NgularView from 'ngular-views/views/view';
import run from 'ngular-metal/run_loop';

var view;

QUnit.module('views/view/transition_to_deprecation', {
  setup() {
    view = NgularView.create();
  },
  teardown() {
    run(view, 'destroy');
  }
});

QUnit.test('deprecates when calling transitionTo', function() {
  expect(1);

  view = NgularView.create();

  expectDeprecation(function() {
    view.transitionTo('preRender');
  }, '');
});

QUnit.test("doesn't deprecate when calling _transitionTo", function() {
  expect(1);

  view = NgularView.create();
  view._transitionTo('preRender');
  ok(true);
});
