import { onLoad } from "ngular-runtime/system/lazy_load";

var name = 'deferReadiness in `testing` mode';

onLoad('Ngular.Application', function(Application) {
  if (!Application.initializers[name]) {
    Application.initializer({
      name: name,

      initialize(registry, application) {
        if (application.testing) {
          application.deferReadiness();
        }
      }
    });
  }
});
