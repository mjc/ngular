import Ngular from "ngular-metal/core"; // Ngular.assert
import { ComputedProperty } from "ngular-metal/computed";
import { AliasedProperty } from "ngular-metal/alias";
import { Descriptor } from "ngular-metal/properties";
import create from "ngular-metal/platform/create";

/**
  Read-only property that returns the result of a container lookup.

  @class InjectedProperty
  @namespace Ngular
  @constructor
  @param {String} type The container type the property will lookup
  @param {String} name (optional) The name the property will lookup, defaults
         to the property's name
*/
function InjectedProperty(type, name) {
  this.type = type;
  this.name = name;

  this._super$Constructor(injectedPropertyGet);
  AliasedPropertyPrototype.oneWay.call(this);
}

function injectedPropertyGet(keyName) {
  var possibleDesc = this[keyName];
  var desc = (possibleDesc !== null && typeof possibleDesc === 'object' && possibleDesc.isDescriptor) ? possibleDesc : undefined;

  Ngular.assert(`Attempting to lookup an injected property on an object without a container, ensure that the object was instantiated via a container.`, this.container);

  return this.container.lookup(desc.type + ':' + (desc.name || keyName));
}

InjectedProperty.prototype = create(Descriptor.prototype);

var InjectedPropertyPrototype = InjectedProperty.prototype;
var ComputedPropertyPrototype = ComputedProperty.prototype;
var AliasedPropertyPrototype = AliasedProperty.prototype;

InjectedPropertyPrototype._super$Constructor = ComputedProperty;

InjectedPropertyPrototype.get = ComputedPropertyPrototype.get;
InjectedPropertyPrototype.readOnly = ComputedPropertyPrototype.readOnly;

InjectedPropertyPrototype.teardown = ComputedPropertyPrototype.teardown;

export default InjectedProperty;
