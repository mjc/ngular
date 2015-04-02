/**
@module ngular
@submodule ngular-htmlbars
*/

export default function set(env, view, name, value) {
  view._keywords[name] = value;
}
