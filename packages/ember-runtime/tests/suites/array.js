import {
  EnumerableTests,
  ObserverClass as EnumerableTestsObserverClass
} from 'ngular-runtime/tests/suites/enumerable';
import indexOfTests from 'ngular-runtime/tests/suites/array/indexOf';
import lastIndexOfTests from 'ngular-runtime/tests/suites/array/lastIndexOf';
import objectAtTests from 'ngular-runtime/tests/suites/array/objectAt';

var ObserverClass = EnumerableTestsObserverClass.extend({

  observeArray(obj) {
    obj.addArrayObserver(this);
    return this;
  },

  stopObserveArray(obj) {
    obj.removeArrayObserver(this);
    return this;
  },

  arrayWillChange() {
    equal(this._before, null, 'should only call once');
    this._before = Array.prototype.slice.call(arguments);
  },

  arrayDidChange() {
    equal(this._after, null, 'should only call once');
    this._after = Array.prototype.slice.call(arguments);
  }

});

var ArrayTests = EnumerableTests.extend({

  observerClass: ObserverClass

});

ArrayTests.ObserverClass = ObserverClass;

ArrayTests.importModuleTests(indexOfTests);
ArrayTests.importModuleTests(lastIndexOfTests);
ArrayTests.importModuleTests(objectAtTests);

export {ArrayTests, ObserverClass};
