import "ngular";
import { forEach } from "ngular-metal/enumerable_utils";
import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";
import ActionManager from "ngular-views/system/action_manager";

import NgularHandlebars from "ngular-htmlbars/compat";

var compile = NgularHandlebars.compile;
var trim = Ngular.$.trim;

var Router, App, router, registry, container, originalLoggerError;

function bootApplication() {
  router = container.lookup('router:main');
  Ngular.run(App, 'advanceReadiness');
}

function handleURL(path) {
  return Ngular.run(function() {
    return router.handleURL(path).then(function(value) {
      ok(true, 'url: `' + path + '` was handled');
      return value;
    }, function(reason) {
      ok(false, 'failed to visit:`' + path + '` reason: `' + QUnit.jsDump.parse(reason));
      throw reason;
    });
  });
}

function handleURLAborts(path) {
  Ngular.run(function() {
    router.handleURL(path).then(function(value) {
      ok(false, 'url: `' + path + '` was NOT to be handled');
    }, function(reason) {
      ok(reason && reason.message === "TransitionAborted", 'url: `' + path + '` was to be aborted');
    });
  });
}

function handleURLRejectsWith(path, expectedReason) {
  Ngular.run(function() {
    router.handleURL(path).then(function(value) {
      ok(false, 'expected handleURLing: `' + path + '` to fail');
    }, function(reason) {
      equal(expectedReason, reason);
    });
  });
}

QUnit.module("Basic Routing", {
  setup() {
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

      App.LoadingRoute = Ngular.Route.extend({
      });

      registry = App.registry;
      container = App.__container__;

      Ngular.TEMPLATES.application = compile("{{outlet}}");
      Ngular.TEMPLATES.home = compile("<h3>Hours</h3>");
      Ngular.TEMPLATES.homepage = compile("<h3>Megatroll</h3><p>{{model.home}}</p>");
      Ngular.TEMPLATES.camelot = compile('<section><h3>Is a silly place</h3></section>');

      originalLoggerError = Ngular.Logger.error;
    });
  },

  teardown() {
    Ngular.run(function() {
      App.destroy();
      App = null;

      Ngular.TEMPLATES = {};
      Ngular.Logger.error = originalLoggerError;
    });
  }
});

QUnit.test("warn on URLs not included in the route set", function () {
  Router.map(function() {
    this.route("home", { path: "/" });
  });


  bootApplication();

  expectAssertion(function() {
    Ngular.run(function() {
      router.handleURL("/what-is-this-i-dont-even");
    });
  }, "The URL '/what-is-this-i-dont-even' did not match any routes in your application");
});

QUnit.test("The Homepage", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
  });

  var currentPath;

  App.ApplicationController = Ngular.Controller.extend({
    currentPathDidChange: Ngular.observer('currentPath', function() {
      currentPath = get(this, 'currentPath');
    })
  });

  bootApplication();

  equal(currentPath, 'home');
  equal(Ngular.$('h3:contains(Hours)', '#qunit-fixture').length, 1, "The home template was rendered");
});

QUnit.test("The Home page and the Camelot page with multiple Router.map calls", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  Router.map(function() {
    this.route("camelot", { path: "/camelot" });
  });

  App.HomeRoute = Ngular.Route.extend({
  });

  App.CamelotRoute = Ngular.Route.extend({
  });

  var currentPath;

  App.ApplicationController = Ngular.Controller.extend({
    currentPathDidChange: Ngular.observer('currentPath', function() {
      currentPath = get(this, 'currentPath');
    })
  });

  App.CamelotController = Ngular.Controller.extend({
    currentPathDidChange: Ngular.observer('currentPath', function() {
      currentPath = get(this, 'currentPath');
    })
  });

  bootApplication();

  handleURL("/camelot");

  equal(currentPath, 'camelot');
  equal(Ngular.$('h3:contains(silly)', '#qunit-fixture').length, 1, "The camelot template was rendered");

  handleURL("/");

  equal(currentPath, 'home');
  equal(Ngular.$('h3:contains(Hours)', '#qunit-fixture').length, 1, "The home template was rendered");
});

QUnit.test("The Homepage with explicit template name in renderTemplate", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render('homepage');
    }
  });

  bootApplication();

  equal(Ngular.$('h3:contains(Megatroll)', '#qunit-fixture').length, 1, "The homepage template was rendered");
});

QUnit.test("An alternate template will pull in an alternate controller", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render('homepage');
    }
  });

  App.HomepageController = Ngular.Controller.extend({
    model: {
      home: "Comes from homepage"
    }
  });

  bootApplication();

  equal(Ngular.$('h3:contains(Megatroll) + p:contains(Comes from homepage)', '#qunit-fixture').length, 1, "The homepage template was rendered");
});

QUnit.test("An alternate template will pull in an alternate controller instead of controllerName", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
    controllerName: 'foo',
    renderTemplate() {
      this.render('homepage');
    }
  });

  App.FooController = Ngular.Controller.extend({
    model: {
      home: "Comes from Foo"
    }
  });

  App.HomepageController = Ngular.Controller.extend({
    model: {
      home: "Comes from homepage"
    }
  });

  bootApplication();

  equal(Ngular.$('h3:contains(Megatroll) + p:contains(Comes from homepage)', '#qunit-fixture').length, 1, "The homepage template was rendered");
});

QUnit.test("The template will pull in an alternate controller via key/value", function() {
  Router.map(function() {
    this.route("homepage", { path: "/" });
  });

  App.HomepageRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render({ controller: 'home' });
    }
  });

  App.HomeController = Ngular.Controller.extend({
    model: {
      home: "Comes from home."
    }
  });

  bootApplication();

  equal(Ngular.$('h3:contains(Megatroll) + p:contains(Comes from home.)', '#qunit-fixture').length, 1, "The homepage template was rendered from data from the HomeController");
});

QUnit.test("The Homepage with explicit template name in renderTemplate and controller", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeController = Ngular.Controller.extend({
    model: {
      home: "YES I AM HOME"
    }
  });

  App.HomeRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render('homepage');
    }
  });

  bootApplication();

  equal(Ngular.$('h3:contains(Megatroll) + p:contains(YES I AM HOME)', '#qunit-fixture').length, 1, "The homepage template was rendered");
});

QUnit.test("Model passed via renderTemplate model is set as controller's model", function() {
  Ngular.TEMPLATES['bio'] = compile("<p>{{model.name}}</p>");

  App.BioController = Ngular.Controller.extend();

  Router.map(function() {
    this.route('home', { path: '/' });
  });

  App.HomeRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render('bio', {
        model: { name: 'ngularjs' }
      });
    }
  });

  bootApplication();

  equal(Ngular.$('p:contains(ngularjs)', '#qunit-fixture').length, 1, "Passed model was set as controllers model");
});

QUnit.test("Renders correct view with slash notation", function() {
  Ngular.TEMPLATES['home/page'] = compile("<p>{{view.name}}</p>");

  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render('home/page');
    }
  });

  App.HomePageView = Ngular.View.extend({
    name: "Home/Page"
  });

  bootApplication();

  equal(Ngular.$('p:contains(Home/Page)', '#qunit-fixture').length, 1, "The homepage template was rendered");
});

QUnit.test("Renders the view given in the view option", function() {
  Ngular.TEMPLATES['home'] = compile("<p>{{view.name}}</p>");

  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render({ view: 'homePage' });
    }
  });

  App.HomePageView = Ngular.View.extend({
    name: "Home/Page"
  });

  bootApplication();

  equal(Ngular.$('p:contains(Home/Page)', '#qunit-fixture').length, 1, "The homepage view was rendered");
});

QUnit.test('render does not replace templateName if user provided', function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  Ngular.TEMPLATES.the_real_home_template = compile(
    "<p>THIS IS THE REAL HOME</p>"
  );

  App.HomeView = Ngular.View.extend({
    templateName: 'the_real_home_template'
  });
  App.HomeController = Ngular.Controller.extend();
  App.HomeRoute = Ngular.Route.extend();

  bootApplication();

  equal(Ngular.$('p', '#qunit-fixture').text(), "THIS IS THE REAL HOME", "The homepage template was rendered");
});

QUnit.test('render does not replace template if user provided', function () {
  Router.map(function () {
    this.route("home", { path: "/" });
  });

  App.HomeView = Ngular.View.extend({
    template: compile("<p>THIS IS THE REAL HOME</p>")
  });
  App.HomeController = Ngular.Controller.extend();
  App.HomeRoute = Ngular.Route.extend();

  bootApplication();

  Ngular.run(function () {
    router.handleURL("/");
  });

  equal(Ngular.$('p', '#qunit-fixture').text(), "THIS IS THE REAL HOME", "The homepage template was rendered");
});

QUnit.test('render uses templateName from route', function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  Ngular.TEMPLATES.the_real_home_template = compile(
    "<p>THIS IS THE REAL HOME</p>"
  );

  App.HomeController = Ngular.Controller.extend();
  App.HomeRoute = Ngular.Route.extend({
    templateName: 'the_real_home_template'
  });

  bootApplication();

  equal(Ngular.$('p', '#qunit-fixture').text(), "THIS IS THE REAL HOME", "The homepage template was rendered");
});

QUnit.test('defining templateName allows other templates to be rendered', function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  Ngular.TEMPLATES.alert = compile(
    "<div class='alert-box'>Invader!</div>"
  );
  Ngular.TEMPLATES.the_real_home_template = compile(
    "<p>THIS IS THE REAL HOME</p>{{outlet 'alert'}}"
  );

  App.HomeController = Ngular.Controller.extend();
  App.HomeRoute = Ngular.Route.extend({
    templateName: 'the_real_home_template',
    actions: {
      showAlert() {
        this.render('alert', {
          into: 'home',
          outlet: 'alert'
        });
      }
    }
  });

  bootApplication();

  equal(Ngular.$('p', '#qunit-fixture').text(), "THIS IS THE REAL HOME", "The homepage template was rendered");

  Ngular.run(function() {
    router.send('showAlert');
  });

  equal(Ngular.$('.alert-box', '#qunit-fixture').text(), "Invader!", "Template for alert was render into outlet");

});

QUnit.test('Specifying a name to render should have precedence over everything else', function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeController = Ngular.Controller.extend();
  App.HomeRoute = Ngular.Route.extend({
    templateName: 'home',
    controllerName: 'home',
    viewName: 'home',

    renderTemplate() {
      this.render('homepage');
    }
  });

  App.HomeView = Ngular.View.extend({
    template: compile("<h3>This should not be rendered</h3><p>{{model.home}}</p>")
  });

  App.HomepageController = Ngular.Controller.extend({
    model: {
      home: 'Tinytroll'
    }
  });
  App.HomepageView = Ngular.View.extend({
    layout: compile(
      "<span>Outer</span>{{yield}}<span>troll</span>"
    ),
    templateName: 'homepage'
  });

  bootApplication();

  equal(Ngular.$('h3', '#qunit-fixture').text(), "Megatroll", "The homepage template was rendered");
  equal(Ngular.$('p', '#qunit-fixture').text(), "Tinytroll", "The homepage controller was used");
  equal(Ngular.$('span', '#qunit-fixture').text(), "Outertroll", "The homepage view was used");
});

QUnit.test("The Homepage with a `setupController` hook", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
    setupController(controller) {
      set(controller, 'hours', Ngular.A([
        "Monday through Friday: 9am to 5pm",
        "Saturday: Noon to Midnight",
        "Sunday: Noon to 6pm"
      ]));
    }
  });

  Ngular.TEMPLATES.home = compile(
    "<ul>{{#each entry in hours}}<li>{{entry}}</li>{{/each}}</ul>"
  );

  bootApplication();

  equal(Ngular.$('ul li', '#qunit-fixture').eq(2).text(), "Sunday: Noon to 6pm", "The template was rendered with the hours context");
});

QUnit.test("The route controller is still set when overriding the setupController hook", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
    setupController(controller) {
      // no-op
      // importantly, we are not calling  this._super here
    }
  });

  registry.register('controller:home', Ngular.Controller.extend());

  bootApplication();

  deepEqual(container.lookup('route:home').controller, container.lookup('controller:home'), "route controller is the home controller");
});

QUnit.test("The route controller can be specified via controllerName", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  Ngular.TEMPLATES.home = compile(
    "<p>{{myValue}}</p>"
  );

  App.HomeRoute = Ngular.Route.extend({
    controllerName: 'myController'
  });

  registry.register('controller:myController', Ngular.Controller.extend({
    myValue: "foo"
  }));

  bootApplication();

  deepEqual(container.lookup('route:home').controller, container.lookup('controller:myController'), "route controller is set by controllerName");
  equal(Ngular.$('p', '#qunit-fixture').text(), "foo", "The homepage template was rendered with data from the custom controller");
});

QUnit.test("The route controller specified via controllerName is used in render", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  Ngular.TEMPLATES.alternative_home = compile(
    "<p>alternative home: {{myValue}}</p>"
  );

  App.HomeRoute = Ngular.Route.extend({
    controllerName: 'myController',
    renderTemplate() {
      this.render("alternative_home");
    }
  });

  registry.register('controller:myController', Ngular.Controller.extend({
    myValue: "foo"
  }));

  bootApplication();

  deepEqual(container.lookup('route:home').controller, container.lookup('controller:myController'), "route controller is set by controllerName");
  equal(Ngular.$('p', '#qunit-fixture').text(), "alternative home: foo", "The homepage template was rendered with data from the custom controller");
});

QUnit.test("The route controller specified via controllerName is used in render even when a controller with the routeName is available", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  Ngular.TEMPLATES.home = compile(
    "<p>home: {{myValue}}</p>"
  );

  App.HomeRoute = Ngular.Route.extend({
    controllerName: 'myController'
  });

  registry.register('controller:home', Ngular.Controller.extend({
    myValue: "home"
  }));

  registry.register('controller:myController', Ngular.Controller.extend({
    myValue: "myController"
  }));

  bootApplication();

  deepEqual(container.lookup('route:home').controller, container.lookup('controller:myController'), "route controller is set by controllerName");
  equal(Ngular.$('p', '#qunit-fixture').text(), "home: myController", "The homepage template was rendered with data from the custom controller");
});

QUnit.test("The Homepage with a `setupController` hook modifying other controllers", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
    setupController(controller) {
      set(this.controllerFor('home'), 'hours', Ngular.A([
        "Monday through Friday: 9am to 5pm",
        "Saturday: Noon to Midnight",
        "Sunday: Noon to 6pm"
      ]));
    }
  });

  Ngular.TEMPLATES.home = compile(
    "<ul>{{#each entry in hours}}<li>{{entry}}</li>{{/each}}</ul>"
  );

  bootApplication();

  equal(Ngular.$('ul li', '#qunit-fixture').eq(2).text(), "Sunday: Noon to 6pm", "The template was rendered with the hours context");
});

QUnit.test("The Homepage with a computed context that does not get overridden", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeController = Ngular.ArrayController.extend({
    model: Ngular.computed(function() {
      return Ngular.A([
        "Monday through Friday: 9am to 5pm",
        "Saturday: Noon to Midnight",
        "Sunday: Noon to 6pm"
      ]);
    })
  });

  Ngular.TEMPLATES.home = compile(
    "<ul>{{#each passage in model}}<li>{{passage}}</li>{{/each}}</ul>"
  );

  bootApplication();

  equal(Ngular.$('ul li', '#qunit-fixture').eq(2).text(), "Sunday: Noon to 6pm", "The template was rendered with the context intact");
});

QUnit.test("The Homepage getting its controller context via model", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
    model() {
      return Ngular.A([
        "Monday through Friday: 9am to 5pm",
        "Saturday: Noon to Midnight",
        "Sunday: Noon to 6pm"
      ]);
    },

    setupController(controller, model) {
      equal(this.controllerFor('home'), controller);

      set(this.controllerFor('home'), 'hours', model);
    }
  });

  Ngular.TEMPLATES.home = compile(
    "<ul>{{#each entry in hours}}<li>{{entry}}</li>{{/each}}</ul>"
  );

  bootApplication();

  equal(Ngular.$('ul li', '#qunit-fixture').eq(2).text(), "Sunday: Noon to 6pm", "The template was rendered with the hours context");
});

QUnit.test("The Specials Page getting its controller context by deserializing the params hash", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
    this.resource("special", { path: "/specials/:menu_item_id" });
  });

  App.SpecialRoute = Ngular.Route.extend({
    model(params) {
      return Ngular.Object.create({
        menuItemId: params.menu_item_id
      });
    },

    setupController(controller, model) {
      set(controller, 'model', model);
    }
  });

  Ngular.TEMPLATES.special = compile(
    "<p>{{model.menuItemId}}</p>"
  );

  bootApplication();

  registry.register('controller:special', Ngular.Controller.extend());

  handleURL("/specials/1");

  equal(Ngular.$('p', '#qunit-fixture').text(), "1", "The model was used to render the template");
});

QUnit.test("The Specials Page defaults to looking models up via `find`", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
    this.resource("special", { path: "/specials/:menu_item_id" });
  });

  App.MenuItem = Ngular.Object.extend();
  App.MenuItem.reopenClass({
    find(id) {
      return App.MenuItem.create({
        id: id
      });
    }
  });

  App.SpecialRoute = Ngular.Route.extend({
    setupController(controller, model) {
      set(controller, 'model', model);
    }
  });

  Ngular.TEMPLATES.special = compile(
    "<p>{{model.id}}</p>"
  );

  bootApplication();

  registry.register('controller:special', Ngular.Controller.extend());

  handleURL("/specials/1");

  equal(Ngular.$('p', '#qunit-fixture').text(), "1", "The model was used to render the template");
});

QUnit.test("The Special Page returning a promise puts the app into a loading state until the promise is resolved", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
    this.resource("special", { path: "/specials/:menu_item_id" });
  });

  var menuItem, resolve;

  App.MenuItem = Ngular.Object.extend();
  App.MenuItem.reopenClass({
    find(id) {
      menuItem = App.MenuItem.create({ id: id });

      return new Ngular.RSVP.Promise(function(res) {
        resolve = res;
      });
    }
  });

  App.LoadingRoute = Ngular.Route.extend({

  });

  App.SpecialRoute = Ngular.Route.extend({
    setupController(controller, model) {
      set(controller, 'model', model);
    }
  });

  Ngular.TEMPLATES.special = compile(
    "<p>{{model.id}}</p>"
  );

  Ngular.TEMPLATES.loading = compile(
    "<p>LOADING!</p>"
  );

  bootApplication();

  registry.register('controller:special', Ngular.Controller.extend());

  handleURL("/specials/1");

  equal(Ngular.$('p', '#qunit-fixture').text(), "LOADING!", "The app is in the loading state");

  Ngular.run(function() {
    resolve(menuItem);
  });

  equal(Ngular.$('p', '#qunit-fixture').text(), "1", "The app is now in the specials state");
});

QUnit.test("The loading state doesn't get entered for promises that resolve on the same run loop", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
    this.resource("special", { path: "/specials/:menu_item_id" });
  });

  App.MenuItem = Ngular.Object.extend();
  App.MenuItem.reopenClass({
    find(id) {
      return { id: id };
    }
  });

  App.LoadingRoute = Ngular.Route.extend({
    enter() {
      ok(false, "LoadingRoute shouldn't have been entered.");
    }
  });

  App.SpecialRoute = Ngular.Route.extend({
    setupController(controller, model) {
      set(controller, 'model', model);
    }
  });

  Ngular.TEMPLATES.special = compile(
    "<p>{{model.id}}</p>"
  );

  Ngular.TEMPLATES.loading = compile(
    "<p>LOADING!</p>"
  );

  bootApplication();

  registry.register('controller:special', Ngular.Controller.extend());

  handleURL("/specials/1");

  equal(Ngular.$('p', '#qunit-fixture').text(), "1", "The app is now in the specials state");
});

/*
asyncTest("The Special page returning an error fires the error hook on SpecialRoute", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
    this.resource("special", { path: "/specials/:menu_item_id" });
  });

  var menuItem;

  App.MenuItem = Ngular.Object.extend(Ngular.DeferredMixin);
  App.MenuItem.reopenClass({
    find: function(id) {
      menuItem = App.MenuItem.create({ id: id });
      Ngular.run.later(function() { menuItem.resolve(menuItem); }, 1);
      return menuItem;
    }
  });

  App.SpecialRoute = Ngular.Route.extend({
    setup: function() {
      throw 'Setup error';
    },
    actions: {
      error: function(reason) {
        equal(reason, 'Setup error');
        QUnit.start();
      }
    }
  });

  bootApplication();

  handleURLRejectsWith('/specials/1', 'Setup error');
});
*/

QUnit.test("The Special page returning an error invokes SpecialRoute's error handler", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
    this.resource("special", { path: "/specials/:menu_item_id" });
  });

  var menuItem, promise, resolve;

  App.MenuItem = Ngular.Object.extend();
  App.MenuItem.reopenClass({
    find(id) {
      menuItem = App.MenuItem.create({ id: id });
      promise = new Ngular.RSVP.Promise(function(res) {
        resolve = res;
      });

      return promise;
    }
  });

  App.SpecialRoute = Ngular.Route.extend({
    setup() {
      throw 'Setup error';
    },
    actions: {
      error(reason) {
        equal(reason, 'Setup error', 'SpecialRoute#error received the error thrown from setup');
      }
    }
  });

  bootApplication();

  handleURLRejectsWith('/specials/1', 'Setup error');

  Ngular.run(function() {
    resolve(menuItem);
  });
});

function testOverridableErrorHandler(handlersName) {

  expect(2);

  Router.map(function() {
    this.route("home", { path: "/" });
    this.resource("special", { path: "/specials/:menu_item_id" });
  });

  var menuItem, resolve;

  App.MenuItem = Ngular.Object.extend();
  App.MenuItem.reopenClass({
    find(id) {
      menuItem = App.MenuItem.create({ id: id });
      return new Ngular.RSVP.Promise(function(res) {
        resolve = res;
      });
    }
  });

  var attrs = {};
  attrs[handlersName] = {
    error(reason) {
      equal(reason, 'Setup error', "error was correctly passed to custom ApplicationRoute handler");
    }
  };

  App.ApplicationRoute = Ngular.Route.extend(attrs);

  App.SpecialRoute = Ngular.Route.extend({
    setup() {
      throw 'Setup error';
    }
  });

  bootApplication();

  handleURLRejectsWith("/specials/1", "Setup error");

  Ngular.run(function() {
    resolve(menuItem);
  });
}

QUnit.test("ApplicationRoute's default error handler can be overridden", function() {
  testOverridableErrorHandler('actions');
});

QUnit.test("ApplicationRoute's default error handler can be overridden (with DEPRECATED `events`)", function() {
  ignoreDeprecation(function() {
    testOverridableErrorHandler('events');
  });
});

asyncTest("Moving from one page to another triggers the correct callbacks", function() {
  expect(3);

  Router.map(function() {
    this.route("home", { path: "/" });
    this.resource("special", { path: "/specials/:menu_item_id" });
  });

  App.MenuItem = Ngular.Object.extend();

  App.SpecialRoute = Ngular.Route.extend({
    setupController(controller, model) {
      set(controller, 'model', model);
    }
  });

  Ngular.TEMPLATES.home = compile(
    "<h3>Home</h3>"
  );

  Ngular.TEMPLATES.special = compile(
    "<p>{{model.id}}</p>"
  );

  bootApplication();

  registry.register('controller:special', Ngular.Controller.extend());

  var transition = handleURL('/');

  Ngular.run(function() {
    transition.then(function() {
      equal(Ngular.$('h3', '#qunit-fixture').text(), "Home", "The app is now in the initial state");

      var promiseContext = App.MenuItem.create({ id: 1 });
      Ngular.run.later(function() {
        Ngular.RSVP.resolve(promiseContext);
      }, 1);

      return router.transitionTo('special', promiseContext);
    }).then(function(result) {
      deepEqual(router.location.path, '/specials/1');
      QUnit.start();
    });
  });
});

asyncTest("Nested callbacks are not exited when moving to siblings", function() {
  Router.map(function() {
    this.resource("root", { path: "/" }, function() {
      this.resource("special", { path: "/specials/:menu_item_id" });
    });
  });

  var currentPath;

  App.ApplicationController = Ngular.Controller.extend({
    currentPathDidChange: Ngular.observer('currentPath', function() {
      currentPath = get(this, 'currentPath');
    })
  });

  var menuItem;

  App.MenuItem = Ngular.Object.extend();
  App.MenuItem.reopenClass({
    find(id) {
      menuItem = App.MenuItem.create({ id: id });
      return menuItem;
    }
  });

  App.LoadingRoute = Ngular.Route.extend({

  });

  App.RootRoute = Ngular.Route.extend({
    model() {
      rootModel++;
      return this._super.apply(this, arguments);
    },

    serialize() {
      rootSerialize++;
      return this._super.apply(this, arguments);
    },

    setupController() {
      rootSetup++;
    },

    renderTemplate() {
      rootRender++;
    }
  });

  App.HomeRoute = Ngular.Route.extend({

  });

  App.SpecialRoute = Ngular.Route.extend({
    setupController(controller, model) {
      set(controller, 'model', model);
    }
  });

  Ngular.TEMPLATES['root/index'] = compile(
    "<h3>Home</h3>"
  );

  Ngular.TEMPLATES.special = compile(
    "<p>{{model.id}}</p>"
  );

  Ngular.TEMPLATES.loading = compile(
    "<p>LOADING!</p>"
  );

  var rootSetup = 0;
  var rootRender = 0;
  var rootModel = 0;
  var rootSerialize = 0;

  bootApplication();

  registry.register('controller:special', Ngular.Controller.extend());

  equal(Ngular.$('h3', '#qunit-fixture').text(), "Home", "The app is now in the initial state");
  equal(rootSetup, 1, "The root setup was triggered");
  equal(rootRender, 1, "The root render was triggered");
  equal(rootSerialize, 0, "The root serialize was not called");
  equal(rootModel, 1, "The root model was called");

  router = container.lookup('router:main');

  Ngular.run(function() {
    var menuItem = App.MenuItem.create({ id: 1 });
    Ngular.run.later(function() {
      Ngular.RSVP.resolve(menuItem);
    }, 1);

    router.transitionTo('special', menuItem).then(function(result) {
      equal(rootSetup, 1, "The root setup was not triggered again");
      equal(rootRender, 1, "The root render was not triggered again");
      equal(rootSerialize, 0, "The root serialize was not called");

      // TODO: Should this be changed?
      equal(rootModel, 1, "The root model was called again");

      deepEqual(router.location.path, '/specials/1');
      equal(currentPath, 'root.special');

      QUnit.start();
    });
  });
});

asyncTest("Events are triggered on the controller if a matching action name is implemented", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  var model = { name: "Tom Dale" };
  var stateIsNotCalled = true;

  App.HomeRoute = Ngular.Route.extend({
    model() {
      return model;
    },

    actions: {
      showStuff(obj) {
        stateIsNotCalled = false;
      }
    }
  });

  Ngular.TEMPLATES.home = compile(
    "<a {{action 'showStuff' model}}>{{name}}</a>"
  );

  var controller = Ngular.Controller.extend({
    actions: {
      showStuff(context) {
        ok(stateIsNotCalled, "an event on the state is not triggered");
        deepEqual(context, { name: "Tom Dale" }, "an event with context is passed");
        QUnit.start();
      }
    }
  });

  registry.register('controller:home', controller);

  bootApplication();

  var actionId = Ngular.$("#qunit-fixture a").data("ngular-action");
  var action = ActionManager.registeredActions[actionId];
  var event = new Ngular.$.Event("click");
  action.handler(event);
});

asyncTest("Events are triggered on the current state when defined in `actions` object", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  var model = { name: "Tom Dale" };

  App.HomeRoute = Ngular.Route.extend({
    model() {
      return model;
    },

    actions: {
      showStuff(obj) {
        ok(this instanceof App.HomeRoute, "the handler is an App.HomeRoute");
        // Using Ngular.copy removes any private Ngular vars which older IE would be confused by
        deepEqual(Ngular.copy(obj, true), { name: "Tom Dale" }, "the context is correct");
        QUnit.start();
      }
    }
  });

  Ngular.TEMPLATES.home = compile(
    "<a {{action 'showStuff' model}}>{{model.name}}</a>"
  );

  bootApplication();

  var actionId = Ngular.$("#qunit-fixture a").data("ngular-action");
  var action = ActionManager.registeredActions[actionId];
  var event = new Ngular.$.Event("click");
  action.handler(event);
});

asyncTest("Events defined in `actions` object are triggered on the current state when routes are nested", function() {
  Router.map(function() {
    this.resource("root", { path: "/" }, function() {
      this.route("index", { path: "/" });
    });
  });

  var model = { name: "Tom Dale" };

  App.RootRoute = Ngular.Route.extend({
    actions: {
      showStuff(obj) {
        ok(this instanceof App.RootRoute, "the handler is an App.HomeRoute");
        // Using Ngular.copy removes any private Ngular vars which older IE would be confused by
        deepEqual(Ngular.copy(obj, true), { name: "Tom Dale" }, "the context is correct");
        QUnit.start();
      }
    }
  });

  App.RootIndexRoute = Ngular.Route.extend({
    model() {
      return model;
    }
  });

  Ngular.TEMPLATES['root/index'] = compile(
    "<a {{action 'showStuff' model}}>{{model.name}}</a>"
  );

  bootApplication();

  var actionId = Ngular.$("#qunit-fixture a").data("ngular-action");
  var action = ActionManager.registeredActions[actionId];
  var event = new Ngular.$.Event("click");
  action.handler(event);
});

asyncTest("Events are triggered on the current state when defined in `events` object (DEPRECATED)", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  var model = { name: "Tom Dale" };

  App.HomeRoute = Ngular.Route.extend({
    model() {
      return model;
    },

    events: {
      showStuff(obj) {
        ok(this instanceof App.HomeRoute, "the handler is an App.HomeRoute");
        // Using Ngular.copy removes any private Ngular vars which older IE would be confused by
        deepEqual(Ngular.copy(obj, true), { name: "Tom Dale" }, "the context is correct");
        QUnit.start();
      }
    }
  });

  Ngular.TEMPLATES.home = compile(
    "<a {{action 'showStuff' model}}>{{name}}</a>"
  );

  expectDeprecation(/Action handlers contained in an `events` object are deprecated/);
  bootApplication();

  var actionId = Ngular.$("#qunit-fixture a").data("ngular-action");
  var action = ActionManager.registeredActions[actionId];
  var event = new Ngular.$.Event("click");
  action.handler(event);
});

asyncTest("Events defined in `events` object are triggered on the current state when routes are nested (DEPRECATED)", function() {
  Router.map(function() {
    this.resource("root", { path: "/" }, function() {
      this.route("index", { path: "/" });
    });
  });

  var model = { name: "Tom Dale" };

  App.RootRoute = Ngular.Route.extend({
    events: {
      showStuff(obj) {
        ok(this instanceof App.RootRoute, "the handler is an App.HomeRoute");
        // Using Ngular.copy removes any private Ngular vars which older IE would be confused by
        deepEqual(Ngular.copy(obj, true), { name: "Tom Dale" }, "the context is correct");
        QUnit.start();
      }
    }
  });

  App.RootIndexRoute = Ngular.Route.extend({
    model() {
      return model;
    }
  });

  Ngular.TEMPLATES['root/index'] = compile(
    "<a {{action 'showStuff' model}}>{{name}}</a>"
  );

  expectDeprecation(/Action handlers contained in an `events` object are deprecated/);
  bootApplication();

  var actionId = Ngular.$("#qunit-fixture a").data("ngular-action");
  var action = ActionManager.registeredActions[actionId];
  var event = new Ngular.$.Event("click");
  action.handler(event);
});

QUnit.test("Events can be handled by inherited event handlers", function() {

  expect(4);

  App.SuperRoute = Ngular.Route.extend({
    actions: {
      foo() {
        ok(true, 'foo');
      },
      bar(msg) {
        equal(msg, "HELLO");
      }
    }
  });

  App.RouteMixin = Ngular.Mixin.create({
    actions: {
      bar(msg) {
        equal(msg, "HELLO");
        this._super(msg);
      }
    }
  });

  App.IndexRoute = App.SuperRoute.extend(App.RouteMixin, {
    actions: {
      baz() {
        ok(true, 'baz');
      }
    }
  });

  bootApplication();

  router.send("foo");
  router.send("bar", "HELLO");
  router.send("baz");
});

asyncTest("Actions are not triggered on the controller if a matching action name is implemented as a method", function() {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  var model = { name: "Tom Dale" };
  var stateIsNotCalled = true;

  App.HomeRoute = Ngular.Route.extend({
    model() {
      return model;
    },

    actions: {
      showStuff(context) {
        ok(stateIsNotCalled, "an event on the state is not triggered");
        deepEqual(context, { name: "Tom Dale" }, "an event with context is passed");
        QUnit.start();
      }
    }
  });

  Ngular.TEMPLATES.home = compile(
    "<a {{action 'showStuff' model}}>{{name}}</a>"
  );

  var controller = Ngular.Controller.extend({
    showStuff(context) {
      stateIsNotCalled = false;
      ok(stateIsNotCalled, "an event on the state is not triggered");
    }
  });

  registry.register('controller:home', controller);

  bootApplication();

  var actionId = Ngular.$("#qunit-fixture a").data("ngular-action");
  var action = ActionManager.registeredActions[actionId];
  var event = new Ngular.$.Event("click");
  action.handler(event);
});

asyncTest("actions can be triggered with multiple arguments", function() {
  Router.map(function() {
    this.resource("root", { path: "/" }, function() {
      this.route("index", { path: "/" });
    });
  });

  var model1 = { name: "Tilde" };
  var model2 = { name: "Tom Dale" };

  App.RootRoute = Ngular.Route.extend({
    actions: {
      showStuff(obj1, obj2) {
        ok(this instanceof App.RootRoute, "the handler is an App.HomeRoute");
        // Using Ngular.copy removes any private Ngular vars which older IE would be confused by
        deepEqual(Ngular.copy(obj1, true), { name: "Tilde" }, "the first context is correct");
        deepEqual(Ngular.copy(obj2, true), { name: "Tom Dale" }, "the second context is correct");
        QUnit.start();
      }
    }
  });

  App.RootIndexController = Ngular.Controller.extend({
    model1: model1,
    model2: model2
  });

  Ngular.TEMPLATES['root/index'] = compile(
    "<a {{action 'showStuff' model1 model2}}>{{model1.name}}</a>"
  );

  bootApplication();

  var actionId = Ngular.$("#qunit-fixture a").data("ngular-action");
  var action = ActionManager.registeredActions[actionId];
  var event = new Ngular.$.Event("click");
  action.handler(event);
});

QUnit.test("transitioning multiple times in a single run loop only sets the URL once", function() {
  Router.map(function() {
    this.route("root", { path: "/" });
    this.route("foo");
    this.route("bar");
  });

  bootApplication();

  var urlSetCount = 0;

  router.get('location').setURL = function(path) {
    urlSetCount++;
    set(this, 'path', path);
  };

  equal(urlSetCount, 0);

  Ngular.run(function() {
    router.transitionTo("foo");
    router.transitionTo("bar");
  });

  equal(urlSetCount, 1);
  equal(router.get('location').getURL(), "/bar");
});

QUnit.test('navigating away triggers a url property change', function() {

  expect(3);

  Router.map(function() {
    this.route('root', { path: '/' });
    this.route('foo', { path: '/foo' });
    this.route('bar', { path: '/bar' });
  });

  bootApplication();

  Ngular.run(function() {
    Ngular.addObserver(router, 'url', function() {
      ok(true, "url change event was fired");
    });
  });

  forEach(['foo', 'bar', '/foo'], function(destination) {
    Ngular.run(router, 'transitionTo', destination);
  });
});

QUnit.test("using replaceWith calls location.replaceURL if available", function() {
  var setCount = 0;
  var replaceCount = 0;

  Router.reopen({
    location: Ngular.NoneLocation.createWithMixins({
      setURL(path) {
        setCount++;
        set(this, 'path', path);
      },

      replaceURL(path) {
        replaceCount++;
        set(this, 'path', path);
      }
    })
  });

  Router.map(function() {
    this.route("root", { path: "/" });
    this.route("foo");
  });

  bootApplication();

  equal(setCount, 0);
  equal(replaceCount, 0);

  Ngular.run(function() {
    router.replaceWith("foo");
  });

  equal(setCount, 0, 'should not call setURL');
  equal(replaceCount, 1, 'should call replaceURL once');
  equal(router.get('location').getURL(), "/foo");
});

QUnit.test("using replaceWith calls setURL if location.replaceURL is not defined", function() {
  var setCount = 0;

  Router.reopen({
    location: Ngular.NoneLocation.createWithMixins({
      setURL(path) {
        setCount++;
        set(this, 'path', path);
      }
    })
  });

  Router.map(function() {
    this.route("root", { path: "/" });
    this.route("foo");
  });

  bootApplication();

  equal(setCount, 0);

  Ngular.run(function() {
    router.replaceWith("foo");
  });

  equal(setCount, 1, 'should call setURL once');
  equal(router.get('location').getURL(), "/foo");
});

QUnit.test("Route inherits model from parent route", function() {
  expect(9);

  Router.map(function() {
    this.resource("the_post", { path: "/posts/:post_id" }, function() {
      this.route("comments");

      this.resource("shares", { path: "/shares/:share_id" }, function() {
        this.route("share");
      });
    });
  });

  var post1 = {};
  var post2 = {};
  var post3 = {};
  var currentPost;
  var share1 = {};
  var share2 = {};
  var share3 = {};

  var posts = {
    1: post1,
    2: post2,
    3: post3
  };
  var shares = {
    1: share1,
    2: share2,
    3: share3
  };

  App.ThePostRoute = Ngular.Route.extend({
    model(params) {
      return posts[params.post_id];
    }
  });

  App.ThePostCommentsRoute = Ngular.Route.extend({
    afterModel(post, transition) {
      var parent_model = this.modelFor('thePost');

      equal(post, parent_model);
    }
  });

  App.SharesRoute = Ngular.Route.extend({
    model(params) {
      return shares[params.share_id];
    }
  });

  App.SharesShareRoute = Ngular.Route.extend({
    afterModel(share, transition) {
      var parent_model = this.modelFor('shares');

      equal(share, parent_model);
    }
  });

  bootApplication();

  currentPost = post1;
  handleURL("/posts/1/comments");
  handleURL("/posts/1/shares/1");

  currentPost = post2;
  handleURL("/posts/2/comments");
  handleURL("/posts/2/shares/2");

  currentPost = post3;
  handleURL("/posts/3/comments");
  handleURL("/posts/3/shares/3");
});

QUnit.test("Resource inherits model from parent resource", function() {
  expect(6);

  Router.map(function() {
    this.resource("the_post", { path: "/posts/:post_id" }, function() {
      this.resource("comments", function() {
      });
    });
  });

  var post1 = {};
  var post2 = {};
  var post3 = {};
  var currentPost;

  var posts = {
    1: post1,
    2: post2,
    3: post3
  };

  App.ThePostRoute = Ngular.Route.extend({
    model(params) {
      return posts[params.post_id];
    }
  });

  App.CommentsRoute = Ngular.Route.extend({
    afterModel(post, transition) {
      var parent_model = this.modelFor('thePost');

      equal(post, parent_model);
    }
  });

  bootApplication();

  currentPost = post1;
  handleURL("/posts/1/comments");

  currentPost = post2;
  handleURL("/posts/2/comments");

  currentPost = post3;
  handleURL("/posts/3/comments");
});

QUnit.test("It is possible to get the model from a parent route", function() {
  expect(9);

  Router.map(function() {
    this.resource("the_post", { path: "/posts/:post_id" }, function() {
      this.resource("comments");
    });
  });

  var post1 = {};
  var post2 = {};
  var post3 = {};
  var currentPost;

  var posts = {
    1: post1,
    2: post2,
    3: post3
  };

  App.ThePostRoute = Ngular.Route.extend({
    model(params) {
      return posts[params.post_id];
    }
  });

  App.CommentsRoute = Ngular.Route.extend({
    model() {
      // Allow both underscore / camelCase format.
      equal(this.modelFor('thePost'), currentPost);
      equal(this.modelFor('the_post'), currentPost);
    }
  });

  bootApplication();

  currentPost = post1;
  handleURL("/posts/1/comments");

  currentPost = post2;
  handleURL("/posts/2/comments");

  currentPost = post3;
  handleURL("/posts/3/comments");
});

QUnit.test("A redirection hook is provided", function() {
  Router.map(function() {
    this.route("choose", { path: "/" });
    this.route("home");
  });

  var chooseFollowed = 0;
  var destination;

  App.ChooseRoute = Ngular.Route.extend({
    redirect() {
      if (destination) {
        this.transitionTo(destination);
      }
    },

    setupController() {
      chooseFollowed++;
    }
  });

  destination = 'home';

  bootApplication();

  equal(chooseFollowed, 0, "The choose route wasn't entered since a transition occurred");
  equal(Ngular.$("h3:contains(Hours)", "#qunit-fixture").length, 1, "The home template was rendered");
  equal(router.container.lookup('controller:application').get('currentPath'), 'home');
});

QUnit.test("Redirecting from the middle of a route aborts the remainder of the routes", function() {
  expect(3);

  Router.map(function() {
    this.route("home");
    this.resource("foo", function() {
      this.resource("bar", function() {
        this.route("baz");
      });
    });
  });

  App.BarRoute = Ngular.Route.extend({
    redirect() {
      this.transitionTo("home");
    },
    setupController() {
      ok(false, "Should transition before setupController");
    }
  });

  App.BarBazRoute = Ngular.Route.extend({
    enter() {
      ok(false, "Should abort transition getting to next route");
    }
  });

  bootApplication();

  handleURLAborts("/foo/bar/baz");

  equal(router.container.lookup('controller:application').get('currentPath'), 'home');
  equal(router.get('location').getURL(), "/home");
});

QUnit.test("Redirecting to the current target in the middle of a route does not abort initial routing", function() {
  expect(5);

  Router.map(function() {
    this.route("home");
    this.resource("foo", function() {
      this.resource("bar", function() {
        this.route("baz");
      });
    });
  });

  var successCount = 0;
  App.BarRoute = Ngular.Route.extend({
    redirect() {
      this.transitionTo("bar.baz").then(function() {
        successCount++;
      });
    },

    setupController() {
      ok(true, "Should still invoke bar's setupController");
    }
  });

  App.BarBazRoute = Ngular.Route.extend({
    setupController() {
      ok(true, "Should still invoke bar.baz's setupController");
    }
  });

  bootApplication();

  handleURL("/foo/bar/baz");

  equal(router.container.lookup('controller:application').get('currentPath'), 'foo.bar.baz');
  equal(successCount, 1, 'transitionTo success handler was called once');

});

QUnit.test("Redirecting to the current target with a different context aborts the remainder of the routes", function() {
  expect(4);

  Router.map(function() {
    this.route("home");
    this.resource("foo", function() {
      this.resource("bar", { path: "bar/:id" }, function() {
        this.route("baz");
      });
    });
  });

  var model = { id: 2 };

  var count = 0;

  App.BarRoute = Ngular.Route.extend({
    afterModel(context) {
      if (count++ > 10) {
        ok(false, 'infinite loop');
      } else {
        this.transitionTo("bar.baz", model);
      }
    },

    serialize(params) {
      return params;
    }
  });

  App.BarBazRoute = Ngular.Route.extend({
    setupController() {
      ok(true, "Should still invoke setupController");
    }
  });

  bootApplication();

  handleURLAborts("/foo/bar/1/baz");

  equal(router.container.lookup('controller:application').get('currentPath'), 'foo.bar.baz');
  equal(router.get('location').getURL(), "/foo/bar/2/baz");
});

QUnit.test("Transitioning from a parent event does not prevent currentPath from being set", function() {
  Router.map(function() {
    this.resource("foo", function() {
      this.resource("bar", function() {
        this.route("baz");
      });
      this.route("qux");
    });
  });

  App.FooRoute = Ngular.Route.extend({
    actions: {
      goToQux() {
        this.transitionTo('foo.qux');
      }
    }
  });

  bootApplication();

  var applicationController = router.container.lookup('controller:application');

  handleURL("/foo/bar/baz");

  equal(applicationController.get('currentPath'), 'foo.bar.baz');

  Ngular.run(function() {
    router.send("goToQux");
  });

  equal(applicationController.get('currentPath'), 'foo.qux');
  equal(router.get('location').getURL(), "/foo/qux");
});

QUnit.test("Generated names can be customized when providing routes with dot notation", function() {
  expect(4);

  Ngular.TEMPLATES.index = compile("<div>Index</div>");
  Ngular.TEMPLATES.application = compile("<h1>Home</h1><div class='main'>{{outlet}}</div>");
  Ngular.TEMPLATES.foo = compile("<div class='middle'>{{outlet}}</div>");
  Ngular.TEMPLATES.bar = compile("<div class='bottom'>{{outlet}}</div>");
  Ngular.TEMPLATES['bar/baz'] = compile("<p>{{name}}Bottom!</p>");

  Router.map(function() {
    this.resource("foo", { path: "/top" }, function() {
      this.resource("bar", { path: "/middle" }, function() {
        this.route("baz", { path: "/bottom" });
      });
    });
  });

  App.FooRoute = Ngular.Route.extend({
    renderTemplate() {
      ok(true, "FooBarRoute was called");
      return this._super.apply(this, arguments);
    }
  });

  App.BarBazRoute = Ngular.Route.extend({
    renderTemplate() {
      ok(true, "BarBazRoute was called");
      return this._super.apply(this, arguments);
    }
  });

  App.BarController = Ngular.Controller.extend({
    name: "Bar"
  });

  App.BarBazController = Ngular.Controller.extend({
    name: "BarBaz"
  });

  bootApplication();

  handleURL("/top/middle/bottom");

  equal(Ngular.$('.main .middle .bottom p', '#qunit-fixture').text(), "BarBazBottom!", "The templates were rendered into their appropriate parents");
});

QUnit.test("Child routes render into their parent route's template by default", function() {
  Ngular.TEMPLATES.index = compile("<div>Index</div>");
  Ngular.TEMPLATES.application = compile("<h1>Home</h1><div class='main'>{{outlet}}</div>");
  Ngular.TEMPLATES.top = compile("<div class='middle'>{{outlet}}</div>");
  Ngular.TEMPLATES.middle = compile("<div class='bottom'>{{outlet}}</div>");
  Ngular.TEMPLATES['middle/bottom'] = compile("<p>Bottom!</p>");

  Router.map(function() {
    this.resource("top", function() {
      this.resource("middle", function() {
        this.route("bottom");
      });
    });
  });

  bootApplication();

  handleURL("/top/middle/bottom");

  equal(Ngular.$('.main .middle .bottom p', '#qunit-fixture').text(), "Bottom!", "The templates were rendered into their appropriate parents");
});

QUnit.test("Child routes render into specified template", function() {
  Ngular.TEMPLATES.index = compile("<div>Index</div>");
  Ngular.TEMPLATES.application = compile("<h1>Home</h1><div class='main'>{{outlet}}</div>");
  Ngular.TEMPLATES.top = compile("<div class='middle'>{{outlet}}</div>");
  Ngular.TEMPLATES.middle = compile("<div class='bottom'>{{outlet}}</div>");
  Ngular.TEMPLATES['middle/bottom'] = compile("<p>Bottom!</p>");

  Router.map(function() {
    this.resource("top", function() {
      this.resource("middle", function() {
        this.route("bottom");
      });
    });
  });

  App.MiddleBottomRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render('middle/bottom', { into: 'top' });
    }
  });

  bootApplication();

  handleURL("/top/middle/bottom");

  equal(Ngular.$('.main .middle .bottom p', '#qunit-fixture').length, 0, "should not render into the middle template");
  equal(Ngular.$('.main .middle > p', '#qunit-fixture').text(), "Bottom!", "The template was rendered into the top template");
});

QUnit.test("Rendering into specified template with slash notation", function() {
  Ngular.TEMPLATES['person/profile'] = compile("profile {{outlet}}");
  Ngular.TEMPLATES['person/details'] = compile("details!");

  Router.map(function() {
    this.resource("home", { path: '/' });
  });

  App.HomeRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render('person/profile');
      this.render('person/details', { into: 'person/profile' });
    }
  });

  bootApplication();

  equal(Ngular.$('#qunit-fixture:contains(profile details!)').length, 1, "The templates were rendered");
});

QUnit.test("Parent route context change", function() {
  var editCount = 0;
  var editedPostIds = Ngular.A();

  Ngular.TEMPLATES.application = compile("{{outlet}}");
  Ngular.TEMPLATES.posts = compile("{{outlet}}");
  Ngular.TEMPLATES.post = compile("{{outlet}}");
  Ngular.TEMPLATES['post/index'] = compile("showing");
  Ngular.TEMPLATES['post/edit'] = compile("editing");

  Router.map(function() {
    this.resource("posts", function() {
      this.resource("post", { path: "/:postId" }, function() {
        this.route("edit");
      });
    });
  });

  App.PostsRoute = Ngular.Route.extend({
    actions: {
      showPost(context) {
        this.transitionTo('post', context);
      }
    }
  });

  App.PostRoute = Ngular.Route.extend({
    model(params) {
      return { id: params.postId };
    },

    actions: {
      editPost(context) {
        this.transitionTo('post.edit');
      }
    }
  });

  App.PostEditRoute = Ngular.Route.extend({
    model(params) {
      var postId = this.modelFor("post").id;
      editedPostIds.push(postId);
      return null;
    },
    setup() {
      this._super.apply(this, arguments);
      editCount++;
    }
  });

  bootApplication();

  handleURL("/posts/1");

  Ngular.run(function() {
    router.send('editPost');
  });

  Ngular.run(function() {
    router.send('showPost', { id: '2' });
  });

  Ngular.run(function() {
    router.send('editPost');
  });

  equal(editCount, 2, 'set up the edit route twice without failure');
  deepEqual(editedPostIds, ['1', '2'], 'modelFor posts.post returns the right context');
});

QUnit.test("Router accounts for rootURL on page load when using history location", function() {
  var rootURL = window.location.pathname + '/app';
  var postsTemplateRendered = false;
  var setHistory, HistoryTestLocation;

  setHistory = function(obj, path) {
    obj.set('history', { state: { path: path } });
  };

  // Create new implementation that extends HistoryLocation
  // and set current location to rootURL + '/posts'
  HistoryTestLocation = Ngular.HistoryLocation.extend({
    initState() {
      var path = rootURL + '/posts';

      setHistory(this, path);
      this.set('location', {
        pathname: path,
        href: 'http://localhost/' + path
      });
    },

    replaceState(path) {
      setHistory(this, path);
    },

    pushState(path) {
      setHistory(this, path);
    }
  });


  registry.register('location:historyTest', HistoryTestLocation);

  Router.reopen({
    location: 'historyTest',
    rootURL: rootURL
  });

  Router.map(function() {
    this.resource("posts", { path: '/posts' });
  });

  App.PostsRoute = Ngular.Route.extend({
    model() {},
    renderTemplate() {
      postsTemplateRendered = true;
    }
  });

  bootApplication();

  ok(postsTemplateRendered, "Posts route successfully stripped from rootURL");
});

QUnit.test("The rootURL is passed properly to the location implementation", function() {
  expect(1);
  var rootURL = "/blahzorz";
  var HistoryTestLocation;

  HistoryTestLocation = Ngular.HistoryLocation.extend({
    rootURL: 'this is not the URL you are looking for',
    initState() {
      equal(this.get('rootURL'), rootURL);
    }
  });

  registry.register('location:history-test', HistoryTestLocation);

  Router.reopen({
    location: 'history-test',
    rootURL: rootURL,
    // if we transition in this test we will receive failures
    // if the tests are run from a static file
    _doURLTransition() { }
  });

  bootApplication();
});


QUnit.test("Only use route rendered into main outlet for default into property on child", function() {
  Ngular.TEMPLATES.application = compile("{{outlet 'menu'}}{{outlet}}");
  Ngular.TEMPLATES.posts = compile("{{outlet}}");
  Ngular.TEMPLATES['posts/index'] = compile("postsIndex");
  Ngular.TEMPLATES['posts/menu'] = compile("postsMenu");

  Router.map(function() {
    this.resource("posts", function() {});
  });

  App.PostsMenuView = Ngular.View.extend({
    tagName: 'div',
    templateName: 'posts/menu',
    classNames: ['posts-menu']
  });

  App.PostsIndexView = Ngular.View.extend({
    tagName: 'p',
    classNames: ['posts-index']
  });

  App.PostsRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render();
      this.render('postsMenu', {
        into: 'application',
        outlet: 'menu'
      });
    }
  });

  bootApplication();

  handleURL("/posts");

  equal(Ngular.$('div.posts-menu:contains(postsMenu)', '#qunit-fixture').length, 1, "The posts/menu template was rendered");
  equal(Ngular.$('p.posts-index:contains(postsIndex)', '#qunit-fixture').length, 1, "The posts/index template was rendered");
});

QUnit.test("Generating a URL should not affect currentModel", function() {
  Router.map(function() {
    this.route("post", { path: "/posts/:post_id" });
  });

  var posts = {
    1: { id: 1 },
    2: { id: 2 }
  };

  App.PostRoute = Ngular.Route.extend({
    model(params) {
      return posts[params.post_id];
    }
  });

  bootApplication();

  handleURL("/posts/1");

  var route = container.lookup('route:post');
  equal(route.modelFor('post'), posts[1]);

  var url = router.generate('post', posts[2]);
  equal(url, "/posts/2");

  equal(route.modelFor('post'), posts[1]);
});


QUnit.test("Generated route should be an instance of App.Route if provided", function() {
  var generatedRoute;

  Router.map(function() {
    this.route('posts');
  });

  App.Route = Ngular.Route.extend();

  bootApplication();

  handleURL("/posts");

  generatedRoute = container.lookup('route:posts');

  ok(generatedRoute instanceof App.Route, 'should extend the correct route');

});

QUnit.test("Nested index route is not overriden by parent's implicit index route", function() {
  Router.map(function() {
    this.resource('posts', function() {
      this.route('index', { path: ':category' });
    });
  });

  App.Route = Ngular.Route.extend({
    serialize(model) {
      return { category: model.category };
    }
  });

  bootApplication();

  Ngular.run(function() {
    router.transitionTo('posts', { category: 'ngularjs' });
  });

  deepEqual(router.location.path, '/posts/ngularjs');
});

QUnit.test("Application template does not duplicate when re-rendered", function() {
  Ngular.TEMPLATES.application = compile("<h3>I Render Once</h3>{{outlet}}");

  Router.map(function() {
    this.route('posts');
  });

  App.ApplicationRoute = Ngular.Route.extend({
    model() {
      return Ngular.A();
    }
  });

  bootApplication();

  // should cause application template to re-render
  handleURL('/posts');

  equal(Ngular.$('h3:contains(I Render Once)').size(), 1);
});

QUnit.test("Child routes should render inside the application template if the application template causes a redirect", function() {
  Ngular.TEMPLATES.application = compile("<h3>App</h3> {{outlet}}");
  Ngular.TEMPLATES.posts = compile("posts");

  Router.map(function() {
    this.route('posts');
    this.route('photos');
  });

  App.ApplicationRoute = Ngular.Route.extend({
    afterModel() {
      this.transitionTo('posts');
    }
  });

  bootApplication();

  equal(Ngular.$('#qunit-fixture > div').text(), "App posts");
});

QUnit.test("The template is not re-rendered when the route's context changes", function() {
  Router.map(function() {
    this.route("page", { path: "/page/:name" });
  });

  App.PageRoute = Ngular.Route.extend({
    model(params) {
      return Ngular.Object.create({ name: params.name });
    }
  });

  var insertionCount = 0;
  App.PageView = Ngular.View.extend({
    didInsertElement() {
      insertionCount += 1;
    }
  });

  Ngular.TEMPLATES.page = compile(
    "<p>{{model.name}}</p>"
  );

  bootApplication();

  handleURL("/page/first");

  equal(Ngular.$('p', '#qunit-fixture').text(), "first");
  equal(insertionCount, 1);

  handleURL("/page/second");

  equal(Ngular.$('p', '#qunit-fixture').text(), "second");
  equal(insertionCount, 1, "view should have inserted only once");

  Ngular.run(function() {
    router.transitionTo('page', Ngular.Object.create({ name: 'third' }));
  });

  equal(Ngular.$('p', '#qunit-fixture').text(), "third");
  equal(insertionCount, 1, "view should still have inserted only once");
});


QUnit.test("The template is not re-rendered when two routes present the exact same template, view, & controller", function() {
  Router.map(function() {
    this.route("first");
    this.route("second");
    this.route("third");
    this.route("fourth");
  });

  App.SharedRoute = Ngular.Route.extend({
    viewName: 'shared',
    setupController(controller) {
      this.controllerFor('shared').set('message', "This is the " + this.routeName + " message");
    },

    renderTemplate(controller, context) {
      this.render({ controller: 'shared' });
    }
  });

  App.FirstRoute  = App.SharedRoute.extend();
  App.SecondRoute = App.SharedRoute.extend();
  App.ThirdRoute  = App.SharedRoute.extend();
  App.FourthRoute = App.SharedRoute.extend({
    viewName: 'fourth'
  });

  App.SharedController = Ngular.Controller.extend();

  var insertionCount = 0;
  App.SharedView = Ngular.View.extend({
    templateName: 'shared',
    didInsertElement() {
      insertionCount += 1;
    }
  });

  // Extending, in essence, creates a different view
  App.FourthView = App.SharedView.extend();

  Ngular.TEMPLATES.shared = compile(
    "<p>{{message}}</p>"
  );

  bootApplication();

  handleURL("/first");

  equal(Ngular.$('p', '#qunit-fixture').text(), "This is the first message");
  equal(insertionCount, 1, 'expected one assertion');

  // Transition by URL
  handleURL("/second");

  equal(Ngular.$('p', '#qunit-fixture').text(), "This is the second message");
  equal(insertionCount, 1, "view should have inserted only once");

  // Then transition directly by route name
  Ngular.run(function() {
    router.transitionTo('third').then(function(value) {
      ok(true, 'expected transition');
    }, function(reason) {
      ok(false, 'unexpected transition failure: ', QUnit.jsDump.parse(reason));
    });
  });

  equal(Ngular.$('p', '#qunit-fixture').text(), "This is the third message");
  equal(insertionCount, 1, "view should still have inserted only once");

  // Lastly transition to a different view, with the same controller and template
  handleURL("/fourth");

  equal(Ngular.$('p', '#qunit-fixture').text(), "This is the fourth message");
  equal(insertionCount, 2, "view should have inserted a second time");
});

QUnit.test("ApplicationRoute with model does not proxy the currentPath", function() {
  var model = {};
  var currentPath;

  App.ApplicationRoute = Ngular.Route.extend({
    model() { return model; }
  });

  App.ApplicationController = Ngular.Controller.extend({
    currentPathDidChange: Ngular.observer('currentPath', function() {
      currentPath = get(this, 'currentPath');
    })
  });

  bootApplication();

  equal(currentPath, 'index', 'currentPath is index');
  equal('currentPath' in model, false, 'should have defined currentPath on controller');
});

QUnit.test("Promises encountered on app load put app into loading state until resolved", function() {

  expect(2);

  var deferred = Ngular.RSVP.defer();

  App.IndexRoute = Ngular.Route.extend({
    model() {
      return deferred.promise;
    }
  });

  Ngular.TEMPLATES.index = compile("<p>INDEX</p>");
  Ngular.TEMPLATES.loading = compile("<p>LOADING</p>");

  bootApplication();

  equal(Ngular.$('p', '#qunit-fixture').text(), "LOADING", "The loading state is displaying.");
  Ngular.run(deferred.resolve);
  equal(Ngular.$('p', '#qunit-fixture').text(), "INDEX", "The index route is display.");
});

QUnit.test("Route should tear down multiple outlets", function() {
  Ngular.TEMPLATES.application = compile("{{outlet 'menu'}}{{outlet}}{{outlet 'footer'}}");
  Ngular.TEMPLATES.posts = compile("{{outlet}}");
  Ngular.TEMPLATES.users = compile("users");
  Ngular.TEMPLATES['posts/index'] = compile("postsIndex");
  Ngular.TEMPLATES['posts/menu'] = compile("postsMenu");
  Ngular.TEMPLATES['posts/footer'] = compile("postsFooter");

  Router.map(function() {
    this.resource("posts", function() {});
    this.resource("users", function() {});
  });

  App.PostsMenuView = Ngular.View.extend({
    tagName: 'div',
    templateName: 'posts/menu',
    classNames: ['posts-menu']
  });

  App.PostsIndexView = Ngular.View.extend({
    tagName: 'p',
    classNames: ['posts-index']
  });

  App.PostsFooterView = Ngular.View.extend({
    tagName: 'div',
    templateName: 'posts/footer',
    classNames: ['posts-footer']
  });

  App.PostsRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render('postsMenu', {
        into: 'application',
        outlet: 'menu'
      });

      this.render();

      this.render('postsFooter', {
        into: 'application',
        outlet: 'footer'
      });
    }
  });

  bootApplication();

  handleURL('/posts');

  equal(Ngular.$('div.posts-menu:contains(postsMenu)', '#qunit-fixture').length, 1, "The posts/menu template was rendered");
  equal(Ngular.$('p.posts-index:contains(postsIndex)', '#qunit-fixture').length, 1, "The posts/index template was rendered");
  equal(Ngular.$('div.posts-footer:contains(postsFooter)', '#qunit-fixture').length, 1, "The posts/footer template was rendered");

  handleURL('/users');

  equal(Ngular.$('div.posts-menu:contains(postsMenu)', '#qunit-fixture').length, 0, "The posts/menu template was removed");
  equal(Ngular.$('p.posts-index:contains(postsIndex)', '#qunit-fixture').length, 0, "The posts/index template was removed");
  equal(Ngular.$('div.posts-footer:contains(postsFooter)', '#qunit-fixture').length, 0, "The posts/footer template was removed");

});


QUnit.test("Route will assert if you try to explicitly render {into: ...} a missing template", function () {
  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render({ into: 'nonexistent' });
    }
  });

  expectAssertion(function() {
    bootApplication();
  }, "You attempted to render into 'nonexistent' but it was not found");
});

QUnit.test("Route supports clearing outlet explicitly", function() {
  Ngular.TEMPLATES.application = compile("{{outlet}}{{outlet 'modal'}}");
  Ngular.TEMPLATES.posts = compile("{{outlet}}");
  Ngular.TEMPLATES.users = compile("users");
  Ngular.TEMPLATES['posts/index'] = compile("postsIndex {{outlet}}");
  Ngular.TEMPLATES['posts/modal'] = compile("postsModal");
  Ngular.TEMPLATES['posts/extra'] = compile("postsExtra");

  Router.map(function() {
    this.resource("posts", function() {});
    this.resource("users", function() {});
  });

  App.PostsIndexView = Ngular.View.extend({
    classNames: ['posts-index']
  });

  App.PostsModalView = Ngular.View.extend({
    templateName: 'posts/modal',
    classNames: ['posts-modal']
  });

  App.PostsExtraView = Ngular.View.extend({
    templateName: 'posts/extra',
    classNames: ['posts-extra']
  });

  App.PostsRoute = Ngular.Route.extend({
    actions: {
      showModal() {
        this.render('postsModal', {
          into: 'application',
          outlet: 'modal'
        });
      },
      hideModal() {
        this.disconnectOutlet({ outlet: 'modal', parentView: 'application' });
      }
    }
  });

  App.PostsIndexRoute = Ngular.Route.extend({
    actions: {
      showExtra() {
        this.render('postsExtra', {
          into: 'posts/index'
        });
      },
      hideExtra() {
        this.disconnectOutlet({ parentView: 'posts/index' });
      }
    }
  });

  bootApplication();

  handleURL('/posts');

  equal(Ngular.$('div.posts-index:contains(postsIndex)', '#qunit-fixture').length, 1, "The posts/index template was rendered");
  Ngular.run(function() {
    router.send('showModal');
  });
  equal(Ngular.$('div.posts-modal:contains(postsModal)', '#qunit-fixture').length, 1, "The posts/modal template was rendered");
  Ngular.run(function() {
    router.send('showExtra');
  });
  equal(Ngular.$('div.posts-extra:contains(postsExtra)', '#qunit-fixture').length, 1, "The posts/extra template was rendered");
  Ngular.run(function() {
    router.send('hideModal');
  });
  equal(Ngular.$('div.posts-modal:contains(postsModal)', '#qunit-fixture').length, 0, "The posts/modal template was removed");
  Ngular.run(function() {
    router.send('hideExtra');
  });
  equal(Ngular.$('div.posts-extra:contains(postsExtra)', '#qunit-fixture').length, 0, "The posts/extra template was removed");

  handleURL('/users');

  equal(Ngular.$('div.posts-index:contains(postsIndex)', '#qunit-fixture').length, 0, "The posts/index template was removed");
  equal(Ngular.$('div.posts-modal:contains(postsModal)', '#qunit-fixture').length, 0, "The posts/modal template was removed");
  equal(Ngular.$('div.posts-extra:contains(postsExtra)', '#qunit-fixture').length, 0, "The posts/extra template was removed");
});

QUnit.test("Route supports clearing outlet using string parameter", function() {
  Ngular.TEMPLATES.application = compile("{{outlet}}{{outlet 'modal'}}");
  Ngular.TEMPLATES.posts = compile("{{outlet}}");
  Ngular.TEMPLATES.users = compile("users");
  Ngular.TEMPLATES['posts/index'] = compile("postsIndex {{outlet}}");
  Ngular.TEMPLATES['posts/modal'] = compile("postsModal");

  Router.map(function() {
    this.resource("posts", function() {});
    this.resource("users", function() {});
  });

  App.PostsIndexView = Ngular.View.extend({
    classNames: ['posts-index']
  });

  App.PostsModalView = Ngular.View.extend({
    templateName: 'posts/modal',
    classNames: ['posts-modal']
  });

  App.PostsRoute = Ngular.Route.extend({
    actions: {
      showModal() {
        this.render('postsModal', {
          into: 'application',
          outlet: 'modal'
        });
      },
      hideModal() {
        this.disconnectOutlet('modal');
      }
    }
  });

  bootApplication();

  handleURL('/posts');

  equal(Ngular.$('div.posts-index:contains(postsIndex)', '#qunit-fixture').length, 1, "The posts/index template was rendered");
  Ngular.run(function() {
    router.send('showModal');
  });
  equal(Ngular.$('div.posts-modal:contains(postsModal)', '#qunit-fixture').length, 1, "The posts/modal template was rendered");
  Ngular.run(function() {
    router.send('hideModal');
  });
  equal(Ngular.$('div.posts-modal:contains(postsModal)', '#qunit-fixture').length, 0, "The posts/modal template was removed");

  handleURL('/users');

  equal(Ngular.$('div.posts-index:contains(postsIndex)', '#qunit-fixture').length, 0, "The posts/index template was removed");
  equal(Ngular.$('div.posts-modal:contains(postsModal)', '#qunit-fixture').length, 0, "The posts/modal template was removed");
});

QUnit.test("Route silently fails when cleaning an outlet from an inactive view", function() {
  expect(1); // handleURL

  Ngular.TEMPLATES.application = compile("{{outlet}}");
  Ngular.TEMPLATES.posts = compile("{{outlet 'modal'}}");
  Ngular.TEMPLATES.modal = compile("A Yo.");

  Router.map(function() {
    this.route("posts");
  });

  App.PostsRoute = Ngular.Route.extend({
    actions: {
      hideSelf() {
        this.disconnectOutlet({ outlet: 'main', parentView: 'application' });
      },
      showModal() {
        this.render('modal', { into: 'posts', outlet: 'modal' });
      },
      hideModal() {
        this.disconnectOutlet({ outlet: 'modal', parentView: 'posts' });
      }
    }
  });

  bootApplication();

  handleURL('/posts');

  Ngular.run(function() { router.send('showModal'); });
  Ngular.run(function() { router.send('hideSelf'); });
  Ngular.run(function() { router.send('hideModal'); });
});

if (Ngular.FEATURES.isEnabled('ngular-router-willtransition')) {
  QUnit.test("Router `willTransition` hook passes in cancellable transition", function() {
    // Should hit willTransition 3 times, once for the initial route, and then 2 more times
    // for the two handleURL calls below
    expect(3);

    Router.map(function() {
      this.route("nork");
      this.route("about");
    });

    Router.reopen({
      init() {
        this._super();
        this.on('willTransition', this.testWillTransitionHook);
      },
      testWillTransitionHook(transition, url) {
        ok(true, "willTransition was called " + url);
        transition.abort();
      }
    });

    App.LoadingRoute = Ngular.Route.extend({
      activate() {
        ok(false, "LoadingRoute was not entered");
      }
    });

    App.NorkRoute = Ngular.Route.extend({
      activate() {
        ok(false, "NorkRoute was not entered");
      }
    });

    App.AboutRoute = Ngular.Route.extend({
      activate() {
        ok(false, "AboutRoute was not entered");
      }
    });

    bootApplication();

    // Attempted transitions out of index should abort.
    Ngular.run(router, 'handleURL', '/nork');
    Ngular.run(router, 'handleURL', '/about');
  });
}

QUnit.test("Aborting/redirecting the transition in `willTransition` prevents LoadingRoute from being entered", function() {
  expect(8);

  Router.map(function() {
    this.route("nork");
    this.route("about");
  });

  var redirect = false;

  App.IndexRoute = Ngular.Route.extend({
    actions: {
      willTransition(transition) {
        ok(true, "willTransition was called");
        if (redirect) {
          // router.js won't refire `willTransition` for this redirect
          this.transitionTo('about');
        } else {
          transition.abort();
        }
      }
    }
  });

  var deferred = null;

  App.LoadingRoute = Ngular.Route.extend({
    activate() {
      ok(deferred, "LoadingRoute should be entered at this time");
    },
    deactivate() {
      ok(true, "LoadingRoute was exited");
    }
  });

  App.NorkRoute = Ngular.Route.extend({
    activate() {
      ok(true, "NorkRoute was entered");
    }
  });

  App.AboutRoute = Ngular.Route.extend({
    activate() {
      ok(true, "AboutRoute was entered");
    },
    model() {
      if (deferred) { return deferred.promise; }
    }
  });

  bootApplication();

  // Attempted transitions out of index should abort.
  Ngular.run(router, 'transitionTo', 'nork');
  Ngular.run(router, 'handleURL', '/nork');

  // Attempted transitions out of index should redirect to about
  redirect = true;
  Ngular.run(router, 'transitionTo', 'nork');
  Ngular.run(router, 'transitionTo', 'index');

  // Redirected transitions out of index to a route with a
  // promise model should pause the transition and
  // activate LoadingRoute
  deferred = Ngular.RSVP.defer();
  Ngular.run(router, 'transitionTo', 'nork');
  Ngular.run(deferred.resolve);
});

QUnit.test("`didTransition` event fires on the router", function() {
  expect(3);

  Router.map(function() {
    this.route("nork");
  });

  router = container.lookup('router:main');

  router.one('didTransition', function() {
    ok(true, 'didTransition fired on initial routing');
  });

  bootApplication();

  router.one('didTransition', function() {
    ok(true, 'didTransition fired on the router');
    equal(router.get('url'), "/nork", 'The url property is updated by the time didTransition fires');
  });

  Ngular.run(router, 'transitionTo', 'nork');
});
QUnit.test("`didTransition` can be reopened", function() {
  expect(1);

  Router.map(function() {
    this.route("nork");
  });

  Router.reopen({
    didTransition() {
      this._super.apply(this, arguments);
      ok(true, 'reopened didTransition was called');
    }
  });

  bootApplication();
});

QUnit.test("`activate` event fires on the route", function() {
  expect(2);

  var eventFired = 0;

  Router.map(function() {
    this.route("nork");
  });

  App.NorkRoute = Ngular.Route.extend({
    init() {
      this._super.apply(this, arguments);

      this.on("activate", function() {
        equal(++eventFired, 1, "activate event is fired once");
      });
    },

    activate() {
      ok(true, "activate hook is called");
    }
  });

  bootApplication();

  Ngular.run(router, 'transitionTo', 'nork');
});

QUnit.test("`deactivate` event fires on the route", function() {
  expect(2);

  var eventFired = 0;

  Router.map(function() {
    this.route("nork");
    this.route("dork");
  });

  App.NorkRoute = Ngular.Route.extend({
    init() {
      this._super.apply(this, arguments);

      this.on("deactivate", function() {
        equal(++eventFired, 1, "deactivate event is fired once");
      });
    },

    deactivate() {
      ok(true, "deactivate hook is called");
    }
  });

  bootApplication();

  Ngular.run(router, 'transitionTo', 'nork');
  Ngular.run(router, 'transitionTo', 'dork');
});

QUnit.test("Actions can be handled by inherited action handlers", function() {

  expect(4);

  App.SuperRoute = Ngular.Route.extend({
    actions: {
      foo() {
        ok(true, 'foo');
      },
      bar(msg) {
        equal(msg, "HELLO");
      }
    }
  });

  App.RouteMixin = Ngular.Mixin.create({
    actions: {
      bar(msg) {
        equal(msg, "HELLO");
        this._super(msg);
      }
    }
  });

  App.IndexRoute = App.SuperRoute.extend(App.RouteMixin, {
    actions: {
      baz() {
        ok(true, 'baz');
      }
    }
  });

  bootApplication();

  router.send("foo");
  router.send("bar", "HELLO");
  router.send("baz");
});

QUnit.test("currentRouteName is a property installed on ApplicationController that can be used in transitionTo", function() {

  expect(24);

  Router.map(function() {
    this.resource("be", function() {
      this.resource("excellent", function() {
        this.resource("to", function() {
          this.resource("each", function() {
            this.route("other");
          });
        });
      });
    });
  });

  bootApplication();

  var appController = router.container.lookup('controller:application');

  function transitionAndCheck(path, expectedPath, expectedRouteName) {
    if (path) { Ngular.run(router, 'transitionTo', path); }
    equal(appController.get('currentPath'), expectedPath);
    equal(appController.get('currentRouteName'), expectedRouteName);
  }

  transitionAndCheck(null, 'index', 'index');
  transitionAndCheck('/be', 'be.index', 'be.index');
  transitionAndCheck('/be/excellent', 'be.excellent.index', 'excellent.index');
  transitionAndCheck('/be/excellent/to', 'be.excellent.to.index', 'to.index');
  transitionAndCheck('/be/excellent/to/each', 'be.excellent.to.each.index', 'each.index');
  transitionAndCheck('/be/excellent/to/each/other', 'be.excellent.to.each.other', 'each.other');

  transitionAndCheck('index', 'index', 'index');
  transitionAndCheck('be', 'be.index', 'be.index');
  transitionAndCheck('excellent', 'be.excellent.index', 'excellent.index');
  transitionAndCheck('to.index', 'be.excellent.to.index', 'to.index');
  transitionAndCheck('each', 'be.excellent.to.each.index', 'each.index');
  transitionAndCheck('each.other', 'be.excellent.to.each.other', 'each.other');
});

QUnit.test("Route model hook finds the same model as a manual find", function() {
  var Post;
  App.Post = Ngular.Object.extend();
  App.Post.reopenClass({
    find() {
      Post = this;
      return {};
    }
  });

  Router.map(function() {
    this.route('post', { path: '/post/:post_id' });
  });

  bootApplication();

  handleURL('/post/1');

  equal(App.Post, Post);
});

QUnit.test("Can register an implementation via Ngular.Location.registerImplementation (DEPRECATED)", function() {
  var TestLocation = Ngular.NoneLocation.extend({
    implementation: 'test'
  });

  expectDeprecation(/Using the Ngular.Location.registerImplementation is no longer supported/);

  Ngular.Location.registerImplementation('test', TestLocation);

  Router.reopen({
    location: 'test'
  });

  bootApplication();

  equal(router.get('location.implementation'), 'test', 'custom location implementation can be registered with registerImplementation');
});

QUnit.test("Ngular.Location.registerImplementation is deprecated", function() {
  var TestLocation = Ngular.NoneLocation.extend({
    implementation: 'test'
  });

  expectDeprecation(function() {
    Ngular.Location.registerImplementation('test', TestLocation);
  }, "Using the Ngular.Location.registerImplementation is no longer supported. Register your custom location implementation with the container instead.");
});

QUnit.test("Routes can refresh themselves causing their model hooks to be re-run", function() {
  Router.map(function() {
    this.resource('parent', { path: '/parent/:parent_id' }, function() {
      this.route('child');
    });
  });

  var appcount = 0;
  App.ApplicationRoute = Ngular.Route.extend({
    model() {
      ++appcount;
    }
  });

  var parentcount = 0;
  App.ParentRoute = Ngular.Route.extend({
    model(params) {
      equal(params.parent_id, '123');
      ++parentcount;
    },
    actions: {
      refreshParent() {
        this.refresh();
      }
    }
  });

  var childcount = 0;
  App.ParentChildRoute = Ngular.Route.extend({
    model() {
      ++childcount;
    }
  });

  bootApplication();

  equal(appcount, 1);
  equal(parentcount, 0);
  equal(childcount, 0);

  Ngular.run(router, 'transitionTo', 'parent.child', '123');

  equal(appcount, 1);
  equal(parentcount, 1);
  equal(childcount, 1);

  Ngular.run(router, 'send', 'refreshParent');

  equal(appcount, 1);
  equal(parentcount, 2);
  equal(childcount, 2);
});

QUnit.test("Specifying non-existent controller name in route#render throws", function() {
  expect(1);

  Router.map(function() {
    this.route("home", { path: "/" });
  });

  App.HomeRoute = Ngular.Route.extend({
    renderTemplate() {
      try {
        this.render('homepage', { controller: 'stefanpenneristhemanforme' });
      } catch(e) {
        equal(e.message, "You passed `controller: 'stefanpenneristhemanforme'` into the `render` method, but no such controller could be found.");
      }
    }
  });

  bootApplication();
});

QUnit.test("Redirecting with null model doesn't error out", function() {
  Router.map(function() {
    this.route("home", { path: '/' });
    this.route("about", { path: '/about/:hurhurhur' });
  });

  App.HomeRoute = Ngular.Route.extend({
    beforeModel() {
      this.transitionTo('about', null);
    }
  });

  App.AboutRoute = Ngular.Route.extend({
    serialize(model) {
      if (model === null) {
        return { hurhurhur: 'TreeklesMcGeekles' };
      }
    }
  });

  bootApplication();

  equal(router.get('location.path'), "/about/TreeklesMcGeekles");
});

QUnit.test("rejecting the model hooks promise with a non-error prints the `message` property", function() {
  var rejectedMessage = 'OMG!! SOOOOOO BAD!!!!';
  var rejectedStack   = 'Yeah, buddy: stack gets printed too.';

  Router.map(function() {
    this.route("yippie", { path: "/" });
  });

  Ngular.Logger.error = function(initialMessage, errorMessage, errorStack) {
    equal(initialMessage, 'Error while processing route: yippie', 'a message with the current route name is printed');
    equal(errorMessage, rejectedMessage, "the rejected reason's message property is logged");
    equal(errorStack, rejectedStack, "the rejected reason's stack property is logged");
  };

  App.YippieRoute = Ngular.Route.extend({
    model() {
      return Ngular.RSVP.reject({ message: rejectedMessage, stack: rejectedStack });
    }
  });

  bootApplication();
});

QUnit.test("rejecting the model hooks promise with an error with `errorThrown` property prints `errorThrown.message` property", function() {
  var rejectedMessage = 'OMG!! SOOOOOO BAD!!!!';
  var rejectedStack   = 'Yeah, buddy: stack gets printed too.';

  Router.map(function() {
    this.route("yippie", { path: "/" });
  });

  Ngular.Logger.error = function(initialMessage, errorMessage, errorStack) {
    equal(initialMessage, 'Error while processing route: yippie', 'a message with the current route name is printed');
    equal(errorMessage, rejectedMessage, "the rejected reason's message property is logged");
    equal(errorStack, rejectedStack, "the rejected reason's stack property is logged");
  };

  App.YippieRoute = Ngular.Route.extend({
    model() {
      return Ngular.RSVP.reject({
        errorThrown: { message: rejectedMessage, stack: rejectedStack }
      });
    }
  });

  bootApplication();
});

QUnit.test("rejecting the model hooks promise with no reason still logs error", function() {
  Router.map(function() {
    this.route("wowzers", { path: "/" });
  });

  Ngular.Logger.error = function(initialMessage) {
    equal(initialMessage, 'Error while processing route: wowzers', 'a message with the current route name is printed');
  };

  App.WowzersRoute = Ngular.Route.extend({
    model() {
      return Ngular.RSVP.reject();
    }
  });

  bootApplication();
});

QUnit.test("rejecting the model hooks promise with a string shows a good error", function() {
  var originalLoggerError = Ngular.Logger.error;
  var rejectedMessage = "Supercalifragilisticexpialidocious";

  Router.map(function() {
    this.route("yondo", { path: "/" });
  });

  Ngular.Logger.error = function(initialMessage, errorMessage) {
    equal(initialMessage, 'Error while processing route: yondo', 'a message with the current route name is printed');
    equal(errorMessage, rejectedMessage, "the rejected reason's message property is logged");
  };

  App.YondoRoute = Ngular.Route.extend({
    model() {
      return Ngular.RSVP.reject(rejectedMessage);
    }
  });

  bootApplication();

  Ngular.Logger.error = originalLoggerError;
});

QUnit.test("willLeave, willChangeContext, willChangeModel actions don't fire unless feature flag enabled", function() {
  expect(1);

  App.Router.map(function() {
    this.route('about');
  });

  function shouldNotFire() {
    ok(false, "this action shouldn't have been received");
  }

  App.IndexRoute = Ngular.Route.extend({
    actions: {
      willChangeModel: shouldNotFire,
      willChangeContext: shouldNotFire,
      willLeave: shouldNotFire
    }
  });

  App.AboutRoute = Ngular.Route.extend({
    setupController() {
      ok(true, "about route was entered");
    }
  });

  bootApplication();
  Ngular.run(router, 'transitionTo', 'about');
});

QUnit.test("Errors in transitionTo within redirect hook are logged", function() {
  expect(3);
  var actual = [];

  Router.map(function() {
    this.route('yondo', { path: "/" });
    this.route('stink-bomb');
  });

  App.YondoRoute = Ngular.Route.extend({
    redirect() {
      this.transitionTo('stink-bomb', { something: 'goes boom' });
    }
  });

  Ngular.Logger.error = function() {
    // push the arguments onto an array so we can detect if the error gets logged twice
    actual.push(arguments);
  };

  bootApplication();

  equal(actual.length, 1, 'the error is only logged once');
  equal(actual[0][0], 'Error while processing route: yondo', 'source route is printed');
  ok(actual[0][1].match(/More context objects were passed than there are dynamic segments for the route: stink-bomb/), 'the error is printed');
});

QUnit.test("Errors in transition show error template if available", function() {
  Ngular.TEMPLATES.error = compile("<div id='error'>Error!</div>");

  Router.map(function() {
    this.route('yondo', { path: "/" });
    this.route('stink-bomb');
  });

  App.YondoRoute = Ngular.Route.extend({
    redirect() {
      this.transitionTo('stink-bomb', { something: 'goes boom' });
    }
  });

  bootApplication();

  equal(Ngular.$('#error').length, 1, "Error template was rendered.");
});

QUnit.test("Route#resetController gets fired when changing models and exiting routes", function() {
  expect(4);

  Router.map(function() {
    this.resource("a", function() {
      this.resource("b", { path: '/b/:id' }, function() { });
      this.resource("c", { path: '/c/:id' }, function() { });
    });
    this.route('out');
  });

  var calls = [];

  var SpyRoute = Ngular.Route.extend({
    setupController(controller, model, transition) {
      calls.push(['setup', this.routeName]);
    },

    resetController(controller) {
      calls.push(['reset', this.routeName]);
    }
  });

  App.ARoute = SpyRoute.extend();
  App.BRoute = SpyRoute.extend();
  App.CRoute = SpyRoute.extend();
  App.OutRoute = SpyRoute.extend();

  bootApplication();
  deepEqual(calls, []);

  Ngular.run(router, 'transitionTo', 'b', 'b-1');
  deepEqual(calls, [['setup', 'a'], ['setup', 'b']]);
  calls.length = 0;

  Ngular.run(router, 'transitionTo', 'c', 'c-1');
  deepEqual(calls, [['reset', 'b'], ['setup', 'c']]);
  calls.length = 0;

  Ngular.run(router, 'transitionTo', 'out');
  deepEqual(calls, [['reset', 'c'], ['reset', 'a'], ['setup', 'out']]);
});

QUnit.test("Exception during initialization of non-initial route is not swallowed", function() {
  Router.map(function() {
    this.route('boom');
  });
  App.BoomRoute = Ngular.Route.extend({
    init() {
      throw new Error("boom!");
    }
  });
  bootApplication();
  throws(function() {
    Ngular.run(router, 'transitionTo', 'boom');
  }, /\bboom\b/);
});


QUnit.test("Exception during load of non-initial route is not swallowed", function() {
  Router.map(function() {
    this.route('boom');
  });
  var lookup = container.lookup;
  container.lookup = function() {
    if (arguments[0] === 'route:boom') {
      throw new Error("boom!");
    }
    return lookup.apply(this, arguments);
  };
  App.BoomRoute = Ngular.Route.extend({
    init() {
      throw new Error("boom!");
    }
  });
  bootApplication();
  throws(function() {
    Ngular.run(router, 'transitionTo', 'boom');
  });
});

QUnit.test("Exception during initialization of initial route is not swallowed", function() {
  Router.map(function() {
    this.route('boom', { path: '/' });
  });
  App.BoomRoute = Ngular.Route.extend({
    init() {
      throw new Error("boom!");
    }
  });
  throws(function() {
    bootApplication();
  }, /\bboom\b/);
});

QUnit.test("Exception during load of initial route is not swallowed", function() {
  Router.map(function() {
    this.route('boom', { path: '/' });
  });
  var lookup = container.lookup;
  container.lookup = function() {
    if (arguments[0] === 'route:boom') {
      throw new Error("boom!");
    }
    return lookup.apply(this, arguments);
  };
  App.BoomRoute = Ngular.Route.extend({
    init() {
      throw new Error("boom!");
    }
  });
  throws(function() {
    bootApplication();
  }, /\bboom\b/);
});

QUnit.test("{{outlet}} works when created after initial render", function() {
  Ngular.TEMPLATES.sample = compile("Hi{{#if showTheThing}}{{outlet}}{{/if}}Bye");
  Ngular.TEMPLATES['sample/inner'] = compile("Yay");
  Ngular.TEMPLATES['sample/inner2'] = compile("Boo");
  Router.map(function() {
    this.route('sample', { path: '/' }, function() {
      this.route('inner', { path: '/' });
      this.route('inner2', { path: '/2' });
    });
  });

  bootApplication();

  equal(Ngular.$('#qunit-fixture').text(), "HiBye", "initial render");

  Ngular.run(function() {
    container.lookup('controller:sample').set('showTheThing', true);
  });

  equal(Ngular.$('#qunit-fixture').text(), "HiYayBye", "second render");

  handleURL('/2');

  equal(Ngular.$('#qunit-fixture').text(), "HiBooBye", "third render");
});

QUnit.test("Can rerender application view multiple times when it contains an outlet", function() {
  Ngular.TEMPLATES.application = compile("App{{outlet}}");
  Ngular.TEMPLATES.index = compile("Hello world");

  registry.register('view:application', Ngular.View.extend({
    elementId: 'im-special'
  }));

  bootApplication();

  equal(Ngular.$('#qunit-fixture').text(), "AppHello world", "initial render");

  Ngular.run(function() {
    Ngular.View.views['im-special'].rerender();
  });

  equal(Ngular.$('#qunit-fixture').text(), "AppHello world", "second render");

  Ngular.run(function() {
    Ngular.View.views['im-special'].rerender();
  });

  equal(Ngular.$('#qunit-fixture').text(), "AppHello world", "third render");
});

QUnit.test("Can render into a named outlet at the top level", function() {
  Ngular.TEMPLATES.application = compile("A-{{outlet}}-B-{{outlet \"other\"}}-C");
  Ngular.TEMPLATES.modal = compile("Hello world");
  Ngular.TEMPLATES.index = compile("The index");

  registry.register('route:application', Ngular.Route.extend({
    renderTemplate() {
      this.render();
      this.render('modal', {
        into: 'application',
        outlet: 'other'
      });
    }
  }));

  bootApplication();

  equal(Ngular.$('#qunit-fixture').text(), "A-The index-B-Hello world-C", "initial render");
});

QUnit.test("Can disconnect a named outlet at the top level", function() {
  Ngular.TEMPLATES.application = compile("A-{{outlet}}-B-{{outlet \"other\"}}-C");
  Ngular.TEMPLATES.modal = compile("Hello world");
  Ngular.TEMPLATES.index = compile("The index");

  registry.register('route:application', Ngular.Route.extend({
    renderTemplate() {
      this.render();
      this.render('modal', {
        into: 'application',
        outlet: 'other'
      });
    },
    actions: {
      banish() {
        this.disconnectOutlet({
          parentView: 'application',
          outlet: 'other'
        });
      }
    }
  }));

  bootApplication();

  equal(Ngular.$('#qunit-fixture').text(), "A-The index-B-Hello world-C", "initial render");

  Ngular.run(router, 'send', 'banish');

  equal(Ngular.$('#qunit-fixture').text(), "A-The index-B--C", "second render");
});

QUnit.test("Can render into a named outlet at the top level, with empty main outlet", function() {
  Ngular.TEMPLATES.application = compile("A-{{outlet}}-B-{{outlet \"other\"}}-C");
  Ngular.TEMPLATES.modal = compile("Hello world");

  Router.map(function() {
    this.route('hasNoTemplate', { path: '/' });
  });

  registry.register('route:application', Ngular.Route.extend({
    renderTemplate() {
      this.render();
      this.render('modal', {
        into: 'application',
        outlet: 'other'
      });
    }
  }));

  bootApplication();

  equal(Ngular.$('#qunit-fixture').text(), "A--B-Hello world-C", "initial render");
});


QUnit.test("Can render into a named outlet at the top level, later", function() {
  Ngular.TEMPLATES.application = compile("A-{{outlet}}-B-{{outlet \"other\"}}-C");
  Ngular.TEMPLATES.modal = compile("Hello world");
  Ngular.TEMPLATES.index = compile("The index");

  registry.register('route:application', Ngular.Route.extend({
    actions: {
      launch() {
        this.render('modal', {
          into: 'application',
          outlet: 'other'
        });
      }
    }
  }));

  bootApplication();

  equal(Ngular.$('#qunit-fixture').text(), "A-The index-B--C", "initial render");

  Ngular.run(router, 'send', 'launch');

  //debugger;
  //router._setOutlets();
  equal(Ngular.$('#qunit-fixture').text(), "A-The index-B-Hello world-C", "second render");
});

QUnit.test("Can render routes with no 'main' outlet and their children", function() {
  Ngular.TEMPLATES.application = compile('<div id="application">{{outlet "app"}}</div>');
  Ngular.TEMPLATES.app = compile('<div id="app-common">{{outlet "common"}}</div><div id="app-sub">{{outlet "sub"}}</div>');
  Ngular.TEMPLATES.common = compile('<div id="common"></div>');
  Ngular.TEMPLATES.sub = compile('<div id="sub"></div>');

  Router.map(function() {
    this.route('app', { path: "/app" }, function() {
      this.resource('sub', { path: "/sub" });
    });
  });

  App.AppRoute = Ngular.Route.extend({
    renderTemplate : function() {
      this.render('app', {
        outlet: 'app',
        into: 'application'
      });
      this.render('common', {
        outlet: 'common',
        into: 'app'
      });
    }
  });

  App.SubRoute = Ngular.Route.extend({
    renderTemplate : function() {
      this.render('sub', {
        outlet: 'sub',
        into: 'app'
      });
    }
  });

  bootApplication();
  handleURL('/app');
  equal(Ngular.$('#app-common #common').length, 1, "Finds common while viewing /app");
  handleURL('/app/sub');
  equal(Ngular.$('#app-common #common').length, 1, "Finds common while viewing /app/sub");
  equal(Ngular.$('#app-sub #sub').length, 1, "Finds sub while viewing /app/sub");
});

QUnit.test("Tolerates stacked renders", function() {
  Ngular.TEMPLATES.application = compile('{{outlet}}{{outlet "modal"}}');
  Ngular.TEMPLATES.index = compile('hi');
  Ngular.TEMPLATES.layer = compile('layer');
  App.ApplicationRoute = Ngular.Route.extend({
    actions: {
      openLayer: function() {
        this.render('layer', {
          into: 'application',
          outlet: 'modal'
        });
      },
      close: function() {
        this.disconnectOutlet({
          outlet: 'modal',
          parentView: 'application'
        });
      }
    }
  });
  bootApplication();
  equal(trim(Ngular.$('#qunit-fixture').text()), 'hi');
  Ngular.run(router, 'send', 'openLayer');
  equal(trim(Ngular.$('#qunit-fixture').text()), 'hilayer');
  Ngular.run(router, 'send', 'openLayer');
  equal(trim(Ngular.$('#qunit-fixture').text()), 'hilayer');
  Ngular.run(router, 'send', 'close');
  equal(trim(Ngular.$('#qunit-fixture').text()), 'hi');
});

QUnit.test("Renders child into parent with non-default template name", function() {
  Ngular.TEMPLATES.application = compile('<div class="a">{{outlet}}</div>');
  Ngular.TEMPLATES['exports/root'] = compile('<div class="b">{{outlet}}</div>');
  Ngular.TEMPLATES['exports/index'] = compile('<div class="c"></div>');

  Router.map(function() {
    this.route('root', function() {
    });
  });

  App.RootRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render('exports/root');
    }
  });

  App.RootIndexRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render('exports/index');
    }
  });

  bootApplication();
  handleURL('/root');
  equal(Ngular.$('#qunit-fixture .a .b .c').length, 1);
});

QUnit.test("Allows any route to disconnectOutlet another route's templates", function() {
  Ngular.TEMPLATES.application = compile('{{outlet}}{{outlet "modal"}}');
  Ngular.TEMPLATES.index = compile('hi');
  Ngular.TEMPLATES.layer = compile('layer');
  App.ApplicationRoute = Ngular.Route.extend({
    actions: {
      openLayer: function() {
        this.render('layer', {
          into: 'application',
          outlet: 'modal'
        });
      }
    }
  });
  App.IndexRoute = Ngular.Route.extend({
    actions: {
      close: function() {
        this.disconnectOutlet({
          parentView: 'application',
          outlet: 'modal'
        });
      }
    }
  });
  bootApplication();
  equal(trim(Ngular.$('#qunit-fixture').text()), 'hi');
  Ngular.run(router, 'send', 'openLayer');
  equal(trim(Ngular.$('#qunit-fixture').text()), 'hilayer');
  Ngular.run(router, 'send', 'close');
  equal(trim(Ngular.$('#qunit-fixture').text()), 'hi');
});

QUnit.test("Can render({into:...}) the render helper", function() {
  Ngular.TEMPLATES.application = compile('{{render "foo"}}');
  Ngular.TEMPLATES.foo = compile('<div class="foo">{{outlet}}</div>');
  Ngular.TEMPLATES.index = compile('other');
  Ngular.TEMPLATES.bar = compile('bar');

  App.IndexRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render({ into: 'foo' });
    },
    actions: {
      changeToBar: function() {
        this.disconnectOutlet({
          parentView: 'foo',
          outlet: 'main'
        });
        this.render('bar', { into: 'foo' });
      }
    }
  });

  bootApplication();
  equal(Ngular.$('#qunit-fixture .foo').text(), 'other');
  Ngular.run(router, 'send', 'changeToBar');
  equal(Ngular.$('#qunit-fixture .foo').text(), 'bar');
});

QUnit.test("Can disconnect from the render helper", function() {
  Ngular.TEMPLATES.application = compile('{{render "foo"}}');
  Ngular.TEMPLATES.foo = compile('<div class="foo">{{outlet}}</div>');
  Ngular.TEMPLATES.index = compile('other');

  App.IndexRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render({ into: 'foo' });
    },
    actions: {
      disconnect: function() {
        this.disconnectOutlet({
          parentView: 'foo',
          outlet: 'main'
        });
      }
    }
  });

  bootApplication();
  equal(Ngular.$('#qunit-fixture .foo').text(), 'other');
  Ngular.run(router, 'send', 'disconnect');
  equal(Ngular.$('#qunit-fixture .foo').text(), '');
});


QUnit.test("Can render({into:...}) the render helper's children", function() {
  Ngular.TEMPLATES.application = compile('{{render "foo"}}');
  Ngular.TEMPLATES.foo = compile('<div class="foo">{{outlet}}</div>');
  Ngular.TEMPLATES.index = compile('<div class="index">{{outlet}}</div>');
  Ngular.TEMPLATES.other = compile('other');
  Ngular.TEMPLATES.bar = compile('bar');

  App.IndexRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render({ into: 'foo' });
      this.render('other', { into: 'index' });
    },
    actions: {
      changeToBar: function() {
        this.disconnectOutlet({
          parentView: 'index',
          outlet: 'main'
        });
        this.render('bar', { into: 'index' });
      }
    }
  });

  bootApplication();
  equal(Ngular.$('#qunit-fixture .foo .index').text(), 'other');
  Ngular.run(router, 'send', 'changeToBar');
  equal(Ngular.$('#qunit-fixture .foo .index').text(), 'bar');

});

QUnit.test("Can disconnect from the render helper's children", function() {
  Ngular.TEMPLATES.application = compile('{{render "foo"}}');
  Ngular.TEMPLATES.foo = compile('<div class="foo">{{outlet}}</div>');
  Ngular.TEMPLATES.index = compile('<div class="index">{{outlet}}</div>');
  Ngular.TEMPLATES.other = compile('other');

  App.IndexRoute = Ngular.Route.extend({
    renderTemplate() {
      this.render({ into: 'foo' });
      this.render('other', { into: 'index' });
    },
    actions: {
      disconnect: function() {
        this.disconnectOutlet({
          parentView: 'index',
          outlet: 'main'
        });
      }
    }
  });

  bootApplication();
  equal(Ngular.$('#qunit-fixture .foo .index').text(), 'other');
  Ngular.run(router, 'send', 'disconnect');
  equal(Ngular.$('#qunit-fixture .foo .index').text(), '');
});
