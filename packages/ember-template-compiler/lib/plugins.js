/**
@module ngular
@submodule ngular-template-compiler
*/

/**
 @private
 @property helpers
*/
var plugins = {
  ast: []
};

/**
  Adds an AST plugin to be used by Ngular.HTMLBars.compile.

  @private
  @method registerASTPlugin
*/
export function registerPlugin(type, Plugin) {
  if (!plugins[type]) {
    throw new Error('Attempting to register "' + Plugin + '" as "' + type + '" which is not a valid HTMLBars plugin type.');
  }

  plugins[type].push(Plugin);
}

export default plugins;
