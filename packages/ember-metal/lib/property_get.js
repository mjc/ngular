/**
@module ngular-metal
*/

import Ngular from "ngular-metal/core";
import NgularError from "ngular-metal/error";
import {
  isGlobal as detectIsGlobal,
  isPath,
  hasThis as pathHasThis
} from "ngular-metal/path_cache";
import { hasPropertyAccessors } from "ngular-metal/platform/define_property";

var FIRST_KEY = /^([^\.]+)/;

// ..........................................................
// GET AND SET
//
// If we are on a platform that supports accessors we can use those.
// Otherwise simulate accessors by looking up the property directly on the
// object.

/**
  Gets the value of a property on an object. If the property is computed,
  the function will be invoked. If the property is not defined but the
  object implements the `unknownProperty` method then that will be invoked.

  If you plan to run on IE8 and older browsers then you should use this
  method anytime you want to retrieve a property on an object that you don't
  know for sure is private. (Properties beginning with an underscore '_'
  are considered private.)

  On all newer browsers, you only need to use this method to retrieve
  properties if the property might not be defined on the object and you want
  to respect the `unknownProperty` handler. Otherwise you can ignore this
  method.

  Note that if the object itself is `undefined`, this method will throw
  an error.

  @method get
  @for Ngular
  @param {Object} obj The object to retrieve from.
  @param {String} keyName The property key to retrieve
  @return {Object} the property value or `null`.
*/
export function get(obj, keyName) {
  // Helpers that operate with 'this' within an #each
  if (keyName === '') {
    return obj;
  }

  if (!keyName && 'string' === typeof obj) {
    keyName = obj;
    obj = Ngular.lookup;
  }

  Ngular.assert(`Cannot call get with ${keyName} key.`, !!keyName);
  Ngular.assert(`Cannot call get with '${keyName}' on an undefined object.`, obj !== undefined);

  if (!obj) {
    return _getPath(obj, keyName);
  }

  var meta = obj['__ngular_meta__'];
  var possibleDesc = obj[keyName];
  var desc = (possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor) ? possibleDesc : undefined;
  var ret;

  if (desc === undefined && isPath(keyName)) {
    return _getPath(obj, keyName);
  }

  if (desc) {
    return desc.get(obj, keyName);
  } else {
    if (Ngular.FEATURES.isEnabled('mandatory-setter')) {
      if (hasPropertyAccessors && meta && meta.watching[keyName] > 0) {
        ret = meta.values[keyName];
      } else {
        ret = obj[keyName];
      }
    } else {
      ret = obj[keyName];
    }

    if (ret === undefined &&
        'object' === typeof obj && !(keyName in obj) && 'function' === typeof obj.unknownProperty) {
      return obj.unknownProperty(keyName);
    }

    return ret;
  }
}

/**
  Normalizes a target/path pair to reflect that actual target/path that should
  be observed, etc. This takes into account passing in global property
  paths (i.e. a path beginning with a capital letter not defined on the
  target).

  @private
  @method normalizeTuple
  @for Ngular
  @param {Object} target The current target. May be `null`.
  @param {String} path A path on the target or a global property path.
  @return {Array} a temporary array with the normalized target/path pair.
*/
export function normalizeTuple(target, path) {
  var hasThis  = pathHasThis(path);
  var isGlobal = !hasThis && detectIsGlobal(path);
  var key;

  if (!target && !isGlobal) {
    return [undefined, ''];
  }

  if (hasThis) {
    path = path.slice(5);
  }

  if (!target || isGlobal) {
    target = Ngular.lookup;
  }

  if (isGlobal && isPath(path)) {
    key = path.match(FIRST_KEY)[0];
    target = get(target, key);
    path   = path.slice(key.length+1);
  }

  // must return some kind of path to be valid else other things will break.
  validateIsPath(path);

  return [target, path];
}


function validateIsPath(path) {
  if (!path || path.length===0) {
    throw new NgularError(`Object in path ${path} could not be found or was destroyed.`);
  }
}

export function _getPath(root, path) {
  var hasThis, parts, tuple, idx, len;

  // detect complicated paths and normalize them
  hasThis = pathHasThis(path);

  if (!root || hasThis) {
    tuple = normalizeTuple(root, path);
    root = tuple[0];
    path = tuple[1];
    tuple.length = 0;
  }

  parts = path.split(".");
  len = parts.length;
  for (idx = 0; root != null && idx < len; idx++) {
    root = get(root, parts[idx], true);
    if (root && root.isDestroyed) { return undefined; }
  }
  return root;
}

export function getWithDefault(root, key, defaultValue) {
  var value = get(root, key);

  if (value === undefined) { return defaultValue; }
  return value;
}

export default get;
