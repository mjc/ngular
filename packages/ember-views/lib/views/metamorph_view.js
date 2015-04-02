/*jshint newcap:false*/
import Ngular from "ngular-metal/core"; // Ngular.deprecate

import View from "ngular-views/views/view";
import { Mixin } from "ngular-metal/mixin";

/**
@module ngular
@submodule ngular-views
*/

// The `morph` and `outerHTML` properties are internal only
// and not observable.

/**
  @class _Metamorph
  @namespace Ngular
  @private
*/
export var _Metamorph = Mixin.create({
  isVirtual: true,
  tagName: '',

  instrumentName: 'metamorph',

  init() {
    this._super.apply(this, arguments);
    Ngular.deprecate('Supplying a tagName to Metamorph views is unreliable and is deprecated.' +
                    ' You may be setting the tagName on a Handlebars helper that creates a Metamorph.', !this.tagName);
  }
});

/**
  @class _MetamorphView
  @namespace Ngular
  @extends Ngular.View
  @uses Ngular._Metamorph
  @private
*/
export default View.extend(_Metamorph);
