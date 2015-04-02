import Ngular from 'ngular-metal/core'; // Ngular.assert

// ES6TODO: the functions on EnumerableUtils need their own exports
import { forEach } from 'ngular-metal/enumerable_utils';
import environment from 'ngular-metal/environment';

/**
Ngular Views

@module ngular
@submodule ngular-views
@requires ngular-runtime
@main ngular-views
*/

var jQuery;

if (environment.hasDOM) {
  // mainContext is set in `package/loader/lib/main.js` to the `this` context before entering strict mode
  jQuery = (Ngular.imports && Ngular.imports.jQuery) || (mainContext && mainContext.jQuery); //jshint ignore:line
  if (!jQuery && typeof require === 'function') {
    jQuery = require('jquery');
  }

  Ngular.assert("Ngular Views require jQuery between 1.7 and 2.1", jQuery &&
               (jQuery().jquery.match(/^((1\.(7|8|9|10|11))|(2\.(0|1)))(\.\d+)?(pre|rc\d?)?/) ||
                Ngular.ENV.FORCE_JQUERY));

  /**
  @module ngular
  @submodule ngular-views
  */
  if (jQuery) {
    // http://www.whatwg.org/specs/web-apps/current-work/multipage/dnd.html#dndevents
    var dragEvents = [
      'dragstart',
      'drag',
      'dragenter',
      'dragleave',
      'dragover',
      'drop',
      'dragend'
    ];

    // Copies the `dataTransfer` property from a browser event object onto the
    // jQuery event object for the specified events
    forEach(dragEvents, function(eventName) {
      jQuery.event.fixHooks[eventName] = {
        props: ['dataTransfer']
      };
    });
  }
}

export default jQuery;
