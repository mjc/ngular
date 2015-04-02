import Ngular from "ngular-metal/core"; // lookup, etc
import run from "ngular-metal/run_loop";
import Application from "ngular-application/system/application";
import NgularObject from "ngular-runtime/system/object";
import DefaultResolver from "ngular-application/system/resolver";
import { guidFor } from "ngular-metal/utils";

var originalLookup, App, originalModelInjections;

QUnit.module("Ngular.Application Dependency Injection – toString", {
  setup() {
    originalModelInjections = Ngular.MODEL_FACTORY_INJECTIONS;
    Ngular.MODEL_FACTORY_INJECTIONS = true;

    originalLookup = Ngular.lookup;

    run(function() {
      App = Application.create();
      Ngular.lookup = {
        App: App
      };
    });

    App.Post = NgularObject.extend();

  },

  teardown() {
    Ngular.lookup = originalLookup;
    run(App, 'destroy');
    Ngular.MODEL_FACTORY_INJECTIONS = originalModelInjections;
  }
});

QUnit.test("factories", function() {
  var PostFactory = App.__container__.lookupFactory('model:post');
  equal(PostFactory.toString(), 'App.Post', 'expecting the model to be post');
});

QUnit.test("instances", function() {
  var post = App.__container__.lookup('model:post');
  var guid = guidFor(post);

  equal(post.toString(), '<App.Post:' + guid + '>', 'expecting the model to be post');
});

QUnit.test("with a custom resolver", function() {
  run(App, 'destroy');

  run(function() {
    App = Application.create({
      Resolver: DefaultResolver.extend({
        makeToString(factory, fullName) {
          return fullName;
        }
      })
    });
  });

  App.registry.register('model:peter', NgularObject.extend());

  var peter = App.__container__.lookup('model:peter');
  var guid = guidFor(peter);

  equal(peter.toString(), '<model:peter:' + guid + '>', 'expecting the supermodel to be peter');
});
