/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var inspirationArchitectFactory = __webpack_require__(1);

	var should = __webpack_require__(2);

	var _get = __webpack_require__(31);
	var _set = __webpack_require__(73);

	var globalTests = __webpack_require__(77);
	var factoryTests = __webpack_require__(78);

	function requireAll(r) {

	    var hash = {};
	    r.keys().forEach(function(key) {
	        var pieces = key.split('/');
	        hash[pieces[pieces.length - 1]] = r(key);
	    });
	    return hash;
	}
	var config_files = requireAll(__webpack_require__(79));
	config_files['.env'] = __webpack_require__(82);
	var empty_config_files = requireAll(__webpack_require__(83));
	var provider_files = requireAll(__webpack_require__(84));
	var empty_provider_files = requireAll(__webpack_require__(83));

	factoryTests(inspirationArchitectFactory);

	describe('webpack tests', function() {

	    describe('different config files', function() {

	        var factory_config = {
	            config_files: config_files
	        };

	        var Inspiration = inspirationArchitectFactory(factory_config);

	        it('should run the basic tests', function() {

	            globalTests(Inspiration);
	        });

	        it('should honor the server config files', function(done) {

	            var inspiration = new Inspiration();

	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }
	                should(inspiration.app.config('a_sample')).equal('one');
	                should(inspiration.app.config('b_sample')).equal('two');
	                should(inspiration.app.config('e_sample.f_sample.g_sample')).equal(5);
	                should(inspiration.app.config('external.h_sample')).equal('hello');
	                done();
	            });
	        });

	        it('should be able to overwrite server config files', function(done) {

	            var config = {
	                a_sample: 'overwritten',
	                b_sample: 'also overwritten',
	                external: {
	                    h_sample: 'this is also overwritten'
	                }
	            };
	            var inspiration = new Inspiration({
	                config: config
	            });

	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }
	                should(inspiration.app.config('a_sample')).equal(config.a_sample);
	                should(inspiration.app.config('b_sample')).equal(config.b_sample);
	                should(inspiration.app.config('external.h_sample')).equal(config.external.h_sample);
	                should(inspiration.app.config('external.i_sample')).not.equal(undefined);
	                done();
	            });
	        });

	    });

	    describe('no config files', function() {

	        var factory_config = {
	            config_files: empty_config_files
	        };

	        var Inspiration = inspirationArchitectFactory(factory_config);

	        it('should run the basic tests', function() {

	            globalTests(Inspiration);
	        });

	        it('should be able to overwrite empty server config files', function(done) {

	            var config = {
	                a_sample: 'overwritten',
	                b_sample: 'also overwritten',
	                external: {
	                    h_sample: 'this is also overwritten'
	                }
	            };
	            var inspiration = new Inspiration({
	                config: config
	            });

	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }
	                should(inspiration.app.config('a_sample')).equal(config.a_sample);
	                should(inspiration.app.config('b_sample')).equal(config.b_sample);
	                should(inspiration.app.config('external.h_sample')).equal(config.external.h_sample);
	                done();
	            });
	        });
	    });

	    describe('reference server providers', function() {

	        var factory_config = {
	            provider_files: provider_files
	        };

	        var Inspiration = inspirationArchitectFactory(factory_config);

	        it('should run the server providers based on the config', function(done) {

	            var inspiration = new Inspiration({
	                config: {
	                    providers: [
	                        'addSomethingAsync',
	                        'addSomething',
	                        function(app, done) {
	                            app.doSomethingElse = function() {

	                                return 3;
	                            };
	                            done();
	                        }
	                    ]
	                }
	            });

	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }

	                inspiration.app.doSomethingAsync().should.equal(1);
	                inspiration.app.doSomething().should.equal(2);
	                inspiration.app.doSomethingElse().should.equal(3);

	                done();
	            });

	        });
	    });

	    describe('no provider files', function() {

	        var factory_config = {
	            provider_files: empty_provider_files
	        };

	        var Inspiration = inspirationArchitectFactory(factory_config);

	        it('should run the basic tests', function() {

	            globalTests(Inspiration);
	        });

	        it('should still run initial providers', function(done) {

	            var inspiration = new Inspiration({
	                providers: [
	                    function(app, done) {

	                        app.something_property = 1;
	                        done();
	                    },
	                    function(app, done) {

	                        app.something_other_property = 2;
	                        done();
	                    }
	                ],
	                config: {
	                    providers: [
	                        function(app, done) {
	                            app.something_third_property = 3;
	                            done();
	                        }
	                    ]
	                }
	            });

	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }
	                inspiration.app.something_property.should.equal(1);
	                inspiration.app.something_other_property.should.equal(2);
	                inspiration.app.something_third_property.should.equal(3);
	                done();
	            });

	        });
	    });

	    describe('different factory config values combined', function() {

	        var config_env_filename = 'local';
	        var config_app_filename = 'application';
	        var config_providers_path = 'these.are.my.providers';
	        var app_config_path = 'locals.config';

	        var factory_config = {
	            config_files: {},
	            config_env_filename: config_env_filename,
	            config_app_filename: config_app_filename,
	            config_providers_path: config_providers_path,
	            app_config_path: app_config_path,
	            provider_files: provider_files
	        };
	        factory_config.config_files[config_env_filename] = {
	            greeting: 'aloha'
	        };
	        factory_config.config_files[config_app_filename] = {
	            greeting: 'hello',
	            parting: 'goodbye'
	        };
	        _set(factory_config.config_files[config_app_filename], config_providers_path, [
	            'addSomething'
	        ]);

	        var Inspiration = inspirationArchitectFactory(factory_config);

	        it('should honor the factory config', function(done) {

	            var inspiration = new Inspiration();
	            inspiration.test = true;
	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }

	                var config = _get(inspiration.app, app_config_path);
	                should(config('greeting')).equal('aloha');
	                should(config('parting')).equal('goodbye');
	                inspiration.app.doSomething().should.equal(2);
	                done();
	            });
	        });

	    });

	});




/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;/* WEBPACK VAR INJECTION */(function(global) {!function(t){if(true)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.inspirationArchitectFactory=t()}}(function(){return function t(e,r,n){function o(a,c){if(!r[a]){if(!e[a]){var s="function"==typeof require&&require;if(!c&&s)return require(a,!0);if(i)return i(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var f=r[a]={exports:{}};e[a][0].call(f.exports,function(t){var r=e[a][1][t];return o(r?r:t)},f,f.exports,t,e,r,n)}return r[a].exports}for(var i="function"==typeof require&&require,a=0;a<n.length;a++)o(n[a]);return o}({1:[function(t,e,r){},{}],2:[function(t,e,r){(function(t){function e(t,e){for(var r=0,n=t.length-1;n>=0;n--){var o=t[n];"."===o?t.splice(n,1):".."===o?(t.splice(n,1),r++):r&&(t.splice(n,1),r--)}if(e)for(;r--;r)t.unshift("..");return t}function n(t,e){if(t.filter)return t.filter(e);for(var r=[],n=0;n<t.length;n++)e(t[n],n,t)&&r.push(t[n]);return r}var o=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,i=function(t){return o.exec(t).slice(1)};r.resolve=function(){for(var r="",o=!1,i=arguments.length-1;i>=-1&&!o;i--){var a=i>=0?arguments[i]:t.cwd();if("string"!=typeof a)throw new TypeError("Arguments to path.resolve must be strings");a&&(r=a+"/"+r,o="/"===a.charAt(0))}return r=e(n(r.split("/"),function(t){return!!t}),!o).join("/"),(o?"/":"")+r||"."},r.normalize=function(t){var o=r.isAbsolute(t),i="/"===a(t,-1);return t=e(n(t.split("/"),function(t){return!!t}),!o).join("/"),t||o||(t="."),t&&i&&(t+="/"),(o?"/":"")+t},r.isAbsolute=function(t){return"/"===t.charAt(0)},r.join=function(){var t=Array.prototype.slice.call(arguments,0);return r.normalize(n(t,function(t,e){if("string"!=typeof t)throw new TypeError("Arguments to path.join must be strings");return t}).join("/"))},r.relative=function(t,e){function n(t){for(var e=0;e<t.length&&""===t[e];e++);for(var r=t.length-1;r>=0&&""===t[r];r--);return e>r?[]:t.slice(e,r-e+1)}t=r.resolve(t).substr(1),e=r.resolve(e).substr(1);for(var o=n(t.split("/")),i=n(e.split("/")),a=Math.min(o.length,i.length),c=a,s=0;a>s;s++)if(o[s]!==i[s]){c=s;break}for(var u=[],s=c;s<o.length;s++)u.push("..");return u=u.concat(i.slice(c)),u.join("/")},r.sep="/",r.delimiter=":",r.dirname=function(t){var e=i(t),r=e[0],n=e[1];return r||n?(n&&(n=n.substr(0,n.length-1)),r+n):"."},r.basename=function(t,e){var r=i(t)[2];return e&&r.substr(-1*e.length)===e&&(r=r.substr(0,r.length-e.length)),r},r.extname=function(t){return i(t)[3]};var a="b"==="ab".substr(-1)?function(t,e,r){return t.substr(e,r)}:function(t,e,r){return 0>e&&(e=t.length+e),t.substr(e,r)}}).call(this,t("_process"))},{_process:3}],3:[function(t,e,r){function n(){f=!1,c.length?u=c.concat(u):p=-1,u.length&&o()}function o(){if(!f){var t=setTimeout(n);f=!0;for(var e=u.length;e;){for(c=u,u=[];++p<e;)c&&c[p].run();p=-1,e=u.length}c=null,f=!1,clearTimeout(t)}}function i(t,e){this.fun=t,this.array=e}function a(){}var c,s=e.exports={},u=[],f=!1,p=-1;s.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];u.push(new i(t,e)),1!==u.length||f||setTimeout(o,0)},i.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=a,s.addListener=a,s.once=a,s.off=a,s.removeListener=a,s.removeAllListeners=a,s.emit=a,s.binding=function(t){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(t){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}},{}],4:[function(t,e,r){var n=t("./_getNative"),o=t("./_root"),i=n(o,"DataView");e.exports=i},{"./_getNative":62,"./_root":90}],5:[function(t,e,r){function n(){}var o=t("./_nativeCreate"),i=Object.prototype;n.prototype=o?o(null):i,e.exports=n},{"./_nativeCreate":89}],6:[function(t,e,r){var n=t("./_getNative"),o=t("./_root"),i=n(o,"Map");e.exports=i},{"./_getNative":62,"./_root":90}],7:[function(t,e,r){function n(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}var o=t("./_mapClear"),i=t("./_mapDelete"),a=t("./_mapGet"),c=t("./_mapHas"),s=t("./_mapSet");n.prototype.clear=o,n.prototype["delete"]=i,n.prototype.get=a,n.prototype.has=c,n.prototype.set=s,e.exports=n},{"./_mapClear":82,"./_mapDelete":83,"./_mapGet":84,"./_mapHas":85,"./_mapSet":86}],8:[function(t,e,r){var n=t("./_getNative"),o=t("./_root"),i=n(o,"Promise");e.exports=i},{"./_getNative":62,"./_root":90}],9:[function(t,e,r){var n=t("./_root"),o=n.Reflect;e.exports=o},{"./_root":90}],10:[function(t,e,r){var n=t("./_getNative"),o=t("./_root"),i=n(o,"Set");e.exports=i},{"./_getNative":62,"./_root":90}],11:[function(t,e,r){function n(t){var e=-1,r=t?t.length:0;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}var o=t("./_stackClear"),i=t("./_stackDelete"),a=t("./_stackGet"),c=t("./_stackHas"),s=t("./_stackSet");n.prototype.clear=o,n.prototype["delete"]=i,n.prototype.get=a,n.prototype.has=c,n.prototype.set=s,e.exports=n},{"./_stackClear":92,"./_stackDelete":93,"./_stackGet":94,"./_stackHas":95,"./_stackSet":96}],12:[function(t,e,r){var n=t("./_root"),o=n.Symbol;e.exports=o},{"./_root":90}],13:[function(t,e,r){var n=t("./_root"),o=n.Uint8Array;e.exports=o},{"./_root":90}],14:[function(t,e,r){var n=t("./_getNative"),o=t("./_root"),i=n(o,"WeakMap");e.exports=i},{"./_getNative":62,"./_root":90}],15:[function(t,e,r){function n(t,e){return t.set(e[0],e[1]),t}e.exports=n},{}],16:[function(t,e,r){function n(t,e){return t.add(e),t}e.exports=n},{}],17:[function(t,e,r){function n(t,e,r){var n=r.length;switch(n){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}e.exports=n},{}],18:[function(t,e,r){function n(t,e){for(var r=-1,n=t.length;++r<n&&e(t[r],r,t)!==!1;);return t}e.exports=n},{}],19:[function(t,e,r){function n(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}e.exports=n},{}],20:[function(t,e,r){function n(t,e,r,n){var o=-1,i=t.length;for(n&&i&&(r=t[++o]);++o<i;)r=e(r,t[o],o,t);return r}e.exports=n},{}],21:[function(t,e,r){function n(t,e,r){(void 0===r||o(t[e],r))&&("number"!=typeof e||void 0!==r||e in t)||(t[e]=r)}var o=t("./eq");e.exports=n},{"./eq":103}],22:[function(t,e,r){function n(t,e,r){var n=t[e];a.call(t,e)&&o(n,r)&&(void 0!==r||e in t)||(t[e]=r)}var o=t("./eq"),i=Object.prototype,a=i.hasOwnProperty;e.exports=n},{"./eq":103}],23:[function(t,e,r){function n(t,e){var r=o(t,e);if(0>r)return!1;var n=t.length-1;return r==n?t.pop():a.call(t,r,1),!0}var o=t("./_assocIndexOf"),i=Array.prototype,a=i.splice;e.exports=n},{"./_assocIndexOf":26}],24:[function(t,e,r){function n(t,e){var r=o(t,e);return 0>r?void 0:t[r][1]}var o=t("./_assocIndexOf");e.exports=n},{"./_assocIndexOf":26}],25:[function(t,e,r){function n(t,e){return o(t,e)>-1}var o=t("./_assocIndexOf");e.exports=n},{"./_assocIndexOf":26}],26:[function(t,e,r){function n(t,e){for(var r=t.length;r--;)if(o(t[r][0],e))return r;return-1}var o=t("./eq");e.exports=n},{"./eq":103}],27:[function(t,e,r){function n(t,e,r){var n=o(t,e);0>n?t.push([e,r]):t[n][1]=r}var o=t("./_assocIndexOf");e.exports=n},{"./_assocIndexOf":26}],28:[function(t,e,r){function n(t,e){return t&&o(e,i(e),t)}var o=t("./_copyObject"),i=t("./keys");e.exports=n},{"./_copyObject":57,"./keys":119}],29:[function(t,e,r){function n(t,e,r,m,O,A,S){var P;if(m&&(P=A?m(t,O,A,S):m(t)),void 0!==P)return P;if(!d(t))return t;var I=b(t);if(I){if(P=_(t),!e)return u(t,P)}else{var C=l(t),T=C==w||C==k;if(g(t))return s(t,e);if(C==M||C==x||T&&!A){if(h(t))return A?t:{};if(P=v(T?{}:t),!e)return f(t,c(P,t))}else{if(!W[C])return A?t:{};P=y(t,C,n,e)}}S||(S=new o);var E=S.get(t);if(E)return E;if(S.set(t,P),!I)var L=r?p(t):j(t);return i(L||t,function(o,i){L&&(i=o,o=t[i]),a(P,i,n(o,e,r,m,i,t,S))}),P}var o=t("./_Stack"),i=t("./_arrayEach"),a=t("./_assignValue"),c=t("./_baseAssign"),s=t("./_cloneBuffer"),u=t("./_copyArray"),f=t("./_copySymbols"),p=t("./_getAllKeys"),l=t("./_getTag"),_=t("./_initCloneArray"),y=t("./_initCloneByTag"),v=t("./_initCloneObject"),b=t("./isArray"),g=t("./isBuffer"),h=t("./_isHostObject"),d=t("./isObject"),j=t("./keys"),x="[object Arguments]",m="[object Array]",O="[object Boolean]",A="[object Date]",S="[object Error]",w="[object Function]",k="[object GeneratorFunction]",P="[object Map]",I="[object Number]",M="[object Object]",C="[object RegExp]",T="[object Set]",E="[object String]",L="[object Symbol]",F="[object WeakMap]",D="[object ArrayBuffer]",K="[object DataView]",N="[object Float32Array]",H="[object Float64Array]",B="[object Int8Array]",V="[object Int16Array]",G="[object Int32Array]",U="[object Uint8Array]",$="[object Uint8ClampedArray]",R="[object Uint16Array]",q="[object Uint32Array]",W={};W[x]=W[m]=W[D]=W[K]=W[O]=W[A]=W[N]=W[H]=W[B]=W[V]=W[G]=W[P]=W[I]=W[M]=W[C]=W[T]=W[E]=W[L]=W[U]=W[$]=W[R]=W[q]=!0,W[S]=W[w]=W[F]=!1,e.exports=n},{"./_Stack":11,"./_arrayEach":18,"./_assignValue":22,"./_baseAssign":28,"./_cloneBuffer":49,"./_copyArray":56,"./_copySymbols":58,"./_getAllKeys":60,"./_getTag":65,"./_initCloneArray":72,"./_initCloneByTag":73,"./_initCloneObject":74,"./_isHostObject":75,"./isArray":106,"./isBuffer":109,"./isObject":113,"./keys":119}],30:[function(t,e,r){function n(t){return o(t)?i(t):{}}var o=t("./isObject"),i=Object.create;e.exports=n},{"./isObject":113}],31:[function(t,e,r){function n(t,e){e=i(e,t)?[e]:o(e);for(var r=0,n=e.length;null!=t&&n>r;)t=t[a(e[r++])];return r&&r==n?t:void 0}var o=t("./_castPath"),i=t("./_isKey"),a=t("./_toKey");e.exports=n},{"./_castPath":44,"./_isKey":78,"./_toKey":99}],32:[function(t,e,r){function n(t,e,r){var n=e(t);return i(t)?n:o(n,r(t))}var o=t("./_arrayPush"),i=t("./isArray");e.exports=n},{"./_arrayPush":19,"./isArray":106}],33:[function(t,e,r){function n(t,e){return a.call(t,e)||"object"==typeof t&&e in t&&null===o(t)}var o=t("./_getPrototype"),i=Object.prototype,a=i.hasOwnProperty;e.exports=n},{"./_getPrototype":63}],34:[function(t,e,r){function n(t,e,r){if(e!==e)return o(t,r);for(var n=r-1,i=t.length;++n<i;)if(t[n]===e)return n;return-1}var o=t("./_indexOfNaN");e.exports=n},{"./_indexOfNaN":71}],35:[function(t,e,r){function n(t){return o(Object(t))}var o=Object.keys;e.exports=n},{}],36:[function(t,e,r){function n(t){t=null==t?t:Object(t);var e=[];for(var r in t)e.push(r);return e}var o=t("./_Reflect"),i=t("./_iteratorToArray"),a=Object.prototype,c=o?o.enumerate:void 0,s=a.propertyIsEnumerable;c&&!s.call({valueOf:1},"valueOf")&&(n=function(t){return i(c(t))}),e.exports=n},{"./_Reflect":9,"./_iteratorToArray":81}],37:[function(t,e,r){function n(t,e,r,l,_){if(t!==e){if(!s(e)&&!f(e))var y=p(e);i(y||e,function(i,s){if(y&&(s=i,i=e[s]),u(i))_||(_=new o),c(t,e,s,r,n,l,_);else{var f=l?l(t[s],i,s+"",t,e,_):void 0;void 0===f&&(f=i),a(t,s,f)}})}}var o=t("./_Stack"),i=t("./_arrayEach"),a=t("./_assignMergeValue"),c=t("./_baseMergeDeep"),s=t("./isArray"),u=t("./isObject"),f=t("./isTypedArray"),p=t("./keysIn");e.exports=n},{"./_Stack":11,"./_arrayEach":18,"./_assignMergeValue":21,"./_baseMergeDeep":38,"./isArray":106,"./isObject":113,"./isTypedArray":118,"./keysIn":120}],38:[function(t,e,r){function n(t,e,r,n,v,b,g){var h=t[r],d=e[r],j=g.get(d);if(j)return void o(t,r,j);var x=b?b(h,d,r+"",t,e,g):void 0,m=void 0===x;m&&(x=d,s(d)||_(d)?s(h)?x=h:u(h)?x=a(h):(m=!1,x=i(d,!0)):l(d)||c(d)?c(h)?x=y(h):!p(h)||n&&f(h)?(m=!1,x=i(d,!0)):x=h:m=!1),g.set(d,x),m&&v(x,d,n,b,g),g["delete"](d),o(t,r,x)}var o=t("./_assignMergeValue"),i=t("./_baseClone"),a=t("./_copyArray"),c=t("./isArguments"),s=t("./isArray"),u=t("./isArrayLikeObject"),f=t("./isFunction"),p=t("./isObject"),l=t("./isPlainObject"),_=t("./isTypedArray"),y=t("./toPlainObject");e.exports=n},{"./_assignMergeValue":21,"./_baseClone":29,"./_copyArray":56,"./isArguments":105,"./isArray":106,"./isArrayLikeObject":108,"./isFunction":110,"./isObject":113,"./isPlainObject":115,"./isTypedArray":118,"./toPlainObject":127}],39:[function(t,e,r){function n(t){return function(e){return null==e?void 0:e[t]}}e.exports=n},{}],40:[function(t,e,r){function n(t,e,r,n){e=c(e,t)?[e]:i(e);for(var f=-1,p=e.length,l=p-1,_=t;null!=_&&++f<p;){var y=u(e[f]);if(s(_)){var v=r;if(f!=l){var b=_[y];v=n?n(b,y,_):void 0,void 0===v&&(v=null==b?a(e[f+1])?[]:{}:b)}o(_,y,v)}_=_[y]}return t}var o=t("./_assignValue"),i=t("./_castPath"),a=t("./_isIndex"),c=t("./_isKey"),s=t("./isObject"),u=t("./_toKey");e.exports=n},{"./_assignValue":22,"./_castPath":44,"./_isIndex":76,"./_isKey":78,"./_toKey":99,"./isObject":113}],41:[function(t,e,r){function n(t,e,r){var n=-1,o=t.length;0>e&&(e=-e>o?0:o+e),r=r>o?o:r,0>r&&(r+=o),o=e>r?0:r-e>>>0,e>>>=0;for(var i=Array(o);++n<o;)i[n]=t[n+e];return i}e.exports=n},{}],42:[function(t,e,r){function n(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}e.exports=n},{}],43:[function(t,e,r){function n(t){if("string"==typeof t)return t;if(i(t))return s?s.call(t):"";var e=t+"";return"0"==e&&1/t==-a?"-0":e}var o=t("./_Symbol"),i=t("./isSymbol"),a=1/0,c=o?o.prototype:void 0,s=c?c.toString:void 0;e.exports=n},{"./_Symbol":12,"./isSymbol":117}],44:[function(t,e,r){function n(t){return o(t)?t:i(t)}var o=t("./isArray"),i=t("./_stringToPath");e.exports=n},{"./_stringToPath":98,"./isArray":106}],45:[function(t,e,r){function n(t,e,r){var n=t.length;return r=void 0===r?n:r,!e&&r>=n?t:o(t,e,r)}var o=t("./_baseSlice");e.exports=n},{"./_baseSlice":41}],46:[function(t,e,r){function n(t,e){for(var r=t.length;r--&&o(e,t[r],0)>-1;);return r}var o=t("./_baseIndexOf");e.exports=n},{"./_baseIndexOf":34}],47:[function(t,e,r){function n(t){return t&&t.Object===Object?t:null}e.exports=n},{}],48:[function(t,e,r){function n(t){var e=new t.constructor(t.byteLength);return new o(e).set(new o(t)),e}var o=t("./_Uint8Array");e.exports=n},{"./_Uint8Array":13}],49:[function(t,e,r){function n(t,e){if(e)return t.slice();var r=new t.constructor(t.length);return t.copy(r),r}e.exports=n},{}],50:[function(t,e,r){function n(t,e){var r=e?o(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var o=t("./_cloneArrayBuffer");e.exports=n},{"./_cloneArrayBuffer":48}],51:[function(t,e,r){function n(t,e,r){var n=e?r(a(t),!0):a(t);return i(n,o,new t.constructor)}var o=t("./_addMapEntry"),i=t("./_arrayReduce"),a=t("./_mapToArray");e.exports=n},{"./_addMapEntry":15,"./_arrayReduce":20,"./_mapToArray":87}],52:[function(t,e,r){function n(t){var e=new t.constructor(t.source,o.exec(t));return e.lastIndex=t.lastIndex,e}var o=/\w*$/;e.exports=n},{}],53:[function(t,e,r){function n(t,e,r){var n=e?r(a(t),!0):a(t);return i(n,o,new t.constructor)}var o=t("./_addSetEntry"),i=t("./_arrayReduce"),a=t("./_setToArray");e.exports=n},{"./_addSetEntry":16,"./_arrayReduce":20,"./_setToArray":91}],54:[function(t,e,r){function n(t){return a?Object(a.call(t)):{}}var o=t("./_Symbol"),i=o?o.prototype:void 0,a=i?i.valueOf:void 0;e.exports=n},{"./_Symbol":12}],55:[function(t,e,r){function n(t,e){var r=e?o(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var o=t("./_cloneArrayBuffer");e.exports=n},{"./_cloneArrayBuffer":48}],56:[function(t,e,r){function n(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}e.exports=n},{}],57:[function(t,e,r){function n(t,e,r,n){r||(r={});for(var i=-1,a=e.length;++i<a;){var c=e[i],s=n?n(r[c],t[c],c,r,t):t[c];o(r,c,s)}return r}var o=t("./_assignValue");e.exports=n},{"./_assignValue":22}],58:[function(t,e,r){function n(t,e){return o(t,i(t),e)}var o=t("./_copyObject"),i=t("./_getSymbols");e.exports=n},{"./_copyObject":57,"./_getSymbols":64}],59:[function(t,e,r){function n(t){return i(function(e,r){var n=-1,i=r.length,a=i>1?r[i-1]:void 0,c=i>2?r[2]:void 0;for(a="function"==typeof a?(i--,a):void 0,c&&o(r[0],r[1],c)&&(a=3>i?void 0:a,i=1),e=Object(e);++n<i;){var s=r[n];s&&t(e,s,n,a)}return e})}var o=t("./_isIterateeCall"),i=t("./rest");e.exports=n},{"./_isIterateeCall":77,"./rest":123}],60:[function(t,e,r){function n(t){return o(t,a,i)}var o=t("./_baseGetAllKeys"),i=t("./_getSymbols"),a=t("./keys");e.exports=n},{"./_baseGetAllKeys":32,"./_getSymbols":64,"./keys":119}],61:[function(t,e,r){var n=t("./_baseProperty"),o=n("length");e.exports=o},{"./_baseProperty":39}],62:[function(t,e,r){function n(t,e){var r=t[e];return o(r)?r:void 0}var o=t("./isNative");e.exports=n},{"./isNative":112}],63:[function(t,e,r){function n(t){return o(Object(t))}var o=Object.getPrototypeOf;e.exports=n},{}],64:[function(t,e,r){function n(t){return o(Object(t))}var o=Object.getOwnPropertySymbols;o||(n=function(){return[]}),e.exports=n},{}],65:[function(t,e,r){function n(t){return g.call(t)}var o=t("./_DataView"),i=t("./_Map"),a=t("./_Promise"),c=t("./_Set"),s=t("./_WeakMap"),u=t("./_toSource"),f="[object Map]",p="[object Object]",l="[object Promise]",_="[object Set]",y="[object WeakMap]",v="[object DataView]",b=Object.prototype,g=b.toString,h=u(o),d=u(i),j=u(a),x=u(c),m=u(s);(o&&n(new o(new ArrayBuffer(1)))!=v||i&&n(new i)!=f||a&&n(a.resolve())!=l||c&&n(new c)!=_||s&&n(new s)!=y)&&(n=function(t){var e=g.call(t),r=e==p?t.constructor:void 0,n=r?u(r):void 0;if(n)switch(n){case h:return v;case d:return f;case j:return l;case x:return _;case m:return y}return e}),e.exports=n},{"./_DataView":4,"./_Map":6,"./_Promise":8,"./_Set":10,"./_WeakMap":14,"./_toSource":100}],66:[function(t,e,r){function n(t,e){return o(t,e)&&delete t[e]}var o=t("./_hashHas");e.exports=n},{"./_hashHas":68}],67:[function(t,e,r){function n(t,e){if(o){var r=t[e];return r===i?void 0:r}return c.call(t,e)?t[e]:void 0}var o=t("./_nativeCreate"),i="__lodash_hash_undefined__",a=Object.prototype,c=a.hasOwnProperty;e.exports=n},{"./_nativeCreate":89}],68:[function(t,e,r){function n(t,e){return o?void 0!==t[e]:a.call(t,e)}var o=t("./_nativeCreate"),i=Object.prototype,a=i.hasOwnProperty;e.exports=n},{"./_nativeCreate":89}],69:[function(t,e,r){function n(t,e,r){t[e]=o&&void 0===r?i:r}var o=t("./_nativeCreate"),i="__lodash_hash_undefined__";e.exports=n},{"./_nativeCreate":89}],70:[function(t,e,r){function n(t){var e=t?t.length:void 0;return c(e)&&(a(t)||s(t)||i(t))?o(e,String):null}var o=t("./_baseTimes"),i=t("./isArguments"),a=t("./isArray"),c=t("./isLength"),s=t("./isString");e.exports=n},{"./_baseTimes":42,"./isArguments":105,"./isArray":106,"./isLength":111,"./isString":116}],71:[function(t,e,r){function n(t,e,r){for(var n=t.length,o=e+(r?0:-1);r?o--:++o<n;){var i=t[o];if(i!==i)return o}return-1}e.exports=n},{}],72:[function(t,e,r){function n(t){var e=t.length,r=t.constructor(e);return e&&"string"==typeof t[0]&&i.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var o=Object.prototype,i=o.hasOwnProperty;e.exports=n},{}],73:[function(t,e,r){function n(t,e,r,n){var M=t.constructor;switch(e){case d:return o(t);case p:case l:return new M(+t);case j:return i(t,n);case x:case m:case O:case A:case S:case w:case k:case P:case I:return f(t,n);case _:return a(t,n,r);case y:case g:return new M(t);case v:return c(t);case b:return s(t,n,r);case h:return u(t)}}var o=t("./_cloneArrayBuffer"),i=t("./_cloneDataView"),a=t("./_cloneMap"),c=t("./_cloneRegExp"),s=t("./_cloneSet"),u=t("./_cloneSymbol"),f=t("./_cloneTypedArray"),p="[object Boolean]",l="[object Date]",_="[object Map]",y="[object Number]",v="[object RegExp]",b="[object Set]",g="[object String]",h="[object Symbol]",d="[object ArrayBuffer]",j="[object DataView]",x="[object Float32Array]",m="[object Float64Array]",O="[object Int8Array]",A="[object Int16Array]",S="[object Int32Array]",w="[object Uint8Array]",k="[object Uint8ClampedArray]",P="[object Uint16Array]",I="[object Uint32Array]";e.exports=n},{"./_cloneArrayBuffer":48,"./_cloneDataView":50,"./_cloneMap":51,"./_cloneRegExp":52,"./_cloneSet":53,"./_cloneSymbol":54,"./_cloneTypedArray":55}],74:[function(t,e,r){function n(t){return"function"!=typeof t.constructor||a(t)?{}:o(i(t))}var o=t("./_baseCreate"),i=t("./_getPrototype"),a=t("./_isPrototype");e.exports=n},{"./_baseCreate":30,"./_getPrototype":63,"./_isPrototype":80}],75:[function(t,e,r){function n(t){var e=!1;if(null!=t&&"function"!=typeof t.toString)try{e=!!(t+"")}catch(r){}return e}e.exports=n},{}],76:[function(t,e,r){function n(t,e){return e=null==e?o:e,!!e&&("number"==typeof t||i.test(t))&&t>-1&&t%1==0&&e>t}var o=9007199254740991,i=/^(?:0|[1-9]\d*)$/;e.exports=n},{}],77:[function(t,e,r){function n(t,e,r){if(!c(r))return!1;var n=typeof e;return("number"==n?i(r)&&a(e,r.length):"string"==n&&e in r)?o(r[e],t):!1}var o=t("./eq"),i=t("./isArrayLike"),a=t("./_isIndex"),c=t("./isObject");e.exports=n},{"./_isIndex":76,"./eq":103,"./isArrayLike":107,"./isObject":113}],78:[function(t,e,r){function n(t,e){if(o(t))return!1;var r=typeof t;return"number"==r||"symbol"==r||"boolean"==r||null==t||i(t)?!0:c.test(t)||!a.test(t)||null!=e&&t in Object(e)}var o=t("./isArray"),i=t("./isSymbol"),a=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,c=/^\w*$/;e.exports=n},{"./isArray":106,"./isSymbol":117}],79:[function(t,e,r){function n(t){var e=typeof t;return"string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t}e.exports=n},{}],80:[function(t,e,r){function n(t){var e=t&&t.constructor,r="function"==typeof e&&e.prototype||o;return t===r}var o=Object.prototype;e.exports=n},{}],81:[function(t,e,r){function n(t){for(var e,r=[];!(e=t.next()).done;)r.push(e.value);return r}e.exports=n},{}],82:[function(t,e,r){function n(){this.__data__={hash:new o,map:i?new i:[],string:new o}}var o=t("./_Hash"),i=t("./_Map");e.exports=n},{"./_Hash":5,"./_Map":6}],83:[function(t,e,r){function n(t){var e=this.__data__;return c(t)?a("string"==typeof t?e.string:e.hash,t):o?e.map["delete"](t):i(e.map,t)}var o=t("./_Map"),i=t("./_assocDelete"),a=t("./_hashDelete"),c=t("./_isKeyable");e.exports=n},{"./_Map":6,"./_assocDelete":23,"./_hashDelete":66,"./_isKeyable":79}],84:[function(t,e,r){function n(t){var e=this.__data__;return c(t)?a("string"==typeof t?e.string:e.hash,t):o?e.map.get(t):i(e.map,t)}var o=t("./_Map"),i=t("./_assocGet"),a=t("./_hashGet"),c=t("./_isKeyable");e.exports=n},{"./_Map":6,"./_assocGet":24,"./_hashGet":67,"./_isKeyable":79}],85:[function(t,e,r){function n(t){var e=this.__data__;return c(t)?a("string"==typeof t?e.string:e.hash,t):o?e.map.has(t):i(e.map,t)}var o=t("./_Map"),i=t("./_assocHas"),a=t("./_hashHas"),c=t("./_isKeyable");e.exports=n},{"./_Map":6,"./_assocHas":25,"./_hashHas":68,"./_isKeyable":79}],86:[function(t,e,r){function n(t,e){var r=this.__data__;return c(t)?a("string"==typeof t?r.string:r.hash,t,e):o?r.map.set(t,e):i(r.map,t,e),this}var o=t("./_Map"),i=t("./_assocSet"),a=t("./_hashSet"),c=t("./_isKeyable");e.exports=n},{"./_Map":6,"./_assocSet":27,"./_hashSet":69,"./_isKeyable":79}],87:[function(t,e,r){function n(t){var e=-1,r=Array(t.size);return t.forEach(function(t,n){r[++e]=[n,t]}),r}e.exports=n},{}],88:[function(t,e,r){function n(t,e,r,a,c,s){return i(t)&&i(e)&&o(t,e,void 0,n,s.set(e,t)),t}var o=t("./_baseMerge"),i=t("./isObject");e.exports=n},{"./_baseMerge":37,"./isObject":113}],89:[function(t,e,r){var n=t("./_getNative"),o=n(Object,"create");e.exports=o},{"./_getNative":62}],90:[function(t,e,r){(function(n){var o=t("./_checkGlobal"),i={"function":!0,object:!0},a=i[typeof r]&&r&&!r.nodeType?r:void 0,c=i[typeof e]&&e&&!e.nodeType?e:void 0,s=o(a&&c&&"object"==typeof n&&n),u=o(i[typeof self]&&self),f=o(i[typeof window]&&window),p=o(i[typeof this]&&this),l=s||f!==(p&&p.window)&&f||u||p||Function("return this")();e.exports=l}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./_checkGlobal":47}],91:[function(t,e,r){function n(t){var e=-1,r=Array(t.size);return t.forEach(function(t){r[++e]=t}),r}e.exports=n},{}],92:[function(t,e,r){function n(){this.__data__={array:[],map:null}}e.exports=n},{}],93:[function(t,e,r){function n(t){var e=this.__data__,r=e.array;return r?o(r,t):e.map["delete"](t)}var o=t("./_assocDelete");e.exports=n},{"./_assocDelete":23}],94:[function(t,e,r){function n(t){var e=this.__data__,r=e.array;return r?o(r,t):e.map.get(t)}var o=t("./_assocGet");e.exports=n},{"./_assocGet":24}],95:[function(t,e,r){function n(t){var e=this.__data__,r=e.array;return r?o(r,t):e.map.has(t)}var o=t("./_assocHas");e.exports=n},{"./_assocHas":25}],96:[function(t,e,r){function n(t,e){var r=this.__data__,n=r.array;n&&(n.length<a-1?i(n,t,e):(r.array=null,r.map=new o(n)));var c=r.map;return c&&c.set(t,e),this}var o=t("./_MapCache"),i=t("./_assocSet"),a=200;e.exports=n},{"./_MapCache":7,"./_assocSet":27}],97:[function(t,e,r){function n(t){return t.match(x)}var o="\\ud800-\\udfff",i="\\u0300-\\u036f\\ufe20-\\ufe23",a="\\u20d0-\\u20f0",c="\\ufe0e\\ufe0f",s="["+o+"]",u="["+i+a+"]",f="\\ud83c[\\udffb-\\udfff]",p="(?:"+u+"|"+f+")",l="[^"+o+"]",_="(?:\\ud83c[\\udde6-\\uddff]){2}",y="[\\ud800-\\udbff][\\udc00-\\udfff]",v="\\u200d",b=p+"?",g="["+c+"]?",h="(?:"+v+"(?:"+[l,_,y].join("|")+")"+g+b+")*",d=g+b+h,j="(?:"+[l+u+"?",u,_,y,s].join("|")+")",x=RegExp(f+"(?="+f+")|"+j+d,"g");e.exports=n},{}],98:[function(t,e,r){var n=t("./memoize"),o=t("./toString"),i=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g,a=/\\(\\)?/g,c=n(function(t){var e=[];return o(t).replace(i,function(t,r,n,o){e.push(n?o.replace(a,"$1"):r||t)}),e});e.exports=c},{"./memoize":121,"./toString":128}],99:[function(t,e,r){function n(t){if("string"==typeof t||o(t))return t;var e=t+"";return"0"==e&&1/t==-i?"-0":e}var o=t("./isSymbol"),i=1/0;e.exports=n},{"./isSymbol":117}],100:[function(t,e,r){function n(t){if(null!=t){try{return o.call(t)}catch(e){}try{return t+""}catch(e){}}return""}var o=Function.prototype.toString;e.exports=n},{}],101:[function(t,e,r){function n(t){return function(){return t}}e.exports=n},{}],102:[function(t,e,r){var n=t("./_apply"),o=t("./_mergeDefaults"),i=t("./mergeWith"),a=t("./rest"),c=a(function(t){return t.push(void 0,o),n(i,void 0,t)});e.exports=c},{"./_apply":17,"./_mergeDefaults":88,"./mergeWith":122,"./rest":123}],103:[function(t,e,r){function n(t,e){return t===e||t!==t&&e!==e}e.exports=n},{}],104:[function(t,e,r){function n(t,e,r){var n=null==t?void 0:o(t,e);return void 0===n?r:n}var o=t("./_baseGet");e.exports=n},{"./_baseGet":31}],105:[function(t,e,r){function n(t){return o(t)&&c.call(t,"callee")&&(!u.call(t,"callee")||s.call(t)==i)}var o=t("./isArrayLikeObject"),i="[object Arguments]",a=Object.prototype,c=a.hasOwnProperty,s=a.toString,u=a.propertyIsEnumerable;e.exports=n},{"./isArrayLikeObject":108}],106:[function(t,e,r){var n=Array.isArray;e.exports=n},{}],107:[function(t,e,r){function n(t){return null!=t&&a(o(t))&&!i(t)}var o=t("./_getLength"),i=t("./isFunction"),a=t("./isLength");e.exports=n},{"./_getLength":61,"./isFunction":110,"./isLength":111}],108:[function(t,e,r){function n(t){return i(t)&&o(t)}var o=t("./isArrayLike"),i=t("./isObjectLike");e.exports=n},{"./isArrayLike":107,"./isObjectLike":114}],109:[function(t,e,r){var n=t("./constant"),o=t("./_root"),i={"function":!0,object:!0},a=i[typeof r]&&r&&!r.nodeType?r:void 0,c=i[typeof e]&&e&&!e.nodeType?e:void 0,s=c&&c.exports===a?a:void 0,u=s?o.Buffer:void 0,f=u?function(t){return t instanceof u}:n(!1);e.exports=f},{"./_root":90,"./constant":101}],110:[function(t,e,r){function n(t){var e=o(t)?s.call(t):"";return e==i||e==a}var o=t("./isObject"),i="[object Function]",a="[object GeneratorFunction]",c=Object.prototype,s=c.toString;e.exports=n},{"./isObject":113}],111:[function(t,e,r){function n(t){return"number"==typeof t&&t>-1&&t%1==0&&o>=t}var o=9007199254740991;e.exports=n},{}],112:[function(t,e,r){function n(t){if(!a(t))return!1;var e=o(t)||i(t)?_:u;return e.test(c(t))}var o=t("./isFunction"),i=t("./_isHostObject"),a=t("./isObject"),c=t("./_toSource"),s=/[\\^$.*+?()[\]{}|]/g,u=/^\[object .+?Constructor\]$/,f=Object.prototype,p=Function.prototype.toString,l=f.hasOwnProperty,_=RegExp("^"+p.call(l).replace(s,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=n},{"./_isHostObject":75,"./_toSource":100,"./isFunction":110,"./isObject":113}],113:[function(t,e,r){function n(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}e.exports=n},{}],114:[function(t,e,r){function n(t){return!!t&&"object"==typeof t}e.exports=n},{}],115:[function(t,e,r){function n(t){if(!a(t)||l.call(t)!=c||i(t))return!1;var e=o(t);if(null===e)return!0;var r=f.call(e,"constructor")&&e.constructor;return"function"==typeof r&&r instanceof r&&u.call(r)==p}var o=t("./_getPrototype"),i=t("./_isHostObject"),a=t("./isObjectLike"),c="[object Object]",s=Object.prototype,u=Function.prototype.toString,f=s.hasOwnProperty,p=u.call(Object),l=s.toString;e.exports=n},{"./_getPrototype":63,"./_isHostObject":75,"./isObjectLike":114}],116:[function(t,e,r){function n(t){return"string"==typeof t||!o(t)&&i(t)&&s.call(t)==a}var o=t("./isArray"),i=t("./isObjectLike"),a="[object String]",c=Object.prototype,s=c.toString;e.exports=n},{"./isArray":106,"./isObjectLike":114}],117:[function(t,e,r){function n(t){return"symbol"==typeof t||o(t)&&c.call(t)==i}var o=t("./isObjectLike"),i="[object Symbol]",a=Object.prototype,c=a.toString;e.exports=n},{"./isObjectLike":114}],118:[function(t,e,r){function n(t){return i(t)&&o(t.length)&&!!M[T.call(t)]}var o=t("./isLength"),i=t("./isObjectLike"),a="[object Arguments]",c="[object Array]",s="[object Boolean]",u="[object Date]",f="[object Error]",p="[object Function]",l="[object Map]",_="[object Number]",y="[object Object]",v="[object RegExp]",b="[object Set]",g="[object String]",h="[object WeakMap]",d="[object ArrayBuffer]",j="[object DataView]",x="[object Float32Array]",m="[object Float64Array]",O="[object Int8Array]",A="[object Int16Array]",S="[object Int32Array]",w="[object Uint8Array]",k="[object Uint8ClampedArray]",P="[object Uint16Array]",I="[object Uint32Array]",M={};M[x]=M[m]=M[O]=M[A]=M[S]=M[w]=M[k]=M[P]=M[I]=!0,M[a]=M[c]=M[d]=M[s]=M[j]=M[u]=M[f]=M[p]=M[l]=M[_]=M[y]=M[v]=M[b]=M[g]=M[h]=!1;var C=Object.prototype,T=C.toString;e.exports=n},{"./isLength":111,"./isObjectLike":114}],119:[function(t,e,r){function n(t){var e=u(t);if(!e&&!c(t))return i(t);var r=a(t),n=!!r,f=r||[],p=f.length;for(var l in t)!o(t,l)||n&&("length"==l||s(l,p))||e&&"constructor"==l||f.push(l);return f}var o=t("./_baseHas"),i=t("./_baseKeys"),a=t("./_indexKeys"),c=t("./isArrayLike"),s=t("./_isIndex"),u=t("./_isPrototype");e.exports=n},{"./_baseHas":33,"./_baseKeys":35,"./_indexKeys":70,"./_isIndex":76,"./_isPrototype":80,"./isArrayLike":107}],120:[function(t,e,r){function n(t){for(var e=-1,r=c(t),n=o(t),s=n.length,f=i(t),p=!!f,l=f||[],_=l.length;++e<s;){var y=n[e];p&&("length"==y||a(y,_))||"constructor"==y&&(r||!u.call(t,y))||l.push(y)}return l}var o=t("./_baseKeysIn"),i=t("./_indexKeys"),a=t("./_isIndex"),c=t("./_isPrototype"),s=Object.prototype,u=s.hasOwnProperty;e.exports=n},{"./_baseKeysIn":36,"./_indexKeys":70,"./_isIndex":76,"./_isPrototype":80}],121:[function(t,e,r){function n(t,e){if("function"!=typeof t||e&&"function"!=typeof e)throw new TypeError(i);var r=function(){var n=arguments,o=e?e.apply(this,n):n[0],i=r.cache;if(i.has(o))return i.get(o);var a=t.apply(this,n);return r.cache=i.set(o,a),a};return r.cache=new(n.Cache||o),r}var o=t("./_MapCache"),i="Expected a function";n.Cache=o,e.exports=n},{"./_MapCache":7}],122:[function(t,e,r){var n=t("./_baseMerge"),o=t("./_createAssigner"),i=o(function(t,e,r,o){n(t,e,r,o)});e.exports=i},{"./_baseMerge":37,"./_createAssigner":59}],123:[function(t,e,r){function n(t,e){if("function"!=typeof t)throw new TypeError(a);return e=c(void 0===e?t.length-1:i(e),0),function(){for(var r=arguments,n=-1,i=c(r.length-e,0),a=Array(i);++n<i;)a[n]=r[e+n];switch(e){case 0:return t.call(this,a);case 1:return t.call(this,r[0],a);case 2:return t.call(this,r[0],r[1],a)}var s=Array(e+1);for(n=-1;++n<e;)s[n]=r[n];return s[e]=a,o(t,this,s)}}var o=t("./_apply"),i=t("./toInteger"),a="Expected a function",c=Math.max;e.exports=n},{"./_apply":17,"./toInteger":125}],124:[function(t,e,r){function n(t,e,r){
	return null==t?t:o(t,e,r)}var o=t("./_baseSet");e.exports=n},{"./_baseSet":40}],125:[function(t,e,r){function n(t){if(!t)return 0===t?t:0;if(t=o(t),t===i||t===-i){var e=0>t?-1:1;return e*a}var r=t%1;return t===t?r?t-r:t:0}var o=t("./toNumber"),i=1/0,a=1.7976931348623157e308;e.exports=n},{"./toNumber":126}],126:[function(t,e,r){function n(t){if("number"==typeof t)return t;if(a(t))return c;if(i(t)){var e=o(t.valueOf)?t.valueOf():t;t=i(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(s,"");var r=f.test(t);return r||p.test(t)?l(t.slice(2),r?2:8):u.test(t)?c:+t}var o=t("./isFunction"),i=t("./isObject"),a=t("./isSymbol"),c=NaN,s=/^\s+|\s+$/g,u=/^[-+]0x[0-9a-f]+$/i,f=/^0b[01]+$/i,p=/^0o[0-7]+$/i,l=parseInt;e.exports=n},{"./isFunction":110,"./isObject":113,"./isSymbol":117}],127:[function(t,e,r){function n(t){return o(t,i(t))}var o=t("./_copyObject"),i=t("./keysIn");e.exports=n},{"./_copyObject":57,"./keysIn":120}],128:[function(t,e,r){function n(t){return null==t?"":o(t)}var o=t("./_baseToString");e.exports=n},{"./_baseToString":43}],129:[function(t,e,r){function n(t,e,r){if(t=s(t),t&&(r||void 0===e))return t.replace(u,"");if(!t||!(e=o(e)))return t;var n=c(t),f=a(n,c(e))+1;return i(n,0,f).join("")}var o=t("./_baseToString"),i=t("./_castSlice"),a=t("./_charsEndIndex"),c=t("./_stringToArray"),s=t("./toString"),u=/\s+$/;e.exports=n},{"./_baseToString":43,"./_castSlice":45,"./_charsEndIndex":46,"./_stringToArray":97,"./toString":128}],130:[function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var o=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=t("lodash/isString"),a=t("lodash/isPlainObject"),c=t("lodash/isFunction"),s=t("lodash/get"),u=t("lodash/set"),f=t("lodash/defaultsDeep"),p=t("lodash/trimEnd");e.exports=function(e){var r={config_files:{},config_files_use_ext:".js",app_config_path:"config",config_env_filename:".env",config_app_filename:"app",config_providers_path:"providers",provider_files:{}};return e=f(e||{},r),function(){function l(t){n(this,l),t=f(t,{app:{},config:{},providers:[]}),this.app=t.app,this.config=t.config,this.providers=t.providers}return o(l,[{key:"loadConfig",value:function(r){var n=this;if(i(e.config_files)){var o=t("fs"),c=t("path");o.readdir(e.config_files,function(o,i){if(o)return r(o);for(var a={},s=0;s<i.length;s++){var u=i[s];a[u]=t(c.join(e.config_files,u))}n.useConfigFiles(a),r()})}else a(e.config_files)?(this.useConfigFiles(e.config_files),r()):(this.useConfigFiles(),r())}},{key:"useConfigFiles",value:function(t){t||(t={});var r={},n={},o={};for(var i in t){if(e.config_files_use_ext)var a=p(i,e.config_files_use_ext);var c=t[i];a===e.config_env_filename?n=c:a===e.config_app_filename?o=c:r[a]=c}var l=f({},this.config,n,o,r);u(this.app,e.app_config_path,function(t,e){return s(l,t,e)})}},{key:"loadProviders",value:function(r){var n=this,o=function(t){return t};if(i(e.provider_files)){var u=t("path");o=function(r){return t(u.join(e.provider_files,r))}}else a(e.provider_files)&&(o=function(t){return e.provider_files[t]||e.provider_files[p(t,".js")]||e.provider_files[t+".js"]});var f=s(this.app,e.app_config_path)(e.config_providers_path,[]),l=this.providers.concat(f),_=0,y=function v(t){if(t||_===l.length)return r(t);var a=l[_++];if(i(a)&&(a=o(a)),!c(a))return console.log(e.provider_files),v(new Error("Provider "+_+" is not a function."));try{a(n.app,v)}catch(t){v(t)}};y()}},{key:"init",value:function(t){var e=this,r=[function(t){e.loadConfig(t)},function(t){e.loadProviders(t)}],n=0,o=function i(o){if(o||n===r.length)return t(o,e.app);var a=r[n++];try{a(i)}catch(o){i(o)}};o()}}],[{key:"factory_config",get:function(){return e}},{key:"default_factory_config",get:function(){return r}}]),l}()}},{fs:1,"lodash/defaultsDeep":102,"lodash/get":104,"lodash/isFunction":110,"lodash/isPlainObject":115,"lodash/isString":116,"lodash/set":124,"lodash/trimEnd":129,path:2}]},{},[130])(130)});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var should = __webpack_require__(3);

	var defaultProto = Object.prototype;
	var defaultProperty = 'should';

	//Expose api via `Object#should`.
	try {
	  var prevShould = should.extend(defaultProperty, defaultProto);
	  should._prevShould = prevShould;
	} catch(e) {
	  //ignore errors
	}

	module.exports = should;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */


	var util = __webpack_require__(4);

	/**
	 * Our function should
	 *
	 * @param {*} obj Object to assert
	 * @returns {should.Assertion} Returns new Assertion for beginning assertion chain
	 * @example
	 *
	 * var should = require('should');
	 * should('abc').be.a.String();
	 */
	function should(obj) {
	  return (new should.Assertion(obj));
	}

	should.AssertionError = __webpack_require__(14);
	should.Assertion = __webpack_require__(15);

	should.format = util.format;
	should.type = __webpack_require__(5);
	should.util = util;

	/**
	 * Object with configuration.
	 * It contains such properties:
	 * * `checkProtoEql` boolean - Affect if `.eql` will check objects prototypes
	 * * `plusZeroAndMinusZeroEqual` boolean - Affect if `.eql` will treat +0 and -0 as equal
	 * Also it can contain options for should-format.
	 *
	 * @type {Object}
	 * @memberOf should
	 * @static
	 * @example
	 *
	 * var a = { a: 10 }, b = Object.create(null);
	 * b.a = 10;
	 *
	 * a.should.be.eql(b);
	 * //not throws
	 *
	 * should.config.checkProtoEql = true;
	 * a.should.be.eql(b);
	 * //throws AssertionError: expected { a: 10 } to equal { a: 10 } (because A and B have different prototypes)
	 */
	should.config = __webpack_require__(11);

	// Expose should to external world.
	exports = module.exports = should;

	/**
	 * Allow to extend given prototype with should property using given name. This getter will **unwrap** all standard wrappers like `Number`, `Boolean`, `String`.
	 * Using `should(obj)` is the equivalent of using `obj.should` with known issues (like nulls and method calls etc).
	 *
	 * To add new assertions, need to use Assertion.add method.
	 *
	 * @param {string} [propertyName] Name of property to add. Default is `'should'`.
	 * @param {Object} [proto] Prototype to extend with. Default is `Object.prototype`.
	 * @memberOf should
	 * @returns {{ name: string, descriptor: Object, proto: Object }} Descriptor enough to return all back
	 * @static
	 * @example
	 *
	 * var prev = should.extend('must', Object.prototype);
	 *
	 * 'abc'.must.startWith('a');
	 *
	 * var should = should.noConflict(prev);
	 * should.not.exist(Object.prototype.must);
	 */
	should.extend = function(propertyName, proto) {
	  propertyName = propertyName || 'should';
	  proto = proto || Object.prototype;

	  var prevDescriptor = Object.getOwnPropertyDescriptor(proto, propertyName);

	  Object.defineProperty(proto, propertyName, {
	    set: function() {
	    },
	    get: function() {
	      return should(util.isWrapperType(this) ? this.valueOf() : this);
	    },
	    configurable: true
	  });

	  return { name: propertyName, descriptor: prevDescriptor, proto: proto };
	};

	/**
	 * Delete previous extension. If `desc` missing it will remove default extension.
	 *
	 * @param {{ name: string, descriptor: Object, proto: Object }} [desc] Returned from `should.extend` object
	 * @memberOf should
	 * @returns {Function} Returns should function
	 * @static
	 * @example
	 *
	 * var should = require('should').noConflict();
	 *
	 * should(Object.prototype).not.have.property('should');
	 *
	 * var prev = should.extend('must', Object.prototype);
	 * 'abc'.must.startWith('a');
	 * should.noConflict(prev);
	 *
	 * should(Object.prototype).not.have.property('must');
	 */
	should.noConflict = function(desc) {
	  desc = desc || should._prevShould;

	  if (desc) {
	    delete desc.proto[desc.name];

	    if (desc.descriptor) {
	      Object.defineProperty(desc.proto, desc.name, desc.descriptor);
	    }
	  }
	  return should;
	};

	/**
	 * Simple utility function for a bit more easier should assertion extension
	 * @param {Function} f So called plugin function. It should accept 2 arguments: `should` function and `Assertion` constructor
	 * @memberOf should
	 * @returns {Function} Returns `should` function
	 * @static
	 * @example
	 *
	 * should.use(function(should, Assertion) {
	 *   Assertion.add('asset', function() {
	 *      this.params = { operator: 'to be asset' };
	 *
	 *      this.obj.should.have.property('id').which.is.a.Number();
	 *      this.obj.should.have.property('path');
	 *  })
	 * })
	 */
	should.use = function(f) {
	  f(should, should.Assertion);
	  return this;
	};

	should
	  .use(__webpack_require__(16))
	  .use(__webpack_require__(20))
	  .use(__webpack_require__(21))
	  .use(__webpack_require__(22))
	  .use(__webpack_require__(23))
	  .use(__webpack_require__(24))
	  .use(__webpack_require__(25))
	  .use(__webpack_require__(26))
	  .use(__webpack_require__(27))
	  .use(__webpack_require__(28))
	  .use(__webpack_require__(29))
	  .use(__webpack_require__(30));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	var type = __webpack_require__(5);
	var config = __webpack_require__(11);

	/**
	 * Check if given obj just a primitive type wrapper
	 * @param {Object} obj
	 * @returns {boolean}
	 * @private
	 */
	exports.isWrapperType = function(obj) {
	  return obj instanceof Number || obj instanceof String || obj instanceof Boolean;
	};

	exports.merge = function(a, b) {
	  if (a && b) {
	    for (var key in b) {
	      a[key] = b[key];
	    }
	  }
	  return a;
	};

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	exports.forEach = function forEach(obj, f, context) {
	  if (exports.isGeneratorFunction(obj)) {
	    return forEach(obj(), f, context);
	  } else if (exports.isGeneratorObject(obj)) {
	    var value = obj.next();
	    while (!value.done) {
	      if (f.call(context, value.value, 'value', obj) === false)
	        return;
	      value = obj.next();
	    }
	  } else {
	    for (var prop in obj) {
	      if (hasOwnProperty.call(obj, prop)) {
	        if (f.call(context, obj[prop], prop, obj) === false)
	          return;
	      }
	    }
	  }
	};

	exports.some = function(obj, f, context) {
	  var res = false;
	  exports.forEach(obj, function(value, key) {
	    if (f.call(context, value, key, obj)) {
	      res = true;
	      return false;
	    }
	  }, context);
	  return res;
	};

	exports.isEmptyObject = function(obj) {
	  for (var prop in obj) {
	    if (hasOwnProperty.call(obj, prop)) {
	      return false;
	    }
	  }
	  return true;
	};

	exports.isIndexable = function(obj) {
	  var t = type(obj);
	  return (t.type === type.OBJECT && t.cls === type.ARRAY) ||
	   (t.type === type.OBJECT && t.cls === type.BUFFER) ||
	   (t.type === type.OBJECT && t.cls === type.ARGUMENTS) ||
	   (t.type === type.OBJECT && t.cls === type.ARRAY_BUFFER) ||
	   (t.type === type.OBJECT && t.cls === type.TYPED_ARRAY) ||
	   (t.type === type.OBJECT && t.cls === type.DATA_VIEW) ||
	   (t.type === type.OBJECT && t.cls === type.STRING) ||
	   (t.type === type.STRING);
	};

	exports.length = function(obj) {
	  var t = type(obj);
	  switch (t.type) {
	    case type.STRING:
	      return obj.length;
	    case type.OBJECT:
	      switch (t.cls) {
	        case type.ARRAY_BUFFER:
	        case type.TYPED_ARRAY:
	        case type.DATA_VIEW:
	          return obj.byteLength;

	        case type.ARRAY:
	        case type.BUFFER:
	        case type.ARGUMENTS:
	        case type.FUNCTION:
	          return obj.length;
	      }
	  }
	};

	exports.convertPropertyName = function(name) {
	  if (typeof name == 'symbol') {
	    return name;
	  } else {
	    return String(name);
	  }
	};

	exports.isGeneratorObject = function(obj) {
	  if (!obj) return false;

	  return typeof obj.next == 'function' &&
	          typeof obj[Symbol.iterator] == 'function' &&
	          obj[Symbol.iterator]() === obj;
	};

	//TODO find better way
	exports.isGeneratorFunction = function(f) {
	  if (typeof f != 'function') return false;

	  return /^function\s*\*\s*/.test(f.toString());
	};

	exports.format = function(value, opts) {
	  return config.getFormatter(opts).format(value);
	};

	exports.functionName = __webpack_require__(12).Formatter.functionName;

	exports.formatProp = function(value) {
	  return config.getFormatter().formatPropertyName(String(value));
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var toString = Object.prototype.toString;

	var types = __webpack_require__(10);

	/**
	 * Simple data function to store type information
	 * @param {string} type Usually what is returned from typeof
	 * @param {string} cls  Sanitized @Class via Object.prototype.toString
	 * @param {string} sub  If type and cls the same, and need to specify somehow
	 * @private
	 * @example
	 *
	 * //for null
	 * new Type('null');
	 *
	 * //for Date
	 * new Type('object', 'date');
	 *
	 * //for Uint8Array
	 *
	 * new Type('object', 'typed-array', 'uint8');
	 */
	function Type(type, cls, sub) {
	  this.type = type;
	  this.cls = cls;
	  this.sub = sub;
	}

	/**
	 * Function to store type checks
	 * @private
	 */
	function TypeChecker() {
	  this.checks = [];
	}

	TypeChecker.prototype = {
	  add: function(func) {
	    this.checks.push(func);
	    return this;
	  },

	  addTypeOf: function(type, res) {
	    return this.add(function(obj, tpeOf) {
	      if(tpeOf === type) {
	        return new Type(res);
	      }
	    });
	  },

	  addClass: function(cls, res, sub) {
	    return this.add(function(obj, tpeOf, objCls) {
	      if(objCls === cls) {
	        return new Type(types.OBJECT, res, sub);
	      }
	    });
	  },

	  getType: function(obj) {
	    var typeOf = typeof obj;
	    var cls = toString.call(obj);

	    for(var i = 0, l = this.checks.length; i < l; i++) {
	      var res = this.checks[i].call(this, obj, typeOf, cls);
	      if(typeof res !== 'undefined') return res;
	    }

	  }
	};

	var main = new TypeChecker();

	//TODO add iterators

	main
	  .addTypeOf(types.NUMBER, types.NUMBER)
	  .addTypeOf(types.UNDEFINED, types.UNDEFINED)
	  .addTypeOf(types.STRING, types.STRING)
	  .addTypeOf(types.BOOLEAN, types.BOOLEAN)
	  .addTypeOf(types.FUNCTION, types.FUNCTION)
	  .addTypeOf(types.SYMBOL, types.SYMBOL)
	  .add(function(obj, tpeOf) {
	    if(obj === null) return new Type(types.NULL);
	  })
	  .addClass('[object String]', types.STRING)
	  .addClass('[object Boolean]', types.BOOLEAN)
	  .addClass('[object Number]', types.NUMBER)
	  .addClass('[object Array]', types.ARRAY)
	  .addClass('[object RegExp]', types.REGEXP)
	  .addClass('[object Error]', types.ERROR)
	  .addClass('[object Date]', types.DATE)
	  .addClass('[object Arguments]', types.ARGUMENTS)
	  .addClass('[object Math]')
	  .addClass('[object JSON]')
	  .addClass('[object ArrayBuffer]', types.ARRAY_BUFFER)
	  .addClass('[object Int8Array]', types.TYPED_ARRAY, 'int8')
	  .addClass('[object Uint8Array]', types.TYPED_ARRAY, 'uint8')
	  .addClass('[object Uint8ClampedArray]', types.TYPED_ARRAY, 'uint8clamped')
	  .addClass('[object Int16Array]', types.TYPED_ARRAY, 'int16')
	  .addClass('[object Uint16Array]', types.TYPED_ARRAY, 'uint16')
	  .addClass('[object Int32Array]', types.TYPED_ARRAY, 'int32')
	  .addClass('[object Uint32Array]', types.TYPED_ARRAY, 'uint32')
	  .addClass('[object Float32Array]', types.TYPED_ARRAY, 'float32')
	  .addClass('[object Float64Array]', types.TYPED_ARRAY, 'float64')
	  .addClass('[object DataView]', types.DATA_VIEW)
	  .addClass('[object Map]', types.MAP)
	  .addClass('[object WeakMap]', types.WEAK_MAP)
	  .addClass('[object Set]', types.SET)
	  .addClass('[object WeakSet]', types.WEAK_SET)
	  .addClass('[object Promise]', types.PROMISE)
	  .addClass('[object Blob]', types.BLOB)
	  .addClass('[object File]', types.FILE)
	  .addClass('[object FileList]', types.FILE_LIST)
	  .addClass('[object XMLHttpRequest]', types.XHR)
	  .add(function(obj) {
	    if((typeof Promise === types.FUNCTION && obj instanceof Promise) ||
	        (typeof obj.then === types.FUNCTION)) {
	          return new Type(types.OBJECT, types.PROMISE);
	        }
	  })
	  .add(function(obj) {
	    if(typeof Buffer !== 'undefined' && obj instanceof Buffer) {
	      return new Type(types.OBJECT, types.BUFFER);
	    }
	  })
	  .add(function(obj) {
	    if(typeof Node !== 'undefined' && obj instanceof Node) {
	      return new Type(types.OBJECT, types.HTML_ELEMENT, obj.nodeName);
	    }
	  })
	  .add(function(obj) {
	    // probably at the begginging should be enough these checks
	    if(obj.Boolean === Boolean && obj.Number === Number && obj.String === String && obj.Date === Date) {
	      return new Type(types.OBJECT, types.HOST);
	    }
	  })
	  .add(function() {
	    return new Type(types.OBJECT);
	  });

	/**
	 * Get type information of anything
	 *
	 * @param  {any} obj Anything that could require type information
	 * @return {Type}    type info
	 */
	function getGlobalType(obj) {
	  return main.getType(obj);
	}

	getGlobalType.checker = main;
	getGlobalType.TypeChecker = TypeChecker;
	getGlobalType.Type = Type;

	Object.keys(types).forEach(function(typeName) {
	  getGlobalType[typeName] = types[typeName];
	});

	module.exports = getGlobalType;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).Buffer))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(7)
	var ieee754 = __webpack_require__(8)
	var isArray = __webpack_require__(9)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0
	    this.parent = undefined
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined
	  Buffer.prototype.parent = undefined
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).Buffer, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 8 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	var types = {
	  NUMBER: 'number',
	  UNDEFINED: 'undefined',
	  STRING: 'string',
	  BOOLEAN: 'boolean',
	  OBJECT: 'object',
	  FUNCTION: 'function',
	  NULL: 'null',
	  ARRAY: 'array',
	  REGEXP: 'regexp',
	  DATE: 'date',
	  ERROR: 'error',
	  ARGUMENTS: 'arguments',
	  SYMBOL: 'symbol',
	  ARRAY_BUFFER: 'array-buffer',
	  TYPED_ARRAY: 'typed-array',
	  DATA_VIEW: 'data-view',
	  MAP: 'map',
	  SET: 'set',
	  WEAK_SET: 'weak-set',
	  WEAK_MAP: 'weak-map',
	  PROMISE: 'promise',

	// node buffer
	  BUFFER: 'buffer',

	// dom html element
	  HTML_ELEMENT: 'html-element',
	  HTML_ELEMENT_TEXT: 'html-element-text',
	  DOCUMENT: 'document',
	  WINDOW: 'window',
	  FILE: 'file',
	  FILE_LIST: 'file-list',
	  BLOB: 'blob',

	  HOST: 'host',

	  XHR: 'xhr'
	};

	module.exports = types;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	var Formatter = __webpack_require__(12).Formatter;

	var config = {
	  checkProtoEql: false,

	  getFormatter: function(opts) {
	    return new Formatter(opts || config);
	  }
	};

	module.exports = config;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var getType = __webpack_require__(5);
	var util = __webpack_require__(13);

	function genKeysFunc(f) {
	  return function(value) {
	    var k = f(value);
	    k.sort();
	    return k;
	  };
	}


	function Formatter(opts) {
	  opts = opts || {};

	  this.seen = [];
	  this.keys = genKeysFunc(opts.keys === false ? Object.getOwnPropertyNames : Object.keys);

	  this.maxLineLength = typeof opts.maxLineLength === 'number' ? opts.maxLineLength : 60;
	  this.propSep = opts.propSep || ',';

	  this.isUTCdate = !!opts.isUTCdate;
	}

	Formatter.prototype = {
	  constructor: Formatter,

	  format: function(value) {
	    var t = getType(value);
	    var name1 = t.type, name2 = t.type;
	    if(t.cls) {
	      name1 += '_' + t.cls;
	      name2 += '_' + t.cls;
	    }
	    if(t.sub) {
	      name2 += '_' + t.sub;
	    }
	    var f = this['_format_' + name2] || this['_format_' + name1] || this['_format_' + t.type] || this.defaultFormat;
	    return f.call(this, value).trim();
	  },

	  _formatObject: function(value, opts) {
	    opts = opts || {};
	    var mainKeys = opts.keys || this.keys(value);

	    var len = 0;

	    var formatPropertyValue = opts.formatPropertyValue || this.formatPropertyValue;
	    var formatPropertyName = opts.formatPropertyName || this.formatPropertyName;
	    var keyValueSep = opts.keyValueSep || ': ';
	    var keyFilter = opts.keyFilter || function() { return true; };

	    this.seen.push(value);
	    var keys = [];

	    mainKeys.forEach(function(key) {
	      if(!keyFilter(key)) return;

	      var fName = formatPropertyName.call(this, key);

	      var f = (fName ? fName + keyValueSep : '') + formatPropertyValue.call(this, value, key);
	      len += f.length;
	      keys.push(f);
	    }, this);
	    this.seen.pop();

	    (opts.additionalProperties || []).forEach(function(keyValue) {
	      var f = keyValue[0] + keyValueSep + this.format(keyValue[1]);
	      len += f.length;
	      keys.push(f);
	    }, this);

	    var prefix = opts.prefix || Formatter.constructorName(value) || '';
	    if(prefix.length > 0) prefix += ' ';

	    var lbracket, rbracket;
	    if(Array.isArray(opts.brackets)) {
	      lbracket = opts.brackets && opts.brackets[0];
	      rbracket = opts.brackets && opts.brackets[1];
	    } else {
	      lbracket = '{';
	      rbracket = '}';
	    }

	    var rootValue = opts.value || '';

	    if(keys.length === 0)
	      return rootValue || (prefix + lbracket + rbracket);

	    if(len <= this.maxLineLength) {
	      return prefix + lbracket + ' ' + (rootValue ? rootValue + ' ' : '') + keys.join(this.propSep + ' ') + ' ' + rbracket;
	    } else {
	      return prefix + lbracket + '\n' + (rootValue ? '  ' + rootValue + '\n' : '') + keys.map(util.addSpaces).join(this.propSep + '\n') + '\n' + rbracket;
	    }
	  },

	  formatObject: function(value, prefix, props) {
	    props = props || this.keys(value);

	    var len = 0;

	    this.seen.push(value);
	    props = props.map(function(prop) {
	      var f = this.formatProperty(value, prop);
	      len += f.length;
	      return f;
	    }, this);
	    this.seen.pop();

	    if(props.length === 0) return '{}';

	    if(len <= this.maxLineLength) {
	      return '{ ' + (prefix ? prefix + ' ' : '') + props.join(this.propSep + ' ') + ' }';
	    } else {
	      return '{' + '\n' + (prefix ? '  ' + prefix + '\n' : '') + props.map(util.addSpaces).join(this.propSep + '\n') + '\n' + '}';
	    }
	  },

	  formatPropertyName: function(name) {
	    return name.match(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/) ? name : this.format(name);
	  },

	  formatProperty: function(value, prop) {
	    var desc = Formatter.getPropertyDescriptor(value, prop);

	    var propName = this.formatPropertyName(prop);

	    var propValue = desc.get && desc.set ?
	      '[Getter/Setter]' : desc.get ?
	      '[Getter]' : desc.set ?
	      '[Setter]' : this.seen.indexOf(desc.value) >= 0 ?
	      '[Circular]' :
	      this.format(desc.value);

	    return propName + ': ' + propValue;
	  },

	  formatPropertyValue: function(value, prop) {
	    var desc = Formatter.getPropertyDescriptor(value, prop);

	    var propValue = desc.get && desc.set ?
	      '[Getter/Setter]' : desc.get ?
	      '[Getter]' : desc.set ?
	      '[Setter]' : this.seen.indexOf(desc.value) >= 0 ?
	      '[Circular]' :
	      this.format(desc.value);

	    return propValue;
	  }
	};

	Formatter.add = function add(type, cls, sub, f) {
	  var args = Array.prototype.slice.call(arguments);
	  f = args.pop();
	  Formatter.prototype['_format_' + args.join('_')] = f;
	};

	Formatter.formatObjectWithPrefix = function formatObjectWithPrefix(f) {
	  return function(value) {
	    var prefix = f.call(this, value);
	    var props = this.keys(value);
	    if(props.length == 0) return prefix;
	    else return this.formatObject(value, prefix, props);
	  };
	};

	var functionNameRE = /^\s*function\s*(\S*)\s*\(/;

	Formatter.functionName = function functionName(f) {
	  if(f.name) {
	    return f.name;
	  }
	  var matches = f.toString().match(functionNameRE);
	  if (matches === null) {
	    // `functionNameRE` doesn't match arrow functions.
	    return '';
	  }
	  var name = matches[1];
	  return name;
	};

	Formatter.constructorName = function(obj) {
	  while (obj) {
	    var descriptor = Object.getOwnPropertyDescriptor(obj, 'constructor');
	    if (descriptor !== undefined &&
	        typeof descriptor.value === 'function') {

	        var name = Formatter.functionName(descriptor.value);
	        if(name !== '') {
	          return name;
	        }
	    }

	    obj = Object.getPrototypeOf(obj);
	  }
	};

	Formatter.getPropertyDescriptor = function(obj, value) {
	  var desc;
	  try {
	    desc = Object.getOwnPropertyDescriptor(obj, value) || {value: obj[value]};
	  } catch(e) {
	    desc = {value: e};
	  }
	  return desc;
	};

	Formatter.generateFunctionForIndexedArray = function generateFunctionForIndexedArray(lengthProp, name, padding) {
	  return function(value) {
	    var max = this.byteArrayMaxLength || 50;
	    var length = value[lengthProp];
	    var formattedValues = [];
	    var len = 0;
	    for(var i = 0; i < max && i < length; i++) {
	      var b = value[i] || 0;
	      var v = util.pad0(b.toString(16), padding);
	      len += v.length;
	      formattedValues.push(v);
	    }
	    var prefix = value.constructor.name || name || '';
	    if(prefix) prefix += ' ';

	    if(formattedValues.length === 0)
	      return prefix + '[]';

	    if(len <= this.maxLineLength) {
	      return prefix + '[ ' + formattedValues.join(this.propSep + ' ') + ' ' + ']';
	    } else {
	      return prefix + '[\n' + formattedValues.map(util.addSpaces).join(this.propSep + '\n') + '\n' + ']';
	    }
	  };
	};

	Formatter.add('undefined', function() { return 'undefined' });
	Formatter.add('null', function() { return 'null' });
	Formatter.add('boolean', function(value) { return value ? 'true': 'false' });
	Formatter.add('symbol', function(value) { return value.toString() });

	['number', 'boolean'].forEach(function(name) {
	  Formatter.add('object', name, function(value) {
	    return this._formatObject(value, {
	      additionalProperties: [['[[PrimitiveValue]]', value.valueOf()]]
	    });
	  });
	});

	Formatter.add('object', 'string', function(value) {
	  var realValue = value.valueOf();

	  return this._formatObject(value, {
	    keyFilter: function(key) {
	      //skip useless indexed properties
	      return !(key.match(/\d+/) && parseInt(key, 10) < realValue.length);
	    },
	    additionalProperties: [['[[PrimitiveValue]]', realValue]]
	  });
	});

	Formatter.add('object', 'regexp', function(value) {
	  return this._formatObject(value, {
	    value: String(value)
	  });
	});

	Formatter.add('number', function(value) {
	  if(value === 0 && 1 / value < 0) return '-0';
	  return String(value);
	});

	Formatter.add('string', function(value) {
	  return '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	      .replace(/'/g, "\\'")
	      .replace(/\\"/g, '"') + '\'';
	});

	Formatter.add('object', function(value) {
	  return this._formatObject(value);
	});

	Formatter.add('object', 'arguments', function(value) {
	  return this._formatObject(value, {
	    prefix: 'Arguments',
	    formatPropertyName: function(key) {
	      if(!key.match(/\d+/)) {
	        return this.formatPropertyName(key);
	      }
	    },
	    brackets: ['[', ']']
	  });
	});

	Formatter.add('object', 'array', function(value) {
	  return this._formatObject(value, {
	    formatPropertyName: function(key) {
	      if(!key.match(/\d+/)) {
	        return this.formatPropertyName(key);
	      }
	    },
	    brackets: ['[', ']']
	  });
	});


	function formatDate(value, isUTC) {
	  var prefix = isUTC ? 'UTC' : '';

	  var date = value['get' + prefix + 'FullYear']() +
	    '-' +
	    util.pad0(value['get' + prefix + 'Month']() + 1, 2) +
	    '-' +
	    util.pad0(value['get' + prefix + 'Date'](), 2);

	  var time = util.pad0(value['get' + prefix + 'Hours'](), 2) +
	    ':' +
	    util.pad0(value['get' + prefix + 'Minutes'](), 2) +
	    ':' +
	    util.pad0(value['get' + prefix + 'Seconds'](), 2) +
	    '.' +
	    util.pad0(value['get' + prefix + 'Milliseconds'](), 3);

	  var to = value.getTimezoneOffset();
	  var absTo = Math.abs(to);
	  var hours = Math.floor(absTo / 60);
	  var minutes = absTo - hours * 60;
	  var tzFormat = (to < 0 ? '+' : '-') + util.pad0(hours, 2) + util.pad0(minutes, 2);

	  return date + ' ' + time + (isUTC ? '' : ' ' + tzFormat);
	}

	Formatter.add('object', 'date', function(value) {
	  return this._formatObject(value, { value: formatDate(value, this.isUTCdate) });
	});

	Formatter.add('function', function(value) {
	  return this._formatObject(value, {
	    additionalProperties: [['name', Formatter.functionName(value)]]
	  });
	});

	Formatter.add('object', 'error', function(value) {
	  return this._formatObject(value, {
	    prefix: value.name,
	    additionalProperties: [['message', value.message]]
	  });
	});

	Formatter.add('object', 'buffer', Formatter.generateFunctionForIndexedArray('length', 'Buffer', 2));

	Formatter.add('object', 'array-buffer', Formatter.generateFunctionForIndexedArray('byteLength', 'ArrayBuffer', 2));

	Formatter.add('object', 'typed-array', 'int8', Formatter.generateFunctionForIndexedArray('length', 'Int8Array', 2));
	Formatter.add('object', 'typed-array', 'uint8', Formatter.generateFunctionForIndexedArray('length', 'Uint8Array', 2));
	Formatter.add('object', 'typed-array', 'uint8clamped', Formatter.generateFunctionForIndexedArray('length', 'Uint8ClampedArray', 2));

	Formatter.add('object', 'typed-array', 'int16', Formatter.generateFunctionForIndexedArray('length', 'Int16Array', 4));
	Formatter.add('object', 'typed-array', 'uint16', Formatter.generateFunctionForIndexedArray('length', 'Uint16Array', 4));

	Formatter.add('object', 'typed-array', 'int32', Formatter.generateFunctionForIndexedArray('length', 'Int32Array', 8));
	Formatter.add('object', 'typed-array', 'uint32', Formatter.generateFunctionForIndexedArray('length', 'Uint32Array', 8));

	//TODO add float32 and float64

	Formatter.add('object', 'promise', function() {
	  return '[Promise]';//TODO it could be nice to inspect its state and value
	});

	Formatter.add('object', 'xhr', function() {
	  return '[XMLHttpRequest]';//TODO it could be nice to inspect its state
	});

	Formatter.add('object', 'html-element', function(value) {
	  return value.outerHTML;
	});

	Formatter.add('object', 'html-element', '#text', function(value) {
	  return value.nodeValue;
	});

	Formatter.add('object', 'html-element', '#document', function(value) {
	  return value.documentElement.outerHTML;
	});

	Formatter.add('object', 'host', function() {
	  return '[Host]';
	});

	Formatter.add('object', 'set', function(value) {
	  var iter = value.values();
	  var len = 0;

	  this.seen.push(value);

	  var props = [];

	  var next = iter.next();
	  while(!next.done) {
	    var val = next.value;
	    var f = this.format(val);
	    len += f.length;
	    props.push(f);

	    next = iter.next();
	  }

	  this.seen.pop();

	  if(props.length === 0) return 'Set {}';

	  if(len <= this.maxLineLength) {
	    return 'Set { ' + props.join(this.propSep + ' ') + ' }';
	  } else {
	    return 'Set {\n' + props.map(util.addSpaces).join(this.propSep + '\n') + '\n' + '}';
	  }
	});

	Formatter.add('object', 'map', function(value) {
	  var iter = value.entries();
	  var len = 0;

	  this.seen.push(value);

	  var props = [];

	  var next = iter.next();
	  while(!next.done) {
	    var val = next.value;
	    var fK = this.format(val[0]);
	    var fV = this.format(val[1]);

	    var f;
	    if((fK.length + fV.length + 4) <= this.maxLineLength) {
	      f = fK + ' => ' + fV;
	    } else {
	      f = fK + ' =>\n' + fV;
	    }

	    len += fK.length + fV.length + 4;
	    props.push(f);

	    next = iter.next();
	  }

	  this.seen.pop();

	  if(props.length === 0) return 'Map {}';

	  if(len <= this.maxLineLength) {
	    return 'Map { ' + props.join(this.propSep + ' ') + ' }';
	  } else {
	    return 'Map {\n' + props.map(util.addSpaces).join(this.propSep + '\n') + '\n' + '}';
	  }
	});

	Formatter.prototype.defaultFormat = Formatter.prototype._format_object;

	function defaultFormat(value, opts) {
	  return new Formatter(opts).format(value);
	}

	defaultFormat.Formatter = Formatter;
	module.exports = defaultFormat;


/***/ },
/* 13 */
/***/ function(module, exports) {

	function addSpaces(v) {
	  return v.split('\n').map(function(vv) { return '  ' + vv; }).join('\n');
	}

	function pad(str, value, filler) {
	  str = String(str)
	  var isRight = false;

	  if(value < 0) {
	    isRight = true;
	    value = -value;
	  }

	  if(str.length < value) {
	    var padding = new Array(value - str.length + 1).join(filler);
	    return isRight ? str + padding : padding + str;
	  } else{
	    return str;
	  }
	}

	module.exports = {
	  addSpaces: addSpaces,
	  pad: pad,
	  pad0: function(str, value) {
	    return pad(str, value, '0');
	  }
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	var util = __webpack_require__(4);

	/**
	 * should AssertionError
	 * @param {Object} options
	 * @constructor
	 * @memberOf should
	 * @static
	 */
	var AssertionError = function AssertionError(options) {
	  util.merge(this, options);

	  if (!options.message) {
	    Object.defineProperty(this, 'message', {
	        get: function() {
	          if (!this._message) {
	            this._message = this.generateMessage();
	            this.generatedMessage = true;
	          }
	          return this._message;
	        },
	        configurable: true,
	        enumerable: false
	      }
	    );
	  }

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, this.stackStartFunction);
	  } else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;

	      if (this.stackStartFunction) {
	        // try to strip useless frames
	        var fn_name = util.functionName(this.stackStartFunction);
	        var idx = out.indexOf('\n' + fn_name);
	        if (idx >= 0) {
	          // once we have located the function frame
	          // we need to strip out everything before it (and its line)
	          var next_line = out.indexOf('\n', idx + 1);
	          out = out.substring(next_line + 1);
	        }
	      }

	      this.stack = out;
	    }
	  }
	};


	var indent = '    ';
	function prependIndent(line) {
	  return indent + line;
	}

	function indentLines(text) {
	  return text.split('\n').map(prependIndent).join('\n');
	}


	// assert.AssertionError instanceof Error
	AssertionError.prototype = Object.create(Error.prototype, {
	  name: {
	    value: 'AssertionError'
	  },

	  generateMessage: {
	    value: function() {
	      if (!this.operator && this.previous) {
	        return this.previous.message;
	      }
	      var actual = util.format(this.actual);
	      var expected = 'expected' in this ? ' ' + util.format(this.expected) : '';
	      var details = 'details' in this && this.details ? ' (' + this.details + ')' : '';

	      var previous = this.previous ? '\n' + indentLines(this.previous.message) : '';

	      return 'expected ' + actual + (this.negate ? ' not ' : ' ') + this.operator + expected + details + previous;
	    }
	  }
	});

	module.exports = AssertionError;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	var AssertionError = __webpack_require__(14);

	/**
	 * should Assertion
	 * @param {*} obj Given object for assertion
	 * @constructor
	 * @memberOf should
	 * @static
	 */
	function Assertion(obj) {
	  this.obj = obj;

	  this.anyOne = false;
	  this.negate = false;

	  this.params = {actual: obj};
	}

	Assertion.prototype = {
	  constructor: Assertion,

	  /**
	   * Base method for assertions.
	   *
	   * Before calling this method need to fill Assertion#params object. This method usually called from other assertion methods.
	   * `Assertion#params` can contain such properties:
	   * * `operator` - required string containing description of this assertion
	   * * `obj` - optional replacement for this.obj, it usefull if you prepare more clear object then given
	   * * `message` - if this property filled with string any others will be ignored and this one used as assertion message
	   * * `expected` - any object used when you need to assert relation between given object and expected. Like given == expected (== is a relation)
	   * * `details` - additional string with details to generated message
	   *
	   * @memberOf Assertion
	   * @category assertion
	   * @param {*} expr Any expression that will be used as a condition for asserting.
	   * @example
	   *
	   * var a = new should.Assertion(42);
	   *
	   * a.params = {
	   *  operator: 'to be magic number',
	   * }
	   *
	   * a.assert(false);
	   * //throws AssertionError: expected 42 to be magic number
	   */
	  assert: function(expr) {
	    if (expr) {
	      return this;
	    }

	    var params = this.params;

	    if ('obj' in params && !('actual' in params)) {
	      params.actual = params.obj;
	    } else if (!('obj' in params) && !('actual' in params)) {
	      params.actual = this.obj;
	    }

	    params.stackStartFunction = params.stackStartFunction || this.assert;
	    params.negate = this.negate;

	    params.assertion = this;

	    throw new AssertionError(params);
	  },

	  /**
	   * Shortcut for `Assertion#assert(false)`.
	   *
	   * @memberOf Assertion
	   * @category assertion
	   * @example
	   *
	   * var a = new should.Assertion(42);
	   *
	   * a.params = {
	   *  operator: 'to be magic number',
	   * }
	   *
	   * a.fail();
	   * //throws AssertionError: expected 42 to be magic number
	   */
	  fail: function() {
	    return this.assert(false);
	  }
	};



	/**
	 * Assertion used to delegate calls of Assertion methods inside of Promise.
	 * It has almost all methods of Assertion.prototype
	 *
	 * @param {Promise} obj
	 */
	function PromisedAssertion(/* obj */) {
	  Assertion.apply(this, arguments);
	}

	/**
	 * Make PromisedAssertion to look like promise. Delegate resolve and reject to given promise.
	 *
	 * @private
	 * @returns {Promise}
	 */
	PromisedAssertion.prototype.then = function(resolve, reject) {
	  return this.obj.then(resolve, reject);
	};

	/**
	 * Way to extend Assertion function. It uses some logic
	 * to define only positive assertions and itself rule with negative assertion.
	 *
	 * All actions happen in subcontext and this method take care about negation.
	 * Potentially we can add some more modifiers that does not depends from state of assertion.
	 *
	 * @memberOf Assertion
	 * @static
	 * @param {String} name Name of assertion. It will be used for defining method or getter on Assertion.prototype
	 * @param {Function} func Function that will be called on executing assertion
	 * @example
	 *
	 * Assertion.add('asset', function() {
	 *      this.params = { operator: 'to be asset' }
	 *
	 *      this.obj.should.have.property('id').which.is.a.Number()
	 *      this.obj.should.have.property('path')
	 * })
	 */
	Assertion.add = function(name, func) {
	  Object.defineProperty(Assertion.prototype, name, {
	    enumerable: true,
	    configurable: true,
	    value: function() {
	      var context = new Assertion(this.obj, this, name);
	      context.anyOne = this.anyOne;

	      try {
	        func.apply(context, arguments);
	      } catch (e) {
	        // check for fail
	        if (e instanceof AssertionError) {
	          // negative fail
	          if (this.negate) {
	            this.obj = context.obj;
	            this.negate = false;
	            return this;
	          }

	          if (context !== e.assertion) {
	            context.params.previous = e;
	          }

	          // positive fail
	          context.negate = false;
	          context.fail();
	        }
	        // throw if it is another exception
	        throw e;
	      }

	      // negative pass
	      if (this.negate) {
	        context.negate = true; // because .fail will set negate
	        context.params.details = 'false negative fail';
	        context.fail();
	      }

	      // positive pass
	      if (!this.params.operator) {
	        this.params = context.params; // shortcut
	      }
	      this.obj = context.obj;
	      this.negate = false;
	      return this;
	    }
	  });

	  Object.defineProperty(PromisedAssertion.prototype, name, {
	    enumerable: true,
	    configurable: true,
	    value: function() {
	      var args = arguments;
	      this.obj = this.obj.then(function(a) {
	        return a[name].apply(a, args);
	      });

	      return this;
	    }
	  });
	};

	/**
	 * Add chaining getter to Assertion like .a, .which etc
	 *
	 * @memberOf Assertion
	 * @static
	 * @param  {string} name   name of getter
	 * @param  {function} [onCall] optional function to call
	 */
	Assertion.addChain = function(name, onCall) {
	  onCall = onCall || function() {};
	  Object.defineProperty(Assertion.prototype, name, {
	    get: function() {
	      onCall.call(this);
	      return this;
	    },
	    enumerable: true
	  });

	  Object.defineProperty(PromisedAssertion.prototype, name, {
	    enumerable: true,
	    configurable: true,
	    get: function() {
	      this.obj = this.obj.then(function(a) {
	        return a[name];
	      });

	      return this;
	    }
	  });
	};

	/**
	 * Create alias for some `Assertion` property
	 *
	 * @memberOf Assertion
	 * @static
	 * @param {String} from Name of to map
	 * @param {String} to Name of alias
	 * @example
	 *
	 * Assertion.alias('true', 'True')
	 */
	Assertion.alias = function(from, to) {
	  var desc = Object.getOwnPropertyDescriptor(Assertion.prototype, from);
	  if (!desc) throw new Error('Alias ' + from + ' -> ' + to + ' could not be created as ' + from + ' not defined');
	  Object.defineProperty(Assertion.prototype, to, desc);

	  var desc2 = Object.getOwnPropertyDescriptor(PromisedAssertion.prototype, from);
	  if (desc2) {
	    Object.defineProperty(PromisedAssertion.prototype, to, desc2);
	  }
	};
	/**
	 * Negation modifier. Current assertion chain become negated. Each call invert negation on current assertion.
	 *
	 * @name not
	 * @property
	 * @memberOf Assertion
	 * @category assertion
	 */
	Assertion.addChain('not', function() {
	  this.negate = !this.negate;
	});

	/**
	 * Any modifier - it affect on execution of sequenced assertion to do not `check all`, but `check any of`.
	 *
	 * @name any
	 * @property
	 * @memberOf Assertion
	 * @category assertion
	 */
	Assertion.addChain('any', function() {
	  this.anyOne = true;
	});

	module.exports = Assertion;
	module.exports.PromisedAssertion = PromisedAssertion;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	var util = __webpack_require__(4);
	var assert = __webpack_require__(17);
	var AssertionError = __webpack_require__(14);

	module.exports = function(should) {
	  var i = should.format;

	  /*
	   * Expose assert to should
	   *
	   * This allows you to do things like below
	   * without require()ing the assert module.
	   *
	   *    should.equal(foo.bar, undefined);
	   *
	   */
	  util.merge(should, assert);

	  /**
	   * Assert _obj_ exists, with optional message.
	   *
	   * @static
	   * @memberOf should
	   * @category assertion assert
	   * @alias should.exists
	   * @param {*} obj
	   * @param {String} [msg]
	   * @example
	   *
	   * should.exist(1);
	   * should.exist(new Date());
	   */
	  should.exist = should.exists = function(obj, msg) {
	    if (null == obj) {
	      throw new AssertionError({
	        message: msg || ('expected ' + i(obj) + ' to exist'), stackStartFunction: should.exist
	      });
	    }
	  };

	  should.not = {};
	  /**
	   * Asserts _obj_ does not exist, with optional message.
	   *
	   * @name not.exist
	   * @static
	   * @memberOf should
	   * @category assertion assert
	   * @alias should.not.exists
	   * @param {*} obj
	   * @param {String} [msg]
	   * @example
	   *
	   * should.not.exist(null);
	   * should.not.exist(void 0);
	   */
	  should.not.exist = should.not.exists = function(obj, msg) {
	    if (null != obj) {
	      throw new AssertionError({
	        message: msg || ('expected ' + i(obj) + ' to not exist'), stackStartFunction: should.not.exist
	      });
	    }
	  };
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// implement assert interface using already written peaces of should.js

	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	// when used in node, this will actually load the util module we depend on
	// versus loading the builtin util module as happens otherwise
	// this is a bug in node module loading as far as I am concerned
	var Assertion = __webpack_require__(15);

	var _deepEqual = __webpack_require__(18);

	var pSlice = Array.prototype.slice;

	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.

	var assert = module.exports = ok;

	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.
	/**
	 * Node.js standard [`assert.fail`](http://nodejs.org/api/assert.html#assert_assert_fail_actual_expected_message_operator).
	 * @static
	 * @memberOf should
	 * @category assertion assert
	 * @param {*} actual Actual object
	 * @param {*} expected Expected object
	 * @param {string} message Message for assertion
	 * @param {string} operator Operator text
	 */
	function fail(actual, expected, message, operator, stackStartFunction) {
	  var a = new Assertion(actual);
	  a.params = {
	    operator: operator,
	    expected: expected,
	    message: message,
	    stackStartFunction: stackStartFunction || fail
	  };

	  a.fail();
	}

	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;

	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.
	/**
	 * Node.js standard [`assert.ok`](http://nodejs.org/api/assert.html#assert_assert_value_message_assert_ok_value_message).
	 * @static
	 * @memberOf should
	 * @category assertion assert
	 * @param {*} value
	 * @param {string} [message]
	 */
	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;

	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);

	/**
	 * Node.js standard [`assert.equal`](http://nodejs.org/api/assert.html#assert_assert_equal_actual_expected_message).
	 * @static
	 * @memberOf should
	 * @category assertion assert
	 * @param {*} actual
	 * @param {*} expected
	 * @param {string} [message]
	 */
	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};

	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);
	/**
	 * Node.js standard [`assert.notEqual`](http://nodejs.org/api/assert.html#assert_assert_notequal_actual_expected_message).
	 * @static
	 * @memberOf should
	 * @category assertion assert
	 * @param {*} actual
	 * @param {*} expected
	 * @param {string} [message]
	 */
	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};

	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);
	/**
	 * Node.js standard [`assert.deepEqual`](http://nodejs.org/api/assert.html#assert_assert_deepequal_actual_expected_message).
	 * But uses should.js .eql implementation instead of Node.js own deepEqual.
	 *
	 * @static
	 * @memberOf should
	 * @category assertion assert
	 * @param {*} actual
	 * @param {*} expected
	 * @param {string} [message]
	 */
	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected).result) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};


	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);
	/**
	 * Node.js standard [`assert.notDeepEqual`](http://nodejs.org/api/assert.html#assert_assert_notdeepequal_actual_expected_message).
	 * But uses should.js .eql implementation instead of Node.js own deepEqual.
	 *
	 * @static
	 * @memberOf should
	 * @category assertion assert
	 * @param {*} actual
	 * @param {*} expected
	 * @param {string} [message]
	 */
	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected).result) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};

	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);
	/**
	 * Node.js standard [`assert.strictEqual`](http://nodejs.org/api/assert.html#assert_assert_strictequal_actual_expected_message).
	 * @static
	 * @memberOf should
	 * @category assertion assert
	 * @param {*} actual
	 * @param {*} expected
	 * @param {string} [message]
	 */
	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};

	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
	/**
	 * Node.js standard [`assert.notStrictEqual`](http://nodejs.org/api/assert.html#assert_assert_notstrictequal_actual_expected_message).
	 * @static
	 * @memberOf should
	 * @category assertion assert
	 * @param {*} actual
	 * @param {*} expected
	 * @param {string} [message]
	 */
	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};

	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }

	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  } else if (actual instanceof expected) {
	    return true;
	  } else if (expected.call({}, actual) === true) {
	    return true;
	  }

	  return false;
	}

	function _throws(shouldThrow, block, expected, message) {
	  var actual;

	  if (typeof expected == 'string') {
	    message = expected;
	    expected = null;
	  }

	  try {
	    block();
	  } catch (e) {
	    actual = e;
	  }

	  message = (expected && expected.name ? ' (' + expected.name + ')' : '.') +
	  (message ? ' ' + message : '.');

	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }

	  if (!shouldThrow && expectedException(actual, expected)) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }

	  if ((shouldThrow && actual && expected && !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}

	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);
	/**
	 * Node.js standard [`assert.throws`](http://nodejs.org/api/assert.html#assert_assert_throws_block_error_message).
	 * @static
	 * @memberOf should
	 * @category assertion assert
	 * @param {Function} block
	 * @param {Function} [error]
	 * @param {String} [message]
	 */
	assert.throws = function(/*block, error, message*/) {
	  _throws.apply(this, [true].concat(pSlice.call(arguments)));
	};

	// EXTENSION! This is annoying to write outside this module.
	/**
	 * Node.js standard [`assert.doesNotThrow`](http://nodejs.org/api/assert.html#assert_assert_doesnotthrow_block_message).
	 * @static
	 * @memberOf should
	 * @category assertion assert
	 * @param {Function} block
	 * @param {String} [message]
	 */
	assert.doesNotThrow = function(/*block, message*/) {
	  _throws.apply(this, [false].concat(pSlice.call(arguments)));
	};

	/**
	 * Node.js standard [`assert.ifError`](http://nodejs.org/api/assert.html#assert_assert_iferror_value).
	 * @static
	 * @memberOf should
	 * @category assertion assert
	 * @param {Error} err
	 */
	assert.ifError = function(err) {
	  if (err) {
	    throw err;
	  }
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var getType = __webpack_require__(5);
	var format = __webpack_require__(19);
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	function makeResult(r, path, reason, a, b) {
	  var o = {result: r};
	  if(!r) {
	    o.path = path;
	    o.reason = reason;
	    o.a = a;
	    o.b = b;
	  }
	  return o;
	}

	var EQUALS = makeResult(true);

	function typeToString(t) {
	  return t.type + (t.cls ? '(' + t.cls + (t.sub ? ' ' + t.sub : '') + ')' : '');
	}



	var REASON = {
	  PLUS_0_AND_MINUS_0: '+0 is not equal to -0',
	  DIFFERENT_TYPES: 'A has type %s and B has type %s',
	  NAN_NUMBER: 'NaN is not equal to any number',
	  EQUALITY: 'A is not equal to B',
	  EQUALITY_PROTOTYPE: 'A and B have different prototypes',
	  WRAPPED_VALUE: 'A wrapped value is not equal to B wrapped value',
	  FUNCTION_SOURCES: 'function A is not equal to B by source code value (via .toString call)',
	  MISSING_KEY: '%s has no key %s',
	  CIRCULAR_VALUES: 'A has circular reference that was visited not in the same time as B',
	  SET_MAP_MISSING_KEY: 'Set/Map missing key',
	  MAP_VALUE_EQUALITY: 'Values of the same key in A and B is not equal'
	};


	function eqInternal(a, b, opts, stackA, stackB, path, fails) {
	  var r = EQUALS;

	  function result(comparison, reason) {
	    if(arguments.length > 2) {
	      var args = Array.prototype.slice.call(arguments, 2);
	      reason = format.apply(null, [reason].concat(args));
	    }
	    var res = makeResult(comparison, path, reason, a, b);
	    if(!comparison && opts.collectAllFails) {
	      fails.push(res);
	    }
	    return res;
	  }

	  function checkPropertyEquality(property) {
	    return eqInternal(a[property], b[property], opts, stackA, stackB, path.concat([property]), fails);
	  }

	  function checkAlso(a1, b1) {
	    return eqInternal(a1, b1, opts, stackA, stackB, path, fails);
	  }

	  // equal a and b exit early
	  if(a === b) {
	    // check for +0 !== -0;
	    return result(a !== 0 || (1 / a == 1 / b) || opts.plusZeroAndMinusZeroEqual, REASON.PLUS_0_AND_MINUS_0);
	  }

	  var l, p;

	  var typeA = getType(a),
	    typeB = getType(b);

	  var key;

	  // if objects has different types they are not equal
	  var typeDifferent = typeA.type !== typeB.type || typeA.cls !== typeB.cls;

	  if(typeDifferent || ((opts.checkSubType && typeA.sub !== typeB.sub) || !opts.checkSubType)) {
	    return result(false, REASON.DIFFERENT_TYPES, typeToString(typeA), typeToString(typeB));
	  }

	  //early checks for types
	  switch(typeA.type) {
	    case 'number':
	      // NaN !== NaN
	      return (a !== a) ? result(b !== b, REASON.NAN_NUMBER)
	        : result(a === b, REASON.EQUALITY);

	    case 'boolean':
	    case 'string':
	      return result(a === b, REASON.EQUALITY);

	    case 'function':
	      // functions are compared by their source code
	      r = checkAlso(a.toString(), b.toString());
	      if(!r.result) {
	        r.reason = REASON.FUNCTION_SOURCES;
	        if(!opts.collectAllFails) return r;
	      }

	      break;//check user properties

	    case 'object':
	      // additional checks for object instances
	      switch(typeA.cls) {
	        // check regexp flags
	        // TODO add es6 flags
	        case 'regexp':
	          p = ['source', 'global', 'multiline', 'lastIndex', 'ignoreCase'];
	          while(p.length) {
	            r = checkPropertyEquality(p.shift());
	            if(!r.result && !opts.collectAllFails) return r;
	          }
	          break;//check user properties

	        //check by timestamp only (using .valueOf)
	        case 'date':
	          if(+a !== +b) {
	            r = result(false, REASON.EQUALITY);
	            if(!r.result && !opts.collectAllFails) return r;
	          }
	          break;//check user properties

	        //primitive type wrappers
	        case 'number':
	        case 'boolean':
	        case 'string':
	          //check their internal value
	          r = checkAlso(a.valueOf(), b.valueOf());
	          if(!r.result) {
	            r.reason = REASON.WRAPPED_VALUE;
	            if(!opts.collectAllFails) return r;
	          }
	          break;//check user properties

	        //node buffer
	        case 'buffer':
	          //if length different it is obviously different
	          r = checkPropertyEquality('length');
	          if(!r.result && !opts.collectAllFails) return r;

	          l = a.length;
	          while(l--) {
	            r = checkPropertyEquality(l);
	            if(!r.result && !opts.collectAllFails) return r;
	          }

	          //we do not check for user properties because
	          //node Buffer have some strange hidden properties
	          return EQUALS;

	        case 'error':
	          //check defined properties
	          p = ['name', 'message'];
	          while(p.length) {
	            r = checkPropertyEquality(p.shift());
	            if(!r.result && !opts.collectAllFails) return r;
	          }

	          break;//check user properties

	        case 'array':
	        case 'arguments':
	        case 'typed-array':
	          r = checkPropertyEquality('length');
	          if(!r.result && !opts.collectAllFails) return r;

	          break;//check user properties

	        case 'array-buffer':
	          r = checkPropertyEquality('byteLength');
	          if(!r.result && !opts.collectAllFails) return r;

	          break;//check user properties

	        case 'map':
	        case 'set':
	          r = checkPropertyEquality('size');
	          if(!r.result && !opts.collectAllFails) return r;

	          stackA.push(a);
	          stackB.push(b);

	          var itA = a.entries();
	          var nextA = itA.next();

	          while(!nextA.done) {
	            key = nextA.value[0];
	            //first check for primitive key if we can do light check
	            //using .has and .get
	            if(getType(key).type != 'object') {
	              if(b.has(key)) {
	                if(typeA.cls == 'map') {
	                  //for map we also check its value to be equal
	                  var value = b.get(key);
	                  r = checkAlso(nextA.value[1], value);
	                  if(!r.result) {
	                    r.a = nextA.value;
	                    r.b = value;
	                    r.reason = REASON.MAP_VALUE_EQUALITY;

	                    if(!opts.collectAllFails) break;
	                  }
	                }

	              } else {
	                r = result(false, REASON.SET_MAP_MISSING_KEY);
	                r.a = key;
	                r.b = key;

	                if(!opts.collectAllFails) break;
	              }
	            } else {
	              //heavy check
	              //we search by iterator for key equality using equal
	              var itB = b.entries();
	              var nextB = itB.next();

	              while(!nextB.done) {
	                //first check for keys
	                r = checkAlso(nextA.value[0], nextB.value[0]);

	                if(!r.result) {
	                  r.reason = REASON.SET_MAP_MISSING_KEY;
	                  r.a = key;
	                  r.b = key;
	                } else {
	                  if(typeA.cls == 'map') {
	                    r = checkAlso(nextA.value[1], nextB.value[1]);

	                    if(!r.result) {
	                      r.a = nextA.value;
	                      r.b = nextB.value;
	                      r.reason = REASON.MAP_VALUE_EQUALITY;
	                    }
	                  }

	                  if(!opts.collectAllFails) break;
	                }

	                nextB = itB.next();
	              }
	            }

	            if(!r.result && !opts.collectAllFails) break;

	            nextA = itA.next();
	          }

	          stackA.pop();
	          stackB.pop();

	          if(!r.result) {
	            r.reason = REASON.SET_MAP_MISSING_ENTRY;
	            if(!opts.collectAllFails) return r;
	          }

	          break; //check user properties
	      }
	  }

	  // compare deep objects and arrays
	  // stacks contain references only
	  //

	  l = stackA.length;
	  while(l--) {
	    if(stackA[l] == a) {
	      return result(stackB[l] == b, REASON.CIRCULAR_VALUES);
	    }
	  }

	  // add `a` and `b` to the stack of traversed objects
	  stackA.push(a);
	  stackB.push(b);

	  for(key in b) {
	    if(hasOwnProperty.call(b, key)) {
	      r = result(hasOwnProperty.call(a, key), REASON.MISSING_KEY, 'A', key);
	      if(!r.result && !opts.collectAllFails) break;

	      if(r.result) {
	        r = checkPropertyEquality(key);
	        if(!r.result && !opts.collectAllFails) break;
	      }
	    }
	  }

	  if(r.result || opts.collectAllFails) {
	    // ensure both objects have the same number of properties
	    for(key in a) {
	      if(hasOwnProperty.call(a, key)) {
	        r = result(hasOwnProperty.call(b, key), REASON.MISSING_KEY, 'B', key);
	        if(!r.result && !opts.collectAllFails) return r;
	      }
	    }
	  }

	  stackA.pop();
	  stackB.pop();

	  if(!r.result && !opts.collectAllFails) return r;

	  var prototypesEquals = false, canComparePrototypes = false;

	  if(opts.checkProtoEql) {
	    if(Object.getPrototypeOf) {//TODO should i check prototypes for === or use eq?
	      prototypesEquals = Object.getPrototypeOf(a) === Object.getPrototypeOf(b);
	      canComparePrototypes = true;
	    }

	    if(canComparePrototypes && !prototypesEquals) {
	      r = result(prototypesEquals, REASON.EQUALITY_PROTOTYPE);
	      r.showReason = true;
	      if(!r.result && !opts.collectAllFails) {
	        return r;
	      }
	    }
	  }

	  return EQUALS;
	}

	var defaultOptions = {
	  checkProtoEql: true,
	  checkSubType: true,
	  plusZeroAndMinusZeroEqual: false
	};

	function eq(a, b, opts) {
	  opts = opts || {};
	  if(typeof opts.checkProtoEql !== 'boolean') {
	    opts.checkProtoEql = defaultOptions.checkProtoEql;
	  }
	  if(typeof opts.checkSubType !== 'boolean') {
	    opts.checkSubType = defaultOptions.checkSubType;
	  }
	  if(typeof opts.plusZeroAndMinusZeroEqual !== 'boolean') {
	    opts.plusZeroAndMinusZeroEqual = defaultOptions.plusZeroAndMinusZeroEqual;
	  }

	  var fails = [];
	  var r = eqInternal(a, b, opts, [], [], [], fails);
	  return opts.collectAllFails ? fails : r;
	}

	module.exports = eq;

	eq.r = REASON;


/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = function format(msg) {
	  var args = arguments;
	  for(var i = 1, l = args.length; i < l; i++) {
	    msg = msg.replace(/%s/, args[i]);
	  }
	  return msg;
	}


/***/ },
/* 20 */
/***/ function(module, exports) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	module.exports = function(should, Assertion) {
	  /**
	   * Simple chaining. It actually do nothing.
	   *
	   * @memberOf Assertion
	   * @name be
	   * @property {should.Assertion} be
	   * @alias Assertion#an
	   * @alias Assertion#of
	   * @alias Assertion#a
	   * @alias Assertion#and
	   * @alias Assertion#have
	   * @alias Assertion#has
	   * @alias Assertion#with
	   * @alias Assertion#is
	   * @alias Assertion#which
	   * @alias Assertion#the
	   * @alias Assertion#it
	   * @category assertion chaining
	   */
	  ['an', 'of', 'a', 'and', 'be', 'has', 'have', 'with', 'is', 'which', 'the', 'it'].forEach(function(name) {
	    Assertion.addChain(name);
	  });
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	module.exports = function(should, Assertion) {
	  /**
	   * Assert given object is exactly `true`.
	   *
	   * @name true
	   * @memberOf Assertion
	   * @category assertion bool
	   * @alias Assertion#True
	   * @param {string} [message] Optional message
	   * @example
	   *
	   * (true).should.be.true();
	   * false.should.not.be.true();
	   *
	   * ({ a: 10}).should.not.be.true();
	   */
	  Assertion.add('true', function(message) {
	    this.is.exactly(true, message);
	  });

	  Assertion.alias('true', 'True');

	  /**
	   * Assert given object is exactly `false`.
	   *
	   * @name false
	   * @memberOf Assertion
	   * @category assertion bool
	   * @alias Assertion#False
	   * @param {string} [message] Optional message
	   * @example
	   *
	   * (true).should.not.be.false();
	   * false.should.be.false();
	   */
	  Assertion.add('false', function(message) {
	    this.is.exactly(false, message);
	  });

	  Assertion.alias('false', 'False');

	  /**
	   * Assert given object is thuthy according javascript type conversions.
	   *
	   * @name ok
	   * @memberOf Assertion
	   * @category assertion bool
	   * @example
	   *
	   * (true).should.be.ok();
	   * ''.should.not.be.ok();
	   * should(null).not.be.ok();
	   * should(void 0).not.be.ok();
	   *
	   * (10).should.be.ok();
	   * (0).should.not.be.ok();
	   */
	  Assertion.add('ok', function() {
	    this.params = { operator: 'to be truthy' };

	    this.assert(this.obj);
	  });
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	module.exports = function(should, Assertion) {

	  /**
	   * Assert given object is NaN
	   * @name NaN
	   * @memberOf Assertion
	   * @category assertion numbers
	   * @example
	   *
	   * (10).should.not.be.NaN();
	   * NaN.should.be.NaN();
	   */
	  Assertion.add('NaN', function() {
	    this.params = { operator: 'to be NaN' };

	    this.assert(this.obj !== this.obj);
	  });

	  /**
	   * Assert given object is not finite (positive or negative)
	   *
	   * @name Infinity
	   * @memberOf Assertion
	   * @category assertion numbers
	   * @example
	   *
	   * (10).should.not.be.Infinity();
	   * NaN.should.not.be.Infinity();
	   */
	  Assertion.add('Infinity', function() {
	    this.params = { operator: 'to be Infinity' };

	    this.is.a.Number()
	      .and.not.a.NaN()
	      .and.assert(!isFinite(this.obj));
	  });

	  /**
	   * Assert given number between `start` and `finish` or equal one of them.
	   *
	   * @name within
	   * @memberOf Assertion
	   * @category assertion numbers
	   * @param {number} start Start number
	   * @param {number} finish Finish number
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * (10).should.be.within(0, 20);
	   */
	  Assertion.add('within', function(start, finish, description) {
	    this.params = { operator: 'to be within ' + start + '..' + finish, message: description };

	    this.assert(this.obj >= start && this.obj <= finish);
	  });

	  /**
	   * Assert given number near some other `value` within `delta`
	   *
	   * @name approximately
	   * @memberOf Assertion
	   * @category assertion numbers
	   * @param {number} value Center number
	   * @param {number} delta Radius
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * (9.99).should.be.approximately(10, 0.1);
	   */
	  Assertion.add('approximately', function(value, delta, description) {
	    this.params = { operator: 'to be approximately ' + value + ' ±' + delta, message: description };

	    this.assert(Math.abs(this.obj - value) <= delta);
	  });

	  /**
	   * Assert given number above `n`.
	   *
	   * @name above
	   * @alias Assertion#greaterThan
	   * @memberOf Assertion
	   * @category assertion numbers
	   * @param {number} n Margin number
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * (10).should.be.above(0);
	   */
	  Assertion.add('above', function(n, description) {
	    this.params = { operator: 'to be above ' + n, message: description };

	    this.assert(this.obj > n);
	  });

	  /**
	   * Assert given number below `n`.
	   *
	   * @name below
	   * @alias Assertion#lessThan
	   * @memberOf Assertion
	   * @category assertion numbers
	   * @param {number} n Margin number
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * (0).should.be.below(10);
	   */
	  Assertion.add('below', function(n, description) {
	    this.params = { operator: 'to be below ' + n, message: description };

	    this.assert(this.obj < n);
	  });

	  Assertion.alias('above', 'greaterThan');
	  Assertion.alias('below', 'lessThan');

	  /**
	   * Assert given number above `n`.
	   *
	   * @name aboveOrEqual
	   * @alias Assertion#greaterThanOrEqual
	   * @memberOf Assertion
	   * @category assertion numbers
	   * @param {number} n Margin number
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * (10).should.be.aboveOrEqual(0);
	   * (10).should.be.aboveOrEqual(10);
	   */
	  Assertion.add('aboveOrEqual', function(n, description) {
	    this.params = { operator: 'to be above or equal' + n, message: description };

	    this.assert(this.obj >= n);
	  });

	  /**
	   * Assert given number below `n`.
	   *
	   * @name belowOrEqual
	   * @alias Assertion#lessThanOrEqual
	   * @memberOf Assertion
	   * @category assertion numbers
	   * @param {number} n Margin number
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * (0).should.be.belowOrEqual(10);
	   * (0).should.be.belowOrEqual(0);
	   */
	  Assertion.add('belowOrEqual', function(n, description) {
	    this.params = { operator: 'to be below or equal' + n, message: description };

	    this.assert(this.obj <= n);
	  });

	  Assertion.alias('aboveOrEqual', 'greaterThanOrEqual');
	  Assertion.alias('belowOrEqual', 'lessThanOrEqual');

	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	var eql = __webpack_require__(18);
	var type = __webpack_require__(5);
	var util = __webpack_require__(4);

	function formatEqlResult(r, a, b) {
	  return ((r.path.length > 0 ? 'at ' + r.path.map(util.formatProp).join(' -> ') : '') +
	  (r.a === a ? '' : ', A has ' + util.format(r.a)) +
	  (r.b === b ? '' : ' and B has ' + util.format(r.b)) +
	  (r.showReason ? ' because ' + r.reason : '')).trim();
	}

	module.exports = function(should, Assertion) {

	  /**
	   * Deep object equality comparison. For full spec see [`should-equal tests`](https://github.com/shouldjs/equal/blob/master/test.js).
	   *
	   * @name eql
	   * @memberOf Assertion
	   * @category assertion equality
	   * @alias Assertion#deepEqual
	   * @param {*} val Expected value
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * (10).should.be.eql(10);
	   * ('10').should.not.be.eql(10);
	   * (-0).should.not.be.eql(+0);
	   *
	   * NaN.should.be.eql(NaN);
	   *
	   * ({ a: 10}).should.be.eql({ a: 10 });
	   * [ 'a' ].should.not.be.eql({ '0': 'a' });
	   */
	  Assertion.add('eql', function(val, description) {
	    this.params = {operator: 'to equal', expected: val, message: description};

	    var result = eql(this.obj, val, should.config);
	    this.params.details = result.result ? '' : formatEqlResult(result, this.obj, val);

	    this.params.showDiff = eql(type(this.obj), type(val)).result;

	    this.assert(result.result);
	  });

	  /**
	   * Exact comparison using ===.
	   *
	   * @name equal
	   * @memberOf Assertion
	   * @category assertion equality
	   * @alias Assertion#exactly
	   * @param {*} val Expected value
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * 10.should.be.equal(10);
	   * 'a'.should.be.exactly('a');
	   *
	   * should(null).be.exactly(null);
	   */
	  Assertion.add('equal', function(val, description) {
	    this.params = {operator: 'to be', expected: val, message: description};

	    this.params.showDiff = eql(type(this.obj), type(val)).result;

	    this.assert(val === this.obj);
	  });

	  Assertion.alias('equal', 'exactly');
	  Assertion.alias('eql', 'deepEqual');

	  function addOneOf(name, message, method) {
	    Assertion.add(name, function(vals) {
	      if (arguments.length !== 1) {
	        vals = Array.prototype.slice.call(arguments);
	      } else {
	        should(vals).be.Array();
	      }

	      this.params = {operator: message, expected: vals};

	      var obj = this.obj;
	      var found = false;

	      util.forEach(vals, function(val) {
	        try {
	          should(val)[method](obj);
	          found = true;
	          return false;
	        } catch (e) {
	          if (e instanceof should.AssertionError) {
	            return;//do nothing
	          }
	          throw e;
	        }
	      });

	      this.assert(found);
	    });
	  }

	  /**
	   * Exact comparison using === to be one of supplied objects.
	   *
	   * @name equalOneOf
	   * @memberOf Assertion
	   * @category assertion equality
	   * @param {Array|*} vals Expected values
	   * @example
	   *
	   * 'ab'.should.be.equalOneOf('a', 10, 'ab');
	   * 'ab'.should.be.equalOneOf(['a', 10, 'ab']);
	   */
	  addOneOf('equalOneOf', 'to be equals one of', 'equal');

	  /**
	   * Exact comparison using .eql to be one of supplied objects.
	   *
	   * @name oneOf
	   * @memberOf Assertion
	   * @category assertion equality
	   * @param {Array|*} vals Expected values
	   * @example
	   *
	   * ({a: 10}).should.be.oneOf('a', 10, 'ab', {a: 10});
	   * ({a: 10}).should.be.oneOf(['a', 10, 'ab', {a: 10}]);
	   */
	  addOneOf('oneOf', 'to be one of', 'eql');

	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	var util = __webpack_require__(4);

	module.exports = function(should, Assertion) {
	  /**
	   * Assert given object is number
	   * @name Number
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('Number', function() {
	    this.params = {operator: 'to be a number'};

	    this.have.type('number');
	  });

	  /**
	   * Assert given object is arguments
	   * @name arguments
	   * @alias Assertion#Arguments
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('arguments', function() {
	    this.params = {operator: 'to be arguments'};

	    this.have.class('Arguments');
	  });

	  Assertion.alias('arguments', 'Arguments');

	  /**
	   * Assert given object has some type using `typeof`
	   * @name type
	   * @memberOf Assertion
	   * @param {string} type Type name
	   * @param {string} [description] Optional message
	   * @category assertion types
	   */
	  Assertion.add('type', function(type, description) {
	    this.params = {operator: 'to have type ' + type, message: description};

	    should(typeof this.obj).be.exactly(type);
	  });

	  /**
	   * Assert given object is instance of `constructor`
	   * @name instanceof
	   * @alias Assertion#instanceOf
	   * @memberOf Assertion
	   * @param {Function} constructor Constructor function
	   * @param {string} [description] Optional message
	   * @category assertion types
	   */
	  Assertion.add('instanceof', function(constructor, description) {
	    this.params = {operator: 'to be an instance of ' + util.functionName(constructor), message: description};

	    this.assert(Object(this.obj) instanceof constructor);
	  });

	  Assertion.alias('instanceof', 'instanceOf');

	  /**
	   * Assert given object is function
	   * @name Function
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('Function', function() {
	    this.params = {operator: 'to be a function'};

	    this.have.type('function');
	  });

	  /**
	   * Assert given object is object
	   * @name Object
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('Object', function() {
	    this.params = {operator: 'to be an object'};

	    this.is.not.null().and.have.type('object');
	  });

	  /**
	   * Assert given object is string
	   * @name String
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('String', function() {
	    this.params = {operator: 'to be a string'};

	    this.have.type('string');
	  });

	  /**
	   * Assert given object is array
	   * @name Array
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('Array', function() {
	    this.params = {operator: 'to be an array'};

	    this.have.class('Array');
	  });

	  /**
	   * Assert given object is boolean
	   * @name Boolean
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('Boolean', function() {
	    this.params = {operator: 'to be a boolean'};

	    this.have.type('boolean');
	  });

	  /**
	   * Assert given object is error
	   * @name Error
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('Error', function() {
	    this.params = {operator: 'to be an error'};

	    this.have.instanceOf(Error);
	  });

	  /**
	   * Assert given object is a date
	   * @name Date
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('Date', function() {
	    this.params = {operator: 'to be a date'};

	    this.have.instanceOf(Date);
	  });

	  /**
	   * Assert given object is null
	   * @name null
	   * @alias Assertion#Null
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('null', function() {
	    this.params = {operator: 'to be null'};

	    this.assert(this.obj === null);
	  });

	  Assertion.alias('null', 'Null');

	  /**
	   * Assert given object has some internal [[Class]], via Object.prototype.toString call
	   * @name class
	   * @alias Assertion#Class
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('class', function(cls) {
	    this.params = {operator: 'to have [[Class]] ' + cls};

	    this.assert(Object.prototype.toString.call(this.obj) === '[object ' + cls + ']');
	  });

	  Assertion.alias('class', 'Class');

	  /**
	   * Assert given object is undefined
	   * @name undefined
	   * @alias Assertion#Undefined
	   * @memberOf Assertion
	   * @category assertion types
	   */
	  Assertion.add('undefined', function() {
	    this.params = {operator: 'to be undefined'};

	    this.assert(this.obj === void 0);
	  });

	  Assertion.alias('undefined', 'Undefined');

	  /**
	   * Assert given object supports es6 iterable protocol (just check
	   * that object has property Symbol.iterator, which is a function)
	   * @name iterable
	   * @memberOf Assertion
	   * @category assertion es6
	   */
	  Assertion.add('iterable', function() {
	    this.params = {operator: 'to be iterable'};

	    should(this.obj).have.property(Symbol.iterator).which.is.a.Function();
	  });

	  /**
	   * Assert given object supports es6 iterator protocol (just check
	   * that object has property next, which is a function)
	   * @name iterator
	   * @memberOf Assertion
	   * @category assertion es6
	   */
	  Assertion.add('iterator', function() {
	    this.params = {operator: 'to be iterator'};

	    should(this.obj).have.property('next').which.is.a.Function();
	  });

	  /**
	   * Assert given object is a generator object
	   * @name generator
	   * @memberOf Assertion
	   * @category assertion es6
	   */
	  Assertion.add('generator', function() {
	    this.params = {operator: 'to be generator'};

	    should(this.obj).be.iterable
	      .and.iterator
	      .and.it.is.equal(this.obj[Symbol.iterator]());
	  });
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	module.exports = function(should, Assertion) {
	  /**
	   * Assert given string starts with prefix
	   * @name startWith
	   * @memberOf Assertion
	   * @category assertion strings
	   * @param {string} str Prefix
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * 'abc'.should.startWith('a');
	   */
	  Assertion.add('startWith', function(str, description) {
	    this.params = { operator: 'to start with ' + should.format(str), message: description };

	    this.assert(0 === this.obj.indexOf(str));
	  });

	  /**
	   * Assert given string ends with prefix
	   * @name endWith
	   * @memberOf Assertion
	   * @category assertion strings
	   * @param {string} str Prefix
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * 'abca'.should.endWith('a');
	   */
	  Assertion.add('endWith', function(str, description) {
	    this.params = { operator: 'to end with ' + should.format(str), message: description };

	    this.assert(this.obj.indexOf(str, this.obj.length - str.length) >= 0);
	  });
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	var util = __webpack_require__(4);
	var eql = __webpack_require__(18);

	var aSlice = Array.prototype.slice;

	module.exports = function(should, Assertion) {
	  var i = should.format;
	  /**
	   * Asserts given object has some descriptor. **On success it change given object to be value of property**.
	   *
	   * @name propertyWithDescriptor
	   * @memberOf Assertion
	   * @category assertion property
	   * @param {string} name Name of property
	   * @param {Object} desc Descriptor like used in Object.defineProperty (not required to add all properties)
	   * @example
	   *
	   * ({ a: 10 }).should.have.propertyWithDescriptor('a', { enumerable: true });
	   */
	  Assertion.add('propertyWithDescriptor', function(name, desc) {
	    this.params = {actual: this.obj, operator: 'to have own property with descriptor ' + i(desc)};
	    var obj = this.obj;
	    this.have.ownProperty(name);
	    should(Object.getOwnPropertyDescriptor(Object(obj), name)).have.properties(desc);
	  });

	  function processPropsArgs() {
	    var args = {};
	    if (arguments.length > 1) {
	      args.names = aSlice.call(arguments);
	    } else {
	      var arg = arguments[0];
	      if (typeof arg === 'string') {
	        args.names = [arg];
	      } else if (util.isIndexable(arg)) {
	        args.names = arg;
	      } else {
	        args.names = Object.keys(arg);
	        args.values = arg;
	      }
	    }
	    return args;
	  }


	  /**
	   * Asserts given object has enumerable property with optionally value. **On success it change given object to be value of property**.
	   *
	   * @name enumerable
	   * @memberOf Assertion
	   * @category assertion property
	   * @param {string} name Name of property
	   * @param {*} [val] Optional property value to check
	   * @example
	   *
	   * ({ a: 10 }).should.have.enumerable('a');
	   */
	  Assertion.add('enumerable', function(name, val) {
	    name = util.convertPropertyName(name);

	    this.params = {
	      operator: "to have enumerable property " + util.formatProp(name) + (arguments.length > 1 ? " equal to " + i(val): "")
	    };

	    var desc = { enumerable: true };
	    if (arguments.length > 1) desc.value = val;
	    this.have.propertyWithDescriptor(name, desc);
	  });

	  /**
	   * Asserts given object has enumerable properties
	   *
	   * @name enumerables
	   * @memberOf Assertion
	   * @category assertion property
	   * @param {Array|...string|Object} names Names of property
	   * @example
	   *
	   * ({ a: 10, b: 10 }).should.have.enumerables('a');
	   */
	  Assertion.add('enumerables', function(/*names*/) {
	    var args = processPropsArgs.apply(null, arguments);

	    this.params = {
	      operator: "to have enumerables " + args.names.map(util.formatProp)
	    };

	    var obj = this.obj;
	    args.names.forEach(function(name) {
	      should(obj).have.enumerable(name);
	    });
	  });

	  /**
	   * Asserts given object has property with optionally value. **On success it change given object to be value of property**.
	   *
	   * @name property
	   * @memberOf Assertion
	   * @category assertion property
	   * @param {string} name Name of property
	   * @param {*} [val] Optional property value to check
	   * @example
	   *
	   * ({ a: 10 }).should.have.property('a');
	   */
	  Assertion.add('property', function(name, val) {
	    name = util.convertPropertyName(name);
	    if (arguments.length > 1) {
	      var p = {};
	      p[name] = val;
	      this.have.properties(p);
	    } else {
	      this.have.properties(name);
	    }
	    this.obj = this.obj[name];
	  });

	  /**
	   * Asserts given object has properties. On this method affect .any modifier, which allow to check not all properties.
	   *
	   * @name properties
	   * @memberOf Assertion
	   * @category assertion property
	   * @param {Array|...string|Object} names Names of property
	   * @example
	   *
	   * ({ a: 10 }).should.have.properties('a');
	   * ({ a: 10, b: 20 }).should.have.properties([ 'a' ]);
	   * ({ a: 10, b: 20 }).should.have.properties({ b: 20 });
	   */
	  Assertion.add('properties', function(names) {
	    var values = {};
	    if (arguments.length > 1) {
	      names = aSlice.call(arguments);
	    } else if (!Array.isArray(names)) {
	      if (typeof names == 'string' || typeof names == 'symbol') {
	        names = [names];
	      } else {
	        values = names;
	        names = Object.keys(names);
	      }
	    }

	    var obj = Object(this.obj), missingProperties = [];

	    //just enumerate properties and check if they all present
	    names.forEach(function(name) {
	      if (!(name in obj)) missingProperties.push(util.formatProp(name));
	    });

	    var props = missingProperties;
	    if (props.length === 0) {
	      props = names.map(util.formatProp);
	    } else if (this.anyOne) {
	      props = names.filter(function(name) {
	        return missingProperties.indexOf(util.formatProp(name)) < 0;
	      }).map(util.formatProp);
	    }

	    var operator = (props.length === 1 ?
	        'to have property ' : 'to have ' + (this.anyOne ? 'any of ' : '') + 'properties ') + props.join(', ');

	    this.params = {obj: this.obj, operator: operator};

	    //check that all properties presented
	    //or if we request one of them that at least one them presented
	    this.assert(missingProperties.length === 0 || (this.anyOne && missingProperties.length != names.length));

	    // check if values in object matched expected
	    var valueCheckNames = Object.keys(values);
	    if (valueCheckNames.length) {
	      var wrongValues = [];
	      props = [];

	      // now check values, as there we have all properties
	      valueCheckNames.forEach(function(name) {
	        var value = values[name];
	        if (!eql(obj[name], value).result) {
	          wrongValues.push(util.formatProp(name) + ' of ' + i(value) + ' (got ' + i(obj[name]) + ')');
	        } else {
	          props.push(util.formatProp(name) + ' of ' + i(value));
	        }
	      });

	      if ((wrongValues.length !== 0 && !this.anyOne) || (this.anyOne && props.length === 0)) {
	        props = wrongValues;
	      }

	      operator = (props.length === 1 ?
	        'to have property ' : 'to have ' + (this.anyOne ? 'any of ' : '') + 'properties ') + props.join(', ');

	      this.params = {obj: this.obj, operator: operator};

	      //if there is no not matched values
	      //or there is at least one matched
	      this.assert(wrongValues.length === 0 || (this.anyOne && wrongValues.length != valueCheckNames.length));
	    }
	  });

	  /**
	   * Asserts given object has property `length` with given value `n`
	   *
	   * @name length
	   * @alias Assertion#lengthOf
	   * @memberOf Assertion
	   * @category assertion property
	   * @param {number} n Expected length
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * [1, 2].should.have.length(2);
	   */
	  Assertion.add('length', function(n, description) {
	    this.have.property('length', n, description);
	  });

	  Assertion.alias('length', 'lengthOf');

	  var hasOwnProperty = Object.prototype.hasOwnProperty;

	  /**
	   * Asserts given object has own property. **On success it change given object to be value of property**.
	   *
	   * @name ownProperty
	   * @alias Assertion#hasOwnProperty
	   * @memberOf Assertion
	   * @category assertion property
	   * @param {string} name Name of property
	   * @param {string} [description] Optional message
	   * @example
	   *
	   * ({ a: 10 }).should.have.ownProperty('a');
	   */
	  Assertion.add('ownProperty', function(name, description) {
	    name = util.convertPropertyName(name);
	    this.params = {
	      actual: this.obj,
	      operator: 'to have own property ' + util.formatProp(name),
	      message: description
	    };

	    this.assert(hasOwnProperty.call(this.obj, name));

	    this.obj = this.obj[name];
	  });

	  Assertion.alias('ownProperty', 'hasOwnProperty');

	  /**
	   * Asserts given object is empty. For strings, arrays and arguments it checks .length property, for objects it checks keys.
	   *
	   * @name empty
	   * @memberOf Assertion
	   * @category assertion property
	   * @example
	   *
	   * ''.should.be.empty();
	   * [].should.be.empty();
	   * ({}).should.be.empty();
	   */
	  Assertion.add('empty', function() {
	    this.params = {operator: 'to be empty'};

	    if (util.length(this.obj) !== void 0) {
	      should(this.obj).have.property('length', 0);
	    } else {
	      var obj = Object(this.obj); // wrap to reference for booleans and numbers
	      for (var prop in obj) {
	        should(this.obj).not.have.ownProperty(prop);
	      }
	    }
	  }, true);

	  /**
	   * Asserts given object has exact keys. Compared to `properties`, `keys` does not accept Object as a argument.
	   *
	   * @name keys
	   * @alias Assertion#key
	   * @memberOf Assertion
	   * @category assertion property
	   * @param {Array|...string} [keys] Keys to check
	   * @example
	   *
	   * ({ a: 10 }).should.have.keys('a');
	   * ({ a: 10, b: 20 }).should.have.keys('a', 'b');
	   * ({ a: 10, b: 20 }).should.have.keys([ 'a', 'b' ]);
	   * ({}).should.have.keys();
	   */
	  Assertion.add('keys', function(keys) {
	    if (arguments.length > 1) keys = aSlice.call(arguments);
	    else if (arguments.length === 1 && typeof keys === 'string') keys = [keys];
	    else if (arguments.length === 0) keys = [];

	    keys = keys.map(String);

	    var obj = Object(this.obj);

	    // first check if some keys are missing
	    var missingKeys = [];
	    keys.forEach(function(key) {
	      if (!hasOwnProperty.call(this.obj, key))
	        missingKeys.push(util.formatProp(key));
	    }, this);

	    // second check for extra keys
	    var extraKeys = [];
	    Object.keys(obj).forEach(function(key) {
	      if (keys.indexOf(key) < 0) {
	        extraKeys.push(util.formatProp(key));
	      }
	    });

	    var verb = keys.length === 0 ? 'to be empty' :
	    'to have ' + (keys.length === 1 ? 'key ' : 'keys ');

	    this.params = {operator: verb + keys.map(util.formatProp).join(', ')};

	    if (missingKeys.length > 0)
	      this.params.operator += '\n\tmissing keys: ' + missingKeys.join(', ');

	    if (extraKeys.length > 0)
	      this.params.operator += '\n\textra keys: ' + extraKeys.join(', ');

	    this.assert(missingKeys.length === 0 && extraKeys.length === 0);
	  });

	  Assertion.alias("keys", "key");

	  /**
	   * Asserts given object has nested property in depth by path. **On success it change given object to be value of final property**.
	   *
	   * @name propertyByPath
	   * @memberOf Assertion
	   * @category assertion property
	   * @param {Array|...string} properties Properties path to search
	   * @example
	   *
	   * ({ a: {b: 10}}).should.have.propertyByPath('a', 'b').eql(10);
	   */
	  Assertion.add('propertyByPath', function(properties) {
	    if (arguments.length > 1) properties = aSlice.call(arguments);
	    else if (arguments.length === 1 && typeof properties == 'string') properties = [properties];
	    else if (arguments.length === 0) properties = [];

	    var allProps = properties.map(util.formatProp);

	    properties = properties.map(String);

	    var obj = should(Object(this.obj));

	    var foundProperties = [];

	    var currentProperty;
	    while (properties.length) {
	      currentProperty = properties.shift();
	      this.params = {operator: 'to have property by path ' + allProps.join(', ') + ' - failed on ' + util.formatProp(currentProperty)};
	      obj = obj.have.property(currentProperty);
	      foundProperties.push(currentProperty);
	    }

	    this.params = {obj: this.obj, operator: 'to have property by path ' + allProps.join(', ')};

	    this.obj = obj.obj;
	  });
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */
	var util = __webpack_require__(4);

	module.exports = function(should, Assertion) {
	  var i = should.format;

	  /**
	   * Assert given function throws error with such message.
	   *
	   * @name throw
	   * @memberOf Assertion
	   * @category assertion errors
	   * @alias Assertion#throwError
	   * @param {string|RegExp|Function|Object|GeneratorFunction|GeneratorObject} [message] Message to match or properties
	   * @param {Object} [properties] Optional properties that will be matched to thrown error
	   * @example
	   *
	   * (function(){ throw new Error('fail') }).should.throw();
	   * (function(){ throw new Error('fail') }).should.throw('fail');
	   * (function(){ throw new Error('fail') }).should.throw(/fail/);
	   *
	   * (function(){ throw new Error('fail') }).should.throw(Error);
	   * var error = new Error();
	   * error.a = 10;
	   * (function(){ throw error; }).should.throw(Error, { a: 10 });
	   * (function(){ throw error; }).should.throw({ a: 10 });
	   * (function*() {
	   *   yield throwError();
	   * }).should.throw();
	   */
	  Assertion.add('throw', function(message, properties) {
	    var fn = this.obj;
	    var err = {};
	    var errorInfo = '';
	    var thrown = false;

	    if (util.isGeneratorFunction(fn)) {
	      return should(fn()).throw(message, properties);
	    } else if (util.isGeneratorObject(fn)) {
	      return should(fn.next.bind(fn)).throw(message, properties);
	    }

	    this.is.a.Function();

	    var errorMatched = true;

	    try {
	      fn();
	    } catch (e) {
	      thrown = true;
	      err = e;
	    }

	    if (thrown) {
	      if (message) {
	        if ('string' == typeof message) {
	          errorMatched = message == err.message;
	        } else if (message instanceof RegExp) {
	          errorMatched = message.test(err.message);
	        } else if ('function' == typeof message) {
	          errorMatched = err instanceof message;
	        } else if (null != message) {
	          try {
	            should(err).match(message);
	          } catch (e) {
	            if (e instanceof should.AssertionError) {
	              errorInfo = ": " + e.message;
	              errorMatched = false;
	            } else {
	              throw e;
	            }
	          }
	        }

	        if (!errorMatched) {
	          if ('string' == typeof message || message instanceof RegExp) {
	            errorInfo = " with a message matching " + i(message) + ", but got '" + err.message + "'";
	          } else if ('function' == typeof message) {
	            errorInfo = " of type " + util.functionName(message) + ", but got " + util.functionName(err.constructor);
	          }
	        } else if ('function' == typeof message && properties) {
	          try {
	            should(err).match(properties);
	          } catch (e) {
	            if (e instanceof should.AssertionError) {
	              errorInfo = ": " + e.message;
	              errorMatched = false;
	            } else {
	              throw e;
	            }
	          }
	        }
	      } else {
	        errorInfo = " (got " + i(err) + ")";
	      }
	    }

	    this.params = { operator: 'to throw exception' + errorInfo };

	    this.assert(thrown);
	    this.assert(errorMatched);
	  });

	  Assertion.alias('throw', 'throwError');
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	var util = __webpack_require__(4);
	var eql = __webpack_require__(18);

	module.exports = function(should, Assertion) {
	  var i = should.format;

	  /**
	   * Asserts if given object match `other` object, using some assumptions:
	   * First object matched if they are equal,
	   * If `other` is a regexp and given object is a string check on matching with regexp
	   * If `other` is a regexp and given object is an array check if all elements matched regexp
	   * If `other` is a regexp and given object is an object check values on matching regexp
	   * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
	   * If `other` is an object check if the same keys matched with above rules
	   * All other cases failed.
	   *
	   * Usually it is right idea to add pre type assertions, like `.String()` or `.Object()` to be sure assertions will do what you are expecting.
	   * Object iteration happen by keys (properties with enumerable: true), thus some objects can cause small pain. Typical example is js
	   * Error - it by default has 2 properties `name` and `message`, but they both non-enumerable. In this case make sure you specify checking props (see examples).
	   *
	   * @name match
	   * @memberOf Assertion
	   * @category assertion matching
	   * @param {*} other Object to match
	   * @param {string} [description] Optional message
	   * @example
	   * 'foobar'.should.match(/^foo/);
	   * 'foobar'.should.not.match(/^bar/);
	   *
	   * ({ a: 'foo', c: 'barfoo' }).should.match(/foo$/);
	   *
	   * ['a', 'b', 'c'].should.match(/[a-z]/);
	   *
	   * (5).should.not.match(function(n) {
	   *   return n < 0;
	   * });
	   * (5).should.not.match(function(it) {
	   *    it.should.be.an.Array();
	   * });
	   * ({ a: 10, b: 'abc', c: { d: 10 }, d: 0 }).should
	   * .match({ a: 10, b: /c$/, c: function(it) {
	   *    return it.should.have.property('d', 10);
	   * }});
	   *
	   * [10, 'abc', { d: 10 }, 0].should
	   * .match({ '0': 10, '1': /c$/, '2': function(it) {
	   *    return it.should.have.property('d', 10);
	   * }});
	   *
	   * var myString = 'abc';
	   *
	   * myString.should.be.a.String().and.match(/abc/);
	   *
	   * myString = {};
	   *
	   * myString.should.match(/abc/); //yes this will pass
	   * //better to do
	   * myString.should.be.an.Object().and.not.empty().and.match(/abc/);//fixed
	   *
	   * (new Error('boom')).should.match(/abc/);//passed because no keys
	   * (new Error('boom')).should.not.match({ message: /abc/ });//check specified property
	   */
	  Assertion.add('match', function(other, description) {
	    this.params = {operator: 'to match ' + i(other), message: description};

	    if (!eql(this.obj, other).result) {
	      if (other instanceof RegExp) { // something - regex

	        if (typeof this.obj == 'string') {

	          this.assert(other.exec(this.obj));
	        } else if (util.isIndexable(this.obj)) {
	          util.forEach(this.obj, function(item) {
	            this.assert(other.exec(item));// should we try to convert to String and exec?
	          }, this);
	        } else if (null != this.obj && typeof this.obj == 'object') {

	          var notMatchedProps = [], matchedProps = [];
	          util.forEach(this.obj, function(value, name) {
	            if (other.exec(value)) matchedProps.push(util.formatProp(name));
	            else notMatchedProps.push(util.formatProp(name) + ' (' + i(value) + ')');
	          }, this);

	          if (notMatchedProps.length)
	            this.params.operator += '\n    not matched properties: ' + notMatchedProps.join(', ');
	          if (matchedProps.length)
	            this.params.operator += '\n    matched properties: ' + matchedProps.join(', ');

	          this.assert(notMatchedProps.length === 0);
	        } // should we try to convert to String and exec?
	      } else if (typeof other == 'function') {
	        var res;

	        res = other(this.obj);

	        //if(res instanceof Assertion) {
	        //  this.params.operator += '\n    ' + res.getMessage();
	        //}

	        //if we throw exception ok - it is used .should inside
	        if (typeof res == 'boolean') {
	          this.assert(res); // if it is just boolean function assert on it
	        }
	      } else if (other != null && this.obj != null && typeof other == 'object' && typeof this.obj == 'object') { // try to match properties (for Object and Array)
	        notMatchedProps = [];
	        matchedProps = [];

	        util.forEach(other, function(value, key) {
	          try {
	            should(this.obj).have.property(key).which.match(value);
	            matchedProps.push(util.formatProp(key));
	          } catch (e) {
	            if (e instanceof should.AssertionError) {
	              notMatchedProps.push(util.formatProp(key) + ' (' + i(this.obj[key]) + ')');
	            } else {
	              throw e;
	            }
	          }
	        }, this);

	        if (notMatchedProps.length)
	          this.params.operator += '\n    not matched properties: ' + notMatchedProps.join(', ');
	        if (matchedProps.length)
	          this.params.operator += '\n    matched properties: ' + matchedProps.join(', ');

	        this.assert(notMatchedProps.length === 0);
	      } else {
	        this.assert(false);
	      }
	    }
	  });

	  /**
	   * Asserts if given object values or array elements all match `other` object, using some assumptions:
	   * First object matched if they are equal,
	   * If `other` is a regexp - matching with regexp
	   * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
	   * All other cases check if this `other` equal to each element
	   *
	   * @name matchEach
	   * @memberOf Assertion
	   * @category assertion matching
	   * @alias Assertion#matchEvery
	   * @param {*} other Object to match
	   * @param {string} [description] Optional message
	   * @example
	   * [ 'a', 'b', 'c'].should.matchEach(/\w+/);
	   * [ 'a', 'a', 'a'].should.matchEach('a');
	   *
	   * [ 'a', 'a', 'a'].should.matchEach(function(value) { value.should.be.eql('a') });
	   *
	   * { a: 'a', b: 'a', c: 'a' }.should.matchEach(function(value) { value.should.be.eql('a') });
	   */
	  Assertion.add('matchEach', function(other, description) {
	    this.params = {operator: 'to match each ' + i(other), message: description};

	    util.forEach(this.obj, function(value) {
	      should(value).match(other);
	    }, this);
	  });

	  /**
	  * Asserts if any of given object values or array elements match `other` object, using some assumptions:
	  * First object matched if they are equal,
	  * If `other` is a regexp - matching with regexp
	  * If `other` is a function check if this function throws AssertionError on given object or return false - it will be assumed as not matched
	  * All other cases check if this `other` equal to each element
	  *
	  * @name matchAny
	  * @memberOf Assertion
	  * @category assertion matching
	  * @param {*} other Object to match
	  * @alias Assertion#matchSome
	  * @param {string} [description] Optional message
	  * @example
	  * [ 'a', 'b', 'c'].should.matchAny(/\w+/);
	  * [ 'a', 'b', 'c'].should.matchAny('a');
	  *
	  * [ 'a', 'b', 'c'].should.matchAny(function(value) { value.should.be.eql('a') });
	  *
	  * { a: 'a', b: 'b', c: 'c' }.should.matchAny(function(value) { value.should.be.eql('a') });
	  */
	  Assertion.add('matchAny', function(other, description) {
	    this.params = {operator: 'to match any ' + i(other), message: description};

	    this.assert(util.some(this.obj, function(value) {
	      try {
	        should(value).match(other);
	        return true;
	      } catch (e) {
	        if (e instanceof should.AssertionError) {
	          // Caught an AssertionError, return false to the iterator
	          return false;
	        }
	        throw e;
	      }
	    }));
	  });

	  Assertion.alias('matchAny', 'matchSome');
	  Assertion.alias('matchEach', 'matchEvery');
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	var util = __webpack_require__(4);
	var eql = __webpack_require__(18);

	module.exports = function(should, Assertion) {
	  var i = should.format;

	  /**
	   * Assert that given object contain something that equal to `other`. It uses `should-equal` for equality checks.
	   * If given object is array it search that one of elements was equal to `other`.
	   * If given object is string it checks if `other` is a substring - expected that `other` is a string.
	   * If given object is Object it checks that `other` is a subobject - expected that `other` is a object.
	   *
	   * @name containEql
	   * @memberOf Assertion
	   * @category assertion contain
	   * @param {*} other Nested object
	   * @example
	   *
	   * [1, 2, 3].should.containEql(1);
	   * [{ a: 1 }, 'a', 10].should.containEql({ a: 1 });
	   *
	   * 'abc'.should.containEql('b');
	   * 'ab1c'.should.containEql(1);
	   *
	   * ({ a: 10, c: { d: 10 }}).should.containEql({ a: 10 });
	   * ({ a: 10, c: { d: 10 }}).should.containEql({ c: { d: 10 }});
	   * ({ a: 10, c: { d: 10 }}).should.containEql({ b: 10 });
	   * // throws AssertionError: expected { a: 10, c: { d: 10 } } to contain { b: 10 }
	   * //            expected { a: 10, c: { d: 10 } } to have property b
	   */
	  Assertion.add('containEql', function(other) {
	    this.params = {operator: 'to contain ' + i(other)};

	    this.is.not.null().and.not.undefined();

	    var obj = this.obj;

	    if (typeof obj == 'string') {
	      this.assert(obj.indexOf(String(other)) >= 0);
	    } else if (util.isIndexable(obj)) {
	      this.assert(util.some(obj, function(v) {
	        return eql(v, other).result;
	      }));
	    } else {
	      this.have.properties(other);
	    }
	  });

	  /**
	   * Assert that given object is contain equally structured object on the same depth level.
	   * If given object is an array and `other` is an array it checks that the eql elements is going in the same sequence in given array (recursive)
	   * If given object is an object it checks that the same keys contain deep equal values (recursive)
	   * On other cases it try to check with `.eql`
	   *
	   * @name containDeepOrdered
	   * @memberOf Assertion
	   * @category assertion contain
	   * @param {*} other Nested object
	   * @example
	   *
	   * [ 1, 2, 3].should.containDeepOrdered([1, 2]);
	   * [ 1, 2, [ 1, 2, 3 ]].should.containDeepOrdered([ 1, [ 2, 3 ]]);
	   *
	   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({a: 10});
	   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {c: 10}});
	   * ({ a: 10, b: { c: 10, d: [1, 2, 3] }}).should.containDeepOrdered({b: {d: [1, 3]}});
	   */
	  Assertion.add('containDeepOrdered', function(other) {
	    this.params = {operator: 'to contain ' + i(other)};

	    var obj = this.obj;
	    if (typeof obj == 'string') {// expect other to be string
	      this.is.equal(String(other));
	    } else if (util.isIndexable(obj) && util.isIndexable(other)) {
	      for (var objIdx = 0, otherIdx = 0, objLength = util.length(obj), otherLength = util.length(other); objIdx < objLength && otherIdx < otherLength; objIdx++) {
	        try {
	          should(obj[objIdx]).containDeepOrdered(other[otherIdx]);
	          otherIdx++;
	        } catch (e) {
	          if (e instanceof should.AssertionError) {
	            continue;
	          }
	          throw e;
	        }
	      }

	      this.assert(otherIdx === otherLength);
	    } else if (obj != null && other != null && typeof obj == 'object' && typeof other == 'object') {// object contains object case
	      util.forEach(other, function(value, key) {
	        should(obj[key]).containDeepOrdered(value);
	      });

	      // if both objects is empty means we finish traversing - and we need to compare for hidden values
	      if (util.isEmptyObject(other)) {
	        this.eql(other);
	      }
	    } else {
	      this.eql(other);
	    }
	  });

	  /**
	   * The same like `Assertion#containDeepOrdered` but all checks on arrays without order.
	   *
	   * @name containDeep
	   * @memberOf Assertion
	   * @category assertion contain
	   * @param {*} other Nested object
	   * @example
	   *
	   * [ 1, 2, 3].should.containDeep([2, 1]);
	   * [ 1, 2, [ 1, 2, 3 ]].should.containDeep([ 1, [ 3, 1 ]]);
	   */
	  Assertion.add('containDeep', function(other) {
	    this.params = {operator: 'to contain ' + i(other)};

	    var obj = this.obj;
	    if (typeof obj == 'string') {// expect other to be string
	      this.is.equal(String(other));
	    } else if (util.isIndexable(obj) && util.isIndexable(other)) {
	      var usedKeys = {};
	      util.forEach(other, function(otherItem) {
	        this.assert(util.some(obj, function(item, index) {
	          if (index in usedKeys) return false;

	          try {
	            should(item).containDeep(otherItem);
	            usedKeys[index] = true;
	            return true;
	          } catch (e) {
	            if (e instanceof should.AssertionError) {
	              return false;
	            }
	            throw e;
	          }
	        }));
	      }, this);
	    } else if (obj != null && other != null && typeof obj == 'object' && typeof other == 'object') {// object contains object case
	      util.forEach(other, function(value, key) {
	        should(obj[key]).containDeep(value);
	      });

	      // if both objects is empty means we finish traversing - and we need to compare for hidden values
	      if (util.isEmptyObject(other)) {
	        this.eql(other);
	      }
	    } else {
	      this.eql(other);
	    }
	  });

	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * should.js - assertion library
	 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
	 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
	 * MIT Licensed
	 */

	var util = __webpack_require__(4);
	var PromisedAssertion = __webpack_require__(15).PromisedAssertion;
	var Assertion = __webpack_require__(15);

	module.exports = function(should) {
	  /**
	   * Assert given object is a Promise
	   *
	   * @name Promise
	   * @memberOf Assertion
	   * @category assertion promises
	   * @example
	   *
	   * promise.should.be.Promise()
	   * (new Promise(function(resolve, reject) { resolve(10); })).should.be.a.Promise()
	   * (10).should.not.be.a.Promise()
	   */
	  Assertion.add('Promise', function() {
	    this.params = {operator: 'to be promise'};

	    var obj = this.obj;

	    should(obj).have.property('then')
	      .which.is.a.Function();
	  });

	  /**
	   * Assert given promise will be fulfilled. Result of assertion is still .thenable and should be handled accordingly.
	   *
	   * @name fulfilled
	   * @memberOf Assertion
	   * @returns {Promise}
	   * @category assertion promises
	   * @example
	   *
	   * // don't forget to handle async nature
	   * (new Promise(function(resolve, reject) { resolve(10); })).should.be.fulfilled();
	   *
	   * // test example with mocha it is possible to return promise
	   * it('is async', () => {
	   *    return new Promise(resolve => resolve(10))
	   *      .should.be.fulfilled();
	   * });
	   */
	  Assertion.prototype.fulfilled = function Assertion$fulfilled() {
	    this.params = {operator: 'to be fulfilled'};

	    should(this.obj).be.a.Promise();

	    var that = this;
	    return this.obj.then(function next$onResolve(value) {
	      if (that.negate) {
	        that.fail();
	      }
	      return value;
	    }, function next$onReject(err) {
	      if (!that.negate) {
	        that.params.operator += ', but it was rejected with ' + should.format(err);
	        that.fail();
	      }
	      return err;
	    });
	  };

	  /**
	   * Assert given promise will be rejected. Result of assertion is still .thenable and should be handled accordingly.
	   *
	   * @name rejected
	   * @memberOf Assertion
	   * @category assertion promises
	   * @returns {Promise}
	   * @example
	   *
	   * // don't forget to handle async nature
	   * (new Promise(function(resolve, reject) { resolve(10); }))
	   *    .should.not.be.rejected();
	   *
	   * // test example with mocha it is possible to return promise
	   * it('is async', () => {
	   *    return new Promise((resolve, reject) => reject(new Error('boom')))
	   *      .should.be.rejected();
	   * });
	   */
	  Assertion.prototype.rejected = function() {
	    this.params = {operator: 'to be rejected'};

	    should(this.obj).be.a.Promise();

	    var that = this;
	    return this.obj.then(function(value) {
	      if (!that.negate) {
	        that.params.operator += ', but it was fulfilled';
	        if (arguments.length != 0) {
	          that.params.operator += ' with ' + should.format(value);
	        }
	        that.fail();
	      }
	      return value;
	    }, function next$onError(err) {
	      if (that.negate) {
	        that.fail();
	      }
	      return err;
	    });
	  };

	  /**
	   * Assert given promise will be fulfilled with some expected value (value compared using .eql).
	   * Result of assertion is still .thenable and should be handled accordingly.
	   *
	   * @name fulfilledWith
	   * @memberOf Assertion
	   * @category assertion promises
	   * @returns {Promise}
	   * @example
	   *
	   * // don't forget to handle async nature
	   * (new Promise(function(resolve, reject) { resolve(10); }))
	   *    .should.be.fulfilledWith(10);
	   *
	   * // test example with mocha it is possible to return promise
	   * it('is async', () => {
	   *    return new Promise((resolve, reject) => resolve(10))
	   *       .should.be.fulfilledWith(10);
	   * });
	   */
	  Assertion.prototype.fulfilledWith = function(expectedValue) {
	    this.params = {operator: 'to be fulfilled with ' + should.format(expectedValue)};

	    should(this.obj).be.a.Promise();

	    var that = this;
	    return this.obj.then(function(value) {
	      if (that.negate) {
	        that.fail();
	      }
	      should(value).eql(expectedValue);
	      return value;
	    }, function next$onError(err) {
	      if (!that.negate) {
	        that.params.operator += ', but it was rejected with ' + should.format(err);
	        that.fail();
	      }
	      return err;
	    });
	  };

	  /**
	   * Assert given promise will be rejected with some sort of error. Arguments is the same for Assertion#throw.
	   * Result of assertion is still .thenable and should be handled accordingly.
	   *
	   * @name rejectedWith
	   * @memberOf Assertion
	   * @category assertion promises
	   * @returns {Promise}
	   * @example
	   *
	   * function failedPromise() {
	   *   return new Promise(function(resolve, reject) {
	   *     reject(new Error('boom'))
	   *   })
	   * }
	   * failedPromise().should.be.rejectedWith(Error);
	   * failedPromise().should.be.rejectedWith('boom');
	   * failedPromise().should.be.rejectedWith(/boom/);
	   * failedPromise().should.be.rejectedWith(Error, { message: 'boom' });
	   * failedPromise().should.be.rejectedWith({ message: 'boom' });
	   *
	   * // test example with mocha it is possible to return promise
	   * it('is async', () => {
	   *    return failedPromise().should.be.rejectedWith({ message: 'boom' });
	   * });
	   */
	  Assertion.prototype.rejectedWith = function(message, properties) {
	    this.params = {operator: 'to be rejected'};

	    should(this.obj).be.a.Promise();

	    var that = this;
	    return this.obj.then(function(value) {
	      if (!that.negate) {
	        that.fail();
	      }
	      return value;
	    }, function next$onError(err) {
	      if (that.negate) {
	        that.fail();
	      }

	      var errorMatched = true;
	      var errorInfo = '';

	      if ('string' === typeof message) {
	        errorMatched = message === err.message;
	      } else if (message instanceof RegExp) {
	        errorMatched = message.test(err.message);
	      } else if ('function' === typeof message) {
	        errorMatched = err instanceof message;
	      } else if (message !== null && typeof message === 'object') {
	        try {
	          should(err).match(message);
	        } catch (e) {
	          if (e instanceof should.AssertionError) {
	            errorInfo = ': ' + e.message;
	            errorMatched = false;
	          } else {
	            throw e;
	          }
	        }
	      }

	      if (!errorMatched) {
	        if ( typeof message === 'string' || message instanceof RegExp) {
	          errorInfo = ' with a message matching ' + should.format(message) + ", but got '" + err.message + "'";
	        } else if ('function' === typeof message) {
	          errorInfo = ' of type ' + util.functionName(message) + ', but got ' + util.functionName(err.constructor);
	        }
	      } else if ('function' === typeof message && properties) {
	        try {
	          should(err).match(properties);
	        } catch (e) {
	          if (e instanceof should.AssertionError) {
	            errorInfo = ': ' + e.message;
	            errorMatched = false;
	          } else {
	            throw e;
	          }
	        }
	      }

	      that.params.operator += errorInfo;

	      that.assert(errorMatched);

	      return err;
	    });
	  };

	  /**
	   * Assert given object is promise and wrap it in PromisedAssertion, which has all properties of Assertion.
	   * That means you can chain as with usual Assertion.
	   * Result of assertion is still .thenable and should be handled accordingly.
	   *
	   * @name finally
	   * @memberOf Assertion
	   * @alias Assertion#eventually
	   * @category assertion promises
	   * @returns {PromisedAssertion} Like Assertion, but .then this.obj in Assertion
	   * @example
	   *
	   * (new Promise(function(resolve, reject) { resolve(10); }))
	   *    .should.be.eventually.equal(10);
	   *
	   * // test example with mocha it is possible to return promise
	   * it('is async', () => {
	   *    return new Promise(resolve => resolve(10))
	   *      .should.be.finally.equal(10);
	   * });
	   */
	  Object.defineProperty(Assertion.prototype, 'finally', {
	    get: function() {
	      should(this.obj).be.a.Promise();

	      var that = this;

	      return new PromisedAssertion(this.obj.then(function(obj) {
	        var a = should(obj);

	        a.negate = that.negate;
	        a.anyOne = that.anyOne;

	        return a;
	      }));
	    }
	  });

	  Assertion.alias('finally', 'eventually');
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(32);

	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is used in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}

	module.exports = get;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var castPath = __webpack_require__(33),
	    isKey = __webpack_require__(71),
	    toKey = __webpack_require__(72);

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = isKey(path, object) ? [path] : castPath(path);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	module.exports = baseGet;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(34),
	    stringToPath = __webpack_require__(35);

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value) {
	  return isArray(value) ? value : stringToPath(value);
	}

	module.exports = castPath;


/***/ },
/* 34 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @type {Function}
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	module.exports = isArray;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var memoize = __webpack_require__(36),
	    toString = __webpack_require__(66);

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = memoize(function(string) {
	  var result = [];
	  toString(string).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	module.exports = stringToPath;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(37);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoizing function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result);
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || MapCache);
	  return memoized;
	}

	// Assign cache to `_.memoize`.
	memoize.Cache = MapCache;

	module.exports = memoize;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var mapClear = __webpack_require__(38),
	    mapDelete = __webpack_require__(51),
	    mapGet = __webpack_require__(58),
	    mapHas = __webpack_require__(61),
	    mapSet = __webpack_require__(63);

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function MapCache(values) {
	  var index = -1,
	      length = values ? values.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = values[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapClear;
	MapCache.prototype['delete'] = mapDelete;
	MapCache.prototype.get = mapGet;
	MapCache.prototype.has = mapHas;
	MapCache.prototype.set = mapSet;

	module.exports = MapCache;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var Hash = __webpack_require__(39),
	    Map = __webpack_require__(47);

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapClear() {
	  this.__data__ = {
	    'hash': new Hash,
	    'map': Map ? new Map : [],
	    'string': new Hash
	  };
	}

	module.exports = mapClear;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(40);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @returns {Object} Returns the new hash object.
	 */
	function Hash() {}

	// Avoid inheriting from `Object.prototype` when possible.
	Hash.prototype = nativeCreate ? nativeCreate(null) : objectProto;

	module.exports = Hash;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(41);

	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');

	module.exports = nativeCreate;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(42);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object[key];
	  return isNative(value) ? value : undefined;
	}

	module.exports = getNative;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(43),
	    isHostObject = __webpack_require__(45),
	    isObject = __webpack_require__(44),
	    toSource = __webpack_require__(46);

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	module.exports = isNative;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(44);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	module.exports = isFunction;


/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 45 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	module.exports = isHostObject;


/***/ },
/* 46 */
/***/ function(module, exports) {

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	module.exports = toSource;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(41),
	    root = __webpack_require__(48);

	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map');

	module.exports = Map;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {var checkGlobal = __webpack_require__(50);

	/** Used to determine if values are of the language type `Object`. */
	var objectTypes = {
	  'function': true,
	  'object': true
	};

	/** Detect free variable `exports`. */
	var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
	  ? exports
	  : undefined;

	/** Detect free variable `module`. */
	var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
	  ? module
	  : undefined;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

	/** Detect free variable `self`. */
	var freeSelf = checkGlobal(objectTypes[typeof self] && self);

	/** Detect free variable `window`. */
	var freeWindow = checkGlobal(objectTypes[typeof window] && window);

	/** Detect `this` as the global object. */
	var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

	/**
	 * Used as a reference to the global object.
	 *
	 * The `this` value is used if it's the global object to avoid Greasemonkey's
	 * restricted `window` object, otherwise the `window` object is used.
	 */
	var root = freeGlobal ||
	  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
	    freeSelf || thisGlobal || Function('return this')();

	module.exports = root;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(49)(module), (function() { return this; }())))

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 50 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a global object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	 */
	function checkGlobal(value) {
	  return (value && value.Object === Object) ? value : null;
	}

	module.exports = checkGlobal;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(47),
	    assocDelete = __webpack_require__(52),
	    hashDelete = __webpack_require__(55),
	    isKeyable = __webpack_require__(57);

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapDelete(key) {
	  var data = this.__data__;
	  if (isKeyable(key)) {
	    return hashDelete(typeof key == 'string' ? data.string : data.hash, key);
	  }
	  return Map ? data.map['delete'](key) : assocDelete(data.map, key);
	}

	module.exports = mapDelete;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(53);

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the associative array.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function assocDelete(array, key) {
	  var index = assocIndexOf(array, key);
	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = array.length - 1;
	  if (index == lastIndex) {
	    array.pop();
	  } else {
	    splice.call(array, index, 1);
	  }
	  return true;
	}

	module.exports = assocDelete;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(54);

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	module.exports = assocIndexOf;


/***/ },
/* 54 */
/***/ function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var other = { 'user': 'fred' };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	module.exports = eq;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var hashHas = __webpack_require__(56);

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(hash, key) {
	  return hashHas(hash, key) && delete hash[key];
	}

	module.exports = hashDelete;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(40);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @param {Object} hash The hash to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(hash, key) {
	  return nativeCreate ? hash[key] !== undefined : hasOwnProperty.call(hash, key);
	}

	module.exports = hashHas;


/***/ },
/* 57 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	module.exports = isKeyable;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(47),
	    assocGet = __webpack_require__(59),
	    hashGet = __webpack_require__(60),
	    isKeyable = __webpack_require__(57);

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapGet(key) {
	  var data = this.__data__;
	  if (isKeyable(key)) {
	    return hashGet(typeof key == 'string' ? data.string : data.hash, key);
	  }
	  return Map ? data.map.get(key) : assocGet(data.map, key);
	}

	module.exports = mapGet;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(53);

	/**
	 * Gets the associative array value for `key`.
	 *
	 * @private
	 * @param {Array} array The array to query.
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function assocGet(array, key) {
	  var index = assocIndexOf(array, key);
	  return index < 0 ? undefined : array[index][1];
	}

	module.exports = assocGet;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(40);

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @param {Object} hash The hash to query.
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(hash, key) {
	  if (nativeCreate) {
	    var result = hash[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(hash, key) ? hash[key] : undefined;
	}

	module.exports = hashGet;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(47),
	    assocHas = __webpack_require__(62),
	    hashHas = __webpack_require__(56),
	    isKeyable = __webpack_require__(57);

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapHas(key) {
	  var data = this.__data__;
	  if (isKeyable(key)) {
	    return hashHas(typeof key == 'string' ? data.string : data.hash, key);
	  }
	  return Map ? data.map.has(key) : assocHas(data.map, key);
	}

	module.exports = mapHas;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(53);

	/**
	 * Checks if an associative array value for `key` exists.
	 *
	 * @private
	 * @param {Array} array The array to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function assocHas(array, key) {
	  return assocIndexOf(array, key) > -1;
	}

	module.exports = assocHas;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var Map = __webpack_require__(47),
	    assocSet = __webpack_require__(64),
	    hashSet = __webpack_require__(65),
	    isKeyable = __webpack_require__(57);

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapSet(key, value) {
	  var data = this.__data__;
	  if (isKeyable(key)) {
	    hashSet(typeof key == 'string' ? data.string : data.hash, key, value);
	  } else if (Map) {
	    data.map.set(key, value);
	  } else {
	    assocSet(data.map, key, value);
	  }
	  return this;
	}

	module.exports = mapSet;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(53);

	/**
	 * Sets the associative array `key` to `value`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 */
	function assocSet(array, key, value) {
	  var index = assocIndexOf(array, key);
	  if (index < 0) {
	    array.push([key, value]);
	  } else {
	    array[index][1] = value;
	  }
	}

	module.exports = assocSet;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(40);

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 */
	function hashSet(hash, key, value) {
	  hash[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	}

	module.exports = hashSet;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(67);

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}

	module.exports = toString;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(68),
	    isSymbol = __webpack_require__(69);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	module.exports = baseToString;


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(48);

	/** Built-in value references. */
	var Symbol = root.Symbol;

	module.exports = Symbol;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(70);

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}

	module.exports = isSymbol;


/***/ },
/* 70 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(34),
	    isSymbol = __webpack_require__(69);

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	module.exports = isKey;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var isSymbol = __webpack_require__(69);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	module.exports = toKey;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var baseSet = __webpack_require__(74);

	/**
	 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
	 * it's created. Arrays are created for missing index properties while objects
	 * are created for all other missing properties. Use `_.setWith` to customize
	 * `path` creation.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to modify.
	 * @param {Array|string} path The path of the property to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.set(object, 'a[0].b.c', 4);
	 * console.log(object.a[0].b.c);
	 * // => 4
	 *
	 * _.set(object, ['x', '0', 'y', 'z'], 5);
	 * console.log(object.x[0].y.z);
	 * // => 5
	 */
	function set(object, path, value) {
	  return object == null ? object : baseSet(object, path, value);
	}

	module.exports = set;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(75),
	    castPath = __webpack_require__(33),
	    isIndex = __webpack_require__(76),
	    isKey = __webpack_require__(71),
	    isObject = __webpack_require__(44),
	    toKey = __webpack_require__(72);

	/**
	 * The base implementation of `_.set`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to set.
	 * @param {*} value The value to set.
	 * @param {Function} [customizer] The function to customize path creation.
	 * @returns {Object} Returns `object`.
	 */
	function baseSet(object, path, value, customizer) {
	  path = isKey(path, object) ? [path] : castPath(path);

	  var index = -1,
	      length = path.length,
	      lastIndex = length - 1,
	      nested = object;

	  while (nested != null && ++index < length) {
	    var key = toKey(path[index]);
	    if (isObject(nested)) {
	      var newValue = value;
	      if (index != lastIndex) {
	        var objValue = nested[key];
	        newValue = customizer ? customizer(objValue, key, nested) : undefined;
	        if (newValue === undefined) {
	          newValue = objValue == null
	            ? (isIndex(path[index + 1]) ? [] : {})
	            : objValue;
	        }
	      }
	      assignValue(nested, key, newValue);
	    }
	    nested = nested[key];
	  }
	  return object;
	}

	module.exports = baseSet;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(54);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    object[key] = value;
	  }
	}

	module.exports = assignValue;


/***/ },
/* 76 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}

	module.exports = isIndex;


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var should = __webpack_require__(2);
	var _get = __webpack_require__(31);
	var _set = __webpack_require__(73);

	module.exports = function globalTests(Inspiration) {

	    var app_config_path = Inspiration.factory_config.app_config_path;

	    describe('with no initials', function() {

	        it('should create a new inspiration class, then a new instance, with a config function.', function(done) {

	            var inspiration = new Inspiration();

	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }
	                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
	                done();
	            });
	        });
	    });

	    describe('with an initial app', function() {

	        var app = {
	            name: 'My Cool App'
	        };


	        it('should create a new inspiration class, then a new instance with the initial app.', function(done) {

	            var inspiration = new Inspiration({app: app});
	            inspiration.app.should.equal(app);
	            inspiration.app.should.have.property('name', app.name);

	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }
	                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
	                done();
	            });
	        });

	    });

	    describe('with an initial config', function() {

	        var config = {
	            a: 'hola',
	            b: {
	                c: 'aloha'
	            }
	        };

	        it('should create a new inspiration class, then a new instance.', function(done) {

	            var inspiration = new Inspiration({config: config});
	            inspiration.config.should.equal(config);
	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }

	                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
	                _get(inspiration.app, app_config_path)('a').should.equal(config.a);
	                _get(inspiration.app, app_config_path)('b.c').should.equal(config.b.c);
	                done();
	            });
	        });
	    });

	    describe('with an initial app and an initial config', function() {

	        var app = {
	            name: 'My Cool App'
	        };

	        var config = {
	            a: 'hola',
	            b: {
	                c: 'aloha'
	            }
	        };

	        it('should create a new inspiration class, then a new instance.', function(done) {

	            var inspiration = new Inspiration({app: app, config: config});
	            inspiration.config.should.equal(config);
	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }
	                inspiration.app.should.equal(app);
	                inspiration.app.should.have.property('name', app.name);
	                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
	                _get(inspiration.app, app_config_path)('a').should.equal(config.a);
	                _get(inspiration.app, app_config_path)('b.c').should.equal(config.b.c);

	                done();
	            });
	        });
	    });


	    describe('with an initial set of providers', function() {

	        var providers = [
	            function(app, done) {
	                app.something = function() {
	                    return 1;
	                };
	                done();
	            },
	            function(app, done) {

	                setTimeout(function() {

	                    app.somethingAsync = function() {
	                        return 2;
	                    };
	                    done();
	                }, 100);
	            }
	        ];

	        it('should create a new inspiration class, then a new instance.', function(done) {

	            var inspiration = new Inspiration({providers: providers});
	            inspiration.providers.should.equal(providers);
	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }
	                inspiration.app.should.have.property('something');
	                inspiration.app.something().should.equal(1);
	                inspiration.app.should.have.property('somethingAsync');
	                inspiration.app.somethingAsync().should.equal(2);
	                done();
	            });
	        });
	    });

	    describe('with an initial app, an initial config, and an initial set of providers', function() {

	        var app = {
	            name: 'My Cool App'
	        };

	        var config = {
	            a: 'hola',
	            b: {
	                c: 'aloha'
	            }
	        };
	        _set(config, Inspiration.factory_config.config_providers_path, [
	            function(app, done) {
	                app.somethingElse = function() {

	                    return 3;
	                };
	                done();
	            }
	        ]);

	        var providers = [
	            function(app, done) {
	                app.something = function() {
	                    return 1;
	                };
	                done();
	            },
	            function(app, done) {

	                setTimeout(function() {

	                    app.somethingAsync = function() {
	                        return 2;
	                    };
	                    done();
	                }, 100);
	            }
	        ];

	        it('should create a new inspiration class, then a new instance.', function(done) {

	            var inspiration = new Inspiration({app: app, config: config, providers: providers});
	            inspiration.config.should.equal(config);
	            inspiration.init(function(err) {

	                if (err) {
	                    throw err;
	                }
	                inspiration.app.should.equal(app);
	                inspiration.app.should.have.property('name', app.name);
	                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
	                _get(inspiration.app, app_config_path)('a').should.equal(config.a);
	                _get(inspiration.app, app_config_path)('b.c').should.equal(config.b.c);
	                inspiration.app.should.have.property('something');
	                inspiration.app.something().should.equal(1);
	                inspiration.app.should.have.property('somethingAsync');
	                inspiration.app.somethingAsync().should.equal(2);
	                inspiration.app.should.have.property('somethingElse');
	                inspiration.app.somethingElse().should.equal(3);
	                done();
	            });
	        });
	    });
	};


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var should = __webpack_require__(2);
	var _get = __webpack_require__(31);
	var _set = __webpack_require__(73);
	var globalTests = __webpack_require__(77);

	module.exports = function factoryTests(inspirationArchitectFactory) {
	    describe('factory', function() {

	        describe('empty factory config', function() {

	            var Inspiration = inspirationArchitectFactory();

	            globalTests(Inspiration);
	        });

	        describe('different app config path', function() {

	            var factory_config = {
	                app_config_path: 'locals.config'
	            };

	            var Inspiration = inspirationArchitectFactory(factory_config);

	            globalTests(Inspiration);

	            describe('locals.config', function() {

	                it('should be able to access the config at locals.config', function(done) {

	                    var inspiration = new Inspiration({
	                        config: {
	                            greeting: 'hello'
	                        }
	                    });

	                    inspiration.init(function(err) {

	                        if (err) {
	                            throw err;
	                        }

	                        should(_get(inspiration.app, factory_config.app_config_path)).not.equal(undefined);
	                        inspiration.app.locals.config('greeting').should.equal('hello');
	                        done();
	                    });
	                });
	            });
	        });

	        describe('different config providers path', function() {

	            var factory_config = {
	                config_providers_path: 'custom.providers'
	            };

	            var Inspiration = inspirationArchitectFactory(factory_config);

	            globalTests(Inspiration);

	            describe('custom.providers', function() {

	                it('should be able to use custom.providers as the config path to get providers', function(done) {

	                    var config = {};
	                    _set(config, 'custom.providers', [
	                        function(app, done) {
	                            app.something = function() {
	                                return 'hello';
	                            };
	                            done();
	                        }
	                    ]);
	                    var inspiration = new Inspiration({
	                        config: config
	                    });

	                    inspiration.init(function(err) {

	                        if (err) {
	                            throw err;
	                        }

	                        should(inspiration.app.config('custom.providers')).not.equal(undefined);
	                        inspiration.app.something().should.equal('hello');
	                        done();
	                    });
	                });
	            });
	        });
	    });
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./app.js": 80,
		"./external.js": 81
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 79;


/***/ },
/* 80 */
/***/ function(module, exports) {

	module.exports = {
	    a_sample: 1,
	    b_sample: 'two',
	    c_sample: [
	        true, {
	            d_sample: 4
	        }
	    ],
	    e_sample: {
	        f_sample: {
	            g_sample: 5
	        }
	    }
	};


/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = {
	    h_sample: 'hello',
	    i_sample: 'goodbye'
	};


/***/ },
/* 82 */
/***/ function(module, exports) {

	module.exports = {
	    a_sample: 'one'
	};


/***/ },
/* 83 */
/***/ function(module, exports) {

	function webpackContext(req) {
		throw new Error("Cannot find module '" + req + "'.");
	}
	webpackContext.keys = function() { return []; };
	webpackContext.resolve = webpackContext;
	module.exports = webpackContext;
	webpackContext.id = 83;


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./addSomething.js": 85,
		"./addSomethingAsync.js": 86
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 84;


/***/ },
/* 85 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function addSomething(app, done) {

	    app.doSomething = function() {

	        return 2;
	    };
	    done();
	};


/***/ },
/* 86 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function addSomethingAsync(app, done) {

	    setTimeout(function() {
	        
	        app.doSomethingAsync = function() {
	            return 1;
	        };
	        done();
	    }, 100);
	};



/***/ }
/******/ ]);