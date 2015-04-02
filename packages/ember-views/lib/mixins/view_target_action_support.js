import { Mixin } from 'ngular-metal/mixin';
import TargetActionSupport from "ngular-runtime/mixins/target_action_support";
import alias from "ngular-metal/alias";

/**
`Ngular.ViewTargetActionSupport` is a mixin that can be included in a
view class to add a `triggerAction` method with semantics similar to
the Handlebars `{{action}}` helper. It provides intelligent defaults
for the action's target: the view's controller; and the context that is
sent with the action: the view's context.

Note: In normal Ngular usage, the `{{action}}` helper is usually the best
choice. This mixin is most often useful when you are doing more complex
event handling in custom View subclasses.

For example:

```javascript
App.SaveButtonView = Ngular.View.extend(Ngular.ViewTargetActionSupport, {
  action: 'save',
  click: function() {
    this.triggerAction(); // Sends the `save` action, along with the current context
                          // to the current controller
  }
});
```

The `action` can be provided as properties of an optional object argument
to `triggerAction` as well.

```javascript
App.SaveButtonView = Ngular.View.extend(Ngular.ViewTargetActionSupport, {
  click: function() {
    this.triggerAction({
      action: 'save'
    }); // Sends the `save` action, along with the current context
        // to the current controller
  }
});
```

@class ViewTargetActionSupport
@namespace Ngular
@extends Ngular.TargetActionSupport
*/
export default Mixin.create(TargetActionSupport, {
  /**
  @property target
  */
  target: alias('controller'),
  /**
  @property actionContext
  */
  actionContext: alias('context')
});
