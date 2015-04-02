import { EnumerableTests } from 'ngular-runtime/tests/suites/enumerable';

import addObjectTests from 'ngular-runtime/tests/suites/mutable_enumerable/addObject';
import removeObjectTests from 'ngular-runtime/tests/suites/mutable_enumerable/removeObject';
import removeObjectsTests from 'ngular-runtime/tests/suites/mutable_enumerable/removeObjects';

var MutableEnumerableTests = EnumerableTests.extend();
MutableEnumerableTests.importModuleTests(addObjectTests);
MutableEnumerableTests.importModuleTests(removeObjectTests);
MutableEnumerableTests.importModuleTests(removeObjectsTests);

export default MutableEnumerableTests;
