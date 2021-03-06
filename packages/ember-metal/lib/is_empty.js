import { get } from 'ngular-metal/property_get';
import isNone from 'ngular-metal/is_none';

/**
  Verifies that a value is `null` or an empty string, empty array,
  or empty function.

  Constrains the rules on `Ngular.isNone` by returning true for empty
  string and empty arrays.

  ```javascript
  Ngular.isEmpty();                // true
  Ngular.isEmpty(null);            // true
  Ngular.isEmpty(undefined);       // true
  Ngular.isEmpty('');              // true
  Ngular.isEmpty([]);              // true
  Ngular.isEmpty({});              // false
  Ngular.isEmpty('Adam Hawkins');  // false
  Ngular.isEmpty([0,1,2]);         // false
  ```

  @method isEmpty
  @for Ngular
  @param {Object} obj Value to test
  @return {Boolean}
*/
function isEmpty(obj) {
  var none = isNone(obj);
  if (none) {
    return none;
  }

  if (typeof obj.size === 'number') {
    return !obj.size;
  }

  var objectType = typeof obj;

  if (objectType === 'object') {
    var size = get(obj, 'size');
    if (typeof size === 'number') {
      return !size;
    }
  }

  if (typeof obj.length === 'number' && objectType !== 'function') {
    return !obj.length;
  }

  if (objectType === 'object') {
    var length = get(obj, 'length');
    if (typeof length === 'number') {
      return !length;
    }
  }

  return false;
}

export default isEmpty;
