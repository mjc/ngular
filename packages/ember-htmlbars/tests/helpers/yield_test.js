/*jshint newcap:false*/
import run from "ngular-metal/run_loop";
import NgularView from "ngular-views/views/view";
import { computed } from "ngular-metal/computed";
import { Registry } from "ngular-runtime/system/container";
import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";
import { A } from "ngular-runtime/system/native_array";
import Component from "ngular-views/views/component";
import NgularError from "ngular-metal/error";
import helpers from "ngular-htmlbars/helpers";
import {
  registerHelper
} from "ngular-htmlbars/helpers";
import makeViewHelper from "ngular-htmlbars/system/make-view-helper";

import compile from "ngular-template-compiler/system/compile";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var view, registry, container;

QUnit.module("ngular-htmlbars: Support for {{yield}} helper", {
  setup() {
    registry = new Registry();
    container = registry.container();
    registry.optionsForType('template', { instantiate: false });
  },
  teardown() {
    run(function() {
      Ngular.TEMPLATES = {};
    });
    runDestroy(view);
    runDestroy(container);
    registry = container = view = null;
  }
});

QUnit.test("a view with a layout set renders its template where the {{yield}} helper appears", function() {
  var ViewWithLayout = NgularView.extend({
    layout: compile('<div class="wrapper"><h1>{{title}}</h1>{{yield}}</div>')
  });

  view = NgularView.create({
    withLayout: ViewWithLayout,
    template: compile('{{#view view.withLayout title="My Fancy Page"}}<div class="page-body">Show something interesting here</div>{{/view}}')
  });

  runAppend(view);

  equal(view.$('div.wrapper div.page-body').length, 1, 'page-body is embedded within wrapping my-page');
});

QUnit.test("block should work properly even when templates are not hard-coded", function() {
  registry.register('template:nester', compile('<div class="wrapper"><h1>{{title}}</h1>{{yield}}</div>'));
  registry.register('template:nested', compile('{{#view "with-layout" title="My Fancy Page"}}<div class="page-body">Show something interesting here</div>{{/view}}'));

  registry.register('view:with-layout', NgularView.extend({
    container: container,
    layoutName: 'nester'
  }));

  view = NgularView.create({
    container: container,
    templateName: 'nested'
  });

  runAppend(view);

  equal(view.$('div.wrapper div.page-body').length, 1, 'page-body is embedded within wrapping my-page');

});

QUnit.test("templates should yield to block, when the yield is embedded in a hierarchy of virtual views", function() {
  var TimesView = NgularView.extend({
    layout: compile('<div class="times">{{#each item in view.index}}{{yield}}{{/each}}</div>'),
    n: null,
    index: computed(function() {
      var n = get(this, 'n');
      var indexArray = A();
      for (var i=0; i < n; i++) {
        indexArray[i] = i;
      }
      return indexArray;
    })
  });

  view = NgularView.create({
    timesView: TimesView,
    template: compile('<div id="container"><div class="title">Counting to 5</div>{{#view view.timesView n=5}}<div class="times-item">Hello</div>{{/view}}</div>')
  });

  runAppend(view);

  equal(view.$('div#container div.times-item').length, 5, 'times-item is embedded within wrapping container 5 times, as expected');
});

QUnit.test("templates should yield to block, when the yield is embedded in a hierarchy of non-virtual views", function() {
  var NestingView = NgularView.extend({
    layout: compile('{{#view tagName="div" classNames="nesting"}}{{yield}}{{/view}}')
  });

  view = NgularView.create({
    nestingView: NestingView,
    template: compile('<div id="container">{{#view view.nestingView}}<div id="block">Hello</div>{{/view}}</div>')
  });

  runAppend(view);

  equal(view.$('div#container div.nesting div#block').length, 1, 'nesting view yields correctly even within a view hierarchy in the nesting view');
});

QUnit.test("block should not be required", function() {
  var YieldingView = NgularView.extend({
    layout: compile('{{#view tagName="div" classNames="yielding"}}{{yield}}{{/view}}')
  });

  view = NgularView.create({
    yieldingView: YieldingView,
    template: compile('<div id="container">{{view view.yieldingView}}</div>')
  });

  runAppend(view);

  equal(view.$('div#container div.yielding').length, 1, 'yielding view is rendered as expected');
});

QUnit.test("yield uses the outer context", function() {
  var component = Component.extend({
    boundText: "inner",
    layout: compile("<p>{{boundText}}</p><p>{{yield}}</p>")
  });

  view = NgularView.create({
    controller: { boundText: "outer", component: component },
    template: compile('{{#view component}}{{boundText}}{{/view}}')
  });

  runAppend(view);

  equal(view.$('div p:contains(inner) + p:contains(outer)').length, 1, "Yield points at the right context");
});


QUnit.test("yield inside a conditional uses the outer context [DEPRECATED]", function() {
  var component = Component.extend({
    boundText: "inner",
    truthy: true,
    obj: {},
    layout: compile("<p>{{boundText}}</p><p>{{#if truthy}}{{#with obj}}{{yield}}{{/with}}{{/if}}</p>")
  });

  view = NgularView.create({
    controller: { boundText: "outer", truthy: true, obj: { component: component, truthy: true, boundText: 'insideWith' } },
    template: compile('{{#with obj}}{{#if truthy}}{{#view component}}{{#if truthy}}{{boundText}}{{/if}}{{/view}}{{/if}}{{/with}}')
  });

  expectDeprecation(function() {
    runAppend(view);
  }, 'Using the context switching form of `{{with}}` is deprecated. Please use the block param form (`{{#with bar as |foo|}}`) instead.');

  equal(view.$('div p:contains(inner) + p:contains(insideWith)').length, 1, "Yield points at the right context");
});

QUnit.test("outer keyword doesn't mask inner component property", function () {
  var component = Component.extend({
    item: "inner",
    layout: compile("<p>{{item}}</p><p>{{yield}}</p>")
  });

  view = NgularView.create({
    controller: { boundText: "outer", component: component },
    template: compile('{{#with boundText as item}}{{#view component}}{{item}}{{/view}}{{/with}}')
  });

  runAppend(view);

  equal(view.$('div p:contains(inner) + p:contains(outer)').length, 1, "inner component property isn't masked by outer keyword");
});

QUnit.test("inner keyword doesn't mask yield property", function() {
  var component = Component.extend({
    boundText: "inner",
    layout: compile("{{#with boundText as item}}<p>{{item}}</p><p>{{yield}}</p>{{/with}}")
  });

  view = NgularView.create({
    controller: { item: "outer", component: component },
    template: compile('{{#view component}}{{item}}{{/view}}')
  });

  runAppend(view);

  equal(view.$('div p:contains(inner) + p:contains(outer)').length, 1, "outer property isn't masked by inner keyword");
});

QUnit.test("can bind a keyword to a component and use it in yield", function() {
  var component = Component.extend({
    content: null,
    layout: compile("<p>{{content}}</p><p>{{yield}}</p>")
  });

  view = NgularView.create({
    controller: { boundText: "outer", component: component },
    template: compile('{{#with boundText as item}}{{#view component content=item}}{{item}}{{/view}}{{/with}}')
  });

  runAppend(view);

  equal(view.$('div p:contains(outer) + p:contains(outer)').length, 1, "component and yield have keyword");

  run(function() {
    view.set('controller.boundText', 'update');
  });

  equal(view.$('div p:contains(update) + p:contains(update)').length, 1, "keyword has correctly propagated update");
});

QUnit.test("yield view should be a virtual view", function() {
  var component = Component.extend({
    isParentComponent: true,

    layout: compile('{{yield}}')
  });

  view = NgularView.create({
    template: compile('{{#view component}}{{view includedComponent}}{{/view}}'),
    controller: {
      component: component,
      includedComponent: Component.extend({
        didInsertElement() {
          var parentView = this.get('parentView');

          ok(parentView.get('isParentComponent'), "parent view is the parent component");
        }
      })
    }
  });

  runAppend(view);
});


QUnit.test("adding a layout should not affect the context of normal views", function() {
  var parentView = NgularView.create({
    context: "ParentContext"
  });

  view = NgularView.create({
    template:     compile("View context: {{this}}"),
    context:      "ViewContext",
    _parentView:  parentView
  });

  run(function() {
    view.createElement();
  });

  equal(view.$().text(), "View context: ViewContext");


  set(view, 'layout', compile("Layout: {{yield}}"));

  run(function() {
    view.destroyElement();
    view.createElement();
  });

  equal(view.$().text(), "Layout: View context: ViewContext");

  runDestroy(parentView);
});

QUnit.test("yield should work for views even if _parentView is null", function() {
  view = NgularView.create({
    layout:   compile('Layout: {{yield}}'),
    template: compile("View Content")
  });

  run(function() {
    view.createElement();
  });

  equal(view.$().text(), "Layout: View Content");

});

QUnit.test("simple bindings inside of a yielded template should work properly when the yield is nested inside of another view", function() {
  view = NgularView.create({
    layout:   compile('{{#if view.falsy}}{{else}}{{yield}}{{/if}}'),
    template: compile("{{view.text}}"),
    text: "ohai"
  });

  run(function() {
    view.createElement();
  });

  equal(view.$().text(), "ohai");
});

QUnit.test("nested simple bindings inside of a yielded template should work properly when the yield is nested inside of another view", function() {
  view = NgularView.create({
    layout:   compile('{{#if view.falsy}}{{else}}{{yield}}{{/if}}'),
    template: compile("{{#if view.falsy}}{{else}}{{view.text}}{{/if}}"),
    text: "ohai"
  });

  run(function() {
    view.createElement();
  });

  equal(view.$().text(), "ohai");
});

QUnit.module("ngular-htmlbars: Component {{yield}}", {
  setup() {},
  teardown() {
    runDestroy(view);
    delete helpers['inner-component'];
    delete helpers['outer-component'];
  }
});

QUnit.test("yield with nested components (#3220)", function() {
  var count = 0;
  var InnerComponent = Component.extend({
    layout: compile("{{yield}}"),
    _yield(context, options, morph) {
      count++;
      if (count > 1) {
        throw new NgularError('is looping');
      }

      return this._super(context, options, morph);
    }
  });

  registerHelper('inner-component', makeViewHelper(InnerComponent));

  var OuterComponent = Component.extend({
    layout: compile("{{#inner-component}}<span>{{yield}}</span>{{/inner-component}}")
  });

  registerHelper('outer-component', makeViewHelper(OuterComponent));

  view = NgularView.create({
    template: compile(
      "{{#outer-component}}Hello world{{/outer-component}}"
    )
  });

  runAppend(view);

  equal(view.$('div > span').text(), "Hello world");
});

QUnit.test("yield works inside a conditional in a component that has Ngular._Metamorph mixed in", function() {
  var component = Component.extend(Ngular._Metamorph, {
    item: "inner",
    layout: compile("<p>{{item}}</p>{{#if item}}<p>{{yield}}</p>{{/if}}")
  });

  view = Ngular.View.create({
    controller: { item: "outer", component: component },
    template: compile('{{#view component}}{{item}}{{/view}}')
  });

  runAppend(view);

  equal(view.$().text(), 'innerouter', "{{yield}} renders yielded content inside metamorph component");
});

QUnit.test("view keyword works inside component yield", function () {
  var component = Component.extend({
    layout: compile("<p>{{yield}}</p>")
  });

  view = NgularView.create({
    dummyText: 'hello',
    component: component,
    template: compile('{{#view view.component}}{{view.dummyText}}{{/view}}')
  });

  runAppend(view);

  equal(view.$('div > p').text(), "hello", "view keyword inside component yield block should refer to the correct view");
});
