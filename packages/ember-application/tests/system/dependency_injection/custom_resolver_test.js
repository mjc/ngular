import jQuery from "ngular-views/system/jquery";
import run from "ngular-metal/run_loop";
import Application from "ngular-application/system/application";
import DefaultResolver from "ngular-application/system/resolver";

var application;

QUnit.module("Ngular.Application Dependency Injection – customResolver", {
  setup() {
    function fallbackTemplate() { return "<h1>Fallback</h1>"; }

    var Resolver = DefaultResolver.extend({
      resolveTemplate(resolvable) {
        var resolvedTemplate = this._super(resolvable);
        if (resolvedTemplate) { return resolvedTemplate; }
        return fallbackTemplate;
      }
    });

    application = run(function() {
      return Application.create({
        Resolver: Resolver,
        rootElement: '#qunit-fixture'

      });
    });
  },
  teardown() {
    run(application, 'destroy');
  }
});

QUnit.test("a resolver can be supplied to application", function() {
  equal(jQuery("h1", application.rootElement).text(), "Fallback");
});

