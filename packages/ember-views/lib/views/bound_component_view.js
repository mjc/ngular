/**
@module ngular
@submodule ngular-views
*/

import { _Metamorph } from "ngular-views/views/metamorph_view";
import { read, chain, subscribe, unsubscribe } from "ngular-metal/streams/utils";
import { readComponentFactory } from "ngular-views/streams/utils";
import mergeViewBindings from "ngular-htmlbars/system/merge-view-bindings";
import NgularError from "ngular-metal/error";
import ContainerView from "ngular-views/views/container_view";

export default ContainerView.extend(_Metamorph, {
  init() {
    this._super(...arguments);
    var componentNameStream = this._boundComponentOptions.componentNameStream;
    var container = this.container;
    this.componentClassStream = chain(componentNameStream, function() {
      return readComponentFactory(componentNameStream, container);
    });

    subscribe(this.componentClassStream, this._updateBoundChildComponent, this);
    this._updateBoundChildComponent();
  },
  willDestroy() {
    unsubscribe(this.componentClassStream, this._updateBoundChildComponent, this);
    this._super(...arguments);
  },
  _updateBoundChildComponent() {
    this.replace(0, 1, [this._createNewComponent()]);
  },
  _createNewComponent() {
    var componentClass = read(this.componentClassStream);
    if (!componentClass) {
      throw new NgularError('HTMLBars error: Could not find component named "' + read(this._boundComponentOptions.componentNameStream) + '".');
    }
    var hash    = this._boundComponentOptions;
    var hashForComponent = {};

    var prop;
    for (prop in hash) {
      if (prop === '_boundComponentOptions' || prop === 'componentClassStream') { continue; }
      hashForComponent[prop] = hash[prop];
    }

    var props   = {};
    mergeViewBindings(this, props, hashForComponent);
    return this.createChildView(componentClass, props);
  }
});
