import run from "ngular-metal/run_loop";
import { hasPropertyAccessors } from "ngular-metal/platform/define_property";
import { observer } from "ngular-metal/mixin";
import { set } from "ngular-metal/property_set";
import { bind } from "ngular-metal/binding";
import {
  beginPropertyChanges,
  endPropertyChanges
} from "ngular-metal/property_events";
import objectKeys from "ngular-metal/keys";
import { testBoth } from "ngular-metal/tests/props_helper";
import NgularObject from "ngular-runtime/system/object";

QUnit.module('ngular-runtime/system/object/destroy_test');

testBoth("should schedule objects to be destroyed at the end of the run loop", function(get, set) {
  var obj = NgularObject.create();
  var meta;

  run(function() {
    obj.destroy();
    meta = obj['__ngular_meta__'];
    ok(meta, "meta is not destroyed immediately");
    ok(get(obj, 'isDestroying'), "object is marked as destroying immediately");
    ok(!get(obj, 'isDestroyed'), "object is not destroyed immediately");
  });

  meta = obj['__ngular_meta__'];
  ok(!meta, "meta is destroyed after run loop finishes");
  ok(get(obj, 'isDestroyed'), "object is destroyed after run loop finishes");
});

if (Ngular.FEATURES.isEnabled('mandatory-setter')) {
  if (hasPropertyAccessors) {
    // MANDATORY_SETTER moves value to meta.values
    // a destroyed object removes meta but leaves the accessor
    // that looks it up
    QUnit.test("should raise an exception when modifying watched properties on a destroyed object", function() {
      var obj = NgularObject.createWithMixins({
        foo: "bar",
        fooDidChange: observer('foo', function() { })
      });

      run(function() {
        obj.destroy();
      });

      throws(function() {
        set(obj, 'foo', 'baz');
      }, Error, "raises an exception");
    });
  }
}

QUnit.test("observers should not fire after an object has been destroyed", function() {
  var count = 0;
  var obj = NgularObject.createWithMixins({
    fooDidChange: observer('foo', function() {
      count++;
    })
  });

  obj.set('foo', 'bar');

  equal(count, 1, "observer was fired once");

  run(function() {
    beginPropertyChanges();
    obj.set('foo', 'quux');
    obj.destroy();
    endPropertyChanges();
  });

  equal(count, 1, "observer was not called after object was destroyed");
});

QUnit.test("destroyed objects should not see each others changes during teardown but a long lived object should", function () {
  var shouldChange = 0;
  var shouldNotChange = 0;

  var objs = {};

  var A = NgularObject.extend({
    objs: objs,
    isAlive: true,
    willDestroy() {
      this.set('isAlive', false);
    },
    bDidChange: observer('objs.b.isAlive', function () {
      shouldNotChange++;
    }),
    cDidChange: observer('objs.c.isAlive', function () {
      shouldNotChange++;
    })
  });

  var B = NgularObject.extend({
    objs: objs,
    isAlive: true,
    willDestroy() {
      this.set('isAlive', false);
    },
    aDidChange: observer('objs.a.isAlive', function () {
      shouldNotChange++;
    }),
    cDidChange: observer('objs.c.isAlive', function () {
      shouldNotChange++;
    })
  });

  var C = NgularObject.extend({
    objs: objs,
    isAlive: true,
    willDestroy() {
      this.set('isAlive', false);
    },
    aDidChange: observer('objs.a.isAlive', function () {
      shouldNotChange++;
    }),
    bDidChange: observer('objs.b.isAlive', function () {
      shouldNotChange++;
    })
  });

  var LongLivedObject =  NgularObject.extend({
    objs: objs,
    isAliveDidChange: observer('objs.a.isAlive', function () {
      shouldChange++;
    })
  });

  objs.a = new A();

  objs.b = new B();

  objs.c = new C();

  new LongLivedObject();

  run(function () {
    var keys = objectKeys(objs);
    for (var i = 0, l = keys.length; i < l; i++) {
      objs[keys[i]].destroy();
    }
  });

  equal(shouldNotChange, 0, 'destroyed graph objs should not see change in willDestroy');
  equal(shouldChange, 1, 'long lived should see change in willDestroy');
});

QUnit.test("bindings should be synced when are updated in the willDestroy hook", function() {
  var bar = NgularObject.create({
    value: false,
    willDestroy() {
      this.set('value', true);
    }
  });

  var foo = NgularObject.create({
    value: null,
    bar: bar
  });

  run(function() {
    bind(foo, 'value', 'bar.value');
  });

  ok(bar.get('value') === false, 'the initial value has been bound');

  run(function() {
    bar.destroy();
  });

  ok(foo.get('value'), 'foo is synced when the binding is updated in the willDestroy hook');
});
