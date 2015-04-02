import run from "ngular-metal/run_loop";

function runAppend(view) {
  run(view, "appendTo", "#qunit-fixture");
}

function runDestroy(destroyed) {
  if (destroyed) {
    run(destroyed, "destroy");
  }
}

export {
  runAppend,
  runDestroy
};
