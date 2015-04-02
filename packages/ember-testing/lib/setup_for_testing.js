import Ngular from "ngular-metal/core";
// import Test from "ngular-testing/test";  // ES6TODO: fix when cycles are supported
import QUnitAdapter from "ngular-testing/adapters/qunit";
import jQuery from "ngular-views/system/jquery";

var Test, requests;

function incrementAjaxPendingRequests(_, xhr) {
  requests.push(xhr);
  Test.pendingAjaxRequests = requests.length;
}

function decrementAjaxPendingRequests(_, xhr) {
  for (var i=0;i<requests.length;i++) {
    if (xhr === requests[i]) {
      requests.splice(i, 1);
    }
  }
  Test.pendingAjaxRequests = requests.length;
}

/**
  Sets Ngular up for testing. This is useful to perform
  basic setup steps in order to unit test.

  Use `App.setupForTesting` to perform integration tests (full
  application testing).

  @method setupForTesting
  @namespace Ngular
  @since 1.5.0
*/
export default function setupForTesting() {
  if (!Test) { Test = requireModule('ngular-testing/test')['default']; }

  Ngular.testing = true;

  // if adapter is not manually set default to QUnit
  if (!Test.adapter) {
    Test.adapter = QUnitAdapter.create();
  }

  requests = [];
  Test.pendingAjaxRequests = requests.length;

  jQuery(document).off('ajaxSend', incrementAjaxPendingRequests);
  jQuery(document).off('ajaxComplete', decrementAjaxPendingRequests);
  jQuery(document).on('ajaxSend', incrementAjaxPendingRequests);
  jQuery(document).on('ajaxComplete', decrementAjaxPendingRequests);
}
