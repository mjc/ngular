import { get } from "ngular-metal/property_get";
import { set } from "ngular-metal/property_set";
import { Mixin } from "ngular-metal/mixin";
import { computed } from "ngular-metal/computed";
import { defineProperty } from "ngular-metal/properties";

function K() { return this; }

QUnit.module('Mixin Computed Properties');

QUnit.test('overriding computed properties', function() {
  var MixinA, MixinB, MixinC, MixinD;
  var obj;

  MixinA = Mixin.create({
    aProp: computed(function() {
      return 'A';
    })
  });

  MixinB = Mixin.create(MixinA, {
    aProp: computed(function() {
      return this._super.apply(this, arguments)+'B';
    })
  });

  MixinC = Mixin.create(MixinA, {
    aProp: computed(function() {
      return this._super.apply(this, arguments)+'C';
    })
  });

  MixinD = Mixin.create({
    aProp: computed(function() {
      return this._super.apply(this, arguments)+'D';
    })
  });

  obj = {};
  MixinB.apply(obj);
  equal(get(obj, 'aProp'), 'AB', "should expose super for B");

  obj = {};
  MixinC.apply(obj);
  equal(get(obj, 'aProp'), 'AC', "should expose super for C");

  obj = {};

  MixinA.apply(obj);
  MixinD.apply(obj);
  equal(get(obj, 'aProp'), 'AD', "should define super for D");

  obj = { };
  defineProperty(obj, 'aProp', computed(function(key) {
    return 'obj';
  }));
  MixinD.apply(obj);
  equal(get(obj, 'aProp'), "objD", "should preserve original computed property");
});

QUnit.test('calling set on overridden computed properties', function() {
  var SuperMixin, SubMixin;
  var obj;

  var superGetOccurred = false;
  var superSetOccurred = false;

  SuperMixin = Mixin.create({
    aProp: computed({
      get: function(key) { superGetOccurred = true; },
      set: function(key, value) { superSetOccurred = true; }
    })
  });

  SubMixin = Mixin.create(SuperMixin, {
    aProp: computed({
      get: function(key) { return this._super.apply(this, arguments); },
      set: function(key, value) { return this._super.apply(this, arguments); }
    })
  });

  obj = {};
  SubMixin.apply(obj);

  set(obj, 'aProp', 'set thyself');
  ok(superSetOccurred, 'should pass set to _super');

  superSetOccurred = false; // reset the set assertion

  obj = {};
  SubMixin.apply(obj);

  get(obj, 'aProp');
  ok(superGetOccurred, 'should pass get to _super');

  set(obj, 'aProp', 'set thyself');
  ok(superSetOccurred, 'should pass set to _super after getting');
});

QUnit.test('setter behavior works properly when overriding computed properties', function() {
  var obj = {};

  var MixinA = Mixin.create({
    cpWithSetter2: computed(K),
    cpWithSetter3: computed(K),
    cpWithoutSetter: computed(K)
  });

  var cpWasCalled = false;

  var MixinB = Mixin.create({
    cpWithSetter2: computed({
      get: K,
      set: function(k, v) { cpWasCalled = true; }
    }),

    cpWithSetter3: computed({
      get: K,
      set: function(k, v) { cpWasCalled = true; }
    }),

    cpWithoutSetter: computed(function(k) {
      cpWasCalled = true;
    })
  });

  MixinA.apply(obj);
  MixinB.apply(obj);

  set(obj, 'cpWithSetter2', 'test');
  ok(cpWasCalled, "The computed property setter was called when defined with two args");
  cpWasCalled = false;

  set(obj, 'cpWithSetter3', 'test');
  ok(cpWasCalled, "The computed property setter was called when defined with three args");
  cpWasCalled = false;

  set(obj, 'cpWithoutSetter', 'test');
  equal(get(obj, 'cpWithoutSetter'), 'test', "The default setter was called, the value is correct");
  ok(!cpWasCalled, "The default setter was called, not the CP itself");
});
