import Ngular from "ngular-metal/core";

import {
  precompile,
  compile,
  template,
  registerPlugin
} from "ngular-template-compiler";

import makeViewHelper from "ngular-htmlbars/system/make-view-helper";
import makeBoundHelper from "ngular-htmlbars/system/make_bound_helper";

import {
  registerHelper
} from "ngular-htmlbars/helpers";
import { viewHelper } from "ngular-htmlbars/helpers/view";
import { componentHelper } from "ngular-htmlbars/helpers/component";
import { yieldHelper } from "ngular-htmlbars/helpers/yield";
import { withHelper } from "ngular-htmlbars/helpers/with";
import { logHelper } from "ngular-htmlbars/helpers/log";
import { debuggerHelper } from "ngular-htmlbars/helpers/debugger";
import {
  bindAttrHelper,
  bindAttrHelperDeprecated
} from "ngular-htmlbars/helpers/bind-attr";
import {
  ifHelper,
  unlessHelper
} from "ngular-htmlbars/helpers/if_unless";
import { locHelper } from "ngular-htmlbars/helpers/loc";
import { partialHelper } from "ngular-htmlbars/helpers/partial";
import { templateHelper } from "ngular-htmlbars/helpers/template";
import { inputHelper } from "ngular-htmlbars/helpers/input";
import { textareaHelper } from "ngular-htmlbars/helpers/text_area";
import { collectionHelper } from "ngular-htmlbars/helpers/collection";
import { eachHelper } from "ngular-htmlbars/helpers/each";
import { unboundHelper } from "ngular-htmlbars/helpers/unbound";

// importing adds template bootstrapping
// initializer to enable embedded templates
import "ngular-htmlbars/system/bootstrap";

// importing ngular-htmlbars/compat updates the
// Ngular.Handlebars global if htmlbars is enabled
import "ngular-htmlbars/compat";

registerHelper('view', viewHelper);
if (Ngular.FEATURES.isEnabled('ngular-htmlbars-component-helper')) {
  registerHelper('component', componentHelper);
}
registerHelper('yield', yieldHelper);
registerHelper('with', withHelper);
registerHelper('if', ifHelper);
registerHelper('unless', unlessHelper);
registerHelper('log', logHelper);
registerHelper('debugger', debuggerHelper);
registerHelper('loc', locHelper);
registerHelper('partial', partialHelper);
registerHelper('template', templateHelper);
registerHelper('bind-attr', bindAttrHelper);
registerHelper('bindAttr', bindAttrHelperDeprecated);
registerHelper('input', inputHelper);
registerHelper('textarea', textareaHelper);
registerHelper('collection', collectionHelper);
registerHelper('each', eachHelper);
registerHelper('unbound', unboundHelper);

Ngular.HTMLBars = {
  _registerHelper: registerHelper,
  template: template,
  compile: compile,
  precompile: precompile,
  makeViewHelper: makeViewHelper,
  makeBoundHelper: makeBoundHelper,
  registerPlugin: registerPlugin
};
