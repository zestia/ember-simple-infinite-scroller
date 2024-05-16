"use strict"
define("dummy/_controllers/things",["exports","@ember/runloop","@ember/object","@ember/controller","dummy/utils/generate-things","@glimmer/tracking"],(function(e,t,r,i,n,l){var o,a,u,c,d
function s(e,t,r,i){r&&Object.defineProperty(e,t,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(i):void 0})}function f(e,t,r){var i
return(t="symbol"==typeof(i=function(e,t){if("object"!=typeof e||!e)return e
var r=e[Symbol.toPrimitive]
if(void 0!==r){var i=r.call(e,t||"default")
if("object"!=typeof i)return i
throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"))?i:String(i))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function m(e,t,r,i,n){var l={}
return Object.keys(i).forEach((function(e){l[e]=i[e]})),l.enumerable=!!l.enumerable,l.configurable=!!l.configurable,("value"in l||l.initializer)&&(l.writable=!0),l=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),l),n&&void 0!==l.initializer&&(l.value=l.initializer?l.initializer.call(n):void 0,l.initializer=void 0),void 0===l.initializer&&(Object.defineProperty(e,t,l),l=null),l}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(o=(0,i.inject)("application"),a=class extends i.default{constructor(...e){super(...e),s(this,"appController",u,this),s(this,"page",c,this),s(this,"things",d,this),f(this,"perPage",10)}handleLoadMore(e){return new Promise((r=>{(0,t.later)((()=>{"DOWN"===e&&this.page<10&&(this.page++,this.things=[...this.things,...this._generateThingsForPage(this.page)]),"UP"===e&&this.page>1&&(this.page--,this.things=[...this._generateThingsForPage(this.page),...this.things]),r()}),this.appController.loadDelay)}))}_generateThingsForPage(e){const t=10*(e-1)+1,r=e*this.perPage
return(0,n.default)(t,r)}},u=m(a.prototype,"appController",[o],{configurable:!0,enumerable:!0,writable:!0,initializer:null}),c=m(a.prototype,"page",[l.tracked],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 1}}),d=m(a.prototype,"things",[l.tracked],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return this._generateThingsForPage(1)}}),m(a.prototype,"handleLoadMore",[r.action],Object.getOwnPropertyDescriptor(a.prototype,"handleLoadMore"),a.prototype),a)})),define("dummy/app",["exports","@ember/application","ember-resolver","ember-load-initializers","dummy/config/environment"],(function(e,t,r,i,n){function l(e,t,r){var i
return(t="symbol"==typeof(i=function(e,t){if("object"!=typeof e||!e)return e
var r=e[Symbol.toPrimitive]
if(void 0!==r){var i=r.call(e,t||"default")
if("object"!=typeof i)return i
throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"))?i:String(i))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class o extends t.default{constructor(...e){super(...e),l(this,"modulePrefix",n.default.modulePrefix),l(this,"podModulePrefix",n.default.podModulePrefix),l(this,"Resolver",r.default),l(this,"customEvents",{touchstart:null,touchmove:null,touchend:null,touchcancel:null})}}e.default=o,(0,i.default)(o,n.default.modulePrefix)})),define("dummy/component-managers/glimmer",["exports","@glimmer/component/-private/ember-component-manager"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})})),define("dummy/components/infinite-scroller",["exports","@zestia/ember-simple-infinite-scroller/components/infinite-scroller"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})})),define("dummy/container-debug-adapter",["exports","ember-resolver/container-debug-adapter"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})})),define("dummy/controllers/application",["exports","@ember/controller","@ember/object","@glimmer/tracking"],(function(e,t,r,i){var n,l
function o(e,t,r,i,n){var l={}
return Object.keys(i).forEach((function(e){l[e]=i[e]})),l.enumerable=!!l.enumerable,l.configurable=!!l.configurable,("value"in l||l.initializer)&&(l.writable=!0),l=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),l),n&&void 0!==l.initializer&&(l.value=l.initializer?l.initializer.call(n):void 0,l.initializer=void 0),void 0===l.initializer&&(Object.defineProperty(e,t,l),l=null),l}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(n=class extends t.default{constructor(...e){var t,r,i,n
super(...e),t=this,r="loadDelay",n=this,(i=l)&&Object.defineProperty(t,r,{enumerable:i.enumerable,configurable:i.configurable,writable:i.writable,value:i.initializer?i.initializer.call(n):void 0})}setLoadDelay({target:{value:e}}){this.loadDelay=e}},l=o(n.prototype,"loadDelay",[i.tracked],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 0}}),o(n.prototype,"setLoadDelay",[r.action],Object.getOwnPropertyDescriptor(n.prototype,"setLoadDelay"),n.prototype),n)})),define("dummy/controllers/example-1",["exports","dummy/_controllers/things"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class r extends t.default{}e.default=r})),define("dummy/controllers/example-2",["exports","dummy/_controllers/things"],(function(e,t){function r(e,t,r){var i
return(t="symbol"==typeof(i=function(e,t){if("object"!=typeof e||!e)return e
var r=e[Symbol.toPrimitive]
if(void 0!==r){var i=r.call(e,t||"default")
if("object"!=typeof i)return i
throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"))?i:String(i))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class i extends t.default{constructor(...e){super(...e),r(this,"document",document)}}e.default=i})),define("dummy/controllers/example-3",["exports","dummy/_controllers/things"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class r extends t.default{}e.default=r})),define("dummy/controllers/example-4",["exports","dummy/_controllers/things","ember-modifier","@glimmer/tracking"],(function(e,t,r,i){var n,l
function o(e,t,r){var i
return(t="symbol"==typeof(i=function(e,t){if("object"!=typeof e||!e)return e
var r=e[Symbol.toPrimitive]
if(void 0!==r){var i=r.call(e,t||"default")
if("object"!=typeof i)return i
throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"))?i:String(i))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(n=class extends t.default{constructor(...e){var t,i,n,a
super(...e),t=this,i="scroller",a=this,(n=l)&&Object.defineProperty(t,i,{enumerable:n.enumerable,configurable:n.configurable,writable:n.writable,value:n.initializer?n.initializer.call(a):void 0}),o(this,"setScroller",(0,r.modifier)((e=>this.scroller=e),{eager:!1}))}},a=n.prototype,u="scroller",c=[i.tracked],d={configurable:!0,enumerable:!0,writable:!0,initializer:null},f={},Object.keys(d).forEach((function(e){f[e]=d[e]})),f.enumerable=!!f.enumerable,f.configurable=!!f.configurable,("value"in f||f.initializer)&&(f.writable=!0),f=c.slice().reverse().reduce((function(e,t){return t(a,u,e)||e}),f),s&&void 0!==f.initializer&&(f.value=f.initializer?f.initializer.call(s):void 0,f.initializer=void 0),void 0===f.initializer&&(Object.defineProperty(a,u,f),f=null),l=f,n)
var a,u,c,d,s,f})),define("dummy/controllers/example-5",["exports","dummy/_controllers/things","ember-modifier","@glimmer/tracking"],(function(e,t,r,i){var n,l,o
function a(e,t,r,i){r&&Object.defineProperty(e,t,{enumerable:r.enumerable,configurable:r.configurable,writable:r.writable,value:r.initializer?r.initializer.call(i):void 0})}function u(e,t,r){var i
return(t="symbol"==typeof(i=function(e,t){if("object"!=typeof e||!e)return e
var r=e[Symbol.toPrimitive]
if(void 0!==r){var i=r.call(e,t||"default")
if("object"!=typeof i)return i
throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"))?i:String(i))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t,r,i,n){var l={}
return Object.keys(i).forEach((function(e){l[e]=i[e]})),l.enumerable=!!l.enumerable,l.configurable=!!l.configurable,("value"in l||l.initializer)&&(l.writable=!0),l=r.slice().reverse().reduce((function(r,i){return i(e,t,r)||r}),l),n&&void 0!==l.initializer&&(l.value=l.initializer?l.initializer.call(n):void 0,l.initializer=void 0),void 0===l.initializer&&(Object.defineProperty(e,t,l),l=null),l}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(n=class extends t.default{constructor(...e){super(...e),a(this,"page",l,this),a(this,"things",o,this),u(this,"scrollIntoView",(0,r.modifier)((e=>e.scrollIntoView()),{eager:!1}))}},l=c(n.prototype,"page",[i.tracked],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 5}}),o=c(n.prototype,"things",[i.tracked],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return this._generateThingsForPage(5)}}),n)})),define("dummy/router",["exports","@ember/routing/router","dummy/config/environment"],(function(e,t,r){function i(e,t,r){var i
return(t="symbol"==typeof(i=function(e,t){if("object"!=typeof e||!e)return e
var r=e[Symbol.toPrimitive]
if(void 0!==r){var i=r.call(e,t||"default")
if("object"!=typeof i)return i
throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"))?i:String(i))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
class n extends t.default{constructor(...e){super(...e),i(this,"location",r.default.locationType),i(this,"rootURL",r.default.rootURL)}}e.default=n,n.map((function(){this.route("example-1"),this.route("example-2"),this.route("example-3"),this.route("example-4"),this.route("example-5")}))})),define("dummy/routes/index",["exports","@ember/routing/route","@ember/service"],(function(e,t,r){var i,n
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(i=class extends t.default{constructor(...e){var t,r,i,l
super(...e),t=this,r="router",l=this,(i=n)&&Object.defineProperty(t,r,{enumerable:i.enumerable,configurable:i.configurable,writable:i.writable,value:i.initializer?i.initializer.call(l):void 0})}redirect(){return this.router.transitionTo("example-1")}},l=i.prototype,o="router",a=[r.inject],u={configurable:!0,enumerable:!0,writable:!0,initializer:null},d={},Object.keys(u).forEach((function(e){d[e]=u[e]})),d.enumerable=!!d.enumerable,d.configurable=!!d.configurable,("value"in d||d.initializer)&&(d.writable=!0),d=a.slice().reverse().reduce((function(e,t){return t(l,o,e)||e}),d),c&&void 0!==d.initializer&&(d.value=d.initializer?d.initializer.call(c):void 0,d.initializer=void 0),void 0===d.initializer&&(Object.defineProperty(l,o,d),d=null),n=d,i)
var l,o,a,u,c,d})),define("dummy/templates/application",["exports","@ember/template-factory"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(0,t.createTemplateFactory)({id:"6qBApvVI",block:'[[[10,"h1"],[12],[1,"\\n  @zestia/ember-simple-infinite-scroller\\n"],[13],[1,"\\n\\n"],[8,[39,0],null,[["@route"],["example-1"]],[["default"],[[[[1,"\\n  Example 1\\n"]],[]]]]],[1,"\\n|\\n"],[8,[39,0],null,[["@route"],["example-2"]],[["default"],[[[[1,"\\n  Example 2\\n"]],[]]]]],[1,"\\n|\\n"],[8,[39,0],null,[["@route"],["example-3"]],[["default"],[[[[1,"\\n  Example 3\\n"]],[]]]]],[1,"\\n|\\n"],[8,[39,0],null,[["@route"],["example-4"]],[["default"],[[[[1,"\\n  Example 4\\n"]],[]]]]],[1,"\\n|\\n"],[8,[39,0],null,[["@route"],["example-5"]],[["default"],[[[[1,"\\n  Example 5\\n"]],[]]]]],[1,"\\n\\n"],[10,2],[12],[1,"\\n  "],[10,"label"],[12],[1,"\\n    Load delay:\\n    "],[10,"br"],[12],[13],[1,"\\n    "],[11,"input"],[16,2,[30,0,["loadDelay"]]],[24,4,"number"],[4,[38,1],["input",[30,0,["setLoadDelay"]]],null],[12],[13],[1,"\\n  "],[13],[1,"\\n"],[13],[1,"\\n\\n"],[46,[28,[37,3],null,null],null,null,null],[1,"\\n\\n"],[10,3],[14,6,"https://github.com/zestia/ember-simple-infinite-scroller"],[12],[1,"\\n  "],[10,"img"],[14,5,"position: absolute; top: 0; right: 0; border: 0;"],[14,"width","149"],[14,"height","149"],[14,"src","https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149"],[14,0,"attachment-full size-full"],[14,"alt","Fork me on GitHub"],[14,"data-recalc-dims","1"],[12],[13],[1,"\\n"],[13]],[],false,["link-to","on","component","-outlet"]]',moduleName:"dummy/templates/application.hbs",isStrictMode:!1})})),define("dummy/templates/example-1",["exports","@ember/template-factory"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(0,t.createTemplateFactory)({id:"AIklKy82",block:'[[[10,2],[12],[1,"\\n  An action is fired when infinite scroll component is scrolled to the very\\n  bottom\\n"],[13],[1,"\\n\\n"],[8,[39,0],[[24,0,"example-1"]],[["@percentDown","@onLoadMore"],[100,[30,0,["handleLoadMore"]]]],[["default"],[[[[1,"\\n"],[42,[28,[37,2],[[28,[37,2],[[30,0,["things"]]],null]],null],null,[[[1,"    "],[10,0],[14,0,"thing"],[12],[1,"\\n      "],[1,[30,2,["name"]]],[1,"\\n    "],[13],[1,"\\n"]],[2]],null],[41,[30,1,["isLoading"]],[[[1,"    "],[10,0],[14,0,"status"],[12],[1,"\\n      Loading...\\n    "],[13],[1,"\\n"]],[]],null]],[1]]]]]],["scroller","thing"],false,["infinite-scroller","each","-track-array","if"]]',moduleName:"dummy/templates/example-1.hbs",isStrictMode:!1})})),define("dummy/templates/example-2",["exports","@ember/template-factory"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(0,t.createTemplateFactory)({id:"Pa96NaPt",block:'[[[10,2],[12],[1,"\\n  An action is fired when document is scrolled to the very bottom\\n"],[13],[1,"\\n"],[10,2],[12],[1,"\\n  Note that if there is no scroll movement available (due to lack of enough\\n  items to cause overflow), you can display a button to manually load more.\\n"],[13],[1,"\\n\\n"],[8,[39,0],[[24,0,"example-2"]],[["@percentDown","@onLoadMore","@element"],[100,[30,0,["handleLoadMore"]],[30,0,["document"]]]],[["default"],[[[[1,"\\n"],[42,[28,[37,2],[[28,[37,2],[[30,0,["things"]]],null]],null],null,[[[1,"    "],[10,0],[14,0,"thing"],[12],[1,"\\n      "],[1,[30,2,["name"]]],[1,"\\n    "],[13],[1,"\\n"]],[2]],null],[1,"\\n"],[41,[51,[30,1,["isScrollable"]]],[[[1,"    "],[11,"button"],[24,4,"button"],[4,[38,4],["click",[28,[37,5],[[30,1,["loadMore"]],"DOWN"],null]],null],[12],[1,"\\n      Load more\\n    "],[13],[1,"\\n"]],[]],null],[1,"\\n"],[41,[30,1,["isLoading"]],[[[1,"    "],[10,0],[14,0,"status"],[12],[1,"\\n      Loading...\\n    "],[13],[1,"\\n"]],[]],null]],[1]]]]]],["scroller","thing"],false,["infinite-scroller","each","-track-array","unless","on","fn","if"]]',moduleName:"dummy/templates/example-2.hbs",isStrictMode:!1})})),define("dummy/templates/example-3",["exports","@ember/template-factory"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(0,t.createTemplateFactory)({id:"B7Pl5cbZ",block:'[[[10,2],[12],[1,"\\n  An action is fired when the infinite scroll component is scrolled to 50%\\n"],[13],[1,"\\n\\n"],[8,[39,0],[[24,0,"example-3"]],[["@percentDown","@onLoadMore","@debounce"],[50,[30,0,["handleLoadMore"]],10]],[["default"],[[[[1,"\\n"],[42,[28,[37,2],[[28,[37,2],[[30,0,["things"]]],null]],null],null,[[[1,"    "],[10,0],[14,0,"thing"],[12],[1,"\\n      "],[1,[30,2,["name"]]],[1,"\\n    "],[13],[1,"\\n"]],[2]],null],[41,[30,1,["isLoading"]],[[[1,"    "],[10,0],[14,0,"status"],[12],[1,"\\n      Loading...\\n    "],[13],[1,"\\n"]],[]],null]],[1]]]]]],["scroller","thing"],false,["infinite-scroller","each","-track-array","if"]]',moduleName:"dummy/templates/example-3.hbs",isStrictMode:!1})})),define("dummy/templates/example-4",["exports","@ember/template-factory"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(0,t.createTemplateFactory)({id:"VB0tKgRl",block:'[[[10,2],[12],[1,"\\n  An action is fired when a specific element is scrolled to the very bottom\\n"],[13],[1,"\\n\\n"],[8,[39,0],[[24,0,"example-4"]],[["@percentDown","@element","@onLoadMore"],[100,[30,0,["scroller"]],[30,0,["handleLoadMore"]]]],[["default"],[[[[1,"\\n  "],[11,0],[24,0,"internal-element"],[4,[30,0,["setScroller"]],null,null],[12],[1,"\\n"],[42,[28,[37,2],[[28,[37,2],[[30,0,["things"]]],null]],null],null,[[[1,"      "],[10,0],[14,0,"thing"],[12],[1,"\\n        "],[1,[30,2,["name"]]],[1,"\\n      "],[13],[1,"\\n"]],[2]],null],[1,"  "],[13],[1,"\\n"],[41,[30,1,["isLoading"]],[[[1,"    "],[10,0],[14,0,"status"],[12],[1,"\\n      Loading...\\n    "],[13],[1,"\\n"]],[]],null]],[1]]]]]],["scroller","thing"],false,["infinite-scroller","each","-track-array","if"]]',moduleName:"dummy/templates/example-4.hbs",isStrictMode:!1})})),define("dummy/templates/example-5",["exports","@ember/template-factory"],(function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
e.default=(0,t.createTemplateFactory)({id:"i4oqf5QH",block:'[[[10,2],[12],[1,"\\n  An action is fired when infinite scroll component is scrolled to the very top\\n"],[13],[1,"\\n\\n"],[8,[39,0],[[24,0,"example-1"]],[["@percentUp","@onLoadMore"],[0,[30,0,["handleLoadMore"]]]],[["default"],[[[[1,"\\n"],[41,[30,1,["isLoading"]],[[[1,"    "],[10,0],[14,0,"status"],[12],[1,"\\n      Loading...\\n    "],[13],[1,"\\n"]],[]],null],[42,[28,[37,3],[[28,[37,3],[[30,0,["things"]]],null]],null],null,[[[1,"    "],[11,0],[24,0,"thing"],[4,[30,0,["scrollIntoView"]],null,null],[12],[1,"\\n      "],[1,[30,2,["name"]]],[1,"\\n    "],[13],[1,"\\n"]],[2]],null]],[1]]]]]],["scroller","thing"],false,["infinite-scroller","if","each","-track-array"]]',moduleName:"dummy/templates/example-5.hbs",isStrictMode:!1})})),define("dummy/utils/generate-things",["exports"],(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,t){const r=[]
for(let i=e;i<=t;i+=1)r.push({id:i,name:`Thing ${i}`})
return r}})),define("dummy/config/environment",[],(function(){try{var e="dummy/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),r={default:JSON.parse(decodeURIComponent(t))}
return Object.defineProperty(r,"__esModule",{value:!0}),r}catch(i){throw new Error('Could not read config from meta tag with name "'+e+'".')}})),runningTests||require("dummy/app").default.create({})
