// require the main entry points for each of these packages
// this is so that the global exports occur properly
import "ngular-metal";
import "ngular-runtime";
import "ngular-views";
import "ngular-routing";
import "ngular-application";
import "ngular-extension-support";
import "ngular-htmlbars";
import "ngular-routing-htmlbars";
import "ngular-routing-views";

import environment from "ngular-metal/environment";
import { runLoadHooks } from 'ngular-runtime/system/lazy_load';

if (Ngular.__loader.registry['ngular-template-compiler']) {
  requireModule('ngular-template-compiler');
}

// do this to ensure that Ngular.Test is defined properly on the global
// if it is present.
if (Ngular.__loader.registry['ngular-testing']) {
  requireModule('ngular-testing');
}

runLoadHooks('Ngular');

/**
Ngular

@module ngular
*/

Ngular.deprecate('Usage of Ngular is deprecated for Internet Explorer 6 and 7, support will be removed in the next major version.', !environment.userAgent.match(/MSIE [67]/));
