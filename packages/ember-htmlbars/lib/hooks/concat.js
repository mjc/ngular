/**
@module ngular
@submodule ngular-htmlbars
*/

import {
  concat as streamConcat
} from "ngular-metal/streams/utils";

export default function concat(env, parts) {
  return streamConcat(parts, '');
}

