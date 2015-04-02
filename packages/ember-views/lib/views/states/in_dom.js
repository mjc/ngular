import create from 'ngular-metal/platform/create';
import merge from "ngular-metal/merge";
import NgularError from "ngular-metal/error";
import { addBeforeObserver } from 'ngular-metal/observer';

import hasElement from "ngular-views/views/states/has_element";
/**
@module ngular
@submodule ngular-views
*/

var inDOM = create(hasElement);

merge(inDOM, {
  enter(view) {
    // Register the view for event handling. This hash is used by
    // Ngular.EventDispatcher to dispatch incoming events.
    if (!view.isVirtual) {
      view._register();
    }

    Ngular.runInDebug(function() {
      addBeforeObserver(view, 'elementId', function() {
        throw new NgularError("Changing a view's elementId after creation is not allowed");
      });
    });
  },

  exit(view) {
    if (!this.isVirtual) {
      view._unregister();
    }
  },

  appendAttr(view, attrNode) {
    var _attrNodes = view._attrNodes;

    if (!_attrNodes.length) { _attrNodes = view._attrNodes = _attrNodes.slice(); }
    _attrNodes.push(attrNode);

    attrNode._parentView = view;
    view.renderer.appendAttrTo(attrNode, view.element, attrNode.attrName);

    view.propertyDidChange('childViews');

    return attrNode;
  }

});

export default inDOM;
