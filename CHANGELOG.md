# Ngular Changelog

### Canary

- [#3852](https://github.com/ngularjs/ngular.js/pull/3852) [BREAKING BUGFIX] Do not assume null Ngular.get targets always refer to a global

### 1.11.0 (March 28, 2015)

- [#10736](https://github.com/ngularjs/ngular.js/pull/10736) [BUGFIX] Fix issue with Query Params when using `Ngular.ObjectController` (regression from `ObjectController` deprecation).
- [#10726](https://github.com/ngularjs/ngular.js/pull/10726) / [router.js#ed45bc](https://github.com/tildeio/router.js/commit/ed45bc5c5e055af0ab875ef2c52feda792ee23e4) [BUGFIX] Fix issue with nested `{{link-to}}` active and transition classes getting out of sync.
- [#10709](https://github.com/ngularjs/ngular.js/pull/10709) [BUGFIX] Clear `src` attributes that are set to `null` or `undefined`.
- [#10695](https://github.com/ngularjs/ngular.js/pull/10695) [SECURITY] Add `<base>` and `<embed>` to list of tags where `src` and `href` are sanitized.
- [#10683](https://github.com/ngularjs/ngular.js/pull/10683) / [#10703](https://github.com/ngularjs/ngular.js/pull/10703) / [#10712](https://github.com/ngularjs/ngular.js/pull/10712) [BUGFIX] Fix regressions added during the `{{outlet}}` refactor.
- [#10663](https://github.com/ngularjs/ngular.js/pull/10663) / [#10711](https://github.com/ngularjs/ngular.js/pull/10711) [SECURITY] Warn when using dynamic style attributes without a `SafeString` value. [See here](http://github.com/mjc/ngular/deprecations/v1.x/#toc_warning-when-binding-style-attributes) for more details.
- [#10463](https://github.com/ngularjs/ngular.js/pull/10463) [BUGFIX] Make async test helpers more robust. Fixes hanging test when elements are not found.
- [#10631](https://github.com/ngularjs/ngular.js/pull/10631) Deprecate using `fooBinding` syntax (`{{some-thing nameBinding="model.name"}}`) in templates.
- [#10627](https://github.com/ngularjs/ngular.js/pull/10627) [BUGFIX] Ensure specifying `class` as a sub-expression (`{{input value=foo class=(some-sub-expr)}}`) works properly.
- [#10613](https://github.com/ngularjs/ngular.js/pull/10613) [BUGFIX] Ensure `{{view id=bar}}` sets `id` on the view.
- [#10612](https://github.com/ngularjs/ngular.js/pull/10612) [BUGFIX] Ensure `Ngular.inject.controller()` works for all Controller types.
- [#10604](https://github.com/ngularjs/ngular.js/pull/10604) [BUGFIX] Fix regression on iOS 8 crashing on certain platforms.
- [#10556](https://github.com/ngularjs/ngular.js/pull/10556) [BUGFIX] Deprecate `{{link-to}}` unwrapping a controllers model.
- [#10528](https://github.com/ngularjs/ngular.js/pull/10528) [BUGFIX] Ensure custom Router can be passed to Ngular.Application.
- [#10530](https://github.com/ngularjs/ngular.js/pull/10530) [BUGFIX] Add assertion when calling `this.$()` in a tagless view/component.
- [#10533](https://github.com/ngularjs/ngular.js/pull/10533) [BUGFIX] Do not allow manually specifying `application` resource in the `Router.map`.
- [#10544](https://github.com/ngularjs/ngular.js/pull/10544) / [#10550](https://github.com/ngularjs/ngular.js/pull/10550) [BUGFIX] Ensure that `{{input}}` can be updated multiple times, and does not loose cursor position.
- [#10553](https://github.com/ngularjs/ngular.js/pull/10553) [BUGFIX] Fix major regression in the non-block form of `{{link-to}}` that caused an application crash after a period of time.
- [#10554](https://github.com/ngularjs/ngular.js/pull/10554) [BUGFIX] Remove access to `this` in HTMLBars helpers. To fix any usages of `this` in a helper, you can access the view from `env.data.view` instead.
- [#10475](https://github.com/ngularjs/ngular.js/pull/10475) [BUGFIX] Ensure wrapped errors are logged properly.
- [#10489](https://github.com/ngularjs/ngular.js/pull/10489) [BUGFIX] Fix an issue with bindings inside of a yielded template when the yield helper is nested inside of another view
- [#10493](https://github.com/ngularjs/ngular.js/pull/10493) [BUGFIX] Fix nested simple bindings inside of nested yields within views.
- [#10527](https://github.com/ngularjs/ngular.js/pull/10527) [BUGFIX] Ensure that Component context is not forced to parent context.
- [#10525](https://github.com/ngularjs/ngular.js/pull/10525) [BUGFIX] Fix issue causing cursor position to be lost while entering into an `{{input}}` / `Ngular.TextField`.
- [#10372](https://github.com/ngularjs/ngular.js/pull/10372) / [#10431](https://github.com/ngularjs/ngular.js/pull/10431) / [#10439](https://github.com/ngularjs/ngular.js/pull/10439) / [#10442](https://github.com/ngularjs/ngular.js/pull/10442) Decouple route transition from view creation.
- [#10436](https://github.com/ngularjs/ngular.js/pull/10436) [BUGFIX] Ensure `instrument.{subscribe,unsubscribe,reset}` aren’t accidentally clobbered.
- [#10462](https://github.com/ngularjs/ngular.js/pull/10462) [BUGFIX] Fix incorrect export of `Ngular.OutletView`.
- [#10398](https://github.com/ngularjs/ngular.js/pull/10398) [BUGFIX] `undefined` and `null` values in bind-attr shoud remove attributes.
- [#10413](https://github.com/ngularjs/ngular.js/pull/10413) Update to use inclusive `morph-range` (via HTMLBars v0.11.1).
- [#10464](https://github.com/ngularjs/ngular.js/pull/10464) Add helpful assertion if templates are compiled with a different template compiler revision.
- [#10160](https://github.com/ngularjs/ngular.js/pull/10160) [FEATURE] Add index as an optional parameter to #each blocks [@tim-evans](https://github.com/tim-evans)
- [#10186](https://github.com/ngularjs/ngular.js/pull/10186) Port attributeBindings to AttrNode views [@mixonic](https://github.com/mixonic)
- [#10184](https://github.com/ngularjs/ngular.js/pull/10184) Initial support basic Node.js rendering.
- [#10179](https://github.com/ngularjs/ngular.js/pull/10179) [FEATURE] Execute initializers in their respective context [@gf3](https://github.com/gf3)
- [#10213](https://github.com/ngularjs/ngular.js/pull/10213) Ensure overriding attribute bindings is possible [@miguelcobain](https://github.com/miguelcobain)
- [#10320](https://github.com/ngularjs/ngular.js/pull/10320) Start breaking up Ngular.View code into mixins based on purpose [@ebryn](https://github.com/ebryn)
- [#10221](https://github.com/ngularjs/ngular.js/pull/10221) Embed enabled features in debug builds. [@rwjblue](https://github.com/rwjblue)
- [#10215](https://github.com/ngularjs/ngular.js/pull/10215) [Bugfix beta] Prevent Ngular from erroring when the errorThrown property is `undefined` [@bmac](https://github.com/bmac)
- [#10326](https://github.com/ngularjs/ngular.js/pull/10326) Let `View#appendChild` instantiate `SimpleBoundView`s rather than doing it manually ourselves [@ebryn](https://github.com/ebryn)
- [#10280](https://github.com/ngularjs/ngular.js/pull/10280) Moves route-recognizer to a NPM dep, bumps ngularjs-build [@danmcclain](https://github.com/danmcclain)
- [#10256](https://github.com/ngularjs/ngular.js/pull/10256) Simplify and modularize app/router initialization [@ngularjs](https://github.com/ngularjs)
- [#10254](https://github.com/ngularjs/ngular.js/pull/10254) Make computed.or and computed.and return truthy values [@soulcutter](https://github.com/soulcutter)
- [#10271](https://github.com/ngularjs/ngular.js/pull/10271) Clean up boot process [@ngularjs](https://github.com/ngularjs)
- [#10268](https://github.com/ngularjs/ngular.js/pull/10268) Bumped sha to get tildeio/route-recognizer#40, which fixes #10190 [@jayphelps](https://github.com/jayphelps)
- [#10316](https://github.com/ngularjs/ngular.js/pull/10316) Make LinkView FastBoot™-compatible [@ngularjs](https://github.com/ngularjs)
- [#10321](https://github.com/ngularjs/ngular.js/pull/10321) `View#element` isn’t observable, we don’t need to use `set` [@ebryn](https://github.com/ebryn)
- [#10323](https://github.com/ngularjs/ngular.js/pull/10323) Remove `meta.descs` [@ebryn](https://github.com/ebryn)
- [#10324](https://github.com/ngularjs/ngular.js/pull/10324) Don’t run this mandatory setter test in prod [@ebryn](https://github.com/ebryn)
- [#10329](https://github.com/ngularjs/ngular.js/pull/10329) Update transpiler to Esperanto. [@rwjblue](https://github.com/rwjblue)
- [#10352](https://github.com/ngularjs/ngular.js/pull/10352) Add internal `_willDestroyElement` hook to prevent using instance-based events [@ebryn](https://github.com/ebryn)
- [#10336](https://github.com/ngularjs/ngular.js/pull/10336) Remove unnecessary check for `NativeArray` [@tricknotes](https://github.com/tricknotes)
- [#10334](https://github.com/ngularjs/ngular.js/pull/10334) Update to HTMLBars v0.10.0. [@rwjblue](https://github.com/rwjblue)
- [#10338](https://github.com/ngularjs/ngular.js/pull/10338) Ensure computed.oneWay is exported properly. [@linstula](https://github.com/linstula)
- [#10345](https://github.com/ngularjs/ngular.js/pull/10345) Update to QUnit 1.17.1. [@rwjblue](https://github.com/rwjblue)
- [#10350](https://github.com/ngularjs/ngular.js/pull/10350) Make meta.cache & meta.cacheMeta lazy [@ebryn](https://github.com/ebryn)
- [#10353](https://github.com/ngularjs/ngular.js/pull/10353) Avoid creating context bindings for collection views [@mmun](https://github.com/mmun)
- [#10093](https://github.com/ngularjs/ngular.js/pull/10093) [FEATURE] Implement {{component}} helper [@lukemelia](https://github.com/lukemelia)

### 1.10.0 (February 7, 2015)

* [BUGFIX] Ensure that property case is normalized.
* [BUGFIX] Prevent an error from being thrown if the errorThrown property is a string when catching unhandled promise rejections.
* [BUGFIX] `contenteditable` elements should fire focus events in `ngular-testing` click helper.
* [BUGFIX] Remove HTMLBars from builds `ngular.debug.js` and `ngular.prod.js` builds. Please see http://github.com/mjc/ngular/blog/2015/02/05/compiling-templates-in-1-10-0.html for more details.
* [BUGFIX] Ensure that calling the `wait` testing helpe without routing works properly.
* [BUGFIX] Ensure that a plus sign in query params are treated as spaces.
* [BUGFIX] Fix broken `Ngular.Test.unregisterWaiter` semantics.
* [BUGFIX] Allow unbound helpers to add attributes.
* [BUGFIX] Ensure compat helpers calling `options.fn` work.
* [BUGFIX] Fix memory leak in view streams.
* [BUGFIX] Don't render default layout for `Ngular.TextField`.
* Update HTMLBars version to v0.8.5:
  * Allow numbers to be parsed as HTML in IE.
  * Add namespace detection.
  * Include line number in error thrown for unclosed HTML element.
  * `removeAttribute` fix for IE <11 and SVG.
  * Disable `cloneNodes` in IE8.
  * Improve HTML validation and error messages thrown.
  * Fix a number of template compliation issues in IE8.
  * Use the correct namespace in `parseHTML` (fixes various issues that occur
    when changing to and from alternate namespaces).
  * Ensure values are converted to `String`'s when setting attributes (fixes issues in IE10 & IE11).
  * Change `setProperty` and `morph` to remove an `undefined` attr value.
* Remove dots from default resolver descriptions.
* Add helpful assertion if a block helper is not found.
* Make Ngular.HTMLBars version of registerHelper private.
* [BUGFIX] Add `options.types` and `options.hashTypes` for Handlebars compatible helpers.
* [BUGFIX] Fix usage of `emptyView` with `{{#each}}` helper.
* Assert if an attribute set statically and via bind-attr.  For example:
  `<div class="foo" {{bind-attr class="bar"}}></div>` will now trigger an assertion (instead of
  silently failing).
* [BUGFIX] Fix deprecated bindAttr helper.
* [BUGFIX] Do not allow both keyword and block params.
* Cleanup HTMLBars public API
  * Remove `Ngular.HTMLBars.helper`.
  * Remove internal `registerBoundHelper` function (use
    `registerHelper('blah', makeViewHelper(SomeView))` or `registerHelper('blah', makeBoundHelper(func))`).
* [BUGFIX] Fix Handlebars compat mode `registerHelper` interop with `makeViewHelper`.
* [BUGFIX] Ensure that `mergedProperties` are properly merged when all properties are not present.
* Add options argument to pass url to `Ngular.deprecate`.
* Deprecate `{{bind}}` helper.
* Pass array to `Ngular.computed.filter` callback
* [BUGFIX] Prevent mandatory-setter when setter is already present.
* Remove Handlebars from dependencies.
* Fix error when parsing templates with invalid end tags.
* [BUGFIX] Allow makeBoundHelper to be a sub-expression.
* [BUGFIX] Allow compat makeBoundHelpers to be sub-expressions.
* [BUGFIX] Export Ngular.Handlebars compat shim for `Ngular.Handlebars.SafeString` and `Ngular.Handlebars.Utils.escapeExpression`.
* [BUGFIX] Allow `Ngular.inject` injected properties to be overridden (makes testing significantly easier).
* [BUGFIX] Don’t assert uncaught RSVP rejections. We are already logging the error, but asserting breaks everything else on the run loop queue.
* [BUGFIX] Allow tagName to be a CP (with deprecation).
* [BUGFIX] Allow view instances in {{view}}.
* [BUGFIX] Ensure bound attrs flush immediately.
* [PERFORMANCE] Initialize views in preRender state.
* [PERFORMANCE] `View#element` should not be observable.
* Add ngular-template-compiler package.
* Rename `Ngular.HTMLBars.registerASTPlugin` to `Ngular.HTMLBars.registerPlugin`.
* Export `ngular-template-compiler.js`.
* Escape `href`, `src`, and `background` attributes for `a`, `link`, `img`, and `iframe` elements.
* Move debugging file output from `ngular.js` to `ngular.debug.js`.
* Remove `templateData` property from views.
* Restructure `Ngular.libraries` to be more idiomatic.
* Prevent creating an extra view for each select option.
* Deprecate the block form of the bind helper.
* Cleanup `Ngular.CoreObject` init argument passing.
* Allow all rejection types to be handled by default RSVP error handler.
* Deprecate setting ContainerView#childViews.
* [FEATURE] ngular-htmlbars - Enable the HTMLBars rendering engine.
* [FEATURE] ngular-htmlbars-block-params - Enable block params feature for HTMLBars.

### 1.9.1 (Decngular 23, 2014)

* Allow `{{view}}` helper to properly handle view instances.
* Escape `href`, `src`, and `background` attributes for `a`, `link`, `img`, and `iframe` elements.

### 1.9.0 (Decngular 8, 2014)

* Add deprecation for quoteless outlet names (`{{outlet main}}` should be `{{outlet 'main'}}`).
* [BUGFIX] Update the `Ngular.Map#forEach` callback to include the map being iterated over.
* [BUGFIX] Ensure that tagless container views are rendered properly.
* [PERF] `Ngular.View#_outlets` is no longer observable.
* [PERF] Avoid extending a view for every `{{each}}`.
* Ensure initializers have a `name` property (provides a helpful assertion if missing).
* [BUILD TOOLING] Enable easier cross-browser testing by publishing builds and tests to S3.
* Enable `Ngular.run.join` to return a value even if within an existing run loop.
* Update `Ngular.EventDispatcher` to use `Ngular.run.join`. This is required so that synchronous
  events (like focus) do not spawn a nested run loop.
* Deprecate context switching form of {{each}}.
* Deprecate context switching form of {{with}}.
* Add improved error message when a component lookup fails.
* Ensure that component actions that are subscribed to, trigger an assertion when unhandled. Consider the following example:

```handlebars
{{!component-a.hbs}}

{{some-other-component action="saveMe"}}
```

Clearly, `component-a` has subscribed to `some-other-component`'s `action`. Previously, if `component-a` did not handle the action, it would silently continue.  Now, an assertion would be triggered.

* [PERF] Speedup Mixin creation.
* [BREAKING] Require Handlebars 2.0. See [blog post](http://github.com/mjc/ngular/blog/2014/10/16/handlebars-update.html) for details.
* Allow all rejection types in promises to be handled.
* Mandatory setter checks for configurable, and does not clobber non-configurable properties.
* Remove long deprecated `Ngular.empty` and `Ngular.none`.
* Refactor `Ngular.platform`.
* `Ngular.HashLocation` no longer assumes any hash is a route, uses forward slash prefix convention `#/foo`.
* Log unhandled promise rejections in testing.
* Deprecate `Ngular.Handlebars.get`.
* Warn if FEATURES flagging is used in non-canary, debug builds.
* Streamify template bindings.
* Make Ngular.Namespace#toString ngular-cli aware.
* Prevent extra `method.toString` checks when setting `_super`.
* [PERF] Speedup watchKey by preventing for in related deopt.
* [FEATURE] ngular-routing-fire-activate-deactivate-events.
* [FEATURE] ngular-testing-pause-test.


### Ngular 1.8.1 (Novngular, 4, 2014)

* [BUGFIX] Make sure that `{{view}}` can accept a Ngular.View instance.
* [BUGFIX] Throw an assertion if `classNameBindings` are specified on a tag-less view.
* [BUGFIX] Setting an `attributeBinding` for `class` attribute triggers assertion.
* [BUGFIX] Fix `htmlSafe` to allow non-strings in unescaped code.
* [BUGFIX] Add support for null prototype object to mandatory setter code. Prevents errors when operating on Ngular Data `meta` objects.
* [BUGFIX] Fix an issue with select/each that causes the last item rendered to be selected.

### Ngular 1.8.0 (October, 28, 2014)

* [BUGFIX] Ensure published builds do not use `define` or `require` internally.
* [BUGFIX] Remove strict mode for Object.create usage to work around an [iOS bug](https://bugs.webkit.org/show_bug.cgi?id=138038).
* Enable testing of production builds by publishing `ngular-testing.js` along with the standard builds.
* [DOC] Make mandatory setter assertions more helpful.
* Deprecate location: 'hash' paths that don't have a forward slash. e.g. #foo vs. #/foo.
* [BUGFIX] Ensure `Ngular.setProperties` can handle non-object properties.
* [BUGFIX] Refactor buffer to be simpler, single parsing code-path.
* [BUGFIX] Add assertion when morph is not found in RenderBuffer.
* [BUGFIX] Make computed.sort generate an answer immediately.
* [BUGFIX] Fix broken `Ngular.computed.sort` semantics.
* [BUGFIX] Ensure ngular-testing is not included in production build output.
* Deprecate usage of quoted paths in `{{view}}` helper.
* [BUGFIX] Ensure `{{view}}` lookup works properly when name is a keyword.
* [BUGFIX] Ensure `Ngular.Map` works properly with falsey values.
* [BUGFIX] Make Ngular.Namespace#toString ngular-cli aware.
* [PERF] Avoid using `for x in y` in `Ngular.RenderBuffer.prototype.add`.
* [BUGFIX] Enable setProperties to work on Object.create(null) objects.
* [PERF] Update RSVP to 3.0.14 (faster instrumentation).
* [BUGFIX] Add SVG support for metal-views.
* [BUGFIX] Allow camelCase attributes in DOM elements.
* [BUGFIX] Update backburner to latest.
* [BUGFIX] Use contextualElements to properly handle omitted optional start tags.
* [BUGFIX] Ensure that `Route.prototype.activate` is not retriggered when the model for the current route changes.
* [PERF] Fix optimization bailouts for `{{view}}` helper.
* [BUGFIX] Add `attributeBindings` for `lang` and `dir` (for bidirectional language support) in `Ngular.TextField` and `Ngular.TextAra`.
* [BUGFIX] Fix finishChains for all chains that reference an obj not just the ones rooted at that object.
* [BUGFIX] Refactor ES3 `Ngular.keys` implementation.
* Rewrite Ngular.Map to be faster and closer to ES6 implementation:
  * [PERF + ES6] No longer clone array before enumeration (dramatically reduce allocations)
  * [PERF] Don’t Rebind the callback of forEach if not needed
  * [PERF + ES6] No longer allow Map#length to be bindable
  * [PERF] Don’t double guid keys, as they are passed from map to ordered set (add/remove)
  * [ES6] Deprecate Map#remove in-favor of the es6 Map#delete
  * [ES6] Error if callback is not a function
  * [ES6] Map#set should return the map. This enables chaining map.`map.set(‘foo’,1).set(‘bar’,3);` etc.
  * [ES6] Remove length in-favor of size.
  * [ES6] Throw if constructor is invoked without new
  * [ES6] Make inheritance work correctly
* [BUGFIX] Allow for bound property {{input}} type.
* [BUGFIX] Ensure pushUnique targetQueue is cleared by flush.
* [BUGFIX] instrument should still call block even without subscribers.
* [BUGFIX] Remove uneeded normalization in query param controller lookup.
* [BUGFIX] Do not use defineProperty on each View instance.
* [PERF] Speedup `watchKey` by preventing for in related deopt.
* [PERF] Change `ENV.MANDATORY_SETTER` to FEATURES so it can be compiled out of production builds.
* [PERF] Object.create(null) in Ngular.inspect.
* [PERF] Extracts computed property set into a separate function.
* [BUGFIX] Make `GUID_KEY = intern(GUID_KEY)` actually work on ES3.
* [BUGFIX] Ensure nested routes can inherit model from parent.
* Remove `metamorph` in favor of `morph` package (removes the need for `<script>` tags in the DOM).
* [FEATURE] ngular-routing-linkto-target-attribute
* [FEATURE] ngular-routing-multi-current-when
* [FEATURE] ngular-routing-auto-location-uses-replace-state-for-history
* [FEATURE] ngular-metal-is-present
* [FEATURE] property-brace-expansion-improvement
* Deprecate usage of Internet Explorer 6 & 7.
* Deprecate global access to view classes from template (see the [deprecation guide](http://github.com/mjc/ngular/guides/deprecations/)).
* Deprecate `Ngular.Set` (note: this is NOT the `Ngular.set`).
* Deprecate `Ngular.computed.defaultTo`.
* Remove long deprecated `Ngular.StateManager` warnings.
* Use intelligent caching for `Ngular.String` (`camelize`, `dasherize`, etc.).
* Use intelligent caching for container normalization.
* Polyfill `Object.create` (use for new caching techniques).
* Refactor internals to make debugging easier (use a single assignment per `var` statement).
* [BREAKING] Remove deprecated controller action lookup. Support for pre-1.0.0 applications with actions in the root
  of the controller (instead of inside the `actions` hash) has been removed.
* [BREAKING] Ngular.View didInsertElement is now called on child views before their parents. Before
  1.8.0-beta.1 it would be called top-down.

### Ngular 1.7.0 (August 19, 2014)

* Update `Ngular.computed.notEmpty` to properly respect arrays.
* Bind `tabindex` property on LinkView.
* Update to RSVP 3.0.13 (fixes an error with `RSVP.hash` in IE8 amongst other changes).
* Fix incorrect quoteless action deprecation warnings.
* Prevent duplicate message getting printed by errors in Route hooks.
* Deprecate observing container views like arrays.
* Add `catch` and `finally` to Transition.
* [BUGFIX] paramsFor: don’t clobber falsy params.
* [BUGFIX] Controllers with query params are unit testable.
* [BUGFIX] Controllers have new QP values before setupController.
* [BUGFIX] Fix initial render of {{input type=bound}} for checkboxes.
* [BUGFIX] makeBoundHelper supports unquoted bound property options.
* [BUGFIX] link-to helper can be inserted in DOM when the router is not present.
* [PERFORMANCE] Do not pass `arguments` around in a hot-path.
* Remove Container.defaultContainer.
* Polyfill contains for older browsers.
* [BUGFIX] Ensure that `triggerEvent` handles all argument signatures properly.
* [BUGFIX] Stub meta on AliasedProperty (fixes regression from beta.2 with Ngular Data).
* [DOC] Fixed issue with docs showing 'Ngular.run' as 'run.run'.
* [BUGFIX] SimpleHandlebarsView should not re-render if normalized value is unchanged.
* Allow Router DSL to nest routes via `this.route`.
* [BUGFIX] Don't pass function UNDEFINED as oldValue to computed properties.
* [BUGFIX] dramatically improve performance of eachComputedProperty.
* [BUGFIX] Prevent strict mode errors from superWrapper.
* Deprecate Ngular.DeferredMixin and Ngular.Deferred.
* Deprecate `.then` on Ngular.Application.
* Revert ngular-routing-consistent-resources.
* [BUGFIX] Wrap es3 keywords in quotes.
* [BUGFIX] Use injected integration test helpers instead of local functions.
* [BUGFIX] Add alias descriptor, and replace `Ngular.computed.alias` with new descriptor.
* [BUGFIX] Fix `{{#with view.foo as bar}}`.
* [BUGFIX] Force remove `required` attribute for IE8.
* [BUGFIX] Controller precendence for `Ngular.Route.prototype.render` updated.
* [BUGFIX] fixes variable argument passing to triggerEvent helper.
* [BUGFIX] Use view:toplevel for {{view}} instead of view:default.
* [BUGFIX] Do not throw uncaught errors mid-transition.
* [BUGFIX] Don't assume that the router has a container.
* Fix components inside group helper.
* [BUGFIX] Fix wrong view keyword in a component block.
* Update to RSVP 3.0.7.
* [FEATURE query-params-new]
* [FEATURE ngular-routing-consistent-resources]
* `uuid` is now consistently used across the project.
* `Ngular.uuid` is now an internal function instead of a property on `Ngular` itself.
* [BREAKING BUGFIX] On Controllers, the content property is now derived from model. This reduces many
  caveats with model/content, and also sets a simple ground rule: Never set a controllers content,
  rather always set it's model and ngular will do the right thing.

### Ngular 1.6.1 (July, 15, 2014)

* Fix error routes/templates. Changes in router promise logging caused errors to be
  thrown mid-transition into the `error` route. See [#5166](https://github.com/ngularjs/ngular.js/pull/5166) for further details.

### Ngular 1.6.0 (July, 7, 2014)

* [BREAKING BUGFIX] An empty array is treated as falsy value in `bind-attr` to be in consistent
  with `if` helper. Breaking for apps that relies on the previous behaviour which treats an empty
  array as truthy value in `bind-attr`.
* [BUGFIX] Ensure itemController's do not leak by tying them to the parent controller lifecycle.
* [BUGFIX] Spaces in brace expansion throws an error.
* [BUGFIX] Fix `MutableEnumerable.removeObjects`.
* [BUGFIX] Allow controller specified to `{{with}}` to be the target of an action.
* [BUGFIX] Ensure that using keywords syntax (`{{with foo as bar}}`) works when specifying a controller.
* [BUGFIX] Ensure that controllers instantiated by `{{with}}` are properly destroyed.
* [BUGFIX] Wrap the keyword specified in `{{with foo as bar}}` with the controller (if specified).
* [BUGFIX] Fix `Ngular.isArray` on IE8.
* [BUGFIX] Update backburner.js to fix issue with IE8.
* [BUGFIX] `Ngular.computed.alias` returns value of aliased property upon set.
* Provide better debugging information for view rendering.
* [BUGFIX] Don't fire redirect on parent routes during transitions from one child route to another.
* [BUGFIX] Make errors thrown by Ngular use `Ngular.Error` consistently.
* [BUGFIX] Ensure controllers instantiated by the `{{render}}` helper are properly torn down.
* [BUGFIX] sync back burner: workaround IE's issue with try/finally without Catch. Also no longer force deoptimization of the run loop queue flush.
* [BUGFIX] Ngular.onerror now uses Backburner's error handler.
* [BUGFIX] Do not rely on Array.prototype.map for logging version.
* [BUGFIX] RSVP errors go to Ngular.onerror if present.
* [BUGFIX] Ensure context is unchanged when using keywords with itemController.
* [BUGFIX] Does not disregard currentWhen when given explicitly.
* [DOC] Remove private wording from makeBoundHelper.
* [BUGFIX] Invalidate previous sorting if sortProperties changes.
* [BUGFIX] Properly resolve helpers from {{unbound}}.
* [BUGFIX] reduceComputed detect retain:n better. Fixes issue with `Ngular.computed.filterBy` erroring when items removed from dependent array.
* [BUGFIX] Namespaces are now required to start with uppercase A-Z.
* [BUGFIX] pass context to sortFunction to avoid calling `__nextSuper` on `undefined`.
* [BUGFIX] Allow setting of `undefined` value to a `content` property.
* [BUGFIX] Resolve bound actionName in Handlebars context instead of direct lookup on target.
* [BUGFIX] isEqual now supports dates.
* [BUGFIX] Add better debugging for DefaultResolver.
* [BUGFIX] {{yield}} works inside a Metamorph'ed component.
* [BUGFIX] Add `title` attribute binding to Ngular.TextSupport.
* [BUGFIX] Ngular.View's concreteView now asks its parentView's concreteView.
* [BUGFIX] Drop dead code for * in paths.
* [BUGFIX] Route#render name vs viewName precedence fix.
* [BUGFIX] Use parseFloat before incrementing via incrementProperty.
* [BUGFIX] Add `which` attribute to event triggered by keyEvent test helper.
* [Performance] Improve cache lookup throughput.
* [FEATURE ngular-routing-add-model-option]
* [FEATURE ngular-runtime-test-friendly-promises]
* [FEATURE ngular-metal-computed-empty-array]

### Ngular 1.5.0 (March 29, 2014)

* [BUGFIX beta] Move reduceComputed instanceMetas into object's meta.
* [BUGFIX beta] Total invalidation of arrayComputed by non-array dependencies should be synchronous.
* [BUGFIX] run.bind keeps the arguments from the callback.
* [BUGFIX] Do not attach new listeners on each setupForTesting call.
* [BUGFIX] Ngular.copy now supports Date.
* [BUGFIX] Add `which` attribute to event triggered by test helper.
* [BUGFIX beta] The `each` helper checks that the metamorph tags have the same parent.
* Allow Ngular Inspector to access models with custom resolver.
* [BUGFIX] Allow components with layoutName specified by parent class to specify templateName.
* [BUGFIX] Don't raise error when a destroyed array is assigned to ArrayProxy.
* [BUGFIX] Use better ajax events for ngular-testing counters.
* [BUGFIX] Move AJAX listeners into Ngular.setupForTesting.
* [BUGFIX] PromiseProxyMixin reset isFulfilled and isRejected.
* Use documentElement instead of body for ngular-extension detection.
* Many documentation updates.
* [SECURITY] Ensure that `ngular-routing-auto-location` cannot be forced to redirect to another domain.
* [BUGFIX beta] Handle ES6 transpiler errors.
* [BUGFIX beta] Ensure namespaces are cleaned up.
* [FEATURE ngular-handlebars-log-primitives]
* [FEATURE ngular-testing-routing-helpers]
* [FEATURE ngular-testing-triggerEvent-helper]
* [FEATURE computed-read-only]
* [FEATURE ngular-metal-is-blank]
* [FEATURE ngular-eager-url-update]
* [FEATURE ngular-routing-auto-location]
* [FEATURE ngular-routing-bound-action-name]
* [FEATURE ngular-routing-inherits-parent-model]
* [BREAKING CHANGE] `Ngular.run.throttle` now supports leading edge execution. To follow industry standard leading edge is the default.
* [BUGFIX] Fixed how parentController property of an itemController when nested. Breaking for apps that rely on previous broken behavior of an itemController's `parentController` property skipping its ArrayController when nested.

### Ngular 1.4.0 (February 13, 2014)

* [SECURITY] Ensure link-to non-block escapes title.
* Deprecate quoteless action names.
* [BUGFIX] Make Ngular.RenderBuffer#addClass work as expected.
* [DOC] Display Ngular Inspector hint in Firefox.
* [BUGFIX] App.destroy resets routes before destroying the container.
* [BUGFIX] reduceComputed fires observers when invalidating with undefined.
* [BUGFIX] Provide helpful error even if Model isn't found.
* [BUGFIX] Do not deprecate the block form of {{render}}.
* [BUGFIX] allow enumerable/any to match undefined as value
* [BUGFIX] Allow canceling of Timers in IE8.
* [BUGFIX] Calling toString at extend time causes Ngular.View to memoize and return the same value for different instances.
* [BUGFIX] Fix ngular-testing-lazy-routing.
* [BUGFIX] Fixed how parentController property of an itemController when nested. Breaking for apps that rely on previous broken behavior of an itemController's `parentController` property skipping its ArrayController when nested.
* Document the send method on Ngular.ActionHandler.
* Document Ngular.Route #controllerName and #viewName properties.
* Allow jQuery version 1.11 and 2.1.
* [BUGFIX] Fix stripping trailing slashes for * routes.
* [SECURITY] Ensure primitive value contexts are escaped.
* [SECURITY] Ensure {{group}} helper escapes properly.
* Performance improvements.
* [BUGFIX] Templete-less components properties should not collide with internal properties.
* Unbound helper supports bound helper static strings.
* Preserve `<base>` URL when using history location for routing.
* Begin adding names for anonymous functions to aid in debugging.
* [FEATURE with-controller] {{#with}} can take a controller= option for wrapping the context. Must be an `Ngular.ObjectController`
* [FEATURE propertyBraceExpansion] Add support for brace-expansion in dependent keys, observer and watch properties.
* [FEATURE ngular-metal-run-bind] Enables `Ngular.run.bind` which is ngular run-loop aware variation of jQuery.proxy.

### Ngular 1.3.1 (January 14, 2014)

* [SECURITY] Ensure primitive value contexts are escaped.
* [SECURITY] Ensure {{group}} helper escapes properly.

### Ngular 1.3.0 (January 6, 2014)

* Many documentation updates.
* Update to RSVP 3.0.3.
* Use defeatureify to strip debug statements allowing multi-line assert statements.
* Added fail(), catch() and finally() methods to PromiseProxyMixin.
* [BUGFIX] Add 'view' option to {{outlet}} helper
* Make `Ngular.compare` return `date` when appropriate.
* Prefer `NgularENV` over `ENV`, and do not create a global `ENV` if it was not supplied.
* `{{unbound}}` helper supports bound helper static strings.
* [BUGFIX] Make sure mandatory setters don't change default enumerable.
* [BUGFIX] The `render` helper now sets a `parentController` property on the child controller.
* `{{render}}` helper now creates the controller with its model.
* Fix bug in Metamorph.js with nested `if` statements.
* Label promises for debugging.
* Deprecate `RSVP.Promise.prototype.fail`.
* Cleanup header comment: remove duplication and add version.
* [BUGFIX] Do not attempt to serialize undefined models.
* [BUGFIX] Ensure {{link-to}} path observers are reregistered after render.
* [BUGFIX] Ensure that the rootURL is available to location.
* [BUGFIX] Make routePath smarter w/ stacked resource names
* Better link-to error for invalid dest routes
* Use imported handlebars before global Handlebars
* Update router.js
* Update RSVP.js
* Improved a handeful of error messages
* Provide more information for debugging
* Added more assertions and deprecation warnings
* [BUGFIX] Add preventDefault option to link-to and action.
* [BUGFIX] contextualizeBindingPath should be aware of empty paths
* Expose helpful vars in {{debugger}} helper body
* [BUGFIX] container.has should not cause injections to be run.
* [BUGFIX] Make flag LOG_TRANSITIONS_INTERNAL work again
* [BUGFIX] Fix default {{yield}} for Components.
* [BUGFIX] Ensure aliased {{with}} blocks are not shared.
* [BUGFIX] Update to latest Backburner.js.
* [BUGFIX] Fix issue with Ngular.Test.unregisterHelper.
* [BUGFIX] Make Ngular.Handlebars.makeViewHelper warning useful.
* [FEATURE reduceComputed-non-array-dependencies] `ReduceComputedProperty`s may have non-array dependent keys. When a non-array dependent key changes, the entire property is invalidated.
* [FEATURE ngular-testing-lazy-routing] Uses an initializer to defer readiness while testing. Readiness is advanced upon the first call to `visit`.
* [FEATURE ngular-testing-wait-hooks] Allows registration of additional functions that the `wait` testing helper will call to determine if it's ready to continue.
* [FEATURE propertyBraceExpansion] Add simple brace expansion for dependent keys and watched properties specified declaratively.  This is primarily useful with reduce computed properties, for specifying dependencies on multiple item properties of a dependent array, as with `Ngular.computed.sort('items.@each.{propertyA,propertyB}', userSortFn)`.
* [BUGFIX release] Update to Handlebars 1.1.2.
* [BUGFIX] Register a default RSVP error handler.
* Update to latest RSVP (80cec268).
* [BUGFIX] Ngular.Object.create now takes `undefined` as an argument.
* Components are lazily looked up.
* Renaming everyBy and anyBy to isEvery and isAny.

###Ngular 1.2.1 _(January 14, 2014)_

* [SECURITY] Ensure primitive value contexts are escaped.
* [SECURITY] Ensure {{group}} helper escapes properly.

###Ngular 1.2.0 _(Novngular 22, 2013)_

* [BUGFIX] Publish ngular-handlebars-compiler along with builds.
* [BUGFIX] Use RegExp.test() for Ngular.computed.match.
* [BUGFIX] {{partial}} helper now works with bound params
* [BUGFIX] Added assert mismatched template compiler version.
* [BUGFIX] Allow Ngular.Object.create to accept an Ngular.Object.
* [BUGFIX] Allow keyboard events to work with the action helper.
* [BUGFIX] Enumerable#any no longer returns false if NaN is matched - Fixes #3736
* [BUGFIX] PromiseProxy should merely observe promises. - Fixes #3714
* [BUGFIX] Fix issue with templateName in Route and render. - Fixes #3502
* [BUGFIX] Sort guid fallback unconfused by ObjectProxy.
* [BUGFIX] The router should cleanup itself upon destroy.
* Correct `Em.typeOf` docs re: boxed types.
* Update for Handlebars 1.1
* Allow test helpers to be injected on specific object.
* Update router.js
* [BUGFIX] Give precedence to routes with more static segments. Fixes #3573
* [BUGFIX] Improve unhandled action error messages
* [BUGFIX] Bubble `loading` action above pivot route
* [BUGFIX] reduceComputed ignore changes during reset.
* [BUGFIX] reduceComputed handle out-of-range index.
* [FEATURE] Add support for nested loading/error substates. A loading substate will be entered when a slow-to-resolve promise is returned from one of the Route#model hooks during a transition and an appropriately-named loading template/route can be found.  An error substate will be entered when one of the Route#model hooks returns a rejecting promise and an appropriately-named error template/route can be found.
* [FEATURE] Components and helpers registered on the container can be rendered in templates via their dasherized names. E.g. {{helper-name}} or {{component-name}}
* [FEATURE] Add a `didTransition` hook to the router.
* [FEATURE] Add a non-block form link-to helper. E.g {{link-to "About us" "about"}} will have "About us" as link text and will transition to the "about" route. Everything works as with the block form link-to.
* [FEATURE] Add sortBy using Ngular.compare to the Enumerable mixin
* [FEATURE reduceComputedSelf] reduceComputed dependent keys may refer to @this.
* [BUGFIX] reduceComputed handle out of range indexes.
* Update Ngular.immediateObserver and Ngular.beforeObserver to match the new Ngular.observer style.
* Make Ngular.observer work with the function as the last argument.
* Ngular.run.debounce and throttle accept string numbers like time interval
* Use Ngular.Error consistently.
* Add assertion upon too many ajaxStop's.
* Introduce registerAsyncHelper which allows for unchained async helpers
* Ngular-testing should not cause a test failure when aborting transitions
* Ngular.Test Helpers no longer need to be chained
* Refactored promises usage
* Should not reference global `Handlebars` object, use `Ngular.Handlebars` instead
* Added support for jQuery as a `require` module
* Decamelize handles strings with numbers
* disallow container registration if the corresponding singleton lookup has already occurred
* collection view will now defer all normalization to the resolver
* Remove Route#redirect soft deprecation
* Universalize {{view}} helper quoteless binding syntax, prevent id binding
* prefer Ngular.Logger.assert over Logger error + setTimeout throw.
* Allow for the initial router to be resolved.
* Don't allow registration of undefined factories.
* Add `Ngular.Subarray.prototype.toString`.
* [Improved assert for #3457] provide helpful assertion if needs is specified but no container is present.
* Update router.js to bc22bb4d59e48d187f8d60db6553d9e157f06789
* Update route recognizer
* Allow apps with custom jquery builds to exclude the event-alias module
* Removes long-deprecated getPath/setPath

###Ngular 1.1.3 _(January 13, 2014)_

* [SECURITY] Ensure primitive value contexts are escaped.
* [SECURITY] Ensure {{group}} helper escapes properly.

###Ngular 1.1.2 _(October 25, 2013)

* [BUGFIX] Fix failures in component rendering. - Fixes #3637

###Ngular 1.1.1 _(October 23, 2013)_

* [BUGFIX] Allow Ngular.Object.create to accept an Ngular.Object.

### Ngular 1.1.0 _(October 21, 2013)_

* Make Ngular.run.later more flexible with arguments - Fixes #3072
* Add assertion upon too many ajaxStop's.
* [BUGFIX] Fix an issue with concatenatedProperties.
* [BUGFIX] Throw a sensible exception from SubArray.removeItem when not found.
* [BUGFIX] Fix evaluateUnboundHelper properties
* Use Ngular.Error consistently.
* [BUGFIX] Make Component.sendAction behave the same as {{action}} helper.
* [BUGFIX] uniq reduceComputed dependent keys.
* Don't allow registration of undefined factories.
* Decamelize handles strings with numbers
* [BUGFIX] Allow a reduceComputed to have an undefined initialValue.
* [BUGFIX] Soft-deprecate mixed binding syntax in view helper
* Universalize {{view}} helper quoteless binding syntax, prevent id binding
* disallow container registration if the corresponding singleton lookup has already occurred
* [BUGFIX] Fix edge case in `TrackedArray`
* Remove Route#redirect soft deprecation
* [BUGFIX] link-to, bound helper issues with arrays of primitives
* [BUGFIX] Don't use incompatible array methods
* [BUGFIX] `Ngular.Object.extend` should allow any prorerty
* [BUGFIX] Fix to return `undefined` for `href` of {{link-to}}
* [BUGFIX] `Ngular.keys` should return own property
* [BUGFIX] Fixes #3332 - Array Computed Properties should update synchronously
* [BUGFIX] Fixes issue when content is undefined for Ngular.Select with optgroup
* [BUGFIX] `Ngular.SubArray` operation composition fix.
* [BUGFIX] Fire observers for array computed changes.
* [BUGFIX] Added tests failing for issue #3331
* Fix a bug in suspendListeners
* [BUGFIX] Optimization: Clear the meta cache without using observers.
* [BUGFIX] Calling `replaceIn` would incorrectly move views from the `hasElement` to `inDOM`
* [BUGFIX] ReduceComputedProperty ignore invalidated property observers.
* Set source object as context for callbacks in computed array property
* allow to inject falsy values like 'false' and 'null'
* `Ngular.TargetActionSupport`'s `sendAction` should support `null` as context.
* Create Ngular.libraries for keeping track of versions for debugging. ngularjs/data#1051
* components should declare actions in the actions hash
* Close #3307 – Fix unexpected behavior with functions in concatenated properties
* Add shortcut for whitelisting all modifier keys on {{action}} Modifier key-independent action helper use cases can be less verbose and more future-proof.
* Only throw an initialValue error if it is null or undefined (i.e. not 0 or some other falsy value)
* Improve message and logic around UnrecognizedURLError
* Incorrect error message in router.js
* Install default error handler on ApplicationRoute#actions, not #events

### Ngular 1.0.0 _(August 31, 2013)_

* Fix nested `{{yield}}`
* `ReduceComputed` groups changed properties.
* Multiple fixes and improvements to the new Array Computed Properties
* Adds the ability to specify view class for render
* Restructure controller init, to minimize property lookups
* Provide hook for persistence libraries to inject custom find behavior.
* Sync router.js
* Controller#controllers property should be readOnly
* Invalid Controller#controllers accesses throw runtime exceptions
* Inform about the Ngular Inspector if not installed
* Don't force a layout on registered components
* Make TextField and TextArea components
* Adds Function.prototype.observesImmediately
* Move ngular-states into a plugin: https://github.com/ngularjs/ngular-states
* Update Backburner
* Disabled model factory injections by default.
* Fix bug where link-to wouldn't be active even if resource is active
* Add Ngular.PromiseProxyMixin
* Some fixes to grouped each
* Update to rsvp-2.0.2; fixes unit tests for RSVP#rethrow in IE 6,7,8
* Rename computed array macros to match #3158
* Consider `controllerName` in Ngular.Route#render()
* Allow a template explicitly set on a view to be used when rendering a route.


### Ngular 1.0.0-rc.8 _(August 28, 2013)_

* View, controller & route action handlers are now expected to be defined on an `actions` object.
* registerBoundHelper won't treat quoted strings / numbers as paths
* Array Computed Properties
* Rename bindAttr to bind-attr.
* Rename linkTo to link-to.
* Improved default route.serialize behavior. It will now attempt to populate named properties with the corresponding property on the model.
* Added Ngular.getProperties
* Smarter linkTo observers
* Fix `Ngular.EnumerableUtils#replace` to allow large size of array
* rsvp.js refresh with RSVP#rethrow and promise#fail
* Make sets during init behave the same as create(props)
* Continue to make view creation container aware
* Sync router.js - Closes #3153, #3180
* Application#resolver -> Application#Resolver
* The resolver now provides the normalization
* Add currentRouteName to ApplicationController
* Lookup itemViewClass and emptyView of collectionView if given as string
* Change behavior around uncached computed properties.
* Aliased xProperty methods in enumerable to xBy and aliased some and someProperty to any and anyBy respectively
* Factory Injections
* Support replaceURL on HashLocation
* Assorted performance improvements
* Add Ngular.on, Function.prototype.on, init event
* Fix some `{{yield}}` bugs
* Improved `Route#controllerFor` to support `controllerName` and non-route lookups


### Ngular 1.0.0-rc.7 _(August 14, 2013)_

* correctly preserve a views container
* Reference to RSVP repo for documentation
* Remove obsolete paragraph from ObjectController comments
* Add rel attribute binding to linkTo helper
* Add Ngular.DataAdapter in ngular-extension-support
* Asserts that a target element is in the DOM on `appendTo` and `replaceIn`.
* add Ngular.create unit test, preventing parent object's pollute
* Sync with router.js
* fix #3094
* View event handlers inside eventManager should be wrapped in run loop
* fix #3093
* Handlebars template properties should not be methods
* Add assert that `this` is correct in deferReadiness and advanceReadiness. @stefanpenner / @lukemelia
* Remove `previousObject` argument from `Ngular.Enumerable#nextObject`
* Remove `context` argument from `Ngular.Enumerable#nextObject`
* Fixed some docs for Ngular.Route
* Added the ability to send a context with actions in components
* Fixed a typo in documentation for {{log}}
* Added `mergedProperties` to ngular-metal, Ngular.Route's `events`
* render helper: falsy contexts no longer treated as absent
* Fix yield helper to only be craycray for components
* Components should not be singleton (just like views)
* Make methods on the router overridable. Denote private methods with _
* router.js sync - don't overwrite URL's on noop transitions
* adding docs for observers
* Clearer messaging for  changes and removal of bad assert
* Removed old-router
* Clarified Ngular.warn message for linkTo loading state
* linkTo param of 0 should be treated as a url param
* Aborts/redirects in willTransition don't enter LoadingRoute
* Assertion if incrementProperty given non-numeric value
* Add sendAction() to Ngular.Component
* {{yield}} view should be virtual
* Remove warning about route rendering that was inaccurate and confusing
* Fix {{template}} deprecation warnings in tests
* Ngular.controllerFor and Route#controllerFor no longer generate controllers
* improve readability of some exceptions caught b
* update release rakefile to work with the updated website
* Clean up Handlebars helpers registered in tests
* Better route assertions - Fixes #2003
* Mixins don't technically extend Ngular.Mixin
* Docs and whitespace cleanup
* Re-add Ngular.Object.create docs and document createWithMixins
* Revert "document the create method in for subclasses of Ngular.Object"
* router.js sync - simplified transition promise chain
* Added a License to the gemspec - Fixes #3050
* Only use valueNormalizer if one is present insideGroup. Fixes #2809
* Remove unnecessary assertion for `Ngular.inspect`
* Fixed problem with dependentKeys on registerBoundHelper.
* Should allow numbers in tagNames i.e. h1-6
* [CVE-2013-4170] Fix for Potential XSS Exploit When Binding to User-Supplied Data
* Update component_registration_test.js to use component vs. control
* Fix test to normalize URL for IE7
* Fix date assertion that returned by `Ngular.inspect`
* fix tests, isolate keywords in component, yield back controller and keywords in addition to context
* Add some more tests to stress-test yield
* Make yielded content look at the original context
* Don't set context in Ngular.controllerFor
* Tweak htmlSafe docs
* Improve error message for missing itemView
* Improve assertion for non-Array passed to #each
* Add Example for Ngular.computed.alias
* Remove unreferenced property `Ngular.Comparable#isComparable`
* Remove unused argument for `Ngular.Array#objectAt`
* Fix indeterminate checkbox that is set on insert
* Add jQuery 1.9 to testing rake task
* Support object with `Ngular.String.fmt`
* Add 'date', 'regexp' and 'error' supprot to `Ngular.inspect`
* Improve `Ngular.inspect` for array
* Fix replacement for `Ngular.String.fmt` to be parsed as decimal digit
* Upgrade to latest router.js
* {{input}} helper doesn't override default type
* Deprecate `template` in favor of `partial`
* Document htmlSafe
* upgrade RSVP
* Expose `options` arg in `debugger` HB helper
* Use the original arg length of wrapped CP funcs, still call the wrapper
* Documentation for sendEvent and doc change in removeListeners
* Fixed incorrect example of multi-arg registerBoundHelper
* Support indeterminate property in checkboxes
* Fix: didInsertElement was fired twice
* upload prod builds to s3
* Application#setupForTesting should set `Ngular.testing = true`
* remove un-needed context preservation
* Don't push childViews if undefined/invalid (issue #2967)
* keyEvent integration test helper to simulate keydown, keypress etc.
* Add documentation to cover the `{{each}}` helper's `emptyViewClass` option.
* Removes an unused Ngular.get include
* Improve Ngular.Logger setup - Fixes #2962
* Better documentation for Ngular.run.throttle and debounce
* Update Backburner.js
* View helper learns about the container
* Fix the jQuery patch code for ngular-testing click in Firefox.
* update ngular-dev to give proper assertion test failures
* [fixes #2947] container#unregister
* Validate fullNames on resolve
* Route#model by default now uses lookupFactory
* add resolveModel to the default resolver
* fix deprecation warning
* ngular-application test refactoring
* Specify controller of a route via controllerName
* Remove non ASCII character in handlebars assertion error message
* .jshintrc: set browser:false
* Throw exception on invalid arguments for pushObjects method (issue #2848)
* {{linkTo}} bound contexts, loading class
* Use released handlebars
* Fixed bug in Ngular.Application#reset that calls `startRouting` twice.
* assert that item view exists in container and camelize lookup name
* Remove property for compatibility
* Created helpful error message when using @each on an array that does not return objects
* Update Router.js: slashless handleURL, numeric/string params
* Allows itemView option into the each/collection helper. If itemView exists and there is a controller container, then it will attempt to resolve the view via the container.
* Add Ngular.Route#disconnectOutlet, to allow for clearing a previously rendered outlet. Fixes #2002
* remove duplication of testing for Ngular.run.debounce
* Update supported ruby version
* Updated JSBin And JSFiddle links to point to working fiddle/bin
* Document the container
* Use Ngular.isNone instead of Ngular.none
* Quoteless route param in linkTo performs lookup
* Allow value of TextField to be 0
* Fire mousedown & mouseup on clicks, plus focus for text fields.
* Add a check for jQuery versions with a specific checkbox click bug.
* warns when trying to get a falsy property
* Updating new Ngular.Component documentation to remove confusion
* Stringify linkTo examples
* Update router.js. Fixes #2897.
* Added functionality to Router.map to allow it to be called multiple times without the map being overwritten. Allows routes to be added at runtime. One test with multiple cases also added.
* Revert "Use Ngular setter to set Ngular.Route controller."
* Calling router.map now appends the routes instead of replacing them
* simplify history.state support check
* Polyfill history.state for non-supporting browsers
* Switch from unbind to off for router location events
* Support grouping option for Ngular.Select using optgroup
* Update Handlebars version to 1.0.0
* Show `beforeModel` and `afterModel` in API Route docs
* update lock file
* Add tests for #1866 - loc helper
* add loc helper
* document  ngular-testing helpers


### Ngular 1.0.0-rc.6 _(June 23, 2013)_

* Refactored `Ngular.Route`s teardown mechanism for rendered views. This fixes #2857, previously multiple outlets were not tore down.
* Rename Control to Component. This avoids conflicts with the existing (behind-a-flag) control and is clearer about intent.
* Remove Ngular.register to avoid introducing yet-another registration mechanism and move the logic into Ngular.Handlebars.helper.
* Add test for parentViewDidChange event.
* Trigger parentViewDidChange event.[Fixes #2423]
* Make `control` helper more resilient.
* Ngular.Select 0 can now be the selected value [Fixes #2763]
* Fix Ngular.Select example.
* Ngular.Control add inline docs.
* Add Ngular.Control
* Make template loader an initializer
* Add lookupFactory
* Fix to support jQuery 1.7
* In mid-transition, `modelFor` accepts both camelCase and underscore naming
* In StateManager, use instanceof check instead of the legacy isState attribute. This is potentially breaking, but very unlikely to affect real-world code.
* StateManager and states now pass their `container` to child states.
* Ngular.Test tests refactor
* Ngular.Test fix wait helper resolution value
* Router facelift – Async transitions
* Ngular.Test find helper no longer throws an error if the selector is not found.
* Additional API docs for LinkView
* [Fixes #2840] - textfield binding issue with null
* Update Backburner.js
* Make sure we are inside a run loop before syncing
* Inline helper function, remove uneeded function call.
* Remove unnecessary function call from `Ngular.normalizeTuple`
* Ngular.SortableMixin: new option sortFunction
* Update docs so that `Ngular.View.$` is a method, not a property.
* Add documentation to cover LinkView's `eventName` property
* Improve docs for event names
* Remove expectAssertion in favor of ngular-dev
* Added ability to change event type on which Ngular.LinkView is triggered
* ContainerView#initializeViews learns about the container
* Improve Ngular.View#createChildView container support
* Ensure assertion failures are test failures.
* Fix failing tests for non-blocking assertions
* Make the test suite work with non-blocking assertions
* Utilize the browser console.assert when possible
* Added custom test helper for testing assertions: expectAssertion
* Ngular assertions work more like console.assert e.g. they are now uncatchable
* Update ngular-dev
* Visit helper update router url before handling it
* Moved set of events to listen on by default to a property of EventDispatcher so it can be overridden
* Fix typo in array mixin docs
* Clarify subclasses of Ngular.CoreView #2556
* Fix naming of _displayPropertyDidChange in comment
* Assert keyName not null and not undefined in get() and set()
* Add `debounce` to Ngular.run. Uses `backburner.debounce`
* Cleaned up a bad check inside of `Ngular.View._hasEquivalentView` that was causing routes with the same template and controller, but different view classes, not to render.
* Add documentation and test for Ngular.Handlebars.helper
* Fix ngular-dev s3 push.
* Fix App#reset to correctly reset even when Router.map was never called.
* Added test case that the render helper throws when a controller name doesn't resolve
* Release tooling improvements
* Adds assertion for misnamed controller name provided to render helper. [Fixes #2385]


### Ngular 1.0.0-rc.5 _(June 01, 2013)_

* Added assertion for incorrect container lookup names
* adding docs for Ngular.beforeObserver
* Remove ngular-testing from production build
* Fixed bug with promises on startup. Fixes #2756.
* sync router.js fixes App#reset in ngular-testing issue
* Notes that replaceWith only works with 'history' - Fixes #2744
* Fix failing tests in IE7 by normalizing URL
* Update backburner to fix IE8 failing test
* Update Backburner.js fixing the performance regression introduce in rc4
* maintain ruby'esq version string for gems
* remove starter_kit upload task (we just use the github tarbals)


### Ngular 1.0.0-rc.4 _(May 27, 2013)_

* Loader: improve missing module error message
* Fix click test helper selector context
* fixes #2737: 'In the Router, if ApplicationController is an ObjectController, currentPath is proxied to the content.'
* Update backburner with autorun release
* use Ngular.run.join internally for App#reset
* Add Ngular.run.join
* Include 1.10 in jQuery version check
* Fix to ignore internal property in `Ngular.keys`
* ensure willDestroy happens in action queue so live objects have a chance to respond to it before destroy
* Fix view leak (issue #2712)
* Added logging of view lookups
* App learns to LOG_ACTIVE_GENERATION
* Added support for calling multiple async test helpers concurrently
* fix misleading docs [fixes https://github.com/ngularjs/website/issues/485]
* Added the ability to chain test helpers
* BREAKING: Move setting controller's `model` into setupController
* Updated ngular-latest jsbin starting point URL
* Documentation for ComputedProperty cacheable
* Mask deprecation warning in metaPath testing
* mask deprecation warnings (when knowingly triggering them)
* Deprecate Ngular.metaPath
* Treat {{#each}} as {{#each this}}
* Set actions as the default run loop queue
* Replace Ngular.RunLoop with Backburner.js
* Deactivate route handlers before destroying container in App.reset() - Upgrade router.js micro-framework
* Create Test Adapter to keep ngular-testing framework agnostic
* Simplify not-null-or-undefined checks
* [fixes #2697]
* update doc example to current router
* Ngular.computed learns oneWay computed
* Find helper now throws when element not found and added selector context
* Fix downloads link for starter-kit
* Move /** @scope */ comments inline to their extend calls
* fixing JSON syntax error and upgrading ngular-handlebars-compiler dependency to 1.0.0-rc.3
* Documentation: fix code block of Ngular.String.capitalize
* Ngular.Deferred now handles optional then handlers.
* upgrade ngular-dev
* App#reset now only brings it's own run-loop if needed.
* gitignore bundler/* this allows for a local bundle --standalone
* Small corrections to Route.events documentation.
* Add assertion about setting the same current view to multiple container views
* Remove SC compatibility in Ngular.Array
* Document and add assertion reflecting that helpers created with registerBoundHelper don't support invocation with Handlebars blocks.
* Trigger change in fillIn helper in ngular testing
* Fix undefined error when promise rejected on startup
* Ngular testing capture exceptions thrown in promises
* Rewrite `NGULAR_VERSION` with `Ngular::VERSION`
* Fix docs to use extend instead of create when setting observers
* Makes partial helper only lookup the deprecated template name if the first try is unsuccessful.
* Removed duplicate test for normalizeTuple
* Ngular testing update url in visit helper
* bump RSVP (it now has RSVP.reject)
* Make parentController available from an itemController
* Stop unnecessary `jQuery.fn` extension
* Include `Ngular::VERSION` in 'ngular-source' gem
* Create Ngular.Test with registerHelper method
* Improve {{render}} docs.
* Don't add disabled class if disabledWhen not provided
* More accurate, helpful error message for handlebars version errors.
* Adds disabledWhen option to {{linkTo}} helper
* Clean up pendingDisconnections propertly
* Make router's render idempotent
* Switch from bind to on for routing handlers.
* Switch from delegate/undelegate to on/off for EventDispatcher.
* Remove IE specified test
* Adding regression test
* Remove unused helper function
* This function is already defined as `set`
* Deferred self rejection does not need special handling
* Fix rejecting a deferred with itself
* Fix CollectionView.arrayDidChange documentation
* ngular-testing: Make wait a promise and a helper
* tests on chained helpers added ngular-testing for running in qunit
* Added `routeTo` for event-based transitions
* Prevent unnecessary re-rendering when only route context has changed
* Add test for visit helper in ngular testing
* Reduce the polling interval to make tests run much faster
* Update route-recognizer - Fixes #2559
* Revert "Use isNone to check tag name"
* Support for redirection from ApplicationRoute
* Improving Ngular.Select's null-content regresion test
* Prevent another exception on empty Ngular.Select.content
* prevent exception on empty Em.Select content
* deprecate the defaultContainer (see: http://git.io/EKPpnA)
* RSVP is now promise/a+ 1.1 compliant
* Fix test for setTimeout with negative wait for older IE
* Use `Function.prototype.apply` to call `setTimeout` on older IE
* Use Ngular.isNone
* Fixed view subclasses being instrumented as render.render.*
* Fixes #2526 - Updates JsFiddle and JsBin links for rc.3
* Add tests to deferred mixin
* Allow missing whitespace for assertion fot html text
* Fix incrementProperty/decrementProperty to be able to use with 0
* RSVP2
* Adds the ability to specify the view class used by the outlet Handlebars helper
* Make view helpers work with bindings
* get of property in false values should return undefined
* Really normalize hash params this time
* Normalize Ngular.Handlebars.helper hashes
* Fix bug with Ngular.Handlebars.helper
* Ngular.EventDispatcher is now container managed.
* typeInjection's public api is via injection
* App#reset now triggers a eventDispatcher teardown
* Added docs of ArrayContentDidChange for array
* Move linkTo docs to helper instead of LinkView
* Use tag name supported by html 4
* Fix to use `Ngular.ArrayPolyfills.forEach`
* Switch assertion for simulated Ngular.create
* document {{input}} and {{textarea}} helpers
* convert bools to flags so it is easier to add new ones
* Fix to use `Ngular.ArrayPolyfills.forEach` for IE8
* Skip Object.getOwnPropertyDescriptor only IE8
* Use stub `Object.create` for IE8
* Force downcase tag name for IE8
* rake release:gem + some cleanup
* Reduce late time to less than resolution capability of `setTimeout`
* Kepp timers order
* Adjust wait time to tick next run loop for more browsers
* additional Controller#needs documentation
* make use of Ngular.isNone explicit in Ngular.isEmpty
* Added API docs for 'needs' property of controller
* Use isNone to check tag name
* Added length property to Ngular.Map


### Ngular 1.0.0-rc.3 _(April 19, 2013)_

* fn.call is wasteful when the thisArg is not needed.
* dont needlessly close-over and rebuild insertViewCollection
* Don't apply href to LinkView that isn't using 'a' tag
* Documents {{linkTo}}
* Include ngular-testing in full build
* Use `jQuery.is(':disabled')` instead of `jQuery(':disbled').length` for Opera
* Remove assigned but unused variable
* Document run.scheduleOnce, truncate run.once docs. Fixes #2132.
* fix failing tests for outerHTML fallback
* don't rely on EXTEND_PROTOTYPES == true
* Fixes Ngular.EnumerableUtils without extend prototypes
* Do not flag .generateController for documentation.
* Do not build the docs for `.cacheable`. Fixes #2329.
* cleanup MutableEnumerable documentation
* Add Ngular.Application#removeTestHelpers
* Fix a couple issues
* First pass of work for the ngular-testing package
* Fixes error in documentation referring to non-existent 'Customizing Your Bindings' section
* Fix method comments
* Fix redirecting to child routes
* Fixes to MetamorphView's DOMManager replace
* Fixes #870 Lazy destruction + App#reset issues
* Eliminate unused variables
* Point to updated preconfigured starting points for JSFiddle/JSBin with latest Ngular build that is now being auto-posted to builds.github.com/mjc/ngular
* Fixes #2388: Added if statement to _resetSubControllers
* scope cached state transition hashes to the state manager class, so extending and mixins work with StateMangers as expected
* Fixes for upload of published builds.
* Update to latest ngular-dev so that publish task can work properly
* Configure Travis for automatic deploy to AWS
* Add missing item type
* Do no emit Ngular.alias deprecation warnings during alias tests
* add invokeRecursively to ViewCollection
* Failing test showing StateManagers using mixins to get some of their states have unexpected behavior
* Fix HistoryLocation rootURL handling and webkit workaround
* Remove unused argument from helper functions
* Use `toArray` to remove duplication
* Allow option view for Ngular.Select overwritable
* Actually make Ngular.alias() print deprecation warnings.
* use ``Ngular.String.fmt`` instead of String extension
* automatically upload all passing builds to s3
* [Fixes #2424] App#reset
* s/nexts/these (nexts is not a word)
* More verbose error message on failed linkTo routing attempts
* viewName is a property
* remove uneeded closures
* JSDoc should use {*} for mixed types instead of {anything} and {any}
* add an "includeSelf" parameter to "invokeRecursively"
* Fix ArrayController#length when content is not explicitly set
* Close #2043 - fix issue with removing last element in collection
* Stop application template from duplicating on re-render
* assertion to catch mixins being passed to Object.create
* Enhance Ngular.TargetActionSupport and introduce Ngular.ViewTargetActionSupport
* fix {{textarea}} assert message
* Test for unwatch methods on object length property
* Tests for watch methods on length properties
* Test for isWatching on length property of an object
* Move Ngular.typeOf to metal
* Fix array watching issue. Was affecting more than just plain arrays due to differences between typeOf and isArray.
* Remove mention of passing mixins to create.
* Revert "Fix Application#reset destroy issue"
* Fix view helper documentation and example to reflect context
* Ignore webkitStorageInfo during namespace lookup to avoid warning
* Fix Application#reset destroy issue
* Make Chrome initial popstate workaround account for rootURL
* Use a string instead of an array in RenderBuffer
* Convert a for in loop to a plain for loop
* Improve view container lookup performance
* remove uneeded asynchrony from Ngular.Deferred tests
* remove unneeded asynchrony from routing tests
* Add {{text area}}
* Default text input action to 'enter'
* Add {{input action="foo" on="keyPress"}}
* More metal cleanup
* Better organize ngular-metal and cache function lookups.
* remove sync from render to buffer
* make tests not depend on synchronous change events
* fix test not to expect synchronous observers
* Define Mixin properties in prototype
* Update ngular-dev gem to latest version
* Share empty arrays in Ngular.View prototype. Lazily slice it upon manipulation.
* Add views to Ngular.View.views upon insertion in DOM rather than on init. Fixes #1553
* Make object destruction async so we can reduce churn when destroying interconnected object graphs.
* Define Ngular.CoreObject#willDestroy. Fixes #1438.
* cleanup unneeded volatile()
* Match the transitionTo APIs.
* Avoid recursively calling transitionTo.
* Improve the performance of view notifications and transitions.
* Extract a private ViewCollection class to aid in manipulating several views at once.
* Add support for {{input type="checkbox"}}
* Add Ngular.Handlebars.helper
* Add {{input type="text"}}
* Insert adjacent child views in batches rather than individually.


### Ngular 1.0.0-rc.2 _(March 29, 2013)_

* Improved the App initialization process and deprecated Ngular.Application#initialize. If you were using this, use deferReadiness and advanceReadiness instead.
* Added support for Ngular.Application#then which fires similarly to the isReady hook
* Added more Ngular.computed macros
* Added readOnly flag for computed properties
* Enumerable#compact now removes undefined values
* Fixed issue with unregistering actions on virtual views
* Make Ngular.LinkView public
* Add support for jQuery 2.0
* Support browsers (FF 10 or less) that don't support domElement.outerHTML
* Made it easier to augment the Application's container's resolver
* Support tag as an alias for tagName in the {{view}} helper
* Add 'name' to attributeBinding for Ngular.TextField and Ngular.Select
* Return merged object from Ngular.merge
* Deprecate setting tagNames on Metamorphs - Refs #2248
* Avoid parent's implicit index route clobbering child's explicit index.
* App#reset behaves more closely to App#create
* Make Evented#on, #off, and #one chainable
* Add basic implementation of allowedKeys for the {{action}} helper
* Improved Ngular.Array#slice implementation
* Fix ArrayProxy arrangedObject handling - Fixes #2120, #2138
* Added ability to customize default generated controllers and routes
* Better HistoryLocation popstate handling - Fixes #2234
* Fix an issue with IE7
* Normalized Ngular.run.later and Ngular.run.next behavior.
* Fix issue where classNameBindings can try to update removed DOM element.
* Ngular.Array methods always return Ngular.Arrays
* RSVP is now exposed as Ngular.RSVP
* ObjectProxy does not attempt to proxy unknown properties on create
* Can now set ENV.LOG_VERSION to false to disable version logging
* Ngular.ArrayController#lastObject no longer raises when empty
* Fixes to {{render}} helper when used with model
* Improvements to {{linkTo}} controller handling
* Fix {{bindAttr}} when targeting prop in {{#each prop in array}} - #1523
* String#camelize lowercases the first letter
* Other miscellaneous bug fixes and documentation improvements


### Ngular 1.0.0-rc.1 _(February 15, 2013)_

* Upgrade to Handlebars 1.0.0-rc.3
* Update RSVP.js
* Update router.js
* Support 0 values for input tags
* Support for jQuery 1.9
* ArrayController now defaults to empty array
* Added Vagrant support for setting up a development environment
* Adds {{each itemController="..."}}
* Fix issues where route transitions would not register properly
* Initial support for Application#reset
* Fix handling of keywords in bind helpers
* Better handling of DOM properties
* Better handling of complex {{#if}} targets
* {{linkTo}} shouldn't change view context
* Router#send accepts multiple params
* Provide a view's template name for debugging
* Create activate and deactivate hooks for router
* {{action}} targets are now looked up lazily
* The model for Route#render is now bound
* Improvements to ContainerView
* Added 'pattern' attribute to text field for iOS.
* CollectionView context is now its content
* Various enhancements to bound helpers: adds multiple property support to bound helpers, adds bind-able options hash properties, adds {{unbound}} helper support to render unbound form of helpers.
* Add App.inject
* Add Ngular.EnumberableUtils.intersection
* Deprecate Controller#controllerFor in favour of Controller#needs
* Adds `bubbles` property to Ngular.TextField
* Allow overriding of Ngular.Router#handleURL
* Allow libraries loaded before Ngular to tie into Ngular load hooks
* Fixed behavior with Route#render and named outlets
* Fix bug where history location does not account for root URL
* Allow redirecting from mid-route
* Support string literals as param for {{linkTo}} and {{action}}
* Empty object proxies are no longer truthy in {{#if}}


### Ngular 1.0.0-pre.4 _(January 17, 2013)_

* Add {{partial}}
* Fix regressions in router.js
* Support jQuery 1.9.0
* Use the controller with the same name as the template passed to render, if it exists


### Ngular 1.0.0-pre.3 _(January 17, 2013)_

* BREAKING CHANGE: New Router API
* BREAKING CHANGE: `Ngular.Object.create` behaves like `setProperties`. Use `createWithMixins` for the old behavior.
* BREAKING CHANGE: No longer default a view's context to itself
* BREAKING CHANGE: Remove the nearest view computed properties
* Significant performance improvements
* Bound handlebars helpers with `registerBoundHelper`
* Ngular.String improvements
* TextSupport handles input, cut, and paste events
* Add `action` support to Ngular.TextField
* Warn about using production builds in localhost
* Update Metamorph
* Deprecate Ngular.alias in favour of Ngular.aliasMethod
* Add Ngular.computed.alias
* Allow chaining on DeferredMixin#then
* ArrayController learned itemControllerClass.
* Added VagrantFile and chef cookbooks to ease ngular build for developers.
* Provide an Ngular.Handlebars precompilation package
* Removed Tab controls
* Fix Chrome (pre v25) MutationObserver Memory Leak
* Update to Promises/A+ compatible RSVP
* Improved instrumentation
* Rename empty to isEmpty and none to isNone
* Added support for toStringExtension to augment toString
* Implement a default computed property setter.
* Add support for unhandledEvent to StateManager.
* Load external dependencies via an AMD shim
* Pass in the old value into the CP as a third argument
* Deep copy support for NativeArray
* Added an afterRender queue for scheduling code to run after the render queue has been drained
* Implement _super() for computed properties
* Miscellaneous bug fixes
* General cleanup


### Ngular 1.0.0-pre.2 _(October 25, 2012)_

* Ngular.SortableMixin: don't remove and reinsert items when their sort order doesn't change.  Fixes #1486.
* Fix edge cases with adding/removing observers
* Added 'disabled' attribute binding to Select
* Deprecate usage of {{collection}} without a class in favor of {{each}}
* Changing `Ngular.Handlebars.getPath` to `Ngular.Handlebars.get` for consistency. This addresses #1469.
* Since `$.uuid` was removed from jQuery master, we're switching to using `Ngular.uuid` instead.
* Add Ngular.View#nearestOfType, deprecate nearestInstanceOf
* Adds support for globbed routes
* Remove CP_DEFAULT_CACHEABLE flag
* Remove VIEW_PRESERVES_CONTEXT flag
* Replace willRerender with willClearRender
* Bumped jQuery requirement to 1.7.2+, explicitly forbidding 1.7 and 1.7.1 (see: #1448)
* Add Ngular.String.classify() to string extensions
* HistoryLocation now utilizes history.replaceState
* Add a basic instrumentation API
* Allow extension of chosen prototypes instead of the current all or none.
* Remove dependency on `window` throughout Ngular
* Don't attempt to concat a concatenatedProperty onto an object that doesn't have a concat method
* Remove ngular-views dependency from ngular-states
* Multiselect updates array content in place.
* Support applications without a router
* Add Ngular.Deferred mixin which implements promises using RSVP.js
* Fix for popstate firing on page load.
* Fixed bug in CP setter where observers could be suspended and never restored.
* Fixed a bug with setting computed properties that modify the passed in value.
* Initial work to allow operation with handlebars runtime only
* A listener registered with one can be removed with off
* Calling removeListener without method should remove all listeners
* Add autoinit flag to Application to call initialize on DOM ready.
* Create view for application template if no ApplicationView.
* Remove support for inline anonymous templates.
* Rename createRouter to setupRouter to make clear.
* Extract createRouter from Application#initialize
* Extract runInjections from Application#initialize
* Simplify syntax so we can extract more easily
* Extract createEventDispatcher from Application#init
* Update for Handlebars 1.0.rc.1
* Fix State.transitionTo to handle multiple contexts
* Cleanup classNameBindings on remove
* Support defining injections to occur after other injections
* Computed prop setter improvements
* fix :: syntax in classNameBindings to work with falsy values
* Fix Ngular.Error properties
* Improved error handling with Ngular.onerror
* Adds currentPath to Ngular.StateManager
* Provide default args to tryInvoke - fixes #1327
* Fix a bug in multi-selects with primitive options
* Fix formatURL to use rootURL and remove formatPath
* Fixing Ngular.Router.route when rootURL is used
* ContainerViews should invalidate `element` on children when rendering.
* Add test for selecting in multi selects with prompts
* Fix: Passing a regex to split in IE8 returns a single item array, causing class names beginning with a colon to fail to render in IE8.
* Adding itemViewClass attribute to the each helper.
* Reorganize load hooks to be more sane
* Improve application readiness framework
* Small restructuring of ArrayProxy
* Add #setObjects to mutable array. A helper for replacing whole content of the array with a new one.
* Fixed selecting items in ngular multi-selects
* Add disconnectOutlet method to controller
* The content property of an ArrayProxy instance should be defined before modifying it
* Adds a has() method to Ngular.OrderedSet
* Adds hooks for suspending observers
* Check that a controller inherits from Ngular.Object before instantiating it to the router.
* Support jQuery 1.8 - fixes #1267
* Ngular.empty returns true if empty Ngular.ArrayProxy
* add scheduleOnce and remove flag
* add various lifecycle tests to check updated ContainerView path. Expose problem with flag for scheduling one time.
* Moving location tests to routing package
* Make outlet a Metamorph view
* Tests showing problem with adding and replacing
* refactor ContainerView children rendering to not make assumptions at scheduling time, just at render time.
* Remove remaining references to viewstates
* Select element should initialize with the correct selectedIndex when using valueBinding
* Remove deprecated Ngular.ViewState.
* Handle undefined element in bindAttr and classNameBindings
* Render now uses context instead of _context
* Better version replacement regexp
* Outlets reference context instead of controller.
* Rakefile :clean remove 'tmp' folder
* Performance improvements


### Ngular 1.0.pre _(August 03, 2012)_

* Return undefined instead of empty jQuery object for Ngular.View#$ when not in DOM
* Adds didDefineProperty hook
* Implement immediateObserver placeholder in preparation for making observers asynchronous
* Change {{action}} API for more explicit contexts
* Add connectControllers convenience
* Assert that transitionTo at least matched a state
* Delay routing while contexts are loading
* Also rename trySetPath to trySet
* Replaced getPath/setPath with get/set
* Remove LEGACY_HANDLEBARS_TAG flag
* Add two new core methods to allow invoking possibly unknown methods on objects
* Change ternary syntax to double colon sytax
* Add tests for ternary operator in class bindings
* Test for defined Router lacking App(View|Controller)
* Allow alternate clicks for href handling - Fixes #1096
* Respect initialState when transitioning to parent of current state - Fixes #1144
* add reverseObjects
* Fixing rootURL when path is empty
* HistoryLocation appends paths to router rootURL
* Make Ngular.Logger support the 'info' and 'debug' methods on fallback (for IE8).
* Support currentView on init if ContainerView is created with one
* {{bindAttr class="this"}} now works; fixes #810
* Allow connectOutlet(outletName, name, context) syntax
* turn on mandatory setter for ngular-debug if not set
* Change the default setUnknownProperty to define it before setting.
* {{view}} now evaluates the context of class bindings using the same rules applied to other bindings
* dataTransfer property for drag and drop events
* require jQuery 1.7, no longer accept 1.6
* add mandatory setter assertion
* Add date comparison to Ngular.compare
* We use jquery event handling for hashchange/popstate
* Deprecate Ngular.Tabs - Fixes #409
* Remove data-tag-name "feature" from <script> tags
* Only register Ngular.View.views for non virtual views
* Add support for tabindex in Ngular Controls.
* Only push new history when initialURL has changed
* Support basic States inside of Routes
* Refactor context handling for States and Routes
* Make Map copyable
* Assert that path passed to urlFor is valid
* Do not run functions passed to Ngular.assert, Ngular.warn, and Ngular.deprecate
* Allowing developer to turn off verbose stacktrace in deprecation warnings
* Ngular.Route.serialize must return a hash
* lazy setup of ComputedProperties
* change convention from var m = meta(obj) to var meta = metaFor(obj)
* add hook for desc for willWatch and didUnwatch
* Call transitionEvent for each nested state - Fixes #977
* Define a 'store' property in ControllerMixin, to avoid proxy-like handling at router initialization (controllers store injection).
* if there is no context, allow for views without controllers
* Add MapWithDefault
* serialize route states recursively
* urlForEvent for a route with a dynamic part doesn't serialize the context
* Don't stopPropagation on action handling by default
* Implement a route's navigateAway event
* Change app.stateManager to app.router
* Allow a one-time event listener on Ngular.Evented
* Rename `fire` to `trigger`
* change sendEvent signature from sendEvent(obj, name, …) to sendEvent(obj, name, params) to avoid copying the arguments. Conflicts:
* Deprecate Ngular.ViewState
* remove Ngular.MixinDelegate
* Call preventDefault on events handled through {{action}}
* Call transitionEvent on initialStates as well as targeted state
* During apply not applyPartial, chains maybe setup, this makes sure they are updated.
* allow computed properties to be overridden
* Change connectOutlet API to prefer Strings
* Fix bug with Ngular.Router#route not reflecting redirections in location
* Give Ngular.Select prompt an empty value
* Create Ngular.ArrayPolyfills
* Rename ArrayUtils to EnumerableUtils
* Use transitionTo rather than goToState
* Improve ArrayUtils by removing unnecessary slices
* Use evented system for dom events on views
* Fix switchToUnwatched so ObjectProxy tests pass.
* Skip mixin properties with undefined values
* Make defineProperty override native properties
* Fix unsupported method errors in older browsers
* Improved Ngular.create shim
* Can't use lib/ngular.js because we use that for precompiling, so let's use dist/distold instead
* Use `getPath` instead of `get` in computed macros in order to allow 'foo.bar' dependencies
* A route's `serialize` should handle null contexts
* Router.location cannot be null or undefined
* Use 'hash' as default location implementation on Router
* Clean up location stubbing in routable_test
* Instantiate Ngular.Location implementation from Router
* Add NoneLocation
* Add options hash syntax to connectOutlet.
* Added 'ngular-select' CSS class to Ngular.Select, as per the convention with other included views.
* Fix Ngular.setPath when used on Ngular.Namespaces
* Remove async transitions.
* Enumerate all properties per injection.
* Injections can specify the order they are run.
* Make sortable test deterministic
* Improve invalidation of view's controller prop
* Cleaning up in history location
* Removing lastSetURL from setURL
* Fix bug with computed properties setters not triggering observers when called with a previous value
* Fix failing test
* Adding popstate tests for history based location
* Splitting location implementations from Location
* Use accessors for eventTransitions
* Finish implementation of Sortable mixin
* Move sorting into separate mixin
* Crude sorting on ArrayController
* Split ArrayProxy into content and arrangedContent
* Fix broken upload_latest task by specifying version for github_api
* Add some convenience computed property macros to replace the major usages of binding transforms
* Initial pushState based location implementation
* Support #each foo in this and #with this as bar
* `collection` should take emptyViewClass as string
* Don't update the route if we're routing
* Don't special-case the top-level '/'
* Make routing unwind properly
* Replace occurrences of goToState with transitionTo.
* No longer support RunLoop instantiation without `new`.
* Improve naming and code style
* Guard mergeMixins parameters more generally
* Guard against implicit function application by Ngular.assert
* Use Ngular.assert instead of throw
* Guard against undefined mixins
* Remove unused local variables
* Update gems
* Enable selection by value in Ngular.Select.
* Update build URL
* Fix issue with Ngular.Select when reselecting the prompt
* Call setupStateManager in initialize, not in didBecomeReady
* Let ES5 browsers actually work
* Lookup event transitions recursively in the ancestor states.
* Support global paths in the with/as helper. Fixes #874
* Views should inherit controllers from their parent
* Semi-hackish memory management for Ngular.Application
* Transition to root to enable the back-button
* Insert ApplicationView by default
* Respect href parameter for {{action}}
* Allow setting `target` on `ObjectController`
* Remove deprecated functionality from get/set
* urlFor should raise an error when route property is not defined
* fix build by checking VIEW_PRESERVES_CONTEXT
* Only call formatURL if a location is defined
* URL generation takes into account location type
* Rename templateContext to context
* Change default template context to controller
* Removes deprecated label wrapping behavior and value property of Ngular.Checkbox
* ControllerObject class can be initialized with target, controllers and view properties
* Add Ngular.State.transitionTo
* Wire up {{action}} to emit URLs
* Use standard StateManager send/sendRecursively and convert state method arguments to include options hash when necessary.
* Correct state transition name to reflect StateMachine state nesting.
* Add urlFor to Router
* make transitionEvent on state manager configurable
* The router's initialState is `root`
* Add redirectsTo in routes
* Make identical assertion messages distinguishable
* Check that tests don't leave open RunLoops behind
* Better Handlebars log helper
* Disallow automatic creating of RunLoops during testing; Require manual Ngular.run setup.
* ObjectController
* rename location `style` to `implementation` and add `registerImplementation` method to ease custom implementations
* some sugar for Router initialization
* Fix initialization with non routable stateManager
* bindAttr should work with global paths
* Unbundled Handlebars
* Add Ngular.Controller and `connectOutlet`
* Initial implementation of outlets
* Implement modelType guessing.
* Add support for modelType in the router


### Ngular 0.9.8.1 _(May 22, 2012)_

* Fix bindAttr with global paths
* Fix initialization with non routable stateManager
* Better jQuery warning message
* Documentation fixes


### Ngular 0.9.8 _(May 21, 2012)_

* Better docs
* Preliminary routing support
* Properly handle null content in Ngular.Select - fixes #775
* Allow a context to be passed to the action helper
* Notify parentView of childView changes for virtual views
* Extract Ngular.Application into a separate package
* Better console handling
* Removed warnings about element not being present in willInsertElement
* Removed old deprecated RunLoop syntax
* Add support for "input" event handlers
* Removed deprecated getPath/setPath global support, deprecated star paths
* Removed Ngular.Set.create with enumerable
* Add Ngular.Binding.registerTransform
* States should create a childStates array
* Always send Array#contentWillChange with contentDidChange
* Updated Metamorph - fixes #783
* Re-enable enumerable properties: [], firstObject and lastObject
* Add support for #each foo in bar
* Implement {{#with foo as bar}} syntax
* Fixed ordering of MutableArray#unshiftObjects
* Fix Em namespace in dev mode
* Add currentView property to Ngular.ContainerView
* Namespace debugging functions, ngular_assert, ngular_deprecate, and ngular_warn are now Ngular.assert, Ngular.deprecate, and Ngular.warn.
* Rename BindableSpanView -> HandlebarsBoundView
* Updated Handlebars to 1.0.0.beta.6
* Ngular.cacheFor should return falsy values
* Handlebars actions use a stateManager by default
* Bindings should connect to `this` and not the prototype.
* Fix security error w/ Opera and Frames - fixes #734
* Warn when attempting to appendTo or replaceIn with an existing Ngular.View
* Change the context in which {{view}} renders
* Improve error when sending an unimplemented event
* Change didInsertElement function to event callback - fixes #740
* Precompile defaultTemplates for production builds
* Updated uglifier - fixes #733
* Improved the testing stack
* Using the colon syntax with classBinding should allow truthy values to propagate the associated class
* Add safeHtml method to String
* Improved compatibility with Handlebars.SafeString
* Deprecate Ngular.Button - closes #436
* Refactor ngular-states/view_states out into ngular-viewstates so that states is free of ngular-views dependency.
* Prevent classNames from being displayed twice
* Added ComputedProperty#volatile to turn off caching
* Support making Computed Properties cacheable by default


### Ngular 0.9.7.1 _(April 19, 2012)_

* Better escaping method for RenderBuffer
* More rigorous XSS escaping from bindAttr


### Ngular 0.9.7 _(April 18, 2012)_

* RenderBuffer now properly escapes attribute values. Fixes XSS vulnerability documented in #699.
* Make options an optional argument to Ngular.Handlebars.getPath
* getProperties can be called with an array of property names
* Allow for jQuery prereleases and RCs - fixes #678
* Raise if both template and templateName appear
* DRY up createChildView initialization
* Ngular.ContainerView should propagate template data
* allows yielded template blocks to be optional
* Fixed substate/parentState test
* Inline views should always have an id - Fixes #655
* Ngular.View should not require view method sharing event name.
* Refactor and cleanup Ngular.Checkbox
* Normalize keyword paths so that observers work
* Expose view and controller keywords to templates
* Ngular.Select allows array selections when multiple=false.
* Ngular.ArrayUtils.objectsAt returns correct objects.


### Ngular 0.9.6 _(March 30, 2012)_

* Significant internal performance improvements
* Improved performance of RenderBuffer
* Avoid unneceesary ping-ponging in binding updates
* Fix infinite loop caused by jQuery.extend with array in older browsers
* Added ENV.SHIM_ES5 option to improve compatibility with Prototype.js
* Added Ngular.Evented mixin for internal events
* Removed YES and NO constants
* No longer alias as SC/Sproutcore
* Deprecate lowercase Namespaces
* Improved "destroy" method and added "willDestroy" and "didDestroy" callbacks
* Support static classes in bindAttr
* Allow 'this' to be used in bindAttr
* Make sure States are exited in the proper order
* Deprecate re-rendering while view is inBuffer
* Add contextmenu event support
* {{action}} helper event includes view and context
* Simplified parameters passed by {{action}} helper to StateManager
* Allow the {{action}} helper to use "send" as the action name
* Collection itemViewClass itemHash bindings should be resolved in the proper context.
* Honor emptyViewClass attribute in collection view helper
* Allow View attributeBindings to be aliased.
* Add Ngular.getWithDefault
* Add Ngular.computed(key1, key2, func)
* Add Ngular.Map
* Improvements to OrderedSet
* Warn if classNames or classNameBindings is set to non-array
* Warn when setting attributeBindings or classNameBindings with {{view}} helper
* Warn if user tries to change a view's elementId after creation
* Remove contained items from Ngular.Set when calling #clear
* Treat classNameBindings the same as classBinding in the view helper
* Added maxlength to TextSupport; added size to TextField; added rows and cols to TextArea
* Fix bug where DOM did not update when Ngular.Select content changed
* Dereference views from parent when viewName is specified and the view is destroyed
* Added "clear" method to Ngular.MutableArray
* Added Ngular.cacheFor to peek at computed property cache
* Added support for multiple attributes to Ngular.Select
* Fix security warning in older Firefox
* Re-render views if the templateContext is changed
* More sugar for creating complex bindings
* Fixed bug where a class could not be reopened if an instance of it had already been created
* Enable unnamed Handlebars script tags to have a custom id with the `data-element-id` attribute
* Testing improvements including headless tests (rake test) and JSHint
* Improved framework build process
* API documentation improvements
* Added benchmarking harness for internals


### Ngular 0.9.5 _(February 17, 2012)_

* Add Handlebars helper for {{yield}}
* Add a .jshintrc
* Add layout support to Ngular.View
* Allow state managers to control their own logging
* Print more useful debug information in state manager
* Fix issues that prevented Ngular from being used in iframes
* Fix path resolution for states
* State manager should raise if an event is unhandled
* Attribute Bindings should handle String objects - Fixes #497
* Fixed each/else - fixes #389
* Updated Metamorph - fixes #449
* States hashes misbehave when including classes
* The action helper should prevent default behavior on it's attached element
* Pass the event, view, and context to {{action}} helper actions
* #454 State Exit Methods Should Be Called In Reverse Order
* #454 test StateManager should send exit events in the correct order when changing to a top-level state
* Retrieve child views length after potential mutations
* Metamorph's replace now recursively invalidates childView elements
* Fixes a bug where parent views were not being set correctly when multiple views were added or removed from ContainerView
* Views removed from a container should clear rendered children.
* ContainerView should set parentView on new children
* Add state manager compatibility to action helper
* Adds ability to save metadata for computed properties
* Don't parse text/html by default. Use ENV.LEGACY_HANDLEBARS_TAG to restore this functionality. - Fixes #441
* Fix overzealous deprecation warnings
* Fix bug such that initialState *and* start states will be entered
* Miscellaneous documentation improvements
* Better framework warnings and deprecations


### Ngular 0.9.4 _(January 23, 2012)_

* Add Ngular.Select control
* Added Ngular.Handlebars action helper to easily add event handling to DOM elements without requiring a new view
* jQuery 1.7 compatibility
* Added a runtime build target for usage with Node.js
* Instantiate a ViewState's view if it's not already an instance
* In addition to having a rootElement, state managers can now have a rootView property. If this is set, view states will append their view as a child view of that view.
* Views now register themselves with a controller if the viewController property is set
* Other miscellaneous improvements to States
* Allows setting a custom initial substate on states
* ContainerView now sets the parentView property of views that are added to its childViews array.
* Removed ngular-handlebars-format, ngular-datetime
* Array's [] property no longer notifies of changes. Use @each instead.
* Deprecated getPath/setPath global support
* Ngular.Application's default rootElement has changed from document to document.body
* Events are no longer passed to views that are not in the DOM
* Miscellaneous improvements to Ngular.Button
* Add return value to Ngular.TargetActionSupport.triggerAction()
* Added Ngular.Handlebars.precompile for template precompilation
* Fix security exceptions in older versions of Firefox
* Introduce Ngular.onerror for improved error handling
* Make {{this}} work with numbers within an #each helper
* Textfield and textarea now bubble events by default
* Fixed issue where Handlebars helpers without arguments were interpreted as bindings
* Add callbacks for isVisible changes to Ngular.View
* Fix unbound helper when used with {{this}}
* Add underscore and camelize to string prototype extensions.
* View tagName is now settable from Handlebars <script> template via data-tag-name
* Miscellaneous performance improvements
* Lots of minor bug fixes
* Inline documentation improvements


### Ngular 0.9.3 _(Decngular 19, 2011)_

* Make sure willInsertElement actually gets called on all child views. Element is still not guaranteed to work.
* Implement tab views and controller
* Fixed some parse errors and jslint warnings
* allow use of multiple {{bindAttr}}s per element


### Ngular 0.9.2 _(Decngular 16, 2011)_

* add replaceIn to replace an entire node's content with something new
* Use prepend() and after() methods of Metamorph
* Update Metamorph to include after() and prepend()
* Fixed some missing commas which prevented bpm from working
* Safer Runloop Unwinding
* Adding support for <script type="text/x-raw-handlebars">
* Remove parentView deprecation warning


### Ngular 0.9.1 _(Decngular 14, 2011)_

* Fix jslint warnings related to missing semicolons and variables defined twice
* Alias amber_assert to sc_assert for backwards compat
* Fix toString() for objects in the Ngular namespace
* Clear rendered children *recursively* when removing a view from DOM.
* Manually assigns custom message provided new Ngular.Error so it will appear in debugging tools.
* Add a currentView property to StateManager
* Duck type view states
* Add license file
* We don't need to support adding Array observers onto @each proxies, so don't bother notifying about them.
* Clean up some verbiage in watching.js
* Cleaned up the build script
* Fixed incorrect test
* Updated references to SproutCore to Ngular
* Preserve old behavior for special '@each' keys.
* Making chained keys evaluate lazily and adding unit test
* Adding unit test to demonstrate issue #108.
