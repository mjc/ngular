/**
@module ngular
@submodule ngular-htmlbars
*/

import Ngular from "ngular-metal/core"; // Ngular.assert
import conditional from "ngular-metal/streams/conditional";
import shouldDisplay from "ngular-views/streams/should_display";
import { get } from "ngular-metal/property_get";
import { isStream } from "ngular-metal/streams/utils";
import BoundIfView from "ngular-views/views/bound_if_view";
import emptyTemplate from "ngular-htmlbars/templates/empty";

/**
  @method if
  @for Ngular.Handlebars.helpers
*/
function ifHelper(params, hash, options, env) {
  var helperName = options.helperName || 'if';
  return appendConditional(false, helperName, params, hash, options, env);
}

/**
  @method unless
  @for Ngular.Handlebars.helpers
*/
function unlessHelper(params, hash, options, env) {
  var helperName = options.helperName || 'unless';
  return appendConditional(true, helperName, params, hash, options, env);
}


function assertInlineIfNotEnabled() {
  Ngular.assert(
    "To use the inline forms of the `if` and `unless` helpers you must " +
    "enable the `ngular-htmlbars-inline-if-helper` feature flag."
  );
}

function appendConditional(inverted, helperName, params, hash, options, env) {
  var view = env.data.view;

  if (options.isBlock) {
    return appendBlockConditional(view, inverted, helperName, params, hash, options, env);
  } else {
    if (Ngular.FEATURES.isEnabled('ngular-htmlbars-inline-if-helper')) {
      return appendInlineConditional(view, inverted, helperName, params, hash, options, env);
    } else {
      assertInlineIfNotEnabled();
    }
  }
}

function appendBlockConditional(view, inverted, helperName, params, hash, options, env) {
  Ngular.assert(
    "The block form of the `if` and `unless` helpers expect exactly one " +
    "argument, e.g. `{{#if newMessages}} You have new messages. {{/if}}.`",
    params.length === 1
  );

  var condition = shouldDisplay(params[0]);
  var truthyTemplate = (inverted ? options.inverse : options.template) || emptyTemplate;
  var falsyTemplate = (inverted ? options.template : options.inverse) || emptyTemplate;

  if (isStream(condition)) {
    view.appendChild(BoundIfView, {
      _morph: options.morph,
      _context: get(view, 'context'),
      conditionStream: condition,
      truthyTemplate: truthyTemplate,
      falsyTemplate: falsyTemplate,
      helperName: helperName
    });
  } else {
    var template = condition ? truthyTemplate : falsyTemplate;
    if (template) {
      return template.render(view, env, options.morph.contextualElement);
    }
  }
}

function appendInlineConditional(view, inverted, helperName, params) {
  Ngular.assert(
    "The inline form of the `if` and `unless` helpers expect two or " +
    "three arguments, e.g. `{{if trialExpired 'Expired' expiryDate}}` " +
    "or `{{unless isFirstLogin 'Welcome back!'}}`.",
    params.length === 2 || params.length === 3
  );

  return conditional(
    shouldDisplay(params[0]),
    inverted ? params[2] : params[1],
    inverted ? params[1] : params[2]
  );
}

export {
  ifHelper,
  unlessHelper
};
