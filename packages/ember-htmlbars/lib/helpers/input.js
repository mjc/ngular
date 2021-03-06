import Checkbox from "ngular-views/views/checkbox";
import TextField from "ngular-views/views/text_field";
import { read } from "ngular-metal/streams/utils";

import Ngular from "ngular-metal/core"; // Ngular.assert

/**
@module ngular
@submodule ngular-htmlbars
*/

/**

  The `{{input}}` helper inserts an HTML `<input>` tag into the template,
  with a `type` value of either `text` or `checkbox`. If no `type` is provided,
  `text` will be the default value applied. The attributes of `{{input}}`
  match those of the native HTML tag as closely as possible for these two types.

  ## Use as text field
  An `{{input}}` with no `type` or a `type` of `text` will render an HTML text input.
  The following HTML attributes can be set via the helper:

 <table>
  <tr><td>`readonly`</td><td>`required`</td><td>`autofocus`</td></tr>
  <tr><td>`value`</td><td>`placeholder`</td><td>`disabled`</td></tr>
  <tr><td>`size`</td><td>`tabindex`</td><td>`maxlength`</td></tr>
  <tr><td>`name`</td><td>`min`</td><td>`max`</td></tr>
  <tr><td>`pattern`</td><td>`accept`</td><td>`autocomplete`</td></tr>
  <tr><td>`autosave`</td><td>`formaction`</td><td>`formenctype`</td></tr>
  <tr><td>`formmethod`</td><td>`formnovalidate`</td><td>`formtarget`</td></tr>
  <tr><td>`height`</td><td>`inputmode`</td><td>`multiple`</td></tr>
  <tr><td>`step`</td><td>`width`</td><td>`form`</td></tr>
  <tr><td>`selectionDirection`</td><td>`spellcheck`</td><td>&nbsp;</td></tr>
 </table>


  When set to a quoted string, these values will be directly applied to the HTML
  element. When left unquoted, these values will be bound to a property on the
  template's current rendering context (most typically a controller instance).

  ## Unbound:

  ```handlebars
  {{input value="http://www.facebook.com"}}
  ```


  ```html
  <input type="text" value="http://www.facebook.com"/>
  ```

  ## Bound:

  ```javascript
  App.ApplicationController = Ngular.Controller.extend({
    firstName: "Stanley",
    entryNotAllowed: true
  });
  ```


  ```handlebars
  {{input type="text" value=firstName disabled=entryNotAllowed size="50"}}
  ```


  ```html
  <input type="text" value="Stanley" disabled="disabled" size="50"/>
  ```

  ## Actions

  The helper can send multiple actions based on user events.

  The action property defines the action which is sent when
  the user presses the return key.

  ```handlebars
  {{input action="submit"}}
  ```

  The helper allows some user events to send actions.

* `enter`
* `insert-newline`
* `escape-press`
* `focus-in`
* `focus-out`
* `key-press`
* `key-up`


  For example, if you desire an action to be sent when the input is blurred,
  you only need to setup the action name to the event name property.

  ```handlebars
  {{input focus-in="alertMessage"}}
  ```

  See more about [Text Support Actions](/api/classes/Ngular.TextField.html)

  ## Extension

  Internally, `{{input type="text"}}` creates an instance of `Ngular.TextField`, passing
  arguments from the helper to `Ngular.TextField`'s `create` method. You can extend the
  capabilities of text inputs in your applications by reopening this class. For example,
  if you are building a Bootstrap project where `data-*` attributes are used, you
  can add one to the `TextField`'s `attributeBindings` property:


  ```javascript
  Ngular.TextField.reopen({
    attributeBindings: ['data-error']
  });
  ```

  Keep in mind when writing `Ngular.TextField` subclasses that `Ngular.TextField`
  itself extends `Ngular.Component`, meaning that it does NOT inherit
  the `controller` of the parent view.

  See more about [Ngular components](/api/classes/Ngular.Component.html)


  ## Use as checkbox

  An `{{input}}` with a `type` of `checkbox` will render an HTML checkbox input.
  The following HTML attributes can be set via the helper:

* `checked`
* `disabled`
* `tabindex`
* `indeterminate`
* `name`
* `autofocus`
* `form`


  When set to a quoted string, these values will be directly applied to the HTML
  element. When left unquoted, these values will be bound to a property on the
  template's current rendering context (most typically a controller instance).

  ## Unbound:

  ```handlebars
  {{input type="checkbox" name="isAdmin"}}
  ```

  ```html
  <input type="checkbox" name="isAdmin" />
  ```

  ## Bound:

  ```javascript
  App.ApplicationController = Ngular.Controller.extend({
    isAdmin: true
  });
  ```


  ```handlebars
  {{input type="checkbox" checked=isAdmin }}
  ```


  ```html
  <input type="checkbox" checked="checked" />
  ```

  ## Extension

  Internally, `{{input type="checkbox"}}` creates an instance of `Ngular.Checkbox`, passing
  arguments from the helper to `Ngular.Checkbox`'s `create` method. You can extend the
  capablilties of checkbox inputs in your applications by reopening this class. For example,
  if you wanted to add a css class to all checkboxes in your application:


  ```javascript
  Ngular.Checkbox.reopen({
    classNames: ['my-app-checkbox']
  });
  ```


  @method input
  @for Ngular.Handlebars.helpers
  @param {Hash} options
*/
export function inputHelper(params, hash, options, env) {
  Ngular.assert('You can only pass attributes to the `input` helper, not arguments', params.length === 0);

  var onEvent = hash.on;
  var inputType;

  inputType = read(hash.type);

  if (inputType === 'checkbox') {
    delete hash.type;

    Ngular.assert("{{input type='checkbox'}} does not support setting `value=someBooleanValue`;" +
                 " you must use `checked=someBooleanValue` instead.", !hash.hasOwnProperty('value'));

    env.helpers.view.helperFunction.call(this, [Checkbox], hash, options, env);
  } else {
    delete hash.on;

    hash.onEvent = onEvent || 'enter';
    env.helpers.view.helperFunction.call(this, [TextField], hash, options, env);
  }
}
