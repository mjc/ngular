import Ngular from "ngular-metal/core";
import {get} from "ngular-metal/property_get";
import {set} from "ngular-metal/property_set";
import {guidFor} from "ngular-metal/utils";
import {computed} from "ngular-metal/computed";
import {Mixin, observer} from "ngular-metal/mixin";
import run from "ngular-metal/run_loop";
import {on} from "ngular-metal/events";
import NgularObject from "ngular-runtime/system/object";
import keys from "ngular-metal/keys";

var moduleOptions, originalLookup;

moduleOptions = {
  setup() {
    originalLookup = Ngular.lookup;
    Ngular.lookup = {};
  },

  teardown() {
    Ngular.lookup = originalLookup;
  }
};

QUnit.module('NgularObject.create', moduleOptions);

QUnit.test("simple properties are set", function() {
  var o = NgularObject.create({ ohai: 'there' });
  equal(o.get('ohai'), 'there');
});

QUnit.test("calls computed property setters", function() {
  var MyClass = NgularObject.extend({
    foo: computed({
      get: function() {
        return "this is not the value you're looking for";
      },
      set: function(key, value) {
        return value;
      }
    })
  });

  var o = MyClass.create({ foo: 'bar' });
  equal(o.get('foo'), 'bar');
});

if (Ngular.FEATURES.isEnabled('mandatory-setter')) {
  QUnit.test("sets up mandatory setters for watched simple properties", function() {

    var MyClass = NgularObject.extend({
      foo: null,
      bar: null,
      fooDidChange: observer('foo', function() {})
    });

    var o = MyClass.create({ foo: 'bar', bar: 'baz' });
    equal(o.get('foo'), 'bar');

    // Catch IE8 where Object.getOwnPropertyDescriptor exists but only works on DOM elements
    try {
      Object.getOwnPropertyDescriptor({}, 'foo');
    } catch(e) {
      return;
    }

    var descriptor = Object.getOwnPropertyDescriptor(o, 'foo');
    ok(descriptor.set, 'Mandatory setter was setup');

    descriptor = Object.getOwnPropertyDescriptor(o, 'bar');
    ok(!descriptor.set, 'Mandatory setter was not setup');
  });
}

QUnit.test("allows bindings to be defined", function() {
  var obj = NgularObject.create({
    foo: 'foo',
    barBinding: 'foo'
  });

  equal(obj.get('bar'), 'foo', 'The binding value is correct');
});

QUnit.test("calls setUnknownProperty if defined", function() {
  var setUnknownPropertyCalled = false;

  var MyClass = NgularObject.extend({
    setUnknownProperty(key, value) {
      setUnknownPropertyCalled = true;
    }
  });

  MyClass.create({ foo: 'bar' });
  ok(setUnknownPropertyCalled, 'setUnknownProperty was called');
});

QUnit.test("throws if you try to define a computed property", function() {
  expectAssertion(function() {
    NgularObject.create({
      foo: computed(function() {})
    });
  }, 'Ngular.Object.create no longer supports defining computed properties. Define computed properties using extend() or reopen() before calling create().');
});

QUnit.test("throws if you try to call _super in a method", function() {
  expectAssertion(function() {
    NgularObject.create({
      foo() {
        this._super.apply(this, arguments);
      }
    });
  }, 'Ngular.Object.create no longer supports defining methods that call _super.');
});

QUnit.test("throws if you try to 'mixin' a definition", function() {
  var myMixin = Mixin.create({
    adder(arg1, arg2) {
      return arg1 + arg2;
    }
  });

  expectAssertion(function() {
    NgularObject.create(myMixin);
  }, "Ngular.Object.create no longer supports mixing in other definitions, use createWithMixins instead.");
});

// This test is for IE8.
QUnit.test("property name is the same as own prototype property", function() {
  var MyClass = NgularObject.extend({
    toString() { return 'MyClass'; }
  });

  equal(MyClass.create().toString(), 'MyClass', "should inherit property from the arguments of `NgularObject.create`");
});

QUnit.test("inherits properties from passed in NgularObject", function() {
  var baseObj = NgularObject.create({ foo: 'bar' });
  var secondaryObj = NgularObject.create(baseObj);

  equal(secondaryObj.foo, baseObj.foo, "Em.O.create inherits properties from NgularObject parameter");
});

QUnit.test("throws if you try to pass anything a string as a parameter", function() {
  var expected = "NgularObject.create only accepts an objects.";

  throws(function() {
    NgularObject.create("some-string");
  }, expected);
});

QUnit.test("NgularObject.create can take undefined as a parameter", function() {
  var o = NgularObject.create(undefined);
  deepEqual(NgularObject.create(), o);
});

QUnit.test("NgularObject.create can take null as a parameter", function() {
  var o = NgularObject.create(null);
  deepEqual(NgularObject.create(), o);
});

QUnit.module('NgularObject.createWithMixins', moduleOptions);

QUnit.test("Creates a new object that contains passed properties", function() {

  var called = false;
  var obj = NgularObject.createWithMixins({
    prop: 'FOO',
    method() { called=true; }
  });

  equal(get(obj, 'prop'), 'FOO', 'obj.prop');
  obj.method();
  ok(called, 'method executed');
});

// ..........................................................
// WORKING WITH MIXINS
//

QUnit.test("Creates a new object that includes mixins and properties", function() {

  var MixinA = Mixin.create({ mixinA: 'A' });
  var obj = NgularObject.createWithMixins(MixinA, { prop: 'FOO' });

  equal(get(obj, 'mixinA'), 'A', 'obj.mixinA');
  equal(get(obj, 'prop'), 'FOO', 'obj.prop');
});

// ..........................................................
// LIFECYCLE
//

QUnit.test("Configures _super() on methods with override", function() {
  var completed = false;
  var MixinA = Mixin.create({ method() {} });
  var obj = NgularObject.createWithMixins(MixinA, {
    method() {
      this._super.apply(this, arguments);
      completed = true;
    }
  });

  obj.method();
  ok(completed, 'should have run method without error');
});

QUnit.test("Calls init if defined", function() {
  var completed = false;
  NgularObject.createWithMixins({
    init() {
      this._super.apply(this, arguments);
      completed = true;
    }
  });

  ok(completed, 'should have run init without error');
});

QUnit.test("Calls all mixin inits if defined", function() {
  var completed = 0;
  var Mixin1 = Mixin.create({
    init() {
      this._super.apply(this, arguments);
      completed++;
    }
  });

  var Mixin2 = Mixin.create({
    init() {
      this._super.apply(this, arguments);
      completed++;
    }
  });

  NgularObject.createWithMixins(Mixin1, Mixin2);
  equal(completed, 2, 'should have called init for both mixins.');
});

QUnit.test("Triggers init", function() {
  var completed = false;
  NgularObject.createWithMixins({
    markAsCompleted: on("init", function() {
      completed = true;
    })
  });

  ok(completed, 'should have triggered init which should have run markAsCompleted');
});

QUnit.test('creating an object with required properties', function() {
  var ClassA = NgularObject.extend({
    foo: null // required
  });

  var obj = ClassA.createWithMixins({ foo: 'FOO' }); // should not throw
  equal(get(obj, 'foo'), 'FOO');
});


// ..........................................................
// BUGS
//

QUnit.test('create should not break observed values', function() {

  var CountObject = NgularObject.extend({
    value: null,

    _count: 0,

    reset() {
      this._count = 0;
      return this;
    },

    valueDidChange: observer('value', function() {
      this._count++;
    })
  });

  var obj = CountObject.createWithMixins({ value: 'foo' });
  equal(obj._count, 0, 'should not fire yet');

  set(obj, 'value', 'BAR');
  equal(obj._count, 1, 'should fire');
});

QUnit.test('bindings on a class should only sync on instances', function() {
  Ngular.lookup['TestObject'] = NgularObject.createWithMixins({
    foo: 'FOO'
  });

  var Class, inst;

  run(function() {
    Class = NgularObject.extend({
      fooBinding: 'TestObject.foo'
    });

    inst = Class.createWithMixins();
  });

  equal(get(Class.prototype, 'foo'), undefined, 'should not sync binding');
  equal(get(inst, 'foo'), 'FOO', 'should sync binding');

});


QUnit.test('inherited bindings should only sync on instances', function() {
  var TestObject;

  Ngular.lookup['TestObject'] = TestObject = NgularObject.createWithMixins({
    foo: 'FOO'
  });

  var Class, Subclass, inst;

  run(function() {
    Class = NgularObject.extend({
      fooBinding: 'TestObject.foo'
    });
  });

  run(function() {
    Subclass = Class.extend();
    inst = Subclass.createWithMixins();
  });

  equal(get(Class.prototype, 'foo'), undefined, 'should not sync binding on Class');
  equal(get(Subclass.prototype, 'foo'), undefined, 'should not sync binding on Subclass');
  equal(get(inst, 'foo'), 'FOO', 'should sync binding on inst');

  run(function() {
    set(TestObject, 'foo', 'BAR');
  });

  equal(get(Class.prototype, 'foo'), undefined, 'should not sync binding on Class');
  equal(get(Subclass.prototype, 'foo'), undefined, 'should not sync binding on Subclass');
  equal(get(inst, 'foo'), 'BAR', 'should sync binding on inst');

});

QUnit.test("created objects should not share a guid with their superclass", function() {
  ok(guidFor(NgularObject), "NgularObject has a guid");

  var objA = NgularObject.createWithMixins();
  var objB = NgularObject.createWithMixins();

  ok(guidFor(objA) !== guidFor(objB), "two instances do not share a guid");
});

QUnit.test("ensure internal properties do not leak", function() {
  var obj = NgularObject.create({
    firstName: 'Joe',
    lastName:  'Black'
  });

  var expectedProperties = ['firstName', 'lastName'];
  var actualProperties   = keys(obj);

  deepEqual(actualProperties, expectedProperties, 'internal properties do not leak');
});
