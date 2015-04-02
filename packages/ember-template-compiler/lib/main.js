import _Ngular from "ngular-metal/core";
import precompile from "ngular-template-compiler/system/precompile";
import compile from "ngular-template-compiler/system/compile";
import template from "ngular-template-compiler/system/template";
import { registerPlugin } from "ngular-template-compiler/plugins";

import TransformEachInToHash from "ngular-template-compiler/plugins/transform-each-in-to-hash";
import TransformWithAsToHash from "ngular-template-compiler/plugins/transform-with-as-to-hash";

// used for adding Ngular.Handlebars.compile for backwards compat
import "ngular-template-compiler/compat";

registerPlugin('ast', TransformWithAsToHash);
registerPlugin('ast', TransformEachInToHash);

export {
  _Ngular,
  precompile,
  compile,
  template,
  registerPlugin
};
