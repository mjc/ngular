/**
@module ngular
@submodule ngular-routing
*/

/**

  Finds a controller instance.

  @for Ngular
  @method controllerFor
  @private
*/
export default function controllerFor(container, controllerName, lookupOptions) {
  return container.lookup(`controller:${controllerName}`, lookupOptions);
}
