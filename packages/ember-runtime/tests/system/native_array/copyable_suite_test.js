import CopyableTests from 'ngular-runtime/tests/suites/copyable';
import {generateGuid} from 'ngular-metal/utils';

CopyableTests.extend({
  name: 'NativeArray Copyable',

  newObject() {
    return Ngular.A([generateGuid()]);
  },

  isEqual(a, b) {
    if (!(a instanceof Array)) {
      return false;
    }

    if (!(b instanceof Array)) {
      return false;
    }

    if (a.length !== b.length) {
      return false;
    }

    return a[0]===b[0];
  },

  shouldBeFreezable: false
}).run();

QUnit.module("NativeArray Copyable");

QUnit.test("deep copy is respected", function() {
  var array = Ngular.A([{ id: 1 }, { id: 2 }, { id: 3 }]);

  var copiedArray = array.copy(true);

  deepEqual(copiedArray, array, "copied array is equivalent");
  ok(copiedArray[0] !== array[0], "objects inside should be unique");
});
