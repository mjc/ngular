import run from "ngular-metal/run_loop";

import NgularView from "ngular-views/views/view";

var parentView, childView;

QUnit.module('tests/views/view/child_views_tests.js', {
  setup() {
    parentView = NgularView.create({
      render(buffer) {
        buffer.push('Em');
        this.appendChild(childView);
      }
    });

    childView = NgularView.create({
      template() { return 'ber'; }
    });
  },

  teardown() {
    run(function() {
      parentView.destroy();
      childView.destroy();
    });
  }
});

// no parent element, buffer, no element
// parent element

// no parent element, no buffer, no element
QUnit.test("should render an inserted child view when the child is inserted before a DOM element is created", function() {
  run(function() {
    parentView.append();
  });

  equal(parentView.$().text(), 'Ngular', 'renders the child view after the parent view');
});

QUnit.test("should not duplicate childViews when rerendering", function() {

  var Inner = NgularView.extend({
    template() { return ''; }
  });

  var Inner2 = NgularView.extend({
    template() { return ''; }
  });

  var Middle = NgularView.extend({
    render(buffer) {
      this.appendChild(Inner);
      this.appendChild(Inner2);
    }
  });

  var outer = NgularView.create({
    render(buffer) {
      this.middle = this.appendChild(Middle);
    }
  });

  run(function() {
    outer.append();
  });

  equal(outer.get('middle.childViews.length'), 2, 'precond middle has 2 child views rendered to buffer');

  run(function() {
    outer.middle.rerender();
  });

  equal(outer.get('middle.childViews.length'), 2, 'middle has 2 child views rendered to buffer');

  run(function() {
    outer.destroy();
  });
});
