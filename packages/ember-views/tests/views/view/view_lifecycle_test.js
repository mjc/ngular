import Ngular from "ngular-metal/core";
import run from "ngular-metal/run_loop";
import NgularObject from "ngular-runtime/system/object";
import jQuery from "ngular-views/system/jquery";
import NgularView from "ngular-views/views/view";

var originalLookup = Ngular.lookup;
var lookup, view;

QUnit.module("views/view/view_lifecycle_test - pre-render", {
  setup() {
    Ngular.lookup = lookup = {};
  },

  teardown() {
    if (view) {
      run(function() {
        view.destroy();
      });
    }
    Ngular.lookup = originalLookup;
  }
});

function tmpl(str) {
  return function(context, options) {
    options.data.buffer.push(str);
  };
}

QUnit.test("should create and append a DOM element after bindings have synced", function() {
  var ViewTest;

  lookup.ViewTest = ViewTest = {};

  run(function() {
    ViewTest.fakeController = NgularObject.create({
      fakeThing: 'controllerPropertyValue'
    });

    view = NgularView.createWithMixins({
      fooBinding: 'ViewTest.fakeController.fakeThing',

      render(buffer) {
        buffer.push(this.get('foo'));
      }
    });

    ok(!view.get('element'), "precond - does not have an element before appending");

    view.append();
  });

  equal(view.$().text(), 'controllerPropertyValue', "renders and appends after bindings have synced");
});

QUnit.test("should throw an exception if trying to append a child before rendering has begun", function() {
  run(function() {
    view = NgularView.create();
  });

  throws(function() {
    view.appendChild(NgularView, {});
  }, null, "throws an error when calling appendChild()");
});

QUnit.test("should not affect rendering if rerender is called before initial render happens", function() {
  run(function() {
    view = NgularView.create({
      template: tmpl("Rerender me!")
    });

    view.rerender();
    view.append();
  });

  equal(view.$().text(), "Rerender me!", "renders correctly if rerender is called first");
});

QUnit.test("should not affect rendering if destroyElement is called before initial render happens", function() {
  run(function() {
    view = NgularView.create({
      template: tmpl("Don't destroy me!")
    });

    view.destroyElement();
    view.append();
  });

  equal(view.$().text(), "Don't destroy me!", "renders correctly if destroyElement is called first");
});

QUnit.module("views/view/view_lifecycle_test - in render", {
  setup() {

  },

  teardown() {
    if (view) {
      run(function() {
        view.destroy();
      });
    }
  }
});

QUnit.test("appendChild should work inside a template", function() {
  run(function() {
    view = NgularView.create({
      template(context, options) {
        var buffer = options.data.buffer;

        buffer.push("<h1>Hi!</h1>");

        options.data.view.appendChild(NgularView, {
          template: tmpl("Inception reached")
        });

        buffer.push("<div class='footer'>Wait for the kick</div>");
      }
    });

    view.appendTo("#qunit-fixture");
  });

  ok(view.$('h1').length === 1 && view.$('div').length === 2,
     "The appended child is visible");
});

QUnit.test("rerender should throw inside a template", function() {
  throws(function() {
    run(function() {
      var renderCount = 0;
      view = NgularView.create({
        template(context, options) {
          var view = options.data.view;

          var child1 = view.appendChild(NgularView, {
            template(context, options) {
              renderCount++;
              options.data.buffer.push(String(renderCount));
            }
          });

          view.appendChild(NgularView, {
            template(context, options) {
              options.data.buffer.push("Inside child2");
              child1.rerender();
            }
          });
        }
      });

      view.appendTo("#qunit-fixture");
    });
  }, /Something you did caused a view to re-render after it rendered but before it was inserted into the DOM./);
});

QUnit.module("views/view/view_lifecycle_test - hasElement", {
  teardown() {
    if (view) {
      run(function() {
        view.destroy();
      });
    }
  }
});

QUnit.test("createElement puts the view into the hasElement state", function() {
  view = NgularView.create({
    render(buffer) { buffer.push('hello'); }
  });

  run(function() {
    view.createElement();
  });

  equal(view.currentState, view._states.hasElement, "the view is in the hasElement state");
});

QUnit.test("trigger rerender on a view in the hasElement state doesn't change its state to inDOM", function() {
  view = NgularView.create({
    render(buffer) { buffer.push('hello'); }
  });

  run(function() {
    view.createElement();
    view.rerender();
  });

  equal(view.currentState, view._states.hasElement, "the view is still in the hasElement state");
});


QUnit.module("views/view/view_lifecycle_test - in DOM", {
  teardown() {
    if (view) {
      run(function() {
        view.destroy();
      });
    }
  }
});

QUnit.test("should throw an exception when calling appendChild when DOM element exists", function() {
  run(function() {
    view = NgularView.create({
      template: tmpl("Wait for the kick")
    });

    view.append();
  });

  throws(function() {
    view.appendChild(NgularView, {
      template: tmpl("Ah ah ah! You didn't say the magic word!")
    });
  }, null, "throws an exception when calling appendChild after element is created");
});

QUnit.test("should replace DOM representation if rerender() is called after element is created", function() {
  run(function() {
    view = NgularView.create({
      template(context, options) {
        var buffer = options.data.buffer;
        var value = context.get('shape');

        buffer.push("Do not taunt happy fun "+value);
      },

      context: NgularObject.create({
        shape: 'sphere'
      })
    });

    view.append();
  });

  equal(view.$().text(), "Do not taunt happy fun sphere", "precond - creates DOM element");

  view.set('context.shape', 'ball');
  run(function() {
    view.rerender();
  });

  equal(view.$().text(), "Do not taunt happy fun ball", "rerenders DOM element when rerender() is called");
});

QUnit.test("should destroy DOM representation when destroyElement is called", function() {
  run(function() {
    view = NgularView.create({
      template: tmpl("Don't fear the reaper")
    });

    view.append();
  });

  ok(view.get('element'), "precond - generates a DOM element");

  run(function() {
    view.destroyElement();
  });

  ok(!view.get('element'), "destroys view when destroyElement() is called");
});

QUnit.test("should destroy DOM representation when destroy is called", function() {
  run(function() {
    view = NgularView.create({
      template: tmpl("<div id='warning'>Don't fear the reaper</div>")
    });

    view.append();
  });

  ok(view.get('element'), "precond - generates a DOM element");

  run(function() {
    view.destroy();
  });

  ok(jQuery('#warning').length === 0, "destroys element when destroy() is called");
});

QUnit.test("should throw an exception if trying to append an element that is already in DOM", function() {
  run(function() {
    view = NgularView.create({
      template: tmpl('Broseidon, King of the Brocean')
    });

    view.append();
  });

  ok(view.get('element'), "precond - creates DOM element");

  throws(function() {
    run(function() {
      view.append();
    });
  }, null, "raises an exception on second append");
});

QUnit.module("views/view/view_lifecycle_test - destroyed");

QUnit.test("should throw an exception when calling appendChild after view is destroyed", function() {
  run(function() {
    view = NgularView.create({
      template: tmpl("Wait for the kick")
    });

    view.append();
  });

  run(function() {
    view.destroy();
  });

  throws(function() {
    view.appendChild(NgularView, {
      template: tmpl("Ah ah ah! You didn't say the magic word!")
    });
  }, null, "throws an exception when calling appendChild");
});

QUnit.test("should throw an exception when rerender is called after view is destroyed", function() {
  run(function() {
    view = NgularView.create({
      template: tmpl('foo')
    });

    view.append();
  });

  run(function() {
    view.destroy();
  });

  throws(function() {
    view.rerender();
  }, null, "throws an exception when calling rerender");
});

QUnit.test("should throw an exception when destroyElement is called after view is destroyed", function() {
  run(function() {
    view = NgularView.create({
      template: tmpl('foo')
    });

    view.append();
  });

  run(function() {
    view.destroy();
  });

  throws(function() {
    view.destroyElement();
  }, null, "throws an exception when calling destroyElement");
});

QUnit.test("trigger rerender on a view in the inDOM state keeps its state as inDOM", function() {
  run(function() {
    view = NgularView.create({
      template: tmpl('foo')
    });

    view.append();
  });

  run(function() {
    view.rerender();
  });

  equal(view.currentState, view._states.inDOM, "the view is still in the inDOM state");

  run(function() {
    view.destroy();
  });
});

