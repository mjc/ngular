import {observer as ngularObserver} from 'ngular-metal/mixin';
import run from "ngular-metal/run_loop";
import {Binding} from "ngular-metal/binding";
import Observable from "ngular-runtime/mixins/observable";
import NgularObject from 'ngular-runtime/system/object';

/*
  NOTE: This test is adapted from the 1.x series of unit tests.  The tests
  are the same except for places where we intend to break the API we instead
  validate that we warn the developer appropriately.

  CHANGES FROM 1.6:

  * Updated the API usage for setting up and syncing Binding since these
    are not the APIs this file is testing.

  * Disabled a call to invokeOnce() around line 127 because it appeared to be
    broken anyway.  I don't think it ever even worked.
*/

var MyApp, binding1, binding2;

QUnit.module("System:run_loop() - chained binding", {
  setup() {
    MyApp = {};
    MyApp.first = NgularObject.createWithMixins(Observable, {
      output: 'MyApp.first'
    });

    MyApp.second = NgularObject.createWithMixins(Observable, {
      input: 'MyApp.second',
      output: 'MyApp.second',

      inputDidChange: ngularObserver("input", function() {
        this.set("output", this.get("input"));
      })

    });

    MyApp.third = NgularObject.createWithMixins(Observable, {
      input: "MyApp.third"
    });
  }
});

QUnit.test("Should propagate bindings after the RunLoop completes (using Ngular.RunLoop)", function() {
  run(function () {

    //Binding of output of MyApp.first object to input of MyApp.second object
    binding1 = Binding.from("first.output")
      .to("second.input").connect(MyApp);

    //Binding of output of MyApp.second object to input of MyApp.third object
    binding2 = Binding.from("second.output")
      .to("third.input").connect(MyApp);
  });

  run(function () {
    // Based on the above binding if you change the output of MyApp.first
    // object it should change the all the variable of
    //  MyApp.first,MyApp.second and MyApp.third object
    MyApp.first.set("output", "change");

    //Changes the output of the MyApp.first object
    equal(MyApp.first.get("output"), "change");

    //since binding has not taken into effect the value still remains as change.
    equal(MyApp.second.get("output"), "MyApp.first");
  }); // allows bindings to trigger...

  //Value of the output variable changed to 'change'
  equal(MyApp.first.get("output"), "change");

  //Since binding triggered after the end loop the value changed to 'change'.
  equal(MyApp.second.get("output"), "change");
});

QUnit.test("Should propagate bindings after the RunLoop completes", function() {
  run(function () {
    //Binding of output of MyApp.first object to input of MyApp.second object
    binding1 = Binding.from("first.output")
      .to("second.input").connect(MyApp);

    //Binding of output of MyApp.second object to input of MyApp.third object
    binding2 = Binding.from("second.output")
      .to("third.input").connect(MyApp);
  });

  run(function () {
    //Based on the above binding if you change the output of MyApp.first object it should
    //change the all the variable of MyApp.first,MyApp.second and MyApp.third object
    MyApp.first.set("output", "change");

    //Changes the output of the MyApp.first object
    equal(MyApp.first.get("output"), "change");

    //since binding has not taken into effect the value still remains as change.
    equal(MyApp.second.get("output"), "MyApp.first");
  });

  //Value of the output variable changed to 'change'
  equal(MyApp.first.get("output"), "change");

  //Since binding triggered after the end loop the value changed to 'change'.
  equal(MyApp.second.get("output"), "change");
});
