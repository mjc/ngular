import NgularObject from "ngular-runtime/system/object";

QUnit.module('system/object/detect');

QUnit.test('detect detects classes correctly', function() {

  var A = NgularObject.extend();
  var B = A.extend();
  var C = A.extend();

  ok(NgularObject.detect(NgularObject), 'NgularObject is an NgularObject class');
  ok(NgularObject.detect(A), 'A is an NgularObject class');
  ok(NgularObject.detect(B), 'B is an NgularObject class');
  ok(NgularObject.detect(C), 'C is an NgularObject class');

  ok(!A.detect(NgularObject), 'NgularObject is not an A class');
  ok(A.detect(A), 'A is an A class');
  ok(A.detect(B), 'B is an A class');
  ok(A.detect(C), 'C is an A class');

  ok(!B.detect(NgularObject), 'NgularObject is not a B class');
  ok(!B.detect(A), 'A is not a B class');
  ok(B.detect(B), 'B is a B class');
  ok(!B.detect(C), 'C is not a B class');

  ok(!C.detect(NgularObject), 'NgularObject is not a C class');
  ok(!C.detect(A), 'A is not a C class');
  ok(!C.detect(B), 'B is not a C class');
  ok(C.detect(C), 'C is a C class');

});
