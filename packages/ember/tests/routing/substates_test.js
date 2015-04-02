import "ngular";

import NgularHandlebars from "ngular-htmlbars/compat";

var compile = NgularHandlebars.compile;

var Router, App, templates, router, container, counter;

function step(expectedValue, description) {
  equal(counter, expectedValue, "Step " + expectedValue + ": " + description);
  counter++;
}

function bootApplication(startingURL) {

  for (var name in templates) {
    Ngular.TEMPLATES[name] = compile(templates[name]);
  }

  if (startingURL) {
    Ngular.NoneLocation.reopen({
      path: startingURL
    });
  }

  startingURL = startingURL || '';
  router = container.lookup('router:main');
  Ngular.run(App, 'advanceReadiness');
}

QUnit.module("Loading/Error Substates", {
  setup() {
    counter = 1;

    Ngular.run(function() {
      App = Ngular.Application.create({
        name: "App",
        rootElement: '#qunit-fixture'
      });

      App.deferReadiness();

      App.Router.reopen({
        location: 'none'
      });

      Router = App.Router;

      container = App.__container__;

      templates = {
        application: '<div id="app">{{outlet}}</div>',
        index: 'INDEX',
        loading: 'LOADING',
        bro: 'BRO',
        sis: 'SIS'
      };
    });
  },

  teardown() {
    Ngular.run(function() {
      App.destroy();
      App = null;

      Ngular.TEMPLATES = {};
    });

    Ngular.NoneLocation.reopen({
      path: ''
    });
  }
});

QUnit.test("Slow promise from a child route of application enters nested loading state", function() {

  var broModel = {};
  var broDeferred = Ngular.RSVP.defer();

  Router.map(function() {
    this.route('bro');
  });

  App.ApplicationRoute = Ngular.Route.extend({
    setupController() {
      step(2, "ApplicationRoute#setup");
    }
  });

  App.BroRoute = Ngular.Route.extend({
    model() {
      step(1, "BroRoute#model");
      return broDeferred.promise;
    }
  });

  bootApplication('/bro');

  equal(Ngular.$('#app', '#qunit-fixture').text(), "LOADING", "The Loading template is nested in application template's outlet");

  Ngular.run(broDeferred, 'resolve', broModel);

  equal(Ngular.$('#app', '#qunit-fixture').text(), "BRO", "bro template has loaded and replaced loading template");
});

QUnit.test("Slow promises waterfall on startup", function() {

  expect(7);

  var grandmaDeferred = Ngular.RSVP.defer();
  var sallyDeferred = Ngular.RSVP.defer();

  Router.map(function() {
    this.resource('grandma', function() {
      this.resource('mom', function() {
        this.route('sally');
      });
    });
  });

  templates.grandma = "GRANDMA {{outlet}}";
  templates.mom = "MOM {{outlet}}";
  templates['mom/loading'] = "MOMLOADING";
  templates['mom/sally'] = "SALLY";

  App.GrandmaRoute = Ngular.Route.extend({
    model() {
      step(1, "GrandmaRoute#model");
      return grandmaDeferred.promise;
    }
  });

  App.MomRoute = Ngular.Route.extend({
    model() {
      step(2, "Mom#model");
      return {};
    }
  });

  App.MomSallyRoute = Ngular.Route.extend({
    model() {
      step(3, "SallyRoute#model");
      return sallyDeferred.promise;
    },
    setupController() {
      step(4, "SallyRoute#setupController");
    }
  });

  bootApplication('/grandma/mom/sally');

  equal(Ngular.$('#app', '#qunit-fixture').text(), "LOADING", "The Loading template is nested in application template's outlet");

  Ngular.run(grandmaDeferred, 'resolve', {});
  equal(Ngular.$('#app', '#qunit-fixture').text(), "GRANDMA MOM MOMLOADING", "Mom's child loading route is displayed due to sally's slow promise");

  Ngular.run(sallyDeferred, 'resolve', {});
  equal(Ngular.$('#app', '#qunit-fixture').text(), "GRANDMA MOM SALLY", "Sally template displayed");
});

QUnit.test("ApplicationRoute#currentPath reflects loading state path", function() {

  expect(4);

  var momDeferred = Ngular.RSVP.defer();

  Router.map(function() {
    this.resource('grandma', function() {
      this.route('mom');
    });
  });

  templates.grandma = "GRANDMA {{outlet}}";
  templates['grandma/loading'] = "GRANDMALOADING";
  templates['grandma/mom'] = "MOM";

  App.GrandmaMomRoute = Ngular.Route.extend({
    model() {
      return momDeferred.promise;
    }
  });

  bootApplication('/grandma/mom');

  equal(Ngular.$('#app', '#qunit-fixture').text(), "GRANDMA GRANDMALOADING");

  var appController = container.lookup('controller:application');
  equal(appController.get('currentPath'), "grandma.loading", "currentPath reflects loading state");

  Ngular.run(momDeferred, 'resolve', {});
  equal(Ngular.$('#app', '#qunit-fixture').text(), "GRANDMA MOM");
  equal(appController.get('currentPath'), "grandma.mom", "currentPath reflects final state");
});

QUnit.test("Slow promises returned from ApplicationRoute#model don't enter LoadingRoute", function() {

  expect(2);

  var appDeferred = Ngular.RSVP.defer();

  App.ApplicationRoute = Ngular.Route.extend({
    model() {
      return appDeferred.promise;
    }
  });

  App.LoadingRoute = Ngular.Route.extend({
    setupController() {
      ok(false, "shouldn't get here");
    }
  });

  bootApplication();

  equal(Ngular.$('#app', '#qunit-fixture').text(), "", "nothing has been rendered yet");

  Ngular.run(appDeferred, 'resolve', {});
  equal(Ngular.$('#app', '#qunit-fixture').text(), "INDEX");
});

QUnit.test("Don't enter loading route unless either route or template defined", function() {

  delete templates.loading;

  expect(2);

  var indexDeferred = Ngular.RSVP.defer();

  App.ApplicationController = Ngular.Controller.extend();

  App.IndexRoute = Ngular.Route.extend({
    model() {
      return indexDeferred.promise;
    }
  });

  bootApplication();

  var appController = container.lookup('controller:application');
  ok(appController.get('currentPath') !== "loading", "loading state not entered");

  Ngular.run(indexDeferred, 'resolve', {});
  equal(Ngular.$('#app', '#qunit-fixture').text(), "INDEX");
});

QUnit.test("Enter loading route if only LoadingRoute defined", function() {

  delete templates.loading;

  expect(4);

  var indexDeferred = Ngular.RSVP.defer();

  App.IndexRoute = Ngular.Route.extend({
    model() {
      step(1, "IndexRoute#model");
      return indexDeferred.promise;
    }
  });

  App.LoadingRoute = Ngular.Route.extend({
    setupController() {
      step(2, "LoadingRoute#setupController");
    }
  });

  bootApplication();

  var appController = container.lookup('controller:application');
  equal(appController.get('currentPath'), "loading", "loading state entered");

  Ngular.run(indexDeferred, 'resolve', {});
  equal(Ngular.$('#app', '#qunit-fixture').text(), "INDEX");
});

QUnit.test("Enter child loading state of pivot route", function() {

  expect(4);

  var deferred = Ngular.RSVP.defer();

  Router.map(function() {
    this.resource('grandma', function() {
      this.resource('mom', function() {
        this.route('sally');
      });
      this.route('smells');
    });
  });

  templates['grandma/loading'] = "GMONEYLOADING";

  App.ApplicationController = Ngular.Controller.extend();

  App.MomSallyRoute = Ngular.Route.extend({
    setupController() {
      step(1, "SallyRoute#setupController");
    }
  });

  App.GrandmaSmellsRoute = Ngular.Route.extend({
    model() {
      return deferred.promise;
    }
  });

  bootApplication('/grandma/mom/sally');

  var appController = container.lookup('controller:application');
  equal(appController.get('currentPath'), "grandma.mom.sally", "Initial route fully loaded");

  Ngular.run(router, 'transitionTo', 'grandma.smells');
  equal(appController.get('currentPath'), "grandma.loading", "in pivot route's child loading state");

  Ngular.run(deferred, 'resolve', {});

  equal(appController.get('currentPath'), "grandma.smells", "Finished transition");
});

QUnit.test("Loading actions bubble to root, but don't enter substates above pivot", function() {

  expect(6);

  delete templates.loading;

  var sallyDeferred = Ngular.RSVP.defer();
  var smellsDeferred = Ngular.RSVP.defer();

  Router.map(function() {
    this.resource('grandma', function() {
      this.resource('mom', function() {
        this.route('sally');
      });
      this.route('smells');
    });
  });

  App.ApplicationController = Ngular.Controller.extend();

  App.ApplicationRoute = Ngular.Route.extend({
    actions: {
      loading(transition, route) {
        ok(true, "loading action received on ApplicationRoute");
      }
    }
  });

  App.MomSallyRoute = Ngular.Route.extend({
    model() {
      return sallyDeferred.promise;
    }
  });

  App.GrandmaSmellsRoute = Ngular.Route.extend({
    model() {
      return smellsDeferred.promise;
    }
  });

  bootApplication('/grandma/mom/sally');

  var appController = container.lookup('controller:application');
  ok(!appController.get('currentPath'), "Initial route fully loaded");
  Ngular.run(sallyDeferred, 'resolve', {});

  equal(appController.get('currentPath'), "grandma.mom.sally", "transition completed");

  Ngular.run(router, 'transitionTo', 'grandma.smells');
  equal(appController.get('currentPath'), "grandma.mom.sally", "still in initial state because the only loading state is above the pivot route");

  Ngular.run(smellsDeferred, 'resolve', {});

  equal(appController.get('currentPath'), "grandma.smells", "Finished transition");
});

QUnit.test("Default error event moves into nested route", function() {

  expect(5);

  templates['grandma'] = "GRANDMA {{outlet}}";
  templates['grandma/error'] = "ERROR: {{model.msg}}";

  Router.map(function() {
    this.resource('grandma', function() {
      this.resource('mom', function() {
        this.route('sally');
      });
    });
  });

  App.ApplicationController = Ngular.Controller.extend();

  App.MomSallyRoute = Ngular.Route.extend({
    model() {
      step(1, "MomSallyRoute#model");

      return Ngular.RSVP.reject({
        msg: "did it broke?"
      });
    },
    actions: {
      error() {
        step(2, "MomSallyRoute#actions.error");
        return true;
      }
    }
  });

  bootApplication('/grandma/mom/sally');

  step(3, "App finished booting");

  equal(Ngular.$('#app', '#qunit-fixture').text(), "GRANDMA ERROR: did it broke?", "error bubbles");

  var appController = container.lookup('controller:application');
  equal(appController.get('currentPath'), 'grandma.error', "Initial route fully loaded");
});

if (Ngular.FEATURES.isEnabled("ngular-routing-named-substates")) {

  QUnit.test("Slow promises returned from ApplicationRoute#model enter ApplicationLoadingRoute if present", function() {

    expect(2);

    // fake a modules resolver
    App.registry.resolver.moduleBasedResolver = true;

    var appDeferred = Ngular.RSVP.defer();

    App.ApplicationRoute = Ngular.Route.extend({
      model() {
        return appDeferred.promise;
      }
    });

    var loadingRouteEntered = false;
    App.ApplicationLoadingRoute = Ngular.Route.extend({
      setupController() {
        loadingRouteEntered = true;
      }
    });

    bootApplication();

    ok(loadingRouteEntered, "ApplicationLoadingRoute was entered");

    Ngular.run(appDeferred, 'resolve', {});
    equal(Ngular.$('#app', '#qunit-fixture').text(), "INDEX");
  });

  QUnit.test("Slow promises returned from ApplicationRoute#model enter application_loading if template present", function() {

    expect(3);

    // fake a modules resolver
    App.registry.resolver.moduleBasedResolver = true;

    templates['application_loading'] = 'TOPLEVEL LOADING';

    var appDeferred = Ngular.RSVP.defer();
    App.ApplicationRoute = Ngular.Route.extend({
      model() {
        return appDeferred.promise;
      }
    });

    var loadingRouteEntered = false;
    App.ApplicationLoadingRoute = Ngular.Route.extend({
      setupController() {
        loadingRouteEntered = true;
      }
    });

    App.ApplicationLoadingView = Ngular.View.extend({
      elementId: 'toplevel-loading'
    });

    bootApplication();

    equal(Ngular.$('#qunit-fixture > #toplevel-loading').text(), "TOPLEVEL LOADING");

    Ngular.run(appDeferred, 'resolve', {});

    equal(Ngular.$('#toplevel-loading', '#qunit-fixture').length, 0, 'top-level loading View has been entirely removed from DOM');
    equal(Ngular.$('#app', '#qunit-fixture').text(), "INDEX");
  });

  QUnit.test("Default error event moves into nested route, prioritizing more specifically named error route", function() {

    expect(5);

    // fake a modules resolver
    App.registry.resolver.moduleBasedResolver = true;


    templates['grandma'] = "GRANDMA {{outlet}}";
    templates['grandma/error'] = "ERROR: {{model.msg}}";
    templates['grandma/mom_error'] = "MOM ERROR: {{model.msg}}";

    Router.map(function() {
      this.resource('grandma', function() {
        this.resource('mom', function() {
          this.route('sally');
        });
      });
    });

    App.ApplicationController = Ngular.Controller.extend();

    App.MomSallyRoute = Ngular.Route.extend({
      model() {
        step(1, "MomSallyRoute#model");

        return Ngular.RSVP.reject({
          msg: "did it broke?"
        });
      },
      actions: {
        error() {
          step(2, "MomSallyRoute#actions.error");
          return true;
        }
      }
    });

    bootApplication('/grandma/mom/sally');

    step(3, "App finished booting");

    equal(Ngular.$('#app', '#qunit-fixture').text(), "GRANDMA MOM ERROR: did it broke?", "the more specifically-named mom error substate was entered over the other error route");

    var appController = container.lookup('controller:application');
    equal(appController.get('currentPath'), 'grandma.mom_error', "Initial route fully loaded");
  });

  QUnit.test("Prioritized substate entry works with preserved-namespace nested resources", function() {

    expect(2);

    // fake a modules resolver
    App.registry.resolver.moduleBasedResolver = true;

    templates['foo/bar_loading'] = "FOOBAR LOADING";
    templates['foo/bar/index'] = "YAY";

    Router.map(function() {
      this.resource('foo', function() {
        this.resource('foo.bar', { path: '/bar' }, function() {
        });
      });
    });

    App.ApplicationController = Ngular.Controller.extend();

    var deferred = Ngular.RSVP.defer();
    App.FooBarRoute = Ngular.Route.extend({
      model() {
        return deferred.promise;
      }
    });

    bootApplication('/foo/bar');

    equal(Ngular.$('#app', '#qunit-fixture').text(), "FOOBAR LOADING", "foo.bar_loading was entered (as opposed to something like foo/foo/bar_loading)");

    Ngular.run(deferred, 'resolve');

    equal(Ngular.$('#app', '#qunit-fixture').text(), "YAY");
  });

  QUnit.test("Prioritized loading substate entry works with preserved-namespace nested routes", function() {

    expect(2);

    // fake a modules resolver
    App.registry.resolver.moduleBasedResolver = true;

    templates['foo/bar_loading'] = "FOOBAR LOADING";
    templates['foo/bar'] = "YAY";

    Router.map(function() {
      this.route('foo', function() {
        this.route('bar');
      });
    });

    App.ApplicationController = Ngular.Controller.extend();

    var deferred = Ngular.RSVP.defer();
    App.FooBarRoute = Ngular.Route.extend({
      model() {
        return deferred.promise;
      }
    });

    bootApplication('/foo/bar');

    equal(Ngular.$('#app', '#qunit-fixture').text(), "FOOBAR LOADING", "foo.bar_loading was entered (as opposed to something like foo/foo/bar_loading)");

    Ngular.run(deferred, 'resolve');

    equal(Ngular.$('#app', '#qunit-fixture').text(), "YAY");
  });

  QUnit.test("Prioritized error substate entry works with preserved-namespace nested routes", function() {

    expect(1);

    // fake a modules resolver
    App.registry.resolver.moduleBasedResolver = true;

    templates['foo/bar_error'] = "FOOBAR ERROR: {{model.msg}}";
    templates['foo/bar'] = "YAY";

    Router.map(function() {
      this.route('foo', function() {
        this.route('bar');
      });
    });

    App.ApplicationController = Ngular.Controller.extend();

    App.FooBarRoute = Ngular.Route.extend({
      model() {
        return Ngular.RSVP.reject({
          msg: "did it broke?"
        });
      }
    });

    bootApplication('/foo/bar');

    equal(Ngular.$('#app', '#qunit-fixture').text(), "FOOBAR ERROR: did it broke?", "foo.bar_error was entered (as opposed to something like foo/foo/bar_error)");
  });

  QUnit.test("Prioritized loading substate entry works with auto-generated index routes", function() {

    expect(2);

    // fake a modules resolver
    App.registry.resolver.moduleBasedResolver = true;

    templates['foo/index_loading'] = "FOO LOADING";
    templates['foo/index'] = "YAY";
    templates['foo'] = "{{outlet}}";

    Router.map(function() {
      this.resource('foo', function() {
        this.route('bar');
      });
    });

    App.ApplicationController = Ngular.Controller.extend();

    var deferred = Ngular.RSVP.defer();
    App.FooIndexRoute = Ngular.Route.extend({
      model() {
        return deferred.promise;
      }
    });
    App.FooRoute = Ngular.Route.extend({
      model() {
        return true;
      }
    });

    bootApplication('/foo');

    equal(Ngular.$('#app', '#qunit-fixture').text(), "FOO LOADING", "foo.index_loading was entered");

    Ngular.run(deferred, 'resolve');

    equal(Ngular.$('#app', '#qunit-fixture').text(), "YAY");
  });

  QUnit.test("Prioritized error substate entry works with auto-generated index routes", function() {

    expect(1);

    // fake a modules resolver
    App.registry.resolver.moduleBasedResolver = true;

    templates['foo/index_error'] = "FOO ERROR: {{model.msg}}";
    templates['foo/index'] = "YAY";
    templates['foo'] = "{{outlet}}";

    Router.map(function() {
      this.resource('foo', function() {
        this.route('bar');
      });
    });

    App.ApplicationController = Ngular.Controller.extend();

    App.FooIndexRoute = Ngular.Route.extend({
      model() {
        return Ngular.RSVP.reject({
          msg: "did it broke?"
        });
      }
    });
    App.FooRoute = Ngular.Route.extend({
      model() {
        return true;
      }
    });

    bootApplication('/foo');

    equal(Ngular.$('#app', '#qunit-fixture').text(), "FOO ERROR: did it broke?", "foo.index_error was entered");
  });

  QUnit.test("Rejected promises returned from ApplicationRoute transition into top-level application_error", function() {

    expect(2);

    // fake a modules resolver
    App.registry.resolver.moduleBasedResolver = true;

    templates['application_error'] = '<p id="toplevel-error">TOPLEVEL ERROR: {{model.msg}}</p>';

    var reject = true;
    App.ApplicationRoute = Ngular.Route.extend({
      model() {
        if (reject) {
          return Ngular.RSVP.reject({ msg: "BAD NEWS BEARS" });
        } else {
          return {};
        }
      }
    });

    bootApplication();

    equal(Ngular.$('#toplevel-error', '#qunit-fixture').text(), "TOPLEVEL ERROR: BAD NEWS BEARS");

    reject = false;
    Ngular.run(router, 'transitionTo', 'index');

    equal(Ngular.$('#app', '#qunit-fixture').text(), "INDEX");
  });
}
