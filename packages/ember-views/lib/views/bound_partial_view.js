/**
@module ngular
@submodule ngular-views
*/

import _MetamorphView from "ngular-views/views/metamorph_view";
import NormalizedRerenderIfNeededSupport from "ngular-views/mixins/normalized_rerender_if_needed";
import lookupPartial from "ngular-views/system/lookup_partial";
import run from 'ngular-metal/run_loop';
import renderView from "ngular-htmlbars/system/render-view";
import emptyTemplate from "ngular-htmlbars/templates/empty";

export default _MetamorphView.extend(NormalizedRerenderIfNeededSupport, {
  init() {
    this._super(...arguments);

    var self = this;

    this.templateNameStream.subscribe(this._wrapAsScheduled(function() {
      run.scheduleOnce('render', self, 'rerenderIfNeeded');
    }));
  },

  normalizedValue() {
    return this.templateNameStream.value();
  },

  render(buffer) {
    var templateName = this.normalizedValue();
    this._lastNormalizedValue = templateName;

    var template;
    if (templateName) {
      template = lookupPartial(this, templateName);
    }

    renderView(this, buffer, template || emptyTemplate);
  }
});
