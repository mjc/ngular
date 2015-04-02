import Ngular from "ngular-metal/core";

import "ngular-testing/initializers"; // to setup initializer
import "ngular-testing/support";      // to handle various edge cases

import setupForTesting from "ngular-testing/setup_for_testing";
import Test from "ngular-testing/test";
import Adapter from "ngular-testing/adapters/adapter";
import QUnitAdapter from "ngular-testing/adapters/qunit";
import "ngular-testing/helpers";      // adds helpers to helpers object in Test

/**
  Ngular Testing

  @module ngular
  @submodule ngular-testing
  @requires ngular-application
*/

Ngular.Test = Test;
Ngular.Test.Adapter = Adapter;
Ngular.Test.QUnitAdapter = QUnitAdapter;
Ngular.setupForTesting = setupForTesting;
