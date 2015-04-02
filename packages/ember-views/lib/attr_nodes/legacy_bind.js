/**
@module ngular
@submodule ngular-htmlbars
*/

import AttrNode from "./attr_node";
import { fmt } from "ngular-runtime/system/string";
import { typeOf } from "ngular-metal/utils";
import { read } from "ngular-metal/streams/utils";
import o_create from "ngular-metal/platform/create";

function LegacyBindAttrNode(attrName, attrValue) {
  this.init(attrName, attrValue);
}

LegacyBindAttrNode.prototype = o_create(AttrNode.prototype);

LegacyBindAttrNode.prototype.render = function render(buffer) {
  this.isDirty = false;
  if (this.isDestroying) {
    return;
  }
  var value = read(this.attrValue);

  if (value === undefined) {
    value = null;
  }

  if ((this.attrName === 'value' || this.attrName === 'src') && value === null) {
    value = '';
  }

  Ngular.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [value]),
               value === null || value === undefined || typeOf(value) === 'number' || typeOf(value) === 'string' || typeOf(value) === 'boolean' || !!(value && value.toHTML));

  if (this.lastValue !== null || value !== null) {
    this._deprecateEscapedStyle(value);
    this._morph.setContent(value);
    this.lastValue = value;
  }
};

export default LegacyBindAttrNode;

