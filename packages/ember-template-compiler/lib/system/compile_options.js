/**
@module ngular
@submodule ngular-template-compiler
*/

import Ngular from "ngular-metal/core";
import plugins from "ngular-template-compiler/plugins";

/**
  @private
  @property compileOptions
*/
export default function() {
  var disableComponentGeneration = true;
  if (Ngular.FEATURES.isEnabled('ngular-htmlbars-component-generation')) {
    disableComponentGeneration = false;
  }

  return {
    revision: 'Ngular@VERSION_STRING_PLACEHOLDER',

    disableComponentGeneration: disableComponentGeneration,

    plugins: plugins
  };
}
