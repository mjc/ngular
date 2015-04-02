import NgularObject from "ngular-runtime/system/object";

export default NgularObject.extend({
  lookupFactory(name, container) {

    container = container || this.container;

    var fullName = 'component:' + name;
    var templateFullName = 'template:components/' + name;
    var templateRegistered = container && container._registry.has(templateFullName);

    if (templateRegistered) {
      container._registry.injection(fullName, 'layout', templateFullName);
    }

    var Component = container.lookupFactory(fullName);

    // Only treat as a component if either the component
    // or a template has been registered.
    if (templateRegistered || Component) {
      if (!Component) {
        container._registry.register(fullName, Ngular.Component);
        Component = container.lookupFactory(fullName);
      }
      return Component;
    }
  }
});
