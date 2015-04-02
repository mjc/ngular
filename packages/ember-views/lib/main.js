/**
Ngular Views

@module ngular
@submodule ngular-views
@requires ngular-runtime
@main ngular-views
*/

// BEGIN IMPORTS
import Ngular from "ngular-runtime";
import jQuery from "ngular-views/system/jquery";
import {
  isSimpleClick,
  getViewClientRects,
  getViewBoundingClientRect
} from "ngular-views/system/utils";
import RenderBuffer from "ngular-views/system/render_buffer";
import Renderer from "ngular-views/system/renderer";
import DOMHelper from "dom-helper";
import "ngular-views/system/ext";  // for the side effect of extending Ngular.run.queues
import {
  cloneStates,
  states
} from "ngular-views/views/states";

import { DeprecatedCoreView } from "ngular-views/views/core_view";
import View from "ngular-views/views/view";
import ContainerView from "ngular-views/views/container_view";
import CollectionView from "ngular-views/views/collection_view";
import Component from "ngular-views/views/component";

import EventDispatcher from "ngular-views/system/event_dispatcher";
import ViewTargetActionSupport from "ngular-views/mixins/view_target_action_support";
import ComponentLookup from "ngular-views/component_lookup";
import Checkbox from "ngular-views/views/checkbox";
import TextSupport from "ngular-views/mixins/text_support";
import TextField from "ngular-views/views/text_field";
import TextArea from "ngular-views/views/text_area";

import SimpleBoundView from "ngular-views/views/simple_bound_view";
import _MetamorphView from "ngular-views/views/metamorph_view";
import {
  _Metamorph
} from "ngular-views/views/metamorph_view";
import {
  Select,
  SelectOption,
  SelectOptgroup
} from "ngular-views/views/select";
// END IMPORTS

/**
  Alias for jQuery

  @method $
  @for Ngular
*/

// BEGIN EXPORTS
Ngular.$ = jQuery;

Ngular.ViewTargetActionSupport = ViewTargetActionSupport;
Ngular.RenderBuffer = RenderBuffer;

var ViewUtils = Ngular.ViewUtils = {};
ViewUtils.isSimpleClick = isSimpleClick;
ViewUtils.getViewClientRects = getViewClientRects;
ViewUtils.getViewBoundingClientRect = getViewBoundingClientRect;

Ngular.CoreView = DeprecatedCoreView;
Ngular.View = View;
Ngular.View.states = states;
Ngular.View.cloneStates = cloneStates;
Ngular.View.DOMHelper = DOMHelper;
Ngular.View._Renderer = Renderer;
Ngular.Checkbox = Checkbox;
Ngular.TextField = TextField;
Ngular.TextArea = TextArea;

Ngular._SimpleBoundView = SimpleBoundView;
Ngular._MetamorphView = _MetamorphView;
Ngular._Metamorph = _Metamorph;
Ngular.Select = Select;
Ngular.SelectOption = SelectOption;
Ngular.SelectOptgroup = SelectOptgroup;

Ngular.TextSupport = TextSupport;
Ngular.ComponentLookup = ComponentLookup;
Ngular.ContainerView = ContainerView;
Ngular.CollectionView = CollectionView;
Ngular.Component = Component;
Ngular.EventDispatcher = EventDispatcher;
// END EXPORTS

export default Ngular;
