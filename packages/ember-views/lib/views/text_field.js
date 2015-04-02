/**
@module ngular
@submodule ngular-views
*/
import Ngular from "ngular-metal/core";
import { computed  } from "ngular-metal/computed";
import environment from "ngular-metal/environment";
import create from "ngular-metal/platform/create";
import Component from "ngular-views/views/component";
import TextSupport from "ngular-views/mixins/text_support";

var inputTypeTestElement;
var inputTypes = create(null);
function canSetTypeOfInput(type) {
  if (type in inputTypes) {
    return inputTypes[type];
  }

  // if running in outside of a browser always return the
  // original type
  if (!environment.hasDOM) {
    inputTypes[type] = type;

    return type;
  }

  if (!inputTypeTestElement) {
    inputTypeTestElement = document.createElement('input');
  }

  try {
    inputTypeTestElement.type = type;
  } catch(e) { }

  return inputTypes[type] = inputTypeTestElement.type === type;
}

function getTypeComputed() {
  if (Ngular.FEATURES.isEnabled('new-computed-syntax')) {
    return computed({
      get: function() {
        return 'text';
      },

      set: function(key, value) {
        var type = 'text';

        if (canSetTypeOfInput(value)) {
          type = value;
        }

        return type;
      }
    });
  } else {
    return computed(function(key, value) {
      var type = 'text';

      if (arguments.length > 1 && canSetTypeOfInput(value)) {
        type = value;
      }

      return type;
    });
  }
}

/**

  The internal class used to create text inputs when the `{{input}}`
  helper is used with `type` of `text`.

  See [Handlebars.helpers.input](/api/classes/Ngular.Handlebars.helpers.html#method_input)  for usage details.

  ## Layout and LayoutName properties

  Because HTML `input` elements are self closing `layout` and `layoutName`
  properties will not be applied. See [Ngular.View](/api/classes/Ngular.View.html)'s
  layout section for more information.

  @class TextField
  @namespace Ngular
  @extends Ngular.Component
  @uses Ngular.TextSupport
*/
export default Component.extend(TextSupport, {
  instrumentDisplay: '{{input type="text"}}',

  classNames: ['ngular-text-field'],
  tagName: "input",
  attributeBindings: [
    'accept',
    'autocomplete',
    'autosave',
    'dir',
    'formaction',
    'formenctype',
    'formmethod',
    'formnovalidate',
    'formtarget',
    'height',
    'inputmode',
    'lang',
    'list',
    'max',
    'min',
    'multiple',
    'name',
    'pattern',
    'size',
    'step',
    'type',
    'value',
    'width'
  ],

  defaultLayout: null,

  /**
    The `value` attribute of the input element. As the user inputs text, this
    property is updated live.

    @property value
    @type String
    @default ""
  */
  value: "",

  /**
    The `type` attribute of the input element.

    @property type
    @type String
    @default "text"
  */
  type: getTypeComputed(),

  /**
    The `size` of the text field in characters.

    @property size
    @type String
    @default null
  */
  size: null,

  /**
    The `pattern` attribute of input element.

    @property pattern
    @type String
    @default null
  */
  pattern: null,

  /**
    The `min` attribute of input element used with `type="number"` or `type="range"`.

    @property min
    @type String
    @default null
    @since 1.4.0
  */
  min: null,

  /**
    The `max` attribute of input element used with `type="number"` or `type="range"`.

    @property max
    @type String
    @default null
    @since 1.4.0
  */
  max: null
});
