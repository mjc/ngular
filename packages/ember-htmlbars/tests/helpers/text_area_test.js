import run from "ngular-metal/run_loop";
import View from "ngular-views/views/view";
import compile from "ngular-template-compiler/system/compile";
import { set as o_set } from "ngular-metal/property_set";
import { runAppend, runDestroy } from "ngular-runtime/tests/utils";

var textArea, controller;

function set(object, key, value) {
  run(function() { o_set(object, key, value); });
}

QUnit.module("{{textarea}}", {
  setup() {
    controller = {
      val: 'Lorem ipsum dolor'
    };

    textArea = View.extend({
      controller: controller,
      template: compile('{{textarea disabled=disabled value=val}}')
    }).create();

    runAppend(textArea);
  },

  teardown() {
    runDestroy(textArea);
  }
});

QUnit.test("Should insert a textarea", function() {
  equal(textArea.$('textarea').length, 1, "There is a single textarea");
});

QUnit.test("Should become disabled when the controller changes", function() {
  ok(textArea.$('textarea').is(':not(:disabled)'), "Nothing is disabled yet");
  set(controller, 'disabled', true);
  ok(textArea.$('textarea').is(':disabled'), "The disabled attribute is updated");
});

QUnit.test("Should bind its contents to the specified value", function() {
  equal(textArea.$('textarea').val(), "Lorem ipsum dolor", "The contents are included");
  set(controller, 'val', "sit amet");
  equal(textArea.$('textarea').val(), "sit amet", "The new contents are included");
});
