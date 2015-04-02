/* global Promise:true */

import run from "ngular-metal/run_loop";
import RSVP from "ngular-runtime/ext/rsvp";

QUnit.module('Ngular.RSVP');

QUnit.test('Ensure that errors thrown from within a promise are sent to the console', function() {
  var error = new Error('Error thrown in a promise for testing purposes.');

  try {
    run(function() {
      new RSVP.Promise(function(resolve, reject) {
        throw error;
      });
    });
    ok(false, 'expected assertion to be thrown');
  } catch(e) {
    equal(e, error, "error was re-thrown");
  }
});

var asyncStarted = 0;
var asyncEnded = 0;
var Promise = RSVP.Promise;

var NgularTest;
var NgularTesting;

QUnit.module("Deferred RSVP's async + Testing", {
  setup() {
    NgularTest = Ngular.Test;
    NgularTesting = Ngular.testing;

    Ngular.Test = {
      adapter: {
        asyncStart() {
          asyncStarted++;
          QUnit.stop();
        },
        asyncEnd() {
          asyncEnded++;
          QUnit.start();
        }
      }
    };
  },
  teardown() {
    asyncStarted = 0;
    asyncEnded = 0;

    Ngular.testing = NgularTesting;
    Ngular.Test =  NgularTest;
  }
});

QUnit.test("given `Ngular.testing = true`, correctly informs the test suite about async steps", function() {
  expect(19);

  ok(!run.currentRunLoop, 'expect no run-loop');

  Ngular.testing = true;

  equal(asyncStarted, 0);
  equal(asyncEnded, 0);

  var user = Promise.resolve({
    name: 'tomster'
  });

  equal(asyncStarted, 0);
  equal(asyncEnded, 0);

  user.then(function(user) {
    equal(asyncStarted, 1);
    equal(asyncEnded, 1);

    equal(user.name, 'tomster');

    return Promise.resolve(1).then(function() {
      equal(asyncStarted, 1);
      equal(asyncEnded, 1);
    });

  }).then(function() {
    equal(asyncStarted, 1);
    equal(asyncEnded, 1);

    return new Promise(function(resolve) {
      QUnit.stop(); // raw async, we must inform the test framework manually
      setTimeout(function() {
        QUnit.start(); // raw async, we must inform the test framework manually

        equal(asyncStarted, 1);
        equal(asyncEnded, 1);

        resolve({
          name: 'async tomster'
        });

        equal(asyncStarted, 2);
        equal(asyncEnded, 1);
      }, 0);
    });
  }).then(function(user) {
    equal(user.name, 'async tomster');
    equal(asyncStarted, 2);
    equal(asyncEnded, 2);
  });
});

QUnit.test('TransitionAborted errors are not re-thrown', function() {
  expect(1);
  var fakeTransitionAbort = { name: 'TransitionAborted' };

  run(RSVP, 'reject', fakeTransitionAbort);

  ok(true, 'did not throw an error when dealing with TransitionAborted');
});

QUnit.test('rejections like jqXHR which have errorThrown property work', function() {
  expect(2);

  var wasNgularTesting = Ngular.testing;
  var wasOnError      = Ngular.onerror;

  try {
    Ngular.testing = false;
    Ngular.onerror = function(error) {
      equal(error, actualError, 'expected the real error on the jqXHR');
      equal(error.__reason_with_error_thrown__, jqXHR, 'also retains a helpful reference to the rejection reason');
    };

    var actualError = new Error("OMG what really happened");
    var jqXHR = {
      errorThrown: actualError
    };

    run(RSVP, 'reject', jqXHR);
  } finally {
    Ngular.onerror = wasOnError;
    Ngular.testing = wasNgularTesting;
  }
});


QUnit.test('rejections where the errorThrown is a string should wrap the sting in an error object', function() {
  expect(2);

  var wasNgularTesting = Ngular.testing;
  var wasOnError      = Ngular.onerror;

  try {
    Ngular.testing = false;
    Ngular.onerror = function(error) {
      equal(error.message, actualError, 'expected the real error on the jqXHR');
      equal(error.__reason_with_error_thrown__, jqXHR, 'also retains a helpful reference to the rejection reason');
    };

    var actualError = "OMG what really happened";
    var jqXHR = {
      errorThrown: actualError
    };

    run(RSVP, 'reject', jqXHR);
  } finally {
    Ngular.onerror = wasOnError;
    Ngular.testing = wasNgularTesting;
  }
});
