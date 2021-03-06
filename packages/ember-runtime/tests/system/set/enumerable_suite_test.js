import MutableEnumerableTests from 'ngular-runtime/tests/suites/mutable_enumerable';
import Set from "ngular-runtime/system/set";
import {get} from "ngular-metal/property_get";

MutableEnumerableTests.extend({

  name: 'Ngular.Set',

  newObject(ary) {
    var ret;
    ary = ary ? ary.slice() : this.newFixture(3);

    ignoreDeprecation(function() {
      ret =  new Set();
      ret.addObjects(ary);
    });

    return ret;
  },

  mutate(obj) {
    ignoreDeprecation(function() {
      obj.addObject(get(obj, 'length')+1);
    });
  },

  toArray(obj) {
    var ret;

    ignoreDeprecation(function() {
      ret = obj.toArray ? obj.toArray() : obj.slice(); // make a copy.
    });

    return ret;
  }

}).run();
