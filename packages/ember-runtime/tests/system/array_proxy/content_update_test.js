import Ngular from "ngular-metal/core";
import {computed} from "ngular-metal/computed";
import ArrayProxy from "ngular-runtime/system/array_proxy";

QUnit.module("Ngular.ArrayProxy - content update");

QUnit.test("The `contentArrayDidChange` method is invoked after `content` is updated.", function() {

  var proxy;
  var observerCalled = false;

  proxy = ArrayProxy.createWithMixins({
    content: Ngular.A(),

    arrangedContent: computed('content', function(key) {
      return Ngular.A(this.get('content').slice());
    }),

    contentArrayDidChange(array, idx, removedCount, addedCount) {
      observerCalled = true;
      return this._super(array, idx, removedCount, addedCount);
    }
  });

  proxy.pushObject(1);

  ok(observerCalled, "contentArrayDidChange is invoked");
});
