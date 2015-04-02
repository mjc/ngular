import run from 'ngular-metal/run_loop';

var originalDebounce = run.backburner.debounce;
var wasCalled = false;
QUnit.module('Ngular.run.debounce', {
  setup() {
    run.backburner.debounce = function() { wasCalled = true; };
  },
  teardown() {
    run.backburner.debounce = originalDebounce;
  }
});

QUnit.test('Ngular.run.debounce uses Backburner.debounce', function() {
  run.debounce(function() {});
  ok(wasCalled, 'Ngular.run.debounce used');
});

