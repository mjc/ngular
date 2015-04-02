/**
@module ngular
@submodule ngular-htmlbars
*/

import { appendSimpleBoundView } from "ngular-views/views/simple_bound_view";
import { isStream } from "ngular-metal/streams/utils";
import lookupHelper from "ngular-htmlbars/system/lookup-helper";

export default function block(env, morph, view, path, params, hash, template, inverse) {
  var helper = lookupHelper(path, view, env);

  Ngular.assert("A helper named `"+path+"` could not be found", helper);

  var options = {
    morph: morph,
    template: template,
    inverse: inverse,
    isBlock: true
  };
  var result = helper.helperFunction.call(undefined, params, hash, options, env);

  if (isStream(result)) {
    appendSimpleBoundView(view, morph, result);
  } else {
    morph.setContent(result);
  }
}
