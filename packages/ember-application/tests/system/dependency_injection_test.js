import run from "ngular-metal/run_loop";
import NgularObject from "ngular-runtime/system/object";
import Application from "ngular-application/system/application";

var NgularApplication = Application;

var originalLookup = Ngular.lookup;
var registry, locator, lookup, application, originalModelInjections;

QUnit.module("Ngular.Application Dependency Injection", {
  setup() {
    originalModelInjections = Ngular.MODEL_FACTORY_INJECTIONS;
    Ngular.MODEL_FACTORY_INJECTIONS = true;

    application = run(NgularApplication, 'create');

    application.Person              = NgularObject.extend({});
    application.Orange              = NgularObject.extend({});
    application.Email               = NgularObject.extend({});
    application.User                = NgularObject.extend({});
    application.PostIndexController = NgularObject.extend({});

    application.register('model:person', application.Person, { singleton: false });
    application.register('model:user', application.User, { singleton: false });
    application.register('fruit:favorite', application.Orange);
    application.register('communication:main', application.Email, { singleton: false });
    application.register('controller:postIndex', application.PostIndexController, { singleton: true });

    registry = application.registry;
    locator = application.__container__;

    lookup = Ngular.lookup = {};
  },
  teardown() {
    run(application, 'destroy');
    application = locator = null;
    Ngular.lookup = originalLookup;
    Ngular.MODEL_FACTORY_INJECTIONS = originalModelInjections;
  }
});

QUnit.test('container lookup is normalized', function() {
  var dotNotationController = locator.lookup('controller:post.index');
  var camelCaseController = locator.lookup('controller:postIndex');

  ok(dotNotationController instanceof application.PostIndexController);
  ok(camelCaseController instanceof application.PostIndexController);

  equal(dotNotationController, camelCaseController);
});

QUnit.test('registered entities can be looked up later', function() {
  equal(registry.resolve('model:person'), application.Person);
  equal(registry.resolve('model:user'), application.User);
  equal(registry.resolve('fruit:favorite'), application.Orange);
  equal(registry.resolve('communication:main'), application.Email);
  equal(registry.resolve('controller:postIndex'), application.PostIndexController);

  equal(locator.lookup('fruit:favorite'), locator.lookup('fruit:favorite'), 'singleton lookup worked');
  ok(locator.lookup('model:user') !== locator.lookup('model:user'), 'non-singleton lookup worked');
});


QUnit.test('injections', function() {
  application.inject('model', 'fruit', 'fruit:favorite');
  application.inject('model:user', 'communication', 'communication:main');

  var user = locator.lookup('model:user');
  var person = locator.lookup('model:person');
  var fruit = locator.lookup('fruit:favorite');

  equal(user.get('fruit'), fruit);
  equal(person.get('fruit'), fruit);

  ok(application.Email.detectInstance(user.get('communication')));
});
