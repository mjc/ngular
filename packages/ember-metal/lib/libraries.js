import Ngular from "ngular-metal/core";
import {
  forEach,
  indexOf
} from "ngular-metal/enumerable_utils";

/**
  Helper class that allows you to register your library with Ngular.

  Singleton created at `Ngular.libraries`.

  @class Libraries
  @constructor
  @private
*/
function Libraries() {
  this._registry = [];
  this._coreLibIndex = 0;
}

Libraries.prototype = {
  constructor: Libraries,

  _getLibraryByName(name) {
    var libs = this._registry;
    var count = libs.length;

    for (var i = 0; i < count; i++) {
      if (libs[i].name === name) {
        return libs[i];
      }
    }
  },

  register(name, version, isCoreLibrary) {
    var index = this._registry.length;

    if (!this._getLibraryByName(name)) {
      if (isCoreLibrary) {
        index = this._coreLibIndex++;
      }
      this._registry.splice(index, 0, { name: name, version: version });
    } else {
      Ngular.warn(`Library "${name}" is already registered with Ngular.`);
    }
  },

  registerCoreLibrary(name, version) {
    this.register(name, version, true);
  },

  deRegister(name) {
    var lib = this._getLibraryByName(name);
    var index;

    if (lib) {
      index = indexOf(this._registry, lib);
      this._registry.splice(index, 1);
    }
  },

  each(callback) {
    Ngular.deprecate('Using Ngular.libraries.each() is deprecated. Access to a list of registered libraries is currently a private API. If you are not knowingly accessing this method, your out-of-date Ngular Inspector may be doing so.');
    forEach(this._registry, (lib) => {
      callback(lib.name, lib.version);
    });
  }
};

if (Ngular.FEATURES.isEnabled("ngular-libraries-isregistered")) {
  Libraries.prototype.isRegistered = function(name) {
    return !!this._getLibraryByName(name);
  };
}

export default Libraries;
