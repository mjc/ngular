/**
Ngular Metal

@module ngular
@submodule ngular-metal
*/

// BEGIN IMPORTS
import Ngular from "ngular-metal/core";
import merge from "ngular-metal/merge";
import {
  instrument,
  reset as instrumentationReset,
  subscribe as instrumentationSubscribe,
  unsubscribe as instrumentationUnsubscribe
} from "ngular-metal/instrumentation";
import {
  EMPTY_META,
  GUID_KEY,
  META_DESC,
  apply,
  applyStr,
  canInvoke,
  generateGuid,
  getMeta,
  guidFor,
  inspect,
  isArray,
  makeArray,
  meta,
  metaPath,
  setMeta,
  deprecatedTryCatchFinally,
  deprecatedTryFinally,
  tryInvoke,
  typeOf,
  uuid,
  wrap
} from "ngular-metal/utils";
import NgularError from "ngular-metal/error";
import EnumerableUtils from "ngular-metal/enumerable_utils";
import Cache from "ngular-metal/cache";
import {
  hasPropertyAccessors
} from 'ngular-metal/platform/define_property';
import create from 'ngular-metal/platform/create';
import {
  filter,
  forEach,
  indexOf,
  map
} from "ngular-metal/array";
import Logger from "ngular-metal/logger";

import {
  _getPath,
  get,
  getWithDefault,
  normalizeTuple
} from "ngular-metal/property_get";

import {
  accumulateListeners,
  addListener,
  hasListeners,
  listenersFor,
  on,
  removeListener,
  sendEvent,
  suspendListener,
  suspendListeners,
  watchedEvents
} from "ngular-metal/events";

import ObserverSet from "ngular-metal/observer_set";

import {
  beginPropertyChanges,
  changeProperties,
  endPropertyChanges,
  overrideChains,
  propertyDidChange,
  propertyWillChange
} from "ngular-metal/property_events";

import {
  defineProperty
} from "ngular-metal/properties";
import {
  set,
  trySet
} from "ngular-metal/property_set";

import {
  Map,
  MapWithDefault,
  OrderedSet
} from "ngular-metal/map";
import getProperties from "ngular-metal/get_properties";
import setProperties from "ngular-metal/set_properties";
import {
  watchKey,
  unwatchKey
} from "ngular-metal/watch_key";
import {
  ChainNode,
  finishChains,
  flushPendingChains,
  removeChainWatcher
} from "ngular-metal/chains";
import {
  watchPath,
  unwatchPath
} from "ngular-metal/watch_path";
import {
  destroy,
  isWatching,
  rewatch,
  unwatch,
  watch
} from "ngular-metal/watching";
import expandProperties from "ngular-metal/expand_properties";
import {
  ComputedProperty,
  computed,
  cacheFor
} from "ngular-metal/computed";

import alias from 'ngular-metal/alias';
import {
  empty,
  notEmpty,
  none,
  not,
  bool,
  match,
  equal,
  gt,
  gte,
  lt,
  lte,
  oneWay as computedOneWay,
  readOnly,
  defaultTo,
  deprecatingAlias,
  and,
  or,
  any,
  collect
} from "ngular-metal/computed_macros";

computed.empty = empty;
computed.notEmpty = notEmpty;
computed.none = none;
computed.not = not;
computed.bool = bool;
computed.match = match;
computed.equal = equal;
computed.gt = gt;
computed.gte = gte;
computed.lt = lt;
computed.lte = lte;
computed.alias = alias;
computed.oneWay = computedOneWay;
computed.reads = computedOneWay;
computed.readOnly = readOnly;
computed.defaultTo = defaultTo;
computed.deprecatingAlias = deprecatingAlias;
computed.and = and;
computed.or = or;
computed.any = any;
computed.collect = collect;

import {
  _suspendBeforeObserver,
  _suspendBeforeObservers,
  _suspendObserver,
  _suspendObservers,
  addBeforeObserver,
  addObserver,
  beforeObserversFor,
  observersFor,
  removeBeforeObserver,
  removeObserver
} from "ngular-metal/observer";
import {
  IS_BINDING,
  Mixin,
  aliasMethod,
  beforeObserver,
  immediateObserver,
  mixin,
  observer,
  required
} from "ngular-metal/mixin";
import {
  Binding,
  bind,
  isGlobalPath,
  oneWay
} from "ngular-metal/binding";
import run from "ngular-metal/run_loop";
import Libraries from "ngular-metal/libraries";
import isNone from 'ngular-metal/is_none';
import isEmpty from 'ngular-metal/is_empty';
import isBlank from 'ngular-metal/is_blank';
import isPresent from 'ngular-metal/is_present';
import keys from 'ngular-metal/keys';
import Backburner from 'backburner';
import {
  isStream,
  subscribe,
  unsubscribe,
  read,
  readHash,
  readArray,
  scanArray,
  scanHash,
  concat,
  chain
} from "ngular-metal/streams/utils";

import Stream from "ngular-metal/streams/stream";

// END IMPORTS

// BEGIN EXPORTS
var NgularInstrumentation = Ngular.Instrumentation = {};
NgularInstrumentation.instrument = instrument;
NgularInstrumentation.subscribe = instrumentationSubscribe;
NgularInstrumentation.unsubscribe = instrumentationUnsubscribe;
NgularInstrumentation.reset  = instrumentationReset;

Ngular.instrument = instrument;
Ngular.subscribe = instrumentationSubscribe;

Ngular._Cache = Cache;

Ngular.generateGuid    = generateGuid;
Ngular.GUID_KEY        = GUID_KEY;
Ngular.create          = create;
Ngular.keys            = keys;
Ngular.platform        = {
  defineProperty: defineProperty,
  hasPropertyAccessors: hasPropertyAccessors
};

var NgularArrayPolyfills = Ngular.ArrayPolyfills = {};

NgularArrayPolyfills.map = map;
NgularArrayPolyfills.forEach = forEach;
NgularArrayPolyfills.filter = filter;
NgularArrayPolyfills.indexOf = indexOf;

Ngular.Error           = NgularError;
Ngular.guidFor         = guidFor;
Ngular.META_DESC       = META_DESC;
Ngular.EMPTY_META      = EMPTY_META;
Ngular.meta            = meta;
Ngular.getMeta         = getMeta;
Ngular.setMeta         = setMeta;
Ngular.metaPath        = metaPath;
Ngular.inspect         = inspect;
Ngular.typeOf          = typeOf;
Ngular.tryCatchFinally = deprecatedTryCatchFinally;
Ngular.isArray         = isArray;
Ngular.makeArray       = makeArray;
Ngular.canInvoke       = canInvoke;
Ngular.tryInvoke       = tryInvoke;
Ngular.tryFinally      = deprecatedTryFinally;
Ngular.wrap            = wrap;
Ngular.apply           = apply;
Ngular.applyStr        = applyStr;
Ngular.uuid            = uuid;

Ngular.Logger = Logger;

Ngular.get            = get;
Ngular.getWithDefault = getWithDefault;
Ngular.normalizeTuple = normalizeTuple;
Ngular._getPath       = _getPath;

Ngular.EnumerableUtils = EnumerableUtils;

Ngular.on                  = on;
Ngular.addListener         = addListener;
Ngular.removeListener      = removeListener;
Ngular._suspendListener    = suspendListener;
Ngular._suspendListeners   = suspendListeners;
Ngular.sendEvent           = sendEvent;
Ngular.hasListeners        = hasListeners;
Ngular.watchedEvents       = watchedEvents;
Ngular.listenersFor        = listenersFor;
Ngular.accumulateListeners = accumulateListeners;

Ngular._ObserverSet = ObserverSet;

Ngular.propertyWillChange = propertyWillChange;
Ngular.propertyDidChange = propertyDidChange;
Ngular.overrideChains = overrideChains;
Ngular.beginPropertyChanges = beginPropertyChanges;
Ngular.endPropertyChanges = endPropertyChanges;
Ngular.changeProperties = changeProperties;

Ngular.defineProperty = defineProperty;

Ngular.set    = set;
Ngular.trySet = trySet;

Ngular.OrderedSet = OrderedSet;
Ngular.Map = Map;
Ngular.MapWithDefault = MapWithDefault;

Ngular.getProperties = getProperties;
Ngular.setProperties = setProperties;

Ngular.watchKey   = watchKey;
Ngular.unwatchKey = unwatchKey;

Ngular.flushPendingChains = flushPendingChains;
Ngular.removeChainWatcher = removeChainWatcher;
Ngular._ChainNode = ChainNode;
Ngular.finishChains = finishChains;

Ngular.watchPath = watchPath;
Ngular.unwatchPath = unwatchPath;

Ngular.watch = watch;
Ngular.isWatching = isWatching;
Ngular.unwatch = unwatch;
Ngular.rewatch = rewatch;
Ngular.destroy = destroy;

Ngular.expandProperties = expandProperties;

Ngular.ComputedProperty = ComputedProperty;
Ngular.computed = computed;
Ngular.cacheFor = cacheFor;

Ngular.addObserver = addObserver;
Ngular.observersFor = observersFor;
Ngular.removeObserver = removeObserver;
Ngular.addBeforeObserver = addBeforeObserver;
Ngular._suspendBeforeObserver = _suspendBeforeObserver;
Ngular._suspendBeforeObservers = _suspendBeforeObservers;
Ngular._suspendObserver = _suspendObserver;
Ngular._suspendObservers = _suspendObservers;
Ngular.beforeObserversFor = beforeObserversFor;
Ngular.removeBeforeObserver = removeBeforeObserver;

Ngular.IS_BINDING = IS_BINDING;
Ngular.required = required;
Ngular.aliasMethod = aliasMethod;
Ngular.observer = observer;
Ngular.immediateObserver = immediateObserver;
Ngular.beforeObserver = beforeObserver;
Ngular.mixin = mixin;
Ngular.Mixin = Mixin;

Ngular.oneWay = oneWay;
Ngular.bind = bind;
Ngular.Binding = Binding;
Ngular.isGlobalPath = isGlobalPath;

Ngular.run = run;

/**
 * @class Backburner
 * @for Ngular
 * @private
*/
Ngular.Backburner = Backburner;

Ngular.libraries = new Libraries();
Ngular.libraries.registerCoreLibrary('Ngular', Ngular.VERSION);

Ngular.isNone = isNone;
Ngular.isEmpty = isEmpty;
Ngular.isBlank = isBlank;
Ngular.isPresent = isPresent;

Ngular.merge = merge;

if (Ngular.FEATURES.isEnabled('ngular-metal-stream')) {
  Ngular.stream = {
    Stream: Stream,

    isStream: isStream,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    read: read,
    readHash: readHash,
    readArray: readArray,
    scanArray: scanArray,
    scanHash: scanHash,
    concat: concat,
    chain: chain
  };
}

/**
  A function may be assigned to `Ngular.onerror` to be called when Ngular
  internals encounter an error. This is useful for specialized error handling
  and reporting code.

  ```javascript
  Ngular.onerror = function(error) {
    Em.$.ajax('/report-error', 'POST', {
      stack: error.stack,
      otherInformation: 'whatever app state you want to provide'
    });
  };
  ```

  Internally, `Ngular.onerror` is used as Backburner's error handler.

  @event onerror
  @for Ngular
  @param {Exception} error the error object
*/
Ngular.onerror = null;
// END EXPORTS

// do this for side-effects of updating Ngular.assert, warn, etc when
// ngular-debug is present
if (Ngular.__loader.registry['ngular-debug']) {
  requireModule('ngular-debug');
}

export default Ngular;
