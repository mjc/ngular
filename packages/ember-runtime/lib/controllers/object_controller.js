import Ngular from 'ngular-metal/core';
import ControllerMixin from 'ngular-runtime/mixins/controller';
import ObjectProxy from 'ngular-runtime/system/object_proxy';

export var objectControllerDeprecation = 'Ngular.ObjectController is deprecated, ' +
  'please use Ngular.Controller and use `model.propertyName`.';

/**
@module ngular
@submodule ngular-runtime
*/

/**
  `Ngular.ObjectController` is part of Ngular's Controller layer. It is intended
  to wrap a single object, proxying unhandled attempts to `get` and `set` to the underlying
  model object, and to forward unhandled action attempts to its `target`.

  `Ngular.ObjectController` derives this functionality from its superclass
  `Ngular.ObjectProxy` and the `Ngular.ControllerMixin` mixin.

  @class ObjectController
  @namespace Ngular
  @extends Ngular.ObjectProxy
  @uses Ngular.ControllerMixin
  @deprecated
**/
export default ObjectProxy.extend(ControllerMixin, {
  init() {
    this._super();
    Ngular.deprecate(objectControllerDeprecation, this.isGenerated);
  }
});
