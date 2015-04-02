import Adapter from "ngular-testing/adapters/adapter";
import { inspect } from "ngular-metal/utils";

/**
  This class implements the methods defined by Ngular.Test.Adapter for the
  QUnit testing framework.

  @class QUnitAdapter
  @namespace Ngular.Test
  @extends Ngular.Test.Adapter
*/
export default Adapter.extend({
  asyncStart() {
    QUnit.stop();
  },
  asyncEnd() {
    QUnit.start();
  },
  exception(error) {
    ok(false, inspect(error));
  }
});
