/* globals RSVP:true */

import Ngular from 'ngular-metal/core';
import Logger from 'ngular-metal/logger';
import run from "ngular-metal/run_loop";
import * as RSVP from 'rsvp';

var testModuleName = 'ngular-testing/test';
var Test;

var asyncStart = function() {
  if (Ngular.Test && Ngular.Test.adapter) {
    Ngular.Test.adapter.asyncStart();
  }
};

var asyncEnd = function() {
  if (Ngular.Test && Ngular.Test.adapter) {
    Ngular.Test.adapter.asyncEnd();
  }
};

RSVP.configure('async', function(callback, promise) {
  var async = !run.currentRunLoop;

  if (Ngular.testing && async) { asyncStart(); }

  run.backburner.schedule('actions', function() {
    if (Ngular.testing && async) { asyncEnd(); }
    callback(promise);
  });
});

RSVP.Promise.prototype.fail = function(callback, label) {
  Ngular.deprecate('RSVP.Promise.fail has been renamed as RSVP.Promise.catch');
  return this['catch'](callback, label);
};

export function onerrorDefault(e) {
  var error;

  if (e && e.errorThrown) {
    // jqXHR provides this
    error = e.errorThrown;
    if (typeof error === 'string') {
      error = new Error(error);
    }
    error.__reason_with_error_thrown__ = e;
  } else {
    error = e;
  }

  if (error && error.name !== 'TransitionAborted') {
    if (Ngular.testing) {
      // ES6TODO: remove when possible
      if (!Test && Ngular.__loader.registry[testModuleName]) {
        Test = requireModule(testModuleName)['default'];
      }

      if (Test && Test.adapter) {
        Test.adapter.exception(error);
        Logger.error(error.stack);
      } else {
        throw error;
      }
    } else if (Ngular.onerror) {
      Ngular.onerror(error);
    } else {
      Logger.error(error.stack);
    }
  }
}

RSVP.on('error', onerrorDefault);

export default RSVP;
