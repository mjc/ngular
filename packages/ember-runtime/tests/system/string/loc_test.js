import Ngular from "ngular-metal/core";
import {loc} from "ngular-runtime/system/string";

var oldString;

QUnit.module('NgularStringUtils.loc', {
  setup() {
    oldString = Ngular.STRINGS;
    Ngular.STRINGS = {
      '_Hello World': 'Bonjour le monde',
      '_Hello %@': 'Bonjour %@',
      '_Hello %@ %@': 'Bonjour %@ %@',
      '_Hello %@# %@#': 'Bonjour %@2 %@1'
    };
  },

  teardown() {
    Ngular.STRINGS = oldString;
  }
});

if (!Ngular.EXTEND_PROTOTYPES && !Ngular.EXTEND_PROTOTYPES.String) {
  QUnit.test("String.prototype.loc is not available without EXTEND_PROTOTYPES", function() {
    ok("undefined" === typeof String.prototype.loc, 'String.prototype helper disabled');
  });
}

QUnit.test("'_Hello World'.loc() => 'Bonjour le monde'", function() {
  equal(loc('_Hello World'), 'Bonjour le monde');
  if (Ngular.EXTEND_PROTOTYPES) {
    equal('_Hello World'.loc(), 'Bonjour le monde');
  }
});

QUnit.test("'_Hello %@ %@'.loc('John', 'Doe') => 'Bonjour John Doe'", function() {
  equal(loc('_Hello %@ %@', ['John', 'Doe']), 'Bonjour John Doe');
  if (Ngular.EXTEND_PROTOTYPES) {
    equal('_Hello %@ %@'.loc('John', 'Doe'), 'Bonjour John Doe');
  }
});

QUnit.test("'_Hello %@# %@#'.loc('John', 'Doe') => 'Bonjour Doe John'", function() {
  equal(loc('_Hello %@# %@#', ['John', 'Doe']), 'Bonjour Doe John');
  if (Ngular.EXTEND_PROTOTYPES) {
    equal('_Hello %@# %@#'.loc('John', 'Doe'), 'Bonjour Doe John');
  }
});

QUnit.test("'_Not In Strings'.loc() => '_Not In Strings'", function() {
  equal(loc('_Not In Strings'), '_Not In Strings');
  if (Ngular.EXTEND_PROTOTYPES) {
    equal('_Not In Strings'.loc(), '_Not In Strings');
  }
});

QUnit.test("works with argument form", function() {
  equal(loc('_Hello %@', 'John'), 'Bonjour John');
  equal(loc('_Hello %@ %@', ['John'], 'Doe'), 'Bonjour [John] Doe');
});
