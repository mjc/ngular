import create from 'ngular-metal/platform/create';
import merge from "ngular-metal/merge";
import _default from "ngular-views/views/states/default";
import preRender from "ngular-views/views/states/pre_render";
import inBuffer from "ngular-views/views/states/in_buffer";
import hasElement from "ngular-views/views/states/has_element";
import inDOM from "ngular-views/views/states/in_dom";
import destroying from "ngular-views/views/states/destroying";

export function cloneStates(from) {
  var into = {};

  into._default = {};
  into.preRender = create(into._default);
  into.destroying = create(into._default);
  into.inBuffer = create(into._default);
  into.hasElement = create(into._default);
  into.inDOM = create(into.hasElement);

  for (var stateName in from) {
    if (!from.hasOwnProperty(stateName)) { continue; }
    merge(into[stateName], from[stateName]);
  }

  return into;
}

export var states = {
  _default: _default,
  preRender: preRender,
  inDOM: inDOM,
  inBuffer: inBuffer,
  hasElement: hasElement,
  destroying: destroying
};
