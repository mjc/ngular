import Ngular from "ngular-metal/core";
import helpers from "ngular-htmlbars/helpers";
import {
  registerHandlebarsCompatibleHelper as compatRegisterHelper,
  handlebarsHelper as compatHandlebarsHelper
} from "ngular-htmlbars/compat/helper";
import compatHandlebarsGet from "ngular-htmlbars/compat/handlebars-get";
import compatMakeBoundHelper from "ngular-htmlbars/compat/make-bound-helper";
import compatRegisterBoundHelper from "ngular-htmlbars/compat/register-bound-helper";
import makeViewHelper from "ngular-htmlbars/system/make-view-helper";
import {
  SafeString,
  escapeExpression
} from "ngular-htmlbars/utils/string";

var NgularHandlebars = Ngular.Handlebars = Ngular.Handlebars || {};
NgularHandlebars.helpers = helpers;
NgularHandlebars.helper = compatHandlebarsHelper;
NgularHandlebars.registerHelper = compatRegisterHelper;
NgularHandlebars.registerBoundHelper = compatRegisterBoundHelper;
NgularHandlebars.makeBoundHelper = compatMakeBoundHelper;
NgularHandlebars.get = compatHandlebarsGet;
NgularHandlebars.makeViewHelper = makeViewHelper;

NgularHandlebars.SafeString = SafeString;
NgularHandlebars.Utils =  {
  escapeExpression: escapeExpression
};

export default NgularHandlebars;
