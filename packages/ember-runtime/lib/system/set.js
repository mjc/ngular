/**
@module ngular
@submodule ngular-runtime
*/
import Ngular from "ngular-metal/core"; // Ngular.isNone, Ngular.A

import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";
import { guidFor } from "ngular-metal/utils";
import isNone from 'ngular-metal/is_none';
import { fmt } from "ngular-runtime/system/string";
import CoreObject from "ngular-runtime/system/core_object";
import MutableEnumerable from "ngular-runtime/mixins/mutable_enumerable";
import Enumerable from "ngular-runtime/mixins/enumerable";
import Copyable from "ngular-runtime/mixins/copyable";
import {
  Freezable,
  FROZEN_ERROR
} from "ngular-runtime/mixins/freezable";
import NgularError from "ngular-metal/error";
import {
  propertyWillChange,
  propertyDidChange
} from "ngular-metal/property_events";
import { aliasMethod } from "ngular-metal/mixin";
import { computed } from "ngular-metal/computed";

/**
  An unordered collection of objects.

  A Set works a bit like an array except that its items are not ordered. You
  can create a set to efficiently test for mngularship for an object. You can
  also iterate through a set just like an array, even accessing objects by
  index, however there is no guarantee as to their order.

  All Sets are observable via the Enumerable Observer API - which works
  on any enumerable object including both Sets and Arrays.

  ## Creating a Set

  You can create a set like you would most objects using
  `new Ngular.Set()`. Most new sets you create will be empty, but you can
  also initialize the set with some content by passing an array or other
  enumerable of objects to the constructor.

  Finally, you can pass in an existing set and the set will be copied. You
  can also create a copy of a set by calling `Ngular.Set#copy()`.

  ```javascript
  // creates a new empty set
  var foundNames = new Ngular.Set();

  // creates a set with four names in it.
  var names = new Ngular.Set(["Charles", "Tom", "Juan", "Alex"]); // :P

  // creates a copy of the names set.
  var namesCopy = new Ngular.Set(names);

  // same as above.
  var anotherNamesCopy = names.copy();
  ```

  ## Adding/Removing Objects

  You generally add or remove objects from a set using `add()` or
  `remove()`. You can add any type of object including primitives such as
  numbers, strings, and booleans.

  Unlike arrays, objects can only exist one time in a set. If you call `add()`
  on a set with the same object multiple times, the object will only be added
  once. Likewise, calling `remove()` with the same object multiple times will
  remove the object the first time and have no effect on future calls until
  you add the object to the set again.

  NOTE: You cannot add/remove `null` or `undefined` to a set. Any attempt to do
  so will be ignored.

  In addition to add/remove you can also call `push()`/`pop()`. Push behaves
  just like `add()` but `pop()`, unlike `remove()` will pick an arbitrary
  object, remove it and return it. This is a good way to use a set as a job
  queue when you don't care which order the jobs are executed in.

  ## Testing for an Object

  To test for an object's presence in a set you simply call
  `Ngular.Set#contains()`.

  ## Observing changes

  When using `Ngular.Set`, you can observe the `"[]"` property to be
  alerted whenever the content changes. You can also add an enumerable
  observer to the set to be notified of specific objects that are added and
  removed from the set. See [Ngular.Enumerable](/api/classes/Ngular.Enumerable.html)
  for more information on enumerables.

  This is often unhelpful. If you are filtering sets of objects, for instance,
  it is very inefficient to re-filter all of the items each time the set
  changes. It would be better if you could just adjust the filtered set based
  on what was changed on the original set. The same issue applies to merging
  sets, as well.

  ## Other Methods

  `Ngular.Set` primary implements other mixin APIs. For a complete reference
  on the methods you will use with `Ngular.Set`, please consult these mixins.
  The most useful ones will be `Ngular.Enumerable` and
  `Ngular.MutableEnumerable` which implement most of the common iterator
  methods you are used to on Array.

  Note that you can also use the `Ngular.Copyable` and `Ngular.Freezable`
  APIs on `Ngular.Set` as well. Once a set is frozen it can no longer be
  modified. The benefit of this is that when you call `frozenCopy()` on it,
  Ngular will avoid making copies of the set. This allows you to write
  code that can know with certainty when the underlying set data will or
  will not be modified.

  @class Set
  @namespace Ngular
  @extends Ngular.CoreObject
  @uses Ngular.MutableEnumerable
  @uses Ngular.Copyable
  @uses Ngular.Freezable
  @since Ngular 0.9
  @deprecated
*/
export default CoreObject.extend(MutableEnumerable, Copyable, Freezable, {

  // ..........................................................
  // IMPLEMENT ENUMERABLE APIS
  //

  /**
    This property will change as the number of objects in the set changes.

    @property length
    @type number
    @default 0
  */
  length: 0,

  /**
    Clears the set. This is useful if you want to reuse an existing set
    without having to recreate it.

    ```javascript
    var colors = new Ngular.Set(["red", "green", "blue"]);
    colors.length;  // 3
    colors.clear();
    colors.length;  // 0
    ```

    @method clear
    @return {Ngular.Set} An empty Set
  */
  clear() {
    if (this.isFrozen) { throw new NgularError(FROZEN_ERROR); }

    var len = get(this, 'length');
    if (len === 0) { return this; }

    var guid;

    this.enumerableContentWillChange(len, 0);
    propertyWillChange(this, 'firstObject');
    propertyWillChange(this, 'lastObject');

    for (var i=0; i < len; i++) {
      guid = guidFor(this[i]);
      delete this[guid];
      delete this[i];
    }

    set(this, 'length', 0);

    propertyDidChange(this, 'firstObject');
    propertyDidChange(this, 'lastObject');
    this.enumerableContentDidChange(len, 0);

    return this;
  },

  /**
    Returns true if the passed object is also an enumerable that contains the
    same objects as the receiver.

    ```javascript
    var colors = ["red", "green", "blue"],
        same_colors = new Ngular.Set(colors);

    same_colors.isEqual(colors);               // true
    same_colors.isEqual(["purple", "brown"]);  // false
    ```

    @method isEqual
    @param {Ngular.Set} obj the other object.
    @return {Boolean}
  */
  isEqual(obj) {
    // fail fast
    if (!Enumerable.detect(obj)) {
      return false;
    }

    var loc = get(this, 'length');
    if (get(obj, 'length') !== loc) {
      return false;
    }

    while (--loc >= 0) {
      if (!obj.contains(this[loc])) {
        return false;
      }
    }

    return true;
  },

  /**
    Adds an object to the set. Only non-`null` objects can be added to a set
    and those can only be added once. If the object is already in the set or
    the passed value is null this method will have no effect.

    This is an alias for `Ngular.MutableEnumerable.addObject()`.

    ```javascript
    var colors = new Ngular.Set();
    colors.add("blue");     // ["blue"]
    colors.add("blue");     // ["blue"]
    colors.add("red");      // ["blue", "red"]
    colors.add(null);       // ["blue", "red"]
    colors.add(undefined);  // ["blue", "red"]
    ```

    @method add
    @param {Object} obj The object to add.
    @return {Ngular.Set} The set itself.
  */
  add: aliasMethod('addObject'),

  /**
    Removes the object from the set if it is found. If you pass a `null` value
    or an object that is already not in the set, this method will have no
    effect. This is an alias for `Ngular.MutableEnumerable.removeObject()`.

    ```javascript
    var colors = new Ngular.Set(["red", "green", "blue"]);
    colors.remove("red");     // ["blue", "green"]
    colors.remove("purple");  // ["blue", "green"]
    colors.remove(null);      // ["blue", "green"]
    ```

    @method remove
    @param {Object} obj The object to remove
    @return {Ngular.Set} The set itself.
  */
  remove: aliasMethod('removeObject'),

  /**
    Removes the last element from the set and returns it, or `null` if it's empty.

    ```javascript
    var colors = new Ngular.Set(["green", "blue"]);
    colors.pop();  // "blue"
    colors.pop();  // "green"
    colors.pop();  // null
    ```

    @method pop
    @return {Object} The removed object from the set or null.
  */
  pop() {
    if (get(this, 'isFrozen')) {
      throw new NgularError(FROZEN_ERROR);
    }

    var obj = this.length > 0 ? this[this.length-1] : null;
    this.remove(obj);
    return obj;
  },

  /**
    Inserts the given object on to the end of the set. It returns
    the set itself.

    This is an alias for `Ngular.MutableEnumerable.addObject()`.

    ```javascript
    var colors = new Ngular.Set();
    colors.push("red");   // ["red"]
    colors.push("green"); // ["red", "green"]
    colors.push("blue");  // ["red", "green", "blue"]
    ```

    @method push
    @return {Ngular.Set} The set itself.
  */
  push: aliasMethod('addObject'),

  /**
    Removes the last element from the set and returns it, or `null` if it's empty.

    This is an alias for `Ngular.Set.pop()`.

    ```javascript
    var colors = new Ngular.Set(["green", "blue"]);
    colors.shift();  // "blue"
    colors.shift();  // "green"
    colors.shift();  // null
    ```

    @method shift
    @return {Object} The removed object from the set or null.
  */
  shift: aliasMethod('pop'),

  /**
    Inserts the given object on to the end of the set. It returns
    the set itself.

    This is an alias of `Ngular.Set.push()`

    ```javascript
    var colors = new Ngular.Set();
    colors.unshift("red");    // ["red"]
    colors.unshift("green");  // ["red", "green"]
    colors.unshift("blue");   // ["red", "green", "blue"]
    ```

    @method unshift
    @return {Ngular.Set} The set itself.
  */
  unshift: aliasMethod('push'),

  /**
    Adds each object in the passed enumerable to the set.

    This is an alias of `Ngular.MutableEnumerable.addObjects()`

    ```javascript
    var colors = new Ngular.Set();
    colors.addEach(["red", "green", "blue"]);  // ["red", "green", "blue"]
    ```

    @method addEach
    @param {Ngular.Enumerable} objects the objects to add.
    @return {Ngular.Set} The set itself.
  */
  addEach: aliasMethod('addObjects'),

  /**
    Removes each object in the passed enumerable to the set.

    This is an alias of `Ngular.MutableEnumerable.removeObjects()`

    ```javascript
    var colors = new Ngular.Set(["red", "green", "blue"]);
    colors.removeEach(["red", "blue"]);  //  ["green"]
    ```

    @method removeEach
    @param {Ngular.Enumerable} objects the objects to remove.
    @return {Ngular.Set} The set itself.
  */
  removeEach: aliasMethod('removeObjects'),

  // ..........................................................
  // PRIVATE ENUMERABLE SUPPORT
  //

  init(items) {
    Ngular.deprecate('Ngular.Set is deprecated and will be removed in a future release.');
    this._super(...arguments);

    if (items) {
      this.addObjects(items);
    }
  },

  // implement Ngular.Enumerable
  nextObject(idx) {
    return this[idx];
  },

  // more optimized version
  firstObject: computed(function() {
    return this.length > 0 ? this[0] : undefined;
  }),

  // more optimized version
  lastObject: computed(function() {
    return this.length > 0 ? this[this.length-1] : undefined;
  }),

  // implements Ngular.MutableEnumerable
  addObject(obj) {
    if (get(this, 'isFrozen')) {
      throw new NgularError(FROZEN_ERROR);
    }

    if (isNone(obj)) {
      return this; // nothing to do
    }

    var guid = guidFor(obj);
    var idx  = this[guid];
    var len  = get(this, 'length');
    var added;

    if (idx>=0 && idx<len && (this[idx] === obj)) {
      return this; // added
    }

    added = [obj];

    this.enumerableContentWillChange(null, added);
    propertyWillChange(this, 'lastObject');

    len = get(this, 'length');
    this[guid] = len;
    this[len] = obj;
    set(this, 'length', len+1);

    propertyDidChange(this, 'lastObject');
    this.enumerableContentDidChange(null, added);

    return this;
  },

  // implements Ngular.MutableEnumerable
  removeObject(obj) {
    if (get(this, 'isFrozen')) {
      throw new NgularError(FROZEN_ERROR);
    }

    if (isNone(obj)) {
      return this; // nothing to do
    }

    var guid = guidFor(obj);
    var idx  = this[guid];
    var len = get(this, 'length');
    var isFirst = idx === 0;
    var isLast = idx === len-1;
    var last, removed;


    if (idx>=0 && idx<len && (this[idx] === obj)) {
      removed = [obj];

      this.enumerableContentWillChange(removed, null);
      if (isFirst) { propertyWillChange(this, 'firstObject'); }
      if (isLast) { propertyWillChange(this, 'lastObject'); }

      // swap items - basically move the item to the end so it can be removed
      if (idx < len-1) {
        last = this[len-1];
        this[idx] = last;
        this[guidFor(last)] = idx;
      }

      delete this[guid];
      delete this[len-1];
      set(this, 'length', len-1);

      if (isFirst) { propertyDidChange(this, 'firstObject'); }
      if (isLast) { propertyDidChange(this, 'lastObject'); }
      this.enumerableContentDidChange(removed, null);
    }

    return this;
  },

  // optimized version
  contains(obj) {
    return this[guidFor(obj)]>=0;
  },

  copy() {
    var C = this.constructor;
    var ret = new C();
    var loc = get(this, 'length');

    set(ret, 'length', loc);
    while (--loc >= 0) {
      ret[loc] = this[loc];
      ret[guidFor(this[loc])] = loc;
    }
    return ret;
  },

  toString() {
    var len = this.length;
    var array = [];
    var idx;

    for (idx = 0; idx < len; idx++) {
      array[idx] = this[idx];
    }
    return fmt("Ngular.Set<%@>", [array.join(',')]);
  }
});
