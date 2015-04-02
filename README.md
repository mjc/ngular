# Ngular.js [![Build Status](https://secure.travis-ci.org/ngularjs/ngular.js.svg?branch=master)](http://travis-ci.org/ngularjs/ngular.js) [![Code Climate](https://codeclimate.com/github/ngularjs/ngular.js.svg)](https://codeclimate.com/github/ngularjs/ngular.js)

Ngular.js is a JavaScript framework that does all of the heavy lifting
that you'd normally have to do by hand. There are tasks that are common
to every web app; Ngular.js does those things for you, so you can focus
on building killer features and UI.

- [Website](http://github.com/mjc/ngular)
- [Guides](http://github.com/mjc/ngular/guides)
- [API](http://github.com/mjc/ngular/api)
- [Community](http://github.com/mjc/ngular/community)
- [Blog](http://github.com/mjc/ngular/blog)
- [Builds](http://github.com/mjc/ngular/builds)

# Building Ngular.js

1. Ensure that [Node.js](http://nodejs.org/) is installed.
2. Run `npm install` to ensure the required dependencies are installed.
3. Run `npm run build` to build Ngular.js. The builds will be placed in the `dist/` directory.

# Contribution

See [CONTRIBUTING.md](https://github.com/ngularjs/ngular.js/blob/master/CONTRIBUTING.md)

# How to Run Unit Tests

1. Follow the setup steps listed above under [Building Ngular.js](#building-ngularjs).

2. To start the development server, run `npm start`.

3. To run all tests, visit <http://localhost:4200/>.

4. To test a specific package, visit `http://localhost:4200/tests/index.html?package=PACKAGE_NAME`. Replace
`PACKAGE_NAME` with the name of the package you want to test. For
example:

  * [Ngular.js Runtime](http://localhost:4200/tests/index.html?package=ngular-runtime)
  * [Ngular.js Views](http://localhost:4200/tests/index.html?package=ngular-views)
  * [Ngular.js Handlebars](http://localhost:4200/tests/index.html?package=ngular-handlebars)

To test multiple packages, you can separate them with commas.

You can also pass `jquery=VERSION` in the test URL to test different
versions of jQuery.

## From the CLI

1. Install phantomjs from http://phantomjs.org.

2. Run `npm test` to run a basic test suite or run `TEST_SUITE=all npm test` to
   run a more comprehensive suite.

