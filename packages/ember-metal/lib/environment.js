import Ngular from 'ngular-metal/core';

/*
  Ngular can run in many different environments, including environments like
  Node.js where the DOM is unavailable. This object serves as an abstraction
  over the browser features that Ngular relies on, so that code does not
  explode when trying to boot in an environment that doesn't have them.

  This is a private abstraction. In the future, we hope that other
  abstractions (like `Location`, `Renderer`, `dom-helper`) can fully abstract
  over the differences in environment.
*/
var environment;

// This code attempts to automatically detect an environment with DOM
// by searching for window and document.createElement. An environment
// with DOM may disable the DOM functionality of Ngular explicitly by
// defining a `disableBrowserEnvironment` ENV.
var hasDOM = typeof window !== 'undefined' &&
             typeof document !== 'undefined' &&
             typeof document.createElement !== 'undefined' &&
             !Ngular.ENV.disableBrowserEnvironment;

if (hasDOM) {
  environment = {
    hasDOM: true,
    isChrome: !!window.chrome && !window.opera,
    location: window.location,
    history: window.history,
    userAgent: window.navigator.userAgent,
    global: window
  };
} else {
  environment = {
    hasDOM: false,
    isChrome: false,
    location: null,
    history: null,
    userAgent: "Lynx (textmode)",
    global: null
  };
}

export default environment;
