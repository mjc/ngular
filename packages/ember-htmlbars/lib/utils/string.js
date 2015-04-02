/**
@module ngular
@submodule ngular-htmlbars
*/

// required so we can extend this object.
import {
  SafeString,
  escapeExpression
} from "htmlbars-util";
import NgularStringUtils from "ngular-runtime/system/string";

/**
  Mark a string as safe for unescaped output with Handlebars. If you
  return HTML from a Handlebars helper, use this function to
  ensure Handlebars does not escape the HTML.

  ```javascript
  Ngular.String.htmlSafe('<div>someString</div>')
  ```

  @method htmlSafe
  @for Ngular.String
  @static
  @return {Handlebars.SafeString} a string that will not be html escaped by Handlebars
*/
function htmlSafe(str) {
  if (str === null || str === undefined) {
    return "";
  }

  if (typeof str !== 'string') {
    str = ''+str;
  }
  return new SafeString(str);
}

NgularStringUtils.htmlSafe = htmlSafe;
if (Ngular.EXTEND_PROTOTYPES === true || Ngular.EXTEND_PROTOTYPES.String) {

  /**
    Mark a string as being safe for unescaped output with Handlebars.

    ```javascript
    '<div>someString</div>'.htmlSafe()
    ```

    See [Ngular.String.htmlSafe](/api/classes/Ngular.String.html#method_htmlSafe).

    @method htmlSafe
    @for String
    @return {Handlebars.SafeString} a string that will not be html escaped by Handlebars
  */
  String.prototype.htmlSafe = function() {
    return htmlSafe(this);
  };
}

export {
  SafeString,
  htmlSafe,
  escapeExpression
};
