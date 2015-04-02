/**
@module ngular
@submodule ngular-htmlbars
*/

import Ngular from "ngular-metal/core"; // Ngular.warn, Ngular.assert
import { read } from "ngular-metal/streams/utils";
import { readViewFactory } from "ngular-views/streams/utils";
import View from "ngular-views/views/view";
import mergeViewBindings from "ngular-htmlbars/system/merge-view-bindings";
import appendTemplatedView from "ngular-htmlbars/system/append-templated-view";

/**
  `{{view}}` inserts a new instance of an `Ngular.View` into a template passing its
  options to the `Ngular.View`'s `create` method and using the supplied block as
  the view's own template.

  An empty `<body>` and the following template:

  ```handlebars
  A span:
  {{#view tagName="span"}}
    hello.
  {{/view}}
  ```

  Will result in HTML structure:

  ```html
  <body>
    <!-- Note: the handlebars template script
         also results in a rendered Ngular.View
         which is the outer <div> here -->

    <div class="ngular-view">
      A span:
      <span id="ngular1" class="ngular-view">
        Hello.
      </span>
    </div>
  </body>
  ```

  ### `parentView` setting

  The `parentView` property of the new `Ngular.View` instance created through
  `{{view}}` will be set to the `Ngular.View` instance of the template where
  `{{view}}` was called.

  ```javascript
  aView = Ngular.View.create({
    template: Ngular.Handlebars.compile("{{#view}} my parent: {{parentView.elementId}} {{/view}}")
  });

  aView.appendTo('body');
  ```

  Will result in HTML structure:

  ```html
  <div id="ngular1" class="ngular-view">
    <div id="ngular2" class="ngular-view">
      my parent: ngular1
    </div>
  </div>
  ```

  ### Setting CSS id and class attributes

  The HTML `id` attribute can be set on the `{{view}}`'s resulting element with
  the `id` option. This option will _not_ be passed to `Ngular.View.create`.

  ```handlebars
  {{#view tagName="span" id="a-custom-id"}}
    hello.
  {{/view}}
  ```

  Results in the following HTML structure:

  ```html
  <div class="ngular-view">
    <span id="a-custom-id" class="ngular-view">
      hello.
    </span>
  </div>
  ```

  The HTML `class` attribute can be set on the `{{view}}`'s resulting element
  with the `class` or `classNameBindings` options. The `class` option will
  directly set the CSS `class` attribute and will not be passed to
  `Ngular.View.create`. `classNameBindings` will be passed to `create` and use
  `Ngular.View`'s class name binding functionality:

  ```handlebars
  {{#view tagName="span" class="a-custom-class"}}
    hello.
  {{/view}}
  ```

  Results in the following HTML structure:

  ```html
  <div class="ngular-view">
    <span id="ngular2" class="ngular-view a-custom-class">
      hello.
    </span>
  </div>
  ```

  ### Supplying a different view class

  `{{view}}` can take an optional first argument before its supplied options to
  specify a path to a custom view class.

  ```handlebars
  {{#view "custom"}}{{! will look up App.CustomView }}
    hello.
  {{/view}}
  ```

  The first argument can also be a relative path accessible from the current
  context.

  ```javascript
  MyApp = Ngular.Application.create({});
  MyApp.OuterView = Ngular.View.extend({
    innerViewClass: Ngular.View.extend({
      classNames: ['a-custom-view-class-as-property']
    }),
    template: Ngular.Handlebars.compile('{{#view view.innerViewClass}} hi {{/view}}')
  });

  MyApp.OuterView.create().appendTo('body');
  ```

  Will result in the following HTML:

  ```html
  <div id="ngular1" class="ngular-view">
    <div id="ngular2" class="ngular-view a-custom-view-class-as-property">
      hi
    </div>
  </div>
  ```

  ### Blockless use

  If you supply a custom `Ngular.View` subclass that specifies its own template
  or provide a `templateName` option to `{{view}}` it can be used without
  supplying a block. Attempts to use both a `templateName` option and supply a
  block will throw an error.

  ```javascript
  var App = Ngular.Application.create();
  App.WithTemplateDefinedView = Ngular.View.extend({
    templateName: 'defined-template'
  });
  ```

  ```handlebars
  {{! application.hbs }}
  {{view 'with-template-defined'}}
  ```

  ```handlebars
  {{! defined-template.hbs }}
  Some content for the defined template view.
  ```

  ### `viewName` property

  You can supply a `viewName` option to `{{view}}`. The `Ngular.View` instance
  will be referenced as a property of its parent view by this name.

  ```javascript
  aView = Ngular.View.create({
    template: Ngular.Handlebars.compile('{{#view viewName="aChildByName"}} hi {{/view}}')
  });

  aView.appendTo('body');
  aView.get('aChildByName') // the instance of Ngular.View created by {{view}} helper
  ```

  @method view
  @for Ngular.Handlebars.helpers
*/
export function viewHelper(params, hash, options, env) {
  Ngular.assert(
    "The `view` helper expects zero or one arguments.",
    params.length <= 2
  );

  var view = env.data.view;
  var container = view.container || read(view._keywords.view).container;
  var viewClassOrInstance;
  if (params.length === 0) {
    if (container) {
      viewClassOrInstance = container.lookupFactory('view:toplevel');
    } else {
      viewClassOrInstance = View;
    }
  } else {
    viewClassOrInstance = readViewFactory(params[0], container);
  }

  var props = {
    helperName: options.helperName || 'view'
  };

  if (options.template) {
    props.template = options.template;
  }

  mergeViewBindings(view, props, hash);
  appendTemplatedView(view, options.morph, viewClassOrInstance, props);
}
