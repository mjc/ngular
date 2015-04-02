import { addObserver } from "ngular-metal/observer";
import { finishChains } from "ngular-metal/chains";
import create from 'ngular-metal/platform/create';

QUnit.module("Chains");

QUnit.test("finishChains should properly copy chains from prototypes to instances", function() {
  function didChange() {}

  var obj = {};
  addObserver(obj, 'foo.bar', null, didChange);

  var childObj = create(obj);
  finishChains(childObj);

  ok(obj['__ngular_meta__'].chains !== childObj['__ngular_meta__'].chains, "The chains object is copied");
});
