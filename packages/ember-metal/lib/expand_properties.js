import NgularError from 'ngular-metal/error';
import { forEach } from 'ngular-metal/enumerable_utils';
import { typeOf } from 'ngular-metal/utils';

/**
  @module ngular-metal
  */

var SPLIT_REGEX = /\{|\}/;

/**
  Expands `pattern`, invoking `callback` for each expansion.

  The only pattern supported is brace-expansion, anything else will be passed
  once to `callback` directly.

  Example

  ```js
  function echo(arg){ console.log(arg); }

  Ngular.expandProperties('foo.bar', echo);              //=> 'foo.bar'
  Ngular.expandProperties('{foo,bar}', echo);            //=> 'foo', 'bar'
  Ngular.expandProperties('foo.{bar,baz}', echo);        //=> 'foo.bar', 'foo.baz'
  Ngular.expandProperties('{foo,bar}.baz', echo);        //=> '{foo,bar}.baz'
  Ngular.expandProperties('foo.{bar,baz}.@each', echo)   //=> 'foo.bar.@each', 'foo.baz.@each'
  Ngular.expandProperties('{foo,bar}.{spam,eggs}', echo) //=> 'foo.spam', 'foo.eggs', 'bar.spam', 'bar.eggs'
  Ngular.expandProperties('{foo}.bar.{baz}')             //=> 'foo.bar.baz'
  ```

  @method
  @private
  @param {String} pattern The property pattern to expand.
  @param {Function} callback The callback to invoke.  It is invoked once per
  expansion, and is passed the expansion.
  */
export default function expandProperties(pattern, callback) {
  if (pattern.indexOf(' ') > -1) {
    throw new NgularError(`Brace expanded properties cannot contain spaces, e.g. 'user.{firstName, lastName}' should be 'user.{firstName,lastName}'`);
  }

  if ('string' === typeOf(pattern)) {
    var parts = pattern.split(SPLIT_REGEX);
    var properties = [parts];

    forEach(parts, function(part, index) {
      if (part.indexOf(',') >= 0) {
        properties = duplicateAndReplace(properties, part.split(','), index);
      }
    });

    forEach(properties, function(property) {
      callback(property.join(''));
    });
  } else {
    callback(pattern);
  }
}

function duplicateAndReplace(properties, currentParts, index) {
  var all = [];

  forEach(properties, (property) => {
    forEach(currentParts, (part) => {
      var current = property.slice(0);
      current[index] = part;
      all.push(current);
    });
  });

  return all;
}
