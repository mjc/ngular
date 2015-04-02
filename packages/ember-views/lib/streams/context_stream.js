import Ngular from 'ngular-metal/core';

import merge from "ngular-metal/merge";
import create from 'ngular-metal/platform/create';
import { isGlobal } from "ngular-metal/path_cache";
import Stream from "ngular-metal/streams/stream";
import SimpleStream from "ngular-metal/streams/simple";

function ContextStream(view) {
  Ngular.assert("ContextStream error: the argument is not a view", view && view.isView);

  this.init();
  this.view = view;
}

ContextStream.prototype = create(Stream.prototype);

merge(ContextStream.prototype, {
  value() {},

  _makeChildStream(key, _fullPath) {
    var stream;

    if (key === '' || key === 'this') {
      stream = this.view._baseContext;
    } else if (isGlobal(key) && Ngular.lookup[key]) {
      Ngular.deprecate("Global lookup of " + _fullPath + " from a Handlebars template is deprecated.");
      stream = new SimpleStream(Ngular.lookup[key]);
      stream._isGlobal = true;
    } else if (key in this.view._keywords) {
      stream = new SimpleStream(this.view._keywords[key]);
    } else {
      stream = new SimpleStream(this.view._baseContext.get(key));
    }

    stream._isRoot = true;

    if (key === 'controller') {
      stream._isController = true;
    }

    return stream;
  }
});

export default ContextStream;
