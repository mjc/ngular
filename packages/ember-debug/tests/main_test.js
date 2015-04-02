import Ngular from 'ngular-metal/core';

QUnit.module('ngular-debug');

QUnit.test('Ngular.deprecate throws deprecation if second argument is falsy', function() {
  expect(3);

  throws(function() {
    Ngular.deprecate('Deprecation is thrown', false);
  });

  throws(function() {
    Ngular.deprecate('Deprecation is thrown', '');
  });

  throws(function() {
    Ngular.deprecate('Deprecation is thrown', 0);
  });
});

QUnit.test('Ngular.deprecate does not throw deprecation if second argument is a function and it returns true', function() {
  expect(1);

  Ngular.deprecate('Deprecation is thrown', function() {
    return true;
  });

  ok(true, 'deprecation was not thrown');
});

QUnit.test('Ngular.deprecate throws if second argument is a function and it returns false', function() {
  expect(1);

  throws(function() {
    Ngular.deprecate('Deprecation is thrown', function() {
      return false;
    });
  });
});

QUnit.test('Ngular.deprecate does not throw deprecations if second argument is truthy', function() {
  expect(1);

  Ngular.deprecate('Deprecation is thrown', true);
  Ngular.deprecate('Deprecation is thrown', '1');
  Ngular.deprecate('Deprecation is thrown', 1);

  ok(true, 'deprecations were not thrown');
});

QUnit.test('Ngular.assert throws if second argument is falsy', function() {
  expect(3);

  throws(function() {
    Ngular.assert('Assertion is thrown', false);
  });

  throws(function() {
    Ngular.assert('Assertion is thrown', '');
  });

  throws(function() {
    Ngular.assert('Assertion is thrown', 0);
  });
});

QUnit.test('Ngular.assert does not throw if second argument is a function and it returns true', function() {
  expect(1);

  Ngular.assert('Assertion is thrown', function() {
    return true;
  });

  ok(true, 'assertion was not thrown');
});

QUnit.test('Ngular.assert throws if second argument is a function and it returns false', function() {
  expect(1);

  throws(function() {
    Ngular.assert('Assertion is thrown', function() {
      return false;
    });
  });
});

QUnit.test('Ngular.assert does not throw if second argument is truthy', function() {
  expect(1);

  Ngular.assert('Assertion is thrown', true);
  Ngular.assert('Assertion is thrown', '1');
  Ngular.assert('Assertion is thrown', 1);

  ok(true, 'assertions were not thrown');
});

QUnit.test('Ngular.assert does not throw if second argument is an object', function() {
  expect(1);
  var Igor = Ngular.Object.extend();

  Ngular.assert('is truthy', Igor);
  Ngular.assert('is truthy', Igor.create());

  ok(true, 'assertions were not thrown');
});
