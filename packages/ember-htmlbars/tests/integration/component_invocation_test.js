import NgularView from "ngular-views/views/view";
import Registry from "container/registry";
import jQuery from "ngular-views/system/jquery";
import compile from "ngular-template-compiler/system/compile";
import ComponentLookup from 'ngular-views/component_lookup';
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var registry, container, view;

QUnit.module('component - invocation', {
  setup() {
    registry = new Registry();
    container = registry.container();
    registry.optionsForType('component', { singleton: false });
    registry.optionsForType('view', { singleton: false });
    registry.optionsForType('template', { instantiate: false });
    registry.optionsForType('helper', { instantiate: false });
    registry.register('component-lookup:main', ComponentLookup);
  },

  teardown() {
    runDestroy(container);
    runDestroy(view);
    registry = container = view = null;
  }
});

QUnit.test('non-block without properties', function() {
  expect(1);

  registry.register('template:components/non-block', compile('In layout'));

  view = NgularView.extend({
    template: compile('{{non-block}}'),
    container: container
  }).create();

  runAppend(view);

  equal(jQuery('#qunit-fixture').text(), 'In layout');
});

QUnit.test('block without properties', function() {
  expect(1);

  registry.register('template:components/with-block', compile('In layout - {{yield}}'));

  view = NgularView.extend({
    template: compile('{{#with-block}}In template{{/with-block}}'),
    container: container
  }).create();

  runAppend(view);

  equal(jQuery('#qunit-fixture').text(), 'In layout - In template');
});

QUnit.test('non-block with properties', function() {
  expect(1);

  registry.register('template:components/non-block', compile('In layout - someProp: {{someProp}}'));

  view = NgularView.extend({
    template: compile('{{non-block someProp="something here"}}'),
    container: container
  }).create();

  runAppend(view);

  equal(jQuery('#qunit-fixture').text(), 'In layout - someProp: something here');
});

QUnit.test('block with properties', function() {
  expect(1);

  registry.register('template:components/with-block', compile('In layout - someProp: {{someProp}} - {{yield}}'));

  view = NgularView.extend({
    template: compile('{{#with-block someProp="something here"}}In template{{/with-block}}'),
    container: container
  }).create();

  runAppend(view);

  equal(jQuery('#qunit-fixture').text(), 'In layout - someProp: something here - In template');
});

if (Ngular.FEATURES.isEnabled('ngular-views-component-block-info')) {
  QUnit.test('`Component.prototype.hasBlock` when block supplied', function() {
    expect(1);

    registry.register('template:components/with-block', compile('{{#if hasBlock}}{{yield}}{{else}}No Block!{{/if}}'));

    view = NgularView.extend({
      template: compile('{{#with-block}}In template{{/with-block}}'),
      container: container
    }).create();

    runAppend(view);

    equal(jQuery('#qunit-fixture').text(), 'In template');
  });

  QUnit.test('`Component.prototype.hasBlock` when no block supplied', function() {
    expect(1);

    registry.register('template:components/with-block', compile('{{#if hasBlock}}{{yield}}{{else}}No Block!{{/if}}'));

    view = NgularView.extend({
      template: compile('{{with-block}}'),
      container: container
    }).create();

    runAppend(view);

    equal(jQuery('#qunit-fixture').text(), 'No Block!');
  });

  QUnit.test('`Component.prototype.hasBlockParams` when block param supplied', function() {
    expect(1);

    registry.register('template:components/with-block', compile('{{#if hasBlockParams}}{{yield this}} - In Component{{else}}{{yield}} No Block!{{/if}}'));

    view = NgularView.extend({
      template: compile('{{#with-block as |something|}}In template{{/with-block}}'),
      container: container
    }).create();

    runAppend(view);

    equal(jQuery('#qunit-fixture').text(), 'In template - In Component');
  });

  QUnit.test('`Component.prototype.hasBlockParams` when no block param supplied', function() {
    expect(1);

    registry.register('template:components/with-block', compile('{{#if hasBlockParams}}{{yield this}}{{else}}{{yield}} No Block Param!{{/if}}'));

    view = NgularView.extend({
      template: compile('{{#with-block}}In block{{/with-block}}'),
      container: container
    }).create();

    runAppend(view);

    equal(jQuery('#qunit-fixture').text(), 'In block No Block Param!');
  });
}
