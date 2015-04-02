import { changeProperties } from "ngular-metal/property_events";
import { set } from "ngular-metal/property_set";
import keys from "ngular-metal/keys";

/**
  Set a list of properties on an object. These properties are set inside
  a single `beginPropertyChanges` and `endPropertyChanges` batch, so
  observers will be buffered.

  ```javascript
  var anObject = Ngular.Object.create();

  anObject.setProperties({
    firstName: 'Stanley',
    lastName: 'Stuart',
    age: 21
  });
  ```

  @method setProperties
  @param obj
  @param {Object} properties
  @return obj
*/
export default function setProperties(obj, properties) {
  if (!properties || typeof properties !== "object") { return obj; }
  changeProperties(function() {
    var props = keys(properties);
    var propertyName;

    for (var i = 0, l = props.length; i < l; i++) {
      propertyName = props[i];

      set(obj, propertyName, properties[propertyName]);
    }
  });
  return obj;
}
