(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.browserify = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

!function (t) {
  if ("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = t();else if ("function" == typeof define && define.amd) define([], t);else {
    var e;e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, e.inspirationArchitectFactory = t();
  }
}(function () {
  return function t(e, r, n) {
    function o(a, c) {
      if (!r[a]) {
        if (!e[a]) {
          var s = "function" == typeof require && require;if (!c && s) return s(a, !0);if (i) return i(a, !0);var u = new Error("Cannot find module '" + a + "'");throw u.code = "MODULE_NOT_FOUND", u;
        }var f = r[a] = { exports: {} };e[a][0].call(f.exports, function (t) {
          var r = e[a][1][t];return o(r ? r : t);
        }, f, f.exports, t, e, r, n);
      }return r[a].exports;
    }for (var i = "function" == typeof require && require, a = 0; a < n.length; a++) {
      o(n[a]);
    }return o;
  }({ 1: [function (t, e, r) {}, {}], 2: [function (t, e, r) {
      (function (t) {
        function e(t, e) {
          for (var r = 0, n = t.length - 1; n >= 0; n--) {
            var o = t[n];"." === o ? t.splice(n, 1) : ".." === o ? (t.splice(n, 1), r++) : r && (t.splice(n, 1), r--);
          }if (e) for (; r--; r) {
            t.unshift("..");
          }return t;
        }function n(t, e) {
          if (t.filter) return t.filter(e);for (var r = [], n = 0; n < t.length; n++) {
            e(t[n], n, t) && r.push(t[n]);
          }return r;
        }var o = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,
            i = function i(t) {
          return o.exec(t).slice(1);
        };r.resolve = function () {
          for (var r = "", o = !1, i = arguments.length - 1; i >= -1 && !o; i--) {
            var a = i >= 0 ? arguments[i] : t.cwd();if ("string" != typeof a) throw new TypeError("Arguments to path.resolve must be strings");a && (r = a + "/" + r, o = "/" === a.charAt(0));
          }return r = e(n(r.split("/"), function (t) {
            return !!t;
          }), !o).join("/"), (o ? "/" : "") + r || ".";
        }, r.normalize = function (t) {
          var o = r.isAbsolute(t),
              i = "/" === a(t, -1);return t = e(n(t.split("/"), function (t) {
            return !!t;
          }), !o).join("/"), t || o || (t = "."), t && i && (t += "/"), (o ? "/" : "") + t;
        }, r.isAbsolute = function (t) {
          return "/" === t.charAt(0);
        }, r.join = function () {
          var t = Array.prototype.slice.call(arguments, 0);return r.normalize(n(t, function (t, e) {
            if ("string" != typeof t) throw new TypeError("Arguments to path.join must be strings");return t;
          }).join("/"));
        }, r.relative = function (t, e) {
          function n(t) {
            for (var e = 0; e < t.length && "" === t[e]; e++) {}for (var r = t.length - 1; r >= 0 && "" === t[r]; r--) {}return e > r ? [] : t.slice(e, r - e + 1);
          }t = r.resolve(t).substr(1), e = r.resolve(e).substr(1);for (var o = n(t.split("/")), i = n(e.split("/")), a = Math.min(o.length, i.length), c = a, s = 0; a > s; s++) {
            if (o[s] !== i[s]) {
              c = s;break;
            }
          }for (var u = [], s = c; s < o.length; s++) {
            u.push("..");
          }return u = u.concat(i.slice(c)), u.join("/");
        }, r.sep = "/", r.delimiter = ":", r.dirname = function (t) {
          var e = i(t),
              r = e[0],
              n = e[1];return r || n ? (n && (n = n.substr(0, n.length - 1)), r + n) : ".";
        }, r.basename = function (t, e) {
          var r = i(t)[2];return e && r.substr(-1 * e.length) === e && (r = r.substr(0, r.length - e.length)), r;
        }, r.extname = function (t) {
          return i(t)[3];
        };var a = "b" === "ab".substr(-1) ? function (t, e, r) {
          return t.substr(e, r);
        } : function (t, e, r) {
          return 0 > e && (e = t.length + e), t.substr(e, r);
        };
      }).call(this, t("_process"));
    }, { _process: 3 }], 3: [function (t, e, r) {
      function n() {
        f = !1, c.length ? u = c.concat(u) : p = -1, u.length && o();
      }function o() {
        if (!f) {
          var t = setTimeout(n);f = !0;for (var e = u.length; e;) {
            for (c = u, u = []; ++p < e;) {
              c && c[p].run();
            }p = -1, e = u.length;
          }c = null, f = !1, clearTimeout(t);
        }
      }function i(t, e) {
        this.fun = t, this.array = e;
      }function a() {}var c,
          s = e.exports = {},
          u = [],
          f = !1,
          p = -1;s.nextTick = function (t) {
        var e = new Array(arguments.length - 1);if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) {
          e[r - 1] = arguments[r];
        }u.push(new i(t, e)), 1 !== u.length || f || setTimeout(o, 0);
      }, i.prototype.run = function () {
        this.fun.apply(null, this.array);
      }, s.title = "browser", s.browser = !0, s.env = {}, s.argv = [], s.version = "", s.versions = {}, s.on = a, s.addListener = a, s.once = a, s.off = a, s.removeListener = a, s.removeAllListeners = a, s.emit = a, s.binding = function (t) {
        throw new Error("process.binding is not supported");
      }, s.cwd = function () {
        return "/";
      }, s.chdir = function (t) {
        throw new Error("process.chdir is not supported");
      }, s.umask = function () {
        return 0;
      };
    }, {}], 4: [function (t, e, r) {
      var n = t("./_getNative"),
          o = t("./_root"),
          i = n(o, "DataView");e.exports = i;
    }, { "./_getNative": 62, "./_root": 90 }], 5: [function (t, e, r) {
      function n() {}var o = t("./_nativeCreate"),
          i = Object.prototype;n.prototype = o ? o(null) : i, e.exports = n;
    }, { "./_nativeCreate": 89 }], 6: [function (t, e, r) {
      var n = t("./_getNative"),
          o = t("./_root"),
          i = n(o, "Map");e.exports = i;
    }, { "./_getNative": 62, "./_root": 90 }], 7: [function (t, e, r) {
      function n(t) {
        var e = -1,
            r = t ? t.length : 0;for (this.clear(); ++e < r;) {
          var n = t[e];this.set(n[0], n[1]);
        }
      }var o = t("./_mapClear"),
          i = t("./_mapDelete"),
          a = t("./_mapGet"),
          c = t("./_mapHas"),
          s = t("./_mapSet");n.prototype.clear = o, n.prototype["delete"] = i, n.prototype.get = a, n.prototype.has = c, n.prototype.set = s, e.exports = n;
    }, { "./_mapClear": 82, "./_mapDelete": 83, "./_mapGet": 84, "./_mapHas": 85, "./_mapSet": 86 }], 8: [function (t, e, r) {
      var n = t("./_getNative"),
          o = t("./_root"),
          i = n(o, "Promise");e.exports = i;
    }, { "./_getNative": 62, "./_root": 90 }], 9: [function (t, e, r) {
      var n = t("./_root"),
          o = n.Reflect;e.exports = o;
    }, { "./_root": 90 }], 10: [function (t, e, r) {
      var n = t("./_getNative"),
          o = t("./_root"),
          i = n(o, "Set");e.exports = i;
    }, { "./_getNative": 62, "./_root": 90 }], 11: [function (t, e, r) {
      function n(t) {
        var e = -1,
            r = t ? t.length : 0;for (this.clear(); ++e < r;) {
          var n = t[e];this.set(n[0], n[1]);
        }
      }var o = t("./_stackClear"),
          i = t("./_stackDelete"),
          a = t("./_stackGet"),
          c = t("./_stackHas"),
          s = t("./_stackSet");n.prototype.clear = o, n.prototype["delete"] = i, n.prototype.get = a, n.prototype.has = c, n.prototype.set = s, e.exports = n;
    }, { "./_stackClear": 92, "./_stackDelete": 93, "./_stackGet": 94, "./_stackHas": 95, "./_stackSet": 96 }], 12: [function (t, e, r) {
      var n = t("./_root"),
          o = n.Symbol;e.exports = o;
    }, { "./_root": 90 }], 13: [function (t, e, r) {
      var n = t("./_root"),
          o = n.Uint8Array;e.exports = o;
    }, { "./_root": 90 }], 14: [function (t, e, r) {
      var n = t("./_getNative"),
          o = t("./_root"),
          i = n(o, "WeakMap");e.exports = i;
    }, { "./_getNative": 62, "./_root": 90 }], 15: [function (t, e, r) {
      function n(t, e) {
        return t.set(e[0], e[1]), t;
      }e.exports = n;
    }, {}], 16: [function (t, e, r) {
      function n(t, e) {
        return t.add(e), t;
      }e.exports = n;
    }, {}], 17: [function (t, e, r) {
      function n(t, e, r) {
        var n = r.length;switch (n) {case 0:
            return t.call(e);case 1:
            return t.call(e, r[0]);case 2:
            return t.call(e, r[0], r[1]);case 3:
            return t.call(e, r[0], r[1], r[2]);}return t.apply(e, r);
      }e.exports = n;
    }, {}], 18: [function (t, e, r) {
      function n(t, e) {
        for (var r = -1, n = t.length; ++r < n && e(t[r], r, t) !== !1;) {}return t;
      }e.exports = n;
    }, {}], 19: [function (t, e, r) {
      function n(t, e) {
        for (var r = -1, n = e.length, o = t.length; ++r < n;) {
          t[o + r] = e[r];
        }return t;
      }e.exports = n;
    }, {}], 20: [function (t, e, r) {
      function n(t, e, r, n) {
        var o = -1,
            i = t.length;for (n && i && (r = t[++o]); ++o < i;) {
          r = e(r, t[o], o, t);
        }return r;
      }e.exports = n;
    }, {}], 21: [function (t, e, r) {
      function n(t, e, r) {
        (void 0 === r || o(t[e], r)) && ("number" != typeof e || void 0 !== r || e in t) || (t[e] = r);
      }var o = t("./eq");e.exports = n;
    }, { "./eq": 103 }], 22: [function (t, e, r) {
      function n(t, e, r) {
        var n = t[e];a.call(t, e) && o(n, r) && (void 0 !== r || e in t) || (t[e] = r);
      }var o = t("./eq"),
          i = Object.prototype,
          a = i.hasOwnProperty;e.exports = n;
    }, { "./eq": 103 }], 23: [function (t, e, r) {
      function n(t, e) {
        var r = o(t, e);if (0 > r) return !1;var n = t.length - 1;return r == n ? t.pop() : a.call(t, r, 1), !0;
      }var o = t("./_assocIndexOf"),
          i = Array.prototype,
          a = i.splice;e.exports = n;
    }, { "./_assocIndexOf": 26 }], 24: [function (t, e, r) {
      function n(t, e) {
        var r = o(t, e);return 0 > r ? void 0 : t[r][1];
      }var o = t("./_assocIndexOf");e.exports = n;
    }, { "./_assocIndexOf": 26 }], 25: [function (t, e, r) {
      function n(t, e) {
        return o(t, e) > -1;
      }var o = t("./_assocIndexOf");e.exports = n;
    }, { "./_assocIndexOf": 26 }], 26: [function (t, e, r) {
      function n(t, e) {
        for (var r = t.length; r--;) {
          if (o(t[r][0], e)) return r;
        }return -1;
      }var o = t("./eq");e.exports = n;
    }, { "./eq": 103 }], 27: [function (t, e, r) {
      function n(t, e, r) {
        var n = o(t, e);0 > n ? t.push([e, r]) : t[n][1] = r;
      }var o = t("./_assocIndexOf");e.exports = n;
    }, { "./_assocIndexOf": 26 }], 28: [function (t, e, r) {
      function n(t, e) {
        return t && o(e, i(e), t);
      }var o = t("./_copyObject"),
          i = t("./keys");e.exports = n;
    }, { "./_copyObject": 57, "./keys": 119 }], 29: [function (t, e, r) {
      function n(t, e, r, m, O, A, S) {
        var P;if (m && (P = A ? m(t, O, A, S) : m(t)), void 0 !== P) return P;if (!d(t)) return t;var I = b(t);if (I) {
          if (P = _(t), !e) return u(t, P);
        } else {
          var C = l(t),
              T = C == w || C == k;if (g(t)) return s(t, e);if (C == M || C == x || T && !A) {
            if (h(t)) return A ? t : {};if (P = v(T ? {} : t), !e) return f(t, c(P, t));
          } else {
            if (!W[C]) return A ? t : {};P = y(t, C, n, e);
          }
        }S || (S = new o());var E = S.get(t);if (E) return E;if (S.set(t, P), !I) var L = r ? p(t) : j(t);return i(L || t, function (o, i) {
          L && (i = o, o = t[i]), a(P, i, n(o, e, r, m, i, t, S));
        }), P;
      }var o = t("./_Stack"),
          i = t("./_arrayEach"),
          a = t("./_assignValue"),
          c = t("./_baseAssign"),
          s = t("./_cloneBuffer"),
          u = t("./_copyArray"),
          f = t("./_copySymbols"),
          p = t("./_getAllKeys"),
          l = t("./_getTag"),
          _ = t("./_initCloneArray"),
          y = t("./_initCloneByTag"),
          v = t("./_initCloneObject"),
          b = t("./isArray"),
          g = t("./isBuffer"),
          h = t("./_isHostObject"),
          d = t("./isObject"),
          j = t("./keys"),
          x = "[object Arguments]",
          m = "[object Array]",
          O = "[object Boolean]",
          A = "[object Date]",
          S = "[object Error]",
          w = "[object Function]",
          k = "[object GeneratorFunction]",
          P = "[object Map]",
          I = "[object Number]",
          M = "[object Object]",
          C = "[object RegExp]",
          T = "[object Set]",
          E = "[object String]",
          L = "[object Symbol]",
          F = "[object WeakMap]",
          D = "[object ArrayBuffer]",
          K = "[object DataView]",
          N = "[object Float32Array]",
          H = "[object Float64Array]",
          B = "[object Int8Array]",
          V = "[object Int16Array]",
          G = "[object Int32Array]",
          U = "[object Uint8Array]",
          $ = "[object Uint8ClampedArray]",
          R = "[object Uint16Array]",
          q = "[object Uint32Array]",
          W = {};W[x] = W[m] = W[D] = W[K] = W[O] = W[A] = W[N] = W[H] = W[B] = W[V] = W[G] = W[P] = W[I] = W[M] = W[C] = W[T] = W[E] = W[L] = W[U] = W[$] = W[R] = W[q] = !0, W[S] = W[w] = W[F] = !1, e.exports = n;
    }, { "./_Stack": 11, "./_arrayEach": 18, "./_assignValue": 22, "./_baseAssign": 28, "./_cloneBuffer": 49, "./_copyArray": 56, "./_copySymbols": 58, "./_getAllKeys": 60, "./_getTag": 65, "./_initCloneArray": 72, "./_initCloneByTag": 73, "./_initCloneObject": 74, "./_isHostObject": 75, "./isArray": 106, "./isBuffer": 109, "./isObject": 113, "./keys": 119 }], 30: [function (t, e, r) {
      function n(t) {
        return o(t) ? i(t) : {};
      }var o = t("./isObject"),
          i = Object.create;e.exports = n;
    }, { "./isObject": 113 }], 31: [function (t, e, r) {
      function n(t, e) {
        e = i(e, t) ? [e] : o(e);for (var r = 0, n = e.length; null != t && n > r;) {
          t = t[a(e[r++])];
        }return r && r == n ? t : void 0;
      }var o = t("./_castPath"),
          i = t("./_isKey"),
          a = t("./_toKey");e.exports = n;
    }, { "./_castPath": 44, "./_isKey": 78, "./_toKey": 99 }], 32: [function (t, e, r) {
      function n(t, e, r) {
        var n = e(t);return i(t) ? n : o(n, r(t));
      }var o = t("./_arrayPush"),
          i = t("./isArray");e.exports = n;
    }, { "./_arrayPush": 19, "./isArray": 106 }], 33: [function (t, e, r) {
      function n(t, e) {
        return a.call(t, e) || "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && e in t && null === o(t);
      }var o = t("./_getPrototype"),
          i = Object.prototype,
          a = i.hasOwnProperty;e.exports = n;
    }, { "./_getPrototype": 63 }], 34: [function (t, e, r) {
      function n(t, e, r) {
        if (e !== e) return o(t, r);for (var n = r - 1, i = t.length; ++n < i;) {
          if (t[n] === e) return n;
        }return -1;
      }var o = t("./_indexOfNaN");e.exports = n;
    }, { "./_indexOfNaN": 71 }], 35: [function (t, e, r) {
      function n(t) {
        return o(Object(t));
      }var o = Object.keys;e.exports = n;
    }, {}], 36: [function (t, e, r) {
      function n(t) {
        t = null == t ? t : Object(t);var e = [];for (var r in t) {
          e.push(r);
        }return e;
      }var o = t("./_Reflect"),
          i = t("./_iteratorToArray"),
          a = Object.prototype,
          c = o ? o.enumerate : void 0,
          s = a.propertyIsEnumerable;c && !s.call({ valueOf: 1 }, "valueOf") && (n = function n(t) {
        return i(c(t));
      }), e.exports = n;
    }, { "./_Reflect": 9, "./_iteratorToArray": 81 }], 37: [function (t, e, r) {
      function n(t, e, r, l, _) {
        if (t !== e) {
          if (!s(e) && !f(e)) var y = p(e);i(y || e, function (i, s) {
            if (y && (s = i, i = e[s]), u(i)) _ || (_ = new o()), c(t, e, s, r, n, l, _);else {
              var f = l ? l(t[s], i, s + "", t, e, _) : void 0;void 0 === f && (f = i), a(t, s, f);
            }
          });
        }
      }var o = t("./_Stack"),
          i = t("./_arrayEach"),
          a = t("./_assignMergeValue"),
          c = t("./_baseMergeDeep"),
          s = t("./isArray"),
          u = t("./isObject"),
          f = t("./isTypedArray"),
          p = t("./keysIn");e.exports = n;
    }, { "./_Stack": 11, "./_arrayEach": 18, "./_assignMergeValue": 21, "./_baseMergeDeep": 38, "./isArray": 106, "./isObject": 113, "./isTypedArray": 118, "./keysIn": 120 }], 38: [function (t, e, r) {
      function n(t, e, r, n, v, b, g) {
        var h = t[r],
            d = e[r],
            j = g.get(d);if (j) return void o(t, r, j);var x = b ? b(h, d, r + "", t, e, g) : void 0,
            m = void 0 === x;m && (x = d, s(d) || _(d) ? s(h) ? x = h : u(h) ? x = a(h) : (m = !1, x = i(d, !0)) : l(d) || c(d) ? c(h) ? x = y(h) : !p(h) || n && f(h) ? (m = !1, x = i(d, !0)) : x = h : m = !1), g.set(d, x), m && v(x, d, n, b, g), g["delete"](d), o(t, r, x);
      }var o = t("./_assignMergeValue"),
          i = t("./_baseClone"),
          a = t("./_copyArray"),
          c = t("./isArguments"),
          s = t("./isArray"),
          u = t("./isArrayLikeObject"),
          f = t("./isFunction"),
          p = t("./isObject"),
          l = t("./isPlainObject"),
          _ = t("./isTypedArray"),
          y = t("./toPlainObject");e.exports = n;
    }, { "./_assignMergeValue": 21, "./_baseClone": 29, "./_copyArray": 56, "./isArguments": 105, "./isArray": 106, "./isArrayLikeObject": 108, "./isFunction": 110, "./isObject": 113, "./isPlainObject": 115, "./isTypedArray": 118, "./toPlainObject": 127 }], 39: [function (t, e, r) {
      function n(t) {
        return function (e) {
          return null == e ? void 0 : e[t];
        };
      }e.exports = n;
    }, {}], 40: [function (t, e, r) {
      function n(t, e, r, n) {
        e = c(e, t) ? [e] : i(e);for (var f = -1, p = e.length, l = p - 1, _ = t; null != _ && ++f < p;) {
          var y = u(e[f]);if (s(_)) {
            var v = r;if (f != l) {
              var b = _[y];v = n ? n(b, y, _) : void 0, void 0 === v && (v = null == b ? a(e[f + 1]) ? [] : {} : b);
            }o(_, y, v);
          }_ = _[y];
        }return t;
      }var o = t("./_assignValue"),
          i = t("./_castPath"),
          a = t("./_isIndex"),
          c = t("./_isKey"),
          s = t("./isObject"),
          u = t("./_toKey");e.exports = n;
    }, { "./_assignValue": 22, "./_castPath": 44, "./_isIndex": 76, "./_isKey": 78, "./_toKey": 99, "./isObject": 113 }], 41: [function (t, e, r) {
      function n(t, e, r) {
        var n = -1,
            o = t.length;0 > e && (e = -e > o ? 0 : o + e), r = r > o ? o : r, 0 > r && (r += o), o = e > r ? 0 : r - e >>> 0, e >>>= 0;for (var i = Array(o); ++n < o;) {
          i[n] = t[n + e];
        }return i;
      }e.exports = n;
    }, {}], 42: [function (t, e, r) {
      function n(t, e) {
        for (var r = -1, n = Array(t); ++r < t;) {
          n[r] = e(r);
        }return n;
      }e.exports = n;
    }, {}], 43: [function (t, e, r) {
      function n(t) {
        if ("string" == typeof t) return t;if (i(t)) return s ? s.call(t) : "";var e = t + "";return "0" == e && 1 / t == -a ? "-0" : e;
      }var o = t("./_Symbol"),
          i = t("./isSymbol"),
          a = 1 / 0,
          c = o ? o.prototype : void 0,
          s = c ? c.toString : void 0;e.exports = n;
    }, { "./_Symbol": 12, "./isSymbol": 117 }], 44: [function (t, e, r) {
      function n(t) {
        return o(t) ? t : i(t);
      }var o = t("./isArray"),
          i = t("./_stringToPath");e.exports = n;
    }, { "./_stringToPath": 98, "./isArray": 106 }], 45: [function (t, e, r) {
      function n(t, e, r) {
        var n = t.length;return r = void 0 === r ? n : r, !e && r >= n ? t : o(t, e, r);
      }var o = t("./_baseSlice");e.exports = n;
    }, { "./_baseSlice": 41 }], 46: [function (t, e, r) {
      function n(t, e) {
        for (var r = t.length; r-- && o(e, t[r], 0) > -1;) {}return r;
      }var o = t("./_baseIndexOf");e.exports = n;
    }, { "./_baseIndexOf": 34 }], 47: [function (t, e, r) {
      function n(t) {
        return t && t.Object === Object ? t : null;
      }e.exports = n;
    }, {}], 48: [function (t, e, r) {
      function n(t) {
        var e = new t.constructor(t.byteLength);return new o(e).set(new o(t)), e;
      }var o = t("./_Uint8Array");e.exports = n;
    }, { "./_Uint8Array": 13 }], 49: [function (t, e, r) {
      function n(t, e) {
        if (e) return t.slice();var r = new t.constructor(t.length);return t.copy(r), r;
      }e.exports = n;
    }, {}], 50: [function (t, e, r) {
      function n(t, e) {
        var r = e ? o(t.buffer) : t.buffer;return new t.constructor(r, t.byteOffset, t.byteLength);
      }var o = t("./_cloneArrayBuffer");e.exports = n;
    }, { "./_cloneArrayBuffer": 48 }], 51: [function (t, e, r) {
      function n(t, e, r) {
        var n = e ? r(a(t), !0) : a(t);return i(n, o, new t.constructor());
      }var o = t("./_addMapEntry"),
          i = t("./_arrayReduce"),
          a = t("./_mapToArray");e.exports = n;
    }, { "./_addMapEntry": 15, "./_arrayReduce": 20, "./_mapToArray": 87 }], 52: [function (t, e, r) {
      function n(t) {
        var e = new t.constructor(t.source, o.exec(t));return e.lastIndex = t.lastIndex, e;
      }var o = /\w*$/;e.exports = n;
    }, {}], 53: [function (t, e, r) {
      function n(t, e, r) {
        var n = e ? r(a(t), !0) : a(t);return i(n, o, new t.constructor());
      }var o = t("./_addSetEntry"),
          i = t("./_arrayReduce"),
          a = t("./_setToArray");e.exports = n;
    }, { "./_addSetEntry": 16, "./_arrayReduce": 20, "./_setToArray": 91 }], 54: [function (t, e, r) {
      function n(t) {
        return a ? Object(a.call(t)) : {};
      }var o = t("./_Symbol"),
          i = o ? o.prototype : void 0,
          a = i ? i.valueOf : void 0;e.exports = n;
    }, { "./_Symbol": 12 }], 55: [function (t, e, r) {
      function n(t, e) {
        var r = e ? o(t.buffer) : t.buffer;return new t.constructor(r, t.byteOffset, t.length);
      }var o = t("./_cloneArrayBuffer");e.exports = n;
    }, { "./_cloneArrayBuffer": 48 }], 56: [function (t, e, r) {
      function n(t, e) {
        var r = -1,
            n = t.length;for (e || (e = Array(n)); ++r < n;) {
          e[r] = t[r];
        }return e;
      }e.exports = n;
    }, {}], 57: [function (t, e, r) {
      function n(t, e, r, n) {
        r || (r = {});for (var i = -1, a = e.length; ++i < a;) {
          var c = e[i],
              s = n ? n(r[c], t[c], c, r, t) : t[c];o(r, c, s);
        }return r;
      }var o = t("./_assignValue");e.exports = n;
    }, { "./_assignValue": 22 }], 58: [function (t, e, r) {
      function n(t, e) {
        return o(t, i(t), e);
      }var o = t("./_copyObject"),
          i = t("./_getSymbols");e.exports = n;
    }, { "./_copyObject": 57, "./_getSymbols": 64 }], 59: [function (t, e, r) {
      function n(t) {
        return i(function (e, r) {
          var n = -1,
              i = r.length,
              a = i > 1 ? r[i - 1] : void 0,
              c = i > 2 ? r[2] : void 0;for (a = "function" == typeof a ? (i--, a) : void 0, c && o(r[0], r[1], c) && (a = 3 > i ? void 0 : a, i = 1), e = Object(e); ++n < i;) {
            var s = r[n];s && t(e, s, n, a);
          }return e;
        });
      }var o = t("./_isIterateeCall"),
          i = t("./rest");e.exports = n;
    }, { "./_isIterateeCall": 77, "./rest": 123 }], 60: [function (t, e, r) {
      function n(t) {
        return o(t, a, i);
      }var o = t("./_baseGetAllKeys"),
          i = t("./_getSymbols"),
          a = t("./keys");e.exports = n;
    }, { "./_baseGetAllKeys": 32, "./_getSymbols": 64, "./keys": 119 }], 61: [function (t, e, r) {
      var n = t("./_baseProperty"),
          o = n("length");e.exports = o;
    }, { "./_baseProperty": 39 }], 62: [function (t, e, r) {
      function n(t, e) {
        var r = t[e];return o(r) ? r : void 0;
      }var o = t("./isNative");e.exports = n;
    }, { "./isNative": 112 }], 63: [function (t, e, r) {
      function n(t) {
        return o(Object(t));
      }var o = Object.getPrototypeOf;e.exports = n;
    }, {}], 64: [function (t, e, r) {
      function n(t) {
        return o(Object(t));
      }var o = Object.getOwnPropertySymbols;o || (n = function n() {
        return [];
      }), e.exports = n;
    }, {}], 65: [function (t, e, r) {
      function n(t) {
        return g.call(t);
      }var o = t("./_DataView"),
          i = t("./_Map"),
          a = t("./_Promise"),
          c = t("./_Set"),
          s = t("./_WeakMap"),
          u = t("./_toSource"),
          f = "[object Map]",
          p = "[object Object]",
          l = "[object Promise]",
          _ = "[object Set]",
          y = "[object WeakMap]",
          v = "[object DataView]",
          b = Object.prototype,
          g = b.toString,
          h = u(o),
          d = u(i),
          j = u(a),
          x = u(c),
          m = u(s);(o && n(new o(new ArrayBuffer(1))) != v || i && n(new i()) != f || a && n(a.resolve()) != l || c && n(new c()) != _ || s && n(new s()) != y) && (n = function n(t) {
        var e = g.call(t),
            r = e == p ? t.constructor : void 0,
            n = r ? u(r) : void 0;if (n) switch (n) {case h:
            return v;case d:
            return f;case j:
            return l;case x:
            return _;case m:
            return y;}return e;
      }), e.exports = n;
    }, { "./_DataView": 4, "./_Map": 6, "./_Promise": 8, "./_Set": 10, "./_WeakMap": 14, "./_toSource": 100 }], 66: [function (t, e, r) {
      function n(t, e) {
        return o(t, e) && delete t[e];
      }var o = t("./_hashHas");e.exports = n;
    }, { "./_hashHas": 68 }], 67: [function (t, e, r) {
      function n(t, e) {
        if (o) {
          var r = t[e];return r === i ? void 0 : r;
        }return c.call(t, e) ? t[e] : void 0;
      }var o = t("./_nativeCreate"),
          i = "__lodash_hash_undefined__",
          a = Object.prototype,
          c = a.hasOwnProperty;e.exports = n;
    }, { "./_nativeCreate": 89 }], 68: [function (t, e, r) {
      function n(t, e) {
        return o ? void 0 !== t[e] : a.call(t, e);
      }var o = t("./_nativeCreate"),
          i = Object.prototype,
          a = i.hasOwnProperty;e.exports = n;
    }, { "./_nativeCreate": 89 }], 69: [function (t, e, r) {
      function n(t, e, r) {
        t[e] = o && void 0 === r ? i : r;
      }var o = t("./_nativeCreate"),
          i = "__lodash_hash_undefined__";e.exports = n;
    }, { "./_nativeCreate": 89 }], 70: [function (t, e, r) {
      function n(t) {
        var e = t ? t.length : void 0;return c(e) && (a(t) || s(t) || i(t)) ? o(e, String) : null;
      }var o = t("./_baseTimes"),
          i = t("./isArguments"),
          a = t("./isArray"),
          c = t("./isLength"),
          s = t("./isString");e.exports = n;
    }, { "./_baseTimes": 42, "./isArguments": 105, "./isArray": 106, "./isLength": 111, "./isString": 116 }], 71: [function (t, e, r) {
      function n(t, e, r) {
        for (var n = t.length, o = e + (r ? 0 : -1); r ? o-- : ++o < n;) {
          var i = t[o];if (i !== i) return o;
        }return -1;
      }e.exports = n;
    }, {}], 72: [function (t, e, r) {
      function n(t) {
        var e = t.length,
            r = t.constructor(e);return e && "string" == typeof t[0] && i.call(t, "index") && (r.index = t.index, r.input = t.input), r;
      }var o = Object.prototype,
          i = o.hasOwnProperty;e.exports = n;
    }, {}], 73: [function (t, e, r) {
      function n(t, e, r, n) {
        var M = t.constructor;switch (e) {case d:
            return o(t);case p:case l:
            return new M(+t);case j:
            return i(t, n);case x:case m:case O:case A:case S:case w:case k:case P:case I:
            return f(t, n);case _:
            return a(t, n, r);case y:case g:
            return new M(t);case v:
            return c(t);case b:
            return s(t, n, r);case h:
            return u(t);}
      }var o = t("./_cloneArrayBuffer"),
          i = t("./_cloneDataView"),
          a = t("./_cloneMap"),
          c = t("./_cloneRegExp"),
          s = t("./_cloneSet"),
          u = t("./_cloneSymbol"),
          f = t("./_cloneTypedArray"),
          p = "[object Boolean]",
          l = "[object Date]",
          _ = "[object Map]",
          y = "[object Number]",
          v = "[object RegExp]",
          b = "[object Set]",
          g = "[object String]",
          h = "[object Symbol]",
          d = "[object ArrayBuffer]",
          j = "[object DataView]",
          x = "[object Float32Array]",
          m = "[object Float64Array]",
          O = "[object Int8Array]",
          A = "[object Int16Array]",
          S = "[object Int32Array]",
          w = "[object Uint8Array]",
          k = "[object Uint8ClampedArray]",
          P = "[object Uint16Array]",
          I = "[object Uint32Array]";e.exports = n;
    }, { "./_cloneArrayBuffer": 48, "./_cloneDataView": 50, "./_cloneMap": 51, "./_cloneRegExp": 52, "./_cloneSet": 53, "./_cloneSymbol": 54, "./_cloneTypedArray": 55 }], 74: [function (t, e, r) {
      function n(t) {
        return "function" != typeof t.constructor || a(t) ? {} : o(i(t));
      }var o = t("./_baseCreate"),
          i = t("./_getPrototype"),
          a = t("./_isPrototype");e.exports = n;
    }, { "./_baseCreate": 30, "./_getPrototype": 63, "./_isPrototype": 80 }], 75: [function (t, e, r) {
      function n(t) {
        var e = !1;if (null != t && "function" != typeof t.toString) try {
          e = !!(t + "");
        } catch (r) {}return e;
      }e.exports = n;
    }, {}], 76: [function (t, e, r) {
      function n(t, e) {
        return e = null == e ? o : e, !!e && ("number" == typeof t || i.test(t)) && t > -1 && t % 1 == 0 && e > t;
      }var o = 9007199254740991,
          i = /^(?:0|[1-9]\d*)$/;e.exports = n;
    }, {}], 77: [function (t, e, r) {
      function n(t, e, r) {
        if (!c(r)) return !1;var n = typeof e === "undefined" ? "undefined" : _typeof(e);return ("number" == n ? i(r) && a(e, r.length) : "string" == n && e in r) ? o(r[e], t) : !1;
      }var o = t("./eq"),
          i = t("./isArrayLike"),
          a = t("./_isIndex"),
          c = t("./isObject");e.exports = n;
    }, { "./_isIndex": 76, "./eq": 103, "./isArrayLike": 107, "./isObject": 113 }], 78: [function (t, e, r) {
      function n(t, e) {
        if (o(t)) return !1;var r = typeof t === "undefined" ? "undefined" : _typeof(t);return "number" == r || "symbol" == r || "boolean" == r || null == t || i(t) ? !0 : c.test(t) || !a.test(t) || null != e && t in Object(e);
      }var o = t("./isArray"),
          i = t("./isSymbol"),
          a = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          c = /^\w*$/;e.exports = n;
    }, { "./isArray": 106, "./isSymbol": 117 }], 79: [function (t, e, r) {
      function n(t) {
        var e = typeof t === "undefined" ? "undefined" : _typeof(t);return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t;
      }e.exports = n;
    }, {}], 80: [function (t, e, r) {
      function n(t) {
        var e = t && t.constructor,
            r = "function" == typeof e && e.prototype || o;return t === r;
      }var o = Object.prototype;e.exports = n;
    }, {}], 81: [function (t, e, r) {
      function n(t) {
        for (var e, r = []; !(e = t.next()).done;) {
          r.push(e.value);
        }return r;
      }e.exports = n;
    }, {}], 82: [function (t, e, r) {
      function n() {
        this.__data__ = { hash: new o(), map: i ? new i() : [], string: new o() };
      }var o = t("./_Hash"),
          i = t("./_Map");e.exports = n;
    }, { "./_Hash": 5, "./_Map": 6 }], 83: [function (t, e, r) {
      function n(t) {
        var e = this.__data__;return c(t) ? a("string" == typeof t ? e.string : e.hash, t) : o ? e.map["delete"](t) : i(e.map, t);
      }var o = t("./_Map"),
          i = t("./_assocDelete"),
          a = t("./_hashDelete"),
          c = t("./_isKeyable");e.exports = n;
    }, { "./_Map": 6, "./_assocDelete": 23, "./_hashDelete": 66, "./_isKeyable": 79 }], 84: [function (t, e, r) {
      function n(t) {
        var e = this.__data__;return c(t) ? a("string" == typeof t ? e.string : e.hash, t) : o ? e.map.get(t) : i(e.map, t);
      }var o = t("./_Map"),
          i = t("./_assocGet"),
          a = t("./_hashGet"),
          c = t("./_isKeyable");e.exports = n;
    }, { "./_Map": 6, "./_assocGet": 24, "./_hashGet": 67, "./_isKeyable": 79 }], 85: [function (t, e, r) {
      function n(t) {
        var e = this.__data__;return c(t) ? a("string" == typeof t ? e.string : e.hash, t) : o ? e.map.has(t) : i(e.map, t);
      }var o = t("./_Map"),
          i = t("./_assocHas"),
          a = t("./_hashHas"),
          c = t("./_isKeyable");e.exports = n;
    }, { "./_Map": 6, "./_assocHas": 25, "./_hashHas": 68, "./_isKeyable": 79 }], 86: [function (t, e, r) {
      function n(t, e) {
        var r = this.__data__;return c(t) ? a("string" == typeof t ? r.string : r.hash, t, e) : o ? r.map.set(t, e) : i(r.map, t, e), this;
      }var o = t("./_Map"),
          i = t("./_assocSet"),
          a = t("./_hashSet"),
          c = t("./_isKeyable");e.exports = n;
    }, { "./_Map": 6, "./_assocSet": 27, "./_hashSet": 69, "./_isKeyable": 79 }], 87: [function (t, e, r) {
      function n(t) {
        var e = -1,
            r = Array(t.size);return t.forEach(function (t, n) {
          r[++e] = [n, t];
        }), r;
      }e.exports = n;
    }, {}], 88: [function (t, e, r) {
      function n(t, e, r, a, c, s) {
        return i(t) && i(e) && o(t, e, void 0, n, s.set(e, t)), t;
      }var o = t("./_baseMerge"),
          i = t("./isObject");e.exports = n;
    }, { "./_baseMerge": 37, "./isObject": 113 }], 89: [function (t, e, r) {
      var n = t("./_getNative"),
          o = n(Object, "create");e.exports = o;
    }, { "./_getNative": 62 }], 90: [function (t, e, r) {
      (function (n) {
        var o = t("./_checkGlobal"),
            i = { "function": !0, object: !0 },
            a = i[typeof r === "undefined" ? "undefined" : _typeof(r)] && r && !r.nodeType ? r : void 0,
            c = i[typeof e === "undefined" ? "undefined" : _typeof(e)] && e && !e.nodeType ? e : void 0,
            s = o(a && c && "object" == (typeof n === "undefined" ? "undefined" : _typeof(n)) && n),
            u = o(i[typeof self === "undefined" ? "undefined" : _typeof(self)] && self),
            f = o(i[typeof window === "undefined" ? "undefined" : _typeof(window)] && window),
            p = o(i[_typeof(this)] && this),
            l = s || f !== (p && p.window) && f || u || p || Function("return this")();e.exports = l;
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, { "./_checkGlobal": 47 }], 91: [function (t, e, r) {
      function n(t) {
        var e = -1,
            r = Array(t.size);return t.forEach(function (t) {
          r[++e] = t;
        }), r;
      }e.exports = n;
    }, {}], 92: [function (t, e, r) {
      function n() {
        this.__data__ = { array: [], map: null };
      }e.exports = n;
    }, {}], 93: [function (t, e, r) {
      function n(t) {
        var e = this.__data__,
            r = e.array;return r ? o(r, t) : e.map["delete"](t);
      }var o = t("./_assocDelete");e.exports = n;
    }, { "./_assocDelete": 23 }], 94: [function (t, e, r) {
      function n(t) {
        var e = this.__data__,
            r = e.array;return r ? o(r, t) : e.map.get(t);
      }var o = t("./_assocGet");e.exports = n;
    }, { "./_assocGet": 24 }], 95: [function (t, e, r) {
      function n(t) {
        var e = this.__data__,
            r = e.array;return r ? o(r, t) : e.map.has(t);
      }var o = t("./_assocHas");e.exports = n;
    }, { "./_assocHas": 25 }], 96: [function (t, e, r) {
      function n(t, e) {
        var r = this.__data__,
            n = r.array;n && (n.length < a - 1 ? i(n, t, e) : (r.array = null, r.map = new o(n)));var c = r.map;return c && c.set(t, e), this;
      }var o = t("./_MapCache"),
          i = t("./_assocSet"),
          a = 200;e.exports = n;
    }, { "./_MapCache": 7, "./_assocSet": 27 }], 97: [function (t, e, r) {
      function n(t) {
        return t.match(x);
      }var o = "\\ud800-\\udfff",
          i = "\\u0300-\\u036f\\ufe20-\\ufe23",
          a = "\\u20d0-\\u20f0",
          c = "\\ufe0e\\ufe0f",
          s = "[" + o + "]",
          u = "[" + i + a + "]",
          f = "\\ud83c[\\udffb-\\udfff]",
          p = "(?:" + u + "|" + f + ")",
          l = "[^" + o + "]",
          _ = "(?:\\ud83c[\\udde6-\\uddff]){2}",
          y = "[\\ud800-\\udbff][\\udc00-\\udfff]",
          v = "\\u200d",
          b = p + "?",
          g = "[" + c + "]?",
          h = "(?:" + v + "(?:" + [l, _, y].join("|") + ")" + g + b + ")*",
          d = g + b + h,
          j = "(?:" + [l + u + "?", u, _, y, s].join("|") + ")",
          x = RegExp(f + "(?=" + f + ")|" + j + d, "g");e.exports = n;
    }, {}], 98: [function (t, e, r) {
      var n = t("./memoize"),
          o = t("./toString"),
          i = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g,
          a = /\\(\\)?/g,
          c = n(function (t) {
        var e = [];return o(t).replace(i, function (t, r, n, o) {
          e.push(n ? o.replace(a, "$1") : r || t);
        }), e;
      });e.exports = c;
    }, { "./memoize": 121, "./toString": 128 }], 99: [function (t, e, r) {
      function n(t) {
        if ("string" == typeof t || o(t)) return t;var e = t + "";return "0" == e && 1 / t == -i ? "-0" : e;
      }var o = t("./isSymbol"),
          i = 1 / 0;e.exports = n;
    }, { "./isSymbol": 117 }], 100: [function (t, e, r) {
      function n(t) {
        if (null != t) {
          try {
            return o.call(t);
          } catch (e) {}try {
            return t + "";
          } catch (e) {}
        }return "";
      }var o = Function.prototype.toString;e.exports = n;
    }, {}], 101: [function (t, e, r) {
      function n(t) {
        return function () {
          return t;
        };
      }e.exports = n;
    }, {}], 102: [function (t, e, r) {
      var n = t("./_apply"),
          o = t("./_mergeDefaults"),
          i = t("./mergeWith"),
          a = t("./rest"),
          c = a(function (t) {
        return t.push(void 0, o), n(i, void 0, t);
      });e.exports = c;
    }, { "./_apply": 17, "./_mergeDefaults": 88, "./mergeWith": 122, "./rest": 123 }], 103: [function (t, e, r) {
      function n(t, e) {
        return t === e || t !== t && e !== e;
      }e.exports = n;
    }, {}], 104: [function (t, e, r) {
      function n(t, e, r) {
        var n = null == t ? void 0 : o(t, e);return void 0 === n ? r : n;
      }var o = t("./_baseGet");e.exports = n;
    }, { "./_baseGet": 31 }], 105: [function (t, e, r) {
      function n(t) {
        return o(t) && c.call(t, "callee") && (!u.call(t, "callee") || s.call(t) == i);
      }var o = t("./isArrayLikeObject"),
          i = "[object Arguments]",
          a = Object.prototype,
          c = a.hasOwnProperty,
          s = a.toString,
          u = a.propertyIsEnumerable;e.exports = n;
    }, { "./isArrayLikeObject": 108 }], 106: [function (t, e, r) {
      var n = Array.isArray;e.exports = n;
    }, {}], 107: [function (t, e, r) {
      function n(t) {
        return null != t && a(o(t)) && !i(t);
      }var o = t("./_getLength"),
          i = t("./isFunction"),
          a = t("./isLength");e.exports = n;
    }, { "./_getLength": 61, "./isFunction": 110, "./isLength": 111 }], 108: [function (t, e, r) {
      function n(t) {
        return i(t) && o(t);
      }var o = t("./isArrayLike"),
          i = t("./isObjectLike");e.exports = n;
    }, { "./isArrayLike": 107, "./isObjectLike": 114 }], 109: [function (t, e, r) {
      var n = t("./constant"),
          o = t("./_root"),
          i = { "function": !0, object: !0 },
          a = i[typeof r === "undefined" ? "undefined" : _typeof(r)] && r && !r.nodeType ? r : void 0,
          c = i[typeof e === "undefined" ? "undefined" : _typeof(e)] && e && !e.nodeType ? e : void 0,
          s = c && c.exports === a ? a : void 0,
          u = s ? o.Buffer : void 0,
          f = u ? function (t) {
        return t instanceof u;
      } : n(!1);e.exports = f;
    }, { "./_root": 90, "./constant": 101 }], 110: [function (t, e, r) {
      function n(t) {
        var e = o(t) ? s.call(t) : "";return e == i || e == a;
      }var o = t("./isObject"),
          i = "[object Function]",
          a = "[object GeneratorFunction]",
          c = Object.prototype,
          s = c.toString;e.exports = n;
    }, { "./isObject": 113 }], 111: [function (t, e, r) {
      function n(t) {
        return "number" == typeof t && t > -1 && t % 1 == 0 && o >= t;
      }var o = 9007199254740991;e.exports = n;
    }, {}], 112: [function (t, e, r) {
      function n(t) {
        if (!a(t)) return !1;var e = o(t) || i(t) ? _ : u;return e.test(c(t));
      }var o = t("./isFunction"),
          i = t("./_isHostObject"),
          a = t("./isObject"),
          c = t("./_toSource"),
          s = /[\\^$.*+?()[\]{}|]/g,
          u = /^\[object .+?Constructor\]$/,
          f = Object.prototype,
          p = Function.prototype.toString,
          l = f.hasOwnProperty,
          _ = RegExp("^" + p.call(l).replace(s, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");e.exports = n;
    }, { "./_isHostObject": 75, "./_toSource": 100, "./isFunction": 110, "./isObject": 113 }], 113: [function (t, e, r) {
      function n(t) {
        var e = typeof t === "undefined" ? "undefined" : _typeof(t);return !!t && ("object" == e || "function" == e);
      }e.exports = n;
    }, {}], 114: [function (t, e, r) {
      function n(t) {
        return !!t && "object" == (typeof t === "undefined" ? "undefined" : _typeof(t));
      }e.exports = n;
    }, {}], 115: [function (t, e, r) {
      function n(t) {
        if (!a(t) || l.call(t) != c || i(t)) return !1;var e = o(t);if (null === e) return !0;var r = f.call(e, "constructor") && e.constructor;return "function" == typeof r && r instanceof r && u.call(r) == p;
      }var o = t("./_getPrototype"),
          i = t("./_isHostObject"),
          a = t("./isObjectLike"),
          c = "[object Object]",
          s = Object.prototype,
          u = Function.prototype.toString,
          f = s.hasOwnProperty,
          p = u.call(Object),
          l = s.toString;e.exports = n;
    }, { "./_getPrototype": 63, "./_isHostObject": 75, "./isObjectLike": 114 }], 116: [function (t, e, r) {
      function n(t) {
        return "string" == typeof t || !o(t) && i(t) && s.call(t) == a;
      }var o = t("./isArray"),
          i = t("./isObjectLike"),
          a = "[object String]",
          c = Object.prototype,
          s = c.toString;e.exports = n;
    }, { "./isArray": 106, "./isObjectLike": 114 }], 117: [function (t, e, r) {
      function n(t) {
        return "symbol" == (typeof t === "undefined" ? "undefined" : _typeof(t)) || o(t) && c.call(t) == i;
      }var o = t("./isObjectLike"),
          i = "[object Symbol]",
          a = Object.prototype,
          c = a.toString;e.exports = n;
    }, { "./isObjectLike": 114 }], 118: [function (t, e, r) {
      function n(t) {
        return i(t) && o(t.length) && !!M[T.call(t)];
      }var o = t("./isLength"),
          i = t("./isObjectLike"),
          a = "[object Arguments]",
          c = "[object Array]",
          s = "[object Boolean]",
          u = "[object Date]",
          f = "[object Error]",
          p = "[object Function]",
          l = "[object Map]",
          _ = "[object Number]",
          y = "[object Object]",
          v = "[object RegExp]",
          b = "[object Set]",
          g = "[object String]",
          h = "[object WeakMap]",
          d = "[object ArrayBuffer]",
          j = "[object DataView]",
          x = "[object Float32Array]",
          m = "[object Float64Array]",
          O = "[object Int8Array]",
          A = "[object Int16Array]",
          S = "[object Int32Array]",
          w = "[object Uint8Array]",
          k = "[object Uint8ClampedArray]",
          P = "[object Uint16Array]",
          I = "[object Uint32Array]",
          M = {};M[x] = M[m] = M[O] = M[A] = M[S] = M[w] = M[k] = M[P] = M[I] = !0, M[a] = M[c] = M[d] = M[s] = M[j] = M[u] = M[f] = M[p] = M[l] = M[_] = M[y] = M[v] = M[b] = M[g] = M[h] = !1;var C = Object.prototype,
          T = C.toString;e.exports = n;
    }, { "./isLength": 111, "./isObjectLike": 114 }], 119: [function (t, e, r) {
      function n(t) {
        var e = u(t);if (!e && !c(t)) return i(t);var r = a(t),
            n = !!r,
            f = r || [],
            p = f.length;for (var l in t) {
          !o(t, l) || n && ("length" == l || s(l, p)) || e && "constructor" == l || f.push(l);
        }return f;
      }var o = t("./_baseHas"),
          i = t("./_baseKeys"),
          a = t("./_indexKeys"),
          c = t("./isArrayLike"),
          s = t("./_isIndex"),
          u = t("./_isPrototype");e.exports = n;
    }, { "./_baseHas": 33, "./_baseKeys": 35, "./_indexKeys": 70, "./_isIndex": 76, "./_isPrototype": 80, "./isArrayLike": 107 }], 120: [function (t, e, r) {
      function n(t) {
        for (var e = -1, r = c(t), n = o(t), s = n.length, f = i(t), p = !!f, l = f || [], _ = l.length; ++e < s;) {
          var y = n[e];p && ("length" == y || a(y, _)) || "constructor" == y && (r || !u.call(t, y)) || l.push(y);
        }return l;
      }var o = t("./_baseKeysIn"),
          i = t("./_indexKeys"),
          a = t("./_isIndex"),
          c = t("./_isPrototype"),
          s = Object.prototype,
          u = s.hasOwnProperty;e.exports = n;
    }, { "./_baseKeysIn": 36, "./_indexKeys": 70, "./_isIndex": 76, "./_isPrototype": 80 }], 121: [function (t, e, r) {
      function n(t, e) {
        if ("function" != typeof t || e && "function" != typeof e) throw new TypeError(i);var r = function r() {
          var n = arguments,
              o = e ? e.apply(this, n) : n[0],
              i = r.cache;if (i.has(o)) return i.get(o);var a = t.apply(this, n);return r.cache = i.set(o, a), a;
        };return r.cache = new (n.Cache || o)(), r;
      }var o = t("./_MapCache"),
          i = "Expected a function";n.Cache = o, e.exports = n;
    }, { "./_MapCache": 7 }], 122: [function (t, e, r) {
      var n = t("./_baseMerge"),
          o = t("./_createAssigner"),
          i = o(function (t, e, r, o) {
        n(t, e, r, o);
      });e.exports = i;
    }, { "./_baseMerge": 37, "./_createAssigner": 59 }], 123: [function (t, e, r) {
      function n(t, e) {
        if ("function" != typeof t) throw new TypeError(a);return e = c(void 0 === e ? t.length - 1 : i(e), 0), function () {
          for (var r = arguments, n = -1, i = c(r.length - e, 0), a = Array(i); ++n < i;) {
            a[n] = r[e + n];
          }switch (e) {case 0:
              return t.call(this, a);case 1:
              return t.call(this, r[0], a);case 2:
              return t.call(this, r[0], r[1], a);}var s = Array(e + 1);for (n = -1; ++n < e;) {
            s[n] = r[n];
          }return s[e] = a, o(t, this, s);
        };
      }var o = t("./_apply"),
          i = t("./toInteger"),
          a = "Expected a function",
          c = Math.max;e.exports = n;
    }, { "./_apply": 17, "./toInteger": 125 }], 124: [function (t, e, r) {
      function n(t, e, r) {
        return null == t ? t : o(t, e, r);
      }var o = t("./_baseSet");e.exports = n;
    }, { "./_baseSet": 40 }], 125: [function (t, e, r) {
      function n(t) {
        if (!t) return 0 === t ? t : 0;if (t = o(t), t === i || t === -i) {
          var e = 0 > t ? -1 : 1;return e * a;
        }var r = t % 1;return t === t ? r ? t - r : t : 0;
      }var o = t("./toNumber"),
          i = 1 / 0,
          a = 1.7976931348623157e308;e.exports = n;
    }, { "./toNumber": 126 }], 126: [function (t, e, r) {
      function n(t) {
        if ("number" == typeof t) return t;if (a(t)) return c;if (i(t)) {
          var e = o(t.valueOf) ? t.valueOf() : t;t = i(e) ? e + "" : e;
        }if ("string" != typeof t) return 0 === t ? t : +t;t = t.replace(s, "");var r = f.test(t);return r || p.test(t) ? l(t.slice(2), r ? 2 : 8) : u.test(t) ? c : +t;
      }var o = t("./isFunction"),
          i = t("./isObject"),
          a = t("./isSymbol"),
          c = NaN,
          s = /^\s+|\s+$/g,
          u = /^[-+]0x[0-9a-f]+$/i,
          f = /^0b[01]+$/i,
          p = /^0o[0-7]+$/i,
          l = parseInt;e.exports = n;
    }, { "./isFunction": 110, "./isObject": 113, "./isSymbol": 117 }], 127: [function (t, e, r) {
      function n(t) {
        return o(t, i(t));
      }var o = t("./_copyObject"),
          i = t("./keysIn");e.exports = n;
    }, { "./_copyObject": 57, "./keysIn": 120 }], 128: [function (t, e, r) {
      function n(t) {
        return null == t ? "" : o(t);
      }var o = t("./_baseToString");e.exports = n;
    }, { "./_baseToString": 43 }], 129: [function (t, e, r) {
      function n(t, e, r) {
        if (t = s(t), t && (r || void 0 === e)) return t.replace(u, "");if (!t || !(e = o(e))) return t;var n = c(t),
            f = a(n, c(e)) + 1;return i(n, 0, f).join("");
      }var o = t("./_baseToString"),
          i = t("./_castSlice"),
          a = t("./_charsEndIndex"),
          c = t("./_stringToArray"),
          s = t("./toString"),
          u = /\s+$/;e.exports = n;
    }, { "./_baseToString": 43, "./_castSlice": 45, "./_charsEndIndex": 46, "./_stringToArray": 97, "./toString": 128 }], 130: [function (t, e, r) {
      "use strict";
      function n(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
      }var o = function () {
        function t(t, e) {
          for (var r = 0; r < e.length; r++) {
            var n = e[r];n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n);
          }
        }return function (e, r, n) {
          return r && t(e.prototype, r), n && t(e, n), e;
        };
      }(),
          i = t("lodash/isString"),
          a = t("lodash/isPlainObject"),
          c = t("lodash/isFunction"),
          s = t("lodash/get"),
          u = t("lodash/set"),
          f = t("lodash/defaultsDeep"),
          p = t("lodash/trimEnd");e.exports = function (e) {
        var r = { config_files: {}, config_files_use_ext: ".js", app_config_path: "config", config_env_filename: ".env", config_app_filename: "app", config_providers_path: "providers", provider_files: {} };return e = f(e || {}, r), function () {
          function l(t) {
            n(this, l), t = f(t, { app: {}, config: {}, providers: [] }), this.app = t.app, this.config = t.config, this.providers = t.providers;
          }return o(l, [{ key: "loadConfig", value: function value(r) {
              var n = this;if (i(e.config_files)) {
                var o = t("fs"),
                    c = t("path");o.readdir(e.config_files, function (o, i) {
                  if (o) return r(o);for (var a = {}, s = 0; s < i.length; s++) {
                    var u = i[s];a[u] = t(c.join(e.config_files, u));
                  }n.useConfigFiles(a), r();
                });
              } else a(e.config_files) ? (this.useConfigFiles(e.config_files), r()) : (this.useConfigFiles(), r());
            } }, { key: "useConfigFiles", value: function value(t) {
              t || (t = {});var r = {},
                  n = {},
                  o = {};for (var i in t) {
                if (e.config_files_use_ext) var a = p(i, e.config_files_use_ext);var c = t[i];a === e.config_env_filename ? n = c : a === e.config_app_filename ? o = c : r[a] = c;
              }var l = f({}, this.config, n, o, r);u(this.app, e.app_config_path, function (t, e) {
                return s(l, t, e);
              });
            } }, { key: "loadProviders", value: function value(r) {
              var n = this,
                  o = function o(t) {
                return t;
              };if (i(e.provider_files)) {
                var u = t("path");o = function o(r) {
                  return t(u.join(e.provider_files, r));
                };
              } else a(e.provider_files) && (o = function o(t) {
                return e.provider_files[t];
              });var f = s(this.app, e.app_config_path)(e.config_providers_path, []),
                  p = this.providers.concat(f),
                  l = 0,
                  _ = function y(t) {
                if (t || l === p.length) return r(t);var e = p[l++];if (i(e) && (e = o(e)), !c(e)) return y(new Error("Provider " + l + " is not a function."));try {
                  e(n.app, y);
                } catch (t) {
                  y(t);
                }
              };_();
            } }, { key: "init", value: function value(t) {
              var e = this,
                  r = [function (t) {
                e.loadConfig(t);
              }, function (t) {
                e.loadProviders(t);
              }],
                  n = 0,
                  o = function i(o) {
                if (o || n === r.length) return t(o, e.app);var a = r[n++];try {
                  a(i);
                } catch (o) {
                  i(o);
                }
              };o();
            } }], [{ key: "factory_config", get: function get() {
              return e;
            } }, { key: "default_factory_config", get: function get() {
              return r;
            } }]), l;
        }();
      };
    }, { fs: 1, "lodash/defaultsDeep": 102, "lodash/get": 104, "lodash/isFunction": 110, "lodash/isPlainObject": 115, "lodash/isString": 116, "lodash/set": 124, "lodash/trimEnd": 129, path: 2 }] }, {}, [130])(130);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

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

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
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

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; i++) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
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

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
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

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
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
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

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
      case undefined:
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

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

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

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
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

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = 0; byteOffset + i < arrLength; i++) {
    if (read(arr, byteOffset + i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return (byteOffset + foundIndex) * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }
  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
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
    if (isNaN(parsed)) return i
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
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
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
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

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
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

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
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

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
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
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
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
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
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
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
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; i++) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; i++) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

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

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"base64-js":3,"ieee754":4,"isarray":5}],3:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],6:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

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

},{"./_nativeCreate":35}],7:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":21,"./_root":36}],8:[function(require,module,exports){
var mapClear = require('./_mapClear'),
    mapDelete = require('./_mapDelete'),
    mapGet = require('./_mapGet'),
    mapHas = require('./_mapHas'),
    mapSet = require('./_mapSet');

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

},{"./_mapClear":30,"./_mapDelete":31,"./_mapGet":32,"./_mapHas":33,"./_mapSet":34}],9:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":36}],10:[function(require,module,exports){
var eq = require('./eq');

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

},{"./eq":40}],11:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

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

},{"./_assocIndexOf":14}],12:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

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

},{"./_assocIndexOf":14}],13:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

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

},{"./_assocIndexOf":14}],14:[function(require,module,exports){
var eq = require('./eq');

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

},{"./eq":40}],15:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

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

},{"./_assocIndexOf":14}],16:[function(require,module,exports){
var castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

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

},{"./_castPath":19,"./_isKey":28,"./_toKey":38}],17:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    castPath = require('./_castPath'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isObject = require('./isObject'),
    toKey = require('./_toKey');

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

},{"./_assignValue":10,"./_castPath":19,"./_isIndex":27,"./_isKey":28,"./_toKey":38,"./isObject":45}],18:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isSymbol = require('./isSymbol');

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

},{"./_Symbol":9,"./isSymbol":47}],19:[function(require,module,exports){
var isArray = require('./isArray'),
    stringToPath = require('./_stringToPath');

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

},{"./_stringToPath":37,"./isArray":42}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
var isNative = require('./isNative');

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

},{"./isNative":44}],22:[function(require,module,exports){
var hashHas = require('./_hashHas');

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

},{"./_hashHas":24}],23:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

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

},{"./_nativeCreate":35}],24:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

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

},{"./_nativeCreate":35}],25:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

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

},{"./_nativeCreate":35}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

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

},{"./isArray":42,"./isSymbol":47}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
var Hash = require('./_Hash'),
    Map = require('./_Map');

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

},{"./_Hash":6,"./_Map":7}],31:[function(require,module,exports){
var Map = require('./_Map'),
    assocDelete = require('./_assocDelete'),
    hashDelete = require('./_hashDelete'),
    isKeyable = require('./_isKeyable');

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

},{"./_Map":7,"./_assocDelete":11,"./_hashDelete":22,"./_isKeyable":29}],32:[function(require,module,exports){
var Map = require('./_Map'),
    assocGet = require('./_assocGet'),
    hashGet = require('./_hashGet'),
    isKeyable = require('./_isKeyable');

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

},{"./_Map":7,"./_assocGet":12,"./_hashGet":23,"./_isKeyable":29}],33:[function(require,module,exports){
var Map = require('./_Map'),
    assocHas = require('./_assocHas'),
    hashHas = require('./_hashHas'),
    isKeyable = require('./_isKeyable');

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

},{"./_Map":7,"./_assocHas":13,"./_hashHas":24,"./_isKeyable":29}],34:[function(require,module,exports){
var Map = require('./_Map'),
    assocSet = require('./_assocSet'),
    hashSet = require('./_hashSet'),
    isKeyable = require('./_isKeyable');

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

},{"./_Map":7,"./_assocSet":15,"./_hashSet":25,"./_isKeyable":29}],35:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":21}],36:[function(require,module,exports){
(function (global){
var checkGlobal = require('./_checkGlobal');

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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./_checkGlobal":20}],37:[function(require,module,exports){
var memoize = require('./memoize'),
    toString = require('./toString');

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

},{"./memoize":48,"./toString":50}],38:[function(require,module,exports){
var isSymbol = require('./isSymbol');

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

},{"./isSymbol":47}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
var baseGet = require('./_baseGet');

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

},{"./_baseGet":16}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
var isObject = require('./isObject');

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

},{"./isObject":45}],44:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

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

},{"./_isHostObject":26,"./_toSource":39,"./isFunction":43,"./isObject":45}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

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

},{"./isObjectLike":46}],48:[function(require,module,exports){
var MapCache = require('./_MapCache');

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

},{"./_MapCache":8}],49:[function(require,module,exports){
var baseSet = require('./_baseSet');

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

},{"./_baseSet":17}],50:[function(require,module,exports){
var baseToString = require('./_baseToString');

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

},{"./_baseToString":18}],51:[function(require,module,exports){
var should = require('./lib/should');

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

},{"./lib/should":68}],52:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('./util');

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

},{"./util":69}],53:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var AssertionError = require('./assertion-error');

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

},{"./assertion-error":52}],54:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var Formatter = require('should-format').Formatter;

var config = {
  checkProtoEql: false,

  getFormatter: function(opts) {
    return new Formatter(opts || config);
  }
};

module.exports = config;

},{"should-format":72}],55:[function(require,module,exports){
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
var Assertion = require('./../assertion');

var _deepEqual = require('should-equal');

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

},{"./../assertion":53,"should-equal":71}],56:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var assert = require('./_assert');
var AssertionError = require('../assertion-error');

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

},{"../assertion-error":52,"../util":69,"./_assert":55}],57:[function(require,module,exports){
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

},{}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

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

},{"../util":69,"should-equal":71}],60:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var eql = require('should-equal');
var type = require('should-type');
var util = require('../util');

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

},{"../util":69,"should-equal":71,"should-type":74}],61:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */
var util = require('../util');

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

},{"../util":69}],62:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

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

},{"../util":69,"should-equal":71}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var PromisedAssertion = require('../assertion').PromisedAssertion;
var Assertion = require('../assertion');

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

},{"../assertion":53,"../util":69}],65:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');
var eql = require('should-equal');

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

},{"../util":69,"should-equal":71}],66:[function(require,module,exports){
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

},{}],67:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var util = require('../util');

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

},{"../util":69}],68:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */


var util = require('./util');

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

should.AssertionError = require('./assertion-error');
should.Assertion = require('./assertion');

should.format = util.format;
should.type = require('should-type');
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
should.config = require('./config');

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
  .use(require('./ext/assert'))
  .use(require('./ext/chain'))
  .use(require('./ext/bool'))
  .use(require('./ext/number'))
  .use(require('./ext/eql'))
  .use(require('./ext/type'))
  .use(require('./ext/string'))
  .use(require('./ext/property'))
  .use(require('./ext/error'))
  .use(require('./ext/match'))
  .use(require('./ext/contain'))
  .use(require('./ext/promise'));

},{"./assertion":53,"./assertion-error":52,"./config":54,"./ext/assert":56,"./ext/bool":57,"./ext/chain":58,"./ext/contain":59,"./ext/eql":60,"./ext/error":61,"./ext/match":62,"./ext/number":63,"./ext/promise":64,"./ext/property":65,"./ext/string":66,"./ext/type":67,"./util":69,"should-type":74}],69:[function(require,module,exports){
/*
 * should.js - assertion library
 * Copyright(c) 2010-2013 TJ Holowaychuk <tj@vision-media.ca>
 * Copyright(c) 2013-2016 Denis Bardadym <bardadymchik@gmail.com>
 * MIT Licensed
 */

var type = require('should-type');
var config = require('./config');

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

exports.functionName = require('should-format').Formatter.functionName;

exports.formatProp = function(value) {
  return config.getFormatter().formatPropertyName(String(value));
};

},{"./config":54,"should-format":72,"should-type":74}],70:[function(require,module,exports){
module.exports = function format(msg) {
  var args = arguments;
  for(var i = 1, l = args.length; i < l; i++) {
    msg = msg.replace(/%s/, args[i]);
  }
  return msg;
}

},{}],71:[function(require,module,exports){
var getType = require('should-type');
var format = require('./format');
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

},{"./format":70,"should-type":74}],72:[function(require,module,exports){
var getType = require('should-type');
var util = require('./util');

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

},{"./util":73,"should-type":74}],73:[function(require,module,exports){
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

},{}],74:[function(require,module,exports){
(function (Buffer){
var toString = Object.prototype.toString;

var types = require('./types');

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

}).call(this,require("buffer").Buffer)

},{"./types":75,"buffer":2}],75:[function(require,module,exports){
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

},{}],76:[function(require,module,exports){
"use strict";

var inspirationArchitectFactory = require('../inspiration-architect.min');

var should = require('should');

var _get = require('lodash/get');
var _set = require('lodash/set');

var globalTests = require('./global-tests');
var factoryTests = require('./factory-tests');

var config_files = {'.env': require('../test/fixtures/sample-app/config/.env.js'),'app': require('../test/fixtures/sample-app/config/app.js'),'external': require('../test/fixtures/sample-app/config/external.js')};
var empty_config_files = {};
var provider_files = {'addSomething': require('../test/fixtures/sample-app/providers/addSomething.js'),'addSomethingAsync': require('../test/fixtures/sample-app/providers/addSomethingAsync.js')};
var empty_provider_files = {};

factoryTests(inspirationArchitectFactory);

describe('browserify tests', function () {

    describe('different config files', function () {

        var factory_config = {
            config_files: config_files
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the basic tests', function () {

            globalTests(Inspiration);
        });

        it('should honor the server config files', function (done) {

            var inspiration = new Inspiration();

            inspiration.init(function (err) {

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

        it('should be able to overwrite server config files', function (done) {

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

            inspiration.init(function (err) {

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

    describe('no config files', function () {

        var factory_config = {
            config_files: empty_config_files
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the basic tests', function () {

            globalTests(Inspiration);
        });

        it('should be able to overwrite empty server config files', function (done) {

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

            inspiration.init(function (err) {

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

    describe('reference server providers', function () {

        var factory_config = {
            provider_files: provider_files
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the server providers based on the config', function (done) {

            var inspiration = new Inspiration({
                config: {
                    providers: ['addSomethingAsync', 'addSomething', function (app, done) {
                        app.doSomethingElse = function () {

                            return 3;
                        };
                        done();
                    }]
                }
            });

            inspiration.init(function (err) {

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

    describe('no provider files', function () {

        var factory_config = {
            provider_files: empty_provider_files
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the basic tests', function () {

            globalTests(Inspiration);
        });

        it('should still run initial providers', function (done) {

            var inspiration = new Inspiration({
                providers: [function (app, done) {

                    app.something_property = 1;
                    done();
                }, function (app, done) {

                    app.something_other_property = 2;
                    done();
                }],
                config: {
                    providers: [function (app, done) {
                        app.something_third_property = 3;
                        done();
                    }]
                }
            });

            inspiration.init(function (err) {

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

    describe('different factory config values combined', function () {

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
        _set(factory_config.config_files[config_app_filename], config_providers_path, ['addSomething']);

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should honor the factory config', function (done) {

            var inspiration = new Inspiration();
            inspiration.test = true;
            inspiration.init(function (err) {

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

},{"../inspiration-architect.min":1,"../test/fixtures/sample-app/config/.env.js":79,"../test/fixtures/sample-app/config/app.js":80,"../test/fixtures/sample-app/config/external.js":81,"../test/fixtures/sample-app/providers/addSomething.js":82,"../test/fixtures/sample-app/providers/addSomethingAsync.js":83,"./factory-tests":77,"./global-tests":78,"lodash/get":41,"lodash/set":49,"should":51}],77:[function(require,module,exports){
"use strict";

var should = require('should');
var _get = require('lodash/get');
var _set = require('lodash/set');
var globalTests = require('./global-tests');

module.exports = function factoryTests(inspirationArchitectFactory) {
    describe('factory', function () {

        describe('empty factory config', function () {

            var Inspiration = inspirationArchitectFactory();

            globalTests(Inspiration);
        });

        describe('different app config path', function () {

            var factory_config = {
                app_config_path: 'locals.config'
            };

            var Inspiration = inspirationArchitectFactory(factory_config);

            globalTests(Inspiration);

            describe('locals.config', function () {

                it('should be able to access the config at locals.config', function (done) {

                    var inspiration = new Inspiration({
                        config: {
                            greeting: 'hello'
                        }
                    });

                    inspiration.init(function (err) {

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

        describe('different config providers path', function () {

            var factory_config = {
                config_providers_path: 'custom.providers'
            };

            var Inspiration = inspirationArchitectFactory(factory_config);

            globalTests(Inspiration);

            describe('custom.providers', function () {

                it('should be able to use custom.providers as the config path to get providers', function (done) {

                    var config = {};
                    _set(config, 'custom.providers', [function (app, done) {
                        app.something = function () {
                            return 'hello';
                        };
                        done();
                    }]);
                    var inspiration = new Inspiration({
                        config: config
                    });

                    inspiration.init(function (err) {

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

},{"./global-tests":78,"lodash/get":41,"lodash/set":49,"should":51}],78:[function(require,module,exports){
'use strict';

var should = require('should');
var _get = require('lodash/get');
var _set = require('lodash/set');

module.exports = function globalTests(Inspiration) {

    var app_config_path = Inspiration.factory_config.app_config_path;

    describe('with no initials', function () {

        it('should create a new inspiration class, then a new instance, with a config function.', function (done) {

            var inspiration = new Inspiration();

            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }
                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                done();
            });
        });
    });

    describe('with an initial app', function () {

        var app = {
            name: 'My Cool App'
        };

        it('should create a new inspiration class, then a new instance with the initial app.', function (done) {

            var inspiration = new Inspiration({ app: app });
            inspiration.app.should.equal(app);
            inspiration.app.should.have.property('name', app.name);

            inspiration.init(function (err) {

                if (err) {
                    throw err;
                }
                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                done();
            });
        });
    });

    describe('with an initial config', function () {

        var config = {
            a: 'hola',
            b: {
                c: 'aloha'
            }
        };

        it('should create a new inspiration class, then a new instance.', function (done) {

            var inspiration = new Inspiration({ config: config });
            inspiration.config.should.equal(config);
            inspiration.init(function (err) {

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

    describe('with an initial app and an initial config', function () {

        var app = {
            name: 'My Cool App'
        };

        var config = {
            a: 'hola',
            b: {
                c: 'aloha'
            }
        };

        it('should create a new inspiration class, then a new instance.', function (done) {

            var inspiration = new Inspiration({ app: app, config: config });
            inspiration.config.should.equal(config);
            inspiration.init(function (err) {

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

    describe('with an initial set of providers', function () {

        var providers = [function (app, done) {
            app.something = function () {
                return 1;
            };
            done();
        }, function (app, done) {

            setTimeout(function () {

                app.somethingAsync = function () {
                    return 2;
                };
                done();
            }, 100);
        }];

        it('should create a new inspiration class, then a new instance.', function (done) {

            var inspiration = new Inspiration({ providers: providers });
            inspiration.providers.should.equal(providers);
            inspiration.init(function (err) {

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

    describe('with an initial app, an initial config, and an initial set of providers', function () {

        var app = {
            name: 'My Cool App'
        };

        var config = {
            a: 'hola',
            b: {
                c: 'aloha'
            }
        };
        _set(config, Inspiration.factory_config.config_providers_path, [function (app, done) {
            app.somethingElse = function () {

                return 3;
            };
            done();
        }]);

        var providers = [function (app, done) {
            app.something = function () {
                return 1;
            };
            done();
        }, function (app, done) {

            setTimeout(function () {

                app.somethingAsync = function () {
                    return 2;
                };
                done();
            }, 100);
        }];

        it('should create a new inspiration class, then a new instance.', function (done) {

            var inspiration = new Inspiration({ app: app, config: config, providers: providers });
            inspiration.config.should.equal(config);
            inspiration.init(function (err) {

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

},{"lodash/get":41,"lodash/set":49,"should":51}],79:[function(require,module,exports){
'use strict';

module.exports = {
    a_sample: 'one'
};

},{}],80:[function(require,module,exports){
'use strict';

module.exports = {
    a_sample: 1,
    b_sample: 'two',
    c_sample: [true, {
        d_sample: 4
    }],
    e_sample: {
        f_sample: {
            g_sample: 5
        }
    }
};

},{}],81:[function(require,module,exports){
'use strict';

module.exports = {
    h_sample: 'hello',
    i_sample: 'goodbye'
};

},{}],82:[function(require,module,exports){
"use strict";

module.exports = function addSomething(app, done) {

    app.doSomething = function () {

        return 2;
    };
    done();
};

},{}],83:[function(require,module,exports){
"use strict";

module.exports = function addSomethingAsync(app, done) {

    setTimeout(function () {

        app.doSomethingAsync = function () {
            return 1;
        };
        done();
    }, 100);
};

},{}]},{},[76])(76)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbnNwaXJhdGlvbi1hcmNoaXRlY3QubWluLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwQ2FjaGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hc3NpZ25WYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc29jRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0hhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc29jSW5kZXhPZi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc29jU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0UGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NoZWNrR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaERlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaFNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSG9zdE9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlQ3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0cmluZ1RvUGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvS2V5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9Tb3VyY2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2VxLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9nZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzTmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbWVtb2l6ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvc2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9hc3NlcnRpb24tZXJyb3IuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9hc3NlcnRpb24uanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9jb25maWcuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9leHQvX2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9hc3NlcnQuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9leHQvYm9vbC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9jaGFpbi5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9jb250YWluLmpzIiwibm9kZV9tb2R1bGVzL3Nob3VsZC9saWIvZXh0L2VxbC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9lcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9tYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9udW1iZXIuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9leHQvcHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL2V4dC9zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL2xpYi9leHQvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL3Nob3VsZC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbGliL3V0aWwuanMiLCJub2RlX21vZHVsZXMvc2hvdWxkL25vZGVfbW9kdWxlcy9zaG91bGQtZXF1YWwvZm9ybWF0LmpzIiwibm9kZV9tb2R1bGVzL3Nob3VsZC9ub2RlX21vZHVsZXMvc2hvdWxkLWVxdWFsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Nob3VsZC9ub2RlX21vZHVsZXMvc2hvdWxkLWZvcm1hdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbm9kZV9tb2R1bGVzL3Nob3VsZC1mb3JtYXQvdXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9zaG91bGQvbm9kZV9tb2R1bGVzL3Nob3VsZC10eXBlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Nob3VsZC9ub2RlX21vZHVsZXMvc2hvdWxkLXR5cGUvdHlwZXMuanMiLCJ0ZXN0LXNyYy9icm93c2VyaWZ5LmpzIiwidGVzdC1zcmMvZmFjdG9yeS10ZXN0cy5qcyIsInRlc3Qtc3JjL2dsb2JhbC10ZXN0cy5qcyIsInRlc3QvZml4dHVyZXMvc2FtcGxlLWFwcC9jb25maWcvLmVudi5qcyIsInRlc3QvZml4dHVyZXMvc2FtcGxlLWFwcC9jb25maWcvYXBwLmpzIiwidGVzdC9maXh0dXJlcy9zYW1wbGUtYXBwL2NvbmZpZy9leHRlcm5hbC5qcyIsInRlc3QvZml4dHVyZXMvc2FtcGxlLWFwcC9wcm92aWRlcnMvYWRkU29tZXRoaW5nLmpzIiwidGVzdC9maXh0dXJlcy9zYW1wbGUtYXBwL3Byb3ZpZGVycy9hZGRTb21ldGhpbmdBc3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQUEsQ0FBQyxVQUFTLENBQVQsRUFBVztBQUFDLE1BQUcsb0JBQWlCLE9BQWpCLHlDQUFpQixPQUFqQixNQUEwQixlQUFhLE9BQU8sTUFBakQsRUFBd0QsT0FBTyxPQUFQLEdBQWUsR0FBZixDQUF4RCxLQUFnRixJQUFHLGNBQVksT0FBTyxNQUFuQixJQUEyQixPQUFPLEdBQXJDLEVBQXlDLE9BQU8sRUFBUCxFQUFVLENBQVYsRUFBekMsS0FBMEQ7QUFBQyxRQUFJLENB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQy9xREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNiLGNBQVU7QUFERyxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUI7QUFDYixjQUFVLENBREc7QUFFYixjQUFVLEtBRkc7QUFHYixjQUFVLENBQ04sSUFETSxFQUNBO0FBQ0Ysa0JBQVU7QUFEUixLQURBLENBSEc7QUFRYixjQUFVO0FBQ04sa0JBQVU7QUFDTixzQkFBVTtBQURKO0FBREo7QUFSRyxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUI7QUFDYixjQUFVLE9BREc7QUFFYixjQUFVO0FBRkcsQ0FBakI7OztBQ0FBOztBQUVBLE9BQU8sT0FBUCxHQUFpQixTQUFTLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkIsSUFBM0IsRUFBaUM7O0FBRTlDLFFBQUksV0FBSixHQUFrQixZQUFXOztBQUV6QixlQUFPLENBQVA7QUFDSCxLQUhEO0FBSUE7QUFDSCxDQVBEOzs7QUNGQTs7QUFFQSxPQUFPLE9BQVAsR0FBaUIsU0FBUyxpQkFBVCxDQUEyQixHQUEzQixFQUFnQyxJQUFoQyxFQUFzQzs7QUFFbkQsZUFBVyxZQUFXOztBQUVsQixZQUFJLGdCQUFKLEdBQXVCLFlBQVc7QUFDOUIsbUJBQU8sQ0FBUDtBQUNILFNBRkQ7QUFHQTtBQUNILEtBTkQsRUFNRyxHQU5IO0FBT0gsQ0FURCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIhZnVuY3Rpb24odCl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUpbW9kdWxlLmV4cG9ydHM9dCgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXSx0KTtlbHNle3ZhciBlO2U9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjp0aGlzLGUuaW5zcGlyYXRpb25BcmNoaXRlY3RGYWN0b3J5PXQoKX19KGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uIHQoZSxyLG4pe2Z1bmN0aW9uIG8oYSxjKXtpZighclthXSl7aWYoIWVbYV0pe3ZhciBzPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWMmJnMpcmV0dXJuIHMoYSwhMCk7aWYoaSlyZXR1cm4gaShhLCEwKTt2YXIgdT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2ErXCInXCIpO3Rocm93IHUuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIix1fXZhciBmPXJbYV09e2V4cG9ydHM6e319O2VbYV1bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24odCl7dmFyIHI9ZVthXVsxXVt0XTtyZXR1cm4gbyhyP3I6dCl9LGYsZi5leHBvcnRzLHQsZSxyLG4pfXJldHVybiByW2FdLmV4cG9ydHN9Zm9yKHZhciBpPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsYT0wO2E8bi5sZW5ndGg7YSsrKW8oblthXSk7cmV0dXJuIG99KHsxOltmdW5jdGlvbih0LGUscil7fSx7fV0sMjpbZnVuY3Rpb24odCxlLHIpeyhmdW5jdGlvbih0KXtmdW5jdGlvbiBlKHQsZSl7Zm9yKHZhciByPTAsbj10Lmxlbmd0aC0xO24+PTA7bi0tKXt2YXIgbz10W25dO1wiLlwiPT09bz90LnNwbGljZShuLDEpOlwiLi5cIj09PW8/KHQuc3BsaWNlKG4sMSkscisrKTpyJiYodC5zcGxpY2UobiwxKSxyLS0pfWlmKGUpZm9yKDtyLS07cil0LnVuc2hpZnQoXCIuLlwiKTtyZXR1cm4gdH1mdW5jdGlvbiBuKHQsZSl7aWYodC5maWx0ZXIpcmV0dXJuIHQuZmlsdGVyKGUpO2Zvcih2YXIgcj1bXSxuPTA7bjx0Lmxlbmd0aDtuKyspZSh0W25dLG4sdCkmJnIucHVzaCh0W25dKTtyZXR1cm4gcn12YXIgbz0vXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLyxpPWZ1bmN0aW9uKHQpe3JldHVybiBvLmV4ZWModCkuc2xpY2UoMSl9O3IucmVzb2x2ZT1mdW5jdGlvbigpe2Zvcih2YXIgcj1cIlwiLG89ITEsaT1hcmd1bWVudHMubGVuZ3RoLTE7aT49LTEmJiFvO2ktLSl7dmFyIGE9aT49MD9hcmd1bWVudHNbaV06dC5jd2QoKTtpZihcInN0cmluZ1wiIT10eXBlb2YgYSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3NcIik7YSYmKHI9YStcIi9cIityLG89XCIvXCI9PT1hLmNoYXJBdCgwKSl9cmV0dXJuIHI9ZShuKHIuc3BsaXQoXCIvXCIpLGZ1bmN0aW9uKHQpe3JldHVybiEhdH0pLCFvKS5qb2luKFwiL1wiKSwobz9cIi9cIjpcIlwiKStyfHxcIi5cIn0sci5ub3JtYWxpemU9ZnVuY3Rpb24odCl7dmFyIG89ci5pc0Fic29sdXRlKHQpLGk9XCIvXCI9PT1hKHQsLTEpO3JldHVybiB0PWUobih0LnNwbGl0KFwiL1wiKSxmdW5jdGlvbih0KXtyZXR1cm4hIXR9KSwhbykuam9pbihcIi9cIiksdHx8b3x8KHQ9XCIuXCIpLHQmJmkmJih0Kz1cIi9cIiksKG8/XCIvXCI6XCJcIikrdH0sci5pc0Fic29sdXRlPWZ1bmN0aW9uKHQpe3JldHVyblwiL1wiPT09dC5jaGFyQXQoMCl9LHIuam9pbj1mdW5jdGlvbigpe3ZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywwKTtyZXR1cm4gci5ub3JtYWxpemUobih0LGZ1bmN0aW9uKHQsZSl7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIHQpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzXCIpO3JldHVybiB0fSkuam9pbihcIi9cIikpfSxyLnJlbGF0aXZlPWZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gbih0KXtmb3IodmFyIGU9MDtlPHQubGVuZ3RoJiZcIlwiPT09dFtlXTtlKyspO2Zvcih2YXIgcj10Lmxlbmd0aC0xO3I+PTAmJlwiXCI9PT10W3JdO3ItLSk7cmV0dXJuIGU+cj9bXTp0LnNsaWNlKGUsci1lKzEpfXQ9ci5yZXNvbHZlKHQpLnN1YnN0cigxKSxlPXIucmVzb2x2ZShlKS5zdWJzdHIoMSk7Zm9yKHZhciBvPW4odC5zcGxpdChcIi9cIikpLGk9bihlLnNwbGl0KFwiL1wiKSksYT1NYXRoLm1pbihvLmxlbmd0aCxpLmxlbmd0aCksYz1hLHM9MDthPnM7cysrKWlmKG9bc10hPT1pW3NdKXtjPXM7YnJlYWt9Zm9yKHZhciB1PVtdLHM9YztzPG8ubGVuZ3RoO3MrKyl1LnB1c2goXCIuLlwiKTtyZXR1cm4gdT11LmNvbmNhdChpLnNsaWNlKGMpKSx1LmpvaW4oXCIvXCIpfSxyLnNlcD1cIi9cIixyLmRlbGltaXRlcj1cIjpcIixyLmRpcm5hbWU9ZnVuY3Rpb24odCl7dmFyIGU9aSh0KSxyPWVbMF0sbj1lWzFdO3JldHVybiByfHxuPyhuJiYobj1uLnN1YnN0cigwLG4ubGVuZ3RoLTEpKSxyK24pOlwiLlwifSxyLmJhc2VuYW1lPWZ1bmN0aW9uKHQsZSl7dmFyIHI9aSh0KVsyXTtyZXR1cm4gZSYmci5zdWJzdHIoLTEqZS5sZW5ndGgpPT09ZSYmKHI9ci5zdWJzdHIoMCxyLmxlbmd0aC1lLmxlbmd0aCkpLHJ9LHIuZXh0bmFtZT1mdW5jdGlvbih0KXtyZXR1cm4gaSh0KVszXX07dmFyIGE9XCJiXCI9PT1cImFiXCIuc3Vic3RyKC0xKT9mdW5jdGlvbih0LGUscil7cmV0dXJuIHQuc3Vic3RyKGUscil9OmZ1bmN0aW9uKHQsZSxyKXtyZXR1cm4gMD5lJiYoZT10Lmxlbmd0aCtlKSx0LnN1YnN0cihlLHIpfX0pLmNhbGwodGhpcyx0KFwiX3Byb2Nlc3NcIikpfSx7X3Byb2Nlc3M6M31dLDM6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKCl7Zj0hMSxjLmxlbmd0aD91PWMuY29uY2F0KHUpOnA9LTEsdS5sZW5ndGgmJm8oKX1mdW5jdGlvbiBvKCl7aWYoIWYpe3ZhciB0PXNldFRpbWVvdXQobik7Zj0hMDtmb3IodmFyIGU9dS5sZW5ndGg7ZTspe2ZvcihjPXUsdT1bXTsrK3A8ZTspYyYmY1twXS5ydW4oKTtwPS0xLGU9dS5sZW5ndGh9Yz1udWxsLGY9ITEsY2xlYXJUaW1lb3V0KHQpfX1mdW5jdGlvbiBpKHQsZSl7dGhpcy5mdW49dCx0aGlzLmFycmF5PWV9ZnVuY3Rpb24gYSgpe312YXIgYyxzPWUuZXhwb3J0cz17fSx1PVtdLGY9ITEscD0tMTtzLm5leHRUaWNrPWZ1bmN0aW9uKHQpe3ZhciBlPW5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoLTEpO2lmKGFyZ3VtZW50cy5sZW5ndGg+MSlmb3IodmFyIHI9MTtyPGFyZ3VtZW50cy5sZW5ndGg7cisrKWVbci0xXT1hcmd1bWVudHNbcl07dS5wdXNoKG5ldyBpKHQsZSkpLDEhPT11Lmxlbmd0aHx8Znx8c2V0VGltZW91dChvLDApfSxpLnByb3RvdHlwZS5ydW49ZnVuY3Rpb24oKXt0aGlzLmZ1bi5hcHBseShudWxsLHRoaXMuYXJyYXkpfSxzLnRpdGxlPVwiYnJvd3NlclwiLHMuYnJvd3Nlcj0hMCxzLmVudj17fSxzLmFyZ3Y9W10scy52ZXJzaW9uPVwiXCIscy52ZXJzaW9ucz17fSxzLm9uPWEscy5hZGRMaXN0ZW5lcj1hLHMub25jZT1hLHMub2ZmPWEscy5yZW1vdmVMaXN0ZW5lcj1hLHMucmVtb3ZlQWxsTGlzdGVuZXJzPWEscy5lbWl0PWEscy5iaW5kaW5nPWZ1bmN0aW9uKHQpe3Rocm93IG5ldyBFcnJvcihcInByb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkXCIpfSxzLmN3ZD1mdW5jdGlvbigpe3JldHVyblwiL1wifSxzLmNoZGlyPWZ1bmN0aW9uKHQpe3Rocm93IG5ldyBFcnJvcihcInByb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZFwiKX0scy51bWFzaz1mdW5jdGlvbigpe3JldHVybiAwfX0se31dLDQ6W2Z1bmN0aW9uKHQsZSxyKXt2YXIgbj10KFwiLi9fZ2V0TmF0aXZlXCIpLG89dChcIi4vX3Jvb3RcIiksaT1uKG8sXCJEYXRhVmlld1wiKTtlLmV4cG9ydHM9aX0se1wiLi9fZ2V0TmF0aXZlXCI6NjIsXCIuL19yb290XCI6OTB9XSw1OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbigpe312YXIgbz10KFwiLi9fbmF0aXZlQ3JlYXRlXCIpLGk9T2JqZWN0LnByb3RvdHlwZTtuLnByb3RvdHlwZT1vP28obnVsbCk6aSxlLmV4cG9ydHM9bn0se1wiLi9fbmF0aXZlQ3JlYXRlXCI6ODl9XSw2OltmdW5jdGlvbih0LGUscil7dmFyIG49dChcIi4vX2dldE5hdGl2ZVwiKSxvPXQoXCIuL19yb290XCIpLGk9bihvLFwiTWFwXCIpO2UuZXhwb3J0cz1pfSx7XCIuL19nZXROYXRpdmVcIjo2MixcIi4vX3Jvb3RcIjo5MH1dLDc6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3ZhciBlPS0xLHI9dD90Lmxlbmd0aDowO2Zvcih0aGlzLmNsZWFyKCk7KytlPHI7KXt2YXIgbj10W2VdO3RoaXMuc2V0KG5bMF0sblsxXSl9fXZhciBvPXQoXCIuL19tYXBDbGVhclwiKSxpPXQoXCIuL19tYXBEZWxldGVcIiksYT10KFwiLi9fbWFwR2V0XCIpLGM9dChcIi4vX21hcEhhc1wiKSxzPXQoXCIuL19tYXBTZXRcIik7bi5wcm90b3R5cGUuY2xlYXI9byxuLnByb3RvdHlwZVtcImRlbGV0ZVwiXT1pLG4ucHJvdG90eXBlLmdldD1hLG4ucHJvdG90eXBlLmhhcz1jLG4ucHJvdG90eXBlLnNldD1zLGUuZXhwb3J0cz1ufSx7XCIuL19tYXBDbGVhclwiOjgyLFwiLi9fbWFwRGVsZXRlXCI6ODMsXCIuL19tYXBHZXRcIjo4NCxcIi4vX21hcEhhc1wiOjg1LFwiLi9fbWFwU2V0XCI6ODZ9XSw4OltmdW5jdGlvbih0LGUscil7dmFyIG49dChcIi4vX2dldE5hdGl2ZVwiKSxvPXQoXCIuL19yb290XCIpLGk9bihvLFwiUHJvbWlzZVwiKTtlLmV4cG9ydHM9aX0se1wiLi9fZ2V0TmF0aXZlXCI6NjIsXCIuL19yb290XCI6OTB9XSw5OltmdW5jdGlvbih0LGUscil7dmFyIG49dChcIi4vX3Jvb3RcIiksbz1uLlJlZmxlY3Q7ZS5leHBvcnRzPW99LHtcIi4vX3Jvb3RcIjo5MH1dLDEwOltmdW5jdGlvbih0LGUscil7dmFyIG49dChcIi4vX2dldE5hdGl2ZVwiKSxvPXQoXCIuL19yb290XCIpLGk9bihvLFwiU2V0XCIpO2UuZXhwb3J0cz1pfSx7XCIuL19nZXROYXRpdmVcIjo2MixcIi4vX3Jvb3RcIjo5MH1dLDExOltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt2YXIgZT0tMSxyPXQ/dC5sZW5ndGg6MDtmb3IodGhpcy5jbGVhcigpOysrZTxyOyl7dmFyIG49dFtlXTt0aGlzLnNldChuWzBdLG5bMV0pfX12YXIgbz10KFwiLi9fc3RhY2tDbGVhclwiKSxpPXQoXCIuL19zdGFja0RlbGV0ZVwiKSxhPXQoXCIuL19zdGFja0dldFwiKSxjPXQoXCIuL19zdGFja0hhc1wiKSxzPXQoXCIuL19zdGFja1NldFwiKTtuLnByb3RvdHlwZS5jbGVhcj1vLG4ucHJvdG90eXBlW1wiZGVsZXRlXCJdPWksbi5wcm90b3R5cGUuZ2V0PWEsbi5wcm90b3R5cGUuaGFzPWMsbi5wcm90b3R5cGUuc2V0PXMsZS5leHBvcnRzPW59LHtcIi4vX3N0YWNrQ2xlYXJcIjo5MixcIi4vX3N0YWNrRGVsZXRlXCI6OTMsXCIuL19zdGFja0dldFwiOjk0LFwiLi9fc3RhY2tIYXNcIjo5NSxcIi4vX3N0YWNrU2V0XCI6OTZ9XSwxMjpbZnVuY3Rpb24odCxlLHIpe3ZhciBuPXQoXCIuL19yb290XCIpLG89bi5TeW1ib2w7ZS5leHBvcnRzPW99LHtcIi4vX3Jvb3RcIjo5MH1dLDEzOltmdW5jdGlvbih0LGUscil7dmFyIG49dChcIi4vX3Jvb3RcIiksbz1uLlVpbnQ4QXJyYXk7ZS5leHBvcnRzPW99LHtcIi4vX3Jvb3RcIjo5MH1dLDE0OltmdW5jdGlvbih0LGUscil7dmFyIG49dChcIi4vX2dldE5hdGl2ZVwiKSxvPXQoXCIuL19yb290XCIpLGk9bihvLFwiV2Vha01hcFwiKTtlLmV4cG9ydHM9aX0se1wiLi9fZ2V0TmF0aXZlXCI6NjIsXCIuL19yb290XCI6OTB9XSwxNTpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlKXtyZXR1cm4gdC5zZXQoZVswXSxlWzFdKSx0fWUuZXhwb3J0cz1ufSx7fV0sMTY6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSl7cmV0dXJuIHQuYWRkKGUpLHR9ZS5leHBvcnRzPW59LHt9XSwxNzpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlLHIpe3ZhciBuPXIubGVuZ3RoO3N3aXRjaChuKXtjYXNlIDA6cmV0dXJuIHQuY2FsbChlKTtjYXNlIDE6cmV0dXJuIHQuY2FsbChlLHJbMF0pO2Nhc2UgMjpyZXR1cm4gdC5jYWxsKGUsclswXSxyWzFdKTtjYXNlIDM6cmV0dXJuIHQuY2FsbChlLHJbMF0sclsxXSxyWzJdKX1yZXR1cm4gdC5hcHBseShlLHIpfWUuZXhwb3J0cz1ufSx7fV0sMTg6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSl7Zm9yKHZhciByPS0xLG49dC5sZW5ndGg7KytyPG4mJmUodFtyXSxyLHQpIT09ITE7KTtyZXR1cm4gdH1lLmV4cG9ydHM9bn0se31dLDE5OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe2Zvcih2YXIgcj0tMSxuPWUubGVuZ3RoLG89dC5sZW5ndGg7KytyPG47KXRbbytyXT1lW3JdO3JldHVybiB0fWUuZXhwb3J0cz1ufSx7fV0sMjA6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSxyLG4pe3ZhciBvPS0xLGk9dC5sZW5ndGg7Zm9yKG4mJmkmJihyPXRbKytvXSk7KytvPGk7KXI9ZShyLHRbb10sbyx0KTtyZXR1cm4gcn1lLmV4cG9ydHM9bn0se31dLDIxOltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUscil7KHZvaWQgMD09PXJ8fG8odFtlXSxyKSkmJihcIm51bWJlclwiIT10eXBlb2YgZXx8dm9pZCAwIT09cnx8ZSBpbiB0KXx8KHRbZV09cil9dmFyIG89dChcIi4vZXFcIik7ZS5leHBvcnRzPW59LHtcIi4vZXFcIjoxMDN9XSwyMjpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlLHIpe3ZhciBuPXRbZV07YS5jYWxsKHQsZSkmJm8obixyKSYmKHZvaWQgMCE9PXJ8fGUgaW4gdCl8fCh0W2VdPXIpfXZhciBvPXQoXCIuL2VxXCIpLGk9T2JqZWN0LnByb3RvdHlwZSxhPWkuaGFzT3duUHJvcGVydHk7ZS5leHBvcnRzPW59LHtcIi4vZXFcIjoxMDN9XSwyMzpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlKXt2YXIgcj1vKHQsZSk7aWYoMD5yKXJldHVybiExO3ZhciBuPXQubGVuZ3RoLTE7cmV0dXJuIHI9PW4/dC5wb3AoKTphLmNhbGwodCxyLDEpLCEwfXZhciBvPXQoXCIuL19hc3NvY0luZGV4T2ZcIiksaT1BcnJheS5wcm90b3R5cGUsYT1pLnNwbGljZTtlLmV4cG9ydHM9bn0se1wiLi9fYXNzb2NJbmRleE9mXCI6MjZ9XSwyNDpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlKXt2YXIgcj1vKHQsZSk7cmV0dXJuIDA+cj92b2lkIDA6dFtyXVsxXX12YXIgbz10KFwiLi9fYXNzb2NJbmRleE9mXCIpO2UuZXhwb3J0cz1ufSx7XCIuL19hc3NvY0luZGV4T2ZcIjoyNn1dLDI1OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe3JldHVybiBvKHQsZSk+LTF9dmFyIG89dChcIi4vX2Fzc29jSW5kZXhPZlwiKTtlLmV4cG9ydHM9bn0se1wiLi9fYXNzb2NJbmRleE9mXCI6MjZ9XSwyNjpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlKXtmb3IodmFyIHI9dC5sZW5ndGg7ci0tOylpZihvKHRbcl1bMF0sZSkpcmV0dXJuIHI7cmV0dXJuLTF9dmFyIG89dChcIi4vZXFcIik7ZS5leHBvcnRzPW59LHtcIi4vZXFcIjoxMDN9XSwyNzpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlLHIpe3ZhciBuPW8odCxlKTswPm4/dC5wdXNoKFtlLHJdKTp0W25dWzFdPXJ9dmFyIG89dChcIi4vX2Fzc29jSW5kZXhPZlwiKTtlLmV4cG9ydHM9bn0se1wiLi9fYXNzb2NJbmRleE9mXCI6MjZ9XSwyODpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlKXtyZXR1cm4gdCYmbyhlLGkoZSksdCl9dmFyIG89dChcIi4vX2NvcHlPYmplY3RcIiksaT10KFwiLi9rZXlzXCIpO2UuZXhwb3J0cz1ufSx7XCIuL19jb3B5T2JqZWN0XCI6NTcsXCIuL2tleXNcIjoxMTl9XSwyOTpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlLHIsbSxPLEEsUyl7dmFyIFA7aWYobSYmKFA9QT9tKHQsTyxBLFMpOm0odCkpLHZvaWQgMCE9PVApcmV0dXJuIFA7aWYoIWQodCkpcmV0dXJuIHQ7dmFyIEk9Yih0KTtpZihJKXtpZihQPV8odCksIWUpcmV0dXJuIHUodCxQKX1lbHNle3ZhciBDPWwodCksVD1DPT13fHxDPT1rO2lmKGcodCkpcmV0dXJuIHModCxlKTtpZihDPT1NfHxDPT14fHxUJiYhQSl7aWYoaCh0KSlyZXR1cm4gQT90Ont9O2lmKFA9dihUP3t9OnQpLCFlKXJldHVybiBmKHQsYyhQLHQpKX1lbHNle2lmKCFXW0NdKXJldHVybiBBP3Q6e307UD15KHQsQyxuLGUpfX1TfHwoUz1uZXcgbyk7dmFyIEU9Uy5nZXQodCk7aWYoRSlyZXR1cm4gRTtpZihTLnNldCh0LFApLCFJKXZhciBMPXI/cCh0KTpqKHQpO3JldHVybiBpKEx8fHQsZnVuY3Rpb24obyxpKXtMJiYoaT1vLG89dFtpXSksYShQLGksbihvLGUscixtLGksdCxTKSl9KSxQfXZhciBvPXQoXCIuL19TdGFja1wiKSxpPXQoXCIuL19hcnJheUVhY2hcIiksYT10KFwiLi9fYXNzaWduVmFsdWVcIiksYz10KFwiLi9fYmFzZUFzc2lnblwiKSxzPXQoXCIuL19jbG9uZUJ1ZmZlclwiKSx1PXQoXCIuL19jb3B5QXJyYXlcIiksZj10KFwiLi9fY29weVN5bWJvbHNcIikscD10KFwiLi9fZ2V0QWxsS2V5c1wiKSxsPXQoXCIuL19nZXRUYWdcIiksXz10KFwiLi9faW5pdENsb25lQXJyYXlcIikseT10KFwiLi9faW5pdENsb25lQnlUYWdcIiksdj10KFwiLi9faW5pdENsb25lT2JqZWN0XCIpLGI9dChcIi4vaXNBcnJheVwiKSxnPXQoXCIuL2lzQnVmZmVyXCIpLGg9dChcIi4vX2lzSG9zdE9iamVjdFwiKSxkPXQoXCIuL2lzT2JqZWN0XCIpLGo9dChcIi4va2V5c1wiKSx4PVwiW29iamVjdCBBcmd1bWVudHNdXCIsbT1cIltvYmplY3QgQXJyYXldXCIsTz1cIltvYmplY3QgQm9vbGVhbl1cIixBPVwiW29iamVjdCBEYXRlXVwiLFM9XCJbb2JqZWN0IEVycm9yXVwiLHc9XCJbb2JqZWN0IEZ1bmN0aW9uXVwiLGs9XCJbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXVwiLFA9XCJbb2JqZWN0IE1hcF1cIixJPVwiW29iamVjdCBOdW1iZXJdXCIsTT1cIltvYmplY3QgT2JqZWN0XVwiLEM9XCJbb2JqZWN0IFJlZ0V4cF1cIixUPVwiW29iamVjdCBTZXRdXCIsRT1cIltvYmplY3QgU3RyaW5nXVwiLEw9XCJbb2JqZWN0IFN5bWJvbF1cIixGPVwiW29iamVjdCBXZWFrTWFwXVwiLEQ9XCJbb2JqZWN0IEFycmF5QnVmZmVyXVwiLEs9XCJbb2JqZWN0IERhdGFWaWV3XVwiLE49XCJbb2JqZWN0IEZsb2F0MzJBcnJheV1cIixIPVwiW29iamVjdCBGbG9hdDY0QXJyYXldXCIsQj1cIltvYmplY3QgSW50OEFycmF5XVwiLFY9XCJbb2JqZWN0IEludDE2QXJyYXldXCIsRz1cIltvYmplY3QgSW50MzJBcnJheV1cIixVPVwiW29iamVjdCBVaW50OEFycmF5XVwiLCQ9XCJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XVwiLFI9XCJbb2JqZWN0IFVpbnQxNkFycmF5XVwiLHE9XCJbb2JqZWN0IFVpbnQzMkFycmF5XVwiLFc9e307V1t4XT1XW21dPVdbRF09V1tLXT1XW09dPVdbQV09V1tOXT1XW0hdPVdbQl09V1tWXT1XW0ddPVdbUF09V1tJXT1XW01dPVdbQ109V1tUXT1XW0VdPVdbTF09V1tVXT1XWyRdPVdbUl09V1txXT0hMCxXW1NdPVdbd109V1tGXT0hMSxlLmV4cG9ydHM9bn0se1wiLi9fU3RhY2tcIjoxMSxcIi4vX2FycmF5RWFjaFwiOjE4LFwiLi9fYXNzaWduVmFsdWVcIjoyMixcIi4vX2Jhc2VBc3NpZ25cIjoyOCxcIi4vX2Nsb25lQnVmZmVyXCI6NDksXCIuL19jb3B5QXJyYXlcIjo1NixcIi4vX2NvcHlTeW1ib2xzXCI6NTgsXCIuL19nZXRBbGxLZXlzXCI6NjAsXCIuL19nZXRUYWdcIjo2NSxcIi4vX2luaXRDbG9uZUFycmF5XCI6NzIsXCIuL19pbml0Q2xvbmVCeVRhZ1wiOjczLFwiLi9faW5pdENsb25lT2JqZWN0XCI6NzQsXCIuL19pc0hvc3RPYmplY3RcIjo3NSxcIi4vaXNBcnJheVwiOjEwNixcIi4vaXNCdWZmZXJcIjoxMDksXCIuL2lzT2JqZWN0XCI6MTEzLFwiLi9rZXlzXCI6MTE5fV0sMzA6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3JldHVybiBvKHQpP2kodCk6e319dmFyIG89dChcIi4vaXNPYmplY3RcIiksaT1PYmplY3QuY3JlYXRlO2UuZXhwb3J0cz1ufSx7XCIuL2lzT2JqZWN0XCI6MTEzfV0sMzE6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSl7ZT1pKGUsdCk/W2VdOm8oZSk7Zm9yKHZhciByPTAsbj1lLmxlbmd0aDtudWxsIT10JiZuPnI7KXQ9dFthKGVbcisrXSldO3JldHVybiByJiZyPT1uP3Q6dm9pZCAwfXZhciBvPXQoXCIuL19jYXN0UGF0aFwiKSxpPXQoXCIuL19pc0tleVwiKSxhPXQoXCIuL190b0tleVwiKTtlLmV4cG9ydHM9bn0se1wiLi9fY2FzdFBhdGhcIjo0NCxcIi4vX2lzS2V5XCI6NzgsXCIuL190b0tleVwiOjk5fV0sMzI6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSxyKXt2YXIgbj1lKHQpO3JldHVybiBpKHQpP246byhuLHIodCkpfXZhciBvPXQoXCIuL19hcnJheVB1c2hcIiksaT10KFwiLi9pc0FycmF5XCIpO2UuZXhwb3J0cz1ufSx7XCIuL19hcnJheVB1c2hcIjoxOSxcIi4vaXNBcnJheVwiOjEwNn1dLDMzOltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe3JldHVybiBhLmNhbGwodCxlKXx8XCJvYmplY3RcIj09dHlwZW9mIHQmJmUgaW4gdCYmbnVsbD09PW8odCl9dmFyIG89dChcIi4vX2dldFByb3RvdHlwZVwiKSxpPU9iamVjdC5wcm90b3R5cGUsYT1pLmhhc093blByb3BlcnR5O2UuZXhwb3J0cz1ufSx7XCIuL19nZXRQcm90b3R5cGVcIjo2M31dLDM0OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUscil7aWYoZSE9PWUpcmV0dXJuIG8odCxyKTtmb3IodmFyIG49ci0xLGk9dC5sZW5ndGg7KytuPGk7KWlmKHRbbl09PT1lKXJldHVybiBuO3JldHVybi0xfXZhciBvPXQoXCIuL19pbmRleE9mTmFOXCIpO2UuZXhwb3J0cz1ufSx7XCIuL19pbmRleE9mTmFOXCI6NzF9XSwzNTpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7cmV0dXJuIG8oT2JqZWN0KHQpKX12YXIgbz1PYmplY3Qua2V5cztlLmV4cG9ydHM9bn0se31dLDM2OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt0PW51bGw9PXQ/dDpPYmplY3QodCk7dmFyIGU9W107Zm9yKHZhciByIGluIHQpZS5wdXNoKHIpO3JldHVybiBlfXZhciBvPXQoXCIuL19SZWZsZWN0XCIpLGk9dChcIi4vX2l0ZXJhdG9yVG9BcnJheVwiKSxhPU9iamVjdC5wcm90b3R5cGUsYz1vP28uZW51bWVyYXRlOnZvaWQgMCxzPWEucHJvcGVydHlJc0VudW1lcmFibGU7YyYmIXMuY2FsbCh7dmFsdWVPZjoxfSxcInZhbHVlT2ZcIikmJihuPWZ1bmN0aW9uKHQpe3JldHVybiBpKGModCkpfSksZS5leHBvcnRzPW59LHtcIi4vX1JlZmxlY3RcIjo5LFwiLi9faXRlcmF0b3JUb0FycmF5XCI6ODF9XSwzNzpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlLHIsbCxfKXtpZih0IT09ZSl7aWYoIXMoZSkmJiFmKGUpKXZhciB5PXAoZSk7aSh5fHxlLGZ1bmN0aW9uKGkscyl7aWYoeSYmKHM9aSxpPWVbc10pLHUoaSkpX3x8KF89bmV3IG8pLGModCxlLHMscixuLGwsXyk7ZWxzZXt2YXIgZj1sP2wodFtzXSxpLHMrXCJcIix0LGUsXyk6dm9pZCAwO3ZvaWQgMD09PWYmJihmPWkpLGEodCxzLGYpfX0pfX12YXIgbz10KFwiLi9fU3RhY2tcIiksaT10KFwiLi9fYXJyYXlFYWNoXCIpLGE9dChcIi4vX2Fzc2lnbk1lcmdlVmFsdWVcIiksYz10KFwiLi9fYmFzZU1lcmdlRGVlcFwiKSxzPXQoXCIuL2lzQXJyYXlcIiksdT10KFwiLi9pc09iamVjdFwiKSxmPXQoXCIuL2lzVHlwZWRBcnJheVwiKSxwPXQoXCIuL2tleXNJblwiKTtlLmV4cG9ydHM9bn0se1wiLi9fU3RhY2tcIjoxMSxcIi4vX2FycmF5RWFjaFwiOjE4LFwiLi9fYXNzaWduTWVyZ2VWYWx1ZVwiOjIxLFwiLi9fYmFzZU1lcmdlRGVlcFwiOjM4LFwiLi9pc0FycmF5XCI6MTA2LFwiLi9pc09iamVjdFwiOjExMyxcIi4vaXNUeXBlZEFycmF5XCI6MTE4LFwiLi9rZXlzSW5cIjoxMjB9XSwzODpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlLHIsbix2LGIsZyl7dmFyIGg9dFtyXSxkPWVbcl0saj1nLmdldChkKTtpZihqKXJldHVybiB2b2lkIG8odCxyLGopO3ZhciB4PWI/YihoLGQscitcIlwiLHQsZSxnKTp2b2lkIDAsbT12b2lkIDA9PT14O20mJih4PWQscyhkKXx8XyhkKT9zKGgpP3g9aDp1KGgpP3g9YShoKToobT0hMSx4PWkoZCwhMCkpOmwoZCl8fGMoZCk/YyhoKT94PXkoaCk6IXAoaCl8fG4mJmYoaCk/KG09ITEseD1pKGQsITApKTp4PWg6bT0hMSksZy5zZXQoZCx4KSxtJiZ2KHgsZCxuLGIsZyksZ1tcImRlbGV0ZVwiXShkKSxvKHQscix4KX12YXIgbz10KFwiLi9fYXNzaWduTWVyZ2VWYWx1ZVwiKSxpPXQoXCIuL19iYXNlQ2xvbmVcIiksYT10KFwiLi9fY29weUFycmF5XCIpLGM9dChcIi4vaXNBcmd1bWVudHNcIikscz10KFwiLi9pc0FycmF5XCIpLHU9dChcIi4vaXNBcnJheUxpa2VPYmplY3RcIiksZj10KFwiLi9pc0Z1bmN0aW9uXCIpLHA9dChcIi4vaXNPYmplY3RcIiksbD10KFwiLi9pc1BsYWluT2JqZWN0XCIpLF89dChcIi4vaXNUeXBlZEFycmF5XCIpLHk9dChcIi4vdG9QbGFpbk9iamVjdFwiKTtlLmV4cG9ydHM9bn0se1wiLi9fYXNzaWduTWVyZ2VWYWx1ZVwiOjIxLFwiLi9fYmFzZUNsb25lXCI6MjksXCIuL19jb3B5QXJyYXlcIjo1NixcIi4vaXNBcmd1bWVudHNcIjoxMDUsXCIuL2lzQXJyYXlcIjoxMDYsXCIuL2lzQXJyYXlMaWtlT2JqZWN0XCI6MTA4LFwiLi9pc0Z1bmN0aW9uXCI6MTEwLFwiLi9pc09iamVjdFwiOjExMyxcIi4vaXNQbGFpbk9iamVjdFwiOjExNSxcIi4vaXNUeXBlZEFycmF5XCI6MTE4LFwiLi90b1BsYWluT2JqZWN0XCI6MTI3fV0sMzk6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3JldHVybiBmdW5jdGlvbihlKXtyZXR1cm4gbnVsbD09ZT92b2lkIDA6ZVt0XX19ZS5leHBvcnRzPW59LHt9XSw0MDpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlLHIsbil7ZT1jKGUsdCk/W2VdOmkoZSk7Zm9yKHZhciBmPS0xLHA9ZS5sZW5ndGgsbD1wLTEsXz10O251bGwhPV8mJisrZjxwOyl7dmFyIHk9dShlW2ZdKTtpZihzKF8pKXt2YXIgdj1yO2lmKGYhPWwpe3ZhciBiPV9beV07dj1uP24oYix5LF8pOnZvaWQgMCx2b2lkIDA9PT12JiYodj1udWxsPT1iP2EoZVtmKzFdKT9bXTp7fTpiKX1vKF8seSx2KX1fPV9beV19cmV0dXJuIHR9dmFyIG89dChcIi4vX2Fzc2lnblZhbHVlXCIpLGk9dChcIi4vX2Nhc3RQYXRoXCIpLGE9dChcIi4vX2lzSW5kZXhcIiksYz10KFwiLi9faXNLZXlcIikscz10KFwiLi9pc09iamVjdFwiKSx1PXQoXCIuL190b0tleVwiKTtlLmV4cG9ydHM9bn0se1wiLi9fYXNzaWduVmFsdWVcIjoyMixcIi4vX2Nhc3RQYXRoXCI6NDQsXCIuL19pc0luZGV4XCI6NzYsXCIuL19pc0tleVwiOjc4LFwiLi9fdG9LZXlcIjo5OSxcIi4vaXNPYmplY3RcIjoxMTN9XSw0MTpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlLHIpe3ZhciBuPS0xLG89dC5sZW5ndGg7MD5lJiYoZT0tZT5vPzA6bytlKSxyPXI+bz9vOnIsMD5yJiYocis9byksbz1lPnI/MDpyLWU+Pj4wLGU+Pj49MDtmb3IodmFyIGk9QXJyYXkobyk7KytuPG87KWlbbl09dFtuK2VdO3JldHVybiBpfWUuZXhwb3J0cz1ufSx7fV0sNDI6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSl7Zm9yKHZhciByPS0xLG49QXJyYXkodCk7KytyPHQ7KW5bcl09ZShyKTtyZXR1cm4gbn1lLmV4cG9ydHM9bn0se31dLDQzOltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXtpZihcInN0cmluZ1wiPT10eXBlb2YgdClyZXR1cm4gdDtpZihpKHQpKXJldHVybiBzP3MuY2FsbCh0KTpcIlwiO3ZhciBlPXQrXCJcIjtyZXR1cm5cIjBcIj09ZSYmMS90PT0tYT9cIi0wXCI6ZX12YXIgbz10KFwiLi9fU3ltYm9sXCIpLGk9dChcIi4vaXNTeW1ib2xcIiksYT0xLzAsYz1vP28ucHJvdG90eXBlOnZvaWQgMCxzPWM/Yy50b1N0cmluZzp2b2lkIDA7ZS5leHBvcnRzPW59LHtcIi4vX1N5bWJvbFwiOjEyLFwiLi9pc1N5bWJvbFwiOjExN31dLDQ0OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXtyZXR1cm4gbyh0KT90OmkodCl9dmFyIG89dChcIi4vaXNBcnJheVwiKSxpPXQoXCIuL19zdHJpbmdUb1BhdGhcIik7ZS5leHBvcnRzPW59LHtcIi4vX3N0cmluZ1RvUGF0aFwiOjk4LFwiLi9pc0FycmF5XCI6MTA2fV0sNDU6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSxyKXt2YXIgbj10Lmxlbmd0aDtyZXR1cm4gcj12b2lkIDA9PT1yP246ciwhZSYmcj49bj90Om8odCxlLHIpfXZhciBvPXQoXCIuL19iYXNlU2xpY2VcIik7ZS5leHBvcnRzPW59LHtcIi4vX2Jhc2VTbGljZVwiOjQxfV0sNDY6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSl7Zm9yKHZhciByPXQubGVuZ3RoO3ItLSYmbyhlLHRbcl0sMCk+LTE7KTtyZXR1cm4gcn12YXIgbz10KFwiLi9fYmFzZUluZGV4T2ZcIik7ZS5leHBvcnRzPW59LHtcIi4vX2Jhc2VJbmRleE9mXCI6MzR9XSw0NzpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7cmV0dXJuIHQmJnQuT2JqZWN0PT09T2JqZWN0P3Q6bnVsbH1lLmV4cG9ydHM9bn0se31dLDQ4OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt2YXIgZT1uZXcgdC5jb25zdHJ1Y3Rvcih0LmJ5dGVMZW5ndGgpO3JldHVybiBuZXcgbyhlKS5zZXQobmV3IG8odCkpLGV9dmFyIG89dChcIi4vX1VpbnQ4QXJyYXlcIik7ZS5leHBvcnRzPW59LHtcIi4vX1VpbnQ4QXJyYXlcIjoxM31dLDQ5OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe2lmKGUpcmV0dXJuIHQuc2xpY2UoKTt2YXIgcj1uZXcgdC5jb25zdHJ1Y3Rvcih0Lmxlbmd0aCk7cmV0dXJuIHQuY29weShyKSxyfWUuZXhwb3J0cz1ufSx7fV0sNTA6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSl7dmFyIHI9ZT9vKHQuYnVmZmVyKTp0LmJ1ZmZlcjtyZXR1cm4gbmV3IHQuY29uc3RydWN0b3Iocix0LmJ5dGVPZmZzZXQsdC5ieXRlTGVuZ3RoKX12YXIgbz10KFwiLi9fY2xvbmVBcnJheUJ1ZmZlclwiKTtlLmV4cG9ydHM9bn0se1wiLi9fY2xvbmVBcnJheUJ1ZmZlclwiOjQ4fV0sNTE6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSxyKXt2YXIgbj1lP3IoYSh0KSwhMCk6YSh0KTtyZXR1cm4gaShuLG8sbmV3IHQuY29uc3RydWN0b3IpfXZhciBvPXQoXCIuL19hZGRNYXBFbnRyeVwiKSxpPXQoXCIuL19hcnJheVJlZHVjZVwiKSxhPXQoXCIuL19tYXBUb0FycmF5XCIpO2UuZXhwb3J0cz1ufSx7XCIuL19hZGRNYXBFbnRyeVwiOjE1LFwiLi9fYXJyYXlSZWR1Y2VcIjoyMCxcIi4vX21hcFRvQXJyYXlcIjo4N31dLDUyOltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt2YXIgZT1uZXcgdC5jb25zdHJ1Y3Rvcih0LnNvdXJjZSxvLmV4ZWModCkpO3JldHVybiBlLmxhc3RJbmRleD10Lmxhc3RJbmRleCxlfXZhciBvPS9cXHcqJC87ZS5leHBvcnRzPW59LHt9XSw1MzpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlLHIpe3ZhciBuPWU/cihhKHQpLCEwKTphKHQpO3JldHVybiBpKG4sbyxuZXcgdC5jb25zdHJ1Y3Rvcil9dmFyIG89dChcIi4vX2FkZFNldEVudHJ5XCIpLGk9dChcIi4vX2FycmF5UmVkdWNlXCIpLGE9dChcIi4vX3NldFRvQXJyYXlcIik7ZS5leHBvcnRzPW59LHtcIi4vX2FkZFNldEVudHJ5XCI6MTYsXCIuL19hcnJheVJlZHVjZVwiOjIwLFwiLi9fc2V0VG9BcnJheVwiOjkxfV0sNTQ6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3JldHVybiBhP09iamVjdChhLmNhbGwodCkpOnt9fXZhciBvPXQoXCIuL19TeW1ib2xcIiksaT1vP28ucHJvdG90eXBlOnZvaWQgMCxhPWk/aS52YWx1ZU9mOnZvaWQgMDtlLmV4cG9ydHM9bn0se1wiLi9fU3ltYm9sXCI6MTJ9XSw1NTpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlKXt2YXIgcj1lP28odC5idWZmZXIpOnQuYnVmZmVyO3JldHVybiBuZXcgdC5jb25zdHJ1Y3RvcihyLHQuYnl0ZU9mZnNldCx0Lmxlbmd0aCl9dmFyIG89dChcIi4vX2Nsb25lQXJyYXlCdWZmZXJcIik7ZS5leHBvcnRzPW59LHtcIi4vX2Nsb25lQXJyYXlCdWZmZXJcIjo0OH1dLDU2OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe3ZhciByPS0xLG49dC5sZW5ndGg7Zm9yKGV8fChlPUFycmF5KG4pKTsrK3I8bjspZVtyXT10W3JdO3JldHVybiBlfWUuZXhwb3J0cz1ufSx7fV0sNTc6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSxyLG4pe3J8fChyPXt9KTtmb3IodmFyIGk9LTEsYT1lLmxlbmd0aDsrK2k8YTspe3ZhciBjPWVbaV0scz1uP24ocltjXSx0W2NdLGMscix0KTp0W2NdO28ocixjLHMpfXJldHVybiByfXZhciBvPXQoXCIuL19hc3NpZ25WYWx1ZVwiKTtlLmV4cG9ydHM9bn0se1wiLi9fYXNzaWduVmFsdWVcIjoyMn1dLDU4OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe3JldHVybiBvKHQsaSh0KSxlKX12YXIgbz10KFwiLi9fY29weU9iamVjdFwiKSxpPXQoXCIuL19nZXRTeW1ib2xzXCIpO2UuZXhwb3J0cz1ufSx7XCIuL19jb3B5T2JqZWN0XCI6NTcsXCIuL19nZXRTeW1ib2xzXCI6NjR9XSw1OTpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7cmV0dXJuIGkoZnVuY3Rpb24oZSxyKXt2YXIgbj0tMSxpPXIubGVuZ3RoLGE9aT4xP3JbaS0xXTp2b2lkIDAsYz1pPjI/clsyXTp2b2lkIDA7Zm9yKGE9XCJmdW5jdGlvblwiPT10eXBlb2YgYT8oaS0tLGEpOnZvaWQgMCxjJiZvKHJbMF0sclsxXSxjKSYmKGE9Mz5pP3ZvaWQgMDphLGk9MSksZT1PYmplY3QoZSk7KytuPGk7KXt2YXIgcz1yW25dO3MmJnQoZSxzLG4sYSl9cmV0dXJuIGV9KX12YXIgbz10KFwiLi9faXNJdGVyYXRlZUNhbGxcIiksaT10KFwiLi9yZXN0XCIpO2UuZXhwb3J0cz1ufSx7XCIuL19pc0l0ZXJhdGVlQ2FsbFwiOjc3LFwiLi9yZXN0XCI6MTIzfV0sNjA6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3JldHVybiBvKHQsYSxpKX12YXIgbz10KFwiLi9fYmFzZUdldEFsbEtleXNcIiksaT10KFwiLi9fZ2V0U3ltYm9sc1wiKSxhPXQoXCIuL2tleXNcIik7ZS5leHBvcnRzPW59LHtcIi4vX2Jhc2VHZXRBbGxLZXlzXCI6MzIsXCIuL19nZXRTeW1ib2xzXCI6NjQsXCIuL2tleXNcIjoxMTl9XSw2MTpbZnVuY3Rpb24odCxlLHIpe3ZhciBuPXQoXCIuL19iYXNlUHJvcGVydHlcIiksbz1uKFwibGVuZ3RoXCIpO2UuZXhwb3J0cz1vfSx7XCIuL19iYXNlUHJvcGVydHlcIjozOX1dLDYyOltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe3ZhciByPXRbZV07cmV0dXJuIG8ocik/cjp2b2lkIDB9dmFyIG89dChcIi4vaXNOYXRpdmVcIik7ZS5leHBvcnRzPW59LHtcIi4vaXNOYXRpdmVcIjoxMTJ9XSw2MzpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7cmV0dXJuIG8oT2JqZWN0KHQpKX12YXIgbz1PYmplY3QuZ2V0UHJvdG90eXBlT2Y7ZS5leHBvcnRzPW59LHt9XSw2NDpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7cmV0dXJuIG8oT2JqZWN0KHQpKX12YXIgbz1PYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO298fChuPWZ1bmN0aW9uKCl7cmV0dXJuW119KSxlLmV4cG9ydHM9bn0se31dLDY1OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXtyZXR1cm4gZy5jYWxsKHQpfXZhciBvPXQoXCIuL19EYXRhVmlld1wiKSxpPXQoXCIuL19NYXBcIiksYT10KFwiLi9fUHJvbWlzZVwiKSxjPXQoXCIuL19TZXRcIikscz10KFwiLi9fV2Vha01hcFwiKSx1PXQoXCIuL190b1NvdXJjZVwiKSxmPVwiW29iamVjdCBNYXBdXCIscD1cIltvYmplY3QgT2JqZWN0XVwiLGw9XCJbb2JqZWN0IFByb21pc2VdXCIsXz1cIltvYmplY3QgU2V0XVwiLHk9XCJbb2JqZWN0IFdlYWtNYXBdXCIsdj1cIltvYmplY3QgRGF0YVZpZXddXCIsYj1PYmplY3QucHJvdG90eXBlLGc9Yi50b1N0cmluZyxoPXUobyksZD11KGkpLGo9dShhKSx4PXUoYyksbT11KHMpOyhvJiZuKG5ldyBvKG5ldyBBcnJheUJ1ZmZlcigxKSkpIT12fHxpJiZuKG5ldyBpKSE9Znx8YSYmbihhLnJlc29sdmUoKSkhPWx8fGMmJm4obmV3IGMpIT1ffHxzJiZuKG5ldyBzKSE9eSkmJihuPWZ1bmN0aW9uKHQpe3ZhciBlPWcuY2FsbCh0KSxyPWU9PXA/dC5jb25zdHJ1Y3Rvcjp2b2lkIDAsbj1yP3Uocik6dm9pZCAwO2lmKG4pc3dpdGNoKG4pe2Nhc2UgaDpyZXR1cm4gdjtjYXNlIGQ6cmV0dXJuIGY7Y2FzZSBqOnJldHVybiBsO2Nhc2UgeDpyZXR1cm4gXztjYXNlIG06cmV0dXJuIHl9cmV0dXJuIGV9KSxlLmV4cG9ydHM9bn0se1wiLi9fRGF0YVZpZXdcIjo0LFwiLi9fTWFwXCI6NixcIi4vX1Byb21pc2VcIjo4LFwiLi9fU2V0XCI6MTAsXCIuL19XZWFrTWFwXCI6MTQsXCIuL190b1NvdXJjZVwiOjEwMH1dLDY2OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe3JldHVybiBvKHQsZSkmJmRlbGV0ZSB0W2VdfXZhciBvPXQoXCIuL19oYXNoSGFzXCIpO2UuZXhwb3J0cz1ufSx7XCIuL19oYXNoSGFzXCI6Njh9XSw2NzpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlKXtpZihvKXt2YXIgcj10W2VdO3JldHVybiByPT09aT92b2lkIDA6cn1yZXR1cm4gYy5jYWxsKHQsZSk/dFtlXTp2b2lkIDB9dmFyIG89dChcIi4vX25hdGl2ZUNyZWF0ZVwiKSxpPVwiX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfX1wiLGE9T2JqZWN0LnByb3RvdHlwZSxjPWEuaGFzT3duUHJvcGVydHk7ZS5leHBvcnRzPW59LHtcIi4vX25hdGl2ZUNyZWF0ZVwiOjg5fV0sNjg6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSl7cmV0dXJuIG8/dm9pZCAwIT09dFtlXTphLmNhbGwodCxlKX12YXIgbz10KFwiLi9fbmF0aXZlQ3JlYXRlXCIpLGk9T2JqZWN0LnByb3RvdHlwZSxhPWkuaGFzT3duUHJvcGVydHk7ZS5leHBvcnRzPW59LHtcIi4vX25hdGl2ZUNyZWF0ZVwiOjg5fV0sNjk6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSxyKXt0W2VdPW8mJnZvaWQgMD09PXI/aTpyfXZhciBvPXQoXCIuL19uYXRpdmVDcmVhdGVcIiksaT1cIl9fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX19cIjtlLmV4cG9ydHM9bn0se1wiLi9fbmF0aXZlQ3JlYXRlXCI6ODl9XSw3MDpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7dmFyIGU9dD90Lmxlbmd0aDp2b2lkIDA7cmV0dXJuIGMoZSkmJihhKHQpfHxzKHQpfHxpKHQpKT9vKGUsU3RyaW5nKTpudWxsfXZhciBvPXQoXCIuL19iYXNlVGltZXNcIiksaT10KFwiLi9pc0FyZ3VtZW50c1wiKSxhPXQoXCIuL2lzQXJyYXlcIiksYz10KFwiLi9pc0xlbmd0aFwiKSxzPXQoXCIuL2lzU3RyaW5nXCIpO2UuZXhwb3J0cz1ufSx7XCIuL19iYXNlVGltZXNcIjo0MixcIi4vaXNBcmd1bWVudHNcIjoxMDUsXCIuL2lzQXJyYXlcIjoxMDYsXCIuL2lzTGVuZ3RoXCI6MTExLFwiLi9pc1N0cmluZ1wiOjExNn1dLDcxOltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUscil7Zm9yKHZhciBuPXQubGVuZ3RoLG89ZSsocj8wOi0xKTtyP28tLTorK288bjspe3ZhciBpPXRbb107aWYoaSE9PWkpcmV0dXJuIG99cmV0dXJuLTF9ZS5leHBvcnRzPW59LHt9XSw3MjpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7dmFyIGU9dC5sZW5ndGgscj10LmNvbnN0cnVjdG9yKGUpO3JldHVybiBlJiZcInN0cmluZ1wiPT10eXBlb2YgdFswXSYmaS5jYWxsKHQsXCJpbmRleFwiKSYmKHIuaW5kZXg9dC5pbmRleCxyLmlucHV0PXQuaW5wdXQpLHJ9dmFyIG89T2JqZWN0LnByb3RvdHlwZSxpPW8uaGFzT3duUHJvcGVydHk7ZS5leHBvcnRzPW59LHt9XSw3MzpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlLHIsbil7dmFyIE09dC5jb25zdHJ1Y3Rvcjtzd2l0Y2goZSl7Y2FzZSBkOnJldHVybiBvKHQpO2Nhc2UgcDpjYXNlIGw6cmV0dXJuIG5ldyBNKCt0KTtjYXNlIGo6cmV0dXJuIGkodCxuKTtjYXNlIHg6Y2FzZSBtOmNhc2UgTzpjYXNlIEE6Y2FzZSBTOmNhc2UgdzpjYXNlIGs6Y2FzZSBQOmNhc2UgSTpyZXR1cm4gZih0LG4pO2Nhc2UgXzpyZXR1cm4gYSh0LG4scik7Y2FzZSB5OmNhc2UgZzpyZXR1cm4gbmV3IE0odCk7Y2FzZSB2OnJldHVybiBjKHQpO2Nhc2UgYjpyZXR1cm4gcyh0LG4scik7Y2FzZSBoOnJldHVybiB1KHQpfX12YXIgbz10KFwiLi9fY2xvbmVBcnJheUJ1ZmZlclwiKSxpPXQoXCIuL19jbG9uZURhdGFWaWV3XCIpLGE9dChcIi4vX2Nsb25lTWFwXCIpLGM9dChcIi4vX2Nsb25lUmVnRXhwXCIpLHM9dChcIi4vX2Nsb25lU2V0XCIpLHU9dChcIi4vX2Nsb25lU3ltYm9sXCIpLGY9dChcIi4vX2Nsb25lVHlwZWRBcnJheVwiKSxwPVwiW29iamVjdCBCb29sZWFuXVwiLGw9XCJbb2JqZWN0IERhdGVdXCIsXz1cIltvYmplY3QgTWFwXVwiLHk9XCJbb2JqZWN0IE51bWJlcl1cIix2PVwiW29iamVjdCBSZWdFeHBdXCIsYj1cIltvYmplY3QgU2V0XVwiLGc9XCJbb2JqZWN0IFN0cmluZ11cIixoPVwiW29iamVjdCBTeW1ib2xdXCIsZD1cIltvYmplY3QgQXJyYXlCdWZmZXJdXCIsaj1cIltvYmplY3QgRGF0YVZpZXddXCIseD1cIltvYmplY3QgRmxvYXQzMkFycmF5XVwiLG09XCJbb2JqZWN0IEZsb2F0NjRBcnJheV1cIixPPVwiW29iamVjdCBJbnQ4QXJyYXldXCIsQT1cIltvYmplY3QgSW50MTZBcnJheV1cIixTPVwiW29iamVjdCBJbnQzMkFycmF5XVwiLHc9XCJbb2JqZWN0IFVpbnQ4QXJyYXldXCIsaz1cIltvYmplY3QgVWludDhDbGFtcGVkQXJyYXldXCIsUD1cIltvYmplY3QgVWludDE2QXJyYXldXCIsST1cIltvYmplY3QgVWludDMyQXJyYXldXCI7ZS5leHBvcnRzPW59LHtcIi4vX2Nsb25lQXJyYXlCdWZmZXJcIjo0OCxcIi4vX2Nsb25lRGF0YVZpZXdcIjo1MCxcIi4vX2Nsb25lTWFwXCI6NTEsXCIuL19jbG9uZVJlZ0V4cFwiOjUyLFwiLi9fY2xvbmVTZXRcIjo1MyxcIi4vX2Nsb25lU3ltYm9sXCI6NTQsXCIuL19jbG9uZVR5cGVkQXJyYXlcIjo1NX1dLDc0OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXtyZXR1cm5cImZ1bmN0aW9uXCIhPXR5cGVvZiB0LmNvbnN0cnVjdG9yfHxhKHQpP3t9Om8oaSh0KSl9dmFyIG89dChcIi4vX2Jhc2VDcmVhdGVcIiksaT10KFwiLi9fZ2V0UHJvdG90eXBlXCIpLGE9dChcIi4vX2lzUHJvdG90eXBlXCIpO2UuZXhwb3J0cz1ufSx7XCIuL19iYXNlQ3JlYXRlXCI6MzAsXCIuL19nZXRQcm90b3R5cGVcIjo2MyxcIi4vX2lzUHJvdG90eXBlXCI6ODB9XSw3NTpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7dmFyIGU9ITE7aWYobnVsbCE9dCYmXCJmdW5jdGlvblwiIT10eXBlb2YgdC50b1N0cmluZyl0cnl7ZT0hISh0K1wiXCIpfWNhdGNoKHIpe31yZXR1cm4gZX1lLmV4cG9ydHM9bn0se31dLDc2OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe3JldHVybiBlPW51bGw9PWU/bzplLCEhZSYmKFwibnVtYmVyXCI9PXR5cGVvZiB0fHxpLnRlc3QodCkpJiZ0Pi0xJiZ0JTE9PTAmJmU+dH12YXIgbz05MDA3MTk5MjU0NzQwOTkxLGk9L14oPzowfFsxLTldXFxkKikkLztlLmV4cG9ydHM9bn0se31dLDc3OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUscil7aWYoIWMocikpcmV0dXJuITE7dmFyIG49dHlwZW9mIGU7cmV0dXJuKFwibnVtYmVyXCI9PW4/aShyKSYmYShlLHIubGVuZ3RoKTpcInN0cmluZ1wiPT1uJiZlIGluIHIpP28ocltlXSx0KTohMX12YXIgbz10KFwiLi9lcVwiKSxpPXQoXCIuL2lzQXJyYXlMaWtlXCIpLGE9dChcIi4vX2lzSW5kZXhcIiksYz10KFwiLi9pc09iamVjdFwiKTtlLmV4cG9ydHM9bn0se1wiLi9faXNJbmRleFwiOjc2LFwiLi9lcVwiOjEwMyxcIi4vaXNBcnJheUxpa2VcIjoxMDcsXCIuL2lzT2JqZWN0XCI6MTEzfV0sNzg6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSl7aWYobyh0KSlyZXR1cm4hMTt2YXIgcj10eXBlb2YgdDtyZXR1cm5cIm51bWJlclwiPT1yfHxcInN5bWJvbFwiPT1yfHxcImJvb2xlYW5cIj09cnx8bnVsbD09dHx8aSh0KT8hMDpjLnRlc3QodCl8fCFhLnRlc3QodCl8fG51bGwhPWUmJnQgaW4gT2JqZWN0KGUpfXZhciBvPXQoXCIuL2lzQXJyYXlcIiksaT10KFwiLi9pc1N5bWJvbFwiKSxhPS9cXC58XFxbKD86W15bXFxdXSp8KFtcIiddKSg/Oig/IVxcMSlbXlxcXFxdfFxcXFwuKSo/XFwxKVxcXS8sYz0vXlxcdyokLztlLmV4cG9ydHM9bn0se1wiLi9pc0FycmF5XCI6MTA2LFwiLi9pc1N5bWJvbFwiOjExN31dLDc5OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt2YXIgZT10eXBlb2YgdDtyZXR1cm5cInN0cmluZ1wiPT1lfHxcIm51bWJlclwiPT1lfHxcInN5bWJvbFwiPT1lfHxcImJvb2xlYW5cIj09ZT9cIl9fcHJvdG9fX1wiIT09dDpudWxsPT09dH1lLmV4cG9ydHM9bn0se31dLDgwOltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt2YXIgZT10JiZ0LmNvbnN0cnVjdG9yLHI9XCJmdW5jdGlvblwiPT10eXBlb2YgZSYmZS5wcm90b3R5cGV8fG87cmV0dXJuIHQ9PT1yfXZhciBvPU9iamVjdC5wcm90b3R5cGU7ZS5leHBvcnRzPW59LHt9XSw4MTpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7Zm9yKHZhciBlLHI9W107IShlPXQubmV4dCgpKS5kb25lOylyLnB1c2goZS52YWx1ZSk7cmV0dXJuIHJ9ZS5leHBvcnRzPW59LHt9XSw4MjpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4oKXt0aGlzLl9fZGF0YV9fPXtoYXNoOm5ldyBvLG1hcDppP25ldyBpOltdLHN0cmluZzpuZXcgb319dmFyIG89dChcIi4vX0hhc2hcIiksaT10KFwiLi9fTWFwXCIpO2UuZXhwb3J0cz1ufSx7XCIuL19IYXNoXCI6NSxcIi4vX01hcFwiOjZ9XSw4MzpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7dmFyIGU9dGhpcy5fX2RhdGFfXztyZXR1cm4gYyh0KT9hKFwic3RyaW5nXCI9PXR5cGVvZiB0P2Uuc3RyaW5nOmUuaGFzaCx0KTpvP2UubWFwW1wiZGVsZXRlXCJdKHQpOmkoZS5tYXAsdCl9dmFyIG89dChcIi4vX01hcFwiKSxpPXQoXCIuL19hc3NvY0RlbGV0ZVwiKSxhPXQoXCIuL19oYXNoRGVsZXRlXCIpLGM9dChcIi4vX2lzS2V5YWJsZVwiKTtlLmV4cG9ydHM9bn0se1wiLi9fTWFwXCI6NixcIi4vX2Fzc29jRGVsZXRlXCI6MjMsXCIuL19oYXNoRGVsZXRlXCI6NjYsXCIuL19pc0tleWFibGVcIjo3OX1dLDg0OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt2YXIgZT10aGlzLl9fZGF0YV9fO3JldHVybiBjKHQpP2EoXCJzdHJpbmdcIj09dHlwZW9mIHQ/ZS5zdHJpbmc6ZS5oYXNoLHQpOm8/ZS5tYXAuZ2V0KHQpOmkoZS5tYXAsdCl9dmFyIG89dChcIi4vX01hcFwiKSxpPXQoXCIuL19hc3NvY0dldFwiKSxhPXQoXCIuL19oYXNoR2V0XCIpLGM9dChcIi4vX2lzS2V5YWJsZVwiKTtlLmV4cG9ydHM9bn0se1wiLi9fTWFwXCI6NixcIi4vX2Fzc29jR2V0XCI6MjQsXCIuL19oYXNoR2V0XCI6NjcsXCIuL19pc0tleWFibGVcIjo3OX1dLDg1OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt2YXIgZT10aGlzLl9fZGF0YV9fO3JldHVybiBjKHQpP2EoXCJzdHJpbmdcIj09dHlwZW9mIHQ/ZS5zdHJpbmc6ZS5oYXNoLHQpOm8/ZS5tYXAuaGFzKHQpOmkoZS5tYXAsdCl9dmFyIG89dChcIi4vX01hcFwiKSxpPXQoXCIuL19hc3NvY0hhc1wiKSxhPXQoXCIuL19oYXNoSGFzXCIpLGM9dChcIi4vX2lzS2V5YWJsZVwiKTtlLmV4cG9ydHM9bn0se1wiLi9fTWFwXCI6NixcIi4vX2Fzc29jSGFzXCI6MjUsXCIuL19oYXNoSGFzXCI6NjgsXCIuL19pc0tleWFibGVcIjo3OX1dLDg2OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe3ZhciByPXRoaXMuX19kYXRhX187cmV0dXJuIGModCk/YShcInN0cmluZ1wiPT10eXBlb2YgdD9yLnN0cmluZzpyLmhhc2gsdCxlKTpvP3IubWFwLnNldCh0LGUpOmkoci5tYXAsdCxlKSx0aGlzfXZhciBvPXQoXCIuL19NYXBcIiksaT10KFwiLi9fYXNzb2NTZXRcIiksYT10KFwiLi9faGFzaFNldFwiKSxjPXQoXCIuL19pc0tleWFibGVcIik7ZS5leHBvcnRzPW59LHtcIi4vX01hcFwiOjYsXCIuL19hc3NvY1NldFwiOjI3LFwiLi9faGFzaFNldFwiOjY5LFwiLi9faXNLZXlhYmxlXCI6Nzl9XSw4NzpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7dmFyIGU9LTEscj1BcnJheSh0LnNpemUpO3JldHVybiB0LmZvckVhY2goZnVuY3Rpb24odCxuKXtyWysrZV09W24sdF19KSxyfWUuZXhwb3J0cz1ufSx7fV0sODg6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSxyLGEsYyxzKXtyZXR1cm4gaSh0KSYmaShlKSYmbyh0LGUsdm9pZCAwLG4scy5zZXQoZSx0KSksdH12YXIgbz10KFwiLi9fYmFzZU1lcmdlXCIpLGk9dChcIi4vaXNPYmplY3RcIik7ZS5leHBvcnRzPW59LHtcIi4vX2Jhc2VNZXJnZVwiOjM3LFwiLi9pc09iamVjdFwiOjExM31dLDg5OltmdW5jdGlvbih0LGUscil7dmFyIG49dChcIi4vX2dldE5hdGl2ZVwiKSxvPW4oT2JqZWN0LFwiY3JlYXRlXCIpO2UuZXhwb3J0cz1vfSx7XCIuL19nZXROYXRpdmVcIjo2Mn1dLDkwOltmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKG4pe3ZhciBvPXQoXCIuL19jaGVja0dsb2JhbFwiKSxpPXtcImZ1bmN0aW9uXCI6ITAsb2JqZWN0OiEwfSxhPWlbdHlwZW9mIHJdJiZyJiYhci5ub2RlVHlwZT9yOnZvaWQgMCxjPWlbdHlwZW9mIGVdJiZlJiYhZS5ub2RlVHlwZT9lOnZvaWQgMCxzPW8oYSYmYyYmXCJvYmplY3RcIj09dHlwZW9mIG4mJm4pLHU9byhpW3R5cGVvZiBzZWxmXSYmc2VsZiksZj1vKGlbdHlwZW9mIHdpbmRvd10mJndpbmRvdykscD1vKGlbdHlwZW9mIHRoaXNdJiZ0aGlzKSxsPXN8fGYhPT0ocCYmcC53aW5kb3cpJiZmfHx1fHxwfHxGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7ZS5leHBvcnRzPWx9KS5jYWxsKHRoaXMsXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjpcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzp7fSl9LHtcIi4vX2NoZWNrR2xvYmFsXCI6NDd9XSw5MTpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7dmFyIGU9LTEscj1BcnJheSh0LnNpemUpO3JldHVybiB0LmZvckVhY2goZnVuY3Rpb24odCl7clsrK2VdPXR9KSxyfWUuZXhwb3J0cz1ufSx7fV0sOTI6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKCl7dGhpcy5fX2RhdGFfXz17YXJyYXk6W10sbWFwOm51bGx9fWUuZXhwb3J0cz1ufSx7fV0sOTM6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3ZhciBlPXRoaXMuX19kYXRhX18scj1lLmFycmF5O3JldHVybiByP28ocix0KTplLm1hcFtcImRlbGV0ZVwiXSh0KX12YXIgbz10KFwiLi9fYXNzb2NEZWxldGVcIik7ZS5leHBvcnRzPW59LHtcIi4vX2Fzc29jRGVsZXRlXCI6MjN9XSw5NDpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7dmFyIGU9dGhpcy5fX2RhdGFfXyxyPWUuYXJyYXk7cmV0dXJuIHI/byhyLHQpOmUubWFwLmdldCh0KX12YXIgbz10KFwiLi9fYXNzb2NHZXRcIik7ZS5leHBvcnRzPW59LHtcIi4vX2Fzc29jR2V0XCI6MjR9XSw5NTpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7dmFyIGU9dGhpcy5fX2RhdGFfXyxyPWUuYXJyYXk7cmV0dXJuIHI/byhyLHQpOmUubWFwLmhhcyh0KX12YXIgbz10KFwiLi9fYXNzb2NIYXNcIik7ZS5leHBvcnRzPW59LHtcIi4vX2Fzc29jSGFzXCI6MjV9XSw5NjpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxlKXt2YXIgcj10aGlzLl9fZGF0YV9fLG49ci5hcnJheTtuJiYobi5sZW5ndGg8YS0xP2kobix0LGUpOihyLmFycmF5PW51bGwsci5tYXA9bmV3IG8obikpKTt2YXIgYz1yLm1hcDtyZXR1cm4gYyYmYy5zZXQodCxlKSx0aGlzfXZhciBvPXQoXCIuL19NYXBDYWNoZVwiKSxpPXQoXCIuL19hc3NvY1NldFwiKSxhPTIwMDtlLmV4cG9ydHM9bn0se1wiLi9fTWFwQ2FjaGVcIjo3LFwiLi9fYXNzb2NTZXRcIjoyN31dLDk3OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXtyZXR1cm4gdC5tYXRjaCh4KX12YXIgbz1cIlxcXFx1ZDgwMC1cXFxcdWRmZmZcIixpPVwiXFxcXHUwMzAwLVxcXFx1MDM2ZlxcXFx1ZmUyMC1cXFxcdWZlMjNcIixhPVwiXFxcXHUyMGQwLVxcXFx1MjBmMFwiLGM9XCJcXFxcdWZlMGVcXFxcdWZlMGZcIixzPVwiW1wiK28rXCJdXCIsdT1cIltcIitpK2ErXCJdXCIsZj1cIlxcXFx1ZDgzY1tcXFxcdWRmZmItXFxcXHVkZmZmXVwiLHA9XCIoPzpcIit1K1wifFwiK2YrXCIpXCIsbD1cIlteXCIrbytcIl1cIixfPVwiKD86XFxcXHVkODNjW1xcXFx1ZGRlNi1cXFxcdWRkZmZdKXsyfVwiLHk9XCJbXFxcXHVkODAwLVxcXFx1ZGJmZl1bXFxcXHVkYzAwLVxcXFx1ZGZmZl1cIix2PVwiXFxcXHUyMDBkXCIsYj1wK1wiP1wiLGc9XCJbXCIrYytcIl0/XCIsaD1cIig/OlwiK3YrXCIoPzpcIitbbCxfLHldLmpvaW4oXCJ8XCIpK1wiKVwiK2crYitcIikqXCIsZD1nK2IraCxqPVwiKD86XCIrW2wrdStcIj9cIix1LF8seSxzXS5qb2luKFwifFwiKStcIilcIix4PVJlZ0V4cChmK1wiKD89XCIrZitcIil8XCIraitkLFwiZ1wiKTtlLmV4cG9ydHM9bn0se31dLDk4OltmdW5jdGlvbih0LGUscil7dmFyIG49dChcIi4vbWVtb2l6ZVwiKSxvPXQoXCIuL3RvU3RyaW5nXCIpLGk9L1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF0vZyxhPS9cXFxcKFxcXFwpPy9nLGM9bihmdW5jdGlvbih0KXt2YXIgZT1bXTtyZXR1cm4gbyh0KS5yZXBsYWNlKGksZnVuY3Rpb24odCxyLG4sbyl7ZS5wdXNoKG4/by5yZXBsYWNlKGEsXCIkMVwiKTpyfHx0KX0pLGV9KTtlLmV4cG9ydHM9Y30se1wiLi9tZW1vaXplXCI6MTIxLFwiLi90b1N0cmluZ1wiOjEyOH1dLDk5OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXtpZihcInN0cmluZ1wiPT10eXBlb2YgdHx8byh0KSlyZXR1cm4gdDt2YXIgZT10K1wiXCI7cmV0dXJuXCIwXCI9PWUmJjEvdD09LWk/XCItMFwiOmV9dmFyIG89dChcIi4vaXNTeW1ib2xcIiksaT0xLzA7ZS5leHBvcnRzPW59LHtcIi4vaXNTeW1ib2xcIjoxMTd9XSwxMDA6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe2lmKG51bGwhPXQpe3RyeXtyZXR1cm4gby5jYWxsKHQpfWNhdGNoKGUpe310cnl7cmV0dXJuIHQrXCJcIn1jYXRjaChlKXt9fXJldHVyblwiXCJ9dmFyIG89RnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO2UuZXhwb3J0cz1ufSx7fV0sMTAxOltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdH19ZS5leHBvcnRzPW59LHt9XSwxMDI6W2Z1bmN0aW9uKHQsZSxyKXt2YXIgbj10KFwiLi9fYXBwbHlcIiksbz10KFwiLi9fbWVyZ2VEZWZhdWx0c1wiKSxpPXQoXCIuL21lcmdlV2l0aFwiKSxhPXQoXCIuL3Jlc3RcIiksYz1hKGZ1bmN0aW9uKHQpe3JldHVybiB0LnB1c2godm9pZCAwLG8pLG4oaSx2b2lkIDAsdCl9KTtlLmV4cG9ydHM9Y30se1wiLi9fYXBwbHlcIjoxNyxcIi4vX21lcmdlRGVmYXVsdHNcIjo4OCxcIi4vbWVyZ2VXaXRoXCI6MTIyLFwiLi9yZXN0XCI6MTIzfV0sMTAzOltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe3JldHVybiB0PT09ZXx8dCE9PXQmJmUhPT1lfWUuZXhwb3J0cz1ufSx7fV0sMTA0OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUscil7dmFyIG49bnVsbD09dD92b2lkIDA6byh0LGUpO3JldHVybiB2b2lkIDA9PT1uP3I6bn12YXIgbz10KFwiLi9fYmFzZUdldFwiKTtlLmV4cG9ydHM9bn0se1wiLi9fYmFzZUdldFwiOjMxfV0sMTA1OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXtyZXR1cm4gbyh0KSYmYy5jYWxsKHQsXCJjYWxsZWVcIikmJighdS5jYWxsKHQsXCJjYWxsZWVcIil8fHMuY2FsbCh0KT09aSl9dmFyIG89dChcIi4vaXNBcnJheUxpa2VPYmplY3RcIiksaT1cIltvYmplY3QgQXJndW1lbnRzXVwiLGE9T2JqZWN0LnByb3RvdHlwZSxjPWEuaGFzT3duUHJvcGVydHkscz1hLnRvU3RyaW5nLHU9YS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtlLmV4cG9ydHM9bn0se1wiLi9pc0FycmF5TGlrZU9iamVjdFwiOjEwOH1dLDEwNjpbZnVuY3Rpb24odCxlLHIpe3ZhciBuPUFycmF5LmlzQXJyYXk7ZS5leHBvcnRzPW59LHt9XSwxMDc6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3JldHVybiBudWxsIT10JiZhKG8odCkpJiYhaSh0KX12YXIgbz10KFwiLi9fZ2V0TGVuZ3RoXCIpLGk9dChcIi4vaXNGdW5jdGlvblwiKSxhPXQoXCIuL2lzTGVuZ3RoXCIpO2UuZXhwb3J0cz1ufSx7XCIuL19nZXRMZW5ndGhcIjo2MSxcIi4vaXNGdW5jdGlvblwiOjExMCxcIi4vaXNMZW5ndGhcIjoxMTF9XSwxMDg6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3JldHVybiBpKHQpJiZvKHQpfXZhciBvPXQoXCIuL2lzQXJyYXlMaWtlXCIpLGk9dChcIi4vaXNPYmplY3RMaWtlXCIpO2UuZXhwb3J0cz1ufSx7XCIuL2lzQXJyYXlMaWtlXCI6MTA3LFwiLi9pc09iamVjdExpa2VcIjoxMTR9XSwxMDk6W2Z1bmN0aW9uKHQsZSxyKXt2YXIgbj10KFwiLi9jb25zdGFudFwiKSxvPXQoXCIuL19yb290XCIpLGk9e1wiZnVuY3Rpb25cIjohMCxvYmplY3Q6ITB9LGE9aVt0eXBlb2Ygcl0mJnImJiFyLm5vZGVUeXBlP3I6dm9pZCAwLGM9aVt0eXBlb2YgZV0mJmUmJiFlLm5vZGVUeXBlP2U6dm9pZCAwLHM9YyYmYy5leHBvcnRzPT09YT9hOnZvaWQgMCx1PXM/by5CdWZmZXI6dm9pZCAwLGY9dT9mdW5jdGlvbih0KXtyZXR1cm4gdCBpbnN0YW5jZW9mIHV9Om4oITEpO2UuZXhwb3J0cz1mfSx7XCIuL19yb290XCI6OTAsXCIuL2NvbnN0YW50XCI6MTAxfV0sMTEwOltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt2YXIgZT1vKHQpP3MuY2FsbCh0KTpcIlwiO3JldHVybiBlPT1pfHxlPT1hfXZhciBvPXQoXCIuL2lzT2JqZWN0XCIpLGk9XCJbb2JqZWN0IEZ1bmN0aW9uXVwiLGE9XCJbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXVwiLGM9T2JqZWN0LnByb3RvdHlwZSxzPWMudG9TdHJpbmc7ZS5leHBvcnRzPW59LHtcIi4vaXNPYmplY3RcIjoxMTN9XSwxMTE6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiB0JiZ0Pi0xJiZ0JTE9PTAmJm8+PXR9dmFyIG89OTAwNzE5OTI1NDc0MDk5MTtlLmV4cG9ydHM9bn0se31dLDExMjpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7aWYoIWEodCkpcmV0dXJuITE7dmFyIGU9byh0KXx8aSh0KT9fOnU7cmV0dXJuIGUudGVzdChjKHQpKX12YXIgbz10KFwiLi9pc0Z1bmN0aW9uXCIpLGk9dChcIi4vX2lzSG9zdE9iamVjdFwiKSxhPXQoXCIuL2lzT2JqZWN0XCIpLGM9dChcIi4vX3RvU291cmNlXCIpLHM9L1tcXFxcXiQuKis/KClbXFxde318XS9nLHU9L15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLyxmPU9iamVjdC5wcm90b3R5cGUscD1GdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcsbD1mLmhhc093blByb3BlcnR5LF89UmVnRXhwKFwiXlwiK3AuY2FsbChsKS5yZXBsYWNlKHMsXCJcXFxcJCZcIikucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZyxcIiQxLio/XCIpK1wiJFwiKTtlLmV4cG9ydHM9bn0se1wiLi9faXNIb3N0T2JqZWN0XCI6NzUsXCIuL190b1NvdXJjZVwiOjEwMCxcIi4vaXNGdW5jdGlvblwiOjExMCxcIi4vaXNPYmplY3RcIjoxMTN9XSwxMTM6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3ZhciBlPXR5cGVvZiB0O3JldHVybiEhdCYmKFwib2JqZWN0XCI9PWV8fFwiZnVuY3Rpb25cIj09ZSl9ZS5leHBvcnRzPW59LHt9XSwxMTQ6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3JldHVybiEhdCYmXCJvYmplY3RcIj09dHlwZW9mIHR9ZS5leHBvcnRzPW59LHt9XSwxMTU6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe2lmKCFhKHQpfHxsLmNhbGwodCkhPWN8fGkodCkpcmV0dXJuITE7dmFyIGU9byh0KTtpZihudWxsPT09ZSlyZXR1cm4hMDt2YXIgcj1mLmNhbGwoZSxcImNvbnN0cnVjdG9yXCIpJiZlLmNvbnN0cnVjdG9yO3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHImJnIgaW5zdGFuY2VvZiByJiZ1LmNhbGwocik9PXB9dmFyIG89dChcIi4vX2dldFByb3RvdHlwZVwiKSxpPXQoXCIuL19pc0hvc3RPYmplY3RcIiksYT10KFwiLi9pc09iamVjdExpa2VcIiksYz1cIltvYmplY3QgT2JqZWN0XVwiLHM9T2JqZWN0LnByb3RvdHlwZSx1PUZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyxmPXMuaGFzT3duUHJvcGVydHkscD11LmNhbGwoT2JqZWN0KSxsPXMudG9TdHJpbmc7ZS5leHBvcnRzPW59LHtcIi4vX2dldFByb3RvdHlwZVwiOjYzLFwiLi9faXNIb3N0T2JqZWN0XCI6NzUsXCIuL2lzT2JqZWN0TGlrZVwiOjExNH1dLDExNjpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIHR8fCFvKHQpJiZpKHQpJiZzLmNhbGwodCk9PWF9dmFyIG89dChcIi4vaXNBcnJheVwiKSxpPXQoXCIuL2lzT2JqZWN0TGlrZVwiKSxhPVwiW29iamVjdCBTdHJpbmddXCIsYz1PYmplY3QucHJvdG90eXBlLHM9Yy50b1N0cmluZztlLmV4cG9ydHM9bn0se1wiLi9pc0FycmF5XCI6MTA2LFwiLi9pc09iamVjdExpa2VcIjoxMTR9XSwxMTc6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3JldHVyblwic3ltYm9sXCI9PXR5cGVvZiB0fHxvKHQpJiZjLmNhbGwodCk9PWl9dmFyIG89dChcIi4vaXNPYmplY3RMaWtlXCIpLGk9XCJbb2JqZWN0IFN5bWJvbF1cIixhPU9iamVjdC5wcm90b3R5cGUsYz1hLnRvU3RyaW5nO2UuZXhwb3J0cz1ufSx7XCIuL2lzT2JqZWN0TGlrZVwiOjExNH1dLDExODpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7cmV0dXJuIGkodCkmJm8odC5sZW5ndGgpJiYhIU1bVC5jYWxsKHQpXX12YXIgbz10KFwiLi9pc0xlbmd0aFwiKSxpPXQoXCIuL2lzT2JqZWN0TGlrZVwiKSxhPVwiW29iamVjdCBBcmd1bWVudHNdXCIsYz1cIltvYmplY3QgQXJyYXldXCIscz1cIltvYmplY3QgQm9vbGVhbl1cIix1PVwiW29iamVjdCBEYXRlXVwiLGY9XCJbb2JqZWN0IEVycm9yXVwiLHA9XCJbb2JqZWN0IEZ1bmN0aW9uXVwiLGw9XCJbb2JqZWN0IE1hcF1cIixfPVwiW29iamVjdCBOdW1iZXJdXCIseT1cIltvYmplY3QgT2JqZWN0XVwiLHY9XCJbb2JqZWN0IFJlZ0V4cF1cIixiPVwiW29iamVjdCBTZXRdXCIsZz1cIltvYmplY3QgU3RyaW5nXVwiLGg9XCJbb2JqZWN0IFdlYWtNYXBdXCIsZD1cIltvYmplY3QgQXJyYXlCdWZmZXJdXCIsaj1cIltvYmplY3QgRGF0YVZpZXddXCIseD1cIltvYmplY3QgRmxvYXQzMkFycmF5XVwiLG09XCJbb2JqZWN0IEZsb2F0NjRBcnJheV1cIixPPVwiW29iamVjdCBJbnQ4QXJyYXldXCIsQT1cIltvYmplY3QgSW50MTZBcnJheV1cIixTPVwiW29iamVjdCBJbnQzMkFycmF5XVwiLHc9XCJbb2JqZWN0IFVpbnQ4QXJyYXldXCIsaz1cIltvYmplY3QgVWludDhDbGFtcGVkQXJyYXldXCIsUD1cIltvYmplY3QgVWludDE2QXJyYXldXCIsST1cIltvYmplY3QgVWludDMyQXJyYXldXCIsTT17fTtNW3hdPU1bbV09TVtPXT1NW0FdPU1bU109TVt3XT1NW2tdPU1bUF09TVtJXT0hMCxNW2FdPU1bY109TVtkXT1NW3NdPU1bal09TVt1XT1NW2ZdPU1bcF09TVtsXT1NW19dPU1beV09TVt2XT1NW2JdPU1bZ109TVtoXT0hMTt2YXIgQz1PYmplY3QucHJvdG90eXBlLFQ9Qy50b1N0cmluZztlLmV4cG9ydHM9bn0se1wiLi9pc0xlbmd0aFwiOjExMSxcIi4vaXNPYmplY3RMaWtlXCI6MTE0fV0sMTE5OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt2YXIgZT11KHQpO2lmKCFlJiYhYyh0KSlyZXR1cm4gaSh0KTt2YXIgcj1hKHQpLG49ISFyLGY9cnx8W10scD1mLmxlbmd0aDtmb3IodmFyIGwgaW4gdCkhbyh0LGwpfHxuJiYoXCJsZW5ndGhcIj09bHx8cyhsLHApKXx8ZSYmXCJjb25zdHJ1Y3RvclwiPT1sfHxmLnB1c2gobCk7cmV0dXJuIGZ9dmFyIG89dChcIi4vX2Jhc2VIYXNcIiksaT10KFwiLi9fYmFzZUtleXNcIiksYT10KFwiLi9faW5kZXhLZXlzXCIpLGM9dChcIi4vaXNBcnJheUxpa2VcIikscz10KFwiLi9faXNJbmRleFwiKSx1PXQoXCIuL19pc1Byb3RvdHlwZVwiKTtlLmV4cG9ydHM9bn0se1wiLi9fYmFzZUhhc1wiOjMzLFwiLi9fYmFzZUtleXNcIjozNSxcIi4vX2luZGV4S2V5c1wiOjcwLFwiLi9faXNJbmRleFwiOjc2LFwiLi9faXNQcm90b3R5cGVcIjo4MCxcIi4vaXNBcnJheUxpa2VcIjoxMDd9XSwxMjA6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe2Zvcih2YXIgZT0tMSxyPWModCksbj1vKHQpLHM9bi5sZW5ndGgsZj1pKHQpLHA9ISFmLGw9Znx8W10sXz1sLmxlbmd0aDsrK2U8czspe3ZhciB5PW5bZV07cCYmKFwibGVuZ3RoXCI9PXl8fGEoeSxfKSl8fFwiY29uc3RydWN0b3JcIj09eSYmKHJ8fCF1LmNhbGwodCx5KSl8fGwucHVzaCh5KX1yZXR1cm4gbH12YXIgbz10KFwiLi9fYmFzZUtleXNJblwiKSxpPXQoXCIuL19pbmRleEtleXNcIiksYT10KFwiLi9faXNJbmRleFwiKSxjPXQoXCIuL19pc1Byb3RvdHlwZVwiKSxzPU9iamVjdC5wcm90b3R5cGUsdT1zLmhhc093blByb3BlcnR5O2UuZXhwb3J0cz1ufSx7XCIuL19iYXNlS2V5c0luXCI6MzYsXCIuL19pbmRleEtleXNcIjo3MCxcIi4vX2lzSW5kZXhcIjo3NixcIi4vX2lzUHJvdG90eXBlXCI6ODB9XSwxMjE6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgdHx8ZSYmXCJmdW5jdGlvblwiIT10eXBlb2YgZSl0aHJvdyBuZXcgVHlwZUVycm9yKGkpO3ZhciByPWZ1bmN0aW9uKCl7dmFyIG49YXJndW1lbnRzLG89ZT9lLmFwcGx5KHRoaXMsbik6blswXSxpPXIuY2FjaGU7aWYoaS5oYXMobykpcmV0dXJuIGkuZ2V0KG8pO3ZhciBhPXQuYXBwbHkodGhpcyxuKTtyZXR1cm4gci5jYWNoZT1pLnNldChvLGEpLGF9O3JldHVybiByLmNhY2hlPW5ldyhuLkNhY2hlfHxvKSxyfXZhciBvPXQoXCIuL19NYXBDYWNoZVwiKSxpPVwiRXhwZWN0ZWQgYSBmdW5jdGlvblwiO24uQ2FjaGU9byxlLmV4cG9ydHM9bn0se1wiLi9fTWFwQ2FjaGVcIjo3fV0sMTIyOltmdW5jdGlvbih0LGUscil7dmFyIG49dChcIi4vX2Jhc2VNZXJnZVwiKSxvPXQoXCIuL19jcmVhdGVBc3NpZ25lclwiKSxpPW8oZnVuY3Rpb24odCxlLHIsbyl7bih0LGUscixvKX0pO2UuZXhwb3J0cz1pfSx7XCIuL19iYXNlTWVyZ2VcIjozNyxcIi4vX2NyZWF0ZUFzc2lnbmVyXCI6NTl9XSwxMjM6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgdCl0aHJvdyBuZXcgVHlwZUVycm9yKGEpO3JldHVybiBlPWModm9pZCAwPT09ZT90Lmxlbmd0aC0xOmkoZSksMCksZnVuY3Rpb24oKXtmb3IodmFyIHI9YXJndW1lbnRzLG49LTEsaT1jKHIubGVuZ3RoLWUsMCksYT1BcnJheShpKTsrK248aTspYVtuXT1yW2Urbl07c3dpdGNoKGUpe2Nhc2UgMDpyZXR1cm4gdC5jYWxsKHRoaXMsYSk7Y2FzZSAxOnJldHVybiB0LmNhbGwodGhpcyxyWzBdLGEpO2Nhc2UgMjpyZXR1cm4gdC5jYWxsKHRoaXMsclswXSxyWzFdLGEpfXZhciBzPUFycmF5KGUrMSk7Zm9yKG49LTE7KytuPGU7KXNbbl09cltuXTtyZXR1cm4gc1tlXT1hLG8odCx0aGlzLHMpfX12YXIgbz10KFwiLi9fYXBwbHlcIiksaT10KFwiLi90b0ludGVnZXJcIiksYT1cIkV4cGVjdGVkIGEgZnVuY3Rpb25cIixjPU1hdGgubWF4O2UuZXhwb3J0cz1ufSx7XCIuL19hcHBseVwiOjE3LFwiLi90b0ludGVnZXJcIjoxMjV9XSwxMjQ6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQsZSxyKXtcbnJldHVybiBudWxsPT10P3Q6byh0LGUscil9dmFyIG89dChcIi4vX2Jhc2VTZXRcIik7ZS5leHBvcnRzPW59LHtcIi4vX2Jhc2VTZXRcIjo0MH1dLDEyNTpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7aWYoIXQpcmV0dXJuIDA9PT10P3Q6MDtpZih0PW8odCksdD09PWl8fHQ9PT0taSl7dmFyIGU9MD50Py0xOjE7cmV0dXJuIGUqYX12YXIgcj10JTE7cmV0dXJuIHQ9PT10P3I/dC1yOnQ6MH12YXIgbz10KFwiLi90b051bWJlclwiKSxpPTEvMCxhPTEuNzk3NjkzMTM0ODYyMzE1N2UzMDg7ZS5leHBvcnRzPW59LHtcIi4vdG9OdW1iZXJcIjoxMjZ9XSwxMjY6W2Z1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe2lmKFwibnVtYmVyXCI9PXR5cGVvZiB0KXJldHVybiB0O2lmKGEodCkpcmV0dXJuIGM7aWYoaSh0KSl7dmFyIGU9byh0LnZhbHVlT2YpP3QudmFsdWVPZigpOnQ7dD1pKGUpP2UrXCJcIjplfWlmKFwic3RyaW5nXCIhPXR5cGVvZiB0KXJldHVybiAwPT09dD90Oit0O3Q9dC5yZXBsYWNlKHMsXCJcIik7dmFyIHI9Zi50ZXN0KHQpO3JldHVybiByfHxwLnRlc3QodCk/bCh0LnNsaWNlKDIpLHI/Mjo4KTp1LnRlc3QodCk/YzordH12YXIgbz10KFwiLi9pc0Z1bmN0aW9uXCIpLGk9dChcIi4vaXNPYmplY3RcIiksYT10KFwiLi9pc1N5bWJvbFwiKSxjPU5hTixzPS9eXFxzK3xcXHMrJC9nLHU9L15bLStdMHhbMC05YS1mXSskL2ksZj0vXjBiWzAxXSskL2kscD0vXjBvWzAtN10rJC9pLGw9cGFyc2VJbnQ7ZS5leHBvcnRzPW59LHtcIi4vaXNGdW5jdGlvblwiOjExMCxcIi4vaXNPYmplY3RcIjoxMTMsXCIuL2lzU3ltYm9sXCI6MTE3fV0sMTI3OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXtyZXR1cm4gbyh0LGkodCkpfXZhciBvPXQoXCIuL19jb3B5T2JqZWN0XCIpLGk9dChcIi4va2V5c0luXCIpO2UuZXhwb3J0cz1ufSx7XCIuL19jb3B5T2JqZWN0XCI6NTcsXCIuL2tleXNJblwiOjEyMH1dLDEyODpbZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7cmV0dXJuIG51bGw9PXQ/XCJcIjpvKHQpfXZhciBvPXQoXCIuL19iYXNlVG9TdHJpbmdcIik7ZS5leHBvcnRzPW59LHtcIi4vX2Jhc2VUb1N0cmluZ1wiOjQzfV0sMTI5OltmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUscil7aWYodD1zKHQpLHQmJihyfHx2b2lkIDA9PT1lKSlyZXR1cm4gdC5yZXBsYWNlKHUsXCJcIik7aWYoIXR8fCEoZT1vKGUpKSlyZXR1cm4gdDt2YXIgbj1jKHQpLGY9YShuLGMoZSkpKzE7cmV0dXJuIGkobiwwLGYpLmpvaW4oXCJcIil9dmFyIG89dChcIi4vX2Jhc2VUb1N0cmluZ1wiKSxpPXQoXCIuL19jYXN0U2xpY2VcIiksYT10KFwiLi9fY2hhcnNFbmRJbmRleFwiKSxjPXQoXCIuL19zdHJpbmdUb0FycmF5XCIpLHM9dChcIi4vdG9TdHJpbmdcIiksdT0vXFxzKyQvO2UuZXhwb3J0cz1ufSx7XCIuL19iYXNlVG9TdHJpbmdcIjo0MyxcIi4vX2Nhc3RTbGljZVwiOjQ1LFwiLi9fY2hhcnNFbmRJbmRleFwiOjQ2LFwiLi9fc3RyaW5nVG9BcnJheVwiOjk3LFwiLi90b1N0cmluZ1wiOjEyOH1dLDEzMDpbZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfXZhciBvPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgcj0wO3I8ZS5sZW5ndGg7cisrKXt2YXIgbj1lW3JdO24uZW51bWVyYWJsZT1uLmVudW1lcmFibGV8fCExLG4uY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIG4mJihuLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxuLmtleSxuKX19cmV0dXJuIGZ1bmN0aW9uKGUscixuKXtyZXR1cm4gciYmdChlLnByb3RvdHlwZSxyKSxuJiZ0KGUsbiksZX19KCksaT10KFwibG9kYXNoL2lzU3RyaW5nXCIpLGE9dChcImxvZGFzaC9pc1BsYWluT2JqZWN0XCIpLGM9dChcImxvZGFzaC9pc0Z1bmN0aW9uXCIpLHM9dChcImxvZGFzaC9nZXRcIiksdT10KFwibG9kYXNoL3NldFwiKSxmPXQoXCJsb2Rhc2gvZGVmYXVsdHNEZWVwXCIpLHA9dChcImxvZGFzaC90cmltRW5kXCIpO2UuZXhwb3J0cz1mdW5jdGlvbihlKXt2YXIgcj17Y29uZmlnX2ZpbGVzOnt9LGNvbmZpZ19maWxlc191c2VfZXh0OlwiLmpzXCIsYXBwX2NvbmZpZ19wYXRoOlwiY29uZmlnXCIsY29uZmlnX2Vudl9maWxlbmFtZTpcIi5lbnZcIixjb25maWdfYXBwX2ZpbGVuYW1lOlwiYXBwXCIsY29uZmlnX3Byb3ZpZGVyc19wYXRoOlwicHJvdmlkZXJzXCIscHJvdmlkZXJfZmlsZXM6e319O3JldHVybiBlPWYoZXx8e30sciksZnVuY3Rpb24oKXtmdW5jdGlvbiBsKHQpe24odGhpcyxsKSx0PWYodCx7YXBwOnt9LGNvbmZpZzp7fSxwcm92aWRlcnM6W119KSx0aGlzLmFwcD10LmFwcCx0aGlzLmNvbmZpZz10LmNvbmZpZyx0aGlzLnByb3ZpZGVycz10LnByb3ZpZGVyc31yZXR1cm4gbyhsLFt7a2V5OlwibG9hZENvbmZpZ1wiLHZhbHVlOmZ1bmN0aW9uKHIpe3ZhciBuPXRoaXM7aWYoaShlLmNvbmZpZ19maWxlcykpe3ZhciBvPXQoXCJmc1wiKSxjPXQoXCJwYXRoXCIpO28ucmVhZGRpcihlLmNvbmZpZ19maWxlcyxmdW5jdGlvbihvLGkpe2lmKG8pcmV0dXJuIHIobyk7Zm9yKHZhciBhPXt9LHM9MDtzPGkubGVuZ3RoO3MrKyl7dmFyIHU9aVtzXTthW3VdPXQoYy5qb2luKGUuY29uZmlnX2ZpbGVzLHUpKX1uLnVzZUNvbmZpZ0ZpbGVzKGEpLHIoKX0pfWVsc2UgYShlLmNvbmZpZ19maWxlcyk/KHRoaXMudXNlQ29uZmlnRmlsZXMoZS5jb25maWdfZmlsZXMpLHIoKSk6KHRoaXMudXNlQ29uZmlnRmlsZXMoKSxyKCkpfX0se2tleTpcInVzZUNvbmZpZ0ZpbGVzXCIsdmFsdWU6ZnVuY3Rpb24odCl7dHx8KHQ9e30pO3ZhciByPXt9LG49e30sbz17fTtmb3IodmFyIGkgaW4gdCl7aWYoZS5jb25maWdfZmlsZXNfdXNlX2V4dCl2YXIgYT1wKGksZS5jb25maWdfZmlsZXNfdXNlX2V4dCk7dmFyIGM9dFtpXTthPT09ZS5jb25maWdfZW52X2ZpbGVuYW1lP249YzphPT09ZS5jb25maWdfYXBwX2ZpbGVuYW1lP289YzpyW2FdPWN9dmFyIGw9Zih7fSx0aGlzLmNvbmZpZyxuLG8scik7dSh0aGlzLmFwcCxlLmFwcF9jb25maWdfcGF0aCxmdW5jdGlvbih0LGUpe3JldHVybiBzKGwsdCxlKX0pfX0se2tleTpcImxvYWRQcm92aWRlcnNcIix2YWx1ZTpmdW5jdGlvbihyKXt2YXIgbj10aGlzLG89ZnVuY3Rpb24odCl7cmV0dXJuIHR9O2lmKGkoZS5wcm92aWRlcl9maWxlcykpe3ZhciB1PXQoXCJwYXRoXCIpO289ZnVuY3Rpb24ocil7cmV0dXJuIHQodS5qb2luKGUucHJvdmlkZXJfZmlsZXMscikpfX1lbHNlIGEoZS5wcm92aWRlcl9maWxlcykmJihvPWZ1bmN0aW9uKHQpe3JldHVybiBlLnByb3ZpZGVyX2ZpbGVzW3RdfSk7dmFyIGY9cyh0aGlzLmFwcCxlLmFwcF9jb25maWdfcGF0aCkoZS5jb25maWdfcHJvdmlkZXJzX3BhdGgsW10pLHA9dGhpcy5wcm92aWRlcnMuY29uY2F0KGYpLGw9MCxfPWZ1bmN0aW9uIHkodCl7aWYodHx8bD09PXAubGVuZ3RoKXJldHVybiByKHQpO3ZhciBlPXBbbCsrXTtpZihpKGUpJiYoZT1vKGUpKSwhYyhlKSlyZXR1cm4geShuZXcgRXJyb3IoXCJQcm92aWRlciBcIitsK1wiIGlzIG5vdCBhIGZ1bmN0aW9uLlwiKSk7dHJ5e2Uobi5hcHAseSl9Y2F0Y2godCl7eSh0KX19O18oKX19LHtrZXk6XCJpbml0XCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcyxyPVtmdW5jdGlvbih0KXtlLmxvYWRDb25maWcodCl9LGZ1bmN0aW9uKHQpe2UubG9hZFByb3ZpZGVycyh0KX1dLG49MCxvPWZ1bmN0aW9uIGkobyl7aWYob3x8bj09PXIubGVuZ3RoKXJldHVybiB0KG8sZS5hcHApO3ZhciBhPXJbbisrXTt0cnl7YShpKX1jYXRjaChvKXtpKG8pfX07bygpfX1dLFt7a2V5OlwiZmFjdG9yeV9jb25maWdcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZX19LHtrZXk6XCJkZWZhdWx0X2ZhY3RvcnlfY29uZmlnXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHJ9fV0pLGx9KCl9fSx7ZnM6MSxcImxvZGFzaC9kZWZhdWx0c0RlZXBcIjoxMDIsXCJsb2Rhc2gvZ2V0XCI6MTA0LFwibG9kYXNoL2lzRnVuY3Rpb25cIjoxMTAsXCJsb2Rhc2gvaXNQbGFpbk9iamVjdFwiOjExNSxcImxvZGFzaC9pc1N0cmluZ1wiOjExNixcImxvZGFzaC9zZXRcIjoxMjQsXCJsb2Rhc2gvdHJpbUVuZFwiOjEyOSxwYXRoOjJ9XX0se30sWzEzMF0pKDEzMCl9KTsiLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuXG4ndXNlIHN0cmljdCdcblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxudmFyIGlzQXJyYXkgPSByZXF1aXJlKCdpc2FycmF5JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBEdWUgdG8gdmFyaW91cyBicm93c2VyIGJ1Z3MsIHNvbWV0aW1lcyB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uIHdpbGwgYmUgdXNlZCBldmVuXG4gKiB3aGVuIHRoZSBicm93c2VyIHN1cHBvcnRzIHR5cGVkIGFycmF5cy5cbiAqXG4gKiBOb3RlOlxuICpcbiAqICAgLSBGaXJlZm94IDQtMjkgbGFja3Mgc3VwcG9ydCBmb3IgYWRkaW5nIG5ldyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsXG4gKiAgICAgU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzguXG4gKlxuICogICAtIENocm9tZSA5LTEwIGlzIG1pc3NpbmcgdGhlIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24uXG4gKlxuICogICAtIElFMTAgaGFzIGEgYnJva2VuIGBUeXBlZEFycmF5LnByb3RvdHlwZS5zdWJhcnJheWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhcnJheXMgb2ZcbiAqICAgICBpbmNvcnJlY3QgbGVuZ3RoIGluIHNvbWUgc2l0dWF0aW9ucy5cblxuICogV2UgZGV0ZWN0IHRoZXNlIGJ1Z2d5IGJyb3dzZXJzIGFuZCBzZXQgYEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUYCB0byBgZmFsc2VgIHNvIHRoZXlcbiAqIGdldCB0aGUgT2JqZWN0IGltcGxlbWVudGF0aW9uLCB3aGljaCBpcyBzbG93ZXIgYnV0IGJlaGF2ZXMgY29ycmVjdGx5LlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IGdsb2JhbC5UWVBFRF9BUlJBWV9TVVBQT1JUICE9PSB1bmRlZmluZWRcbiAgPyBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVFxuICA6IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuLypcbiAqIEV4cG9ydCBrTWF4TGVuZ3RoIGFmdGVyIHR5cGVkIGFycmF5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZC5cbiAqL1xuZXhwb3J0cy5rTWF4TGVuZ3RoID0ga01heExlbmd0aCgpXG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoMSlcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiBhcnIuZm9vKCkgPT09IDQyICYmIC8vIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgJiYgLy8gY2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gICAgICAgIGFyci5zdWJhcnJheSgxLCAxKS5ieXRlTGVuZ3RoID09PSAwIC8vIGllMTAgaGFzIGJyb2tlbiBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBrTWF4TGVuZ3RoICgpIHtcbiAgcmV0dXJuIEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUXG4gICAgPyAweDdmZmZmZmZmXG4gICAgOiAweDNmZmZmZmZmXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAodGhhdCwgbGVuZ3RoKSB7XG4gIGlmIChrTWF4TGVuZ3RoKCkgPCBsZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGgnKVxuICB9XG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlLCBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIHRoYXQgPSBuZXcgVWludDhBcnJheShsZW5ndGgpXG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIGlmICh0aGF0ID09PSBudWxsKSB7XG4gICAgICB0aGF0ID0gbmV3IEJ1ZmZlcihsZW5ndGgpXG4gICAgfVxuICAgIHRoYXQubGVuZ3RoID0gbGVuZ3RoXG4gIH1cblxuICByZXR1cm4gdGhhdFxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmZ1bmN0aW9uIEJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiAhKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZ09yT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnSWYgZW5jb2RpbmcgaXMgc3BlY2lmaWVkIHRoZW4gdGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcnXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBhbGxvY1Vuc2FmZSh0aGlzLCBhcmcpXG4gIH1cbiAgcmV0dXJuIGZyb20odGhpcywgYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTIgLy8gbm90IHVzZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvblxuXG4vLyBUT0RPOiBMZWdhY3ksIG5vdCBuZWVkZWQgYW55bW9yZS4gUmVtb3ZlIGluIG5leHQgbWFqb3IgdmVyc2lvbi5cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiBmcm9tICh0aGF0LCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIGEgbnVtYmVyJylcbiAgfVxuXG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgcmV0dXJuIGZyb21PYmplY3QodGhhdCwgdmFsdWUpXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20obnVsbCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGUuX19wcm90b19fID0gVWludDhBcnJheS5wcm90b3R5cGVcbiAgQnVmZmVyLl9fcHJvdG9fXyA9IFVpbnQ4QXJyYXlcbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC5zcGVjaWVzICYmXG4gICAgICBCdWZmZXJbU3ltYm9sLnNwZWNpZXNdID09PSBCdWZmZXIpIHtcbiAgICAvLyBGaXggc3ViYXJyYXkoKSBpbiBFUzIwMTYuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC85N1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIsIFN5bWJvbC5zcGVjaWVzLCB7XG4gICAgICB2YWx1ZTogbnVsbCxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0U2l6ZSAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzaXplXCIgYXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHRoYXQsIHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0dGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKG51bGwsIHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAodGhhdCwgc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nICh0aGF0LCBzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZW5jb2RpbmdcIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVuY29kaW5nJylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcblxuICB0aGF0LndyaXRlKHN0cmluZywgZW5jb2RpbmcpXG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKHRoYXQsIGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgbGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgdGhhdFtpXSA9IGFycmF5W2ldICYgMjU1XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyICh0aGF0LCBhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGFycmF5LmJ5dGVMZW5ndGggLy8gdGhpcyB0aHJvd3MgaWYgYGFycmF5YCBpcyBub3QgYSB2YWxpZCBBcnJheUJ1ZmZlclxuXG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdvZmZzZXRcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1xcJ2xlbmd0aFxcJyBpcyBvdXQgb2YgYm91bmRzJylcbiAgfVxuXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IGFycmF5XG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tQXJyYXlMaWtlKHRoYXQsIGFycmF5KVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBrTWF4TGVuZ3RoKCkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsga01heExlbmd0aCgpLnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYSkgfHwgIUJ1ZmZlci5pc0J1ZmZlcihiKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyBtdXN0IGJlIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgdmFyIHggPSBhLmxlbmd0aFxuICB2YXIgeSA9IGIubGVuZ3RoXG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICB2YXIgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBidWYgPSBsaXN0W2ldXG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9XG4gICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgcG9zICs9IGJ1Zi5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmZmVyXG59XG5cbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKHN0cmluZywgZW5jb2RpbmcpIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdHJpbmcpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5sZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAoQXJyYXlCdWZmZXIuaXNWaWV3KHN0cmluZykgfHwgc3RyaW5nIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmdcbiAgfVxuXG4gIHZhciBsZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgLy8gRGVwcmVjYXRlZFxuICAgICAgY2FzZSAncmF3JzpcbiAgICAgIGNhc2UgJ3Jhd3MnOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gYmluYXJ5U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoZSBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIGFuZCBgaXMtYnVmZmVyYCAoaW4gU2FmYXJpIDUtNykgdG8gZGV0ZWN0XG4vLyBCdWZmZXIgaW5zdGFuY2VzLlxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgdmFyIGkgPSBiW25dXG4gIGJbbl0gPSBiW21dXG4gIGJbbV0gPSBpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDE2ID0gZnVuY3Rpb24gc3dhcDE2ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoIHwgMFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICB2YXIgc3RyID0gJydcbiAgdmFyIG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgaWYgKHRoaXMubGVuZ3RoID4gMCkge1xuICAgIHN0ciA9IHRoaXMudG9TdHJpbmcoJ2hleCcsIDAsIG1heCkubWF0Y2goLy57Mn0vZykuam9pbignICcpXG4gICAgaWYgKHRoaXMubGVuZ3RoID4gbWF4KSBzdHIgKz0gJyAuLi4gJ1xuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIHZhciB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICB2YXIgeSA9IGVuZCAtIHN0YXJ0XG4gIHZhciBsZW4gPSBNYXRoLm1pbih4LCB5KVxuXG4gIHZhciB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICB2YXIgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICB2YXIgaW5kZXhTaXplID0gMVxuICB2YXIgYXJyTGVuZ3RoID0gYXJyLmxlbmd0aFxuICB2YXIgdmFsTGVuZ3RoID0gdmFsLmxlbmd0aFxuXG4gIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoZW5jb2RpbmcgPT09ICd1Y3MyJyB8fCBlbmNvZGluZyA9PT0gJ3Vjcy0yJyB8fFxuICAgICAgICBlbmNvZGluZyA9PT0gJ3V0ZjE2bGUnIHx8IGVuY29kaW5nID09PSAndXRmLTE2bGUnKSB7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA8IDIgfHwgdmFsLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIC0xXG4gICAgICB9XG4gICAgICBpbmRleFNpemUgPSAyXG4gICAgICBhcnJMZW5ndGggLz0gMlxuICAgICAgdmFsTGVuZ3RoIC89IDJcbiAgICAgIGJ5dGVPZmZzZXQgLz0gMlxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWQgKGJ1ZiwgaSkge1xuICAgIGlmIChpbmRleFNpemUgPT09IDEpIHtcbiAgICAgIHJldHVybiBidWZbaV1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJ1Zi5yZWFkVUludDE2QkUoaSAqIGluZGV4U2l6ZSlcbiAgICB9XG4gIH1cblxuICB2YXIgZm91bmRJbmRleCA9IC0xXG4gIGZvciAodmFyIGkgPSAwOyBieXRlT2Zmc2V0ICsgaSA8IGFyckxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHJlYWQoYXJyLCBieXRlT2Zmc2V0ICsgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgIGlmIChpIC0gZm91bmRJbmRleCArIDEgPT09IHZhbExlbmd0aCkgcmV0dXJuIChieXRlT2Zmc2V0ICsgZm91bmRJbmRleCkgKiBpbmRleFNpemVcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZvdW5kSW5kZXggIT09IC0xKSBpIC09IGkgLSBmb3VuZEluZGV4XG4gICAgICBmb3VuZEluZGV4ID0gLTFcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPj49IDBcblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVybiAtMVxuICBpZiAoYnl0ZU9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuIC0xXG5cbiAgLy8gTmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBNYXRoLm1heCh0aGlzLmxlbmd0aCArIGJ5dGVPZmZzZXQsIDApXG5cbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIHNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZylcbiAgfVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbCh0aGlzLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YodGhpcywgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIHRoaXMuaW5kZXhPZih2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSAhPT0gLTFcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBpZiAoc3RyTGVuICUgMiAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggfCAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgLy8gbGVnYWN5IHdyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKSAtIHJlbW92ZSBpbiB2MC4xM1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGJpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgdmFyIHJlcyA9IFtdXG5cbiAgdmFyIGkgPSBzdGFydFxuICB3aGlsZSAoaSA8IGVuZCkge1xuICAgIHZhciBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICB2YXIgY29kZVBvaW50ID0gbnVsbFxuICAgIHZhciBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpID8gNFxuICAgICAgOiAoZmlyc3RCeXRlID4gMHhERikgPyAzXG4gICAgICA6IChmaXJzdEJ5dGUgPiAweEJGKSA/IDJcbiAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgdmFyIHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxudmFyIE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICB2YXIgbGVuID0gY29kZVBvaW50cy5sZW5ndGhcbiAgaWYgKGxlbiA8PSBNQVhfQVJHVU1FTlRTX0xFTkdUSCkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY29kZVBvaW50cykgLy8gYXZvaWQgZXh0cmEgc2xpY2UoKVxuICB9XG5cbiAgLy8gRGVjb2RlIGluIGNodW5rcyB0byBhdm9pZCBcImNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZFwiLlxuICB2YXIgcmVzID0gJydcbiAgdmFyIGkgPSAwXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXG4gICAgICBTdHJpbmcsXG4gICAgICBjb2RlUG9pbnRzLnNsaWNlKGksIGkgKz0gTUFYX0FSR1VNRU5UU19MRU5HVEgpXG4gICAgKVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0gJiAweDdGKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2kgKyAxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICB2YXIgbmV3QnVmXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgICBuZXdCdWYuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldF1cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgdmFyIG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKCh0aGlzW29mZnNldF0pIHxcbiAgICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSkgK1xuICAgICAgKHRoaXNbb2Zmc2V0ICsgM10gKiAweDEwMDAwMDApXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50QkUgPSBmdW5jdGlvbiByZWFkSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgaSA9IGJ5dGVMZW5ndGhcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0pIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSA8PCAyNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdExFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiByZWFkRG91YmxlQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZmZlclwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlVUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIG11bCA9IDFcbiAgdmFyIGkgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHwgMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgdmFyIG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVVSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZiArIHZhbHVlICsgMVxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID0gKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbmZ1bmN0aW9uIG9iamVjdFdyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbikge1xuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSAwXG4gIHZhciBtdWwgPSAxXG4gIHZhciBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSAtIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBsaW1pdCA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoIC0gMVxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDEsIDB4N2YsIC0weDgwKVxuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB2YWx1ZSA9IE1hdGguZmxvb3IodmFsdWUpXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlKVxuICB9XG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5mdW5jdGlvbiBjaGVja0lFRUU3NTQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcbiAgdmFyIGlcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0ICYmIHN0YXJ0IDwgdGFyZ2V0U3RhcnQgJiYgdGFyZ2V0U3RhcnQgPCBlbmQpIHtcbiAgICAvLyBkZXNjZW5kaW5nIGNvcHkgZnJvbSBlbmRcbiAgICBmb3IgKGkgPSBsZW4gLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSBpZiAobGVuIDwgMTAwMCB8fCAhQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICAvLyBhc2NlbmRpbmcgY29weSBmcm9tIHN0YXJ0XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0YXJnZXRbaSArIHRhcmdldFN0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgIHRhcmdldCxcbiAgICAgIHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSxcbiAgICAgIHRhcmdldFN0YXJ0XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIGxlblxufVxuXG4vLyBVc2FnZTpcbi8vICAgIGJ1ZmZlci5maWxsKG51bWJlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoYnVmZmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChzdHJpbmdbLCBvZmZzZXRbLCBlbmRdXVssIGVuY29kaW5nXSlcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uIGZpbGwgKHZhbCwgc3RhcnQsIGVuZCwgZW5jb2RpbmcpIHtcbiAgLy8gSGFuZGxlIHN0cmluZyBjYXNlczpcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gc3RhcnRcbiAgICAgIHN0YXJ0ID0gMFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IGVuZFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciBjb2RlID0gdmFsLmNoYXJDb2RlQXQoMClcbiAgICAgIGlmIChjb2RlIDwgMjU2KSB7XG4gICAgICAgIHZhbCA9IGNvZGVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW5jb2RpbmcgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnICYmICFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAyNTVcbiAgfVxuXG4gIC8vIEludmFsaWQgcmFuZ2VzIGFyZSBub3Qgc2V0IHRvIGEgZGVmYXVsdCwgc28gY2FuIHJhbmdlIGNoZWNrIGVhcmx5LlxuICBpZiAoc3RhcnQgPCAwIHx8IHRoaXMubGVuZ3RoIDwgc3RhcnQgfHwgdGhpcy5sZW5ndGggPCBlbmQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignT3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgc3RhcnQgPSBzdGFydCA+Pj4gMFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IHRoaXMubGVuZ3RoIDogZW5kID4+PiAwXG5cbiAgaWYgKCF2YWwpIHZhbCA9IDBcblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgICB0aGlzW2ldID0gdmFsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBieXRlcyA9IEJ1ZmZlci5pc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiB1dGY4VG9CeXRlcyhuZXcgQnVmZmVyKHZhbCwgZW5jb2RpbmcpLnRvU3RyaW5nKCkpXG4gICAgdmFyIGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmQgLSBzdGFydDsgaSsrKSB7XG4gICAgICB0aGlzW2kgKyBzdGFydF0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxudmFyIElOVkFMSURfQkFTRTY0X1JFID0gL1teK1xcLzAtOUEtWmEtei1fXS9nXG5cbmZ1bmN0aW9uIGJhc2U2NGNsZWFuIChzdHIpIHtcbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0cmluZ3RyaW0oc3RyKS5yZXBsYWNlKElOVkFMSURfQkFTRTY0X1JFLCAnJylcbiAgLy8gTm9kZSBjb252ZXJ0cyBzdHJpbmdzIHdpdGggbGVuZ3RoIDwgMiB0byAnJ1xuICBpZiAoc3RyLmxlbmd0aCA8IDIpIHJldHVybiAnJ1xuICAvLyBOb2RlIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBiYXNlNjQgc3RyaW5ncyAobWlzc2luZyB0cmFpbGluZyA9PT0pLCBiYXNlNjQtanMgZG9lcyBub3RcbiAgd2hpbGUgKHN0ci5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgc3RyID0gc3RyICsgJz0nXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgdmFyIGNvZGVQb2ludFxuICB2YXIgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aFxuICB2YXIgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcbiAgdmFyIGJ5dGVzID0gW11cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKHVuaXRzIC09IDIpIDwgMCkgYnJlYWtcblxuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KGJhc2U2NGNsZWFuKHN0cikpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGlzbmFuICh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gdmFsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG4iLCIndXNlIHN0cmljdCdcblxuZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5XG5leHBvcnRzLmZyb21CeXRlQXJyYXkgPSBmcm9tQnl0ZUFycmF5XG5cbnZhciBsb29rdXAgPSBbXVxudmFyIHJldkxvb2t1cCA9IFtdXG52YXIgQXJyID0gdHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnID8gVWludDhBcnJheSA6IEFycmF5XG5cbmZ1bmN0aW9uIGluaXQgKCkge1xuICB2YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGxvb2t1cFtpXSA9IGNvZGVbaV1cbiAgICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbiAgfVxuXG4gIHJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxuICByZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcbn1cblxuaW5pdCgpXG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcbiAgdmFyIGxlbiA9IGI2NC5sZW5ndGhcblxuICBpZiAobGVuICUgNCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuICB9XG5cbiAgLy8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcbiAgLy8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuICAvLyByZXByZXNlbnQgb25lIGJ5dGVcbiAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG4gIC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2VcbiAgcGxhY2VIb2xkZXJzID0gYjY0W2xlbiAtIDJdID09PSAnPScgPyAyIDogYjY0W2xlbiAtIDFdID09PSAnPScgPyAxIDogMFxuXG4gIC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuICBhcnIgPSBuZXcgQXJyKGxlbiAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG4gIC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcbiAgbCA9IHBsYWNlSG9sZGVycyA+IDAgPyBsZW4gLSA0IDogbGVuXG5cbiAgdmFyIEwgPSAwXG5cbiAgZm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfCAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltMKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuICAgIHRtcCA9IChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW0wrK10gPSB0bXAgJiAweEZGXG4gIH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG4gICAgdG1wID0gKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHwgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW0wrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltMKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICsgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICsgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gKyBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgb3V0cHV0ID0gJydcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIG91dHB1dCArPSBsb29rdXBbdG1wID4+IDJdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gJz09J1xuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyAodWludDhbbGVuIC0gMV0pXG4gICAgb3V0cHV0ICs9IGxvb2t1cFt0bXAgPj4gMTBdXG4gICAgb3V0cHV0ICs9IGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl1cbiAgICBvdXRwdXQgKz0gbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXVxuICAgIG91dHB1dCArPSAnPSdcbiAgfVxuXG4gIHBhcnRzLnB1c2gob3V0cHV0KVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJyKSA9PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IGhhc2ggb2JqZWN0LlxuICovXG5mdW5jdGlvbiBIYXNoKCkge31cblxuLy8gQXZvaWQgaW5oZXJpdGluZyBmcm9tIGBPYmplY3QucHJvdG90eXBlYCB3aGVuIHBvc3NpYmxlLlxuSGFzaC5wcm90b3R5cGUgPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiBvYmplY3RQcm90bztcblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBtYXBDbGVhciA9IHJlcXVpcmUoJy4vX21hcENsZWFyJyksXG4gICAgbWFwRGVsZXRlID0gcmVxdWlyZSgnLi9fbWFwRGVsZXRlJyksXG4gICAgbWFwR2V0ID0gcmVxdWlyZSgnLi9fbWFwR2V0JyksXG4gICAgbWFwSGFzID0gcmVxdWlyZSgnLi9fbWFwSGFzJyksXG4gICAgbWFwU2V0ID0gcmVxdWlyZSgnLi9fbWFwU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcyA/IHZhbHVlcy5sZW5ndGggOiAwO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSB2YWx1ZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcERlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcFNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXBDYWNoZTtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25WYWx1ZTtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBhc3NvY2lhdGl2ZSBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhc3NvY0RlbGV0ZShhcnJheSwga2V5KSB7XG4gIHZhciBpbmRleCA9IGFzc29jSW5kZXhPZihhcnJheSwga2V5KTtcbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGFycmF5LnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGFycmF5LCBpbmRleCwgMSk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NEZWxldGU7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgYXNzb2NpYXRpdmUgYXJyYXkgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYXNzb2NHZXQoYXJyYXksIGtleSkge1xuICB2YXIgaW5kZXggPSBhc3NvY0luZGV4T2YoYXJyYXksIGtleSk7XG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBhcnJheVtpbmRleF1bMV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NHZXQ7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGFuIGFzc29jaWF0aXZlIGFycmF5IHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhc3NvY0hhcyhhcnJheSwga2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0hhcztcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzZWFyY2guXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc29jSW5kZXhPZjtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBhc3NvY2lhdGl2ZSBhcnJheSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKi9cbmZ1bmN0aW9uIGFzc29jU2V0KGFycmF5LCBrZXksIHZhbHVlKSB7XG4gIHZhciBpbmRleCA9IGFzc29jSW5kZXhPZihhcnJheSwga2V5KTtcbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIGFycmF5LnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBhcnJheVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc29jU2V0O1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmdldGAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWZhdWx0IHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldChvYmplY3QsIHBhdGgpIHtcbiAgcGF0aCA9IGlzS2V5KHBhdGgsIG9iamVjdCkgPyBbcGF0aF0gOiBjYXN0UGF0aChwYXRoKTtcblxuICB2YXIgaW5kZXggPSAwLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG5cbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0W3RvS2V5KHBhdGhbaW5kZXgrK10pXTtcbiAgfVxuICByZXR1cm4gKGluZGV4ICYmIGluZGV4ID09IGxlbmd0aCkgPyBvYmplY3QgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldDtcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zZXRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgcGF0aCBjcmVhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VTZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSwgY3VzdG9taXplcikge1xuICBwYXRoID0gaXNLZXkocGF0aCwgb2JqZWN0KSA/IFtwYXRoXSA6IGNhc3RQYXRoKHBhdGgpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICBsYXN0SW5kZXggPSBsZW5ndGggLSAxLFxuICAgICAgbmVzdGVkID0gb2JqZWN0O1xuXG4gIHdoaWxlIChuZXN0ZWQgIT0gbnVsbCAmJiArK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHRvS2V5KHBhdGhbaW5kZXhdKTtcbiAgICBpZiAoaXNPYmplY3QobmVzdGVkKSkge1xuICAgICAgdmFyIG5ld1ZhbHVlID0gdmFsdWU7XG4gICAgICBpZiAoaW5kZXggIT0gbGFzdEluZGV4KSB7XG4gICAgICAgIHZhciBvYmpWYWx1ZSA9IG5lc3RlZFtrZXldO1xuICAgICAgICBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXIgPyBjdXN0b21pemVyKG9ialZhbHVlLCBrZXksIG5lc3RlZCkgOiB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBvYmpWYWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/IChpc0luZGV4KHBhdGhbaW5kZXggKyAxXSkgPyBbXSA6IHt9KVxuICAgICAgICAgICAgOiBvYmpWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXNzaWduVmFsdWUobmVzdGVkLCBrZXksIG5ld1ZhbHVlKTtcbiAgICB9XG4gICAgbmVzdGVkID0gbmVzdGVkW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0O1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVG9TdHJpbmcgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnRvU3RyaW5nIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRvU3RyaW5nYCB3aGljaCBkb2Vzbid0IGNvbnZlcnQgbnVsbGlzaFxuICogdmFsdWVzIHRvIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICAvLyBFeGl0IGVhcmx5IGZvciBzdHJpbmdzIHRvIGF2b2lkIGEgcGVyZm9ybWFuY2UgaGl0IGluIHNvbWUgZW52aXJvbm1lbnRzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVG9TdHJpbmc7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIHN0cmluZ1RvUGF0aCA9IHJlcXVpcmUoJy4vX3N0cmluZ1RvUGF0aCcpO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYSBwYXRoIGFycmF5IGlmIGl0J3Mgbm90IG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2FzdCBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG5mdW5jdGlvbiBjYXN0UGF0aCh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IHN0cmluZ1RvUGF0aCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdFBhdGg7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgZ2xvYmFsIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7bnVsbHxPYmplY3R9IFJldHVybnMgYHZhbHVlYCBpZiBpdCdzIGEgZ2xvYmFsIG9iamVjdCwgZWxzZSBgbnVsbGAuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrR2xvYmFsKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgJiYgdmFsdWUuT2JqZWN0ID09PSBPYmplY3QpID8gdmFsdWUgOiBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNoZWNrR2xvYmFsO1xuIiwidmFyIGlzTmF0aXZlID0gcmVxdWlyZSgnLi9pc05hdGl2ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV07XG4gIHJldHVybiBpc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROYXRpdmU7XG4iLCJ2YXIgaGFzaEhhcyA9IHJlcXVpcmUoJy4vX2hhc2hIYXMnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoaGFzaCwga2V5KSB7XG4gIHJldHVybiBoYXNoSGFzKGhhc2gsIGtleSkgJiYgZGVsZXRlIGhhc2hba2V5XTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoRGVsZXRlO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoaGFzaCwga2V5KSB7XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gaGFzaFtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGhhc2gsIGtleSkgPyBoYXNoW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEdldDtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoaGFzaCwga2V5KSB7XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyBoYXNoW2tleV0gIT09IHVuZGVmaW5lZCA6IGhhc093blByb3BlcnR5LmNhbGwoaGFzaCwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChoYXNoLCBrZXksIHZhbHVlKSB7XG4gIGhhc2hba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hTZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QgaW4gSUUgPCA5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNIb3N0T2JqZWN0KHZhbHVlKSB7XG4gIC8vIE1hbnkgaG9zdCBvYmplY3RzIGFyZSBgT2JqZWN0YCBvYmplY3RzIHRoYXQgY2FuIGNvZXJjZSB0byBzdHJpbmdzXG4gIC8vIGRlc3BpdGUgaGF2aW5nIGltcHJvcGVybHkgZGVmaW5lZCBgdG9TdHJpbmdgIG1ldGhvZHMuXG4gIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgaWYgKHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nICE9ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gISEodmFsdWUgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSG9zdE9iamVjdDtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVJc0RlZXBQcm9wID0gL1xcLnxcXFsoPzpbXltcXF1dKnwoW1wiJ10pKD86KD8hXFwxKVteXFxcXF18XFxcXC4pKj9cXDEpXFxdLyxcbiAgICByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lIGFuZCBub3QgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAgIHZhbHVlID09IG51bGwgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkgfHwgIXJlSXNEZWVwUHJvcC50ZXN0KHZhbHVlKSB8fFxuICAgIChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiBPYmplY3Qob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXlhYmxlO1xuIiwidmFyIEhhc2ggPSByZXF1aXJlKCcuL19IYXNoJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IE1hcCA/IG5ldyBNYXAgOiBbXSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDbGVhcjtcbiIsInZhciBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBhc3NvY0RlbGV0ZSA9IHJlcXVpcmUoJy4vX2Fzc29jRGVsZXRlJyksXG4gICAgaGFzaERlbGV0ZSA9IHJlcXVpcmUoJy4vX2hhc2hEZWxldGUnKSxcbiAgICBpc0tleWFibGUgPSByZXF1aXJlKCcuL19pc0tleWFibGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcERlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoaXNLZXlhYmxlKGtleSkpIHtcbiAgICByZXR1cm4gaGFzaERlbGV0ZSh0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gZGF0YS5zdHJpbmcgOiBkYXRhLmhhc2gsIGtleSk7XG4gIH1cbiAgcmV0dXJuIE1hcCA/IGRhdGEubWFwWydkZWxldGUnXShrZXkpIDogYXNzb2NEZWxldGUoZGF0YS5tYXAsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwRGVsZXRlO1xuIiwidmFyIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIGFzc29jR2V0ID0gcmVxdWlyZSgnLi9fYXNzb2NHZXQnKSxcbiAgICBoYXNoR2V0ID0gcmVxdWlyZSgnLi9faGFzaEdldCcpLFxuICAgIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChpc0tleWFibGUoa2V5KSkge1xuICAgIHJldHVybiBoYXNoR2V0KHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyBkYXRhLnN0cmluZyA6IGRhdGEuaGFzaCwga2V5KTtcbiAgfVxuICByZXR1cm4gTWFwID8gZGF0YS5tYXAuZ2V0KGtleSkgOiBhc3NvY0dldChkYXRhLm1hcCwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBHZXQ7XG4iLCJ2YXIgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgYXNzb2NIYXMgPSByZXF1aXJlKCcuL19hc3NvY0hhcycpLFxuICAgIGhhc2hIYXMgPSByZXF1aXJlKCcuL19oYXNoSGFzJyksXG4gICAgaXNLZXlhYmxlID0gcmVxdWlyZSgnLi9faXNLZXlhYmxlJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChpc0tleWFibGUoa2V5KSkge1xuICAgIHJldHVybiBoYXNoSGFzKHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyBkYXRhLnN0cmluZyA6IGRhdGEuaGFzaCwga2V5KTtcbiAgfVxuICByZXR1cm4gTWFwID8gZGF0YS5tYXAuaGFzKGtleSkgOiBhc3NvY0hhcyhkYXRhLm1hcCwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBIYXM7XG4iLCJ2YXIgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgYXNzb2NTZXQgPSByZXF1aXJlKCcuL19hc3NvY1NldCcpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0JyksXG4gICAgaXNLZXlhYmxlID0gcmVxdWlyZSgnLi9faXNLZXlhYmxlJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoaXNLZXlhYmxlKGtleSkpIHtcbiAgICBoYXNoU2V0KHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyBkYXRhLnN0cmluZyA6IGRhdGEuaGFzaCwga2V5LCB2YWx1ZSk7XG4gIH0gZWxzZSBpZiAoTWFwKSB7XG4gICAgZGF0YS5tYXAuc2V0KGtleSwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGFzc29jU2V0KGRhdGEubWFwLCBrZXksIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBTZXQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlQ3JlYXRlO1xuIiwidmFyIGNoZWNrR2xvYmFsID0gcmVxdWlyZSgnLi9fY2hlY2tHbG9iYWwnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBhcmUgb2YgdGhlIGxhbmd1YWdlIHR5cGUgYE9iamVjdGAuICovXG52YXIgb2JqZWN0VHlwZXMgPSB7XG4gICdmdW5jdGlvbic6IHRydWUsXG4gICdvYmplY3QnOiB0cnVlXG59O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gKG9iamVjdFR5cGVzW3R5cGVvZiBleHBvcnRzXSAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlKVxuICA/IGV4cG9ydHNcbiAgOiB1bmRlZmluZWQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gKG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlKVxuICA/IG1vZHVsZVxuICA6IHVuZGVmaW5lZDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gY2hlY2tHbG9iYWwoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSAmJiB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSBjaGVja0dsb2JhbChvYmplY3RUeXBlc1t0eXBlb2Ygc2VsZl0gJiYgc2VsZik7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgd2luZG93YC4gKi9cbnZhciBmcmVlV2luZG93ID0gY2hlY2tHbG9iYWwob2JqZWN0VHlwZXNbdHlwZW9mIHdpbmRvd10gJiYgd2luZG93KTtcblxuLyoqIERldGVjdCBgdGhpc2AgYXMgdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgdGhpc0dsb2JhbCA9IGNoZWNrR2xvYmFsKG9iamVjdFR5cGVzW3R5cGVvZiB0aGlzXSAmJiB0aGlzKTtcblxuLyoqXG4gKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LlxuICpcbiAqIFRoZSBgdGhpc2AgdmFsdWUgaXMgdXNlZCBpZiBpdCdzIHRoZSBnbG9iYWwgb2JqZWN0IHRvIGF2b2lkIEdyZWFzZW1vbmtleSdzXG4gKiByZXN0cmljdGVkIGB3aW5kb3dgIG9iamVjdCwgb3RoZXJ3aXNlIHRoZSBgd2luZG93YCBvYmplY3QgaXMgdXNlZC5cbiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8XG4gICgoZnJlZVdpbmRvdyAhPT0gKHRoaXNHbG9iYWwgJiYgdGhpc0dsb2JhbC53aW5kb3cpKSAmJiBmcmVlV2luZG93KSB8fFxuICAgIGZyZWVTZWxmIHx8IHRoaXNHbG9iYWwgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwidmFyIG1lbW9pemUgPSByZXF1aXJlKCcuL21lbW9pemUnKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlUHJvcE5hbWUgPSAvW14uW1xcXV0rfFxcWyg/OigtP1xcZCsoPzpcXC5cXGQrKT8pfChbXCInXSkoKD86KD8hXFwyKVteXFxcXF18XFxcXC4pKj8pXFwyKVxcXS9nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBiYWNrc2xhc2hlcyBpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBhIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG52YXIgc3RyaW5nVG9QYXRoID0gbWVtb2l6ZShmdW5jdGlvbihzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB0b1N0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb1BhdGg7XG4iLCJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAqL1xuZnVuY3Rpb24gdG9LZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvS2V5O1xuIiwiLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwiLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqIHZhciBvdGhlciA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL19iYXNlR2V0Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGBvYmplY3RgLiBJZiB0aGUgcmVzb2x2ZWQgdmFsdWUgaXNcbiAqIGB1bmRlZmluZWRgLCB0aGUgYGRlZmF1bHRWYWx1ZWAgaXMgdXNlZCBpbiBpdHMgcGxhY2UuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjcuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gW2RlZmF1bHRWYWx1ZV0gVGhlIHZhbHVlIHJldHVybmVkIGZvciBgdW5kZWZpbmVkYCByZXNvbHZlZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjJzogMyB9IH1dIH07XG4gKlxuICogXy5nZXQob2JqZWN0LCAnYVswXS5iLmMnKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsIFsnYScsICcwJywgJ2InLCAnYyddKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsICdhLmIuYycsICdkZWZhdWx0Jyk7XG4gKiAvLyA9PiAnZGVmYXVsdCdcbiAqL1xuZnVuY3Rpb24gZ2V0KG9iamVjdCwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gIHZhciByZXN1bHQgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IGJhc2VHZXQob2JqZWN0LCBwYXRoKTtcbiAgcmV0dXJuIHJlc3VsdCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbHVlIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDggd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgYW5kIHdlYWsgbWFwIGNvbnN0cnVjdG9ycyxcbiAgLy8gYW5kIFBoYW50b21KUyAxLjkgd2hpY2ggcmV0dXJucyAnZnVuY3Rpb24nIGZvciBgTm9kZUxpc3RgIGluc3RhbmNlcy5cbiAgdmFyIHRhZyA9IGlzT2JqZWN0KHZhbHVlKSA/IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzSG9zdE9iamVjdCA9IHJlcXVpcmUoJy4vX2lzSG9zdE9iamVjdCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTmF0aXZlKEFycmF5LnByb3RvdHlwZS5wdXNoKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmF0aXZlKF8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSAoaXNGdW5jdGlvbih2YWx1ZSkgfHwgaXNIb3N0T2JqZWN0KHZhbHVlKSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOYXRpdmU7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICogcHJvdmlkZWQsIGl0IGRldGVybWluZXMgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0IGJhc2VkIG9uIHRoZVxuICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgbWFwIGNhY2hlIGtleS4gVGhlIGBmdW5jYFxuICogaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKlxuICogKipOb3RlOioqIFRoZSBjYWNoZSBpcyBleHBvc2VkIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IG9uIHRoZSBtZW1vaXplZFxuICogZnVuY3Rpb24uIEl0cyBjcmVhdGlvbiBtYXkgYmUgY3VzdG9taXplZCBieSByZXBsYWNpbmcgdGhlIGBfLm1lbW9pemUuQ2FjaGVgXG4gKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZVxuICogW2BNYXBgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS1tYXAtcHJvdG90eXBlLW9iamVjdClcbiAqIG1ldGhvZCBpbnRlcmZhY2Ugb2YgYGRlbGV0ZWAsIGBnZXRgLCBgaGFzYCwgYW5kIGBzZXRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6aW5nIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEsICdiJzogMiB9O1xuICogdmFyIG90aGVyID0geyAnYyc6IDMsICdkJzogNCB9O1xuICpcbiAqIHZhciB2YWx1ZXMgPSBfLm1lbW9pemUoXy52YWx1ZXMpO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiB2YWx1ZXMob3RoZXIpO1xuICogLy8gPT4gWzMsIDRdXG4gKlxuICogb2JqZWN0LmEgPSAyO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiAvLyBNb2RpZnkgdGhlIHJlc3VsdCBjYWNoZS5cbiAqIHZhbHVlcy5jYWNoZS5zZXQob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWydhJywgJ2InXVxuICpcbiAqIC8vIFJlcGxhY2UgYF8ubWVtb2l6ZS5DYWNoZWAuXG4gKiBfLm1lbW9pemUuQ2FjaGUgPSBXZWFrTWFwO1xuICovXG5mdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nIHx8IChyZXNvbHZlciAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gQXNzaWduIGNhY2hlIHRvIGBfLm1lbW9pemVgLlxubWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemU7XG4iLCJ2YXIgYmFzZVNldCA9IHJlcXVpcmUoJy4vX2Jhc2VTZXQnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSB2YWx1ZSBhdCBgcGF0aGAgb2YgYG9iamVjdGAuIElmIGEgcG9ydGlvbiBvZiBgcGF0aGAgZG9lc24ndCBleGlzdCxcbiAqIGl0J3MgY3JlYXRlZC4gQXJyYXlzIGFyZSBjcmVhdGVkIGZvciBtaXNzaW5nIGluZGV4IHByb3BlcnRpZXMgd2hpbGUgb2JqZWN0c1xuICogYXJlIGNyZWF0ZWQgZm9yIGFsbCBvdGhlciBtaXNzaW5nIHByb3BlcnRpZXMuIFVzZSBgXy5zZXRXaXRoYCB0byBjdXN0b21pemVcbiAqIGBwYXRoYCBjcmVhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuNy4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjJzogMyB9IH1dIH07XG4gKlxuICogXy5zZXQob2JqZWN0LCAnYVswXS5iLmMnLCA0KTtcbiAqIGNvbnNvbGUubG9nKG9iamVjdC5hWzBdLmIuYyk7XG4gKiAvLyA9PiA0XG4gKlxuICogXy5zZXQob2JqZWN0LCBbJ3gnLCAnMCcsICd5JywgJ3onXSwgNSk7XG4gKiBjb25zb2xlLmxvZyhvYmplY3QueFswXS55LnopO1xuICogLy8gPT4gNVxuICovXG5mdW5jdGlvbiBzZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyBvYmplY3QgOiBiYXNlU2V0KG9iamVjdCwgcGF0aCwgdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldDtcbiIsInZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9TdHJpbmcobnVsbCk7XG4gKiAvLyA9PiAnJ1xuICpcbiAqIF8udG9TdHJpbmcoLTApO1xuICogLy8gPT4gJy0wJ1xuICpcbiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTtcbiAqIC8vID0+ICcxLDIsMydcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9TdHJpbmc7XG4iLCJ2YXIgc2hvdWxkID0gcmVxdWlyZSgnLi9saWIvc2hvdWxkJyk7XG5cbnZhciBkZWZhdWx0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xudmFyIGRlZmF1bHRQcm9wZXJ0eSA9ICdzaG91bGQnO1xuXG4vL0V4cG9zZSBhcGkgdmlhIGBPYmplY3Qjc2hvdWxkYC5cbnRyeSB7XG4gIHZhciBwcmV2U2hvdWxkID0gc2hvdWxkLmV4dGVuZChkZWZhdWx0UHJvcGVydHksIGRlZmF1bHRQcm90byk7XG4gIHNob3VsZC5fcHJldlNob3VsZCA9IHByZXZTaG91bGQ7XG59IGNhdGNoKGUpIHtcbiAgLy9pZ25vcmUgZXJyb3JzXG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkO1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLyoqXG4gKiBzaG91bGQgQXNzZXJ0aW9uRXJyb3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtZW1iZXJPZiBzaG91bGRcbiAqIEBzdGF0aWNcbiAqL1xudmFyIEFzc2VydGlvbkVycm9yID0gZnVuY3Rpb24gQXNzZXJ0aW9uRXJyb3Iob3B0aW9ucykge1xuICB1dGlsLm1lcmdlKHRoaXMsIG9wdGlvbnMpO1xuXG4gIGlmICghb3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtZXNzYWdlJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghdGhpcy5fbWVzc2FnZSkge1xuICAgICAgICAgICAgdGhpcy5fbWVzc2FnZSA9IHRoaXMuZ2VuZXJhdGVNZXNzYWdlKCk7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy5fbWVzc2FnZTtcbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLnN0YWNrU3RhcnRGdW5jdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgLy8gbm9uIHY4IGJyb3dzZXJzIHNvIHdlIGNhbiBoYXZlIGEgc3RhY2t0cmFjZVxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICB2YXIgb3V0ID0gZXJyLnN0YWNrO1xuXG4gICAgICBpZiAodGhpcy5zdGFja1N0YXJ0RnVuY3Rpb24pIHtcbiAgICAgICAgLy8gdHJ5IHRvIHN0cmlwIHVzZWxlc3MgZnJhbWVzXG4gICAgICAgIHZhciBmbl9uYW1lID0gdXRpbC5mdW5jdGlvbk5hbWUodGhpcy5zdGFja1N0YXJ0RnVuY3Rpb24pO1xuICAgICAgICB2YXIgaWR4ID0gb3V0LmluZGV4T2YoJ1xcbicgKyBmbl9uYW1lKTtcbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgLy8gb25jZSB3ZSBoYXZlIGxvY2F0ZWQgdGhlIGZ1bmN0aW9uIGZyYW1lXG4gICAgICAgICAgLy8gd2UgbmVlZCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBiZWZvcmUgaXQgKGFuZCBpdHMgbGluZSlcbiAgICAgICAgICB2YXIgbmV4dF9saW5lID0gb3V0LmluZGV4T2YoJ1xcbicsIGlkeCArIDEpO1xuICAgICAgICAgIG91dCA9IG91dC5zdWJzdHJpbmcobmV4dF9saW5lICsgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFjayA9IG91dDtcbiAgICB9XG4gIH1cbn07XG5cblxudmFyIGluZGVudCA9ICcgICAgJztcbmZ1bmN0aW9uIHByZXBlbmRJbmRlbnQobGluZSkge1xuICByZXR1cm4gaW5kZW50ICsgbGluZTtcbn1cblxuZnVuY3Rpb24gaW5kZW50TGluZXModGV4dCkge1xuICByZXR1cm4gdGV4dC5zcGxpdCgnXFxuJykubWFwKHByZXBlbmRJbmRlbnQpLmpvaW4oJ1xcbicpO1xufVxuXG5cbi8vIGFzc2VydC5Bc3NlcnRpb25FcnJvciBpbnN0YW5jZW9mIEVycm9yXG5Bc3NlcnRpb25FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSwge1xuICBuYW1lOiB7XG4gICAgdmFsdWU6ICdBc3NlcnRpb25FcnJvcidcbiAgfSxcblxuICBnZW5lcmF0ZU1lc3NhZ2U6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMub3BlcmF0b3IgJiYgdGhpcy5wcmV2aW91cykge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmV2aW91cy5tZXNzYWdlO1xuICAgICAgfVxuICAgICAgdmFyIGFjdHVhbCA9IHV0aWwuZm9ybWF0KHRoaXMuYWN0dWFsKTtcbiAgICAgIHZhciBleHBlY3RlZCA9ICdleHBlY3RlZCcgaW4gdGhpcyA/ICcgJyArIHV0aWwuZm9ybWF0KHRoaXMuZXhwZWN0ZWQpIDogJyc7XG4gICAgICB2YXIgZGV0YWlscyA9ICdkZXRhaWxzJyBpbiB0aGlzICYmIHRoaXMuZGV0YWlscyA/ICcgKCcgKyB0aGlzLmRldGFpbHMgKyAnKScgOiAnJztcblxuICAgICAgdmFyIHByZXZpb3VzID0gdGhpcy5wcmV2aW91cyA/ICdcXG4nICsgaW5kZW50TGluZXModGhpcy5wcmV2aW91cy5tZXNzYWdlKSA6ICcnO1xuXG4gICAgICByZXR1cm4gJ2V4cGVjdGVkICcgKyBhY3R1YWwgKyAodGhpcy5uZWdhdGUgPyAnIG5vdCAnIDogJyAnKSArIHRoaXMub3BlcmF0b3IgKyBleHBlY3RlZCArIGRldGFpbHMgKyBwcmV2aW91cztcbiAgICB9XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFzc2VydGlvbkVycm9yO1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxudmFyIEFzc2VydGlvbkVycm9yID0gcmVxdWlyZSgnLi9hc3NlcnRpb24tZXJyb3InKTtcblxuLyoqXG4gKiBzaG91bGQgQXNzZXJ0aW9uXG4gKiBAcGFyYW0geyp9IG9iaiBHaXZlbiBvYmplY3QgZm9yIGFzc2VydGlvblxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAc3RhdGljXG4gKi9cbmZ1bmN0aW9uIEFzc2VydGlvbihvYmopIHtcbiAgdGhpcy5vYmogPSBvYmo7XG5cbiAgdGhpcy5hbnlPbmUgPSBmYWxzZTtcbiAgdGhpcy5uZWdhdGUgPSBmYWxzZTtcblxuICB0aGlzLnBhcmFtcyA9IHthY3R1YWw6IG9ian07XG59XG5cbkFzc2VydGlvbi5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBBc3NlcnRpb24sXG5cbiAgLyoqXG4gICAqIEJhc2UgbWV0aG9kIGZvciBhc3NlcnRpb25zLlxuICAgKlxuICAgKiBCZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCBuZWVkIHRvIGZpbGwgQXNzZXJ0aW9uI3BhcmFtcyBvYmplY3QuIFRoaXMgbWV0aG9kIHVzdWFsbHkgY2FsbGVkIGZyb20gb3RoZXIgYXNzZXJ0aW9uIG1ldGhvZHMuXG4gICAqIGBBc3NlcnRpb24jcGFyYW1zYCBjYW4gY29udGFpbiBzdWNoIHByb3BlcnRpZXM6XG4gICAqICogYG9wZXJhdG9yYCAtIHJlcXVpcmVkIHN0cmluZyBjb250YWluaW5nIGRlc2NyaXB0aW9uIG9mIHRoaXMgYXNzZXJ0aW9uXG4gICAqICogYG9iamAgLSBvcHRpb25hbCByZXBsYWNlbWVudCBmb3IgdGhpcy5vYmosIGl0IHVzZWZ1bGwgaWYgeW91IHByZXBhcmUgbW9yZSBjbGVhciBvYmplY3QgdGhlbiBnaXZlblxuICAgKiAqIGBtZXNzYWdlYCAtIGlmIHRoaXMgcHJvcGVydHkgZmlsbGVkIHdpdGggc3RyaW5nIGFueSBvdGhlcnMgd2lsbCBiZSBpZ25vcmVkIGFuZCB0aGlzIG9uZSB1c2VkIGFzIGFzc2VydGlvbiBtZXNzYWdlXG4gICAqICogYGV4cGVjdGVkYCAtIGFueSBvYmplY3QgdXNlZCB3aGVuIHlvdSBuZWVkIHRvIGFzc2VydCByZWxhdGlvbiBiZXR3ZWVuIGdpdmVuIG9iamVjdCBhbmQgZXhwZWN0ZWQuIExpa2UgZ2l2ZW4gPT0gZXhwZWN0ZWQgKD09IGlzIGEgcmVsYXRpb24pXG4gICAqICogYGRldGFpbHNgIC0gYWRkaXRpb25hbCBzdHJpbmcgd2l0aCBkZXRhaWxzIHRvIGdlbmVyYXRlZCBtZXNzYWdlXG4gICAqXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvblxuICAgKiBAcGFyYW0geyp9IGV4cHIgQW55IGV4cHJlc3Npb24gdGhhdCB3aWxsIGJlIHVzZWQgYXMgYSBjb25kaXRpb24gZm9yIGFzc2VydGluZy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIGEgPSBuZXcgc2hvdWxkLkFzc2VydGlvbig0Mik7XG4gICAqXG4gICAqIGEucGFyYW1zID0ge1xuICAgKiAgb3BlcmF0b3I6ICd0byBiZSBtYWdpYyBudW1iZXInLFxuICAgKiB9XG4gICAqXG4gICAqIGEuYXNzZXJ0KGZhbHNlKTtcbiAgICogLy90aHJvd3MgQXNzZXJ0aW9uRXJyb3I6IGV4cGVjdGVkIDQyIHRvIGJlIG1hZ2ljIG51bWJlclxuICAgKi9cbiAgYXNzZXJ0OiBmdW5jdGlvbihleHByKSB7XG4gICAgaWYgKGV4cHIpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBwYXJhbXMgPSB0aGlzLnBhcmFtcztcblxuICAgIGlmICgnb2JqJyBpbiBwYXJhbXMgJiYgISgnYWN0dWFsJyBpbiBwYXJhbXMpKSB7XG4gICAgICBwYXJhbXMuYWN0dWFsID0gcGFyYW1zLm9iajtcbiAgICB9IGVsc2UgaWYgKCEoJ29iaicgaW4gcGFyYW1zKSAmJiAhKCdhY3R1YWwnIGluIHBhcmFtcykpIHtcbiAgICAgIHBhcmFtcy5hY3R1YWwgPSB0aGlzLm9iajtcbiAgICB9XG5cbiAgICBwYXJhbXMuc3RhY2tTdGFydEZ1bmN0aW9uID0gcGFyYW1zLnN0YWNrU3RhcnRGdW5jdGlvbiB8fCB0aGlzLmFzc2VydDtcbiAgICBwYXJhbXMubmVnYXRlID0gdGhpcy5uZWdhdGU7XG5cbiAgICBwYXJhbXMuYXNzZXJ0aW9uID0gdGhpcztcblxuICAgIHRocm93IG5ldyBBc3NlcnRpb25FcnJvcihwYXJhbXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTaG9ydGN1dCBmb3IgYEFzc2VydGlvbiNhc3NlcnQoZmFsc2UpYC5cbiAgICpcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBhID0gbmV3IHNob3VsZC5Bc3NlcnRpb24oNDIpO1xuICAgKlxuICAgKiBhLnBhcmFtcyA9IHtcbiAgICogIG9wZXJhdG9yOiAndG8gYmUgbWFnaWMgbnVtYmVyJyxcbiAgICogfVxuICAgKlxuICAgKiBhLmZhaWwoKTtcbiAgICogLy90aHJvd3MgQXNzZXJ0aW9uRXJyb3I6IGV4cGVjdGVkIDQyIHRvIGJlIG1hZ2ljIG51bWJlclxuICAgKi9cbiAgZmFpbDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXNzZXJ0KGZhbHNlKTtcbiAgfVxufTtcblxuXG5cbi8qKlxuICogQXNzZXJ0aW9uIHVzZWQgdG8gZGVsZWdhdGUgY2FsbHMgb2YgQXNzZXJ0aW9uIG1ldGhvZHMgaW5zaWRlIG9mIFByb21pc2UuXG4gKiBJdCBoYXMgYWxtb3N0IGFsbCBtZXRob2RzIG9mIEFzc2VydGlvbi5wcm90b3R5cGVcbiAqXG4gKiBAcGFyYW0ge1Byb21pc2V9IG9ialxuICovXG5mdW5jdGlvbiBQcm9taXNlZEFzc2VydGlvbigvKiBvYmogKi8pIHtcbiAgQXNzZXJ0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbi8qKlxuICogTWFrZSBQcm9taXNlZEFzc2VydGlvbiB0byBsb29rIGxpa2UgcHJvbWlzZS4gRGVsZWdhdGUgcmVzb2x2ZSBhbmQgcmVqZWN0IHRvIGdpdmVuIHByb21pc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5Qcm9taXNlZEFzc2VydGlvbi5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICByZXR1cm4gdGhpcy5vYmoudGhlbihyZXNvbHZlLCByZWplY3QpO1xufTtcblxuLyoqXG4gKiBXYXkgdG8gZXh0ZW5kIEFzc2VydGlvbiBmdW5jdGlvbi4gSXQgdXNlcyBzb21lIGxvZ2ljXG4gKiB0byBkZWZpbmUgb25seSBwb3NpdGl2ZSBhc3NlcnRpb25zIGFuZCBpdHNlbGYgcnVsZSB3aXRoIG5lZ2F0aXZlIGFzc2VydGlvbi5cbiAqXG4gKiBBbGwgYWN0aW9ucyBoYXBwZW4gaW4gc3ViY29udGV4dCBhbmQgdGhpcyBtZXRob2QgdGFrZSBjYXJlIGFib3V0IG5lZ2F0aW9uLlxuICogUG90ZW50aWFsbHkgd2UgY2FuIGFkZCBzb21lIG1vcmUgbW9kaWZpZXJzIHRoYXQgZG9lcyBub3QgZGVwZW5kcyBmcm9tIHN0YXRlIG9mIGFzc2VydGlvbi5cbiAqXG4gKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIGFzc2VydGlvbi4gSXQgd2lsbCBiZSB1c2VkIGZvciBkZWZpbmluZyBtZXRob2Qgb3IgZ2V0dGVyIG9uIEFzc2VydGlvbi5wcm90b3R5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgRnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBvbiBleGVjdXRpbmcgYXNzZXJ0aW9uXG4gKiBAZXhhbXBsZVxuICpcbiAqIEFzc2VydGlvbi5hZGQoJ2Fzc2V0JywgZnVuY3Rpb24oKSB7XG4gKiAgICAgIHRoaXMucGFyYW1zID0geyBvcGVyYXRvcjogJ3RvIGJlIGFzc2V0JyB9XG4gKlxuICogICAgICB0aGlzLm9iai5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnaWQnKS53aGljaC5pcy5hLk51bWJlcigpXG4gKiAgICAgIHRoaXMub2JqLnNob3VsZC5oYXZlLnByb3BlcnR5KCdwYXRoJylcbiAqIH0pXG4gKi9cbkFzc2VydGlvbi5hZGQgPSBmdW5jdGlvbihuYW1lLCBmdW5jKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBc3NlcnRpb24ucHJvdG90eXBlLCBuYW1lLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbnRleHQgPSBuZXcgQXNzZXJ0aW9uKHRoaXMub2JqLCB0aGlzLCBuYW1lKTtcbiAgICAgIGNvbnRleHQuYW55T25lID0gdGhpcy5hbnlPbmU7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gY2hlY2sgZm9yIGZhaWxcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBBc3NlcnRpb25FcnJvcikge1xuICAgICAgICAgIC8vIG5lZ2F0aXZlIGZhaWxcbiAgICAgICAgICBpZiAodGhpcy5uZWdhdGUpIHtcbiAgICAgICAgICAgIHRoaXMub2JqID0gY29udGV4dC5vYmo7XG4gICAgICAgICAgICB0aGlzLm5lZ2F0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbnRleHQgIT09IGUuYXNzZXJ0aW9uKSB7XG4gICAgICAgICAgICBjb250ZXh0LnBhcmFtcy5wcmV2aW91cyA9IGU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gcG9zaXRpdmUgZmFpbFxuICAgICAgICAgIGNvbnRleHQubmVnYXRlID0gZmFsc2U7XG4gICAgICAgICAgY29udGV4dC5mYWlsKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGhyb3cgaWYgaXQgaXMgYW5vdGhlciBleGNlcHRpb25cbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cblxuICAgICAgLy8gbmVnYXRpdmUgcGFzc1xuICAgICAgaWYgKHRoaXMubmVnYXRlKSB7XG4gICAgICAgIGNvbnRleHQubmVnYXRlID0gdHJ1ZTsgLy8gYmVjYXVzZSAuZmFpbCB3aWxsIHNldCBuZWdhdGVcbiAgICAgICAgY29udGV4dC5wYXJhbXMuZGV0YWlscyA9ICdmYWxzZSBuZWdhdGl2ZSBmYWlsJztcbiAgICAgICAgY29udGV4dC5mYWlsKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHBvc2l0aXZlIHBhc3NcbiAgICAgIGlmICghdGhpcy5wYXJhbXMub3BlcmF0b3IpIHtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBjb250ZXh0LnBhcmFtczsgLy8gc2hvcnRjdXRcbiAgICAgIH1cbiAgICAgIHRoaXMub2JqID0gY29udGV4dC5vYmo7XG4gICAgICB0aGlzLm5lZ2F0ZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9KTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJvbWlzZWRBc3NlcnRpb24ucHJvdG90eXBlLCBuYW1lLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB0aGlzLm9iaiA9IHRoaXMub2JqLnRoZW4oZnVuY3Rpb24oYSkge1xuICAgICAgICByZXR1cm4gYVtuYW1lXS5hcHBseShhLCBhcmdzKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBBZGQgY2hhaW5pbmcgZ2V0dGVyIHRvIEFzc2VydGlvbiBsaWtlIC5hLCAud2hpY2ggZXRjXG4gKlxuICogQG1lbWJlck9mIEFzc2VydGlvblxuICogQHN0YXRpY1xuICogQHBhcmFtICB7c3RyaW5nfSBuYW1lICAgbmFtZSBvZiBnZXR0ZXJcbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBbb25DYWxsXSBvcHRpb25hbCBmdW5jdGlvbiB0byBjYWxsXG4gKi9cbkFzc2VydGlvbi5hZGRDaGFpbiA9IGZ1bmN0aW9uKG5hbWUsIG9uQ2FsbCkge1xuICBvbkNhbGwgPSBvbkNhbGwgfHwgZnVuY3Rpb24oKSB7fTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFzc2VydGlvbi5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgb25DYWxsLmNhbGwodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWVcbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb21pc2VkQXNzZXJ0aW9uLnByb3RvdHlwZSwgbmFtZSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLm9iaiA9IHRoaXMub2JqLnRoZW4oZnVuY3Rpb24oYSkge1xuICAgICAgICByZXR1cm4gYVtuYW1lXTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYWxpYXMgZm9yIHNvbWUgYEFzc2VydGlvbmAgcHJvcGVydHlcbiAqXG4gKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge1N0cmluZ30gZnJvbSBOYW1lIG9mIHRvIG1hcFxuICogQHBhcmFtIHtTdHJpbmd9IHRvIE5hbWUgb2YgYWxpYXNcbiAqIEBleGFtcGxlXG4gKlxuICogQXNzZXJ0aW9uLmFsaWFzKCd0cnVlJywgJ1RydWUnKVxuICovXG5Bc3NlcnRpb24uYWxpYXMgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoQXNzZXJ0aW9uLnByb3RvdHlwZSwgZnJvbSk7XG4gIGlmICghZGVzYykgdGhyb3cgbmV3IEVycm9yKCdBbGlhcyAnICsgZnJvbSArICcgLT4gJyArIHRvICsgJyBjb3VsZCBub3QgYmUgY3JlYXRlZCBhcyAnICsgZnJvbSArICcgbm90IGRlZmluZWQnKTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFzc2VydGlvbi5wcm90b3R5cGUsIHRvLCBkZXNjKTtcblxuICB2YXIgZGVzYzIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFByb21pc2VkQXNzZXJ0aW9uLnByb3RvdHlwZSwgZnJvbSk7XG4gIGlmIChkZXNjMikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm9taXNlZEFzc2VydGlvbi5wcm90b3R5cGUsIHRvLCBkZXNjMik7XG4gIH1cbn07XG4vKipcbiAqIE5lZ2F0aW9uIG1vZGlmaWVyLiBDdXJyZW50IGFzc2VydGlvbiBjaGFpbiBiZWNvbWUgbmVnYXRlZC4gRWFjaCBjYWxsIGludmVydCBuZWdhdGlvbiBvbiBjdXJyZW50IGFzc2VydGlvbi5cbiAqXG4gKiBAbmFtZSBub3RcbiAqIEBwcm9wZXJ0eVxuICogQG1lbWJlck9mIEFzc2VydGlvblxuICogQGNhdGVnb3J5IGFzc2VydGlvblxuICovXG5Bc3NlcnRpb24uYWRkQ2hhaW4oJ25vdCcsIGZ1bmN0aW9uKCkge1xuICB0aGlzLm5lZ2F0ZSA9ICF0aGlzLm5lZ2F0ZTtcbn0pO1xuXG4vKipcbiAqIEFueSBtb2RpZmllciAtIGl0IGFmZmVjdCBvbiBleGVjdXRpb24gb2Ygc2VxdWVuY2VkIGFzc2VydGlvbiB0byBkbyBub3QgYGNoZWNrIGFsbGAsIGJ1dCBgY2hlY2sgYW55IG9mYC5cbiAqXG4gKiBAbmFtZSBhbnlcbiAqIEBwcm9wZXJ0eVxuICogQG1lbWJlck9mIEFzc2VydGlvblxuICogQGNhdGVnb3J5IGFzc2VydGlvblxuICovXG5Bc3NlcnRpb24uYWRkQ2hhaW4oJ2FueScsIGZ1bmN0aW9uKCkge1xuICB0aGlzLmFueU9uZSA9IHRydWU7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBc3NlcnRpb247XG5tb2R1bGUuZXhwb3J0cy5Qcm9taXNlZEFzc2VydGlvbiA9IFByb21pc2VkQXNzZXJ0aW9uO1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxudmFyIEZvcm1hdHRlciA9IHJlcXVpcmUoJ3Nob3VsZC1mb3JtYXQnKS5Gb3JtYXR0ZXI7XG5cbnZhciBjb25maWcgPSB7XG4gIGNoZWNrUHJvdG9FcWw6IGZhbHNlLFxuXG4gIGdldEZvcm1hdHRlcjogZnVuY3Rpb24ob3B0cykge1xuICAgIHJldHVybiBuZXcgRm9ybWF0dGVyKG9wdHMgfHwgY29uZmlnKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb25maWc7XG4iLCIvLyBpbXBsZW1lbnQgYXNzZXJ0IGludGVyZmFjZSB1c2luZyBhbHJlYWR5IHdyaXR0ZW4gcGVhY2VzIG9mIHNob3VsZC5qc1xuXG4vLyBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Vbml0X1Rlc3RpbmcvMS4wXG4vL1xuLy8gVEhJUyBJUyBOT1QgVEVTVEVEIE5PUiBMSUtFTFkgVE8gV09SSyBPVVRTSURFIFY4IVxuLy9cbi8vIE9yaWdpbmFsbHkgZnJvbSBuYXJ3aGFsLmpzIChodHRwOi8vbmFyd2hhbGpzLm9yZylcbi8vIENvcHlyaWdodCAoYykgMjAwOSBUaG9tYXMgUm9iaW5zb24gPDI4MG5vcnRoLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG9cbi8vIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlXG4vLyByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Jcbi8vIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4vLyBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuLy8gd2hlbiB1c2VkIGluIG5vZGUsIHRoaXMgd2lsbCBhY3R1YWxseSBsb2FkIHRoZSB1dGlsIG1vZHVsZSB3ZSBkZXBlbmQgb25cbi8vIHZlcnN1cyBsb2FkaW5nIHRoZSBidWlsdGluIHV0aWwgbW9kdWxlIGFzIGhhcHBlbnMgb3RoZXJ3aXNlXG4vLyB0aGlzIGlzIGEgYnVnIGluIG5vZGUgbW9kdWxlIGxvYWRpbmcgYXMgZmFyIGFzIEkgYW0gY29uY2VybmVkXG52YXIgQXNzZXJ0aW9uID0gcmVxdWlyZSgnLi8uLi9hc3NlcnRpb24nKTtcblxudmFyIF9kZWVwRXF1YWwgPSByZXF1aXJlKCdzaG91bGQtZXF1YWwnKTtcblxudmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuLy8gMS4gVGhlIGFzc2VydCBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIHRoYXQgdGhyb3dcbi8vIEFzc2VydGlvbkVycm9yJ3Mgd2hlbiBwYXJ0aWN1bGFyIGNvbmRpdGlvbnMgYXJlIG5vdCBtZXQuIFRoZVxuLy8gYXNzZXJ0IG1vZHVsZSBtdXN0IGNvbmZvcm0gdG8gdGhlIGZvbGxvd2luZyBpbnRlcmZhY2UuXG5cbnZhciBhc3NlcnQgPSBtb2R1bGUuZXhwb3J0cyA9IG9rO1xuXG4vLyAzLiBBbGwgb2YgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgbXVzdCB0aHJvdyBhbiBBc3NlcnRpb25FcnJvclxuLy8gd2hlbiBhIGNvcnJlc3BvbmRpbmcgY29uZGl0aW9uIGlzIG5vdCBtZXQsIHdpdGggYSBtZXNzYWdlIHRoYXRcbi8vIG1heSBiZSB1bmRlZmluZWQgaWYgbm90IHByb3ZpZGVkLiAgQWxsIGFzc2VydGlvbiBtZXRob2RzIHByb3ZpZGVcbi8vIGJvdGggdGhlIGFjdHVhbCBhbmQgZXhwZWN0ZWQgdmFsdWVzIHRvIHRoZSBhc3NlcnRpb24gZXJyb3IgZm9yXG4vLyBkaXNwbGF5IHB1cnBvc2VzLlxuLyoqXG4gKiBOb2RlLmpzIHN0YW5kYXJkIFtgYXNzZXJ0LmZhaWxgXShodHRwOi8vbm9kZWpzLm9yZy9hcGkvYXNzZXJ0Lmh0bWwjYXNzZXJ0X2Fzc2VydF9mYWlsX2FjdHVhbF9leHBlY3RlZF9tZXNzYWdlX29wZXJhdG9yKS5cbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBzaG91bGRcbiAqIEBjYXRlZ29yeSBhc3NlcnRpb24gYXNzZXJ0XG4gKiBAcGFyYW0geyp9IGFjdHVhbCBBY3R1YWwgb2JqZWN0XG4gKiBAcGFyYW0geyp9IGV4cGVjdGVkIEV4cGVjdGVkIG9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgTWVzc2FnZSBmb3IgYXNzZXJ0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gb3BlcmF0b3IgT3BlcmF0b3IgdGV4dFxuICovXG5mdW5jdGlvbiBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsIG9wZXJhdG9yLCBzdGFja1N0YXJ0RnVuY3Rpb24pIHtcbiAgdmFyIGEgPSBuZXcgQXNzZXJ0aW9uKGFjdHVhbCk7XG4gIGEucGFyYW1zID0ge1xuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvbiB8fCBmYWlsXG4gIH07XG5cbiAgYS5mYWlsKCk7XG59XG5cbi8vIEVYVEVOU0lPTiEgYWxsb3dzIGZvciB3ZWxsIGJlaGF2ZWQgZXJyb3JzIGRlZmluZWQgZWxzZXdoZXJlLlxuYXNzZXJ0LmZhaWwgPSBmYWlsO1xuXG4vLyA0LiBQdXJlIGFzc2VydGlvbiB0ZXN0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdHJ1dGh5LCBhcyBkZXRlcm1pbmVkXG4vLyBieSAhIWd1YXJkLlxuLy8gYXNzZXJ0Lm9rKGd1YXJkLCBtZXNzYWdlX29wdCk7XG4vLyBUaGlzIHN0YXRlbWVudCBpcyBlcXVpdmFsZW50IHRvIGFzc2VydC5lcXVhbCh0cnVlLCAhIWd1YXJkLFxuLy8gbWVzc2FnZV9vcHQpOy4gVG8gdGVzdCBzdHJpY3RseSBmb3IgdGhlIHZhbHVlIHRydWUsIHVzZVxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKHRydWUsIGd1YXJkLCBtZXNzYWdlX29wdCk7LlxuLyoqXG4gKiBOb2RlLmpzIHN0YW5kYXJkIFtgYXNzZXJ0Lm9rYF0oaHR0cDovL25vZGVqcy5vcmcvYXBpL2Fzc2VydC5odG1sI2Fzc2VydF9hc3NlcnRfdmFsdWVfbWVzc2FnZV9hc3NlcnRfb2tfdmFsdWVfbWVzc2FnZSkuXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGFzc2VydFxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IFttZXNzYWdlXVxuICovXG5mdW5jdGlvbiBvayh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoIXZhbHVlKSBmYWlsKHZhbHVlLCB0cnVlLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQub2spO1xufVxuYXNzZXJ0Lm9rID0gb2s7XG5cbi8vIDUuIFRoZSBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc2hhbGxvdywgY29lcmNpdmUgZXF1YWxpdHkgd2l0aFxuLy8gPT0uXG4vLyBhc3NlcnQuZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG4vKipcbiAqIE5vZGUuanMgc3RhbmRhcmQgW2Bhc3NlcnQuZXF1YWxgXShodHRwOi8vbm9kZWpzLm9yZy9hcGkvYXNzZXJ0Lmh0bWwjYXNzZXJ0X2Fzc2VydF9lcXVhbF9hY3R1YWxfZXhwZWN0ZWRfbWVzc2FnZSkuXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGFzc2VydFxuICogQHBhcmFtIHsqfSBhY3R1YWxcbiAqIEBwYXJhbSB7Kn0gZXhwZWN0ZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbWVzc2FnZV1cbiAqL1xuYXNzZXJ0LmVxdWFsID0gZnVuY3Rpb24gZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9IGV4cGVjdGVkKSBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5lcXVhbCk7XG59O1xuXG4vLyA2LiBUaGUgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igd2hldGhlciB0d28gb2JqZWN0cyBhcmUgbm90IGVxdWFsXG4vLyB3aXRoICE9IGFzc2VydC5ub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG4vKipcbiAqIE5vZGUuanMgc3RhbmRhcmQgW2Bhc3NlcnQubm90RXF1YWxgXShodHRwOi8vbm9kZWpzLm9yZy9hcGkvYXNzZXJ0Lmh0bWwjYXNzZXJ0X2Fzc2VydF9ub3RlcXVhbF9hY3R1YWxfZXhwZWN0ZWRfbWVzc2FnZSkuXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGFzc2VydFxuICogQHBhcmFtIHsqfSBhY3R1YWxcbiAqIEBwYXJhbSB7Kn0gZXhwZWN0ZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbWVzc2FnZV1cbiAqL1xuYXNzZXJ0Lm5vdEVxdWFsID0gZnVuY3Rpb24gbm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT0nLCBhc3NlcnQubm90RXF1YWwpO1xuICB9XG59O1xuXG4vLyA3LiBUaGUgZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGEgZGVlcCBlcXVhbGl0eSByZWxhdGlvbi5cbi8vIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuLyoqXG4gKiBOb2RlLmpzIHN0YW5kYXJkIFtgYXNzZXJ0LmRlZXBFcXVhbGBdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9hc3NlcnQuaHRtbCNhc3NlcnRfYXNzZXJ0X2RlZXBlcXVhbF9hY3R1YWxfZXhwZWN0ZWRfbWVzc2FnZSkuXG4gKiBCdXQgdXNlcyBzaG91bGQuanMgLmVxbCBpbXBsZW1lbnRhdGlvbiBpbnN0ZWFkIG9mIE5vZGUuanMgb3duIGRlZXBFcXVhbC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGFzc2VydFxuICogQHBhcmFtIHsqfSBhY3R1YWxcbiAqIEBwYXJhbSB7Kn0gZXhwZWN0ZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbWVzc2FnZV1cbiAqL1xuYXNzZXJ0LmRlZXBFcXVhbCA9IGZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKS5yZXN1bHQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwRXF1YWwnLCBhc3NlcnQuZGVlcEVxdWFsKTtcbiAgfVxufTtcblxuXG4vLyA4LiBUaGUgbm9uLWVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBmb3IgYW55IGRlZXAgaW5lcXVhbGl0eS5cbi8vIGFzc2VydC5ub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuLyoqXG4gKiBOb2RlLmpzIHN0YW5kYXJkIFtgYXNzZXJ0Lm5vdERlZXBFcXVhbGBdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9hc3NlcnQuaHRtbCNhc3NlcnRfYXNzZXJ0X25vdGRlZXBlcXVhbF9hY3R1YWxfZXhwZWN0ZWRfbWVzc2FnZSkuXG4gKiBCdXQgdXNlcyBzaG91bGQuanMgLmVxbCBpbXBsZW1lbnRhdGlvbiBpbnN0ZWFkIG9mIE5vZGUuanMgb3duIGRlZXBFcXVhbC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGFzc2VydFxuICogQHBhcmFtIHsqfSBhY3R1YWxcbiAqIEBwYXJhbSB7Kn0gZXhwZWN0ZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbWVzc2FnZV1cbiAqL1xuYXNzZXJ0Lm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIG5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpLnJlc3VsdCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59O1xuXG4vLyA5LiBUaGUgc3RyaWN0IGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzdHJpY3QgZXF1YWxpdHksIGFzIGRldGVybWluZWQgYnkgPT09LlxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcbi8qKlxuICogTm9kZS5qcyBzdGFuZGFyZCBbYGFzc2VydC5zdHJpY3RFcXVhbGBdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9hc3NlcnQuaHRtbCNhc3NlcnRfYXNzZXJ0X3N0cmljdGVxdWFsX2FjdHVhbF9leHBlY3RlZF9tZXNzYWdlKS5cbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBzaG91bGRcbiAqIEBjYXRlZ29yeSBhc3NlcnRpb24gYXNzZXJ0XG4gKiBAcGFyYW0geyp9IGFjdHVhbFxuICogQHBhcmFtIHsqfSBleHBlY3RlZFxuICogQHBhcmFtIHtzdHJpbmd9IFttZXNzYWdlXVxuICovXG5hc3NlcnQuc3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT09JywgYXNzZXJ0LnN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gMTAuIFRoZSBzdHJpY3Qgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igc3RyaWN0IGluZXF1YWxpdHksIGFzXG4vLyBkZXRlcm1pbmVkIGJ5ICE9PS4gIGFzc2VydC5ub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG4vKipcbiAqIE5vZGUuanMgc3RhbmRhcmQgW2Bhc3NlcnQubm90U3RyaWN0RXF1YWxgXShodHRwOi8vbm9kZWpzLm9yZy9hcGkvYXNzZXJ0Lmh0bWwjYXNzZXJ0X2Fzc2VydF9ub3RzdHJpY3RlcXVhbF9hY3R1YWxfZXhwZWN0ZWRfbWVzc2FnZSkuXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2Ygc2hvdWxkXG4gKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGFzc2VydFxuICogQHBhcmFtIHsqfSBhY3R1YWxcbiAqIEBwYXJhbSB7Kn0gZXhwZWN0ZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbWVzc2FnZV1cbiAqL1xuYXNzZXJ0Lm5vdFN0cmljdEVxdWFsID0gZnVuY3Rpb24gbm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9PScsIGFzc2VydC5ub3RTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgaWYgKCFhY3R1YWwgfHwgIWV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHBlY3RlZCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWQudGVzdChhY3R1YWwpO1xuICB9IGVsc2UgaWYgKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoZXhwZWN0ZWQuY2FsbCh7fSwgYWN0dWFsKSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfdGhyb3dzKHNob3VsZFRocm93LCBibG9jaywgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgdmFyIGFjdHVhbDtcblxuICBpZiAodHlwZW9mIGV4cGVjdGVkID09ICdzdHJpbmcnKSB7XG4gICAgbWVzc2FnZSA9IGV4cGVjdGVkO1xuICAgIGV4cGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIHRyeSB7XG4gICAgYmxvY2soKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGFjdHVhbCA9IGU7XG4gIH1cblxuICBtZXNzYWdlID0gKGV4cGVjdGVkICYmIGV4cGVjdGVkLm5hbWUgPyAnICgnICsgZXhwZWN0ZWQubmFtZSArICcpJyA6ICcuJykgK1xuICAobWVzc2FnZSA/ICcgJyArIG1lc3NhZ2UgOiAnLicpO1xuXG4gIGlmIChzaG91bGRUaHJvdyAmJiAhYWN0dWFsKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnTWlzc2luZyBleHBlY3RlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoIXNob3VsZFRocm93ICYmIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnR290IHVud2FudGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICgoc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmIGV4cGVjdGVkICYmICFleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHwgKCFzaG91bGRUaHJvdyAmJiBhY3R1YWwpKSB7XG4gICAgdGhyb3cgYWN0dWFsO1xuICB9XG59XG5cbi8vIDExLiBFeHBlY3RlZCB0byB0aHJvdyBhbiBlcnJvcjpcbi8vIGFzc2VydC50aHJvd3MoYmxvY2ssIEVycm9yX29wdCwgbWVzc2FnZV9vcHQpO1xuLyoqXG4gKiBOb2RlLmpzIHN0YW5kYXJkIFtgYXNzZXJ0LnRocm93c2BdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9hc3NlcnQuaHRtbCNhc3NlcnRfYXNzZXJ0X3Rocm93c19ibG9ja19lcnJvcl9tZXNzYWdlKS5cbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBzaG91bGRcbiAqIEBjYXRlZ29yeSBhc3NlcnRpb24gYXNzZXJ0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBibG9ja1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW2Vycm9yXVxuICogQHBhcmFtIHtTdHJpbmd9IFttZXNzYWdlXVxuICovXG5hc3NlcnQudGhyb3dzID0gZnVuY3Rpb24oLypibG9jaywgZXJyb3IsIG1lc3NhZ2UqLykge1xuICBfdGhyb3dzLmFwcGx5KHRoaXMsIFt0cnVlXS5jb25jYXQocFNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xufTtcblxuLy8gRVhURU5TSU9OISBUaGlzIGlzIGFubm95aW5nIHRvIHdyaXRlIG91dHNpZGUgdGhpcyBtb2R1bGUuXG4vKipcbiAqIE5vZGUuanMgc3RhbmRhcmQgW2Bhc3NlcnQuZG9lc05vdFRocm93YF0oaHR0cDovL25vZGVqcy5vcmcvYXBpL2Fzc2VydC5odG1sI2Fzc2VydF9hc3NlcnRfZG9lc25vdHRocm93X2Jsb2NrX21lc3NhZ2UpLlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIHNob3VsZFxuICogQGNhdGVnb3J5IGFzc2VydGlvbiBhc3NlcnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGJsb2NrXG4gKiBAcGFyYW0ge1N0cmluZ30gW21lc3NhZ2VdXG4gKi9cbmFzc2VydC5kb2VzTm90VGhyb3cgPSBmdW5jdGlvbigvKmJsb2NrLCBtZXNzYWdlKi8pIHtcbiAgX3Rocm93cy5hcHBseSh0aGlzLCBbZmFsc2VdLmNvbmNhdChwU2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG59O1xuXG4vKipcbiAqIE5vZGUuanMgc3RhbmRhcmQgW2Bhc3NlcnQuaWZFcnJvcmBdKGh0dHA6Ly9ub2RlanMub3JnL2FwaS9hc3NlcnQuaHRtbCNhc3NlcnRfYXNzZXJ0X2lmZXJyb3JfdmFsdWUpLlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIHNob3VsZFxuICogQGNhdGVnb3J5IGFzc2VydGlvbiBhc3NlcnRcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICovXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikge1xuICBpZiAoZXJyKSB7XG4gICAgdGhyb3cgZXJyO1xuICB9XG59O1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnLi9fYXNzZXJ0Jyk7XG52YXIgQXNzZXJ0aW9uRXJyb3IgPSByZXF1aXJlKCcuLi9hc3NlcnRpb24tZXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaG91bGQpIHtcbiAgdmFyIGkgPSBzaG91bGQuZm9ybWF0O1xuXG4gIC8qXG4gICAqIEV4cG9zZSBhc3NlcnQgdG8gc2hvdWxkXG4gICAqXG4gICAqIFRoaXMgYWxsb3dzIHlvdSB0byBkbyB0aGluZ3MgbGlrZSBiZWxvd1xuICAgKiB3aXRob3V0IHJlcXVpcmUoKWluZyB0aGUgYXNzZXJ0IG1vZHVsZS5cbiAgICpcbiAgICogICAgc2hvdWxkLmVxdWFsKGZvby5iYXIsIHVuZGVmaW5lZCk7XG4gICAqXG4gICAqL1xuICB1dGlsLm1lcmdlKHNob3VsZCwgYXNzZXJ0KTtcblxuICAvKipcbiAgICogQXNzZXJ0IF9vYmpfIGV4aXN0cywgd2l0aCBvcHRpb25hbCBtZXNzYWdlLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBzaG91bGRcbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBhc3NlcnRcbiAgICogQGFsaWFzIHNob3VsZC5leGlzdHNcbiAgICogQHBhcmFtIHsqfSBvYmpcbiAgICogQHBhcmFtIHtTdHJpbmd9IFttc2ddXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHNob3VsZC5leGlzdCgxKTtcbiAgICogc2hvdWxkLmV4aXN0KG5ldyBEYXRlKCkpO1xuICAgKi9cbiAgc2hvdWxkLmV4aXN0ID0gc2hvdWxkLmV4aXN0cyA9IGZ1bmN0aW9uKG9iaiwgbXNnKSB7XG4gICAgaWYgKG51bGwgPT0gb2JqKSB7XG4gICAgICB0aHJvdyBuZXcgQXNzZXJ0aW9uRXJyb3Ioe1xuICAgICAgICBtZXNzYWdlOiBtc2cgfHwgKCdleHBlY3RlZCAnICsgaShvYmopICsgJyB0byBleGlzdCcpLCBzdGFja1N0YXJ0RnVuY3Rpb246IHNob3VsZC5leGlzdFxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHNob3VsZC5ub3QgPSB7fTtcbiAgLyoqXG4gICAqIEFzc2VydHMgX29ial8gZG9lcyBub3QgZXhpc3QsIHdpdGggb3B0aW9uYWwgbWVzc2FnZS5cbiAgICpcbiAgICogQG5hbWUgbm90LmV4aXN0XG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIHNob3VsZFxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGFzc2VydFxuICAgKiBAYWxpYXMgc2hvdWxkLm5vdC5leGlzdHNcbiAgICogQHBhcmFtIHsqfSBvYmpcbiAgICogQHBhcmFtIHtTdHJpbmd9IFttc2ddXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHNob3VsZC5ub3QuZXhpc3QobnVsbCk7XG4gICAqIHNob3VsZC5ub3QuZXhpc3Qodm9pZCAwKTtcbiAgICovXG4gIHNob3VsZC5ub3QuZXhpc3QgPSBzaG91bGQubm90LmV4aXN0cyA9IGZ1bmN0aW9uKG9iaiwgbXNnKSB7XG4gICAgaWYgKG51bGwgIT0gb2JqKSB7XG4gICAgICB0aHJvdyBuZXcgQXNzZXJ0aW9uRXJyb3Ioe1xuICAgICAgICBtZXNzYWdlOiBtc2cgfHwgKCdleHBlY3RlZCAnICsgaShvYmopICsgJyB0byBub3QgZXhpc3QnKSwgc3RhY2tTdGFydEZ1bmN0aW9uOiBzaG91bGQubm90LmV4aXN0XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59O1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaG91bGQsIEFzc2VydGlvbikge1xuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBleGFjdGx5IGB0cnVlYC5cbiAgICpcbiAgICogQG5hbWUgdHJ1ZVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gYm9vbFxuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI1RydWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IFttZXNzYWdlXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICh0cnVlKS5zaG91bGQuYmUudHJ1ZSgpO1xuICAgKiBmYWxzZS5zaG91bGQubm90LmJlLnRydWUoKTtcbiAgICpcbiAgICogKHsgYTogMTB9KS5zaG91bGQubm90LmJlLnRydWUoKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ3RydWUnLCBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgdGhpcy5pcy5leGFjdGx5KHRydWUsIG1lc3NhZ2UpO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ3RydWUnLCAnVHJ1ZScpO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIGV4YWN0bHkgYGZhbHNlYC5cbiAgICpcbiAgICogQG5hbWUgZmFsc2VcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGJvb2xcbiAgICogQGFsaWFzIEFzc2VydGlvbiNGYWxzZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW21lc3NhZ2VdIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKHRydWUpLnNob3VsZC5ub3QuYmUuZmFsc2UoKTtcbiAgICogZmFsc2Uuc2hvdWxkLmJlLmZhbHNlKCk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdmYWxzZScsIGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICB0aGlzLmlzLmV4YWN0bHkoZmFsc2UsIG1lc3NhZ2UpO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ2ZhbHNlJywgJ0ZhbHNlJyk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgdGh1dGh5IGFjY29yZGluZyBqYXZhc2NyaXB0IHR5cGUgY29udmVyc2lvbnMuXG4gICAqXG4gICAqIEBuYW1lIG9rXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBib29sXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICh0cnVlKS5zaG91bGQuYmUub2soKTtcbiAgICogJycuc2hvdWxkLm5vdC5iZS5vaygpO1xuICAgKiBzaG91bGQobnVsbCkubm90LmJlLm9rKCk7XG4gICAqIHNob3VsZCh2b2lkIDApLm5vdC5iZS5vaygpO1xuICAgKlxuICAgKiAoMTApLnNob3VsZC5iZS5vaygpO1xuICAgKiAoMCkuc2hvdWxkLm5vdC5iZS5vaygpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnb2snLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHsgb3BlcmF0b3I6ICd0byBiZSB0cnV0aHknIH07XG5cbiAgICB0aGlzLmFzc2VydCh0aGlzLm9iaik7XG4gIH0pO1xufTtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2hvdWxkLCBBc3NlcnRpb24pIHtcbiAgLyoqXG4gICAqIFNpbXBsZSBjaGFpbmluZy4gSXQgYWN0dWFsbHkgZG8gbm90aGluZy5cbiAgICpcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAbmFtZSBiZVxuICAgKiBAcHJvcGVydHkge3Nob3VsZC5Bc3NlcnRpb259IGJlXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jYW5cbiAgICogQGFsaWFzIEFzc2VydGlvbiNvZlxuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI2FcbiAgICogQGFsaWFzIEFzc2VydGlvbiNhbmRcbiAgICogQGFsaWFzIEFzc2VydGlvbiNoYXZlXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jaGFzXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jd2l0aFxuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI2lzXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jd2hpY2hcbiAgICogQGFsaWFzIEFzc2VydGlvbiN0aGVcbiAgICogQGFsaWFzIEFzc2VydGlvbiNpdFxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGNoYWluaW5nXG4gICAqL1xuICBbJ2FuJywgJ29mJywgJ2EnLCAnYW5kJywgJ2JlJywgJ2hhcycsICdoYXZlJywgJ3dpdGgnLCAnaXMnLCAnd2hpY2gnLCAndGhlJywgJ2l0J10uZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgQXNzZXJ0aW9uLmFkZENoYWluKG5hbWUpO1xuICB9KTtcbn07XG4iLCIvKlxuICogc2hvdWxkLmpzIC0gYXNzZXJ0aW9uIGxpYnJhcnlcbiAqIENvcHlyaWdodChjKSAyMDEwLTIwMTMgVEogSG9sb3dheWNodWsgPHRqQHZpc2lvbi1tZWRpYS5jYT5cbiAqIENvcHlyaWdodChjKSAyMDEzLTIwMTYgRGVuaXMgQmFyZGFkeW0gPGJhcmRhZHltY2hpa0BnbWFpbC5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcbnZhciBlcWwgPSByZXF1aXJlKCdzaG91bGQtZXF1YWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaG91bGQsIEFzc2VydGlvbikge1xuICB2YXIgaSA9IHNob3VsZC5mb3JtYXQ7XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IGdpdmVuIG9iamVjdCBjb250YWluIHNvbWV0aGluZyB0aGF0IGVxdWFsIHRvIGBvdGhlcmAuIEl0IHVzZXMgYHNob3VsZC1lcXVhbGAgZm9yIGVxdWFsaXR5IGNoZWNrcy5cbiAgICogSWYgZ2l2ZW4gb2JqZWN0IGlzIGFycmF5IGl0IHNlYXJjaCB0aGF0IG9uZSBvZiBlbGVtZW50cyB3YXMgZXF1YWwgdG8gYG90aGVyYC5cbiAgICogSWYgZ2l2ZW4gb2JqZWN0IGlzIHN0cmluZyBpdCBjaGVja3MgaWYgYG90aGVyYCBpcyBhIHN1YnN0cmluZyAtIGV4cGVjdGVkIHRoYXQgYG90aGVyYCBpcyBhIHN0cmluZy5cbiAgICogSWYgZ2l2ZW4gb2JqZWN0IGlzIE9iamVjdCBpdCBjaGVja3MgdGhhdCBgb3RoZXJgIGlzIGEgc3Vib2JqZWN0IC0gZXhwZWN0ZWQgdGhhdCBgb3RoZXJgIGlzIGEgb2JqZWN0LlxuICAgKlxuICAgKiBAbmFtZSBjb250YWluRXFsXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBjb250YWluXG4gICAqIEBwYXJhbSB7Kn0gb3RoZXIgTmVzdGVkIG9iamVjdFxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBbMSwgMiwgM10uc2hvdWxkLmNvbnRhaW5FcWwoMSk7XG4gICAqIFt7IGE6IDEgfSwgJ2EnLCAxMF0uc2hvdWxkLmNvbnRhaW5FcWwoeyBhOiAxIH0pO1xuICAgKlxuICAgKiAnYWJjJy5zaG91bGQuY29udGFpbkVxbCgnYicpO1xuICAgKiAnYWIxYycuc2hvdWxkLmNvbnRhaW5FcWwoMSk7XG4gICAqXG4gICAqICh7IGE6IDEwLCBjOiB7IGQ6IDEwIH19KS5zaG91bGQuY29udGFpbkVxbCh7IGE6IDEwIH0pO1xuICAgKiAoeyBhOiAxMCwgYzogeyBkOiAxMCB9fSkuc2hvdWxkLmNvbnRhaW5FcWwoeyBjOiB7IGQ6IDEwIH19KTtcbiAgICogKHsgYTogMTAsIGM6IHsgZDogMTAgfX0pLnNob3VsZC5jb250YWluRXFsKHsgYjogMTAgfSk7XG4gICAqIC8vIHRocm93cyBBc3NlcnRpb25FcnJvcjogZXhwZWN0ZWQgeyBhOiAxMCwgYzogeyBkOiAxMCB9IH0gdG8gY29udGFpbiB7IGI6IDEwIH1cbiAgICogLy8gICAgICAgICAgICBleHBlY3RlZCB7IGE6IDEwLCBjOiB7IGQ6IDEwIH0gfSB0byBoYXZlIHByb3BlcnR5IGJcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2NvbnRhaW5FcWwnLCBmdW5jdGlvbihvdGhlcikge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gY29udGFpbiAnICsgaShvdGhlcil9O1xuXG4gICAgdGhpcy5pcy5ub3QubnVsbCgpLmFuZC5ub3QudW5kZWZpbmVkKCk7XG5cbiAgICB2YXIgb2JqID0gdGhpcy5vYmo7XG5cbiAgICBpZiAodHlwZW9mIG9iaiA9PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5hc3NlcnQob2JqLmluZGV4T2YoU3RyaW5nKG90aGVyKSkgPj0gMCk7XG4gICAgfSBlbHNlIGlmICh1dGlsLmlzSW5kZXhhYmxlKG9iaikpIHtcbiAgICAgIHRoaXMuYXNzZXJ0KHV0aWwuc29tZShvYmosIGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgcmV0dXJuIGVxbCh2LCBvdGhlcikucmVzdWx0O1xuICAgICAgfSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhdmUucHJvcGVydGllcyhvdGhlcik7XG4gICAgfVxuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgZ2l2ZW4gb2JqZWN0IGlzIGNvbnRhaW4gZXF1YWxseSBzdHJ1Y3R1cmVkIG9iamVjdCBvbiB0aGUgc2FtZSBkZXB0aCBsZXZlbC5cbiAgICogSWYgZ2l2ZW4gb2JqZWN0IGlzIGFuIGFycmF5IGFuZCBgb3RoZXJgIGlzIGFuIGFycmF5IGl0IGNoZWNrcyB0aGF0IHRoZSBlcWwgZWxlbWVudHMgaXMgZ29pbmcgaW4gdGhlIHNhbWUgc2VxdWVuY2UgaW4gZ2l2ZW4gYXJyYXkgKHJlY3Vyc2l2ZSlcbiAgICogSWYgZ2l2ZW4gb2JqZWN0IGlzIGFuIG9iamVjdCBpdCBjaGVja3MgdGhhdCB0aGUgc2FtZSBrZXlzIGNvbnRhaW4gZGVlcCBlcXVhbCB2YWx1ZXMgKHJlY3Vyc2l2ZSlcbiAgICogT24gb3RoZXIgY2FzZXMgaXQgdHJ5IHRvIGNoZWNrIHdpdGggYC5lcWxgXG4gICAqXG4gICAqIEBuYW1lIGNvbnRhaW5EZWVwT3JkZXJlZFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gY29udGFpblxuICAgKiBAcGFyYW0geyp9IG90aGVyIE5lc3RlZCBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogWyAxLCAyLCAzXS5zaG91bGQuY29udGFpbkRlZXBPcmRlcmVkKFsxLCAyXSk7XG4gICAqIFsgMSwgMiwgWyAxLCAyLCAzIF1dLnNob3VsZC5jb250YWluRGVlcE9yZGVyZWQoWyAxLCBbIDIsIDMgXV0pO1xuICAgKlxuICAgKiAoeyBhOiAxMCwgYjogeyBjOiAxMCwgZDogWzEsIDIsIDNdIH19KS5zaG91bGQuY29udGFpbkRlZXBPcmRlcmVkKHthOiAxMH0pO1xuICAgKiAoeyBhOiAxMCwgYjogeyBjOiAxMCwgZDogWzEsIDIsIDNdIH19KS5zaG91bGQuY29udGFpbkRlZXBPcmRlcmVkKHtiOiB7YzogMTB9fSk7XG4gICAqICh7IGE6IDEwLCBiOiB7IGM6IDEwLCBkOiBbMSwgMiwgM10gfX0pLnNob3VsZC5jb250YWluRGVlcE9yZGVyZWQoe2I6IHtkOiBbMSwgM119fSk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdjb250YWluRGVlcE9yZGVyZWQnLCBmdW5jdGlvbihvdGhlcikge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gY29udGFpbiAnICsgaShvdGhlcil9O1xuXG4gICAgdmFyIG9iaiA9IHRoaXMub2JqO1xuICAgIGlmICh0eXBlb2Ygb2JqID09ICdzdHJpbmcnKSB7Ly8gZXhwZWN0IG90aGVyIHRvIGJlIHN0cmluZ1xuICAgICAgdGhpcy5pcy5lcXVhbChTdHJpbmcob3RoZXIpKTtcbiAgICB9IGVsc2UgaWYgKHV0aWwuaXNJbmRleGFibGUob2JqKSAmJiB1dGlsLmlzSW5kZXhhYmxlKG90aGVyKSkge1xuICAgICAgZm9yICh2YXIgb2JqSWR4ID0gMCwgb3RoZXJJZHggPSAwLCBvYmpMZW5ndGggPSB1dGlsLmxlbmd0aChvYmopLCBvdGhlckxlbmd0aCA9IHV0aWwubGVuZ3RoKG90aGVyKTsgb2JqSWR4IDwgb2JqTGVuZ3RoICYmIG90aGVySWR4IDwgb3RoZXJMZW5ndGg7IG9iaklkeCsrKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgc2hvdWxkKG9ialtvYmpJZHhdKS5jb250YWluRGVlcE9yZGVyZWQob3RoZXJbb3RoZXJJZHhdKTtcbiAgICAgICAgICBvdGhlcklkeCsrO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBzaG91bGQuQXNzZXJ0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXNzZXJ0KG90aGVySWR4ID09PSBvdGhlckxlbmd0aCk7XG4gICAgfSBlbHNlIGlmIChvYmogIT0gbnVsbCAmJiBvdGhlciAhPSBudWxsICYmIHR5cGVvZiBvYmogPT0gJ29iamVjdCcgJiYgdHlwZW9mIG90aGVyID09ICdvYmplY3QnKSB7Ly8gb2JqZWN0IGNvbnRhaW5zIG9iamVjdCBjYXNlXG4gICAgICB1dGlsLmZvckVhY2gob3RoZXIsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgc2hvdWxkKG9ialtrZXldKS5jb250YWluRGVlcE9yZGVyZWQodmFsdWUpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGlmIGJvdGggb2JqZWN0cyBpcyBlbXB0eSBtZWFucyB3ZSBmaW5pc2ggdHJhdmVyc2luZyAtIGFuZCB3ZSBuZWVkIHRvIGNvbXBhcmUgZm9yIGhpZGRlbiB2YWx1ZXNcbiAgICAgIGlmICh1dGlsLmlzRW1wdHlPYmplY3Qob3RoZXIpKSB7XG4gICAgICAgIHRoaXMuZXFsKG90aGVyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lcWwob3RoZXIpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIFRoZSBzYW1lIGxpa2UgYEFzc2VydGlvbiNjb250YWluRGVlcE9yZGVyZWRgIGJ1dCBhbGwgY2hlY2tzIG9uIGFycmF5cyB3aXRob3V0IG9yZGVyLlxuICAgKlxuICAgKiBAbmFtZSBjb250YWluRGVlcFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gY29udGFpblxuICAgKiBAcGFyYW0geyp9IG90aGVyIE5lc3RlZCBvYmplY3RcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogWyAxLCAyLCAzXS5zaG91bGQuY29udGFpbkRlZXAoWzIsIDFdKTtcbiAgICogWyAxLCAyLCBbIDEsIDIsIDMgXV0uc2hvdWxkLmNvbnRhaW5EZWVwKFsgMSwgWyAzLCAxIF1dKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2NvbnRhaW5EZWVwJywgZnVuY3Rpb24ob3RoZXIpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGNvbnRhaW4gJyArIGkob3RoZXIpfTtcblxuICAgIHZhciBvYmogPSB0aGlzLm9iajtcbiAgICBpZiAodHlwZW9mIG9iaiA9PSAnc3RyaW5nJykgey8vIGV4cGVjdCBvdGhlciB0byBiZSBzdHJpbmdcbiAgICAgIHRoaXMuaXMuZXF1YWwoU3RyaW5nKG90aGVyKSk7XG4gICAgfSBlbHNlIGlmICh1dGlsLmlzSW5kZXhhYmxlKG9iaikgJiYgdXRpbC5pc0luZGV4YWJsZShvdGhlcikpIHtcbiAgICAgIHZhciB1c2VkS2V5cyA9IHt9O1xuICAgICAgdXRpbC5mb3JFYWNoKG90aGVyLCBmdW5jdGlvbihvdGhlckl0ZW0pIHtcbiAgICAgICAgdGhpcy5hc3NlcnQodXRpbC5zb21lKG9iaiwgZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICBpZiAoaW5kZXggaW4gdXNlZEtleXMpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzaG91bGQoaXRlbSkuY29udGFpbkRlZXAob3RoZXJJdGVtKTtcbiAgICAgICAgICAgIHVzZWRLZXlzW2luZGV4XSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIHNob3VsZC5Bc3NlcnRpb25FcnJvcikge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfSBlbHNlIGlmIChvYmogIT0gbnVsbCAmJiBvdGhlciAhPSBudWxsICYmIHR5cGVvZiBvYmogPT0gJ29iamVjdCcgJiYgdHlwZW9mIG90aGVyID09ICdvYmplY3QnKSB7Ly8gb2JqZWN0IGNvbnRhaW5zIG9iamVjdCBjYXNlXG4gICAgICB1dGlsLmZvckVhY2gob3RoZXIsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgc2hvdWxkKG9ialtrZXldKS5jb250YWluRGVlcCh2YWx1ZSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gaWYgYm90aCBvYmplY3RzIGlzIGVtcHR5IG1lYW5zIHdlIGZpbmlzaCB0cmF2ZXJzaW5nIC0gYW5kIHdlIG5lZWQgdG8gY29tcGFyZSBmb3IgaGlkZGVuIHZhbHVlc1xuICAgICAgaWYgKHV0aWwuaXNFbXB0eU9iamVjdChvdGhlcikpIHtcbiAgICAgICAgdGhpcy5lcWwob3RoZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVxbChvdGhlcik7XG4gICAgfVxuICB9KTtcblxufTtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbnZhciBlcWwgPSByZXF1aXJlKCdzaG91bGQtZXF1YWwnKTtcbnZhciB0eXBlID0gcmVxdWlyZSgnc2hvdWxkLXR5cGUnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG5mdW5jdGlvbiBmb3JtYXRFcWxSZXN1bHQociwgYSwgYikge1xuICByZXR1cm4gKChyLnBhdGgubGVuZ3RoID4gMCA/ICdhdCAnICsgci5wYXRoLm1hcCh1dGlsLmZvcm1hdFByb3ApLmpvaW4oJyAtPiAnKSA6ICcnKSArXG4gIChyLmEgPT09IGEgPyAnJyA6ICcsIEEgaGFzICcgKyB1dGlsLmZvcm1hdChyLmEpKSArXG4gIChyLmIgPT09IGIgPyAnJyA6ICcgYW5kIEIgaGFzICcgKyB1dGlsLmZvcm1hdChyLmIpKSArXG4gIChyLnNob3dSZWFzb24gPyAnIGJlY2F1c2UgJyArIHIucmVhc29uIDogJycpKS50cmltKCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2hvdWxkLCBBc3NlcnRpb24pIHtcblxuICAvKipcbiAgICogRGVlcCBvYmplY3QgZXF1YWxpdHkgY29tcGFyaXNvbi4gRm9yIGZ1bGwgc3BlYyBzZWUgW2BzaG91bGQtZXF1YWwgdGVzdHNgXShodHRwczovL2dpdGh1Yi5jb20vc2hvdWxkanMvZXF1YWwvYmxvYi9tYXN0ZXIvdGVzdC5qcykuXG4gICAqXG4gICAqIEBuYW1lIGVxbFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gZXF1YWxpdHlcbiAgICogQGFsaWFzIEFzc2VydGlvbiNkZWVwRXF1YWxcbiAgICogQHBhcmFtIHsqfSB2YWwgRXhwZWN0ZWQgdmFsdWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gT3B0aW9uYWwgbWVzc2FnZVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoMTApLnNob3VsZC5iZS5lcWwoMTApO1xuICAgKiAoJzEwJykuc2hvdWxkLm5vdC5iZS5lcWwoMTApO1xuICAgKiAoLTApLnNob3VsZC5ub3QuYmUuZXFsKCswKTtcbiAgICpcbiAgICogTmFOLnNob3VsZC5iZS5lcWwoTmFOKTtcbiAgICpcbiAgICogKHsgYTogMTB9KS5zaG91bGQuYmUuZXFsKHsgYTogMTAgfSk7XG4gICAqIFsgJ2EnIF0uc2hvdWxkLm5vdC5iZS5lcWwoeyAnMCc6ICdhJyB9KTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2VxbCcsIGZ1bmN0aW9uKHZhbCwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGVxdWFsJywgZXhwZWN0ZWQ6IHZhbCwgbWVzc2FnZTogZGVzY3JpcHRpb259O1xuXG4gICAgdmFyIHJlc3VsdCA9IGVxbCh0aGlzLm9iaiwgdmFsLCBzaG91bGQuY29uZmlnKTtcbiAgICB0aGlzLnBhcmFtcy5kZXRhaWxzID0gcmVzdWx0LnJlc3VsdCA/ICcnIDogZm9ybWF0RXFsUmVzdWx0KHJlc3VsdCwgdGhpcy5vYmosIHZhbCk7XG5cbiAgICB0aGlzLnBhcmFtcy5zaG93RGlmZiA9IGVxbCh0eXBlKHRoaXMub2JqKSwgdHlwZSh2YWwpKS5yZXN1bHQ7XG5cbiAgICB0aGlzLmFzc2VydChyZXN1bHQucmVzdWx0KTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEV4YWN0IGNvbXBhcmlzb24gdXNpbmcgPT09LlxuICAgKlxuICAgKiBAbmFtZSBlcXVhbFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gZXF1YWxpdHlcbiAgICogQGFsaWFzIEFzc2VydGlvbiNleGFjdGx5XG4gICAqIEBwYXJhbSB7Kn0gdmFsIEV4cGVjdGVkIHZhbHVlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogMTAuc2hvdWxkLmJlLmVxdWFsKDEwKTtcbiAgICogJ2EnLnNob3VsZC5iZS5leGFjdGx5KCdhJyk7XG4gICAqXG4gICAqIHNob3VsZChudWxsKS5iZS5leGFjdGx5KG51bGwpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnZXF1YWwnLCBmdW5jdGlvbih2YWwsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZScsIGV4cGVjdGVkOiB2YWwsIG1lc3NhZ2U6IGRlc2NyaXB0aW9ufTtcblxuICAgIHRoaXMucGFyYW1zLnNob3dEaWZmID0gZXFsKHR5cGUodGhpcy5vYmopLCB0eXBlKHZhbCkpLnJlc3VsdDtcblxuICAgIHRoaXMuYXNzZXJ0KHZhbCA9PT0gdGhpcy5vYmopO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ2VxdWFsJywgJ2V4YWN0bHknKTtcbiAgQXNzZXJ0aW9uLmFsaWFzKCdlcWwnLCAnZGVlcEVxdWFsJyk7XG5cbiAgZnVuY3Rpb24gYWRkT25lT2YobmFtZSwgbWVzc2FnZSwgbWV0aG9kKSB7XG4gICAgQXNzZXJ0aW9uLmFkZChuYW1lLCBmdW5jdGlvbih2YWxzKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICB2YWxzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNob3VsZCh2YWxzKS5iZS5BcnJheSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogbWVzc2FnZSwgZXhwZWN0ZWQ6IHZhbHN9O1xuXG4gICAgICB2YXIgb2JqID0gdGhpcy5vYmo7XG4gICAgICB2YXIgZm91bmQgPSBmYWxzZTtcblxuICAgICAgdXRpbC5mb3JFYWNoKHZhbHMsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHNob3VsZCh2YWwpW21ldGhvZF0ob2JqKTtcbiAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBzaG91bGQuQXNzZXJ0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybjsvL2RvIG5vdGhpbmdcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYXNzZXJ0KGZvdW5kKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGFjdCBjb21wYXJpc29uIHVzaW5nID09PSB0byBiZSBvbmUgb2Ygc3VwcGxpZWQgb2JqZWN0cy5cbiAgICpcbiAgICogQG5hbWUgZXF1YWxPbmVPZlxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gZXF1YWxpdHlcbiAgICogQHBhcmFtIHtBcnJheXwqfSB2YWxzIEV4cGVjdGVkIHZhbHVlc1xuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAnYWInLnNob3VsZC5iZS5lcXVhbE9uZU9mKCdhJywgMTAsICdhYicpO1xuICAgKiAnYWInLnNob3VsZC5iZS5lcXVhbE9uZU9mKFsnYScsIDEwLCAnYWInXSk7XG4gICAqL1xuICBhZGRPbmVPZignZXF1YWxPbmVPZicsICd0byBiZSBlcXVhbHMgb25lIG9mJywgJ2VxdWFsJyk7XG5cbiAgLyoqXG4gICAqIEV4YWN0IGNvbXBhcmlzb24gdXNpbmcgLmVxbCB0byBiZSBvbmUgb2Ygc3VwcGxpZWQgb2JqZWN0cy5cbiAgICpcbiAgICogQG5hbWUgb25lT2ZcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIGVxdWFsaXR5XG4gICAqIEBwYXJhbSB7QXJyYXl8Kn0gdmFscyBFeHBlY3RlZCB2YWx1ZXNcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKHthOiAxMH0pLnNob3VsZC5iZS5vbmVPZignYScsIDEwLCAnYWInLCB7YTogMTB9KTtcbiAgICogKHthOiAxMH0pLnNob3VsZC5iZS5vbmVPZihbJ2EnLCAxMCwgJ2FiJywge2E6IDEwfV0pO1xuICAgKi9cbiAgYWRkT25lT2YoJ29uZU9mJywgJ3RvIGJlIG9uZSBvZicsICdlcWwnKTtcblxufTtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaG91bGQsIEFzc2VydGlvbikge1xuICB2YXIgaSA9IHNob3VsZC5mb3JtYXQ7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBmdW5jdGlvbiB0aHJvd3MgZXJyb3Igd2l0aCBzdWNoIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBuYW1lIHRocm93XG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBlcnJvcnNcbiAgICogQGFsaWFzIEFzc2VydGlvbiN0aHJvd0Vycm9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cHxGdW5jdGlvbnxPYmplY3R8R2VuZXJhdG9yRnVuY3Rpb258R2VuZXJhdG9yT2JqZWN0fSBbbWVzc2FnZV0gTWVzc2FnZSB0byBtYXRjaCBvciBwcm9wZXJ0aWVzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllc10gT3B0aW9uYWwgcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgbWF0Y2hlZCB0byB0aHJvd24gZXJyb3JcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKGZ1bmN0aW9uKCl7IHRocm93IG5ldyBFcnJvcignZmFpbCcpIH0pLnNob3VsZC50aHJvdygpO1xuICAgKiAoZnVuY3Rpb24oKXsgdGhyb3cgbmV3IEVycm9yKCdmYWlsJykgfSkuc2hvdWxkLnRocm93KCdmYWlsJyk7XG4gICAqIChmdW5jdGlvbigpeyB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWwnKSB9KS5zaG91bGQudGhyb3coL2ZhaWwvKTtcbiAgICpcbiAgICogKGZ1bmN0aW9uKCl7IHRocm93IG5ldyBFcnJvcignZmFpbCcpIH0pLnNob3VsZC50aHJvdyhFcnJvcik7XG4gICAqIHZhciBlcnJvciA9IG5ldyBFcnJvcigpO1xuICAgKiBlcnJvci5hID0gMTA7XG4gICAqIChmdW5jdGlvbigpeyB0aHJvdyBlcnJvcjsgfSkuc2hvdWxkLnRocm93KEVycm9yLCB7IGE6IDEwIH0pO1xuICAgKiAoZnVuY3Rpb24oKXsgdGhyb3cgZXJyb3I7IH0pLnNob3VsZC50aHJvdyh7IGE6IDEwIH0pO1xuICAgKiAoZnVuY3Rpb24qKCkge1xuICAgKiAgIHlpZWxkIHRocm93RXJyb3IoKTtcbiAgICogfSkuc2hvdWxkLnRocm93KCk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCd0aHJvdycsIGZ1bmN0aW9uKG1lc3NhZ2UsIHByb3BlcnRpZXMpIHtcbiAgICB2YXIgZm4gPSB0aGlzLm9iajtcbiAgICB2YXIgZXJyID0ge307XG4gICAgdmFyIGVycm9ySW5mbyA9ICcnO1xuICAgIHZhciB0aHJvd24gPSBmYWxzZTtcblxuICAgIGlmICh1dGlsLmlzR2VuZXJhdG9yRnVuY3Rpb24oZm4pKSB7XG4gICAgICByZXR1cm4gc2hvdWxkKGZuKCkpLnRocm93KG1lc3NhZ2UsIHByb3BlcnRpZXMpO1xuICAgIH0gZWxzZSBpZiAodXRpbC5pc0dlbmVyYXRvck9iamVjdChmbikpIHtcbiAgICAgIHJldHVybiBzaG91bGQoZm4ubmV4dC5iaW5kKGZuKSkudGhyb3cobWVzc2FnZSwgcHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgdGhpcy5pcy5hLkZ1bmN0aW9uKCk7XG5cbiAgICB2YXIgZXJyb3JNYXRjaGVkID0gdHJ1ZTtcblxuICAgIHRyeSB7XG4gICAgICBmbigpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93biA9IHRydWU7XG4gICAgICBlcnIgPSBlO1xuICAgIH1cblxuICAgIGlmICh0aHJvd24pIHtcbiAgICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgbWVzc2FnZSkge1xuICAgICAgICAgIGVycm9yTWF0Y2hlZCA9IG1lc3NhZ2UgPT0gZXJyLm1lc3NhZ2U7XG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgIGVycm9yTWF0Y2hlZCA9IG1lc3NhZ2UudGVzdChlcnIubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgbWVzc2FnZSkge1xuICAgICAgICAgIGVycm9yTWF0Y2hlZCA9IGVyciBpbnN0YW5jZW9mIG1lc3NhZ2U7XG4gICAgICAgIH0gZWxzZSBpZiAobnVsbCAhPSBtZXNzYWdlKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNob3VsZChlcnIpLm1hdGNoKG1lc3NhZ2UpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2Ygc2hvdWxkLkFzc2VydGlvbkVycm9yKSB7XG4gICAgICAgICAgICAgIGVycm9ySW5mbyA9IFwiOiBcIiArIGUubWVzc2FnZTtcbiAgICAgICAgICAgICAgZXJyb3JNYXRjaGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZXJyb3JNYXRjaGVkKSB7XG4gICAgICAgICAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiBtZXNzYWdlIHx8IG1lc3NhZ2UgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIGVycm9ySW5mbyA9IFwiIHdpdGggYSBtZXNzYWdlIG1hdGNoaW5nIFwiICsgaShtZXNzYWdlKSArIFwiLCBidXQgZ290ICdcIiArIGVyci5tZXNzYWdlICsgXCInXCI7XG4gICAgICAgICAgfSBlbHNlIGlmICgnZnVuY3Rpb24nID09IHR5cGVvZiBtZXNzYWdlKSB7XG4gICAgICAgICAgICBlcnJvckluZm8gPSBcIiBvZiB0eXBlIFwiICsgdXRpbC5mdW5jdGlvbk5hbWUobWVzc2FnZSkgKyBcIiwgYnV0IGdvdCBcIiArIHV0aWwuZnVuY3Rpb25OYW1lKGVyci5jb25zdHJ1Y3Rvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCdmdW5jdGlvbicgPT0gdHlwZW9mIG1lc3NhZ2UgJiYgcHJvcGVydGllcykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzaG91bGQoZXJyKS5tYXRjaChwcm9wZXJ0aWVzKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIHNob3VsZC5Bc3NlcnRpb25FcnJvcikge1xuICAgICAgICAgICAgICBlcnJvckluZm8gPSBcIjogXCIgKyBlLm1lc3NhZ2U7XG4gICAgICAgICAgICAgIGVycm9yTWF0Y2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9ySW5mbyA9IFwiIChnb3QgXCIgKyBpKGVycikgKyBcIilcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBhcmFtcyA9IHsgb3BlcmF0b3I6ICd0byB0aHJvdyBleGNlcHRpb24nICsgZXJyb3JJbmZvIH07XG5cbiAgICB0aGlzLmFzc2VydCh0aHJvd24pO1xuICAgIHRoaXMuYXNzZXJ0KGVycm9yTWF0Y2hlZCk7XG4gIH0pO1xuXG4gIEFzc2VydGlvbi5hbGlhcygndGhyb3cnLCAndGhyb3dFcnJvcicpO1xufTtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xudmFyIGVxbCA9IHJlcXVpcmUoJ3Nob3VsZC1lcXVhbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNob3VsZCwgQXNzZXJ0aW9uKSB7XG4gIHZhciBpID0gc2hvdWxkLmZvcm1hdDtcblxuICAvKipcbiAgICogQXNzZXJ0cyBpZiBnaXZlbiBvYmplY3QgbWF0Y2ggYG90aGVyYCBvYmplY3QsIHVzaW5nIHNvbWUgYXNzdW1wdGlvbnM6XG4gICAqIEZpcnN0IG9iamVjdCBtYXRjaGVkIGlmIHRoZXkgYXJlIGVxdWFsLFxuICAgKiBJZiBgb3RoZXJgIGlzIGEgcmVnZXhwIGFuZCBnaXZlbiBvYmplY3QgaXMgYSBzdHJpbmcgY2hlY2sgb24gbWF0Y2hpbmcgd2l0aCByZWdleHBcbiAgICogSWYgYG90aGVyYCBpcyBhIHJlZ2V4cCBhbmQgZ2l2ZW4gb2JqZWN0IGlzIGFuIGFycmF5IGNoZWNrIGlmIGFsbCBlbGVtZW50cyBtYXRjaGVkIHJlZ2V4cFxuICAgKiBJZiBgb3RoZXJgIGlzIGEgcmVnZXhwIGFuZCBnaXZlbiBvYmplY3QgaXMgYW4gb2JqZWN0IGNoZWNrIHZhbHVlcyBvbiBtYXRjaGluZyByZWdleHBcbiAgICogSWYgYG90aGVyYCBpcyBhIGZ1bmN0aW9uIGNoZWNrIGlmIHRoaXMgZnVuY3Rpb24gdGhyb3dzIEFzc2VydGlvbkVycm9yIG9uIGdpdmVuIG9iamVjdCBvciByZXR1cm4gZmFsc2UgLSBpdCB3aWxsIGJlIGFzc3VtZWQgYXMgbm90IG1hdGNoZWRcbiAgICogSWYgYG90aGVyYCBpcyBhbiBvYmplY3QgY2hlY2sgaWYgdGhlIHNhbWUga2V5cyBtYXRjaGVkIHdpdGggYWJvdmUgcnVsZXNcbiAgICogQWxsIG90aGVyIGNhc2VzIGZhaWxlZC5cbiAgICpcbiAgICogVXN1YWxseSBpdCBpcyByaWdodCBpZGVhIHRvIGFkZCBwcmUgdHlwZSBhc3NlcnRpb25zLCBsaWtlIGAuU3RyaW5nKClgIG9yIGAuT2JqZWN0KClgIHRvIGJlIHN1cmUgYXNzZXJ0aW9ucyB3aWxsIGRvIHdoYXQgeW91IGFyZSBleHBlY3RpbmcuXG4gICAqIE9iamVjdCBpdGVyYXRpb24gaGFwcGVuIGJ5IGtleXMgKHByb3BlcnRpZXMgd2l0aCBlbnVtZXJhYmxlOiB0cnVlKSwgdGh1cyBzb21lIG9iamVjdHMgY2FuIGNhdXNlIHNtYWxsIHBhaW4uIFR5cGljYWwgZXhhbXBsZSBpcyBqc1xuICAgKiBFcnJvciAtIGl0IGJ5IGRlZmF1bHQgaGFzIDIgcHJvcGVydGllcyBgbmFtZWAgYW5kIGBtZXNzYWdlYCwgYnV0IHRoZXkgYm90aCBub24tZW51bWVyYWJsZS4gSW4gdGhpcyBjYXNlIG1ha2Ugc3VyZSB5b3Ugc3BlY2lmeSBjaGVja2luZyBwcm9wcyAoc2VlIGV4YW1wbGVzKS5cbiAgICpcbiAgICogQG5hbWUgbWF0Y2hcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIG1hdGNoaW5nXG4gICAqIEBwYXJhbSB7Kn0gb3RoZXIgT2JqZWN0IHRvIG1hdGNoXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICogJ2Zvb2Jhcicuc2hvdWxkLm1hdGNoKC9eZm9vLyk7XG4gICAqICdmb29iYXInLnNob3VsZC5ub3QubWF0Y2goL15iYXIvKTtcbiAgICpcbiAgICogKHsgYTogJ2ZvbycsIGM6ICdiYXJmb28nIH0pLnNob3VsZC5tYXRjaCgvZm9vJC8pO1xuICAgKlxuICAgKiBbJ2EnLCAnYicsICdjJ10uc2hvdWxkLm1hdGNoKC9bYS16XS8pO1xuICAgKlxuICAgKiAoNSkuc2hvdWxkLm5vdC5tYXRjaChmdW5jdGlvbihuKSB7XG4gICAqICAgcmV0dXJuIG4gPCAwO1xuICAgKiB9KTtcbiAgICogKDUpLnNob3VsZC5ub3QubWF0Y2goZnVuY3Rpb24oaXQpIHtcbiAgICogICAgaXQuc2hvdWxkLmJlLmFuLkFycmF5KCk7XG4gICAqIH0pO1xuICAgKiAoeyBhOiAxMCwgYjogJ2FiYycsIGM6IHsgZDogMTAgfSwgZDogMCB9KS5zaG91bGRcbiAgICogLm1hdGNoKHsgYTogMTAsIGI6IC9jJC8sIGM6IGZ1bmN0aW9uKGl0KSB7XG4gICAqICAgIHJldHVybiBpdC5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnZCcsIDEwKTtcbiAgICogfX0pO1xuICAgKlxuICAgKiBbMTAsICdhYmMnLCB7IGQ6IDEwIH0sIDBdLnNob3VsZFxuICAgKiAubWF0Y2goeyAnMCc6IDEwLCAnMSc6IC9jJC8sICcyJzogZnVuY3Rpb24oaXQpIHtcbiAgICogICAgcmV0dXJuIGl0LnNob3VsZC5oYXZlLnByb3BlcnR5KCdkJywgMTApO1xuICAgKiB9fSk7XG4gICAqXG4gICAqIHZhciBteVN0cmluZyA9ICdhYmMnO1xuICAgKlxuICAgKiBteVN0cmluZy5zaG91bGQuYmUuYS5TdHJpbmcoKS5hbmQubWF0Y2goL2FiYy8pO1xuICAgKlxuICAgKiBteVN0cmluZyA9IHt9O1xuICAgKlxuICAgKiBteVN0cmluZy5zaG91bGQubWF0Y2goL2FiYy8pOyAvL3llcyB0aGlzIHdpbGwgcGFzc1xuICAgKiAvL2JldHRlciB0byBkb1xuICAgKiBteVN0cmluZy5zaG91bGQuYmUuYW4uT2JqZWN0KCkuYW5kLm5vdC5lbXB0eSgpLmFuZC5tYXRjaCgvYWJjLyk7Ly9maXhlZFxuICAgKlxuICAgKiAobmV3IEVycm9yKCdib29tJykpLnNob3VsZC5tYXRjaCgvYWJjLyk7Ly9wYXNzZWQgYmVjYXVzZSBubyBrZXlzXG4gICAqIChuZXcgRXJyb3IoJ2Jvb20nKSkuc2hvdWxkLm5vdC5tYXRjaCh7IG1lc3NhZ2U6IC9hYmMvIH0pOy8vY2hlY2sgc3BlY2lmaWVkIHByb3BlcnR5XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdtYXRjaCcsIGZ1bmN0aW9uKG90aGVyLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gbWF0Y2ggJyArIGkob3RoZXIpLCBtZXNzYWdlOiBkZXNjcmlwdGlvbn07XG5cbiAgICBpZiAoIWVxbCh0aGlzLm9iaiwgb3RoZXIpLnJlc3VsdCkge1xuICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgUmVnRXhwKSB7IC8vIHNvbWV0aGluZyAtIHJlZ2V4XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9iaiA9PSAnc3RyaW5nJykge1xuXG4gICAgICAgICAgdGhpcy5hc3NlcnQob3RoZXIuZXhlYyh0aGlzLm9iaikpO1xuICAgICAgICB9IGVsc2UgaWYgKHV0aWwuaXNJbmRleGFibGUodGhpcy5vYmopKSB7XG4gICAgICAgICAgdXRpbC5mb3JFYWNoKHRoaXMub2JqLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICB0aGlzLmFzc2VydChvdGhlci5leGVjKGl0ZW0pKTsvLyBzaG91bGQgd2UgdHJ5IHRvIGNvbnZlcnQgdG8gU3RyaW5nIGFuZCBleGVjP1xuICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKG51bGwgIT0gdGhpcy5vYmogJiYgdHlwZW9mIHRoaXMub2JqID09ICdvYmplY3QnKSB7XG5cbiAgICAgICAgICB2YXIgbm90TWF0Y2hlZFByb3BzID0gW10sIG1hdGNoZWRQcm9wcyA9IFtdO1xuICAgICAgICAgIHV0aWwuZm9yRWFjaCh0aGlzLm9iaiwgZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgICAgIGlmIChvdGhlci5leGVjKHZhbHVlKSkgbWF0Y2hlZFByb3BzLnB1c2godXRpbC5mb3JtYXRQcm9wKG5hbWUpKTtcbiAgICAgICAgICAgIGVsc2Ugbm90TWF0Y2hlZFByb3BzLnB1c2godXRpbC5mb3JtYXRQcm9wKG5hbWUpICsgJyAoJyArIGkodmFsdWUpICsgJyknKTtcbiAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgIGlmIChub3RNYXRjaGVkUHJvcHMubGVuZ3RoKVxuICAgICAgICAgICAgdGhpcy5wYXJhbXMub3BlcmF0b3IgKz0gJ1xcbiAgICBub3QgbWF0Y2hlZCBwcm9wZXJ0aWVzOiAnICsgbm90TWF0Y2hlZFByb3BzLmpvaW4oJywgJyk7XG4gICAgICAgICAgaWYgKG1hdGNoZWRQcm9wcy5sZW5ndGgpXG4gICAgICAgICAgICB0aGlzLnBhcmFtcy5vcGVyYXRvciArPSAnXFxuICAgIG1hdGNoZWQgcHJvcGVydGllczogJyArIG1hdGNoZWRQcm9wcy5qb2luKCcsICcpO1xuXG4gICAgICAgICAgdGhpcy5hc3NlcnQobm90TWF0Y2hlZFByb3BzLmxlbmd0aCA9PT0gMCk7XG4gICAgICAgIH0gLy8gc2hvdWxkIHdlIHRyeSB0byBjb252ZXJ0IHRvIFN0cmluZyBhbmQgZXhlYz9cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG90aGVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIHJlcztcblxuICAgICAgICByZXMgPSBvdGhlcih0aGlzLm9iaik7XG5cbiAgICAgICAgLy9pZihyZXMgaW5zdGFuY2VvZiBBc3NlcnRpb24pIHtcbiAgICAgICAgLy8gIHRoaXMucGFyYW1zLm9wZXJhdG9yICs9ICdcXG4gICAgJyArIHJlcy5nZXRNZXNzYWdlKCk7XG4gICAgICAgIC8vfVxuXG4gICAgICAgIC8vaWYgd2UgdGhyb3cgZXhjZXB0aW9uIG9rIC0gaXQgaXMgdXNlZCAuc2hvdWxkIGluc2lkZVxuICAgICAgICBpZiAodHlwZW9mIHJlcyA9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB0aGlzLmFzc2VydChyZXMpOyAvLyBpZiBpdCBpcyBqdXN0IGJvb2xlYW4gZnVuY3Rpb24gYXNzZXJ0IG9uIGl0XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAob3RoZXIgIT0gbnVsbCAmJiB0aGlzLm9iaiAhPSBudWxsICYmIHR5cGVvZiBvdGhlciA9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdGhpcy5vYmogPT0gJ29iamVjdCcpIHsgLy8gdHJ5IHRvIG1hdGNoIHByb3BlcnRpZXMgKGZvciBPYmplY3QgYW5kIEFycmF5KVxuICAgICAgICBub3RNYXRjaGVkUHJvcHMgPSBbXTtcbiAgICAgICAgbWF0Y2hlZFByb3BzID0gW107XG5cbiAgICAgICAgdXRpbC5mb3JFYWNoKG90aGVyLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNob3VsZCh0aGlzLm9iaikuaGF2ZS5wcm9wZXJ0eShrZXkpLndoaWNoLm1hdGNoKHZhbHVlKTtcbiAgICAgICAgICAgIG1hdGNoZWRQcm9wcy5wdXNoKHV0aWwuZm9ybWF0UHJvcChrZXkpKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIHNob3VsZC5Bc3NlcnRpb25FcnJvcikge1xuICAgICAgICAgICAgICBub3RNYXRjaGVkUHJvcHMucHVzaCh1dGlsLmZvcm1hdFByb3Aoa2V5KSArICcgKCcgKyBpKHRoaXMub2JqW2tleV0pICsgJyknKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICBpZiAobm90TWF0Y2hlZFByb3BzLmxlbmd0aClcbiAgICAgICAgICB0aGlzLnBhcmFtcy5vcGVyYXRvciArPSAnXFxuICAgIG5vdCBtYXRjaGVkIHByb3BlcnRpZXM6ICcgKyBub3RNYXRjaGVkUHJvcHMuam9pbignLCAnKTtcbiAgICAgICAgaWYgKG1hdGNoZWRQcm9wcy5sZW5ndGgpXG4gICAgICAgICAgdGhpcy5wYXJhbXMub3BlcmF0b3IgKz0gJ1xcbiAgICBtYXRjaGVkIHByb3BlcnRpZXM6ICcgKyBtYXRjaGVkUHJvcHMuam9pbignLCAnKTtcblxuICAgICAgICB0aGlzLmFzc2VydChub3RNYXRjaGVkUHJvcHMubGVuZ3RoID09PSAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYXNzZXJ0KGZhbHNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnRzIGlmIGdpdmVuIG9iamVjdCB2YWx1ZXMgb3IgYXJyYXkgZWxlbWVudHMgYWxsIG1hdGNoIGBvdGhlcmAgb2JqZWN0LCB1c2luZyBzb21lIGFzc3VtcHRpb25zOlxuICAgKiBGaXJzdCBvYmplY3QgbWF0Y2hlZCBpZiB0aGV5IGFyZSBlcXVhbCxcbiAgICogSWYgYG90aGVyYCBpcyBhIHJlZ2V4cCAtIG1hdGNoaW5nIHdpdGggcmVnZXhwXG4gICAqIElmIGBvdGhlcmAgaXMgYSBmdW5jdGlvbiBjaGVjayBpZiB0aGlzIGZ1bmN0aW9uIHRocm93cyBBc3NlcnRpb25FcnJvciBvbiBnaXZlbiBvYmplY3Qgb3IgcmV0dXJuIGZhbHNlIC0gaXQgd2lsbCBiZSBhc3N1bWVkIGFzIG5vdCBtYXRjaGVkXG4gICAqIEFsbCBvdGhlciBjYXNlcyBjaGVjayBpZiB0aGlzIGBvdGhlcmAgZXF1YWwgdG8gZWFjaCBlbGVtZW50XG4gICAqXG4gICAqIEBuYW1lIG1hdGNoRWFjaFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gbWF0Y2hpbmdcbiAgICogQGFsaWFzIEFzc2VydGlvbiNtYXRjaEV2ZXJ5XG4gICAqIEBwYXJhbSB7Kn0gb3RoZXIgT2JqZWN0IHRvIG1hdGNoXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICogWyAnYScsICdiJywgJ2MnXS5zaG91bGQubWF0Y2hFYWNoKC9cXHcrLyk7XG4gICAqIFsgJ2EnLCAnYScsICdhJ10uc2hvdWxkLm1hdGNoRWFjaCgnYScpO1xuICAgKlxuICAgKiBbICdhJywgJ2EnLCAnYSddLnNob3VsZC5tYXRjaEVhY2goZnVuY3Rpb24odmFsdWUpIHsgdmFsdWUuc2hvdWxkLmJlLmVxbCgnYScpIH0pO1xuICAgKlxuICAgKiB7IGE6ICdhJywgYjogJ2EnLCBjOiAnYScgfS5zaG91bGQubWF0Y2hFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IHZhbHVlLnNob3VsZC5iZS5lcWwoJ2EnKSB9KTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ21hdGNoRWFjaCcsIGZ1bmN0aW9uKG90aGVyLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gbWF0Y2ggZWFjaCAnICsgaShvdGhlciksIG1lc3NhZ2U6IGRlc2NyaXB0aW9ufTtcblxuICAgIHV0aWwuZm9yRWFjaCh0aGlzLm9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHNob3VsZCh2YWx1ZSkubWF0Y2gob3RoZXIpO1xuICAgIH0sIHRoaXMpO1xuICB9KTtcblxuICAvKipcbiAgKiBBc3NlcnRzIGlmIGFueSBvZiBnaXZlbiBvYmplY3QgdmFsdWVzIG9yIGFycmF5IGVsZW1lbnRzIG1hdGNoIGBvdGhlcmAgb2JqZWN0LCB1c2luZyBzb21lIGFzc3VtcHRpb25zOlxuICAqIEZpcnN0IG9iamVjdCBtYXRjaGVkIGlmIHRoZXkgYXJlIGVxdWFsLFxuICAqIElmIGBvdGhlcmAgaXMgYSByZWdleHAgLSBtYXRjaGluZyB3aXRoIHJlZ2V4cFxuICAqIElmIGBvdGhlcmAgaXMgYSBmdW5jdGlvbiBjaGVjayBpZiB0aGlzIGZ1bmN0aW9uIHRocm93cyBBc3NlcnRpb25FcnJvciBvbiBnaXZlbiBvYmplY3Qgb3IgcmV0dXJuIGZhbHNlIC0gaXQgd2lsbCBiZSBhc3N1bWVkIGFzIG5vdCBtYXRjaGVkXG4gICogQWxsIG90aGVyIGNhc2VzIGNoZWNrIGlmIHRoaXMgYG90aGVyYCBlcXVhbCB0byBlYWNoIGVsZW1lbnRcbiAgKlxuICAqIEBuYW1lIG1hdGNoQW55XG4gICogQG1lbWJlck9mIEFzc2VydGlvblxuICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gbWF0Y2hpbmdcbiAgKiBAcGFyYW0geyp9IG90aGVyIE9iamVjdCB0byBtYXRjaFxuICAqIEBhbGlhcyBBc3NlcnRpb24jbWF0Y2hTb21lXG4gICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gT3B0aW9uYWwgbWVzc2FnZVxuICAqIEBleGFtcGxlXG4gICogWyAnYScsICdiJywgJ2MnXS5zaG91bGQubWF0Y2hBbnkoL1xcdysvKTtcbiAgKiBbICdhJywgJ2InLCAnYyddLnNob3VsZC5tYXRjaEFueSgnYScpO1xuICAqXG4gICogWyAnYScsICdiJywgJ2MnXS5zaG91bGQubWF0Y2hBbnkoZnVuY3Rpb24odmFsdWUpIHsgdmFsdWUuc2hvdWxkLmJlLmVxbCgnYScpIH0pO1xuICAqXG4gICogeyBhOiAnYScsIGI6ICdiJywgYzogJ2MnIH0uc2hvdWxkLm1hdGNoQW55KGZ1bmN0aW9uKHZhbHVlKSB7IHZhbHVlLnNob3VsZC5iZS5lcWwoJ2EnKSB9KTtcbiAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnbWF0Y2hBbnknLCBmdW5jdGlvbihvdGhlciwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIG1hdGNoIGFueSAnICsgaShvdGhlciksIG1lc3NhZ2U6IGRlc2NyaXB0aW9ufTtcblxuICAgIHRoaXMuYXNzZXJ0KHV0aWwuc29tZSh0aGlzLm9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNob3VsZCh2YWx1ZSkubWF0Y2gob3RoZXIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBzaG91bGQuQXNzZXJ0aW9uRXJyb3IpIHtcbiAgICAgICAgICAvLyBDYXVnaHQgYW4gQXNzZXJ0aW9uRXJyb3IsIHJldHVybiBmYWxzZSB0byB0aGUgaXRlcmF0b3JcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH0pO1xuXG4gIEFzc2VydGlvbi5hbGlhcygnbWF0Y2hBbnknLCAnbWF0Y2hTb21lJyk7XG4gIEFzc2VydGlvbi5hbGlhcygnbWF0Y2hFYWNoJywgJ21hdGNoRXZlcnknKTtcbn07XG4iLCIvKlxuICogc2hvdWxkLmpzIC0gYXNzZXJ0aW9uIGxpYnJhcnlcbiAqIENvcHlyaWdodChjKSAyMDEwLTIwMTMgVEogSG9sb3dheWNodWsgPHRqQHZpc2lvbi1tZWRpYS5jYT5cbiAqIENvcHlyaWdodChjKSAyMDEzLTIwMTYgRGVuaXMgQmFyZGFkeW0gPGJhcmRhZHltY2hpa0BnbWFpbC5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNob3VsZCwgQXNzZXJ0aW9uKSB7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgTmFOXG4gICAqIEBuYW1lIE5hTlxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gbnVtYmVyc1xuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoMTApLnNob3VsZC5ub3QuYmUuTmFOKCk7XG4gICAqIE5hTi5zaG91bGQuYmUuTmFOKCk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdOYU4nLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHsgb3BlcmF0b3I6ICd0byBiZSBOYU4nIH07XG5cbiAgICB0aGlzLmFzc2VydCh0aGlzLm9iaiAhPT0gdGhpcy5vYmopO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBub3QgZmluaXRlIChwb3NpdGl2ZSBvciBuZWdhdGl2ZSlcbiAgICpcbiAgICogQG5hbWUgSW5maW5pdHlcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIG51bWJlcnNcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKDEwKS5zaG91bGQubm90LmJlLkluZmluaXR5KCk7XG4gICAqIE5hTi5zaG91bGQubm90LmJlLkluZmluaXR5KCk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdJbmZpbml0eScsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFyYW1zID0geyBvcGVyYXRvcjogJ3RvIGJlIEluZmluaXR5JyB9O1xuXG4gICAgdGhpcy5pcy5hLk51bWJlcigpXG4gICAgICAuYW5kLm5vdC5hLk5hTigpXG4gICAgICAuYW5kLmFzc2VydCghaXNGaW5pdGUodGhpcy5vYmopKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBudW1iZXIgYmV0d2VlbiBgc3RhcnRgIGFuZCBgZmluaXNoYCBvciBlcXVhbCBvbmUgb2YgdGhlbS5cbiAgICpcbiAgICogQG5hbWUgd2l0aGluXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBudW1iZXJzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBTdGFydCBudW1iZXJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGZpbmlzaCBGaW5pc2ggbnVtYmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKDEwKS5zaG91bGQuYmUud2l0aGluKDAsIDIwKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ3dpdGhpbicsIGZ1bmN0aW9uKHN0YXJ0LCBmaW5pc2gsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7IG9wZXJhdG9yOiAndG8gYmUgd2l0aGluICcgKyBzdGFydCArICcuLicgKyBmaW5pc2gsIG1lc3NhZ2U6IGRlc2NyaXB0aW9uIH07XG5cbiAgICB0aGlzLmFzc2VydCh0aGlzLm9iaiA+PSBzdGFydCAmJiB0aGlzLm9iaiA8PSBmaW5pc2gpO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG51bWJlciBuZWFyIHNvbWUgb3RoZXIgYHZhbHVlYCB3aXRoaW4gYGRlbHRhYFxuICAgKlxuICAgKiBAbmFtZSBhcHByb3hpbWF0ZWx5XG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBudW1iZXJzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSBDZW50ZXIgbnVtYmVyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkZWx0YSBSYWRpdXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gT3B0aW9uYWwgbWVzc2FnZVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoOS45OSkuc2hvdWxkLmJlLmFwcHJveGltYXRlbHkoMTAsIDAuMSk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdhcHByb3hpbWF0ZWx5JywgZnVuY3Rpb24odmFsdWUsIGRlbHRhLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMucGFyYW1zID0geyBvcGVyYXRvcjogJ3RvIGJlIGFwcHJveGltYXRlbHkgJyArIHZhbHVlICsgJyDCsScgKyBkZWx0YSwgbWVzc2FnZTogZGVzY3JpcHRpb24gfTtcblxuICAgIHRoaXMuYXNzZXJ0KE1hdGguYWJzKHRoaXMub2JqIC0gdmFsdWUpIDw9IGRlbHRhKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBudW1iZXIgYWJvdmUgYG5gLlxuICAgKlxuICAgKiBAbmFtZSBhYm92ZVxuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI2dyZWF0ZXJUaGFuXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBudW1iZXJzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuIE1hcmdpbiBudW1iZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gT3B0aW9uYWwgbWVzc2FnZVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoMTApLnNob3VsZC5iZS5hYm92ZSgwKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2Fib3ZlJywgZnVuY3Rpb24obiwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnBhcmFtcyA9IHsgb3BlcmF0b3I6ICd0byBiZSBhYm92ZSAnICsgbiwgbWVzc2FnZTogZGVzY3JpcHRpb24gfTtcblxuICAgIHRoaXMuYXNzZXJ0KHRoaXMub2JqID4gbik7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gbnVtYmVyIGJlbG93IGBuYC5cbiAgICpcbiAgICogQG5hbWUgYmVsb3dcbiAgICogQGFsaWFzIEFzc2VydGlvbiNsZXNzVGhhblxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gbnVtYmVyc1xuICAgKiBAcGFyYW0ge251bWJlcn0gbiBNYXJnaW4gbnVtYmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKDApLnNob3VsZC5iZS5iZWxvdygxMCk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdiZWxvdycsIGZ1bmN0aW9uKG4sIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7IG9wZXJhdG9yOiAndG8gYmUgYmVsb3cgJyArIG4sIG1lc3NhZ2U6IGRlc2NyaXB0aW9uIH07XG5cbiAgICB0aGlzLmFzc2VydCh0aGlzLm9iaiA8IG4pO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ2Fib3ZlJywgJ2dyZWF0ZXJUaGFuJyk7XG4gIEFzc2VydGlvbi5hbGlhcygnYmVsb3cnLCAnbGVzc1RoYW4nKTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG51bWJlciBhYm92ZSBgbmAuXG4gICAqXG4gICAqIEBuYW1lIGFib3ZlT3JFcXVhbFxuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI2dyZWF0ZXJUaGFuT3JFcXVhbFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gbnVtYmVyc1xuICAgKiBAcGFyYW0ge251bWJlcn0gbiBNYXJnaW4gbnVtYmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKDEwKS5zaG91bGQuYmUuYWJvdmVPckVxdWFsKDApO1xuICAgKiAoMTApLnNob3VsZC5iZS5hYm92ZU9yRXF1YWwoMTApO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnYWJvdmVPckVxdWFsJywgZnVuY3Rpb24obiwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnBhcmFtcyA9IHsgb3BlcmF0b3I6ICd0byBiZSBhYm92ZSBvciBlcXVhbCcgKyBuLCBtZXNzYWdlOiBkZXNjcmlwdGlvbiB9O1xuXG4gICAgdGhpcy5hc3NlcnQodGhpcy5vYmogPj0gbik7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gbnVtYmVyIGJlbG93IGBuYC5cbiAgICpcbiAgICogQG5hbWUgYmVsb3dPckVxdWFsXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jbGVzc1RoYW5PckVxdWFsXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBudW1iZXJzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBuIE1hcmdpbiBudW1iZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gT3B0aW9uYWwgbWVzc2FnZVxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoMCkuc2hvdWxkLmJlLmJlbG93T3JFcXVhbCgxMCk7XG4gICAqICgwKS5zaG91bGQuYmUuYmVsb3dPckVxdWFsKDApO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnYmVsb3dPckVxdWFsJywgZnVuY3Rpb24obiwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnBhcmFtcyA9IHsgb3BlcmF0b3I6ICd0byBiZSBiZWxvdyBvciBlcXVhbCcgKyBuLCBtZXNzYWdlOiBkZXNjcmlwdGlvbiB9O1xuXG4gICAgdGhpcy5hc3NlcnQodGhpcy5vYmogPD0gbik7XG4gIH0pO1xuXG4gIEFzc2VydGlvbi5hbGlhcygnYWJvdmVPckVxdWFsJywgJ2dyZWF0ZXJUaGFuT3JFcXVhbCcpO1xuICBBc3NlcnRpb24uYWxpYXMoJ2JlbG93T3JFcXVhbCcsICdsZXNzVGhhbk9yRXF1YWwnKTtcblxufTtcbiIsIi8qXG4gKiBzaG91bGQuanMgLSBhc3NlcnRpb24gbGlicmFyeVxuICogQ29weXJpZ2h0KGMpIDIwMTAtMjAxMyBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICogQ29weXJpZ2h0KGMpIDIwMTMtMjAxNiBEZW5pcyBCYXJkYWR5bSA8YmFyZGFkeW1jaGlrQGdtYWlsLmNvbT5cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xudmFyIFByb21pc2VkQXNzZXJ0aW9uID0gcmVxdWlyZSgnLi4vYXNzZXJ0aW9uJykuUHJvbWlzZWRBc3NlcnRpb247XG52YXIgQXNzZXJ0aW9uID0gcmVxdWlyZSgnLi4vYXNzZXJ0aW9uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2hvdWxkKSB7XG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIGEgUHJvbWlzZVxuICAgKlxuICAgKiBAbmFtZSBQcm9taXNlXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBwcm9taXNlc1xuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBwcm9taXNlLnNob3VsZC5iZS5Qcm9taXNlKClcbiAgICogKG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkgeyByZXNvbHZlKDEwKTsgfSkpLnNob3VsZC5iZS5hLlByb21pc2UoKVxuICAgKiAoMTApLnNob3VsZC5ub3QuYmUuYS5Qcm9taXNlKClcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ1Byb21pc2UnLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIHByb21pc2UnfTtcblxuICAgIHZhciBvYmogPSB0aGlzLm9iajtcblxuICAgIHNob3VsZChvYmopLmhhdmUucHJvcGVydHkoJ3RoZW4nKVxuICAgICAgLndoaWNoLmlzLmEuRnVuY3Rpb24oKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBwcm9taXNlIHdpbGwgYmUgZnVsZmlsbGVkLiBSZXN1bHQgb2YgYXNzZXJ0aW9uIGlzIHN0aWxsIC50aGVuYWJsZSBhbmQgc2hvdWxkIGJlIGhhbmRsZWQgYWNjb3JkaW5nbHkuXG4gICAqXG4gICAqIEBuYW1lIGZ1bGZpbGxlZFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHByb21pc2VzXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIC8vIGRvbid0IGZvcmdldCB0byBoYW5kbGUgYXN5bmMgbmF0dXJlXG4gICAqIChuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHsgcmVzb2x2ZSgxMCk7IH0pKS5zaG91bGQuYmUuZnVsZmlsbGVkKCk7XG4gICAqXG4gICAqIC8vIHRlc3QgZXhhbXBsZSB3aXRoIG1vY2hhIGl0IGlzIHBvc3NpYmxlIHRvIHJldHVybiBwcm9taXNlXG4gICAqIGl0KCdpcyBhc3luYycsICgpID0+IHtcbiAgICogICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gcmVzb2x2ZSgxMCkpXG4gICAqICAgICAgLnNob3VsZC5iZS5mdWxmaWxsZWQoKTtcbiAgICogfSk7XG4gICAqL1xuICBBc3NlcnRpb24ucHJvdG90eXBlLmZ1bGZpbGxlZCA9IGZ1bmN0aW9uIEFzc2VydGlvbiRmdWxmaWxsZWQoKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBmdWxmaWxsZWQnfTtcblxuICAgIHNob3VsZCh0aGlzLm9iaikuYmUuYS5Qcm9taXNlKCk7XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMub2JqLnRoZW4oZnVuY3Rpb24gbmV4dCRvblJlc29sdmUodmFsdWUpIHtcbiAgICAgIGlmICh0aGF0Lm5lZ2F0ZSkge1xuICAgICAgICB0aGF0LmZhaWwoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LCBmdW5jdGlvbiBuZXh0JG9uUmVqZWN0KGVycikge1xuICAgICAgaWYgKCF0aGF0Lm5lZ2F0ZSkge1xuICAgICAgICB0aGF0LnBhcmFtcy5vcGVyYXRvciArPSAnLCBidXQgaXQgd2FzIHJlamVjdGVkIHdpdGggJyArIHNob3VsZC5mb3JtYXQoZXJyKTtcbiAgICAgICAgdGhhdC5mYWlsKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXJyO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkLiBSZXN1bHQgb2YgYXNzZXJ0aW9uIGlzIHN0aWxsIC50aGVuYWJsZSBhbmQgc2hvdWxkIGJlIGhhbmRsZWQgYWNjb3JkaW5nbHkuXG4gICAqXG4gICAqIEBuYW1lIHJlamVjdGVkXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBwcm9taXNlc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogLy8gZG9uJ3QgZm9yZ2V0IHRvIGhhbmRsZSBhc3luYyBuYXR1cmVcbiAgICogKG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkgeyByZXNvbHZlKDEwKTsgfSkpXG4gICAqICAgIC5zaG91bGQubm90LmJlLnJlamVjdGVkKCk7XG4gICAqXG4gICAqIC8vIHRlc3QgZXhhbXBsZSB3aXRoIG1vY2hhIGl0IGlzIHBvc3NpYmxlIHRvIHJldHVybiBwcm9taXNlXG4gICAqIGl0KCdpcyBhc3luYycsICgpID0+IHtcbiAgICogICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHJlamVjdChuZXcgRXJyb3IoJ2Jvb20nKSkpXG4gICAqICAgICAgLnNob3VsZC5iZS5yZWplY3RlZCgpO1xuICAgKiB9KTtcbiAgICovXG4gIEFzc2VydGlvbi5wcm90b3R5cGUucmVqZWN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIHJlamVjdGVkJ307XG5cbiAgICBzaG91bGQodGhpcy5vYmopLmJlLmEuUHJvbWlzZSgpO1xuXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiB0aGlzLm9iai50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIXRoYXQubmVnYXRlKSB7XG4gICAgICAgIHRoYXQucGFyYW1zLm9wZXJhdG9yICs9ICcsIGJ1dCBpdCB3YXMgZnVsZmlsbGVkJztcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMCkge1xuICAgICAgICAgIHRoYXQucGFyYW1zLm9wZXJhdG9yICs9ICcgd2l0aCAnICsgc2hvdWxkLmZvcm1hdCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5mYWlsKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSwgZnVuY3Rpb24gbmV4dCRvbkVycm9yKGVycikge1xuICAgICAgaWYgKHRoYXQubmVnYXRlKSB7XG4gICAgICAgIHRoYXQuZmFpbCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVycjtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIHByb21pc2Ugd2lsbCBiZSBmdWxmaWxsZWQgd2l0aCBzb21lIGV4cGVjdGVkIHZhbHVlICh2YWx1ZSBjb21wYXJlZCB1c2luZyAuZXFsKS5cbiAgICogUmVzdWx0IG9mIGFzc2VydGlvbiBpcyBzdGlsbCAudGhlbmFibGUgYW5kIHNob3VsZCBiZSBoYW5kbGVkIGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBAbmFtZSBmdWxmaWxsZWRXaXRoXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBwcm9taXNlc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogLy8gZG9uJ3QgZm9yZ2V0IHRvIGhhbmRsZSBhc3luYyBuYXR1cmVcbiAgICogKG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkgeyByZXNvbHZlKDEwKTsgfSkpXG4gICAqICAgIC5zaG91bGQuYmUuZnVsZmlsbGVkV2l0aCgxMCk7XG4gICAqXG4gICAqIC8vIHRlc3QgZXhhbXBsZSB3aXRoIG1vY2hhIGl0IGlzIHBvc3NpYmxlIHRvIHJldHVybiBwcm9taXNlXG4gICAqIGl0KCdpcyBhc3luYycsICgpID0+IHtcbiAgICogICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHJlc29sdmUoMTApKVxuICAgKiAgICAgICAuc2hvdWxkLmJlLmZ1bGZpbGxlZFdpdGgoMTApO1xuICAgKiB9KTtcbiAgICovXG4gIEFzc2VydGlvbi5wcm90b3R5cGUuZnVsZmlsbGVkV2l0aCA9IGZ1bmN0aW9uKGV4cGVjdGVkVmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIGZ1bGZpbGxlZCB3aXRoICcgKyBzaG91bGQuZm9ybWF0KGV4cGVjdGVkVmFsdWUpfTtcblxuICAgIHNob3VsZCh0aGlzLm9iaikuYmUuYS5Qcm9taXNlKCk7XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMub2JqLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmICh0aGF0Lm5lZ2F0ZSkge1xuICAgICAgICB0aGF0LmZhaWwoKTtcbiAgICAgIH1cbiAgICAgIHNob3VsZCh2YWx1ZSkuZXFsKGV4cGVjdGVkVmFsdWUpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sIGZ1bmN0aW9uIG5leHQkb25FcnJvcihlcnIpIHtcbiAgICAgIGlmICghdGhhdC5uZWdhdGUpIHtcbiAgICAgICAgdGhhdC5wYXJhbXMub3BlcmF0b3IgKz0gJywgYnV0IGl0IHdhcyByZWplY3RlZCB3aXRoICcgKyBzaG91bGQuZm9ybWF0KGVycik7XG4gICAgICAgIHRoYXQuZmFpbCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVycjtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoIHNvbWUgc29ydCBvZiBlcnJvci4gQXJndW1lbnRzIGlzIHRoZSBzYW1lIGZvciBBc3NlcnRpb24jdGhyb3cuXG4gICAqIFJlc3VsdCBvZiBhc3NlcnRpb24gaXMgc3RpbGwgLnRoZW5hYmxlIGFuZCBzaG91bGQgYmUgaGFuZGxlZCBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQG5hbWUgcmVqZWN0ZWRXaXRoXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBwcm9taXNlc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogZnVuY3Rpb24gZmFpbGVkUHJvbWlzZSgpIHtcbiAgICogICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAqICAgICByZWplY3QobmV3IEVycm9yKCdib29tJykpXG4gICAqICAgfSlcbiAgICogfVxuICAgKiBmYWlsZWRQcm9taXNlKCkuc2hvdWxkLmJlLnJlamVjdGVkV2l0aChFcnJvcik7XG4gICAqIGZhaWxlZFByb21pc2UoKS5zaG91bGQuYmUucmVqZWN0ZWRXaXRoKCdib29tJyk7XG4gICAqIGZhaWxlZFByb21pc2UoKS5zaG91bGQuYmUucmVqZWN0ZWRXaXRoKC9ib29tLyk7XG4gICAqIGZhaWxlZFByb21pc2UoKS5zaG91bGQuYmUucmVqZWN0ZWRXaXRoKEVycm9yLCB7IG1lc3NhZ2U6ICdib29tJyB9KTtcbiAgICogZmFpbGVkUHJvbWlzZSgpLnNob3VsZC5iZS5yZWplY3RlZFdpdGgoeyBtZXNzYWdlOiAnYm9vbScgfSk7XG4gICAqXG4gICAqIC8vIHRlc3QgZXhhbXBsZSB3aXRoIG1vY2hhIGl0IGlzIHBvc3NpYmxlIHRvIHJldHVybiBwcm9taXNlXG4gICAqIGl0KCdpcyBhc3luYycsICgpID0+IHtcbiAgICogICAgcmV0dXJuIGZhaWxlZFByb21pc2UoKS5zaG91bGQuYmUucmVqZWN0ZWRXaXRoKHsgbWVzc2FnZTogJ2Jvb20nIH0pO1xuICAgKiB9KTtcbiAgICovXG4gIEFzc2VydGlvbi5wcm90b3R5cGUucmVqZWN0ZWRXaXRoID0gZnVuY3Rpb24obWVzc2FnZSwgcHJvcGVydGllcykge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgcmVqZWN0ZWQnfTtcblxuICAgIHNob3VsZCh0aGlzLm9iaikuYmUuYS5Qcm9taXNlKCk7XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMub2JqLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmICghdGhhdC5uZWdhdGUpIHtcbiAgICAgICAgdGhhdC5mYWlsKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSwgZnVuY3Rpb24gbmV4dCRvbkVycm9yKGVycikge1xuICAgICAgaWYgKHRoYXQubmVnYXRlKSB7XG4gICAgICAgIHRoYXQuZmFpbCgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZXJyb3JNYXRjaGVkID0gdHJ1ZTtcbiAgICAgIHZhciBlcnJvckluZm8gPSAnJztcblxuICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgbWVzc2FnZSkge1xuICAgICAgICBlcnJvck1hdGNoZWQgPSBtZXNzYWdlID09PSBlcnIubWVzc2FnZTtcbiAgICAgIH0gZWxzZSBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICBlcnJvck1hdGNoZWQgPSBtZXNzYWdlLnRlc3QoZXJyLm1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgbWVzc2FnZSkge1xuICAgICAgICBlcnJvck1hdGNoZWQgPSBlcnIgaW5zdGFuY2VvZiBtZXNzYWdlO1xuICAgICAgfSBlbHNlIGlmIChtZXNzYWdlICE9PSBudWxsICYmIHR5cGVvZiBtZXNzYWdlID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHNob3VsZChlcnIpLm1hdGNoKG1lc3NhZ2UpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBzaG91bGQuQXNzZXJ0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgIGVycm9ySW5mbyA9ICc6ICcgKyBlLm1lc3NhZ2U7XG4gICAgICAgICAgICBlcnJvck1hdGNoZWQgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFlcnJvck1hdGNoZWQpIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycgfHwgbWVzc2FnZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgIGVycm9ySW5mbyA9ICcgd2l0aCBhIG1lc3NhZ2UgbWF0Y2hpbmcgJyArIHNob3VsZC5mb3JtYXQobWVzc2FnZSkgKyBcIiwgYnV0IGdvdCAnXCIgKyBlcnIubWVzc2FnZSArIFwiJ1wiO1xuICAgICAgICB9IGVsc2UgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBtZXNzYWdlKSB7XG4gICAgICAgICAgZXJyb3JJbmZvID0gJyBvZiB0eXBlICcgKyB1dGlsLmZ1bmN0aW9uTmFtZShtZXNzYWdlKSArICcsIGJ1dCBnb3QgJyArIHV0aWwuZnVuY3Rpb25OYW1lKGVyci5jb25zdHJ1Y3Rvcik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIG1lc3NhZ2UgJiYgcHJvcGVydGllcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHNob3VsZChlcnIpLm1hdGNoKHByb3BlcnRpZXMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBzaG91bGQuQXNzZXJ0aW9uRXJyb3IpIHtcbiAgICAgICAgICAgIGVycm9ySW5mbyA9ICc6ICcgKyBlLm1lc3NhZ2U7XG4gICAgICAgICAgICBlcnJvck1hdGNoZWQgPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhhdC5wYXJhbXMub3BlcmF0b3IgKz0gZXJyb3JJbmZvO1xuXG4gICAgICB0aGF0LmFzc2VydChlcnJvck1hdGNoZWQpO1xuXG4gICAgICByZXR1cm4gZXJyO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIHByb21pc2UgYW5kIHdyYXAgaXQgaW4gUHJvbWlzZWRBc3NlcnRpb24sIHdoaWNoIGhhcyBhbGwgcHJvcGVydGllcyBvZiBBc3NlcnRpb24uXG4gICAqIFRoYXQgbWVhbnMgeW91IGNhbiBjaGFpbiBhcyB3aXRoIHVzdWFsIEFzc2VydGlvbi5cbiAgICogUmVzdWx0IG9mIGFzc2VydGlvbiBpcyBzdGlsbCAudGhlbmFibGUgYW5kIHNob3VsZCBiZSBoYW5kbGVkIGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBAbmFtZSBmaW5hbGx5XG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGFsaWFzIEFzc2VydGlvbiNldmVudHVhbGx5XG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvbWlzZXNcbiAgICogQHJldHVybnMge1Byb21pc2VkQXNzZXJ0aW9ufSBMaWtlIEFzc2VydGlvbiwgYnV0IC50aGVuIHRoaXMub2JqIGluIEFzc2VydGlvblxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAobmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7IHJlc29sdmUoMTApOyB9KSlcbiAgICogICAgLnNob3VsZC5iZS5ldmVudHVhbGx5LmVxdWFsKDEwKTtcbiAgICpcbiAgICogLy8gdGVzdCBleGFtcGxlIHdpdGggbW9jaGEgaXQgaXMgcG9zc2libGUgdG8gcmV0dXJuIHByb21pc2VcbiAgICogaXQoJ2lzIGFzeW5jJywgKCkgPT4ge1xuICAgKiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiByZXNvbHZlKDEwKSlcbiAgICogICAgICAuc2hvdWxkLmJlLmZpbmFsbHkuZXF1YWwoMTApO1xuICAgKiB9KTtcbiAgICovXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBc3NlcnRpb24ucHJvdG90eXBlLCAnZmluYWxseScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc2hvdWxkKHRoaXMub2JqKS5iZS5hLlByb21pc2UoKTtcblxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2VkQXNzZXJ0aW9uKHRoaXMub2JqLnRoZW4oZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHZhciBhID0gc2hvdWxkKG9iaik7XG5cbiAgICAgICAgYS5uZWdhdGUgPSB0aGF0Lm5lZ2F0ZTtcbiAgICAgICAgYS5hbnlPbmUgPSB0aGF0LmFueU9uZTtcblxuICAgICAgICByZXR1cm4gYTtcbiAgICAgIH0pKTtcbiAgICB9XG4gIH0pO1xuXG4gIEFzc2VydGlvbi5hbGlhcygnZmluYWxseScsICdldmVudHVhbGx5Jyk7XG59O1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi91dGlsJyk7XG52YXIgZXFsID0gcmVxdWlyZSgnc2hvdWxkLWVxdWFsJyk7XG5cbnZhciBhU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2hvdWxkLCBBc3NlcnRpb24pIHtcbiAgdmFyIGkgPSBzaG91bGQuZm9ybWF0O1xuICAvKipcbiAgICogQXNzZXJ0cyBnaXZlbiBvYmplY3QgaGFzIHNvbWUgZGVzY3JpcHRvci4gKipPbiBzdWNjZXNzIGl0IGNoYW5nZSBnaXZlbiBvYmplY3QgdG8gYmUgdmFsdWUgb2YgcHJvcGVydHkqKi5cbiAgICpcbiAgICogQG5hbWUgcHJvcGVydHlXaXRoRGVzY3JpcHRvclxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvcGVydHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwcm9wZXJ0eVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGVzYyBEZXNjcmlwdG9yIGxpa2UgdXNlZCBpbiBPYmplY3QuZGVmaW5lUHJvcGVydHkgKG5vdCByZXF1aXJlZCB0byBhZGQgYWxsIHByb3BlcnRpZXMpXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICh7IGE6IDEwIH0pLnNob3VsZC5oYXZlLnByb3BlcnR5V2l0aERlc2NyaXB0b3IoJ2EnLCB7IGVudW1lcmFibGU6IHRydWUgfSk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdwcm9wZXJ0eVdpdGhEZXNjcmlwdG9yJywgZnVuY3Rpb24obmFtZSwgZGVzYykge1xuICAgIHRoaXMucGFyYW1zID0ge2FjdHVhbDogdGhpcy5vYmosIG9wZXJhdG9yOiAndG8gaGF2ZSBvd24gcHJvcGVydHkgd2l0aCBkZXNjcmlwdG9yICcgKyBpKGRlc2MpfTtcbiAgICB2YXIgb2JqID0gdGhpcy5vYmo7XG4gICAgdGhpcy5oYXZlLm93blByb3BlcnR5KG5hbWUpO1xuICAgIHNob3VsZChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE9iamVjdChvYmopLCBuYW1lKSkuaGF2ZS5wcm9wZXJ0aWVzKGRlc2MpO1xuICB9KTtcblxuICBmdW5jdGlvbiBwcm9jZXNzUHJvcHNBcmdzKCkge1xuICAgIHZhciBhcmdzID0ge307XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICBhcmdzLm5hbWVzID0gYVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1swXTtcbiAgICAgIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xuICAgICAgICBhcmdzLm5hbWVzID0gW2FyZ107XG4gICAgICB9IGVsc2UgaWYgKHV0aWwuaXNJbmRleGFibGUoYXJnKSkge1xuICAgICAgICBhcmdzLm5hbWVzID0gYXJnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJncy5uYW1lcyA9IE9iamVjdC5rZXlzKGFyZyk7XG4gICAgICAgIGFyZ3MudmFsdWVzID0gYXJnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJncztcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEFzc2VydHMgZ2l2ZW4gb2JqZWN0IGhhcyBlbnVtZXJhYmxlIHByb3BlcnR5IHdpdGggb3B0aW9uYWxseSB2YWx1ZS4gKipPbiBzdWNjZXNzIGl0IGNoYW5nZSBnaXZlbiBvYmplY3QgdG8gYmUgdmFsdWUgb2YgcHJvcGVydHkqKi5cbiAgICpcbiAgICogQG5hbWUgZW51bWVyYWJsZVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvcGVydHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwcm9wZXJ0eVxuICAgKiBAcGFyYW0geyp9IFt2YWxdIE9wdGlvbmFsIHByb3BlcnR5IHZhbHVlIHRvIGNoZWNrXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICh7IGE6IDEwIH0pLnNob3VsZC5oYXZlLmVudW1lcmFibGUoJ2EnKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2VudW1lcmFibGUnLCBmdW5jdGlvbihuYW1lLCB2YWwpIHtcbiAgICBuYW1lID0gdXRpbC5jb252ZXJ0UHJvcGVydHlOYW1lKG5hbWUpO1xuXG4gICAgdGhpcy5wYXJhbXMgPSB7XG4gICAgICBvcGVyYXRvcjogXCJ0byBoYXZlIGVudW1lcmFibGUgcHJvcGVydHkgXCIgKyB1dGlsLmZvcm1hdFByb3AobmFtZSkgKyAoYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBcIiBlcXVhbCB0byBcIiArIGkodmFsKTogXCJcIilcbiAgICB9O1xuXG4gICAgdmFyIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUgfTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIGRlc2MudmFsdWUgPSB2YWw7XG4gICAgdGhpcy5oYXZlLnByb3BlcnR5V2l0aERlc2NyaXB0b3IobmFtZSwgZGVzYyk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnRzIGdpdmVuIG9iamVjdCBoYXMgZW51bWVyYWJsZSBwcm9wZXJ0aWVzXG4gICAqXG4gICAqIEBuYW1lIGVudW1lcmFibGVzXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBwcm9wZXJ0eVxuICAgKiBAcGFyYW0ge0FycmF5fC4uLnN0cmluZ3xPYmplY3R9IG5hbWVzIE5hbWVzIG9mIHByb3BlcnR5XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICh7IGE6IDEwLCBiOiAxMCB9KS5zaG91bGQuaGF2ZS5lbnVtZXJhYmxlcygnYScpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnZW51bWVyYWJsZXMnLCBmdW5jdGlvbigvKm5hbWVzKi8pIHtcbiAgICB2YXIgYXJncyA9IHByb2Nlc3NQcm9wc0FyZ3MuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblxuICAgIHRoaXMucGFyYW1zID0ge1xuICAgICAgb3BlcmF0b3I6IFwidG8gaGF2ZSBlbnVtZXJhYmxlcyBcIiArIGFyZ3MubmFtZXMubWFwKHV0aWwuZm9ybWF0UHJvcClcbiAgICB9O1xuXG4gICAgdmFyIG9iaiA9IHRoaXMub2JqO1xuICAgIGFyZ3MubmFtZXMuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICBzaG91bGQob2JqKS5oYXZlLmVudW1lcmFibGUobmFtZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnRzIGdpdmVuIG9iamVjdCBoYXMgcHJvcGVydHkgd2l0aCBvcHRpb25hbGx5IHZhbHVlLiAqKk9uIHN1Y2Nlc3MgaXQgY2hhbmdlIGdpdmVuIG9iamVjdCB0byBiZSB2YWx1ZSBvZiBwcm9wZXJ0eSoqLlxuICAgKlxuICAgKiBAbmFtZSBwcm9wZXJ0eVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvcGVydHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwcm9wZXJ0eVxuICAgKiBAcGFyYW0geyp9IFt2YWxdIE9wdGlvbmFsIHByb3BlcnR5IHZhbHVlIHRvIGNoZWNrXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICh7IGE6IDEwIH0pLnNob3VsZC5oYXZlLnByb3BlcnR5KCdhJyk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdwcm9wZXJ0eScsIGZ1bmN0aW9uKG5hbWUsIHZhbCkge1xuICAgIG5hbWUgPSB1dGlsLmNvbnZlcnRQcm9wZXJ0eU5hbWUobmFtZSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICB2YXIgcCA9IHt9O1xuICAgICAgcFtuYW1lXSA9IHZhbDtcbiAgICAgIHRoaXMuaGF2ZS5wcm9wZXJ0aWVzKHApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhdmUucHJvcGVydGllcyhuYW1lKTtcbiAgICB9XG4gICAgdGhpcy5vYmogPSB0aGlzLm9ialtuYW1lXTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgZ2l2ZW4gb2JqZWN0IGhhcyBwcm9wZXJ0aWVzLiBPbiB0aGlzIG1ldGhvZCBhZmZlY3QgLmFueSBtb2RpZmllciwgd2hpY2ggYWxsb3cgdG8gY2hlY2sgbm90IGFsbCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAbmFtZSBwcm9wZXJ0aWVzXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBwcm9wZXJ0eVxuICAgKiBAcGFyYW0ge0FycmF5fC4uLnN0cmluZ3xPYmplY3R9IG5hbWVzIE5hbWVzIG9mIHByb3BlcnR5XG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICh7IGE6IDEwIH0pLnNob3VsZC5oYXZlLnByb3BlcnRpZXMoJ2EnKTtcbiAgICogKHsgYTogMTAsIGI6IDIwIH0pLnNob3VsZC5oYXZlLnByb3BlcnRpZXMoWyAnYScgXSk7XG4gICAqICh7IGE6IDEwLCBiOiAyMCB9KS5zaG91bGQuaGF2ZS5wcm9wZXJ0aWVzKHsgYjogMjAgfSk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdwcm9wZXJ0aWVzJywgZnVuY3Rpb24obmFtZXMpIHtcbiAgICB2YXIgdmFsdWVzID0ge307XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICBuYW1lcyA9IGFTbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShuYW1lcykpIHtcbiAgICAgIGlmICh0eXBlb2YgbmFtZXMgPT0gJ3N0cmluZycgfHwgdHlwZW9mIG5hbWVzID09ICdzeW1ib2wnKSB7XG4gICAgICAgIG5hbWVzID0gW25hbWVzXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlcyA9IG5hbWVzO1xuICAgICAgICBuYW1lcyA9IE9iamVjdC5rZXlzKG5hbWVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgb2JqID0gT2JqZWN0KHRoaXMub2JqKSwgbWlzc2luZ1Byb3BlcnRpZXMgPSBbXTtcblxuICAgIC8vanVzdCBlbnVtZXJhdGUgcHJvcGVydGllcyBhbmQgY2hlY2sgaWYgdGhleSBhbGwgcHJlc2VudFxuICAgIG5hbWVzLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgaWYgKCEobmFtZSBpbiBvYmopKSBtaXNzaW5nUHJvcGVydGllcy5wdXNoKHV0aWwuZm9ybWF0UHJvcChuYW1lKSk7XG4gICAgfSk7XG5cbiAgICB2YXIgcHJvcHMgPSBtaXNzaW5nUHJvcGVydGllcztcbiAgICBpZiAocHJvcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBwcm9wcyA9IG5hbWVzLm1hcCh1dGlsLmZvcm1hdFByb3ApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hbnlPbmUpIHtcbiAgICAgIHByb3BzID0gbmFtZXMuZmlsdGVyKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG1pc3NpbmdQcm9wZXJ0aWVzLmluZGV4T2YodXRpbC5mb3JtYXRQcm9wKG5hbWUpKSA8IDA7XG4gICAgICB9KS5tYXAodXRpbC5mb3JtYXRQcm9wKTtcbiAgICB9XG5cbiAgICB2YXIgb3BlcmF0b3IgPSAocHJvcHMubGVuZ3RoID09PSAxID9cbiAgICAgICAgJ3RvIGhhdmUgcHJvcGVydHkgJyA6ICd0byBoYXZlICcgKyAodGhpcy5hbnlPbmUgPyAnYW55IG9mICcgOiAnJykgKyAncHJvcGVydGllcyAnKSArIHByb3BzLmpvaW4oJywgJyk7XG5cbiAgICB0aGlzLnBhcmFtcyA9IHtvYmo6IHRoaXMub2JqLCBvcGVyYXRvcjogb3BlcmF0b3J9O1xuXG4gICAgLy9jaGVjayB0aGF0IGFsbCBwcm9wZXJ0aWVzIHByZXNlbnRlZFxuICAgIC8vb3IgaWYgd2UgcmVxdWVzdCBvbmUgb2YgdGhlbSB0aGF0IGF0IGxlYXN0IG9uZSB0aGVtIHByZXNlbnRlZFxuICAgIHRoaXMuYXNzZXJ0KG1pc3NpbmdQcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCB8fCAodGhpcy5hbnlPbmUgJiYgbWlzc2luZ1Byb3BlcnRpZXMubGVuZ3RoICE9IG5hbWVzLmxlbmd0aCkpO1xuXG4gICAgLy8gY2hlY2sgaWYgdmFsdWVzIGluIG9iamVjdCBtYXRjaGVkIGV4cGVjdGVkXG4gICAgdmFyIHZhbHVlQ2hlY2tOYW1lcyA9IE9iamVjdC5rZXlzKHZhbHVlcyk7XG4gICAgaWYgKHZhbHVlQ2hlY2tOYW1lcy5sZW5ndGgpIHtcbiAgICAgIHZhciB3cm9uZ1ZhbHVlcyA9IFtdO1xuICAgICAgcHJvcHMgPSBbXTtcblxuICAgICAgLy8gbm93IGNoZWNrIHZhbHVlcywgYXMgdGhlcmUgd2UgaGF2ZSBhbGwgcHJvcGVydGllc1xuICAgICAgdmFsdWVDaGVja05hbWVzLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZXNbbmFtZV07XG4gICAgICAgIGlmICghZXFsKG9ialtuYW1lXSwgdmFsdWUpLnJlc3VsdCkge1xuICAgICAgICAgIHdyb25nVmFsdWVzLnB1c2godXRpbC5mb3JtYXRQcm9wKG5hbWUpICsgJyBvZiAnICsgaSh2YWx1ZSkgKyAnIChnb3QgJyArIGkob2JqW25hbWVdKSArICcpJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvcHMucHVzaCh1dGlsLmZvcm1hdFByb3AobmFtZSkgKyAnIG9mICcgKyBpKHZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoKHdyb25nVmFsdWVzLmxlbmd0aCAhPT0gMCAmJiAhdGhpcy5hbnlPbmUpIHx8ICh0aGlzLmFueU9uZSAmJiBwcm9wcy5sZW5ndGggPT09IDApKSB7XG4gICAgICAgIHByb3BzID0gd3JvbmdWYWx1ZXM7XG4gICAgICB9XG5cbiAgICAgIG9wZXJhdG9yID0gKHByb3BzLmxlbmd0aCA9PT0gMSA/XG4gICAgICAgICd0byBoYXZlIHByb3BlcnR5ICcgOiAndG8gaGF2ZSAnICsgKHRoaXMuYW55T25lID8gJ2FueSBvZiAnIDogJycpICsgJ3Byb3BlcnRpZXMgJykgKyBwcm9wcy5qb2luKCcsICcpO1xuXG4gICAgICB0aGlzLnBhcmFtcyA9IHtvYmo6IHRoaXMub2JqLCBvcGVyYXRvcjogb3BlcmF0b3J9O1xuXG4gICAgICAvL2lmIHRoZXJlIGlzIG5vIG5vdCBtYXRjaGVkIHZhbHVlc1xuICAgICAgLy9vciB0aGVyZSBpcyBhdCBsZWFzdCBvbmUgbWF0Y2hlZFxuICAgICAgdGhpcy5hc3NlcnQod3JvbmdWYWx1ZXMubGVuZ3RoID09PSAwIHx8ICh0aGlzLmFueU9uZSAmJiB3cm9uZ1ZhbHVlcy5sZW5ndGggIT0gdmFsdWVDaGVja05hbWVzLmxlbmd0aCkpO1xuICAgIH1cbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgZ2l2ZW4gb2JqZWN0IGhhcyBwcm9wZXJ0eSBgbGVuZ3RoYCB3aXRoIGdpdmVuIHZhbHVlIGBuYFxuICAgKlxuICAgKiBAbmFtZSBsZW5ndGhcbiAgICogQGFsaWFzIEFzc2VydGlvbiNsZW5ndGhPZlxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvcGVydHlcbiAgICogQHBhcmFtIHtudW1iZXJ9IG4gRXhwZWN0ZWQgbGVuZ3RoXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogWzEsIDJdLnNob3VsZC5oYXZlLmxlbmd0aCgyKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2xlbmd0aCcsIGZ1bmN0aW9uKG4sIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5oYXZlLnByb3BlcnR5KCdsZW5ndGgnLCBuLCBkZXNjcmlwdGlvbik7XG4gIH0pO1xuXG4gIEFzc2VydGlvbi5hbGlhcygnbGVuZ3RoJywgJ2xlbmd0aE9mJyk7XG5cbiAgdmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuICAvKipcbiAgICogQXNzZXJ0cyBnaXZlbiBvYmplY3QgaGFzIG93biBwcm9wZXJ0eS4gKipPbiBzdWNjZXNzIGl0IGNoYW5nZSBnaXZlbiBvYmplY3QgdG8gYmUgdmFsdWUgb2YgcHJvcGVydHkqKi5cbiAgICpcbiAgICogQG5hbWUgb3duUHJvcGVydHlcbiAgICogQGFsaWFzIEFzc2VydGlvbiNoYXNPd25Qcm9wZXJ0eVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvcGVydHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgTmFtZSBvZiBwcm9wZXJ0eVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICh7IGE6IDEwIH0pLnNob3VsZC5oYXZlLm93blByb3BlcnR5KCdhJyk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdvd25Qcm9wZXJ0eScsIGZ1bmN0aW9uKG5hbWUsIGRlc2NyaXB0aW9uKSB7XG4gICAgbmFtZSA9IHV0aWwuY29udmVydFByb3BlcnR5TmFtZShuYW1lKTtcbiAgICB0aGlzLnBhcmFtcyA9IHtcbiAgICAgIGFjdHVhbDogdGhpcy5vYmosXG4gICAgICBvcGVyYXRvcjogJ3RvIGhhdmUgb3duIHByb3BlcnR5ICcgKyB1dGlsLmZvcm1hdFByb3AobmFtZSksXG4gICAgICBtZXNzYWdlOiBkZXNjcmlwdGlvblxuICAgIH07XG5cbiAgICB0aGlzLmFzc2VydChoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMub2JqLCBuYW1lKSk7XG5cbiAgICB0aGlzLm9iaiA9IHRoaXMub2JqW25hbWVdO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ293blByb3BlcnR5JywgJ2hhc093blByb3BlcnR5Jyk7XG5cbiAgLyoqXG4gICAqIEFzc2VydHMgZ2l2ZW4gb2JqZWN0IGlzIGVtcHR5LiBGb3Igc3RyaW5ncywgYXJyYXlzIGFuZCBhcmd1bWVudHMgaXQgY2hlY2tzIC5sZW5ndGggcHJvcGVydHksIGZvciBvYmplY3RzIGl0IGNoZWNrcyBrZXlzLlxuICAgKlxuICAgKiBAbmFtZSBlbXB0eVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvcGVydHlcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogJycuc2hvdWxkLmJlLmVtcHR5KCk7XG4gICAqIFtdLnNob3VsZC5iZS5lbXB0eSgpO1xuICAgKiAoe30pLnNob3VsZC5iZS5lbXB0eSgpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnZW1wdHknLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIGVtcHR5J307XG5cbiAgICBpZiAodXRpbC5sZW5ndGgodGhpcy5vYmopICE9PSB2b2lkIDApIHtcbiAgICAgIHNob3VsZCh0aGlzLm9iaikuaGF2ZS5wcm9wZXJ0eSgnbGVuZ3RoJywgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBvYmogPSBPYmplY3QodGhpcy5vYmopOyAvLyB3cmFwIHRvIHJlZmVyZW5jZSBmb3IgYm9vbGVhbnMgYW5kIG51bWJlcnNcbiAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgIHNob3VsZCh0aGlzLm9iaikubm90LmhhdmUub3duUHJvcGVydHkocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB0cnVlKTtcblxuICAvKipcbiAgICogQXNzZXJ0cyBnaXZlbiBvYmplY3QgaGFzIGV4YWN0IGtleXMuIENvbXBhcmVkIHRvIGBwcm9wZXJ0aWVzYCwgYGtleXNgIGRvZXMgbm90IGFjY2VwdCBPYmplY3QgYXMgYSBhcmd1bWVudC5cbiAgICpcbiAgICogQG5hbWUga2V5c1xuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI2tleVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvcGVydHlcbiAgICogQHBhcmFtIHtBcnJheXwuLi5zdHJpbmd9IFtrZXlzXSBLZXlzIHRvIGNoZWNrXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICh7IGE6IDEwIH0pLnNob3VsZC5oYXZlLmtleXMoJ2EnKTtcbiAgICogKHsgYTogMTAsIGI6IDIwIH0pLnNob3VsZC5oYXZlLmtleXMoJ2EnLCAnYicpO1xuICAgKiAoeyBhOiAxMCwgYjogMjAgfSkuc2hvdWxkLmhhdmUua2V5cyhbICdhJywgJ2InIF0pO1xuICAgKiAoe30pLnNob3VsZC5oYXZlLmtleXMoKTtcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ2tleXMnLCBmdW5jdGlvbihrZXlzKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSBrZXlzID0gYVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHR5cGVvZiBrZXlzID09PSAnc3RyaW5nJykga2V5cyA9IFtrZXlzXTtcbiAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSBrZXlzID0gW107XG5cbiAgICBrZXlzID0ga2V5cy5tYXAoU3RyaW5nKTtcblxuICAgIHZhciBvYmogPSBPYmplY3QodGhpcy5vYmopO1xuXG4gICAgLy8gZmlyc3QgY2hlY2sgaWYgc29tZSBrZXlzIGFyZSBtaXNzaW5nXG4gICAgdmFyIG1pc3NpbmdLZXlzID0gW107XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKCFoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMub2JqLCBrZXkpKVxuICAgICAgICBtaXNzaW5nS2V5cy5wdXNoKHV0aWwuZm9ybWF0UHJvcChrZXkpKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIC8vIHNlY29uZCBjaGVjayBmb3IgZXh0cmEga2V5c1xuICAgIHZhciBleHRyYUtleXMgPSBbXTtcbiAgICBPYmplY3Qua2V5cyhvYmopLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoa2V5cy5pbmRleE9mKGtleSkgPCAwKSB7XG4gICAgICAgIGV4dHJhS2V5cy5wdXNoKHV0aWwuZm9ybWF0UHJvcChrZXkpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciB2ZXJiID0ga2V5cy5sZW5ndGggPT09IDAgPyAndG8gYmUgZW1wdHknIDpcbiAgICAndG8gaGF2ZSAnICsgKGtleXMubGVuZ3RoID09PSAxID8gJ2tleSAnIDogJ2tleXMgJyk7XG5cbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogdmVyYiArIGtleXMubWFwKHV0aWwuZm9ybWF0UHJvcCkuam9pbignLCAnKX07XG5cbiAgICBpZiAobWlzc2luZ0tleXMubGVuZ3RoID4gMClcbiAgICAgIHRoaXMucGFyYW1zLm9wZXJhdG9yICs9ICdcXG5cXHRtaXNzaW5nIGtleXM6ICcgKyBtaXNzaW5nS2V5cy5qb2luKCcsICcpO1xuXG4gICAgaWYgKGV4dHJhS2V5cy5sZW5ndGggPiAwKVxuICAgICAgdGhpcy5wYXJhbXMub3BlcmF0b3IgKz0gJ1xcblxcdGV4dHJhIGtleXM6ICcgKyBleHRyYUtleXMuam9pbignLCAnKTtcblxuICAgIHRoaXMuYXNzZXJ0KG1pc3NpbmdLZXlzLmxlbmd0aCA9PT0gMCAmJiBleHRyYUtleXMubGVuZ3RoID09PSAwKTtcbiAgfSk7XG5cbiAgQXNzZXJ0aW9uLmFsaWFzKFwia2V5c1wiLCBcImtleVwiKTtcblxuICAvKipcbiAgICogQXNzZXJ0cyBnaXZlbiBvYmplY3QgaGFzIG5lc3RlZCBwcm9wZXJ0eSBpbiBkZXB0aCBieSBwYXRoLiAqKk9uIHN1Y2Nlc3MgaXQgY2hhbmdlIGdpdmVuIG9iamVjdCB0byBiZSB2YWx1ZSBvZiBmaW5hbCBwcm9wZXJ0eSoqLlxuICAgKlxuICAgKiBAbmFtZSBwcm9wZXJ0eUJ5UGF0aFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gcHJvcGVydHlcbiAgICogQHBhcmFtIHtBcnJheXwuLi5zdHJpbmd9IHByb3BlcnRpZXMgUHJvcGVydGllcyBwYXRoIHRvIHNlYXJjaFxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAoeyBhOiB7YjogMTB9fSkuc2hvdWxkLmhhdmUucHJvcGVydHlCeVBhdGgoJ2EnLCAnYicpLmVxbCgxMCk7XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdwcm9wZXJ0eUJ5UGF0aCcsIGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHByb3BlcnRpZXMgPSBhU2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIHByb3BlcnRpZXMgPT0gJ3N0cmluZycpIHByb3BlcnRpZXMgPSBbcHJvcGVydGllc107XG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcHJvcGVydGllcyA9IFtdO1xuXG4gICAgdmFyIGFsbFByb3BzID0gcHJvcGVydGllcy5tYXAodXRpbC5mb3JtYXRQcm9wKTtcblxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLm1hcChTdHJpbmcpO1xuXG4gICAgdmFyIG9iaiA9IHNob3VsZChPYmplY3QodGhpcy5vYmopKTtcblxuICAgIHZhciBmb3VuZFByb3BlcnRpZXMgPSBbXTtcblxuICAgIHZhciBjdXJyZW50UHJvcGVydHk7XG4gICAgd2hpbGUgKHByb3BlcnRpZXMubGVuZ3RoKSB7XG4gICAgICBjdXJyZW50UHJvcGVydHkgPSBwcm9wZXJ0aWVzLnNoaWZ0KCk7XG4gICAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGhhdmUgcHJvcGVydHkgYnkgcGF0aCAnICsgYWxsUHJvcHMuam9pbignLCAnKSArICcgLSBmYWlsZWQgb24gJyArIHV0aWwuZm9ybWF0UHJvcChjdXJyZW50UHJvcGVydHkpfTtcbiAgICAgIG9iaiA9IG9iai5oYXZlLnByb3BlcnR5KGN1cnJlbnRQcm9wZXJ0eSk7XG4gICAgICBmb3VuZFByb3BlcnRpZXMucHVzaChjdXJyZW50UHJvcGVydHkpO1xuICAgIH1cblxuICAgIHRoaXMucGFyYW1zID0ge29iajogdGhpcy5vYmosIG9wZXJhdG9yOiAndG8gaGF2ZSBwcm9wZXJ0eSBieSBwYXRoICcgKyBhbGxQcm9wcy5qb2luKCcsICcpfTtcblxuICAgIHRoaXMub2JqID0gb2JqLm9iajtcbiAgfSk7XG59O1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaG91bGQsIEFzc2VydGlvbikge1xuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIHN0cmluZyBzdGFydHMgd2l0aCBwcmVmaXhcbiAgICogQG5hbWUgc3RhcnRXaXRoXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiBzdHJpbmdzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgUHJlZml4XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dIE9wdGlvbmFsIG1lc3NhZ2VcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogJ2FiYycuc2hvdWxkLnN0YXJ0V2l0aCgnYScpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnc3RhcnRXaXRoJywgZnVuY3Rpb24oc3RyLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMucGFyYW1zID0geyBvcGVyYXRvcjogJ3RvIHN0YXJ0IHdpdGggJyArIHNob3VsZC5mb3JtYXQoc3RyKSwgbWVzc2FnZTogZGVzY3JpcHRpb24gfTtcblxuICAgIHRoaXMuYXNzZXJ0KDAgPT09IHRoaXMub2JqLmluZGV4T2Yoc3RyKSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gc3RyaW5nIGVuZHMgd2l0aCBwcmVmaXhcbiAgICogQG5hbWUgZW5kV2l0aFxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gc3RyaW5nc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIFByZWZpeFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICdhYmNhJy5zaG91bGQuZW5kV2l0aCgnYScpO1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnZW5kV2l0aCcsIGZ1bmN0aW9uKHN0ciwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnBhcmFtcyA9IHsgb3BlcmF0b3I6ICd0byBlbmQgd2l0aCAnICsgc2hvdWxkLmZvcm1hdChzdHIpLCBtZXNzYWdlOiBkZXNjcmlwdGlvbiB9O1xuXG4gICAgdGhpcy5hc3NlcnQodGhpcy5vYmouaW5kZXhPZihzdHIsIHRoaXMub2JqLmxlbmd0aCAtIHN0ci5sZW5ndGgpID49IDApO1xuICB9KTtcbn07XG4iLCIvKlxuICogc2hvdWxkLmpzIC0gYXNzZXJ0aW9uIGxpYnJhcnlcbiAqIENvcHlyaWdodChjKSAyMDEwLTIwMTMgVEogSG9sb3dheWNodWsgPHRqQHZpc2lvbi1tZWRpYS5jYT5cbiAqIENvcHlyaWdodChjKSAyMDEzLTIwMTYgRGVuaXMgQmFyZGFkeW0gPGJhcmRhZHltY2hpa0BnbWFpbC5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzaG91bGQsIEFzc2VydGlvbikge1xuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBudW1iZXJcbiAgICogQG5hbWUgTnVtYmVyXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiB0eXBlc1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnTnVtYmVyJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBhIG51bWJlcid9O1xuXG4gICAgdGhpcy5oYXZlLnR5cGUoJ251bWJlcicpO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBhcmd1bWVudHNcbiAgICogQG5hbWUgYXJndW1lbnRzXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jQXJndW1lbnRzXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiB0eXBlc1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnYXJndW1lbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBhcmd1bWVudHMnfTtcblxuICAgIHRoaXMuaGF2ZS5jbGFzcygnQXJndW1lbnRzJyk7XG4gIH0pO1xuXG4gIEFzc2VydGlvbi5hbGlhcygnYXJndW1lbnRzJywgJ0FyZ3VtZW50cycpO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGhhcyBzb21lIHR5cGUgdXNpbmcgYHR5cGVvZmBcbiAgICogQG5hbWUgdHlwZVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFR5cGUgbmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXSBPcHRpb25hbCBtZXNzYWdlXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gdHlwZXNcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ3R5cGUnLCBmdW5jdGlvbih0eXBlLCBkZXNjcmlwdGlvbikge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gaGF2ZSB0eXBlICcgKyB0eXBlLCBtZXNzYWdlOiBkZXNjcmlwdGlvbn07XG5cbiAgICBzaG91bGQodHlwZW9mIHRoaXMub2JqKS5iZS5leGFjdGx5KHR5cGUpO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBpbnN0YW5jZSBvZiBgY29uc3RydWN0b3JgXG4gICAqIEBuYW1lIGluc3RhbmNlb2ZcbiAgICogQGFsaWFzIEFzc2VydGlvbiNpbnN0YW5jZU9mXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29uc3RydWN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gT3B0aW9uYWwgbWVzc2FnZVxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHR5cGVzXG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdpbnN0YW5jZW9mJywgZnVuY3Rpb24oY29uc3RydWN0b3IsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBhbiBpbnN0YW5jZSBvZiAnICsgdXRpbC5mdW5jdGlvbk5hbWUoY29uc3RydWN0b3IpLCBtZXNzYWdlOiBkZXNjcmlwdGlvbn07XG5cbiAgICB0aGlzLmFzc2VydChPYmplY3QodGhpcy5vYmopIGluc3RhbmNlb2YgY29uc3RydWN0b3IpO1xuICB9KTtcblxuICBBc3NlcnRpb24uYWxpYXMoJ2luc3RhbmNlb2YnLCAnaW5zdGFuY2VPZicpO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIGZ1bmN0aW9uXG4gICAqIEBuYW1lIEZ1bmN0aW9uXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiB0eXBlc1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnRnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIGEgZnVuY3Rpb24nfTtcblxuICAgIHRoaXMuaGF2ZS50eXBlKCdmdW5jdGlvbicpO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBvYmplY3RcbiAgICogQG5hbWUgT2JqZWN0XG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiB0eXBlc1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnT2JqZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBhbiBvYmplY3QnfTtcblxuICAgIHRoaXMuaXMubm90Lm51bGwoKS5hbmQuaGF2ZS50eXBlKCdvYmplY3QnKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgc3RyaW5nXG4gICAqIEBuYW1lIFN0cmluZ1xuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gdHlwZXNcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ1N0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgYSBzdHJpbmcnfTtcblxuICAgIHRoaXMuaGF2ZS50eXBlKCdzdHJpbmcnKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgYXJyYXlcbiAgICogQG5hbWUgQXJyYXlcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHR5cGVzXG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdBcnJheScsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgYW4gYXJyYXknfTtcblxuICAgIHRoaXMuaGF2ZS5jbGFzcygnQXJyYXknKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgYm9vbGVhblxuICAgKiBAbmFtZSBCb29sZWFuXG4gICAqIEBtZW1iZXJPZiBBc3NlcnRpb25cbiAgICogQGNhdGVnb3J5IGFzc2VydGlvbiB0eXBlc1xuICAgKi9cbiAgQXNzZXJ0aW9uLmFkZCgnQm9vbGVhbicsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgYSBib29sZWFuJ307XG5cbiAgICB0aGlzLmhhdmUudHlwZSgnYm9vbGVhbicpO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBlcnJvclxuICAgKiBAbmFtZSBFcnJvclxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gdHlwZXNcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ0Vycm9yJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBhbiBlcnJvcid9O1xuXG4gICAgdGhpcy5oYXZlLmluc3RhbmNlT2YoRXJyb3IpO1xuICB9KTtcblxuICAvKipcbiAgICogQXNzZXJ0IGdpdmVuIG9iamVjdCBpcyBhIGRhdGVcbiAgICogQG5hbWUgRGF0ZVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gdHlwZXNcbiAgICovXG4gIEFzc2VydGlvbi5hZGQoJ0RhdGUnLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIGEgZGF0ZSd9O1xuXG4gICAgdGhpcy5oYXZlLmluc3RhbmNlT2YoRGF0ZSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIG51bGxcbiAgICogQG5hbWUgbnVsbFxuICAgKiBAYWxpYXMgQXNzZXJ0aW9uI051bGxcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHR5cGVzXG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdudWxsJywgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7b3BlcmF0b3I6ICd0byBiZSBudWxsJ307XG5cbiAgICB0aGlzLmFzc2VydCh0aGlzLm9iaiA9PT0gbnVsbCk7XG4gIH0pO1xuXG4gIEFzc2VydGlvbi5hbGlhcygnbnVsbCcsICdOdWxsJyk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaGFzIHNvbWUgaW50ZXJuYWwgW1tDbGFzc11dLCB2aWEgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyBjYWxsXG4gICAqIEBuYW1lIGNsYXNzXG4gICAqIEBhbGlhcyBBc3NlcnRpb24jQ2xhc3NcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHR5cGVzXG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdjbGFzcycsIGZ1bmN0aW9uKGNscykge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gaGF2ZSBbW0NsYXNzXV0gJyArIGNsc307XG5cbiAgICB0aGlzLmFzc2VydChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcy5vYmopID09PSAnW29iamVjdCAnICsgY2xzICsgJ10nKTtcbiAgfSk7XG5cbiAgQXNzZXJ0aW9uLmFsaWFzKCdjbGFzcycsICdDbGFzcycpO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IGlzIHVuZGVmaW5lZFxuICAgKiBAbmFtZSB1bmRlZmluZWRcbiAgICogQGFsaWFzIEFzc2VydGlvbiNVbmRlZmluZWRcbiAgICogQG1lbWJlck9mIEFzc2VydGlvblxuICAgKiBAY2F0ZWdvcnkgYXNzZXJ0aW9uIHR5cGVzXG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCd1bmRlZmluZWQnLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIHVuZGVmaW5lZCd9O1xuXG4gICAgdGhpcy5hc3NlcnQodGhpcy5vYmogPT09IHZvaWQgMCk7XG4gIH0pO1xuXG4gIEFzc2VydGlvbi5hbGlhcygndW5kZWZpbmVkJywgJ1VuZGVmaW5lZCcpO1xuXG4gIC8qKlxuICAgKiBBc3NlcnQgZ2l2ZW4gb2JqZWN0IHN1cHBvcnRzIGVzNiBpdGVyYWJsZSBwcm90b2NvbCAoanVzdCBjaGVja1xuICAgKiB0aGF0IG9iamVjdCBoYXMgcHJvcGVydHkgU3ltYm9sLml0ZXJhdG9yLCB3aGljaCBpcyBhIGZ1bmN0aW9uKVxuICAgKiBAbmFtZSBpdGVyYWJsZVxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gZXM2XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdpdGVyYWJsZScsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgaXRlcmFibGUnfTtcblxuICAgIHNob3VsZCh0aGlzLm9iaikuaGF2ZS5wcm9wZXJ0eShTeW1ib2wuaXRlcmF0b3IpLndoaWNoLmlzLmEuRnVuY3Rpb24oKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3Qgc3VwcG9ydHMgZXM2IGl0ZXJhdG9yIHByb3RvY29sIChqdXN0IGNoZWNrXG4gICAqIHRoYXQgb2JqZWN0IGhhcyBwcm9wZXJ0eSBuZXh0LCB3aGljaCBpcyBhIGZ1bmN0aW9uKVxuICAgKiBAbmFtZSBpdGVyYXRvclxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gZXM2XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdpdGVyYXRvcicsIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucGFyYW1zID0ge29wZXJhdG9yOiAndG8gYmUgaXRlcmF0b3InfTtcblxuICAgIHNob3VsZCh0aGlzLm9iaikuaGF2ZS5wcm9wZXJ0eSgnbmV4dCcpLndoaWNoLmlzLmEuRnVuY3Rpb24oKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIEFzc2VydCBnaXZlbiBvYmplY3QgaXMgYSBnZW5lcmF0b3Igb2JqZWN0XG4gICAqIEBuYW1lIGdlbmVyYXRvclxuICAgKiBAbWVtYmVyT2YgQXNzZXJ0aW9uXG4gICAqIEBjYXRlZ29yeSBhc3NlcnRpb24gZXM2XG4gICAqL1xuICBBc3NlcnRpb24uYWRkKCdnZW5lcmF0b3InLCBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtvcGVyYXRvcjogJ3RvIGJlIGdlbmVyYXRvcid9O1xuXG4gICAgc2hvdWxkKHRoaXMub2JqKS5iZS5pdGVyYWJsZVxuICAgICAgLmFuZC5pdGVyYXRvclxuICAgICAgLmFuZC5pdC5pcy5lcXVhbCh0aGlzLm9ialtTeW1ib2wuaXRlcmF0b3JdKCkpO1xuICB9KTtcbn07XG4iLCIvKlxuICogc2hvdWxkLmpzIC0gYXNzZXJ0aW9uIGxpYnJhcnlcbiAqIENvcHlyaWdodChjKSAyMDEwLTIwMTMgVEogSG9sb3dheWNodWsgPHRqQHZpc2lvbi1tZWRpYS5jYT5cbiAqIENvcHlyaWdodChjKSAyMDEzLTIwMTYgRGVuaXMgQmFyZGFkeW0gPGJhcmRhZHltY2hpa0BnbWFpbC5jb20+XG4gKiBNSVQgTGljZW5zZWRcbiAqL1xuXG5cbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8qKlxuICogT3VyIGZ1bmN0aW9uIHNob3VsZFxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqIE9iamVjdCB0byBhc3NlcnRcbiAqIEByZXR1cm5zIHtzaG91bGQuQXNzZXJ0aW9ufSBSZXR1cm5zIG5ldyBBc3NlcnRpb24gZm9yIGJlZ2lubmluZyBhc3NlcnRpb24gY2hhaW5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHNob3VsZCA9IHJlcXVpcmUoJ3Nob3VsZCcpO1xuICogc2hvdWxkKCdhYmMnKS5iZS5hLlN0cmluZygpO1xuICovXG5mdW5jdGlvbiBzaG91bGQob2JqKSB7XG4gIHJldHVybiAobmV3IHNob3VsZC5Bc3NlcnRpb24ob2JqKSk7XG59XG5cbnNob3VsZC5Bc3NlcnRpb25FcnJvciA9IHJlcXVpcmUoJy4vYXNzZXJ0aW9uLWVycm9yJyk7XG5zaG91bGQuQXNzZXJ0aW9uID0gcmVxdWlyZSgnLi9hc3NlcnRpb24nKTtcblxuc2hvdWxkLmZvcm1hdCA9IHV0aWwuZm9ybWF0O1xuc2hvdWxkLnR5cGUgPSByZXF1aXJlKCdzaG91bGQtdHlwZScpO1xuc2hvdWxkLnV0aWwgPSB1dGlsO1xuXG4vKipcbiAqIE9iamVjdCB3aXRoIGNvbmZpZ3VyYXRpb24uXG4gKiBJdCBjb250YWlucyBzdWNoIHByb3BlcnRpZXM6XG4gKiAqIGBjaGVja1Byb3RvRXFsYCBib29sZWFuIC0gQWZmZWN0IGlmIGAuZXFsYCB3aWxsIGNoZWNrIG9iamVjdHMgcHJvdG90eXBlc1xuICogKiBgcGx1c1plcm9BbmRNaW51c1plcm9FcXVhbGAgYm9vbGVhbiAtIEFmZmVjdCBpZiBgLmVxbGAgd2lsbCB0cmVhdCArMCBhbmQgLTAgYXMgZXF1YWxcbiAqIEFsc28gaXQgY2FuIGNvbnRhaW4gb3B0aW9ucyBmb3Igc2hvdWxkLWZvcm1hdC5cbiAqXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQG1lbWJlck9mIHNob3VsZFxuICogQHN0YXRpY1xuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYSA9IHsgYTogMTAgfSwgYiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gKiBiLmEgPSAxMDtcbiAqXG4gKiBhLnNob3VsZC5iZS5lcWwoYik7XG4gKiAvL25vdCB0aHJvd3NcbiAqXG4gKiBzaG91bGQuY29uZmlnLmNoZWNrUHJvdG9FcWwgPSB0cnVlO1xuICogYS5zaG91bGQuYmUuZXFsKGIpO1xuICogLy90aHJvd3MgQXNzZXJ0aW9uRXJyb3I6IGV4cGVjdGVkIHsgYTogMTAgfSB0byBlcXVhbCB7IGE6IDEwIH0gKGJlY2F1c2UgQSBhbmQgQiBoYXZlIGRpZmZlcmVudCBwcm90b3R5cGVzKVxuICovXG5zaG91bGQuY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKTtcblxuLy8gRXhwb3NlIHNob3VsZCB0byBleHRlcm5hbCB3b3JsZC5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHNob3VsZDtcblxuLyoqXG4gKiBBbGxvdyB0byBleHRlbmQgZ2l2ZW4gcHJvdG90eXBlIHdpdGggc2hvdWxkIHByb3BlcnR5IHVzaW5nIGdpdmVuIG5hbWUuIFRoaXMgZ2V0dGVyIHdpbGwgKip1bndyYXAqKiBhbGwgc3RhbmRhcmQgd3JhcHBlcnMgbGlrZSBgTnVtYmVyYCwgYEJvb2xlYW5gLCBgU3RyaW5nYC5cbiAqIFVzaW5nIGBzaG91bGQob2JqKWAgaXMgdGhlIGVxdWl2YWxlbnQgb2YgdXNpbmcgYG9iai5zaG91bGRgIHdpdGgga25vd24gaXNzdWVzIChsaWtlIG51bGxzIGFuZCBtZXRob2QgY2FsbHMgZXRjKS5cbiAqXG4gKiBUbyBhZGQgbmV3IGFzc2VydGlvbnMsIG5lZWQgdG8gdXNlIEFzc2VydGlvbi5hZGQgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbcHJvcGVydHlOYW1lXSBOYW1lIG9mIHByb3BlcnR5IHRvIGFkZC4gRGVmYXVsdCBpcyBgJ3Nob3VsZCdgLlxuICogQHBhcmFtIHtPYmplY3R9IFtwcm90b10gUHJvdG90eXBlIHRvIGV4dGVuZCB3aXRoLiBEZWZhdWx0IGlzIGBPYmplY3QucHJvdG90eXBlYC5cbiAqIEBtZW1iZXJPZiBzaG91bGRcbiAqIEByZXR1cm5zIHt7IG5hbWU6IHN0cmluZywgZGVzY3JpcHRvcjogT2JqZWN0LCBwcm90bzogT2JqZWN0IH19IERlc2NyaXB0b3IgZW5vdWdoIHRvIHJldHVybiBhbGwgYmFja1xuICogQHN0YXRpY1xuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgcHJldiA9IHNob3VsZC5leHRlbmQoJ211c3QnLCBPYmplY3QucHJvdG90eXBlKTtcbiAqXG4gKiAnYWJjJy5tdXN0LnN0YXJ0V2l0aCgnYScpO1xuICpcbiAqIHZhciBzaG91bGQgPSBzaG91bGQubm9Db25mbGljdChwcmV2KTtcbiAqIHNob3VsZC5ub3QuZXhpc3QoT2JqZWN0LnByb3RvdHlwZS5tdXN0KTtcbiAqL1xuc2hvdWxkLmV4dGVuZCA9IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgcHJvdG8pIHtcbiAgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lIHx8ICdzaG91bGQnO1xuICBwcm90byA9IHByb3RvIHx8IE9iamVjdC5wcm90b3R5cGU7XG5cbiAgdmFyIHByZXZEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgcHJvcGVydHlOYW1lKTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIHByb3BlcnR5TmFtZSwge1xuICAgIHNldDogZnVuY3Rpb24oKSB7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNob3VsZCh1dGlsLmlzV3JhcHBlclR5cGUodGhpcykgPyB0aGlzLnZhbHVlT2YoKSA6IHRoaXMpO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIHJldHVybiB7IG5hbWU6IHByb3BlcnR5TmFtZSwgZGVzY3JpcHRvcjogcHJldkRlc2NyaXB0b3IsIHByb3RvOiBwcm90byB9O1xufTtcblxuLyoqXG4gKiBEZWxldGUgcHJldmlvdXMgZXh0ZW5zaW9uLiBJZiBgZGVzY2AgbWlzc2luZyBpdCB3aWxsIHJlbW92ZSBkZWZhdWx0IGV4dGVuc2lvbi5cbiAqXG4gKiBAcGFyYW0ge3sgbmFtZTogc3RyaW5nLCBkZXNjcmlwdG9yOiBPYmplY3QsIHByb3RvOiBPYmplY3QgfX0gW2Rlc2NdIFJldHVybmVkIGZyb20gYHNob3VsZC5leHRlbmRgIG9iamVjdFxuICogQG1lbWJlck9mIHNob3VsZFxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHNob3VsZCBmdW5jdGlvblxuICogQHN0YXRpY1xuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgc2hvdWxkID0gcmVxdWlyZSgnc2hvdWxkJykubm9Db25mbGljdCgpO1xuICpcbiAqIHNob3VsZChPYmplY3QucHJvdG90eXBlKS5ub3QuaGF2ZS5wcm9wZXJ0eSgnc2hvdWxkJyk7XG4gKlxuICogdmFyIHByZXYgPSBzaG91bGQuZXh0ZW5kKCdtdXN0JywgT2JqZWN0LnByb3RvdHlwZSk7XG4gKiAnYWJjJy5tdXN0LnN0YXJ0V2l0aCgnYScpO1xuICogc2hvdWxkLm5vQ29uZmxpY3QocHJldik7XG4gKlxuICogc2hvdWxkKE9iamVjdC5wcm90b3R5cGUpLm5vdC5oYXZlLnByb3BlcnR5KCdtdXN0Jyk7XG4gKi9cbnNob3VsZC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oZGVzYykge1xuICBkZXNjID0gZGVzYyB8fCBzaG91bGQuX3ByZXZTaG91bGQ7XG5cbiAgaWYgKGRlc2MpIHtcbiAgICBkZWxldGUgZGVzYy5wcm90b1tkZXNjLm5hbWVdO1xuXG4gICAgaWYgKGRlc2MuZGVzY3JpcHRvcikge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlc2MucHJvdG8sIGRlc2MubmFtZSwgZGVzYy5kZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNob3VsZDtcbn07XG5cbi8qKlxuICogU2ltcGxlIHV0aWxpdHkgZnVuY3Rpb24gZm9yIGEgYml0IG1vcmUgZWFzaWVyIHNob3VsZCBhc3NlcnRpb24gZXh0ZW5zaW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmIFNvIGNhbGxlZCBwbHVnaW4gZnVuY3Rpb24uIEl0IHNob3VsZCBhY2NlcHQgMiBhcmd1bWVudHM6IGBzaG91bGRgIGZ1bmN0aW9uIGFuZCBgQXNzZXJ0aW9uYCBjb25zdHJ1Y3RvclxuICogQG1lbWJlck9mIHNob3VsZFxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBzaG91bGRgIGZ1bmN0aW9uXG4gKiBAc3RhdGljXG4gKiBAZXhhbXBsZVxuICpcbiAqIHNob3VsZC51c2UoZnVuY3Rpb24oc2hvdWxkLCBBc3NlcnRpb24pIHtcbiAqICAgQXNzZXJ0aW9uLmFkZCgnYXNzZXQnLCBmdW5jdGlvbigpIHtcbiAqICAgICAgdGhpcy5wYXJhbXMgPSB7IG9wZXJhdG9yOiAndG8gYmUgYXNzZXQnIH07XG4gKlxuICogICAgICB0aGlzLm9iai5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnaWQnKS53aGljaC5pcy5hLk51bWJlcigpO1xuICogICAgICB0aGlzLm9iai5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgncGF0aCcpO1xuICogIH0pXG4gKiB9KVxuICovXG5zaG91bGQudXNlID0gZnVuY3Rpb24oZikge1xuICBmKHNob3VsZCwgc2hvdWxkLkFzc2VydGlvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuc2hvdWxkXG4gIC51c2UocmVxdWlyZSgnLi9leHQvYXNzZXJ0JykpXG4gIC51c2UocmVxdWlyZSgnLi9leHQvY2hhaW4nKSlcbiAgLnVzZShyZXF1aXJlKCcuL2V4dC9ib29sJykpXG4gIC51c2UocmVxdWlyZSgnLi9leHQvbnVtYmVyJykpXG4gIC51c2UocmVxdWlyZSgnLi9leHQvZXFsJykpXG4gIC51c2UocmVxdWlyZSgnLi9leHQvdHlwZScpKVxuICAudXNlKHJlcXVpcmUoJy4vZXh0L3N0cmluZycpKVxuICAudXNlKHJlcXVpcmUoJy4vZXh0L3Byb3BlcnR5JykpXG4gIC51c2UocmVxdWlyZSgnLi9leHQvZXJyb3InKSlcbiAgLnVzZShyZXF1aXJlKCcuL2V4dC9tYXRjaCcpKVxuICAudXNlKHJlcXVpcmUoJy4vZXh0L2NvbnRhaW4nKSlcbiAgLnVzZShyZXF1aXJlKCcuL2V4dC9wcm9taXNlJykpO1xuIiwiLypcbiAqIHNob3VsZC5qcyAtIGFzc2VydGlvbiBsaWJyYXJ5XG4gKiBDb3B5cmlnaHQoYykgMjAxMC0yMDEzIFRKIEhvbG93YXljaHVrIDx0akB2aXNpb24tbWVkaWEuY2E+XG4gKiBDb3B5cmlnaHQoYykgMjAxMy0yMDE2IERlbmlzIEJhcmRhZHltIDxiYXJkYWR5bWNoaWtAZ21haWwuY29tPlxuICogTUlUIExpY2Vuc2VkXG4gKi9cblxudmFyIHR5cGUgPSByZXF1aXJlKCdzaG91bGQtdHlwZScpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG5cbi8qKlxuICogQ2hlY2sgaWYgZ2l2ZW4gb2JqIGp1c3QgYSBwcmltaXRpdmUgdHlwZSB3cmFwcGVyXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydHMuaXNXcmFwcGVyVHlwZSA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTnVtYmVyIHx8IG9iaiBpbnN0YW5jZW9mIFN0cmluZyB8fCBvYmogaW5zdGFuY2VvZiBCb29sZWFuO1xufTtcblxuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgaWYgKGEgJiYgYikge1xuICAgIGZvciAodmFyIGtleSBpbiBiKSB7XG4gICAgICBhW2tleV0gPSBiW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiBhO1xufTtcblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZXhwb3J0cy5mb3JFYWNoID0gZnVuY3Rpb24gZm9yRWFjaChvYmosIGYsIGNvbnRleHQpIHtcbiAgaWYgKGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvYmopKSB7XG4gICAgcmV0dXJuIGZvckVhY2gob2JqKCksIGYsIGNvbnRleHQpO1xuICB9IGVsc2UgaWYgKGV4cG9ydHMuaXNHZW5lcmF0b3JPYmplY3Qob2JqKSkge1xuICAgIHZhciB2YWx1ZSA9IG9iai5uZXh0KCk7XG4gICAgd2hpbGUgKCF2YWx1ZS5kb25lKSB7XG4gICAgICBpZiAoZi5jYWxsKGNvbnRleHQsIHZhbHVlLnZhbHVlLCAndmFsdWUnLCBvYmopID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgdmFsdWUgPSBvYmoubmV4dCgpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xuICAgICAgICBpZiAoZi5jYWxsKGNvbnRleHQsIG9ialtwcm9wXSwgcHJvcCwgb2JqKSA9PT0gZmFsc2UpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5zb21lID0gZnVuY3Rpb24ob2JqLCBmLCBjb250ZXh0KSB7XG4gIHZhciByZXMgPSBmYWxzZTtcbiAgZXhwb3J0cy5mb3JFYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIGlmIChmLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgb2JqKSkge1xuICAgICAgcmVzID0gdHJ1ZTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sIGNvbnRleHQpO1xuICByZXR1cm4gcmVzO1xufTtcblxuZXhwb3J0cy5pc0VtcHR5T2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydHMuaXNJbmRleGFibGUgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHQgPSB0eXBlKG9iaik7XG4gIHJldHVybiAodC50eXBlID09PSB0eXBlLk9CSkVDVCAmJiB0LmNscyA9PT0gdHlwZS5BUlJBWSkgfHxcbiAgICh0LnR5cGUgPT09IHR5cGUuT0JKRUNUICYmIHQuY2xzID09PSB0eXBlLkJVRkZFUikgfHxcbiAgICh0LnR5cGUgPT09IHR5cGUuT0JKRUNUICYmIHQuY2xzID09PSB0eXBlLkFSR1VNRU5UUykgfHxcbiAgICh0LnR5cGUgPT09IHR5cGUuT0JKRUNUICYmIHQuY2xzID09PSB0eXBlLkFSUkFZX0JVRkZFUikgfHxcbiAgICh0LnR5cGUgPT09IHR5cGUuT0JKRUNUICYmIHQuY2xzID09PSB0eXBlLlRZUEVEX0FSUkFZKSB8fFxuICAgKHQudHlwZSA9PT0gdHlwZS5PQkpFQ1QgJiYgdC5jbHMgPT09IHR5cGUuREFUQV9WSUVXKSB8fFxuICAgKHQudHlwZSA9PT0gdHlwZS5PQkpFQ1QgJiYgdC5jbHMgPT09IHR5cGUuU1RSSU5HKSB8fFxuICAgKHQudHlwZSA9PT0gdHlwZS5TVFJJTkcpO1xufTtcblxuZXhwb3J0cy5sZW5ndGggPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHQgPSB0eXBlKG9iaik7XG4gIHN3aXRjaCAodC50eXBlKSB7XG4gICAgY2FzZSB0eXBlLlNUUklORzpcbiAgICAgIHJldHVybiBvYmoubGVuZ3RoO1xuICAgIGNhc2UgdHlwZS5PQkpFQ1Q6XG4gICAgICBzd2l0Y2ggKHQuY2xzKSB7XG4gICAgICAgIGNhc2UgdHlwZS5BUlJBWV9CVUZGRVI6XG4gICAgICAgIGNhc2UgdHlwZS5UWVBFRF9BUlJBWTpcbiAgICAgICAgY2FzZSB0eXBlLkRBVEFfVklFVzpcbiAgICAgICAgICByZXR1cm4gb2JqLmJ5dGVMZW5ndGg7XG5cbiAgICAgICAgY2FzZSB0eXBlLkFSUkFZOlxuICAgICAgICBjYXNlIHR5cGUuQlVGRkVSOlxuICAgICAgICBjYXNlIHR5cGUuQVJHVU1FTlRTOlxuICAgICAgICBjYXNlIHR5cGUuRlVOQ1RJT046XG4gICAgICAgICAgcmV0dXJuIG9iai5sZW5ndGg7XG4gICAgICB9XG4gIH1cbn07XG5cbmV4cG9ydHMuY29udmVydFByb3BlcnR5TmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lID09ICdzeW1ib2wnKSB7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFN0cmluZyhuYW1lKTtcbiAgfVxufTtcblxuZXhwb3J0cy5pc0dlbmVyYXRvck9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAoIW9iaikgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiB0eXBlb2Ygb2JqLm5leHQgPT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgIHR5cGVvZiBvYmpbU3ltYm9sLml0ZXJhdG9yXSA9PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgb2JqW1N5bWJvbC5pdGVyYXRvcl0oKSA9PT0gb2JqO1xufTtcblxuLy9UT0RPIGZpbmQgYmV0dGVyIHdheVxuZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZikge1xuICBpZiAodHlwZW9mIGYgIT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXG4gIHJldHVybiAvXmZ1bmN0aW9uXFxzKlxcKlxccyovLnRlc3QoZi50b1N0cmluZygpKTtcbn07XG5cbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24odmFsdWUsIG9wdHMpIHtcbiAgcmV0dXJuIGNvbmZpZy5nZXRGb3JtYXR0ZXIob3B0cykuZm9ybWF0KHZhbHVlKTtcbn07XG5cbmV4cG9ydHMuZnVuY3Rpb25OYW1lID0gcmVxdWlyZSgnc2hvdWxkLWZvcm1hdCcpLkZvcm1hdHRlci5mdW5jdGlvbk5hbWU7XG5cbmV4cG9ydHMuZm9ybWF0UHJvcCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBjb25maWcuZ2V0Rm9ybWF0dGVyKCkuZm9ybWF0UHJvcGVydHlOYW1lKFN0cmluZyh2YWx1ZSkpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9ybWF0KG1zZykge1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgZm9yKHZhciBpID0gMSwgbCA9IGFyZ3MubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgbXNnID0gbXNnLnJlcGxhY2UoLyVzLywgYXJnc1tpXSk7XG4gIH1cbiAgcmV0dXJuIG1zZztcbn1cbiIsInZhciBnZXRUeXBlID0gcmVxdWlyZSgnc2hvdWxkLXR5cGUnKTtcbnZhciBmb3JtYXQgPSByZXF1aXJlKCcuL2Zvcm1hdCcpO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gbWFrZVJlc3VsdChyLCBwYXRoLCByZWFzb24sIGEsIGIpIHtcbiAgdmFyIG8gPSB7cmVzdWx0OiByfTtcbiAgaWYoIXIpIHtcbiAgICBvLnBhdGggPSBwYXRoO1xuICAgIG8ucmVhc29uID0gcmVhc29uO1xuICAgIG8uYSA9IGE7XG4gICAgby5iID0gYjtcbiAgfVxuICByZXR1cm4gbztcbn1cblxudmFyIEVRVUFMUyA9IG1ha2VSZXN1bHQodHJ1ZSk7XG5cbmZ1bmN0aW9uIHR5cGVUb1N0cmluZyh0KSB7XG4gIHJldHVybiB0LnR5cGUgKyAodC5jbHMgPyAnKCcgKyB0LmNscyArICh0LnN1YiA/ICcgJyArIHQuc3ViIDogJycpICsgJyknIDogJycpO1xufVxuXG5cblxudmFyIFJFQVNPTiA9IHtcbiAgUExVU18wX0FORF9NSU5VU18wOiAnKzAgaXMgbm90IGVxdWFsIHRvIC0wJyxcbiAgRElGRkVSRU5UX1RZUEVTOiAnQSBoYXMgdHlwZSAlcyBhbmQgQiBoYXMgdHlwZSAlcycsXG4gIE5BTl9OVU1CRVI6ICdOYU4gaXMgbm90IGVxdWFsIHRvIGFueSBudW1iZXInLFxuICBFUVVBTElUWTogJ0EgaXMgbm90IGVxdWFsIHRvIEInLFxuICBFUVVBTElUWV9QUk9UT1RZUEU6ICdBIGFuZCBCIGhhdmUgZGlmZmVyZW50IHByb3RvdHlwZXMnLFxuICBXUkFQUEVEX1ZBTFVFOiAnQSB3cmFwcGVkIHZhbHVlIGlzIG5vdCBlcXVhbCB0byBCIHdyYXBwZWQgdmFsdWUnLFxuICBGVU5DVElPTl9TT1VSQ0VTOiAnZnVuY3Rpb24gQSBpcyBub3QgZXF1YWwgdG8gQiBieSBzb3VyY2UgY29kZSB2YWx1ZSAodmlhIC50b1N0cmluZyBjYWxsKScsXG4gIE1JU1NJTkdfS0VZOiAnJXMgaGFzIG5vIGtleSAlcycsXG4gIENJUkNVTEFSX1ZBTFVFUzogJ0EgaGFzIGNpcmN1bGFyIHJlZmVyZW5jZSB0aGF0IHdhcyB2aXNpdGVkIG5vdCBpbiB0aGUgc2FtZSB0aW1lIGFzIEInLFxuICBTRVRfTUFQX01JU1NJTkdfS0VZOiAnU2V0L01hcCBtaXNzaW5nIGtleScsXG4gIE1BUF9WQUxVRV9FUVVBTElUWTogJ1ZhbHVlcyBvZiB0aGUgc2FtZSBrZXkgaW4gQSBhbmQgQiBpcyBub3QgZXF1YWwnXG59O1xuXG5cbmZ1bmN0aW9uIGVxSW50ZXJuYWwoYSwgYiwgb3B0cywgc3RhY2tBLCBzdGFja0IsIHBhdGgsIGZhaWxzKSB7XG4gIHZhciByID0gRVFVQUxTO1xuXG4gIGZ1bmN0aW9uIHJlc3VsdChjb21wYXJpc29uLCByZWFzb24pIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID4gMikge1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgcmVhc29uID0gZm9ybWF0LmFwcGx5KG51bGwsIFtyZWFzb25dLmNvbmNhdChhcmdzKSk7XG4gICAgfVxuICAgIHZhciByZXMgPSBtYWtlUmVzdWx0KGNvbXBhcmlzb24sIHBhdGgsIHJlYXNvbiwgYSwgYik7XG4gICAgaWYoIWNvbXBhcmlzb24gJiYgb3B0cy5jb2xsZWN0QWxsRmFpbHMpIHtcbiAgICAgIGZhaWxzLnB1c2gocmVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrUHJvcGVydHlFcXVhbGl0eShwcm9wZXJ0eSkge1xuICAgIHJldHVybiBlcUludGVybmFsKGFbcHJvcGVydHldLCBiW3Byb3BlcnR5XSwgb3B0cywgc3RhY2tBLCBzdGFja0IsIHBhdGguY29uY2F0KFtwcm9wZXJ0eV0pLCBmYWlscyk7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0Fsc28oYTEsIGIxKSB7XG4gICAgcmV0dXJuIGVxSW50ZXJuYWwoYTEsIGIxLCBvcHRzLCBzdGFja0EsIHN0YWNrQiwgcGF0aCwgZmFpbHMpO1xuICB9XG5cbiAgLy8gZXF1YWwgYSBhbmQgYiBleGl0IGVhcmx5XG4gIGlmKGEgPT09IGIpIHtcbiAgICAvLyBjaGVjayBmb3IgKzAgIT09IC0wO1xuICAgIHJldHVybiByZXN1bHQoYSAhPT0gMCB8fCAoMSAvIGEgPT0gMSAvIGIpIHx8IG9wdHMucGx1c1plcm9BbmRNaW51c1plcm9FcXVhbCwgUkVBU09OLlBMVVNfMF9BTkRfTUlOVVNfMCk7XG4gIH1cblxuICB2YXIgbCwgcDtcblxuICB2YXIgdHlwZUEgPSBnZXRUeXBlKGEpLFxuICAgIHR5cGVCID0gZ2V0VHlwZShiKTtcblxuICB2YXIga2V5O1xuXG4gIC8vIGlmIG9iamVjdHMgaGFzIGRpZmZlcmVudCB0eXBlcyB0aGV5IGFyZSBub3QgZXF1YWxcbiAgdmFyIHR5cGVEaWZmZXJlbnQgPSB0eXBlQS50eXBlICE9PSB0eXBlQi50eXBlIHx8IHR5cGVBLmNscyAhPT0gdHlwZUIuY2xzO1xuXG4gIGlmKHR5cGVEaWZmZXJlbnQgfHwgKChvcHRzLmNoZWNrU3ViVHlwZSAmJiB0eXBlQS5zdWIgIT09IHR5cGVCLnN1YikgfHwgIW9wdHMuY2hlY2tTdWJUeXBlKSkge1xuICAgIHJldHVybiByZXN1bHQoZmFsc2UsIFJFQVNPTi5ESUZGRVJFTlRfVFlQRVMsIHR5cGVUb1N0cmluZyh0eXBlQSksIHR5cGVUb1N0cmluZyh0eXBlQikpO1xuICB9XG5cbiAgLy9lYXJseSBjaGVja3MgZm9yIHR5cGVzXG4gIHN3aXRjaCh0eXBlQS50eXBlKSB7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIC8vIE5hTiAhPT0gTmFOXG4gICAgICByZXR1cm4gKGEgIT09IGEpID8gcmVzdWx0KGIgIT09IGIsIFJFQVNPTi5OQU5fTlVNQkVSKVxuICAgICAgICA6IHJlc3VsdChhID09PSBiLCBSRUFTT04uRVFVQUxJVFkpO1xuXG4gICAgY2FzZSAnYm9vbGVhbic6XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIHJldHVybiByZXN1bHQoYSA9PT0gYiwgUkVBU09OLkVRVUFMSVRZKTtcblxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgIC8vIGZ1bmN0aW9ucyBhcmUgY29tcGFyZWQgYnkgdGhlaXIgc291cmNlIGNvZGVcbiAgICAgIHIgPSBjaGVja0Fsc28oYS50b1N0cmluZygpLCBiLnRvU3RyaW5nKCkpO1xuICAgICAgaWYoIXIucmVzdWx0KSB7XG4gICAgICAgIHIucmVhc29uID0gUkVBU09OLkZVTkNUSU9OX1NPVVJDRVM7XG4gICAgICAgIGlmKCFvcHRzLmNvbGxlY3RBbGxGYWlscykgcmV0dXJuIHI7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrOy8vY2hlY2sgdXNlciBwcm9wZXJ0aWVzXG5cbiAgICBjYXNlICdvYmplY3QnOlxuICAgICAgLy8gYWRkaXRpb25hbCBjaGVja3MgZm9yIG9iamVjdCBpbnN0YW5jZXNcbiAgICAgIHN3aXRjaCh0eXBlQS5jbHMpIHtcbiAgICAgICAgLy8gY2hlY2sgcmVnZXhwIGZsYWdzXG4gICAgICAgIC8vIFRPRE8gYWRkIGVzNiBmbGFnc1xuICAgICAgICBjYXNlICdyZWdleHAnOlxuICAgICAgICAgIHAgPSBbJ3NvdXJjZScsICdnbG9iYWwnLCAnbXVsdGlsaW5lJywgJ2xhc3RJbmRleCcsICdpZ25vcmVDYXNlJ107XG4gICAgICAgICAgd2hpbGUocC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHIgPSBjaGVja1Byb3BlcnR5RXF1YWxpdHkocC5zaGlmdCgpKTtcbiAgICAgICAgICAgIGlmKCFyLnJlc3VsdCAmJiAhb3B0cy5jb2xsZWN0QWxsRmFpbHMpIHJldHVybiByO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhazsvL2NoZWNrIHVzZXIgcHJvcGVydGllc1xuXG4gICAgICAgIC8vY2hlY2sgYnkgdGltZXN0YW1wIG9ubHkgKHVzaW5nIC52YWx1ZU9mKVxuICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICBpZigrYSAhPT0gK2IpIHtcbiAgICAgICAgICAgIHIgPSByZXN1bHQoZmFsc2UsIFJFQVNPTi5FUVVBTElUWSk7XG4gICAgICAgICAgICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSByZXR1cm4gcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7Ly9jaGVjayB1c2VyIHByb3BlcnRpZXNcblxuICAgICAgICAvL3ByaW1pdGl2ZSB0eXBlIHdyYXBwZXJzXG4gICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgIC8vY2hlY2sgdGhlaXIgaW50ZXJuYWwgdmFsdWVcbiAgICAgICAgICByID0gY2hlY2tBbHNvKGEudmFsdWVPZigpLCBiLnZhbHVlT2YoKSk7XG4gICAgICAgICAgaWYoIXIucmVzdWx0KSB7XG4gICAgICAgICAgICByLnJlYXNvbiA9IFJFQVNPTi5XUkFQUEVEX1ZBTFVFO1xuICAgICAgICAgICAgaWYoIW9wdHMuY29sbGVjdEFsbEZhaWxzKSByZXR1cm4gcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7Ly9jaGVjayB1c2VyIHByb3BlcnRpZXNcblxuICAgICAgICAvL25vZGUgYnVmZmVyXG4gICAgICAgIGNhc2UgJ2J1ZmZlcic6XG4gICAgICAgICAgLy9pZiBsZW5ndGggZGlmZmVyZW50IGl0IGlzIG9idmlvdXNseSBkaWZmZXJlbnRcbiAgICAgICAgICByID0gY2hlY2tQcm9wZXJ0eUVxdWFsaXR5KCdsZW5ndGgnKTtcbiAgICAgICAgICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSByZXR1cm4gcjtcblxuICAgICAgICAgIGwgPSBhLmxlbmd0aDtcbiAgICAgICAgICB3aGlsZShsLS0pIHtcbiAgICAgICAgICAgIHIgPSBjaGVja1Byb3BlcnR5RXF1YWxpdHkobCk7XG4gICAgICAgICAgICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSByZXR1cm4gcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvL3dlIGRvIG5vdCBjaGVjayBmb3IgdXNlciBwcm9wZXJ0aWVzIGJlY2F1c2VcbiAgICAgICAgICAvL25vZGUgQnVmZmVyIGhhdmUgc29tZSBzdHJhbmdlIGhpZGRlbiBwcm9wZXJ0aWVzXG4gICAgICAgICAgcmV0dXJuIEVRVUFMUztcblxuICAgICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgICAgLy9jaGVjayBkZWZpbmVkIHByb3BlcnRpZXNcbiAgICAgICAgICBwID0gWyduYW1lJywgJ21lc3NhZ2UnXTtcbiAgICAgICAgICB3aGlsZShwLmxlbmd0aCkge1xuICAgICAgICAgICAgciA9IGNoZWNrUHJvcGVydHlFcXVhbGl0eShwLnNoaWZ0KCkpO1xuICAgICAgICAgICAgaWYoIXIucmVzdWx0ICYmICFvcHRzLmNvbGxlY3RBbGxGYWlscykgcmV0dXJuIHI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7Ly9jaGVjayB1c2VyIHByb3BlcnRpZXNcblxuICAgICAgICBjYXNlICdhcnJheSc6XG4gICAgICAgIGNhc2UgJ2FyZ3VtZW50cyc6XG4gICAgICAgIGNhc2UgJ3R5cGVkLWFycmF5JzpcbiAgICAgICAgICByID0gY2hlY2tQcm9wZXJ0eUVxdWFsaXR5KCdsZW5ndGgnKTtcbiAgICAgICAgICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSByZXR1cm4gcjtcblxuICAgICAgICAgIGJyZWFrOy8vY2hlY2sgdXNlciBwcm9wZXJ0aWVzXG5cbiAgICAgICAgY2FzZSAnYXJyYXktYnVmZmVyJzpcbiAgICAgICAgICByID0gY2hlY2tQcm9wZXJ0eUVxdWFsaXR5KCdieXRlTGVuZ3RoJyk7XG4gICAgICAgICAgaWYoIXIucmVzdWx0ICYmICFvcHRzLmNvbGxlY3RBbGxGYWlscykgcmV0dXJuIHI7XG5cbiAgICAgICAgICBicmVhazsvL2NoZWNrIHVzZXIgcHJvcGVydGllc1xuXG4gICAgICAgIGNhc2UgJ21hcCc6XG4gICAgICAgIGNhc2UgJ3NldCc6XG4gICAgICAgICAgciA9IGNoZWNrUHJvcGVydHlFcXVhbGl0eSgnc2l6ZScpO1xuICAgICAgICAgIGlmKCFyLnJlc3VsdCAmJiAhb3B0cy5jb2xsZWN0QWxsRmFpbHMpIHJldHVybiByO1xuXG4gICAgICAgICAgc3RhY2tBLnB1c2goYSk7XG4gICAgICAgICAgc3RhY2tCLnB1c2goYik7XG5cbiAgICAgICAgICB2YXIgaXRBID0gYS5lbnRyaWVzKCk7XG4gICAgICAgICAgdmFyIG5leHRBID0gaXRBLm5leHQoKTtcblxuICAgICAgICAgIHdoaWxlKCFuZXh0QS5kb25lKSB7XG4gICAgICAgICAgICBrZXkgPSBuZXh0QS52YWx1ZVswXTtcbiAgICAgICAgICAgIC8vZmlyc3QgY2hlY2sgZm9yIHByaW1pdGl2ZSBrZXkgaWYgd2UgY2FuIGRvIGxpZ2h0IGNoZWNrXG4gICAgICAgICAgICAvL3VzaW5nIC5oYXMgYW5kIC5nZXRcbiAgICAgICAgICAgIGlmKGdldFR5cGUoa2V5KS50eXBlICE9ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgIGlmKGIuaGFzKGtleSkpIHtcbiAgICAgICAgICAgICAgICBpZih0eXBlQS5jbHMgPT0gJ21hcCcpIHtcbiAgICAgICAgICAgICAgICAgIC8vZm9yIG1hcCB3ZSBhbHNvIGNoZWNrIGl0cyB2YWx1ZSB0byBiZSBlcXVhbFxuICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gYi5nZXQoa2V5KTtcbiAgICAgICAgICAgICAgICAgIHIgPSBjaGVja0Fsc28obmV4dEEudmFsdWVbMV0sIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIGlmKCFyLnJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByLmEgPSBuZXh0QS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgci5iID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHIucmVhc29uID0gUkVBU09OLk1BUF9WQUxVRV9FUVVBTElUWTtcblxuICAgICAgICAgICAgICAgICAgICBpZighb3B0cy5jb2xsZWN0QWxsRmFpbHMpIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHIgPSByZXN1bHQoZmFsc2UsIFJFQVNPTi5TRVRfTUFQX01JU1NJTkdfS0VZKTtcbiAgICAgICAgICAgICAgICByLmEgPSBrZXk7XG4gICAgICAgICAgICAgICAgci5iID0ga2V5O1xuXG4gICAgICAgICAgICAgICAgaWYoIW9wdHMuY29sbGVjdEFsbEZhaWxzKSBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy9oZWF2eSBjaGVja1xuICAgICAgICAgICAgICAvL3dlIHNlYXJjaCBieSBpdGVyYXRvciBmb3Iga2V5IGVxdWFsaXR5IHVzaW5nIGVxdWFsXG4gICAgICAgICAgICAgIHZhciBpdEIgPSBiLmVudHJpZXMoKTtcbiAgICAgICAgICAgICAgdmFyIG5leHRCID0gaXRCLm5leHQoKTtcblxuICAgICAgICAgICAgICB3aGlsZSghbmV4dEIuZG9uZSkge1xuICAgICAgICAgICAgICAgIC8vZmlyc3QgY2hlY2sgZm9yIGtleXNcbiAgICAgICAgICAgICAgICByID0gY2hlY2tBbHNvKG5leHRBLnZhbHVlWzBdLCBuZXh0Qi52YWx1ZVswXSk7XG5cbiAgICAgICAgICAgICAgICBpZighci5yZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgIHIucmVhc29uID0gUkVBU09OLlNFVF9NQVBfTUlTU0lOR19LRVk7XG4gICAgICAgICAgICAgICAgICByLmEgPSBrZXk7XG4gICAgICAgICAgICAgICAgICByLmIgPSBrZXk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmKHR5cGVBLmNscyA9PSAnbWFwJykge1xuICAgICAgICAgICAgICAgICAgICByID0gY2hlY2tBbHNvKG5leHRBLnZhbHVlWzFdLCBuZXh0Qi52YWx1ZVsxXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIXIucmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgci5hID0gbmV4dEEudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgci5iID0gbmV4dEIudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgci5yZWFzb24gPSBSRUFTT04uTUFQX1ZBTFVFX0VRVUFMSVRZO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIGlmKCFvcHRzLmNvbGxlY3RBbGxGYWlscykgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbmV4dEIgPSBpdEIubmV4dCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCFyLnJlc3VsdCAmJiAhb3B0cy5jb2xsZWN0QWxsRmFpbHMpIGJyZWFrO1xuXG4gICAgICAgICAgICBuZXh0QSA9IGl0QS5uZXh0KCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3RhY2tBLnBvcCgpO1xuICAgICAgICAgIHN0YWNrQi5wb3AoKTtcblxuICAgICAgICAgIGlmKCFyLnJlc3VsdCkge1xuICAgICAgICAgICAgci5yZWFzb24gPSBSRUFTT04uU0VUX01BUF9NSVNTSU5HX0VOVFJZO1xuICAgICAgICAgICAgaWYoIW9wdHMuY29sbGVjdEFsbEZhaWxzKSByZXR1cm4gcjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhazsgLy9jaGVjayB1c2VyIHByb3BlcnRpZXNcbiAgICAgIH1cbiAgfVxuXG4gIC8vIGNvbXBhcmUgZGVlcCBvYmplY3RzIGFuZCBhcnJheXNcbiAgLy8gc3RhY2tzIGNvbnRhaW4gcmVmZXJlbmNlcyBvbmx5XG4gIC8vXG5cbiAgbCA9IHN0YWNrQS5sZW5ndGg7XG4gIHdoaWxlKGwtLSkge1xuICAgIGlmKHN0YWNrQVtsXSA9PSBhKSB7XG4gICAgICByZXR1cm4gcmVzdWx0KHN0YWNrQltsXSA9PSBiLCBSRUFTT04uQ0lSQ1VMQVJfVkFMVUVTKTtcbiAgICB9XG4gIH1cblxuICAvLyBhZGQgYGFgIGFuZCBgYmAgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzXG4gIHN0YWNrQS5wdXNoKGEpO1xuICBzdGFja0IucHVzaChiKTtcblxuICBmb3Ioa2V5IGluIGIpIHtcbiAgICBpZihoYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIGtleSkpIHtcbiAgICAgIHIgPSByZXN1bHQoaGFzT3duUHJvcGVydHkuY2FsbChhLCBrZXkpLCBSRUFTT04uTUlTU0lOR19LRVksICdBJywga2V5KTtcbiAgICAgIGlmKCFyLnJlc3VsdCAmJiAhb3B0cy5jb2xsZWN0QWxsRmFpbHMpIGJyZWFrO1xuXG4gICAgICBpZihyLnJlc3VsdCkge1xuICAgICAgICByID0gY2hlY2tQcm9wZXJ0eUVxdWFsaXR5KGtleSk7XG4gICAgICAgIGlmKCFyLnJlc3VsdCAmJiAhb3B0cy5jb2xsZWN0QWxsRmFpbHMpIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmKHIucmVzdWx0IHx8IG9wdHMuY29sbGVjdEFsbEZhaWxzKSB7XG4gICAgLy8gZW5zdXJlIGJvdGggb2JqZWN0cyBoYXZlIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzXG4gICAgZm9yKGtleSBpbiBhKSB7XG4gICAgICBpZihoYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGtleSkpIHtcbiAgICAgICAgciA9IHJlc3VsdChoYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIGtleSksIFJFQVNPTi5NSVNTSU5HX0tFWSwgJ0InLCBrZXkpO1xuICAgICAgICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSByZXR1cm4gcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGFja0EucG9wKCk7XG4gIHN0YWNrQi5wb3AoKTtcblxuICBpZighci5yZXN1bHQgJiYgIW9wdHMuY29sbGVjdEFsbEZhaWxzKSByZXR1cm4gcjtcblxuICB2YXIgcHJvdG90eXBlc0VxdWFscyA9IGZhbHNlLCBjYW5Db21wYXJlUHJvdG90eXBlcyA9IGZhbHNlO1xuXG4gIGlmKG9wdHMuY2hlY2tQcm90b0VxbCkge1xuICAgIGlmKE9iamVjdC5nZXRQcm90b3R5cGVPZikgey8vVE9ETyBzaG91bGQgaSBjaGVjayBwcm90b3R5cGVzIGZvciA9PT0gb3IgdXNlIGVxP1xuICAgICAgcHJvdG90eXBlc0VxdWFscyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihhKSA9PT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGIpO1xuICAgICAgY2FuQ29tcGFyZVByb3RvdHlwZXMgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmKGNhbkNvbXBhcmVQcm90b3R5cGVzICYmICFwcm90b3R5cGVzRXF1YWxzKSB7XG4gICAgICByID0gcmVzdWx0KHByb3RvdHlwZXNFcXVhbHMsIFJFQVNPTi5FUVVBTElUWV9QUk9UT1RZUEUpO1xuICAgICAgci5zaG93UmVhc29uID0gdHJ1ZTtcbiAgICAgIGlmKCFyLnJlc3VsdCAmJiAhb3B0cy5jb2xsZWN0QWxsRmFpbHMpIHtcbiAgICAgICAgcmV0dXJuIHI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIEVRVUFMUztcbn1cblxudmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICBjaGVja1Byb3RvRXFsOiB0cnVlLFxuICBjaGVja1N1YlR5cGU6IHRydWUsXG4gIHBsdXNaZXJvQW5kTWludXNaZXJvRXF1YWw6IGZhbHNlXG59O1xuXG5mdW5jdGlvbiBlcShhLCBiLCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xuICBpZih0eXBlb2Ygb3B0cy5jaGVja1Byb3RvRXFsICE9PSAnYm9vbGVhbicpIHtcbiAgICBvcHRzLmNoZWNrUHJvdG9FcWwgPSBkZWZhdWx0T3B0aW9ucy5jaGVja1Byb3RvRXFsO1xuICB9XG4gIGlmKHR5cGVvZiBvcHRzLmNoZWNrU3ViVHlwZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgb3B0cy5jaGVja1N1YlR5cGUgPSBkZWZhdWx0T3B0aW9ucy5jaGVja1N1YlR5cGU7XG4gIH1cbiAgaWYodHlwZW9mIG9wdHMucGx1c1plcm9BbmRNaW51c1plcm9FcXVhbCAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgb3B0cy5wbHVzWmVyb0FuZE1pbnVzWmVyb0VxdWFsID0gZGVmYXVsdE9wdGlvbnMucGx1c1plcm9BbmRNaW51c1plcm9FcXVhbDtcbiAgfVxuXG4gIHZhciBmYWlscyA9IFtdO1xuICB2YXIgciA9IGVxSW50ZXJuYWwoYSwgYiwgb3B0cywgW10sIFtdLCBbXSwgZmFpbHMpO1xuICByZXR1cm4gb3B0cy5jb2xsZWN0QWxsRmFpbHMgPyBmYWlscyA6IHI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXE7XG5cbmVxLnIgPSBSRUFTT047XG4iLCJ2YXIgZ2V0VHlwZSA9IHJlcXVpcmUoJ3Nob3VsZC10eXBlJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5mdW5jdGlvbiBnZW5LZXlzRnVuYyhmKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBrID0gZih2YWx1ZSk7XG4gICAgay5zb3J0KCk7XG4gICAgcmV0dXJuIGs7XG4gIH07XG59XG5cblxuZnVuY3Rpb24gRm9ybWF0dGVyKG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgdGhpcy5zZWVuID0gW107XG4gIHRoaXMua2V5cyA9IGdlbktleXNGdW5jKG9wdHMua2V5cyA9PT0gZmFsc2UgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyA6IE9iamVjdC5rZXlzKTtcblxuICB0aGlzLm1heExpbmVMZW5ndGggPSB0eXBlb2Ygb3B0cy5tYXhMaW5lTGVuZ3RoID09PSAnbnVtYmVyJyA/IG9wdHMubWF4TGluZUxlbmd0aCA6IDYwO1xuICB0aGlzLnByb3BTZXAgPSBvcHRzLnByb3BTZXAgfHwgJywnO1xuXG4gIHRoaXMuaXNVVENkYXRlID0gISFvcHRzLmlzVVRDZGF0ZTtcbn1cblxuRm9ybWF0dGVyLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IEZvcm1hdHRlcixcblxuICBmb3JtYXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHQgPSBnZXRUeXBlKHZhbHVlKTtcbiAgICB2YXIgbmFtZTEgPSB0LnR5cGUsIG5hbWUyID0gdC50eXBlO1xuICAgIGlmKHQuY2xzKSB7XG4gICAgICBuYW1lMSArPSAnXycgKyB0LmNscztcbiAgICAgIG5hbWUyICs9ICdfJyArIHQuY2xzO1xuICAgIH1cbiAgICBpZih0LnN1Yikge1xuICAgICAgbmFtZTIgKz0gJ18nICsgdC5zdWI7XG4gICAgfVxuICAgIHZhciBmID0gdGhpc1snX2Zvcm1hdF8nICsgbmFtZTJdIHx8IHRoaXNbJ19mb3JtYXRfJyArIG5hbWUxXSB8fCB0aGlzWydfZm9ybWF0XycgKyB0LnR5cGVdIHx8IHRoaXMuZGVmYXVsdEZvcm1hdDtcbiAgICByZXR1cm4gZi5jYWxsKHRoaXMsIHZhbHVlKS50cmltKCk7XG4gIH0sXG5cbiAgX2Zvcm1hdE9iamVjdDogZnVuY3Rpb24odmFsdWUsIG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB2YXIgbWFpbktleXMgPSBvcHRzLmtleXMgfHwgdGhpcy5rZXlzKHZhbHVlKTtcblxuICAgIHZhciBsZW4gPSAwO1xuXG4gICAgdmFyIGZvcm1hdFByb3BlcnR5VmFsdWUgPSBvcHRzLmZvcm1hdFByb3BlcnR5VmFsdWUgfHwgdGhpcy5mb3JtYXRQcm9wZXJ0eVZhbHVlO1xuICAgIHZhciBmb3JtYXRQcm9wZXJ0eU5hbWUgPSBvcHRzLmZvcm1hdFByb3BlcnR5TmFtZSB8fCB0aGlzLmZvcm1hdFByb3BlcnR5TmFtZTtcbiAgICB2YXIga2V5VmFsdWVTZXAgPSBvcHRzLmtleVZhbHVlU2VwIHx8ICc6ICc7XG4gICAgdmFyIGtleUZpbHRlciA9IG9wdHMua2V5RmlsdGVyIHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZTsgfTtcblxuICAgIHRoaXMuc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuXG4gICAgbWFpbktleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmKCFrZXlGaWx0ZXIoa2V5KSkgcmV0dXJuO1xuXG4gICAgICB2YXIgZk5hbWUgPSBmb3JtYXRQcm9wZXJ0eU5hbWUuY2FsbCh0aGlzLCBrZXkpO1xuXG4gICAgICB2YXIgZiA9IChmTmFtZSA/IGZOYW1lICsga2V5VmFsdWVTZXAgOiAnJykgKyBmb3JtYXRQcm9wZXJ0eVZhbHVlLmNhbGwodGhpcywgdmFsdWUsIGtleSk7XG4gICAgICBsZW4gKz0gZi5sZW5ndGg7XG4gICAgICBrZXlzLnB1c2goZik7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy5zZWVuLnBvcCgpO1xuXG4gICAgKG9wdHMuYWRkaXRpb25hbFByb3BlcnRpZXMgfHwgW10pLmZvckVhY2goZnVuY3Rpb24oa2V5VmFsdWUpIHtcbiAgICAgIHZhciBmID0ga2V5VmFsdWVbMF0gKyBrZXlWYWx1ZVNlcCArIHRoaXMuZm9ybWF0KGtleVZhbHVlWzFdKTtcbiAgICAgIGxlbiArPSBmLmxlbmd0aDtcbiAgICAgIGtleXMucHVzaChmKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHZhciBwcmVmaXggPSBvcHRzLnByZWZpeCB8fCBGb3JtYXR0ZXIuY29uc3RydWN0b3JOYW1lKHZhbHVlKSB8fCAnJztcbiAgICBpZihwcmVmaXgubGVuZ3RoID4gMCkgcHJlZml4ICs9ICcgJztcblxuICAgIHZhciBsYnJhY2tldCwgcmJyYWNrZXQ7XG4gICAgaWYoQXJyYXkuaXNBcnJheShvcHRzLmJyYWNrZXRzKSkge1xuICAgICAgbGJyYWNrZXQgPSBvcHRzLmJyYWNrZXRzICYmIG9wdHMuYnJhY2tldHNbMF07XG4gICAgICByYnJhY2tldCA9IG9wdHMuYnJhY2tldHMgJiYgb3B0cy5icmFja2V0c1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGJyYWNrZXQgPSAneyc7XG4gICAgICByYnJhY2tldCA9ICd9JztcbiAgICB9XG5cbiAgICB2YXIgcm9vdFZhbHVlID0gb3B0cy52YWx1ZSB8fCAnJztcblxuICAgIGlmKGtleXMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHJvb3RWYWx1ZSB8fCAocHJlZml4ICsgbGJyYWNrZXQgKyByYnJhY2tldCk7XG5cbiAgICBpZihsZW4gPD0gdGhpcy5tYXhMaW5lTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gcHJlZml4ICsgbGJyYWNrZXQgKyAnICcgKyAocm9vdFZhbHVlID8gcm9vdFZhbHVlICsgJyAnIDogJycpICsga2V5cy5qb2luKHRoaXMucHJvcFNlcCArICcgJykgKyAnICcgKyByYnJhY2tldDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHByZWZpeCArIGxicmFja2V0ICsgJ1xcbicgKyAocm9vdFZhbHVlID8gJyAgJyArIHJvb3RWYWx1ZSArICdcXG4nIDogJycpICsga2V5cy5tYXAodXRpbC5hZGRTcGFjZXMpLmpvaW4odGhpcy5wcm9wU2VwICsgJ1xcbicpICsgJ1xcbicgKyByYnJhY2tldDtcbiAgICB9XG4gIH0sXG5cbiAgZm9ybWF0T2JqZWN0OiBmdW5jdGlvbih2YWx1ZSwgcHJlZml4LCBwcm9wcykge1xuICAgIHByb3BzID0gcHJvcHMgfHwgdGhpcy5rZXlzKHZhbHVlKTtcblxuICAgIHZhciBsZW4gPSAwO1xuXG4gICAgdGhpcy5zZWVuLnB1c2godmFsdWUpO1xuICAgIHByb3BzID0gcHJvcHMubWFwKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIHZhciBmID0gdGhpcy5mb3JtYXRQcm9wZXJ0eSh2YWx1ZSwgcHJvcCk7XG4gICAgICBsZW4gKz0gZi5sZW5ndGg7XG4gICAgICByZXR1cm4gZjtcbiAgICB9LCB0aGlzKTtcbiAgICB0aGlzLnNlZW4ucG9wKCk7XG5cbiAgICBpZihwcm9wcy5sZW5ndGggPT09IDApIHJldHVybiAne30nO1xuXG4gICAgaWYobGVuIDw9IHRoaXMubWF4TGluZUxlbmd0aCkge1xuICAgICAgcmV0dXJuICd7ICcgKyAocHJlZml4ID8gcHJlZml4ICsgJyAnIDogJycpICsgcHJvcHMuam9pbih0aGlzLnByb3BTZXAgKyAnICcpICsgJyB9JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICd7JyArICdcXG4nICsgKHByZWZpeCA/ICcgICcgKyBwcmVmaXggKyAnXFxuJyA6ICcnKSArIHByb3BzLm1hcCh1dGlsLmFkZFNwYWNlcykuam9pbih0aGlzLnByb3BTZXAgKyAnXFxuJykgKyAnXFxuJyArICd9JztcbiAgICB9XG4gIH0sXG5cbiAgZm9ybWF0UHJvcGVydHlOYW1lOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUubWF0Y2goL15bYS16QS1aXyRdW2EtekEtWl8kMC05XSokLykgPyBuYW1lIDogdGhpcy5mb3JtYXQobmFtZSk7XG4gIH0sXG5cbiAgZm9ybWF0UHJvcGVydHk6IGZ1bmN0aW9uKHZhbHVlLCBwcm9wKSB7XG4gICAgdmFyIGRlc2MgPSBGb3JtYXR0ZXIuZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBwcm9wKTtcblxuICAgIHZhciBwcm9wTmFtZSA9IHRoaXMuZm9ybWF0UHJvcGVydHlOYW1lKHByb3ApO1xuXG4gICAgdmFyIHByb3BWYWx1ZSA9IGRlc2MuZ2V0ICYmIGRlc2Muc2V0ID9cbiAgICAgICdbR2V0dGVyL1NldHRlcl0nIDogZGVzYy5nZXQgP1xuICAgICAgJ1tHZXR0ZXJdJyA6IGRlc2Muc2V0ID9cbiAgICAgICdbU2V0dGVyXScgOiB0aGlzLnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA+PSAwID9cbiAgICAgICdbQ2lyY3VsYXJdJyA6XG4gICAgICB0aGlzLmZvcm1hdChkZXNjLnZhbHVlKTtcblxuICAgIHJldHVybiBwcm9wTmFtZSArICc6ICcgKyBwcm9wVmFsdWU7XG4gIH0sXG5cbiAgZm9ybWF0UHJvcGVydHlWYWx1ZTogZnVuY3Rpb24odmFsdWUsIHByb3ApIHtcbiAgICB2YXIgZGVzYyA9IEZvcm1hdHRlci5nZXRQcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIHByb3ApO1xuXG4gICAgdmFyIHByb3BWYWx1ZSA9IGRlc2MuZ2V0ICYmIGRlc2Muc2V0ID9cbiAgICAgICdbR2V0dGVyL1NldHRlcl0nIDogZGVzYy5nZXQgP1xuICAgICAgJ1tHZXR0ZXJdJyA6IGRlc2Muc2V0ID9cbiAgICAgICdbU2V0dGVyXScgOiB0aGlzLnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA+PSAwID9cbiAgICAgICdbQ2lyY3VsYXJdJyA6XG4gICAgICB0aGlzLmZvcm1hdChkZXNjLnZhbHVlKTtcblxuICAgIHJldHVybiBwcm9wVmFsdWU7XG4gIH1cbn07XG5cbkZvcm1hdHRlci5hZGQgPSBmdW5jdGlvbiBhZGQodHlwZSwgY2xzLCBzdWIsIGYpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICBmID0gYXJncy5wb3AoKTtcbiAgRm9ybWF0dGVyLnByb3RvdHlwZVsnX2Zvcm1hdF8nICsgYXJncy5qb2luKCdfJyldID0gZjtcbn07XG5cbkZvcm1hdHRlci5mb3JtYXRPYmplY3RXaXRoUHJlZml4ID0gZnVuY3Rpb24gZm9ybWF0T2JqZWN0V2l0aFByZWZpeChmKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBwcmVmaXggPSBmLmNhbGwodGhpcywgdmFsdWUpO1xuICAgIHZhciBwcm9wcyA9IHRoaXMua2V5cyh2YWx1ZSk7XG4gICAgaWYocHJvcHMubGVuZ3RoID09IDApIHJldHVybiBwcmVmaXg7XG4gICAgZWxzZSByZXR1cm4gdGhpcy5mb3JtYXRPYmplY3QodmFsdWUsIHByZWZpeCwgcHJvcHMpO1xuICB9O1xufTtcblxudmFyIGZ1bmN0aW9uTmFtZVJFID0gL15cXHMqZnVuY3Rpb25cXHMqKFxcUyopXFxzKlxcKC87XG5cbkZvcm1hdHRlci5mdW5jdGlvbk5hbWUgPSBmdW5jdGlvbiBmdW5jdGlvbk5hbWUoZikge1xuICBpZihmLm5hbWUpIHtcbiAgICByZXR1cm4gZi5uYW1lO1xuICB9XG4gIHZhciBtYXRjaGVzID0gZi50b1N0cmluZygpLm1hdGNoKGZ1bmN0aW9uTmFtZVJFKTtcbiAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAvLyBgZnVuY3Rpb25OYW1lUkVgIGRvZXNuJ3QgbWF0Y2ggYXJyb3cgZnVuY3Rpb25zLlxuICAgIHJldHVybiAnJztcbiAgfVxuICB2YXIgbmFtZSA9IG1hdGNoZXNbMV07XG4gIHJldHVybiBuYW1lO1xufTtcblxuRm9ybWF0dGVyLmNvbnN0cnVjdG9yTmFtZSA9IGZ1bmN0aW9uKG9iaikge1xuICB3aGlsZSAob2JqKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgJ2NvbnN0cnVjdG9yJyk7XG4gICAgaWYgKGRlc2NyaXB0b3IgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICB0eXBlb2YgZGVzY3JpcHRvci52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuXG4gICAgICAgIHZhciBuYW1lID0gRm9ybWF0dGVyLmZ1bmN0aW9uTmFtZShkZXNjcmlwdG9yLnZhbHVlKTtcbiAgICAgICAgaWYobmFtZSAhPT0gJycpIHtcbiAgICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9iaiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICB9XG59O1xuXG5Gb3JtYXR0ZXIuZ2V0UHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24ob2JqLCB2YWx1ZSkge1xuICB2YXIgZGVzYztcbiAgdHJ5IHtcbiAgICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHZhbHVlKSB8fCB7dmFsdWU6IG9ialt2YWx1ZV19O1xuICB9IGNhdGNoKGUpIHtcbiAgICBkZXNjID0ge3ZhbHVlOiBlfTtcbiAgfVxuICByZXR1cm4gZGVzYztcbn07XG5cbkZvcm1hdHRlci5nZW5lcmF0ZUZ1bmN0aW9uRm9ySW5kZXhlZEFycmF5ID0gZnVuY3Rpb24gZ2VuZXJhdGVGdW5jdGlvbkZvckluZGV4ZWRBcnJheShsZW5ndGhQcm9wLCBuYW1lLCBwYWRkaW5nKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBtYXggPSB0aGlzLmJ5dGVBcnJheU1heExlbmd0aCB8fCA1MDtcbiAgICB2YXIgbGVuZ3RoID0gdmFsdWVbbGVuZ3RoUHJvcF07XG4gICAgdmFyIGZvcm1hdHRlZFZhbHVlcyA9IFtdO1xuICAgIHZhciBsZW4gPSAwO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBtYXggJiYgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgYiA9IHZhbHVlW2ldIHx8IDA7XG4gICAgICB2YXIgdiA9IHV0aWwucGFkMChiLnRvU3RyaW5nKDE2KSwgcGFkZGluZyk7XG4gICAgICBsZW4gKz0gdi5sZW5ndGg7XG4gICAgICBmb3JtYXR0ZWRWYWx1ZXMucHVzaCh2KTtcbiAgICB9XG4gICAgdmFyIHByZWZpeCA9IHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUgfHwgbmFtZSB8fCAnJztcbiAgICBpZihwcmVmaXgpIHByZWZpeCArPSAnICc7XG5cbiAgICBpZihmb3JtYXR0ZWRWYWx1ZXMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHByZWZpeCArICdbXSc7XG5cbiAgICBpZihsZW4gPD0gdGhpcy5tYXhMaW5lTGVuZ3RoKSB7XG4gICAgICByZXR1cm4gcHJlZml4ICsgJ1sgJyArIGZvcm1hdHRlZFZhbHVlcy5qb2luKHRoaXMucHJvcFNlcCArICcgJykgKyAnICcgKyAnXSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwcmVmaXggKyAnW1xcbicgKyBmb3JtYXR0ZWRWYWx1ZXMubWFwKHV0aWwuYWRkU3BhY2VzKS5qb2luKHRoaXMucHJvcFNlcCArICdcXG4nKSArICdcXG4nICsgJ10nO1xuICAgIH1cbiAgfTtcbn07XG5cbkZvcm1hdHRlci5hZGQoJ3VuZGVmaW5lZCcsIGZ1bmN0aW9uKCkgeyByZXR1cm4gJ3VuZGVmaW5lZCcgfSk7XG5Gb3JtYXR0ZXIuYWRkKCdudWxsJywgZnVuY3Rpb24oKSB7IHJldHVybiAnbnVsbCcgfSk7XG5Gb3JtYXR0ZXIuYWRkKCdib29sZWFuJywgZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlID8gJ3RydWUnOiAnZmFsc2UnIH0pO1xuRm9ybWF0dGVyLmFkZCgnc3ltYm9sJywgZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCkgfSk7XG5cblsnbnVtYmVyJywgJ2Jvb2xlYW4nXS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgbmFtZSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybWF0T2JqZWN0KHZhbHVlLCB7XG4gICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogW1snW1tQcmltaXRpdmVWYWx1ZV1dJywgdmFsdWUudmFsdWVPZigpXV1cbiAgICB9KTtcbiAgfSk7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ3N0cmluZycsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHZhciByZWFsVmFsdWUgPSB2YWx1ZS52YWx1ZU9mKCk7XG5cbiAgcmV0dXJuIHRoaXMuX2Zvcm1hdE9iamVjdCh2YWx1ZSwge1xuICAgIGtleUZpbHRlcjogZnVuY3Rpb24oa2V5KSB7XG4gICAgICAvL3NraXAgdXNlbGVzcyBpbmRleGVkIHByb3BlcnRpZXNcbiAgICAgIHJldHVybiAhKGtleS5tYXRjaCgvXFxkKy8pICYmIHBhcnNlSW50KGtleSwgMTApIDwgcmVhbFZhbHVlLmxlbmd0aCk7XG4gICAgfSxcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogW1snW1tQcmltaXRpdmVWYWx1ZV1dJywgcmVhbFZhbHVlXV1cbiAgfSk7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ3JlZ2V4cCcsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9mb3JtYXRPYmplY3QodmFsdWUsIHtcbiAgICB2YWx1ZTogU3RyaW5nKHZhbHVlKVxuICB9KTtcbn0pO1xuXG5Gb3JtYXR0ZXIuYWRkKCdudW1iZXInLCBmdW5jdGlvbih2YWx1ZSkge1xuICBpZih2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSByZXR1cm4gJy0wJztcbiAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnc3RyaW5nJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX2Zvcm1hdE9iamVjdCh2YWx1ZSk7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ2FyZ3VtZW50cycsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9mb3JtYXRPYmplY3QodmFsdWUsIHtcbiAgICBwcmVmaXg6ICdBcmd1bWVudHMnLFxuICAgIGZvcm1hdFByb3BlcnR5TmFtZTogZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZigha2V5Lm1hdGNoKC9cXGQrLykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0UHJvcGVydHlOYW1lKGtleSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBicmFja2V0czogWydbJywgJ10nXVxuICB9KTtcbn0pO1xuXG5Gb3JtYXR0ZXIuYWRkKCdvYmplY3QnLCAnYXJyYXknLCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fZm9ybWF0T2JqZWN0KHZhbHVlLCB7XG4gICAgZm9ybWF0UHJvcGVydHlOYW1lOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmKCFrZXkubWF0Y2goL1xcZCsvKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXRQcm9wZXJ0eU5hbWUoa2V5KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGJyYWNrZXRzOiBbJ1snLCAnXSddXG4gIH0pO1xufSk7XG5cblxuZnVuY3Rpb24gZm9ybWF0RGF0ZSh2YWx1ZSwgaXNVVEMpIHtcbiAgdmFyIHByZWZpeCA9IGlzVVRDID8gJ1VUQycgOiAnJztcblxuICB2YXIgZGF0ZSA9IHZhbHVlWydnZXQnICsgcHJlZml4ICsgJ0Z1bGxZZWFyJ10oKSArXG4gICAgJy0nICtcbiAgICB1dGlsLnBhZDAodmFsdWVbJ2dldCcgKyBwcmVmaXggKyAnTW9udGgnXSgpICsgMSwgMikgK1xuICAgICctJyArXG4gICAgdXRpbC5wYWQwKHZhbHVlWydnZXQnICsgcHJlZml4ICsgJ0RhdGUnXSgpLCAyKTtcblxuICB2YXIgdGltZSA9IHV0aWwucGFkMCh2YWx1ZVsnZ2V0JyArIHByZWZpeCArICdIb3VycyddKCksIDIpICtcbiAgICAnOicgK1xuICAgIHV0aWwucGFkMCh2YWx1ZVsnZ2V0JyArIHByZWZpeCArICdNaW51dGVzJ10oKSwgMikgK1xuICAgICc6JyArXG4gICAgdXRpbC5wYWQwKHZhbHVlWydnZXQnICsgcHJlZml4ICsgJ1NlY29uZHMnXSgpLCAyKSArXG4gICAgJy4nICtcbiAgICB1dGlsLnBhZDAodmFsdWVbJ2dldCcgKyBwcmVmaXggKyAnTWlsbGlzZWNvbmRzJ10oKSwgMyk7XG5cbiAgdmFyIHRvID0gdmFsdWUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgdmFyIGFic1RvID0gTWF0aC5hYnModG8pO1xuICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKGFic1RvIC8gNjApO1xuICB2YXIgbWludXRlcyA9IGFic1RvIC0gaG91cnMgKiA2MDtcbiAgdmFyIHR6Rm9ybWF0ID0gKHRvIDwgMCA/ICcrJyA6ICctJykgKyB1dGlsLnBhZDAoaG91cnMsIDIpICsgdXRpbC5wYWQwKG1pbnV0ZXMsIDIpO1xuXG4gIHJldHVybiBkYXRlICsgJyAnICsgdGltZSArIChpc1VUQyA/ICcnIDogJyAnICsgdHpGb3JtYXQpO1xufVxuXG5Gb3JtYXR0ZXIuYWRkKCdvYmplY3QnLCAnZGF0ZScsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9mb3JtYXRPYmplY3QodmFsdWUsIHsgdmFsdWU6IGZvcm1hdERhdGUodmFsdWUsIHRoaXMuaXNVVENkYXRlKSB9KTtcbn0pO1xuXG5Gb3JtYXR0ZXIuYWRkKCdmdW5jdGlvbicsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9mb3JtYXRPYmplY3QodmFsdWUsIHtcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogW1snbmFtZScsIEZvcm1hdHRlci5mdW5jdGlvbk5hbWUodmFsdWUpXV1cbiAgfSk7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ2Vycm9yJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX2Zvcm1hdE9iamVjdCh2YWx1ZSwge1xuICAgIHByZWZpeDogdmFsdWUubmFtZSxcbiAgICBhZGRpdGlvbmFsUHJvcGVydGllczogW1snbWVzc2FnZScsIHZhbHVlLm1lc3NhZ2VdXVxuICB9KTtcbn0pO1xuXG5Gb3JtYXR0ZXIuYWRkKCdvYmplY3QnLCAnYnVmZmVyJywgRm9ybWF0dGVyLmdlbmVyYXRlRnVuY3Rpb25Gb3JJbmRleGVkQXJyYXkoJ2xlbmd0aCcsICdCdWZmZXInLCAyKSk7XG5cbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICdhcnJheS1idWZmZXInLCBGb3JtYXR0ZXIuZ2VuZXJhdGVGdW5jdGlvbkZvckluZGV4ZWRBcnJheSgnYnl0ZUxlbmd0aCcsICdBcnJheUJ1ZmZlcicsIDIpKTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ3R5cGVkLWFycmF5JywgJ2ludDgnLCBGb3JtYXR0ZXIuZ2VuZXJhdGVGdW5jdGlvbkZvckluZGV4ZWRBcnJheSgnbGVuZ3RoJywgJ0ludDhBcnJheScsIDIpKTtcbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICd0eXBlZC1hcnJheScsICd1aW50OCcsIEZvcm1hdHRlci5nZW5lcmF0ZUZ1bmN0aW9uRm9ySW5kZXhlZEFycmF5KCdsZW5ndGgnLCAnVWludDhBcnJheScsIDIpKTtcbkZvcm1hdHRlci5hZGQoJ29iamVjdCcsICd0eXBlZC1hcnJheScsICd1aW50OGNsYW1wZWQnLCBGb3JtYXR0ZXIuZ2VuZXJhdGVGdW5jdGlvbkZvckluZGV4ZWRBcnJheSgnbGVuZ3RoJywgJ1VpbnQ4Q2xhbXBlZEFycmF5JywgMikpO1xuXG5Gb3JtYXR0ZXIuYWRkKCdvYmplY3QnLCAndHlwZWQtYXJyYXknLCAnaW50MTYnLCBGb3JtYXR0ZXIuZ2VuZXJhdGVGdW5jdGlvbkZvckluZGV4ZWRBcnJheSgnbGVuZ3RoJywgJ0ludDE2QXJyYXknLCA0KSk7XG5Gb3JtYXR0ZXIuYWRkKCdvYmplY3QnLCAndHlwZWQtYXJyYXknLCAndWludDE2JywgRm9ybWF0dGVyLmdlbmVyYXRlRnVuY3Rpb25Gb3JJbmRleGVkQXJyYXkoJ2xlbmd0aCcsICdVaW50MTZBcnJheScsIDQpKTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ3R5cGVkLWFycmF5JywgJ2ludDMyJywgRm9ybWF0dGVyLmdlbmVyYXRlRnVuY3Rpb25Gb3JJbmRleGVkQXJyYXkoJ2xlbmd0aCcsICdJbnQzMkFycmF5JywgOCkpO1xuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ3R5cGVkLWFycmF5JywgJ3VpbnQzMicsIEZvcm1hdHRlci5nZW5lcmF0ZUZ1bmN0aW9uRm9ySW5kZXhlZEFycmF5KCdsZW5ndGgnLCAnVWludDMyQXJyYXknLCA4KSk7XG5cbi8vVE9ETyBhZGQgZmxvYXQzMiBhbmQgZmxvYXQ2NFxuXG5Gb3JtYXR0ZXIuYWRkKCdvYmplY3QnLCAncHJvbWlzZScsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1tQcm9taXNlXSc7Ly9UT0RPIGl0IGNvdWxkIGJlIG5pY2UgdG8gaW5zcGVjdCBpdHMgc3RhdGUgYW5kIHZhbHVlXG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ3hocicsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1tYTUxIdHRwUmVxdWVzdF0nOy8vVE9ETyBpdCBjb3VsZCBiZSBuaWNlIHRvIGluc3BlY3QgaXRzIHN0YXRlXG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ2h0bWwtZWxlbWVudCcsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5vdXRlckhUTUw7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ2h0bWwtZWxlbWVudCcsICcjdGV4dCcsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5ub2RlVmFsdWU7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ2h0bWwtZWxlbWVudCcsICcjZG9jdW1lbnQnLCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuZG9jdW1lbnRFbGVtZW50Lm91dGVySFRNTDtcbn0pO1xuXG5Gb3JtYXR0ZXIuYWRkKCdvYmplY3QnLCAnaG9zdCcsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1tIb3N0XSc7XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ3NldCcsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHZhciBpdGVyID0gdmFsdWUudmFsdWVzKCk7XG4gIHZhciBsZW4gPSAwO1xuXG4gIHRoaXMuc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgcHJvcHMgPSBbXTtcblxuICB2YXIgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICB3aGlsZSghbmV4dC5kb25lKSB7XG4gICAgdmFyIHZhbCA9IG5leHQudmFsdWU7XG4gICAgdmFyIGYgPSB0aGlzLmZvcm1hdCh2YWwpO1xuICAgIGxlbiArPSBmLmxlbmd0aDtcbiAgICBwcm9wcy5wdXNoKGYpO1xuXG4gICAgbmV4dCA9IGl0ZXIubmV4dCgpO1xuICB9XG5cbiAgdGhpcy5zZWVuLnBvcCgpO1xuXG4gIGlmKHByb3BzLmxlbmd0aCA9PT0gMCkgcmV0dXJuICdTZXQge30nO1xuXG4gIGlmKGxlbiA8PSB0aGlzLm1heExpbmVMZW5ndGgpIHtcbiAgICByZXR1cm4gJ1NldCB7ICcgKyBwcm9wcy5qb2luKHRoaXMucHJvcFNlcCArICcgJykgKyAnIH0nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnU2V0IHtcXG4nICsgcHJvcHMubWFwKHV0aWwuYWRkU3BhY2VzKS5qb2luKHRoaXMucHJvcFNlcCArICdcXG4nKSArICdcXG4nICsgJ30nO1xuICB9XG59KTtcblxuRm9ybWF0dGVyLmFkZCgnb2JqZWN0JywgJ21hcCcsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHZhciBpdGVyID0gdmFsdWUuZW50cmllcygpO1xuICB2YXIgbGVuID0gMDtcblxuICB0aGlzLnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIHByb3BzID0gW107XG5cbiAgdmFyIG5leHQgPSBpdGVyLm5leHQoKTtcbiAgd2hpbGUoIW5leHQuZG9uZSkge1xuICAgIHZhciB2YWwgPSBuZXh0LnZhbHVlO1xuICAgIHZhciBmSyA9IHRoaXMuZm9ybWF0KHZhbFswXSk7XG4gICAgdmFyIGZWID0gdGhpcy5mb3JtYXQodmFsWzFdKTtcblxuICAgIHZhciBmO1xuICAgIGlmKChmSy5sZW5ndGggKyBmVi5sZW5ndGggKyA0KSA8PSB0aGlzLm1heExpbmVMZW5ndGgpIHtcbiAgICAgIGYgPSBmSyArICcgPT4gJyArIGZWO1xuICAgIH0gZWxzZSB7XG4gICAgICBmID0gZksgKyAnID0+XFxuJyArIGZWO1xuICAgIH1cblxuICAgIGxlbiArPSBmSy5sZW5ndGggKyBmVi5sZW5ndGggKyA0O1xuICAgIHByb3BzLnB1c2goZik7XG5cbiAgICBuZXh0ID0gaXRlci5uZXh0KCk7XG4gIH1cblxuICB0aGlzLnNlZW4ucG9wKCk7XG5cbiAgaWYocHJvcHMubGVuZ3RoID09PSAwKSByZXR1cm4gJ01hcCB7fSc7XG5cbiAgaWYobGVuIDw9IHRoaXMubWF4TGluZUxlbmd0aCkge1xuICAgIHJldHVybiAnTWFwIHsgJyArIHByb3BzLmpvaW4odGhpcy5wcm9wU2VwICsgJyAnKSArICcgfSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdNYXAge1xcbicgKyBwcm9wcy5tYXAodXRpbC5hZGRTcGFjZXMpLmpvaW4odGhpcy5wcm9wU2VwICsgJ1xcbicpICsgJ1xcbicgKyAnfSc7XG4gIH1cbn0pO1xuXG5Gb3JtYXR0ZXIucHJvdG90eXBlLmRlZmF1bHRGb3JtYXQgPSBGb3JtYXR0ZXIucHJvdG90eXBlLl9mb3JtYXRfb2JqZWN0O1xuXG5mdW5jdGlvbiBkZWZhdWx0Rm9ybWF0KHZhbHVlLCBvcHRzKSB7XG4gIHJldHVybiBuZXcgRm9ybWF0dGVyKG9wdHMpLmZvcm1hdCh2YWx1ZSk7XG59XG5cbmRlZmF1bHRGb3JtYXQuRm9ybWF0dGVyID0gRm9ybWF0dGVyO1xubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0Rm9ybWF0O1xuIiwiZnVuY3Rpb24gYWRkU3BhY2VzKHYpIHtcbiAgcmV0dXJuIHYuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbih2dikgeyByZXR1cm4gJyAgJyArIHZ2OyB9KS5qb2luKCdcXG4nKTtcbn1cblxuZnVuY3Rpb24gcGFkKHN0ciwgdmFsdWUsIGZpbGxlcikge1xuICBzdHIgPSBTdHJpbmcoc3RyKVxuICB2YXIgaXNSaWdodCA9IGZhbHNlO1xuXG4gIGlmKHZhbHVlIDwgMCkge1xuICAgIGlzUmlnaHQgPSB0cnVlO1xuICAgIHZhbHVlID0gLXZhbHVlO1xuICB9XG5cbiAgaWYoc3RyLmxlbmd0aCA8IHZhbHVlKSB7XG4gICAgdmFyIHBhZGRpbmcgPSBuZXcgQXJyYXkodmFsdWUgLSBzdHIubGVuZ3RoICsgMSkuam9pbihmaWxsZXIpO1xuICAgIHJldHVybiBpc1JpZ2h0ID8gc3RyICsgcGFkZGluZyA6IHBhZGRpbmcgKyBzdHI7XG4gIH0gZWxzZXtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGRTcGFjZXM6IGFkZFNwYWNlcyxcbiAgcGFkOiBwYWQsXG4gIHBhZDA6IGZ1bmN0aW9uKHN0ciwgdmFsdWUpIHtcbiAgICByZXR1cm4gcGFkKHN0ciwgdmFsdWUsICcwJyk7XG4gIH1cbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xyXG5cclxudmFyIHR5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xyXG5cclxuLyoqXHJcbiAqIFNpbXBsZSBkYXRhIGZ1bmN0aW9uIHRvIHN0b3JlIHR5cGUgaW5mb3JtYXRpb25cclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVXN1YWxseSB3aGF0IGlzIHJldHVybmVkIGZyb20gdHlwZW9mXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBjbHMgIFNhbml0aXplZCBAQ2xhc3MgdmlhIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcclxuICogQHBhcmFtIHtzdHJpbmd9IHN1YiAgSWYgdHlwZSBhbmQgY2xzIHRoZSBzYW1lLCBhbmQgbmVlZCB0byBzcGVjaWZ5IHNvbWVob3dcclxuICogQHByaXZhdGVcclxuICogQGV4YW1wbGVcclxuICpcclxuICogLy9mb3IgbnVsbFxyXG4gKiBuZXcgVHlwZSgnbnVsbCcpO1xyXG4gKlxyXG4gKiAvL2ZvciBEYXRlXHJcbiAqIG5ldyBUeXBlKCdvYmplY3QnLCAnZGF0ZScpO1xyXG4gKlxyXG4gKiAvL2ZvciBVaW50OEFycmF5XHJcbiAqXHJcbiAqIG5ldyBUeXBlKCdvYmplY3QnLCAndHlwZWQtYXJyYXknLCAndWludDgnKTtcclxuICovXHJcbmZ1bmN0aW9uIFR5cGUodHlwZSwgY2xzLCBzdWIpIHtcclxuICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gIHRoaXMuY2xzID0gY2xzO1xyXG4gIHRoaXMuc3ViID0gc3ViO1xyXG59XHJcblxyXG4vKipcclxuICogRnVuY3Rpb24gdG8gc3RvcmUgdHlwZSBjaGVja3NcclxuICogQHByaXZhdGVcclxuICovXHJcbmZ1bmN0aW9uIFR5cGVDaGVja2VyKCkge1xyXG4gIHRoaXMuY2hlY2tzID0gW107XHJcbn1cclxuXHJcblR5cGVDaGVja2VyLnByb3RvdHlwZSA9IHtcclxuICBhZGQ6IGZ1bmN0aW9uKGZ1bmMpIHtcclxuICAgIHRoaXMuY2hlY2tzLnB1c2goZnVuYyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuICBhZGRUeXBlT2Y6IGZ1bmN0aW9uKHR5cGUsIHJlcykge1xyXG4gICAgcmV0dXJuIHRoaXMuYWRkKGZ1bmN0aW9uKG9iaiwgdHBlT2YpIHtcclxuICAgICAgaWYodHBlT2YgPT09IHR5cGUpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFR5cGUocmVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGNscywgcmVzLCBzdWIpIHtcclxuICAgIHJldHVybiB0aGlzLmFkZChmdW5jdGlvbihvYmosIHRwZU9mLCBvYmpDbHMpIHtcclxuICAgICAgaWYob2JqQ2xzID09PSBjbHMpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFR5cGUodHlwZXMuT0JKRUNULCByZXMsIHN1Yik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIGdldFR5cGU6IGZ1bmN0aW9uKG9iaikge1xyXG4gICAgdmFyIHR5cGVPZiA9IHR5cGVvZiBvYmo7XHJcbiAgICB2YXIgY2xzID0gdG9TdHJpbmcuY2FsbChvYmopO1xyXG5cclxuICAgIGZvcih2YXIgaSA9IDAsIGwgPSB0aGlzLmNoZWNrcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgdmFyIHJlcyA9IHRoaXMuY2hlY2tzW2ldLmNhbGwodGhpcywgb2JqLCB0eXBlT2YsIGNscyk7XHJcbiAgICAgIGlmKHR5cGVvZiByZXMgIT09ICd1bmRlZmluZWQnKSByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbn07XHJcblxyXG52YXIgbWFpbiA9IG5ldyBUeXBlQ2hlY2tlcigpO1xyXG5cclxuLy9UT0RPIGFkZCBpdGVyYXRvcnNcclxuXHJcbm1haW5cclxuICAuYWRkVHlwZU9mKHR5cGVzLk5VTUJFUiwgdHlwZXMuTlVNQkVSKVxyXG4gIC5hZGRUeXBlT2YodHlwZXMuVU5ERUZJTkVELCB0eXBlcy5VTkRFRklORUQpXHJcbiAgLmFkZFR5cGVPZih0eXBlcy5TVFJJTkcsIHR5cGVzLlNUUklORylcclxuICAuYWRkVHlwZU9mKHR5cGVzLkJPT0xFQU4sIHR5cGVzLkJPT0xFQU4pXHJcbiAgLmFkZFR5cGVPZih0eXBlcy5GVU5DVElPTiwgdHlwZXMuRlVOQ1RJT04pXHJcbiAgLmFkZFR5cGVPZih0eXBlcy5TWU1CT0wsIHR5cGVzLlNZTUJPTClcclxuICAuYWRkKGZ1bmN0aW9uKG9iaiwgdHBlT2YpIHtcclxuICAgIGlmKG9iaiA9PT0gbnVsbCkgcmV0dXJuIG5ldyBUeXBlKHR5cGVzLk5VTEwpO1xyXG4gIH0pXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IFN0cmluZ10nLCB0eXBlcy5TVFJJTkcpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IEJvb2xlYW5dJywgdHlwZXMuQk9PTEVBTilcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgTnVtYmVyXScsIHR5cGVzLk5VTUJFUilcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgQXJyYXldJywgdHlwZXMuQVJSQVkpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IFJlZ0V4cF0nLCB0eXBlcy5SRUdFWFApXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IEVycm9yXScsIHR5cGVzLkVSUk9SKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBEYXRlXScsIHR5cGVzLkRBVEUpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IEFyZ3VtZW50c10nLCB0eXBlcy5BUkdVTUVOVFMpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IE1hdGhdJylcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgSlNPTl0nKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBBcnJheUJ1ZmZlcl0nLCB0eXBlcy5BUlJBWV9CVUZGRVIpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IEludDhBcnJheV0nLCB0eXBlcy5UWVBFRF9BUlJBWSwgJ2ludDgnKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBVaW50OEFycmF5XScsIHR5cGVzLlRZUEVEX0FSUkFZLCAndWludDgnKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLCB0eXBlcy5UWVBFRF9BUlJBWSwgJ3VpbnQ4Y2xhbXBlZCcpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IEludDE2QXJyYXldJywgdHlwZXMuVFlQRURfQVJSQVksICdpbnQxNicpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IFVpbnQxNkFycmF5XScsIHR5cGVzLlRZUEVEX0FSUkFZLCAndWludDE2JylcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgSW50MzJBcnJheV0nLCB0eXBlcy5UWVBFRF9BUlJBWSwgJ2ludDMyJylcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgVWludDMyQXJyYXldJywgdHlwZXMuVFlQRURfQVJSQVksICd1aW50MzInKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBGbG9hdDMyQXJyYXldJywgdHlwZXMuVFlQRURfQVJSQVksICdmbG9hdDMyJylcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsIHR5cGVzLlRZUEVEX0FSUkFZLCAnZmxvYXQ2NCcpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IERhdGFWaWV3XScsIHR5cGVzLkRBVEFfVklFVylcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgTWFwXScsIHR5cGVzLk1BUClcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgV2Vha01hcF0nLCB0eXBlcy5XRUFLX01BUClcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgU2V0XScsIHR5cGVzLlNFVClcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgV2Vha1NldF0nLCB0eXBlcy5XRUFLX1NFVClcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgUHJvbWlzZV0nLCB0eXBlcy5QUk9NSVNFKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBCbG9iXScsIHR5cGVzLkJMT0IpXHJcbiAgLmFkZENsYXNzKCdbb2JqZWN0IEZpbGVdJywgdHlwZXMuRklMRSlcclxuICAuYWRkQ2xhc3MoJ1tvYmplY3QgRmlsZUxpc3RdJywgdHlwZXMuRklMRV9MSVNUKVxyXG4gIC5hZGRDbGFzcygnW29iamVjdCBYTUxIdHRwUmVxdWVzdF0nLCB0eXBlcy5YSFIpXHJcbiAgLmFkZChmdW5jdGlvbihvYmopIHtcclxuICAgIGlmKCh0eXBlb2YgUHJvbWlzZSA9PT0gdHlwZXMuRlVOQ1RJT04gJiYgb2JqIGluc3RhbmNlb2YgUHJvbWlzZSkgfHxcclxuICAgICAgICAodHlwZW9mIG9iai50aGVuID09PSB0eXBlcy5GVU5DVElPTikpIHtcclxuICAgICAgICAgIHJldHVybiBuZXcgVHlwZSh0eXBlcy5PQkpFQ1QsIHR5cGVzLlBST01JU0UpO1xyXG4gICAgICAgIH1cclxuICB9KVxyXG4gIC5hZGQoZnVuY3Rpb24ob2JqKSB7XHJcbiAgICBpZih0eXBlb2YgQnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiBvYmogaW5zdGFuY2VvZiBCdWZmZXIpIHtcclxuICAgICAgcmV0dXJuIG5ldyBUeXBlKHR5cGVzLk9CSkVDVCwgdHlwZXMuQlVGRkVSKTtcclxuICAgIH1cclxuICB9KVxyXG4gIC5hZGQoZnVuY3Rpb24ob2JqKSB7XHJcbiAgICBpZih0eXBlb2YgTm9kZSAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqIGluc3RhbmNlb2YgTm9kZSkge1xyXG4gICAgICByZXR1cm4gbmV3IFR5cGUodHlwZXMuT0JKRUNULCB0eXBlcy5IVE1MX0VMRU1FTlQsIG9iai5ub2RlTmFtZSk7XHJcbiAgICB9XHJcbiAgfSlcclxuICAuYWRkKGZ1bmN0aW9uKG9iaikge1xyXG4gICAgLy8gcHJvYmFibHkgYXQgdGhlIGJlZ2dpbmdpbmcgc2hvdWxkIGJlIGVub3VnaCB0aGVzZSBjaGVja3NcclxuICAgIGlmKG9iai5Cb29sZWFuID09PSBCb29sZWFuICYmIG9iai5OdW1iZXIgPT09IE51bWJlciAmJiBvYmouU3RyaW5nID09PSBTdHJpbmcgJiYgb2JqLkRhdGUgPT09IERhdGUpIHtcclxuICAgICAgcmV0dXJuIG5ldyBUeXBlKHR5cGVzLk9CSkVDVCwgdHlwZXMuSE9TVCk7XHJcbiAgICB9XHJcbiAgfSlcclxuICAuYWRkKGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIG5ldyBUeXBlKHR5cGVzLk9CSkVDVCk7XHJcbiAgfSk7XHJcblxyXG4vKipcclxuICogR2V0IHR5cGUgaW5mb3JtYXRpb24gb2YgYW55dGhpbmdcclxuICpcclxuICogQHBhcmFtICB7YW55fSBvYmogQW55dGhpbmcgdGhhdCBjb3VsZCByZXF1aXJlIHR5cGUgaW5mb3JtYXRpb25cclxuICogQHJldHVybiB7VHlwZX0gICAgdHlwZSBpbmZvXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRHbG9iYWxUeXBlKG9iaikge1xyXG4gIHJldHVybiBtYWluLmdldFR5cGUob2JqKTtcclxufVxyXG5cclxuZ2V0R2xvYmFsVHlwZS5jaGVja2VyID0gbWFpbjtcclxuZ2V0R2xvYmFsVHlwZS5UeXBlQ2hlY2tlciA9IFR5cGVDaGVja2VyO1xyXG5nZXRHbG9iYWxUeXBlLlR5cGUgPSBUeXBlO1xyXG5cclxuT2JqZWN0LmtleXModHlwZXMpLmZvckVhY2goZnVuY3Rpb24odHlwZU5hbWUpIHtcclxuICBnZXRHbG9iYWxUeXBlW3R5cGVOYW1lXSA9IHR5cGVzW3R5cGVOYW1lXTtcclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdldEdsb2JhbFR5cGU7XHJcbiIsInZhciB0eXBlcyA9IHtcclxuICBOVU1CRVI6ICdudW1iZXInLFxyXG4gIFVOREVGSU5FRDogJ3VuZGVmaW5lZCcsXHJcbiAgU1RSSU5HOiAnc3RyaW5nJyxcclxuICBCT09MRUFOOiAnYm9vbGVhbicsXHJcbiAgT0JKRUNUOiAnb2JqZWN0JyxcclxuICBGVU5DVElPTjogJ2Z1bmN0aW9uJyxcclxuICBOVUxMOiAnbnVsbCcsXHJcbiAgQVJSQVk6ICdhcnJheScsXHJcbiAgUkVHRVhQOiAncmVnZXhwJyxcclxuICBEQVRFOiAnZGF0ZScsXHJcbiAgRVJST1I6ICdlcnJvcicsXHJcbiAgQVJHVU1FTlRTOiAnYXJndW1lbnRzJyxcclxuICBTWU1CT0w6ICdzeW1ib2wnLFxyXG4gIEFSUkFZX0JVRkZFUjogJ2FycmF5LWJ1ZmZlcicsXHJcbiAgVFlQRURfQVJSQVk6ICd0eXBlZC1hcnJheScsXHJcbiAgREFUQV9WSUVXOiAnZGF0YS12aWV3JyxcclxuICBNQVA6ICdtYXAnLFxyXG4gIFNFVDogJ3NldCcsXHJcbiAgV0VBS19TRVQ6ICd3ZWFrLXNldCcsXHJcbiAgV0VBS19NQVA6ICd3ZWFrLW1hcCcsXHJcbiAgUFJPTUlTRTogJ3Byb21pc2UnLFxyXG5cclxuLy8gbm9kZSBidWZmZXJcclxuICBCVUZGRVI6ICdidWZmZXInLFxyXG5cclxuLy8gZG9tIGh0bWwgZWxlbWVudFxyXG4gIEhUTUxfRUxFTUVOVDogJ2h0bWwtZWxlbWVudCcsXHJcbiAgSFRNTF9FTEVNRU5UX1RFWFQ6ICdodG1sLWVsZW1lbnQtdGV4dCcsXHJcbiAgRE9DVU1FTlQ6ICdkb2N1bWVudCcsXHJcbiAgV0lORE9XOiAnd2luZG93JyxcclxuICBGSUxFOiAnZmlsZScsXHJcbiAgRklMRV9MSVNUOiAnZmlsZS1saXN0JyxcclxuICBCTE9COiAnYmxvYicsXHJcblxyXG4gIEhPU1Q6ICdob3N0JyxcclxuXHJcbiAgWEhSOiAneGhyJ1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB0eXBlcztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpbnNwaXJhdGlvbkFyY2hpdGVjdEZhY3RvcnkgPSByZXF1aXJlKCcuLi9pbnNwaXJhdGlvbi1hcmNoaXRlY3QubWluJyk7XG5cbnZhciBzaG91bGQgPSByZXF1aXJlKCdzaG91bGQnKTtcblxudmFyIF9nZXQgPSByZXF1aXJlKCdsb2Rhc2gvZ2V0Jyk7XG52YXIgX3NldCA9IHJlcXVpcmUoJ2xvZGFzaC9zZXQnKTtcblxudmFyIGdsb2JhbFRlc3RzID0gcmVxdWlyZSgnLi9nbG9iYWwtdGVzdHMnKTtcbnZhciBmYWN0b3J5VGVzdHMgPSByZXF1aXJlKCcuL2ZhY3RvcnktdGVzdHMnKTtcblxudmFyIGNvbmZpZ19maWxlcyA9IHJlcXVpcmUoJy4uL3Rlc3QvZml4dHVyZXMvc2FtcGxlLWFwcC9jb25maWcvKi5qcycsIHttb2RlOiAnaGFzaCcsIG9wdGlvbnM6IHtkb3Q6IHRydWV9fSk7XG52YXIgZW1wdHlfY29uZmlnX2ZpbGVzID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9lbXB0eS8qLmpzJywge21vZGU6ICdoYXNoJ30pO1xudmFyIHByb3ZpZGVyX2ZpbGVzID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9zYW1wbGUtYXBwL3Byb3ZpZGVycy8qLmpzJywge21vZGU6ICdoYXNoJ30pO1xudmFyIGVtcHR5X3Byb3ZpZGVyX2ZpbGVzID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9lbXB0eS8qLmpzJywge21vZGU6ICdoYXNoJ30pO1xuXG5mYWN0b3J5VGVzdHMoaW5zcGlyYXRpb25BcmNoaXRlY3RGYWN0b3J5KTtcblxuZGVzY3JpYmUoJ2Jyb3dzZXJpZnkgdGVzdHMnLCBmdW5jdGlvbigpIHtcblxuICAgIGRlc2NyaWJlKCdkaWZmZXJlbnQgY29uZmlnIGZpbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgZmFjdG9yeV9jb25maWcgPSB7XG4gICAgICAgICAgICBjb25maWdfZmlsZXM6IGNvbmZpZ19maWxlc1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBJbnNwaXJhdGlvbiA9IGluc3BpcmF0aW9uQXJjaGl0ZWN0RmFjdG9yeShmYWN0b3J5X2NvbmZpZyk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBydW4gdGhlIGJhc2ljIHRlc3RzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGdsb2JhbFRlc3RzKEluc3BpcmF0aW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBob25vciB0aGUgc2VydmVyIGNvbmZpZyBmaWxlcycsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICAgICAgdmFyIGluc3BpcmF0aW9uID0gbmV3IEluc3BpcmF0aW9uKCk7XG5cbiAgICAgICAgICAgIGluc3BpcmF0aW9uLmluaXQoZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2hvdWxkKGluc3BpcmF0aW9uLmFwcC5jb25maWcoJ2Ffc2FtcGxlJykpLmVxdWFsKCdvbmUnKTtcbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnYl9zYW1wbGUnKSkuZXF1YWwoJ3R3bycpO1xuICAgICAgICAgICAgICAgIHNob3VsZChpbnNwaXJhdGlvbi5hcHAuY29uZmlnKCdlX3NhbXBsZS5mX3NhbXBsZS5nX3NhbXBsZScpKS5lcXVhbCg1KTtcbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnZXh0ZXJuYWwuaF9zYW1wbGUnKSkuZXF1YWwoJ2hlbGxvJyk7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byBvdmVyd3JpdGUgc2VydmVyIGNvbmZpZyBmaWxlcycsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBhX3NhbXBsZTogJ292ZXJ3cml0dGVuJyxcbiAgICAgICAgICAgICAgICBiX3NhbXBsZTogJ2Fsc28gb3ZlcndyaXR0ZW4nLFxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiB7XG4gICAgICAgICAgICAgICAgICAgIGhfc2FtcGxlOiAndGhpcyBpcyBhbHNvIG92ZXJ3cml0dGVuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgaW5zcGlyYXRpb24gPSBuZXcgSW5zcGlyYXRpb24oe1xuICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaW5zcGlyYXRpb24uaW5pdChmdW5jdGlvbihlcnIpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnYV9zYW1wbGUnKSkuZXF1YWwoY29uZmlnLmFfc2FtcGxlKTtcbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnYl9zYW1wbGUnKSkuZXF1YWwoY29uZmlnLmJfc2FtcGxlKTtcbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnZXh0ZXJuYWwuaF9zYW1wbGUnKSkuZXF1YWwoY29uZmlnLmV4dGVybmFsLmhfc2FtcGxlKTtcbiAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnZXh0ZXJuYWwuaV9zYW1wbGUnKSkubm90LmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnbm8gY29uZmlnIGZpbGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgZmFjdG9yeV9jb25maWcgPSB7XG4gICAgICAgICAgICBjb25maWdfZmlsZXM6IGVtcHR5X2NvbmZpZ19maWxlc1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBJbnNwaXJhdGlvbiA9IGluc3BpcmF0aW9uQXJjaGl0ZWN0RmFjdG9yeShmYWN0b3J5X2NvbmZpZyk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBydW4gdGhlIGJhc2ljIHRlc3RzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIGdsb2JhbFRlc3RzKEluc3BpcmF0aW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIG92ZXJ3cml0ZSBlbXB0eSBzZXJ2ZXIgY29uZmlnIGZpbGVzJywgZnVuY3Rpb24oZG9uZSkge1xuXG4gICAgICAgICAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIGFfc2FtcGxlOiAnb3ZlcndyaXR0ZW4nLFxuICAgICAgICAgICAgICAgIGJfc2FtcGxlOiAnYWxzbyBvdmVyd3JpdHRlbicsXG4gICAgICAgICAgICAgICAgZXh0ZXJuYWw6IHtcbiAgICAgICAgICAgICAgICAgICAgaF9zYW1wbGU6ICd0aGlzIGlzIGFsc28gb3ZlcndyaXR0ZW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBpbnNwaXJhdGlvbiA9IG5ldyBJbnNwaXJhdGlvbih7XG4gICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNob3VsZChpbnNwaXJhdGlvbi5hcHAuY29uZmlnKCdhX3NhbXBsZScpKS5lcXVhbChjb25maWcuYV9zYW1wbGUpO1xuICAgICAgICAgICAgICAgIHNob3VsZChpbnNwaXJhdGlvbi5hcHAuY29uZmlnKCdiX3NhbXBsZScpKS5lcXVhbChjb25maWcuYl9zYW1wbGUpO1xuICAgICAgICAgICAgICAgIHNob3VsZChpbnNwaXJhdGlvbi5hcHAuY29uZmlnKCdleHRlcm5hbC5oX3NhbXBsZScpKS5lcXVhbChjb25maWcuZXh0ZXJuYWwuaF9zYW1wbGUpO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdyZWZlcmVuY2Ugc2VydmVyIHByb3ZpZGVycycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGZhY3RvcnlfY29uZmlnID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJfZmlsZXM6IHByb3ZpZGVyX2ZpbGVzXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIEluc3BpcmF0aW9uID0gaW5zcGlyYXRpb25BcmNoaXRlY3RGYWN0b3J5KGZhY3RvcnlfY29uZmlnKTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJ1biB0aGUgc2VydmVyIHByb3ZpZGVycyBiYXNlZCBvbiB0aGUgY29uZmlnJywgZnVuY3Rpb24oZG9uZSkge1xuXG4gICAgICAgICAgICB2YXIgaW5zcGlyYXRpb24gPSBuZXcgSW5zcGlyYXRpb24oe1xuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhZGRTb21ldGhpbmdBc3luYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYWRkU29tZXRoaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFwcCwgZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5kb1NvbWV0aGluZ0Vsc2UgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLmRvU29tZXRoaW5nQXN5bmMoKS5zaG91bGQuZXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLmRvU29tZXRoaW5nKCkuc2hvdWxkLmVxdWFsKDIpO1xuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5kb1NvbWV0aGluZ0Vsc2UoKS5zaG91bGQuZXF1YWwoMyk7XG5cbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdubyBwcm92aWRlciBmaWxlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGZhY3RvcnlfY29uZmlnID0ge1xuICAgICAgICAgICAgcHJvdmlkZXJfZmlsZXM6IGVtcHR5X3Byb3ZpZGVyX2ZpbGVzXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIEluc3BpcmF0aW9uID0gaW5zcGlyYXRpb25BcmNoaXRlY3RGYWN0b3J5KGZhY3RvcnlfY29uZmlnKTtcblxuICAgICAgICBpdCgnc2hvdWxkIHJ1biB0aGUgYmFzaWMgdGVzdHMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgZ2xvYmFsVGVzdHMoSW5zcGlyYXRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHN0aWxsIHJ1biBpbml0aWFsIHByb3ZpZGVycycsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICAgICAgdmFyIGluc3BpcmF0aW9uID0gbmV3IEluc3BpcmF0aW9uKHtcbiAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYXBwLCBkb25lKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5zb21ldGhpbmdfcHJvcGVydHkgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihhcHAsIGRvbmUpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnNvbWV0aGluZ19vdGhlcl9wcm9wZXJ0eSA9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGFwcCwgZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5zb21ldGhpbmdfdGhpcmRfcHJvcGVydHkgPSAzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zb21ldGhpbmdfcHJvcGVydHkuc2hvdWxkLmVxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zb21ldGhpbmdfb3RoZXJfcHJvcGVydHkuc2hvdWxkLmVxdWFsKDIpO1xuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zb21ldGhpbmdfdGhpcmRfcHJvcGVydHkuc2hvdWxkLmVxdWFsKDMpO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2RpZmZlcmVudCBmYWN0b3J5IGNvbmZpZyB2YWx1ZXMgY29tYmluZWQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgY29uZmlnX2Vudl9maWxlbmFtZSA9ICdsb2NhbCc7XG4gICAgICAgIHZhciBjb25maWdfYXBwX2ZpbGVuYW1lID0gJ2FwcGxpY2F0aW9uJztcbiAgICAgICAgdmFyIGNvbmZpZ19wcm92aWRlcnNfcGF0aCA9ICd0aGVzZS5hcmUubXkucHJvdmlkZXJzJztcbiAgICAgICAgdmFyIGFwcF9jb25maWdfcGF0aCA9ICdsb2NhbHMuY29uZmlnJztcblxuICAgICAgICB2YXIgZmFjdG9yeV9jb25maWcgPSB7XG4gICAgICAgICAgICBjb25maWdfZmlsZXM6IHt9LFxuICAgICAgICAgICAgY29uZmlnX2Vudl9maWxlbmFtZTogY29uZmlnX2Vudl9maWxlbmFtZSxcbiAgICAgICAgICAgIGNvbmZpZ19hcHBfZmlsZW5hbWU6IGNvbmZpZ19hcHBfZmlsZW5hbWUsXG4gICAgICAgICAgICBjb25maWdfcHJvdmlkZXJzX3BhdGg6IGNvbmZpZ19wcm92aWRlcnNfcGF0aCxcbiAgICAgICAgICAgIGFwcF9jb25maWdfcGF0aDogYXBwX2NvbmZpZ19wYXRoLFxuICAgICAgICAgICAgcHJvdmlkZXJfZmlsZXM6IHByb3ZpZGVyX2ZpbGVzXG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnlfY29uZmlnLmNvbmZpZ19maWxlc1tjb25maWdfZW52X2ZpbGVuYW1lXSA9IHtcbiAgICAgICAgICAgIGdyZWV0aW5nOiAnYWxvaGEnXG4gICAgICAgIH07XG4gICAgICAgIGZhY3RvcnlfY29uZmlnLmNvbmZpZ19maWxlc1tjb25maWdfYXBwX2ZpbGVuYW1lXSA9IHtcbiAgICAgICAgICAgIGdyZWV0aW5nOiAnaGVsbG8nLFxuICAgICAgICAgICAgcGFydGluZzogJ2dvb2RieWUnXG4gICAgICAgIH07XG4gICAgICAgIF9zZXQoZmFjdG9yeV9jb25maWcuY29uZmlnX2ZpbGVzW2NvbmZpZ19hcHBfZmlsZW5hbWVdLCBjb25maWdfcHJvdmlkZXJzX3BhdGgsIFtcbiAgICAgICAgICAgICdhZGRTb21ldGhpbmcnXG4gICAgICAgIF0pO1xuXG4gICAgICAgIHZhciBJbnNwaXJhdGlvbiA9IGluc3BpcmF0aW9uQXJjaGl0ZWN0RmFjdG9yeShmYWN0b3J5X2NvbmZpZyk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBob25vciB0aGUgZmFjdG9yeSBjb25maWcnLCBmdW5jdGlvbihkb25lKSB7XG5cbiAgICAgICAgICAgIHZhciBpbnNwaXJhdGlvbiA9IG5ldyBJbnNwaXJhdGlvbigpO1xuICAgICAgICAgICAgaW5zcGlyYXRpb24udGVzdCA9IHRydWU7XG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpZyA9IF9nZXQoaW5zcGlyYXRpb24uYXBwLCBhcHBfY29uZmlnX3BhdGgpO1xuICAgICAgICAgICAgICAgIHNob3VsZChjb25maWcoJ2dyZWV0aW5nJykpLmVxdWFsKCdhbG9oYScpO1xuICAgICAgICAgICAgICAgIHNob3VsZChjb25maWcoJ3BhcnRpbmcnKSkuZXF1YWwoJ2dvb2RieWUnKTtcbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuZG9Tb21ldGhpbmcoKS5zaG91bGQuZXF1YWwoMik7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pO1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHNob3VsZCA9IHJlcXVpcmUoJ3Nob3VsZCcpO1xudmFyIF9nZXQgPSByZXF1aXJlKCdsb2Rhc2gvZ2V0Jyk7XG52YXIgX3NldCA9IHJlcXVpcmUoJ2xvZGFzaC9zZXQnKTtcbnZhciBnbG9iYWxUZXN0cyA9IHJlcXVpcmUoJy4vZ2xvYmFsLXRlc3RzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmFjdG9yeVRlc3RzKGluc3BpcmF0aW9uQXJjaGl0ZWN0RmFjdG9yeSkge1xuICAgIGRlc2NyaWJlKCdmYWN0b3J5JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgZGVzY3JpYmUoJ2VtcHR5IGZhY3RvcnkgY29uZmlnJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBJbnNwaXJhdGlvbiA9IGluc3BpcmF0aW9uQXJjaGl0ZWN0RmFjdG9yeSgpO1xuXG4gICAgICAgICAgICBnbG9iYWxUZXN0cyhJbnNwaXJhdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdkaWZmZXJlbnQgYXBwIGNvbmZpZyBwYXRoJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBmYWN0b3J5X2NvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBhcHBfY29uZmlnX3BhdGg6ICdsb2NhbHMuY29uZmlnJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIEluc3BpcmF0aW9uID0gaW5zcGlyYXRpb25BcmNoaXRlY3RGYWN0b3J5KGZhY3RvcnlfY29uZmlnKTtcblxuICAgICAgICAgICAgZ2xvYmFsVGVzdHMoSW5zcGlyYXRpb24pO1xuXG4gICAgICAgICAgICBkZXNjcmliZSgnbG9jYWxzLmNvbmZpZycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIGFjY2VzcyB0aGUgY29uZmlnIGF0IGxvY2Fscy5jb25maWcnLCBmdW5jdGlvbihkb25lKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGluc3BpcmF0aW9uID0gbmV3IEluc3BpcmF0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyZWV0aW5nOiAnaGVsbG8nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmluaXQoZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZChfZ2V0KGluc3BpcmF0aW9uLmFwcCwgZmFjdG9yeV9jb25maWcuYXBwX2NvbmZpZ19wYXRoKSkubm90LmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAubG9jYWxzLmNvbmZpZygnZ3JlZXRpbmcnKS5zaG91bGQuZXF1YWwoJ2hlbGxvJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdkaWZmZXJlbnQgY29uZmlnIHByb3ZpZGVycyBwYXRoJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciBmYWN0b3J5X2NvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBjb25maWdfcHJvdmlkZXJzX3BhdGg6ICdjdXN0b20ucHJvdmlkZXJzJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIEluc3BpcmF0aW9uID0gaW5zcGlyYXRpb25BcmNoaXRlY3RGYWN0b3J5KGZhY3RvcnlfY29uZmlnKTtcblxuICAgICAgICAgICAgZ2xvYmFsVGVzdHMoSW5zcGlyYXRpb24pO1xuXG4gICAgICAgICAgICBkZXNjcmliZSgnY3VzdG9tLnByb3ZpZGVycycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaXQoJ3Nob3VsZCBiZSBhYmxlIHRvIHVzZSBjdXN0b20ucHJvdmlkZXJzIGFzIHRoZSBjb25maWcgcGF0aCB0byBnZXQgcHJvdmlkZXJzJywgZnVuY3Rpb24oZG9uZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb25maWcgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgX3NldChjb25maWcsICdjdXN0b20ucHJvdmlkZXJzJywgW1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oYXBwLCBkb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnNvbWV0aGluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2hlbGxvJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnNwaXJhdGlvbiA9IG5ldyBJbnNwaXJhdGlvbih7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGQoaW5zcGlyYXRpb24uYXBwLmNvbmZpZygnY3VzdG9tLnByb3ZpZGVycycpKS5ub3QuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zb21ldGhpbmcoKS5zaG91bGQuZXF1YWwoJ2hlbGxvJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTsiLCJ2YXIgc2hvdWxkID0gcmVxdWlyZSgnc2hvdWxkJyk7XG52YXIgX2dldCA9IHJlcXVpcmUoJ2xvZGFzaC9nZXQnKTtcbnZhciBfc2V0ID0gcmVxdWlyZSgnbG9kYXNoL3NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdsb2JhbFRlc3RzKEluc3BpcmF0aW9uKSB7XG5cbiAgICB2YXIgYXBwX2NvbmZpZ19wYXRoID0gSW5zcGlyYXRpb24uZmFjdG9yeV9jb25maWcuYXBwX2NvbmZpZ19wYXRoO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggbm8gaW5pdGlhbHMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBhIG5ldyBpbnNwaXJhdGlvbiBjbGFzcywgdGhlbiBhIG5ldyBpbnN0YW5jZSwgd2l0aCBhIGNvbmZpZyBmdW5jdGlvbi4nLCBmdW5jdGlvbihkb25lKSB7XG5cbiAgICAgICAgICAgIHZhciBpbnNwaXJhdGlvbiA9IG5ldyBJbnNwaXJhdGlvbigpO1xuXG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNob3VsZChfZ2V0KGluc3BpcmF0aW9uLmFwcCwgYXBwX2NvbmZpZ19wYXRoKSkubm90LmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggYW4gaW5pdGlhbCBhcHAnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgYXBwID0ge1xuICAgICAgICAgICAgbmFtZTogJ015IENvb2wgQXBwJ1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgYSBuZXcgaW5zcGlyYXRpb24gY2xhc3MsIHRoZW4gYSBuZXcgaW5zdGFuY2Ugd2l0aCB0aGUgaW5pdGlhbCBhcHAuJywgZnVuY3Rpb24oZG9uZSkge1xuXG4gICAgICAgICAgICB2YXIgaW5zcGlyYXRpb24gPSBuZXcgSW5zcGlyYXRpb24oe2FwcDogYXBwfSk7XG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc2hvdWxkLmVxdWFsKGFwcCk7XG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc2hvdWxkLmhhdmUucHJvcGVydHkoJ25hbWUnLCBhcHAubmFtZSk7XG5cbiAgICAgICAgICAgIGluc3BpcmF0aW9uLmluaXQoZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2hvdWxkKF9nZXQoaW5zcGlyYXRpb24uYXBwLCBhcHBfY29uZmlnX3BhdGgpKS5ub3QuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIGFuIGluaXRpYWwgY29uZmlnJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgICAgIGE6ICdob2xhJyxcbiAgICAgICAgICAgIGI6IHtcbiAgICAgICAgICAgICAgICBjOiAnYWxvaGEnXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgYSBuZXcgaW5zcGlyYXRpb24gY2xhc3MsIHRoZW4gYSBuZXcgaW5zdGFuY2UuJywgZnVuY3Rpb24oZG9uZSkge1xuXG4gICAgICAgICAgICB2YXIgaW5zcGlyYXRpb24gPSBuZXcgSW5zcGlyYXRpb24oe2NvbmZpZzogY29uZmlnfSk7XG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5jb25maWcuc2hvdWxkLmVxdWFsKGNvbmZpZyk7XG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2hvdWxkKF9nZXQoaW5zcGlyYXRpb24uYXBwLCBhcHBfY29uZmlnX3BhdGgpKS5ub3QuZXF1YWwodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICBfZ2V0KGluc3BpcmF0aW9uLmFwcCwgYXBwX2NvbmZpZ19wYXRoKSgnYScpLnNob3VsZC5lcXVhbChjb25maWcuYSk7XG4gICAgICAgICAgICAgICAgX2dldChpbnNwaXJhdGlvbi5hcHAsIGFwcF9jb25maWdfcGF0aCkoJ2IuYycpLnNob3VsZC5lcXVhbChjb25maWcuYi5jKTtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBhbiBpbml0aWFsIGFwcCBhbmQgYW4gaW5pdGlhbCBjb25maWcnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgYXBwID0ge1xuICAgICAgICAgICAgbmFtZTogJ015IENvb2wgQXBwJ1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgICAgICBhOiAnaG9sYScsXG4gICAgICAgICAgICBiOiB7XG4gICAgICAgICAgICAgICAgYzogJ2Fsb2hhJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGl0KCdzaG91bGQgY3JlYXRlIGEgbmV3IGluc3BpcmF0aW9uIGNsYXNzLCB0aGVuIGEgbmV3IGluc3RhbmNlLicsIGZ1bmN0aW9uKGRvbmUpIHtcblxuICAgICAgICAgICAgdmFyIGluc3BpcmF0aW9uID0gbmV3IEluc3BpcmF0aW9uKHthcHA6IGFwcCwgY29uZmlnOiBjb25maWd9KTtcbiAgICAgICAgICAgIGluc3BpcmF0aW9uLmNvbmZpZy5zaG91bGQuZXF1YWwoY29uZmlnKTtcbiAgICAgICAgICAgIGluc3BpcmF0aW9uLmluaXQoZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLnNob3VsZC5lcXVhbChhcHApO1xuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnbmFtZScsIGFwcC5uYW1lKTtcbiAgICAgICAgICAgICAgICBzaG91bGQoX2dldChpbnNwaXJhdGlvbi5hcHAsIGFwcF9jb25maWdfcGF0aCkpLm5vdC5lcXVhbCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIF9nZXQoaW5zcGlyYXRpb24uYXBwLCBhcHBfY29uZmlnX3BhdGgpKCdhJykuc2hvdWxkLmVxdWFsKGNvbmZpZy5hKTtcbiAgICAgICAgICAgICAgICBfZ2V0KGluc3BpcmF0aW9uLmFwcCwgYXBwX2NvbmZpZ19wYXRoKSgnYi5jJykuc2hvdWxkLmVxdWFsKGNvbmZpZy5iLmMpO1xuXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICBkZXNjcmliZSgnd2l0aCBhbiBpbml0aWFsIHNldCBvZiBwcm92aWRlcnMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgcHJvdmlkZXJzID0gW1xuICAgICAgICAgICAgZnVuY3Rpb24oYXBwLCBkb25lKSB7XG4gICAgICAgICAgICAgICAgYXBwLnNvbWV0aGluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihhcHAsIGRvbmUpIHtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgYXBwLnNvbWV0aGluZ0FzeW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgaXQoJ3Nob3VsZCBjcmVhdGUgYSBuZXcgaW5zcGlyYXRpb24gY2xhc3MsIHRoZW4gYSBuZXcgaW5zdGFuY2UuJywgZnVuY3Rpb24oZG9uZSkge1xuXG4gICAgICAgICAgICB2YXIgaW5zcGlyYXRpb24gPSBuZXcgSW5zcGlyYXRpb24oe3Byb3ZpZGVyczogcHJvdmlkZXJzfSk7XG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5wcm92aWRlcnMuc2hvdWxkLmVxdWFsKHByb3ZpZGVycyk7XG4gICAgICAgICAgICBpbnNwaXJhdGlvbi5pbml0KGZ1bmN0aW9uKGVycikge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnc29tZXRoaW5nJyk7XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLnNvbWV0aGluZygpLnNob3VsZC5lcXVhbCgxKTtcbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc2hvdWxkLmhhdmUucHJvcGVydHkoJ3NvbWV0aGluZ0FzeW5jJyk7XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLnNvbWV0aGluZ0FzeW5jKCkuc2hvdWxkLmVxdWFsKDIpO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIGFuIGluaXRpYWwgYXBwLCBhbiBpbml0aWFsIGNvbmZpZywgYW5kIGFuIGluaXRpYWwgc2V0IG9mIHByb3ZpZGVycycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBhcHAgPSB7XG4gICAgICAgICAgICBuYW1lOiAnTXkgQ29vbCBBcHAnXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgICAgIGE6ICdob2xhJyxcbiAgICAgICAgICAgIGI6IHtcbiAgICAgICAgICAgICAgICBjOiAnYWxvaGEnXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIF9zZXQoY29uZmlnLCBJbnNwaXJhdGlvbi5mYWN0b3J5X2NvbmZpZy5jb25maWdfcHJvdmlkZXJzX3BhdGgsIFtcbiAgICAgICAgICAgIGZ1bmN0aW9uKGFwcCwgZG9uZSkge1xuICAgICAgICAgICAgICAgIGFwcC5zb21ldGhpbmdFbHNlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDM7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIF0pO1xuXG4gICAgICAgIHZhciBwcm92aWRlcnMgPSBbXG4gICAgICAgICAgICBmdW5jdGlvbihhcHAsIGRvbmUpIHtcbiAgICAgICAgICAgICAgICBhcHAuc29tZXRoaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGFwcCwgZG9uZSkge1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICBhcHAuc29tZXRoaW5nQXN5bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBhIG5ldyBpbnNwaXJhdGlvbiBjbGFzcywgdGhlbiBhIG5ldyBpbnN0YW5jZS4nLCBmdW5jdGlvbihkb25lKSB7XG5cbiAgICAgICAgICAgIHZhciBpbnNwaXJhdGlvbiA9IG5ldyBJbnNwaXJhdGlvbih7YXBwOiBhcHAsIGNvbmZpZzogY29uZmlnLCBwcm92aWRlcnM6IHByb3ZpZGVyc30pO1xuICAgICAgICAgICAgaW5zcGlyYXRpb24uY29uZmlnLnNob3VsZC5lcXVhbChjb25maWcpO1xuICAgICAgICAgICAgaW5zcGlyYXRpb24uaW5pdChmdW5jdGlvbihlcnIpIHtcblxuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc2hvdWxkLmVxdWFsKGFwcCk7XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLnNob3VsZC5oYXZlLnByb3BlcnR5KCduYW1lJywgYXBwLm5hbWUpO1xuICAgICAgICAgICAgICAgIHNob3VsZChfZ2V0KGluc3BpcmF0aW9uLmFwcCwgYXBwX2NvbmZpZ19wYXRoKSkubm90LmVxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgX2dldChpbnNwaXJhdGlvbi5hcHAsIGFwcF9jb25maWdfcGF0aCkoJ2EnKS5zaG91bGQuZXF1YWwoY29uZmlnLmEpO1xuICAgICAgICAgICAgICAgIF9nZXQoaW5zcGlyYXRpb24uYXBwLCBhcHBfY29uZmlnX3BhdGgpKCdiLmMnKS5zaG91bGQuZXF1YWwoY29uZmlnLmIuYyk7XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLnNob3VsZC5oYXZlLnByb3BlcnR5KCdzb21ldGhpbmcnKTtcbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc29tZXRoaW5nKCkuc2hvdWxkLmVxdWFsKDEpO1xuICAgICAgICAgICAgICAgIGluc3BpcmF0aW9uLmFwcC5zaG91bGQuaGF2ZS5wcm9wZXJ0eSgnc29tZXRoaW5nQXN5bmMnKTtcbiAgICAgICAgICAgICAgICBpbnNwaXJhdGlvbi5hcHAuc29tZXRoaW5nQXN5bmMoKS5zaG91bGQuZXF1YWwoMik7XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLnNob3VsZC5oYXZlLnByb3BlcnR5KCdzb21ldGhpbmdFbHNlJyk7XG4gICAgICAgICAgICAgICAgaW5zcGlyYXRpb24uYXBwLnNvbWV0aGluZ0Vsc2UoKS5zaG91bGQuZXF1YWwoMyk7XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGFfc2FtcGxlOiAnb25lJ1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGFfc2FtcGxlOiAxLFxuICAgIGJfc2FtcGxlOiAndHdvJyxcbiAgICBjX3NhbXBsZTogW1xuICAgICAgICB0cnVlLCB7XG4gICAgICAgICAgICBkX3NhbXBsZTogNFxuICAgICAgICB9XG4gICAgXSxcbiAgICBlX3NhbXBsZToge1xuICAgICAgICBmX3NhbXBsZToge1xuICAgICAgICAgICAgZ19zYW1wbGU6IDVcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBoX3NhbXBsZTogJ2hlbGxvJyxcbiAgICBpX3NhbXBsZTogJ2dvb2RieWUnXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYWRkU29tZXRoaW5nKGFwcCwgZG9uZSkge1xuXG4gICAgYXBwLmRvU29tZXRoaW5nID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfTtcbiAgICBkb25lKCk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYWRkU29tZXRoaW5nQXN5bmMoYXBwLCBkb25lKSB7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgYXBwLmRvU29tZXRoaW5nQXN5bmMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9O1xuICAgICAgICBkb25lKCk7XG4gICAgfSwgMTAwKTtcbn07XG5cbiJdfQ==
