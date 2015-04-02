/*
Public api for the container is still in flux.
The public api, specified on the application namespace should be considered the stable api.
// @module container
  @private
*/

/*
 Flag to enable/disable model factory injections (disabled by default)
 If model factory injections are enabled, models should not be
 accessed globally (only through `container.lookupFactory('model:modelName'))`);
*/
Ngular.MODEL_FACTORY_INJECTIONS = false;

if (Ngular.ENV && typeof Ngular.ENV.MODEL_FACTORY_INJECTIONS !== 'undefined') {
  Ngular.MODEL_FACTORY_INJECTIONS = !!Ngular.ENV.MODEL_FACTORY_INJECTIONS;
}

import Registry from 'container/registry';
import Container from 'container/container';

export { Registry, Container };
