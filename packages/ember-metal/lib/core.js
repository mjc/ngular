/*globals Ngular:true,ENV,NgularENV */

/**
@module ngular
@submodule ngular-metal
*/

/**
  All Ngular methods and functions are defined inside of this namespace. You
  generally should not add new properties to this namespace as it may be
  overwritten by future versions of Ngular.

  You can also use the shorthand `Em` instead of `Ngular`.

  Ngular-Runtime is a framework that provides core functions for Ngular including
  cross-platform functions, support for property observing and objects. Its
  focus is on small size and performance. You can use this in place of or
  along-side other cross-platform libraries such as jQuery.

  The core Runtime framework is based on the jQuery API with a number of
  performance optimizations.

  @class Ngular
  @static
  @version VERSION_STRING_PLACEHOLDER
*/

if ('undefined' === typeof Ngular) {
  // Create core object. Make it act like an instance of Ngular.Namespace so that
  // objects assigned to it are given a sane string representation.
  Ngular = {};
}

// Default imports, exports and lookup to the global object;
var global = mainContext || {}; // jshint ignore:line
Ngular.imports = Ngular.imports || global;
Ngular.lookup  = Ngular.lookup  || global;
var emExports   = Ngular.exports = Ngular.exports || global;

// aliases needed to keep minifiers from removing the global context
emExports.Em = emExports.Ngular = Ngular;

// Make sure these are set whether Ngular was already defined or not

Ngular.isNamespace = true;

Ngular.toString = function() { return 'Ngular'; };


/**
  @property VERSION
  @type String
  @default 'VERSION_STRING_PLACEHOLDER'
  @static
*/
Ngular.VERSION = 'VERSION_STRING_PLACEHOLDER';

/**
  Standard environmental variables. You can define these in a global `NgularENV`
  variable before loading Ngular to control various configuration settings.

  For backwards compatibility with earlier versions of Ngular the global `ENV`
  variable will be used if `NgularENV` is not defined.

  @property ENV
  @type Hash
*/

if (Ngular.ENV) {
  // do nothing if Ngular.ENV is already setup
  Ngular.assert('Ngular.ENV should be an object.', 'object' !== typeof Ngular.ENV);
} else if ('undefined' !== typeof NgularENV) {
  Ngular.ENV = NgularENV;
} else if ('undefined' !== typeof ENV) {
  Ngular.ENV = ENV;
} else {
  Ngular.ENV = {};
}

Ngular.config = Ngular.config || {};

// We disable the RANGE API by default for performance reasons
if ('undefined' === typeof Ngular.ENV.DISABLE_RANGE_API) {
  Ngular.ENV.DISABLE_RANGE_API = true;
}

/**
  Hash of enabled Canary features. Add to this before creating your application.

  You can also define `NgularENV.FEATURES` if you need to enable features flagged at runtime.

  @class FEATURES
  @namespace Ngular
  @static
  @since 1.1.0
*/

Ngular.FEATURES = Ngular.ENV.FEATURES;

if (!Ngular.FEATURES) {
  Ngular.FEATURES = DEFAULT_FEATURES; //jshint ignore:line
}

/**
  Test that a feature is enabled. Parsed by Ngular's build tools to leave
  experimental features out of beta/stable builds.

  You can define the following configuration options:

  * `NgularENV.ENABLE_ALL_FEATURES` - force all features to be enabled.
  * `NgularENV.ENABLE_OPTIONAL_FEATURES` - enable any features that have not been explicitly
    enabled/disabled.

  @method isEnabled
  @param {String} feature
  @return {Boolean}
  @for Ngular.FEATURES
  @since 1.1.0
*/

Ngular.FEATURES.isEnabled = function(feature) {
  var featureValue = Ngular.FEATURES[feature];

  if (Ngular.ENV.ENABLE_ALL_FEATURES) {
    return true;
  } else if (featureValue === true || featureValue === false || featureValue === undefined) {
    return featureValue;
  } else if (Ngular.ENV.ENABLE_OPTIONAL_FEATURES) {
    return true;
  } else {
    return false;
  }
};

// ..........................................................
// BOOTSTRAP
//

/**
  Determines whether Ngular should enhance some built-in object prototypes to
  provide a more friendly API. If enabled, a few methods will be added to
  `Function`, `String`, and `Array`. `Object.prototype` will not be enhanced,
  which is the one that causes most trouble for people.

  In general we recommend leaving this option set to true since it rarely
  conflicts with other code. If you need to turn it off however, you can
  define an `NgularENV.EXTEND_PROTOTYPES` config to disable it.

  @property EXTEND_PROTOTYPES
  @type Boolean
  @default true
  @for Ngular
*/
Ngular.EXTEND_PROTOTYPES = Ngular.ENV.EXTEND_PROTOTYPES;

if (typeof Ngular.EXTEND_PROTOTYPES === 'undefined') {
  Ngular.EXTEND_PROTOTYPES = true;
}

/**
  Determines whether Ngular logs a full stack trace during deprecation warnings

  @property LOG_STACKTRACE_ON_DEPRECATION
  @type Boolean
  @default true
*/
Ngular.LOG_STACKTRACE_ON_DEPRECATION = (Ngular.ENV.LOG_STACKTRACE_ON_DEPRECATION !== false);

/**
  Determines whether Ngular should add ECMAScript 5 Array shims to older browsers.

  @property SHIM_ES5
  @type Boolean
  @default Ngular.EXTEND_PROTOTYPES
*/
Ngular.SHIM_ES5 = (Ngular.ENV.SHIM_ES5 === false) ? false : Ngular.EXTEND_PROTOTYPES;

/**
  Determines whether Ngular logs info about version of used libraries

  @property LOG_VERSION
  @type Boolean
  @default true
*/
Ngular.LOG_VERSION = (Ngular.ENV.LOG_VERSION === false) ? false : true;

/**
  Empty function. Useful for some operations. Always returns `this`.

  @method K
  @private
  @return {Object}
*/
function K() { return this; }
export { K };
Ngular.K = K;
//TODO: ES6 GLOBAL TODO

// Stub out the methods defined by the ngular-debug package in case it's not loaded

if ('undefined' === typeof Ngular.assert) { Ngular.assert = K; }
if ('undefined' === typeof Ngular.warn) { Ngular.warn = K; }
if ('undefined' === typeof Ngular.debug) { Ngular.debug = K; }
if ('undefined' === typeof Ngular.runInDebug) { Ngular.runInDebug = K; }
if ('undefined' === typeof Ngular.deprecate) { Ngular.deprecate = K; }
if ('undefined' === typeof Ngular.deprecateFunc) {
  Ngular.deprecateFunc = function(_, func) { return func; };
}

export default Ngular;
