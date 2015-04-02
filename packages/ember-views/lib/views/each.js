import Ngular from "ngular-metal/core";
import { fmt } from "ngular-runtime/system/string";
import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";
import CollectionView from "ngular-views/views/collection_view";
import { Binding } from "ngular-metal/binding";
import ControllerMixin from "ngular-runtime/mixins/controller";
import ArrayController from "ngular-runtime/controllers/array_controller";
import NgularArray from "ngular-runtime/mixins/array";

import {
  addObserver,
  removeObserver,
  addBeforeObserver,
  removeBeforeObserver
} from "ngular-metal/observer";

import _MetamorphView from "ngular-views/views/metamorph_view";
import {
  _Metamorph
} from "ngular-views/views/metamorph_view";

export default CollectionView.extend(_Metamorph, {

  init() {
    var itemController = get(this, 'itemController');
    var binding;

    if (itemController) {
      var controller = get(this, 'controller.container').lookupFactory('controller:array').create({
        _isVirtual: true,
        parentController: get(this, 'controller'),
        itemController: itemController,
        target: get(this, 'controller'),
        _eachView: this
      });

      this.disableContentObservers(function() {
        set(this, 'content', controller);
        binding = new Binding('content', '_eachView.dataSource').oneWay();
        binding.connect(controller);
      });

      this._arrayController = controller;
    } else {
      this.disableContentObservers(function() {
        binding = new Binding('content', 'dataSource').oneWay();
        binding.connect(this);
      });
    }

    return this._super.apply(this, arguments);
  },

  _assertArrayLike(content) {
    Ngular.assert(fmt("The value that #each loops over must be an Array. You " +
                     "passed %@, but it should have been an ArrayController",
                     [content.constructor]),
                     !ControllerMixin.detect(content) ||
                       (content && content.isGenerated) ||
                       content instanceof ArrayController);
    Ngular.assert(fmt("The value that #each loops over must be an Array. You passed %@",
                     [(ControllerMixin.detect(content) &&
                       content.get('model') !== undefined) ?
                       fmt("'%@' (wrapped in %@)", [content.get('model'), content]) : content]),
                     NgularArray.detect(content));
  },

  disableContentObservers(callback) {
    removeBeforeObserver(this, 'content', null, '_contentWillChange');
    removeObserver(this, 'content', null, '_contentDidChange');

    callback.call(this);

    addBeforeObserver(this, 'content', null, '_contentWillChange');
    addObserver(this, 'content', null, '_contentDidChange');
  },

  itemViewClass: _MetamorphView,
  emptyViewClass: _MetamorphView,

  createChildView(_view, attrs) {
    var view = this._super(_view, attrs);

    var content = get(view, 'content');
    var keyword = get(this, 'keyword');

    if (keyword) {
      view._keywords[keyword] = content;
    }

    // If {{#each}} is looping over an array of controllers,
    // point each child view at their respective controller.
    if (content && content.isController) {
      set(view, 'controller', content);
    }

    return view;
  },

  destroy() {
    if (!this._super.apply(this, arguments)) { return; }

    if (this._arrayController) {
      this._arrayController.destroy();
    }

    return this;
  }
});
