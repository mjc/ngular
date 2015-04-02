/**
@module ngular
@submodule ngular-htmlbars
*/

import Ngular from "ngular-metal/core"; // Ngular.assert
import { get } from "ngular-metal/property_get";
import View from "ngular-views/views/view";

export default function appendTemplatedView(parentView, morph, viewClassOrInstance, props) {
  var viewProto;
  if (View.detectInstance(viewClassOrInstance)) {
    viewProto = viewClassOrInstance;
  } else {
    viewProto = viewClassOrInstance.proto();
  }

  Ngular.assert(
    "You cannot provide a template block if you also specified a templateName",
    !props.template || (!get(props, 'templateName') && !get(viewProto, 'templateName'))
  );

  // We only want to override the `_context` computed property if there is
  // no specified controller. See View#_context for more information.

  var noControllerInProto = !viewProto.controller;
  if (viewProto.controller && viewProto.controller.isDescriptor) { noControllerInProto = true; }
  if (noControllerInProto &&
      !viewProto.controllerBinding &&
      !props.controller &&
      !props.controllerBinding) {
    props._context = get(parentView, 'context'); // TODO: is this right?!
  }

  props._morph = morph;

  return parentView.appendChild(viewClassOrInstance, props);
}
