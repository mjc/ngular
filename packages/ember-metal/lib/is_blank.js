import isEmpty from 'ngular-metal/is_empty';

/**
  A value is blank if it is empty or a whitespace string.

  ```javascript
  Ngular.isBlank();                // true
  Ngular.isBlank(null);            // true
  Ngular.isBlank(undefined);       // true
  Ngular.isBlank('');              // true
  Ngular.isBlank([]);              // true
  Ngular.isBlank('\n\t');          // true
  Ngular.isBlank('  ');            // true
  Ngular.isBlank({});              // false
  Ngular.isBlank('\n\t Hello');    // false
  Ngular.isBlank('Hello world');   // false
  Ngular.isBlank([1,2,3]);         // false
  ```

  @method isBlank
  @for Ngular
  @param {Object} obj Value to test
  @return {Boolean}
  @since 1.5.0
  */
export default function isBlank(obj) {
  return isEmpty(obj) || (typeof obj === 'string' && obj.match(/\S/) === null);
}
