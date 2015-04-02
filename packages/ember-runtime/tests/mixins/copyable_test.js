import CopyableTests from 'ngular-runtime/tests/suites/copyable';
import Copyable from 'ngular-runtime/mixins/copyable';
import NgularObject from 'ngular-runtime/system/object';
import {generateGuid} from 'ngular-metal/utils';
import {set} from 'ngular-metal/property_set';
import {get} from 'ngular-metal/property_get';

var CopyableObject = NgularObject.extend(Copyable, {

  id: null,

  init() {
    this._super.apply(this, arguments);
    set(this, 'id', generateGuid());
  },

  copy() {
    var ret = new CopyableObject();
    set(ret, 'id', get(this, 'id'));
    return ret;
  }
});

CopyableTests.extend({

  name: 'Copyable Basic Test',

  newObject() {
    return new CopyableObject();
  },

  isEqual(a, b) {
    if (!(a instanceof CopyableObject) || !(b instanceof CopyableObject)) {
      return false;
    }

    return get(a, 'id') === get(b, 'id');
  }
}).run();
