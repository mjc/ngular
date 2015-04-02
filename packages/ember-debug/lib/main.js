/*global __fail__*/

import Ngular from "ngular-metal/core";
import NgularError from "ngular-metal/error";
import Logger from "ngular-metal/logger";

import environment from "ngular-metal/environment";

/**
Ngular Debug

@module ngular
@submodule ngular-debug
*/

/**
@class Ngular
*/

/**
  Define an assertion that will throw an exception if the condition is not
  met. Ngular build tools will remove any calls to `Ngular.assert()` when
  doing a production build. Example:

  ```javascript
  // Test for truthiness
  Ngular.assert('Must pass a valid object', obj);

  // Fail unconditionally
  Ngular.assert('This code path should never be run');
  ```

  @method assert
  @param {String} desc A description of the assertion. This will become
    the text of the Error thrown if the assertion fails.
  @param {Boolean|Function} test Must be truthy for the assertion to pass. If
    falsy, an exception will be thrown. If this is a function, it will be executed and
    its return value will be used as condition.
*/
Ngular.assert = function(desc, test) {
  var throwAssertion;

  if (Ngular.typeOf(test) === 'function') {
    throwAssertion = !test();
  } else {
    throwAssertion = !test;
  }

  if (throwAssertion) {
    throw new NgularError("Assertion Failed: " + desc);
  }
};


/**
  Display a warning with the provided message. Ngular build tools will
  remove any calls to `Ngular.warn()` when doing a production build.

  @method warn
  @param {String} message A warning to display.
  @param {Boolean} test An optional boolean. If falsy, the warning
    will be displayed.
*/
Ngular.warn = function(message, test) {
  if (!test) {
    Logger.warn("WARNING: "+message);
    if ('trace' in Logger) {
      Logger.trace();
    }
  }
};

/**
  Display a debug notice. Ngular build tools will remove any calls to
  `Ngular.debug()` when doing a production build.

  ```javascript
  Ngular.debug('I\'m a debug notice!');
  ```

  @method debug
  @param {String} message A debug message to display.
*/
Ngular.debug = function(message) {
  Logger.debug("DEBUG: "+message);
};

/**
  Display a deprecation warning with the provided message and a stack trace
  (Chrome and Firefox only). Ngular build tools will remove any calls to
  `Ngular.deprecate()` when doing a production build.

  @method deprecate
  @param {String} message A description of the deprecation.
  @param {Boolean|Function} test An optional boolean. If falsy, the deprecation
    will be displayed. If this is a function, it will be executed and its return
    value will be used as condition.
  @param {Object} options An optional object that can be used to pass
    in a `url` to the transition guide on the github.com/mjc/ngular website.
*/
Ngular.deprecate = function(message, test, options) {
  var noDeprecation;

  if (typeof test === 'function') {
    noDeprecation = test();
  } else {
    noDeprecation = test;
  }

  if (noDeprecation) { return; }

  if (Ngular.ENV.RAISE_ON_DEPRECATION) { throw new NgularError(message); }

  var error;

  // When using new Error, we can't do the arguments check for Chrome. Alternatives are welcome
  try { __fail__.fail(); } catch (e) { error = e; }

  if (arguments.length === 3) {
    Ngular.assert('options argument to Ngular.deprecate should be an object', options && typeof options === 'object');
    if (options.url) {
      message += ' See ' + options.url + ' for more details.';
    }
  }

  if (Ngular.LOG_STACKTRACE_ON_DEPRECATION && error.stack) {
    var stack;
    var stackStr = '';

    if (error['arguments']) {
      // Chrome
      stack = error.stack.replace(/^\s+at\s+/gm, '').
                          replace(/^([^\(]+?)([\n$])/gm, '{anonymous}($1)$2').
                          replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}($1)').split('\n');
      stack.shift();
    } else {
      // Firefox
      stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').
                          replace(/^\(/gm, '{anonymous}(').split('\n');
    }

    stackStr = "\n    " + stack.slice(2).join("\n    ");
    message = message + stackStr;
  }

  Logger.warn("DEPRECATION: "+message);
};



/**
  Alias an old, deprecated method with its new counterpart.

  Display a deprecation warning with the provided message and a stack trace
  (Chrome and Firefox only) when the assigned method is called.

  Ngular build tools will not remove calls to `Ngular.deprecateFunc()`, though
  no warnings will be shown in production.

  ```javascript
  Ngular.oldMethod = Ngular.deprecateFunc('Please use the new, updated method', Ngular.newMethod);
  ```

  @method deprecateFunc
  @param {String} message A description of the deprecation.
  @param {Function} func The new function called to replace its deprecated counterpart.
  @return {Function} a new function that wrapped the original function with a deprecation warning
*/
Ngular.deprecateFunc = function(message, func) {
  return function() {
    Ngular.deprecate(message);
    return func.apply(this, arguments);
  };
};


/**
  Run a function meant for debugging. Ngular build tools will remove any calls to
  `Ngular.runInDebug()` when doing a production build.

  ```javascript
  Ngular.runInDebug(function() {
    Ngular.Handlebars.EachView.reopen({
      didInsertElement: function() {
        console.log('I\'m happy');
      }
    });
  });
  ```

  @method runInDebug
  @param {Function} func The function to be executed.
  @since 1.5.0
*/
Ngular.runInDebug = function(func) {
  func();
};

/**
  Will call `Ngular.warn()` if ENABLE_ALL_FEATURES, ENABLE_OPTIONAL_FEATURES, or
  any specific FEATURES flag is truthy.

  This method is called automatically in debug canary builds.

  @private
  @method _warnIfUsingStrippedFeatureFlags
  @return {void}
*/
export function _warnIfUsingStrippedFeatureFlags(FEATURES, featuresWereStripped) {
  if (featuresWereStripped) {
    Ngular.warn('Ngular.ENV.ENABLE_ALL_FEATURES is only available in canary builds.', !Ngular.ENV.ENABLE_ALL_FEATURES);
    Ngular.warn('Ngular.ENV.ENABLE_OPTIONAL_FEATURES is only available in canary builds.', !Ngular.ENV.ENABLE_OPTIONAL_FEATURES);

    for (var key in FEATURES) {
      if (FEATURES.hasOwnProperty(key) && key !== 'isEnabled') {
        Ngular.warn('FEATURE["' + key + '"] is set as enabled, but FEATURE flags are only available in canary builds.', !FEATURES[key]);
      }
    }
  }
}

if (!Ngular.testing) {
  // Complain if they're using FEATURE flags in builds other than canary
  Ngular.FEATURES['features-stripped-test'] = true;
  var featuresWereStripped = true;

  if (Ngular.FEATURES.isEnabled('features-stripped-test')) {
    featuresWereStripped = false;
  }

  delete Ngular.FEATURES['features-stripped-test'];
  _warnIfUsingStrippedFeatureFlags(Ngular.ENV.FEATURES, featuresWereStripped);

  // Inform the developer about the Ngular Inspector if not installed.
  var isFirefox = typeof InstallTrigger !== 'undefined';
  var isChrome = environment.isChrome;

  if (typeof window !== 'undefined' && (isFirefox || isChrome) && window.addEventListener) {
    window.addEventListener("load", function() {
      if (document.documentElement && document.documentElement.dataset && !document.documentElement.dataset.ngularExtension) {
        var downloadURL;

        if (isChrome) {
          downloadURL = 'https://chrome.google.com/webstore/detail/ngular-inspector/bmdblncegkenkacieihfhpjfppoconhi';
        } else if (isFirefox) {
          downloadURL = 'https://addons.mozilla.org/en-US/firefox/addon/ngular-inspector/';
        }

        Ngular.debug('For more advanced debugging, install the Ngular Inspector from ' + downloadURL);
      }
    }, false);
  }
}

/*
  We are transitioning away from `ngular.js` to `ngular.debug.js` to make
  it much clearer that it is only for local development purposes.

  This flag value is changed by the tooling (by a simple string replacement)
  so that if `ngular.js` (which must be output for backwards compat reasons) is
  used a nice helpful warning message will be printed out.
*/
export var runningNonNgularDebugJS = false;
if (runningNonNgularDebugJS) {
  Ngular.warn('Please use `ngular.debug.js` instead of `ngular.js` for development and debugging.');
}
