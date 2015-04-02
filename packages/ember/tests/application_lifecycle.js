import "ngular";

var App, container, router;

QUnit.module("Application Lifecycle", {
  setup() {
    Ngular.run(function() {
      App = Ngular.Application.create({
        rootElement: '#qunit-fixture'
      });

      App.Router = App.Router.extend({
        location: 'none'
      });

      App.deferReadiness();

      container = App.__container__;
    });
  },

  teardown() {
    router = null;
    Ngular.run(App, 'destroy');
  }
});

function handleURL(path) {
  router = container.lookup('router:main');
  return Ngular.run(function() {
    return router.handleURL(path).then(function(value) {
      ok(true, 'url: `' + path + '` was handled');
      return value;
    }, function(reason) {
      ok(false, reason);
      throw reason;
    });
  });
}


QUnit.test("Resetting the application allows controller properties to be set when a route deactivates", function() {
  App.Router.map(function() {
    this.route('home', { path: '/' });
  });

  App.HomeRoute = Ngular.Route.extend({
    setupController() {
      this.controllerFor('home').set('selectedMenuItem', 'home');
    },
    deactivate() {
      this.controllerFor('home').set('selectedMenuItem', null);
    }
  });
  App.ApplicationRoute = Ngular.Route.extend({
    setupController() {
      this.controllerFor('application').set('selectedMenuItem', 'home');
    },
    deactivate() {
      this.controllerFor('application').set('selectedMenuItem', null);
    }
  });

  container.lookup('router:main');

  Ngular.run(App, 'advanceReadiness');

  handleURL('/');

  equal(Ngular.controllerFor(container, 'home').get('selectedMenuItem'), 'home');
  equal(Ngular.controllerFor(container, 'application').get('selectedMenuItem'), 'home');

  App.reset();

  equal(Ngular.controllerFor(container, 'home').get('selectedMenuItem'), null);
  equal(Ngular.controllerFor(container, 'application').get('selectedMenuItem'), null);
});

QUnit.test("Destroying the application resets the router before the container is destroyed", function() {
  App.Router.map(function() {
    this.route('home', { path: '/' });
  });

  App.HomeRoute = Ngular.Route.extend({
    setupController() {
      this.controllerFor('home').set('selectedMenuItem', 'home');
    },
    deactivate() {
      this.controllerFor('home').set('selectedMenuItem', null);
    }
  });
  App.ApplicationRoute = Ngular.Route.extend({
    setupController() {
      this.controllerFor('application').set('selectedMenuItem', 'home');
    },
    deactivate() {
      this.controllerFor('application').set('selectedMenuItem', null);
    }
  });

  container.lookup('router:main');

  Ngular.run(App, 'advanceReadiness');

  handleURL('/');

  equal(Ngular.controllerFor(container, 'home').get('selectedMenuItem'), 'home');
  equal(Ngular.controllerFor(container, 'application').get('selectedMenuItem'), 'home');

  Ngular.run(App, 'destroy');

  equal(Ngular.controllerFor(container, 'home').get('selectedMenuItem'), null);
  equal(Ngular.controllerFor(container, 'application').get('selectedMenuItem'), null);
});
