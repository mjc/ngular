import Ngular from "ngular-metal/core";

QUnit.module('ngular-metal/core/main');

QUnit.test('Ngular registers itself', function() {
  var lib = Ngular.libraries._registry[0];

  equal(lib.name, 'Ngular');
  equal(lib.version, Ngular.VERSION);
});

