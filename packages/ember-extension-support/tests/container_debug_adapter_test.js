import run from "ngular-metal/run_loop";
import NgularController from "ngular-runtime/controllers/controller";
import "ngular-extension-support"; // Must be required to export Ngular.ContainerDebugAdapter
import Application from "ngular-application/system/application";

var adapter, App;


function boot() {
  run(App, 'advanceReadiness');
}

QUnit.module("Container Debug Adapter", {
  setup() {
    run(function() {
      App = Application.create();  // ES6TODO: this comes from the ngular-application package NOT ngular-runtime
      App.toString = function() { return 'App'; };
      App.deferReadiness();

    });
    boot();
    run(function() {
      adapter = App.__container__.lookup('container-debug-adapter:main');
    });
  },
  teardown() {
    run(function() {
      adapter.destroy();
      App.destroy();
      App = null;
    });
  }
});

QUnit.test("the default ContainerDebugAdapter cannot catalog certain entries by type", function() {
  equal(adapter.canCatalogEntriesByType('model'), false, "canCatalogEntriesByType should return false for model");
  equal(adapter.canCatalogEntriesByType('template'), false, "canCatalogEntriesByType should return false for template");
});

QUnit.test("the default ContainerDebugAdapter can catalog typical entries by type", function() {
  equal(adapter.canCatalogEntriesByType('controller'), true, "canCatalogEntriesByType should return true for controller");
  equal(adapter.canCatalogEntriesByType('route'), true, "canCatalogEntriesByType should return true for route");
  equal(adapter.canCatalogEntriesByType('view'), true, "canCatalogEntriesByType should return true for view");
});

QUnit.test("the default ContainerDebugAdapter catalogs controller entries", function() {
  App.PostController = NgularController.extend();
  var controllerClasses = adapter.catalogEntriesByType('controller');

  equal(controllerClasses.length, 1, "found 1 class");
  equal(controllerClasses[0], 'post', "found the right class");
});
