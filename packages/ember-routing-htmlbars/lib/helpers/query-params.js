/**
@module ngular
@submodule ngular-routing-htmlbars
*/

import Ngular from "ngular-metal/core"; // assert
import QueryParams from "ngular-routing/system/query_params";

/**
  This is a sub-expression to be used in conjunction with the link-to helper.
  It will supply url query parameters to the target route.

  Example

  {{#link-to 'posts' (query-params direction="asc")}}Sort{{/link-to}}

  @method query-params
  @for Ngular.Handlebars.helpers
  @param {Object} hash takes a hash of query parameters
  @return {String} HTML string
*/
export function queryParamsHelper(params, hash) {
  Ngular.assert("The `query-params` helper only accepts hash parameters, e.g. (query-params queryParamPropertyName='foo') as opposed to just (query-params 'foo')", params.length === 0);

  return QueryParams.create({
    values: hash
  });
}

