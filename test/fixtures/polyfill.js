/* eslint-disable */

// ES5
require('es5-shim/es5-shim');
require('es5-shim/es5-sham');

// ES6
require('es6-shim/es6-shim');
require('es6-shim/es6-sham');
require('es6-symbol/implement'); // Implements `Symbol` globally

// ES7
require('es7-shim/es7-shim').shim();

// console (IE9)
require('./console');

// Object.setPrototypeOf()
require('./object-setprototypeof-ie9');

require('imports?this=>window!js-polyfills/cssom');
require('imports?self=>window!js-polyfills/dom');
require('imports?self=>window!js-polyfills/fetch'); // deps: Symbol
require('imports?self=>window!js-polyfills/html');
require('imports?self=>window!js-polyfills/keyboard');
require('imports?this=>window!js-polyfills/timing');
require('imports?self=>window!js-polyfills/typedarray');
require('imports?self=>window!js-polyfills/url');
require('imports?self=>window!js-polyfills/web'); // deps: Symbol
require('imports?self=>window!js-polyfills/xhr');
