/**
@module ngular
@submodule ngular-htmlbars
*/

import Ngular from "ngular-metal/core";

import { get } from "ngular-metal/property_get";

/**
  `{{yield}}` denotes an area of a template that will be rendered inside
  of another template. It has two main uses:

  ### Use with `layout`
  When used in a Handlebars template that is assigned to an `Ngular.View`
  instance's `layout` property Ngular will render the layout template first,
  inserting the view's own rendered output at the `{{yield}}` location.

  An empty `<body>` and the following application code:

  ```javascript
  AView = Ngular.View.extend({
    classNames: ['a-view-with-layout'],
    layout: Ngular.Handlebars.compile('<div class="wrapper">{{yield}}</div>'),
    template: Ngular.Handlebars.compile('<span>I am wrapped</span>')
  });

  aView = AView.create();
  aView.appendTo('body');
  ```

  Will result in the following HTML output:

  ```html
  <body>
    <div class='ngular-view a-view-with-layout'>
      <div class="wrapper">
        <span>I am wrapped</span>
      </div>
    </div>
  </body>
  ```

  The `yield` helper cannot be used outside of a template assigned to an
  `Ngular.View`'s `layout` property and will throw an error if attempted.

  ```javascript
  BView = Ngular.View.extend({
    classNames: ['a-view-with-layout'],
    template: Ngular.Handlebars.compile('{{yield}}')
  });

  bView = BView.create();
  bView.appendTo('body');

  // throws
  // Uncaught Error: assertion failed:
  // You called yield in a template that was not a layout
  ```

  ### Use with Ngular.Component
  When designing components `{{yield}}` is used to denote where, inside the component's
  template, an optional block passed to the component should render:

  ```handlebars
  <!-- application.hbs -->
  {{#labeled-textfield value=someProperty}}
    First name:
  {{/labeled-textfield}}
  ```

  ```handlebars
  <!-- components/labeled-textfield.hbs -->
  <label>
    {{yield}} {{input value=value}}
  </label>
  ```

  Result:

  ```html
  <label>
    First name: <input type="text" />
  </label>
  ```

  @method yield
  @for Ngular.Handlebars.helpers
  @param {Hash} options
  @return {String} HTML string
*/
export function yieldHelper(params, hash, options, env) {
  var view = env.data.view;
  var layoutView = view;

  // Yea gods
  while (layoutView && !get(layoutView, 'layout')) {
    if (layoutView._contextView) {
      layoutView = layoutView._contextView;
    } else {
      layoutView = layoutView._parentView;
    }
  }

  Ngular.assert("You called yield in a template that was not a layout", !!layoutView);

  return layoutView._yield(view, env, options.morph, params);
}
