/*jshint newcap:false*/
import NgularView from "ngular-views/views/view";
import run from "ngular-metal/run_loop";
import NgularObject from "ngular-runtime/system/object";
import { A } from "ngular-runtime/system/native_array";
import SimpleBoundView from "ngular-views/views/simple_bound_view";

// import {expectAssertion} from "ngular-metal/tests/debug_helpers";

import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";
import {
  dasherize
} from 'ngular-runtime/system/string';

import NgularHandlebars from "ngular-htmlbars/compat";

var compile, helpers, helper;
compile = NgularHandlebars.compile;
helpers = NgularHandlebars.helpers;
helper = NgularHandlebars.helper;

var view;

var originalLookup = Ngular.lookup;

function registerRepeatHelper() {
  expectDeprecationInHTMLBars();

  helper('repeat', function(value, options) {
    var count = options.hash.count || 1;
    var a = [];
    while (a.length < count) {
      a.push(value);
    }
    return a.join('');
  });
}

function expectDeprecationInHTMLBars() {
  // leave this empty function as a place holder to
  // enable a deprecation notice
}

QUnit.module("ngular-htmlbars: makeBoundHelper", {
  setup() {
  },
  teardown() {
    runDestroy(view);
    Ngular.lookup = originalLookup;
  }
});

QUnit.test("primitives should work correctly [DEPRECATED]", function() {
  expectDeprecation('Using the context switching form of {{each}} is deprecated. Please use the block param form (`{{#each bar as |foo|}}`) instead.');
  expectDeprecation('Using the context switching form of `{{with}}` is deprecated. Please use the block param form (`{{#with bar as |foo|}}`) instead.');

  view = NgularView.create({
    prims: Ngular.A(["string", 12]),

    template: compile('{{#each view.prims}}{{#if this}}inside-if{{/if}}{{#with this}}inside-with{{/with}}{{/each}}')
  });

  runAppend(view);

  equal(view.$().text(), 'inside-ifinside-withinside-ifinside-with');
});

QUnit.test("should update bound helpers when properties change", function() {
  expectDeprecationInHTMLBars();

  helper('capitalize', function(value) {
    return value.toUpperCase();
  });

  view = NgularView.create({
    controller: NgularObject.create({ name: "Brogrammer" }),
    template: compile("{{capitalize name}}")
  });

  runAppend(view);

  equal(view.$().text(), 'BROGRAMMER', "helper output is correct");

  run(function() {
    set(view, 'controller.name', 'wes');
  });

  equal(view.$().text(), 'WES', "helper output updated");
});

QUnit.test("should update bound helpers in a subexpression when properties change", function() {
  expectDeprecationInHTMLBars();

  helper('dasherize', function(value) {
    return dasherize(value);
  });

  view = NgularView.create({
    controller: { prop: "isThing" },
    template: compile("<div {{bind-attr data-foo=(dasherize prop)}}>{{prop}}</div>")
  });

  runAppend(view);

  equal(view.$('div[data-foo="is-thing"]').text(), 'isThing', "helper output is correct");

  run(view, 'set', 'controller.prop', 'notThing');

  equal(view.$('div[data-foo="not-thing"]').text(), 'notThing', "helper output is correct");
});

QUnit.test("should allow for computed properties with dependencies", function() {
  expectDeprecationInHTMLBars();

  helper('capitalizeName', function(value) {
    return get(value, 'name').toUpperCase();
  }, 'name');

  view = NgularView.create({
    controller: NgularObject.create({
      person: NgularObject.create({
        name: 'Brogrammer'
      })
    }),
    template: compile("{{capitalizeName person}}")
  });

  runAppend(view);

  equal(view.$().text(), 'BROGRAMMER', "helper output is correct");

  run(function() {
    set(view, 'controller.person.name', 'wes');
  });

  equal(view.$().text(), 'WES', "helper output updated");
});

QUnit.test("bound helpers should support options", function() {
  registerRepeatHelper();

  view = NgularView.create({
    controller: NgularObject.create({ text: 'ab' }),
    template: compile("{{repeat text count=3}}")
  });

  runAppend(view);

  equal(view.$().text(), 'ababab', "helper output is correct");
});

QUnit.test("bound helpers should support keywords", function() {
  expectDeprecationInHTMLBars();

  helper('capitalize', function(value) {
    return value.toUpperCase();
  });

  view = NgularView.create({
    text: 'ab',
    template: compile("{{capitalize view.text}}")
  });

  runAppend(view);

  equal(view.$().text(), 'AB', "helper output is correct");
});

QUnit.test("bound helpers should support global paths [DEPRECATED]", function() {
  expectDeprecationInHTMLBars();

  helper('capitalize', function(value) {
    return value.toUpperCase();
  });

  Ngular.lookup = { Text: 'ab' };

  view = NgularView.create({
    template: compile("{{capitalize Text}}")
  });

  expectDeprecation(function() {
    runAppend(view);
  }, /Global lookup of Text from a Handlebars template is deprecated/);

  equal(view.$().text(), 'AB', "helper output is correct");
});

QUnit.test("bound helper should support this keyword", function() {
  expectDeprecationInHTMLBars();

  helper('capitalize', function(value) {
    return get(value, 'text').toUpperCase();
  });

  view = NgularView.create({
    controller: NgularObject.create({ text: 'ab' }),
    template: compile("{{capitalize this}}")
  });

  runAppend(view);

  equal(view.$().text(), 'AB', "helper output is correct");
});

QUnit.test("bound helpers should support bound options", function() {
  registerRepeatHelper();

  view = NgularView.create({
    controller: NgularObject.create({ text: 'ab', numRepeats: 3 }),
    template: compile('{{repeat text countBinding="numRepeats"}}')
  });

  runAppend(view);

  equal(view.$().text(), 'ababab', "helper output is correct");

  run(function() {
    view.set('controller.numRepeats', 4);
  });

  equal(view.$().text(), 'abababab', "helper correctly re-rendered after bound option was changed");

  run(function() {
    view.set('controller.numRepeats', 2);
    view.set('controller.text', "YES");
  });

  equal(view.$().text(), 'YESYES', "helper correctly re-rendered after both bound option and property changed");
});

QUnit.test("bound helpers should support unquoted values as bound options", function() {
  registerRepeatHelper();

  view = NgularView.create({
    controller: NgularObject.create({ text: 'ab', numRepeats: 3 }),
    template: compile('{{repeat text count=numRepeats}}')
  });

  runAppend(view);

  equal(view.$().text(), 'ababab', "helper output is correct");

  run(function() {
    view.set('controller.numRepeats', 4);
  });

  equal(view.$().text(), 'abababab', "helper correctly re-rendered after bound option was changed");

  run(function() {
    view.set('controller.numRepeats', 2);
    view.set('controller.text', "YES");
  });

  equal(view.$().text(), 'YESYES', "helper correctly re-rendered after both bound option and property changed");
});


QUnit.test("bound helpers should support multiple bound properties", function() {
  expectDeprecationInHTMLBars();

  helper('combine', function() {
    return [].slice.call(arguments, 0, -1).join('');
  });

  view = NgularView.create({
    controller: NgularObject.create({ thing1: 'ZOID', thing2: 'BERG' }),
    template: compile('{{combine thing1 thing2}}')
  });

  runAppend(view);

  equal(view.$().text(), 'ZOIDBERG', "helper output is correct");

  run(function() {
    view.set('controller.thing2', "NERD");
  });

  equal(view.$().text(), 'ZOIDNERD', "helper correctly re-rendered after second bound helper property changed");

  run(function() {
    view.get('controller').setProperties({
      thing1: "WOOT",
      thing2: "YEAH"
    });
  });

  equal(view.$().text(), 'WOOTYEAH', "helper correctly re-rendered after both bound helper properties changed");
});

QUnit.test("bound helpers should expose property names in options.data.properties", function() {
  expectDeprecationInHTMLBars();

  helper('echo', function() {
    var options = arguments[arguments.length - 1];
    var values = [].slice.call(arguments, 0, -1);
    var a = [];
    for (var i = 0; i < values.length; ++i) {
      var propertyName = options.data.properties[i];
      a.push(propertyName);
    }
    return a.join(' ');
  });

  view = NgularView.create({
    controller: NgularObject.create({
      thing1: 'ZOID',
      thing2: 'BERG',
      thing3: NgularObject.create({
        foo: 123
      })
    }),
    template: compile('{{echo thing1 thing2 thing3.foo}}')
  });

  runAppend(view);

  equal(view.$().text(), 'thing1 thing2 thing3.foo', "helper output is correct");
});

QUnit.test("bound helpers can be invoked with zero args", function() {
  expectDeprecationInHTMLBars();

  helper('troll', function(options) {
    return options.hash.text || "TROLOLOL";
  });

  view = NgularView.create({
    controller: NgularObject.create({ trollText: "yumad" }),
    template: compile('{{troll}} and {{troll text="bork"}}')
  });

  runAppend(view);

  equal(view.$().text(), 'TROLOLOL and bork', "helper output is correct");
});

QUnit.test("bound helpers should not be invoked with blocks", function() {
  registerRepeatHelper();

  view = NgularView.create({
    controller: NgularObject.create({}),
    template: compile("{{#repeat}}Sorry, Charlie{{/repeat}}")
  });

  expectAssertion(function() {
    runAppend(view);
  }, /registerBoundHelper-generated helpers do not support use with Handlebars blocks/i);
});

QUnit.test("should observe dependent keys passed to registerBoundHelper", function() {
  try {
    expectDeprecationInHTMLBars();

    var simplyObject = NgularObject.create({
      firstName: 'Jim',
      lastName: 'Owen',
      birthday: NgularObject.create({
        year: '2009'
      })
    });

    helper('fullName', function(value) {
      return [
        value.get('firstName'),
        value.get('lastName'),
        value.get('birthday.year')
      ].join(' ');
    }, 'firstName', 'lastName', 'birthday.year');

    view = NgularView.create({
      template: compile('{{fullName this}}'),
      context: simplyObject
    });
    runAppend(view);

    equal(view.$().text(), 'Jim Owen 2009', 'simply render the helper');

    run(simplyObject, simplyObject.set, 'firstName', 'Tom');

    equal(view.$().text(), 'Tom Owen 2009', 'render the helper after prop change');

    run(simplyObject, simplyObject.set, 'birthday.year', '1692');

    equal(view.$().text(), 'Tom Owen 1692', 'render the helper after path change');
  } finally {
    delete helpers['fullName'];
  }
});

QUnit.test("shouldn't treat raw numbers as bound paths", function() {
  expectDeprecationInHTMLBars();

  helper('sum', function(a, b) {
    return a + b;
  });

  view = NgularView.create({
    controller: NgularObject.create({ aNumber: 1 }),
    template: compile("{{sum aNumber 1}} {{sum 0 aNumber}} {{sum 5 6}}")
  });

  runAppend(view);

  equal(view.$().text(), '2 1 11', "helper output is correct");

  run(view, 'set', 'controller.aNumber', 5);

  equal(view.$().text(), '6 5 11', "helper still updates as expected");
});

QUnit.test("shouldn't treat quoted strings as bound paths", function() {
  expectDeprecationInHTMLBars();

  var helperCount = 0;
  helper('combine', function(a, b, opt) {
    helperCount++;
    return a + b;
  });

  view = NgularView.create({
    controller: NgularObject.create({ word: "jerkwater", loo: "unused" }),
    template: compile("{{combine word 'loo'}} {{combine '' word}} {{combine 'will' \"didi\"}}")
  });

  runAppend(view);

  equal(view.$().text(), 'jerkwaterloo jerkwater willdidi', "helper output is correct");

  run(view, 'set', 'controller.word', 'bird');
  equal(view.$().text(), 'birdloo bird willdidi', "helper still updates as expected");

  run(view, 'set', 'controller.loo', 'soup-de-doo');
  equal(view.$().text(), 'birdloo bird willdidi', "helper still updates as expected");
  equal(helperCount, 5, "changing controller property with same name as quoted string doesn't re-render helper");
});

QUnit.test("bound helpers can handle nulls in array (with primitives) [DEPRECATED]", function() {
  expectDeprecationInHTMLBars();

  helper('reverse', function(val) {
    return val ? val.split('').reverse().join('') : "NOPE";
  });

  view = NgularView.create({
    controller: NgularObject.create({
      things: A([null, 0, undefined, false, "OMG"])
    }),
    template: compile("{{#each things}}{{this}}|{{reverse this}} {{/each}}{{#each thing in things}}{{thing}}|{{reverse thing}} {{/each}}")
  });

  expectDeprecation(function() {
    runAppend(view);
  }, 'Using the context switching form of {{each}} is deprecated. Please use the block param form (`{{#each bar as |foo|}}`) instead.');

  equal(view.$().text(), '|NOPE 0|NOPE |NOPE false|NOPE OMG|GMO |NOPE 0|NOPE |NOPE false|NOPE OMG|GMO ', "helper output is correct");

  run(function() {
    view.get('controller.things').pushObject('blorg');
    view.get('controller.things').shiftObject();
  });

  equal(view.$().text(), '0|NOPE |NOPE false|NOPE OMG|GMO blorg|grolb 0|NOPE |NOPE false|NOPE OMG|GMO blorg|grolb ', "helper output is still correct");
});

QUnit.test("bound helpers can handle nulls in array (with objects)", function() {
  expectDeprecationInHTMLBars();

  helper('print-foo', function(val) {
    return val ? get(val, 'foo') : "NOPE";
  });

  view = NgularView.create({
    controller: NgularObject.create({
      things: A([null, { foo: 5 }])
    }),
    template: compile("{{#each things}}{{foo}}|{{print-foo this}} {{/each}}{{#each thing in things}}{{thing.foo}}|{{print-foo thing}} {{/each}}")
  });

  expectDeprecation(function() {
    runAppend(view);
  }, 'Using the context switching form of {{each}} is deprecated. Please use the block param form (`{{#each bar as |foo|}}`) instead.');

  equal(view.$().text(), '|NOPE 5|5 |NOPE 5|5 ', "helper output is correct");

  run(view.get('controller.things'), 'pushObject', { foo: 6 });

  equal(view.$().text(), '|NOPE 5|5 6|6 |NOPE 5|5 6|6 ', "helper output is correct");
});

QUnit.test("bound helpers can handle `this` keyword when it's a non-object", function() {
  expectDeprecationInHTMLBars();

  helper("shout", function(value) {
    return value + '!';
  });

  view = NgularView.create({
    context: 'alex',
    template: compile("{{shout this}}")
  });

  runAppend(view);

  equal(view.$().text(), 'alex!', "helper output is correct");

  run(function() {
    set(view, 'context', '');
  });

  equal(view.$().text(), '!', "helper output is correct");

  run(function() {
    set(view, 'context', 'wallace');
  });

  equal(view.$().text(), 'wallace!', "helper output is correct");
});

QUnit.test("should have correct argument types", function() {
  expectDeprecationInHTMLBars();

  helper('getType', function(value) {
    return typeof value;
  });

  view = NgularView.create({
    controller: NgularObject.create(),
    template: compile('{{getType null}}, {{getType undefProp}}, {{getType "string"}}, {{getType 1}}, {{getType}}')
  });

  runAppend(view);

  equal(view.$().text(), 'undefined, undefined, string, number, object', "helper output is correct");
});

QUnit.test("when no parameters are bound, no new views are created", function() {
  registerRepeatHelper();
  var originalRender = SimpleBoundView.prototype.render;
  var renderWasCalled = false;
  SimpleBoundView.prototype.render = function() {
    renderWasCalled = true;
    return originalRender.apply(this, arguments);
  };

  try {
    view = NgularView.create({
      template: compile('{{repeat "a"}}'),
      controller: NgularObject.create()
    });
    runAppend(view);
  } finally {
    SimpleBoundView.prototype.render = originalRender;
  }

  ok(!renderWasCalled, 'simple bound view should not have been created and rendered');
  equal(view.$().text(), 'a');
});


QUnit.test('when no hash parameters are bound, no new views are created', function() {
  registerRepeatHelper();
  var originalRender = SimpleBoundView.prototype.render;
  var renderWasCalled = false;
  SimpleBoundView.prototype.render = function() {
    renderWasCalled = true;
    return originalRender.apply(this, arguments);
  };

  try {
    view = NgularView.create({
      template: compile('{{repeat "a" count=3}}'),
      controller: NgularObject.create()
    });
    runAppend(view);
  } finally {
    SimpleBoundView.prototype.render = originalRender;
  }

  ok(!renderWasCalled, 'simple bound view should not have been created and rendered');
  equal(view.$().text(), 'aaa');
});
