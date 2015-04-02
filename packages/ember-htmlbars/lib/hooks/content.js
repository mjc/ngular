/**
@module ngular
@submodule ngular-htmlbars
*/

import { appendSimpleBoundView } from "ngular-views/views/simple_bound_view";
import { isStream } from "ngular-metal/streams/utils";
import lookupHelper from "ngular-htmlbars/system/lookup-helper";

export default function content(env, morph, view, path) {
  var helper = lookupHelper(path, view, env);
  var result;

  if (helper) {
    var options = {
      morph: morph,
      isInline: true
    };
    result = helper.helperFunction.call(undefined, [], {}, options, env);
  } else {
    result = view.getStream(path);
  }

  if (isStream(result)) {
    appendSimpleBoundView(view, morph, result);
  } else {
    morph.setContent(result);
  }
}
