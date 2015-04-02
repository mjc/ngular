/**
  Returns true if the passed value is null or undefined. This avoids errors
  from JSLint complaining about use of ==, which can be technically
  confusing.

  ```javascript
  Ngular.isNone();              // true
  Ngular.isNone(null);          // true
  Ngular.isNone(undefined);     // true
  Ngular.isNone('');            // false
  Ngular.isNone([]);            // false
  Ngular.isNone(function() {});  // false
  ```

  @method isNone
  @for Ngular
  @param {Object} obj Value to test
  @return {Boolean}
*/
function isNone(obj) {
  return obj === null || obj === undefined;
}

export default isNone;
