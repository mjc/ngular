/**
@module ngular
@submodule ngular-template-compiler
*/

import compileOptions from "ngular-template-compiler/system/compile_options";
var compileSpec;

/**
  Uses HTMLBars `compile` function to process a string into a compiled template string.
  The returned string must be passed through `Ngular.HTMLBars.template`.

  This is not present in production builds.

  @private
  @method precompile
  @param {String} templateString This is the string to be compiled by HTMLBars.
*/
export default function(templateString) {
  if (!compileSpec && Ngular.__loader.registry['htmlbars-compiler/compiler']) {
    compileSpec = requireModule('htmlbars-compiler/compiler').compileSpec;
  }

  if (!compileSpec) {
    throw new Error('Cannot call `compileSpec` without the template compiler loaded. Please load `ngular-template-compiler.js` prior to calling `compileSpec`.');
  }

  return compileSpec(templateString, compileOptions());
}
