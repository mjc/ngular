import { runAppend, runDestroy } from "ngular-runtime/tests/utils";
import NgularView from 'ngular-views/views/view';
import defaultEnv from "ngular-htmlbars/env";
import keys from 'ngular-metal/keys';

var view;
QUnit.module('ngular-htmlbars: renderView', {
  teardown() {
    runDestroy(view);
  }
});

QUnit.test('default environment values are passed through', function() {
  var keyNames = keys(defaultEnv);
  expect(keyNames.length);

  view = NgularView.create({
    template: {
      isHTMLBars: true,
      revision: 'Ngular@VERSION_STRING_PLACEHOLDER',
      render(view, env, contextualElement, blockArguments) {
        for (var i = 0, l = keyNames.length; i < l; i++) {
          var keyName = keyNames[i];

          deepEqual(env[keyName], defaultEnv[keyName], 'passes ' + keyName + ' from the default env');
        }
      }
    }
  });

  runAppend(view);
});

QUnit.test('Provides a helpful assertion if revisions do not match.', function() {
  view = NgularView.create({
    template: {
      isHTMLBars: true,
      revision: 'Foo-Bar-Baz',
      render() { }
    }
  });

  expectAssertion(function() {
    runAppend(view);
  },
  /was compiled with `Foo-Bar-Baz`/);
});
