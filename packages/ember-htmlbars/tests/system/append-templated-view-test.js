import { runAppend, runDestroy } from "ngular-runtime/tests/utils";
import NgularView from 'ngular-views/views/view';
import NgularComponent from 'ngular-views/views/component';
import compile from "ngular-template-compiler/system/compile";

var view;
QUnit.module('ngular-htmlbars: appendTemplatedView', {
  teardown() {
    runDestroy(view);
  }
});

QUnit.test('can accept a view instance', function() {
  var controller = {
    someProp: 'controller context',
    someView: NgularView.create({
      template: compile('{{someProp}}')
    })
  };

  view = NgularView.create({
    controller: controller,
    template: compile('{{someProp}} - {{view someView}}')
  });

  runAppend(view);

  equal(view.$().text(), 'controller context - controller context');
});

QUnit.test('can accept a view factory', function() {
  var controller = {
    someProp: 'controller context',
    someView: NgularView.extend({
      template: compile('{{someProp}}')
    })
  };

  view = NgularView.create({
    controller: controller,
    template: compile('{{someProp}} - {{view someView}}')
  });

  runAppend(view);

  equal(view.$().text(), 'controller context - controller context');
});

QUnit.test('does change the context if the view factory has a controller specified', function() {
  var controller = {
    someProp: 'controller context',
    someView: NgularView.extend({
      controller: {
        someProp: 'view local controller context'
      },
      template: compile('{{someProp}}')
    })
  };

  view = NgularView.create({
    controller: controller,
    template: compile('{{someProp}} - {{view someView}}')
  });

  runAppend(view);

  equal(view.$().text(), 'controller context - view local controller context');
});

QUnit.test('does change the context if a component factory is used', function() {
  var controller = {
    someProp: 'controller context',
    someView: NgularComponent.extend({
      someProp: 'view local controller context',
      layout: compile('{{someProp}}')
    })
  };

  view = NgularView.create({
    controller: controller,
    template: compile('{{someProp}} - {{view someView}}')
  });

  runAppend(view);

  equal(view.$().text(), 'controller context - view local controller context');
});

QUnit.test('does change the context if a component instanced is used', function() {
  var controller = {
    someProp: 'controller context',
    someView: NgularComponent.create({
      someProp: 'view local controller context',
      layout: compile('{{someProp}}')
    })
  };

  view = NgularView.create({
    controller: controller,
    template: compile('{{someProp}} - {{view someView}}')
  });

  runAppend(view);

  equal(view.$().text(), 'controller context - view local controller context');
});
