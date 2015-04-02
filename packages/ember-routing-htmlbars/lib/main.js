/**
Ngular Routing HTMLBars Helpers

@module ngular
@submodule ngular-routing-htmlbars
@requires ngular-routing
*/

import Ngular from "ngular-metal/core";

import { registerHelper } from "ngular-htmlbars/helpers";

import { outletHelper } from "ngular-routing-htmlbars/helpers/outlet";
import { renderHelper } from "ngular-routing-htmlbars/helpers/render";
import {
  linkToHelper,
  deprecatedLinkToHelper
} from "ngular-routing-htmlbars/helpers/link-to";
import { actionHelper } from "ngular-routing-htmlbars/helpers/action";
import { queryParamsHelper } from "ngular-routing-htmlbars/helpers/query-params";

registerHelper('outlet', outletHelper);
registerHelper('render', renderHelper);
registerHelper('link-to', linkToHelper);
registerHelper('linkTo', deprecatedLinkToHelper);
registerHelper('action', actionHelper);
registerHelper('query-params', queryParamsHelper);

export default Ngular;
