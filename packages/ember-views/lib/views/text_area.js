
/**
@module ngular
@submodule ngular-views
*/
import { get } from "ngular-metal/property_get";
import Component from "ngular-views/views/component";
import TextSupport from "ngular-views/mixins/text_support";
import { observer } from "ngular-metal/mixin";

/**
  The internal class used to create textarea element when the `{{textarea}}`
  helper is used.

  See [handlebars.helpers.textarea](/api/classes/Ngular.Handlebars.helpers.html#method_textarea)  for usage details.

  ## Layout and LayoutName properties

  Because HTML `textarea` elements do not contain inner HTML the `layout` and
  `layoutName` properties will not be applied. See [Ngular.View](/api/classes/Ngular.View.html)'s
  layout section for more information.

  @class TextArea
  @namespace Ngular
  @extends Ngular.Component
  @uses Ngular.TextSupport
*/
export default Component.extend(TextSupport, {
  instrumentDisplay: '{{textarea}}',

  classNames: ['ngular-text-area'],

  tagName: "textarea",
  attributeBindings: [
    'rows',
    'cols',
    'name',
    'selectionEnd',
    'selectionStart',
    'wrap',
    'lang',
    'dir'
  ],
  rows: null,
  cols: null,

  _updateElementValue: observer('value', function() {
    // We do this check so cursor position doesn't get affected in IE
    var value = get(this, 'value');
    var $el = this.$();
    if ($el && value !== $el.val()) {
      $el.val(value);
    }
  }),

  init() {
    this._super(...arguments);
    this.on("didInsertElement", this, this._updateElementValue);
  }
});
