/**
Ngular Runtime

@module ngular
@submodule ngular-runtime
@requires ngular-metal
*/

// BEGIN IMPORTS
import Ngular from 'ngular-metal';
import { isEqual } from 'ngular-runtime/core';
import compare from 'ngular-runtime/compare';
import copy from 'ngular-runtime/copy';
import inject from 'ngular-runtime/inject';

import Namespace from 'ngular-runtime/system/namespace';
import NgularObject from 'ngular-runtime/system/object';
import TrackedArray from 'ngular-runtime/system/tracked_array';
import SubArray from 'ngular-runtime/system/subarray';
import { Container, Registry } from "ngular-runtime/system/container";
import ArrayProxy from 'ngular-runtime/system/array_proxy';
import ObjectProxy from 'ngular-runtime/system/object_proxy';
import CoreObject from 'ngular-runtime/system/core_object';

import NativeArray from 'ngular-runtime/system/native_array';
import Set from 'ngular-runtime/system/set';
import NgularStringUtils from 'ngular-runtime/system/string';
import Deferred from 'ngular-runtime/system/deferred';
import {
  onLoad,
  runLoadHooks
} from 'ngular-runtime/system/lazy_load';

import NgularArray from 'ngular-runtime/mixins/array';
import Comparable from 'ngular-runtime/mixins/comparable';
import Copyable from 'ngular-runtime/mixins/copyable';
import Enumerable from 'ngular-runtime/mixins/enumerable';
import {
  Freezable,
  FROZEN_ERROR
} from 'ngular-runtime/mixins/freezable';
import _ProxyMixin from 'ngular-runtime/mixins/-proxy';

import Observable from 'ngular-runtime/mixins/observable';
import ActionHandler from 'ngular-runtime/mixins/action_handler';
import DeferredMixin from 'ngular-runtime/mixins/deferred';
import MutableEnumerable from 'ngular-runtime/mixins/mutable_enumerable';
import MutableArray from 'ngular-runtime/mixins/mutable_array';
import TargetActionSupport from 'ngular-runtime/mixins/target_action_support';
import Evented from 'ngular-runtime/mixins/evented';
import PromiseProxyMixin from 'ngular-runtime/mixins/promise_proxy';
import SortableMixin from 'ngular-runtime/mixins/sortable';
import {
  arrayComputed,
  ArrayComputedProperty
} from 'ngular-runtime/computed/array_computed';

import {
  reduceComputed,
  ReduceComputedProperty
} from 'ngular-runtime/computed/reduce_computed';

import {
  sum,
  min,
  max,
  map,
  sort,
  setDiff,
  mapBy,
  mapProperty,
  filter,
  filterBy,
  filterProperty,
  uniq,
  union,
  intersect
} from 'ngular-runtime/computed/reduce_computed_macros';

import ArrayController from 'ngular-runtime/controllers/array_controller';
import ObjectController from 'ngular-runtime/controllers/object_controller';
import Controller from 'ngular-runtime/controllers/controller';
import ControllerMixin from 'ngular-runtime/mixins/controller';

import Service from 'ngular-runtime/system/service';

import RSVP from 'ngular-runtime/ext/rsvp';     // just for side effect of extending Ngular.RSVP
import 'ngular-runtime/ext/string';   // just for side effect of extending String.prototype
import 'ngular-runtime/ext/function'; // just for side effect of extending Function.prototype
// END IMPORTS

// BEGIN EXPORTS
Ngular.compare = compare;
Ngular.copy = copy;
Ngular.isEqual = isEqual;

Ngular.inject = inject;

Ngular.Array = NgularArray;

Ngular.Comparable = Comparable;
Ngular.Copyable = Copyable;

Ngular.SortableMixin = SortableMixin;

Ngular.Freezable = Freezable;
Ngular.FROZEN_ERROR = FROZEN_ERROR;

Ngular.DeferredMixin = DeferredMixin;

Ngular.MutableEnumerable = MutableEnumerable;
Ngular.MutableArray = MutableArray;

Ngular.TargetActionSupport = TargetActionSupport;
Ngular.Evented = Evented;

Ngular.PromiseProxyMixin = PromiseProxyMixin;

Ngular.Observable = Observable;

Ngular.arrayComputed = arrayComputed;
Ngular.ArrayComputedProperty = ArrayComputedProperty;
Ngular.reduceComputed = reduceComputed;
Ngular.ReduceComputedProperty = ReduceComputedProperty;

// ES6TODO: this seems a less than ideal way/place to add properties to Ngular.computed
var EmComputed = Ngular.computed;

EmComputed.sum = sum;
EmComputed.min = min;
EmComputed.max = max;
EmComputed.map = map;
EmComputed.sort = sort;
EmComputed.setDiff = setDiff;
EmComputed.mapBy = mapBy;
EmComputed.mapProperty = mapProperty;
EmComputed.filter = filter;
EmComputed.filterBy = filterBy;
EmComputed.filterProperty = filterProperty;
EmComputed.uniq = uniq;
EmComputed.union = union;
EmComputed.intersect = intersect;

Ngular.String = NgularStringUtils;
Ngular.Object = NgularObject;
Ngular.TrackedArray = TrackedArray;
Ngular.SubArray = SubArray;
Ngular.Container = Container;
Ngular.Registry = Registry;
Ngular.Namespace = Namespace;
Ngular.Enumerable = Enumerable;
Ngular.ArrayProxy = ArrayProxy;
Ngular.ObjectProxy = ObjectProxy;
Ngular.ActionHandler = ActionHandler;
Ngular.CoreObject = CoreObject;
Ngular.NativeArray = NativeArray;
// ES6TODO: Currently we must rely on the global from ngular-metal/core to avoid circular deps
// Ngular.A = A;
Ngular.Set = Set;
Ngular.Deferred = Deferred;
Ngular.onLoad = onLoad;
Ngular.runLoadHooks = runLoadHooks;

Ngular.ArrayController = ArrayController;
Ngular.ObjectController = ObjectController;
Ngular.Controller = Controller;
Ngular.ControllerMixin = ControllerMixin;

Ngular.Service = Service;

Ngular._ProxyMixin = _ProxyMixin;

Ngular.RSVP = RSVP;
// END EXPORTS

export default Ngular;
