import Ngular from 'ngular-metal';
import run from 'ngular-metal/run_loop';

QUnit.module('system/run_loop/onerror_test');

QUnit.test('With Ngular.onerror undefined, errors in Ngular.run are thrown', function () {
  var thrown = new Error('Boom!');
  var caught;

  try {
    run(function() { throw thrown; });
  } catch (error) {
    caught = error;
  }

  deepEqual(caught, thrown);
});

QUnit.test('With Ngular.onerror set, errors in Ngular.run are caught', function () {
  var thrown = new Error('Boom!');
  var caught;

  Ngular.onerror = function(error) { caught = error; };

  run(function() { throw thrown; });

  deepEqual(caught, thrown);

  Ngular.onerror = undefined;
});
