/**
@module ngular
@submodule ngular-htmlbars
*/

import o_create from "ngular-metal/platform/create";

/**
 @private
 @property helpers
*/
var helpers = o_create(null);

/**
@module ngular
@submodule ngular-htmlbars
*/

import Helper from "ngular-htmlbars/system/helper";

/**
  @private
  @method _registerHelper
  @for Ngular.HTMLBars
  @param {String} name
  @param {Object|Function} helperFunc the helper function to add
*/
export function registerHelper(name, helperFunc) {
  var helper;

  if (helperFunc && helperFunc.isHelper) {
    helper = helperFunc;
  } else {
    helper = new Helper(helperFunc);
  }

  helpers[name] = helper;
}

export default helpers;
