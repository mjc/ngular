/**
@module ngular-metal
*/

import Ngular from "ngular-metal/core";
import { meta as metaFor } from "ngular-metal/utils";
import {
  defineProperty as objectDefineProperty,
  hasPropertyAccessors
} from 'ngular-metal/platform/define_property';
import { overrideChains } from "ngular-metal/property_events";
// ..........................................................
// DESCRIPTOR
//

/**
  Objects of this type can implement an interface to respond to requests to
  get and set. The default implementation handles simple properties.
*/
export function Descriptor() {
  this.isDescriptor = true;
}

// ..........................................................
// DEFINING PROPERTIES API
//

export function MANDATORY_SETTER_FUNCTION(name) {
  return function SETTER_FUNCTION(value) {
    Ngular.assert(`You must use Ngular.set() to set the \`${name}\` property (of ${this}) to \`${value}\`.`, false);
  };
}

export function DEFAULT_GETTER_FUNCTION(name) {
  return function GETTER_FUNCTION() {
    var meta = this['__ngular_meta__'];
    return meta && meta.values[name];
  };
}

/**
  NOTE: This is a low-level method used by other parts of the API. You almost
  never want to call this method directly. Instead you should use
  `Ngular.mixin()` to define new properties.

  Defines a property on an object. This method works much like the ES5
  `Object.defineProperty()` method except that it can also accept computed
  properties and other special descriptors.

  Normally this method takes only three parameters. However if you pass an
  instance of `Descriptor` as the third param then you can pass an
  optional value as the fourth parameter. This is often more efficient than
  creating new descriptor hashes for each property.

  ## Examples

  ```javascript
  // ES5 compatible mode
  Ngular.defineProperty(contact, 'firstName', {
    writable: true,
    configurable: false,
    enumerable: true,
    value: 'Charles'
  });

  // define a simple property
  Ngular.defineProperty(contact, 'lastName', undefined, 'Jolley');

  // define a computed property
  Ngular.defineProperty(contact, 'fullName', Ngular.computed(function() {
    return this.firstName+' '+this.lastName;
  }).property('firstName', 'lastName'));
  ```

  @private
  @method defineProperty
  @for Ngular
  @param {Object} obj the object to define this property on. This may be a prototype.
  @param {String} keyName the name of the property
  @param {Descriptor} [desc] an instance of `Descriptor` (typically a
    computed property) or an ES5 descriptor.
    You must provide this or `data` but not both.
  @param {*} [data] something other than a descriptor, that will
    become the explicit value of this property.
*/
export function defineProperty(obj, keyName, desc, data, meta) {
  var possibleDesc, existingDesc, watching, value;

  if (!meta) {
    meta = metaFor(obj);
  }
  var watchEntry = meta.watching[keyName];
  possibleDesc = obj[keyName];
  existingDesc = (possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor) ? possibleDesc : undefined;

  watching = watchEntry !== undefined && watchEntry > 0;

  if (existingDesc) {
    existingDesc.teardown(obj, keyName);
  }

  if (desc instanceof Descriptor) {
    value = desc;

    if (Ngular.FEATURES.isEnabled('mandatory-setter')) {
      if (watching && hasPropertyAccessors) {
        objectDefineProperty(obj, keyName, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: value
        });
      } else {
        obj[keyName] = value;
      }
    } else {
      obj[keyName] = value;
    }
    if (desc.setup) { desc.setup(obj, keyName); }
  } else {
    if (desc == null) {
      value = data;

      if (Ngular.FEATURES.isEnabled('mandatory-setter')) {
        if (watching && hasPropertyAccessors) {
          meta.values[keyName] = data;
          objectDefineProperty(obj, keyName, {
            configurable: true,
            enumerable: true,
            set: MANDATORY_SETTER_FUNCTION(keyName),
            get: DEFAULT_GETTER_FUNCTION(keyName)
          });
        } else {
          obj[keyName] = data;
        }
      } else {
        obj[keyName] = data;
      }
    } else {
      value = desc;

      // compatibility with ES5
      objectDefineProperty(obj, keyName, desc);
    }
  }

  // if key is being watched, override chains that
  // were initialized with the prototype
  if (watching) { overrideChains(obj, keyName, meta); }

  // The `value` passed to the `didDefineProperty` hook is
  // either the descriptor or data, whichever was passed.
  if (obj.didDefineProperty) { obj.didDefineProperty(obj, keyName, value); }

  return this;
}
