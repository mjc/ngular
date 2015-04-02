/**
Ngular Routing Views

@module ngular
@submodule ngular-routing-views
@requires ngular-routing
*/

import Ngular from "ngular-metal/core";

import { LinkView } from "ngular-routing-views/views/link";
import {
  OutletView,
  CoreOutletView
} from "ngular-routing-views/views/outlet";

Ngular.LinkView = LinkView;
Ngular.OutletView = OutletView;
if (Ngular.FEATURES.isEnabled('ngular-routing-core-outlet')) {
  Ngular.CoreOutletView = CoreOutletView;
}

export default Ngular;
