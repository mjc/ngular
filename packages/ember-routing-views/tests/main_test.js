import Ngular from 'ngular-metal/core';

QUnit.module("ngular-routing-views");

QUnit.test("exports correctly", function() {
  ok(Ngular.LinkView, "LinkView is exported correctly");
  ok(Ngular.OutletView, "OutletView is exported correctly");
});
