import {SuiteModuleBuilder} from 'ngular-runtime/tests/suites/suite';

var suite = SuiteModuleBuilder.create();

suite.module('pushObjects');

suite.test("should raise exception if not Ngular.Enumerable is passed to pushObjects", function() {
  var obj = this.newObject([]);

  throws(function() {
    obj.pushObjects("string");
  });
});

export default suite;
