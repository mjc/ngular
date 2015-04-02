import { get } from "ngular-metal/property_get";
import run from "ngular-metal/run_loop";
import jQuery from "ngular-views/system/jquery";
import NgularView from "ngular-views/views/view";
import ContainerView from "ngular-views/views/container_view";
import { computed } from "ngular-metal/computed";

import compile from "ngular-template-compiler/system/compile";

var view;

// .......................................................
//  render()
//
QUnit.module("NgularView#render", {
  teardown() {
    run(function() {
      view.destroy();
    });
  }
});

QUnit.test("default implementation does not render child views", function() {
  expectDeprecation("Setting `childViews` on a Container is deprecated.");

  var rendered = 0;
  var parentRendered = 0;

  view = ContainerView.createWithMixins({
    childViews: ["child"],

    render(buffer) {
      parentRendered++;
      this._super(buffer);
    },

    child: NgularView.createWithMixins({
      render(buffer) {
        rendered++;
        this._super(buffer);
      }
    })
  });

  run(function() {
    view.createElement();
  });
  equal(rendered, 1, 'rendered the child once');
  equal(parentRendered, 1);
  equal(view.$('div').length, 1);

});

QUnit.test("should invoke renderChildViews if layer is destroyed then re-rendered", function() {
  expectDeprecation("Setting `childViews` on a Container is deprecated.");

  var rendered = 0;
  var parentRendered = 0;

  view = ContainerView.createWithMixins({
    childViews: ["child"],

    render(buffer) {
      parentRendered++;
      this._super(buffer);
    },

    child: NgularView.createWithMixins({
      render(buffer) {
        rendered++;
        this._super(buffer);
      }
    })
  });

  run(function() {
    view.append();
  });

  equal(rendered, 1, 'rendered the child once');
  equal(parentRendered, 1);
  equal(view.$('div').length, 1);

  run(function() {
    view.rerender();
  });

  equal(rendered, 2, 'rendered the child twice');
  equal(parentRendered, 2);
  equal(view.$('div').length, 1);

  run(function() {
    view.destroy();
  });
});

QUnit.test("should render child views with a different tagName", function() {
  expectDeprecation("Setting `childViews` on a Container is deprecated.");

  view = ContainerView.create({
    childViews: ["child"],

    child: NgularView.create({
      tagName: 'aside'
    })
  });

  run(function() {
    view.createElement();
  });

  equal(view.$('aside').length, 1);
});

QUnit.test("should add ngular-view to views", function() {
  view = NgularView.create();

  run(function() {
    view.createElement();
  });

  ok(view.$().hasClass('ngular-view'), "the view has ngular-view");
});

QUnit.test("should allow tagName to be a computed property [DEPRECATED]", function() {
  view = NgularView.extend({
    tagName: computed(function() {
      return 'span';
    })
  }).create();

  expectDeprecation(function() {
    run(function() {
      view.createElement();
    });
  }, /using a computed property to define tagName will not be permitted/);

  equal(view.element.tagName, 'SPAN', "the view has was created with the correct element");

  run(function() {
    view.set('tagName', 'div');
  });

  equal(view.element.tagName, 'SPAN', "the tagName cannot be changed after initial render");
});

QUnit.test("should allow hX tags as tagName", function() {
  expectDeprecation("Setting `childViews` on a Container is deprecated.");

  view = ContainerView.create({
    childViews: ["child"],

    child: NgularView.create({
      tagName: 'h3'
    })
  });

  run(function() {
    view.createElement();
  });

  ok(view.$('h3').length, "does not render the h3 tag correctly");
});

QUnit.test("should not add role attribute unless one is specified", function() {
  view = NgularView.create();

  run(function() {
    view.createElement();
  });

  ok(view.$().attr('role') === undefined, "does not have a role attribute");
});

QUnit.test("should re-render if the context is changed", function() {
  view = NgularView.create({
    elementId: 'template-context-test',
    context: { foo: "bar" },
    render(buffer) {
      var value = get(get(this, 'context'), 'foo');
      buffer.push(value);
    }
  });

  run(function() {
    view.appendTo('#qunit-fixture');
  });

  equal(jQuery('#qunit-fixture #template-context-test').text(), "bar", "precond - renders the view with the initial value");

  run(function() {
    view.set('context', {
      foo: "bang baz"
    });
  });

  equal(jQuery('#qunit-fixture #template-context-test').text(), "bang baz", "re-renders the view with the updated context");
});

QUnit.test("renders contained view with omitted start tag and parent view context", function() {
  expectDeprecation("Setting `childViews` on a Container is deprecated.");

  view = ContainerView.createWithMixins({
    tagName: 'table',
    childViews: ["row"],
    row: NgularView.createWithMixins({
      tagName: 'tr'
    })
  });

  run(view, view.append);

  equal(view.element.tagName, 'TABLE', 'container view is table');
  equal(view.element.childNodes[0].tagName, 'TR', 'inner view is tr');

  run(view, view.rerender);

  equal(view.element.tagName, 'TABLE', 'container view is table');
  equal(view.element.childNodes[0].tagName, 'TR', 'inner view is tr');
});

QUnit.test("renders a contained view with omitted start tag and tagless parent view context", function() {
  view = NgularView.createWithMixins({
    tagName: 'table',
    template: compile("{{view view.pivot}}"),
    pivot: NgularView.extend({
      tagName: '',
      template: compile("{{view view.row}}"),
      row: NgularView.extend({
        tagName: 'tr'
      })
    })
  });

  run(view, view.append);

  equal(view.element.tagName, 'TABLE', 'container view is table');
  ok(view.$('tr').length, 'inner view is tr');

  run(view, view.rerender);

  equal(view.element.tagName, 'TABLE', 'container view is table');
  ok(view.$('tr').length, 'inner view is tr');
});
