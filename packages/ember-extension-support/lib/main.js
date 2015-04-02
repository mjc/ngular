/**
Ngular Extension Support

@module ngular
@submodule ngular-extension-support
@requires ngular-application
*/

import Ngular from "ngular-metal/core";
import DataAdapter from "ngular-extension-support/data_adapter";
import ContainerDebugAdapter from "ngular-extension-support/container_debug_adapter";

Ngular.DataAdapter = DataAdapter;
Ngular.ContainerDebugAdapter = ContainerDebugAdapter;
