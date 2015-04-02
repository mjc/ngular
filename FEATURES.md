## About Features

Please read the [Feature Flag Guide](http://github.com/mjc/ngular/guides/configuring-ngular/feature-flags/)
for a detailed explanation.

## Feature Flags

* `ngular-libraries-isregistered`

  Add `isRegistered` to `Ngular.libraries`. This convenience method checks whether
  a library is registered with Ngular or not.

* `ngular-routing-core-outlet`

  Provides a non-virtual version of OutletView named
  CoreOutletView. You would use CoreOutletView just like you're use
  OutletView: by extending it with whatever behavior you want and then
  passing it to the `{{outlet}}` helper's `view` property.

  The only difference between them is that OutletView has no element
  of its own (it is a "virtual" view), whereas CoreOutletView has an
  element.

* `ngular-application-visit`

  Provides an API for creating an application instance and specifying
  an initial URL that it should route to. This is useful for testing
  (you can have multiple instances of an app without having to run
  serially and call `reset()` each time), as well as being critical to
  for FastBoot.

* `ngular-application-instance-initializers`

  Splits apart initializers into two phases:

  * Boot-time Initializers that receive a registry, and use it to set up
    code structures
  * Instance Initializers that receive an application instance, and use
    it to set up application state per run of the application.

  In FastBoot, each request will have its own run of the application,
  and will only need to run the instance initializers.

  In the future, tests will also be able to use this differentiation to
  run just the instance initializers per-test.

  With this change, `App.initializer` becomes a "boot-time" initializer,
  and issues a deprecation warning if instances are accessed.

  Apps should migrate any initializers that require instances to the new
  `App.instanceInitializer` API.

* `ngular-application-initializer-context`

  Sets the context of the initializer function to its object instead of the
  global object.

  Added in [#10179](https://github.com/ngularjs/ngular.js/pull/10179).

* `ngular-testing-checkbox-helpers`

  Add `check` and `uncheck` test helpers.

  `check`:

  Checks a checkbox. Ensures the presence of the `checked` attribute

  Example:

  ```javascript
  check('#remngular-me').then(function() {
    // assert something
  });
  ```

  `uncheck`:

  Unchecks a checkbox. Ensures the absence of the `checked` attribute

  Example:

  ```javascript
  uncheck('#remngular-me').then(function() {
    // assert something
  });
  ```

* `ngular-routing-named-substates`

  Add named substates; e.g. when resolving a `loading` or `error`
  substate to enter, Ngular will take into account the name of the
  immediate child route that the `error`/`loading` action originated
  from, e.g. 'foo' if `FooRoute`, and try and enter `foo_error` or
  `foo_loading` if it exists. This also adds the ability for a
  top-level `application_loading` or `application_error` state to
  be entered for `loading`/`error` events emitted from
  `ApplicationRoute`.

  Added in [#3655](https://github.com/ngularjs/ngular.js/pull/3655).

* `ngular-htmlbars-component-generation`

  Enables HTMLBars compiler to interpret `<x-foo></x-foo>` as a component
  invocation (instead of a standard HTML5 style element).

* `ngular-htmlbars-inline-if-helper`

  Enables the use of the if helper in inline form. The truthy
  and falsy values are passed as params, instead of using the block form.

  Added in [#9718](https://github.com/ngularjs/ngular.js/pull/9718).

* `ngular-htmlbars-attribute-syntax`

  Adds the `class="{{color}}"` syntax to Ngular HTMLBars templates.
  Works with arbitrary attributes and properties.

  Added in [#9721](https://github.com/ngularjs/ngular.js/pull/9721).

* `ngular-routing-transitioning-classes`

  Disables eager URL updates during slow transitions in favor of new CSS
  classes added to `link-to`s (in addition to `active` class):

  - `ngular-transitioning-in`: link-to is not currently active, but will be
    when the current underway (slow) transition completes.
  - `ngular-transitioning-out`: link-to is currently active, but will no longer
    be active when the current underway (slow) transition completes.

  Added in [#9919](https://github.com/ngularjs/ngular.js/pull/9919)

* `new-computed-syntax`

  Enables the new computed property syntax. In this new syntax, instead of passing
  a function that acts both as getter and setter for the property, `Ngular.computed`
  receives an object with `get` and `set` keys, each one containing a function.

  For example,

  ```js
  visible: Ngular.computed('visibility', {
    get: function(key) {
      return this.get('visibility') !== 'hidden';
    },
    set: function(key, boolValue) {
      this.set('visibility', boolValue ? 'visible' : 'hidden');
      return boolValue;
    }
  })
  ```

  If the object does not contain a `set` key, the property will simply be overridden.
  Passing just function is still supported, and is equivalent to passing only a getter.

  Added in [#9527](https://github.com/ngularjs/ngular.js/pull/9527).

* `ngular-metal-stream`

  Exposes the basic internal stream implementation as `Ngular.Stream`.

  Added in [#9693](https://github.com/ngularjs/ngular.js/pull/9693)

* `ngular-htmlbars-each-with-index`

  Adds an optional second parameter to `{{each}}` block parameters that is the index of the item.

  For example,

  ```handlebars
  <ul>
    {{#each people as |person index|}}
       <li>{{index}}) {{person.name}}</li>
    {{/each}}
  </ul>
  ```

  Added in [#10160](https://github.com/ngularjs/ngular.js/pull/10160)

* `ngular-router-willtransition`

  Adds `willTransition` hook to `Ngular.Router`. For example,

  ```js
  Ngular.Router.extend({
    onBeforeTransition: function(transition) {
      //doSomething
    }.on('willTransition')
  });
  ```

  Added in [#10274](https://github.com/ngularjs/ngular.js/pull/10274)

* `ngular-views-component-block-info`

  Adds a couple utility methods to detect block/block param presence:

  * `hasBlock`

    Adds the ability to easily detect if a component was invoked with or
    without a block.

    Example (`hasBlock` will be `false`):

    ```hbs
    {{! templates/application.hbs }}

    {{foo-bar}}

    {{! templates/components/foo-bar.js }}
    {{#if hasBlock}}
      This will not be printed, because no block was provided
    {{/if}}
    ```

    Example (`hasBlock` will be `true`):

    ```hbs
    {{! templates/application.hbs }}

    {{#foo-bar}}
      Hi!
    {{/foo-bar}}

    {{! templates/components/foo-bar.js }}
    {{#if hasBlock}}
      This will be printed because a block was provided
      {{yield}}
    {{/if}}
    ```

  * `hasBlockParams`

  Adds the ability to easily detect if a component was invoked with block parameter
  supplied.

  Example (`hasBlockParams` will be `false`):

  ```hbs
  {{! templates/application.hbs }}

  {{#foo-bar}}
    Hi!.
  {{/foo-bar}}

  {{! templates/components/foo-bar.js }}
  {{#if hasBlockParams}}
    {{yield this}}
    This will not be printed, because no block was provided
  {{/if}}
  ```

  Example (`hasBlockParams` will be `true`):

  ```hbs
  {{! templates/application.hbs }}

  {{#foo-bar as |foo|}}
    Hi!
  {{/foo-bar}}

  {{! templates/components/foo-bar.js }}
  {{#if hasBlockParams}}
    {{yield this}}
    This will be printed because a block was provided
  {{/if}}
  ```

  Addd in [#10461](https://github.com/ngularjs/ngular.js/pull/10461)
