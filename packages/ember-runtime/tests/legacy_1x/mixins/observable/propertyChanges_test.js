/*
  NOTE: This test is adapted from the 1.x series of unit tests.  The tests
  are the same except for places where we intend to break the API we instead
  validate that we warn the developer appropriately.

  CHANGES FROM 1.6:

  * Create ObservableObject which includes Ngular.Observable
  * Remove test that tests internal _kvo_changeLevel property.  This is an
    implementation detail.
  * Remove test for allPropertiesDidChange
  * Removed star observer test.  no longer supported
  * Removed property revision test.  no longer supported
*/

// ========================================================================
// Ngular.Observable Tests
// ========================================================================

import NgularObject from 'ngular-runtime/system/object';
import Observable from 'ngular-runtime/mixins/observable';
import {computed} from 'ngular-metal/computed';
import {observer} from "ngular-metal/mixin";

var ObservableObject = NgularObject.extend(Observable);

var revMatches = false;
var ObjectA;

QUnit.module("object.propertyChanges", {
  setup() {
    ObjectA = ObservableObject.createWithMixins({
      foo  : 'fooValue',
      prop : 'propValue',

      action: observer('foo', function() {
        this.set('prop', 'changedPropValue');
      }),

      newFoo : 'newFooValue',
      newProp: 'newPropValue',

      notifyAction: observer('newFoo', function() {
        this.set('newProp', 'changedNewPropValue');
      }),

      notifyAllAction: observer('prop', function() {
        this.set('newFoo', 'changedNewFooValue');
      }),

      starProp: null,
      starObserver(target, key, value, rev) {
        revMatches = (rev === target.propertyRevision);
        this.starProp = key;
      }

    });
  }
});

QUnit.test("should observe the changes within the nested begin / end property changes", function() {

  //start the outer nest
  ObjectA.beginPropertyChanges();

  // Inner nest
  ObjectA.beginPropertyChanges();
  ObjectA.set('foo', 'changeFooValue');

  equal(ObjectA.prop, "propValue");
  ObjectA.endPropertyChanges();

  //end inner nest
  ObjectA.set('prop', 'changePropValue');
  equal(ObjectA.newFoo, "newFooValue");

  //close the outer nest
  ObjectA.endPropertyChanges();

  equal(ObjectA.prop, "changedPropValue");
  equal(ObjectA.newFoo, "changedNewFooValue");
});

QUnit.test("should observe the changes within the begin and end property changes", function() {

  ObjectA.beginPropertyChanges();
  ObjectA.set('foo', 'changeFooValue');

  equal(ObjectA.prop, "propValue");
  ObjectA.endPropertyChanges();

  equal(ObjectA.prop, "changedPropValue");
});

QUnit.test("should indicate that the property of an object has just changed", function() {
  // indicate that property of foo will change to its subscribers
  ObjectA.propertyWillChange('foo');

  //Value of the prop is unchanged yet as this will be changed when foo changes
  equal(ObjectA.prop, 'propValue');

  //change the value of foo.
  ObjectA.set('foo', 'changeFooValue');

  // Indicate the subscribers of foo that the value has just changed
  ObjectA.propertyDidChange('foo', null);

  // Values of prop has just changed
  equal(ObjectA.prop, 'changedPropValue');
});

QUnit.test("should notify that the property of an object has changed", function() {
  // Notify to its subscriber that the values of 'newFoo' will be changed. In this
  // case the observer is "newProp". Therefore this will call the notifyAction function
  // and value of "newProp" will be changed.
  ObjectA.notifyPropertyChange('newFoo', 'fooValue');

  //value of newProp changed.
  equal(ObjectA.newProp, 'changedNewPropValue');
});

QUnit.test("should invalidate function property cache when notifyPropertyChange is called", function() {

  var a = ObservableObject.createWithMixins({
    _b: null,
    b: computed({
      get: function() { return this._b; },
      set: function(key, value) {
        this._b = value;
        return this;
      }
    }).volatile()
  });

  a.set('b', 'foo');
  equal(a.get('b'), 'foo', 'should have set the correct value for property b');

  a._b = 'bar';
  a.notifyPropertyChange('b');
  a.set('b', 'foo');
  equal(a.get('b'), 'foo', 'should have invalidated the cache so that the newly set value is actually set');

});
