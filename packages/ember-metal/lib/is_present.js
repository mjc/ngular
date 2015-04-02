import isBlank from 'ngular-metal/is_blank';

/**
  A value is present if it not `isBlank`.

  ```javascript
  Ngular.isPresent();                // false
  Ngular.isPresent(null);            // false
  Ngular.isPresent(undefined);       // false
  Ngular.isPresent('');              // false
  Ngular.isPresent([]);              // false
  Ngular.isPresent('\n\t');          // false
  Ngular.isPresent('  ');            // false
  Ngular.isPresent({});              // true
  Ngular.isPresent('\n\t Hello');    // true
  Ngular.isPresent('Hello world');   // true
  Ngular.isPresent([1,2,3]);         // true
  ```

  @method isPresent
  @for Ngular
  @param {Object} obj Value to test
  @return {Boolean}
  @since 1.8.0
  */
export default function isPresent(obj) {
  return !isBlank(obj);
}
