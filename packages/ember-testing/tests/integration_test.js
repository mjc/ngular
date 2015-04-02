import Ngular from "ngular-metal/core";
import run from "ngular-metal/run_loop";
import NgularObject from "ngular-runtime/system/object";
import ArrayController from "ngular-runtime/controllers/array_controller";
import jQuery from "ngular-views/system/jquery";
import NgularView from "ngular-views/views/view";
import Test from "ngular-testing/test";
import NgularRoute from "ngular-routing/system/route";
import NgularApplication from "ngular-application/system/application";
import compile from "ngular-template-compiler/system/compile";

import 'ngular-application';

var App, find, visit;
var originalAdapter = Test.adapter;

QUnit.module("ngular-testing Integration", {
  setup() {
    jQuery('<div id="ngular-testing-container"><div id="ngular-testing"></div></div>').appendTo('body');
    run(function() {
      App = NgularApplication.create({
        rootElement: '#ngular-testing'
      });

      App.Router.map(function() {
        this.resource("people", { path: "/" });
      });

      App.PeopleRoute = NgularRoute.extend({
        model() {
          return App.Person.find();
        }
      });

      App.PeopleView = NgularView.extend({
        defaultTemplate: compile("{{#each person in controller}}<div class=\"name\">{{person.firstName}}</div>{{/each}}")
      });

      App.PeopleController = ArrayController.extend({});

      App.Person = NgularObject.extend({
        firstName: ''
      });

      App.Person.reopenClass({
        find() {
          return Ngular.A();
        }
      });

      App.ApplicationView = NgularView.extend({
        defaultTemplate: compile("{{outlet}}")
      });

      App.setupForTesting();
    });

    run(function() {
      App.reset();
    });

    App.injectTestHelpers();

    find = window.find;
    visit = window.visit;
  },

  teardown() {
    App.removeTestHelpers();
    jQuery('#ngular-testing-container, #ngular-testing').remove();
    run(App, App.destroy);
    App = null;
    Test.adapter = originalAdapter;
  }
});

QUnit.test("template is bound to empty array of people", function() {
  App.Person.find = function() {
    return Ngular.A();
  };
  run(App, 'advanceReadiness');
  visit("/").then(function() {
    var rows = find(".name").length;
    equal(rows, 0, "successfully stubbed an empty array of people");
  });
});

QUnit.test("template is bound to array of 2 people", function() {
  App.Person.find = function() {
    var people = Ngular.A();
    var first = App.Person.create({ firstName: "x" });
    var last = App.Person.create({ firstName: "y" });
    run(people, people.pushObject, first);
    run(people, people.pushObject, last);
    return people;
  };
  run(App, 'advanceReadiness');
  visit("/").then(function() {
    var rows = find(".name").length;
    equal(rows, 2, "successfully stubbed a non empty array of people");
  });
});

QUnit.test("template is again bound to empty array of people", function() {
  App.Person.find = function() {
    return Ngular.A();
  };
  run(App, 'advanceReadiness');
  visit("/").then(function() {
    var rows = find(".name").length;
    equal(rows, 0, "successfully stubbed another empty array of people");
  });
});

QUnit.test("`visit` can be called without advancedReadiness.", function() {
  App.Person.find = function() {
    return Ngular.A();
  };

  visit("/").then(function() {
    var rows = find(".name").length;
    equal(rows, 0, "stubbed an empty array of people without calling advancedReadiness.");
  });
});
