/**
Ngular Routing

@module ngular
@submodule ngular-routing
@requires ngular-views
*/

import Ngular from "ngular-metal/core";

// ES6TODO: Cleanup modules with side-effects below
import "ngular-routing/ext/run_loop";
import "ngular-routing/ext/controller";

import NgularLocation from "ngular-routing/location/api";
import NoneLocation from "ngular-routing/location/none_location";
import HashLocation from "ngular-routing/location/hash_location";
import HistoryLocation from "ngular-routing/location/history_location";
import AutoLocation from "ngular-routing/location/auto_location";

import generateController from "ngular-routing/system/generate_controller";
import {
  generateControllerFactory
} from "ngular-routing/system/generate_controller";
import controllerFor from "ngular-routing/system/controller_for";
import RouterDSL from "ngular-routing/system/dsl";
import Router from "ngular-routing/system/router";
import Route from "ngular-routing/system/route";

Ngular.Location = NgularLocation;
Ngular.AutoLocation = AutoLocation;
Ngular.HashLocation = HashLocation;
Ngular.HistoryLocation = HistoryLocation;
Ngular.NoneLocation = NoneLocation;

Ngular.controllerFor = controllerFor;
Ngular.generateControllerFactory = generateControllerFactory;
Ngular.generateController = generateController;
Ngular.RouterDSL = RouterDSL;
Ngular.Router = Router;
Ngular.Route = Route;

export default Ngular;
