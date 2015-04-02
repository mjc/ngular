/**
@module ngular
@submodule ngular-runtime
*/

import Ngular from 'ngular-metal/core'; // Ngular.EXTEND_PROTOTYPES, Ngular.assert, Ngular.FEATURES
import {
  fmt,
  w,
  loc,
  camelize,
  decamelize,
  dasherize,
  underscore,
  capitalize,
  classify
} from 'ngular-runtime/system/string';

var StringPrototype = String.prototype;

if (Ngular.EXTEND_PROTOTYPES === true || Ngular.EXTEND_PROTOTYPES.String) {

  /**
    See [Ngular.String.fmt](/api/classes/Ngular.String.html#method_fmt).

    @method fmt
    @for String
  */
  StringPrototype.fmt = function () {
    return fmt(this, arguments);
  };

  /**
    See [Ngular.String.w](/api/classes/Ngular.String.html#method_w).

    @method w
    @for String
  */
  StringPrototype.w = function () {
    return w(this);
  };

  /**
    See [Ngular.String.loc](/api/classes/Ngular.String.html#method_loc).

    @method loc
    @for String
  */
  StringPrototype.loc = function () {
    return loc(this, arguments);
  };

  /**
    See [Ngular.String.camelize](/api/classes/Ngular.String.html#method_camelize).

    @method camelize
    @for String
  */
  StringPrototype.camelize = function () {
    return camelize(this);
  };

  /**
    See [Ngular.String.decamelize](/api/classes/Ngular.String.html#method_decamelize).

    @method decamelize
    @for String
  */
  StringPrototype.decamelize = function () {
    return decamelize(this);
  };

  /**
    See [Ngular.String.dasherize](/api/classes/Ngular.String.html#method_dasherize).

    @method dasherize
    @for String
  */
  StringPrototype.dasherize = function () {
    return dasherize(this);
  };

  /**
    See [Ngular.String.underscore](/api/classes/Ngular.String.html#method_underscore).

    @method underscore
    @for String
  */
  StringPrototype.underscore = function () {
    return underscore(this);
  };

  /**
    See [Ngular.String.classify](/api/classes/Ngular.String.html#method_classify).

    @method classify
    @for String
  */
  StringPrototype.classify = function () {
    return classify(this);
  };

  /**
    See [Ngular.String.capitalize](/api/classes/Ngular.String.html#method_capitalize).

    @method capitalize
    @for String
  */
  StringPrototype.capitalize = function () {
    return capitalize(this);
  };
}
