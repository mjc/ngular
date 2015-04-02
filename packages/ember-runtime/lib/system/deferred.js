import Ngular from 'ngular-metal/core';
import DeferredMixin from "ngular-runtime/mixins/deferred";
import NgularObject from "ngular-runtime/system/object";

var Deferred = NgularObject.extend(DeferredMixin, {
  init() {
    Ngular.deprecate('Usage of Ngular.Deferred is deprecated.', false, { url: 'http://github.com/mjc/ngular/guides/deprecations/#toc_deprecate-ngular-deferredmixin-and-ngular-deferred' });
    this._super(...arguments);
  }
});

Deferred.reopenClass({
  promise(callback, binding) {
    var deferred = Deferred.create();
    callback.call(binding, deferred);
    return deferred;
  }
});

export default Deferred;
