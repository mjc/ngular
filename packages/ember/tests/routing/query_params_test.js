import "ngular";
import { computed } from "ngular-metal/computed";
import { canDefineNonEnumerableProperties } from 'ngular-metal/platform/define_property';
import { capitalize } from "ngular-runtime/system/string";

import NgularHandlebars from "ngular-htmlbars/compat";

var compile = NgularHandlebars.compile;

var Router, App, router, registry, container;
var get = Ngular.get;

function withoutMeta(object) {
  if (canDefineNonEnumerableProperties) {
    return object;
  }
  var newObject = Ngular.$.extend(true, {}, object);
  delete newObject['__ngular_meta__'];
  return newObject;
}

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

var startingURL = '';
var expectedReplaceURL, expectedPushURL;

function setAndFlush(obj, prop, value) {
  Ngular.run(obj, 'set', prop, value);
}

var TestLocation = Ngular.NoneLocation.extend({
  initState() {
    this.set('path', startingURL);
  },

  setURL(path) {
    if (expectedReplaceURL) {
      ok(false, "pushState occurred but a replaceState was expected");
    }
    if (expectedPushURL) {
      equal(path, expectedPushURL, "an expected pushState occurred");
      expectedPushURL = null;
    }
    this.set('path', path);
  },

  replaceURL(path) {
    if (expectedPushURL) {
      ok(false, "replaceState occurred but a pushState was expected");
    }
    if (expectedReplaceURL) {
      equal(path, expectedReplaceURL, "an expected replaceState occurred");
      expectedReplaceURL = null;
    }
    this.set('path', path);
  }
});

function sharedSetup() {
  Ngular.run(function() {
    App = Ngular.Application.create({
      name: "App",
      rootElement: '#qunit-fixture'
    });

    App.deferReadiness();

    registry = App.registry;
    container = App.__container__;

    registry.register('location:test', TestLocation);

    startingURL = expectedReplaceURL = expectedPushURL = '';

    App.Router.reopen({
      location: 'test'
    });

    Router = App.Router;

    App.LoadingRoute = Ngular.Route.extend({
    });

    Ngular.TEMPLATES.application = compile("{{outlet}}");
    Ngular.TEMPLATES.home = compile("<h3>Hours</h3>");
  });
}

function sharedTeardown() {
  Ngular.run(function() {
    App.destroy();
    App = null;

    Ngular.TEMPLATES = {};
  });
}

QUnit.module("Routing w/ Query Params", {
  setup() {
    sharedSetup();
  },

  teardown() {
    sharedTeardown();
  }
});

QUnit.test("Single query params can be set on ObjectController [DEPRECATED]", function() {
  expectDeprecation("Ngular.ObjectController is deprecated, please use Ngular.Controller and use `model.propertyName`.");

  Router.map(function() {
    this.route("home", { path: '/' });
  });

  App.HomeController = Ngular.ObjectController.extend({
    queryParams: ['foo'],
    foo: "123"
  });

  bootApplication();

  var controller = container.lookup('controller:home');

  setAndFlush(controller, 'foo', '456');

  equal(router.get('location.path'), "/?foo=456");

  setAndFlush(controller, 'foo', '987');
  equal(router.get('location.path'), "/?foo=987");
});

QUnit.test("Single query params can be set", function() {
  Router.map(function() {
    this.route("home", { path: '/' });
  });

  App.HomeController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: "123"
  });

  bootApplication();

  var controller = container.lookup('controller:home');

  setAndFlush(controller, 'foo', '456');

  equal(router.get('location.path'), "/?foo=456");

  setAndFlush(controller, 'foo', '987');
  equal(router.get('location.path'), "/?foo=987");
});

QUnit.test("Query params can map to different url keys", function() {
  App.IndexController = Ngular.Controller.extend({
    queryParams: [{ foo: 'other_foo', bar: { as: 'other_bar' } }],
    foo: "FOO",
    bar: "BAR"
  });

  bootApplication();
  equal(router.get('location.path'), "");

  var controller = container.lookup('controller:index');
  setAndFlush(controller, 'foo', 'LEX');

  equal(router.get('location.path'), "/?other_foo=LEX");
  setAndFlush(controller, 'foo', 'WOO');
  equal(router.get('location.path'), "/?other_foo=WOO");

  Ngular.run(router, 'transitionTo', '/?other_foo=NAW');
  equal(controller.get('foo'), "NAW");

  setAndFlush(controller, 'bar', 'NERK');
  Ngular.run(router, 'transitionTo', '/?other_bar=NERK&other_foo=NAW');
});


QUnit.test("Routes have overridable serializeQueryParamKey hook", function() {
  App.IndexRoute = Ngular.Route.extend({
    serializeQueryParamKey: Ngular.String.dasherize
  });

  App.IndexController = Ngular.Controller.extend({
    queryParams: 'funTimes',
    funTimes: ""
  });

  bootApplication();
  equal(router.get('location.path'), "");

  var controller = container.lookup('controller:index');
  setAndFlush(controller, 'funTimes', 'woot');

  equal(router.get('location.path'), "/?fun-times=woot");
});

QUnit.test("No replaceURL occurs on startup because default values don't show up in URL", function() {
  expect(0);

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: "123"
  });

  expectedReplaceURL = "/?foo=123";

  bootApplication();
});

QUnit.test("Can override inherited QP behavior by specifying queryParams as a computed property", function() {
  expect(0);
  var SharedMixin = Ngular.Mixin.create({
    queryParams: ['a'],
    a: 0
  });

  App.IndexController = Ngular.Controller.extend(SharedMixin, {
    queryParams: computed(function() {
      return ['c'];
    }),
    c: true
  });

  bootApplication();
  var indexController = container.lookup('controller:index');

  expectedReplaceURL = "not gonna happen";
  Ngular.run(indexController, 'set', 'a', 1);
});

QUnit.test("model hooks receives query params", function() {
  App.IndexController = Ngular.Controller.extend({
    queryParams: ['omg'],
    omg: 'lol'
  });

  App.IndexRoute = Ngular.Route.extend({
    model(params) {
      deepEqual(params, { omg: 'lol' });
    }
  });

  bootApplication();

  equal(router.get('location.path'), "");
});

QUnit.test("controllers won't be eagerly instantiated by internal query params logic", function() {
  expect(10);
  Router.map(function() {
    this.resource('cats', function() {
      this.route('index', { path: '/' });
    });
    this.route("home", { path: '/' });
    this.route("about");
  });

  Ngular.TEMPLATES.home = compile("<h3>{{link-to 'About' 'about' (query-params lol='wat') id='link-to-about'}}</h3>");
  Ngular.TEMPLATES.about = compile("<h3>{{link-to 'Home' 'home'  (query-params foo='naw')}}</h3>");
  Ngular.TEMPLATES['cats/index'] = compile("<h3>{{link-to 'Cats' 'cats'  (query-params name='domino') id='cats-link'}}</h3>");

  var homeShouldBeCreated = false;
  var aboutShouldBeCreated = false;
  var catsIndexShouldBeCreated = false;

  App.HomeRoute = Ngular.Route.extend({
    setup() {
      homeShouldBeCreated = true;
      this._super.apply(this, arguments);
    }
  });

  App.HomeController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: "123",
    init() {
      this._super.apply(this, arguments);
      ok(homeShouldBeCreated, "HomeController should be created at this time");
    }
  });

  App.AboutRoute = Ngular.Route.extend({
    setup() {
      aboutShouldBeCreated = true;
      this._super.apply(this, arguments);
    }
  });

  App.AboutController = Ngular.Controller.extend({
    queryParams: ['lol'],
    lol: "haha",
    init() {
      this._super.apply(this, arguments);
      ok(aboutShouldBeCreated, "AboutController should be created at this time");
    }
  });

  App.CatsIndexRoute = Ngular.Route.extend({
    model() {
      return [];
    },
    setup() {
      catsIndexShouldBeCreated = true;
      this._super.apply(this, arguments);
    },
    setupController(controller, context) {
      controller.set('model', context);
    }
  });

  App.CatsIndexController = Ngular.Controller.extend({
    queryParams: ['breed', 'name'],
    breed: 'Golden',
    name: null,
    init() {
      this._super.apply(this, arguments);
      ok(catsIndexShouldBeCreated, "CatsIndexController should be created at this time");
    }
  });

  bootApplication();

  equal(router.get('location.path'), "", 'url is correct');
  var controller = container.lookup('controller:home');
  setAndFlush(controller, 'foo', '456');
  equal(router.get('location.path'), "/?foo=456", 'url is correct');
  equal(Ngular.$('#link-to-about').attr('href'), "/about?lol=wat", "link to about is correct");

  Ngular.run(router, 'transitionTo', 'about');
  equal(router.get('location.path'), "/about", 'url is correct');

  Ngular.run(router, 'transitionTo', 'cats');

  equal(router.get('location.path'), "/cats", 'url is correct');
  equal(Ngular.$('#cats-link').attr('href'), "/cats?name=domino", "link to cats is correct");
  Ngular.run(Ngular.$('#cats-link'), 'click');
  equal(router.get('location.path'), "/cats?name=domino", 'url is correct');
});

QUnit.test("model hooks receives query params (overridden by incoming url value)", function() {
  App.IndexController = Ngular.Controller.extend({
    queryParams: ['omg'],
    omg: 'lol'
  });

  App.IndexRoute = Ngular.Route.extend({
    model(params) {
      deepEqual(params, { omg: 'yes' });
    }
  });

  startingURL = "/?omg=yes";
  bootApplication();

  equal(router.get('location.path'), "/?omg=yes");
});

QUnit.test("Route#paramsFor fetches query params", function() {
  expect(1);

  Router.map(function() {
    this.route('index', { path: '/:something' });
  });

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: 'fooapp'
  });

  App.IndexRoute = Ngular.Route.extend({
    model(params, transition) {
      deepEqual(this.paramsFor('index'), { something: 'omg', foo: 'fooapp' }, "could retrieve params for index");
    }
  });

  startingURL = "/omg";
  bootApplication();
});

QUnit.test("Route#paramsFor fetches falsy query params", function() {
  expect(1);

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: true
  });

  App.IndexRoute = Ngular.Route.extend({
    model(params, transition) {
      equal(params.foo, false);
    }
  });

  startingURL = "/?foo=false";
  bootApplication();
});

QUnit.test("model hook can query prefix-less application params", function() {
  App.ApplicationController = Ngular.Controller.extend({
    queryParams: ['appomg'],
    appomg: 'applol'
  });

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['omg'],
    omg: 'lol'
  });

  App.ApplicationRoute = Ngular.Route.extend({
    model(params) {
      deepEqual(params, { appomg: 'applol' });
    }
  });

  App.IndexRoute = Ngular.Route.extend({
    model(params) {
      deepEqual(params, { omg: 'lol' });
      deepEqual(this.paramsFor('application'), { appomg: 'applol' });
    }
  });

  bootApplication();

  equal(router.get('location.path'), "");
});

QUnit.test("model hook can query prefix-less application params (overridden by incoming url value)", function() {
  App.ApplicationController = Ngular.Controller.extend({
    queryParams: ['appomg'],
    appomg: 'applol'
  });

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['omg'],
    omg: 'lol'
  });

  App.ApplicationRoute = Ngular.Route.extend({
    model(params) {
      deepEqual(params, { appomg: 'appyes' });
    }
  });

  App.IndexRoute = Ngular.Route.extend({
    model(params) {
      deepEqual(params, { omg: 'yes' });
      deepEqual(this.paramsFor('application'), { appomg: 'appyes' });
    }
  });

  startingURL = "/?appomg=appyes&omg=yes";
  bootApplication();

  equal(router.get('location.path'), "/?appomg=appyes&omg=yes");
});

QUnit.test("can opt into full transition by setting refreshModel in route queryParams", function() {
  expect(6);
  App.ApplicationController = Ngular.Controller.extend({
    queryParams: ['appomg'],
    appomg: 'applol'
  });

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['omg'],
    omg: 'lol'
  });

  var appModelCount = 0;
  App.ApplicationRoute = Ngular.Route.extend({
    model(params) {
      appModelCount++;
    }
  });

  var indexModelCount = 0;
  App.IndexRoute = Ngular.Route.extend({
    queryParams: {
      omg: {
        refreshModel: true
      }
    },
    model(params) {
      indexModelCount++;

      if (indexModelCount === 1) {
        deepEqual(params, { omg: 'lol' });
      } else if (indexModelCount === 2) {
        deepEqual(params, { omg: 'lex' });
      }
    }
  });

  bootApplication();

  equal(appModelCount, 1);
  equal(indexModelCount, 1);

  var indexController = container.lookup('controller:index');
  setAndFlush(indexController, 'omg', 'lex');

  equal(appModelCount, 1);
  equal(indexModelCount, 2);
});

QUnit.test("Use Ngular.get to retrieve query params 'refreshModel' configuration", function() {
  expect(6);
  App.ApplicationController = Ngular.Controller.extend({
    queryParams: ['appomg'],
    appomg: 'applol'
  });

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['omg'],
    omg: 'lol'
  });

  var appModelCount = 0;
  App.ApplicationRoute = Ngular.Route.extend({
    model(params) {
      appModelCount++;
    }
  });

  var indexModelCount = 0;
  App.IndexRoute = Ngular.Route.extend({
    queryParams: Ngular.Object.create({
      unknownProperty(keyName) {
        return { refreshModel: true };
      }
    }),
    model(params) {
      indexModelCount++;

      if (indexModelCount === 1) {
        deepEqual(params, { omg: 'lol' });
      } else if (indexModelCount === 2) {
        deepEqual(params, { omg: 'lex' });
      }
    }
  });

  bootApplication();

  equal(appModelCount, 1);
  equal(indexModelCount, 1);

  var indexController = container.lookup('controller:index');
  setAndFlush(indexController, 'omg', 'lex');

  equal(appModelCount, 1);
  equal(indexModelCount, 2);
});

QUnit.test("can use refreshModel even w URL changes that remove QPs from address bar", function() {
  expect(4);

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['omg'],
    omg: 'lol'
  });

  var indexModelCount = 0;
  App.IndexRoute = Ngular.Route.extend({
    queryParams: {
      omg: {
        refreshModel: true
      }
    },
    model(params) {
      indexModelCount++;

      var data;
      if (indexModelCount === 1) {
        data = 'foo';
      } else if (indexModelCount === 2) {
        data = 'lol';
      }

      deepEqual(params, { omg: data }, "index#model receives right data");
    }
  });

  startingURL = '/?omg=foo';
  bootApplication();
  handleURL('/');

  var indexController = container.lookup('controller:index');
  equal(indexController.get('omg'), 'lol');
});

QUnit.test("warn user that routes query params configuration must be an Object, not an Array", function() {
  expect(1);

  App.ApplicationRoute = Ngular.Route.extend({
    queryParams: [
      { commitBy: { replace: true } }
    ]
  });

  expectAssertion(function() {
    bootApplication();
  }, 'You passed in `[{"commitBy":{"replace":true}}]` as the value for `queryParams` but `queryParams` cannot be an Array');
});

QUnit.test("can opt into a replace query by specifying replace:true in the Router config hash", function() {
  expect(2);
  App.ApplicationController = Ngular.Controller.extend({
    queryParams: ['alex'],
    alex: 'matchneer'
  });

  App.ApplicationRoute = Ngular.Route.extend({
    queryParams: {
      alex: {
        replace: true
      }
    }
  });

  bootApplication();

  equal(router.get('location.path'), "");

  var appController = container.lookup('controller:application');
  expectedReplaceURL = "/?alex=wallace";
  setAndFlush(appController, 'alex', 'wallace');
});

QUnit.test("Route query params config can be configured using property name instead of URL key", function() {
  expect(2);
  App.ApplicationController = Ngular.Controller.extend({
    queryParams: [
      { commitBy: 'commit_by' }
    ]
  });

  App.ApplicationRoute = Ngular.Route.extend({
    queryParams: {
      commitBy: {
        replace: true
      }
    }
  });

  bootApplication();

  equal(router.get('location.path'), "");

  var appController = container.lookup('controller:application');
  expectedReplaceURL = "/?commit_by=igor_seb";
  setAndFlush(appController, 'commitBy', 'igor_seb');
});

QUnit.test("An explicit replace:false on a changed QP always wins and causes a pushState", function() {
  expect(3);
  App.ApplicationController = Ngular.Controller.extend({
    queryParams: ['alex', 'steely'],
    alex: 'matchneer',
    steely: 'dan'
  });

  App.ApplicationRoute = Ngular.Route.extend({
    queryParams: {
      alex: {
        replace: true
      },
      steely: {
        replace: false
      }
    }
  });

  bootApplication();

  var appController = container.lookup('controller:application');
  expectedPushURL = "/?alex=wallace&steely=jan";
  Ngular.run(appController, 'setProperties', { alex: 'wallace', steely: 'jan' });

  expectedPushURL = "/?alex=wallace&steely=fran";
  Ngular.run(appController, 'setProperties', { steely: 'fran' });

  expectedReplaceURL = "/?alex=sriracha&steely=fran";
  Ngular.run(appController, 'setProperties', { alex: 'sriracha' });
});

QUnit.test("can opt into full transition by setting refreshModel in route queryParams when transitioning from child to parent", function() {
  Ngular.TEMPLATES.parent = compile('{{outlet}}');
  Ngular.TEMPLATES['parent/child'] = compile("{{link-to 'Parent' 'parent' (query-params foo='change') id='parent-link'}}");

  App.Router.map(function() {
    this.resource('parent', function() {
      this.route('child');
    });
  });

  var parentModelCount = 0;
  App.ParentRoute = Ngular.Route.extend({
    model() {
      parentModelCount++;
    },
    queryParams: {
      foo: {
        refreshModel: true
      }
    }
  });

  App.ParentController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: 'abc'
  });

  startingURL = '/parent/child?foo=lol';
  bootApplication();

  equal(parentModelCount, 1);

  container.lookup('controller:parent');

  Ngular.run(Ngular.$('#parent-link'), 'click');

  equal(parentModelCount, 2);
});

QUnit.test("Use Ngular.get to retrieve query params 'replace' configuration", function() {
  expect(2);
  App.ApplicationController = Ngular.Controller.extend({
    queryParams: ['alex'],
    alex: 'matchneer'
  });

  App.ApplicationRoute = Ngular.Route.extend({
    queryParams: Ngular.Object.create({
      unknownProperty(keyName) {
        // We are simulating all qps requiring refresh
        return { replace: true };
      }
    })
  });

  bootApplication();

  equal(router.get('location.path'), "");

  var appController = container.lookup('controller:application');
  expectedReplaceURL = "/?alex=wallace";
  setAndFlush(appController, 'alex', 'wallace');
});

QUnit.test("can override incoming QP values in setupController", function() {
  expect(3);

  App.Router.map(function() {
    this.route('about');
  });

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['omg'],
    omg: 'lol'
  });

  App.IndexRoute = Ngular.Route.extend({
    setupController(controller) {
      ok(true, "setupController called");
      controller.set('omg', 'OVERRIDE');
    },
    actions: {
      queryParamsDidChange() {
        ok(false, "queryParamsDidChange shouldn't fire");
      }
    }
  });

  startingURL = "/about";
  bootApplication();
  equal(router.get('location.path'), "/about");
  Ngular.run(router, 'transitionTo', 'index');
  equal(router.get('location.path'), "/?omg=OVERRIDE");
});

QUnit.test("can override incoming QP array values in setupController", function() {
  expect(3);

  App.Router.map(function() {
    this.route('about');
  });

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['omg'],
    omg: ['lol']
  });

  App.IndexRoute = Ngular.Route.extend({
    setupController(controller) {
      ok(true, "setupController called");
      controller.set('omg', ['OVERRIDE']);
    },
    actions: {
      queryParamsDidChange() {
        ok(false, "queryParamsDidChange shouldn't fire");
      }
    }
  });

  startingURL = "/about";
  bootApplication();
  equal(router.get('location.path'), "/about");
  Ngular.run(router, 'transitionTo', 'index');
  equal(router.get('location.path'), "/?omg=" + encodeURIComponent(JSON.stringify(['OVERRIDE'])));
});

QUnit.test("URL transitions that remove QPs still register as QP changes", function() {
  expect(2);

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['omg'],
    omg: 'lol'
  });

  startingURL = "/?omg=borf";
  bootApplication();

  var indexController = container.lookup('controller:index');
  equal(indexController.get('omg'), 'borf');
  Ngular.run(router, 'transitionTo', '/');
  equal(indexController.get('omg'), 'lol');
});

QUnit.test("Subresource naming style is supported", function() {

  Router.map(function() {
    this.resource('abc.def', { path: '/abcdef' }, function() {
      this.route('zoo');
    });
  });

  Ngular.TEMPLATES.application = compile("{{link-to 'A' 'abc.def' (query-params foo='123') id='one'}}{{link-to 'B' 'abc.def.zoo' (query-params foo='123' bar='456') id='two'}}{{outlet}}");

  App.AbcDefController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: 'lol'
  });

  App.AbcDefZooController = Ngular.Controller.extend({
    queryParams: ['bar'],
    bar: 'haha'
  });

  bootApplication();
  equal(router.get('location.path'), "");
  equal(Ngular.$('#one').attr('href'), "/abcdef?foo=123");
  equal(Ngular.$('#two').attr('href'), "/abcdef/zoo?bar=456&foo=123");

  Ngular.run(Ngular.$('#one'), 'click');
  equal(router.get('location.path'), "/abcdef?foo=123");
  Ngular.run(Ngular.$('#two'), 'click');
  equal(router.get('location.path'), "/abcdef/zoo?bar=456&foo=123");
});

QUnit.test("transitionTo supports query params", function() {
  App.IndexController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: 'lol'
  });

  bootApplication();

  equal(router.get('location.path'), "");

  Ngular.run(router, 'transitionTo', { queryParams: { foo: "borf" } });
  equal(router.get('location.path'), "/?foo=borf", "shorthand supported");
  Ngular.run(router, 'transitionTo', { queryParams: { 'index:foo': "blaf" } });
  equal(router.get('location.path'), "/?foo=blaf", "longform supported");
  Ngular.run(router, 'transitionTo', { queryParams: { 'index:foo': false } });
  equal(router.get('location.path'), "/?foo=false", "longform supported (bool)");
  Ngular.run(router, 'transitionTo', { queryParams: { foo: false } });
  equal(router.get('location.path'), "/?foo=false", "shorhand supported (bool)");
});

QUnit.test("transitionTo supports query params (multiple)", function() {
  App.IndexController = Ngular.Controller.extend({
    queryParams: ['foo', 'bar'],
    foo: 'lol',
    bar: 'wat'
  });

  bootApplication();

  equal(router.get('location.path'), "");

  Ngular.run(router, 'transitionTo', { queryParams: { foo: "borf" } });
  equal(router.get('location.path'), "/?foo=borf", "shorthand supported");
  Ngular.run(router, 'transitionTo', { queryParams: { 'index:foo': "blaf" } });
  equal(router.get('location.path'), "/?foo=blaf", "longform supported");
  Ngular.run(router, 'transitionTo', { queryParams: { 'index:foo': false } });
  equal(router.get('location.path'), "/?foo=false", "longform supported (bool)");
  Ngular.run(router, 'transitionTo', { queryParams: { foo: false } });
  equal(router.get('location.path'), "/?foo=false", "shorhand supported (bool)");
});

QUnit.test("setting controller QP to empty string doesn't generate null in URL", function() {
  expect(1);
  App.IndexController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: "123"
  });

  bootApplication();
  var controller = container.lookup('controller:index');

  expectedPushURL = "/?foo=";
  setAndFlush(controller, 'foo', '');
});

QUnit.test("A default boolean value deserializes QPs as booleans rather than strings", function() {
  App.IndexController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: false
  });

  App.IndexRoute = Ngular.Route.extend({
    model(params) {
      equal(params.foo, true, "model hook received foo as boolean true");
    }
  });

  startingURL = "/?foo=true";
  bootApplication();

  var controller = container.lookup('controller:index');
  equal(controller.get('foo'), true);

  handleURL('/?foo=false');
  equal(controller.get('foo'), false);
});

QUnit.test("Query param without value are empty string", function() {
  App.IndexController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: ''
  });

  startingURL = "/?foo=";
  bootApplication();

  var controller = container.lookup('controller:index');
  equal(controller.get('foo'), "");
});

QUnit.test("Array query params can be set", function() {
  Router.map(function() {
    this.route("home", { path: '/' });
  });

  App.HomeController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: []
  });

  bootApplication();

  var controller = container.lookup('controller:home');

  setAndFlush(controller, 'foo', [1,2]);

  equal(router.get('location.path'), "/?foo=%5B1%2C2%5D");

  setAndFlush(controller, 'foo', [3,4]);
  equal(router.get('location.path'), "/?foo=%5B3%2C4%5D");
});

QUnit.test("(de)serialization: arrays", function() {
  App.IndexController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: [1]
  });

  bootApplication();

  equal(router.get('location.path'), "");

  Ngular.run(router, 'transitionTo', { queryParams: { foo: [2,3] } });
  equal(router.get('location.path'), "/?foo=%5B2%2C3%5D", "shorthand supported");
  Ngular.run(router, 'transitionTo', { queryParams: { 'index:foo': [4,5] } });
  equal(router.get('location.path'), "/?foo=%5B4%2C5%5D", "longform supported");
  Ngular.run(router, 'transitionTo', { queryParams: { foo: [] } });
  equal(router.get('location.path'), "/?foo=%5B%5D", "longform supported");
});

QUnit.test("Url with array query param sets controller property to array", function() {
  App.IndexController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: ''
  });

  startingURL = "/?foo[]=1&foo[]=2&foo[]=3";
  bootApplication();

  var controller = container.lookup('controller:index');
  deepEqual(controller.get('foo'), ["1","2","3"]);
});

QUnit.test("Array query params can be pushed/popped", function() {
  Router.map(function() {
    this.route("home", { path: '/' });
  });

  App.HomeController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: Ngular.A([])
  });

  bootApplication();

  equal(router.get('location.path'), "");

  var controller = container.lookup('controller:home');

  Ngular.run(controller.foo, 'pushObject', 1);
  equal(router.get('location.path'), "/?foo=%5B1%5D");
  deepEqual(controller.foo, [1]);
  Ngular.run(controller.foo, 'popObject');
  equal(router.get('location.path'), "/");
  deepEqual(controller.foo, []);
  Ngular.run(controller.foo, 'pushObject', 1);
  equal(router.get('location.path'), "/?foo=%5B1%5D");
  deepEqual(controller.foo, [1]);
  Ngular.run(controller.foo, 'popObject');
  equal(router.get('location.path'), "/");
  deepEqual(controller.foo, []);
  Ngular.run(controller.foo, 'pushObject', 1);
  equal(router.get('location.path'), "/?foo=%5B1%5D");
  deepEqual(controller.foo, [1]);
  Ngular.run(controller.foo, 'pushObject', 2);
  equal(router.get('location.path'), "/?foo=%5B1%2C2%5D");
  deepEqual(controller.foo, [1, 2]);
  Ngular.run(controller.foo, 'popObject');
  equal(router.get('location.path'), "/?foo=%5B1%5D");
  deepEqual(controller.foo, [1]);
  Ngular.run(controller.foo, 'unshiftObject', 'lol');
  equal(router.get('location.path'), "/?foo=%5B%22lol%22%2C1%5D");
  deepEqual(controller.foo, ['lol', 1]);
});

QUnit.test("Overwriting with array with same content shouldn't refire update", function() {
  expect(3);
  var modelCount = 0;

  Router.map(function() {
    this.route("home", { path: '/' });
  });

  App.HomeRoute = Ngular.Route.extend({
    model() {
      modelCount++;
    }
  });

  App.HomeController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: Ngular.A([1])
  });

  bootApplication();

  equal(modelCount, 1);
  var controller = container.lookup('controller:home');
  setAndFlush(controller, 'model', Ngular.A([1]));
  equal(modelCount, 1);
  equal(router.get('location.path'), "");
});

QUnit.test("Defaulting to params hash as the model should not result in that params object being watched", function() {
  expect(1);

  Router.map(function() {
    this.route('other');
  });

  // This causes the params hash, which is returned as a route's
  // model if no other model could be resolved given the provided
  // params (and no custom model hook was defined), to be watched,
  // unless we return a copy of the params hash.
  App.ApplicationController = Ngular.Controller.extend({
    queryParams: ['woot'],
    woot: 'wat'
  });

  App.OtherRoute = Ngular.Route.extend({
    model(p, trans) {
      var m = Ngular.meta(trans.params.application);
      ok(!m.watching.woot, "A meta object isn't constructed for this params POJO");
    }
  });

  bootApplication();

  Ngular.run(router, 'transitionTo', 'other');
});

QUnit.test("A child of a resource route still defaults to parent route's model even if the child route has a query param", function() {
  expect(1);

  App.IndexController = Ngular.Controller.extend({
    queryParams: ['woot']
  });

  App.ApplicationRoute = Ngular.Route.extend({
    model(p, trans) {
      return { woot: true };
    }
  });

  App.IndexRoute = Ngular.Route.extend({
    setupController(controller, model) {
      deepEqual(withoutMeta(model), { woot: true }, "index route inherited model route from parent route");
    }
  });

  bootApplication();
});

QUnit.test("opting into replace does not affect transitions between routes", function() {
  expect(5);
  Ngular.TEMPLATES.application = compile(
    "{{link-to 'Foo' 'foo' id='foo-link'}}" +
    "{{link-to 'Bar' 'bar' id='bar-no-qp-link'}}" +
    "{{link-to 'Bar' 'bar' (query-params raytiley='isanerd') id='bar-link'}}" +
    "{{outlet}}"
  );
  App.Router.map(function() {
    this.route('foo');
    this.route('bar');
  });

  App.BarController = Ngular.Controller.extend({
    queryParams: ['raytiley'],
    raytiley: 'isadork'
  });

  App.BarRoute = Ngular.Route.extend({
    queryParams: {
      raytiley: {
        replace: true
      }
    }
  });

  bootApplication();
  var controller = container.lookup('controller:bar');

  expectedPushURL = '/foo';
  Ngular.run(Ngular.$('#foo-link'), 'click');

  expectedPushURL = '/bar';
  Ngular.run(Ngular.$('#bar-no-qp-link'), 'click');

  expectedReplaceURL = '/bar?raytiley=boo';
  setAndFlush(controller, 'raytiley', 'boo');

  expectedPushURL = '/foo';
  Ngular.run(Ngular.$('#foo-link'), 'click');

  expectedPushURL = '/bar?raytiley=isanerd';
  Ngular.run(Ngular.$('#bar-link'), 'click');
});

QUnit.test("Undefined isn't deserialized into a string", function() {
  expect(3);
  Router.map(function() {
    this.route("example");
  });

  Ngular.TEMPLATES.application = compile("{{link-to 'Example' 'example' id='the-link'}}");

  App.ExampleController = Ngular.Controller.extend({
    queryParams: ['foo']
    // uncommon to not support default value, but should assume undefined.
  });

  App.ExampleRoute = Ngular.Route.extend({
    model(params) {
      deepEqual(params, { foo: undefined });
    }
  });

  bootApplication();

  var $link = Ngular.$('#the-link');
  equal($link.attr('href'), "/example");
  Ngular.run($link, 'click');

  var controller = container.lookup('controller:example');
  equal(get(controller, 'foo'), undefined);
});

QUnit.test("query params have been set by the time setupController is called", function() {
  expect(1);

  App.ApplicationController = Ngular.Controller.extend({
    queryParams: ['foo'],
    foo: "wat"
  });

  App.ApplicationRoute = Ngular.Route.extend({
    setupController(controller) {
      equal(controller.get('foo'), 'YEAH', "controller's foo QP property set before setupController called");
    }
  });

  startingURL = '/?foo=YEAH';
  bootApplication();
});

var testParamlessLinks = function(routeName) {
  QUnit.test("param-less links in an app booted with query params in the URL don't reset the query params: " + routeName, function() {
    expect(1);

    Ngular.TEMPLATES[routeName] = compile("{{link-to 'index' 'index' id='index-link'}}");

    App[capitalize(routeName) + "Controller"] = Ngular.Controller.extend({
      queryParams: ['foo'],
      foo: "wat"
    });

    startingURL = '/?foo=YEAH';
    bootApplication();

    equal(Ngular.$('#index-link').attr('href'), '/?foo=YEAH');
  });
};

testParamlessLinks('application');
testParamlessLinks('index');

QUnit.module("Model Dep Query Params", {
  setup() {
    sharedSetup();

    App.Router.map(function() {
      this.resource('article', { path: '/a/:id' }, function() {
        this.resource('comments');
      });
    });

    var articles = this.articles = Ngular.A([{ id: 'a-1' }, { id: 'a-2' }, { id: 'a-3' }]);

    App.ApplicationController = Ngular.Controller.extend({
      articles: this.articles
    });

    var self = this;
    App.ArticleRoute = Ngular.Route.extend({
      queryParams: {},
      model(params) {
        if (self.expectedModelHookParams) {
          deepEqual(params, self.expectedModelHookParams, "the ArticleRoute model hook received the expected merged dynamic segment + query params hash");
          self.expectedModelHookParams = null;
        }
        return articles.findProperty('id', params.id);
      }
    });

    App.ArticleController = Ngular.Controller.extend({
      queryParams: ['q', 'z'],
      q: 'wat',
      z: 0
    });

    App.CommentsController = Ngular.Controller.extend({
      queryParams: 'page',
      page: 1
    });

    Ngular.TEMPLATES.application = compile("{{#each a in articles}} {{link-to 'Article' 'article' a id=a.id}} {{/each}} {{outlet}}");

    this.boot = function() {
      bootApplication();

      self.$link1 = Ngular.$('#a-1');
      self.$link2 = Ngular.$('#a-2');
      self.$link3 = Ngular.$('#a-3');

      equal(self.$link1.attr('href'), '/a/a-1');
      equal(self.$link2.attr('href'), '/a/a-2');
      equal(self.$link3.attr('href'), '/a/a-3');

      self.controller = container.lookup('controller:article');
    };
  },

  teardown() {
    sharedTeardown();
    ok(!this.expectedModelHookParams, "there should be no pending expectation of expected model hook params");
  }
});

QUnit.test("query params have 'model' stickiness by default", function() {
  this.boot();

  Ngular.run(this.$link1, 'click');
  equal(router.get('location.path'), '/a/a-1');

  setAndFlush(this.controller, 'q', 'lol');

  equal(this.$link1.attr('href'), '/a/a-1?q=lol');
  equal(this.$link2.attr('href'), '/a/a-2');
  equal(this.$link3.attr('href'), '/a/a-3');

  Ngular.run(this.$link2, 'click');

  equal(this.controller.get('q'), 'wat');
  equal(this.controller.get('z'), 0);
  deepEqual(withoutMeta(this.controller.get('model')), { id: 'a-2' });
  equal(this.$link1.attr('href'), '/a/a-1?q=lol');
  equal(this.$link2.attr('href'), '/a/a-2');
  equal(this.$link3.attr('href'), '/a/a-3');
});

QUnit.test("query params have 'model' stickiness by default (url changes)", function() {

  this.boot();

  this.expectedModelHookParams = { id: 'a-1', q: 'lol', z: 0 };
  handleURL('/a/a-1?q=lol');

  deepEqual(withoutMeta(this.controller.get('model')), { id: 'a-1' });
  equal(this.controller.get('q'), 'lol');
  equal(this.controller.get('z'), 0);
  equal(this.$link1.attr('href'), '/a/a-1?q=lol');
  equal(this.$link2.attr('href'), '/a/a-2');
  equal(this.$link3.attr('href'), '/a/a-3');

  this.expectedModelHookParams = { id: 'a-2', q: 'lol', z: 0 };
  handleURL('/a/a-2?q=lol');

  deepEqual(withoutMeta(this.controller.get('model')), { id: 'a-2' }, "controller's model changed to a-2");
  equal(this.controller.get('q'), 'lol');
  equal(this.controller.get('z'), 0);
  equal(this.$link1.attr('href'), '/a/a-1?q=lol');
  equal(this.$link2.attr('href'), '/a/a-2?q=lol'); // fail
  equal(this.$link3.attr('href'), '/a/a-3');

  this.expectedModelHookParams = { id: 'a-3', q: 'lol', z: 123 };
  handleURL('/a/a-3?q=lol&z=123');

  equal(this.controller.get('q'), 'lol');
  equal(this.controller.get('z'), 123);
  equal(this.$link1.attr('href'), '/a/a-1?q=lol');
  equal(this.$link2.attr('href'), '/a/a-2?q=lol');
  equal(this.$link3.attr('href'), '/a/a-3?q=lol&z=123');
});


QUnit.test("query params have 'model' stickiness by default (params-based transitions)", function() {
  Ngular.TEMPLATES.application = compile("{{#each a in articles}} {{link-to 'Article' 'article' a.id id=a.id}} {{/each}}");

  this.boot();

  this.expectedModelHookParams = { id: 'a-1', q: 'wat', z: 0 };
  Ngular.run(router, 'transitionTo', 'article', 'a-1');

  deepEqual(withoutMeta(this.controller.get('model')), { id: 'a-1' });
  equal(this.controller.get('q'), 'wat');
  equal(this.controller.get('z'), 0);
  equal(this.$link1.attr('href'), '/a/a-1');
  equal(this.$link2.attr('href'), '/a/a-2');
  equal(this.$link3.attr('href'), '/a/a-3');

  this.expectedModelHookParams = { id: 'a-2', q: 'lol', z: 0 };
  Ngular.run(router, 'transitionTo', 'article', 'a-2', { queryParams: { q: 'lol' } });

  deepEqual(withoutMeta(this.controller.get('model')), { id: 'a-2' });
  equal(this.controller.get('q'), 'lol');
  equal(this.controller.get('z'), 0);
  equal(this.$link1.attr('href'), '/a/a-1');
  equal(this.$link2.attr('href'), '/a/a-2?q=lol');
  equal(this.$link3.attr('href'), '/a/a-3');

  this.expectedModelHookParams = { id: 'a-3', q: 'hay', z: 0 };
  Ngular.run(router, 'transitionTo', 'article', 'a-3', { queryParams: { q: 'hay' } });

  deepEqual(withoutMeta(this.controller.get('model')), { id: 'a-3' });
  equal(this.controller.get('q'), 'hay');
  equal(this.controller.get('z'), 0);
  equal(this.$link1.attr('href'), '/a/a-1');
  equal(this.$link2.attr('href'), '/a/a-2?q=lol');
  equal(this.$link3.attr('href'), '/a/a-3?q=hay');

  this.expectedModelHookParams = { id: 'a-2', q: 'lol', z: 1 };
  Ngular.run(router, 'transitionTo', 'article', 'a-2', { queryParams: { z: 1 } });

  deepEqual(withoutMeta(this.controller.get('model')), { id: 'a-2' });
  equal(this.controller.get('q'), 'lol');
  equal(this.controller.get('z'), 1);
  equal(this.$link1.attr('href'), '/a/a-1');
  equal(this.$link2.attr('href'), '/a/a-2?q=lol&z=1');
  equal(this.$link3.attr('href'), '/a/a-3?q=hay');
});

QUnit.test("'controller' stickiness shares QP state between models", function() {
  App.ArticleController.reopen({
    queryParams: { q: { scope: 'controller' } }
  });

  this.boot();

  Ngular.run(this.$link1, 'click');
  equal(router.get('location.path'), '/a/a-1');

  setAndFlush(this.controller, 'q', 'lol');

  equal(this.$link1.attr('href'), '/a/a-1?q=lol');
  equal(this.$link2.attr('href'), '/a/a-2?q=lol');
  equal(this.$link3.attr('href'), '/a/a-3?q=lol');

  Ngular.run(this.$link2, 'click');

  equal(this.controller.get('q'), 'lol');
  equal(this.controller.get('z'), 0);
  deepEqual(withoutMeta(this.controller.get('model')), { id: 'a-2' });

  equal(this.$link1.attr('href'), '/a/a-1?q=lol');
  equal(this.$link2.attr('href'), '/a/a-2?q=lol');
  equal(this.$link3.attr('href'), '/a/a-3?q=lol');

  this.expectedModelHookParams = { id: 'a-3', q: 'haha', z: 123 };
  handleURL('/a/a-3?q=haha&z=123');

  deepEqual(withoutMeta(this.controller.get('model')), { id: 'a-3' });
  equal(this.controller.get('q'), 'haha');
  equal(this.controller.get('z'), 123);

  equal(this.$link1.attr('href'), '/a/a-1?q=haha');
  equal(this.$link2.attr('href'), '/a/a-2?q=haha');
  equal(this.$link3.attr('href'), '/a/a-3?q=haha&z=123');

  setAndFlush(this.controller, 'q', 'woot');

  equal(this.$link1.attr('href'), '/a/a-1?q=woot');
  equal(this.$link2.attr('href'), '/a/a-2?q=woot');
  equal(this.$link3.attr('href'), '/a/a-3?q=woot&z=123');
});

QUnit.test("'model' stickiness is scoped to current or first dynamic parent route", function() {
  this.boot();

  Ngular.run(router, 'transitionTo', 'comments', 'a-1');

  var commentsCtrl = container.lookup('controller:comments');
  equal(commentsCtrl.get('page'), 1);
  equal(router.get('location.path'), '/a/a-1/comments');

  setAndFlush(commentsCtrl, 'page', 2);
  equal(router.get('location.path'), '/a/a-1/comments?page=2');

  setAndFlush(commentsCtrl, 'page', 3);
  equal(router.get('location.path'), '/a/a-1/comments?page=3');

  Ngular.run(router, 'transitionTo', 'comments', 'a-2');
  equal(commentsCtrl.get('page'), 1);
  equal(router.get('location.path'), '/a/a-2/comments');

  Ngular.run(router, 'transitionTo', 'comments', 'a-1');
  equal(commentsCtrl.get('page'), 3);
  equal(router.get('location.path'), '/a/a-1/comments?page=3');
});

QUnit.test("can reset query params using the resetController hook", function() {
  App.Router.map(function() {
    this.resource('article', { path: '/a/:id' }, function() {
      this.resource('comments');
    });
    this.route('about');
  });

  App.ArticleRoute.reopen({
    resetController(controller, isExiting) {
      this.controllerFor('comments').set('page', 1);
      if (isExiting) {
        controller.set('q', 'imdone');
      }
    }
  });

  Ngular.TEMPLATES.about = compile("{{link-to 'A' 'comments' 'a-1' id='one'}} {{link-to 'B' 'comments' 'a-2' id='two'}}");

  this.boot();

  Ngular.run(router, 'transitionTo', 'comments', 'a-1');

  var commentsCtrl = container.lookup('controller:comments');
  equal(commentsCtrl.get('page'), 1);
  equal(router.get('location.path'), '/a/a-1/comments');

  setAndFlush(commentsCtrl, 'page', 2);
  equal(router.get('location.path'), '/a/a-1/comments?page=2');

  Ngular.run(router, 'transitionTo', 'comments', 'a-2');
  equal(commentsCtrl.get('page'), 1);
  equal(this.controller.get('q'), 'wat');

  Ngular.run(router, 'transitionTo', 'comments', 'a-1');

  equal(router.get('location.path'), '/a/a-1/comments');
  equal(commentsCtrl.get('page'), 1);

  Ngular.run(router, 'transitionTo', 'about');

  equal(Ngular.$('#one').attr('href'), "/a/a-1/comments?q=imdone");
  equal(Ngular.$('#two').attr('href'), "/a/a-2/comments");
});

QUnit.test("can unit test without bucket cache", function() {
  var controller = container.lookup('controller:article');
  controller._bucketCache = null;

  controller.set('q', "i used to break");
  equal(controller.get('q'), "i used to break");
});

QUnit.module("Query Params - overlapping query param property names", {
  setup() {
    sharedSetup();

    App.Router.map(function() {
      this.resource('parent', function() {
        this.route('child');
      });
    });

    this.boot = function() {
      bootApplication();
      Ngular.run(router, 'transitionTo', 'parent.child');
    };
  },

  teardown() {
    sharedTeardown();
  }
});

QUnit.test("can remap same-named qp props", function() {
  App.ParentController = Ngular.Controller.extend({
    queryParams: { page: 'parentPage' },
    page: 1
  });

  App.ParentChildController = Ngular.Controller.extend({
    queryParams: { page: 'childPage' },
    page: 1
  });

  this.boot();

  equal(router.get('location.path'), '/parent/child');

  var parentController = container.lookup('controller:parent');
  var parentChildController = container.lookup('controller:parent.child');

  setAndFlush(parentController, 'page', 2);
  equal(router.get('location.path'), '/parent/child?parentPage=2');
  setAndFlush(parentController, 'page', 1);
  equal(router.get('location.path'), '/parent/child');

  setAndFlush(parentChildController, 'page', 2);
  equal(router.get('location.path'), '/parent/child?childPage=2');
  setAndFlush(parentChildController, 'page', 1);
  equal(router.get('location.path'), '/parent/child');

  Ngular.run(function() {
    parentController.set('page', 2);
    parentChildController.set('page', 2);
  });

  equal(router.get('location.path'), '/parent/child?childPage=2&parentPage=2');

  Ngular.run(function() {
    parentController.set('page', 1);
    parentChildController.set('page', 1);
  });

  equal(router.get('location.path'), '/parent/child');
});

QUnit.test("query params in the same route hierarchy with the same url key get auto-scoped", function() {
  App.ParentController = Ngular.Controller.extend({
    queryParams: { foo: 'shared' },
    foo: 1
  });

  App.ParentChildController = Ngular.Controller.extend({
    queryParams: { bar: 'shared' },
    bar: 1
  });

  var self = this;
  expectAssertion(function() {
    self.boot();
  }, "You're not allowed to have more than one controller property map to the same query param key, but both `parent:foo` and `parent.child:bar` map to `shared`. You can fix this by mapping one of the controller properties to a different query param key via the `as` config option, e.g. `foo: { as: 'other-foo' }`");
});

QUnit.test("Support shared but overridable mixin pattern", function() {

  var HasPage = Ngular.Mixin.create({
    queryParams: 'page',
    page: 1
  });

  App.ParentController = Ngular.Controller.extend(HasPage, {
    queryParams: { page: 'yespage' }
  });

  App.ParentChildController = Ngular.Controller.extend(HasPage);

  this.boot();

  equal(router.get('location.path'), '/parent/child');

  var parentController = container.lookup('controller:parent');
  var parentChildController = container.lookup('controller:parent.child');

  setAndFlush(parentChildController, 'page', 2);
  equal(router.get('location.path'), '/parent/child?page=2');
  equal(parentController.get('page'), 1);
  equal(parentChildController.get('page'), 2);

  setAndFlush(parentController, 'page', 2);
  equal(router.get('location.path'), '/parent/child?page=2&yespage=2');
  equal(parentController.get('page'), 2);
  equal(parentChildController.get('page'), 2);
});
