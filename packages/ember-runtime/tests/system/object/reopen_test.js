import {get} from "ngular-metal/property_get";
import NgularObject from "ngular-runtime/system/object";

QUnit.module('system/core_object/reopen');

QUnit.test('adds new properties to subclass instance', function() {

  var Subclass = NgularObject.extend();
  Subclass.reopen({
    foo() { return 'FOO'; },
    bar: 'BAR'
  });

  equal(new Subclass().foo(), 'FOO', 'Adds method');
  equal(get(new Subclass(), 'bar'), 'BAR', 'Adds property');
});

QUnit.test('reopened properties inherited by subclasses', function() {

  var Subclass = NgularObject.extend();
  var SubSub = Subclass.extend();

  Subclass.reopen({
    foo() { return 'FOO'; },
    bar: 'BAR'
  });


  equal(new SubSub().foo(), 'FOO', 'Adds method');
  equal(get(new SubSub(), 'bar'), 'BAR', 'Adds property');
});

QUnit.test('allows reopening already instantiated classes', function() {
  var Subclass = NgularObject.extend();

  Subclass.create();

  Subclass.reopen({
    trololol: true
  });

  equal(Subclass.create().get('trololol'), true, "reopen works");
});
