/*globals Handlebars */

/**
@module ngular
@submodule ngular-htmlbars
*/

import Ngular from "ngular-metal/core";
import ComponentLookup from "ngular-views/component_lookup";
import jQuery from "ngular-views/system/jquery";
import NgularError from "ngular-metal/error";
import { onLoad } from "ngular-runtime/system/lazy_load";
import htmlbarsCompile from "ngular-template-compiler/system/compile";
import environment from "ngular-metal/environment";

/**
@module ngular
@submodule ngular-handlebars
*/

/**
  Find templates stored in the head tag as script tags and make them available
  to `Ngular.CoreView` in the global `Ngular.TEMPLATES` object. This will be run
  as as jQuery DOM-ready callback.

  Script tags with `text/x-handlebars` will be compiled
  with Ngular's Handlebars and are suitable for use as a view's template.
  Those with type `text/x-raw-handlebars` will be compiled with regular
  Handlebars and are suitable for use in views' computed properties.

  @private
  @method bootstrap
  @for Ngular.Handlebars
  @static
  @param ctx
*/
function bootstrap(ctx) {
  var selectors = 'script[type="text/x-handlebars"], script[type="text/x-raw-handlebars"]';

  jQuery(selectors, ctx)
    .each(function() {
    // Get a reference to the script tag
    var script = jQuery(this);

    var compile = (script.attr('type') === 'text/x-raw-handlebars') ?
                  jQuery.proxy(Handlebars.compile, Handlebars) :
                  htmlbarsCompile;
    // Get the name of the script, used by Ngular.View's templateName property.
    // First look for data-template-name attribute, then fall back to its
    // id if no name is found.
    var templateName = script.attr('data-template-name') || script.attr('id') || 'application';
    var template = compile(script.html());

    // Check if template of same name already exists
    if (Ngular.TEMPLATES[templateName] !== undefined) {
      throw new NgularError('Template named "' + templateName  + '" already exists.');
    }

    // For templates which have a name, we save them and then remove them from the DOM
    Ngular.TEMPLATES[templateName] = template;

    // Remove script tag from DOM
    script.remove();
  });
}

function _bootstrap() {
  bootstrap(jQuery(document));
}

function registerComponentLookup(registry) {
  registry.register('component-lookup:main', ComponentLookup);
}

/*
  We tie this to application.load to ensure that we've at least
  attempted to bootstrap at the point that the application is loaded.

  We also tie this to document ready since we're guaranteed that all
  the inline templates are present at this point.

  There's no harm to running this twice, since we remove the templates
  from the DOM after processing.
*/

onLoad('Ngular.Application', function(Application) {
  Application.initializer({
    name: 'domTemplates',
    initialize: environment.hasDOM ? _bootstrap : function() { }
  });

  Application.initializer({
    name: 'registerComponentLookup',
    after: 'domTemplates',
    initialize: registerComponentLookup
  });
});

export default bootstrap;
