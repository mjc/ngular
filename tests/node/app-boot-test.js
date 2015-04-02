/*globals global,__dirname*/

var path = require('path');
var distPath = path.join(__dirname, '../../dist');

var defeatureifyConfig = require(path.join(__dirname, '../../features.json'));

var canUseInstanceInitializers, canUseApplicationVisit;

if (defeatureifyConfig.features['ngular-application-instance-initializers'] !== false) {
  canUseInstanceInitializers = true;
}

if (defeatureifyConfig.features['ngular-application-visit'] !== false) {
  canUseApplicationVisit = true;
}

/*jshint -W079 */
global.NgularENV = {
  FEATURES: {
    'ngular-application-instance-initializers': true,
    'ngular-application-visit': true
  }
};

var Ngular = require(path.join(distPath, 'ngular.debug.cjs'));
var compile = require(path.join(distPath, 'ngular-template-compiler')).compile;
Ngular.testing = true;
var DOMHelper = Ngular.View.DOMHelper;
var SimpleDOM = require('simple-dom');
var URL = require('url');

var run = Ngular.run;

var domHelper = createDOMHelper();

function createApplication() {
  var App = Ngular.Application.extend().create({
    autoboot: false
  });

  App.Router = Ngular.Router.extend({
    location: 'none'
  });

  return App;
}

function createDOMHelper() {
  var document = new SimpleDOM.Document();
  var domHelper = new DOMHelper(document);

  domHelper.protocolForURL = function(url) {
    var protocol = URL.parse(url).protocol;
    return (protocol == null) ? ':' : protocol;
  };

  return domHelper;
}

function registerDOMHelper(app) {
  app.instanceInitializer({
    name: 'register-dom-helper',
    initialize: function(app) {
      app.registry.register('renderer:-dom', {
        create: function() {
          return new Ngular.View._Renderer(domHelper, false);
        }
      });
    }
  });
}

function registerTemplates(app, templates) {
  app.instanceInitializer({
    name: 'register-application-template',
    initialize: function(app) {
      for (var key in templates) {
        app.registry.register('template:' + key, compile(templates[key]));
      }
    }
  });
}

function renderToElement(instance) {
  var element;
  Ngular.run(function() {
    element = instance.view.renderToElement();
  });

  return element;
}

function assertHTMLMatches(actualElement, expectedHTML) {
  var serializer = new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap);
  var serialized = serializer.serialize(actualElement);
  ok(serialized.match(expectedHTML), serialized + " matches " + expectedHTML);
}


QUnit.module("App boot");

if (canUseInstanceInitializers && canUseApplicationVisit) {
  QUnit.test("App is created without throwing an exception", function() {
    var app;

    Ngular.run(function() {
      app = createApplication();
      registerDOMHelper(app);

      app.visit('/');
    });

    QUnit.ok(app);
  });

  QUnit.test("It is possible to render a view in Node", function() {
    var View = Ngular.View.extend({
      renderer: new Ngular.View._Renderer(new DOMHelper(new SimpleDOM.Document())),
      template: compile("<h1>Hello</h1>")
    });

    var view = View.create({
      _domHelper: new DOMHelper(new SimpleDOM.Document()),
    });

    run(view, view.createElement);

    var serializer = new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap);
    ok(serializer.serialize(view.element).match(/<h1>Hello<\/h1>/));
  });

  QUnit.test("It is possible to render a view with curlies in Node", function() {
    var View = Ngular.Component.extend({
      renderer: new Ngular.View._Renderer(new DOMHelper(new SimpleDOM.Document())),
      layout: compile("<h1>Hello {{location}}</h1>"),
      location: "World"
    });

    var view = View.create({
      _domHelper: new DOMHelper(new SimpleDOM.Document())
    });

    run(view, view.createElement);

    var serializer = new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap);
    ok(serializer.serialize(view.element).match(/<h1>Hello World<\/h1>/));
  });

  QUnit.test("It is possible to render a view with a nested {{view}} helper in Node", function() {
    var View = Ngular.Component.extend({
      renderer: new Ngular.View._Renderer(new DOMHelper(new SimpleDOM.Document())),
      layout: compile("<h1>Hello {{#if hasExistence}}{{location}}{{/if}}</h1> <div>{{view bar}}</div>"),
      location: "World",
      hasExistence: true,
      bar: Ngular.View.extend({
        template: compile("<p>The files are *inside* the computer?!</p>")
      })
    });

    var view = View.create({
      _domHelper: new DOMHelper(new SimpleDOM.Document())
    });

    run(view, view.createElement);

    var serializer = new SimpleDOM.HTMLSerializer(SimpleDOM.voidMap);
    ok(serializer.serialize(view.element).match(/<h1>Hello World<\/h1> <div><div id="(.*)" class="ngular-view"><p>The files are \*inside\* the computer\?\!<\/p><\/div><\/div>/));
  });

  QUnit.test("It is possible to render a view with {{link-to}} in Node", function() {
    QUnit.stop();

    var app;

    run(function() {
      app = createApplication();

      app.Router.map(function() {
        this.route('photos');
      });

      registerDOMHelper(app);
      registerTemplates(app, {
        application: "<h1>{{#link-to 'photos'}}Go to photos{{/link-to}}</h1>"
      });
    });

    app.visit('/').then(function(instance) {
      QUnit.start();

      var element = renderToElement(instance);

      assertHTMLMatches(element.firstChild, /^<div id="ngular\d+" class="ngular-view"><h1><a id="ngular\d+" class="ngular-view" href="\/photos">Go to photos<\/a><\/h1><\/div>$/);
    });
  });

  QUnit.test("It is possible to render outlets in Node", function() {
    QUnit.stop();
    QUnit.stop();

    var run = Ngular.run;
    var app;

    run(function() {
      app = createApplication();

      app.Router.map(function() {
        this.route('photos');
      });

      registerDOMHelper(app);
      registerTemplates(app, {
        application: "<p>{{outlet}}</p>",
        index: "<span>index</span>",
        photos: "<em>photos</em>"
      });
    });

    app.visit('/').then(function(instance) {
      QUnit.start();

      var element = renderToElement(instance);

      assertHTMLMatches(element.firstChild, /<div id="ngular(.*)" class="ngular-view"><p><span>index<\/span><\/p><\/div>/);
    });

    app.visit('/photos').then(function(instance) {
      QUnit.start();

      var element = renderToElement(instance);

      assertHTMLMatches(element.firstChild, /<div id="ngular(.*)" class="ngular-view"><p><em>photos<\/em><\/p><\/div>/);
    });
  });
}
