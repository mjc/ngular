/**
@module ngular-metal
*/

import Ngular from "ngular-metal/core";
import { hasPropertyAccessors } from "ngular-metal/platform/define_property";
import { defineProperty } from "ngular-metal/properties";
import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";


/**
  Used internally to allow changing properties in a backwards compatible way, and print a helpful
  deprecation warning.

  @method deprecateProperty
  @param {Object} object The object to add the deprecated property to.
  @param {String} deprecatedKey The property to add (and print deprecation warnings upon accessing).
  @param {String} newKey The property that will be aliased.
  @private
  @since 1.7.0
*/

export function deprecateProperty(object, deprecatedKey, newKey) {
  function deprecate() {
    Ngular.deprecate(`Usage of \`${deprecatedKey}\` is deprecated, use \`${newKey}\` instead.`);
  }

  if (hasPropertyAccessors) {
    defineProperty(object, deprecatedKey, {
      configurable: true,
      enumerable: false,
      set(value) {
        deprecate();
        set(this, newKey, value);
      },
      get() {
        deprecate();
        return get(this, newKey);
      }
    });
  }
}
