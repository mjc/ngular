import NgularObject from "ngular-runtime/system/object";

QUnit.module('strict mode tests');

QUnit.test('__superWrapper does not throw errors in strict mode', function() {
  var Foo = NgularObject.extend({
    blah() {
      return 'foo';
    }
  });

  var Bar = Foo.extend({
    blah() {
      return 'bar';
    },

    callBlah() {
      var blah = this.blah;

      return blah();
    }
  });

  var bar = Bar.create();

  equal(bar.callBlah(), 'bar', 'can call local function without call/apply');
});
