import Ngular from "ngular-metal/core"; // Ngular.imports
import NgularError from "ngular-metal/error";

function K() { return this; }

function consoleMethod(name) {
  var consoleObj, logToConsole;
  if (Ngular.imports.console) {
    consoleObj = Ngular.imports.console;
  } else if (typeof console !== 'undefined') {
    consoleObj = console;
  }

  var method = typeof consoleObj === 'object' ? consoleObj[name] : null;

  if (method) {
    // Older IE doesn't support bind, but Chrome needs it
    if (typeof method.bind === 'function') {
      logToConsole = method.bind(consoleObj);
      logToConsole.displayName = 'console.' + name;
      return logToConsole;
    } else if (typeof method.apply === 'function') {
      logToConsole = function() {
        method.apply(consoleObj, arguments);
      };
      logToConsole.displayName = 'console.' + name;
      return logToConsole;
    } else {
      return function() {
        var message = Array.prototype.join.call(arguments, ', ');
        method(message);
      };
    }
  }
}

function assertPolyfill(test, message) {
  if (!test) {
    try {
      // attempt to preserve the stack
      throw new NgularError("assertion failed: " + message);
    } catch(error) {
      setTimeout(() => {
        throw error;
      }, 0);
    }
  }
}

/**
  Inside Ngular-Metal, simply uses the methods from `imports.console`.
  Override this to provide more robust logging functionality.

  @class Logger
  @namespace Ngular
*/
export default {
  /**
   Logs the arguments to the console.
   You can pass as many arguments as you want and they will be joined together with a space.

    ```javascript
    var foo = 1;
    Ngular.Logger.log('log value of foo:', foo);
    // "log value of foo: 1" will be printed to the console
    ```

   @method log
   @for Ngular.Logger
   @param {*} arguments
  */
  log:   consoleMethod('log')   || K,

  /**
   Prints the arguments to the console with a warning icon.
   You can pass as many arguments as you want and they will be joined together with a space.

    ```javascript
    Ngular.Logger.warn('Something happened!');
    // "Something happened!" will be printed to the console with a warning icon.
    ```

   @method warn
   @for Ngular.Logger
   @param {*} arguments
  */
  warn:  consoleMethod('warn')  || K,

  /**
   Prints the arguments to the console with an error icon, red text and a stack trace.
   You can pass as many arguments as you want and they will be joined together with a space.

    ```javascript
    Ngular.Logger.error('Danger! Danger!');
    // "Danger! Danger!" will be printed to the console in red text.
    ```

   @method error
   @for Ngular.Logger
   @param {*} arguments
  */
  error: consoleMethod('error') || K,

  /**
   Logs the arguments to the console.
   You can pass as many arguments as you want and they will be joined together with a space.

    ```javascript
    var foo = 1;
    Ngular.Logger.info('log value of foo:', foo);
    // "log value of foo: 1" will be printed to the console
    ```

   @method info
   @for Ngular.Logger
   @param {*} arguments
  */
  info:  consoleMethod('info')  || K,

  /**
   Logs the arguments to the console in blue text.
   You can pass as many arguments as you want and they will be joined together with a space.

    ```javascript
    var foo = 1;
    Ngular.Logger.debug('log value of foo:', foo);
    // "log value of foo: 1" will be printed to the console
    ```

   @method debug
   @for Ngular.Logger
   @param {*} arguments
  */
  debug: consoleMethod('debug') || consoleMethod('info') || K,

  /**
   If the value passed into `Ngular.Logger.assert` is not truthy it will throw an error with a stack trace.

    ```javascript
    Ngular.Logger.assert(true); // undefined
    Ngular.Logger.assert(true === false); // Throws an Assertion failed error.
    ```

   @method assert
   @for Ngular.Logger
   @param {Boolean} bool Value to test
  */
  assert: consoleMethod('assert') || assertPolyfill
};
