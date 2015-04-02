import {
  subscribe,
  reset as instrumentationReset
} from "ngular-metal/instrumentation";
import run from "ngular-metal/run_loop";
import NgularView from "ngular-views/views/view";

var view, beforeCalls, afterCalls;

function confirmPayload(payload, view) {
  equal(payload && payload.object, view.toString(), 'payload object equals view.toString()');
  equal(payload && payload.containerKey, view._debugContainerKey, 'payload contains the containerKey');
  equal(payload && payload.view, view, 'payload contains the view itself');
}

QUnit.module("NgularView#instrumentation", {
  setup() {
    beforeCalls = [];
    afterCalls  = [];

    subscribe("render", {
      before(name, timestamp, payload) {
        beforeCalls.push(payload);
      },

      after(name, timestamp, payload) {
        afterCalls.push(payload);
      }
    });

    view = NgularView.create({
      _debugContainerKey: 'suchryzsd',
      instrumentDisplay: 'asdfasdfmewj'
    });
  },

  teardown() {
    if (view) {
      run(view, 'destroy');
    }

    instrumentationReset();
  }
});

QUnit.test("generates the proper instrumentation details when called directly", function() {
  var payload = {};

  view.instrumentDetails(payload);

  confirmPayload(payload, view);
});

QUnit.test("should add ngular-view to views", function() {
  run(view, 'createElement');

  confirmPayload(beforeCalls[0], view);
});
