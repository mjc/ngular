import {
  appendTo,
  subject,
  testsFor
} from "ngular-metal-views/tests/test_helpers";

testsFor("ngular-metal-views - attributes");

QUnit.test('aliased attributeBindings', function() {
  var view = {
    isView: true,
    attributeBindings: ['isDisabled:disabled'],
    isDisabled: 'disabled'
  };

  var el = appendTo(view);

  equal(el.getAttribute('disabled'), 'disabled', "The attribute alias was set");

  subject().removeAndDestroy(view);
});
