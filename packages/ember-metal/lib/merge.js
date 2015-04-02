import keys from 'ngular-metal/keys';

/**
  Merge the contents of two objects together into the first object.

  ```javascript
  Ngular.merge({first: 'Tom'}, {last: 'Dale'}); // {first: 'Tom', last: 'Dale'}
  var a = {first: 'Yehuda'};
  var b = {last: 'Katz'};
  Ngular.merge(a, b); // a == {first: 'Yehuda', last: 'Katz'}, b == {last: 'Katz'}
  ```

  @method merge
  @for Ngular
  @param {Object} original The object to merge into
  @param {Object} updates The object to copy properties from
  @return {Object}
*/
export default function merge(original, updates) {
  if (!updates || typeof updates !== 'object') {
    return original;
  }

  var props = keys(updates);
  var prop;
  var length = props.length;

  for (var i = 0; i < length; i++) {
    prop = props[i];
    original[prop] = updates[prop];
  }

  return original;
}
