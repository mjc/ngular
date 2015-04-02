/**
@module ngular
@submodule ngular-views
*/

import { set } from "ngular-metal/property_set";
import _MetamorphView from "ngular-views/views/metamorph_view";
import NormalizedRerenderIfNeededSupport from "ngular-views/mixins/normalized_rerender_if_needed";
import run from 'ngular-metal/run_loop';
import renderView from "ngular-htmlbars/system/render-view";

export default _MetamorphView.extend(NormalizedRerenderIfNeededSupport, {
  init() {
    this._super(...arguments);

    var self = this;

    this.withValue.subscribe(this._wrapAsScheduled(function() {
      run.scheduleOnce('render', self, 'rerenderIfNeeded');
    }));

    var controllerName = this.controllerName;
    if (controllerName) {
      var controllerFactory = this.container.lookupFactory('controller:'+controllerName);
      var controller = controllerFactory.create({
        parentController: this.previousContext,
        target: this.previousContext
      });

      this._generatedController = controller;

      if (this.preserveContext) {
        this._blockArguments = [controller];
        this.withValue.subscribe(function(modelStream) {
          set(controller, 'model', modelStream.value());
        });
      } else {
        set(this, 'controller', controller);
      }

      set(controller, 'model', this.withValue.value());
    } else {
      if (this.preserveContext) {
        this._blockArguments = [this.withValue];
      }
    }
  },

  normalizedValue() {
    return this.withValue.value();
  },

  render(buffer) {
    var withValue = this.normalizedValue();
    this._lastNormalizedValue = withValue;

    if (!this.preserveContext && !this.controllerName) {
      set(this, '_context', withValue);
    }

    var template = withValue ? this.mainTemplate : this.inverseTemplate;
    renderView(this, buffer, template);
  },

  willDestroy() {
    this._super(...arguments);

    if (this._generatedController) {
      this._generatedController.destroy();
    }
  }
});
