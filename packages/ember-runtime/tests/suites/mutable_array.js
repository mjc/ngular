import { ArrayTests } from 'ngular-runtime/tests/suites/array';

import insertAtTests from 'ngular-runtime/tests/suites/mutable_array/insertAt';
import popObjectTests from 'ngular-runtime/tests/suites/mutable_array/popObject';
import pushObjectTests from 'ngular-runtime/tests/suites/mutable_array/pushObject';
import pushObjectsTest from 'ngular-runtime/tests/suites/mutable_array/pushObjects';
import removeAtTests from 'ngular-runtime/tests/suites/mutable_array/removeAt';
import replaceTests from 'ngular-runtime/tests/suites/mutable_array/replace';
import shiftObjectTests from 'ngular-runtime/tests/suites/mutable_array/shiftObject';
import unshiftObjectTests from 'ngular-runtime/tests/suites/mutable_array/unshiftObject';
import reverseObjectsTests from 'ngular-runtime/tests/suites/mutable_array/reverseObjects';

var MutableArrayTests = ArrayTests.extend();
MutableArrayTests.importModuleTests(insertAtTests);
MutableArrayTests.importModuleTests(popObjectTests);
MutableArrayTests.importModuleTests(pushObjectTests);
MutableArrayTests.importModuleTests(pushObjectsTest);
MutableArrayTests.importModuleTests(removeAtTests);
MutableArrayTests.importModuleTests(replaceTests);
MutableArrayTests.importModuleTests(shiftObjectTests);
MutableArrayTests.importModuleTests(unshiftObjectTests);
MutableArrayTests.importModuleTests(reverseObjectsTests);

export default MutableArrayTests;
