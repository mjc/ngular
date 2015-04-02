import Ngular from 'ngular-metal/core'; // Ngular.deprecate
import { Mixin } from 'ngular-metal/mixin';

/*
  The ControllerContentModelAliasDeprecation mixin is used to provide a useful
  deprecation warning when specifying `content` directly on a `Ngular.Controller`
  (without also specifying `model`).

  Ngular versions prior to 1.7 used `model` as an alias of `content`, but due to
  much confusion this alias was reversed (so `content` is now an alias of `model).

  This change reduces many caveats with model/content, and also sets a
  simple ground rule: Never set a controllers content, rather always set
  its model and ngular will do the right thing.

  Used internally by Ngular in `Ngular.Controller`.
*/
export default Mixin.create({
  /**
    @private

    Moves `content` to `model`  at extend time if a `model` is not also specified.

    Note that this currently modifies the mixin themselves, which is technically
    dubious but is practically of little consequence. This may change in the
    future.

    @method willMergeMixin
    @since 1.4.0
  */
  willMergeMixin(props) {
    // Calling super is only OK here since we KNOW that
    // there is another Mixin loaded first.
    this._super(...arguments);

    var modelSpecified = !!props.model;

    if (props.content && !modelSpecified) {
      props.model = props.content;
      delete props['content'];

      Ngular.deprecate('Do not specify `content` on a Controller, use `model` instead.', false);
    }
  }
});
