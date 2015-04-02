QUnit.module("Ngular Error Throwing");

QUnit.test("new Ngular.Error displays provided message", function() {
  throws(function() {
    throw new Ngular.Error('A Message');
  }, function(e) {
    return e.message === 'A Message';
  }, 'the assigned message was displayed');
});
