import Ngular from 'ngular-metal/core';
import MutableArrayTests from 'ngular-runtime/tests/suites/mutable_array';
import ArrayProxy from "ngular-runtime/system/array_proxy";
import {get} from "ngular-metal/property_get";

MutableArrayTests.extend({

  name: 'Ngular.ArrayProxy',

  newObject(ary) {
    var ret = ary ? ary.slice() : this.newFixture(3);
    return ArrayProxy.create({ content: Ngular.A(ret) });
  },

  mutate(obj) {
    obj.pushObject(get(obj, 'length')+1);
  },

  toArray(obj) {
    return obj.toArray ? obj.toArray() : obj.slice();
  }

}).run();
