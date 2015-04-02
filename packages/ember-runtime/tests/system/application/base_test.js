import Namespace from "ngular-runtime/system/namespace";
import Application from "ngular-runtime/system/application";

QUnit.module('Ngular.Application');

QUnit.test('Ngular.Application should be a subclass of Ngular.Namespace', function() {

  ok(Namespace.detect(Application), 'Ngular.Application subclass of Ngular.Namespace');
});
