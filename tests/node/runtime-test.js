/*globals __dirname*/

var path = require('path');

var module = QUnit.module;
var ok = QUnit.ok;
var equal = QUnit.equal;

var distPath = path.join(__dirname, '../../dist');

module('ngular-runtime.js');

test('can be required', function() {
  var Ngular = require(path.join(distPath, 'ngular-runtime'));

  ok(Ngular.Object, 'Ngular.Object is present');
});

test('basic object system functions properly', function() {
  var Ngular = require(path.join(distPath, 'ngular-runtime'));

  var Person = Ngular.Object.extend({
    name: Ngular.computed('firstName', 'lastName', function() {
      return this.get('firstName') + ' ' + this.get('lastName');
    })
  });

  var person = Person.create({
    firstName: 'Max',
    lastName: 'Jackson'
  });

  equal(person.get('name'), 'Max Jackson');

  person.set('firstName', 'James');

  equal(person.get('name'), 'James Jackson');
});
