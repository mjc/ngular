import "ngular";

import NgularHandlebars from "ngular-htmlbars/compat";

var compile = NgularHandlebars.compile;

var App, $fixture;

function setupExample() {
  // setup templates
  Ngular.TEMPLATES.application = compile("{{outlet}}");
  Ngular.TEMPLATES.index = compile("<h1>People</h1><ul>{{#each person in model}}<li>Hello, <b>{{person.fullName}}</b>!</li>{{/each}}</ul>");


  App.Person = Ngular.Object.extend({
    firstName: null,
    lastName: null,

    fullName: Ngular.computed('firstName', 'lastName', function() {
      return this.get('firstName') + " " + this.get('lastName');
    })
  });

  App.IndexRoute = Ngular.Route.extend({
    model() {
      var people = Ngular.A([
        App.Person.create({
          firstName: "Tom",
          lastName: "Dale"
        }),
        App.Person.create({
          firstName: "Yehuda",
          lastName: "Katz"
        })
      ]);
      return people;
    }
  });
}

QUnit.module("Homepage Example", {
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

      App.LoadingRoute = Ngular.Route.extend();
    });

    $fixture = Ngular.$('#qunit-fixture');
    setupExample();
  },

  teardown() {
    Ngular.run(function() {
      App.destroy();
    });

    App = null;

    Ngular.TEMPLATES = {};
  }
});


QUnit.test("The example renders correctly", function() {
  Ngular.run(App, 'advanceReadiness');

  equal($fixture.find('h1:contains(People)').length, 1);
  equal($fixture.find('li').length, 2);
  equal($fixture.find('li:nth-of-type(1)').text(), 'Hello, Tom Dale!');
  equal($fixture.find('li:nth-of-type(2)').text(), 'Hello, Yehuda Katz!');
});
