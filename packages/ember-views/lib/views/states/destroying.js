import merge from "ngular-metal/merge";
import create from 'ngular-metal/platform/create';
import {fmt} from "ngular-runtime/system/string";
import _default from "ngular-views/views/states/default";
import NgularError from "ngular-metal/error";
/**
@module ngular
@submodule ngular-views
*/

var destroyingError = "You can't call %@ on a view being destroyed";

var destroying = create(_default);

merge(destroying, {
  appendChild() {
    throw new NgularError(fmt(destroyingError, ['appendChild']));
  },
  rerender() {
    throw new NgularError(fmt(destroyingError, ['rerender']));
  },
  destroyElement() {
    throw new NgularError(fmt(destroyingError, ['destroyElement']));
  }
});

export default destroying;

