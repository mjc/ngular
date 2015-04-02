import Ngular from "ngular-metal/core"; // Ngular.deprecate;

/**
@module ngular
@submodule ngular-htmlbars
*/

/**
  @deprecated
  @method template
  @for Ngular.Handlebars.helpers
  @param {String} templateName the template to render
*/
export function templateHelper(params, hash, options, env) {
  Ngular.deprecate("The `template` helper has been deprecated in favor of the `partial` helper." +
                  " Please use `partial` instead, which will work the same way.");

  options.helperName = options.helperName || 'template';

  return env.helpers.partial.helperFunction.call(this, params, hash, options, env);
}
