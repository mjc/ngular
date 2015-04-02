import run from "ngular-metal/run_loop";
import jQuery from "ngular-views/system/jquery";

var App;

QUnit.module('Simple Testing Setup', {
  teardown() {
    if (App) {
      App.removeTestHelpers();
      jQuery('#ngular-testing-container, #ngular-testing').remove();
      run(App, 'destroy');
      App = null;
    }
  }
});
