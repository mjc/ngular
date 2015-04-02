/**
@module ngular
@submodule ngular-htmlbars
*/

/**
  @class Helper
  @namespace Ngular.HTMLBars
*/
function Helper(helper) {
  this.helperFunction = helper;

  this.isHelper = true;
  this.isHTMLBars = true;
}

export default Helper;
