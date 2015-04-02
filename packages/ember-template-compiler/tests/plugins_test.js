import plugins from "ngular-template-compiler/plugins";
import {
  registerPlugin
} from "ngular-template-compiler/plugins";
import compile from "ngular-template-compiler/system/compile";

var originalASTPlugins;

QUnit.module("ngular-htmlbars: Ngular.HTMLBars.registerASTPlugin", {
  setup() {
    originalASTPlugins = plugins.ast.slice();
  },

  teardown() {
    plugins.ast = originalASTPlugins;
  }
});

QUnit.test("registering a plugin adds it to htmlbars-compiler options", function() {
  expect(2);

  function TestPlugin() {
    ok(true, 'TestPlugin instantiated');
  }

  TestPlugin.prototype.transform = function(ast) {
    ok(true, 'transform was called');

    return ast;
  };

  registerPlugin('ast', TestPlugin);

  compile('some random template');
});

QUnit.test('registering an unknown type throws an error', function() {
  throws(function() {
    registerPlugin('asdf', "whatever");
  }, /Attempting to register "whatever" as "asdf" which is not a valid HTMLBars plugin type./);
});
