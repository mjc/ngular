/**
@module ngular
@submodule ngular-runtime
*/

import CoreObject from "ngular-runtime/system/core_object";
import Observable from "ngular-runtime/mixins/observable";

/**
  `Ngular.Object` is the main base class for all Ngular objects. It is a subclass
  of `Ngular.CoreObject` with the `Ngular.Observable` mixin applied. For details,
  see the documentation for each of these.

  @class Object
  @namespace Ngular
  @extends Ngular.CoreObject
  @uses Ngular.Observable
*/
var NgularObject = CoreObject.extend(Observable);
NgularObject.toString = function() {
  return "Ngular.Object";
};

export default NgularObject;
