import "ngular";

import compile from "ngular-template-compiler/system/compile";
import helpers from "ngular-htmlbars/helpers";

var App, registry, container;
var originalHelpers;

function prepare() {
  Ngular.TEMPLATES["components/expand-it"] = compile("<p>hello {{yield}}</p>");
  Ngular.TEMPLATES.application = compile("Hello world {{#expand-it}}world{{/expand-it}}");

  originalHelpers = Ngular.A(Ngular.keys(helpers));
}

function cleanup() {
  Ngular.run(function() {
    if (App) {
      App.destroy();
    }
    App = null;
    Ngular.TEMPLATES = {};

    cleanupHandlebarsHelpers();
  });
}

function cleanupHandlebarsHelpers() {
  var currentHelpers = Ngular.A(Ngular.keys(helpers));

  currentHelpers.forEach(function(name) {
    if (!originalHelpers.contains(name)) {
      delete helpers[name];
    }
  });
}

QUnit.module("Application Lifecycle - Component Registration", {
  setup: prepare,
  teardown: cleanup
});

function boot(callback) {
  Ngular.run(function() {
    App = Ngular.Application.create({
      name: 'App',
      rootElement: '#qunit-fixture'
    });

    App.deferReadiness();

    App.Router = Ngular.Router.extend({
      location: 'none'
    });

    registry = App.registry;
    container = App.__container__;

    if (callback) { callback(); }
  });

  var router = container.lookup('router:main');

  Ngular.run(App, 'advanceReadiness');
  Ngular.run(function() {
    router.handleURL('/');
  });
}

QUnit.test("The helper becomes the body of the component", function() {
  boot();
  equal(Ngular.$('div.ngular-view > div.ngular-view', '#qunit-fixture').text(), "hello world", "The component is composed correctly");
});

QUnit.test("If a component is registered, it is used", function() {
  boot(function() {
    registry.register('component:expand-it', Ngular.Component.extend({
      classNames: 'testing123'
    }));
  });

  equal(Ngular.$('div.testing123', '#qunit-fixture').text(), "hello world", "The component is composed correctly");
});


QUnit.test("Late-registered components can be rendered with custom `template` property (DEPRECATED)", function() {

  Ngular.TEMPLATES.application = compile("<div id='wrapper'>there goes {{my-hero}}</div>");

  expectDeprecation(/Do not specify template on a Component/);

  boot(function() {
    registry.register('component:my-hero', Ngular.Component.extend({
      classNames: 'testing123',
      template() { return "watch him as he GOES"; }
    }));
  });

  equal(Ngular.$('#wrapper').text(), "there goes watch him as he GOES", "The component is composed correctly");
  ok(!helpers['my-hero'], "Component wasn't saved to global helpers hash");
});

QUnit.test("Late-registered components can be rendered with template registered on the container", function() {

  Ngular.TEMPLATES.application = compile("<div id='wrapper'>hello world {{sally-rutherford}}-{{#sally-rutherford}}!!!{{/sally-rutherford}}</div>");

  boot(function() {
    registry.register('template:components/sally-rutherford', compile("funkytowny{{yield}}"));
    registry.register('component:sally-rutherford', Ngular.Component);
  });

  equal(Ngular.$('#wrapper').text(), "hello world funkytowny-funkytowny!!!", "The component is composed correctly");
  ok(!helpers['sally-rutherford'], "Component wasn't saved to global helpers hash");
});

QUnit.test("Late-registered components can be rendered with ONLY the template registered on the container", function() {

  Ngular.TEMPLATES.application = compile("<div id='wrapper'>hello world {{borf-snorlax}}-{{#borf-snorlax}}!!!{{/borf-snorlax}}</div>");

  boot(function() {
    registry.register('template:components/borf-snorlax', compile("goodfreakingTIMES{{yield}}"));
  });

  equal(Ngular.$('#wrapper').text(), "hello world goodfreakingTIMES-goodfreakingTIMES!!!", "The component is composed correctly");
  ok(!helpers['borf-snorlax'], "Component wasn't saved to global helpers hash");
});

QUnit.test("Component-like invocations are treated as bound paths if neither template nor component are registered on the container", function() {

  Ngular.TEMPLATES.application = compile("<div id='wrapper'>{{user-name}} hello {{api-key}} world</div>");

  boot(function() {
    registry.register('controller:application', Ngular.Controller.extend({
      'user-name': 'machty'
    }));
  });

  equal(Ngular.$('#wrapper').text(), "machty hello  world", "The component is composed correctly");
});

QUnit.test("Assigning templateName to a component should setup the template as a layout (DEPRECATED)", function() {
  expect(2);

  Ngular.TEMPLATES.application = compile("<div id='wrapper'>{{#my-component}}{{text}}{{/my-component}}</div>");
  Ngular.TEMPLATES['foo-bar-baz'] = compile("{{text}}-{{yield}}");

  expectDeprecation(/Do not specify templateName on a Component/);

  boot(function() {
    registry.register('controller:application', Ngular.Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', Ngular.Component.extend({
      text: 'inner',
      templateName: 'foo-bar-baz'
    }));
  });

  equal(Ngular.$('#wrapper').text(), "inner-outer", "The component is composed correctly");
});

QUnit.test("Assigning templateName and layoutName should use the templates specified", function() {
  expect(1);

  Ngular.TEMPLATES.application = compile("<div id='wrapper'>{{my-component}}</div>");
  Ngular.TEMPLATES['foo'] = compile("{{text}}");
  Ngular.TEMPLATES['bar'] = compile("{{text}}-{{yield}}");

  boot(function() {
    registry.register('controller:application', Ngular.Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', Ngular.Component.extend({
      text: 'inner',
      layoutName: 'bar',
      templateName: 'foo'
    }));
  });

  equal(Ngular.$('#wrapper').text(), "inner-outer", "The component is composed correctly");
});

QUnit.test('Using name of component that does not exist', function () {
  Ngular.TEMPLATES.application = compile("<div id='wrapper'>{{#no-good}} {{/no-good}}</div>");

  expectAssertion(function () {
    boot();
  }, /A helper named `no-good` could not be found/);
});

QUnit.module("Application Lifecycle - Component Context", {
  setup: prepare,
  teardown: cleanup
});

QUnit.test("Components with a block should have the proper content when a template is provided", function() {
  Ngular.TEMPLATES.application = compile("<div id='wrapper'>{{#my-component}}{{text}}{{/my-component}}</div>");
  Ngular.TEMPLATES['components/my-component'] = compile("{{text}}-{{yield}}");

  boot(function() {
    registry.register('controller:application', Ngular.Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', Ngular.Component.extend({
      text: 'inner'
    }));
  });

  equal(Ngular.$('#wrapper').text(), "inner-outer", "The component is composed correctly");
});

QUnit.test("Components with a block should yield the proper content without a template provided", function() {
  Ngular.TEMPLATES.application = compile("<div id='wrapper'>{{#my-component}}{{text}}{{/my-component}}</div>");

  boot(function() {
    registry.register('controller:application', Ngular.Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', Ngular.Component.extend({
      text: 'inner'
    }));
  });

  equal(Ngular.$('#wrapper').text(), "outer", "The component is composed correctly");
});

QUnit.test("Components without a block should have the proper content when a template is provided", function() {
  Ngular.TEMPLATES.application = compile("<div id='wrapper'>{{my-component}}</div>");
  Ngular.TEMPLATES['components/my-component'] = compile("{{text}}");

  boot(function() {
    registry.register('controller:application', Ngular.Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', Ngular.Component.extend({
      text: 'inner'
    }));
  });

  equal(Ngular.$('#wrapper').text(), "inner", "The component is composed correctly");
});

QUnit.test("Components without a block should have the proper content", function() {
  Ngular.TEMPLATES.application = compile("<div id='wrapper'>{{my-component}}</div>");

  boot(function() {
    registry.register('controller:application', Ngular.Controller.extend({
      'text': 'outer'
    }));

    registry.register('component:my-component', Ngular.Component.extend({
      didInsertElement() {
        this.$().html('Some text inserted by jQuery');
      }
    }));
  });

  equal(Ngular.$('#wrapper').text(), "Some text inserted by jQuery", "The component is composed correctly");
});

QUnit.test("properties of a component  without a template should not collide with internal structures", function() {
  Ngular.TEMPLATES.application = compile("<div id='wrapper'>{{my-component data=foo}}</div>");

  boot(function() {
    registry.register('controller:application', Ngular.Controller.extend({
      'text': 'outer',
      'foo': 'Some text inserted by jQuery'
    }));

    registry.register('component:my-component', Ngular.Component.extend({
      didInsertElement() {
        this.$().html(this.get('data'));
      }
    }));
  });

  equal(Ngular.$('#wrapper').text(), "Some text inserted by jQuery", "The component is composed correctly");
});

QUnit.test("Components trigger actions in the parents context when called from within a block", function() {
  Ngular.TEMPLATES.application = compile("<div id='wrapper'>{{#my-component}}<a href='#' id='fizzbuzz' {{action 'fizzbuzz'}}>Fizzbuzz</a>{{/my-component}}</div>");

  boot(function() {
    registry.register('controller:application', Ngular.Controller.extend({
      actions: {
        fizzbuzz() {
          ok(true, 'action triggered on parent');
        }
      }
    }));

    registry.register('component:my-component', Ngular.Component.extend());
  });

  Ngular.run(function() {
    Ngular.$('#fizzbuzz', "#wrapper").click();
  });
});

QUnit.test("Components trigger actions in the components context when called from within its template", function() {
  Ngular.TEMPLATES.application = compile("<div id='wrapper'>{{#my-component}}{{text}}{{/my-component}}</div>");
  Ngular.TEMPLATES['components/my-component'] = compile("<a href='#' id='fizzbuzz' {{action 'fizzbuzz'}}>Fizzbuzz</a>");

  boot(function() {
    registry.register('controller:application', Ngular.Controller.extend({
      actions: {
        fizzbuzz() {
          ok(false, 'action triggered on the wrong context');
        }
      }
    }));

    registry.register('component:my-component', Ngular.Component.extend({
      actions: {
        fizzbuzz() {
          ok(true, 'action triggered on component');
        }
      }
    }));
  });

  Ngular.$('#fizzbuzz', "#wrapper").click();
});
