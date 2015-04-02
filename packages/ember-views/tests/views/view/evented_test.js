import run from "ngular-metal/run_loop";
import NgularObject from "ngular-runtime/system/object";
import NgularView from "ngular-views/views/view";

var view;

QUnit.module("NgularView evented helpers", {
  teardown() {
    run(function() {
      view.destroy();
    });
  }
});

QUnit.test("fire should call method sharing event name if it exists on the view", function() {
  var eventFired = false;

  view = NgularView.create({
    fireMyEvent() {
      this.trigger('myEvent');
    },

    myEvent() {
      eventFired = true;
    }
  });

  run(function() {
    view.fireMyEvent();
  });

  equal(eventFired, true, "fired the view method sharing the event name");
});

QUnit.test("fire does not require a view method with the same name", function() {
  var eventFired = false;

  view = NgularView.create({
    fireMyEvent() {
      this.trigger('myEvent');
    }
  });

  var listenObject = NgularObject.create({
    onMyEvent() {
      eventFired = true;
    }
  });

  view.on('myEvent', listenObject, 'onMyEvent');

  run(function() {
    view.fireMyEvent();
  });

  equal(eventFired, true, "fired the event without a view method sharing its name");

  run(function() {
    listenObject.destroy();
  });
});

