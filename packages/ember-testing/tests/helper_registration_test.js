import run from "ngular-metal/run_loop";
import Test from "ngular-testing/test";
import NgularApplication from "ngular-application/system/application";

var App, appBooted, helperContainer;

function registerHelper() {
  Test.registerHelper('boot', function(app) {
    run(app, app.advanceReadiness);
    appBooted = true;
    return app.testHelpers.wait();
  });
}

function unregisterHelper() {
  Test.unregisterHelper('boot');
}

var originalAdapter = Test.adapter;

function setupApp() {
  appBooted = false;
  helperContainer = {};

  run(function() {
    App = NgularApplication.create();
    App.setupForTesting();
    App.injectTestHelpers(helperContainer);
  });
}

function destroyApp() {
  if (App) {
    run(App, 'destroy');
    App = null;
  }
}

QUnit.module("Test - registerHelper/unregisterHelper", {
  teardown() {
    Test.adapter = originalAdapter;
    destroyApp();
  }
});

QUnit.test("Helper gets registered", function() {
  expect(2);

  registerHelper();
  setupApp();

  ok(App.testHelpers.boot);
  ok(helperContainer.boot);
});

QUnit.test("Helper is ran when called", function() {
  expect(1);

  registerHelper();
  setupApp();

  App.testHelpers.boot().then(function() {
    ok(appBooted);
  });
});

QUnit.test("Helper can be unregistered", function() {
  expect(4);

  registerHelper();
  setupApp();

  ok(App.testHelpers.boot);
  ok(helperContainer.boot);

  unregisterHelper();

  setupApp();

  ok(!App.testHelpers.boot, "once unregistered the helper is not added to App.testHelpers");
  ok(!helperContainer.boot, "once unregistered the helper is not added to the helperContainer");
});

