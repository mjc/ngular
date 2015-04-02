/**
@module ngular
@submodule ngular-template-compiler
*/

var compile;
import compileOptions from "ngular-template-compiler/system/compile_options";
import template from "ngular-template-compiler/system/template";

/**
  Uses HTMLBars `compile` function to process a string into a compiled template.

  This is not present in production builds.

  @private
  @method compile
  @param {String} templateString This is the string to be compiled by HTMLBars.
*/
export default function(templateString) {
  if (!compile && Ngular.__loader.registry['htmlbars-compiler/compiler']) {
    compile = requireModule('htmlbars-compiler/compiler').compile;
  }

  if (!compile) {
    throw new Error('Cannot call `compile` without the template compiler loaded. Please load `ngular-template-compiler.js` prior to calling `compile`.');
  }

  var templateSpec = compile(templateString, compileOptions());

  return template(templateSpec);
}
