/**
@module ngular
@submodule ngular-htmlbars
*/

export default function get(env, view, path) {
  return view.getStream(path);
}
