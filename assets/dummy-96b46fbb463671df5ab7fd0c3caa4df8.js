"use strict"
define("dummy/_controllers/things",["exports","dummy/utils/generate-things"],(function(e,t){var n,r,o,i,u,a,c,l
function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e){return function(e){if(Array.isArray(e))return p(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return
if("string"==typeof e)return p(e,t)
var n=Object.prototype.toString.call(e).slice(8,-1)
"Object"===n&&e.constructor&&(n=e.constructor.name)
if("Map"===n||"Set"===n)return Array.from(e)
if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return p(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){(null==t||t>e.length)&&(t=e.length)
for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n]
return r}function y(e,t,n,r){n&&Object.defineProperty(e,t,{enumerable:n.enumerable,configurable:n.configurable,writable:n.writable,value:n.initializer?n.initializer.call(r):void 0})}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function m(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function h(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1
if(Reflect.construct.sham)return!1
if("function"==typeof Proxy)return!0
try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()
return function(){var n,r=_(e)
if(t){var o=_(this).constructor
n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments)
return v(this,n)}}function v(e,t){return!t||"object"!==f(t)&&"function"!=typeof t?g(e):t}function g(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}function _(e){return(_=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function O(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function w(e,t,n,r,o){var i={}
return Object.keys(r).forEach((function(e){i[e]=r[e]})),i.enumerable=!!i.enumerable,i.configurable=!!i.configurable,("value"in i||i.initializer)&&(i.writable=!0),i=n.slice().reverse().reduce((function(n,r){return r(e,t,n)||n}),i),o&&void 0!==i.initializer&&(i.value=i.initializer?i.initializer.call(o):void 0,i.initializer=void 0),void 0===i.initializer&&(Object.defineProperty(e,t,i),i=null),i}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var j=(n=Ember.inject.controller("application"),r=Ember._tracked,o=Ember._tracked,i=Ember._action,a=w((u=function(e){(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&b(e,t)})(u,Ember.Controller)
var n,r,o,i=h(u)
function u(){var e
return d(this,u),y(g(e=i.apply(this,arguments)),"appController",a,g(e)),y(g(e),"page",c,g(e)),y(g(e),"things",l,g(e)),O(g(e),"perPage",10),e.things=e._generateThings(),e}return n=u,(r=[{key:"handleLoadMore",value:function(){var e=this
return new Ember.RSVP.Promise((function(t){Ember.run.later((function(){e.page++,e.things=[].concat(s(e.things),s(e._generateThings())),t()}),e.appController.loadDelay)}))}},{key:"_generateThings",value:function(){var e=this.things?this.things.length+1:0,n=this.page*this.perPage
return(0,t.default)(e,n)}}])&&m(n.prototype,r),o&&m(n,o),u}()).prototype,"appController",[n],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),c=w(u.prototype,"page",[r],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 1}}),l=w(u.prototype,"things",[o],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),w(u.prototype,"handleLoadMore",[i],Object.getOwnPropertyDescriptor(u.prototype,"handleLoadMore"),u.prototype),u)
e.default=j})),define("dummy/app",["exports","ember-resolver","ember-load-initializers","dummy/config/environment"],(function(e,t,n,r){function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function a(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1
if(Reflect.construct.sham)return!1
if("function"==typeof Proxy)return!0
try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()
return function(){var n,r=f(e)
if(t){var o=f(this).constructor
n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments)
return c(this,n)}}function c(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?l(e):t}function l(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var p=function(e){(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)})(o,Ember.Application)
var n=a(o)
function o(){var e
i(this,o)
for(var u=arguments.length,a=new Array(u),c=0;c<u;c++)a[c]=arguments[c]
return s(l(e=n.call.apply(n,[this].concat(a))),"modulePrefix",r.default.modulePrefix),s(l(e),"podModulePrefix",r.default.podModulePrefix),s(l(e),"Resolver",t.default),s(l(e),"customEvents",{touchstart:null,touchmove:null,touchend:null,touchcancel:null}),e}return o}()
e.default=p,(0,n.default)(p,r.default.modulePrefix)})),define("dummy/component-managers/glimmer",["exports","@glimmer/component/-private/ember-component-manager"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})})),define("dummy/components/infinite-scroller",["exports","@zestia/ember-simple-infinite-scroller/components/infinite-scroller"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})})),define("dummy/controllers/application",["exports"],(function(e){var t,n,r,o
function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t,n,r){n&&Object.defineProperty(e,t,{enumerable:n.enumerable,configurable:n.configurable,writable:n.writable,value:n.initializer?n.initializer.call(r):void 0})}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function l(e,t){return(l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function f(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1
if(Reflect.construct.sham)return!1
if("function"==typeof Proxy)return!0
try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()
return function(){var n,r=y(e)
if(t){var o=y(this).constructor
n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments)
return s(this,n)}}function s(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?p(e):t}function p(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function d(e,t,n,r,o){var i={}
return Object.keys(r).forEach((function(e){i[e]=r[e]})),i.enumerable=!!i.enumerable,i.configurable=!!i.configurable,("value"in i||i.initializer)&&(i.writable=!0),i=n.slice().reverse().reduce((function(n,r){return r(e,t,n)||n}),i),o&&void 0!==i.initializer&&(i.value=i.initializer?i.initializer.call(o):void 0,i.initializer=void 0),void 0===i.initializer&&(Object.defineProperty(e,t,i),i=null),i}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var m=(t=Ember._tracked,n=Ember._action,o=d((r=function(e){(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)})(s,Ember.Controller)
var t,n,r,i=f(s)
function s(){var e
a(this,s)
for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r]
return u(p(e=i.call.apply(i,[this].concat(n))),"loadDelay",o,p(e)),e}return t=s,(n=[{key:"setLoadDelay",value:function(e){var t=e.target.value
this.loadDelay=t}}])&&c(t.prototype,n),r&&c(t,r),s}()).prototype,"loadDelay",[t],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 0}}),d(r.prototype,"setLoadDelay",[n],Object.getOwnPropertyDescriptor(r.prototype,"setLoadDelay"),r.prototype),r)
e.default=m})),define("dummy/controllers/example-1",["exports","dummy/_controllers/things"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n})),define("dummy/controllers/example-2",["exports","dummy/_controllers/things"],(function(e,t){function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){return(o=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function i(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1
if(Reflect.construct.sham)return!1
if("function"==typeof Proxy)return!0
try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()
return function(){var n,r=c(e)
if(t){var o=c(this).constructor
n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments)
return u(this,n)}}function u(e,t){return!t||"object"!==n(t)&&"function"!=typeof t?a(e):t}function a(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var f=function(e){(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&o(e,t)})(n,e)
var t=i(n)
function n(){var e
r(this,n)
for(var o=arguments.length,i=new Array(o),u=0;u<o;u++)i[u]=arguments[u]
return l(a(e=t.call.apply(t,[this].concat(i))),"document",document),e}return n}(t.default)
e.default=f})),define("dummy/controllers/example-3",["exports","dummy/_controllers/things"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n})),define("dummy/controllers/example-4",["exports","dummy/_controllers/things"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=t.default
e.default=n})),define("dummy/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}
e.default=n})),define("dummy/modifiers/did-insert",["exports","@ember/render-modifiers/modifiers/did-insert"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})})),define("dummy/modifiers/did-update",["exports","@ember/render-modifiers/modifiers/did-update"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})})),define("dummy/modifiers/will-destroy",["exports","@ember/render-modifiers/modifiers/will-destroy"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})})),define("dummy/router",["exports","dummy/config/environment"],(function(e,t){function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){return(o=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function i(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1
if(Reflect.construct.sham)return!1
if("function"==typeof Proxy)return!0
try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()
return function(){var n,r=c(e)
if(t){var o=c(this).constructor
n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments)
return u(this,n)}}function u(e,t){return!t||"object"!==n(t)&&"function"!=typeof t?a(e):t}function a(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}function c(e){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var f=function(e){(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&o(e,t)})(u,Ember.Router)
var n=i(u)
function u(){var e
r(this,u)
for(var o=arguments.length,i=new Array(o),c=0;c<o;c++)i[c]=arguments[c]
return l(a(e=n.call.apply(n,[this].concat(i))),"location",t.default.locationType),l(a(e),"rootURL",t.default.rootURL),e}return u}()
e.default=f,f.map((function(){this.route("example-1"),this.route("example-2"),this.route("example-3"),this.route("example-4")}))})),define("dummy/routes/application",["exports"],(function(e){function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){return(r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function o(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1
if(Reflect.construct.sham)return!1
if("function"==typeof Proxy)return!0
try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()
return function(){var n,r=u(e)
if(t){var o=u(this).constructor
n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments)
return i(this,n)}}function i(e,n){return!n||"object"!==t(n)&&"function"!=typeof n?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}(e):n}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=function(e){(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&r(e,t)})(i,Ember.Route)
var t=o(i)
function i(){return n(this,i),t.apply(this,arguments)}return i}()
e.default=a})),define("dummy/routes/example-1",["exports"],(function(e){function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){return(r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function o(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1
if(Reflect.construct.sham)return!1
if("function"==typeof Proxy)return!0
try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()
return function(){var n,r=u(e)
if(t){var o=u(this).constructor
n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments)
return i(this,n)}}function i(e,n){return!n||"object"!==t(n)&&"function"!=typeof n?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}(e):n}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=function(e){(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&r(e,t)})(i,Ember.Route)
var t=o(i)
function i(){return n(this,i),t.apply(this,arguments)}return i}()
e.default=a})),define("dummy/routes/example-2",["exports"],(function(e){function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){return(r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function o(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1
if(Reflect.construct.sham)return!1
if("function"==typeof Proxy)return!0
try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()
return function(){var n,r=u(e)
if(t){var o=u(this).constructor
n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments)
return i(this,n)}}function i(e,n){return!n||"object"!==t(n)&&"function"!=typeof n?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}(e):n}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=function(e){(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&r(e,t)})(i,Ember.Route)
var t=o(i)
function i(){return n(this,i),t.apply(this,arguments)}return i}()
e.default=a})),define("dummy/routes/example-3",["exports"],(function(e){function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){return(r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function o(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1
if(Reflect.construct.sham)return!1
if("function"==typeof Proxy)return!0
try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()
return function(){var n,r=u(e)
if(t){var o=u(this).constructor
n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments)
return i(this,n)}}function i(e,n){return!n||"object"!==t(n)&&"function"!=typeof n?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}(e):n}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=function(e){(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&r(e,t)})(i,Ember.Route)
var t=o(i)
function i(){return n(this,i),t.apply(this,arguments)}return i}()
e.default=a})),define("dummy/routes/example-4",["exports"],(function(e){function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){return(r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function o(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1
if(Reflect.construct.sham)return!1
if("function"==typeof Proxy)return!0
try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()
return function(){var n,r=u(e)
if(t){var o=u(this).constructor
n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments)
return i(this,n)}}function i(e,n){return!n||"object"!==t(n)&&"function"!=typeof n?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}(e):n}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=function(e){(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&r(e,t)})(i,Ember.Route)
var t=o(i)
function i(){return n(this,i),t.apply(this,arguments)}return i}()
e.default=a})),define("dummy/routes/index",["exports"],(function(e){var t,n,r
function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t,n,r){n&&Object.defineProperty(e,t,{enumerable:n.enumerable,configurable:n.configurable,writable:n.writable,value:n.initializer?n.initializer.call(r):void 0})}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){for(var n=0;n<t.length;n++){var r=t[n]
r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function l(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1
if(Reflect.construct.sham)return!1
if("function"==typeof Proxy)return!0
try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()
return function(){var n,r=p(e)
if(t){var o=p(this).constructor
n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments)
return f(this,n)}}function f(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?s(e):t}function s(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return e}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var y,d,m,b,h,v,g=(t=Ember.inject.service,y=(n=function(e){(function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function")
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)})(p,Ember.Route)
var t,n,o,f=l(p)
function p(){var e
u(this,p)
for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o]
return i(s(e=f.call.apply(f,[this].concat(n))),"router",r,s(e)),e}return t=p,(n=[{key:"redirect",value:function(){return this.router.transitionTo("example-1")}}])&&a(t.prototype,n),o&&a(t,o),p}()).prototype,d="router",m=[t],b={configurable:!0,enumerable:!0,writable:!0,initializer:null},v={},Object.keys(b).forEach((function(e){v[e]=b[e]})),v.enumerable=!!v.enumerable,v.configurable=!!v.configurable,("value"in v||v.initializer)&&(v.writable=!0),v=m.slice().reverse().reduce((function(e,t){return t(y,d,e)||e}),v),h&&void 0!==v.initializer&&(v.value=v.initializer?v.initializer.call(h):void 0,v.initializer=void 0),void 0===v.initializer&&(Object.defineProperty(y,d,v),v=null),r=v,n)
e.default=g})),define("dummy/templates/application",["exports"],(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"HcIBcYos",block:'{"symbols":[],"statements":[[10,"h1"],[12],[2,"\\n  @zestia/ember-simple-infinite-scroller\\n"],[13],[2,"\\n\\n"],[10,"a"],[14,6,"https://github.com/zestia/ember-simple-infinite-scroller"],[12],[2,"\\n  "],[10,"img"],[14,5,"position: absolute; top: 0; right: 0; border: 0;"],[14,"width","149"],[14,"height","149"],[14,"src","https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"],[14,0,"attachment-full size-full"],[14,"alt","Fork me on GitHub"],[14,"data-recalc-dims","1"],[12],[13],[2,"\\n"],[13],[2,"\\n\\n"],[8,"link-to",[],[["@route"],["example-1"]],[["default"],[{"statements":[[2,"\\n  Example 1\\n"]],"parameters":[]}]]],[2,"\\n|\\n"],[8,"link-to",[],[["@route"],["example-2"]],[["default"],[{"statements":[[2,"\\n  Example 2\\n"]],"parameters":[]}]]],[2,"\\n|\\n"],[8,"link-to",[],[["@route"],["example-3"]],[["default"],[{"statements":[[2,"\\n  Example 3\\n"]],"parameters":[]}]]],[2,"\\n|\\n"],[8,"link-to",[],[["@route"],["example-4"]],[["default"],[{"statements":[[2,"\\n  Example 4\\n"]],"parameters":[]}]]],[2,"\\n\\n"],[10,"p"],[12],[2,"\\n  Load delay:\\n  "],[10,"br"],[12],[13],[2,"\\n  "],[11,"input"],[16,2,[32,0,["loadDelay"]]],[24,4,"number"],[4,[38,0],["input",[32,0,["setLoadDelay"]]],null],[12],[13],[2,"\\n"],[13],[2,"\\n\\n"],[1,[30,[36,2],[[30,[36,1],null,null]],null]]],"hasEval":false,"upvars":["on","-outlet","component"]}',meta:{moduleName:"dummy/templates/application.hbs"}})
e.default=t})),define("dummy/templates/example-1",["exports"],(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"dvcwCanY",block:'{"symbols":["scroller","thing"],"statements":[[10,"p"],[12],[2,"\\n  An action is fired when infinite scroll component is scrolled to the very bottom\\n"],[13],[2,"\\n\\n"],[8,"infinite-scroller",[[24,0,"example-1"]],[["@onLoadMore"],[[32,0,["handleLoadMore"]]]],[["default"],[{"statements":[[2,"\\n"],[6,[37,1],[[30,[36,0],[[30,[36,0],[[32,0,["things"]]],null]],null]],null,[["default"],[{"statements":[[2,"    "],[10,"div"],[14,0,"thing"],[12],[2,"\\n      "],[1,[32,2,["name"]]],[2,"\\n    "],[13],[2,"\\n"]],"parameters":[2]}]]],[6,[37,2],[[32,1,["isLoading"]]],null,[["default"],[{"statements":[[2,"    "],[10,"div"],[14,0,"status"],[12],[2,"\\n      Loading...\\n    "],[13],[2,"\\n"]],"parameters":[]}]]]],"parameters":[1]}]]]],"hasEval":false,"upvars":["-track-array","each","if"]}',meta:{moduleName:"dummy/templates/example-1.hbs"}})
e.default=t})),define("dummy/templates/example-2",["exports"],(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"dRdb9rrS",block:'{"symbols":["scroller","thing"],"statements":[[10,"p"],[12],[2,"\\n  An action is fired when document is scrolled to the very bottom\\n"],[13],[2,"\\n"],[10,"p"],[12],[2,"\\n  Note that if there is no scroll movement available (due to lack of enough items to cause overflow),\\n  you can display a button to manually load more.\\n"],[13],[2,"\\n\\n"],[8,"infinite-scroller",[[24,0,"example-2"]],[["@onLoadMore","@element"],[[32,0,["handleLoadMore"]],[32,0,["document"]]]],[["default"],[{"statements":[[2,"\\n"],[6,[37,2],[[30,[36,1],[[30,[36,1],[[32,0,["things"]]],null]],null]],null,[["default"],[{"statements":[[2,"    "],[10,"div"],[14,0,"thing"],[12],[2,"\\n      "],[1,[32,2,["name"]]],[2,"\\n    "],[13],[2,"\\n"]],"parameters":[2]}]]],[2,"\\n"],[6,[37,3],[[32,1,["isScrollable"]]],null,[["default"],[{"statements":[[2,"    "],[11,"button"],[24,4,"button"],[4,[38,0],["click",[32,1,["loadMore"]]],null],[12],[2,"\\n      Load more\\n    "],[13],[2,"\\n"]],"parameters":[]}]]],[2,"\\n"],[6,[37,4],[[32,1,["isLoading"]]],null,[["default"],[{"statements":[[2,"    "],[10,"div"],[14,0,"status"],[12],[2,"\\n      Loading...\\n    "],[13],[2,"\\n"]],"parameters":[]}]]]],"parameters":[1]}]]]],"hasEval":false,"upvars":["on","-track-array","each","unless","if"]}',meta:{moduleName:"dummy/templates/example-2.hbs"}})
e.default=t})),define("dummy/templates/example-3",["exports"],(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"NwQrxbn3",block:'{"symbols":["scroller","thing"],"statements":[[10,"p"],[12],[2,"\\n  An action is fired when the infinite scroll component is scrolled to 50%\\n"],[13],[2,"\\n\\n"],[8,"infinite-scroller",[[24,0,"example-3"]],[["@onLoadMore","@debounce","@leeway"],[[32,0,["handleLoadMore"]],10,"50%"]],[["default"],[{"statements":[[2,"\\n"],[6,[37,1],[[30,[36,0],[[30,[36,0],[[32,0,["things"]]],null]],null]],null,[["default"],[{"statements":[[2,"    "],[10,"div"],[14,0,"thing"],[12],[2,"\\n      "],[1,[32,2,["name"]]],[2,"\\n    "],[13],[2,"\\n"]],"parameters":[2]}]]],[6,[37,2],[[32,1,["isLoading"]]],null,[["default"],[{"statements":[[2,"    "],[10,"div"],[14,0,"status"],[12],[2,"\\n      Loading...\\n    "],[13],[2,"\\n"]],"parameters":[]}]]]],"parameters":[1]}]]]],"hasEval":false,"upvars":["-track-array","each","if"]}',meta:{moduleName:"dummy/templates/example-3.hbs"}})
e.default=t})),define("dummy/templates/example-4",["exports"],(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var t=Ember.HTMLBars.template({id:"wC7hV7n9",block:'{"symbols":["scroller","thing"],"statements":[[10,"p"],[12],[2,"\\n  An action is fired when a specific element is scrolled to the very bottom\\n"],[13],[2,"\\n\\n"],[8,"infinite-scroller",[[24,0,"example-4"]],[["@onLoadMore"],[[32,0,["handleLoadMore"]]]],[["default"],[{"statements":[[2,"\\n  "],[11,"div"],[24,0,"internal-element"],[4,[38,0],[[32,1,["setElement"]]],null],[12],[2,"\\n"],[6,[37,2],[[30,[36,1],[[30,[36,1],[[32,0,["things"]]],null]],null]],null,[["default"],[{"statements":[[2,"      "],[10,"div"],[14,0,"thing"],[12],[2,"\\n        "],[1,[32,2,["name"]]],[2,"\\n      "],[13],[2,"\\n"]],"parameters":[2]}]]],[2,"  "],[13],[2,"\\n"],[6,[37,3],[[32,1,["isLoading"]]],null,[["default"],[{"statements":[[2,"    "],[10,"div"],[14,0,"status"],[12],[2,"\\n      Loading...\\n    "],[13],[2,"\\n"]],"parameters":[]}]]]],"parameters":[1]}]]]],"hasEval":false,"upvars":["did-insert","-track-array","each","if"]}',meta:{moduleName:"dummy/templates/example-4.hbs"}})
e.default=t})),define("dummy/utils/generate-things",["exports"],(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,t){for(var n=Ember.A(),r=e;r<=t;r+=1)n.push({id:r,name:"Thing ".concat(r)})
return n}})),define("dummy/config/environment",[],(function(){try{var e="dummy/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),n={default:JSON.parse(decodeURIComponent(t))}
return Object.defineProperty(n,"__esModule",{value:!0}),n}catch(r){throw new Error('Could not read config from meta tag with name "'+e+'".')}})),runningTests||require("dummy/app").default.create({})
