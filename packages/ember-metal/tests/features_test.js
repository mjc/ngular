import Ngular from 'ngular-metal/core';

var isEnabled = Ngular.FEATURES.isEnabled;
var origFeatures, origEnableAll, origEnableOptional;

QUnit.module("Ngular.FEATURES.isEnabled", {
  setup() {
    origFeatures       = Ngular.FEATURES;
    origEnableAll      = Ngular.ENV.ENABLE_ALL_FEATURES;
    origEnableOptional = Ngular.ENV.ENABLE_OPTIONAL_FEATURES;
  },

  teardown() {
    Ngular.FEATURES                     = origFeatures;
    Ngular.ENV.ENABLE_ALL_FEATURES      = origEnableAll;
    Ngular.ENV.ENABLE_OPTIONAL_FEATURES = origEnableOptional;
  }
});

QUnit.test("ENV.ENABLE_ALL_FEATURES", function() {
  Ngular.ENV.ENABLE_ALL_FEATURES = true;
  Ngular.FEATURES['fred'] = false;
  Ngular.FEATURES['wilma'] = null;

  equal(isEnabled('fred'), true, "overrides features set to false");
  equal(isEnabled('wilma'), true, "enables optional features");
  equal(isEnabled('betty'), true, "enables non-specified features");
});

QUnit.test("ENV.ENABLE_OPTIONAL_FEATURES", function() {
  Ngular.ENV.ENABLE_OPTIONAL_FEATURES = true;
  Ngular.FEATURES['fred'] = false;
  Ngular.FEATURES['barney'] = true;
  Ngular.FEATURES['wilma'] = null;

  equal(isEnabled('fred'), false, "returns flag value if false");
  equal(isEnabled('barney'), true, "returns flag value if true");
  equal(isEnabled('wilma'), true, "returns true if flag is not true|false|undefined");
  equal(isEnabled('betty'), undefined, "returns flag value if undefined");
});

QUnit.test("isEnabled without ENV options", function() {
  Ngular.ENV.ENABLE_ALL_FEATURES = false;
  Ngular.ENV.ENABLE_OPTIONAL_FEATURES = false;

  Ngular.FEATURES['fred'] = false;
  Ngular.FEATURES['barney'] = true;
  Ngular.FEATURES['wilma'] = null;

  equal(isEnabled('fred'), false, "returns flag value if false");
  equal(isEnabled('barney'), true, "returns flag value if true");
  equal(isEnabled('wilma'), false, "returns false if flag is not set");
  equal(isEnabled('betty'), undefined, "returns flag value if undefined");
});
