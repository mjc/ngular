import "ngular";
import compile from "ngular-template-compiler/system/compile";

var Router, router, App, container;

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

QUnit.module("Router.map", {
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

      container = App.__container__;
    });
  },

  teardown() {
    Ngular.run(function() {
      App.destroy();
      App = null;

      Ngular.TEMPLATES = {};
      //Ngular.Logger.error = originalLoggerError;
    });
  }
});

QUnit.test("Router.map returns an Ngular Router class", function () {
  expect(1);

  var ret = App.Router.map(function() {
    this.route('hello');
  });

  ok(Ngular.Router.detect(ret));
});

QUnit.test("Router.map can be called multiple times", function () {
  expect(4);

  Ngular.TEMPLATES.hello = compile("Hello!");
  Ngular.TEMPLATES.goodbye = compile("Goodbye!");

  App.Router.map(function() {
    this.route('hello');
  });

  App.Router.map(function() {
    this.route('goodbye');
  });

  bootApplication();

  handleURL('/hello');

  equal(Ngular.$('#qunit-fixture').text(), "Hello!", "The hello template was rendered");

  handleURL('/goodbye');

  equal(Ngular.$('#qunit-fixture').text(), "Goodbye!", "The goodbye template was rendered");
});
