import Ngular from 'ngular-metal/core';
import { loc } from 'ngular-runtime/system/string';
import { isStream } from "ngular-metal/streams/utils";

/**
@module ngular
@submodule ngular-htmlbars
*/

/**
  Calls [Ngular.String.loc](/api/classes/Ngular.String.html#method_loc) with the
  provided string.

  This is a convenient way to localize text within a template:

  ```javascript
  Ngular.STRINGS = {
    '_welcome_': 'Bonjour'
  };
  ```

  ```handlebars
  <div class='message'>
    {{loc '_welcome_'}}
  </div>
  ```

  ```html
  <div class='message'>
    Bonjour
  </div>
  ```

  See [Ngular.String.loc](/api/classes/Ngular.String.html#method_loc) for how to
  set up localized string references.

  @method loc
  @for Ngular.Handlebars.helpers
  @param {String} str The string to format
  @see {Ngular.String#loc}
*/
export function locHelper(params, hash, options, env) {
  Ngular.assert('You cannot pass bindings to `loc` helper', (function ifParamsContainBindings() {
    for (var i = 0, l = params.length; i < l; i++) {
      if (isStream(params[i])) {
        return false;
      }
    }
    return true;
  })());

  return loc.apply(env.data.view, params);
}
