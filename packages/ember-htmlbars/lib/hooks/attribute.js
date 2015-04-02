/**
@module ngular
@submodule ngular-htmlbars
*/

import AttrNode from "ngular-views/attr_nodes/attr_node";
import NgularError from "ngular-metal/error";
import { isStream } from "ngular-metal/streams/utils";
import sanitizeAttributeValue from "morph-attr/sanitize-attribute-value";

var boundAttributesEnabled = false;

if (Ngular.FEATURES.isEnabled('ngular-htmlbars-attribute-syntax')) {
  boundAttributesEnabled = true;
}

export default function attribute(env, morph, element, attrName, attrValue) {
  if (boundAttributesEnabled) {
    var attrNode = new AttrNode(attrName, attrValue);
    attrNode._morph = morph;
    env.data.view.appendChild(attrNode);
  } else {
    if (isStream(attrValue)) {
      throw new NgularError('Bound attributes are not yet supported in Ngular.js');
    } else {
      var sanitizedValue = sanitizeAttributeValue(env.dom, element, attrName, attrValue);
      env.dom.setProperty(element, attrName, sanitizedValue);
    }
  }
}
