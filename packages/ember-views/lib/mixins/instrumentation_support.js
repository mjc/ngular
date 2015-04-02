/**
@module ngular
@submodule ngular-views
*/
import { Mixin } from "ngular-metal/mixin";
import { computed } from "ngular-metal/computed";
import { get } from "ngular-metal/property_get";

/**
  @class InstrumentationSupport
  @namespace Ngular
*/
var InstrumentationSupport = Mixin.create({
  /**
    Used to identify this view during debugging

    @property instrumentDisplay
    @type String
  */
  instrumentDisplay: computed(function() {
    if (this.helperName) {
      return '{{' + this.helperName + '}}';
    }
  }),

  instrumentName: 'view',

  instrumentDetails(hash) {
    hash.template = get(this, 'templateName');
    this._super(hash);
  }
});

export default InstrumentationSupport;
