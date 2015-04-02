import environment from "ngular-metal/environment";

import DOMHelper from "dom-helper";

import inline from "ngular-htmlbars/hooks/inline";
import content from "ngular-htmlbars/hooks/content";
import component from "ngular-htmlbars/hooks/component";
import block from "ngular-htmlbars/hooks/block";
import element from "ngular-htmlbars/hooks/element";
import subexpr from "ngular-htmlbars/hooks/subexpr";
import attribute from "ngular-htmlbars/hooks/attribute";
import concat from "ngular-htmlbars/hooks/concat";
import get from "ngular-htmlbars/hooks/get";
import set from "ngular-htmlbars/hooks/set";

import helpers from "ngular-htmlbars/helpers";

export default {
  hooks: {
    get: get,
    set: set,
    inline: inline,
    content: content,
    block: block,
    element: element,
    subexpr: subexpr,
    component: component,
    attribute: attribute,
    concat: concat
  },

  helpers: helpers,

  useFragmentCache: true
};

var domHelper = environment.hasDOM ? new DOMHelper() : null;

export { domHelper };
