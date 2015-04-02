/*jshint newcap:false*/
import NgularView from 'ngular-views/views/view';
import NgularObject from 'ngular-runtime/system/object';

import { A } from 'ngular-runtime/system/native_array';
import Ngular from 'ngular-metal/core';
import { get } from 'ngular-metal/property_get';
import { set } from 'ngular-metal/property_set';
import run from 'ngular-metal/run_loop';
import compile from "ngular-template-compiler/system/compile";
import NgularError from 'ngular-metal/error';
import helpers from "ngular-htmlbars/helpers";
import registerBoundHelper from "ngular-htmlbars/compat/register-bound-helper";
import makeBoundHelper from "ngular-htmlbars/compat/make-bound-helper";

import { Registry } from "ngular-runtime/system/container";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

function expectDeprecationInHTMLBars() {
  // leave this as an empty function until we are ready to use it
  // to enforce deprecation notice for old Handlebars versions
}


var view, lookup, registry, container;
var originalLookup = Ngular.lookup;

QUnit.module('ngular-htmlbars: {{#unbound}} helper', {
  setup() {
    Ngular.lookup = lookup = { Ngular: Ngular };

    view = NgularView.create({
      template: compile('{{unbound foo}} {{unbound bar}}'),
      context: NgularObject.create({
        foo: 'BORK',
        barBinding: 'foo'
      })
    });

    runAppend(view);
  },

  teardown() {
    runDestroy(view);
    Ngular.lookup = originalLookup;
  }
});

QUnit.test('it should render the current value of a property on the context', function() {
  equal(view.$().text(), 'BORK BORK', 'should render the current value of a property');
});

QUnit.test('it should not re-render if the property changes', function() {
  run(function() {
    view.set('context.foo', 'OOF');
  });
  equal(view.$().text(), 'BORK BORK', 'should not re-render if the property changes');
});

QUnit.test('it should throw the helper missing error if multiple properties are provided', function() {
  throws(function() {
    runAppend(NgularView.create({
      template: compile('{{unbound foo bar}}'),
      context: NgularObject.create({
        foo: 'BORK',
        bar: 'foo'
      })
    }));
  }, NgularError);
});

QUnit.test('should property escape unsafe hrefs', function() {
  /* jshint scripturl:true */

  expect(3);

  runDestroy(view);

  view = NgularView.create({
    template: compile('<ul>{{#each person in view.people}}<a href="{{unbound person.url}}">{{person.name}}</a>{{/each}}</ul>'),
    people: A([{
      name: 'Bob',
      url: 'javascript:bob-is-cool'
    }, {
      name: 'James',
      url: 'vbscript:james-is-cool'
    }, {
      name: 'Richard',
      url: 'javascript:richard-is-cool'
    }])
  });

  runAppend(view);

  var links = view.$('a');
  for (var i = 0, l = links.length; i < l; i++) {
    var link = links[i];
    equal(link.protocol, 'unsafe:', 'properly escaped');
  }
});

QUnit.module("ngular-htmlbars: {{#unbound boundHelper arg1 arg2... argN}} form: render unbound helper invocations", {
  setup() {
    Ngular.lookup = lookup = { Ngular: Ngular };
    expectDeprecationInHTMLBars();

    registerBoundHelper('surround', function(prefix, value, suffix) {
      return prefix + '-' + value + '-' + suffix;
    });

    registerBoundHelper('capitalize', function(value) {
      return value.toUpperCase();
    });

    registerBoundHelper('capitalizeName', function(value) {
      return get(value, 'firstName').toUpperCase();
    }, 'firstName');

    registerBoundHelper('fauxconcat', function(value) {
      return [].slice.call(arguments, 0, -1).join('');
    });

    registerBoundHelper('concatNames', function(value) {
      return get(value, 'firstName') + get(value, 'lastName');
    }, 'firstName', 'lastName');
  },

  teardown() {
    delete helpers['surround'];
    delete helpers['capitalize'];
    delete helpers['capitalizeName'];
    delete helpers['fauxconcat'];
    delete helpers['concatNames'];

    runDestroy(view);
    Ngular.lookup = originalLookup;
  }
});

QUnit.test("should be able to render an unbound helper invocation", function() {
  try {
    registerBoundHelper('repeat', function(value, options) {
      var count = options.hash.count;
      var a = [];
      while (a.length < count) {
        a.push(value);
      }
      return a.join('');
    });

    view = NgularView.create({
      template: compile('{{unbound repeat foo countBinding="bar"}} {{repeat foo countBinding="bar"}} {{unbound repeat foo count=2}} {{repeat foo count=4}}'),
      context: NgularObject.create({
        foo: "X",
        numRepeatsBinding: "bar",
        bar: 5
      })
    });
    runAppend(view);

    equal(view.$().text(), "XXXXX XXXXX XX XXXX", "first render is correct");

    run(function() {
      set(view, 'context.bar', 1);
    });

    equal(view.$().text(), "XXXXX X XX XXXX", "only unbound bound options changed");
  } finally {
    delete helpers['repeat'];
  }
});

QUnit.test("should be able to render an bound helper invocation mixed with static values", function() {
  view = NgularView.create({
      template: compile('{{unbound surround prefix value "bar"}} {{surround prefix value "bar"}} {{unbound surround "bar" value suffix}} {{surround "bar" value suffix}}'),
      context: NgularObject.create({
        prefix: "before",
        value: "core",
        suffix: "after"
      })
    });
  runAppend(view);

  equal(view.$().text(), "before-core-bar before-core-bar bar-core-after bar-core-after", "first render is correct");
  run(function() {
    set(view, 'context.prefix', 'beforeChanged');
    set(view, 'context.value', 'coreChanged');
    set(view, 'context.suffix', 'afterChanged');
  });
  equal(view.$().text(), "before-core-bar beforeChanged-coreChanged-bar bar-core-after bar-coreChanged-afterChanged", "only bound values change");
});

QUnit.test("should be able to render unbound forms of multi-arg helpers", function() {
  view = NgularView.create({
    template: compile("{{fauxconcat foo bar bing}} {{unbound fauxconcat foo bar bing}}"),
    context: NgularObject.create({
      foo: "a",
      bar: "b",
      bing: "c"
    })
  });
  runAppend(view);

  equal(view.$().text(), "abc abc", "first render is correct");

  run(function() {
    set(view, 'context.bar', 'X');
  });

  equal(view.$().text(), "aXc abc", "unbound helpers/properties stayed the same");
});

QUnit.test("should be able to render an unbound helper invocation for helpers with dependent keys", function() {
  view = NgularView.create({
    template: compile("{{capitalizeName person}} {{unbound capitalizeName person}} {{concatNames person}} {{unbound concatNames person}}"),
    context: NgularObject.create({
      person: NgularObject.create({
        firstName: 'shooby',
        lastName:  'taylor'
      })
    })
  });
  runAppend(view);

  equal(view.$().text(), "SHOOBY SHOOBY shoobytaylor shoobytaylor", "first render is correct");

  run(function() {
    set(view, 'context.person.firstName', 'sally');
  });

  equal(view.$().text(), "SALLY SHOOBY sallytaylor shoobytaylor", "only bound values change");
});

QUnit.test("should be able to render an unbound helper invocation in #each helper", function() {
  view = NgularView.create({
    template: compile(
      ["{{#each person in people}}",
        "{{capitalize person.firstName}} {{unbound capitalize person.firstName}}",
        "{{/each}}"].join("")),
    context: {
      people: Ngular.A([
        {
          firstName: 'shooby',
          lastName:  'taylor'
        },
        {
          firstName: 'cindy',
          lastName:  'taylor'
        }
      ])
    }
  });
  runAppend(view);

  equal(view.$().text(), "SHOOBY SHOOBYCINDY CINDY", "unbound rendered correctly");
});

QUnit.test("should be able to render an unbound helper invocation with bound hash options", function() {
  try {
    Ngular.Handlebars.registerBoundHelper('repeat', function(value) {
      return [].slice.call(arguments, 0, -1).join('');
    });


    view = NgularView.create({
      template: compile("{{capitalizeName person}} {{unbound capitalizeName person}} {{concatNames person}} {{unbound concatNames person}}"),
      context: NgularObject.create({
        person: NgularObject.create({
          firstName: 'shooby',
          lastName:  'taylor'
        })
      })
    });
    runAppend(view);

    equal(view.$().text(), "SHOOBY SHOOBY shoobytaylor shoobytaylor", "first render is correct");

    run(function() {
      set(view, 'context.person.firstName', 'sally');
    });

    equal(view.$().text(), "SALLY SHOOBY sallytaylor shoobytaylor", "only bound values change");
  } finally {
    delete Ngular.Handlebars.registerBoundHelper['repeat'];
  }
});

QUnit.test("should be able to render bound form of a helper inside unbound form of same helper", function() {
  view = NgularView.create({
    template: compile(
      ["{{#unbound if foo}}",
        "{{#if bar}}true{{/if}}",
        "{{#unless bar}}false{{/unless}}",
        "{{/unbound}}",
        "{{#unbound unless notfoo}}",
        "{{#if bar}}true{{/if}}",
        "{{#unless bar}}false{{/unless}}",
        "{{/unbound}}"].join("")),
    context: NgularObject.create({
      foo: true,
      notfoo: false,
      bar: true
    })
  });
  runAppend(view);

  equal(view.$().text(), "truetrue", "first render is correct");

  run(function() {
    set(view, 'context.bar', false);
  });

  equal(view.$().text(), "falsefalse", "bound if and unless inside unbound if/unless are updated");
});

QUnit.module("ngular-htmlbars: {{#unbound}} helper -- Container Lookup", {
  setup() {
    Ngular.lookup = lookup = { Ngular: Ngular };
    registry = new Registry();
    container = registry.container();
    registry.optionsForType('helper', { instantiate: false });
  },

  teardown() {
    runDestroy(view);
    runDestroy(container);
    Ngular.lookup = originalLookup;
    registry = container = view = null;
  }
});

QUnit.test("should lookup helpers in the container", function() {
  expectDeprecationInHTMLBars();

  registry.register('helper:up-case', makeBoundHelper(function(value) {
    return value.toUpperCase();
  }));

  view = NgularView.create({
    template: compile("{{unbound up-case displayText}}"),
    container: container,
    context: {
      displayText: 'such awesome'
    }
  });

  runAppend(view);

  equal(view.$().text(), "SUCH AWESOME", "proper values were rendered");

  run(function() {
    set(view, 'context.displayText', 'no changes');
  });

  equal(view.$().text(), "SUCH AWESOME", "only bound values change");
});

QUnit.test("should be able to output a property without binding", function() {
  var context = {
    content: NgularObject.create({
      anUnboundString: "No spans here, son."
    })
  };

  view = NgularView.create({
    context: context,
    template: compile('<div id="first">{{unbound content.anUnboundString}}</div>')
  });

  runAppend(view);

  equal(view.$('#first').html(), "No spans here, son.");
});

QUnit.test("should be able to use unbound helper in #each helper", function() {
  view = NgularView.create({
    items: A(['a', 'b', 'c', 1, 2, 3]),
    template: compile('<ul>{{#each item in view.items}}<li>{{unbound item}}</li>{{/each}}</ul>')
  });

  runAppend(view);

  equal(view.$().text(), 'abc123');
  equal(view.$('li').children().length, 0, 'No markers');
});

QUnit.test("should be able to use unbound helper in #each helper (with objects)", function() {
  view = NgularView.create({
    items: A([{ wham: 'bam' }, { wham: 1 }]),
    template: compile('<ul>{{#each item in view.items}}<li>{{unbound item.wham}}</li>{{/each}}</ul>')
  });

  runAppend(view);

  equal(view.$().text(), 'bam1');
  equal(view.$('li').children().length, 0, 'No markers');
});

QUnit.test('should work properly with attributes', function() {
  expect(4);

  view = NgularView.create({
    template: compile('<ul>{{#each person in view.people}}<li class="{{unbound person.cool}}">{{person.name}}</li>{{/each}}</ul>'),
    people: A([{
      name: 'Bob',
      cool: 'not-cool'
    }, {
      name: 'James',
      cool: 'is-cool'
    }, {
      name: 'Richard',
      cool: 'is-cool'
    }])
  });

  runAppend(view);

  equal(view.$('li.not-cool').length, 1, 'correct number of not cool people');
  equal(view.$('li.is-cool').length, 2, 'correct number of cool people');

  run(function() {
    set(view, 'people.firstObject.cool', 'is-cool');
  });

  equal(view.$('li.not-cool').length, 1, 'correct number of not cool people');
  equal(view.$('li.is-cool').length, 2, 'correct number of cool people');
});
