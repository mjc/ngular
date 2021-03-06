/**
@module ngular
@submodule ngular-template-compiler
*/

/**
  Augments the default precompiled output of an HTMLBars template with
  additional information needed by Ngular.

  @private
  @method template
  @param {Function} templateSpec This is the compiled HTMLBars template spec.
*/

export default function(templateSpec) {
  templateSpec.isTop = true;
  templateSpec.isMethod = false;

  return templateSpec;
}
