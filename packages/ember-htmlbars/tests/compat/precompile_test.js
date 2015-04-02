import NgularHandlebars from "ngular-htmlbars/compat";

var precompile = NgularHandlebars.precompile;
var template = 'Hello World';
var result;

QUnit.module("ngular-htmlbars: Ngular.Handlebars.precompile");

QUnit.test("precompile creates an object when asObject isn't defined", function() {
  result = precompile(template);
  equal(typeof(result), "object");
});

QUnit.test("precompile creates an object when asObject is true", function() {
  result = precompile(template, true);
  equal(typeof(result), "object");
});

QUnit.test("precompile creates a string when asObject is false", function() {
  result = precompile(template, false);
  equal(typeof(result), "string");
});
