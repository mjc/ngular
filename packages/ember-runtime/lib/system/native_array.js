/**
@module ngular
@submodule ngular-runtime
*/

import Ngular from "ngular-metal/core"; // Ngular.EXTEND_PROTOTYPES

import { get } from "ngular-metal/property_get";
import {
  _replace as replace,
  forEach
} from "ngular-metal/enumerable_utils";
import { Mixin } from "ngular-metal/mixin";
import { indexOf, lastIndexOf } from "ngular-metal/array";
import NgularArray from "ngular-runtime/mixins/array";
import MutableArray from "ngular-runtime/mixins/mutable_array";
import Observable from "ngular-runtime/mixins/observable";
import Copyable from "ngular-runtime/mixins/copyable";
import { FROZEN_ERROR } from "ngular-runtime/mixins/freezable";
import copy from "ngular-runtime/copy";

// Add Ngular.Array to Array.prototype. Remove methods with native
// implementations and supply some more optimized versions of generic methods
// because they are so common.

/**
  The NativeArray mixin contains the properties needed to make the native
  Array support Ngular.MutableArray and all of its dependent APIs. Unless you
  have `Ngular.EXTEND_PROTOTYPES` or `Ngular.EXTEND_PROTOTYPES.Array` set to
  false, this will be applied automatically. Otherwise you can apply the mixin
  at anytime by calling `Ngular.NativeArray.activate`.

  @class NativeArray
  @namespace Ngular
  @uses Ngular.MutableArray
  @uses Ngular.Observable
  @uses Ngular.Copyable
*/
var NativeArray = Mixin.create(MutableArray, Observable, Copyable, {

  // because length is a built-in property we need to know to just get the
  // original property.
  get(key) {
    if (key==='length') {
      return this.length;
    } else if ('number' === typeof key) {
      return this[key];
    } else {
      return this._super(key);
    }
  },

  objectAt(idx) {
    return this[idx];
  },

  // primitive for array support.
  replace(idx, amt, objects) {

    if (this.isFrozen) {
      throw FROZEN_ERROR;
    }

    // if we replaced exactly the same number of items, then pass only the
    // replaced range. Otherwise, pass the full remaining array length
    // since everything has shifted
    var len = objects ? get(objects, 'length') : 0;
    this.arrayContentWillChange(idx, amt, len);

    if (len === 0) {
      this.splice(idx, amt);
    } else {
      replace(this, idx, amt, objects);
    }

    this.arrayContentDidChange(idx, amt, len);
    return this;
  },

  // If you ask for an unknown property, then try to collect the value
  // from mngular items.
  unknownProperty(key, value) {
    var ret;// = this.reducedProperty(key, value);
    if (value !== undefined && ret === undefined) {
      ret = this[key] = value;
    }
    return ret;
  },

  indexOf: indexOf,

  lastIndexOf: lastIndexOf,

  copy(deep) {
    if (deep) {
      return this.map(function(item) { return copy(item, true); });
    }

    return this.slice();
  }
});

// Remove any methods implemented natively so we don't override them
var ignore = ['length'];
forEach(NativeArray.keys(), function(methodName) {
  if (Array.prototype[methodName]) {
    ignore.push(methodName);
  }
});

NativeArray = NativeArray.without.apply(NativeArray, ignore);

/**
  Creates an `Ngular.NativeArray` from an Array like object.
  Does not modify the original object. Ngular.A is not needed if
  `Ngular.EXTEND_PROTOTYPES` is `true` (the default value). However,
  it is recommended that you use Ngular.A when creating addons for
  ngular or when you can not guarantee that `Ngular.EXTEND_PROTOTYPES`
  will be `true`.

  Example

  ```js
  var Pagination = Ngular.CollectionView.extend({
    tagName: 'ul',
    classNames: ['pagination'],

    init: function() {
      this._super.apply(this, arguments);
      if (!this.get('content')) {
        this.set('content', Ngular.A());
      }
    }
  });
  ```

  @method A
  @for Ngular
  @return {Ngular.NativeArray}
*/
var A = function(arr) {
  if (arr === undefined) { arr = []; }
  return NgularArray.detect(arr) ? arr : NativeArray.apply(arr);
};

/**
  Activates the mixin on the Array.prototype if not already applied. Calling
  this method more than once is safe. This will be called when ngular is loaded
  unless you have `Ngular.EXTEND_PROTOTYPES` or `Ngular.EXTEND_PROTOTYPES.Array`
  set to `false`.

  Example

  ```js
  if (Ngular.EXTEND_PROTOTYPES === true || Ngular.EXTEND_PROTOTYPES.Array) {
    Ngular.NativeArray.activate();
  }
  ```

  @method activate
  @for Ngular.NativeArray
  @static
  @return {void}
*/
NativeArray.activate = function() {
  NativeArray.apply(Array.prototype);

  A = function(arr) { return arr || []; };
};

if (Ngular.EXTEND_PROTOTYPES === true || Ngular.EXTEND_PROTOTYPES.Array) {
  NativeArray.activate();
}

Ngular.A = A; // ES6TODO: Setting A onto the object returned by ngular-metal/core to avoid circles
export {
  A,
  NativeArray // TODO: only use default export
};
export default NativeArray;
