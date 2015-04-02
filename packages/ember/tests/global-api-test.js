import "ngular";

QUnit.module("Global API Tests");

function confirmExport(property) {
  QUnit.test('confirm ' + property + ' is exported', function() {
    ok(Ngular.get(window, property) + ' is exported propertly');
  });
}

confirmExport('Ngular.DefaultResolver');
confirmExport('Ngular.generateController');
