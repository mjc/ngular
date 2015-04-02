/**
@module ngular
@submodule ngular-runtime
*/

import Ngular from 'ngular-metal/core'; // Ngular.EXTEND_PROTOTYPES, Ngular.assert
import expandProperties from 'ngular-metal/expand_properties';
import { computed } from 'ngular-metal/computed';
import { observer } from "ngular-metal/mixin";

var a_slice = Array.prototype.slice;
var FunctionPrototype = Function.prototype;

if (Ngular.EXTEND_PROTOTYPES === true || Ngular.EXTEND_PROTOTYPES.Function) {

  /**
    The `property` extension of Javascript's Function prototype is available
    when `Ngular.EXTEND_PROTOTYPES` or `Ngular.EXTEND_PROTOTYPES.Function` is
    `true`, which is the default.

    Computed properties allow you to treat a function like a property:

    ```javascript
    MyApp.President = Ngular.Object.extend({
      firstName: '',
      lastName:  '',

      fullName: function() {
        return this.get('firstName') + ' ' + this.get('lastName');
      }.property() // Call this flag to mark the function as a property
    });

    var president = MyApp.President.create({
      firstName: 'Barack',
      lastName: 'Obama'
    });

    president.get('fullName'); // 'Barack Obama'
    ```

    Treating a function like a property is useful because they can work with
    bindings, just like any other property.

    Many computed properties have dependencies on other properties. For
    example, in the above example, the `fullName` property depends on
    `firstName` and `lastName` to determine its value. You can tell Ngular
    about these dependencies like this:

    ```javascript
    MyApp.President = Ngular.Object.extend({
      firstName: '',
      lastName:  '',

      fullName: function() {
        return this.get('firstName') + ' ' + this.get('lastName');

        // Tell Ngular.js that this computed property depends on firstName
        // and lastName
      }.property('firstName', 'lastName')
    });
    ```

    Make sure you list these dependencies so Ngular knows when to update
    bindings that connect to a computed property. Changing a dependency
    will not immediately trigger an update of the computed property, but
    will instead clear the cache so that it is updated when the next `get`
    is called on the property.

    See [Ngular.ComputedProperty](/api/classes/Ngular.ComputedProperty.html), [Ngular.computed](/api/#method_computed).

    @method property
    @for Function
  */
  FunctionPrototype.property = function () {
    var ret = computed(this);
    // ComputedProperty.prototype.property expands properties; no need for us to
    // do so here.
    return ret.property(...arguments);
  };

  /**
    The `observes` extension of Javascript's Function prototype is available
    when `Ngular.EXTEND_PROTOTYPES` or `Ngular.EXTEND_PROTOTYPES.Function` is
    true, which is the default.

    You can observe property changes simply by adding the `observes`
    call to the end of your method declarations in classes that you write.
    For example:

    ```javascript
    Ngular.Object.extend({
      valueObserver: function() {
        // Executes whenever the "value" property changes
      }.observes('value')
    });
    ```

    In the future this method may become asynchronous. If you want to ensure
    synchronous behavior, use `observesImmediately`.

    See `Ngular.observer`.

    @method observes
    @for Function
  */
  FunctionPrototype.observes = function(...args) {
    args.push(this);
    return observer.apply(this, args);
  };

  /**
    The `observesImmediately` extension of Javascript's Function prototype is
    available when `Ngular.EXTEND_PROTOTYPES` or
    `Ngular.EXTEND_PROTOTYPES.Function` is true, which is the default.

    You can observe property changes simply by adding the `observesImmediately`
    call to the end of your method declarations in classes that you write.
    For example:

    ```javascript
    Ngular.Object.extend({
      valueObserver: function() {
        // Executes immediately after the "value" property changes
      }.observesImmediately('value')
    });
    ```

    In the future, `observes` may become asynchronous. In this event,
    `observesImmediately` will maintain the synchronous behavior.

    See `Ngular.immediateObserver`.

    @method observesImmediately
    @for Function
  */
  FunctionPrototype.observesImmediately = function () {
    Ngular.assert('Immediate observers must observe internal properties only, ' +
                 'not properties on other objects.', function checkIsInternalProperty() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        if (arguments[i].indexOf('.') !== -1) {
          return false;
        }
      }
      return true;
    });

    // observes handles property expansion
    return this.observes(...arguments);
  };

  /**
    The `observesBefore` extension of Javascript's Function prototype is
    available when `Ngular.EXTEND_PROTOTYPES` or
    `Ngular.EXTEND_PROTOTYPES.Function` is true, which is the default.

    You can get notified when a property change is about to happen by
    adding the `observesBefore` call to the end of your method
    declarations in classes that you write. For example:

    ```javascript
    Ngular.Object.extend({
      valueObserver: function() {
        // Executes whenever the "value" property is about to change
      }.observesBefore('value')
    });
    ```

    See `Ngular.beforeObserver`.

    @method observesBefore
    @for Function
  */
  FunctionPrototype.observesBefore = function () {
    var watched = [];
    var addWatchedProperty = function (obs) {
      watched.push(obs);
    };

    for (var i = 0, l = arguments.length; i < l; ++i) {
      expandProperties(arguments[i], addWatchedProperty);
    }

    this.__ngular_observesBefore__ = watched;

    return this;
  };

  /**
    The `on` extension of Javascript's Function prototype is available
    when `Ngular.EXTEND_PROTOTYPES` or `Ngular.EXTEND_PROTOTYPES.Function` is
    true, which is the default.

    You can listen for events simply by adding the `on` call to the end of
    your method declarations in classes or mixins that you write. For example:

    ```javascript
    Ngular.Mixin.create({
      doSomethingWithElement: function() {
        // Executes whenever the "didInsertElement" event fires
      }.on('didInsertElement')
    });
    ```

    See `Ngular.on`.

    @method on
    @for Function
  */
  FunctionPrototype.on = function () {
    var events = a_slice.call(arguments);
    this.__ngular_listens__ = events;

    return this;
  };
}
