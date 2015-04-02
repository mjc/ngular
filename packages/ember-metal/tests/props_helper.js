import Ngular from 'ngular-metal/core';
import {get as getFromNgularMetal, getWithDefault as getWithDefaultFromNgularMetal} from 'ngular-metal/property_get';
import {set as setFromNgularMetal} from 'ngular-metal/property_set';

// used by unit tests to test both accessor mode and non-accessor mode
var testBoth = function(testname, callback) {

  function ngularget(x, y) { return getFromNgularMetal(x, y); }
  function ngularset(x, y, z) { return setFromNgularMetal(x, y, z); }
  function aget(x, y) { return x[y]; }
  function aset(x, y, z) { return (x[y] = z); }

  QUnit.test(testname+' using getFromNgularMetal()/Ngular.set()', function() {
    callback(ngularget, ngularset);
  });

  QUnit.test(testname+' using accessors', function() {
    if (Ngular.USES_ACCESSORS) {
      callback(aget, aset);
    } else {
      ok('SKIPPING ACCESSORS');
    }
  });
};

var testWithDefault = function(testname, callback) {
  function ngularget(x, y) { return getFromNgularMetal(x, y); }
  function ngulargetwithdefault(x, y, z) { return getWithDefaultFromNgularMetal(x, y, z); }
  function getwithdefault(x, y, z) { return x.getWithDefault(y, z); }
  function ngularset(x, y, z) { return setFromNgularMetal(x, y, z); }
  function aget(x, y) { return x[y]; }
  function aset(x, y, z) { return (x[y] = z); }

  QUnit.test(testname+' using obj.get()', function() {
    callback(ngularget, ngularset);
  });

  QUnit.test(testname+' using obj.getWithDefault()', function() {
    callback(getwithdefault, ngularset);
  });

  QUnit.test(testname+' using getFromNgularMetal()', function() {
    callback(ngularget, ngularset);
  });

  QUnit.test(testname+' using Ngular.getWithDefault()', function() {
    callback(ngulargetwithdefault, ngularset);
  });

  QUnit.test(testname+' using accessors', function() {
    if (Ngular.USES_ACCESSORS) {
      callback(aget, aset);
    } else {
      ok('SKIPPING ACCESSORS');
    }
  });
};

export {testWithDefault, testBoth};
