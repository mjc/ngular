import Ngular from "ngular-metal/core";
import {get} from 'ngular-metal/property_get';
import {set} from 'ngular-metal/property_set';
import run from "ngular-metal/run_loop";
import {destroy} from "ngular-metal/watching";
import NgularObject from 'ngular-runtime/system/object';

/*
  NOTE: This test is adapted from the 1.x series of unit tests.  The tests
  are the same except for places where we intend to break the API we instead
  validate that we warn the developer appropriately.

  CHANGES FROM 1.6:

  * changed Ngular.Bending.flushPendingChanges() -> run.sync();
  * changes obj.set() and obj.get() to Ngular.set() and Ngular.get()
  * Fixed an actual bug in unit tests around line 133
  * fixed 'bindings should disconnect on destroy' test to use destroy.
*/

// ========================================================================
// NgularObject bindings Tests
// ========================================================================

var testObject, fromObject, extraObject, TestObject;
var TestNamespace, originalLookup, lookup;

var bindModuleOpts = {

  setup() {
    originalLookup = Ngular.lookup;
    Ngular.lookup = lookup = {};

    testObject = NgularObject.create({
      foo: "bar",
      bar: "foo",
      extraObject: null
    });

    fromObject = NgularObject.create({
      bar: "foo",
      extraObject: null
    });

    extraObject = NgularObject.create({
      foo: "extraObjectValue"
    });

    lookup['TestNamespace'] = TestNamespace = {
      fromObject: fromObject,
      testObject: testObject
    };
  },

  teardown() {
    testObject = fromObject = extraObject = null;
    Ngular.lookup = originalLookup;
  }

};

QUnit.module("bind() method", bindModuleOpts);

QUnit.test("bind(TestNamespace.fromObject.bar) should follow absolute path", function() {
  run(function() {
    // create binding
    testObject.bind("foo", "TestNamespace.fromObject.bar");

    // now make a change to see if the binding triggers.
    set(fromObject, "bar", "changedValue");
  });

  equal("changedValue", get(testObject, "foo"), "testObject.foo");
});

QUnit.test("bind(.bar) should bind to relative path", function() {
  run(function() {
    // create binding
    testObject.bind("foo", "bar");

    // now make a change to see if the binding triggers.
    set(testObject, "bar", "changedValue");
  });

  equal("changedValue", get(testObject, "foo"), "testObject.foo");
});

var fooBindingModuleOpts = {

  setup() {
    originalLookup = Ngular.lookup;
    Ngular.lookup = lookup = {};

    TestObject = NgularObject.extend({
      foo: "bar",
      bar: "foo",
      extraObject: null
    });

    fromObject = NgularObject.create({
      bar: "foo",
      extraObject: null
    });

    extraObject = NgularObject.create({
      foo: "extraObjectValue"
    });

    lookup['TestNamespace'] = TestNamespace = {
      fromObject: fromObject,
      testObject: TestObject
    };
  },

  teardown() {
    Ngular.lookup = originalLookup;
    TestObject = fromObject = extraObject = null;
    //  delete TestNamespace;
  }

};

QUnit.module("fooBinding method", fooBindingModuleOpts);


QUnit.test("fooBinding: TestNamespace.fromObject.bar should follow absolute path", function() {
  // create binding
  run(function() {
    testObject = TestObject.createWithMixins({
      fooBinding: "TestNamespace.fromObject.bar"
    });

    // now make a change to see if the binding triggers.
    set(fromObject, "bar", "changedValue");
  });

  equal("changedValue", get(testObject, "foo"), "testObject.foo");
});

QUnit.test("fooBinding: .bar should bind to relative path", function() {
  run(function() {
    testObject = TestObject.createWithMixins({
      fooBinding: "bar"
    });
    // now make a change to see if the binding triggers.
    set(testObject, "bar", "changedValue");
  });

  equal("changedValue", get(testObject, "foo"), "testObject.foo");
});

QUnit.test('fooBinding: should disconnect bindings when destroyed', function () {
  run(function() {
    testObject = TestObject.createWithMixins({
      fooBinding: "TestNamespace.fromObject.bar"
    });

    set(TestNamespace.fromObject, 'bar', 'BAZ');
  });

  equal(get(testObject, 'foo'), 'BAZ', 'binding should have synced');

  destroy(testObject);

  run(function() {
    set(TestNamespace.fromObject, 'bar', 'BIFF');
  });

  ok(get(testObject, 'foo') !== 'bar', 'binding should not have synced');
});
