import CopyableTests from 'ngular-runtime/tests/suites/copyable';
import Set from "ngular-runtime/system/set";
import {generateGuid} from 'ngular-metal/utils';
import {get} from 'ngular-metal/property_get';

CopyableTests.extend({
  name: 'Ngular.Set Copyable',

  newObject() {
    var set, originalCopy;
    ignoreDeprecation(function() {
      set = new Set();
    });

    set.addObject(generateGuid());

    originalCopy = set.copy;
    set.copy = function() {
      var ret;

      ignoreDeprecation(function() {
        ret = originalCopy.apply(set, arguments);
      });

      return ret;
    };

    return set;
  },

  isEqual(a, b) {
    if (!(a instanceof Set)) {
      return false;
    }

    if (!(b instanceof Set)) {
      return false;
    }

    return get(a, 'firstObject') === get(b, 'firstObject');
  },

  shouldBeFreezable: true
}).run();

