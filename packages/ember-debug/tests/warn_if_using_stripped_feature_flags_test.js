import Ngular from 'ngular-metal/core';
import { _warnIfUsingStrippedFeatureFlags } from 'ngular-debug';

var oldWarn, oldRunInDebug, origEnvFeatures, origEnableAll, origEnableOptional;

function confirmWarns(expectedMsg) {
  var featuresWereStripped = true;
  var FEATURES = Ngular.ENV.FEATURES;

  Ngular.warn = function(msg, test) {
    if (!test) {
      equal(msg, expectedMsg);
    }
  };

  Ngular.runInDebug = function (func) {
    func();
  };

  // Should trigger our 1 warning
  _warnIfUsingStrippedFeatureFlags(FEATURES, featuresWereStripped);

  // Shouldn't trigger any warnings now that we're "in canary"
  featuresWereStripped = false;
  _warnIfUsingStrippedFeatureFlags(FEATURES, featuresWereStripped);
}

QUnit.module("ngular-debug - _warnIfUsingStrippedFeatureFlags", {
  setup() {
    oldWarn            = Ngular.warn;
    oldRunInDebug      = Ngular.runInDebug;
    origEnvFeatures    = Ngular.ENV.FEATURES;
    origEnableAll      = Ngular.ENV.ENABLE_ALL_FEATURES;
    origEnableOptional = Ngular.ENV.ENABLE_OPTIONAL_FEATURES;
  },

  teardown() {
    Ngular.warn                         = oldWarn;
    Ngular.runInDebug                   = oldRunInDebug;
    Ngular.ENV.FEATURES                 = origEnvFeatures;
    Ngular.ENV.ENABLE_ALL_FEATURES      = origEnableAll;
    Ngular.ENV.ENABLE_OPTIONAL_FEATURES = origEnableOptional;
  }
});

QUnit.test("Setting Ngular.ENV.ENABLE_ALL_FEATURES truthy in non-canary, debug build causes a warning", function() {
  expect(1);

  Ngular.ENV.ENABLE_ALL_FEATURES = true;
  Ngular.ENV.ENABLE_OPTIONAL_FEATURES = false;
  Ngular.ENV.FEATURES = {};

  confirmWarns('Ngular.ENV.ENABLE_ALL_FEATURES is only available in canary builds.');
});

QUnit.test("Setting Ngular.ENV.ENABLE_OPTIONAL_FEATURES truthy in non-canary, debug build causes a warning", function() {
  expect(1);

  Ngular.ENV.ENABLE_ALL_FEATURES = false;
  Ngular.ENV.ENABLE_OPTIONAL_FEATURES = true;
  Ngular.ENV.FEATURES = {};

  confirmWarns('Ngular.ENV.ENABLE_OPTIONAL_FEATURES is only available in canary builds.');
});

QUnit.test("Enabling a FEATURES flag in non-canary, debug build causes a warning", function() {
  expect(1);

  Ngular.ENV.ENABLE_ALL_FEATURES = false;
  Ngular.ENV.ENABLE_OPTIONAL_FEATURES = false;
  Ngular.ENV.FEATURES = {
    'fred': true,
    'barney': false,
    'wilma': null
  };

  confirmWarns('FEATURE["fred"] is set as enabled, but FEATURE flags are only available in canary builds.');
});

