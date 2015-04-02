/**
@module ngular
@submodule ngular-views
*/

import run from "ngular-metal/run_loop";

// Add a new named queue for rendering views that happens
// after bindings have synced, and a queue for scheduling actions
// that that should occur after view rendering.
run._addQueue('render', 'actions');
run._addQueue('afterRender', 'render');
