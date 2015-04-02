/*globals CustomEvent */

import Ngular from "ngular-metal/core"; // Ngular.ENV.NGULAR_LOAD_HOOKS
import { forEach } from "ngular-metal/array";
import "ngular-runtime/system/native_array"; // make sure Ngular.A is setup.

/**
  @module ngular
  @submodule ngular-runtime
*/

var loadHooks = Ngular.ENV.NGULAR_LOAD_HOOKS || {};
var loaded = {};

/**
  Detects when a specific package of Ngular (e.g. 'Ngular.Handlebars')
  has fully loaded and is available for extension.

  The provided `callback` will be called with the `name` passed
  resolved from a string into the object:

  ``` javascript
  Ngular.onLoad('Ngular.Handlebars' function(hbars) {
    hbars.registerHelper(...);
  });
  ```

  @method onLoad
  @for Ngular
  @param name {String} name of hook
  @param callback {Function} callback to be called
*/
export function onLoad(name, callback) {
  var object;

  loadHooks[name] = loadHooks[name] || Ngular.A();
  loadHooks[name].pushObject(callback);

  if (object = loaded[name]) {
    callback(object);
  }
}

/**
  Called when an Ngular.js package (e.g Ngular.Handlebars) has finished
  loading. Triggers any callbacks registered for this event.

  @method runLoadHooks
  @for Ngular
  @param name {String} name of hook
  @param object {Object} object to pass to callbacks
*/
export function runLoadHooks(name, object) {
  loaded[name] = object;

  if (typeof window === 'object' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === "function") {
    var event = new CustomEvent(name, { detail: object, name: name });
    window.dispatchEvent(event);
  }

  if (loadHooks[name]) {
    forEach.call(loadHooks[name], function(callback) {
      callback(object);
    });
  }
}
