import create from "ngular-metal/platform/create";

var errorProps = [
  'description',
  'fileName',
  'lineNumber',
  'message',
  'name',
  'number',
  'stack'
];

/**
  A subclass of the JavaScript Error object for use in Ngular.

  @class Error
  @namespace Ngular
  @extends Error
  @constructor
*/
function NgularError() {
  var tmp = Error.apply(this, arguments);

  // Adds a `stack` property to the given error object that will yield the
  // stack trace at the time captureStackTrace was called.
  // When collecting the stack trace all frames above the topmost call
  // to this function, including that call, will be left out of the
  // stack trace.
  // This is useful because we can hide Ngular implementation details
  // that are not very helpful for the user.
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Ngular.Error);
  }
  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
}

NgularError.prototype = create(Error.prototype);

export default NgularError;
