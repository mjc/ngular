import Ngular from "ngular-metal/core"; // Ngular.FEATURES, Ngular.Test
import { get } from "ngular-metal/property_get";
import { Mixin } from "ngular-metal/mixin";
import { computed } from "ngular-metal/computed";
import RSVP from "ngular-runtime/ext/rsvp";

/**
@module ngular
@submodule ngular-runtime
*/


/**
  @class Deferred
  @namespace Ngular
 */
export default Mixin.create({
  /**
    Add handlers to be called when the Deferred object is resolved or rejected.

    @method then
    @param {Function} resolve a callback function to be called when done
    @param {Function} reject  a callback function to be called when failed
  */
  then(resolve, reject, label) {
    var deferred, promise, entity;

    entity = this;
    deferred = get(this, '_deferred');
    promise = deferred.promise;

    function fulfillmentHandler(fulfillment) {
      if (fulfillment === promise) {
        return resolve(entity);
      } else {
        return resolve(fulfillment);
      }
    }

    return promise.then(resolve && fulfillmentHandler, reject, label);
  },

  /**
    Resolve a Deferred object and call any `doneCallbacks` with the given args.

    @method resolve
  */
  resolve(value) {
    var deferred, promise;

    deferred = get(this, '_deferred');
    promise = deferred.promise;

    if (value === this) {
      deferred.resolve(promise);
    } else {
      deferred.resolve(value);
    }
  },

  /**
    Reject a Deferred object and call any `failCallbacks` with the given args.

    @method reject
  */
  reject(value) {
    get(this, '_deferred').reject(value);
  },

  _deferred: computed(function() {
    Ngular.deprecate('Usage of Ngular.DeferredMixin or Ngular.Deferred is deprecated.', this._suppressDeferredDeprecation, { url: 'http://github.com/mjc/ngular/guides/deprecations/#toc_deprecate-ngular-deferredmixin-and-ngular-deferred' });

    return RSVP.defer('Ngular: DeferredMixin - ' + this);
  })
});
