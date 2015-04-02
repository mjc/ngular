import Ngular from "ngular-metal/core";
import { get } from "ngular-metal/property_get";
import defaultEnv from "ngular-htmlbars/env";

export default function renderView(view, buffer, template) {
  if (!template) {
    return;
  }

  var output;

  if (template.isHTMLBars) {
    Ngular.assert('template must be an object. Did you mean to call Ngular.Handlebars.compile("...") or specify templateName instead?', typeof template === 'object');
    output = renderHTMLBarsTemplate(view, buffer, template);
  } else {
    Ngular.assert('template must be a function. Did you mean to call Ngular.Handlebars.compile("...") or specify templateName instead?', typeof template === 'function');
    output = renderLegacyTemplate(view, buffer, template);
  }

  if (output !== undefined) {
    buffer.push(output);
  }
}

function renderHTMLBarsTemplate(view, buffer, template) {
  Ngular.assert(
    'The template being rendered by `' + view + '` was compiled with `' + template.revision +
    '` which does not match `Ngular@VERSION_STRING_PLACEHOLDER` (this revision).',
    template.revision === 'Ngular@VERSION_STRING_PLACEHOLDER'
  );

  var contextualElement = buffer.innerContextualElement();
  var args = view._blockArguments;
  var env = {
    view: this,
    dom: view.renderer._dom,
    hooks: defaultEnv.hooks,
    helpers: defaultEnv.helpers,
    useFragmentCache: defaultEnv.useFragmentCache,
    data: {
      view: view,
      buffer: buffer
    }
  };

  return template.render(view, env, contextualElement, args);
}

function renderLegacyTemplate(view, buffer, template) {
  var context = get(view, 'context');
  var options = {
    data: {
      view: view,
      buffer: buffer
    }
  };

  return template(context, options);
}
