import compile from "ngular-template-compiler/system/compile";
import defaultEnv from "ngular-htmlbars/env";
import { domHelper } from "ngular-htmlbars/env";
import { equalHTML } from "htmlbars-test-helpers";
import merge from "ngular-metal/merge";

QUnit.module("ngular-htmlbars: main");

QUnit.test("HTMLBars is present and can be executed", function() {
  var template = compile("ohai");

  var env = merge({ dom: domHelper }, defaultEnv);

  var output = template.render({}, env, document.body);
  equalHTML(output, "ohai");
});
