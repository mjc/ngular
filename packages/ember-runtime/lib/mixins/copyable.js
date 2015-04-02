/**
@module ngular
@submodule ngular-runtime
*/


import { get } from "ngular-metal/property_get";
import { Mixin } from "ngular-metal/mixin";
import { Freezable } from "ngular-runtime/mixins/freezable";
import { fmt } from "ngular-runtime/system/string";
import NgularError from 'ngular-metal/error';


/**
  Implements some standard methods for copying an object. Add this mixin to
  any object you create that can create a copy of itself. This mixin is
  added automatically to the built-in array.

  You should generally implement the `copy()` method to return a copy of the
  receiver.

  Note that `frozenCopy()` will only work if you also implement
  `Ngular.Freezable`.

  @class Copyable
  @namespace Ngular
  @since Ngular 0.9
*/
export default Mixin.create({
  /**
    __Required.__ You must implement this method to apply this mixin.

    Override to return a copy of the receiver. Default implementation raises
    an exception.

    @method copy
    @param {Boolean} deep if `true`, a deep copy of the object should be made
    @return {Object} copy of receiver
  */
  copy: null,

  /**
    If the object implements `Ngular.Freezable`, then this will return a new
    copy if the object is not frozen and the receiver if the object is frozen.

    Raises an exception if you try to call this method on a object that does
    not support freezing.

    You should use this method whenever you want a copy of a freezable object
    since a freezable object can simply return itself without actually
    consuming more memory.

    @method frozenCopy
    @return {Object} copy of receiver or receiver
  */
  frozenCopy() {
    if (Freezable && Freezable.detect(this)) {
      return get(this, 'isFrozen') ? this : this.copy().freeze();
    } else {
      throw new NgularError(fmt("%@ does not support freezing", [this]));
    }
  }
});
