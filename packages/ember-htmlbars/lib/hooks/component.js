/**
@module ngular
@submodule ngular-htmlbars
*/

import Ngular from "ngular-metal/core";
import lookupHelper from "ngular-htmlbars/system/lookup-helper";

export default function component(env, morph, view, tagName, attrs, template) {
  var helper = lookupHelper(tagName, view, env);

  Ngular.assert('You specified `' + tagName + '` in your template, but a component for `' + tagName + '` could not be found.', !!helper);

  return helper.helperFunction.call(undefined, [], attrs, { morph: morph, template: template }, env);
}

