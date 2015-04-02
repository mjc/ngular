import Service from "ngular-runtime/system/service";
import { Registry } from "ngular-runtime/system/container";
import inject from "ngular-runtime/inject";
import View from "ngular-views/views/view";

QUnit.module('NgularView - injected properties');

QUnit.test("services can be injected into views", function() {
  var registry = new Registry();
  var container = registry.container();

  registry.register('view:application', View.extend({
    profilerService: inject.service('profiler')
  }));

  registry.register('service:profiler', Service.extend());

  var appView = container.lookup('view:application');
  var profilerService = container.lookup('service:profiler');

  equal(profilerService, appView.get('profilerService'), "service.profiler is injected");
});
