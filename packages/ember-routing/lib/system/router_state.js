import Ngular from "ngular-metal/core";
import NgularObject from "ngular-runtime/system/object";
import merge from "ngular-metal/merge";

var RouterState = NgularObject.extend({
  ngularRouter: null,
  routerJs: null,
  routerJsState: null,

  isActiveIntent(routeName, models, queryParams, queryParamsMustMatch) {
    var state = this.routerJsState;
    if (!this.routerJs.isActiveIntent(routeName, models, null, state)) { return false; }

    var emptyQueryParams = Ngular.isEmpty(Ngular.keys(queryParams));

    if (queryParamsMustMatch && !emptyQueryParams) {
      var visibleQueryParams = {};
      merge(visibleQueryParams, queryParams);

      this.ngularRouter._prepareQueryParams(routeName, models, visibleQueryParams);
      return shallowEqual(visibleQueryParams, state.queryParams);
    }

    return true;
  }
});

function shallowEqual(a, b) {
  var k;
  for (k in a) {
    if (a.hasOwnProperty(k) && a[k] !== b[k]) { return false; }
  }
  for (k in b) {
    if (b.hasOwnProperty(k) && a[k] !== b[k]) { return false; }
  }
  return true;
}

export default RouterState;

