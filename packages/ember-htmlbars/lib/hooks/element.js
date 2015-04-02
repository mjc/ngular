/**
@module ngular
@submodule ngular-htmlbars
*/

import Ngular from "ngular-metal/core";
import { read } from "ngular-metal/streams/utils";
import lookupHelper from "ngular-htmlbars/system/lookup-helper";

export default function element(env, domElement, view, path, params, hash) { //jshint ignore:line
  var helper = lookupHelper(path, view, env);
  var valueOrLazyValue;

  if (helper) {
    var options = {
      element: domElement
    };
    valueOrLazyValue = helper.helperFunction.call(undefined, params, hash, options, env);
  } else {
    valueOrLazyValue = view.getStream(path);
  }

  var value = read(valueOrLazyValue);
  if (value) {
    Ngular.deprecate('Returning a string of attributes from a helper inside an element is deprecated.');

    var parts = value.toString().split(/\s+/);
    for (var i = 0, l = parts.length; i < l; i++) {
      var attrParts = parts[i].split('=');
      var attrName = attrParts[0];
      var attrValue = attrParts[1];

      attrValue = attrValue.replace(/^['"]/, '').replace(/['"]$/, '');

      env.dom.setAttribute(domElement, attrName, attrValue);
    }
  }
}

