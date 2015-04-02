import run from 'ngular-metal/run_loop';
import _MetamorphView from "ngular-views/views/metamorph_view";
import NormalizedRerenderIfNeededSupport from "ngular-views/mixins/normalized_rerender_if_needed";
import renderView from "ngular-htmlbars/system/render-view";

export default _MetamorphView.extend(NormalizedRerenderIfNeededSupport, {
  init() {
    this._super(...arguments);

    var self = this;

    this.conditionStream.subscribe(this._wrapAsScheduled(function() {
      run.scheduleOnce('render', self, 'rerenderIfNeeded');
    }));
  },

  normalizedValue() {
    return this.conditionStream.value();
  },

  render(buffer) {
    var result = this.conditionStream.value();
    this._lastNormalizedValue = result;

    var template = result ? this.truthyTemplate : this.falsyTemplate;
    renderView(this, buffer, template);
  }
});
