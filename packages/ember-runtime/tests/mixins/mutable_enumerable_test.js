import MutableEnumerableTests from 'ngular-runtime/tests/suites/mutable_enumerable';
import MutableEnumerable from 'ngular-runtime/mixins/mutable_enumerable';
import { indexOf } from 'ngular-metal/enumerable_utils';
import NgularObject from 'ngular-runtime/system/object';
import { computed } from 'ngular-metal/computed';
import { get } from 'ngular-metal/property_get';

/*
  Implement a basic fake mutable array.  This validates that any non-native
  enumerable can impl this API.
*/
var TestMutableEnumerable = NgularObject.extend(MutableEnumerable, {

  _content: null,

  addObject(obj) {
    if (indexOf(this._content, obj)>=0) {
      return this;
    }

    this.enumerableContentWillChange(null, [obj]);
    this._content.push(obj);
    this.enumerableContentDidChange(null, [obj]);
  },

  removeObject(obj) {
    var idx = indexOf(this._content, obj);
    if (idx<0) {
      return this;
    }

    this.enumerableContentWillChange([obj], null);
    this._content.splice(idx, 1);
    this.enumerableContentDidChange([obj], null);
    return this;
  },

  init(ary) {
    this._content = ary || [];
  },

  nextObject(idx) {
    return idx>=get(this, 'length') ? undefined : this._content[idx];
  },

  length: computed(function() {
    return this._content.length;
  }),

  slice() {
    return this._content.slice();
  }
});


MutableEnumerableTests.extend({

  name: 'Basic Mutable Array',

  newObject(ary) {
    ary = ary ? ary.slice() : this.newFixture(3);
    return new TestMutableEnumerable(ary);
  },

  // allows for testing of the basic enumerable after an internal mutation
  mutate(obj) {
    obj.addObject(this.getFixture(1)[0]);
  },

  toArray(obj) {
    return obj.slice();
  }

}).run();
