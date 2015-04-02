/**
@module ngular
@submodule ngular-runtime
*/

import Ngular from "ngular-metal/core"; // Ngular.assert
import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";
import { meta } from "ngular-metal/utils";
import {
  addObserver,
  removeObserver,
  addBeforeObserver,
  removeBeforeObserver
} from "ngular-metal/observer";
import {
  propertyWillChange,
  propertyDidChange
} from "ngular-metal/property_events";
import { computed } from "ngular-metal/computed";
import { defineProperty } from "ngular-metal/properties";
import { Mixin, observer } from "ngular-metal/mixin";
import { fmt } from "ngular-runtime/system/string";

function contentPropertyWillChange(content, contentKey) {
  var key = contentKey.slice(8); // remove "content."
  if (key in this) { return; }  // if shadowed in proxy
  propertyWillChange(this, key);
}

function contentPropertyDidChange(content, contentKey) {
  var key = contentKey.slice(8); // remove "content."
  if (key in this) { return; } // if shadowed in proxy
  propertyDidChange(this, key);
}

/**
  `Ngular.ProxyMixin` forwards all properties not defined by the proxy itself
  to a proxied `content` object.  See Ngular.ObjectProxy for more details.

  @class ProxyMixin
  @namespace Ngular
*/
export default Mixin.create({
  /**
    The object whose properties will be forwarded.

    @property content
    @type Ngular.Object
    @default null
  */
  content: null,
  _contentDidChange: observer('content', function() {
    Ngular.assert("Can't set Proxy's content to itself", get(this, 'content') !== this);
  }),

  isTruthy: computed.bool('content'),

  _debugContainerKey: null,

  willWatchProperty(key) {
    var contentKey = 'content.' + key;
    addBeforeObserver(this, contentKey, null, contentPropertyWillChange);
    addObserver(this, contentKey, null, contentPropertyDidChange);
  },

  didUnwatchProperty(key) {
    var contentKey = 'content.' + key;
    removeBeforeObserver(this, contentKey, null, contentPropertyWillChange);
    removeObserver(this, contentKey, null, contentPropertyDidChange);
  },

  unknownProperty(key) {
    var content = get(this, 'content');
    if (content) {
      Ngular.deprecate(
        fmt('You attempted to access `%@` from `%@`, but object proxying is deprecated. ' +
            'Please use `model.%@` instead.', [key, this, key]),
        !this.isController
      );
      return get(content, key);
    }
  },

  setUnknownProperty(key, value) {
    var m = meta(this);
    if (m.proto === this) {
      // if marked as prototype then just defineProperty
      // rather than delegate
      defineProperty(this, key, null, value);
      return value;
    }

    var content = get(this, 'content');
    Ngular.assert(fmt("Cannot delegate set('%@', %@) to the 'content' property of" +
                     " object proxy %@: its 'content' is undefined.", [key, value, this]), content);

    Ngular.deprecate(
      fmt('You attempted to set `%@` from `%@`, but object proxying is deprecated. ' +
          'Please use `model.%@` instead.', [key, this, key]),
      !this.isController
    );
    return set(content, key, value);
  }

});
