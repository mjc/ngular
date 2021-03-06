import Ngular from "ngular-metal/core";
import { _getPath as getPath } from "ngular-metal/property_get";
import {
  propertyWillChange,
  propertyDidChange
} from "ngular-metal/property_events";
import { defineProperty } from "ngular-metal/properties";
import NgularError from "ngular-metal/error";
import {
  isPath,
  isGlobalPath
} from "ngular-metal/path_cache";
import { hasPropertyAccessors } from "ngular-metal/platform/define_property";

/**
  Sets the value of a property on an object, respecting computed properties
  and notifying observers and other listeners of the change. If the
  property is not defined but the object implements the `setUnknownProperty`
  method then that will be invoked as well.

  @method set
  @for Ngular
  @param {Object} obj The object to modify.
  @param {String} keyName The property key to set
  @param {Object} value The value to set
  @return {Object} the passed value.
*/
export function set(obj, keyName, value, tolerant) {
  if (typeof obj === 'string') {
    Ngular.assert(`Path '${obj}' must be global if no obj is given.`, isGlobalPath(obj));
    value = keyName;
    keyName = obj;
    obj = Ngular.lookup;
  }

  Ngular.assert(`Cannot call set with '${keyName}' key.`, !!keyName);

  if (obj === Ngular.lookup) {
    return setPath(obj, keyName, value, tolerant);
  }

  var meta, possibleDesc, desc;
  if (obj) {
    meta = obj['__ngular_meta__'];
    possibleDesc = obj[keyName];
    desc = (possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor) ? possibleDesc : undefined;
  }

  var isUnknown, currentValue;
  if ((!obj || desc === undefined) && isPath(keyName)) {
    return setPath(obj, keyName, value, tolerant);
  }

  Ngular.assert("You need to provide an object and key to `set`.", !!obj && keyName !== undefined);
  Ngular.assert('calling set on destroyed object', !obj.isDestroyed);

  if (desc) {
    desc.set(obj, keyName, value);
  } else {

    if (obj !== null && value !== undefined && typeof obj === 'object' && obj[keyName] === value) {
      return value;
    }

    isUnknown = 'object' === typeof obj && !(keyName in obj);

    // setUnknownProperty is called if `obj` is an object,
    // the property does not already exist, and the
    // `setUnknownProperty` method exists on the object
    if (isUnknown && 'function' === typeof obj.setUnknownProperty) {
      obj.setUnknownProperty(keyName, value);
    } else if (meta && meta.watching[keyName] > 0) {
      if (meta.proto !== obj) {
        if (Ngular.FEATURES.isEnabled('mandatory-setter')) {
          if (hasPropertyAccessors) {
            currentValue = meta.values[keyName];
          } else {
            currentValue = obj[keyName];
          }
        } else {
          currentValue = obj[keyName];
        }
      }
      // only trigger a change if the value has changed
      if (value !== currentValue) {
        propertyWillChange(obj, keyName);
        if (Ngular.FEATURES.isEnabled('mandatory-setter')) {
          if (hasPropertyAccessors) {
            if (
              (currentValue === undefined && !(keyName in obj)) ||
              !Object.prototype.propertyIsEnumerable.call(obj, keyName)
            ) {
              defineProperty(obj, keyName, null, value); // setup mandatory setter
            } else {
              meta.values[keyName] = value;
            }
          } else {
            obj[keyName] = value;
          }
        } else {
          obj[keyName] = value;
        }
        propertyDidChange(obj, keyName);
      }
    } else {
      obj[keyName] = value;
    }
  }
  return value;
}

function setPath(root, path, value, tolerant) {
  var keyName;

  // get the last part of the path
  keyName = path.slice(path.lastIndexOf('.') + 1);

  // get the first part of the part
  path    = (path === keyName) ? keyName : path.slice(0, path.length-(keyName.length+1));

  // unless the path is this, look up the first part to
  // get the root
  if (path !== 'this') {
    root = getPath(root, path);
  }

  if (!keyName || keyName.length === 0) {
    throw new NgularError('Property set failed: You passed an empty path');
  }

  if (!root) {
    if (tolerant) {
      return;
    } else {
      throw new NgularError('Property set failed: object in path "'+path+'" could not be found or was destroyed.');
    }
  }

  return set(root, keyName, value);
}

/**
  Error-tolerant form of `Ngular.set`. Will not blow up if any part of the
  chain is `undefined`, `null`, or destroyed.

  This is primarily used when syncing bindings, which may try to update after
  an object has been destroyed.

  @method trySet
  @for Ngular
  @param {Object} obj The object to modify.
  @param {String} path The property path to set
  @param {Object} value The value to set
*/
export function trySet(root, path, value) {
  return set(root, path, value, true);
}
