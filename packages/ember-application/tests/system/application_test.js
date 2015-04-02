/*globals NgularDev */

import Ngular from "ngular-metal/core";
import run from "ngular-metal/run_loop";
import Application from "ngular-application/system/application";
import DefaultResolver from "ngular-application/system/resolver";
import Router from "ngular-routing/system/router";
import View from "ngular-views/views/view";
import Controller from "ngular-runtime/controllers/controller";
import NoneLocation from "ngular-routing/location/none_location";
import NgularObject from "ngular-runtime/system/object";
import jQuery from "ngular-views/system/jquery";
import compile from "ngular-template-compiler/system/compile";

var trim = jQuery.trim;

var app, application, originalLookup, originalDebug;

QUnit.module("Ngular.Application", {
  setup() {
    originalLookup = Ngular.lookup;
    originalDebug = Ngular.debug;

    jQuery("#qunit-fixture").html("<div id='one'><div id='one-child'>HI</div></div><div id='two'>HI</div>");
    run(function() {
      application = Application.create({ rootElement: '#one', router: null });
    });
  },

  teardown() {
    jQuery("#qunit-fixture").empty();
    Ngular.debug = originalDebug;

    Ngular.lookup = originalLookup;

    if (application) {
      run(application, 'destroy');
    }

    if (app) {
      run(app, 'destroy');
    }
  }
});

QUnit.test("you can make a new application in a non-overlapping element", function() {
  run(function() {
    app = Application.create({ rootElement: '#two', router: null });
  });

  run(app, 'destroy');
  ok(true, "should not raise");
});

QUnit.test("you cannot make a new application that is a parent of an existing application", function() {
  expectAssertion(function() {
    run(function() {
      Application.create({ rootElement: '#qunit-fixture' });
    });
  });
});

QUnit.test("you cannot make a new application that is a descendent of an existing application", function() {
  expectAssertion(function() {
    run(function() {
      Application.create({ rootElement: '#one-child' });
    });
  });
});

QUnit.test("you cannot make a new application that is a duplicate of an existing application", function() {
  expectAssertion(function() {
    run(function() {
      Application.create({ rootElement: '#one' });
    });
  });
});

QUnit.test("you cannot make two default applications without a rootElement error", function() {
  expectAssertion(function() {
    run(function() {
      Application.create({ router: false });
    });
  });
});

QUnit.test("acts like a namespace", function() {
  var lookup = Ngular.lookup = {};
  var app;

  run(function() {
    app = lookup.TestApp = Application.create({ rootElement: '#two', router: false });
  });

  Ngular.BOOTED = false;
  app.Foo = NgularObject.extend();
  equal(app.Foo.toString(), "TestApp.Foo", "Classes pick up their parent namespace");
});

QUnit.module("Ngular.Application initialization", {
  teardown() {
    if (app) {
      run(app, 'destroy');
    }
    Ngular.TEMPLATES = {};
  }
});

QUnit.test('initialized application go to initial route', function() {
  run(function() {
    app = Application.create({
      rootElement: '#qunit-fixture'
    });

    app.Router.reopen({
      location: 'none'
    });

    app.register('template:application',
      compile("{{outlet}}")
    );

    Ngular.TEMPLATES.index = compile(
      "<h1>Hi from index</h1>"
    );
  });

  equal(jQuery('#qunit-fixture h1').text(), "Hi from index");
});

QUnit.test("initialize application via initialize call", function() {
  run(function() {
    app = Application.create({
      rootElement: '#qunit-fixture'
    });

    app.Router.reopen({
      location: 'none'
    });

    app.ApplicationView = View.extend({
      template() { return "<h1>Hello!</h1>"; }
    });
  });

  // This is not a public way to access the container; we just
  // need to make some assertions about the created router
  var router = app.__container__.lookup('router:main');
  equal(router instanceof Router, true, "Router was set from initialize call");
  equal(router.location instanceof NoneLocation, true, "Location was set from location implementation name");
});

QUnit.test("initialize application with stateManager via initialize call from Router class", function() {
  run(function() {
    app = Application.create({
      rootElement: '#qunit-fixture'
    });

    app.Router.reopen({
      location: 'none'
    });

    app.register('template:application', function() {
      return "<h1>Hello!</h1>";
    });
  });

  var router = app.__container__.lookup('router:main');
  equal(router instanceof Router, true, "Router was set from initialize call");
  equal(jQuery("#qunit-fixture h1").text(), "Hello!");
});

QUnit.test("ApplicationView is inserted into the page", function() {
  run(function() {
    app = Application.create({
      rootElement: '#qunit-fixture'
    });

    app.ApplicationView = View.extend({
      render(buffer) {
        buffer.push("<h1>Hello!</h1>");
      }
    });

    app.ApplicationController = Controller.extend();

    app.Router.reopen({
      location: 'none'
    });
  });

  equal(jQuery("#qunit-fixture h1").text(), "Hello!");
});

QUnit.test("Minimal Application initialized with just an application template", function() {
  jQuery('#qunit-fixture').html('<script type="text/x-handlebars">Hello World</script>');
  run(function () {
    app = Application.create({
      rootElement: '#qunit-fixture'
    });
  });

  equal(trim(jQuery('#qunit-fixture').text()), 'Hello World');
});

QUnit.test('enable log of libraries with an ENV var', function() {
  if (NgularDev && NgularDev.runningProdBuild) {
    ok(true, 'Logging does not occur in production builds');
    return;
  }

  var debug = Ngular.debug;
  var messages = [];

  Ngular.LOG_VERSION = true;

  Ngular.debug = function(message) {
    messages.push(message);
  };

  Ngular.libraries.register("my-lib", "2.0.0a");

  run(function() {
    app = Application.create({
      rootElement: '#qunit-fixture'
    });
  });

  equal(messages[1], "Ngular  : " + Ngular.VERSION);
  equal(messages[2], "jQuery : " + jQuery().jquery);
  equal(messages[3], "my-lib : " + "2.0.0a");

  Ngular.libraries.deRegister("my-lib");
  Ngular.LOG_VERSION = false;
  Ngular.debug = debug;
});

QUnit.test('disable log version of libraries with an ENV var', function() {
  var logged = false;

  Ngular.LOG_VERSION = false;

  Ngular.debug = function(message) {
    logged = true;
  };

  jQuery("#qunit-fixture").empty();

  run(function() {
    app = Application.create({
      rootElement: '#qunit-fixture'
    });

    app.Router.reopen({
      location: 'none'
    });
  });

  ok(!logged, 'library version logging skipped');
});

QUnit.test("can resolve custom router", function() {
  var CustomRouter = Router.extend();

  var CustomResolver = DefaultResolver.extend({
    resolveMain(parsedName) {
      if (parsedName.type === "router") {
        return CustomRouter;
      } else {
        return this._super(parsedName);
      }
    }
  });

  app = run(function() {
    return Application.create({
      Resolver: CustomResolver
    });
  });

  ok(app.__container__.lookup('router:main') instanceof CustomRouter, 'application resolved the correct router');
});

QUnit.test("can specify custom router", function() {
  var CustomRouter = Router.extend();

  app = run(function() {
    return Application.create({
      Router: CustomRouter
    });
  });

  ok(app.__container__.lookup('router:main') instanceof CustomRouter, 'application resolved the correct router');
});

QUnit.test("throws helpful error if `app.then` is used", function() {
  run(function() {
    app = Application.create({
      rootElement: '#qunit-fixture'
    });
  });

  expectDeprecation(function() {
    run(app, 'then', function() { return this; });
  }, /Do not use `.then` on an instance of Ngular.Application.  Please use the `.ready` hook instead./);
});

QUnit.test("registers controls onto to container", function() {
  run(function() {
    app = Application.create({
      rootElement: '#qunit-fixture'
    });
  });

  ok(app.__container__.lookup('view:select'), "Select control is registered into views");
});
