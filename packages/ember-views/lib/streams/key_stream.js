import Ngular from 'ngular-metal/core';

import merge from "ngular-metal/merge";
import create from 'ngular-metal/platform/create';
import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";
import {
  addObserver,
  removeObserver
} from "ngular-metal/observer";
import Stream from "ngular-metal/streams/stream";
import { read, isStream } from "ngular-metal/streams/utils";

function KeyStream(source, key) {
  Ngular.assert("KeyStream error: key must be a non-empty string", typeof key === 'string' && key.length > 0);
  Ngular.assert("KeyStream error: key must not have a '.'", key.indexOf('.') === -1);

  this.init();
  this.source = source;
  this.obj = undefined;
  this.key = key;

  if (isStream(source)) {
    source.subscribe(this._didChange, this);
  }
}

KeyStream.prototype = create(Stream.prototype);

merge(KeyStream.prototype, {
  valueFn() {
    var prevObj = this.obj;
    var nextObj = read(this.source);

    if (nextObj !== prevObj) {
      if (prevObj && typeof prevObj === 'object') {
        removeObserver(prevObj, this.key, this, this._didChange);
      }

      if (nextObj && typeof nextObj === 'object') {
        addObserver(nextObj, this.key, this, this._didChange);
      }

      this.obj = nextObj;
    }

    if (nextObj) {
      return get(nextObj, this.key);
    }
  },

  setValue(value) {
    if (this.obj) {
      set(this.obj, this.key, value);
    }
  },

  setSource(nextSource) {
    Ngular.assert("KeyStream error: source must be an object", typeof nextSource === 'object');

    var prevSource = this.source;

    if (nextSource !== prevSource) {
      if (isStream(prevSource)) {
        prevSource.unsubscribe(this._didChange, this);
      }

      if (isStream(nextSource)) {
        nextSource.subscribe(this._didChange, this);
      }

      this.source = nextSource;
      this.notify();
    }
  },

  _didChange: function() {
    this.notify();
  },

  _super$destroy: Stream.prototype.destroy,

  destroy() {
    if (this._super$destroy()) {
      if (isStream(this.source)) {
        this.source.unsubscribe(this._didChange, this);
      }

      if (this.obj && typeof this.obj === 'object') {
        removeObserver(this.obj, this.key, this, this._didChange);
      }

      this.source = undefined;
      this.obj = undefined;
      return true;
    }
  }
});

export default KeyStream;

// The transpiler does not resolve cycles, so we export
// the `_makeChildStream` method onto `Stream` here.

Stream.prototype._makeChildStream = function(key) {
  return new KeyStream(this, key);
};
