var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@series-inc/rundot-game-sdk/dist/core-DLpmdjtO.js
function createProxiedMethod(methodName, mockImpl) {
  return function(...args) {
    if (methodName.startsWith("on") && typeof args[0] === "function") {
      if (!this._bootstrap._localHandlers) this._bootstrap._localHandlers = {};
      this._bootstrap._localHandlers[methodName] = args[0];
      if (this._bootstrap.rundotGame && typeof this._bootstrap.rundotGame[methodName] === "function") return this._bootstrap.rundotGame[methodName](...args);
      return true;
    }
    if (this._bootstrap.rundotGame && typeof this._bootstrap.rundotGame[methodName] === "function") return this._bootstrap.rundotGame[methodName](...args);
    return mockImpl.apply(this, args);
  };
}
function createProxiedObject(objectName, mockImpl) {
  const self = this;
  function createNestedProxy(target, realApiPath) {
    return new Proxy(target, { get: function(targetObj, prop, receiver) {
      if (self._bootstrap.rundotGame && realApiPath) {
        let realApiValue = self._bootstrap.rundotGame;
        const pathParts = realApiPath.split(".");
        for (const part of pathParts) if (realApiValue && realApiValue[part]) realApiValue = realApiValue[part];
        else {
          realApiValue = null;
          break;
        }
        if (realApiValue && prop in realApiValue) {
          const realValue = Reflect.get(realApiValue, prop, receiver);
          if (realValue && typeof realValue === "object" && typeof realValue !== "function") return createNestedProxy(realValue, `${realApiPath}.${prop}`);
          return realValue;
        }
      }
      const value = Reflect.get(targetObj, prop);
      if (typeof value === "function") return function(...args) {
        return value.apply(self, args);
      };
      if (value && typeof value === "object" && !Array.isArray(value)) return createNestedProxy(value, realApiPath ? `${realApiPath}.${prop}` : prop);
      return value;
    } });
  }
  return createNestedProxy(mockImpl, objectName);
}
function isWebPlatform() {
  return typeof window !== "undefined" && !window.ReactNativeWebView;
}
function createMockDelay(ms = MOCK_DELAYS.short) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
var MOCK_DELAYS;
var init_core_DLpmdjtO = __esm({
  "node_modules/@series-inc/rundot-game-sdk/dist/core-DLpmdjtO.js"() {
    MOCK_DELAYS = {
      short: 100,
      medium: 500,
      long: 1e3
    };
  }
});

// node_modules/@series-inc/rundot-game-sdk/dist/dist-DxOnYUkS.js
var dist_DxOnYUkS_exports = {};
__export(dist_DxOnYUkS_exports, {
  Filter: () => Filter,
  ProfanityFilter: () => Filter,
  SeverityLevel: () => SeverityLevel,
  checkProfanity: () => checkProfanity,
  checkProfanityAsync: () => checkProfanityAsync,
  isWordProfane: () => isWordProfane,
  useProfanityChecker: () => useProfanityChecker
});
function createFilterConfig(config) {
  var _a;
  const effective = __spreadProps(__spreadValues({}, config != null ? config : {}), {
    ignoreWords: globalWhitelist_default.whitelist,
    fuzzyToleranceLevel: (_a = config == null ? void 0 : config.fuzzyToleranceLevel) != null ? _a : 0.8
  });
  if (effective.allowObfuscatedMatch && effective.wordBoundaries) console.warn("[Glin-Profanity] Obfuscated match enabled \u2192 wordBoundaries will be ignored internally.");
  return effective;
}
function checkProfanity(text, config) {
  var _a;
  const checkResult = new Filter(createFilterConfig(config)).checkProfanity(text);
  const filteredWords = (config == null ? void 0 : config.minSeverity) && checkResult.severityMap ? checkResult.profaneWords.filter((word) => checkResult.severityMap && checkResult.severityMap[word] >= config.minSeverity) : checkResult.profaneWords;
  const autoReplaced = (config == null ? void 0 : config.autoReplace) && checkResult.processedText ? checkResult.processedText : text;
  (_a = config == null ? void 0 : config.customActions) == null || _a.call(config, checkResult);
  return __spreadProps(__spreadValues({}, checkResult), {
    filteredWords,
    autoReplaced
  });
}
function checkProfanityAsync(text, config) {
  return __async(this, null, function* () {
    return Promise.resolve(checkProfanity(text, config));
  });
}
function isWordProfane(word, config) {
  return checkProfanity(word, config).containsProfanity;
}
var __create, __defProp2, __defProps, __getOwnPropDesc, __getOwnPropDescs, __getOwnPropNames2, __getOwnPropSymbols, __getProtoOf, __hasOwnProp, __propIsEnum, __defNormalProp, __spreadValues, __spreadProps, __commonJS, __copyProps, __toESM, __async, require_react_production_min, require_react, dictionary_default, SeverityLevel, POSITIVE_INDICATORS, NEGATIVE_INDICATORS, GAMING_POSITIVE, POSITIVE_PHRASES, NEGATIVE_PHRASES, ContextAnalyzer, Filter, globalWhitelist_default, import_react, useProfanityChecker;
var init_dist_DxOnYUkS = __esm({
  "node_modules/@series-inc/rundot-game-sdk/dist/dist-DxOnYUkS.js"() {
    __create = Object.create;
    __defProp2 = Object.defineProperty;
    __defProps = Object.defineProperties;
    __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    __getOwnPropNames2 = Object.getOwnPropertyNames;
    __getOwnPropSymbols = Object.getOwnPropertySymbols;
    __getProtoOf = Object.getPrototypeOf;
    __hasOwnProp = Object.prototype.hasOwnProperty;
    __propIsEnum = Object.prototype.propertyIsEnumerable;
    __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, {
      enumerable: true,
      configurable: true,
      writable: true,
      value
    }) : obj[key] = value;
    __spreadValues = (a, b) => {
      for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
      if (__getOwnPropSymbols) {
        for (var prop of __getOwnPropSymbols(b)) if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
      }
      return a;
    };
    __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
    __commonJS = (cb, mod) => function __require() {
      return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    };
    __copyProps = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp2(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
      }
      return to;
    };
    __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", {
      value: mod,
      enumerable: true
    }) : target, mod));
    __async = (__this, __arguments, generator) => {
      return new Promise((resolve, reject) => {
        var fulfilled = (value) => {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        };
        var rejected = (value) => {
          try {
            step(generator.throw(value));
          } catch (e) {
            reject(e);
          }
        };
        var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
        step((generator = generator.apply(__this, __arguments)).next());
      });
    };
    require_react_production_min = __commonJS({ "../../node_modules/react/cjs/react.production.min.js"(exports) {
      "use strict";
      var l = /* @__PURE__ */ Symbol.for("react.element");
      var n = /* @__PURE__ */ Symbol.for("react.portal");
      var p = /* @__PURE__ */ Symbol.for("react.fragment");
      var q = /* @__PURE__ */ Symbol.for("react.strict_mode");
      var r2 = /* @__PURE__ */ Symbol.for("react.profiler");
      var t = /* @__PURE__ */ Symbol.for("react.provider");
      var u = /* @__PURE__ */ Symbol.for("react.context");
      var v = /* @__PURE__ */ Symbol.for("react.forward_ref");
      var w = /* @__PURE__ */ Symbol.for("react.suspense");
      var x = /* @__PURE__ */ Symbol.for("react.memo");
      var y = /* @__PURE__ */ Symbol.for("react.lazy");
      var z = Symbol.iterator;
      function A(a) {
        if (null === a || "object" !== typeof a) return null;
        a = z && a[z] || a["@@iterator"];
        return "function" === typeof a ? a : null;
      }
      var B = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function() {
        },
        enqueueReplaceState: function() {
        },
        enqueueSetState: function() {
        }
      };
      var C = Object.assign;
      var D = {};
      function E(a, b, e) {
        this.props = a;
        this.context = b;
        this.refs = D;
        this.updater = e || B;
      }
      E.prototype.isReactComponent = {};
      E.prototype.setState = function(a, b) {
        if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, a, b, "setState");
      };
      E.prototype.forceUpdate = function(a) {
        this.updater.enqueueForceUpdate(this, a, "forceUpdate");
      };
      function F() {
      }
      F.prototype = E.prototype;
      function G(a, b, e) {
        this.props = a;
        this.context = b;
        this.refs = D;
        this.updater = e || B;
      }
      var H = G.prototype = new F();
      H.constructor = G;
      C(H, E.prototype);
      H.isPureReactComponent = true;
      var I = Array.isArray;
      var J = Object.prototype.hasOwnProperty;
      var K2 = { current: null };
      var L = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };
      function M(a, b, e) {
        var d, c2 = {}, k2 = null, h = null;
        if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L.hasOwnProperty(d) && (c2[d] = b[d]);
        var g = arguments.length - 2;
        if (1 === g) c2.children = e;
        else if (1 < g) {
          for (var f = Array(g), m2 = 0; m2 < g; m2++) f[m2] = arguments[m2 + 2];
          c2.children = f;
        }
        if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c2[d] && (c2[d] = g[d]);
        return {
          $$typeof: l,
          type: a,
          key: k2,
          ref: h,
          props: c2,
          _owner: K2.current
        };
      }
      function N(a, b) {
        return {
          $$typeof: l,
          type: a.type,
          key: b,
          ref: a.ref,
          props: a.props,
          _owner: a._owner
        };
      }
      function O(a) {
        return "object" === typeof a && null !== a && a.$$typeof === l;
      }
      function escape2(a) {
        var b = {
          "=": "=0",
          ":": "=2"
        };
        return "$" + a.replace(/[=:]/g, function(a2) {
          return b[a2];
        });
      }
      var P = /\/+/g;
      function Q(a, b) {
        return "object" === typeof a && null !== a && null != a.key ? escape2("" + a.key) : b.toString(36);
      }
      function R(a, b, e, d, c2) {
        var k2 = typeof a;
        if ("undefined" === k2 || "boolean" === k2) a = null;
        var h = false;
        if (null === a) h = true;
        else switch (k2) {
          case "string":
          case "number":
            h = true;
            break;
          case "object":
            switch (a.$$typeof) {
              case l:
              case n:
                h = true;
            }
        }
        if (h) return h = a, c2 = c2(h), a = "" === d ? "." + Q(h, 0) : d, I(c2) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c2, b, e, "", function(a2) {
          return a2;
        })) : null != c2 && (O(c2) && (c2 = N(c2, e + (!c2.key || h && h.key === c2.key ? "" : ("" + c2.key).replace(P, "$&/") + "/") + a)), b.push(c2)), 1;
        h = 0;
        d = "" === d ? "." : d + ":";
        if (I(a)) for (var g = 0; g < a.length; g++) {
          k2 = a[g];
          var f = d + Q(k2, g);
          h += R(k2, b, e, f, c2);
        }
        else if (f = A(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f = d + Q(k2, g++), h += R(k2, b, e, f, c2);
        else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
        return h;
      }
      function S(a, b, e) {
        if (null == a) return a;
        var d = [], c2 = 0;
        R(a, d, "", "", function(a2) {
          return b.call(e, a2, c2++);
        });
        return d;
      }
      function T2(a) {
        if (-1 === a._status) {
          var b = a._result;
          b = b();
          b.then(function(b2) {
            if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
          }, function(b2) {
            if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
          });
          -1 === a._status && (a._status = 0, a._result = b);
        }
        if (1 === a._status) return a._result.default;
        throw a._result;
      }
      var U = { current: null };
      var V = { transition: null };
      var W = {
        ReactCurrentDispatcher: U,
        ReactCurrentBatchConfig: V,
        ReactCurrentOwner: K2
      };
      function X() {
        throw Error("act(...) is not supported in production builds of React.");
      }
      exports.Children = {
        map: S,
        forEach: function(a, b, e) {
          S(a, function() {
            b.apply(this, arguments);
          }, e);
        },
        count: function(a) {
          var b = 0;
          S(a, function() {
            b++;
          });
          return b;
        },
        toArray: function(a) {
          return S(a, function(a2) {
            return a2;
          }) || [];
        },
        only: function(a) {
          if (!O(a)) throw Error("React.Children.only expected to receive a single React element child.");
          return a;
        }
      };
      exports.Component = E;
      exports.Fragment = p;
      exports.Profiler = r2;
      exports.PureComponent = G;
      exports.StrictMode = q;
      exports.Suspense = w;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
      exports.act = X;
      exports.cloneElement = function(a, b, e) {
        if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
        var d = C({}, a.props), c2 = a.key, k2 = a.ref, h = a._owner;
        if (null != b) {
          void 0 !== b.ref && (k2 = b.ref, h = K2.current);
          void 0 !== b.key && (c2 = "" + b.key);
          if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
          for (f in b) J.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
        }
        var f = arguments.length - 2;
        if (1 === f) d.children = e;
        else if (1 < f) {
          g = Array(f);
          for (var m2 = 0; m2 < f; m2++) g[m2] = arguments[m2 + 2];
          d.children = g;
        }
        return {
          $$typeof: l,
          type: a.type,
          key: c2,
          ref: k2,
          props: d,
          _owner: h
        };
      };
      exports.createContext = function(a) {
        a = {
          $$typeof: u,
          _currentValue: a,
          _currentValue2: a,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
          _defaultValue: null,
          _globalName: null
        };
        a.Provider = {
          $$typeof: t,
          _context: a
        };
        return a.Consumer = a;
      };
      exports.createElement = M;
      exports.createFactory = function(a) {
        var b = M.bind(null, a);
        b.type = a;
        return b;
      };
      exports.createRef = function() {
        return { current: null };
      };
      exports.forwardRef = function(a) {
        return {
          $$typeof: v,
          render: a
        };
      };
      exports.isValidElement = O;
      exports.lazy = function(a) {
        return {
          $$typeof: y,
          _payload: {
            _status: -1,
            _result: a
          },
          _init: T2
        };
      };
      exports.memo = function(a, b) {
        return {
          $$typeof: x,
          type: a,
          compare: void 0 === b ? null : b
        };
      };
      exports.startTransition = function(a) {
        var b = V.transition;
        V.transition = {};
        try {
          a();
        } finally {
          V.transition = b;
        }
      };
      exports.unstable_act = X;
      exports.useCallback = function(a, b) {
        return U.current.useCallback(a, b);
      };
      exports.useContext = function(a) {
        return U.current.useContext(a);
      };
      exports.useDebugValue = function() {
      };
      exports.useDeferredValue = function(a) {
        return U.current.useDeferredValue(a);
      };
      exports.useEffect = function(a, b) {
        return U.current.useEffect(a, b);
      };
      exports.useId = function() {
        return U.current.useId();
      };
      exports.useImperativeHandle = function(a, b, e) {
        return U.current.useImperativeHandle(a, b, e);
      };
      exports.useInsertionEffect = function(a, b) {
        return U.current.useInsertionEffect(a, b);
      };
      exports.useLayoutEffect = function(a, b) {
        return U.current.useLayoutEffect(a, b);
      };
      exports.useMemo = function(a, b) {
        return U.current.useMemo(a, b);
      };
      exports.useReducer = function(a, b, e) {
        return U.current.useReducer(a, b, e);
      };
      exports.useRef = function(a) {
        return U.current.useRef(a);
      };
      exports.useState = function(a) {
        return U.current.useState(a);
      };
      exports.useSyncExternalStore = function(a, b, e) {
        return U.current.useSyncExternalStore(a, b, e);
      };
      exports.useTransition = function() {
        return U.current.useTransition();
      };
      exports.version = "18.3.1";
    } });
    require_react = __commonJS({ "../../node_modules/react/index.js"(exports, module) {
      "use strict";
      module.exports = require_react_production_min();
    } });
    dictionary_default = {
      arabic: { words: [
        "\u0633\u0643\u0633",
        "\u0637\u064A\u0632",
        "\u0634\u0631\u062C",
        "\u0644\u0639\u0642",
        "\u0644\u062D\u0633",
        "\u062A\u0645\u0635",
        "\u0628\u064A\u0636\u0627\u0646",
        "\u062B\u062F\u064A",
        "\u0628\u0632",
        "\u062D\u0644\u0645\u0629",
        "\u0645\u0641\u0644\u0642\u0633\u0629",
        "\u0628\u0638\u0631",
        "\u0643\u0633",
        "\u0645\u0628\u0627\u062F\u0644",
        "\u0639\u0627\u0647\u0631\u0629",
        "\u062C\u0645\u0627\u0639",
        "\u0642\u0636\u064A\u0628",
        "\u0632\u0628",
        "\u0644\u0648\u0637\u064A",
        "\u0644\u0648\u0627\u0637",
        "\u0633\u062D\u0627\u0642",
        "\u0627\u063A\u062A\u0635\u0627\u0628",
        "\u062E\u0646\u062B\u064A",
        "\u0627\u062D\u062A\u0644\u0627\u0645",
        "\u0646\u064A\u0643",
        "\u0645\u062A\u0646\u0627\u0643",
        "\u0634\u0631\u0645\u0648\u0637\u0629",
        "\u0639\u0631\u0635",
        "\u062E\u0648\u0644",
        "\u0642\u062D\u0628\u0629",
        "\u0644\u0628\u0648\u0629",
        "\u0648\u0633\u062E",
        "\u0639\u0644\u0642",
        "\u0646\u0627\u0643",
        "\u0645\u0646\u064A\u0643",
        "\u0634\u0631\u0645\u0637",
        "\u0642\u062D\u0628",
        "\u0634\u0631\u0645\u0648\u0637",
        "\u062E\u0648\u0644",
        "\u0647\u0646\u064A\u0643",
        "\u0641\u062D\u0644",
        "\u062F\u064A\u0648\u062B",
        "\u0645\u062A\u0646\u0627\u0643",
        "\u0647\u0627\u064A\u062C",
        "\u0632\u0628\u0631",
        "bdsm",
        "\u0632\u0627\u0646",
        "\u0633\u0627\u062F\u064A",
        "\u0633\u0627\u062F\u0649",
        "\u0643\u0633\u0647\u0627",
        "\u0643\u0633\u064A",
        "\u0643\u0633\u0643",
        "\u0643\u0633\u0645",
        "\u0628\u0646\u062A\u0627\u0643",
        "\u0628\u062A\u0646\u0627\u0643",
        "\u0646\u064A\u0643\u0646\u064A",
        "\u062F\u064A\u0648\u062B",
        "\u0646\u064A\u0627\u0643",
        "\u0641\u0634\u0627\u062E",
        "\u0641\u0634\u062E",
        "\u0647\u0641\u0634\u062E\u0643",
        "\u0634\u0630\u0648\u0630",
        "\u0644\u0648\u0627\u0637",
        "\u0644\u0648\u0637\u064A",
        "\u0644\u0648\u0637\u0649",
        "\u0639\u0627\u0647\u0631",
        "\u0644\u062D\u0633",
        "\u0645\u062A\u0639",
        "\u062D\u0645\u0627\u0645",
        "\u0647\u0631\u0628\u0637",
        "\u062F\u064A\u0627\u062B",
        "\u0633\u062D\u0627\u0642",
        "\u062C\u0646\u0633",
        "\u062C\u0646\u0633",
        "\u062C\u0648\u0632\u064A",
        "\u0645\u0631\u0627\u062A\u064A",
        "\u0645\u0631\u0627\u062A\u0649",
        "\u0645\u0631\u0627\u062A",
        "\u0648\u0631\u0627",
        "\u0634\u0639\u0631",
        "\u0645\u0634\u0639\u0631",
        "\u0627\u0631\u0643\u0628",
        "\u0641\u0631\u0633",
        "\u062C\u0627\u062F",
        "\u0645\u0646\u064A\u0648\u0643",
        "\u0632\u0648\u0628\u0631",
        "\u0637\u064A\u0627\u0632",
        "\u0634\u0631\u0627\u0645\u064A\u0637",
        "\u0641\u0627\u062C\u0631",
        "\u0645\u062D\u0631\u0648\u0645",
        "\u0648\u0627\u0642\u0641",
        "\u0628\u064A\u062D\u0643",
        "\u0645\u0645\u062D\u0648\u0646\u0629",
        "\u0644\u0628\u0646",
        "\u0644\u0628\u0648",
        "\u0648\u0627\u0642\u0641",
        "\u0634\u0631\u0642\u0627\u0646",
        "\u0627\u0641\u0636\u064A",
        "\u062F\u0647\u0648\u0644\u062A",
        "bzaz",
        "nek",
        "nik",
        "mtnak",
        "zeb",
        "zep",
        "zobr",
        "zopr",
        "kos",
        "a7a",
        "hayg",
        "\u0644\u0628\u0648\u0647",
        "\u0644\u0628\u0648\u0629",
        "\u0644\u0628\u0648\u062A",
        "sharma",
        "banoty",
        "\u0628\u0646\u0648\u062A\u064A",
        "\u0628\u0646\u0648\u062A\u0649",
        "\u0633\u0644\u0628",
        "\u0639\u0627\u064A\u0632",
        "\u062F\u0643\u0631",
        "\u0646\u062A\u0627\u064A\u0629",
        "\u0646\u062A\u0627\u064A\u0647",
        "\u0632\u0646\u062C",
        "\u0645\u0645\u062D\u0648\u0646",
        "\u062A\u0639\u0628\u0627\u0646",
        "\u0627\u0642\u0639\u062F",
        "\u0628\u0632\u0627\u0632",
        "\u0647\u064A\u062C\u0627\u0646",
        "\u0633\u0627\u0641\u0644",
        "\u0645\u0635\u064A\u0647\u0648\u0644\u064A",
        "\u0647\u062A\u0645\u0635",
        "\u0645\u0635\u064A",
        "\u0628\u0632",
        "hayg",
        "\u0643\u0644\u0648\u062A",
        "\u0627\u0646\u062F\u0631",
        "\u0633\u0646\u062A\u064A\u0627",
        "\u0628\u0648\u0643\u0633\u0631",
        "\u0628\u062A\u0627\u0639",
        "\u0645\u0634\u062A\u0647\u064A",
        "\u0632\u0628\u0649",
        "\u0646\u0643\u062A\u0647",
        "\u0627\u062A\u0646\u0627\u0643",
        "nayak",
        "nyak",
        "neeek",
        "\u0627\u063A\u062A\u0635\u0627",
        "\u0632\u0628",
        "\u0643\u0633",
        "\u0628\u0644\u0643\u064A\u0634\u0646",
        "\u0643\u064A\u0634\u0646",
        "\u0644\u064A\u0633\u0628\u064A\u0627\u0646",
        "\u0633\u0628\u064A\u0627\u0646"
      ] }.words,
      chinese: { words: [
        "13.",
        "13\u70B9",
        "\u4E09\u7EA7\u7247",
        "\u4E0B\u4E09\u70C2",
        "\u4E0B\u8D31",
        "\u4E2A\u8001\u5B50\u7684",
        "\u4E5D\u6E38",
        "\u4E73",
        "\u4E73\u4EA4",
        "\u4E73\u5934",
        "\u4E73\u623F",
        "\u4E73\u6CE2\u81C0\u6D6A",
        "\u4EA4\u914D",
        "\u4EC6\u8857",
        "\u4ED6\u5976\u5976",
        "\u4ED6\u5976\u5976\u7684",
        "\u4ED6\u5976\u5A18\u7684",
        "\u4ED6\u5988",
        "\u4ED6\u5988\u3109\u738B\u516B\u86CB",
        "\u4ED6\u5988\u5730",
        "\u4ED6\u5988\u7684",
        "\u4ED6\u5A18",
        "\u4ED6\u9A6C\u7684",
        "\u4F60\u4E2A\u50BB\u6BD4",
        "\u4F60\u4ED6\u9A6C\u7684",
        "\u4F60\u5168\u5BB6",
        "\u4F60\u5976\u5976\u7684",
        "\u4F60\u5979\u9A6C\u7684",
        "\u4F60\u5988",
        "\u4F60\u5988\u7684",
        "\u4F60\u5A18",
        "\u4F60\u5A18\u5361\u597D",
        "\u4F60\u5A18\u54A7",
        "\u4F60\u5B83\u5988\u7684",
        "\u4F60\u5B83\u9A6C\u7684",
        "\u4F60\u662F\u9E21",
        "\u4F60\u662F\u9E2D",
        "\u4F60\u9A6C\u7684",
        "\u505A\u7231",
        "\u50BB\u6BD4",
        "\u50BB\u903C",
        "\u518C\u90A3",
        "\u519B\u5993",
        "\u51E0\u516B",
        "\u51E0\u53ED",
        "\u51E0\u5DF4",
        "\u51E0\u82AD",
        "\u521A\u5EA6",
        "\u521A\u762A\u4E09",
        "\u5305\u76AE",
        "\u5341\u4E09\u70B9",
        "\u5356B",
        "\u5356\u6BD4",
        "\u5356\u6DEB",
        "\u5375",
        "\u5375\u5B50",
        "\u53CC\u5CF0\u5FAE\u98A4",
        "\u53E3\u4EA4",
        "\u53E3\u80AF",
        "\u53EB\u5E8A",
        "\u5403\u5C4E",
        "\u540E\u5EAD",
        "\u5439\u7BAB",
        "\u585E\u4F60\u516C",
        "\u585E\u4F60\u5A18",
        "\u585E\u4F60\u6BCD",
        "\u585E\u4F60\u7238",
        "\u585E\u4F60\u8001\u5E08",
        "\u585E\u4F60\u8001\u6BCD",
        "\u5904\u5973",
        "\u5916\u9634",
        "\u5927\u5375\u5B50",
        "\u5927\u5375\u6CE1",
        "\u5927\u9E21\u5DF4",
        "\u5976",
        "\u5976\u5976\u7684\u718A",
        "\u5976\u5B50",
        "\u5978",
        "\u5978\u4F60",
        "\u5979\u5988\u5730",
        "\u5979\u5988\u7684",
        "\u5979\u9A6C\u7684",
        "\u5988B",
        "\u5988\u4E2AB",
        "\u5988\u4E2A\u6BD4",
        "\u5988\u4E2A\u8001\u6BD4",
        "\u5988\u5988\u7684",
        "\u5988\u6BD4",
        "\u5988\u7684",
        "\u5988\u7684B",
        "\u5988\u903C",
        "\u5993",
        "\u5993\u5973",
        "\u5993\u9662",
        "\u59B3\u5979\u5988\u7684",
        "\u59B3\u5988\u7684",
        "\u59B3\u5A18\u7684",
        "\u59B3\u8001\u6BCD\u7684",
        "\u59B3\u9A6C\u7684",
        "\u59D8\u5934",
        "\u59E3\u897F",
        "\u59E6",
        "\u5A18\u4E2A\u6BD4",
        "\u5A18\u7684",
        "\u5A4A\u5B50",
        "\u5A4A\u5B50\u517B\u7684",
        "\u5AD6\u5A3C",
        "\u5AD6\u5BA2",
        "\u5B83\u5988\u5730",
        "\u5B83\u5988\u7684",
        "\u5BC6\u6D1E",
        "\u5C04\u4F60",
        "\u5C04\u7CBE",
        "\u5C0F\u4E73\u5934",
        "\u5C0F\u5375\u5B50",
        "\u5C0F\u5375\u6CE1",
        "\u5C0F\u762A\u4E09",
        "\u5C0F\u8089\u7C92",
        "\u5C0F\u9A9A\u6BD4",
        "\u5C0F\u9A9A\u8D27",
        "\u5C0F\u9E21\u5DF4",
        "\u5C0F\u9E21\u9E21",
        "\u5C41\u773C",
        "\u5C41\u80A1",
        "\u5C44",
        "\u5C4C",
        "\u5DE8\u4E73",
        "\u5E72x\u5A18",
        "\u5E72\u4E03\u516B",
        "\u5E72\u4F60",
        "\u5E72\u4F60\u5988",
        "\u5E72\u4F60\u5A18",
        "\u5E72\u4F60\u8001\u6BCD",
        "\u5E72\u4F60\u826F",
        "\u5E72\u59B3\u5988",
        "\u5E72\u59B3\u5A18",
        "\u5E72\u59B3\u8001\u6BCD",
        "\u5E72\u59B3\u9A6C",
        "\u5E72\u60A8\u5A18",
        "\u5E72\u673A\u63B0",
        "\u5E72\u6B7BCS",
        "\u5E72\u6B7BGM",
        "\u5E72\u6B7B\u4F60",
        "\u5E72\u6B7B\u5BA2\u670D",
        "\u5E79",
        "\u5F3A\u5978",
        "\u5F3A\u5978\u4F60",
        "\u6027",
        "\u6027\u4EA4",
        "\u6027\u5668",
        "\u6027\u65E0\u80FD",
        "\u6027\u7231",
        "\u60C5\u8272",
        "\u60F3\u4E0A\u4F60",
        "\u61C6\u60A8\u5988",
        "\u61C6\u60A8\u5A18",
        "\u61D28",
        "\u61D2\u516B",
        "\u61D2\u53EB",
        "\u61D2\u6559",
        "\u6210\u4EBA",
        "\u6211\u64CD\u4F60\u7956\u5B97\u5341\u516B\u4EE3",
        "\u6252\u5149",
        "\u6253\u70AE",
        "\u6253\u98DE\u673A",
        "\u62BD\u63D2",
        "\u62DB\u5993",
        "\u63D2\u4F60",
        "\u63D2\u6B7B\u4F60",
        "\u6492\u5C3F",
        "\u64CD\u4F60",
        "\u64CD\u4F60\u5168\u5BB6",
        "\u64CD\u4F60\u5976\u5976",
        "\u64CD\u4F60\u5988",
        "\u64CD\u4F60\u5A18",
        "\u64CD\u4F60\u7956\u5B97",
        "\u64CD\u4F60\u8001\u5988",
        "\u64CD\u4F60\u8001\u6BCD",
        "\u64CD\u59B3",
        "\u64CD\u59B3\u5168\u5BB6",
        "\u64CD\u59B3\u5988",
        "\u64CD\u59B3\u5A18",
        "\u64CD\u59B3\u7956\u5B97",
        "\u64CD\u673A\u63B0",
        "\u64CD\u6BD4",
        "\u64CD\u903C",
        "\u653E\u8361",
        "\u65E5\u4ED6\u5A18",
        "\u65E5\u4F60",
        "\u65E5\u4F60\u5988",
        "\u65E5\u4F60\u8001\u5A18",
        "\u65E5\u4F60\u8001\u6BCD",
        "\u65E5\u6279",
        "\u6708\u7ECF",
        "\u673A\u516B",
        "\u673A\u5DF4",
        "\u673A\u673A\u6B6A\u6B6A",
        "\u6742\u79CD",
        "\u6D6A\u53EB",
        "\u6DEB",
        "\u6DEB\u4E71",
        "\u6DEB\u5987",
        "\u6DEB\u68CD",
        "\u6DEB\u6C34",
        "\u6DEB\u79FD",
        "\u6DEB\u8361",
        "\u6DEB\u897F",
        "\u6E7F\u900F\u7684\u5185\u88E4",
        "\u6FC0\u60C5",
        "\u7068\u4F60\u5A18",
        "\u70C2\u8D27",
        "\u70C2\u903C",
        "\u721B",
        "\u72D7\u5C41",
        "\u72D7\u65E5",
        "\u72D7\u72FC\u517B\u7684",
        "\u7389\u6775",
        "\u738B\u516B\u86CB",
        "\u74DC\u5A03\u5B50",
        "\u74DC\u5A46\u5A18",
        "\u74DC\u6279",
        "\u762A\u4E09",
        "\u767D\u70C2",
        "\u767D\u75F4",
        "\u767D\u7661",
        "\u7956\u5B97",
        "\u79C1\u670D",
        "\u7B28\u86CB",
        "\u7CBE\u5B50",
        "\u8001\u4E8C",
        "\u8001\u5473",
        "\u8001\u6BCD",
        "\u8001\u762A\u4E09",
        "\u8001\u9A9A\u6BD4",
        "\u8001\u9A9A\u8D27",
        "\u8089\u58C1",
        "\u8089\u68CD\u5B50",
        "\u8089\u68D2",
        "\u8089\u7F1D",
        "\u808F",
        "\u809B\u4EA4",
        "\u80A5\u897F",
        "\u8272\u60C5",
        "\u82B1\u67F3",
        "\u8361\u5987",
        "\u8CE4",
        "\u8D1D\u8089",
        "\u8D31B",
        "\u8D31\u4EBA",
        "\u8D31\u8D27",
        "\u8D3C\u4F60\u5988",
        "\u8D5B\u4F60\u8001\u6BCD",
        "\u8D5B\u59B3\u963F\u6BCD",
        "\u8D63\u60A8\u5A18",
        "\u8F6E\u5978",
        "\u8FF7\u836F",
        "\u903C",
        "\u903C\u6837",
        "\u91CE\u9E21",
        "\u9633\u5177",
        "\u9633\u840E",
        "\u9634\u5507",
        "\u9634\u6237",
        "\u9634\u6838",
        "\u9634\u6BDB",
        "\u9634\u830E",
        "\u9634\u9053",
        "\u9634\u90E8",
        "\u96DE\u5DF4",
        "\u9760\u5317",
        "\u9760\u6BCD",
        "\u9760\u7238",
        "\u9760\u80CC",
        "\u9760\u8170",
        "\u9A76\u4F60\u516C",
        "\u9A76\u4F60\u5A18",
        "\u9A76\u4F60\u6BCD",
        "\u9A76\u4F60\u7238",
        "\u9A76\u4F60\u8001\u5E08",
        "\u9A76\u4F60\u8001\u6BCD",
        "\u9A9A\u6BD4",
        "\u9A9A\u8D27",
        "\u9A9A\u903C",
        "\u9B3C\u516C",
        "\u9E218",
        "\u9E21\u516B",
        "\u9E21\u53ED",
        "\u9E21\u5427",
        "\u9E21\u5978",
        "\u9E21\u5DF4",
        "\u9E21\u82AD",
        "\u9E21\u9E21",
        "\u9F9F\u513F\u5B50",
        "\u9F9F\u5934"
      ] }.words,
      czech: { words: [
        "bordel",
        "buzna",
        "\u010Dum\u011Bt",
        "\u010Dur\xE1k",
        "debil",
        "do pi\u010De",
        "do prdele",
        "dr\u0161\u0165ka",
        "dr\u017Eka",
        "flundra",
        "hajzl",
        "hovno",
        "chcanky",
        "chuj",
        "jebat",
        "kokot",
        "kokotina",
        "ko\u0148omrd",
        "kunda",
        "kurva",
        "mamrd",
        "mrdat",
        "mrdka",
        "mrdn\xEDk",
        "oslo\u0161oust",
        "pi\u010Da",
        "p\xED\u010Dus",
        "p\xEDchat",
        "pizda",
        "prcat",
        "prdel",
        "prdelka",
        "sra\u010Dka",
        "sr\xE1t",
        "\u0161oustat",
        "\u0161ulin",
        "vyp\xED\u010Denec",
        "zkurvit",
        "zkurvysyn",
        "zmrd",
        "\u017Er\xE1t"
      ] }.words,
      danish: { words: [
        "anus",
        "b\xF8sser\xF8v",
        "cock",
        "fisse",
        "fisseh\xE5r",
        "fuck",
        "hestepik",
        "kussekryller",
        "lort",
        "luder",
        "pik",
        "pikh\xE5r",
        "pikslugeri",
        "piksutteri",
        "pis",
        "r\xF8v",
        "r\xF8vhul",
        "r\xF8vsk\xE6g",
        "r\xF8vspr\xE6ke",
        "shit"
      ] }.words,
      english: { words: [
        "2 girls 1 cup",
        "2g1c",
        "a$$",
        "acrotomophilia",
        "alabama hot pocket",
        "alaskan pipeline",
        "anal",
        "anilingus",
        "anus",
        "apeshit",
        "arsehole",
        "ass",
        "asshat",
        "asshole",
        "assmunch",
        "asswipe",
        "auto erotic",
        "autoerotic",
        "b!tch",
        "babeland",
        "baby batter",
        "baby juice",
        "ball gag",
        "ball gravy",
        "ball kicking",
        "ball licking",
        "ball sack",
        "ball sucking",
        "bangbros",
        "bareback",
        "barely legal",
        "barenaked",
        "bastard",
        "bastardized",
        "bastardo",
        "bastinado",
        "bbw",
        "bdsm",
        "beaner",
        "beaners",
        "beaver cleaver",
        "beaver lips",
        "bestiality",
        "big black",
        "big breasts",
        "big knockers",
        "big tits",
        "bimbos",
        "birdlock",
        "bitch",
        "bitches",
        "black cock",
        "blonde action",
        "blonde on blonde action",
        "blow job",
        "blow your load",
        "blowjob",
        "blue waffle",
        "blumpkin",
        "bollocks",
        "bondage",
        "boner",
        "boob",
        "boobs",
        "booty call",
        "brown showers",
        "brunette action",
        "bs",
        "bukkake",
        "bulldyke",
        "bullet vibe",
        "bullshit",
        "bung hole",
        "bunghole",
        "busty",
        "butt",
        "buttcheeks",
        "butthole",
        "camel toe",
        "camgirl",
        "camslut",
        "camwhore",
        "carpet muncher",
        "carpetmuncher",
        "chocolate rosebuds",
        "circlejerk",
        "cleveland steamer",
        "clit",
        "clitoris",
        "clover clamps",
        "clusterfuck",
        "cock",
        "cocks",
        "cocksucker",
        "coon",
        "coons",
        "coprolagnia",
        "coprophilia",
        "cornhole",
        "creampie",
        "cum",
        "cumming",
        "cunnilingus",
        "cunt",
        "darkie",
        "date rape",
        "daterape",
        "deep throat",
        "deepthroat",
        "dendrophilia",
        "dick",
        "dildo",
        "dingleberries",
        "dingleberry",
        "dipshit",
        "dirty pillows",
        "dirty sanchez",
        "dog style",
        "doggie style",
        "doggiestyle",
        "doggy style",
        "doggystyle",
        "dolcett",
        "domination",
        "dominatrix",
        "dommes",
        "donkey punch",
        "double dong",
        "double penetration",
        "dp action",
        "dry hump",
        "dumbass",
        "dvda",
        "eat my ass",
        "ecchi",
        "ejaculation",
        "erotic",
        "erotism",
        "escort",
        "eunuch",
        "f*ck",
        "f@ck",
        "faggot",
        "fecal",
        "felch",
        "fellatio",
        "feltch",
        "female squirting",
        "femdom",
        "figging",
        "fingerbang",
        "fingering",
        "fisting",
        "foot fetish",
        "footjob",
        "frotting",
        "fuck",
        "fuck buttons",
        "fucker",
        "fuckface",
        "fuckin",
        "fucking",
        "fucktards",
        "fudge packer",
        "fudgepacker",
        "fuq",
        "futanari",
        "g-spot",
        "gang bang",
        "gay sex",
        "genitals",
        "giant cock",
        "girl on",
        "girl on top",
        "girls gone wild",
        "goatcx",
        "goatse",
        "god damn",
        "gokkun",
        "golden shower",
        "goo girl",
        "goodpoop",
        "goregasm",
        "grope",
        "group sex",
        "guro",
        "hand job",
        "handjob",
        "hard core",
        "hardcore",
        "hentai",
        "hoe",
        "homoerotic",
        "honkey",
        "hooker",
        "hot carl",
        "hot chick",
        "how to kill",
        "how to murder",
        "huge fat",
        "humping",
        "incest",
        "intercourse",
        "jack off",
        "jackass",
        "jail bait",
        "jailbait",
        "jelly donut",
        "jerk off",
        "jigaboo",
        "jiggaboo",
        "jiggerboo",
        "jizz",
        "juggs",
        "kike",
        "kinbaku",
        "kinkster",
        "kinky",
        "knobbing",
        "leather restraint",
        "leather straight jacket",
        "lemon party",
        "lmfao",
        "lolita",
        "lovemaking",
        "make me come",
        "male squirting",
        "masturbate",
        "menage a trois",
        "mf",
        "milf",
        "missionary position",
        "motherfucker",
        "mound of venus",
        "mr hands",
        "muff diver",
        "muffdiving",
        "nambla",
        "nawashi",
        "negro",
        "neonazi",
        "nig nog",
        "nigga",
        "nigger",
        "nimphomania",
        "nipple",
        "nipples",
        "nsfw images",
        "nude",
        "nudity",
        "nympho",
        "nymphomania",
        "octopussy",
        "omfg",
        "omorashi",
        "one cup two girls",
        "one guy one jar",
        "orgasm",
        "orgy",
        "paedophile",
        "paki",
        "panties",
        "panty",
        "pedobear",
        "pedophile",
        "pegging",
        "penis",
        "phone sex",
        "piece of shit",
        "piss pig",
        "pissed",
        "pissing",
        "pisspig",
        "playboy",
        "pleasure chest",
        "pole smoker",
        "ponyplay",
        "poof",
        "poon",
        "poontang",
        "poop chute",
        "poopchute",
        "porn",
        "porno",
        "pornography",
        "prince albert piercing",
        "pthc",
        "pubes",
        "punany",
        "pussy",
        "queaf",
        "queef",
        "quim",
        "raghead",
        "raging boner",
        "rape",
        "raping",
        "rapist",
        "rectum",
        "retard",
        "retarded",
        "reverse cowgirl",
        "rimjob",
        "rimming",
        "rosy palm",
        "rosy palm and her 5 sisters",
        "rusty trombone",
        "s&m",
        "sadism",
        "santorum",
        "scat",
        "schlong",
        "scissoring",
        "semen",
        "sex",
        "sexo",
        "sexy",
        "sh!t",
        "shaved beaver",
        "shaved pussy",
        "shemale",
        "shibari",
        "shit",
        "shitblimp",
        "shithead",
        "shitshow",
        "shitty",
        "shota",
        "shrimping",
        "simp",
        "skeet",
        "slanteye",
        "slut",
        "smut",
        "snatch",
        "snowballing",
        "sodomize",
        "sodomy",
        "spic",
        "splooge",
        "splooge moose",
        "spooge",
        "spread legs",
        "spunk",
        "stfu",
        "strap on",
        "strapon",
        "strappado",
        "strip club",
        "style doggy",
        "suck",
        "sucks",
        "suicide girls",
        "sultry women",
        "swastika",
        "swinger",
        "tainted love",
        "taste my",
        "tea bagging",
        "testbad01",
        "threesome",
        "throating",
        "tied up",
        "tight white",
        "tit",
        "tits",
        "titties",
        "titty",
        "tongue in a",
        "topless",
        "tosser",
        "towelhead",
        "tranny",
        "tribadism",
        "tub girl",
        "tubgirl",
        "tushy",
        "twat",
        "twink",
        "twinkie",
        "two girls one cup",
        "undressing",
        "upskirt",
        "urethra play",
        "urophilia",
        "vagina",
        "venus mound",
        "vibrator",
        "violet wand",
        "vorarephilia",
        "voyeur",
        "vulva",
        "wank",
        "wet dream",
        "wetback",
        "white power",
        "wrapping men",
        "wrinkled starfish",
        "wtf",
        "xx",
        "xxx",
        "yaoi",
        "yellow showers",
        "yiffy",
        "zoophilia",
        "\u{1F595}"
      ] }.words,
      esperanto: { words: [
        "bugren",
        "bugri",
        "bugru",
        "\u0109iesulino",
        "\u0109iesulo",
        "diofek",
        "diofeka",
        "fek",
        "feken",
        "fekfikanto",
        "feklekulo",
        "fekulo",
        "fik",
        "fikado",
        "fikema",
        "fikfek",
        "fiki",
        "fiki\u011Di",
        "fiki\u011Du",
        "fikilo",
        "fikkla\u016Dno",
        "fikota",
        "fiku",
        "forfiki",
        "forfiki\u011Du",
        "forfiku",
        "forfurzu",
        "forpisi",
        "forpisu",
        "furzulo",
        "kacen",
        "kaco",
        "kacsu\u0109ulo",
        "kojono",
        "pi\u0109en",
        "pi\u0109o",
        "zamenfek"
      ] }.words,
      finnish: { words: [
        "alfred nussi",
        "bylsi\xE4",
        "haahka",
        "haista paska",
        "haista vittu",
        "hatullinen",
        "helvetisti",
        "hevonkuusi",
        "hevonpaska",
        "hevonperse",
        "hevonvittu",
        "hevonvitunperse",
        "hitosti",
        "hitto",
        "huorata",
        "h\xE4ssi\xE4",
        "juosten kustu",
        "jutku",
        "jutsku",
        "j\xE4tk\xE4",
        "kananpaska",
        "koiranpaska",
        "kuin esterin perseest\xE4",
        "kulli",
        "kullinluikaus",
        "kuppainen",
        "kusaista",
        "kuseksia",
        "kusettaa",
        "kusi",
        "kusip\xE4\xE4",
        "kusta",
        "kyrpiintynyt",
        "kyrpiinty\xE4",
        "kyrpi\xE4",
        "kyrp\xE4",
        "kyrp\xE4naama",
        "kyrvitys",
        "lahtari",
        "lutka",
        "molo",
        "molop\xE4\xE4",
        "mulkero",
        "mulkku",
        "mulkvisti",
        "muna",
        "munap\xE4\xE4",
        "munaton",
        "mutakuono",
        "mutiainen",
        "naida",
        "nainti",
        "narttu",
        "neekeri",
        "nekru",
        "nuolla persett\xE4",
        "nussia",
        "nussija",
        "nussinta",
        "paljaalla",
        "palli",
        "pallit",
        "paneskella",
        "panettaa",
        "panna",
        "pano",
        "pantava",
        "paska",
        "paskainen",
        "paskamainen",
        "paskanmarjat",
        "paskantaa",
        "paskapuhe",
        "paskap\xE4\xE4",
        "paskattaa",
        "paskiainen",
        "paskoa",
        "pehko",
        "pentele",
        "perkele",
        "perkeleesti",
        "persaukinen",
        "perse",
        "perseennuolija",
        "perseet olalla",
        "persereik\xE4",
        "perse\xE4\xE4li\xF6",
        "persl\xE4pi",
        "perspano",
        "persvako",
        "pilkunnussija",
        "pillu",
        "pillut",
        "pipari",
        "piru",
        "pist\xE4\xE4",
        "pyllyvako",
        "reik\xE4",
        "reva",
        "ripsipiirakka",
        "runkata",
        "runkkari",
        "runkkaus",
        "runkku",
        "ryss\xE4",
        "r\xE4ttip\xE4\xE4",
        "saatanasti",
        "suklaaosasto",
        "tavara",
        "toosa",
        "tuhkaluukku",
        "tumputtaa",
        "turpasauna",
        "tussu",
        "tussukka",
        "tussut",
        "vakipano",
        "vet\xE4\xE4 k\xE4teen",
        "viiksi",
        "vittu",
        "vittuilla",
        "vittuilu",
        "vittumainen",
        "vittuuntua",
        "vittuuntunut",
        "vitun",
        "vitusti",
        "vituttaa",
        "vitutus",
        "\xE4p\xE4r\xE4"
      ] }.words,
      french: { words: [
        "baiser",
        "bander",
        "bigornette",
        "bite",
        "bitte",
        "bloblos",
        "bordel",
        "bosser",
        "bourr\xE9",
        "bourr\xE9e",
        "brackmard",
        "branlage",
        "branler",
        "branlette",
        "branleur",
        "branleuse",
        "brouter le cresson",
        "caca",
        "cailler",
        "chatte",
        "chiasse",
        "chier",
        "chiottes",
        "clito",
        "clitoris",
        "con",
        "connard",
        "connasse",
        "conne",
        "couilles",
        "cramouille",
        "cul",
        "d\xE9conne",
        "d\xE9conner",
        "drague",
        "emmerdant",
        "emmerder",
        "emmerdeur",
        "emmerdeuse",
        "encul\xE9",
        "encul\xE9e",
        "enculeur",
        "enculeurs",
        "enfoir\xE9",
        "enfoir\xE9e",
        "\xE9tron",
        "fille de pute",
        "fils de pute",
        "folle",
        "foutre",
        "gerbe",
        "gerber",
        "gouine",
        "grande folle",
        "grogniasse",
        "gueule",
        "jouir",
        "la putain de ta m\xE8re",
        "MALPT",
        "m\xE9nage \xE0 trois",
        "merde",
        "merdeuse",
        "merdeux",
        "meuf",
        "n\xE8gre",
        "nique ta m\xE8re",
        "nique ta race",
        "palucher",
        "p\xE9dale",
        "p\xE9d\xE9",
        "p\xE9ter",
        "pipi",
        "pisser",
        "pouffiasse",
        "pousse-crotte",
        "putain",
        "pute",
        "ramoner",
        "sac \xE0 foutre",
        "sac \xE0 merde",
        "salaud",
        "salope",
        "suce",
        "tapette",
        "tanche",
        "teuch",
        "teuf",
        "tringler",
        "trique",
        "troncher",
        "trou du cul",
        "turlute",
        "veuve",
        "zigounette",
        "zizi"
      ] }.words,
      german: { words: [
        "analritter",
        "arsch",
        "arschficker",
        "arschlecker",
        "arschloch",
        "bimbo",
        "bratze",
        "bumsen",
        "bonze",
        "d\xF6del",
        "fick",
        "ficken",
        "flittchen",
        "fotze",
        "fratze",
        "hackfresse",
        "hure",
        "hurensohn",
        "ische",
        "kackbratze",
        "kacke",
        "kacken",
        "kackwurst",
        "kampflesbe",
        "kanake",
        "kimme",
        "l\xFCmmel",
        "MILF",
        "m\xF6pse",
        "morgenlatte",
        "m\xF6se",
        "mufti",
        "muschi",
        "nackt",
        "neger",
        "nigger",
        "nippel",
        "nutte",
        "onanieren",
        "orgasmus",
        "pimmel",
        "pimpern",
        "pinkeln",
        "pissen",
        "pisser",
        "popel",
        "poppen",
        "porno",
        "reudig",
        "rosette",
        "schabracke",
        "schlampe",
        "schei\xDFe",
        "scheisser",
        "schiesser",
        "schnackeln",
        "schwanzlutscher",
        "schwuchtel",
        "tittchen",
        "titten",
        "v\xF6geln",
        "vollpfosten",
        "wichse",
        "wichsen",
        "wichser"
      ] }.words,
      hindi: { words: [
        "aand",
        "aandu",
        "balatkar",
        "beti chod",
        "bhadva",
        "bhadve",
        "bhandve",
        "bhootni ke",
        "bhosad",
        "bhosadi ke",
        "boobe",
        "chakke",
        "chinaal",
        "chinki",
        "chod",
        "chodu",
        "chodu bhagat",
        "chooche",
        "choochi",
        "choot",
        "choot ke baal",
        "chootia",
        "chootiya",
        "chuche",
        "chuchi",
        "chudai khanaa",
        "chudan chudai",
        "chut",
        "chut ke baal",
        "chut ke dhakkan",
        "chut maarli",
        "chutad",
        "chutadd",
        "chutan",
        "chutia",
        "chutiya",
        "gaand",
        "gaandfat",
        "gaandmasti",
        "gaandufad",
        "gandu",
        "gashti",
        "gasti",
        "ghassa",
        "ghasti",
        "harami",
        "haramzade",
        "hawas",
        "hawas ke pujari",
        "hijda",
        "hijra",
        "jhant",
        "jhant chaatu",
        "jhant ke baal",
        "jhantu",
        "kamine",
        "kaminey",
        "kanjar",
        "kutta",
        "kutta kamina",
        "kutte ki aulad",
        "kutte ki jat",
        "kuttiya",
        "loda",
        "lodu",
        "lund",
        "lund choos",
        "lund khajoor",
        "lundtopi",
        "lundure",
        "maa ki chut",
        "maal",
        "madar chod",
        "mooh mein le",
        "mutth",
        "najayaz",
        "najayaz aulaad",
        "najayaz paidaish",
        "paki",
        "pataka",
        "patakha",
        "raand",
        "randi",
        "saala",
        "saala kutta",
        "saali kutti",
        "saali randi",
        "suar",
        "suar ki aulad",
        "tatte",
        "tatti",
        "teri maa ka bhosada",
        "teri maa ka boba chusu",
        "teri maa ki chut",
        "tharak",
        "tharki"
      ] }.words,
      hungarian: { words: [
        "balfasz",
        "balfaszok",
        "balfaszokat",
        "balfaszt",
        "barmok",
        "barmokat",
        "barmot",
        "barom",
        "baszik",
        "bazmeg",
        "buksza",
        "buksz\xE1k",
        "buksz\xE1kat",
        "buksz\xE1t",
        "b\xFAr",
        "b\xFArok",
        "cs\xF6cs",
        "cs\xF6cs\xF6k",
        "cs\xF6cs\xF6ket",
        "cs\xF6cs\xF6t",
        "fasz",
        "faszfej",
        "faszfejek",
        "faszfejeket",
        "faszfejet",
        "faszok",
        "faszokat",
        "faszt",
        "fing",
        "fingok",
        "fingokat",
        "fingot",
        "franc",
        "francok",
        "francokat",
        "francot",
        "geci",
        "gecibb",
        "gecik",
        "geciket",
        "gecit",
        "kibaszott",
        "kibaszottabb",
        "k\xFAr",
        "kurafi",
        "kurafik",
        "kurafikat",
        "kurafit",
        "kurva",
        "kurv\xE1k",
        "kurv\xE1kat",
        "kurv\xE1t",
        "leggecibb",
        "legkibaszottabb",
        "legszarabb",
        "marha",
        "marh\xE1k",
        "marh\xE1kat",
        "marh\xE1t",
        "megd\xF6glik",
        "pele",
        "pel\xE9k",
        "picsa",
        "pics\xE1kat",
        "pics\xE1t",
        "pina",
        "pin\xE1k",
        "pin\xE1kat",
        "pin\xE1t",
        "pofa",
        "pof\xE1kat",
        "pof\xE1t",
        "p\xF6cs",
        "p\xF6cs\xF6k",
        "p\xF6cs\xF6ket",
        "p\xF6cs\xF6t",
        "punci",
        "puncik",
        "segg",
        "seggek",
        "seggeket",
        "segget",
        "seggfej",
        "seggfejek",
        "seggfejeket",
        "seggfejet",
        "szajha",
        "szajh\xE1k",
        "szajh\xE1kat",
        "szajh\xE1t",
        "szar",
        "szarabb",
        "szarik",
        "szarok",
        "szarokat",
        "szart"
      ] }.words,
      italian: { words: [
        "allupato",
        "ammucchiata",
        "anale",
        "arrapato",
        "arrusa",
        "arruso",
        "assatanato",
        "bagascia",
        "bagassa",
        "bagnarsi",
        "baldracca",
        "balle",
        "battere",
        "battona",
        "belino",
        "biga",
        "bocchinara",
        "bocchino",
        "bofilo",
        "boiata",
        "bordello",
        "brinca",
        "bucaiolo",
        "budi\xF9lo",
        "buona donna",
        "busone",
        "cacca",
        "caccati in mano e prenditi a schiaffi",
        "caciocappella",
        "cadavere",
        "cagare",
        "cagata",
        "cagna",
        "cammello",
        "cappella",
        "carciofo",
        "carit\xE0",
        "casci",
        "cazzata",
        "cazzimma",
        "cazzo",
        "checca",
        "chiappa",
        "chiavare",
        "chiavata",
        "ciospo",
        "ciucciami il cazzo",
        "coglione",
        "coglioni",
        "cornuto",
        "cozza",
        "culattina",
        "culattone",
        "culo",
        "di merda",
        "ditalino",
        "duro",
        "fare una\u0160",
        "fava",
        "femminuccia",
        "fica",
        "figa",
        "figlio di buona donna",
        "figlio di puttana",
        "figone",
        "finocchio",
        "fottere",
        "fottersi",
        "fracicone",
        "fregna",
        "frocio",
        "froscio",
        "fuori come un balcone",
        "goldone",
        "grilletto",
        "guanto",
        "guardone",
        "incazzarsi",
        "incoglionirsi",
        "ingoio",
        "l'arte bolognese",
        "leccaculo",
        "lecchino",
        "lofare",
        "loffa",
        "loffare",
        "lumaca",
        "manico",
        "mannaggia",
        "merda",
        "merdata",
        "merdoso",
        "mignotta",
        "minchia",
        "minchione",
        "mona",
        "monta",
        "montare",
        "mussa",
        "nave scuola",
        "nerchia",
        "nudo",
        "padulo",
        "palle",
        "palloso",
        "patacca",
        "patonza",
        "pecorina",
        "pesce",
        "picio",
        "pincare",
        "pipa",
        "pip\xEC",
        "pippone",
        "pirla",
        "pisciare",
        "piscio",
        "pisello",
        "pistola",
        "pistolotto",
        "pomiciare",
        "pompa",
        "pompino",
        "porca",
        "porca madonna",
        "porca miseria",
        "porca puttana",
        "porco due",
        "porco zio",
        "potta",
        "puppami",
        "puttana",
        "quaglia",
        "recchione",
        "regina",
        "rincoglionire",
        "rizzarsi",
        "rompiballe",
        "ruffiano",
        "sbattere",
        "sbattersi",
        "sborra",
        "sborrata",
        "sborrone",
        "sbrodolata",
        "scopare",
        "scopata",
        "scorreggiare",
        "sega",
        "slinguare",
        "slinguata",
        "smandrappata",
        "soccia",
        "socmel",
        "sorca",
        "spagnola",
        "spompinare",
        "sticchio",
        "stronza",
        "stronzata",
        "stronzo",
        "succhiami",
        "sveltina",
        "sverginare",
        "tarzanello",
        "terrone",
        "testa di cazzo",
        "tette",
        "tirare",
        "topa",
        "troia",
        "trombare",
        "uccello",
        "vacca",
        "vaffanculo",
        "vangare",
        "venire",
        "zinne",
        "zio cantante",
        "zoccola"
      ] }.words,
      japanese: { words: [
        "3p",
        "g \u30B9\u30DD\u30C3\u30C8",
        "s \uFF06 m",
        "sm",
        "sm\u5973\u738B",
        "xx",
        "\u30A2\u30B8\u30A2\u306E\u304B\u308F\u3044\u3044\u5973\u306E\u5B50",
        "\u30A2\u30B9\u30DB\u30FC\u30EB",
        "\u30A2\u30CA\u30EA\u30F3\u30B0\u30B9",
        "\u30A2\u30CA\u30EB",
        "\u3044\u305F\u305A\u3089",
        "\u30A4\u30E9\u30DE\u30C1\u30AA",
        "\u30A6\u30A7\u30D6\u30AB\u30E1\u30E9",
        "\u30A8\u30AF\u30B9\u30BF\u30B7\u30FC",
        "\u30A8\u30B9\u30B3\u30FC\u30C8",
        "\u30A8\u30C3\u30C1",
        "\u30A8\u30ED\u30C6\u30A3\u30BA\u30E0",
        "\u30A8\u30ED\u30C6\u30A3\u30C3\u30AF",
        "\u30AA\u30FC\u30AC\u30BA\u30E0",
        "\u30AA\u30AB\u30DE",
        "\u304A\u3057\u3063\u3053",
        "\u304A\u3057\u308A",
        "\u30AA\u30B7\u30EA",
        "\u304A\u3057\u308A\u306E\u3042\u306A",
        "\u304A\u3063\u3071\u3044",
        "\u30AA\u30C3\u30D1\u30A4",
        "\u30AA\u30CA\u30CB\u30FC",
        "\u30AA\u30DE\u30F3\u30B3",
        "\u304A\u3082\u3089\u3057",
        "\u304A\u5C3B",
        "\u30AB\u30FC\u30DE\u30B9\u30FC\u30C8\u30E9",
        "\u30AB\u30F3\u30C8",
        "\u30AF\u30EA\u30C8\u30EA\u30B9",
        "\u30B0\u30EB\u30FC\u30D7\u30FB\u30BB\u30C3\u30AF\u30B9",
        "\u30B0\u30ED",
        "\u30AF\u30F3\u30CB\u30EA\u30F3\u30B0\u30B9",
        "\u30B2\u30A4\u30FB\u30BB\u30C3\u30AF\u30B9",
        "\u30B2\u30A4\u306E\u7537\u6027",
        "\u30B2\u30A4\u30DC\u30FC\u30A4",
        "\u30B4\u30FC\u30EB\u30C7\u30F3\u30B7\u30E3\u30EF\u30FC",
        "\u30B3\u30AB\u30A4\u30F3",
        "\u30B4\u30C3\u30AF\u30F3",
        "\u30B5\u30C7\u30A3\u30BA\u30E0",
        "\u3057\u3070\u308A",
        "\u30B9\u30A6\u30A3\u30F3\u30AC\u30FC",
        "\u30B9\u30AB\u30FC\u30C8\u306E\u4E2D",
        "\u30B9\u30AB\u30C8\u30ED",
        "\u30B9\u30C8\u30E9\u30C3\u30D7\u30AA\u30F3",
        "\u30B9\u30C8\u30EA\u30C3\u30D7\u5287\u5834",
        "\u30B9\u30E9\u30C3\u30C8",
        "\u30B9\u30EA\u30C3\u30C8",
        "\u30BB\u30AF\u30B7\u30FC\u306A",
        "\u30BB\u30AF\u30B7\u30FC\u306A 10 \u4EE3",
        "\u30BB\u30C3\u30AF\u30B9",
        "\u30BD\u30C9\u30DF\u30FC",
        "\u3061\u3093\u3053",
        "\u30C7\u30A3\u30FC\u30D7\u30FB\u30B9\u30ED\u30FC\u30C8",
        "\u30C7\u30A3\u30C3\u30AF",
        "\u30C7\u30A3\u30EB\u30C9",
        "\u30C7\u30FC\u30C8\u30EC\u30A4\u30D7",
        "\u30C7\u30D6",
        "\u30C6\u30EC\u30D5\u30A9\u30F3\u30BB\u30C3\u30AF\u30B9",
        "\u30C9\u30C3\u30B0\u30B9\u30BF\u30A4\u30EB",
        "\u30C8\u30C3\u30D7\u30EC\u30B9",
        "\u306A\u3081",
        "\u30CB\u30AC\u30FC",
        "\u30CC\u30FC\u30C9",
        "\u30CD\u30AA\u30FB\u30CA\u30C1",
        "\u30CF\u30FC\u30C9\u30B3\u30A2",
        "\u30D1\u30A4\u30D1\u30F3",
        "\u30D0\u30A4\u30D6\u30EC\u30FC\u30BF\u30FC",
        "\u30D0\u30C3\u30AF\u30FB\u30B9\u30BF\u30A4\u30EB",
        "\u30D1\u30F3\u30C6\u30A3\u30FC",
        "\u30D3\u30C3\u30C1",
        "\u30D5\u30A1\u30C3\u30AF",
        "\u30D5\u30A1\u30F3\u30BF\u30B8\u30FC",
        "\u30D5\u30A3\u30B9\u30C8",
        "\u30D5\u30A7\u30C6\u30A3\u30C3\u30B7\u30E5",
        "\u30D5\u30A7\u30E9\u30C1\u30AA",
        "\u3075\u305F\u306A\u308A",
        "\u3076\u3063\u304B\u3051",
        "\u30D5\u30C3\u30AF",
        "\u30D7\u30EA\u30F3\u30B9 \u30A2\u30EB\u30D0\u30FC\u30C8 \u30D4\u30A2\u30B9",
        "\u30D7\u30EC\u30A4\u30DC\u30FC\u30A4",
        "\u30D9\u30A2\u30D0\u30C3\u30AF",
        "\u30DA\u30CB\u30B9",
        "\u30DA\u30CB\u30B9\u30D0\u30F3\u30C9",
        "\u30DC\u30FC\u30A4\u30BA\u30E9\u30D6",
        "\u30DC\u30FC\u30EB\u30AE\u30E3\u30B0",
        "\u30DC\u30FC\u30EB\u3092\u8E74\u308B",
        "\u307D\u3063\u3061\u3083\u308A",
        "\u30DB\u30E2",
        "\u30DD\u30EB\u30CE",
        "\u30DD\u30EB\u30CE\u30B0\u30E9\u30D5\u30A3\u30FC",
        "\u30DC\u30F3\u30C6\u30FC\u30B8",
        "\u30DE\u30B6\u30FC\u30FB\u30D5\u30A1\u30C3\u30AB\u30FC",
        "\u30DE\u30B9\u30BF\u30FC\u30D9\u30FC\u30B7\u30E7\u30F3",
        "\u307E\u3093\u3053",
        "\u3084\u304A\u3044",
        "\u3084\u308A\u307E\u3093",
        "\u30E6\u30C0\u30E4\u4EBA",
        "\u30E9\u30C6\u30A3\u30FC\u30CA",
        "\u30E9\u30D0\u30FC",
        "\u30E9\u30F3\u30B8\u30A7\u30EA\u30FC",
        "\u30EC\u30A4\u30D7",
        "\u30EC\u30BA\u30D3\u30A2\u30F3",
        "\u30ED\u30FC\u30BF\u30FC",
        "\u30ED\u30EA\u30FC\u30BF",
        "\u6DEB\u4E71",
        "\u9670\u6BDB",
        "\u9769\u6291\u5236",
        "\u9A0E\u4E0A\u4F4D",
        "\u5DE8\u6839",
        "\u5DE8\u4E73",
        "\u5F37\u59E6\u72AF",
        "\u7389\u306A\u3081",
        "\u7389\u8210\u3081",
        "\u7DCA\u7E1B",
        "\u8FD1\u89AA\u76F8\u59E6",
        "\u5ACC\u3044",
        "\u5F8C\u80CC\u4F4D",
        "\u5408\u610F\u306E\u6027\u4EA4",
        "\u62F7\u554F",
        "\u6BBA\u3057\u65B9",
        "\u6BBA\u4EBA\u4E8B\u4EF6",
        "\u6BBA\u4EBA\u65B9\u6CD5",
        "\u652F\u914D",
        "\u5150\u7AE5\u6027\u8650\u5F85",
        "\u81EA\u5DF1\u611B\u6027",
        "\u5C04\u7CBE",
        "\u624B\u30B3\u30AD",
        "\u7363\u59E6",
        "\u5973\u306E\u5B50",
        "\u5973\u738B\u69D8",
        "\u5973\u5B50\u9AD8\u751F",
        "\u5973\u88C5",
        "\u65B0\u3057\u3044\u30DD\u30EB\u30CE",
        "\u4EBA\u59BB",
        "\u4EBA\u7A2E",
        "\u6027\u4EA4",
        "\u6B63\u5E38\u4F4D",
        "\u751F\u6B96\u5668",
        "\u7CBE\u6DB2",
        "\u633F\u5165",
        "\u8DB3\u30D5\u30A7\u30C1",
        "\u8DB3\u3092\u5E83\u3052\u308B",
        "\u5927\u9670\u5507",
        "\u8131\u8863",
        "\u8336\u8272\u306E\u30B7\u30E3\u30EF\u30FC",
        "\u4E2D\u51FA\u3057",
        "\u6F6E\u5439\u304D\u5973",
        "\u6F6E\u5439\u304D\u7537\u6027",
        "\u76F4\u8178",
        "\u5243\u6BDB",
        "\u8C9E\u64CD\u5E2F",
        "\u5974\u96B7",
        "\u4E8C\u7A74",
        "\u4E73\u9996",
        "\u5C3F\u9053\u30D7\u30EC\u30A4",
        "\u8997\u304D",
        "\u58F2\u6625\u5A66",
        "\u7E1B\u308A",
        "\u5674\u51FA",
        "\u7CDE",
        "\u7CDE\u5C3F\u611B\u597D\u75C7",
        "\u7CDE\u4FBF",
        "\u5E73\u624B\u6253\u3061",
        "\u5909\u614B",
        "\u52C3\u8D77\u3059\u308B",
        "\u5922\u7CBE",
        "\u6BDB\u6DF1\u3044",
        "\u8A98\u60D1",
        "\u5E7C\u5150",
        "\u5E7C\u5150\u6027\u611B\u8005",
        "\u88F8",
        "\u88F8\u306E\u5973\u6027",
        "\u4E71\u4EA4",
        "\u4E21\u6027",
        "\u4E21\u6027\u5177\u6709",
        "\u4E21\u5200",
        "\u8F2A\u59E6",
        "\u534D",
        "\u5BA6\u5B98",
        "\u809B\u9580",
        "\u81A3"
      ] }.words,
      korean: { words: [
        "\uAC15\uAC04",
        "\uAC1C\uC0C8\uB07C",
        "\uAC1C\uC790\uC2DD",
        "\uAC1C\uC886",
        "\uAC1C\uCC28\uBC18",
        "\uAC70\uC720",
        "\uACC4\uC9D1\uB144",
        "\uACE0\uC790",
        "\uADFC\uCE5C",
        "\uB178\uBAA8",
        "\uB2C8\uAE30\uBBF8",
        "\uB4A4\uC9C8\uB798",
        "\uB538\uB538\uC774",
        "\uB54C\uC539",
        "\uB610\uB77C\uC774",
        "\uB664\uB188",
        "\uB85C\uB9AC\uD0C0",
        "\uB9DD\uAC00",
        "\uBAB0\uCE74",
        "\uBBF8\uCE5C",
        "\uBBF8\uCE5C\uC0C8\uB07C",
        "\uBC14\uBC14\uB9AC\uB9E8",
        "\uBCC0\uD0DC",
        "\uBCD1\uC2E0",
        "\uBCF4\uC9C0",
        "\uBD88\uC54C",
        "\uBE60\uAD6C\uB9AC",
        "\uC0AC\uAE4C\uC2DC",
        "\uC139\uC2A4",
        "\uC2A4\uC640\uD551",
        "\uC30D\uB188",
        "\uC528\uBC1C",
        "\uC528\uBC1C\uB188",
        "\uC528\uD314",
        "\uC539",
        "\uC539\uBB3C",
        "\uC539\uBE68",
        "\uC539\uC0C8\uB07C",
        "\uC539\uC54C",
        "\uC539\uCC3D",
        "\uC539\uD314",
        "\uC554\uCE90",
        "\uC560\uC790",
        "\uC57C\uB3D9",
        "\uC57C\uC0AC",
        "\uC57C\uC560\uB2C8",
        "\uC5C4\uCC3D",
        "\uC5D0\uB85C",
        "\uC5FC\uBCD1",
        "\uC618\uBCD1",
        "\uC720\uBAA8",
        "\uC721\uAC11",
        "\uC740\uAF34",
        "\uC790\uC704",
        "\uC790\uC9C0",
        "\uC7A1\uB144",
        "\uC885\uAC04\uB098",
        "\uC886",
        "\uC886\uB9CC",
        "\uC8FD\uC77C\uB144",
        "\uC950\uC886",
        "\uC9C1\uCD2C",
        "\uC9F1\uAE68",
        "\uCABD\uBC14\uB9AC",
        "\uCC3D\uB140",
        "\uD3EC\uB974\uB178",
        "\uD558\uB4DC\uCF54\uC5B4",
        "\uD638\uB85C",
        "\uD654\uB0E5\uB144",
        "\uD6C4\uB808\uC544\uB4E4",
        "\uD6C4\uC7A5",
        "\uD76C\uCB48\uADF8\uB9AC"
      ] }.words,
      norwegian: { words: [
        "drittsekk",
        "faen i helvete",
        "fitte",
        "j\xE6vla",
        "kuk",
        "kukene",
        "kuker",
        "nigger",
        "pikk",
        "sotr\xF8r",
        "st\xE5pikk",
        "st\xE5pikkene",
        "st\xE5pikker"
      ] }.words,
      persian: { words: [
        "\u0622\u0628 \u06A9\u06CC\u0631",
        "\u0627\u0631\u06AF\u0627\u0633\u0645",
        "\u0628\u0631\u0647\u0646\u0647",
        "\u067E\u0648\u0631\u0646",
        "\u067E\u0648\u0631\u0646\u0648",
        "\u062A\u062C\u0627\u0648\u0632",
        "\u062A\u062E\u0645\u06CC",
        "\u062C\u0642",
        "\u062C\u0642\u06CC",
        "\u062C\u0644\u0642",
        "\u062C\u0646\u062F\u0647",
        "\u0686\u0648\u0686\u0648\u0644",
        "\u062D\u0634\u0631",
        "\u062D\u0634\u0631\u06CC",
        "\u062F\u0627\u0641",
        "\u062F\u0648\u062F\u0648\u0644",
        "\u0633\u0627\u06A9 \u0632\u062F\u0646",
        "\u0633\u06A9\u0633",
        "\u0633\u06A9\u0633 \u06A9\u0631\u062F\u0646",
        "\u0633\u06A9\u0633\u06CC",
        "\u0633\u0648\u067E\u0631",
        "\u0634\u0642 \u06A9\u0631\u062F\u0646",
        "\u0634\u0647\u0648\u062A",
        "\u0634\u0647\u0648\u062A\u06CC",
        "\u0634\u0648\u0646\u0628\u0648\u0644",
        "\u0641\u06CC\u0644\u0645 \u0633\u0648\u067E\u0631",
        "\u06A9\u0633",
        "\u06A9\u0633 \u062F\u0627\u062F\u0646",
        "\u06A9\u0633 \u06A9\u0631\u062F\u0646",
        "\u06A9\u0633\u06A9\u0634",
        "\u06A9\u0648\u0633",
        "\u06A9\u0648\u0646",
        "\u06A9\u0648\u0646 \u062F\u0627\u062F\u0646",
        "\u06A9\u0648\u0646 \u06A9\u0631\u062F\u0646",
        "\u06A9\u0648\u0646\u06A9\u0634",
        "\u06A9\u0648\u0646\u06CC",
        "\u06A9\u06CC\u0631",
        "\u06A9\u06CC\u0631\u06CC",
        "\u0644\u0627\u067E\u0627",
        "\u0644\u0627\u067E\u0627\u06CC\u06CC",
        "\u0644\u0627\u0634\u06CC",
        "\u0644\u062E\u062A",
        "\u0644\u0634",
        "\u0645\u0646\u06CC",
        "\u0647\u0631\u0632\u0647"
      ] }.words,
      polish: { words: [
        "burdel",
        "burdelmama",
        "chuj",
        "chujnia",
        "ciota",
        "cipa",
        "cyc",
        "debil",
        "dmucha\u0107",
        "do kurwy n\u0119dzy",
        "dupa",
        "dupek",
        "duperele",
        "dziwka",
        "fiut",
        "g\xF3wno",
        "g\xF3wno prawda",
        "huj",
        "jajco",
        "jajeczko",
        "jajko",
        "jajo",
        "ja pierdol\u0119",
        "jeba\u0107",
        "jebany",
        "kurwa",
        "kurwy",
        "kutafon",
        "kutas",
        "liza\u0107 pa\u0142\u0119",
        "obci\u0105ga\u0107 chuja",
        "obci\u0105ga\u0107 fiuta",
        "obci\u0105ga\u0107 loda",
        "pieprzy\u0107",
        "pierdolec",
        "pierdoli\u0107",
        "pierdolni\u0119ty",
        "pierdo\u0142a",
        "pierdzie\u0107",
        "pizda",
        "pojeb",
        "popierdolony",
        "robic loda",
        "robi\u0107 loda",
        "rucha\u0107",
        "rzyga\u0107",
        "skurwysyn",
        "sraczka",
        "sra\u0107",
        "suka",
        "syf",
        "wkurwia\u0107",
        "zajebisty"
      ] }.words,
      portuguese: { words: [
        "aborto",
        "amador",
        "\xE2nus",
        "aranha",
        "ariano",
        "balalao",
        "bastardo",
        "bicha",
        "biscate",
        "bissexual",
        "boceta",
        "boob",
        "bosta",
        "braulio de borracha",
        "bumbum",
        "burro",
        "cabrao",
        "cacete",
        "cagar",
        "camisinha",
        "caralho",
        "cerveja",
        "chochota",
        "chupar",
        "clitoris",
        "coca\xEDna",
        "colhoes",
        "comer",
        "cona",
        "consolo",
        "corno",
        "cu",
        "dar o rabo",
        "dum raio",
        "esporra",
        "fecal",
        "filho da puta",
        "foda",
        "foda-se",
        "foder",
        "frango assado",
        "gozar",
        "grelho",
        "hero\xEDna",
        "heterosexual",
        "homem gay",
        "homoer\xF3tico",
        "homosexual",
        "inferno",
        "l\xE9sbica",
        "lolita",
        "mama",
        "merda",
        "paneleiro",
        "passar um cheque",
        "pau",
        "peidar",
        "p\xEAnis",
        "pinto",
        "porra",
        "puta",
        "puta que pariu",
        "puta que te pariu",
        "queca",
        "sacanagem",
        "saco",
        "torneira",
        "transar",
        "vai-te foder",
        "vai tomar no cu",
        "veado",
        "vibrador",
        "xana",
        "xochota"
      ] }.words,
      russian: { words: [
        "bychara",
        "byk",
        "chernozhopyi",
        "dolboy'eb",
        "ebalnik",
        "ebalo",
        "ebalom sch'elkat",
        "gol",
        "mudack",
        "opizdenet",
        "osto'eblo",
        "ostokhuitel'no",
        "ot'ebis",
        "otmudohat",
        "otpizdit",
        "otsosi",
        "padlo",
        "pedik",
        "perdet",
        "petuh",
        "pidar gnoinyj",
        "pizda",
        "pizdato",
        "pizdatyi",
        "piz'det",
        "pizdetc",
        "pizdoi nakryt'sja",
        "pizd'uk",
        "piz`dyulina",
        "podi ku'evo",
        "poeben",
        "po'imat' na konchik",
        "po'iti posrat",
        "po khuy",
        "poluchit pizdy",
        "pososi moyu konfetku",
        "prissat",
        "proebat",
        "promudobl'adsksya pizdopro'ebina",
        "propezdoloch",
        "prosrat",
        "raspeezdeyi",
        "raspizdatyi",
        "raz'yebuy",
        "raz'yoba",
        "s'ebat'sya",
        "shalava",
        "styervo",
        "sukin syn",
        "svodit posrat",
        "svoloch",
        "trakhat'sya",
        "trimandoblydskiy pizdoproyob",
        "ubl'yudok",
        "uboy",
        "u'ebitsche",
        "vafl'a",
        "vafli lovit",
        "v pizdu",
        "vyperdysh",
        "vzdrochennyi",
        "yeb vas",
        "za'ebat",
        "zaebis",
        "zalupa",
        "zalupat",
        "zasranetc",
        "zassat",
        "zlo'ebuchy",
        "\u0431\u0430\u0440\u0434\u0430\u043A",
        "\u0431\u0437\u0434\u0451\u043D\u043E\u043A",
        "\u0431\u043B\u044F\u0434\u043A\u0438",
        "\u0431\u043B\u044F\u0434\u043E\u0432\u0430\u0442\u044C",
        "\u0431\u043B\u044F\u0434\u0441\u0442\u0432\u043E",
        "\u0431\u043B\u044F\u0434\u044C",
        "\u0431\u0443\u0433\u043E\u0440",
        "\u0432\u043E \u043F\u0438\u0437\u0434\u0443",
        "\u0432\u0441\u0442\u0430\u0442\u044C \u0440\u0430\u043A\u043E\u043C",
        "\u0432\u044B\u0451\u0431\u044B\u0432\u0430\u0442\u044C\u0441\u044F",
        "\u0433\u0430\u043D\u0434\u043E\u043D",
        "\u0433\u043E\u0432\u043D\u043E",
        "\u0433\u043E\u0432\u043D\u044E\u043A",
        "\u0433\u043E\u043B\u044B\u0439",
        "\u0434\u0430\u0442\u044C \u043F\u0438\u0437\u0434\u044B",
        "\u0434\u0435\u0440\u044C\u043C\u043E",
        "\u0434\u0440\u043E\u0447\u0438\u0442\u044C",
        "\u0434\u0440\u0443\u0433\u043E\u0439 \u0434\u0440\u0430\u0437\u043D\u0438\u0442\u0441\u044F",
        "\u0451\u0431\u0430\u0440\u044C",
        "\u0435\u0431\u0430\u0442\u044C",
        "\u0435\u0431\u0430\u0442\u044C-\u043A\u043E\u043F\u0430\u0442\u044C",
        "\u0435\u0431\u043B\u043E",
        "\u0435\u0431\u043D\u0443\u0442\u044C",
        "\u0451\u0431 \u0442\u0432\u043E\u044E \u043C\u0430\u0442\u044C",
        "\u0436\u043E\u043F\u0430",
        "\u0436\u043E\u043F\u043E\u043B\u0438\u0437",
        "\u0438\u0433\u0440\u0430\u0442\u044C \u043D\u0430 \u043A\u043E\u0436\u0430\u043D\u043E\u0439 \u0444\u043B\u0435\u0439\u0442\u0435",
        "\u0438\u0437\u043C\u0443\u0434\u043E\u0445\u0430\u0442\u044C",
        "\u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0440\u043E\u0447\u0438\u0442 \u043A\u0430\u043A \u043E\u043D \u0445\u043E\u0447\u0435\u0442",
        "\u043A\u0430\u043A\u0430\u044F \u0440\u0430\u0437\u043D\u0438\u0446\u0430",
        "\u043A\u0430\u043A \u0434\u0432\u0430 \u043F\u0430\u043B\u044C\u0446\u0430 \u043E\u0431\u043E\u0441\u0441\u0430\u0442\u044C",
        "\u043A\u0443\u0440\u0438\u0442\u0435 \u043C\u043E\u044E \u0442\u0440\u0443\u0431\u043A\u0443",
        "\u043B\u044B\u0441\u043E\u0433\u043E \u0432 \u043A\u0443\u043B\u0430\u043A\u0435 \u0433\u043E\u043D\u044F\u0442\u044C",
        "\u043C\u0430\u043B\u043E\u0444\u044F",
        "\u043C\u0430\u043D\u0434\u0430",
        "\u043C\u0430\u043D\u0434\u0430\u0432\u043E\u0448\u043A\u0430",
        "\u043C\u0435\u043D\u0442",
        "\u043C\u0443\u0434\u0430",
        "\u043C\u0443\u0434\u0438\u043B\u043E",
        "\u043C\u0443\u0434\u043E\u0437\u043C\u043E\u043D",
        "\u043D\u0430\u0435\u0431\u0430\u0442\u044C",
        "\u043D\u0430\u0435\u0431\u0435\u043D\u0438\u0442\u044C\u0441\u044F",
        "\u043D\u0430\u0435\u0431\u043D\u0443\u0442\u044C\u0441\u044F",
        "\u043D\u0430 \u0444\u0438\u0433",
        "\u043D\u0430 \u0445\u0443\u0439",
        "\u043D\u0430 \u0445\u0443\u044E \u0432\u0435\u0440\u0442\u0435\u0442\u044C",
        "\u043D\u0430 \u0445\u0443\u044F",
        "\u043D\u0430\u0445\u0443\u044F\u0447\u0438\u0442\u044C\u0441\u044F",
        "\u043D\u0435\u0432\u0435\u0431\u0435\u043D\u043D\u044B\u0439",
        "\u043D\u0435 \u0435\u0431\u0435\u0442",
        "\u043D\u0438 \u0437\u0430 \u0445\u0443\u0439 \u0441\u043E\u0431\u0430\u0447\u0443",
        "\u043D\u0438 \u0445\u0443\u044F",
        "\u043E\u0431\u043D\u0430\u0436\u0435\u043D\u043D\u044B\u0439",
        "\u043E\u0431\u043E\u0441\u0441\u0430\u0442\u044C\u0441\u044F \u043C\u043E\u0436\u043D\u043E",
        "\u043E\u0434\u0438\u043D \u0435\u0431\u0451\u0442\u0441\u044F",
        "\u043E\u043F\u0435\u0441\u0434\u043E\u043B",
        "\u043E\u0444\u0438\u0433\u0435\u0442\u044C",
        "\u043E\u0445\u0443\u0435\u0442\u044C",
        "\u043E\u0445\u0443\u0439\u0442\u0435\u043B\u044C\u043D\u043E",
        "\u043F\u043E\u043B\u043E\u0432\u043E\u0435 \u0441\u043D\u043E\u0448\u0435\u043D\u0438\u0435",
        "\u0441\u0435\u043A\u0441",
        "\u0441\u0438\u0441\u043A\u0438",
        "\u0441\u043F\u0438\u0437\u0434\u0438\u0442\u044C",
        "\u0441\u0440\u0430\u0442\u044C",
        "\u0441\u0441\u0430\u0442\u044C",
        "\u0442\u0440\u0430x\u0430\u0442\u044C",
        "\u0442\u044B \u043C\u043D\u0435 \u0432\u0430\u043D\u044C\u043A\u0443 \u043D\u0435 \u0432\u0430\u043B\u044F\u0439",
        "\u0444\u0438\u0433\u0430",
        "\u0445\u0430\u043F\u0430\u0442\u044C",
        "\u0445\u0435\u0440 \u0441 \u043D\u0435\u0439",
        "\u0445\u0435\u0440 \u0441 \u043D\u0438\u043C",
        "\u0445\u043E\u0445\u043E\u043B",
        "\u0445\u0440\u0435\u043D",
        "\u0445\u0443\u0451\u0432\u043E",
        "\u0445\u0443\u0451\u0432\u044B\u0439",
        "\u0445\u0443\u0435\u043C \u0433\u0440\u0443\u0448\u0438 \u043E\u043A\u043E\u043B\u0430\u0447\u0438\u0432\u0430\u0442\u044C",
        "\u0445\u0443\u0435\u043F\u043B\u0435\u0442",
        "\u0445\u0443\u0438\u043B\u043E",
        "\u0445\u0443\u0438\u043D\u0435\u0439 \u0441\u0442\u0440\u0430\u0434\u0430\u0442\u044C",
        "\u0445\u0443\u0438\u043D\u044F",
        "\u0445\u0443\u0439",
        "\u0445\u0443\u0439\u043D\u0443\u0442\u044C",
        "\u0445\u0443\u0439 \u043F\u0438\u043D\u0430\u0442\u044C"
      ] }.words,
      spanish: { words: [
        "sesinato",
        "asno",
        "bastardo",
        "Bollera",
        "Cabron",
        "Cabr\xF3n",
        "Caca",
        "Chupada",
        "Chupapollas",
        "Chupet\xF3n",
        "concha",
        "Concha de tu madre",
        "Co\xF1o",
        "Coprofag\xEDa",
        "Culo",
        "Drogas",
        "Esperma",
        "Fiesta de salchichas",
        "Follador",
        "Follar",
        "Gilipichis",
        "Gilipollas",
        "Hacer una paja",
        "Haciendo el amor",
        "Hero\xEDna",
        "Hija de puta",
        "Hijaputa",
        "Hijo de puta",
        "Hijoputa",
        "Idiota",
        "Imb\xE9cil",
        "infierno",
        "Jilipollas",
        "Kapullo",
        "Lameculos",
        "Maciza",
        "Macizorra",
        "maldito",
        "Mamada",
        "Marica",
        "Maric\xF3n",
        "Mariconazo",
        "martillo",
        "Mierda",
        "Nazi",
        "Orina",
        "Pedo",
        "Pervertido",
        "Pez\xF3n",
        "Pinche",
        "Pis",
        "Prostituta",
        "Puta",
        "Racista",
        "Ramera",
        "S\xE1dico",
        "Semen",
        "Sexo",
        "Sexo oral",
        "Soplagaitas",
        "Soplapollas",
        "Tetas grandes",
        "T\xEDa buena",
        "Travesti",
        "Trio",
        "Verga",
        "vete a la mierda",
        "Vulva"
      ] }.words,
      turkish: { words: [
        "aardappels afgieteng",
        "achter het raam zitten",
        "afberen",
        "aflebberen",
        "afrossen",
        "afrukken",
        "aftrekken",
        "afwerkplaats",
        "afzeiken",
        "afzuigen",
        "anderhalve man en een paardekop",
        "anita",
        "asbak",
        "aso",
        "bagger schijten",
        "balen",
        "bedonderen",
        "befborstelg",
        "beffen",
        "bekken",
        "belazeren",
        "besodemieterd zijn",
        "besodemieteren",
        "beurt",
        "boemelen",
        "boerelul",
        "boerenpummelg",
        "bokkelul",
        "botergeil",
        "broekhoesten",
        "brugpieperg",
        "buffelen",
        "buiten de pot piesen",
        "da's kloten van de bok",
        "de ballen",
        "de hoer spelen",
        "de hond uitlaten",
        "de koffer induiken",
        "delg",
        "de pijp aan maarten geven",
        "de pijp uitgaan",
        "dombo",
        "draaikontg",
        "driehoog achter wonen",
        "drolg",
        "drooggeiler",
        "droogkloot",
        "een beurt geven",
        "een nummertje maken",
        "een wip maken",
        "eikel",
        "engerd",
        "flamoes",
        "flikken",
        "flikker",
        "gadverdamme",
        "galbak",
        "gat",
        "gedoogzone",
        "geilneef",
        "gesodemieter",
        "godverdomme",
        "graftak",
        "gras maaien",
        "gratenkutg",
        "greppeldel",
        "griet",
        "hoempert",
        "hoer",
        "hoerenbuurt",
        "hoerenloper",
        "hoerig",
        "hol",
        "hufter",
        "huisdealer",
        "johny",
        "kanen",
        "kettingzeugg",
        "klaarkomen",
        "klerebeer",
        "klojo",
        "klooien",
        "klootjesvolk",
        "klootoog",
        "klootzak",
        "kloten",
        "knor",
        "kontg",
        "kontneuken",
        "krentekakker",
        "kut",
        "kuttelikkertje",
        "kwakkieg",
        "liefdesgrot",
        "lul",
        "lul-de-behanger",
        "lulhannes",
        "lummel",
        "mafketel",
        "matennaaierg",
        "matje",
        "mof",
        "mutsg",
        "naaien",
        "naakt",
        "neuken",
        "neukstier",
        "nicht",
        "oetlul",
        "opgeilen",
        "opkankeren",
        "oprotten",
        "opsodemieteren",
        "op z'n hondjes",
        "op z'n sodemieter geven",
        "opzouten",
        "ouwehoer",
        "ouwehoeren",
        "ouwe rukker",
        "paal",
        "paardelul",
        "palen",
        "penozeg",
        "piesen",
        "pijpbekkieg",
        "pijpen",
        "pik",
        "pleurislaaier",
        "poep",
        "poepen",
        "poot",
        "portiekslet",
        "pot",
        "potverdorie",
        "publiciteitsgeil",
        "raaskallen",
        "reet",
        "reetridder",
        "reet trappen, voor zijn",
        "remsporeng",
        "reutelen",
        "rothoer",
        "rotzak",
        "rukhond",
        "rukken",
        "schatje",
        "schijt",
        "schijten",
        "schoft",
        "schuinsmarcheerder",
        "shit",
        "slempen",
        "sletg",
        "sletterig",
        "slik mijn zaad",
        "snolg",
        "spuiten",
        "standje",
        "standje-69g",
        "stoephoer",
        "stootje",
        "strontg",
        "sufferdg",
        "tapijtnek",
        "teefg",
        "temeier",
        "teringlijer",
        "toeter",
        "tongzoeng",
        "triootjeg",
        "trottoir prostitu\xE9e",
        "trottoirteef",
        "vergallen",
        "verkloten",
        "verneuken",
        "viespeuk",
        "vingeren",
        "vleesroos",
        "voor jan lul",
        "voor jan-met-de-korte-achternaam",
        "watje",
        "welzijnsmafia",
        "wijf",
        "wippen",
        "wuftje",
        "zaadje",
        "zakkenwasser",
        "zeiken",
        "zeiker",
        "zuigen",
        "zuiplap"
      ] }.words,
      swedish: { words: [
        "arsle",
        "brutta",
        "discofitta",
        "dra \xE5t helvete",
        "fan",
        "fitta",
        "fittig",
        "f\xF6r helvete",
        "helvete",
        "h\xE5rd",
        "j\xE4vlar",
        "knulla",
        "kuk",
        "kuks\xE5s",
        "k\xF6tthuvud",
        "k\xF6ttnacke",
        "moona",
        "moonade",
        "moonar",
        "moonat",
        "mutta",
        "nigger",
        "neger",
        "olla",
        "pippa",
        "pitt",
        "prutt",
        "p\xF6k",
        "runka",
        "r\xF6v",
        "r\xF6vh\xE5l",
        "r\xF6vknulla",
        "satan",
        "skita",
        "skit ner dig",
        "sk\xE4ggbiff",
        "snedfitta",
        "snefitta",
        "stake",
        "subba",
        "s\xE5s",
        "s\xE4tta p\xE5",
        "tusan"
      ] }.words,
      thai: { words: [
        "\u0E01\u0E23\u0E30\u0E14\u0E2D",
        "\u0E01\u0E23\u0E30\u0E40\u0E14\u0E49\u0E32",
        "\u0E01\u0E23\u0E30\u0E2B\u0E23\u0E35\u0E48",
        "\u0E01\u0E30\u0E1B\u0E34",
        "\u0E01\u0E39",
        "\u0E02\u0E35\u0E49",
        "\u0E04\u0E27\u0E22",
        "\u0E08\u0E34\u0E4B\u0E21",
        "\u0E08\u0E39\u0E4B",
        "\u0E40\u0E08\u0E4A\u0E01",
        "\u0E40\u0E08\u0E35\u0E4A\u0E22\u0E27",
        "\u0E14\u0E2D\u0E01\u0E17\u0E2D\u0E07",
        "\u0E15\u0E2D\u0E41\u0E2B\u0E25",
        "\u0E15\u0E39\u0E14",
        "\u0E19\u0E49\u0E4D\u0E32\u0E41\u0E15\u0E01",
        "\u0E21\u0E36\u0E07",
        "\u0E41\u0E21\u0E48\u0E07",
        "\u0E40\u0E22\u0E47\u0E14",
        "\u0E23\u0E39\u0E15\u0E39\u0E14",
        "\u0E25\u0E49\u0E32\u0E07\u0E15\u0E39\u0E49\u0E40\u0E22\u0E47\u0E19",
        "\u0E2A\u0E49\u0E19\u0E15\u0E35\u0E19",
        "\u0E2A\u0E31\u0E14",
        "\u0E40\u0E2A\u0E37\u0E2D\u0E01",
        "\u0E2B\u0E0D\u0E34\u0E07\u0E0A\u0E32\u0E15\u0E34\u0E0A\u0E31\u0E48\u0E27",
        "\u0E2B\u0E25\u0E31\u0E48\u0E07",
        "\u0E2B\u0E48\u0E32",
        "\u0E2B\u0E4D\u0E32",
        "\u0E2B\u0E35",
        "\u0E40\u0E2B\u0E35\u0E49\u0E22",
        "\u0E2D\u0E21\u0E19\u0E01\u0E40\u0E02\u0E32",
        "\u0E44\u0E2D\u0E49\u0E04\u0E27\u0E32\u0E22"
      ] }.words
    };
    SeverityLevel = /* @__PURE__ */ ((SeverityLevel2) => {
      SeverityLevel2[SeverityLevel2["EXACT"] = 1] = "EXACT";
      SeverityLevel2[SeverityLevel2["FUZZY"] = 2] = "FUZZY";
      return SeverityLevel2;
    })(SeverityLevel || {});
    POSITIVE_INDICATORS = /* @__PURE__ */ new Set([
      "amazing",
      "awesome",
      "excellent",
      "fantastic",
      "great",
      "love",
      "wonderful",
      "brilliant",
      "perfect",
      "incredible",
      "outstanding",
      "superb",
      "magnificent",
      "marvelous",
      "spectacular",
      "phenomenal",
      "terrific",
      "fabulous",
      "divine",
      "best",
      "good",
      "nice",
      "cool",
      "sweet",
      "rad",
      "sick",
      "dope",
      "fire",
      "lit",
      "epic",
      "legendary",
      "godlike",
      "insane",
      "crazy",
      "wild",
      "beast",
      "movie",
      "film",
      "show",
      "song",
      "music",
      "game",
      "book",
      "restaurant",
      "food",
      "dish",
      "meal",
      "place",
      "spot",
      "location",
      "experience"
    ]);
    NEGATIVE_INDICATORS = /* @__PURE__ */ new Set([
      "hate",
      "terrible",
      "awful",
      "horrible",
      "disgusting",
      "pathetic",
      "stupid",
      "idiot",
      "moron",
      "loser",
      "worthless",
      "useless",
      "garbage",
      "trash",
      "suck",
      "sucks",
      "worst",
      "bad",
      "ugly",
      "gross",
      "nasty",
      "annoying",
      "irritating",
      "frustrating",
      "disappointing",
      "lame",
      "weak",
      "fail",
      "you",
      "your",
      "yourself",
      "u",
      "ur",
      "ure",
      "youre"
    ]);
    GAMING_POSITIVE = /* @__PURE__ */ new Set([
      "player",
      "gamer",
      "team",
      "squad",
      "clan",
      "guild",
      "match",
      "game",
      "round",
      "level",
      "boss",
      "raid",
      "quest",
      "achievement",
      "skill",
      "build",
      "loadout",
      "strategy",
      "tactic",
      "play",
      "move",
      "combo"
    ]);
    POSITIVE_PHRASES = /* @__PURE__ */ new Map([
      ["the bomb", 0.9],
      ["da bomb", 0.9],
      ["bomb.com", 0.9],
      ["bomb diggity", 0.9],
      ["photo bomb", 0.8],
      ["bath bomb", 0.8],
      ["bomb squad", 0.7]
    ]);
    NEGATIVE_PHRASES = /* @__PURE__ */ new Map([
      ["you are", 0.1],
      ["ur a", 0.1],
      ["such a", 0.2],
      ["fucking", 0.1],
      ["damn", 0.2]
    ]);
    ContextAnalyzer = class {
      constructor(config) {
        this.contextWindow = config.contextWindow;
        this.language = config.language;
        this.domainWhitelists = new Set(config.domainWhitelists || []);
      }
      /**
      * Analyzes the context around a profanity match to determine if it should be flagged
      */
      analyzeContext(text, matchWord, matchIndex) {
        const words = this.tokenize(text);
        const matchWordIndex = this.findWordIndex(words, matchIndex);
        if (matchWordIndex === -1) return {
          contextScore: 0.5,
          reason: "Could not locate match in tokenized text",
          isWhitelisted: false
        };
        const startIndex = Math.max(0, matchWordIndex - this.contextWindow);
        const endIndex = Math.min(words.length, matchWordIndex + this.contextWindow + 1);
        const contextWords = words.slice(startIndex, endIndex);
        const contextText = contextWords.join(" ").toLowerCase();
        const phraseResult = this.checkPhraseContext(contextText, matchWord);
        if (phraseResult) return phraseResult;
        if (this.isDomainWhitelisted(contextWords, matchWord)) return {
          contextScore: 0.8,
          reason: "Domain-specific whitelist match",
          isWhitelisted: true
        };
        const sentimentScore = this.calculateSentimentScore(contextWords, matchWordIndex - startIndex);
        return {
          contextScore: sentimentScore,
          reason: this.generateReason(sentimentScore, contextWords),
          isWhitelisted: false
        };
      }
      checkPhraseContext(contextText, matchWord) {
        for (const [phrase, score] of POSITIVE_PHRASES.entries()) if (contextText.includes(phrase)) return {
          contextScore: score,
          reason: `Positive phrase detected: "${phrase}"`,
          isWhitelisted: true
        };
        for (const [phrase, score] of NEGATIVE_PHRASES.entries()) if (contextText.includes(phrase)) return {
          contextScore: score,
          reason: `Negative phrase detected: "${phrase}"`,
          isWhitelisted: false
        };
        return null;
      }
      isDomainWhitelisted(contextWords, matchWord) {
        for (const word of contextWords) if (this.domainWhitelists.has(word) || GAMING_POSITIVE.has(word)) return true;
        return false;
      }
      generateReason(score, contextWords) {
        if (score >= 0.7) return "Positive context detected - likely not profanity";
        else if (score <= 0.3) return "Negative context detected - likely profanity";
        else return "Neutral context - uncertain classification";
      }
      tokenize(text) {
        return text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter((word) => word.length > 0);
      }
      findWordIndex(words, charIndex) {
        let currentPos = 0;
        for (let i = 0; i < words.length; i++) {
          if (currentPos >= charIndex) return Math.max(0, i - 1);
          currentPos += words[i].length + 1;
        }
        return words.length - 1;
      }
      calculateSentimentScore(contextWords, matchPosition) {
        let positiveCount = 0;
        let negativeCount = 0;
        const totalWords = contextWords.length;
        for (let i = 0; i < contextWords.length; i++) {
          const word = contextWords[i];
          const distance = Math.abs(i - matchPosition);
          const weight = Math.max(0.1, 1 - distance * 0.2);
          if (POSITIVE_INDICATORS.has(word)) positiveCount += weight;
          else if (NEGATIVE_INDICATORS.has(word)) negativeCount += weight;
        }
        const totalSentiment = positiveCount + negativeCount;
        if (totalSentiment === 0) return 0.5;
        const rawScore = positiveCount / totalSentiment;
        let adjustedScore = rawScore;
        const confidenceMultiplier = Math.min(1, totalWords / 5);
        adjustedScore = 0.5 + (adjustedScore - 0.5) * confidenceMultiplier;
        if (contextWords.some((word) => [
          "you",
          "your",
          "u",
          "ur"
        ].includes(word)) && rawScore < 0.7) adjustedScore *= 0.7;
        if (contextWords.some((word) => [
          "movie",
          "song",
          "game",
          "book",
          "show",
          "this",
          "that",
          "it"
        ].includes(word)) && rawScore > 0.3) adjustedScore = Math.min(1, adjustedScore * 1.3);
        return Math.max(0, Math.min(1, adjustedScore));
      }
      /**
      * Updates the domain whitelist for this analyzer instance
      */
      updateDomainWhitelist(newWhitelist) {
        this.domainWhitelists = new Set(newWhitelist);
      }
      /**
      * Adds words to the domain whitelist
      */
      addToDomainWhitelist(words) {
        words.forEach((word) => this.domainWhitelists.add(word.toLowerCase()));
      }
    };
    Filter = class {
      constructor(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
        const defaultLanguage = "english";
        this.enableContextAware = (_a = config == null ? void 0 : config.enableContextAware) != null ? _a : false;
        this.contextWindow = (_b = config == null ? void 0 : config.contextWindow) != null ? _b : 3;
        this.confidenceThreshold = (_c = config == null ? void 0 : config.confidenceThreshold) != null ? _c : 0.7;
        this.primaryLanguage = ((_d = config == null ? void 0 : config.languages) == null ? void 0 : _d[0]) || defaultLanguage;
        if (this.enableContextAware) this.contextAnalyzer = new ContextAnalyzer({
          contextWindow: this.contextWindow,
          language: this.primaryLanguage,
          domainWhitelists: ((_e = config == null ? void 0 : config.domainWhitelists) == null ? void 0 : _e[this.primaryLanguage]) || []
        });
        let words = [];
        this.caseSensitive = (_f = config == null ? void 0 : config.caseSensitive) != null ? _f : false;
        this.allowObfuscatedMatch = (_g = config == null ? void 0 : config.allowObfuscatedMatch) != null ? _g : false;
        this.wordBoundaries = (_h = config == null ? void 0 : config.wordBoundaries) != null ? _h : !this.allowObfuscatedMatch;
        this.replaceWith = config == null ? void 0 : config.replaceWith;
        this.severityLevels = (_i = config == null ? void 0 : config.severityLevels) != null ? _i : false;
        this.ignoreWords = new Set(((_j = config == null ? void 0 : config.ignoreWords) == null ? void 0 : _j.map((word) => word.toLowerCase())) || []);
        this.logProfanity = (_k = config == null ? void 0 : config.logProfanity) != null ? _k : false;
        this.fuzzyToleranceLevel = (_l = config == null ? void 0 : config.fuzzyToleranceLevel) != null ? _l : 0.8;
        if (config == null ? void 0 : config.allLanguages) {
          for (const lang in dictionary_default) if (Object.prototype.hasOwnProperty.call(dictionary_default, lang)) words = [...words, ...dictionary_default[lang]];
        } else {
          const languages = (config == null ? void 0 : config.languages) || ["english"];
          new Set(languages).forEach((lang) => {
            words = [...words, ...dictionary_default[lang]];
          });
        }
        if (config == null ? void 0 : config.customWords) words = [...words, ...config.customWords];
        this.words = new Map(words.map((word) => [word.toLowerCase(), 1]));
      }
      debugLog(...args) {
        if (this.logProfanity) console.log("[glin-profanity]", ...args);
      }
      normalizeObfuscated(text) {
        let normalized = text.replace(/([a-zA-Z])\1{1,}/g, "$1$1");
        const charMap = {
          "@": "a",
          $: "s",
          "!": "i",
          "1": "i",
          "*": ""
        };
        normalized = normalized.replace(/[@$!1*]/g, (m2) => charMap[m2] || m2);
        return normalized;
      }
      getRegex(word) {
        const flags = this.caseSensitive ? "g" : "gi";
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const boundary = this.wordBoundaries ? "\\b" : "";
        return new RegExp(`${boundary}${escapedWord}${boundary}`, flags);
      }
      isFuzzyToleranceMatch(word, text) {
        const simplifiedText = text.toLowerCase().replace(/[^a-z]/g, "");
        const simplifiedWord = word.toLowerCase();
        let matchCount = 0;
        let index = 0;
        for (let i = 0; i < simplifiedText.length; i++) if (simplifiedText[i] === simplifiedWord[index]) {
          matchCount++;
          index++;
          if (index === simplifiedWord.length) break;
        }
        return matchCount / simplifiedWord.length >= this.fuzzyToleranceLevel;
      }
      evaluateSeverity(word, text) {
        if (this.wordBoundaries && this.getRegex(word).test(text)) return 1;
        if (this.getRegex(word).test(text)) return 1;
        if (this.isFuzzyToleranceMatch(word, text)) return 2;
      }
      isProfane(value) {
        const input = this.allowObfuscatedMatch ? this.normalizeObfuscated(value) : value;
        for (const word of this.words.keys()) if (!this.ignoreWords.has(word.toLowerCase()) && this.evaluateSeverity(word, input) !== void 0) return true;
        return false;
      }
      matches(word) {
        return this.isProfane(word);
      }
      checkProfanity(text) {
        if (!this.enableContextAware) {
          let input2 = this.allowObfuscatedMatch ? this.normalizeObfuscated(text) : text;
          input2 = input2.toLowerCase();
          const profaneWords2 = [];
          const severityMap2 = {};
          for (const dictWord of this.words.keys()) {
            if (this.ignoreWords.has(dictWord.toLowerCase())) continue;
            const severity = this.evaluateSeverity(dictWord, input2);
            if (severity !== void 0) {
              const regex = this.getRegex(dictWord);
              let match;
              while ((match = regex.exec(input2)) !== null) {
                profaneWords2.push(match[0]);
                if (severityMap2[match[0]] === void 0) severityMap2[match[0]] = severity;
              }
            }
          }
          let processedText2 = text;
          if (this.replaceWith && profaneWords2.length > 0) {
            const uniqueWords = Array.from(new Set(profaneWords2));
            for (const word of uniqueWords) {
              const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
              const replacementRegex = this.wordBoundaries ? new RegExp(`\\b${escaped}\\b`, "gi") : new RegExp(escaped, "gi");
              processedText2 = processedText2.replace(replacementRegex, this.replaceWith);
            }
          }
          return {
            containsProfanity: profaneWords2.length > 0,
            profaneWords: Array.from(new Set(profaneWords2)),
            processedText: this.replaceWith ? processedText2 : void 0,
            severityMap: this.severityLevels && Object.keys(severityMap2).length > 0 ? severityMap2 : void 0
          };
        }
        let input = this.allowObfuscatedMatch ? this.normalizeObfuscated(text) : text;
        input = input.toLowerCase();
        const originalText = text;
        const profaneWords = [];
        const severityMap = {};
        const matches = [];
        for (const dictWord of this.words.keys()) {
          if (this.ignoreWords.has(dictWord.toLowerCase())) continue;
          const severity = this.evaluateSeverity(dictWord, input);
          if (severity !== void 0) {
            const regex = this.getRegex(dictWord);
            let match;
            while ((match = regex.exec(input)) !== null) {
              const matchedWord = match[0];
              const matchIndex = match.index;
              const matchObj = {
                word: matchedWord,
                index: matchIndex,
                severity
              };
              if (this.enableContextAware && this.contextAnalyzer) {
                const contextResult = this.contextAnalyzer.analyzeContext(originalText, matchedWord, matchIndex);
                matchObj.contextScore = contextResult.contextScore;
                matchObj.reason = contextResult.reason;
                matchObj.isWhitelisted = contextResult.isWhitelisted;
                if (contextResult.isWhitelisted || contextResult.contextScore > this.confidenceThreshold) continue;
              }
              profaneWords.push(matchedWord);
              if (severityMap[matchedWord] === void 0) severityMap[matchedWord] = severity;
              matches.push(matchObj);
            }
          }
        }
        if (profaneWords.length > 0) this.debugLog("Detected:", profaneWords);
        let processedText = text;
        if (this.replaceWith && profaneWords.length > 0) {
          const uniqueWords = Array.from(new Set(profaneWords));
          for (const word of uniqueWords) {
            const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const replacementRegex = this.wordBoundaries ? new RegExp(`\\b${escaped}\\b`, "gi") : new RegExp(escaped, "gi");
            processedText = processedText.replace(replacementRegex, this.replaceWith);
          }
        }
        let contextScore;
        if (this.enableContextAware && matches.length > 0) contextScore = matches.reduce((sum, match) => sum + (match.contextScore || 0.5), 0) / matches.length;
        return {
          containsProfanity: profaneWords.length > 0,
          profaneWords: Array.from(new Set(profaneWords)),
          processedText: this.replaceWith ? processedText : void 0,
          severityMap: this.severityLevels && Object.keys(severityMap).length > 0 ? severityMap : void 0,
          matches: matches.length > 0 ? matches : void 0,
          contextScore,
          reason: matches.length > 0 ? `Found ${matches.length} potential profanity matches` : "No profanity detected"
        };
      }
      checkProfanityWithMinSeverity(text, minSeverity = 1) {
        const result = this.checkProfanity(text);
        return {
          filteredWords: result.severityMap && result.profaneWords.length > 0 ? result.profaneWords.filter((word) => {
            var _a;
            const severity = (_a = result.severityMap) == null ? void 0 : _a[word];
            return typeof severity === "number" && severity >= minSeverity;
          }) : [],
          result
        };
      }
    };
    globalWhitelist_default = { whitelist: [
      "Document",
      "Assume",
      "Assistant",
      "Assignment",
      "Bass",
      "Class",
      "Grass",
      "Pass",
      "Analytics",
      "Pension",
      "Night",
      "Butler",
      "Canal",
      "Election",
      "Spreadsheet",
      "Accountant",
      "Cucumber",
      "Analysis",
      "Japan",
      "Analytics",
      "Manipulate",
      "Shoot",
      "Button",
      "Scrutiny",
      "Constitution",
      "Associate",
      "Country"
    ] };
    import_react = __toESM(require_react(), 1);
    useProfanityChecker = (config) => {
      var _a;
      const [result, setResult] = (0, import_react.useState)(null);
      const checkText2 = (0, import_react.useCallback)((text) => {
        const checkResult = checkProfanity(text, config);
        setResult(checkResult);
        return checkResult;
      }, [config]);
      const checkTextAsync = (0, import_react.useCallback)((text) => __async(null, null, function* () {
        const checkResult = yield checkProfanityAsync(text, config);
        setResult(checkResult);
        return checkResult;
      }), [config]);
      const isWordProfaneCallback = (0, import_react.useCallback)((word) => {
        return isWordProfane(word, config);
      }, [config]);
      return {
        result,
        checkText: checkText2,
        checkTextAsync,
        reset: (0, import_react.useCallback)(() => setResult(null), []),
        isDirty: (_a = result == null ? void 0 : result.containsProfanity) != null ? _a : false,
        isWordProfane: isWordProfaneCallback
      };
    };
  }
});

// node_modules/@series-inc/rundot-game-sdk/dist/core-CUZ70pdB.js
var core_CUZ70pdB_exports = {};
__export(core_CUZ70pdB_exports, {
  createProxiedObject: () => createProxiedObject
});
var init_core_CUZ70pdB = __esm({
  "node_modules/@series-inc/rundot-game-sdk/dist/core-CUZ70pdB.js"() {
    init_core_DLpmdjtO();
  }
});

// node_modules/@series-inc/rundot-game-sdk/dist/ClipsApiImpl-mFIIqDe9.js
init_core_DLpmdjtO();

// node_modules/@series-inc/rundot-game-sdk/dist/replaySize-CX50idnG.js
var RundotApiError = class extends Error {
  code;
  /** HTTP status when the error came over HTTP; `0` for transport/RPC errors with no HTTP status. */
  status;
  /**
  * Optional human-readable cause from the server (e.g. an upstream provider's
  * validation message), surfaced alongside the controlled `message` so callers
  * can show the specific reason rather than a generic failure.
  *
  * This is a flattened STRING. For the machine-readable breakdown of a
  * provider rejection (type / reason / offending field), use `errorDetail`.
  */
  detail;
  /**
  * Optional structured provider rejection detail (e.g.
  * `{ type: 'content_policy_violation', reason: 'partner_validation_failed' }`).
  * Unlike `detail` (a display string), this is meant for programmatic handling.
  */
  errorDetail;
  constructor(code, message, status = 0, detail, errorDetail) {
    super(message);
    this.name = "RundotApiError";
    this.code = code;
    this.status = status;
    this.detail = detail;
    this.errorDetail = errorDetail;
  }
};
var RateLimitedError = class extends RundotApiError {
  retryAfterMs;
  constructor(retryAfterMs, message) {
    super("RATE_LIMITED", message ?? `Rate limited. Retry after ${Math.ceil(retryAfterMs / 1e3)}s.`, 429);
    this.name = "RateLimitedError";
    this.retryAfterMs = retryAfterMs;
  }
};
var CREDITS_EXHAUSTED_CODE = "CREDITS_EXHAUSTED";
var CreditsExhaustedError = class extends Error {
  code = CREDITS_EXHAUSTED_CODE;
  billedTo;
  paywallShown;
  /** `null` when `paywallShown === false`. */
  paywallOutcome;
  constructor(message, info) {
    super(message);
    this.name = "CreditsExhaustedError";
    this.billedTo = info.billedTo;
    this.paywallShown = info.paywallShown;
    this.paywallOutcome = info.paywallOutcome;
  }
};
function asCreditsExhaustedError(err) {
  if (err instanceof CreditsExhaustedError) return err;
  if (err === null || typeof err !== "object") return null;
  if (err.code !== "CREDITS_EXHAUSTED") return null;
  let billedTo = "owner";
  let paywallShown = false;
  let paywallOutcome = null;
  const detail = err.detail;
  if (typeof detail === "string" && detail.length > 0) try {
    const parsed = JSON.parse(detail);
    if (parsed.billedTo === "owner" || parsed.billedTo === "player") billedTo = parsed.billedTo;
    if (typeof parsed.paywallShown === "boolean") paywallShown = parsed.paywallShown;
    if (parsed.paywallOutcome === "purchased" || parsed.paywallOutcome === "cancelled" || parsed.paywallOutcome === "pending" || parsed.paywallOutcome === null) paywallOutcome = parsed.paywallOutcome;
  } catch {
  }
  return new CreditsExhaustedError(err instanceof RundotApiError || err instanceof Error ? err.message : "Creator credits exhausted", {
    billedTo,
    paywallShown,
    paywallOutcome
  });
}
async function mapCreditsExhaustion(call) {
  try {
    return await call;
  } catch (err) {
    throw asCreditsExhaustedError(err) ?? err;
  }
}
var warned = /* @__PURE__ */ new Set();
function warnDeprecated(feature, message) {
  if (warned.has(feature)) return;
  warned.add(feature);
  console.warn(message ?? `[RUN] "${feature}" is deprecated and will be removed in a future release.`);
}
var MAX_IMAGE_GEN_SEED = 2147483647;
function assertValidImageGenSeed(seed) {
  if (seed === void 0) return;
  if (!Number.isInteger(seed) || seed < 0 || seed > 2147483647) throw new Error(`imageGen: seed must be an integer between 0 and ${MAX_IMAGE_GEN_SEED} (got ${seed})`);
}
function utf8ByteLength(s2) {
  let bytes = 0;
  for (let i = 0; i < s2.length; i++) {
    const code = s2.charCodeAt(i);
    if (code < 128) bytes += 1;
    else if (code < 2048) bytes += 2;
    else if (code >= 55296 && code <= 56319) {
      bytes += 4;
      i++;
    } else bytes += 3;
  }
  return bytes;
}
var HASH_ALGORITHM_WEB_CRYPTO = "SHA-256";
async function computeScoreHash(score, duration, token, sealingNonce, sealingSecret) {
  const fullPayload = `${`score:${score}|duration:${duration}|token:${token}`}|nonce:${sealingNonce}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(sealingSecret);
  const messageData = encoder.encode(fullPayload);
  const cryptoKey = await crypto.subtle.importKey("raw", keyData, {
    name: "HMAC",
    hash: HASH_ALGORITHM_WEB_CRYPTO
  }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function mapSubmitScoreFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/token does not belong to profile/i.test(message)) return {
    accepted: false,
    failureReason: "identity_changed",
    reason: message
  };
  if (/could not be verified|replay verification failed/i.test(message)) return {
    accepted: false,
    failureReason: "replay_rejected",
    reason: message
  };
}
var REPLAY_INLINE_MAX_BYTES = 4194304;
function assertReplayWithinInlineCap(replay) {
  const bytes = utf8ByteLength(JSON.stringify(replay));
  if (bytes > 4194304) throw new RundotApiError("PAYLOAD_TOO_LARGE", `Replay of ${bytes} bytes exceeds the inline submission cap of ${REPLAY_INLINE_MAX_BYTES} bytes. Shorten the run or contact support about oversize replay uploads.`, 413);
}

// node_modules/@series-inc/rundot-game-sdk/dist/ClipsApiImpl-mFIIqDe9.js
var MockDebug = { enabled: false };
function mockLog(tag, message, ...args) {
  if (MockDebug.enabled) console.log(`[${tag}] ${message}`, ...args);
}
var TAG$8 = "Mock Ads";
var MockAdsApi = class {
  mockOverlay;
  constructor(mockOverlay) {
    this.mockOverlay = mockOverlay;
  }
  async isRewardedAdReadyAsync() {
    mockLog(TAG$8, "isRewardedAdReadyAsync \u2192 true");
    await createMockDelay(MOCK_DELAYS.short);
    return true;
  }
  async isInterstitialAdReadyAsync() {
    mockLog(TAG$8, "isInterstitialAdReadyAsync \u2192 true");
    await createMockDelay(MOCK_DELAYS.short);
    return true;
  }
  async showRewardedAdAsync(options) {
    mockLog(TAG$8, "showRewardedAdAsync");
    await this.mockOverlay.showAdOverlay("rewarded", options);
    return true;
  }
  async showInterstitialAd(options) {
    mockLog(TAG$8, "showInterstitialAd");
    await this.mockOverlay.showAdOverlay("interstitial", options);
    return true;
  }
};
function toPromptWireRequest(request) {
  return {
    promptId: request.promptId,
    input: request.input
  };
}
function serializeCanvasInState(state) {
  if (state === null || state === void 0) return state;
  if (typeof HTMLCanvasElement !== "undefined" && state instanceof HTMLCanvasElement) return state.toDataURL("image/jpeg", 0.85);
  if (Array.isArray(state)) return state.map((item) => serializeCanvasInState(item));
  if (typeof state === "object") {
    const result = {};
    for (const [key, value] of Object.entries(state)) result[key] = serializeCanvasInState(value);
    return result;
  }
  return state;
}
var DEFAULT_ASSET_LIBRARY_BASE_URL = "https://storage.googleapis.com/run-asset-library";
function defaultPackBaseUrl(packId, version) {
  return `${DEFAULT_ASSET_LIBRARY_BASE_URL}/packs/${packId}@${version}`;
}
var MockAssetLibraryApi = class {
  rundotGameApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  async getPackBaseUrl(packId, version) {
    return defaultPackBaseUrl(packId, version);
  }
  async loadAssetsBundle(game, bundleKey, fileType = "stow") {
    return await (await this.rundotGameApi.cdn.fetchFromCdn(`${game}/${bundleKey}.${fileType}`)).arrayBuffer();
  }
};
var MockAnalyticsApi = class {
  async recordCustomEvent(eventName, payload) {
    await createMockDelay(MOCK_DELAYS.short);
  }
  async trackFunnelStep(stepNumber, stepName, funnelName, funnelOrder) {
    await createMockDelay(MOCK_DELAYS.short);
  }
};
var MockAvatarApi = class {
  _rundotGameApi;
  cachedAssets = null;
  cachedVersion = "";
  constructor(rundotGameApi) {
    this._rundotGameApi = rundotGameApi;
  }
  downloadAssetPaths() {
    return this.getAllAssetPaths();
  }
  async deleteAvatar() {
    const profileId = this._rundotGameApi.getProfile()?.id || "default_profile";
    localStorage.removeItem(`rundot-game-mock-avatar3d-${profileId}`);
  }
  async loadAvatar(avatar3dId) {
    const rundotGameApi = this._rundotGameApi;
    let config;
    if (avatar3dId) config = await this.selectAvatarConfig(avatar3dId, false);
    else {
      const profileId = rundotGameApi.getProfile()?.id || "default_profile";
      if (profileId === "default_profile") config = await this.selectAvatarConfig(null, true);
      else config = await this.selectAvatarConfig(profileId, false);
    }
    return config || null;
  }
  async saveAvatar(config) {
    const profileId = this._rundotGameApi.getProfile()?.id || "default_profile";
    localStorage.setItem(`rundot-game-mock-avatar3d-${profileId}`, JSON.stringify(config));
    return `mock_avatar3d_${profileId}_${Date.now()}`;
  }
  downloadManifest() {
    return this.loadAssetsManifest();
  }
  async showEditor(options) {
    if (window.RundotGamePrototyping) return new Promise((resolve) => {
      window.RundotGamePrototyping.showAvatarEditorOverlay(options, resolve);
    });
    await createMockDelay(MOCK_DELAYS.medium);
    const mockAvatarConfig = await this.selectAvatarConfig(null, false);
    if (Math.random() > 0.3) return {
      wasChanged: true,
      config: mockAvatarConfig,
      savedAvatarId: `mock_avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    else return {
      wasChanged: false,
      config: null,
      savedAvatarId: null
    };
  }
  async getAssets() {
    let cachedAssets = this.cachedAssets;
    if (!cachedAssets) cachedAssets = (await this.loadAssetsManifest()).categories;
    return cachedAssets;
  }
  async loadAssetsManifest() {
    const baseManifestUrl = this._rundotGameApi.cdn.resolveAvatarAssetUrl("assets.json");
    const manifestUrl = `${baseManifestUrl}${baseManifestUrl.includes("?") ? "&" : "?"}v=${Date.now()}`;
    try {
      const response = await fetch(manifestUrl, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        mode: "cors",
        cache: "no-cache"
      });
      if (!response.ok) throw new Error(`Failed to fetch assets manifest: ${response.status} ${response.statusText}`);
      const manifest = await response.json();
      this.cachedAssets = manifest.categories || {};
      this.cachedVersion = manifest.version;
      return manifest;
    } catch (error) {
      console.error("[RUN:mock] Failed to load assets manifest:", error);
      console.warn("[RUN:mock] Using fallback minimal manifest for development");
      const fallbackManifest = {
        version: "dev-fallback",
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        categories: {
          head: {
            type: "mesh",
            assets: [{
              id: "head_default",
              filename: "head_default.glb",
              displayName: "Default Head"
            }, {
              id: "head_variant1",
              filename: "head_variant1.glb",
              displayName: "Head Variant 1"
            }]
          },
          outfit: {
            type: "mesh",
            assets: [{
              id: "outfit_default",
              filename: "outfit_default.glb",
              displayName: "Default Outfit"
            }, {
              id: "outfit_casual",
              filename: "outfit_casual.glb",
              displayName: "Casual Outfit"
            }]
          },
          hat: {
            type: "mesh",
            assets: [{
              id: "hat_none",
              filename: "hat_none.glb",
              displayName: "No Hat"
            }, {
              id: "hat_cap",
              filename: "hat_cap.glb",
              displayName: "Baseball Cap"
            }]
          },
          hair: {
            type: "mesh",
            assets: [{
              id: "hair_default",
              filename: "hair_default.glb",
              displayName: "Default Hair"
            }, {
              id: "hair_long",
              filename: "hair_long.glb",
              displayName: "Long Hair"
            }]
          },
          "face-accessory": {
            type: "mesh",
            assets: [{
              id: "glasses_none",
              filename: "glasses_none.glb",
              displayName: "No Glasses"
            }, {
              id: "glasses_regular",
              filename: "glasses_regular.glb",
              displayName: "Regular Glasses"
            }]
          },
          animation: {
            type: "mesh",
            assets: [{
              id: "idle_default",
              filename: "idle_default.glb",
              displayName: "Default Idle"
            }, {
              id: "wave",
              filename: "wave.glb",
              displayName: "Wave Animation"
            }]
          }
        }
      };
      this.cachedAssets = fallbackManifest.categories;
      this.cachedVersion = fallbackManifest.version;
      return fallbackManifest;
    }
  }
  async selectAvatarConfig(avatarId = null, useDefaults = false) {
    const categories = await this.getAssets();
    const rng = avatarId ? this.seededRandom(avatarId) : () => Math.random();
    const headAsset = this.selectAsset(categories, "head", rng, avatarId, useDefaults);
    const outfitAsset = this.selectAsset(categories, "outfit", rng, avatarId, useDefaults);
    const hatAsset = this.selectAsset(categories, "hat", rng, avatarId, useDefaults);
    const hairAsset = this.selectAsset(categories, "hair", rng, avatarId, useDefaults);
    const faceAccessoryAsset = this.selectAsset(categories, "face-accessory", rng, avatarId, useDefaults);
    const animationAsset = this.selectAsset(categories, "animation", rng, avatarId, useDefaults);
    return {
      headAsset: headAsset.filename,
      outfitAsset: outfitAsset.filename,
      animationAsset: animationAsset.filename,
      faceAccessoryAsset: faceAccessoryAsset.filename,
      hairAsset: hairAsset.filename,
      hatAsset: hatAsset.filename,
      skinColor: null
    };
  }
  selectAsset(manifest, categoryId, rng, avatarId, useDefaults = false) {
    const categoryAssets = manifest[categoryId].assets;
    if (useDefaults) return categoryAssets[0];
    if (avatarId) return categoryAssets[Math.floor(rng() * categoryAssets.length)];
    return categoryAssets[0];
  }
  seededRandom(seed) {
    let state = this.simpleHash(seed);
    return function() {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  }
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  async getAllAssetPaths() {
    const rundotGameApi = this._rundotGameApi;
    const assets = await this.getAssets();
    const allPaths = {};
    for (const [category, categoryData] of Object.entries(assets)) allPaths[category] = (categoryData?.assets || []).map((asset) => rundotGameApi.cdn.resolveAvatarAssetUrl(`${category}/${asset.filename}`));
    return allPaths;
  }
};
var BaseCdnApi = class BaseCdnApi2 {
  static AVATAR_ASSETS_PREFIX = "avatar3d";
  static SHARED_LIBS_PREFIX = "libs";
  /**
  * Remove leading slash from subPath
  */
  cleanSubPath(subPath) {
    return subPath.startsWith("/") ? subPath.slice(1) : subPath;
  }
  /**
  * Encode path parts - only encode the filename (last part) to preserve directory structure
  */
  encodePathParts(subPath) {
    const pathParts = subPath.split("/");
    return pathParts.map((part, index) => {
      return index === pathParts.length - 1 ? encodeURIComponent(part) : part;
    }).join("/");
  }
  /**
  * Check if subPath is already a full URL
  */
  isFullUrl(subPath) {
    return subPath.startsWith("http://") || subPath.startsWith("https://");
  }
  /**
  * Normalize base URL to not end with trailing slash
  */
  normalizeBaseUrl(url) {
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }
  /**
  * Build full URL with encoding
  */
  buildCdnUrl(subPath, baseUrl) {
    const cleanSubPath = this.cleanSubPath(subPath);
    return `${baseUrl}/${this.encodePathParts(cleanSubPath)}`;
  }
  /**
  * Execute a fetch request with timeout handling
  */
  async executeFetch(url, options) {
    const controller = new AbortController();
    const timeoutMs = options?.timeout ?? 3e4;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        mode: "cors",
        credentials: "omit",
        headers: { Accept: "*/*" },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.blob();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  getAssetCdnBaseUrl() {
    return this.getCdnAssetsBaseUrl();
  }
  async resolveAssetUrl(subPath) {
    return this.buildCdnUrl(subPath, this.getCdnAssetsBaseUrl());
  }
  /** @deprecated 3D Avatar system is deprecated */
  resolveAvatarAssetUrl(subPath) {
    if (this.isFullUrl(subPath)) return subPath;
    return this.buildCdnUrl(`${BaseCdnApi2.AVATAR_ASSETS_PREFIX}/${subPath}`, this.getSharedAssetsCdnBaseUrl());
  }
  resolveSharedLibUrl(subPath) {
    if (this.isFullUrl(subPath)) return subPath;
    return this.buildCdnUrl(`${BaseCdnApi2.SHARED_LIBS_PREFIX}/${subPath}`, this.getSharedAssetsCdnBaseUrl());
  }
  async resolveAssetUrls(subPaths) {
    return await Promise.all(subPaths.map(async (p) => {
      try {
        return {
          path: p,
          status: "ok",
          url: await this.resolveAssetUrl(p)
        };
      } catch {
        return {
          path: p,
          status: "error",
          error: "ASSET_NOT_FOUND"
        };
      }
    }));
  }
  async refreshEntitlements() {
  }
};
var MockCdnApi = class MockCdnApi2 extends BaseCdnApi {
  static LEGACY_CDN_PREFIX = "cdn/";
  static SHARED_ASSETS_CDN_BASE = "https://venus-static-01293ak.web.app";
  rundotGameApi;
  constructor(rundotGameApi) {
    super();
    this.rundotGameApi = rundotGameApi;
  }
  getCdnAssetsBaseUrl() {
    return "cdn-assets";
  }
  getCdnBaseUrl() {
    return MockCdnApi2.SHARED_ASSETS_CDN_BASE;
  }
  getSharedAssetsCdnBaseUrl() {
    return "";
  }
  async resolveAssetUrl(subPath) {
    if (this.isFullUrl(subPath)) return subPath;
    if (subPath.startsWith(MockCdnApi2.LEGACY_CDN_PREFIX)) return subPath;
    return this.buildCdnUrl(subPath, this.getCdnAssetsBaseUrl());
  }
  /**
  * Fetch an asset directly from the bucket root (public folder root in mock mode).
  * This mimics production behavior where cross-game assets are at the bucket root.
  *
  * @param subPath - The path relative to public folder root (e.g., "othergame/bundle.stow")
  * @param options - Optional fetch options including timeout
  * @returns Promise<Blob> - The asset data as a Blob
  *
  * @example
  * // In mock mode with public folder structure:
  * // fetchFromCdn("othergame/bundle.stow")
  * // → othergame/bundle.stow (from public root, not public/cdn-assets)
  */
  async fetchFromCdn(subPath, options) {
    const cleanSubPath = subPath.startsWith("/") ? subPath.slice(1) : subPath;
    const encodedSubPath = this.encodePathParts(cleanSubPath);
    return this.executeFetch(encodedSubPath, options);
  }
  /**
  * Fetch an asset in mock/development mode.
  * In development, assets are served directly without manifest transformation,
  * so this method fetches from the cdn-assets folder.
  *
  * @param relativePath - The path to the asset (e.g., "/some/asset.png" or "some/asset.png")
  * @param options - Optional fetch options including timeout
  * @returns Promise<Blob> - The asset data as a Blob
  */
  async fetchAsset(relativePath, options) {
    const fullPath = `cdn-assets/${relativePath.startsWith("/") ? relativePath.slice(1) : relativePath}`;
    return this.fetchFromCdn(fullPath, options);
  }
};
var MockDeviceApi = class {
  rundotGameApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  getDevice() {
    const width = typeof window !== "undefined" ? window.innerWidth : 400;
    const height = typeof window !== "undefined" ? window.innerHeight : 800;
    const device = {
      screenSize: {
        width,
        height
      },
      viewportSize: {
        width: width - 20,
        height: height - 20
      },
      orientation: width > height ? "landscape" : "portrait",
      pixelRatio: typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      fontScale: 1,
      deviceType: Math.min(width, height) >= 600 ? "tablet" : "phone",
      hapticsEnabled: false,
      haptics: {
        supported: false,
        enabled: false
      }
    };
    this.rundotGameApi._deviceData = device;
    if (this.rundotGameApi._mock) this.rundotGameApi._mock.device = device;
    return device;
  }
};
var MockEnvironmentApi = class {
  rundotGameApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  getEnvironment() {
    const getBrowser = () => {
      if (typeof navigator === "undefined") return "unknown";
      const userAgent = navigator.userAgent;
      if (/chrome|chromium|crios/i.test(userAgent)) return "chrome";
      if (/firefox|fxios/i.test(userAgent)) return "firefox";
      if (/safari/i.test(userAgent)) return "safari";
      if (/edg/i.test(userAgent)) return "edge";
      if (/opera|opr/i.test(userAgent)) return "opera";
      return "unknown";
    };
    return {
      isDevelopment: true,
      platform: "web",
      platformVersion: "mock-1.0",
      browserInfo: {
        browser: getBrowser(),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "mock-agent",
        isMobile: typeof navigator !== "undefined" ? /Mobi|Android/i.test(navigator.userAgent) : false,
        isTablet: typeof navigator !== "undefined" ? /iPad|Tablet|Pad/i.test(navigator.userAgent) : false,
        language: typeof navigator !== "undefined" ? navigator.language || "en-US" : "en-US"
      },
      capabilities: {
        ads: true,
        purchases: true,
        subscriptions: true,
        fullscreen: "unavailable",
        pointerLock: false,
        cta: false,
        persistence: "cloud",
        online: true
      },
      isSteamDesktop: false,
      isSteamDeck: false,
      executionMode: "full"
    };
  }
};
var MockSystemApi = class {
  deviceApi;
  environmentApi;
  rundotGameAPI;
  constructor(deviceApi, environmentApi, rundotGameApi) {
    this.deviceApi = deviceApi;
    this.environmentApi = environmentApi;
    this.rundotGameAPI = rundotGameApi;
  }
  getDevice() {
    return this.deviceApi.getDevice();
  }
  getEnvironment() {
    return this.environmentApi.getEnvironment();
  }
  getSafeArea() {
    const safeArea = this.rundotGameAPI._safeAreaData;
    if (!safeArea) return {
      top: 0,
      right: 0,
      bottom: 34,
      left: 0
    };
    return { ...safeArea };
  }
  isMobile() {
    const environment = this.environmentApi.getEnvironment();
    if (environment.platform === "ios" || environment.platform === "android") return true;
    if (environment.browserInfo) return environment.browserInfo.isMobile;
    return true;
  }
  isWeb() {
    const environment = this.environmentApi.getEnvironment();
    if (environment.platform === "web") return true;
    if (environment.browserInfo && !environment.browserInfo.isMobile) return true;
    return false;
  }
  isSteamDesktop() {
    return this.environmentApi.getEnvironment().isSteamDesktop;
  }
  isSteamDeck() {
    return this.environmentApi.getEnvironment().isSteamDeck;
  }
  async canAddToHomeScreen() {
    return false;
  }
  async addToHomeScreen() {
    return { added: false };
  }
  async requestFullscreen(_options = {}) {
    return {
      active: false,
      pointerLocked: false
    };
  }
  async exitFullscreen() {
    return {
      active: false,
      pointerLocked: false
    };
  }
  async setPointerLock(_locked) {
    return {
      active: false,
      pointerLocked: false,
      reason: "unsupported"
    };
  }
  canFullscreen() {
    return this.getEnvironment().capabilities?.fullscreen === "toggleable";
  }
  async getFullscreenState() {
    return {
      active: false,
      pointerLocked: false
    };
  }
  onFullscreenStateChange(_listener) {
    return () => {
    };
  }
  onPointerInput(_listener) {
    return () => {
    };
  }
};
function sanitizeSafeArea(raw) {
  return {
    top: typeof raw?.top === "number" && Number.isFinite(raw.top) && raw.top >= 0 ? raw.top : 0,
    right: typeof raw?.right === "number" && Number.isFinite(raw.right) && raw.right >= 0 ? raw.right : 0,
    bottom: typeof raw?.bottom === "number" && Number.isFinite(raw.bottom) && raw.bottom >= 0 ? raw.bottom : 0,
    left: typeof raw?.left === "number" && Number.isFinite(raw.left) && raw.left >= 0 ? raw.left : 0
  };
}
function applySafeAreaCssVariables(safeArea) {
  if (typeof document !== "undefined" && document.documentElement?.style) {
    const style = document.documentElement.style;
    style.setProperty("--rundot-safe-area-top", `${safeArea.top}px`);
    style.setProperty("--rundot-safe-area-right", `${safeArea.right}px`);
    style.setProperty("--rundot-safe-area-bottom", `${safeArea.bottom}px`);
    style.setProperty("--rundot-safe-area-left", `${safeArea.left}px`);
  }
}
function applySafeAreaUpdate(rundotGameApi, raw) {
  const safeArea = sanitizeSafeArea(raw);
  rundotGameApi._safeAreaData = safeArea;
  applySafeAreaCssVariables(safeArea);
  return safeArea;
}
var MockFeaturesApi = class {
  async getExperiment(experimentName) {
    return null;
  }
  async getFeatureFlag(flagName) {
    return Promise.resolve(false);
  }
  getFeatureGate(gateName) {
    return Promise.resolve(false);
  }
};
function windowContains(window2, nowMs3) {
  if (window2.activeAt !== void 0) {
    const start = Date.parse(window2.activeAt);
    if (Number.isNaN(start) || nowMs3 < start) return false;
  }
  if (window2.expiresAt !== void 0) {
    const end = Date.parse(window2.expiresAt);
    if (Number.isNaN(end) || nowMs3 >= end) return false;
  }
  return true;
}
function asArray(value) {
  return Array.isArray(value) ? value : [];
}
function hasUnparseableDate(window2) {
  return window2.activeAt !== void 0 && Number.isNaN(Date.parse(window2.activeAt)) || window2.expiresAt !== void 0 && Number.isNaN(Date.parse(window2.expiresAt));
}
function computeNextChangeAt(section, nowMs3) {
  let next = null;
  const windows = [...asArray(section?.overrides), ...asArray(section?.experiments)];
  for (const window2 of windows) for (const raw of [window2.activeAt, window2.expiresAt]) {
    if (raw === void 0) continue;
    const t = Date.parse(raw);
    if (Number.isNaN(t) || t <= nowMs3) continue;
    if (next === null || t < next) next = t;
  }
  return next;
}
function fnv1a32(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}
var BUCKET_COUNT = 1e4;
function assignmentBucket(seed, unitId) {
  return fnv1a32(String(fnv1a32(`${seed}:${unitId}`))) % BUCKET_COUNT;
}
function assignVariant(experiment, unitId) {
  const variants = Array.isArray(experiment.variants) ? experiment.variants : [];
  if (experiment.forceVariant !== void 0) {
    const forced = variants.find((v) => v.id === experiment.forceVariant);
    return forced ? {
      variant: forced,
      totalWeight: 0
    } : null;
  }
  if (variants.length < 2) return null;
  let total = 0;
  for (const v of variants) {
    if (typeof v.weight !== "number" || !Number.isInteger(v.weight) || v.weight < 1) return null;
    total += v.weight;
  }
  if (total < 1 || total > 1e4) return null;
  const bucket = assignmentBucket(experiment.salt ?? experiment.id, unitId);
  let cumulative = 0;
  for (const v of variants) {
    cumulative += v.weight;
    if (bucket < Math.floor(1e4 * cumulative / total)) return {
      variant: v,
      totalWeight: total
    };
  }
  return null;
}
function resolveLiveOpsSection(section, nowMs3, unitId) {
  const values = { ...section?.values ?? {} };
  const activeOverrideIds = [];
  for (const override of asArray(section?.overrides)) {
    if (hasUnparseableDate(override) || !windowContains(override, nowMs3)) continue;
    Object.assign(values, override.values);
    activeOverrideIds.push(override.id);
  }
  const assignments = [];
  if (unitId !== void 0 && unitId !== "") for (const experiment of asArray(section?.experiments)) {
    if (hasUnparseableDate(experiment) || !windowContains(experiment, nowMs3)) continue;
    const assigned = assignVariant(experiment, unitId);
    if (assigned === null || typeof experiment.id !== "string" || experiment.id === "") continue;
    Object.assign(values, assigned.variant.values ?? {});
    assignments.push({
      experimentId: experiment.id,
      variantId: assigned.variant.id,
      variantWeight: assigned.variant.weight,
      totalWeight: assigned.totalWeight
    });
  }
  return {
    values,
    activeOverrideIds,
    assignments,
    nextChangeAt: computeNextChangeAt(section, nowMs3)
  };
}
var ExposureDeduper = class {
  onExposure;
  seen = /* @__PURE__ */ new Set();
  constructor(onExposure) {
    this.onExposure = onExposure;
  }
  record(unitId, assignments, configVersion) {
    if (!this.onExposure) return;
    for (const a of assignments) {
      const key = `${unitId} ${a.experimentId} ${a.variantId}`;
      if (this.seen.has(key)) continue;
      this.seen.add(key);
      try {
        this.onExposure(a, configVersion);
      } catch {
      }
    }
  }
};
var DEFAULT_MAX_AGE_MS = 6e4;
var LiveOpsCache = class {
  fetchRaw;
  hooks;
  entry = null;
  deduper;
  constructor(fetchRaw, hooks) {
    this.fetchRaw = fetchRaw;
    this.hooks = hooks;
    this.deduper = new ExposureDeduper(hooks?.onExposure);
  }
  clear() {
    this.entry = null;
  }
  async ensureFresh(maxAgeMs) {
    const now = Date.now();
    if (this.entry && maxAgeMs > 0 && now - this.entry.fetchedAtLocalMs < maxAgeMs) return this.entry;
    const raw = await this.fetchRaw();
    this.entry = {
      raw,
      fetchedAtLocalMs: Date.now()
    };
    return this.entry;
  }
  /** server-anchored now: server clock at fetch + elapsed local time since. */
  effectiveNow(entry) {
    return entry.raw.serverTimeMs + (Date.now() - entry.fetchedAtLocalMs);
  }
  async getConfig(maxAgeMs = DEFAULT_MAX_AGE_MS) {
    const entry = await this.ensureFresh(maxAgeMs);
    const unitId = this.hooks?.getUnitId?.();
    const resolved = resolveLiveOpsSection(entry.raw.client ?? void 0, this.effectiveNow(entry), unitId);
    if (unitId !== void 0) this.deduper.record(unitId, resolved.assignments, entry.raw.configVersion);
    return {
      ...resolved,
      configVersion: entry.raw.configVersion
    };
  }
  async getRaw(maxAgeMs = DEFAULT_MAX_AGE_MS) {
    const entry = await this.ensureFresh(maxAgeMs);
    return {
      values: entry.raw.client?.values ?? {},
      overrides: entry.raw.client?.overrides ?? [],
      experiments: entry.raw.client?.experiments ?? [],
      configVersion: entry.raw.configVersion,
      serverTimeMs: entry.raw.serverTimeMs
    };
  }
};
var MockHapticsApi = class {
  rundotGameApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  async triggerHapticAsync(style) {
    if (!this.rundotGameApi._mock.device.supportsHaptics) return;
  }
};
var GAMEPAD_BUTTON_NAMES = [
  "a",
  "b",
  "x",
  "y",
  "leftBumper",
  "rightBumper",
  "leftTrigger",
  "rightTrigger",
  "select",
  "start",
  "guide",
  "leftStick",
  "rightStick",
  "dpadUp",
  "dpadDown",
  "dpadLeft",
  "dpadRight"
];
var STANDARD_BUTTON_ORDER = [
  "a",
  "b",
  "x",
  "y",
  "leftBumper",
  "rightBumper",
  "leftTrigger",
  "rightTrigger",
  "select",
  "start",
  "leftStick",
  "rightStick",
  "dpadUp",
  "dpadDown",
  "dpadLeft",
  "dpadRight",
  "guide"
];
function nowMs() {
  return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}
function finiteOr(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function emptyButtons() {
  const buttons = {};
  for (const name of GAMEPAD_BUTTON_NAMES) buttons[name] = {
    pressed: false,
    value: 0
  };
  return buttons;
}
function canReadWebGamepads() {
  if (typeof navigator === "undefined" || typeof navigator.getGamepads !== "function") return false;
  try {
    navigator.getGamepads();
    return true;
  } catch {
    return false;
  }
}
function normalizeStandardGamepad(pad, sampledAt) {
  const buttons = emptyButtons();
  const padButtons = pad.buttons ?? [];
  STANDARD_BUTTON_ORDER.forEach((name, index) => {
    if (name === null) return;
    const button = padButtons[index];
    if (!button) return;
    const pressed = Boolean(button.pressed);
    buttons[name] = {
      pressed,
      value: clamp(finiteOr(button.value, pressed ? 1 : 0), 0, 1)
    };
  });
  const padAxes = pad.axes ?? [];
  const axes = {
    leftX: clamp(finiteOr(padAxes[0], 0), -1, 1),
    leftY: clamp(finiteOr(padAxes[1], 0), -1, 1),
    rightX: clamp(finiteOr(padAxes[2], 0), -1, 1),
    rightY: clamp(finiteOr(padAxes[3], 0), -1, 1)
  };
  return {
    index: pad.index,
    id: typeof pad.id === "string" ? pad.id : "",
    connected: pad.connected !== false,
    source: "web-gamepad",
    standardMapping: pad.mapping === "standard",
    buttons,
    axes,
    sourceTimestamp: sampledAt,
    deliveredTimestamp: sampledAt
  };
}
var WebGamepadReader = class {
  rafId = null;
  connectedListener = null;
  disconnectedListener = null;
  started = false;
  read() {
    if (typeof navigator === "undefined" || typeof navigator.getGamepads !== "function") return [];
    let pads;
    try {
      pads = navigator.getGamepads();
    } catch {
      return [];
    }
    const sampledAt = nowMs();
    const snapshots = [];
    for (const pad of pads) {
      if (!pad || pad.connected === false) continue;
      snapshots.push(normalizeStandardGamepad(pad, sampledAt));
    }
    return snapshots;
  }
  start(onSnapshot, onConnected, onDisconnected) {
    if (this.started) this.stop();
    this.started = true;
    this.connectedListener = (event) => {
      onConnected(toConnectionEvent(event.gamepad));
    };
    this.disconnectedListener = (event) => {
      onDisconnected(toConnectionEvent(event.gamepad));
    };
    window.addEventListener("gamepadconnected", this.connectedListener);
    window.addEventListener("gamepaddisconnected", this.disconnectedListener);
    for (const snapshot of this.read()) onConnected({
      index: snapshot.index,
      id: snapshot.id,
      source: snapshot.source
    });
    const loop = () => {
      for (const snapshot of this.read()) onSnapshot(snapshot);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.connectedListener) {
      window.removeEventListener("gamepadconnected", this.connectedListener);
      this.connectedListener = null;
    }
    if (this.disconnectedListener) {
      window.removeEventListener("gamepaddisconnected", this.disconnectedListener);
      this.disconnectedListener = null;
    }
    this.started = false;
  }
};
function toConnectionEvent(pad) {
  return {
    index: pad.index,
    id: typeof pad.id === "string" ? pad.id : "",
    source: "web-gamepad"
  };
}
var EMPTY_STATS = {
  p50: 0,
  p95: 0,
  max: 0,
  sampleCount: 0
};
var LatencyTracker = class {
  opts;
  samples = [];
  constructor(opts) {
    this.opts = opts;
  }
  add(sourceTimestamp, deliveredTimestamp) {
    if (!this.opts.enabled) return;
    this.samples.push(deliveredTimestamp - sourceTimestamp);
    if (this.samples.length > this.opts.windowSize) this.samples.shift();
  }
  getStats() {
    if (this.samples.length === 0) return { ...EMPTY_STATS };
    const sorted = [...this.samples].sort((a, b) => a - b);
    const pct = (p) => sorted[Math.min(sorted.length - 1, Math.ceil(p / 100 * sorted.length) - 1)];
    return {
      p50: pct(50),
      p95: pct(95),
      max: sorted[sorted.length - 1],
      sampleCount: sorted.length
    };
  }
};
var MockGamepadApi = class {
  reader = new WebGamepadReader();
  latency = new LatencyTracker({
    windowSize: 120,
    enabled: false
  });
  connectedSubscribers = /* @__PURE__ */ new Set();
  disconnectedSubscribers = /* @__PURE__ */ new Set();
  started = false;
  /** No handshake on the local/mock tier — capability is known synchronously. */
  ready() {
    return Promise.resolve();
  }
  isSupported() {
    return typeof navigator !== "undefined" && typeof navigator.getGamepads === "function";
  }
  getGamepads() {
    return this.isSupported() ? this.reader.read() : [];
  }
  onConnected(callback) {
    this.ensureStarted();
    this.connectedSubscribers.add(callback);
    return { unsubscribe: () => this.connectedSubscribers.delete(callback) };
  }
  onDisconnected(callback) {
    this.ensureStarted();
    this.disconnectedSubscribers.add(callback);
    return { unsubscribe: () => this.disconnectedSubscribers.delete(callback) };
  }
  __debug = { getLatencyStats: () => this.latency.getStats() };
  ensureStarted() {
    if (this.started || !this.isSupported()) return;
    this.started = true;
    this.reader.start(() => {
    }, (event) => {
      for (const callback of [...this.connectedSubscribers]) callback(event);
    }, (event) => {
      for (const callback of [...this.disconnectedSubscribers]) callback(event);
    });
  }
};
var TIER_SUPPORTED_INTERVALS = {
  LITE: ["weekly"],
  CORE: [
    "weekly",
    "monthly",
    "annual"
  ],
  PLUS: [
    "weekly",
    "monthly",
    "annual"
  ],
  PRIME: [
    "weekly",
    "monthly",
    "annual"
  ],
  ULTIMATE: [
    "weekly",
    "monthly",
    "annual"
  ]
};
function assertTierSupportsInterval(tier, interval) {
  const supported = TIER_SUPPORTED_INTERVALS[tier];
  if (!supported?.includes(interval)) throw new RundotApiError("UNSUPPORTED_SUBSCRIPTION_INTERVAL", `The ${tier} subscription tier does not offer a ${interval} interval. Available interval(s): ${supported?.join(", ") || "none"}.`);
}
var mockCurrencyIconBase64 = "iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAFiVAABYlQHZbTfTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAMP1JREFUeAHtfXt0XdV557evLT/0sIRlA+YpMBZ+YGzZNLEJARuSFBooDoEkJckATdJMJpmSTNaaP2bNjE2YmTVrdVZp15pH0k5LMu00TYYMJAta0jbBSRsgFJCNjQHHBEEKNuCHbMlv++zuvc9+fN8+R9K9up8sXWn/4PronHvueX6v3/d9+xyAhISEhISEhISEhISEhISEhISEhISEhITJCgEJY4pNHb0d007BSnkaVoIQKySoqYQO9VVXtGqfuhl9atoPIH8ipsGW/zDYsxkSxhRJAcYAWugrx+FudXlvNQIPRuBHBXWDNkNFfitrgkc29ff0QwIrkgIwYtOs3q5plcpdmZRfhjqEfgj0CwGPZJm8b9Oxnj5IYEFSAAbkFr+yUYIR/DGHUoRvJkXgQVKAOnH/7K33ZiA3Ab/FHwl9oiLv+4+He74JCaNGUoBRIrf64kEV42+AcUTyBvUhKcAooGN9IcQTUMzkjBf6pJTrkxLUjgok1IRNTb0rJ5jwaxiF3NTSuxISakLyADXAWv5eOPPxfrXolxXlCQ73bIGEqpA8QJVAYc9EFX6NDpGJh/WxQkJVSB6gCmjCK44by98FjQABW+QM5QlS4WxEJA9QBXSOHxpF+DUkrLTHnDACkgcYASqcuFuFPg9CA8JmhjZDwpBIHmAEKOFvWEuqFVeHb5AwJJICDIP7m7c2VuhTRJc4AWekPaNRkUKgIWCzPq9B46NfhUI9qUhWjumQUIpKRWyUElgx+8ImuOBj7dC5ttn8rT8apw5lcGj7Mdjzw0F4+/EBOPqrk8CIjkrOYdZDQgHJA5SAm/g2K0G/8oEFMFcJvoewlx5rmcj/efM7/bDz9/eyKkIixOVIClCC+2Zv0aFPFzCg63NzYdG/mQdN7ZZuaXnXwu8EX7hl+YyZ1d+pP3ZsfAf6/ng/MKFPzlShUKoNEEyDBAJNfLk6PBd9dR4s/nfzYdosLdYiF3SEXBciGyTCdP66FjPd/9QRYICqEsPxzSe/sRkSPJIHQOAkvhd8vB2u/P0F5dbewX3nvQDyAH4dgK1f3g1vfvcgMCAR4ggpDYqgiS8wQJNbHfYQ8yKsF/Dz4BVDQOADefgjAkdQWHrfOTB9DsutcoQ4wSIpgIUmvkr27gYGdH91fp7h0fLtBDqfIYLt5b6wBbqkqX2aUQIOqC2v29TcO66DeCYSkgKAbXYTfNb/fJXqNDBGH0m5tH94b+CUQdJ1zSKnBHmYdMHHO2Du1c3AASHFA6lCnCMpgMK0E5V7gSnrs+ahi+xfIngAF+djqGV+kVcONG82IYIHUdOlm3i8AKQKsceUVwBNfDNpBrXXDU18Z184g+b2CwikuLAWjv8dRxB2TTWdc8VMk1ZlgRQb07iBpACgSOEDwICc+M7PZxDB9cLslmNYgRduHSfsgIkxBE1RU02umQgxJEI8xRXAEF+mnH+3yvk3m9YGW9USYZILsJNwlBK1oY3J/JB1QjHMw/6sSQn/oq/OBw4kQjyF6wCco7y09V//9MJCzO6h5qWL+YlQI+8gg+IIow/SeAE3NYqCfvr0HW9wFcimdIV4ynoAXuJ7cf5HJPT+T0BRkBb6DMxHaKXQP8nyqZnP8u0YJcjsvJpKvX6WK4eedn95HjBhShPiKakArMRXpTxnX4CaapFA+/jdzItc+GOCnFmlMAKfrxsUJGzDh1JZPu1c0wxdnzkLWDCFCfGUVAAu4tvsKr6SCis4622EPsxLK9zCfoKQy8I2/N8ZnQr3nfYC9yZCXC+mnAJwEt9FX1HE9/wmK5QihCiSCrYXXACiJEYxXNiTQUH43Tbo1H6n/pnRWoHL702EuB5MKRLMSXybL1DE98mFYYHlsDjJM1Q5gFx0iVYWlh8Iu1ALvUBZIf974ef190/e+QbsezoR4tFgSnkAVuL7lxf5UAQQOcUhiiG/En8C6TUf5yXM32rt09JaeuG/N6HTaRlCIMsTtBK4bV3+pU5gwpQjxFNGATiJ74W3txsP4Ft49EIU7lDBxh+wLRD5f44cO6Kcb08EbpCF0EnIiGeclp4bdL6nGS69KxHi0WDKKAAb8VWC3/2784IVz5AFd0KeyWIsn+GPtCQZSGwfFEmGecwPEE8A9x3k893/OhHi0WBKKABrxfd3O2H2+TbtiTI1wmd4aPYHT0l4hBTCrx+nP5GAx5khEYVdmhAv/iJPbWAqEeJJT4K5ie/1my+lXZxoUBcBJsCCzlMSS39fMkY+VIkLK9ARZHruZ3e9AXufOQoMmBKEeNJ7AE7iu/bPLyzk++OCVdknJseh8hv/XuZEGZBCmbAnEF66b1tbQPOX/yu+CvFUeL7opFYAVuJ7myK+5zUVC1SYrMZhTFwRlnkmCEo/aJuOV5zOFcKRaUudLTEWIaxyIZX6e95Vs+HST/MQYv3Sv8n+0o1J/WAsUREPk1BklNDFru4vdqIiFIQmNQdnwVEjnO//zOhB6AdhvfpnB+DQy8fh5EAGC65vgQs3tENTWwVQsEP2l58H2o4LhSSEtiO7aMkXOuFX3z8IJw9lUC8qmUkerIdJiknLATgfbrXyv5wLF91mhznibs9IuVz3ZrzMqItdfPTNk/Cze/4JjrxJH3qllWzdQxcbJfCQlCPgUZKAeUNY5Nf75Z8fgG2/9y5wQFTkPZP1bZSTMgSyjzfZCAzQgnnRhjl5OOOLUZJkaFxIkuf+ixkaHCK98j/3FYRfQy/b/l/fJVmivCPUTq3wl9UEfKbJZaLUygs/2WHCIQ7IbPKOIZ6UClARfMT36gcv9AInUeGKCDgiqDFH8CRVzR/5p5PwxiOHhtzXGyps2fvMkSDwjjP49CqgugPmDpJWlmWeWl38ebYKccdkJcSTTgG09ed6Y/uFyvK3nDedFqqc9ZcQkduh/3bzvf9+z4j7fPl/7QPcAIeFOifFUEq+fUOe35+E+atnw8I7EyEeDpNOAQzxZYDO+CxWZNJb42E6Nt06cdgifKUYDCnd++zI+Xm9zt5/POotf95TJEg3qe881fMkNRq8jfss+dxcyivqgCXEkwqTSgE08VUCwGKlFn6qA1oWNIU8vl7o8vQ27BAo9BAoBBGAwhO77OWvV/+Q2+c3vu1z/yT/7wfPSBJmFeoQEJY1qQrxks/yhEJqc+u+1qKu8STCpFEAVuKrrP/COztobE1y+lbK3LN/TGOabV/2zW3ghfONHxyCI29V/6hzve7LX99bLtxx0x3qEo1rAq4D9bLfUoR4VSLEZZg0CsBJfN+rH2qrIYEWn9wnsyGI7+DMBc2P50VdnEaYv1H7I853fbs/z+M7y48zSljY7XEa+BBNoka9fL2ln02EuAyTQgE4ie9FvzkHOrpnonhekhAErJAHLiAKFjn06gO8+n8P1mT9HXSB7NVvH0CZIEmzP1mYujECtJMUF+kUIe6ZBRd/uA04MJkI8aRQADbiq2L+Jb/TSbM7Za3IJDSRpJ/HFKJO509x0IK/SwvxKPHSH+/PlUeihW5fACQswmlZN6AGh0P6s+Le+YYTcGCyEOKGVwBO4nuZivubz51eiK+dYIdUKNgnOEAxM5Q5oqyI7x/V/3aXZ7/2dojxy8IgfJwAodkO8ONX8mlTsyLEn+F5tOJkIcQNrQCsxFdZ/4Wf6KACBiHWpqO0pLlwvnPTpSyRMB7ceRxef/QQ1Iu9zx+Ffc8dLWR3YuWDyNrnSgAFQt59ewd0LJoJHJgMhLihFYCT+K79bwuCBdcLvFCH2BoXp3xVuDC2Nxe0p/7tyEWvarHjT/YTS+9rAhD+zpvuoJA6FRJP82Nc8SW2lumGJ8QNqwCsxPfDc6D9spnEetJilwitEMjKShxnI4/x+mMDcGQ33xse3+09Cq//9UDhsSqe/KIeIKyIoWotkeIImL9iFnTdmAixRsMqACfxXfrZuSTPH6xtSG0SohtbYUC/yXKLzY0X/2SfSoueJtkffTDuiXMCcQDSrwQhjJOIMK/84rxEiKFBFYCT+OrUYMs50xGBBUJ2wU1j5UAfiZTjpT/dz2r9HY7sOQW/+G5/LtCEb9AQzYVpIuIHwWPkfze1VGDZXVx9QooQz+5tyMepNJwCsBLfc5X1v2cuFZQ47RlZ/niKY/Oju3MhHSv84iE9yEULuyAZoVi4fUZIFj/4mLtvU4R4IRMhBrGxEQlxwymAfZNjFzBg5b3zoCzlGXdZ5gImSTEqEGLb+6OW7/hTFaYMZjBW0Nve8j/eLdQBaPs0wFAP6xKRIuh1er4wtSvEDaUAhvgyvcnx4pva4LxrWpCQyEhQ4pZk8IQY8HIbcx9R1r9PEdWxRt/jA/DOliMlqVlajCMCbxVXoL+d8s6/UhHiDzES4lm966CB0FAKoEKfJ4ABmvwtM6EPMp0aI6Q69d8yUhQnVFv++144U3jxW3l1GQ+Y92lbJODSfwdEaemxA6z6/DzDCThQYQpPzxQaRgEM8WUKfRbd3q6IbxOQB1O53h+U8cHEOCbJmC9oq/zWPxyGM4V3tx6Fd7fg4pgopDvxw7ewsAvCCfKOoaZmAd0b2oEDssEIcUMoAC/xnQ5L75pbeJ4OrqaKmBMgJwGnocAXnEU+k3jm995B8b4sWHXhlQNI/QC/oSbUDwCu+ORZJhvGgUYixA2hAJzEt0flv0VJGCCsNRwy2xMVu9yy1/9GFb328Kc9R8Lht0/BzocPRhadHmMYlxx5NCg/x/d+meddA9BAhHjCKwAn8e36dUV8r26BuJoayGGJYKBQR0StyIeV4G8fB+vv8OKfHTBt0xB7LZuIKmR/cIVY/V+RQIjx2ctnwflreN5G3yiEeMIrABvx1YWffzG3aP1daIMFBAlF/MRmvH6ftv5vn3nr73DicAY7v38QRERuoUCO7fcQP7TXPqUawHePrvps55QixBNaATiJb/dHFfE9exrgR4m4+Ni3O0AxX47f6+U5gu71V2lPbYHHGzsfOQiH3zmFBB6gvLAnfSbIZLOwx0M8onX+dFh8y9QhxBNWATiJryZ3V3xqLsmWOIsnTzsrabNAKGde1vPjhGv7BBB+De0Ffv7Au4irIG8AxXQtFvbSIqD6LP+EIsRnTw1CPGEVgJP4LtMPi8X9MkjwCzE/QLkVRRmi/l0noO/vxr7oVS3e2XbMfHC79FBtHVAI+4C8iMN1mK750tQgxBNSATiJ7yUfbINLbmgD3CVZEHgsINGHjASzv/mH/8TT63/JDa1wxW/xGMftdvwwPg9MjLHFd0YA1zTcmAK3zjnLZsEF75n8hHhCKgAX8dVY9smzSDwvovAg7vsRUarTDXF0gvSasvw6BVkvdIihQw0db3OQzne2H4PXfjxQ8GR63mw9i0MhGc4NPYQLt1uvvnsuzJjkhHjCKQAn8dXFndazp1OBjy09yfDY2CB6wkIgj8rS/gVP7G/ibEU49TjdKz/O05a87Tv9pmGugoQ8eAFZIPg0I0aTAoYQz5sOl//GHODARCXEE0oB2ImvDi+ckMdTzwlEKUEsPgRXwLa/2M9m/S9d3+ozSt03z2EhnTob9PKjB4G0RCDuExN81w4RpsUXeqy4o8NkhjgwEQnxhFIATuJ7xSc6rNuXhbJ/zAMAeQgBodsT99LootdrPxoEDiz/eAflF+rY1jKN033lsUNwYrAoyPH5QsEz5NdHRm0e+rPmX07eMcQTRgFYia8il5cq4usIboj7BcTv5wqWH7wwYgvpUqDb/vJAnm+vE5pcXnpdG5BuTYWzl86Cs9V39UKnRbd99wAMXQ9AU3CpXyjnQna9c5fMgnOW1H9sABOPEE8YBeAkvst1TI1vuhcE1wcjvADE1lFmdKrXG9xzShFMHuu/Rr/KVKL3DGRB4K68gyc6ePmvDkH/ayf8duOsF95n8IpovAAKm9zfV3++c1IS4gmhAKzE15JLgxIriAeGE08QzeO2gu3f4SG+l65rNcQyZJfcfnNl0FZWr8OBZ//Pfig+3QIJNUSCbq6NNRCZ8G+8cd+1dKoK8a9zDZyZOIR43BWAk/jqjM/yj3UU8txCQqnAm6c6Z9KnCYvZHwm/fGLQfDhw5e0dhHOEbs0gqKs/zZN6fHuHKo7tOA64L0ggohusv12G+oRw/xC+fks+NMcoMAcmCiEedwXgJL6aXJoTQha2Erl18rclvPkoLwl0LG1OgnVqkQNa+LUVDS0XUGxVUJ+ZKi26+Eae1OOT39gbjADmO0iwybOD4rAxmp8xqwJXf25yjSEeVwXgJL46rXjJda1kGKD+G1tXb/EySvR8nAxAqqG/3DwIh9+tn/iaBjMt1JKGWFTYQli2+MY2Fi8wqI79pccHyrM/iAO5vqg4BIRIOTXOvVwR4sVcT5IYf0I8rgrASnzv6ECZnZKwx4UdNs4N9QAoCIdJeyrheeH/MVn/j3YYyy7iolvUruwUdsbsClz1SZ7i2Av/v99khsi1gTjTIwtcCE/jMPJ9n5kHM5oFcGC8CfG4KQAn8dXZExObZq70n9+ckNNHmZ+y7FB8wzNe63/pNS0o3nZkVABpvQBBim4Lr2llST2eOJLByz8coP0+hewYeAvvM0IxJ8rCsra502DJBydHhXhcFICV+CoBW357RyGcCKQWfBWUeIOs+PHWX+X7X3iIx/pf/Tvz/P5DalHQeBwdq4H1EiuYBqq/9DeHYHDvKdoegavhAP47mWEPlSujQKlSd42XqjpL67xpwIHxJMTjogCsxPejHaGHBRDBxDnuLHLnhZFe9PPC93iEf+H7W+Ccy2ei8AuCcAEUC3VI2PSHK97WXuBZ3S2aYWMgECeS3nNSTiTsNREQF9E0IX7fXY1fIT7jCsBKfK9thYXqIyIrKrykQZTalCHeRtYMewZt/V/9KU/ac8WGDqKAsbdxYQntxAQiaO/7bR4he+P5I/D2K8eDMmbI8tt9yTKvlFEOJdB0QfdMOLe7sQnxGVcATuK74rZ2IC0FGc32iKz4ECsSAgGN+yvqN5v/4F3gwEIV97d2Tgec+SnwDZSCFMRLhPm2zmmw4laeUGjrDw5CaVtE5KEICXbHF/3O1dKuuauzoQnxGVUAVuJ7W0eoqtrwwSDKdYfMhihkOfQzfnwooGZ3/XQADrx+AuqFjo1X3Ipfs0o/PvOCqq0mA2QLc+S5/zbe5hCyPa8cg1/1HoW4KOgF/XScAXLjBQBogUz6+krb3OmwdH3jEuIzpgDcxHfFR9q9gDuBIelOpwgA4Mr8cbjj8+92nRcePggc0BmS1rnTqDVFYY9EaUcSIuFqLIRj1GnRJTfwCNkz3z0Q0qL4Wkn7kF8piXcyx4RqK3RcdT5dpmowrZ2NSYjPmAJwEt8rN7QH4dKIrL1TikLjl11PSigMCdz6SH+eKakT2vovvWFOMZRAykdDHUGUsRAy2XPpuaWdRcgG952CHT86FLJiGRJsu2/phRtIIVGgcA1QWlkT4vd/qjErxGdEATiJr46tL7umlWZ7sHA5YqkRx93OU0Rhic73v8r0bM8Vt3QAbiLDhTmsqCS+BoDSCixOP6pjvoYp67Ljx4Nw8oikCufifOSthCznLwYRv1pwmSLEixqPEJ8RBWAlvrd2REIkiSU3GCr2BgCX3vOFJ/XZ+n0e6z/3whmwaG1LiaW3XgeGiL192hGooEVKc+6iGSxZlxNHM+h97GCB9AI6nlghASlHeJAwkAE01945V4VrjUWIx1wBOImvzoaYMCBDcapGlObENxRnhUj2xRBO3S9zGnb9jMf6X/+FeUSITGYJqHcihFICxOlZPGAdk1DXr7PyN3gyQjueGID9vzoZPCm+ZkCXEcWNrq1A17z1rGmw7LrGapkeUwVgJb4q47PkA23UZWOLlBVvEn2ZNBIy9Nn6A56i12XK8rfOnY7CBSfYAIWWApkrJM6wlHkHUeLpdKhx2ZoW4MDPv3eAho94n24lEsIhZc0kfVeZ/Sx7f2ueAGDAmSDEY6oAnMR3xW+2w0yVDSEXHYC6bvS35wJx/IrW1SnBXU/yWP+V+ukJGXrMiKSE0hFHHPvjAhn4TJaglhboVH/Xc+McllBjz67jsGfnMZ+GLWuNwC0SoVItkBFCf6vJTEWIr/0Ez9voQRPiE2P7BsoxU4D/3NK7kov4XtQzO7d6WMDB3QiBLKggsbREBBlbVffRKUEOaOHX+XBAQu4F3llQQthlyGAVFDSkZct+qz96X8vW8aRFn364P1SAUUrZewYILRI05ITQKuHOw17j8y6dCQu4Xr6nZGgsCfGYKcCpjOc9vhq/dsdZhdjTWUzpC0kQ3HJZOIRct76qu546bFKC9UJzkmXraWhGuIb3BEBeylE6EB0reOFcqadYdm0LixfY/+ZJ2PHTwbB/iPYbHTcpJmLFia73dR/jI8SiMnZeYEwU4P7ZW+8FrtDn5nZj8XBOn6Y2w2M94gY3EQmi++gU4JZHeYpePTe1mzw4EVxkrUU8HUJgDEj2Ch+70xrpw44ZMyuwZgPPmIHnf3hIZYbomACIQkjhvWxRUeN7YirEihBfcQ0PIVbbXDlWhJhdATTxzVQeFxhgrOv1baRaCUTQAY1mErRo4y2UJClPLYAv/niAx/orsrfoPS0Fax2T1xDf45Zs1JaMCLobw1BUdKC/VZNFVzUbUlwvdFp0+08Hcj3DaU6/z/zY3BjqkKECL/CY9Otz0PfiiqtbTGaIA2NFiNkVgPV1Rh/uUKRK0Gd66jj/dNwvI72g4ZYDbJHc/OH9p2HLYzzWf81tZxFPRAXXWW4wLQb+cezShW22D8gTYYGyPcKfkyfQACQMcfvpYRqY8uLfD8LhfacBBy2CeE5ZOAZJSDP4SrG7X5oQr72ZJ20LY0SIWRWAlfiumA0L39tctIbopmBXrFGwmngUmF3veSbh15b/Iv0gK5LalNQTIIWUkSeCuGlPhvQotq7lz/Cx3wEf4dRe4Pm/PUSzP+C4EwB9VRQUeAue4mPsWjLbHCMHxoIQsyoAJ/F9720dpj2ZkK9YAGJht0IR0o6SxK2HVdiz6+c8ac+eD80BPJicHpMscIEKFnoi+OH30v225FzduWEFc9u57g6etOPO5w7DnlePe0UkoZzdb4UYI+SV8X2KjvG623i4igY3IWZTAE7iu2xdmyG+ftAKin9lieUJoQMALsrgfnv9+dH/5nmZ9aJfazEkr1AMkkAHlQD9rqig0XlEyhErQBx/u09rhyacPMWx5340UPBQ2NPKAscB1FgHPlmB701b+zRYvX5iEmIWBWAlvopYLr2uNbj/jMbAFWxpMjq+FZPEXBoBXNZk1zNHYN+b9b/QTh/fqg/NoVbZ3XDCO6IwIStabhJjo+yPm5dRMSoOO9xTJPQxrL5BFcdm1Z923P3L49C341i5gkJRcf15O2Tx+eTHvVxVyts6Jh4hZlEAVuJ7YzsqKoEX4jjvX3YzfBYIKY5TiOcf54n9u69qMRY3FuzYI/nGNpTGDF2fkhLcTBLyXLo9/73w28XeT6dFl7+P57GKTz3WH9Ki6Hjx8EmSxdKf0+Fcy5r6ZsxQhPgmHsIOjIS4bgXgJL5zz29S5LLZhhaorSDLyRgWGD16SnoBQ0IX5fy19X9RFXoG95+GemGs/wfaqGA4eEWlgukHudhQQSIB98U7/C4CL1RRCIQtaxbODZ/r8rWtLGnHgQOnYduTAySNTMOy6Brn7XMo7Mv/EEJYbpPfnK7LFSG+ZGIR4roVgJP4fuCeeYVilyFeEGVz7Fvd43GqMbnU8wOK+G5nGuS+6gNzCL/wQo7mfY0Cfe+FNaNCK/y8JOdBPFtGww8SAmEuoNbTXmDdR5jeNqMq5SeOWYm2Qu4E3Qg2gOdoEiKBt9sw4ZkjPZBP123gS+VzEOK6FICT+F5xbVtOLAsWDwqPN4Q4DHIWEc07RerVz8TZX3/Rq/O8JujucWlZlKaEcDxBOQQ9BxSyYI9lfurqF1j4o5QjIfZIOcJ3wSKf1zXDfOrFiWMZPPfEofwYIfdc+RR8SldDOOF2Uk8KCflivEiHjxOJEI9aAbiJr26jjd16WQjgrF1hGRIGd8G14O98lift+cFPdUaxOBDPg8MEHyIAeEtPw7Lhp/oc/BOrpYyugywQ47DPfH410yD1bU8fhsF+GzoiK54b+lz7Xb4hdCCCVw4HV0NzWL6mhYWw53usjxCPWgE4ie8qVc1ss8TSV0f1F1kJqXQ3+7SkhBJZVxeWmMIOA7pXNZtUXiz02CrLKEsjImUl8+gTxgRIRCJxV6vwoY4vTqFrIYFKl55bcPEM6F7J84rTzQ8fgGgXVt6tAKMQRwIQRYi9ggujZs6aBlffxBYK1UWIR6UAnMTXhBarWgohToiFI4vnSCPYGBiAFIjcZ/erx1Rh5whwYNX1c6hQl+xPlHiFuNIb2iPQ3/4crYA4D+jPz864E3Wzdj6fCL+KOS71x1UqzJjJYGXf6jsBu/WjYpwwIwvvuEDgBw7+wLB+2J/nG+peOZslVDPbrIMQj0oBOInvBz/d6bM3MnMNY8JngEqFDBVeSNELCeFPHuLp9V99fRvMIdZfRgKPBDmTBWEnfEGKECpBFC5XrFLbL6WNG7zxxZkVrRZOSaJ19fd6aopja3nSooYLRLpk+ADOgjmrD9QrucskkPZK6+XW3sTWJzRqQlyzAtzfvHUjcBFflbd2FVUoCBUEawpAhNuvC9F31mv8Qll+ncqrF1qILtehBFJGF+7E+fogkZJYZXqY0gsrQHAGpnvSkkwBUViDBD0Xbgkk6+KmSPjcvq9c08oSa2svsF3xASvJaP/ReWIPBeTEwzmhbcw7d4bhAyxQhPi+5t5NUCNqUgBDfCUT8VWCbwo3JEZGIQBOh7p0YZwJiQpe+qLrAs5zP+aJ/a9SZLIVW/+IzUkkqloIcRoQ33AnlMLFBGDDBvcbsk0kPG5GUiF32wmWPzoua2H1OIXVTCPHnn1iAE4cl1SjIVJI+49RVElWy0+DnFx+3DojxEWIFV+6V8toLT+pSQEs8WVhL7p074XLCrZ/o0tJlgfn2UVBQaSf3/bkIIv1b3PWHwCQlNN5Bwm+zTmOy0FQC09+5lKLkcWXbh8o84J/7wQcSvaDLaz+70oVBs07twnqhU6Lbnt6sCDA5Hz8H5Iouj+nSM4NIZ7NTIhFbaFQ1Qpwf3PvBi7iq61/HloEy+0/MiKapMAExANISdOAh1Tak8v6u1Sit2pWiJ2AEdJXMGCxVUfuH9C2ohx62TaNl7DfeH0QONSRIYyCSPDsvrlibV0cc2lRAfi4MBlG9iI6JryOOzZ9HVgJMcCGWghx1QqQSb421Ft+ez7gHnOBrLhXCmThpZTkqQWYeOKY+vnNA8ABnULUN4XaZi+l+RzaLxZcL3hShpvtQhhk0bHw+8oqREohsZfATgGLUOAGFGF+gS6OMbQgmOKYvsYyCK8L9wrcBSAYDKAKGTxFmLISYiEerHbdqhSAk/jqampbu96tTfF54XZWPhBFNxUyKq2g6+yWa8v0Si9P2lOnEKlVEwXxEijUITF+hHCPkSpJWkmVKMNTll+nJDdsy4VKeP+ElKKD5mpB0Nd4t3uCNjL3+Pq464I5jn84cZnnVNNOFabpjlEmdFVLiEdUAE7iq+Pqq9bNQZY9WkEiN+qEwrlRG0v6Cxukw8xvfpjnAVfa+uvjlDa0cPZXRCLmIy/7nY/mXTan1CpTSwgSqDWUYTm5LJksCbP8Bv0GvK8IMYj/Wp8TV8blOUWI/R0gmR9RUHgfqmGvB1DwDHq6eh1P7SLffnWEeMS3Hmviq+4pD/FVcXXe7yORVZPBkgkn9OCnIdYFTwaRQTTzO7ccVam641AvdNZEhwo67Vc9QmDi5/O4pGRVCf7gxQibGeo793fJbg2GkZ8Fl8wy7Q31Ql9r/dFxuzkUgQyV0z9BlQAjGDW6jr7+a29sh82PsBgzR4g/MtxKw6qbJr4q9mcpemkLdOdXzrH3jVrBYKnChcFkqhQyxL7ffuBtGOivP/OTUD3c/cT3DICGhIV6hqDrDIVHH9xboxEaGspArt90rGfzUN8PGwKxEt975hH3KIMPDCbDhRq2moljX/vDAGthdm45koR/HKCvuSbEITyEEMKBn/EQiNoUhD8Kh7ia+fL9Dk+Ih1QAVuKr4urWaDiciGZwRsH1+EiSTwbUe5JDE18djyaMD16wYwbcvaNumwYXzvPLKIFhPhVElCHPWp0pQlyqAKwV3yH7vwUhQNg9osgISFaDuFowFihZ//FDPmZgoMhP3IyIaUoIb70yCIGyYGH9M0WISxWAs+Kr2wkKg6ElvRj4KrkMivlbBqvgTIwzMgOMac+E0UNXhwdt5d1Zco0wTgAZOXwr/XqS6I/7ThPiVesZxxAPUSEuKABnxde3E0hqzQEVk1wGqCyH7n2k/430rvTZJ3gqvgn1w2VtSHEwahvx3/nFdrikHDrZoZv5xrpCXFAATuJ7893zfBzvrDmRaSGK+XLiHdBF9EFmnobTqc+EiQF9P3a7rI1ERFfQTB8IaujQLS3AbWOsCTFRAG7iO+es6aSaKfwIaUHyxiQz4GIcrzB5YIgVxYxSSphQ0GMGBHXXoWAZhbjDIXTH5lM9uo2tZbqEEHsFsMT3bmCAIb6KxNDytyz8B+AsRbhCjhPkCpOv4ddT/+/sTWnPiQidt39FpaRdqOqyeLiQ6VLckK/iIaiG0L8FmCQKKyFGY4i9AkyrVO4CJuuvie+cudO9IOdAFyH2e5J6wuARQmndKcRzP0lpz4mKJ//6YJ4WBSTHccofeXUMUhx1P7TrzGQmxOIE+AynVwAu66+Jr+6kdJafnJCHLBBfiVbBBTOfFlUXTlsYjl7/hLGBTosaL4AhaLvDUJ2zMpYJQRv7dBjERYixFzAKwPkq05vvyV/m7Apa4Oa8cNs8TlmzGMqJhtRYSIvu21P/sz0Txhb7dtN7RDy+DIEw8QJRpi9fV0LcYrGaMy16PM90GgVQOdK7gAGG+HZMJ+lOgR5fEGs8Hg447NBAi7aOEXv3EsYZcc1HhixHFBID6vgtSwaJ0CJhf8NbIRa36n8r2hWo/ayDOmFanXXFV0BpWpP0zbv8r0Rtw4WQyRwkuTCdDEP7EsYW5HlEzpi7RyQCDDGOWfgQ2NV5JOIAeDiobqfnIMRa5rXsV6adqF/4NfTga539kRnK4UscwkgU4SCXGF0Qygto7Khbldkeq5fADn1vdLu7r/qKcLuHS356A+jqQiWj7dy0SQk/FyHWsj9dyes6qBOm4rsqr/hKUWTx+IQAVQRJ66zTch890ayAyx7o9GrX4lmKbB2F/Y4TxFc3EIhyxAaEGiNFtE9VnWotHWroU1fgBeH40axqDqMNiamh4O2hbfllAFWPg9BPXpi3YAY9NoDyWDNehvcP9PczZgp1vNOha8lMRVLDtRBW8snYZ4AorJFhkQBaLZa2taIkMtCE+PWXjtbdMp0JpQBq4ysk1Id1H+kIGi+LZxsEPZYNJNwCSKdgaLMV6Pvcm+hQ6Oobm6zVcFsLlsTFmk5pSKgF9IKWfa9L+wNV9hndcndnUc8iQdXbfqX3cNUDPa5SSq5DCScA8bXz+1D4o01vVbXNrsWzYb26T+H6l1+PYLkFHXwkg9DGQSr5LeRG0N9zAXSfQvpzGg7hETM0nHZ8QBPitx6s740/IhMr9AtXuqAOaGHUmu+yPrgEjoMZEVEdGVkTc92jZ9/Q7UHRUkG+HBfWcKzpb5eIf4PH8MrwsNdRQKLjLVhXf26y9NiHg1N4WbpR8EpeC6T/J9wfmpYE6rWxUfLXiIYk3uigY8KeHQr7CBzQ54ckeGMW7EZIjbp13THoYzMD/bvqG+ivZV9ngbqgDuhmN3xhneCiRQBAH6BkloioHVpGGYMSocHbdlVFN/UnJQHd5LAvqpCAti1GKfoUBSFHxzE6BPcPiCsFgXAzNW4Vd2yif91f3jC4UBQ//1OIUhJLq7uShLeSeDAkBU6Y7d/OfsRejjwxA+9PzV6sQuE60VX3CzI6FzTZg8rniUUA5CLdspJ7FlwxuLtQWG2oECYmzyHrGhQkPMMSK0r4vYAazTM5MCA3yh2LfwzKaJTAedBK9Kyf8CgKfMWqhwTSfuy8cnwNyeMb0XWW0QOvqKMTQYijUS809KUeZ9hrL2KjiI5JaP5Vf2Gs7sR6SE3acALCTXIXHLxQgteU+GKSk4XIxeY/yJejtClUAN1UayndBZd0ML3dCDl2GWuldcO1CK1/XifiG1JQARgVJDUMsiz8kzVql8B/UI+Mt1ngVVDU5RBG4rXAX8MypkC3R5UtGJDyYDT2BPr3HC/dq9sD6D4NyI8ouD0rEOFRgdjtxpYELYP4Qkgsmx4ujiRCjiAlFczw4+CqRZgD7/qFCC65SshMkvMoa/Yi+64WRHfxcQvqYWrcntlMrDj+GkviffG1w+ERtv5OjfBxSUDWXVJVc+s5OSHha+T+43uLVUMf24xZ9b/jse4tHD+WP75Z2uCbjNt1XsBrP9AbJ8FfLL8CFnj8paQK5i4PVhKBRl77i4sl3W1HONdPUW57RgCyqoTTFORzFNu2W6OGwF7LrMbQLVYeWf69n5WlVgJIHE9+Tr+RACUCHtYEoEbDe1CQSN8l8TFE/Wq0J0OhbgXQA9PDQUIhxoxjYzrE0YUrIXaPSa5bB0RRQCX+juZQwYVB/vcyimeBuuL6IelHAlLTUWzKT8OFIt5sVJsN3pn83l17kFifCYZ7QocIEkvnAd0z75XDOu7+xR7JmRKnEDmXo+egwdEbphWgD+qALsTQMIMYcvMXdoXYWucWOqgLBiViEAlFsAheyLC1EpFnQRaj0HMkpT+2+EZWg3Cj6CGS0j+9INVtFICEE275UE+cq3qbbjtlqikB4uhIIE9bNEDBoOADdfPu2rgd45CV3D/EC4OXR9uXYeP4qBkUYEtF7XsL1IE+VZEzF7RSPEANd4lEJIDYMmDrHgtoyO4Ub1mckiMDcKT7dVFgCoJOXG6tCOftbmg4wFwRzLWpdcPEY4Hfx1C8p7ojDQanLIxxCkYPQ+Ye2l5TQTRpiH3478WQSkOiAbRvbIjikMzzBvvfzt56h8XK1ytqyz+BOmDeIaU+4cZIctAGAj8PJliHUqsSZ3sEdpNh3TgOxIqC40i3P7x9GXx14UZKgJqFFd8cr9c0PoNaUWYIfLxMLGO1B5n/Uww38PdhX2SK0rHEcEUbEjBEuFt6ONL/xhked/3IFG0fzx7qP1X34zDVJjdXFJeqywNomHdISScIbuOiJA8P3uVJN4Phg8J8xl1ELPal1tptDF08t445EqwohRvllgsyrQnIu/k0KjrO2sUfyi19idDVtE3/MwEFOcbHGxe7JL1m+PywsmAjIIOVKyhZmQfznFsUjRuUHOOjdbZBaGjZr9jnJtb1NFLtBcyz+aOL4i+Ic60ynFx+spGV89KY/1MIkxBB9ottpsdZboEFXkYCKF04Lv1unGNxSlprbp249ExCcFlQH6Lzja2/CwNq3GQ4ZkEVwXxfovwF74tOEa+NQxMsB8Z7yLD9skSIv79oUcEjIeXRD+NiGBfep2XfZoHkt6BOPKsUwD0226dE0U3CYYkse34MIIGOhCfmDyTMygLJDlYIohsB0R/glcHfyei7qoG8jatNYAs5Kkgg6eIyH1IWPlaxWQoBxDviJ7SFZQDklqCL6dscRGTw0DXBGSd8zNbGEbko5YfRvH4e1HMML0JRu9qspxV7ko8AA/SBPbv5ENLm8htUlhlwqa7QgSgjo4PbH8jGwPnZsixDvD7ed1koVJwZAcja4XRuYX+1YIjfY+tvF9S0Tfy7YnjpltuV0e9kZI09GbeZvLhPqcyYEF4RbdOvmlEvg7ejX9D31OMHWYRfI8tyo5+PCVauQBMCYID2Avpx5TujduL4RkpJPUFeOQZklqFQJYxrCuE7e70qUd8RWgG7XwFFISI3pAbBCtkf6RUff1dzu4I7BNzNSrYZtl2Tbkm0LUENhPteRKGn99+iqMhllfbhqtP+fFCSw0cIMngE83eFhjz6IWjf+/o7LO82sNjiHpnue4EyKe9TB7UOGKDjM937rrVVt6zq1tU2N8AjshD+Rpjl9EtnZdDKBUVAKwMIUfobv0lvoiFIKtlUvvJgDfElyUTIiAOgbe/dXX3OWu9/dxWDPWpRLv3EhnybsYku2zCUnkNtkL4lJZ9FGxP03vq/0SpahvbuPgG/2HIEjh8bnREZCqIi/9D/jb/42uwtT0jgGSKZkDBB0bfx6MpL3AxphdBeABISJjGUt1mP54kC5HFRcA8JCZMJKij7QyXjfXhZoRlOzoRNUGd/UELCBEQf5LJNUEpx9INyFSnpBaaXZCQkjDP6VejTE1t/jfJXJKkV1Q+Gfb1kQkKjQAp5T5nwaww5HkDzAaUE90BCQgNDy/CmIz1DFnpHzPLqB+eKEV41mZAwEWGE/1jPN4dbp6oyx6am3pViunlhdhckJEx89MtTcv2mkz0jdjpXNSRSb8jkT0X9rdMJCWMJ3dJjCG8Vwm/Xrw0qJNqkQqKNkJAwsdCfgbzvvqM9f1DLj0bV6WHSpBWVU5U87xVISKgHSogfyaT8ylCZnhF+O3okRUgYR/QLoQQ/k99ynZ2jQV0K4GBfQ79Ov2kmNdMljCXytn35/WwmfHNTf09dIxnt9nhhXj52AtapDa8UUqyQQmWOpKkod0FCQvXoU9LZLyT0yYp8XUol+DNgM4fQJyQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQ0Nv4ZpcsPsUoadYgAAAAASUVORK5CYII=";
var TAG$7 = "Mock IAP";
var MockIapApi = class {
  _hardCurrency = 100;
  get hardCurrency() {
    return this._hardCurrency;
  }
  set hardCurrency(value) {
    this._hardCurrency = value;
  }
  async spendCurrency(productId, cost, options) {
    mockLog(TAG$7, `spendCurrency productId=${productId} cost=${cost} balance=${this._hardCurrency}`);
    if (typeof productId !== "string" || productId.length === 0) return { success: false };
    if (!Number.isFinite(cost) || cost <= 0) return {
      success: false,
      error: "INVALID_AMOUNT"
    };
    const remainingHardCurrency = this._hardCurrency - cost;
    if (remainingHardCurrency < 0) return {
      success: false,
      error: `Not enough hard currency. Expected ${cost}, found ${this._hardCurrency}`
    };
    this._hardCurrency = remainingHardCurrency;
    return { success: true };
  }
  async getHardCurrencyBalance() {
    mockLog(TAG$7, `getHardCurrencyBalance \u2192 ${this._hardCurrency}`);
    return this._hardCurrency;
  }
  async openStore() {
    mockLog(TAG$7, "openStore (adding 100 currency)");
    this._hardCurrency += 100;
    return {
      purchased: true,
      newBalance: this._hardCurrency
    };
  }
  /**
  * One embedded blob stands in for all eight variant/tier assets — inlining
  * the real set would bloat the SDK bundle. Options are logged, not honoured,
  * so mock output never matches a `mono` request visually.
  */
  async getCurrencyIcon(options) {
    mockLog(TAG$7, `getCurrencyIcon (variant=${options?.variant ?? "gradient"}, size=${options?.size ?? "md"})`);
    return { base64Data: mockCurrencyIconBase64 };
  }
  async getSubscriptions(tier) {
    return { "CORE": [{
      description: "core subscription",
      currencyCode: "USD",
      price: 2.99,
      interval: "weekly"
    }] };
  }
  async purchaseSubscription(tier, interval) {
    assertTierSupportsInterval(tier, interval);
    mockLog(TAG$7, `purchaseSubscription tier=${tier} interval=${interval}`);
    return { success: true };
  }
  async isUserSubscribed(tier) {
    mockLog(TAG$7, `isUserSubscribed tier=${tier} \u2192 true`);
    return true;
  }
  async hasUserMadePurchase() {
    mockLog(TAG$7, "hasUserMadePurchase \u2192 false");
    return false;
  }
  /** The legacy `gameId` argument is ignored; the mock is always empty. */
  async listDirectPurchaseSkus(_legacyGameId) {
    mockLog(TAG$7, "listDirectPurchaseSkus \u2192 []");
    return [];
  }
};
var TAG$6 = "Mock Credits";
var MockCreditsApi = class {
  autoPaywallOnExhaustion = true;
  autoRetryOnPurchase = true;
  balance = {
    available: 500,
    total: 600,
    freeDaily: {
      dailyCredits: 100,
      availableCredits: 100,
      nextResetAt: "2030-01-01T00:00:00.000Z"
    }
  };
  async getBillingContext() {
    mockLog(TAG$6, "getBillingContext \u2192 player / enforcement off");
    return {
      billedTo: "player",
      playerChargesEnabled: false
    };
  }
  async getBalance() {
    mockLog(TAG$6, `getBalance \u2192 ${this.balance.available}/${this.balance.total}`);
    return this.balance;
  }
  async getSubscription() {
    return {
      status: "none",
      tier: null,
      monthlyCredits: null,
      creditsRemaining: null,
      renewsAt: null,
      willRenew: false
    };
  }
  async getPlans() {
    return {
      plans: [{
        tier: "creator",
        productId: "mock_creator_monthly",
        monthlyCredits: 1e3,
        rolloverDays: 0
      }, {
        tier: "plus",
        productId: "mock_plus_monthly",
        monthlyCredits: 5e3,
        rolloverDays: 30
      }],
      plansUnavailable: false,
      topUpPacks: [{
        productId: "mock_topup_small",
        credits: 500
      }],
      freeDailyCredits: 100
    };
  }
  async estimateGenerationCost(_request) {
    throw new Error("Credit estimates require a server-backed host");
  }
  async openPaywall(options) {
    mockLog(TAG$6, `openPaywall focus=${options?.focus ?? "plans"} (mock: cancelled)`);
    return {
      outcome: "cancelled",
      balance: this.balance
    };
  }
  setAutoPaywallOnExhaustion(enabled) {
    this.autoPaywallOnExhaustion = enabled;
  }
  getAutoPaywallOnExhaustion() {
    return this.autoPaywallOnExhaustion;
  }
  setAutoRetryOnPurchase(enabled) {
    this.autoRetryOnPurchase = enabled;
  }
  getAutoRetryOnPurchase() {
    return this.autoRetryOnPurchase;
  }
  onBalanceChanged(_listener) {
    return () => {
    };
  }
};
var MockLifecycleApi = class {
  pauseCallbacks = /* @__PURE__ */ new Set();
  resumeCallbacks = /* @__PURE__ */ new Set();
  awakeCallbacks = /* @__PURE__ */ new Set();
  sleepCallbacks = /* @__PURE__ */ new Set();
  quitCallbacks = /* @__PURE__ */ new Set();
  backButtonCallbacks = /* @__PURE__ */ new Set();
  identityChangedCallbacks = /* @__PURE__ */ new Set();
  notificationCallbacks = /* @__PURE__ */ new Set();
  safeAreaChangedCallbacks = /* @__PURE__ */ new Set();
  deviceChangedCallbacks = /* @__PURE__ */ new Set();
  onSleep(callback) {
    this.sleepCallbacks.add(callback);
    return { unsubscribe: () => {
      this.sleepCallbacks.delete(callback);
    } };
  }
  onAwake(callback) {
    this.awakeCallbacks.add(callback);
    return { unsubscribe: () => {
      this.awakeCallbacks.delete(callback);
    } };
  }
  onPause(callback) {
    this.pauseCallbacks.add(callback);
    return { unsubscribe: () => {
      this.pauseCallbacks.delete(callback);
    } };
  }
  onResume(callback) {
    this.resumeCallbacks.add(callback);
    return { unsubscribe: () => {
      this.resumeCallbacks.delete(callback);
    } };
  }
  onQuit(callback) {
    this.quitCallbacks.add(callback);
    return { unsubscribe: () => {
      this.quitCallbacks.delete(callback);
    } };
  }
  triggerPauseCallbacks() {
    for (const callback of this.pauseCallbacks) callback();
  }
  triggerResumeCallbacks() {
    for (const callback of this.resumeCallbacks) callback();
  }
  triggerAwakeCallbacks() {
    for (const callback of this.awakeCallbacks) callback();
  }
  triggerSleepCallbacks() {
    for (const callback of this.sleepCallbacks) callback();
  }
  triggerQuitCallbacks() {
    for (const callback of this.quitCallbacks) callback();
  }
  onBackButton(callback) {
    this.backButtonCallbacks.add(callback);
    return { unsubscribe: () => {
      this.backButtonCallbacks.delete(callback);
    } };
  }
  triggerBackButtonCallbacks() {
    for (const callback of this.backButtonCallbacks) callback();
  }
  onIdentityChanged(callback) {
    this.identityChangedCallbacks.add(callback);
    return { unsubscribe: () => {
      this.identityChangedCallbacks.delete(callback);
    } };
  }
  triggerIdentityChangedCallbacks(event) {
    for (const callback of this.identityChangedCallbacks) callback(event);
  }
  onSafeAreaChanged(callback) {
    this.safeAreaChangedCallbacks.add(callback);
    return { unsubscribe: () => {
      this.safeAreaChangedCallbacks.delete(callback);
    } };
  }
  triggerSafeAreaChanged(safeArea) {
    for (const callback of this.safeAreaChangedCallbacks) callback(safeArea);
  }
  onDeviceChanged(callback) {
    this.deviceChangedCallbacks.add(callback);
    return { unsubscribe: () => {
      this.deviceChangedCallbacks.delete(callback);
    } };
  }
  triggerDeviceChanged(device) {
    for (const callback of this.deviceChangedCallbacks) callback(device);
  }
  pendingNotification = null;
  onNotification(callback) {
    this.notificationCallbacks.add(callback);
    const pending = this.pendingNotification;
    if (pending) {
      this.pendingNotification = null;
      queueMicrotask(() => callback(pending));
    }
    return { unsubscribe: () => {
      this.notificationCallbacks.delete(callback);
    } };
  }
  /** Playground/mock parity: simulate a warm notification tap. */
  triggerNotificationCallbacks(event) {
    if (this.notificationCallbacks.size === 0) {
      this.pendingNotification = event;
      return;
    }
    for (const callback of this.notificationCallbacks) callback(event);
  }
};
var MockLoggingApi = class {
  logDebug(message, ...args) {
    console.log(message, ...args);
  }
  logError(message, ...args) {
    console.error(message, ...args);
  }
};
var TAG$5 = "Mock Navigation";
var MockNavigationApi = class {
  rundotGameApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  async requestPopOrQuit(options) {
    return true;
  }
  getStackInfo() {
    const rundotGameApi = this.rundotGameApi;
    return {
      isInStack: rundotGameApi._mock.stackState.isInStack,
      stackPosition: rundotGameApi._mock.stackState.stackPosition,
      isTopOfStack: rundotGameApi._mock.stackState.isTopOfStack,
      stackDepth: rundotGameApi._mock.stackState.stackDepth,
      parentInstanceId: rundotGameApi._mock.stackState.parentInstanceId
    };
  }
  async popApp() {
    const rundotGameApi = this.rundotGameApi;
    if (rundotGameApi._mock.stackState.stackDepth <= 1) {
      console.warn("[RUN:mock] Cannot pop - at base of stack or not in stack");
      return;
    }
    await createMockDelay(MOCK_DELAYS.short);
    const poppedApp = rundotGameApi._mock.stackState.stackHistory.pop();
    mockLog(TAG$5, "popApp", poppedApp);
    rundotGameApi._mock.stackState.stackDepth--;
    rundotGameApi._mock.stackState.stackPosition = Math.max(0, rundotGameApi._mock.stackState.stackDepth - 1);
    if (rundotGameApi._mock.stackState.stackDepth === 0) {
      rundotGameApi._mock.stackState.isInStack = false;
      rundotGameApi._mock.stackState.isTopOfStack = false;
      rundotGameApi._mock.stackState.parentInstanceId = null;
    }
  }
  async pushApp(appId, options) {
    const rundotGameApi = this.rundotGameApi;
    await createMockDelay(MOCK_DELAYS.medium);
    rundotGameApi._mock.stackState.stackHistory.push({
      appId,
      pushedAt: Date.now(),
      contextData: options?.contextData,
      appParams: options?.appParams
    });
    rundotGameApi._mock.stackState.isInStack = true;
    rundotGameApi._mock.stackState.stackDepth++;
    rundotGameApi._mock.stackState.stackPosition = rundotGameApi._mock.stackState.stackDepth - 1;
    rundotGameApi._mock.stackState.isTopOfStack = true;
    mockLog(TAG$5, `pushApp appId=${appId}`);
  }
  async navigateToGame(targetGameId, options) {
    await createMockDelay(MOCK_DELAYS.medium);
    mockLog(TAG$5, `navigateToGame targetGameId=${targetGameId}`, {
      hasLaunchContext: !!options?.launchContext,
      hasReturnContext: !!options?.returnContext
    });
  }
};
var TAG$4 = "Mock Notifications";
var MockNotificationsApi = class {
  rundotGameApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  async cancelNotification(notificationId) {
    mockLog(TAG$4, `cancelNotification id=${notificationId}`);
    const rundotGameApi = this.rundotGameApi;
    if (isWebPlatform()) return true;
    await createMockDelay(MOCK_DELAYS.short);
    if (rundotGameApi._mock.scheduledNotifications && rundotGameApi._mock.scheduledNotifications[notificationId]) {
      delete rundotGameApi._mock.scheduledNotifications[notificationId];
      return true;
    }
    return false;
  }
  async getAllScheduledLocalNotifications() {
    if (isWebPlatform()) return [];
    await createMockDelay(MOCK_DELAYS.short);
    const notifications = this.rundotGameApi._mock.scheduledNotifications || {};
    return Object.values(notifications);
  }
  async isLocalNotificationsEnabled() {
    if (isWebPlatform()) return false;
    await createMockDelay(MOCK_DELAYS.short);
    return this.rundotGameApi._mock.notificationsEnabled !== false;
  }
  async submitMessageAsync(input) {
    mockLog(TAG$4, `submitMessageAsync channels=${input.channels.join(",")}`);
    await createMockDelay(MOCK_DELAYS.short);
    const messageId = `mock-message-${Date.now()}`;
    const results = [];
    if (input.channels.includes("local")) {
      if (isWebPlatform()) results.push({
        channel: "local",
        status: "skipped",
        reason: "unsupported_platform"
      });
      else {
        const id = input.notificationId || `mock-notification-${Date.now()}`;
        results.push({
          channel: "local",
          status: "scheduled",
          id
        });
      }
    }
    const wantsServer = input.channels.includes("rcs");
    if (wantsServer && !isWebPlatform()) {
      results.push({
        channel: "inbox",
        status: "scheduled",
        id: messageId
      });
      results.push({
        channel: "rcs",
        status: "scheduled",
        id: `mock-rcs-${Date.now()}`
      });
    } else if (wantsServer && isWebPlatform()) results.push({
      channel: "rcs",
      status: "skipped",
      reason: "unsupported_platform"
    });
    return {
      messageId,
      results
    };
  }
  async scheduleAsync(title, body, seconds, notificationId, options) {
    mockLog(TAG$4, `scheduleAsync title="${title}" seconds=${seconds}`);
    const { priority = 50, groupId, payload } = options || {};
    if (isWebPlatform()) return `mock-web-notification-${Date.now()}`;
    const rundotGameApi = this.rundotGameApi;
    if (!rundotGameApi._mock.pendingRequests) rundotGameApi._mock.pendingRequests = {};
    const requestId = Date.now().toString();
    return new Promise((resolve) => {
      rundotGameApi._mock.pendingRequests[requestId] = { resolve };
      const id = notificationId || `mock-notification-${Date.now()}`;
      if (!rundotGameApi._mock.scheduledNotifications) rundotGameApi._mock.scheduledNotifications = {};
      rundotGameApi._mock.scheduledNotifications[id] = {
        id,
        title,
        body,
        payload,
        seconds
      };
      setTimeout(() => {
        resolve(id);
      }, MOCK_DELAYS.short);
    });
  }
  async setLocalNotificationsEnabled(enabled) {
    const rundotGameApi = this.rundotGameApi;
    if (isWebPlatform()) return true;
    await createMockDelay(MOCK_DELAYS.short);
    rundotGameApi._mock.notificationsEnabled = enabled;
    return enabled;
  }
  async getRCSAvailableAsync() {
    mockLog(TAG$4, `getRCSAvailableAsync()`);
    await createMockDelay(MOCK_DELAYS.short);
    return { available: true };
  }
  async scheduleRCSAsync(input) {
    mockLog(TAG$4, `scheduleRCSAsync title="${input.title}" triggerAt=${input.triggerAt ?? ""} delaySeconds=${input.delaySeconds ?? ""}`);
    await createMockDelay(MOCK_DELAYS.short);
    return {
      scheduleId: `mock-rcs-${Date.now()}`,
      status: "pending"
    };
  }
  async requestRCSOptInAsync(input) {
    mockLog(TAG$4, `requestRCSOptInAsync rewardCopy="${input?.rewardCopy ?? ""}"`);
    await createMockDelay(MOCK_DELAYS.short);
    return {
      status: "subscribed",
      newlySubscribed: true
    };
  }
};
var MockPopupsApi = class {
  overlay;
  constructor(override) {
    this.overlay = override;
  }
  async showToast(message, options) {
    options?.variant;
    options?.duration;
    const action = options?.action;
    if (action) {
      if (window.confirm(`${message}

[${action.label}] or [Cancel]`)) return true;
    }
    return false;
  }
  async showLikeDialog() {
    return {
      shown: true,
      dismissed: false,
      liked: true
    };
  }
  async canShowLikeDialog() {
    return { available: true };
  }
  async showCommentsPanel() {
    return {
      shown: true,
      dismissed: true
    };
  }
  async canShowCommentsPanel() {
    return { available: true };
  }
  async getLikeState() {
    return {
      isLiked: false,
      likesCount: 0
    };
  }
};
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
var RundotGameRoom = class {
  id;
  name;
  players;
  maxPlayers;
  gameType;
  appId;
  type;
  createdBy;
  createdAt;
  updatedAt;
  isPrivate;
  status;
  customMetadata;
  admins;
  roomCode;
  description;
  data;
  version;
  constructor(roomData) {
    this.id = roomData.id;
    this.name = roomData.name;
    this.players = Array.isArray(roomData.players) ? [...roomData.players] : [];
    this.maxPlayers = roomData.maxPlayers;
    this.gameType = roomData.gameType;
    this.appId = roomData.appId;
    this.type = roomData.type;
    this.createdBy = roomData.createdBy;
    this.createdAt = roomData.createdAt;
    this.updatedAt = roomData.updatedAt;
    this.isPrivate = roomData.isPrivate;
    this.status = roomData.status;
    this.customMetadata = roomData.customMetadata || {};
    this.admins = Array.isArray(roomData.admins) ? [...roomData.admins] : [];
    this.roomCode = roomData.roomCode;
    this.description = roomData.description;
    this.data = roomData.data || {};
    this.version = roomData.version;
  }
};
var ROOMS_DEPRECATION_REPLACEMENTS = {
  createRoomAsync: "RundotGameAPI.realtime.createRoom(roomType)",
  joinOrCreateRoomAsync: "RundotGameAPI.realtime.joinOrCreateRoom(roomType)",
  joinRoomByCodeAsync: "RundotGameAPI.realtime.joinRoomByCode(code)",
  getUserRoomsAsync: "RundotGameAPI.realtime.getUserRooms(options?)",
  subscribeAsync: "room.on() on a RundotGameAPI.realtime room",
  sendRoomMessageAsync: "room.send() on a RundotGameAPI.realtime room",
  leaveRoomAsync: "room.leave() on a RundotGameAPI.realtime room",
  updateRoomDataAsync: "server-authoritative state in your realtime GameRoom class",
  getRoomDataAsync: "server-authoritative state in your realtime GameRoom class",
  kickPlayerAsync: "this.kick() in your realtime GameRoom class",
  startRoomGameAsync: "lifecycle logic in your realtime GameRoom class",
  proposeMoveAsync: "onGameMessage() handling in your realtime GameRoom class",
  validateMoveAsync: "onGameMessage() handling in your realtime GameRoom class"
};
function bindMethod(target, targetKey, source, warn, sourceKey) {
  const fn = source?.[sourceKey ?? targetKey];
  if (typeof fn === "function") {
    target[targetKey] = (...args) => {
      warn(targetKey);
      return fn.apply(source, args);
    };
    return true;
  }
  return false;
}
function initializeRoomsApi(rundotGameApi, host) {
  const roomsApi = host?.rooms;
  if (!roomsApi) {
    console.warn("[RUN] Host did not provide a rooms implementation. Rooms API will be unavailable.");
    return;
  }
  const warned2 = /* @__PURE__ */ new Set();
  const warnDeprecated2 = (method) => {
    if (warned2.has(method)) return;
    warned2.add(method);
    const replacement = ROOMS_DEPRECATION_REPLACEMENTS[method] ?? "RundotGameAPI.realtime";
    console.warn(`[RUN] DEPRECATED: RundotGameAPI.rooms.${method}() is deprecated and unsupported. Realtime (RundotGameAPI.realtime) is the only supported multiplayer API \u2014 use ${replacement}. See the Multiplayer docs for the migration guide.`);
  };
  const rundotGame = rundotGameApi;
  const existingNamespace = rundotGame.rooms || {};
  const roomsNamespace = Object.assign({}, existingNamespace);
  [
    ["createRoomAsync"],
    ["joinOrCreateRoomAsync"],
    ["joinRoomByCodeAsync"],
    ["getUserRoomsAsync"],
    ["subscribeAsync"],
    ["updateRoomDataAsync"],
    ["getRoomDataAsync"],
    ["sendRoomMessageAsync"],
    ["leaveRoomAsync"],
    ["kickPlayerAsync"],
    ["startRoomGameAsync"],
    ["proposeMoveAsync"],
    ["validateMoveAsync"]
  ].forEach(([targetKey, sourceKey]) => {
    bindMethod(roomsNamespace, targetKey, roomsApi, warnDeprecated2, sourceKey);
  });
  rundotGame.rooms = roomsNamespace;
}
var MAX_KEY_BYTES = 256;
var MAX_VALUE_BYTES = 1e6;
var MAX_BATCH_ITEMS = 400;
var MAX_MULTI_GET_KEYS = 100;
var METADATA_PREFIX = "__";
var LEGACY_METADATA_FIELDS = /* @__PURE__ */ new Set(["lastUpdated"]);
function validateStorageKey(key) {
  if (typeof key !== "string" || key.length === 0) throw new RundotApiError("INVALID_ARGUMENT", "Key must be a non-empty string", 400);
  if (utf8ByteLength(key) > MAX_KEY_BYTES) throw new RundotApiError("INVALID_ARGUMENT", `Key exceeds maximum size of ${MAX_KEY_BYTES} bytes`, 400);
  if (key.includes(".")) throw new RundotApiError("INVALID_ARGUMENT", 'Key must not contain "."', 400);
  if (key.startsWith(METADATA_PREFIX)) throw new RundotApiError("INVALID_ARGUMENT", `Key must not start with "${METADATA_PREFIX}"`, 400);
  if (LEGACY_METADATA_FIELDS.has(key)) throw new RundotApiError("INVALID_ARGUMENT", `Key "${key}" is reserved`, 400);
}
function validateStorageValue(value) {
  if (typeof value !== "string") throw new RundotApiError("INVALID_ARGUMENT", "Value must be a string", 400);
  const byteLength = utf8ByteLength(value);
  if (byteLength > MAX_VALUE_BYTES) throw new RundotApiError("PAYLOAD_TOO_LARGE", `Value of ${byteLength} bytes exceeds maximum size of ${MAX_VALUE_BYTES} bytes`, 413);
}
function validateStorageBatchSize(itemCount) {
  if (itemCount > MAX_BATCH_ITEMS) throw new RundotApiError("INVALID_ARGUMENT", `Batch exceeds maximum item count of ${MAX_BATCH_ITEMS}`, 400);
}
function validateStorageMultiGetSize(keyCount) {
  if (keyCount > MAX_MULTI_GET_KEYS) throw new RundotApiError("INVALID_ARGUMENT", `Multi-get exceeds maximum key count of ${MAX_MULTI_GET_KEYS}`, 400);
}
var ValidatingStorageApi = class {
  delegate;
  constructor(delegate) {
    this.delegate = delegate;
  }
  key(index) {
    return this.delegate.key(index);
  }
  clear() {
    return this.delegate.clear();
  }
  length() {
    return this.delegate.length();
  }
  getAllItems() {
    return this.delegate.getAllItems();
  }
  getAllData() {
    return this.delegate.getAllData();
  }
  getItem(key) {
    return this.delegate.getItem(key);
  }
  async setItem(key, item) {
    validateStorageKey(key);
    validateStorageValue(item);
    return this.delegate.setItem(key, item);
  }
  async removeItem(key) {
    validateStorageKey(key);
    return this.delegate.removeItem(key);
  }
  async setMultipleItems(items) {
    validateStorageBatchSize(items.length);
    for (const { key, value } of items) {
      validateStorageKey(key);
      validateStorageValue(value);
    }
    return this.delegate.setMultipleItems(items);
  }
  async removeMultipleItems(keys) {
    validateStorageBatchSize(keys.length);
    for (const key of keys) validateStorageKey(key);
    return this.delegate.removeMultipleItems(keys);
  }
  async compareAndSwap(key, expectedValue, nextValue) {
    validateStorageKey(key);
    if (expectedValue !== null) validateStorageValue(expectedValue);
    if (nextValue !== null) validateStorageValue(nextValue);
    return this.delegate.compareAndSwap(key, expectedValue, nextValue);
  }
  async getMultipleItems(keys) {
    validateStorageMultiGetSize(keys.length);
    for (const key of keys) validateStorageKey(key);
    return this.delegate.getMultipleItems(keys);
  }
};
var STORAGE_PREFIXES = {
  deviceCache: "rundotGame:deviceCache",
  appStorage: "rundotGame:appStorage",
  ownerStorage: "rundotGame:ownerStorage"
};
function createMockStorageApi(storageType, appUrl, store) {
  const appIdentifier = appUrl ? generateAppIdentifier(appUrl) : null;
  let prefix = STORAGE_PREFIXES[storageType];
  let syncDelay = 0;
  switch (storageType) {
    case "deviceCache":
      syncDelay = 0;
      break;
    case "appStorage":
    case "ownerStorage":
      syncDelay = 100;
      break;
    default:
      throw new Error(`Unknown storage type: ${storageType}`);
  }
  prefix = !appIdentifier ? `${prefix}:` : `${prefix}:${appIdentifier}:`;
  const api = new MockStorageApi(prefix, syncDelay, store);
  return storageType === "deviceCache" ? api : new ValidatingStorageApi(api);
}
var MockStorageApi = class {
  prefix;
  syncDelay;
  orderStorageKey;
  backingStore;
  constructor(prefix, syncDelay, store) {
    this.prefix = prefix;
    this.syncDelay = syncDelay;
    this.orderStorageKey = `${prefix}__order__`;
    this.backingStore = store;
  }
  get store() {
    return this.backingStore ?? localStorage;
  }
  async clear() {
    const keysToRemove = [];
    const fullLength = this.store.length;
    for (let i = 0; i < fullLength; i++) {
      const fullKey = this.store.key(i);
      if (!fullKey || fullKey === this.orderStorageKey) continue;
      if (fullKey.startsWith(this.prefix)) keysToRemove.push(fullKey);
    }
    for (const key of keysToRemove) this.store.removeItem(key);
    this.clearOrder();
    await this.simulateSyncDelay();
  }
  async getAllItems() {
    const items = new Array();
    const orderedKeys = this.keys();
    for (const key of orderedKeys) if (this.store.getItem(this.buildKey(key)) !== null) items.push(key);
    else this.removeFromOrder(key);
    return items;
  }
  async getAllData() {
    const result = {};
    const orderedKeys = this.keys();
    for (const key of orderedKeys) {
      const value = this.store.getItem(this.buildKey(key));
      if (value !== null) result[key] = value;
      else this.removeFromOrder(key);
    }
    return result;
  }
  async getItem(key) {
    const fullKey = this.buildKey(key);
    await this.simulateSyncDelay();
    return this.store.getItem(fullKey);
  }
  async key(index) {
    const keys = this.keys();
    if (index < 0 || index >= keys.length) return null;
    await this.simulateSyncDelay();
    return keys[index];
  }
  async length() {
    return this.keys().length;
  }
  async removeItem(key) {
    const fullKey = this.buildKey(key);
    await this.simulateSyncDelay();
    this.store.removeItem(fullKey);
    this.removeFromOrder(key);
  }
  async setItem(key, item) {
    const fullKey = this.buildKey(key);
    await this.simulateSyncDelay();
    this.store.setItem(fullKey, item);
    this.upsertOrder(key);
  }
  async setMultipleItems(entries) {
    for (const entry of entries) {
      const fullKey = this.buildKey(entry.key);
      this.store.setItem(fullKey, entry.value);
    }
    await this.simulateSyncDelay();
    this.bulkUpsertOrder(entries.map((entry) => entry.key));
  }
  async removeMultipleItems(keys) {
    for (const key of keys) {
      const fullKey = this.buildKey(key);
      this.store.removeItem(fullKey);
    }
    await this.simulateSyncDelay();
    this.bulkRemoveFromOrder(keys);
  }
  async compareAndSwap(key, expectedValue, nextValue) {
    const fullKey = this.buildKey(key);
    await this.simulateSyncDelay();
    const currentValue = this.store.getItem(fullKey);
    if (currentValue !== expectedValue) return {
      swapped: false,
      currentValue
    };
    if (nextValue === null) {
      this.store.removeItem(fullKey);
      this.removeFromOrder(key);
    } else {
      this.store.setItem(fullKey, nextValue);
      this.upsertOrder(key);
    }
    return { swapped: true };
  }
  async getMultipleItems(keys) {
    const result = {};
    for (const key of this.dedupeKeys(keys)) {
      const value = this.store.getItem(this.buildKey(key));
      if (value !== null) result[key] = value;
    }
    return result;
  }
  buildKey(key) {
    return `${this.prefix}${key}`;
  }
  extractKey(fullKey) {
    const prefix = this.prefix;
    return fullKey.substring(prefix.length);
  }
  keys() {
    return [...this.readOrder()];
  }
  async simulateSyncDelay() {
    const syncDelay = this.syncDelay;
    if (syncDelay > 0) await new Promise((resolve) => setTimeout(resolve, syncDelay));
  }
  readOrder() {
    const raw = this.store.getItem(this.orderStorageKey);
    if (!raw) return this.rebuildOrderFromStorage();
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return this.normalizeOrder(parsed);
    } catch {
    }
    return this.rebuildOrderFromStorage();
  }
  normalizeOrder(order) {
    const seen = /* @__PURE__ */ new Set();
    const normalized = [];
    let changed = false;
    for (const entry of order) {
      if (typeof entry !== "string") {
        changed = true;
        continue;
      }
      if (seen.has(entry)) {
        changed = true;
        continue;
      }
      const fullKey = this.buildKey(entry);
      if (this.store.getItem(fullKey) === null) {
        changed = true;
        continue;
      }
      seen.add(entry);
      normalized.push(entry);
    }
    if (changed) this.writeOrder(normalized);
    return normalized;
  }
  rebuildOrderFromStorage() {
    const keys = [];
    const total = this.store.length;
    for (let i = 0; i < total; i++) {
      const fullKey = this.store.key(i);
      if (!fullKey) continue;
      if (fullKey === this.orderStorageKey) continue;
      if (fullKey.startsWith(this.prefix)) keys.push(this.extractKey(fullKey));
    }
    this.writeOrder(keys);
    return keys;
  }
  upsertOrder(key) {
    const order = this.readOrder();
    const index = order.indexOf(key);
    if (index !== -1) order.splice(index, 1);
    order.push(key);
    this.writeOrder(order);
  }
  bulkUpsertOrder(keys) {
    const dedupedKeys = this.dedupeKeys(keys);
    if (dedupedKeys.length === 0) return;
    const order = this.readOrder();
    const keysSet = new Set(dedupedKeys);
    const filtered = order.filter((entry) => !keysSet.has(entry));
    for (const key of dedupedKeys) filtered.push(key);
    this.writeOrder(filtered);
  }
  removeFromOrder(key) {
    const order = this.readOrder();
    const index = order.indexOf(key);
    if (index !== -1) {
      order.splice(index, 1);
      this.writeOrder(order);
    }
  }
  bulkRemoveFromOrder(keys) {
    const dedupedKeys = this.dedupeKeys(keys);
    if (dedupedKeys.length === 0) return;
    const order = this.readOrder();
    const keysSet = new Set(dedupedKeys);
    const filtered = order.filter((entry) => !keysSet.has(entry));
    if (filtered.length !== order.length) this.writeOrder(filtered);
  }
  writeOrder(order) {
    if (order.length === 0) {
      this.store.removeItem(this.orderStorageKey);
      return;
    }
    this.store.setItem(this.orderStorageKey, JSON.stringify(order));
  }
  clearOrder() {
    this.store.removeItem(this.orderStorageKey);
  }
  dedupeKeys(keys) {
    const result = [];
    const seen = /* @__PURE__ */ new Set();
    for (const key of keys) {
      if (typeof key !== "string") continue;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(key);
    }
    return result;
  }
};
function generateAppIdentifier(appUrl) {
  if (!appUrl) appUrl = "";
  const normalizedId = normalizeAppIdentifier(appUrl);
  let hash = 0;
  for (let i = 0; i < normalizedId.length; i++) {
    const char = normalizedId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}
function normalizeAppIdentifier(input) {
  if (input.startsWith("http")) try {
    const url = new URL(input);
    const pathParts = url.pathname.split("/");
    const h5Index = pathParts.findIndex((part) => part === "H5");
    if (h5Index !== -1 && h5Index < pathParts.length - 1) return pathParts[h5Index + 1];
    return url.hostname;
  } catch (error) {
    console.error(`[RUN:mock] Error parsing URL: ${error}`, { input });
    return input;
  }
  if (input.includes("/H5/")) try {
    const pathParts = input.split("/");
    const h5Index = pathParts.findIndex((part) => part === "H5");
    if (h5Index !== -1 && h5Index < pathParts.length - 1) return pathParts[h5Index + 1];
  } catch (error) {
    console.error(`[RUN:mock] Error parsing path-based URL: ${error}`, { input });
  }
  return input;
}
function isPacificDaylightTime(date) {
  const year = date.getFullYear();
  const daysUntilSundayInMarch = (7 - new Date(year, 2, 8).getDay()) % 7;
  const dstStart = new Date(year, 2, 8 + daysUntilSundayInMarch);
  dstStart.setHours(2, 0, 0, 0);
  const daysUntilSundayInNov = (7 - new Date(year, 10, 1).getDay()) % 7;
  const dstEnd = new Date(year, 10, 1 + daysUntilSundayInNov);
  dstEnd.setHours(2, 0, 0, 0);
  return date >= dstStart && date < dstEnd;
}
var MockTimeApi = class {
  rundotGameApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  formatNumber(value, options) {
    const locale = this.rundotGameApi.getLocale();
    const numberOptions = {
      style: options?.style || "decimal",
      minimumFractionDigits: options?.minimumFractionDigits || 0,
      maximumFractionDigits: options?.maximumFractionDigits || 2,
      ...options
    };
    return value.toLocaleString(locale, numberOptions);
  }
  formatTime(timestamp, options) {
    const locale = this.rundotGameApi.getLocale();
    const date = new Date(timestamp);
    const dateTimeOptions = {
      dateStyle: options.dateStyle || "medium",
      timeStyle: options.timeStyle || "medium",
      hour12: options.hour12 !== void 0 ? options.hour12 : true,
      ...options
    };
    return date.toLocaleString(locale, dateTimeOptions);
  }
  async getFutureTimeAsync(options) {
    const timeInfo = await this.requestTimeAsync();
    const serverTime = new Date(timeInfo.serverTime);
    const result = new Date(serverTime);
    if (options?.days) result.setDate(result.getDate() + options.days);
    if (options?.hours) result.setHours(result.getHours() + options.hours);
    if (options?.minutes) result.setMinutes(result.getMinutes() + options.minutes);
    if (options?.timeOfDay) {
      const { hour = 0, minute = 0, second = 0 } = options.timeOfDay;
      timeInfo.timezoneOffset || (/* @__PURE__ */ new Date()).getTimezoneOffset();
      const localHour = hour;
      result.setHours(localHour, minute, second, 0);
    }
    if (options?.timezone) switch (options?.timezone.toUpperCase()) {
      case "PT":
      case "PST":
      case "PDT": {
        const ptOffset = isPacificDaylightTime(result) ? -7 : -8;
        result.getUTCDate();
        result.getUTCMonth();
        result.getUTCFullYear();
        result.setUTCHours(0, 0, 0, 0);
        const { hour = 0, minute = 0, second = 0 } = options.timeOfDay || {};
        const utcHour = (hour - ptOffset) % 24;
        result.setUTCHours(utcHour, minute, second, 0);
        break;
      }
      default:
        console.warn(`[RUN:mock] Timezone ${options.timezone} not supported, using local time`);
    }
    return result.getTime();
  }
  async requestTimeAsync() {
    await createMockDelay(MOCK_DELAYS.short);
    const rundotGameApi = this.rundotGameApi;
    const mockOffset = rundotGameApi._mock.serverTimeOffset || 2500;
    const mockServerTime = Date.now() + mockOffset;
    const timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
    const localTime = mockServerTime - timezoneOffset * 6e4;
    return {
      serverTime: mockServerTime,
      localTime,
      timezoneOffset,
      formattedTime: new Date(localTime).toISOString(),
      locale: rundotGameApi._mock.user?.locale || "en-US"
    };
  }
};
var TAG$3 = "Mock Stats";
var MockStatsApi = class {
  values = /* @__PURE__ */ new Map();
  async submit(statId, value) {
    if (typeof statId !== "string" || statId.trim().length === 0) throw new Error("statId is required");
    if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("value must be a valid number");
    if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER) throw new Error("Stat value is invalid");
    mockLog(TAG$3, `submit ${statId}=${value}`);
    this.values.set(statId, value);
    return { grants: [] };
  }
  async getValue(statId) {
    return this.values.has(statId) ? this.values.get(statId) ?? null : null;
  }
  async getAllValues() {
    return Object.fromEntries(this.values);
  }
};
var TAG$2 = "Mock Collectibles";
var MockCollectiblesApi = class {
  cards = [{
    cardId: "curse_of_marble_ep1_intro",
    storyId: "curse_of_marble",
    episodeId: "ep1",
    type: "free",
    rarity: "common",
    title: "The Beginning",
    description: "Marble's first day at the academy.",
    artPath: "Cards/curse_of_marble/ep1_intro.png",
    thumbPath: "Cards/curse_of_marble/ep1_intro_thumb.png"
  }, {
    cardId: "curse_of_marble_vip",
    storyId: "curse_of_marble",
    type: "vip",
    rarity: "legendary",
    title: "Marble Ascended",
    description: "Only for dedicated viewers.",
    artPath: "Cards/curse_of_marble/vip.png",
    thumbPath: "Cards/curse_of_marble/vip_thumb.png"
  }];
  async listCards() {
    mockLog(TAG$2, `listCards (${this.cards.length} cards)`);
    return [...this.cards];
  }
  async claimVipCard(seriesId, cardId) {
    mockLog(TAG$2, `claimVipCard series=${seriesId} card=${cardId}`);
    return {
      granted: true,
      cardId
    };
  }
};
var MockPreloaderApi = class {
  async showLoadScreen() {
  }
  async hideLoadScreen() {
  }
  async setLoaderText(text) {
  }
  async setLoaderProgress(progress) {
  }
};
var STRICT_PROFANITY_POLICY = Object.freeze({
  allLanguages: true,
  allowObfuscatedMatch: true,
  wordBoundaries: true,
  fuzzyToleranceLevel: 0.6
});
var LENIENT_PROFANITY_POLICY = Object.freeze({
  languages: ["english"],
  allowObfuscatedMatch: false,
  wordBoundaries: true,
  fuzzyToleranceLevel: 1.1,
  ignoreWords: [
    "sexy",
    "suck",
    "butt",
    "bastard"
  ]
});
var glinModulePromise = null;
function loadGlin() {
  if (!glinModulePromise) glinModulePromise = Promise.resolve().then(() => (init_dist_DxOnYUkS(), dist_DxOnYUkS_exports));
  return glinModulePromise;
}
var GLIN_OBFUSCATION_WARN = "[Glin-Profanity] Obfuscated match enabled \u2192 wordBoundaries will be ignored internally.";
function withGlinWarnSuppressed(fn) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] === GLIN_OBFUSCATION_WARN) return;
    originalWarn.apply(console, args);
  };
  try {
    return fn();
  } finally {
    console.warn = originalWarn;
  }
}
async function checkText(text, options) {
  try {
    const { checkProfanity: checkProfanity2 } = await loadGlin();
    const policy = options?.policy === "lenient" ? LENIENT_PROFANITY_POLICY : STRICT_PROFANITY_POLICY;
    const result = withGlinWarnSuppressed(() => checkProfanity2(text, {
      allLanguages: policy.allLanguages,
      languages: policy.languages,
      allowObfuscatedMatch: policy.allowObfuscatedMatch,
      wordBoundaries: policy.wordBoundaries,
      fuzzyToleranceLevel: policy.fuzzyToleranceLevel,
      customWords: options?.customWords
    }));
    const matched = result.containsProfanity ? result.profaneWords : [];
    const ignore = new Set((policy.ignoreWords ?? []).map((word) => word.toLowerCase()));
    const custom = new Set((options?.customWords ?? []).map((word) => word.toLowerCase()));
    const profaneWords = matched.filter((word) => custom.has(word.toLowerCase()) || !ignore.has(word.toLowerCase()));
    return {
      clean: profaneWords.length === 0,
      profaneWords
    };
  } catch {
    return {
      clean: true,
      profaneWords: []
    };
  }
}
var SHARE_FILE_ALLOWED_MIME_TYPES = [
  "video/mp4",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif"
];
var SHARE_FILE_MAX_SIZE_BYTES = 10485760;
var COMPOSE_POST_SUBREDDIT_PATTERN = /^[A-Za-z0-9_]{1,21}$/;
var SHARE_PARAMS_MAX_KEYS = 20;
var SHARE_PARAMS_MAX_VALUE_LENGTH = 102400;
var SHARE_PARAMS_MAX_TOTAL_SIZE = 204800;
var META_MAX_TITLE = 200;
var META_MAX_DESCRIPTION = 1e3;
var META_MAX_IMAGE_URL = 2048;
var CLICK_MAX_KEYS = 20;
var CLICK_MAX_KEY_LENGTH = 64;
var CLICK_MAX_VALUE_LENGTH = 1024;
var CLICK_MAX_TOTAL_SIZE = 4096;
function invalid(message) {
  throw new RundotApiError("UNKNOWN", message, 0);
}
function validateShareParams(shareParams) {
  if (shareParams === void 0 || shareParams === null) return;
  if (typeof shareParams !== "object" || Array.isArray(shareParams)) invalid("shareParams must be a plain object");
  const entries = Object.entries(shareParams);
  if (entries.length > SHARE_PARAMS_MAX_KEYS) invalid(`shareParams exceeds maximum of ${SHARE_PARAMS_MAX_KEYS} keys`);
  for (const [key, value] of entries) {
    if (typeof value !== "string") invalid(`shareParams value for key "${key}" must be a string`);
    if (value.length > SHARE_PARAMS_MAX_VALUE_LENGTH) invalid(`shareParams value for key "${key}" exceeds maximum length of 100KB`);
  }
  if (JSON.stringify(shareParams).length > SHARE_PARAMS_MAX_TOTAL_SIZE) invalid("shareParams exceeds maximum serialized size of 200KB");
}
function validateShareIntentParams(shareParams) {
  if (shareParams === void 0 || shareParams === null) invalid("shareParams is required");
  validateShareParams(shareParams);
}
function validateShareTarget(target) {
  if (target === void 0) return;
  if (typeof target !== "object" || target === null || Array.isArray(target)) invalid("target must be a plain object");
  const { format, entryId } = target;
  if (format !== "interactive-fiction" && format !== "video") invalid("target.format must be 'interactive-fiction' or 'video'");
  if (typeof entryId !== "string" || entryId.length === 0) invalid("target.entryId must be a non-empty string");
  if (entryId.includes(":")) invalid('target.entryId must not contain ":"');
}
function validateShareMetadata(metadata) {
  if (metadata === void 0 || metadata === null) return;
  if (typeof metadata !== "object" || Array.isArray(metadata)) invalid("metadata must be a plain object");
  const m2 = metadata;
  if (m2.title !== void 0 && typeof m2.title !== "string") invalid("metadata.title must be a string");
  if (m2.description !== void 0 && typeof m2.description !== "string") invalid("metadata.description must be a string");
  if (m2.imageUrl !== void 0 && typeof m2.imageUrl !== "string") invalid("metadata.imageUrl must be a string");
  if (typeof m2.title === "string" && m2.title.length > META_MAX_TITLE) invalid(`metadata.title exceeds maximum length of ${META_MAX_TITLE}`);
  if (typeof m2.description === "string" && m2.description.length > META_MAX_DESCRIPTION) invalid(`metadata.description exceeds maximum length of ${META_MAX_DESCRIPTION}`);
  if (typeof m2.imageUrl === "string" && m2.imageUrl.length > META_MAX_IMAGE_URL) invalid(`metadata.imageUrl exceeds maximum length of ${META_MAX_IMAGE_URL}`);
}
function validateClickMetadata(metadata) {
  if (typeof metadata !== "object" || metadata === null) invalid("metadata must be a non-null object");
  const entries = Object.entries(metadata);
  if (entries.length > CLICK_MAX_KEYS) invalid(`metadata exceeds maximum of ${CLICK_MAX_KEYS} keys`);
  for (const [key, value] of entries) {
    if (typeof value !== "string") invalid(`metadata value for key "${key}" must be a string`);
    if (key.length > CLICK_MAX_KEY_LENGTH) invalid(`metadata key "${key}" exceeds maximum length of ${CLICK_MAX_KEY_LENGTH}`);
    if (value.length > CLICK_MAX_VALUE_LENGTH) invalid(`metadata value for key "${key}" exceeds maximum length of ${CLICK_MAX_VALUE_LENGTH}`);
  }
  if (JSON.stringify(metadata).length > CLICK_MAX_TOTAL_SIZE) invalid(`metadata total size exceeds maximum of ${CLICK_MAX_TOTAL_SIZE} bytes`);
}
function stripComposeControlChars(value) {
  return value.replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, "");
}
function validateComposePost(post) {
  if (typeof post.text !== "string" || post.text.trim().length === 0) throw new Error("text must be a non-empty string");
  if (post.text.length > 500) throw new Error(`text exceeds maximum length of 500`);
  if (post.title !== void 0) {
    if (typeof post.title !== "string") throw new Error("title must be a string");
    if (post.title.length > 300) throw new Error(`title exceeds maximum length of 300`);
  }
  if (post.subreddit !== void 0) {
    if (typeof post.subreddit !== "string" || !COMPOSE_POST_SUBREDDIT_PATTERN.test(post.subreddit)) throw new Error("subreddit must be 1-21 letters, numbers, or underscores (no r/ prefix)");
  }
}
function validateShareFile(options) {
  const { data, mimeType } = options;
  if (!SHARE_FILE_ALLOWED_MIME_TYPES.includes(mimeType)) throw new Error(`unsupported MIME type "${mimeType}". Allowed: ${SHARE_FILE_ALLOWED_MIME_TYPES.join(", ")}`);
  let sizeBytes;
  if (typeof Blob !== "undefined" && data instanceof Blob) sizeBytes = data.size;
  else if (data instanceof ArrayBuffer) sizeBytes = data.byteLength;
  else if (typeof data === "string") {
    const len = data.length;
    const paddingChars = (data[len - 1] === "=" ? 1 : 0) + (data[len - 2] === "=" ? 1 : 0);
    sizeBytes = Math.floor(len * 3 / 4) - paddingChars;
  } else return;
  if (sizeBytes > 10485760) throw new Error(`file size (${sizeBytes} bytes) exceeds max allowed (${SHARE_FILE_MAX_SIZE_BYTES} bytes)`);
}
function buildXComposerUrl(text, link) {
  const params = new URLSearchParams({ text });
  if (link) params.set("url", link);
  return `https://x.com/intent/post?${params.toString()}`;
}
function buildRedditComposerUrl(options) {
  const { text, link, title, subreddit } = options;
  const params = new URLSearchParams({
    title: title || text.slice(0, 300),
    text: link ? `${text}

${link}` : text
  });
  return `${subreddit ? `https://www.reddit.com/r/${subreddit}/submit` : "https://www.reddit.com/submit"}?${params.toString()}`;
}
var AccessDeniedError = class extends Error {
  requiredTier;
  action;
  constructor(requiredTier, action) {
    super(`[RUN] Access denied. Required tier: ${requiredTier}. Action: ${action}`);
    this.name = "AccessDeniedError";
    this.requiredTier = requiredTier;
    this.action = action;
  }
};
function createAccessGatedApi(api, gatedMethods, requiredTier, config) {
  const gatedSet = new Set(gatedMethods);
  return new Proxy(api, { get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (!gatedSet.has(prop) || typeof value !== "function") return value;
    return function gatedCall(...args) {
      if (!config.isAnonymous()) return value.apply(target, args);
      const action = "prompt_login";
      if (!config.isAutoPromptEnabled()) return Promise.reject(new AccessDeniedError(requiredTier, action));
      return (async () => {
        if (!(await config.promptLogin()).success) throw new AccessDeniedError(requiredTier, action);
        return value.apply(target, args);
      })();
    };
  } });
}
function gateStreaming(streamFn, config, requiredTier = "authenticated_18plus") {
  return (...args) => ({ async *[Symbol.asyncIterator]() {
    if (config.isAnonymous()) {
      if (!config.isAutoPromptEnabled()) throw new AccessDeniedError(requiredTier, "prompt_login");
      if (!(await config.promptLogin()).success) throw new AccessDeniedError(requiredTier, "prompt_login");
    }
    yield* streamFn(...args);
  } });
}
var GATED_MULTIPLAYER_METHODS = {
  createRoom: "ticket-minting",
  joinOrCreateRoom: "ticket-minting",
  joinRoomByCode: "ticket-minting",
  matchmakeRoom: "ticket-minting",
  getUserRooms: "listing"
};
var GATED_IMAGE_GEN_METHODS = {
  generate: "gated",
  estimateDepth: "gated",
  removeBackground: "gated",
  upscaleImage: "gated",
  listModels: "ungated",
  getCompletedJobs: "ungated"
};
function applyAccessGates(host) {
  const gateConfig = {
    isAnonymous: () => host.accessGate.isAnonymous(),
    promptLogin: () => host.accessGate.promptLogin(),
    isAutoPromptEnabled: () => host.accessGate.autoPromptLogin
  };
  const baseTextGen = host.textGen;
  const gatedStream = gateStreaming((request, options) => baseTextGen.requestChatCompletionStreamAsync(request, options), gateConfig);
  const gatedPromptStream = gateStreaming((request, options) => baseTextGen.requestPromptCompletionStreamAsync(request, options), gateConfig);
  const gatedTextGen = createAccessGatedApi(baseTextGen, [
    "requestChatCompletionAsync",
    "requestPromptCompletionAsync",
    "getAvailableCompletionModels",
    "decide"
  ], "authenticated_18plus", gateConfig);
  host.textGen = new Proxy(gatedTextGen, { get(target, prop, receiver) {
    if (prop === "requestChatCompletionStreamAsync") return gatedStream;
    if (prop === "requestPromptCompletionStreamAsync") return gatedPromptStream;
    return Reflect.get(target, prop, receiver);
  } });
  const imageGenKeys = Object.keys(GATED_IMAGE_GEN_METHODS);
  host.imageGen = createAccessGatedApi(host.imageGen, imageGenKeys.filter((k2) => GATED_IMAGE_GEN_METHODS[k2] === "gated"), "authenticated_18plus", gateConfig);
  host.audioGen = createAccessGatedApi(host.audioGen, [
    "generate",
    "designVoices",
    "saveDesignedVoice"
  ], "authenticated_18plus", gateConfig);
  host.spriteGen = createAccessGatedApi(host.spriteGen, ["generate", "animate"], "authenticated_18plus", gateConfig);
  host.threeDGen = createAccessGatedApi(host.threeDGen, [
    "generate",
    "remesh",
    "rig",
    "animate"
  ], "authenticated_18plus", gateConfig);
  host.ugc = createAccessGatedApi(host.ugc, [
    "create",
    "update",
    "delete",
    "like",
    "unlike",
    "report"
  ], "authenticated_18plus", gateConfig);
  host.rooms = createAccessGatedApi(host.rooms, [
    "createRoomAsync",
    "joinOrCreateRoomAsync",
    "joinRoomByCodeAsync",
    "getUserRoomsAsync",
    "subscribeAsync",
    "updateRoomDataAsync",
    "getRoomDataAsync",
    "sendRoomMessageAsync",
    "leaveRoomAsync",
    "kickPlayerAsync",
    "startRoomGameAsync",
    "proposeMoveAsync",
    "validateMoveAsync"
  ], "authenticated_18plus", gateConfig);
  const multiplayerKeys = Object.keys(GATED_MULTIPLAYER_METHODS);
  const ticketMinting = multiplayerKeys.filter((k2) => GATED_MULTIPLAYER_METHODS[k2] === "ticket-minting");
  const listing = multiplayerKeys.filter((k2) => GATED_MULTIPLAYER_METHODS[k2] === "listing");
  const multiplayerGateConfig = {
    ...gateConfig,
    isAnonymous: () => gateConfig.isAnonymous() && !(host.anonymousMultiplayerAllowed?.() ?? false)
  };
  host.multiplayer = createAccessGatedApi(host.multiplayer, ticketMinting, "authenticated_18plus", multiplayerGateConfig);
  host.multiplayer = createAccessGatedApi(host.multiplayer, listing, "authenticated_18plus", gateConfig);
}
var MockAccessGateApi = class {
  rundotGameApi;
  autoPromptLogin = true;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  getAccessTier() {
    const profile = this.rundotGameApi._profileData;
    if (!profile || profile.isAnonymous) return "anonymous";
    return "authenticated_18plus";
  }
  isAnonymous() {
    return this.getAccessTier() === "anonymous";
  }
  async promptLogin() {
    if (this.rundotGameApi._mock?.accessGate?.simulateLoginSuccess) {
      if (this.rundotGameApi._profileData) this.rundotGameApi._profileData = {
        ...this.rundotGameApi._profileData,
        isAnonymous: false
      };
      console.warn("[RUN:mock] accessGate.promptLogin() simulated successful login");
      return {
        success: true,
        profile: this.rundotGameApi._profileData
      };
    }
    console.warn("[RUN:mock] accessGate.promptLogin() called \u2014 returning false. Set _mock.accessGate.simulateLoginSuccess = true to simulate a successful login.");
    return { success: false };
  }
};
var RundotServerRoom = class RundotServerRoom2 {
  /** The shareable room code (e.g. "HX9KWR"). Updated if the server moves us. */
  roomCode;
  playerId;
  ws;
  _locked = false;
  playersById = /* @__PURE__ */ new Map();
  _maxPlayers;
  _isCreator;
  _phase = "active";
  events = {};
  rawHandlers = /* @__PURE__ */ new Map();
  pendingRaw = /* @__PURE__ */ new Map();
  static MAX_PENDING_RAW = 256;
  static MAX_PENDING_RAW_TYPES = 32;
  pingInterval = null;
  lastPingTs = 0;
  _latency = 0;
  _serverTimeOffset = 0;
  /** Set to true to enable debug logging */
  static debug = false;
  log(msg) {
    if (RundotServerRoom2.debug) console.warn(`[RUN:transport] ${msg}`);
  }
  warn(msg) {
    if (RundotServerRoom2.debug) console.warn(`[RUN:transport] ${msg}`);
  }
  toMessage(msgType, data) {
    return {
      ...data,
      type: msgType
    };
  }
  /**
  * Attempt a phase transition. Returns true if the transition occurred.
  * Once `dead`, no further transitions are allowed.
  */
  transitionTo(newPhase) {
    if (this._phase === "dead" || this._phase === newPhase) return false;
    this.log(`phase ${this._phase} \u2192 ${newPhase}`);
    this._phase = newPhase;
    return true;
  }
  constructor(joined, ws) {
    this.roomCode = joined.roomCode;
    this.playerId = joined.playerId;
    this.ws = ws;
    this._locked = joined.locked ?? false;
    this._maxPlayers = joined.maxPlayers ?? 1;
    this._isCreator = joined.isCreator ?? false;
    for (const player of joined.players ?? [{
      id: joined.playerId,
      username: ""
    }]) this.playersById.set(player.id, { ...player });
    this.log(`created roomCode=${joined.roomCode} playerId=${joined.playerId}`);
    ws.on({
      onMessage: (msg) => this.onMessageReceived(msg),
      onStateChange: (state) => this.onConnectionStateChanged(state),
      onError: (err) => this.onError(err)
    });
    this.startPing();
  }
  /** Whether the room is locked */
  get locked() {
    return this._locked;
  }
  get players() {
    return [...this.playersById.values()];
  }
  get maxPlayers() {
    return this._maxPlayers;
  }
  get isCreator() {
    return this._isCreator;
  }
  /** Current latency in ms (round-trip / 2) */
  get latency() {
    return this._latency;
  }
  /** Connection state */
  get connectionState() {
    return this.ws.state;
  }
  /**
  * Register event handlers.
  */
  on(events) {
    this.events = {
      ...this.events,
      ...events
    };
  }
  /**
  * Send a typed message to the server room.
  */
  send(message) {
    if (this._phase === "dead" || this._phase === "reconnecting") return;
    const { type, ...data } = message;
    this.ws.send({
      type: "message",
      msgType: type,
      data
    });
  }
  setSeatingOpen(open) {
    if (this._phase === "dead" || this._phase === "reconnecting") return;
    this.ws.send({
      type: "room:setSeatingOpen",
      open
    });
  }
  /**
  * Send an opaque payload under `msgType`, bypassing the typed-message
  * `{ type, ...data }` transform so a raw string survives the round trip.
  */
  sendRaw(msgType, data) {
    if (this._phase === "dead" || this._phase === "reconnecting") return;
    this.ws.send({
      type: "message",
      msgType,
      data
    });
  }
  /**
  * Register a raw handler for `msgType`. When a broadcast/sendTo arrives with a
  * matching `msgType`, its payload is delivered here untouched and the typed
  * `onMessage`/`onPrivateMessage` path is skipped for that message.
  */
  onRaw(msgType, handler) {
    this.rawHandlers.set(msgType, handler);
    const buffered = this.pendingRaw.get(msgType);
    if (buffered) {
      this.pendingRaw.delete(msgType);
      for (const data of buffered) handler(data);
    }
  }
  /**
  * Deliver a raw payload for `msgType`. If a handler is registered, invoke it and
  * report handled=true so the typed `toMessage` path is skipped. Otherwise retain
  * the payload (bounded) so a later {@link onRaw} still receives it, and report
  * handled=false so the typed path also runs — a msgType no raw consumer ever claims
  * is delivered normally, and the retained copy is simply never drained.
  */
  deliverRaw(msgType, data) {
    const handler = this.rawHandlers.get(msgType);
    if (handler) {
      handler(data);
      return true;
    }
    let buffered = this.pendingRaw.get(msgType);
    if (buffered === void 0) {
      if (this.pendingRaw.size >= RundotServerRoom2.MAX_PENDING_RAW_TYPES) return false;
      buffered = [];
      this.pendingRaw.set(msgType, buffered);
    }
    if (buffered.length < RundotServerRoom2.MAX_PENDING_RAW) buffered.push(data);
    return false;
  }
  /** Send a room chat message (Req 20). Delivered back to all members via onChat. */
  sendChat(text) {
    if (this._phase === "dead" || this._phase === "reconnecting") return;
    this.ws.send({
      type: "message",
      msgType: "chat:send",
      data: { text }
    });
  }
  /** Request recent chat history; reply arrives on onChatHistory. */
  fetchChatHistory(limit) {
    if (this._phase === "dead" || this._phase === "reconnecting") return;
    this.ws.send({
      type: "message",
      msgType: "chat:history",
      data: { limit }
    });
  }
  /**
  * Leave the room and close the connection.
  */
  leave() {
    if (this._phase === "dead") return;
    this._phase = "dead";
    this.stopPing();
    this.ws.close();
  }
  /**
  * Get estimated server time (local time + offset).
  */
  getServerTime() {
    return Date.now() + this._serverTimeOffset;
  }
  onMessageReceived(msg) {
    if (msg.type !== "pong") this.log(`handleMessage type=${msg.type}`);
    switch (msg.type) {
      case "room:broadcast":
        this.onBroadcastMessageReceived(msg);
        break;
      case "room:sendTo":
        this.onSendToMessageReceived(msg);
        break;
      case "room:lock":
        this.onLockMessageReceived();
        break;
      case "room:unlock":
        this.onUnlockMessageReceived();
        break;
      case "room:playerJoined":
        this.onPlayerJoinedMessageReceived(msg);
        break;
      case "room:playerLeft":
        this.onPlayerLeftMessageReceived(msg);
        break;
      case "room:error":
        this.onErrorMessageReceived(msg);
        break;
      case "room:reconnecting":
        this.onReconnectingMessageReceived();
        break;
      case "room:moved":
        this.onMovedMessageReceived(msg);
        break;
      case "room:reconnected":
        this.onReconnectedMessageReceived(msg);
        break;
      case "pong":
        this.onPongMessageReceived(msg);
        break;
      case "chat:message":
        this.events.onChat?.(msg.data);
        break;
      case "chat:history":
        this.events.onChatHistory?.(msg.data.messages);
    }
  }
  onBroadcastMessageReceived(msg) {
    this.log(`broadcast msgType=${msg.msgType}`);
    if (this.deliverRaw(msg.msgType, msg.data)) return;
    if (msg.msgType === "world:delta") {
      const data = msg.data;
      this.events.onDelta?.(data?.delta ?? msg.data);
      return;
    }
    if (msg.msgType === "world:resync") {
      const data = msg.data;
      this.events.onResync?.(data?.reason ?? "resync");
      return;
    }
    this.events.onMessage?.(this.toMessage(msg.msgType, msg.data));
  }
  onSendToMessageReceived(msg) {
    this.log(`sendTo msgType=${msg.msgType}`);
    if (this.deliverRaw(msg.msgType, msg.data)) return;
    this.events.onPrivateMessage?.(this.toMessage(msg.msgType, msg.data));
  }
  onLockMessageReceived() {
    this._locked = true;
    this.log(`room locked`);
    this.events.onLock?.();
  }
  onUnlockMessageReceived() {
    this._locked = false;
    this.log(`room unlocked`);
    this.events.onUnlock?.();
  }
  onPlayerJoinedMessageReceived(msg) {
    this.log(`playerJoined id=${msg.playerId}`);
    const player = {
      id: msg.playerId,
      username: msg.username,
      avatarUrl: msg.avatarUrl
    };
    this.playersById.set(msg.playerId, player);
    this.events.onPlayerJoined?.(player);
  }
  onPlayerLeftMessageReceived(msg) {
    this.log(`playerLeft id=${msg.playerId}`);
    this.playersById.delete(msg.playerId);
    this.events.onPlayerLeft?.(msg.playerId);
  }
  onErrorMessageReceived(msg) {
    if (msg.code === "DUPLICATE_SESSION" && this._phase === "reconnecting") {
      this.warn(`transient reconnect rejection: ${msg.message}`);
      return;
    }
    this.warn(`error: ${msg.message}`);
    this.events.onError?.(msg.message);
  }
  onReconnectingMessageReceived() {
    if (this.transitionTo("reconnecting")) this.events.onReconnecting?.();
  }
  onMovedMessageReceived(msg) {
    this.log(`moved to room=${msg._roomId} code=${msg.roomCode}`);
    this.roomCode = msg.roomCode;
    this.ws.retargetRoom(msg._roomId, msg.roomCode);
    this.events.onMoved?.(msg._roomId);
  }
  onReconnectedMessageReceived(_msg) {
    this.ws.confirmConnection();
    if (this.transitionTo("active")) this.events.onReconnected?.();
  }
  onPongMessageReceived(msg) {
    const now = Date.now();
    const rtt = now - msg.ts;
    this._latency = Math.round(rtt / 2);
    this._serverTimeOffset = msg.serverTs - now + this._latency;
  }
  onError(err) {
    this.warn(`ws error: ${err.message}`);
    this.events.onError?.(err.message);
  }
  onConnectionStateChanged(state) {
    this.log(`connectionState=${state}`);
    switch (state) {
      case "connected":
        this.onConnectedStateEntered();
        break;
      case "disconnected":
        this.onDisconnectedStateEntered();
        break;
      case "reconnecting":
        this.onReconnectingStateEntered();
    }
  }
  onConnectedStateEntered() {
    this.startPing();
  }
  onDisconnectedStateEntered() {
    this.stopPing();
    if (this.transitionTo("dead")) this.events.onDisconnect?.();
  }
  onReconnectingStateEntered() {
    this.stopPing();
    if (this.transitionTo("reconnecting")) this.events.onReconnecting?.();
  }
  startPing() {
    if (this.pingInterval) return;
    this.pingInterval = setInterval(() => {
      this.lastPingTs = Date.now();
      this.ws.send({
        type: "ping",
        ts: this.lastPingTs
      });
    }, 5e3);
  }
  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
};
var ServerWebSocket = class {
  ws = null;
  url;
  maxReconnectAttempts;
  initialReconnectDelay;
  maxReconnectDelay;
  reconnectAttempts = 0;
  reconnectTimer = null;
  disposed = false;
  events = {};
  _state = "disconnected";
  _getJoinTicket;
  _authMessage;
  /**
  * Original matchmaking intent for ticket re-minting on reconnect. The auth
  * frame deliberately does NOT carry criteria/createOptions, so they are kept
  * here and replayed into the reconnect JoinTicketRequest — a criteria-game
  * that drops into the createRoom fallthrough must re-matchmake with intent.
  */
  _joinOptions;
  _isReconnect = false;
  _authenticated = false;
  constructor(options) {
    this.url = options.url;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10;
    this.initialReconnectDelay = options.initialReconnectDelay ?? 100;
    this.maxReconnectDelay = options.maxReconnectDelay ?? 5e3;
    this._authMessage = options.authMessage;
  }
  get state() {
    return this._state;
  }
  /**
  * Set event handlers.
  */
  on(events) {
    this.events = {
      ...this.events,
      ...events
    };
  }
  /**
  * Set the join ticket provider for reconnections.
  */
  setTicketProvider(fn) {
    this._getJoinTicket = fn;
  }
  /**
  * Retain the original matchmaking criteria/create-options so the reconnect
  * ticket is re-minted with the same intent as the initial join.
  */
  setJoinOptions(opts) {
    this._joinOptions = opts;
  }
  /**
  * Set the auth message to send on connect.
  */
  setAuthMessage(msg) {
    this._authMessage = msg;
  }
  /**
  * Retarget the room a reconnect resumes after a server-driven move
  * (move_player / Req 19). The socket itself is unchanged; this only updates
  * the `_roomId`/`roomCode` replayed in the reconnect auth frame.
  */
  retargetRoom(roomId, roomCode) {
    if (!this._authMessage) return;
    this._authMessage = {
      ...this._authMessage,
      _roomId: roomId,
      roomCode
    };
  }
  /**
  * Connect to the WebSocket server.
  * On reconnection, sends a fresh auth token with { reconnect: true }.
  */
  connect() {
    if (this.disposed) return;
    this._authenticated = false;
    this.setState(this._isReconnect ? "reconnecting" : "connecting");
    try {
      if (this.ws) {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onclose = null;
        this.ws.onerror = null;
        this.ws = null;
      }
      const socket = new WebSocket(this.url);
      this.ws = socket;
      socket.onopen = () => this.onOpen(socket);
      socket.onmessage = (event) => this.onMessage(event);
      socket.onclose = (event) => this.onClose(event);
      socket.onerror = () => this.onError();
    } catch (err) {
      console.error(`[RUN:transport] connect() threw`, err);
      this.events.onError?.(err instanceof Error ? err : /* @__PURE__ */ new Error("Failed to connect"));
      this.attemptReconnect();
    }
  }
  /**
  * Send a message to the server.
  */
  send(msg) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this._authenticated) this.ws.send(JSON.stringify(msg));
  }
  /**
  * Reset the reconnect counter after the server confirms the connection is valid.
  */
  confirmConnection() {
    this.reconnectAttempts = 0;
  }
  /**
  * Close the connection. Does not attempt reconnection.
  */
  close() {
    this.disposed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close(1e3, "Client closed");
      this.ws = null;
    }
    this.setState("disconnected");
  }
  async onOpen(socket) {
    if (this._isReconnect && this._authMessage && this._getJoinTicket) try {
      const req = {
        roomType: this._authMessage.roomType,
        roomCode: this._authMessage.roomCode,
        action: this._authMessage.action || "joinOrCreate",
        criteria: this._joinOptions?.criteria,
        createOptions: this._joinOptions?.createOptions,
        persistentKey: this._joinOptions?.persistentKey,
        _roomId: this._authMessage._roomId,
        reconnect: true
      };
      const freshTicket = await this._getJoinTicket(req);
      if (this.ws !== socket || socket.readyState !== WebSocket.OPEN) return;
      const authMsg = {
        ...this._authMessage,
        ticket: freshTicket,
        reconnect: true
      };
      socket.send(JSON.stringify(authMsg));
      this._authenticated = true;
    } catch {
      console.error(`[RUN:transport] failed to get join ticket for reconnection`);
      socket.close();
      return;
    }
    else if (this._authMessage) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(this._authMessage));
        this._authenticated = true;
      }
    }
    if (this.ws !== socket) return;
    this.setState("connected");
  }
  onMessage(event) {
    try {
      const msg = JSON.parse(event.data);
      this.events.onMessage?.(msg);
    } catch {
      console.warn(`[RUN:transport] failed to parse message`);
    }
  }
  onClose(event) {
    console.warn(`[RUN:transport] onclose code=${event.code} reason=${event.reason} disposed=${this.disposed}`);
    this._authenticated = false;
    if (this.disposed) {
      this.setState("disconnected");
      return;
    }
    this.attemptReconnect();
  }
  onError() {
    console.warn(`[RUN:transport] onerror; awaiting close before reconnecting`);
  }
  attemptReconnect() {
    if (this.disposed) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`[RUN:transport] max reconnect attempts (${this.maxReconnectAttempts}) exceeded`);
      this._isReconnect = false;
      this.setState("disconnected");
      this.events.onError?.(/* @__PURE__ */ new Error("Max reconnection attempts exceeded"));
      return;
    }
    this._isReconnect = true;
    this.setState("reconnecting");
    this.reconnectAttempts++;
    const delay = Math.min(this.initialReconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay);
    console.warn(`[RUN:transport] reconnecting attempt=${this.reconnectAttempts}/${this.maxReconnectAttempts} delay=${delay}ms`);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }
  setState(state) {
    if (this._state !== state) {
      this._state = state;
      this.events.onStateChange?.(state);
    }
  }
};
var logged = false;
function maybeLogPlaygroundDuplicateSessionHint(code) {
  if (code !== "DUPLICATE_SESSION" || logged) return;
  if (typeof window === "undefined") return;
  if (!window.__RUNDOT_GAME_PLAYGROUND__?.enabled) return;
  logged = true;
  console.warn('[RUN:playground] DUPLICATE_SESSION: two clients joined with the SAME player identity. Every browser instance sharing one playground base identity (one Google account or one pk_ key) needs its own player. Canonical fixes (see "Test multiple players" in the playground docs):\n  \u2022 Same browser: open players as tabs in one window \u2014 distinct players are assigned automatically.\n  \u2022 Separate browsers/profiles/automation contexts: pin each one with a distinct value, e.g. ?rundotPlayer=player2 (any [a-zA-Z0-9_]{1,32} value, unique per instance).');
}
var WsMultiplayerApi = class {
  serverUrl;
  getJoinTicket;
  listUserRooms;
  constructor(config) {
    this.serverUrl = config.serverUrl;
    this.getJoinTicket = config.getJoinTicket;
    this.listUserRooms = config.listUserRooms;
  }
  resolveServerUrl() {
    return typeof this.serverUrl === "function" ? this.serverUrl() : this.serverUrl;
  }
  async createRoom(roomType, opts) {
    return this._joinWithAction("create", roomType, void 0, opts);
  }
  async joinRoomByCode(code) {
    return this._joinWithAction("joinByCode", "", code);
  }
  async joinOrCreateRoom(roomType, opts) {
    return this._joinWithAction("joinOrCreate", roomType, void 0, opts);
  }
  async matchmakeRoom(roomType, opts) {
    const req = {
      roomType,
      action: "matchmake",
      criteria: opts?.criteria
    };
    const ticket = await this.getJoinTicket(req);
    return this._connectMatchmaking({
      type: "auth",
      protocolVersion: 1,
      ticket,
      roomType,
      action: "matchmake"
    }, opts);
  }
  async getUserRooms(options) {
    if (!this.listUserRooms) throw new Error("getUserRooms is not available in this environment");
    return this.listUserRooms(options);
  }
  async _joinWithAction(action, roomType, roomCode, opts) {
    const req = {
      roomType,
      action,
      roomCode,
      criteria: opts?.criteria,
      createOptions: opts?.createOptions,
      persistentKey: opts?.persistentKey
    };
    const ticket = await this.getJoinTicket(req);
    return this._connect({
      type: "auth",
      protocolVersion: 1,
      ticket,
      roomType,
      action,
      roomCode
    }, opts);
  }
  /**
  * Matchmaking connect (Req 18): like {@link _connect} but the socket parks in
  * the server lobby until paired. While the server reports `matchmaking:pending`
  * the client polls the pool; once the server pairs and emits `room:joined` the
  * room resolves. The waiting window is `matchmakeTimeoutMs` (default 120s),
  * deliberately longer than the plain connect timeout.
  */
  _connectMatchmaking(authMsg, opts, retryCount = 0) {
    const ws = new ServerWebSocket({ url: this.resolveServerUrl().replace(/^http/, "ws") + "/ws" });
    ws.setTicketProvider(this.getJoinTicket);
    ws.setJoinOptions({ criteria: opts?.criteria });
    const timeoutMs = opts?.matchmakeTimeoutMs ?? 12e4;
    const pollIntervalMs = opts?.pollIntervalMs ?? 1e3;
    return new Promise((resolve, reject) => {
      let resolved = false;
      let pollTimer = null;
      const stopPolling = () => {
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
      };
      const startPolling = () => {
        if (pollTimer) return;
        pollTimer = setInterval(() => {
          ws.send({
            type: "message",
            msgType: "matchmaking:poll",
            data: {}
          });
        }, pollIntervalMs);
      };
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          stopPolling();
          ws.send({
            type: "message",
            msgType: "matchmaking:cancel",
            data: {}
          });
          ws.close();
          reject(/* @__PURE__ */ new Error("Matchmaking timeout \u2014 no opponent found"));
        }
      }, timeoutMs);
      const settle = (fn) => {
        if (resolved) return;
        resolved = true;
        stopPolling();
        clearTimeout(timeout);
        fn();
      };
      const handlePreJoinMessage = (msg) => {
        if (resolved) return;
        switch (msg.type) {
          case "room:joined": {
            ws.setAuthMessage({
              ...authMsg,
              _roomId: msg._roomId
            });
            const room = new RundotServerRoom(msg, ws);
            settle(() => resolve(room));
            break;
          }
          case "matchmaking:pending":
            startPolling();
            break;
          case "matchmaking:idle":
            ws.close();
            settle(() => reject(/* @__PURE__ */ new Error("Matchmaking is no longer active (pool expired or cancelled)")));
            break;
          case "matchmaking:cancelled":
            ws.close();
            settle(() => reject(/* @__PURE__ */ new Error("Matchmaking cancelled")));
            break;
          case "room:error":
            maybeLogPlaygroundDuplicateSessionHint(msg.code);
            ws.close();
            if (msg.code === "DUPLICATE_SESSION" && retryCount === 0) {
              console.warn(`[WsMultiplayerApi] DUPLICATE_SESSION in matchmaking, retrying join in 1.5s...`);
              settle(() => {
                setTimeout(async () => {
                  try {
                    let freshAuthMsg = authMsg;
                    if (this.getJoinTicket && authMsg.roomType) {
                      const freshTicket = await this.getJoinTicket({
                        roomType: authMsg.roomType,
                        action: "matchmake",
                        criteria: opts?.criteria
                      });
                      freshAuthMsg = {
                        ...authMsg,
                        ticket: freshTicket
                      };
                    }
                    resolve(await this._connectMatchmaking(freshAuthMsg, opts, retryCount + 1));
                  } catch (err) {
                    reject(err);
                  }
                }, 1500);
              });
              return;
            }
            settle(() => reject(new Error(msg.message)));
        }
      };
      const handlePreJoinError = (err) => {
        if (!resolved) {
          ws.close();
          settle(() => reject(err));
        }
      };
      ws.on({
        onMessage: handlePreJoinMessage,
        onError: handlePreJoinError,
        onStateChange: () => {
        }
      });
      ws.setAuthMessage(authMsg);
      ws.connect();
    });
  }
  _connect(authMsg, opts, retryCount = 0) {
    const ws = new ServerWebSocket({ url: this.resolveServerUrl().replace(/^http/, "ws") + "/ws" });
    ws.setTicketProvider(this.getJoinTicket);
    ws.setJoinOptions({
      criteria: opts?.criteria,
      createOptions: opts?.createOptions,
      persistentKey: opts?.persistentKey
    });
    return new Promise((resolve, reject) => {
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          console.error(`[WsMultiplayerApi] connection timeout (15s)`);
          resolved = true;
          ws.close();
          reject(/* @__PURE__ */ new Error("Connection timeout"));
        }
      }, 15e3);
      const settle = (fn) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);
        fn();
      };
      const handlePreJoinMessage = (msg) => {
        if (resolved) return;
        if (msg.type === "room:joined") {
          ws.setAuthMessage({
            ...authMsg,
            _roomId: msg._roomId
          });
          const room = new RundotServerRoom(msg, ws);
          settle(() => resolve(room));
        } else if (msg.type === "room:error") {
          maybeLogPlaygroundDuplicateSessionHint(msg.code);
          console.error(`[WsMultiplayerApi] room:error code=${msg.code} message=${msg.message}`);
          ws.close();
          if (msg.code === "DUPLICATE_SESSION" && retryCount === 0) {
            console.warn(`[WsMultiplayerApi] DUPLICATE_SESSION encountered, retrying join in 1.5s...`);
            settle(() => {
              setTimeout(async () => {
                try {
                  let freshAuthMsg = authMsg;
                  if (this.getJoinTicket && (authMsg.roomType || authMsg.action === "joinByCode" || authMsg.roomCode)) {
                    const freshTicket = await this.getJoinTicket({
                      roomType: authMsg.roomType || "",
                      action: authMsg.action || "joinOrCreate",
                      roomCode: authMsg.roomCode,
                      criteria: opts?.criteria,
                      createOptions: opts?.createOptions,
                      persistentKey: opts?.persistentKey
                    });
                    freshAuthMsg = {
                      ...authMsg,
                      ticket: freshTicket
                    };
                  }
                  resolve(await this._connect(freshAuthMsg, opts, retryCount + 1));
                } catch (err) {
                  reject(err);
                }
              }, 1500);
            });
            return;
          }
          settle(() => reject(new Error(msg.message)));
        }
      };
      const handlePreJoinError = (err) => {
        console.error(`[WsMultiplayerApi] onError`, err);
        if (!resolved) {
          ws.close();
          settle(() => reject(err));
        }
      };
      const handleStateChange = (_state) => {
      };
      ws.on({
        onMessage: handlePreJoinMessage,
        onError: handlePreJoinError,
        onStateChange: handleStateChange
      });
      ws.setAuthMessage(authMsg);
      ws.connect();
    });
  }
};
var MAX_CRITERIA_KEYS = 16;
var MAX_CRITERIA_VALUE_LENGTH = 256;
var MAX_METADATA_KEYS = 32;
function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function validateRoomOptions(opts) {
  if (!opts) return;
  if (opts.criteria !== void 0) {
    if (!isPlainObject(opts.criteria)) throw new Error("criteria must be an object");
    const entries = Object.entries(opts.criteria);
    if (entries.length > MAX_CRITERIA_KEYS) throw new Error(`criteria may not exceed ${MAX_CRITERIA_KEYS} keys`);
    for (const [key, value] of entries) {
      if (typeof value !== "string" && typeof value !== "number") throw new Error(`criteria value for "${key}" must be a string or number`);
      if (typeof value === "string" && value.length > MAX_CRITERIA_VALUE_LENGTH) throw new Error(`criteria value for "${key}" is too long`);
    }
  }
  if (opts.createOptions !== void 0) {
    const co = opts.createOptions;
    if (!isPlainObject(co)) throw new Error("createOptions must be an object");
    if (co.maxPlayers !== void 0) {
      if (typeof co.maxPlayers !== "number" || !Number.isInteger(co.maxPlayers) || co.maxPlayers <= 0) throw new Error("createOptions.maxPlayers must be a positive integer");
    }
    if (co.isPrivate !== void 0 && typeof co.isPrivate !== "boolean") throw new Error("createOptions.isPrivate must be a boolean");
    if (co.metadata !== void 0) {
      if (!isPlainObject(co.metadata)) throw new Error("createOptions.metadata must be an object");
      if (Object.keys(co.metadata).length > MAX_METADATA_KEYS) throw new Error(`createOptions.metadata may not exceed ${MAX_METADATA_KEYS} keys`);
    }
  }
  if (opts.persistentKey !== void 0 && (typeof opts.persistentKey !== "string" || opts.persistentKey.length === 0)) throw new Error("persistentKey must be a non-empty string");
}
var FAKE_PROFILE_SESSION_KEY = "__rundot_fake_tab_profile__";
function getOrCreateFakeTabProfile() {
  try {
    const stored = typeof sessionStorage !== "undefined" ? sessionStorage.getItem(FAKE_PROFILE_SESSION_KEY) : null;
    if (stored) return JSON.parse(stored);
  } catch {
  }
  const suffix = Math.random().toString(16).slice(2, 6);
  const profile = {
    id: `dev-tab-${suffix}`,
    username: `Dev Player ${suffix.toUpperCase()}`,
    avatarUrl: null
  };
  try {
    if (typeof sessionStorage !== "undefined") sessionStorage.setItem(FAKE_PROFILE_SESSION_KEY, JSON.stringify(profile));
  } catch {
  }
  return profile;
}
function isPlaygroundActive() {
  return typeof window !== "undefined" && !!window.__RUNDOT_GAME_PLAYGROUND__?.enabled;
}
function readDevServerUrl() {
  return typeof window !== "undefined" ? window.__RUNDOT_MULTIPLAYER_DEV_SERVER__ : void 0;
}
function resolveDevIdentity(getProfile) {
  if (!isPlaygroundActive()) {
    const fakeProfile = getOrCreateFakeTabProfile();
    return {
      profileId: fakeProfile.id,
      username: fakeProfile.username,
      avatarUrl: fakeProfile.avatarUrl
    };
  }
  const profile = getProfile?.();
  return {
    profileId: profile?.id,
    username: profile?.username,
    avatarUrl: profile?.avatarUrl
  };
}
function createDevDelegate(serverUrl, getProfile) {
  return new WsMultiplayerApi({
    serverUrl,
    getJoinTicket: async (req) => {
      const { profileId, username, avatarUrl } = resolveDevIdentity(getProfile);
      const body = {
        ...req,
        gameId: "dev-game",
        profileId,
        username,
        avatarUrl
      };
      const resp = await fetch(`${serverUrl}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Ticket request failed" }));
        throw new Error(err.error || "Ticket request failed");
      }
      return (await resp.json()).ticketId;
    },
    listUserRooms: async (_options) => {
      const { profileId } = resolveDevIdentity(getProfile);
      const url = profileId ? `${serverUrl}/rooms?profileId=${encodeURIComponent(profileId)}` : `${serverUrl}/rooms`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Failed to list rooms");
      return (await resp.json()).rooms;
    }
  });
}
var MockMultiplayerApi = class {
  delegate = null;
  /** Rooms created through the offline mock, returned by getUserRooms. */
  mockRooms = [];
  constructor(options) {
    const devServerUrl = readDevServerUrl();
    if (devServerUrl) this.delegate = createDevDelegate(devServerUrl, options?.getProfile);
  }
  async createRoom(roomType, opts) {
    validateRoomOptions(opts);
    if (this.delegate) return this.delegate.createRoom(roomType, opts);
    console.warn("[RUN] Multiplayer running in offline mock mode \u2014 rooms will not connect.\nTo enable local multiplayer, add rundotMultiplayerPlugin() to your Vite config.");
    const ws = new ServerWebSocket({
      url: "ws://localhost:0/mock",
      maxReconnectAttempts: 0
    });
    const roomCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    const playerId = `mock-player-${Math.random().toString(36).slice(2, 8)}`;
    const maxPlayers = opts?.createOptions?.maxPlayers ?? 10;
    const room = new RundotServerRoom({
      type: "room:joined",
      roomCode,
      playerId,
      _roomId: roomCode,
      maxPlayers,
      isCreator: true
    }, ws);
    const now = Date.now();
    this.mockRooms.push({
      roomId: `mock-${roomCode}`,
      roomCode,
      roomType,
      appId: "mock-app",
      players: [playerId],
      maxPlayers,
      isPrivate: false,
      status: "active",
      createdAt: now,
      updatedAt: now
    });
    return room;
  }
  async joinRoomByCode(code) {
    if (this.delegate) return this.delegate.joinRoomByCode(code);
    return this.createRoom(`mock-join-${code}`);
  }
  async joinOrCreateRoom(roomType, opts) {
    if (this.delegate) return this.delegate.joinOrCreateRoom(roomType, opts);
    return this.createRoom(roomType, opts);
  }
  async matchmakeRoom(roomType, opts) {
    if (this.delegate) return this.delegate.matchmakeRoom(roomType, opts);
    return this.createRoom(roomType, opts);
  }
  async getUserRooms(options) {
    if (this.delegate) return this.delegate.getUserRooms(options);
    let rooms = this.mockRooms;
    if (!options?.includeDisposed) rooms = rooms.filter((r2) => r2.status === "active");
    if (options?.appId) rooms = rooms.filter((r2) => r2.appId === options.appId);
    return [...rooms];
  }
};
var TAG$1 = "Mock Video";
var MockVideoApi = class {
  async requestPiPAsync(input) {
    mockLog(TAG$1, `requestPiPAsync contentId=${input.contentId}`);
    return { sessionId: "mock-session-id" };
  }
  async readyForPlaybackResumeAsync(input) {
  }
  async resumeAckAsync(input) {
  }
  onResumeFromNativePlayback(callback) {
    return { unsubscribe: () => {
    } };
  }
};
var MEDIA_PLAYBACK_ACTIONS = ["play", "pause"];
function isMediaPlaybackAction(value) {
  return typeof value === "string" && MEDIA_PLAYBACK_ACTIONS.includes(value);
}
function isActivityActionEvent(value) {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value;
  if (typeof candidate.activityId !== "string") return false;
  if (candidate.activityId.trim().length === 0) return false;
  return isMediaPlaybackAction(candidate.action);
}
var TAG = "Mock Activity";
var MockActivityApi = class {
  active = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  supported;
  constructor(options = {}) {
    this.supported = options.supported ?? true;
  }
  async startActivityAsync(intent) {
    const activityId = `mock-activity:${intent.key}`;
    if (!this.supported) {
      mockLog(TAG, `startActivityAsync skipped key=${intent.key} (no eligible surface)`);
      return {
        activityId,
        status: "skipped",
        reason: "unsupported_surface"
      };
    }
    this.active.set(activityId, intent);
    mockLog(TAG, `startActivityAsync key=${intent.key} activityId=${activityId}`);
    return {
      activityId,
      status: "accepted"
    };
  }
  updateActivity(input) {
    const intent = this.active.get(input.activityId);
    if (!intent) return;
    this.active.set(input.activityId, {
      ...intent,
      state: input.state
    });
    mockLog(TAG, `updateActivity activityId=${input.activityId} status=${input.state.status}`);
  }
  async endActivityAsync(input) {
    this.active.delete(input.activityId);
    mockLog(TAG, `endActivityAsync activityId=${input.activityId}`);
  }
  onActivityAction(callback) {
    this.listeners.add(callback);
    return { unsubscribe: () => this.listeners.delete(callback) };
  }
  /** Test/playground affordance: pretend a native surface issued an action. */
  simulateActivityAction(event) {
    if (!isActivityActionEvent(event)) return;
    if (!this.active.has(event.activityId)) return;
    for (const listener of [...this.listeners]) listener(event);
  }
};
function createRpcAdminGenApi(rpcClient, messageIds) {
  return {
    async browse(params) {
      return rpcClient.call(messageIds.browse, params ?? {});
    },
    async removeEntry(generationId) {
      await rpcClient.call(messageIds.removeEntry, { generationId });
    },
    async listReports(params) {
      return rpcClient.call(messageIds.listReports, params ?? {});
    },
    async resolveReport(reportId, action) {
      await rpcClient.call(messageIds.resolveReport, {
        reportId,
        action
      });
    }
  };
}
function createMockAdminGenApi(label) {
  return {
    async browse() {
      console.warn(`[RUN:mock] ${label}.browse() returning empty results`);
      return { entries: [] };
    },
    async removeEntry() {
      console.warn(`[RUN:mock] ${label}.removeEntry() is a no-op in mock mode`);
    },
    async listReports() {
      console.warn(`[RUN:mock] ${label}.listReports() returning empty results`);
      return { reports: [] };
    },
    async resolveReport() {
      console.warn(`[RUN:mock] ${label}.resolveReport() is a no-op in mock mode`);
    }
  };
}
var MockAdminUgcApi = class {
  async browse(_params) {
    console.warn("[RUN:mock] adminUgc.browse() returning empty results");
    return { entries: [] };
  }
  async removeEntry(_entryId) {
    console.warn("[RUN:mock] adminUgc.removeEntry() is a no-op in mock mode");
  }
  async listReports(_params) {
    console.warn("[RUN:mock] adminUgc.listReports() returning empty results");
    return { reports: [] };
  }
  async resolveReport(_reportId, _action) {
    console.warn("[RUN:mock] adminUgc.resolveReport() is a no-op in mock mode");
  }
};
var MOCK_RELEASE_NOTES = [{
  versionNumber: "1.2.0",
  changelog: "# Major Update\n- New ranked ladder\n- Smarter matchmaking\n- Stability fixes",
  releaseType: "major",
  publishedAt: (/* @__PURE__ */ new Date()).toISOString()
}, {
  versionNumber: "1.1.0",
  changelog: "## Update\n- Balance tweaks\n- Bug fixes",
  releaseType: "minor",
  publishedAt: (/* @__PURE__ */ new Date(Date.now() - 6048e5)).toISOString()
}];
var MockAppApi = class {
  rundotGameApi;
  adminUgc;
  adminImageGen;
  adminVideoGen;
  adminSpriteGen;
  adminAudioGen;
  adminThreeDGen;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
    this.adminUgc = new MockAdminUgcApi();
    this.adminImageGen = createMockAdminGenApi("adminImageGen");
    this.adminVideoGen = createMockAdminGenApi("adminVideoGen");
    this.adminSpriteGen = createMockAdminGenApi("adminSpriteGen");
    this.adminAudioGen = createMockAdminGenApi("adminAudioGen");
    this.adminThreeDGen = createMockAdminGenApi("adminThreeDGen");
  }
  async getMyRole() {
    const mockRole = this.rundotGameApi._mock?.app?.role;
    if (mockRole === "owner" || mockRole === "editor" || mockRole === "none") {
      console.warn(`[RUN:mock] app.getMyRole() returning mock role: '${mockRole}'`);
      return mockRole;
    }
    console.warn("[RUN:mock] app.getMyRole() returning 'none'. Set _mock.app.role to 'owner', 'editor', or 'none' to control.");
    return "none";
  }
  async resolveLaunchIntent(_options) {
    const mockIntent = this.rundotGameApi._mock?.app?.launchIntent;
    if (mockIntent) {
      console.warn(`[RUN:mock] app.resolveLaunchIntent() returning mock intent: '${mockIntent.kind}'`);
      return mockIntent;
    }
    return {
      kind: "none",
      params: {}
    };
  }
  async getReleaseNotesAsync() {
    mockLog("Mock App", "getReleaseNotesAsync");
    return MOCK_RELEASE_NOTES;
  }
  async openReleaseNotesAsync() {
    mockLog("Mock App", "openReleaseNotesAsync (no-op in mock host)");
  }
};
var MockAttributionApi = class {
  async getAttributionParams() {
    return {
      utm_source: "mock_source",
      utm_medium: "mock_medium",
      utm_campaign: "mock_campaign",
      utm_content: null,
      utm_term: null,
      fbclid: null,
      gclid: null
    };
  }
};
var MockPlayableApi = class {
  rundotGameApi;
  preSaveHooks = /* @__PURE__ */ new Set();
  _isPlayableMock = false;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  setPlayableMock(value) {
    this._isPlayableMock = value;
  }
  isPlayable() {
    const env = this.rundotGameApi._environmentData;
    if (env?.executionMode === "playable" || env?.capabilities?.cta === true) return true;
    return this._isPlayableMock;
  }
  async cta(options) {
    console.info("[RUN:mock] Playable CTA triggered:", options);
    return { completed: true };
  }
  async complete(outcome) {
    console.info("[RUN:mock] Playable complete triggered:", outcome);
  }
  milestone(name, params) {
    console.info(`[RUN:mock] Playable milestone "${name}":`, params);
  }
  onPreSave(hook) {
    this.preSaveHooks.add(hook);
    return () => {
      this.preSaveHooks.delete(hook);
    };
  }
  /** Helper for tests to simulate pre-save flush */
  async triggerPreSaveAsync() {
    for (const hook of this.preSaveHooks) await hook();
  }
};
var CLIP_CONTENT_TYPE = "clip";
var PREFERRED_MIME_TYPES = [
  "video/mp4;codecs=h264,aac",
  "video/mp4",
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm"
];
function selectMimeType(override) {
  const MR = globalThis.MediaRecorder;
  if (!MR || typeof MR.isTypeSupported !== "function") throw new Error("[clips] MediaRecorder is not available in this environment");
  if (override) {
    if (!MR.isTypeSupported(override)) throw new Error(`[clips] mimeType "${override}" is not supported here`);
    return override;
  }
  for (const type of PREFERRED_MIME_TYPES) if (MR.isTypeSupported(type)) return type;
  throw new Error("[clips] no supported MediaRecorder mime type found");
}
function normalizeAudio(audio) {
  return {
    microphone: audio?.microphone ?? true,
    gameAudio: audio?.gameAudio ?? true
  };
}
function resolveCanvas(target) {
  if (target instanceof HTMLCanvasElement) return target;
  const selector = target ?? "canvas";
  const el = document.querySelector(selector);
  if (!(el instanceof HTMLCanvasElement)) throw new Error(`[clips] no <canvas> found for "${selector}"; pass options.canvas explicitly`);
  return el;
}
function isRecordingSupported() {
  const g = globalThis;
  return typeof g.MediaRecorder !== "undefined" && typeof g.HTMLCanvasElement?.prototype?.captureStream === "function";
}
function isMicrophoneSupported() {
  return typeof navigator !== "undefined" && typeof navigator.mediaDevices?.getUserMedia === "function";
}
function isCameraSupported() {
  return typeof navigator !== "undefined" && typeof navigator.mediaDevices?.getUserMedia === "function" && typeof HTMLVideoElement !== "undefined";
}
async function queryDevicePermission(name) {
  try {
    const perms = navigator.permissions;
    if (!perms?.query) return "granted";
    const result = await perms.query({ name });
    if (result.state === "granted" || result.state === "denied" || result.state === "prompt") return result.state;
    return "granted";
  } catch {
    return "granted";
  }
}
var DEFAULT_PIP = {
  position: "top-center",
  widthFraction: 0.25,
  margin: 16,
  borderRadius: 12,
  mirror: true
};
function normalizeCamera(camera) {
  if (!camera) return {
    enabled: false,
    facingMode: "user",
    pip: DEFAULT_PIP
  };
  const opts = camera === true ? {} : camera;
  const facingMode = opts.facingMode ?? "user";
  return {
    enabled: true,
    facingMode,
    pip: {
      ...DEFAULT_PIP,
      mirror: facingMode === "user",
      position: opts.pip?.position ?? DEFAULT_PIP.position,
      widthFraction: opts.pip?.widthFraction ?? DEFAULT_PIP.widthFraction
    }
  };
}
var DEFAULT_FPS = 30;
var DEFAULT_MAX_DURATION_MS = 6e4;
var DEFAULT_BITRATE = 25e5;
function pipXY(position, containerW, containerH, pipW, pipH, margin) {
  switch (position) {
    case "top-left":
      return {
        x: margin,
        y: margin
      };
    case "top-center":
      return {
        x: (containerW - pipW) / 2,
        y: margin
      };
    case "top-right":
      return {
        x: containerW - pipW - margin,
        y: margin
      };
    case "bottom-left":
      return {
        x: margin,
        y: containerH - pipH - margin
      };
    case "bottom-center":
      return {
        x: (containerW - pipW) / 2,
        y: containerH - pipH - margin
      };
    case "bottom-right":
      return {
        x: containerW - pipW - margin,
        y: containerH - pipH - margin
      };
    default:
      return {
        x: (containerW - pipW) / 2,
        y: margin
      };
  }
}
var ClipRecorder = class {
  active = null;
  gameAudioNode = null;
  isRecording() {
    return this.active !== null;
  }
  useGameAudio(node) {
    this.gameAudioNode = node;
  }
  async start(options = {}) {
    if (this.active) throw new Error("[clips] a recording is already in progress");
    if (!isRecordingSupported()) throw new Error("[clips] recording is not supported in this environment");
    const canvas = resolveCanvas(options.canvas);
    const fps = options.fps ?? DEFAULT_FPS;
    const audio = normalizeAudio(options.audio);
    const useGameAudio = audio.gameAudio && this.gameAudioNode !== null;
    const width = canvas.width;
    const height = canvas.height;
    const manualMode = options.captureMode === "manual";
    const mimeType = selectMimeType(options.mimeType);
    const camera = normalizeCamera(options.camera);
    const tracksToStop = [];
    let audioCleanup = null;
    let previewOverlay = null;
    try {
      let micStream;
      let webcamVideo = null;
      if (camera.enabled) try {
        const constraints = {
          video: {
            facingMode: camera.facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: audio.microphone
        };
        const camStream = await navigator.mediaDevices.getUserMedia(constraints);
        const camVideoTracks = camStream.getVideoTracks();
        const camAudioTracks = camStream.getAudioTracks();
        try {
          webcamVideo = document.createElement("video");
          webcamVideo.srcObject = new MediaStream(camVideoTracks);
          webcamVideo.playsInline = true;
          webcamVideo.muted = true;
          await webcamVideo.play();
        } catch (playErr) {
          camVideoTracks.forEach((t) => t.stop());
          camAudioTracks.forEach((t) => t.stop());
          throw new Error("webcam-setup-failed");
        }
        camVideoTracks.forEach((t) => tracksToStop.push(t));
        if (audio.microphone) {
          micStream = new MediaStream(camAudioTracks);
          micStream.getTracks().forEach((t) => tracksToStop.push(t));
        } else camAudioTracks.forEach((t) => t.stop());
      } catch (camErr) {
        options.onCameraUnavailable?.();
        webcamVideo = null;
      }
      if (audio.microphone && !micStream) {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream.getTracks().forEach((t) => tracksToStop.push(t));
      }
      const needsComposite = manualMode || webcamVideo !== null;
      let recordStream;
      let manual = null;
      if (needsComposite) {
        const composite = document.createElement("canvas");
        composite.width = width;
        composite.height = height;
        const ctx = composite.getContext("2d");
        if (!ctx) throw new Error("[clips] failed to get 2D context for compositing");
        recordStream = composite.captureStream(fps);
        recordStream.getTracks().forEach((t) => tracksToStop.push(t));
        manual = {
          ctx,
          gameCanvas: canvas,
          width,
          height
        };
      } else {
        recordStream = canvas.captureStream(fps);
        recordStream.getTracks().forEach((t) => tracksToStop.push(t));
      }
      audioCleanup = this.attachAudio(recordStream, micStream, useGameAudio, tracksToStop);
      const recorder = new MediaRecorder(recordStream, {
        mimeType,
        videoBitsPerSecond: options.videoBitsPerSecond ?? DEFAULT_BITRATE
      });
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      previewOverlay = webcamVideo ? this.createPreviewOverlay(webcamVideo, canvas, camera) : null;
      this.active = {
        recorder,
        chunks,
        mimeType,
        width,
        height,
        startedAt: Date.now(),
        maxDurationMs: options.maxDurationMs ?? DEFAULT_MAX_DURATION_MS,
        tracksToStop,
        audioCleanup,
        manual,
        webcamVideo,
        camera,
        capped: false,
        stopPromise: null,
        onAutoStop: options.onAutoStop,
        released: false,
        previewOverlay
      };
      if (webcamVideo && !manualMode) this.startCompositeLoop();
      this.startMaxDurationWatcher();
      recorder.start();
    } catch (err) {
      this.active = null;
      audioCleanup?.();
      tracksToStop.forEach((t) => t.stop());
      if (previewOverlay) {
        previewOverlay.srcObject = null;
        previewOverlay.remove();
      }
      throw err;
    }
  }
  /** Adds one mixed audio track (game + mic) or a single source track to recordStream. */
  attachAudio(recordStream, micStream, useGameAudio, tracksToStop) {
    const micTracks = micStream?.getAudioTracks() ?? [];
    const gameNode = useGameAudio ? this.gameAudioNode : null;
    if (!gameNode && micTracks.length === 0) return null;
    if (!gameNode) {
      micTracks.forEach((t) => recordStream.addTrack(t));
      return null;
    }
    const ctx = gameNode.context;
    const dest = ctx.createMediaStreamDestination();
    gameNode.connect(dest);
    let micSource = null;
    if (micTracks.length > 0) {
      micSource = ctx.createMediaStreamSource(new MediaStream(micTracks));
      micSource.connect(dest);
    }
    dest.stream.getAudioTracks().forEach((t) => {
      recordStream.addTrack(t);
      tracksToStop.push(t);
    });
    return () => {
      try {
        gameNode.disconnect(dest);
      } catch {
      }
      if (micSource) try {
        micSource.disconnect();
      } catch {
      }
    };
  }
  /** captureMode 'manual': snapshot the game canvas into the recording surface. */
  captureFrame() {
    const a = this.active;
    const m2 = a?.manual;
    if (!m2) return;
    m2.ctx.drawImage(m2.gameCanvas, 0, 0, m2.width, m2.height);
    if (a.webcamVideo) this.drawPip(m2.ctx, a.webcamVideo, m2.width, m2.height, a.camera.pip);
  }
  async stop() {
    const active = this.active;
    if (!active) throw new Error("[clips] no active recording to stop");
    if (active.capped) await active.stopPromise;
    else {
      await new Promise((resolve) => {
        if (active.recorder.state === "inactive") {
          resolve();
          return;
        }
        active.recorder.onstop = () => resolve();
        active.recorder.stop();
      });
      this.release(active);
    }
    const blob = new Blob(active.chunks, { type: active.mimeType });
    const durationMs = active.capped ? active.maxDurationMs : Date.now() - active.startedAt;
    this.active = null;
    return {
      blob,
      mimeType: active.mimeType,
      durationMs,
      width: active.width,
      height: active.height,
      sizeBytes: blob.size
    };
  }
  cancel() {
    const active = this.active;
    if (!active) return;
    try {
      active.recorder.ondataavailable = null;
      if (active.recorder.state !== "inactive") active.recorder.stop();
    } finally {
      this.release(active);
      this.active = null;
    }
  }
  /** Ends capture (stops recorder + releases mic/audio) but RETAINS chunks for stop(). */
  cap() {
    const active = this.active;
    if (!active || active.capped) return;
    active.capped = true;
    active.stopPromise = new Promise((resolve) => {
      if (active.recorder.state === "inactive") {
        this.release(active);
        resolve();
        return;
      }
      active.recorder.onstop = () => {
        this.release(active);
        resolve();
      };
      active.recorder.stop();
    });
    active.onAutoStop?.();
  }
  startMaxDurationWatcher() {
    const raf = globalThis.requestAnimationFrame?.bind(globalThis) ?? ((cb) => setTimeout(() => cb(Date.now()), 16));
    const tick = () => {
      const a = this.active;
      if (!a || a.capped) return;
      if (Date.now() - a.startedAt >= a.maxDurationMs) {
        this.cap();
        return;
      }
      raf(tick);
    };
    raf(tick);
  }
  /** Auto-mode composite loop: draws game canvas + PiP each frame. */
  startCompositeLoop() {
    const raf = globalThis.requestAnimationFrame?.bind(globalThis) ?? ((cb) => setTimeout(() => cb(Date.now()), 16));
    const tick = () => {
      const a = this.active;
      if (!a || a.capped || !a.manual || !a.webcamVideo) return;
      a.manual.ctx.drawImage(a.manual.gameCanvas, 0, 0, a.manual.width, a.manual.height);
      this.drawPip(a.manual.ctx, a.webcamVideo, a.manual.width, a.manual.height, a.camera.pip);
      raf(tick);
    };
    raf(tick);
  }
  drawPip(ctx, video, canvasWidth, canvasHeight, pip) {
    if (video.videoWidth === 0 || video.videoHeight === 0) return;
    const pipW = Math.round(canvasWidth * pip.widthFraction);
    const pipH = Math.round(pipW * (video.videoHeight / Math.max(1, video.videoWidth)));
    const m2 = pip.margin;
    const { x, y } = pipXY(pip.position, canvasWidth, canvasHeight, pipW, pipH, m2);
    ctx.save();
    this.drawRoundRect(ctx, x, y, pipW, pipH, pip.borderRadius);
    ctx.clip();
    if (pip.mirror) {
      ctx.translate(x + pipW, y);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, pipW, pipH);
    } else ctx.drawImage(video, x, y, pipW, pipH);
    ctx.restore();
  }
  drawRoundRect(ctx, x, y, w, h, r2) {
    const radius = Math.min(r2, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }
  /**
  * Creates a fixed-position live camera preview visible at the top of the viewport.
  * Appended to document.body so no app element can hide or re-layer it.
  */
  createPreviewOverlay(webcamVideo, _gameCanvas, camera) {
    const preview = document.createElement("video");
    preview.srcObject = webcamVideo.srcObject;
    preview.playsInline = true;
    preview.muted = true;
    preview.autoplay = true;
    const pip = camera.pip;
    const marginPx = `${pip.margin}px`;
    const s2 = preview.style;
    s2.position = "fixed";
    s2.width = `${Math.round(pip.widthFraction * 100)}vw`;
    s2.height = "auto";
    s2.borderRadius = `${pip.borderRadius}px`;
    s2.objectFit = "cover";
    s2.pointerEvents = "none";
    s2.zIndex = "2147483647";
    const transforms = [];
    switch (pip.position) {
      case "top-left":
        s2.top = marginPx;
        s2.left = marginPx;
        break;
      case "top-center":
        s2.top = marginPx;
        s2.left = "50%";
        transforms.push("translateX(-50%)");
        break;
      case "top-right":
        s2.top = marginPx;
        s2.right = marginPx;
        break;
      case "bottom-left":
        s2.bottom = marginPx;
        s2.left = marginPx;
        break;
      case "bottom-center":
        s2.bottom = marginPx;
        s2.left = "50%";
        transforms.push("translateX(-50%)");
        break;
      case "bottom-right":
        s2.bottom = marginPx;
        s2.right = marginPx;
    }
    if (pip.mirror) transforms.push("scaleX(-1)");
    if (transforms.length > 0) s2.transform = transforms.join(" ");
    document.body.appendChild(preview);
    preview.play().catch(() => {
    });
    return preview;
  }
  /** Idempotent: stops mic/canvas/webcam tracks, disconnects audio nodes, removes overlay. */
  release(active) {
    if (active.released) return;
    active.released = true;
    active.audioCleanup?.();
    active.tracksToStop.forEach((t) => t.stop());
    if (active.previewOverlay) {
      active.previewOverlay.srcObject = null;
      active.previewOverlay.remove();
      active.previewOverlay = null;
    }
    if (active.webcamVideo) {
      active.webcamVideo.srcObject = null;
      active.webcamVideo = null;
    }
  }
};
function extensionForMime(mimeType) {
  return mimeType.includes("mp4") ? "mp4" : "webm";
}
var ClipsApiImpl = class {
  deps;
  recorder;
  constructor(deps, recorderFactory = () => new ClipRecorder()) {
    this.deps = deps;
    this.recorder = recorderFactory();
  }
  async isSupportedAsync() {
    const canRecord = isRecordingSupported();
    return {
      canRecord,
      canUseMicrophone: canRecord && isMicrophoneSupported(),
      canUseCamera: canRecord && isCameraSupported(),
      reason: canRecord ? void 0 : "MediaRecorder/captureStream unavailable"
    };
  }
  getCaptureConsentAsync() {
    return this.deps.captureConsent.get();
  }
  async requestCaptureConsentAsync(opts) {
    const existing = await this.deps.captureConsent.get();
    if (existing.status === "granted") return existing;
    if (existing.status === "denied") return existing;
    if (await queryDevicePermission(opts?.includesCamera ? "camera" : "microphone") === "prompt") return {
      status: "granted",
      canAskAgain: true
    };
    return this.deps.captureConsent.request({ includesCamera: opts?.includesCamera });
  }
  useGameAudio(node) {
    this.recorder.useGameAudio(node);
  }
  captureFrame() {
    this.recorder.captureFrame();
  }
  async cancelRecordingAsync() {
    this.recorder.cancel();
  }
  async startRecordingAsync(options) {
    const audio = normalizeAudio(options?.audio);
    const camera = normalizeCamera(options?.camera);
    if (audio.microphone || camera.enabled) await this.ensureCaptureConsent({ includesCamera: camera.enabled });
    await this.recorder.start(options);
  }
  /**
  * Throws CAPTURE_CONSENT_DENIED if consent is denied or the platform dialog
  * is declined. Otherwise resolves and recording may proceed.
  *
  * Logic:
  * - T1 / already granted (get() returns granted) → proceed
  * - Already denied → throw
  * - Device permission is 'prompt' → skip platform dialog; the browser/OS shows
  *   its own prompt during getUserMedia (single opt-in). The host cannot
  *   securely self-grant from a game signal, so app consent stays
  *   'undetermined' and the platform dialog shows on the next recording.
  * - Device permission is 'denied' → skip, let getUserMedia fail naturally
  * - Device permission is 'granted' → show the platform dialog (no system
  *   dialog is coming, so this is the user's single opt-in)
  */
  async ensureCaptureConsent(opts) {
    const consent = await this.deps.captureConsent.get();
    if (consent.status === "granted") return;
    if (consent.status === "denied") throw new Error("CAPTURE_CONSENT_DENIED");
    const deviceState = await queryDevicePermission(opts?.includesCamera ? "camera" : "microphone");
    if (deviceState === "prompt" || deviceState === "denied") return;
    if ((await this.deps.captureConsent.request({ includesCamera: opts?.includesCamera })).status !== "granted") throw new Error("CAPTURE_CONSENT_DENIED");
  }
  async stopRecordingAsync(persist) {
    const clip = await this.recorder.stop();
    if ((persist?.persist ?? "ugc") === "none") return { ...clip };
    const quota = await this.deps.files.getQuota();
    if (clip.sizeBytes > quota.maxFileBytes) throw new Error(`[clips] clip is ${clip.sizeBytes} bytes which exceeds the ${quota.maxFileBytes}-byte upload cap; lower maxDurationMs, fps, or videoBitsPerSecond`);
    const key = `clips/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionForMime(clip.mimeType)}`;
    const upload = await this.deps.files.upload({
      key,
      contentType: clip.mimeType,
      sizeBytes: clip.sizeBytes,
      visibility: "private"
    });
    let fileEntry;
    try {
      const putResponse = await fetch(upload.uploadUrl, {
        method: "PUT",
        headers: upload.uploadHeaders,
        body: clip.blob
      });
      if (!putResponse.ok) throw new Error(`[clips] upload PUT failed with status ${putResponse.status}`);
      fileEntry = await this.deps.files.confirmUpload(upload.key);
    } catch (err) {
      await this.deps.files.delete(upload.key).catch(() => void 0);
      throw err;
    }
    const data = {
      ...persist?.data,
      fileKey: upload.key,
      durationMs: clip.durationMs,
      width: clip.width,
      height: clip.height,
      mimeType: clip.mimeType,
      codec: fileEntry.mediaMetadata?.codec
    };
    let entry;
    try {
      entry = await this.deps.ugc.create({
        contentType: CLIP_CONTENT_TYPE,
        data,
        isPublic: false,
        title: persist?.title,
        tags: persist?.tags
      });
    } catch (err) {
      await this.deps.files.delete(upload.key).catch(() => void 0);
      throw err;
    }
    return {
      ...clip,
      ugc: entry,
      fileKey: upload.key,
      fileUrl: fileEntry.url
    };
  }
  async publishClipAsync(ugcId) {
    const entry = await this.deps.ugc.get(ugcId);
    if (!entry) throw new Error(`[clips] UGC entry "${ugcId}" not found`);
    const fileKey = entry.data?.fileKey;
    if (typeof fileKey !== "string" || fileKey.length === 0) throw new Error(`[clips] UGC entry "${ugcId}" has no data.fileKey; refusing to publish a clip with no accessible file`);
    await this.deps.files.setVisibility(fileKey, "public");
    try {
      return await this.deps.ugc.update({
        id: ugcId,
        isPublic: true
      });
    } catch (err) {
      await this.deps.files.setVisibility(fileKey, "private").catch(() => void 0);
      throw err;
    }
  }
};

// node_modules/@series-inc/rundot-game-sdk/dist/playground-DX6FPhtu.js
var SDK_VERSION = "5.29.1";
function getPlaygroundConfig() {
  if (typeof globalThis === "undefined") return null;
  const config = globalThis.__RUNDOT_GAME_PLAYGROUND__;
  if (!config?.enabled) return null;
  return config;
}

// node_modules/@series-inc/rundot-game-sdk/dist/clips-WonLVRGa.js
var RpcAdsApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async showInterstitialAd(options) {
    return (await this.rpcClient.call("H5_SHOW_INTERSTITIAL_AD", options || {}, -1)).shown;
  }
  async isInterstitialAdReadyAsync() {
    return (await this.rpcClient.call("H5_IS_INTERSTITIAL_AD_READY")).ready;
  }
  async isRewardedAdReadyAsync() {
    return (await this.rpcClient.call("H5_IS_REWARDED_AD_READY")).ready;
  }
  async showRewardedAdAsync(options) {
    return (await this.rpcClient.call("H5_SHOW_REWARDED_AD", options || {}, -1)).rewardEarned;
  }
};
function initializeAds(rundotGameApiInstance, host) {
  rundotGameApiInstance.isRewardedAdReadyAsync = host.ads.isRewardedAdReadyAsync.bind(host.ads);
  rundotGameApiInstance.showRewardedAdAsync = host.ads.showRewardedAdAsync.bind(host.ads);
  rundotGameApiInstance.ads = host.ads;
}
var RpcAiApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async decide(request) {
    const state = serializeCanvasInState(request.state);
    return mapCreditsExhaustion(this.rpcClient.call("H5_AI_DECIDE", { request: {
      ...request,
      state
    } }, -1));
  }
  async requestChatCompletionAsync(request) {
    const { apiKey: _apiKey, ...requestWithoutApiKey } = request;
    return mapCreditsExhaustion(this.rpcClient.call("H5_AI_CHAT_COMPLETION", { request: requestWithoutApiKey }, -1));
  }
  async requestPromptCompletionAsync(request) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_AI_CHAT_COMPLETION", { request: toPromptWireRequest(request) }, -1));
  }
  async getAvailableCompletionModels() {
    return await this.rpcClient.call("H5_AI_GET_AVAILABLE_MODELS", {}, -1);
  }
  requestChatCompletionStreamAsync(request, options) {
    const { apiKey: _apiKey, ...requestWithoutApiKey } = request;
    return this.openStream(requestWithoutApiKey, options);
  }
  requestPromptCompletionStreamAsync(request, options) {
    return this.openStream(toPromptWireRequest(request), options);
  }
  /**
  * Shared stream machinery for both open-mode and templated streams: START
  * round-trip, CHUNK/DONE/ERROR notification fan-in, ABORT on cancel, and
  * credits-exhaustion re-typing. The wire request is the only thing that
  * differs between the two public methods.
  */
  openStream(wireRequest, options) {
    const rpc = this.rpcClient;
    return { [Symbol.asyncIterator]: () => {
      const queue = [];
      const waiters = [];
      let streamId;
      let ended = false;
      let started = false;
      let startPromise = null;
      let abortPending = false;
      const subscriptions = [];
      let onAbort = null;
      const sendAbortIfReady = () => {
        if (streamId) rpc.notify("H5_AI_CHAT_COMPLETION_STREAM_ABORT", { streamId });
        else abortPending = true;
      };
      const push = (item) => {
        if (ended && item.kind !== "end") return;
        if (item.kind !== "chunk") ended = true;
        const waiter = waiters.shift();
        if (waiter) waiter(item);
        else queue.push(item);
      };
      const pull = () => {
        const ready = queue.shift();
        if (ready) return Promise.resolve(ready);
        return new Promise((resolve) => waiters.push(resolve));
      };
      const cleanup = () => {
        for (const sub of subscriptions) sub.unsubscribe();
        subscriptions.length = 0;
        if (onAbort && options?.signal) options.signal.removeEventListener("abort", onAbort);
        onAbort = null;
      };
      const pendingPreStart = [];
      const handleDoneNotification = (payload) => {
        push({
          kind: "chunk",
          value: payload.chunk
        });
        push({ kind: "end" });
        cleanup();
      };
      const handleErrorNotification = (payload) => {
        const message = payload.message ?? payload.error ?? "AI chat completion stream failed";
        const candidateStatus = payload.statusCode ?? payload.status;
        const status = typeof candidateStatus === "number" && Number.isInteger(candidateStatus) && candidateStatus >= 400 && candidateStatus <= 599 ? candidateStatus : 0;
        const code = payload.code ?? payload.error ?? "STREAM_FAILED";
        const error = asCreditsExhaustedError(Object.assign(new Error(message), {
          code: payload.code,
          detail: payload.detail
        })) ?? new RundotApiError(code, message, status);
        push({
          kind: "error",
          error
        });
        cleanup();
      };
      const ensureStarted = async () => {
        if (started) return startPromise;
        started = true;
        startPromise = (async () => {
          const chunkSub = rpc.onNotification("H5_AI_CHAT_COMPLETION_STREAM_CHUNK", (payload) => {
            if (streamId === void 0) {
              pendingPreStart.push({
                kind: "chunk",
                payload
              });
              return;
            }
            if (payload.streamId !== streamId) return;
            push({
              kind: "chunk",
              value: payload.chunk
            });
          });
          const doneSub = rpc.onNotification("H5_AI_CHAT_COMPLETION_STREAM_DONE", (payload) => {
            if (streamId === void 0) {
              pendingPreStart.push({
                kind: "done",
                payload
              });
              return;
            }
            if (payload.streamId !== streamId) return;
            handleDoneNotification(payload);
          });
          const errSub = rpc.onNotification("H5_AI_CHAT_COMPLETION_STREAM_ERROR", (payload) => {
            if (streamId === void 0) {
              pendingPreStart.push({
                kind: "error",
                payload
              });
              return;
            }
            if (payload.streamId !== streamId) return;
            handleErrorNotification(payload);
          });
          subscriptions.push(chunkSub, doneSub, errSub);
          if (options?.signal) {
            if (options.signal.aborted) {
              push({
                kind: "error",
                error: /* @__PURE__ */ new Error("aborted")
              });
              cleanup();
              return;
            }
            onAbort = () => {
              sendAbortIfReady();
              push({
                kind: "error",
                error: /* @__PURE__ */ new Error("aborted")
              });
              cleanup();
            };
            options.signal.addEventListener("abort", onAbort);
          }
          try {
            streamId = (await rpc.call("H5_AI_CHAT_COMPLETION_STREAM_START", { request: wireRequest }, -1)).streamId;
            if (abortPending) {
              rpc.notify("H5_AI_CHAT_COMPLETION_STREAM_ABORT", { streamId });
              pendingPreStart.length = 0;
              return;
            }
            for (const buffered of pendingPreStart) {
              if (buffered.payload.streamId !== streamId) continue;
              if (buffered.kind === "chunk") push({
                kind: "chunk",
                value: buffered.payload.chunk
              });
              else if (buffered.kind === "done") {
                handleDoneNotification(buffered.payload);
                break;
              } else {
                handleErrorNotification(buffered.payload);
                break;
              }
            }
            pendingPreStart.length = 0;
          } catch (err) {
            push({
              kind: "error",
              error: err instanceof Error ? err : new Error(String(err))
            });
            cleanup();
          }
        })();
        return startPromise;
      };
      return {
        next: async () => {
          await ensureStarted();
          const item = await pull();
          if (item.kind === "chunk") return {
            value: item.value,
            done: false
          };
          if (item.kind === "error") throw item.error;
          return {
            value: void 0,
            done: true
          };
        },
        return: async () => {
          if (!ended) {
            sendAbortIfReady();
            push({ kind: "end" });
          }
          ended = true;
          cleanup();
          return {
            value: void 0,
            done: true
          };
        }
      };
    } };
  }
};
var MockAiApi = class MockAiApi2 {
  async decide(request) {
    const answers = {};
    for (const [qId, q] of Object.entries(request.questions)) if (q.type === "choice") {
      const firstKey = Object.keys(q.criteria)[0];
      if (!firstKey) throw new Error(`Mock decide: choice question "${qId}" has no criteria`);
      answers[qId] = {
        choice: firstKey,
        confidence: 1
      };
    } else if (q.type === "noul") answers[qId] = { noul: 1 };
    else if (q.type === "score") answers[qId] = {
      score: 1,
      confidence: 1
    };
    return {
      answers,
      usage: {
        inputTokens: 100,
        creditsDebited: 1,
        isMultimodal: false
      }
    };
  }
  async requestChatCompletionAsync(request) {
    if (request.tools !== void 0 && request.tools.length > 0) return this.buildMockToolCallResponse(request);
    console.warn("[RUN] AI completion API not available in mock mode");
    throw new Error("AI completion API requires backend connection");
  }
  async getAvailableCompletionModels() {
    console.warn("[RUN] AI models API not available in mock mode");
    throw new Error("AI models API requires backend connection");
  }
  /**
  * Canned stream so agent loops and tool flows can be exercised offline.
  *
  * Unlike the non-streaming sibling this does NOT throw: a streaming consumer
  * that cannot get a first chunk cannot be developed against the mock at all.
  * The text is prefixed `[mock]` so it is never mistaken for a real response.
  */
  requestChatCompletionStreamAsync(request, options) {
    return this.mockCompletionStream(request, options);
  }
  async requestPromptCompletionAsync(_request) {
    console.warn("[RUN] AI prompt completion API not available in mock mode");
    throw new Error("AI prompt completion API requires backend connection");
  }
  requestPromptCompletionStreamAsync(_request, _options) {
    return this.mockUnavailableStream("AI prompt completion");
  }
  /** Warn-now, throw-on-first-`next()` iterable shared by both mock stream methods. */
  mockUnavailableStream(apiName) {
    console.warn(`[RUN] ${apiName} API not available in mock mode`);
    return { [Symbol.asyncIterator]: () => ({ next: async () => {
      throw new Error(`${apiName} API requires backend connection`);
    } }) };
  }
  /**
  * One tool call on the first pass, then text once a tool result comes back,
  * so a tool loop terminates instead of calling the same tool forever.
  */
  async *mockCompletionStream(request, options) {
    const usage = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0
    };
    const tool = request.tools?.[0];
    if (tool && !MockAiApi2.hasToolResult(request)) {
      yield {
        type: "tool_call_chunk",
        index: 0,
        id: `mock-tool-${tool.name}-1`,
        name: tool.name
      };
      if (options?.signal?.aborted) return;
      yield {
        type: "tool_call_chunk",
        index: 0,
        argumentsDelta: "{}"
      };
      yield {
        type: "done",
        finishReason: "tool_calls",
        usage
      };
      return;
    }
    for (const text of [
      "[mock] ",
      "This is a canned response; ",
      "connect a backend for a real one."
    ]) {
      if (options?.signal?.aborted) return;
      yield {
        type: "delta",
        text
      };
    }
    yield {
      type: "done",
      finishReason: "stop",
      usage
    };
  }
  /** True once the conversation carries a tool result, i.e. a tool already ran. */
  static hasToolResult(request) {
    return request.messages.some((message) => Array.isArray(message.content) && message.content.some((block) => block.type === "tool_result"));
  }
  /**
  * Deterministic canned response when the request supplies tools. Always
  * invokes the first tool in the list with an empty argument object — keeps
  * SDK consumers' tool-flow unit tests stable without a real provider.
  */
  buildMockToolCallResponse(request) {
    const tool = request.tools[0];
    const toolCalls = [{
      id: `mock-tool-${tool.name}-1`,
      name: tool.name,
      input: {}
    }];
    return {
      id: "mock-completion-1",
      object: "chat.completion",
      created: 0,
      model: request.model ?? "mock",
      choices: [{
        index: 0,
        message: {
          role: "assistant",
          content: "",
          toolCalls
        },
        finish_reason: "tool_calls"
      }],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };
  }
};
function initializeAi(rundotGameApi, _host) {
  let warned2 = false;
  const warn = () => {
    if (!warned2) {
      console.warn("[RUN] RundotGameAPI.ai is deprecated. Use RundotGameAPI.textGen instead.");
      warned2 = true;
    }
  };
  rundotGameApi.ai = {
    async decide(request) {
      return rundotGameApi.textGen.decide(request);
    },
    async requestChatCompletionAsync(request) {
      warn();
      return rundotGameApi.textGen.requestChatCompletionAsync(request);
    },
    async getAvailableCompletionModels() {
      warn();
      return rundotGameApi.textGen.getAvailableCompletionModels();
    },
    requestChatCompletionStreamAsync(request, options) {
      warn();
      return rundotGameApi.textGen.requestChatCompletionStreamAsync(request, options);
    },
    async requestPromptCompletionAsync(request) {
      warn();
      return rundotGameApi.textGen.requestPromptCompletionAsync(request);
    },
    requestPromptCompletionStreamAsync(request, options) {
      warn();
      return rundotGameApi.textGen.requestPromptCompletionStreamAsync(request, options);
    }
  };
}
function isUnsupportedMessageError(error) {
  if (error instanceof Error) return error.message.includes("Unsupported message type") || error.message.includes("HANDLER_NOT_IMPLEMENTED");
  if (typeof error === "object" && error !== null && "error" in error) {
    const errStr = String(error.error);
    return errStr.includes("Unsupported message type") || errStr.includes("HANDLER_NOT_IMPLEMENTED");
  }
  return false;
}
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes.buffer;
}
function base64DecodeInto(base64, target, offset) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  if (offset < 0 || offset + len > target.length) throw new Error(`base64DecodeInto out of bounds: offset ${offset} + ${len} decoded bytes exceeds target of ${target.length} bytes`);
  for (let i = 0; i < len; i++) target[offset + i] = binaryString.charCodeAt(i);
  return len;
}
async function readAssetInChunks(source) {
  const { totalBytes, chunkBytes } = source;
  if (!Number.isSafeInteger(totalBytes) || totalBytes < 0) throw new Error(`Invalid chunked asset size: ${totalBytes}`);
  if (!Number.isSafeInteger(chunkBytes) || chunkBytes < 1) throw new Error(`Invalid chunk size: ${chunkBytes}`);
  const assembled = new Uint8Array(totalBytes);
  let received = 0;
  while (received < totalBytes) {
    const length = Math.min(chunkBytes, totalBytes - received);
    received += await readChunkWithRetry(source, received, length, assembled);
  }
  return assembled.buffer;
}
async function readChunkWithRetry(source, position, length, target) {
  try {
    return await readChunkInto(source, position, length, target);
  } catch {
    return readChunkInto(source, position, length, target);
  }
}
async function readChunkInto(source, position, length, target) {
  const decoded = base64DecodeInto(await source.readChunk(position, length), target, position);
  if (decoded === 0) throw new Error(`Empty chunk at position ${position} of ${target.length}`);
  if (decoded > length) throw new Error(`Chunk at position ${position} returned ${decoded} bytes, more than the ${length} requested`);
  return decoded;
}
var DEFAULT_CHUNK_BYTES = 2097152;
var RpcAssetLibraryApi = class {
  rpcClient;
  rundotGameApi;
  constructor(rpcClient, rundotGameApi) {
    this.rpcClient = rpcClient;
    this.rundotGameApi = rundotGameApi;
  }
  async getPackBaseUrl(packId, version) {
    try {
      const { baseUrl } = await this.rpcClient.call("H5_ASSET_LIBRARY_GET_PACK_BASE_URL", {
        packId,
        version
      });
      return baseUrl;
    } catch (error) {
      if (isUnsupportedMessageError(error)) return defaultPackBaseUrl(packId, version);
      throw error;
    }
  }
  async loadAssetsBundle(game, bundleKey, fileType = "stow") {
    try {
      return await this.loadViaHostRpc(bundleKey);
    } catch (err) {
      try {
        return await (await this.rundotGameApi.cdn.fetchFromCdn(`${game}/${bundleKey}.${fileType}`)).arrayBuffer();
      } catch (e) {
        throw new Error(`Failed to load ${bundleKey}`);
      }
    }
  }
  /**
  * Pull the asset from the host in chunks. Only a host that predates the
  * chunk protocol (BEGIN rejected with "Unsupported message type") falls
  * back to the legacy single-shot RPC. A failure DURING the chunked
  * transfer must NOT fall back to single-shot: pushing the whole asset
  * through the bridge in one message is the exact Android wedge this
  * protocol exists to avoid (venus issue #2749). Those errors propagate to
  * the caller's CDN fallback instead.
  */
  async loadViaHostRpc(bundleKey) {
    let begin;
    try {
      begin = await this.rpcClient.callT("H5_LOAD_EMBEDDED_ASSET_BEGIN", { assetKey: bundleKey });
    } catch (error) {
      if (isUnsupportedMessageError(error)) return this.loadSingleShot(bundleKey);
      throw error;
    }
    if (!Number.isSafeInteger(begin.maxChunkBytes) || begin.maxChunkBytes < 1) throw new Error(`Host returned invalid maxChunkBytes: ${begin.maxChunkBytes}`);
    return readAssetInChunks({
      totalBytes: begin.totalBytes,
      chunkBytes: Math.min(DEFAULT_CHUNK_BYTES, begin.maxChunkBytes),
      readChunk: async (position, length) => {
        return (await this.rpcClient.callT("H5_LOAD_EMBEDDED_ASSET_CHUNK", {
          assetKey: bundleKey,
          position,
          length
        })).base64Data;
      }
    });
  }
  async loadSingleShot(bundleKey) {
    return base64ToArrayBuffer((await this.rpcClient.callT("H5_LOAD_EMBEDDED_ASSET", { assetKey: bundleKey })).base64Data);
  }
};
function initializeAssetLibrary(rundotGameApiInstance, host) {
  rundotGameApiInstance.assetLibrary = host.assetLibrary;
  rundotGameApiInstance.sharedAssets = host.assetLibrary;
}
function initializeTextGen(rundotGameApi, host) {
  rundotGameApi.textGen = host.textGen;
}
var RpcAnalyticsApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async recordCustomEvent(eventName, payload) {
    this.rpcClient.notify("H5_LOG_ANALYTICS_EVENT", {
      eventName,
      params: payload
    });
  }
  async trackFunnelStep(stepNumber, stepName, funnelName, funnelOrder) {
    this.rpcClient.notify("H5_TRACK_FUNNEL_STEP", {
      stepNumber,
      stepName,
      funnelName,
      funnelOrder
    });
  }
};
function initializeAnalytics(rundotGameApiInstance, host) {
  rundotGameApiInstance.logCustomEvent = async (options) => {
    await host.analytics.recordCustomEvent(options.eventName, options.params);
  };
  rundotGameApiInstance.analytics = host.analytics;
}
var RpcAvatarApi = class RpcAvatarApi2 {
  static didWarn = false;
  warnDeprecated() {
    if (!RpcAvatarApi2.didWarn) {
      RpcAvatarApi2.didWarn = true;
      console.warn("[SDK] Avatar3D API is deprecated and will be removed in a future release.");
    }
  }
  rundotGameApi;
  rpcClient;
  constructor(rpcClient, rundotGameApi) {
    this.rpcClient = rpcClient;
    this.rundotGameApi = rundotGameApi;
  }
  async downloadAssetPaths() {
    this.warnDeprecated();
    const rundotGameApi = this.rundotGameApi;
    const manifestUrl = rundotGameApi.cdn.resolveAvatarAssetUrl("assets.json");
    const categories = (await this.fetchFromCdn(manifestUrl)).categories || {};
    const assetPaths = {};
    for (const categoryKey in categories) {
      const categoryData = categories[categoryKey];
      const categoryPath = categoryKey;
      assetPaths[categoryKey] = (categoryData?.assets || []).map((asset) => {
        return rundotGameApi.cdn.resolveAvatarAssetUrl(categoryPath + "/" + asset.filename);
      });
    }
    return assetPaths;
  }
  async downloadManifest() {
    this.warnDeprecated();
    const manifestUrl = this.rundotGameApi.cdn.resolveAvatarAssetUrl("assets.json");
    return await this.fetchFromCdn(manifestUrl);
  }
  async loadAvatar(avatarId) {
    this.warnDeprecated();
    return await this.rpcClient.call("H5_AVATAR3D_LOAD", { avatar3dId: avatarId });
  }
  saveAvatar(config) {
    this.warnDeprecated();
    return this.rpcClient.call("H5_AVATAR3D_SAVE", { config });
  }
  deleteAvatar() {
    this.warnDeprecated();
    return this.rpcClient.call("H5_AVATAR3D_DELETE");
  }
  async showEditor(options) {
    this.warnDeprecated();
    const rawResult = await this.rpcClient.call("H5_STACK_PUSH_REQUEST", {
      targetAppId: "AVATAR3D",
      contextData: options?.contextData || {},
      appParams: {
        currentAvatar: options?.currentAvatar,
        onSave: options?.onSave,
        onCancel: options?.onCancel
      }
    });
    return {
      wasChanged: rawResult.wasChanged || false,
      config: rawResult.config || null,
      savedAvatarId: rawResult.savedAvatarId || null
    };
  }
  async fetchFromCdn(url) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      mode: "cors",
      cache: "no-cache"
    });
    if (!response.ok) throw new Error(`CDN fetch failed: ${response.status} ${response.statusText}`);
    return await response.json();
  }
};
function initializeAvatar3d(rundotGameApi, host) {
  rundotGameApi.loadAvatar3dAsync = host.avatar3d.loadAvatar.bind(host.avatar3d);
  rundotGameApi.saveAvatar3dAsync = host.avatar3d.saveAvatar.bind(host.avatar3d);
  rundotGameApi.deleteAvatar3dAsync = host.avatar3d.deleteAvatar.bind(host.avatar3d);
  rundotGameApi.downloadAvatar3dManifestAsync = host.avatar3d.downloadManifest.bind(host.avatar3d);
  rundotGameApi.showAvatar3dEditorAsync = host.avatar3d.showEditor.bind(host.avatar3d);
  rundotGameApi.downloadAvatar3dAssetPathsAsync = host.avatar3d.downloadAssetPaths.bind(host.avatar3d);
}
var FILE_EXTENSION_PATTERN = /\.(html?|php|jsp|aspx?)$/i;
var PER_APP_SUBDOMAIN_HOST_PATTERN = /^[a-z0-9-]+\.h5-apps\.(?:[a-z0-9-]+\.)?getreel\.com$/;
var PER_APP_LOCAL_HOST_PATTERN = /^[a-z0-9-]+\.h5-apps\.localhost(?::\d+)?$/;
function isPerAppSubdomain(host) {
  return PER_APP_SUBDOMAIN_HOST_PATTERN.test(host) || PER_APP_LOCAL_HOST_PATTERN.test(host);
}
function cleanPathSegments(url) {
  const pathParts = url.pathname.split("/").filter((part) => part.length > 0);
  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart && FILE_EXTENSION_PATTERN.test(lastPart)) return pathParts.slice(0, -1);
  return pathParts;
}
function parseCdnLocationFromUrl(url) {
  if (isPerAppSubdomain(url.host)) {
    const cleanedParts2 = cleanPathSegments(url);
    if (cleanedParts2.length < 1) return null;
    const gameId2 = url.host.split(".")[0];
    const version2 = cleanedParts2[0];
    return {
      bucketBaseUrl: url.origin,
      gameId: gameId2,
      version: version2,
      shape: "per-app"
    };
  }
  const cleanedParts = cleanPathSegments(url);
  if (cleanedParts.length < 3) return null;
  const version = cleanedParts[cleanedParts.length - 1];
  const gameId = cleanedParts[cleanedParts.length - 2];
  const bucketPath = cleanedParts.slice(0, -2).join("/");
  return {
    bucketBaseUrl: bucketPath ? `${url.origin}/${bucketPath}` : url.origin,
    gameId,
    version,
    shape: "legacy"
  };
}
function parseCdnLocationFromWindow() {
  if (typeof window === "undefined") return null;
  try {
    return parseCdnLocationFromUrl(new URL(window.location.href));
  } catch {
    return null;
  }
}
var HostCdnApi = class HostCdnApi2 extends BaseCdnApi {
  static CDN_FOLDER_NAME = "cdn-assets";
  static MANIFEST_FILE_PREFIX = "manifest_";
  static SHARED_ASSETS_CDN_BASE = "https://venus-static-01293ak.web.app";
  bucketBaseUrl;
  gameId;
  version;
  shape;
  rpcClient;
  manifestCache = null;
  manifestPromise = null;
  constructor(rpcClient) {
    super();
    this.rpcClient = rpcClient;
    const { bucketBaseUrl, gameId, version, shape } = this.computeCdnInfo();
    this.bucketBaseUrl = this.normalizeBaseUrl(bucketBaseUrl);
    this.gameId = gameId;
    this.version = version;
    this.shape = shape;
  }
  getCdnAssetsBaseUrl() {
    if (this.shape === "per-app") return `${this.bucketBaseUrl}/${HostCdnApi2.CDN_FOLDER_NAME}`;
    return `${this.bucketBaseUrl}/${this.gameId}/${HostCdnApi2.CDN_FOLDER_NAME}`;
  }
  getCdnBaseUrl() {
    return this.bucketBaseUrl;
  }
  getSharedAssetsCdnBaseUrl() {
    return HostCdnApi2.SHARED_ASSETS_CDN_BASE;
  }
  /**
  * Compute CDN information from the current window location.
  *
  * Accepts both supported URL shapes — see `parseCdnLocationFromUrl` in
  * cdn-url-utils for the layouts. The shape discriminator is propagated
  * to {@link getCdnAssetsBaseUrl}.
  *
  * @throws {Error} If not in browser environment or URL structure doesn't match either expected shape
  */
  computeCdnInfo() {
    if (typeof window === "undefined") throw new Error("[RUN] Cannot construct CDN URL: window is undefined (not in browser environment)");
    const location = parseCdnLocationFromWindow();
    if (location === null) throw new Error(`[RUN] Cannot construct CDN URL: location matches neither per-app subdomain (<gameId>.h5-apps.<env>.getreel.com/<version>/...) nor legacy single-host (/{bucket}/{gameId}/{version}/...). Got: ${window.location.href}`);
    return location;
  }
  /**
  * Fetch directly from CDN root (bucket root).
  * This is the primitive fetch operation that accesses files from the bucket base URL.
  *
  * @param subPath - Path relative to bucket root (e.g., "othergame/bundle.stow", "game123/cdn-assets/file.png")
  * @param options - Optional fetch options including timeout
  * @returns Promise<Blob> - The asset data as a Blob
  *
  * @example
  * // App URL: https://h5-apps.dev.com/development/game123/v1.0.0/
  * // fetchFromCdn("othergame/asset.png")
  * // → https://h5-apps.dev.com/development/othergame/asset.png
  */
  async fetchFromCdn(subPath, options) {
    const url = this.buildCdnUrl(subPath, this.bucketBaseUrl);
    return this.executeFetch(url, options);
  }
  /**
  * Resolve a logical asset path to its actual CDN URL.
  * Uses RPC to delegate resolution to the Client App (which handles entitlements
  * and signed URLs). Falls back to legacy manifest-based resolution if the
  * Client App doesn't have the CDN handler.
  */
  async resolveAssetUrl(subPath) {
    const normalizedPath = this.cleanSubPath(subPath);
    try {
      return (await this.rpcClient.call("H5_CDN_RESOLVE_ASSET_URL", { assetPath: normalizedPath })).url;
    } catch (error) {
      if (this.isUnsupportedMessageError(error)) return this.legacyResolveAssetUrl(normalizedPath);
      throw error;
    }
  }
  /**
  * Batch resolve multiple asset paths to their CDN URLs.
  * Returns per-path results — a missing entitlement on one path does not fail the batch.
  */
  async resolveAssetUrls(subPaths) {
    const normalizedPaths = subPaths.map((p) => this.cleanSubPath(p));
    try {
      return (await this.rpcClient.call("H5_CDN_RESOLVE_ASSET_URLS", { assetPaths: normalizedPaths })).results;
    } catch (error) {
      if (this.isUnsupportedMessageError(error)) return this.legacyResolveAssetUrls(subPaths, normalizedPaths);
      throw error;
    }
  }
  /**
  * Refresh the Client App's entitlement cache.
  * Call after a purchase or reward grant so newly acquired entitlements take effect.
  */
  async refreshEntitlements() {
    try {
      await this.rpcClient.call("H5_CDN_REFRESH_ENTITLEMENTS", {});
    } catch (error) {
      if (this.isUnsupportedMessageError(error)) return;
      throw error;
    }
  }
  /**
  * Legacy fallback — fetches manifest directly and builds public URL.
  * Only works for public assets. Protected assets throw a clear error.
  */
  async legacyResolveAssetUrl(normalizedPath) {
    const manifest = await this.getManifestLegacy();
    const entry = manifest.files[normalizedPath];
    if (!entry) throw new Error(`[RUN] Asset not found in manifest: ${normalizedPath}. Available paths: ${Object.keys(manifest.files).join(", ")}`);
    const hash = typeof entry === "string" ? entry : entry.hash;
    if (typeof entry === "object" && entry.protected === true) throw new Error(`[RUN] Asset "${normalizedPath}" requires entitlement validation. Update the Client App to a version that supports CDN entitlements.`);
    const extensionMatch = normalizedPath.match(/\.([^.]+)$/);
    const extension = extensionMatch ? extensionMatch[1] : "";
    const actualFilename = extension ? `${hash}.${extension}` : hash;
    return this.buildCdnUrl(actualFilename, this.getCdnAssetsBaseUrl());
  }
  async legacyResolveAssetUrls(originalPaths, normalizedPaths) {
    return Promise.all(normalizedPaths.map(async (p, i) => {
      try {
        const url = await this.legacyResolveAssetUrl(p);
        return {
          path: originalPaths[i],
          status: "ok",
          url
        };
      } catch (error) {
        const isEntitlementError = error instanceof Error && error.message.includes("requires entitlement validation");
        return {
          path: originalPaths[i],
          status: "error",
          error: isEntitlementError ? "ENTITLEMENT_REQUIRED" : "ASSET_NOT_FOUND"
        };
      }
    }));
  }
  isUnsupportedMessageError(error) {
    if (error instanceof Error) return error.message.includes("Unsupported message type");
    if (typeof error === "object" && error !== null && "error" in error) return String(error.error).includes("Unsupported message type");
    return false;
  }
  /**
  * Fetch an asset using the manifest to resolve the actual hashed filename.
  *
  * @param relativePath - The logical path to the asset (e.g., "/assets/sample.json" or "assets/sample.json")
  * @param options - Optional fetch options including timeout
  * @returns Promise<Blob> - The asset data as a Blob
  * @throws {Error} If the asset is not found in the manifest or the fetch fails
  */
  async fetchAsset(relativePath, options) {
    const resolvedUrl = await this.resolveAssetUrl(relativePath);
    return this.executeFetch(resolvedUrl, options);
  }
  /**
  * Get the manifest (legacy fallback), either from cache or by fetching it.
  * Uses promise caching to prevent multiple simultaneous fetches.
  */
  async getManifestLegacy() {
    if (this.manifestCache) return this.manifestCache;
    if (this.manifestPromise) return this.manifestPromise;
    this.manifestPromise = this.fetchManifestLegacy();
    try {
      const manifest = await this.manifestPromise;
      this.manifestCache = manifest;
      return manifest;
    } finally {
      this.manifestPromise = null;
    }
  }
  /**
  * Fetch the manifest file from the CDN (legacy fallback).
  * The manifest filename is based on the version: manifest_{version}.json
  */
  async fetchManifestLegacy() {
    const manifestFilename = `${HostCdnApi2.MANIFEST_FILE_PREFIX}${this.version}.json`;
    const manifestUrl = this.buildCdnUrl(manifestFilename, this.getCdnAssetsBaseUrl());
    try {
      const response = await fetch(manifestUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
        cache: "default"
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const manifest = await response.json();
      if (!manifest.files || typeof manifest.files !== "object") throw new Error('Invalid manifest structure: missing or invalid "files" property');
      return manifest;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`[RUN] Failed to fetch CDN manifest (${manifestFilename}): ${message}`);
    }
  }
};
function initializeCdn(rundotGameApi, host) {
  rundotGameApi.cdn = host.cdn;
}
var HostDeviceApi = class {
  rundotGameApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  getDevice() {
    const device = this.rundotGameApi._deviceData;
    if (!device) throw new Error("[RUN] Device info not available. You must await RundotGameAPI.initializeAsync() before calling getDevice(). INIT_SDK has not completed.");
    return device;
  }
};
var HostEnvironmentApi = class {
  rundotGameApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  getEnvironment() {
    const environment = this.rundotGameApi._environmentData;
    if (!environment) throw new Error("[RUN] Environment info not available. You must await RundotGameAPI.initializeAsync() before calling getEnvironment(). INIT_SDK has not completed.");
    return {
      ...environment,
      capabilities: {
        ads: environment.capabilities?.ads ?? true,
        purchases: environment.capabilities?.purchases ?? true,
        subscriptions: environment.capabilities?.subscriptions ?? environment.capabilities?.purchases ?? true,
        fullscreen: environment.capabilities?.fullscreen ?? "unavailable",
        pointerLock: environment.capabilities?.pointerLock ?? false,
        cta: environment.capabilities?.cta ?? environment.executionMode === "playable",
        persistence: environment.capabilities?.persistence ?? "cloud",
        online: environment.capabilities?.online ?? true
      },
      isSteamDesktop: environment.isSteamDesktop ?? false,
      isSteamDeck: environment.isSteamDeck ?? false,
      executionMode: environment.executionMode ?? "full",
      playableInfo: environment.playableInfo
    };
  }
};
var FULLSCREEN_QUERY_TIMEOUT_MS = 1e3;
var FULLSCREEN_MUTATION_TIMEOUT_MS = 5e3;
var INACTIVE_FULLSCREEN_STATE = {
  active: false,
  pointerLocked: false
};
var HostSystemApi = class {
  deviceApi;
  environmentApi;
  rundotGameApi;
  rpcClient;
  fullscreenKeyTarget;
  fullscreenState = { ...INACTIVE_FULLSCREEN_STATE };
  /**
  * Monotonic per-mutation stamp. Responses can arrive out of order, and an
  * older one must never overwrite the state a newer call already applied.
  */
  fullscreenSequence = 0;
  appliedSequence = 0;
  fullscreenMutationVersion = 0;
  pendingFullscreenMutations = 0;
  constructor(deviceApi, environmentApi, rundotGameApi, rpcClient, fullscreenKeyTarget = typeof window === "undefined" ? null : window) {
    this.deviceApi = deviceApi;
    this.environmentApi = environmentApi;
    this.rundotGameApi = rundotGameApi;
    this.rpcClient = rpcClient;
    this.fullscreenKeyTarget = fullscreenKeyTarget;
    this.rpcClient.onNotification("H5_SYSTEM_FULLSCREEN_STATE_CHANGED", (state) => this.trackFullscreenState(state));
    this.fullscreenKeyTarget?.addEventListener("keydown", this.handleFullscreenKeyDown);
  }
  getDevice() {
    return this.deviceApi.getDevice();
  }
  getEnvironment() {
    return this.environmentApi.getEnvironment();
  }
  getSafeArea() {
    const safeArea = this.rundotGameApi._safeAreaData;
    if (!safeArea) throw new Error("[RUN] getSafeArea() called before initialization. Call RundotGameAPI.initializeAsync() first.");
    return { ...safeArea };
  }
  isMobile() {
    const environment = this.environmentApi.getEnvironment();
    if (environment.platform === "ios" || environment.platform === "android") return true;
    if (environment.browserInfo) return environment.browserInfo.isMobile;
    return true;
  }
  isWeb() {
    const environment = this.environmentApi.getEnvironment();
    if (environment.platform === "web") return true;
    if (environment.browserInfo && !environment.browserInfo.isMobile) return true;
    return false;
  }
  isSteamDesktop() {
    return this.environmentApi.getEnvironment().isSteamDesktop;
  }
  isSteamDeck() {
    return this.environmentApi.getEnvironment().isSteamDeck;
  }
  async canAddToHomeScreen() {
    const response = await this.rpcClient.call("H5_SYSTEM_CAN_ADD_TO_HOME_SCREEN", {});
    return Boolean(response?.canAdd);
  }
  async addToHomeScreen() {
    const response = await this.rpcClient.call("H5_SYSTEM_ADD_TO_HOME_SCREEN", {}, -1);
    return { added: Boolean(response?.added) };
  }
  async requestFullscreen(options = {}) {
    return this.mutate("H5_SYSTEM_REQUEST_FULLSCREEN", options, () => ({ ...this.fullscreenState }));
  }
  async exitFullscreen() {
    return this.mutate("H5_SYSTEM_EXIT_FULLSCREEN", {}, () => ({ ...this.fullscreenState }));
  }
  async setPointerLock(locked) {
    return this.mutate("H5_SYSTEM_SET_POINTER_LOCK", { locked }, () => ({
      ...this.fullscreenState,
      reason: "timeout"
    }));
  }
  async mutate(message, payload, onFailure) {
    const sequence = ++this.fullscreenSequence;
    this.fullscreenMutationVersion += 1;
    this.pendingFullscreenMutations += 1;
    try {
      const state = await this.rpcClient.call(message, payload, FULLSCREEN_MUTATION_TIMEOUT_MS);
      this.trackFullscreenState(state, sequence);
      return state;
    } catch {
      const failureState = onFailure();
      this.trackFullscreenState(failureState, sequence);
      return failureState;
    } finally {
      this.pendingFullscreenMutations -= 1;
    }
  }
  canFullscreen() {
    return this.getEnvironment().capabilities?.fullscreen === "toggleable";
  }
  async getFullscreenState() {
    const sequence = ++this.fullscreenSequence;
    const mutationVersion = this.fullscreenMutationVersion;
    const mutationWasPending = this.pendingFullscreenMutations > 0;
    try {
      const state = await this.rpcClient.call("H5_SYSTEM_GET_FULLSCREEN_STATE", {}, FULLSCREEN_QUERY_TIMEOUT_MS);
      if (!mutationWasPending && mutationVersion === this.fullscreenMutationVersion) this.trackFullscreenState(state, sequence);
      return state;
    } catch {
      return { ...INACTIVE_FULLSCREEN_STATE };
    }
  }
  onFullscreenStateChange(listener) {
    const subscription = this.rpcClient.onNotification("H5_SYSTEM_FULLSCREEN_STATE_CHANGED", listener);
    return () => subscription.unsubscribe();
  }
  onPointerInput(listener) {
    const subscription = this.rpcClient.onNotification("H5_SYSTEM_POINTER_INPUT", listener);
    return () => subscription.unsubscribe();
  }
  trackFullscreenState(state, sequence) {
    if (sequence !== void 0) {
      if (sequence < this.appliedSequence) return;
      this.appliedSequence = sequence;
    }
    this.fullscreenState = {
      active: state.active === true,
      pointerLocked: state.pointerLocked === true
    };
  }
  /**
  * Escape frees the cursor before it quits.
  *
  * While the cursor is captured this does nothing: the engine consumes that
  * Escape to release the lock, and quitting as well would skip the free-cursor
  * fullscreen state a pause menu lives in. Only a fullscreen state with a free
  * cursor exits.
  *
  * This handler is the PRIMARY path, not a duplicate of the host controller's:
  * key events inside a cross-origin game iframe do not bubble to the host
  * document, so while the player is in the game only this one sees the key.
  *
  * Some engines exit lock and fullscreen together and deliver no keydown at
  * all. That is why games must treat the state events as the truth.
  */
  handleFullscreenKeyDown = (event) => {
    if (event.key !== "Escape" || !this.fullscreenState.active || this.fullscreenState.pointerLocked || this.isSteamDeck()) return;
    this.exitFullscreen();
  };
};
function initializeSystem(rundotGameApi, host) {
  rundotGameApi.system = host.system;
  rundotGameApi.isMobile = () => {
    console.warn("[RUN] DEPRECATED: RundotGameAPI.isMobile() is deprecated. Use RundotGameAPI.system.isMobile() instead.");
    return host.system.isMobile();
  };
  rundotGameApi.isWeb = () => {
    console.warn("[RUN] DEPRECATED: RundotGameAPI.isWeb() is deprecated. Use RundotGameAPI.system.isWeb() instead.");
    return host.system.isWeb();
  };
}
var RpcFeaturesApi = class {
  rpcClient;
  constructor(rcpClient) {
    this.rpcClient = rcpClient;
  }
  async getExperiment(experimentName) {
    return await this.rpcClient.call("H5_GET_EXPERIMENT", { experimentName });
  }
  async getFeatureFlag(flagName) {
    return await this.rpcClient.call("H5_GET_FEATURE_FLAG", { flagName });
  }
  async getFeatureGate(gateName) {
    return await this.rpcClient.call("H5_GET_FEATURE_GATE", { gateName });
  }
};
function initializeFeaturesApi(rundotGameApi, host) {
  rundotGameApi.getExperiment = (options) => {
    return host.features.getExperiment(options.experimentName);
  };
  rundotGameApi.getFeatureGate = (options) => {
    return host.features.getFeatureGate(options.gateName);
  };
  rundotGameApi.getFeatureFlag = (options) => {
    return host.features.getFeatureFlag(options.flagName);
  };
}
var RpcLiveOpsApi = class {
  cache;
  constructor(rpcClient, hooks) {
    this.cache = new LiveOpsCache(() => rpcClient.call("H5_GET_LIVEOPS_CONFIG", {}), hooks);
  }
  clearConfigCache() {
    this.cache.clear();
  }
  getConfigAsync(options) {
    return this.cache.getConfig(options?.maxAgeMs);
  }
  getRawConfigAsync(options) {
    return this.cache.getRaw(options?.maxAgeMs);
  }
};
var MockLiveOpsApi = class {
  getClient;
  hooks;
  explicitClient;
  configured = false;
  deduper;
  constructor(getClient, hooks) {
    this.getClient = getClient;
    this.hooks = hooks;
    this.deduper = new ExposureDeduper(hooks?.onExposure);
  }
  /** Explicit override (wins over the provider). Used by tests and programmatic setup. */
  configure(config) {
    this.explicitClient = config.client;
    this.configured = true;
  }
  clearConfigCache() {
  }
  resolveClient() {
    if (this.configured) return this.explicitClient;
    return this.getClient?.();
  }
  async getConfigAsync() {
    const unitId = this.hooks?.getUnitId?.();
    const resolved = resolveLiveOpsSection(this.resolveClient(), Date.now(), unitId);
    if (unitId !== void 0) this.deduper.record(unitId, resolved.assignments, "mock");
    return {
      ...resolved,
      configVersion: "mock"
    };
  }
  async getRawConfigAsync() {
    const client = this.resolveClient();
    return {
      values: client?.values ?? {},
      overrides: client?.overrides ?? [],
      experiments: client?.experiments ?? [],
      configVersion: "mock",
      serverTimeMs: Date.now()
    };
  }
};
function initializeLiveOps(rundotGameApi, host) {
  rundotGameApi.liveops = {
    getConfigAsync: (options) => host.liveops.getConfigAsync(options),
    getRawConfigAsync: (options) => host.liveops.getRawConfigAsync(options)
  };
}
var RpcHapticsApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async triggerHapticAsync(style) {
    await this.rpcClient.call("H5_TRIGGER_HAPTIC", { style });
  }
};
function initializeHaptics(rundotGameApi, host) {
  rundotGameApi.triggerHapticAsync = (style) => {
    return host.haptics.triggerHapticAsync(style);
  };
}
var VALID_SOURCES = [
  "web-gamepad",
  "steam-input",
  "ios-gamecontroller",
  "android-input"
];
var DEFAULT_WINDOW_SIZE = 120;
var DEFAULT_HANDSHAKE_TIMEOUT_MS = 5e3;
var DEFAULT_LATENCY_EMIT_INTERVAL_MS = 5e3;
var LATENCY_EVENT = "gamepad.latency";
function nowMs2() {
  return typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
}
function finiteOr2(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function clamp2(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function integerIndex(raw) {
  if (!raw || typeof raw !== "object") return null;
  const index = raw.index;
  return typeof index === "number" && Number.isInteger(index) ? index : null;
}
function coerceButton(raw) {
  if (raw && typeof raw === "object") {
    const button = raw;
    const pressed = button.pressed === true;
    return {
      pressed,
      value: clamp2(finiteOr2(button.value, pressed ? 1 : 0), 0, 1)
    };
  }
  return {
    pressed: false,
    value: 0
  };
}
var RpcGamepadApi = class {
  rpc;
  supported = false;
  mode = null;
  tornDown = false;
  /** Set once the handshake settles to an unsupported state. */
  serveDisabled = false;
  cache = /* @__PURE__ */ new Map();
  lastSourceByIndex = /* @__PURE__ */ new Map();
  connectedSubscribers = /* @__PURE__ */ new Set();
  disconnectedSubscribers = /* @__PURE__ */ new Set();
  notificationSubscriptions = [];
  latency;
  reader = null;
  handshakePromise = Promise.resolve();
  pagehideListener = null;
  latencyEmitTimer = null;
  timeoutMs;
  constructor(rpc, options = {}) {
    this.rpc = rpc;
    this.latency = new LatencyTracker({
      windowSize: DEFAULT_WINDOW_SIZE,
      enabled: options.debug === true
    });
    this.timeoutMs = options.timeoutMs ?? DEFAULT_HANDSHAKE_TIMEOUT_MS;
    if (options.debug === true) {
      const intervalMs = options.latencyEmitIntervalMs ?? DEFAULT_LATENCY_EMIT_INTERVAL_MS;
      this.latencyEmitTimer = setInterval(() => this.emitLatency(), intervalMs);
      this.latencyEmitTimer?.unref?.();
    }
    this.notificationSubscriptions.push(rpc.onNotification("GAMEPAD_SNAPSHOT", (p) => this.handleSnapshot(p)), rpc.onNotification("GAMEPAD_CONNECTED", (p) => this.handleConnected(p)), rpc.onNotification("GAMEPAD_DISCONNECTED", (p) => this.handleDisconnected(p)));
    if (typeof window !== "undefined") {
      this.pagehideListener = () => this.teardown();
      window.addEventListener("pagehide", this.pagehideListener);
    }
    if (options.autoSubscribe !== false) this.subscribe();
  }
  /** Issues the awaited `GAMEPAD_SUBSCRIBE` handshake. The host's response is the
  * sole tier authority (MUST-22/23). */
  subscribe() {
    if (this.tornDown) return this.handshakePromise;
    const webGamepadAvailable = canReadWebGamepads();
    this.handshakePromise = this.rpc.call("H5_GAMEPAD_SUBSCRIBE", { webGamepadAvailable }, this.timeoutMs).then((response) => this.applyHandshake(response)).catch(() => this.failHandshake());
    return this.handshakePromise;
  }
  /** Resolves once the handshake settles (success or failure). Never rejects. */
  ready() {
    return this.handshakePromise;
  }
  isSupported() {
    return this.supported && !this.tornDown;
  }
  getGamepads() {
    if (this.tornDown) return [];
    if (this.mode === "tier1") return this.reader ? this.reader.read() : [];
    if (this.serveDisabled) return [];
    return [...this.cache.values()].filter((snapshot) => snapshot.connected);
  }
  onConnected(callback) {
    this.connectedSubscribers.add(callback);
    for (const pad of this.getGamepads()) callback({
      index: pad.index,
      id: pad.id,
      source: pad.source
    });
    return { unsubscribe: () => this.connectedSubscribers.delete(callback) };
  }
  onDisconnected(callback) {
    this.disconnectedSubscribers.add(callback);
    return { unsubscribe: () => this.disconnectedSubscribers.delete(callback) };
  }
  __debug = { getLatencyStats: () => this.latency.getStats() };
  emitLatency() {
    if (this.tornDown) return;
    const stats = this.latency.getStats();
    if (stats.sampleCount === 0) return;
    this.rpc.notify("H5_DEBUG", {
      event: LATENCY_EVENT,
      ...stats
    });
  }
  teardown() {
    if (this.tornDown) return;
    this.tornDown = true;
    this.supported = false;
    this.mode = null;
    if (this.latencyEmitTimer !== null) {
      clearInterval(this.latencyEmitTimer);
      this.latencyEmitTimer = null;
    }
    for (const subscription of this.notificationSubscriptions) subscription.unsubscribe();
    this.notificationSubscriptions.length = 0;
    this.stopReader();
    this.cache.clear();
    this.lastSourceByIndex.clear();
    if (this.pagehideListener && typeof window !== "undefined") {
      window.removeEventListener("pagehide", this.pagehideListener);
      this.pagehideListener = null;
    }
    this.rpc.notify("H5_GAMEPAD_UNSUBSCRIBE", {});
  }
  applyHandshake(response) {
    if (this.tornDown) return;
    const mode = parseMode(response);
    if (!mode) {
      this.markUnsupported();
      return;
    }
    this.stopReader();
    this.supported = true;
    this.mode = mode;
    this.serveDisabled = false;
    if (mode === "tier1") {
      this.reader = this.rpc.createWebGamepadReader?.() ?? new WebGamepadReader();
      this.reader.start(() => {
      }, (event) => this.dispatchConnected(event), (event) => this.dispatchDisconnected(event));
    }
  }
  failHandshake() {
    if (this.tornDown) return;
    this.markUnsupported();
  }
  markUnsupported() {
    this.supported = false;
    this.mode = null;
    this.serveDisabled = true;
    this.cache.clear();
    this.stopReader();
  }
  stopReader() {
    if (this.reader) {
      this.reader.stop();
      this.reader = null;
    }
  }
  handleSnapshot(raw) {
    if (this.tornDown || this.mode !== "tier2" || this.serveDisabled) return;
    const index = integerIndex(raw);
    if (index === null) return;
    const snapshot = this.coerceSnapshot(raw, index);
    this.cache.set(index, snapshot);
    this.lastSourceByIndex.set(index, snapshot.source);
    this.latency.add(snapshot.sourceTimestamp, snapshot.deliveredTimestamp);
  }
  handleConnected(raw) {
    if (this.tornDown || this.mode !== "tier2") return;
    const index = integerIndex(raw);
    if (index === null) return;
    this.dispatchConnected(this.coerceConnection(raw, index));
  }
  handleDisconnected(raw) {
    if (this.tornDown || this.mode !== "tier2") return;
    const index = integerIndex(raw);
    if (index === null) return;
    this.cache.delete(index);
    this.dispatchConnection(this.disconnectedSubscribers, this.coerceConnection(raw, index));
  }
  dispatchConnected(event) {
    this.dispatchConnection(this.connectedSubscribers, event);
  }
  dispatchDisconnected(event) {
    this.dispatchConnection(this.disconnectedSubscribers, event);
  }
  dispatchConnection(subscribers, event) {
    for (const callback of [...subscribers]) callback(event);
  }
  coerceSnapshot(raw, index) {
    const buttons = {};
    const rawButtons = raw.buttons && typeof raw.buttons === "object" ? raw.buttons : {};
    for (const name of GAMEPAD_BUTTON_NAMES) buttons[name] = coerceButton(rawButtons[name]);
    const rawAxes = raw.axes && typeof raw.axes === "object" ? raw.axes : {};
    const axes = {
      leftX: clamp2(finiteOr2(rawAxes.leftX, 0), -1, 1),
      leftY: clamp2(finiteOr2(rawAxes.leftY, 0), -1, 1),
      rightX: clamp2(finiteOr2(rawAxes.rightX, 0), -1, 1),
      rightY: clamp2(finiteOr2(rawAxes.rightY, 0), -1, 1)
    };
    return {
      index,
      id: typeof raw.id === "string" ? raw.id : "",
      connected: raw.connected === true,
      source: this.resolveSource(raw.source, index),
      standardMapping: raw.standardMapping === true,
      buttons,
      axes,
      sourceTimestamp: finiteOr2(raw.sourceTimestamp, nowMs2()),
      deliveredTimestamp: finiteOr2(raw.deliveredTimestamp, nowMs2())
    };
  }
  coerceConnection(raw, index) {
    return {
      index,
      id: typeof raw.id === "string" ? raw.id : "",
      source: this.resolveSource(raw.source, index)
    };
  }
  /** Tier 2 spans multiple providers; trust the host's stamped source, else
  * reuse the last valid source for this index, else any cached pad's source,
  * else an explicitly-arbitrary guard (MUST-26). */
  resolveSource(rawSource, index) {
    if (typeof rawSource === "string" && VALID_SOURCES.includes(rawSource)) return rawSource;
    const lastForIndex = this.lastSourceByIndex.get(index);
    if (lastForIndex) return lastForIndex;
    const anyCached = this.cache.values().next().value;
    if (anyCached) return anyCached.source;
    return "steam-input";
  }
};
function parseMode(response) {
  if (!response || typeof response !== "object") return null;
  const typed = response;
  if (typed.supported !== true) return null;
  if (typed.mode === "tier1" || typed.mode === "tier2") return typed.mode;
  return null;
}
function initializeGamepad(rundotGameApiInstance, host) {
  rundotGameApiInstance.gamepad = host.gamepad;
}
var RpcIapApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async getHardCurrencyBalance() {
    return await this.rpcClient.call("H5_IAP_GET_WALLET");
  }
  async spendCurrency(productId, cost, options) {
    return await this.rpcClient.callT("H5_IAP_SPEND_CURRENCY", {
      amount: cost,
      productId,
      screenName: options?.screenName,
      description: options?.description,
      beneficiaryId: options?.beneficiaryId,
      contentEntryId: options?.contentEntryId
    }, -1);
  }
  /**
  * gets the subscription packages for a given tier. If no tier is provided, returns all subscription
  * packages for all tiers
  */
  async getSubscriptions(tier) {
    return await this.rpcClient.callT("H5_IAP_GET_SUBSCRIPTIONS", { tier }, -1);
  }
  /**
  * triggers the checkout for a given subscription, identified by tier and interval.
  * Rejects with a `RundotApiError` (`UNSUPPORTED_SUBSCRIPTION_INTERVAL`) before
  * any checkout when the tier does not offer that interval — LITE is weekly-only.
  * @example
  * // will trigger the checkout for the weekly CORE subscription
  * await purchaseSubscription('CORE', 'weekly')
  */
  async purchaseSubscription(tier, interval) {
    assertTierSupportsInterval(tier, interval);
    return await this.rpcClient.callT("H5_IAP_PURCHASE_SUBSCRIPTION", {
      tier,
      interval
    }, -1);
  }
  /**
  * Check if a user has a given subscription tier. If the user has a higher
  * subscription tier than the one being checked, this returns true.
  *
  * @example
  * // Returns true if the user has CORE, PLUS, PRIME, or ULTIMATE
  * await isUserSubscribed('CORE');
  *
  * // Returns true only if the user has ULTIMATE
  * await isUserSubscribed('ULTIMATE');
  */
  async isUserSubscribed(tier) {
    return await this.rpcClient.callT("H5_IAP_GET_PLAYER_SUBSCRIPTION_INFO", { tier }, -1);
  }
  async openStore() {
    return await this.rpcClient.call("H5_IAP_OPEN_STORE", void 0, -1);
  }
  async getCurrencyIcon(options) {
    return await this.rpcClient.callT("H5_IAP_GET_CURRENCY_ICON", options ?? {});
  }
  async hasUserMadePurchase() {
    return await this.rpcClient.call("H5_IAP_HAS_USER_MADE_PURCHASE");
  }
  /**
  * The host scopes this to the running game itself, so no game id is sent.
  * The legacy argument is accepted and ignored for source compatibility.
  */
  async listDirectPurchaseSkus(_legacyGameId) {
    return await this.rpcClient.callT("H5_IAP_LIST_DIRECT_PURCHASE_SKUS", {}, -1);
  }
};
function initializeIap(rundotGameApiInstance, host) {
  rundotGameApiInstance.iap = host.iap;
}
var RpcCreditsApi = class {
  rpcClient;
  autoPaywallOnExhaustion = true;
  autoRetryOnPurchase = true;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async getBillingContext() {
    return this.rpcClient.call("H5_CREDITS_GET_CONTEXT");
  }
  async getBalance() {
    return this.rpcClient.call("H5_CREDITS_GET_BALANCE");
  }
  async getSubscription() {
    return this.rpcClient.call("H5_CREDITS_GET_SUBSCRIPTION");
  }
  async getPlans() {
    const catalog = await this.rpcClient.call("H5_CREDITS_GET_PLANS");
    return {
      ...catalog,
      plansUnavailable: catalog.plansUnavailable === true
    };
  }
  async estimateGenerationCost(request) {
    return this.rpcClient.callT("H5_CREDITS_ESTIMATE_GENERATION_COST", request);
  }
  async openPaywall(options) {
    return this.rpcClient.callT("H5_CREDITS_OPEN_PAYWALL", options ?? {}, -1);
  }
  setAutoPaywallOnExhaustion(enabled) {
    this.autoPaywallOnExhaustion = enabled;
    this.pushConfig({ autoPaywallOnExhaustion: enabled });
  }
  getAutoPaywallOnExhaustion() {
    return this.autoPaywallOnExhaustion;
  }
  setAutoRetryOnPurchase(enabled) {
    this.autoRetryOnPurchase = enabled;
    this.pushConfig({ autoRetryOnPurchase: enabled });
  }
  getAutoRetryOnPurchase() {
    return this.autoRetryOnPurchase;
  }
  onBalanceChanged(listener) {
    const subscription = this.rpcClient.onNotification("CREDITS_BALANCE_UPDATE", listener);
    return () => subscription.unsubscribe();
  }
  pushConfig(patch) {
    this.rpcClient.notify("H5_CREDITS_SET_CONFIG", patch);
  }
};
function initializeCredits(rundotGameApiInstance, host) {
  rundotGameApiInstance.credits = host.credits;
}
var RESUME_RECOVERY_GRACE_MS = 1500;
var RpcLifecycleApi = class {
  rpcClient;
  backButtonHandlerRegistered = false;
  lifecycleState = "unknown";
  resumeCallbacks = /* @__PURE__ */ new Set();
  resumeRecoveryTimer = null;
  /**
  * Boot-window tap buffer. The host drains a stashed tap the instant the
  * SDK's INTERNAL context subscriber acks (`SUBSCRIBE_READY`, inside
  * `initialize()`), which is necessarily before game code can call
  * `onNotification` — that only happens after `initialize()` resolves.
  * `wireNotificationReplay` (registered before INIT, like the identity
  * replica) parks that early event here; the first public subscriber gets it
  * replayed once. `null` = nothing pending.
  */
  pendingNotification = null;
  notificationSubscriberCount = 0;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
    this.rpcClient.onNotification("PAUSE", () => {
      this.markPaused();
    });
    this.rpcClient.onNotification("SLEEP", () => {
      this.markPaused();
    });
    this.rpcClient.onNotification("RESUME", () => {
      this.handleResume();
    });
    this.rpcClient.onNotification("QUIT", () => {
      this.lifecycleState = "quit";
      this.cancelResumeRecovery();
    });
  }
  /**
  * MUST be called during host initialization, BEFORE the INIT_SDK call, so
  * this subscription precedes the host's SUBSCRIBE_READY stash drain
  * (RpcClient fans out in registration order; a drain that raced ahead of
  * this wire would be unbufferable).
  */
  wireNotificationReplay() {
    return this.rpcClient.onNotification("NOTIFICATION_PARAMS_UPDATE", (params) => {
      if (this.notificationSubscriberCount === 0) this.pendingNotification = { params: params ?? {} };
    });
  }
  onQuit(callback) {
    return this.rpcClient.onNotification("QUIT", callback);
  }
  onSleep(callback) {
    return this.rpcClient.onNotification("SLEEP", callback);
  }
  onAwake(callback) {
    return this.rpcClient.onNotification("AWAKE", callback);
  }
  onResume(callback) {
    this.resumeCallbacks.add(callback);
    return { unsubscribe: () => {
      this.resumeCallbacks.delete(callback);
    } };
  }
  onPause(callback) {
    return this.rpcClient.onNotification("PAUSE", callback);
  }
  onIdentityChanged(callback) {
    return this.rpcClient.onNotification("IDENTITY_CHANGED", callback);
  }
  onNotification(callback) {
    this.notificationSubscriberCount += 1;
    const inner = this.rpcClient.onNotification("NOTIFICATION_PARAMS_UPDATE", (params) => callback({ params: params ?? {} }));
    const pending = this.pendingNotification;
    if (pending) {
      this.pendingNotification = null;
      queueMicrotask(() => callback(pending));
    }
    let unsubscribed = false;
    return { unsubscribe: () => {
      if (unsubscribed) return;
      unsubscribed = true;
      this.notificationSubscriberCount -= 1;
      inner.unsubscribe();
    } };
  }
  onSafeAreaChanged(callback) {
    return this.rpcClient.onNotification("H5_SAFE_AREA_CHANGED", callback);
  }
  onDeviceChanged(callback) {
    return this.rpcClient.onNotification("H5_DEVICE_CHANGED", callback);
  }
  scheduleResumeRecovery(isVisible) {
    if (this.lifecycleState === "quit" || this.resumeRecoveryTimer !== null) return;
    this.resumeRecoveryTimer = setTimeout(() => {
      this.resumeRecoveryTimer = null;
      if (this.lifecycleState !== "paused" || !isVisible()) return;
      this.rpcClient.notify("H5_REQUEST_LIFECYCLE_RESUME");
    }, RESUME_RECOVERY_GRACE_MS);
  }
  cancelResumeRecovery() {
    if (this.resumeRecoveryTimer === null) return;
    clearTimeout(this.resumeRecoveryTimer);
    this.resumeRecoveryTimer = null;
  }
  markPaused() {
    if (this.lifecycleState === "quit") return;
    this.lifecycleState = "paused";
  }
  handleResume() {
    this.cancelResumeRecovery();
    if (this.lifecycleState === "quit" || this.lifecycleState === "running") return;
    this.lifecycleState = "running";
    for (const callback of [...this.resumeCallbacks]) callback();
  }
  onBackButton(callback) {
    const inner = this.rpcClient.onNotification("BACK_BUTTON", callback);
    if (!this.backButtonHandlerRegistered) {
      this.backButtonHandlerRegistered = true;
      this.rpcClient.call("H5_BACK_BUTTON_HANDLER_SET", { active: true }).catch(() => {
      });
    }
    let unsubscribed = false;
    return { unsubscribe: () => {
      if (unsubscribed) return;
      unsubscribed = true;
      inner.unsubscribe();
      this.backButtonHandlerRegistered = false;
      this.rpcClient.call("H5_BACK_BUTTON_HANDLER_SET", { active: false }).catch(() => {
      });
    } };
  }
};
function sanitizeProfile(profile) {
  return {
    id: profile.id,
    username: profile.username,
    avatarUrl: profile.avatarUrl ?? null,
    isAnonymous: Boolean(profile.isAnonymous)
  };
}
function wireIdentityReplica(rpcClient, rundotGameApi) {
  return rpcClient.onNotification("IDENTITY_CHANGED", (event) => {
    if (event?.profile) rundotGameApi._profileData = sanitizeProfile(event.profile);
  });
}
function wireViewportReplica(rpcClient, rundotGameApi) {
  const safeAreaSub = rpcClient.onNotification("H5_SAFE_AREA_CHANGED", (insets) => {
    applySafeAreaUpdate(rundotGameApi, insets);
  });
  const deviceSub = rpcClient.onNotification("H5_DEVICE_CHANGED", (device) => {
    if (device) rundotGameApi._deviceData = device;
  });
  return { unsubscribe: () => {
    safeAreaSub.unsubscribe();
    deviceSub.unsubscribe();
  } };
}
function initializeLifecycleApi(rundotGameApi, host) {
  rundotGameApi.lifecycles = host.lifecycle;
}
var RpcLoggingApi = class {
  host;
  rpcClient;
  constructor(host, rpcClient) {
    this.host = host;
    this.rpcClient = rpcClient;
  }
  logDebug(message, ...args) {
    if (!this.host.isInitialized) {
      console.log(message, args);
      return;
    }
    this.rpcClient.notify("H5_DEBUG", {
      level: "log",
      message: this.buildMessage(message, ...args)
    });
  }
  logError(message, ...args) {
    if (!this.host.isInitialized) {
      console.error(message, ...args);
      return;
    }
    this.rpcClient.notify("H5_DEBUG", {
      level: "error",
      message: this.buildMessage(message, ...args)
    });
  }
  buildMessage(message, ...args) {
    if (args && args.length > 0) {
      const stringArgs = [];
      for (const arg of args) {
        const argAsString = this.toStringArg(arg);
        if (argAsString) stringArgs.push(argAsString);
      }
      message += stringArgs.join(" ");
    }
    return message;
  }
  toStringArg(arg) {
    if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
    if (arg) {
      if (typeof arg === "object") try {
        return JSON.stringify(arg);
      } catch (e) {
        return String(arg);
      }
      return String(arg);
    }
  }
};
function initializeLoggingApi(rundotGameApi, host) {
  rundotGameApi.log = (message, ...args) => {
    return host.logging.logDebug(message, ...args);
  };
  rundotGameApi.error = (message, ...args) => {
    return host.logging.logError(message, ...args);
  };
}
var RpcNavigationApi = class {
  rundotGameApi;
  rpcClient;
  constructor(rpcClient, rundotGameApi) {
    this.rpcClient = rpcClient;
    this.rundotGameApi = rundotGameApi;
  }
  async requestPopOrQuit(options) {
    return (await this.rpcClient.call("QUIT", options)).success;
  }
  getStackInfo() {
    this.rundotGameApi;
    return window.rundotGame._config.context?.stack || {
      isInStack: false,
      stackPosition: 0,
      parentInstanceId: null,
      appType: "standalone"
    };
  }
  popApp() {
    return this.rpcClient.call("H5_STACK_POP_REQUEST");
  }
  pushApp(appId, options) {
    return this.rpcClient.call("H5_STACK_PUSH_REQUEST", {
      targetAppId: appId,
      contextData: options?.contextData,
      appParams: options?.appParams
    });
  }
  navigateToGame(targetGameId, options) {
    return this.rpcClient.call("H5_NAVIGATE_TO_GAME", {
      targetGameId,
      launchContext: options?.launchContext,
      returnContext: options?.returnContext
    });
  }
};
function initializeStackNavigation(rundotGameApi, host) {
  rundotGameApi._mock.stackState = {
    isInStack: false,
    stackPosition: 0,
    stackDepth: 0,
    isTopOfStack: false,
    parentInstanceId: null,
    stackHistory: []
  };
  rundotGameApi.pushAppAsync = host.navigation.pushApp.bind(host.navigation);
  rundotGameApi.popAppAsync = host.navigation.popApp.bind(host.navigation);
  rundotGameApi.getStackInfo = host.navigation.getStackInfo.bind(host.navigation);
  rundotGameApi.requestPopOrQuit = (options) => {
    return host.navigation.requestPopOrQuit(options);
  };
  rundotGameApi.navigateToGame = host.navigation.navigateToGame.bind(host.navigation);
}
var STORAGE_PREFIX = "rundot_sdk_deprecation_note_";
function defaultGetLastNotedDay(key) {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    return null;
  }
}
function defaultSetLastNotedDay(key, day) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, day);
  } catch {
  }
}
function defaultToday() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function noteDeprecationOncePerUtcDay(key, message, eventName, deps = {}) {
  const today = deps.today ?? defaultToday;
  const getLastNotedDay = deps.getLastNotedDay ?? defaultGetLastNotedDay;
  const setLastNotedDay = deps.setLastNotedDay ?? defaultSetLastNotedDay;
  const warn = deps.warn ?? ((m2) => console.warn(m2));
  const day = today();
  if (getLastNotedDay(key) === day) return;
  setLastNotedDay(key, day);
  warn(message);
  deps.recordEvent?.(eventName);
}
var RpcNotificationsApi = class {
  rpcClient;
  options;
  constructor(rpcClient, options = {}) {
    this.rpcClient = rpcClient;
    this.options = options;
  }
  async submitMessageAsync(input) {
    return await this.rpcClient.call("H5_MESSAGING_SUBMIT_MESSAGE", input);
  }
  async scheduleAsync(title, body, seconds, notificationId, options) {
    noteDeprecationOncePerUtcDay("schedule_async", 'scheduleAsync is deprecated; use submitMessageAsync({ channels: ["local"], ... }) instead.', "sdk_deprecated_schedule_async", this.deprecationDeps());
    const { priority = 50, groupId, payload } = options || {};
    const local = (await this.submitMessageAsync({
      channels: ["local"],
      title,
      body,
      delaySeconds: seconds,
      notificationId,
      priority,
      groupId,
      payload
    })).results.find((r2) => r2.channel === "local");
    if (local?.status === "scheduled" && local.id) return local.id;
    return null;
  }
  async cancelNotification(id) {
    const result = await this.rpcClient.call("H5_CANCEL_LOCAL_NOTIFICATION", { id });
    return result.cancelled ?? result.canceled ?? false;
  }
  async getAllScheduledLocalNotifications() {
    return (await this.rpcClient.call("H5_GET_ALL_SCHEDULED_LOCAL_NOTIFICATIONS", {})).notifications.map((notif) => {
      return {
        id: notif.identifier,
        title: notif.content.title,
        body: notif.content.body,
        payload: notif.content.data,
        trigger: notif.trigger
      };
    });
  }
  async isLocalNotificationsEnabled() {
    return (await this.rpcClient.call("H5_IS_LOCAL_NOTIFICATIONS_ENABLED", {})).enabled;
  }
  async setLocalNotificationsEnabled(enabled) {
    return (await this.rpcClient.call("H5_SET_LOCAL_NOTIFICATIONS_ENABLED", { enabled })).enabled;
  }
  async getRCSAvailableAsync() {
    return await this.rpcClient.call("H5_MESSAGING_GET_RCS_AVAILABLE", {});
  }
  async scheduleRCSAsync(input) {
    noteDeprecationOncePerUtcDay("schedule_rcs_async", 'scheduleRCSAsync is deprecated; use submitMessageAsync({ channels: ["rcs"], ... }) instead.', "sdk_deprecated_schedule_rcs", this.deprecationDeps());
    const result = await this.submitMessageAsync({
      channels: ["rcs"],
      title: input.title,
      body: input.body,
      ctaUrl: input.ctaUrl,
      continuationParams: input.continuationParams,
      image: input.image,
      triggerAt: input.triggerAt,
      delaySeconds: input.delaySeconds
    });
    const rcs = result.results.find((r2) => r2.channel === "rcs");
    if (rcs?.status === "scheduled" && rcs.id) return {
      scheduleId: rcs.id,
      status: "pending"
    };
    if (rcs?.status === "skipped") return {
      scheduleId: result.messageId,
      status: "skipped",
      ...rcs.reason !== void 0 ? { reason: rcs.reason } : {}
    };
    return {
      scheduleId: result.messageId,
      status: "failed"
    };
  }
  async requestRCSOptInAsync(input) {
    return await this.rpcClient.call("H5_MESSAGING_REQUEST_RCS_OPT_IN", input ?? {});
  }
  deprecationDeps() {
    return {
      today: this.options.today,
      getLastNotedDay: this.options.getLastNotedDay,
      setLastNotedDay: this.options.setLastNotedDay,
      warn: this.options.warn,
      recordEvent: this.options.recordDeprecationEvent
    };
  }
};
function initializeLocalNotifications(rundotGameApi, host) {
  rundotGameApi.notifications = host.notifications;
}
var SHOW_TIMEOUT_MS = 6e5;
var CAN_SHOW_TIMEOUT_MS = 1e4;
var RpcPopupsApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async showToast(message, options) {
    const duration = options?.duration ?? 3e3;
    const variant = options?.variant ?? "info";
    return (await this.rpcClient.call("H5_TOAST", {
      message,
      duration,
      variant,
      action: options?.action
    }, duration + 2e3)).actionTriggered;
  }
  async showLikeDialog() {
    return this.rpcClient.call("H5_LIKE_DIALOG", {}, SHOW_TIMEOUT_MS);
  }
  async canShowLikeDialog() {
    return this.rpcClient.call("H5_LIKE_DIALOG_CAN_SHOW", {}, CAN_SHOW_TIMEOUT_MS);
  }
  async showCommentsPanel() {
    return this.rpcClient.call("H5_COMMENTS_PANEL", {}, SHOW_TIMEOUT_MS);
  }
  async canShowCommentsPanel() {
    return this.rpcClient.call("H5_COMMENTS_PANEL_CAN_SHOW", {}, CAN_SHOW_TIMEOUT_MS);
  }
  async getLikeState() {
    return this.rpcClient.call("H5_LIKE_STATE", {}, CAN_SHOW_TIMEOUT_MS);
  }
};
function initializePopups(rundotGameApi, host) {
  rundotGameApi.popups = host.popups;
}
var HostProfileApi = class {
  rundotGameApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  getCurrentProfile() {
    const profile = this.rundotGameApi._profileData;
    if (!profile) throw new Error("[RUN] Profile not available. You must await RundotGameAPI.initializeAsync() before calling getProfile(). INIT_SDK has not completed.");
    if (!profile.id || !profile.username) throw new Error("[RUN] INIT_SDK returned an incomplete profile (missing id/username). The host must supply valid profile data.");
    return {
      id: profile.id,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      isAnonymous: profile.isAnonymous
    };
  }
};
var MockProfileApi = class {
  rundotGameApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
  }
  getCurrentProfile() {
    return {
      id: "mock_profile_123",
      name: "Mock User",
      username: "mockuser",
      isAnonymous: false
    };
  }
};
function initializeProfile(rundotGameApi, host) {
  rundotGameApi.getProfile = () => {
    return host.profile.getCurrentProfile();
  };
  rundotGameApi.getCurrentProfile = () => {
    console.warn("[RUN] DEPRECATED: RundotGameAPI.getCurrentProfile() is deprecated. Use RundotGameAPI.getProfile() instead. See migration guide: https://docs.rundot-game.com/migration/profile-api");
    return host.profile.getCurrentProfile();
  };
}
var RpcClient = class {
  pendingCalls = /* @__PURE__ */ new Map();
  notificationCallbacks = /* @__PURE__ */ new Map();
  onResponseSub = null;
  onNotificationSub = null;
  transport = null;
  start(transport) {
    this.transport = transport;
    this.onResponseSub = transport.onResponse(async (response) => {
      return this.handleRpcResponse(response);
    });
    this.onNotificationSub = transport.onNotification(async (notification) => {
      return this.handleRpcNotification(notification);
    });
  }
  stop() {
    if (this.onResponseSub) {
      this.onResponseSub.unsubscribe();
      this.onResponseSub = null;
    }
    if (this.onNotificationSub) {
      this.onNotificationSub.unsubscribe();
      this.onNotificationSub = null;
    }
    this.transport = null;
  }
  onNotification(id, callback) {
    const typed = callback;
    let subscribers = this.notificationCallbacks.get(id);
    if (!subscribers) {
      subscribers = /* @__PURE__ */ new Set();
      this.notificationCallbacks.set(id, subscribers);
    }
    subscribers.add(typed);
    return { unsubscribe: () => {
      const set = this.notificationCallbacks.get(id);
      if (!set) return;
      set.delete(typed);
      if (set.size === 0) this.notificationCallbacks.delete(id);
    } };
  }
  callT(method, args, timeout = 6e4) {
    return this.call(method, args, timeout);
  }
  async call(method, args, timeout = 6e4) {
    return new Promise((resolve, reject) => {
      const id = generateId();
      this.addPendingCall(id, (value) => resolve(value), (error) => reject(error));
      const request = {
        type: "rpc-request",
        id,
        method,
        args
      };
      if (this.transport) this.transport.sendRequest(request);
      if (timeout > 0) {
        const startTime = Date.now();
        setTimeout(() => {
          if (this.hasPendingCall(id)) {
            this.removePendingCall(id);
            const elapsed = Date.now() - startTime;
            console.error(`[RpcClient] TIMEOUT: ${method} after ${elapsed}ms (limit: ${timeout}ms)`, {
              method,
              id,
              args: this.safeStringifyArgs(args).substring(0, 500),
              timeout,
              elapsed,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            });
            reject(new RundotApiError("TIMEOUT", `RPC call ${method} timed out after ${elapsed}ms`, 0));
          }
        }, timeout);
      }
    });
  }
  /**
  * Send a fire-and-forget RPC request.
  *
  * Unlike `call()`, `notify()`:
  *   - does NOT register a pending call,
  *   - does NOT arm a timeout,
  *   - does NOT await or surface the host's response.
  *
  * Use this for telemetry / cleanup RPCs where the caller does not care about
  * the result and does not want spurious timeout errors when the iframe is
  * throttled (e.g. backgrounded tab) or the host's response is otherwise
  * late. Host-side errors are NOT surfaced to the caller.
  *
  * The wire format is identical to `call()` (an `rpc-request` with a
  * generated id), so any late response from the host is harmlessly dropped
  * by `handleRpcResponse` — there is no entry in `pendingCalls` to match.
  */
  notify(method, args) {
    const request = {
      type: "rpc-request",
      id: generateId(),
      method,
      args
    };
    if (this.transport) this.transport.sendRequest(request);
  }
  hasPendingCall(id) {
    return this.pendingCalls.has(id);
  }
  safeStringifyArgs(args) {
    if (args === void 0) return "undefined";
    if (args === null) return "null";
    try {
      const serialized = JSON.stringify(args);
      if (serialized === void 0) return "undefined";
      return serialized;
    } catch (error) {
      return `[unserializable args: ${String(error)}]`;
    }
  }
  addPendingCall(id, resolve, reject) {
    this.pendingCalls.set(id, {
      id,
      resolve,
      reject
    });
  }
  removePendingCall(id) {
    this.pendingCalls.delete(id);
  }
  getPendingCall(id) {
    return this.pendingCalls.get(id);
  }
  handleRpcResponse(response) {
    const pending = this.getPendingCall(response.id);
    if (!pending) return false;
    this.removePendingCall(response.id);
    if (response.error) {
      const { message, code, detail, errorDetail, retryAfterMs } = response.error;
      if (code === "RATE_LIMITED") {
        pending.reject(new RateLimitedError(retryAfterMs ?? 1e3, message));
        return true;
      }
      pending.reject(new RundotApiError(code ?? "UNKNOWN", message, 0, detail, errorDetail));
      return true;
    }
    pending.resolve(response.result);
    return true;
  }
  handleRpcNotification(notification) {
    const subscribers = this.notificationCallbacks.get(notification.id);
    if (!subscribers) return;
    for (const callback of [...subscribers]) callback(notification.payload);
  }
};
var RpcImageGenApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async generate(params) {
    assertValidImageGenSeed(params.seed);
    return mapCreditsExhaustion(this.rpcClient.call("H5_IMAGE_GEN_GENERATE", params, -1));
  }
  async estimateDepth(params) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_IMAGE_GEN_ESTIMATE_DEPTH", params, -1));
  }
  async removeBackground(params) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_IMAGE_GEN_REMOVE_BACKGROUND", params, -1));
  }
  async upscaleImage(params) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_IMAGE_GEN_UPSCALE_IMAGE", params, -1));
  }
  /**
  * The host scopes this to the running game itself, so no game id is sent.
  * The legacy argument is accepted and ignored for source compatibility.
  */
  async listModels(legacyGameId) {
    return this.rpcClient.call("H5_IMAGE_GEN_LIST_MODELS", {});
  }
  async getCompletedJobs() {
    return this.rpcClient.call("H5_POLL_COMPLETED_JOBS", { type: "imageGen" });
  }
};
var MockImageGenApi = class {
  async generate(_params) {
    console.warn("[RUN] Image generation API not available in mock mode");
    throw new Error("Image generation API requires backend connection");
  }
  async estimateDepth(_params) {
    throw new Error("Depth estimation requires backend connection");
  }
  async removeBackground(_params) {
    throw new Error("Background removal requires backend connection");
  }
  async upscaleImage(_params) {
    throw new Error("Image upscaling requires backend connection");
  }
  /** The legacy `gameId` argument is ignored; the mock always requires a backend. */
  async listModels(_legacyGameId) {
    console.warn("[RUN] Image gen models API not available in mock mode");
    throw new Error("Image gen models API requires backend connection");
  }
  async getCompletedJobs() {
    return [];
  }
};
function initializeImageGen(rundotGameApi, host) {
  rundotGameApi.imageGen = host.imageGen;
}
var RpcSpriteGenApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  warn() {
    warnDeprecated("RundotGameAPI.spriteGen", "[RUN] RundotGameAPI.spriteGen is deprecated.");
  }
  async generate(params) {
    this.warn();
    return mapCreditsExhaustion(this.rpcClient.call("H5_SPRITE_GEN_GENERATE", params, -1));
  }
  async animate(params) {
    this.warn();
    return mapCreditsExhaustion(this.rpcClient.call("H5_SPRITE_GEN_ANIMATE", params, -1));
  }
  async characterAnimate(params) {
    this.warn();
    return this.rpcClient.call("H5_SPRITE_GEN_CHARACTER_ANIMATE", params, -1);
  }
  async listCharacterWorkflows() {
    this.warn();
    return this.rpcClient.call("H5_SPRITE_GEN_LIST_CHARACTER_WORKFLOWS", {});
  }
  async listModels() {
    this.warn();
    return this.rpcClient.call("H5_SPRITE_GEN_LIST_MODELS", {});
  }
  async getCosts() {
    this.warn();
    return this.rpcClient.call("H5_SPRITE_GEN_GET_COSTS", {});
  }
  async getCompletedJobs() {
    this.warn();
    return this.rpcClient.call("H5_POLL_COMPLETED_JOBS", { type: "spriteGen" });
  }
};
var MockSpriteGenApi = class {
  async generate(_params) {
    console.warn("[RUN] Sprite generation API not available in mock mode");
    throw new Error("Sprite generation API requires backend connection");
  }
  async animate(_params) {
    console.warn("[RUN] Sprite animation API not available in mock mode");
    throw new Error("Sprite animation API requires backend connection");
  }
  async characterAnimate(_params) {
    console.warn("[RUN] Character animate API not available in mock mode");
    throw new Error("Character animate API requires backend connection");
  }
  async listCharacterWorkflows() {
    console.warn("[RUN] Character workflows API not available in mock mode");
    throw new Error("Character workflows API requires backend connection");
  }
  async listModels() {
    console.warn("[RUN] Sprite models API not available in mock mode");
    throw new Error("Sprite models API requires backend connection");
  }
  async getCosts() {
    console.warn("[RUN] Sprite costs API not available in mock mode");
    throw new Error("Sprite costs API requires backend connection");
  }
  async getCompletedJobs() {
    return [];
  }
};
function initializeSpriteGen(rundotGameApi, host) {
  const delegate = host.spriteGen;
  const warn = () => {
    warnDeprecated("RundotGameAPI.spriteGen", "[RUN] RundotGameAPI.spriteGen is deprecated.");
  };
  rundotGameApi.spriteGen = {
    generate(params) {
      warn();
      return delegate.generate(params);
    },
    animate(params) {
      warn();
      return delegate.animate(params);
    },
    characterAnimate(params) {
      warn();
      return delegate.characterAnimate(params);
    },
    listCharacterWorkflows() {
      warn();
      return delegate.listCharacterWorkflows();
    },
    listModels() {
      warn();
      return delegate.listModels();
    },
    getCosts() {
      warn();
      return delegate.getCosts();
    },
    getCompletedJobs() {
      warn();
      return delegate.getCompletedJobs();
    }
  };
}
function invokeCallbacks(callbacks, event, context) {
  callbacks.forEach((callback) => {
    try {
      callback(event);
    } catch (error) {
      console.error(`[RUN] Error in ${context} callback:`, error);
      throw error;
    }
  });
}
function setupRoomNotifications(transport, getSubscriptions) {
  return transport.onRundotGameMessage((message) => {
    const subscriptions = getSubscriptions();
    if (!subscriptions) return;
    if (message.type === "H5_ROOM_DATA_UPDATED") {
      const messageData = message.data;
      const { roomId, roomData } = messageData;
      if (!roomId) return;
      invokeCallbacks(subscriptions.data[roomId] || [], {
        type: "H5_ROOM_DATA_UPDATED",
        roomId,
        roomData,
        timestamp: messageData.timestamp
      }, "room data");
    }
    if (message.type === "H5_ROOM_MESSAGE_RECEIVED" || message.type === "H5_ROOM_MESSAGE_UPDATED" || message.type === "H5_ROOM_MESSAGE_DELETED") {
      const messageData = message.data;
      const { roomId } = messageData;
      if (!roomId) return;
      invokeCallbacks(subscriptions.messages[roomId] || [], {
        type: message.type,
        roomId,
        message: messageData.message,
        timestamp: messageData.timestamp
      }, "room message");
    }
    if (message.type === "app:h5:proposedMoveValidationUpdated") {
      const messageData = message.data;
      const { roomId } = messageData;
      if (!roomId) return;
      invokeCallbacks(subscriptions.gameEvents[roomId] || [], {
        type: "app:h5:proposedMoveValidationUpdated",
        roomId,
        proposedMoveData: messageData.proposedMoveData,
        proposedMoveId: messageData.proposedMoveId,
        changeType: messageData.changeType,
        timestamp: messageData.timestamp
      }, "game event");
    }
  });
}
var RpcRoomsApi = class {
  rpcClient;
  subscriptions;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
    this.subscriptions = {
      data: {},
      messages: {},
      gameEvents: {}
    };
  }
  /**
  * Get the subscription state for external access (used by setupRoomNotifications)
  */
  getSubscriptions() {
    return this.subscriptions;
  }
  /**
  * Set up room notification routing from the transport
  */
  setupNotifications(transport) {
    setupRoomNotifications(transport, () => this.getSubscriptions());
  }
  async createRoomAsync(options) {
    const response = await this.rpcClient.call("H5_ROOM_CREATE", { options });
    return new RundotGameRoom(response.room);
  }
  async joinOrCreateRoomAsync(options) {
    const response = await this.rpcClient.call("H5_ROOM_JOIN_OR_CREATE", { options });
    return {
      action: response.action,
      room: new RundotGameRoom(response.room),
      playersJoined: response.playersJoined
    };
  }
  async joinRoomByCodeAsync(roomCode) {
    const response = await this.rpcClient.call("H5_ROOM_JOIN_BY_CODE", { roomCode });
    return new RundotGameRoom(response.room);
  }
  async getUserRoomsAsync(options = {}) {
    const response = await this.rpcClient.call("H5_ROOM_GET_USER_ROOMS", { includeArchived: options.includeArchived ?? false });
    const rawRooms = Array.isArray(response) ? response : response?.rooms;
    if (!Array.isArray(rawRooms)) {
      console.warn("[RUN] getUserRoomsAsync: Unexpected response format:", response);
      return [];
    }
    const rundotGameRooms = [];
    for (const roomData of rawRooms) {
      if (!roomData.id) {
        console.warn("[RUN] getUserRooms: Skipping room with missing ID:", roomData);
        continue;
      }
      try {
        const rundotGameRoom = new RundotGameRoom(roomData);
        rundotGameRooms.push(rundotGameRoom);
      } catch (error) {
        console.warn("[RUN] getUserRooms: Failed to create RundotGameRoom object:", error, roomData);
      }
    }
    return rundotGameRooms;
  }
  /** @deprecated Rooms V1 is unsupported. Hold state in your realtime `GameRoom` class. */
  async updateRoomDataAsync(room, updates, options = {}) {
    await this.rpcClient.call("H5_ROOM_UPDATE_DATA", {
      roomId: room.id,
      updates,
      merge: options.merge ?? true
    });
  }
  async getRoomDataAsync(room) {
    return await this.rpcClient.call("H5_ROOM_GET_DATA", { roomId: room.id });
  }
  async sendRoomMessageAsync(rundotGameRoom, request) {
    return await this.rpcClient.call("H5_ROOM_SEND_MESSAGE", {
      roomId: rundotGameRoom.id,
      message: request.message,
      metadata: request.metadata
    });
  }
  async leaveRoomAsync(room) {
    await this.rpcClient.call("H5_ROOM_LEAVE", { roomId: room.id });
  }
  async kickPlayerAsync(room, targetProfileId, options = {}) {
    const args = {
      roomId: room.id,
      targetProfileId
    };
    if (options.reason !== void 0) args.reason = options.reason;
    await this.rpcClient.call("H5_ROOM_KICK_PLAYER", args);
  }
  async startRoomGameAsync(room, options = {}) {
    await this.rpcClient.call("H5_ROOM_START_GAME", {
      roomId: room.id,
      options: {
        gameConfig: options.gameConfig ?? {},
        turnOrder: options.turnOrder ?? null
      }
    });
  }
  async proposeMoveAsync(room, proposalPayload) {
    const args = {
      roomId: room.id,
      gameSpecificState: proposalPayload.gameSpecificState,
      moveType: proposalPayload.moveType
    };
    if (proposalPayload.clientContext !== void 0) args.clientContext = proposalPayload.clientContext;
    if (proposalPayload.clientProposalId !== void 0) args.clientProposalId = proposalPayload.clientProposalId;
    return await this.rpcClient.call("h5:room:proposeMove", args);
  }
  async validateMoveAsync(_room, moveId, verdict) {
    return {
      success: true,
      moveId,
      isValid: verdict.isValid,
      reason: verdict.reason
    };
  }
  async subscribeAsync(room, options = {}) {
    const roomId = room.id;
    const existingData = this.subscriptions.data[roomId];
    const existingMessages = this.subscriptions.messages[roomId];
    const existingGameEvents = this.subscriptions.gameEvents[roomId];
    const subscribeToData = Boolean(options.onData) && (existingData?.length ?? 0) === 0;
    const subscribeToMessages = Boolean(options.onMessages) && (existingMessages?.length ?? 0) === 0;
    const subscribeToProposedMoves = Boolean(options.onGameEvents) && (existingGameEvents?.length ?? 0) === 0;
    if (subscribeToData || subscribeToMessages || subscribeToProposedMoves) try {
      await this.rpcClient.call("H5_ROOM_SUBSCRIBE", {
        roomId,
        subscribeToData,
        subscribeToMessages,
        subscribeToProposedMoves
      });
    } catch (error) {
      console.error("[RUN] Failed to set up room subscription:", error);
      throw error;
    }
    if (options.onData) {
      if (!this.subscriptions.data[roomId]) this.subscriptions.data[roomId] = [];
      this.subscriptions.data[roomId].push(options.onData);
    }
    if (options.onMessages) {
      if (!this.subscriptions.messages[roomId]) this.subscriptions.messages[roomId] = [];
      this.subscriptions.messages[roomId].push(options.onMessages);
    }
    if (options.onGameEvents) {
      if (!this.subscriptions.gameEvents[roomId]) this.subscriptions.gameEvents[roomId] = [];
      this.subscriptions.gameEvents[roomId].push(options.onGameEvents);
    }
    let disposed = false;
    return () => {
      if (disposed) return;
      disposed = true;
      if (options.onData) {
        const callbacks = this.subscriptions.data[roomId];
        if (callbacks) {
          const index = callbacks.indexOf(options.onData);
          if (index > -1) callbacks.splice(index, 1);
        }
      }
      if (options.onMessages) {
        const callbacks = this.subscriptions.messages[roomId];
        if (callbacks) {
          const index = callbacks.indexOf(options.onMessages);
          if (index > -1) callbacks.splice(index, 1);
        }
      }
      if (options.onGameEvents) {
        const callbacks = this.subscriptions.gameEvents[roomId];
        if (callbacks) {
          const index = callbacks.indexOf(options.onGameEvents);
          if (index > -1) callbacks.splice(index, 1);
        }
      }
      if (!((this.subscriptions.data[roomId]?.length ?? 0) > 0 || (this.subscriptions.messages[roomId]?.length ?? 0) > 0 || (this.subscriptions.gameEvents[roomId]?.length ?? 0) > 0)) this.rpcClient.notify("H5_ROOM_UNSUBSCRIBE", { roomId });
    };
  }
};
var FALLBACK_CHUNK_SIZE = 6;
var RpcStorageApi = class {
  rpcClient;
  methodIds;
  /**
  * Extra body fields merged into every RPC call. Used by shared-scope
  * bindings to carry (targetAppId, namespace) alongside the op-specific
  * arguments. `undefined` for app/owner bindings.
  */
  extraBodyFields;
  hostSupportsMultiGet = void 0;
  capabilityProbePromise;
  constructor(rpcClient, methodIds, extraBodyFields) {
    this.rpcClient = rpcClient;
    this.methodIds = methodIds;
    this.extraBodyFields = extraBodyFields;
  }
  body(extra) {
    if (!this.extraBodyFields && !extra) return void 0;
    return {
      ...this.extraBodyFields ?? {},
      ...extra ?? {}
    };
  }
  clear() {
    return this.rpcClient.call(this.methodIds.clear, this.body());
  }
  getItem(key) {
    return this.rpcClient.call(this.methodIds.getItem, this.body({ key }));
  }
  setItem(key, value) {
    return this.rpcClient.call(this.methodIds.setItem, this.body({
      key,
      value
    }));
  }
  key(index) {
    return this.rpcClient.call(this.methodIds.getKey, this.body({ index }));
  }
  length() {
    return this.rpcClient.call(this.methodIds.length, this.body());
  }
  removeItem(key) {
    return this.rpcClient.call(this.methodIds.removeItem, this.body({ key }));
  }
  removeMultipleItems(keys) {
    if (!this.methodIds.removeMultipleItems) throw new Error("Method not implemented");
    return this.rpcClient.call(this.methodIds.removeMultipleItems, this.body({ keys }));
  }
  getAllItems() {
    if (!this.methodIds.getAllItems) throw new Error("Method not implemented");
    return this.rpcClient.call(this.methodIds.getAllItems, this.body());
  }
  getAllData() {
    if (!this.methodIds.getAllData) throw new Error("Method not implemented");
    return this.rpcClient.call(this.methodIds.getAllData, this.body());
  }
  setMultipleItems(items) {
    if (!this.methodIds.setMultipleItems) throw new Error("Method not implemented");
    return this.rpcClient.call(this.methodIds.setMultipleItems, this.body({ items }));
  }
  async compareAndSwap(key, expectedValue, nextValue) {
    if (!this.methodIds.compareAndSwap) throw new Error("Method not implemented");
    return this.rpcClient.call(this.methodIds.compareAndSwap, this.body({
      key,
      expectedValue,
      nextValue
    }));
  }
  async fallbackGetMultipleItems(keys) {
    const uniqueKeys = Array.from(new Set(keys));
    const result = {};
    for (let i = 0; i < uniqueKeys.length; i += FALLBACK_CHUNK_SIZE) {
      const chunk = uniqueKeys.slice(i, i + FALLBACK_CHUNK_SIZE);
      const chunkResults = await Promise.all(chunk.map(async (k2) => ({
        key: k2,
        val: await this.getItem(k2)
      })));
      for (const { key, val } of chunkResults) if (val !== null && val !== void 0) result[key] = val;
    }
    return result;
  }
  async getMultipleItems(keys) {
    if (keys.length === 0) return Promise.resolve({});
    if (!this.methodIds.getMultipleItems) throw new Error("Method not implemented");
    if (this.hostSupportsMultiGet === false) return this.fallbackGetMultipleItems(keys);
    if (this.hostSupportsMultiGet === true) return this.rpcClient.call(this.methodIds.getMultipleItems, this.body({ keys }));
    if (this.capabilityProbePromise) {
      await this.capabilityProbePromise;
      if (this.hostSupportsMultiGet === false) return this.fallbackGetMultipleItems(keys);
      return this.rpcClient.call(this.methodIds.getMultipleItems, this.body({ keys }));
    }
    let resolveProbe;
    let rejectProbe;
    const rawProbe = new Promise((resolve, reject) => {
      resolveProbe = resolve;
      rejectProbe = reject;
    });
    rawProbe.catch(() => {
    });
    this.capabilityProbePromise = rawProbe;
    try {
      const result = await this.rpcClient.call(this.methodIds.getMultipleItems, this.body({ keys }));
      this.hostSupportsMultiGet = true;
      resolveProbe(true);
      return result;
    } catch (error) {
      if (isUnsupportedMessageError(error)) {
        this.hostSupportsMultiGet = false;
        resolveProbe(false);
        return this.fallbackGetMultipleItems(keys);
      }
      rejectProbe(error);
      throw error;
    } finally {
      this.capabilityProbePromise = void 0;
    }
  }
};
var DualEmitStorageApi = class {
  rpcClient;
  sharedIds;
  sharedScope;
  globalIds;
  constructor(rpcClient, sharedIds, sharedScope, globalIds) {
    this.rpcClient = rpcClient;
    this.sharedIds = sharedIds;
    this.sharedScope = sharedScope;
    this.globalIds = globalIds;
  }
  sharedBody(extra) {
    const { targetAppId, namespace } = this.sharedScope;
    const body = {
      namespace,
      ...extra ?? {}
    };
    if (targetAppId !== void 0) body.targetAppId = targetAppId;
    return body;
  }
  clear() {
    return dualWrite(this.rpcClient.call(this.sharedIds.clear, this.sharedBody()), this.rpcClient.call(this.globalIds.clear, void 0));
  }
  getItem(key) {
    return dualRead(this.rpcClient.call(this.sharedIds.getItem, this.sharedBody({ key })), this.rpcClient.call(this.globalIds.getItem, { key }));
  }
  setItem(key, value) {
    return dualWrite(this.rpcClient.call(this.sharedIds.setItem, this.sharedBody({
      key,
      value
    })), this.rpcClient.call(this.globalIds.setItem, {
      key,
      value
    }));
  }
  key(index) {
    return dualRead(this.rpcClient.call(this.sharedIds.getKey, this.sharedBody({ index })), this.rpcClient.call(this.globalIds.getKey, { index }));
  }
  length() {
    return dualRead(this.rpcClient.call(this.sharedIds.length, this.sharedBody()), this.rpcClient.call(this.globalIds.length, void 0));
  }
  removeItem(key) {
    return dualWrite(this.rpcClient.call(this.sharedIds.removeItem, this.sharedBody({ key })), this.rpcClient.call(this.globalIds.removeItem, { key }));
  }
  removeMultipleItems(keys) {
    if (!this.sharedIds.removeMultipleItems) throw new Error("Method not implemented");
    return dualWrite(this.rpcClient.call(this.sharedIds.removeMultipleItems, this.sharedBody({ keys })), this.rpcClient.call(this.globalIds.removeMultipleItems, { keys }));
  }
  getAllItems() {
    if (!this.sharedIds.getAllItems) throw new Error("Method not implemented");
    return dualRead(this.rpcClient.call(this.sharedIds.getAllItems, this.sharedBody()), this.rpcClient.call(this.globalIds.getAllItems, void 0).then((dict) => Object.keys(dict ?? {})));
  }
  getAllData() {
    if (!this.sharedIds.getAllData) throw new Error("Method not implemented");
    return dualRead(this.rpcClient.call(this.sharedIds.getAllData, this.sharedBody()), this.rpcClient.call(this.globalIds.getAllItems, void 0));
  }
  setMultipleItems(items) {
    if (!this.sharedIds.setMultipleItems) throw new Error("Method not implemented");
    return dualWrite(this.rpcClient.call(this.sharedIds.setMultipleItems, this.sharedBody({ items })), this.rpcClient.call(this.globalIds.setMultipleItems, { items }));
  }
  compareAndSwap() {
    throw new Error("Method not implemented");
  }
  getMultipleItems() {
    throw new Error("Method not implemented");
  }
};
var NO_HANDLER_PREFIX = "Unsupported message type:";
function isNoHandlerError(reason) {
  return reason instanceof Error && reason.message.startsWith(NO_HANDLER_PREFIX);
}
async function dualWrite(primary, fallback) {
  const results = await Promise.allSettled([primary, fallback]);
  if (results.some((r2) => r2.status === "fulfilled")) return;
  const realError = results.find((r2) => r2.status === "rejected" && !isNoHandlerError(r2.reason));
  if (realError) throw realError.reason;
  throw results[0].reason;
}
async function dualRead(primary, fallback) {
  const results = await Promise.allSettled([primary, fallback]);
  for (const r2 of results) if (r2.status === "fulfilled") return r2.value;
  for (const r2 of results) if (r2.status === "rejected" && !isNoHandlerError(r2.reason)) throw r2.reason;
  throw results[0].reason;
}
var RpcInboundStorageApi = class {
  rpcClient;
  methodIds;
  scope;
  constructor(rpcClient, methodIds, scope) {
    this.rpcClient = rpcClient;
    this.methodIds = methodIds;
    this.scope = scope;
  }
  body(extra) {
    const { targetAppId, namespace } = this.scope;
    const out = {
      namespace,
      ...extra ?? {}
    };
    if (targetAppId !== void 0) out.targetAppId = targetAppId;
    return out;
  }
  async listSources() {
    return this.rpcClient.call(this.methodIds.listSources, this.body());
  }
  async getAllFromSource(sourceAppId) {
    return this.rpcClient.call(this.methodIds.getAllFromSource, this.body({ sourceAppId }));
  }
  async get(sourceAppId, key) {
    return this.rpcClient.call(this.methodIds.get, this.body({
      sourceAppId,
      key
    }));
  }
  async getAllForKey(key) {
    return this.rpcClient.call(this.methodIds.getAllForKey, this.body({ key }));
  }
};
function initializeStorage(rundotGameApiInstance, host) {
  rundotGameApiInstance.deviceCache = host.deviceCache;
  rundotGameApiInstance.appStorage = host.appStorage;
  rundotGameApiInstance.ownerStorage = host.ownerStorage;
  rundotGameApiInstance.sharedStorage = host.sharedStorage;
}
var RpcSimulationApi = class {
  rpcClient;
  _simulationConfig = null;
  subscriptionCallbacks = /* @__PURE__ */ new Map();
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
    this.rpcClient.onNotification("H5_SIMULATION_UPDATE", this.handleSimulationUpdate.bind(this));
  }
  isEnabled() {
    return true;
  }
  async validateSlotAssignmentAsync(containerId, slotId, itemId) {
    return this.rpcClient.call("H5_SIMULATION_VALIDATE_ASSIGNMENT", {
      containerId,
      slotId,
      itemId
    });
  }
  async subscribeAsync(options) {
    this.ensureValidSubscribeOptions(options);
    const subscriptionId = generateId();
    this.subscriptionCallbacks.set(subscriptionId, options.onUpdate);
    try {
      await this.rpcClient.call("H5_SIMULATION_SUBSCRIBE", {
        subscriptionId,
        entities: options.entities,
        tags: options.tags,
        activeRuns: options.activeRuns,
        roomId: options.roomId
      });
    } catch (error) {
      this.subscriptionCallbacks.delete(subscriptionId);
      throw error;
    }
    let unsubscribed = false;
    return () => {
      if (unsubscribed) return;
      unsubscribed = true;
      this.subscriptionCallbacks.delete(subscriptionId);
      this.rpcClient.notify("H5_SIMULATION_UNSUBSCRIBE", { subscriptionId });
    };
  }
  executeBatchOperationsAsync(operations, validateOnly) {
    return this.rpcClient.call("H5_SIMULATION_BATCH_OPERATIONS", {
      operations,
      validateOnly
    });
  }
  async getAvailableItemsAsync(containerId, slotId) {
    return (await this.rpcClient.call("H5_SIMULATION_GET_AVAILABLE_ITEMS", {
      containerId,
      slotId
    })).availableItems || [];
  }
  calculatePowerPreviewAsync(containerId, slotId, candidateItemId) {
    return this.rpcClient.call("H5_SIMULATION_CALCULATE_POWER_PREVIEW", {
      containerId,
      slotId,
      candidateItemId
    });
  }
  assignItemToSlotAsync(containerId, slotId, itemId) {
    return this.rpcClient.call("H5_SIMULATION_ASSIGN_ITEM", {
      containerId,
      slotId,
      itemId
    });
  }
  removeItemFromSlotAsync(containerId, slotId) {
    return this.rpcClient.call("H5_SIMULATION_REMOVE_ITEM", {
      containerId,
      slotId
    });
  }
  async getSlotContainersAsync() {
    return (await this.rpcClient.call("H5_SIMULATION_GET_CONTAINERS", {})).containers || [];
  }
  async getSlotAssignmentsAsync(containerId) {
    const response = await this.rpcClient.call("H5_SIMULATION_GET_ASSIGNMENTS", { containerId });
    return Array.isArray(response) ? response : response.assignments || [];
  }
  async getStateAsync(roomId) {
    const response = await this.rpcClient.call("H5_SIMULATION_GET_STATE", { roomId });
    if (response.configuration) this._simulationConfig = response.configuration;
    return response;
  }
  async getConfigAsync(roomId) {
    if (this._simulationConfig) return this._simulationConfig;
    const config = await this.rpcClient.call("H5_SIMULATION_GET_CONFIG", { roomId });
    if (config) {
      this._simulationConfig = config;
      return config;
    }
    throw new Error("No simulation configuration available");
  }
  executeRecipeAsync(recipeId, inputs, options) {
    return this.rpcClient.call("H5_SIMULATION_EXECUTE_RECIPE", {
      recipeId,
      inputs,
      roomId: options?.roomId,
      batchAmount: options?.batchAmount,
      allowPartialBatch: options?.allowPartialBatch,
      entity: options?.entity,
      nonce: options?.nonce
    });
  }
  collectRecipeAsync(runId) {
    return this.rpcClient.call("H5_SIMULATION_COLLECT_RECIPE", { runId });
  }
  resetStateAsync(options) {
    return this.rpcClient.call("H5_SIMULATION_RESET_STATE", { initializeRecipe: options?.initializeRecipe });
  }
  getActiveRunsAsync(options) {
    return this.rpcClient.call("H5_SIMULATION_GET_ACTIVE_RUNS", { roomId: options?.roomId });
  }
  executeScopedRecipeAsync(recipeId, entity, inputs, options) {
    return this.rpcClient.call("H5_SIMULATION_EXECUTE_SCOPED_RECIPE", {
      recipeId,
      entity,
      inputs,
      roomId: options?.roomId ?? null,
      options
    });
  }
  getAvailableRecipesAsync(options) {
    return this.rpcClient.call("H5_SIMULATION_GET_AVAILABLE_RECIPES", {
      roomId: options?.roomId || null,
      includeActorRecipes: options?.includeActorRecipes || false
    });
  }
  getRecipeRequirementsAsync(recipe) {
    return this.rpcClient.call("H5_SIMULATION_GET_RECIPE_REQUIREMENTS", {
      recipeId: recipe.recipeId,
      nonce: recipe.nonce,
      entity: recipe.entity,
      batchAmount: recipe.batchAmount
    });
  }
  getBatchRecipeRequirementsAsync(recipes) {
    return this.rpcClient.call("H5_SIMULATION_GET_BATCH_RECIPE_REQUIREMENTS", { recipes });
  }
  triggerRecipeChainAsync(recipeId, options) {
    return this.rpcClient.call("H5_SIMULATION_TRIGGER_RECIPE_CHAIN", {
      triggerRecipeId: recipeId,
      context: options?.context,
      roomId: options?.roomId
    });
  }
  getEntityMetadataAsync(entityId) {
    return this.rpcClient.call("H5_SIMULATION_GET_ENTITY_METADATA", { entityId });
  }
  async resolveFieldValueAsync(entityId, fieldPath, entity) {
    return (await this.rpcClient.call("H5_SIMULATION_RESOLVE_VALUE", {
      entityId,
      fieldPath,
      entity
    })).value;
  }
  handleSimulationUpdate(notification) {
    if (!notification || !notification.subscriptionId) {
      console.warn("[RUN] Received malformed simulation update");
      return;
    }
    const callback = this.subscriptionCallbacks.get(notification.subscriptionId);
    if (!callback) {
      console.warn("[RUN] Received update for unknown subscription:", notification.subscriptionId);
      return;
    }
    try {
      callback(notification.updates);
    } catch (error) {
      console.error("[RUN] Error in simulation subscription callback", error);
    }
  }
  ensureValidSubscribeOptions(options) {
    if (typeof options !== "object" || options === null) throw new Error("Simulation subscribe requires an options object");
    const opts = options;
    if (typeof opts.onUpdate !== "function") throw new Error("Simulation subscribe requires an onUpdate callback");
    if (!(Array.isArray(opts.entities) && opts.entities.length > 0 || Array.isArray(opts.tags) && opts.tags.length > 0 || Boolean(opts.activeRuns))) throw new Error("Simulation subscribe requires at least one filter (entities, tags, activeRuns)");
  }
};
function initializeSimulation(rundotGameApi, host) {
  rundotGameApi.simulation = { isEnabled: () => true };
  rundotGameApi.simulation.getConfigAsync = () => {
    return host.simulation.getConfigAsync();
  };
  rundotGameApi.simulation.getStateAsync = (roomId) => {
    return host.simulation.getStateAsync(roomId);
  };
  rundotGameApi.simulation.executeRecipeAsync = (recipeId, inputs, options) => {
    return host.simulation.executeRecipeAsync(recipeId, inputs, options);
  };
  rundotGameApi.simulation.getActiveRunsAsync = () => {
    return host.simulation.getActiveRunsAsync();
  };
  rundotGameApi.simulation.collectRecipeAsync = (runId) => {
    return host.simulation.collectRecipeAsync(runId);
  };
  rundotGameApi.simulation.executeScopedRecipeAsync = (recipeId, entity, inputs, options) => {
    return host.simulation.executeScopedRecipeAsync(recipeId, entity, inputs, options);
  };
  rundotGameApi.simulation.triggerRecipeChainAsync = (recipeId, options) => {
    return host.simulation.triggerRecipeChainAsync(recipeId, options);
  };
  rundotGameApi.simulation.getAvailableRecipesAsync = async (options) => {
    return host.simulation.getAvailableRecipesAsync(options);
  };
  rundotGameApi.simulation.getRecipeRequirementsAsync = (recipe) => {
    return host.simulation.getRecipeRequirementsAsync(recipe);
  };
  rundotGameApi.simulation.getBatchRecipeRequirementsAsync = (recipes) => {
    return host.simulation.getBatchRecipeRequirementsAsync(recipes);
  };
  rundotGameApi.simulation.resolveFieldValueAsync = (entityId, fieldPath, entity) => {
    return host.simulation.resolveFieldValueAsync(entityId, fieldPath, entity);
  };
  rundotGameApi.simulation.getEntityMetadataAsync = (entityId) => {
    return host.simulation.getEntityMetadataAsync(entityId);
  };
  rundotGameApi.simulation.getSlotAssignmentsAsync = (containerId) => {
    return host.simulation.getSlotAssignmentsAsync(containerId);
  };
  rundotGameApi.simulation.getSlotContainersAsync = () => {
    return host.simulation.getSlotContainersAsync();
  };
  rundotGameApi.simulation.assignItemToSlotAsync = (containerId, slotId, itemId) => {
    return host.simulation.assignItemToSlotAsync(containerId, slotId, itemId);
  };
  rundotGameApi.simulation.removeItemFromSlotAsync = (containerId, slotId) => {
    return host.simulation.removeItemFromSlotAsync(containerId, slotId);
  };
  rundotGameApi.simulation.getAvailableItemsAsync = (containerId, slotId) => {
    return host.simulation.getAvailableItemsAsync(containerId, slotId);
  };
  rundotGameApi.simulation.calculatePowerPreviewAsync = (containerId, slotId, candidateItemId) => {
    return host.simulation.calculatePowerPreviewAsync(containerId, slotId, candidateItemId);
  };
  rundotGameApi.simulation.executeBatchOperationsAsync = (operations, validateOnly) => {
    return host.simulation.executeBatchOperationsAsync(operations, validateOnly);
  };
  rundotGameApi.simulation.validateSlotAssignmentAsync = (containerId, slotId, itemId) => {
    return host.simulation.validateSlotAssignmentAsync(containerId, slotId, itemId);
  };
  rundotGameApi.simulation.subscribeAsync = (options) => {
    return host.simulation.subscribeAsync(options);
  };
  rundotGameApi.simulation.resetStateAsync = (options) => {
    return host.simulation.resetStateAsync(options);
  };
}
var HostTimeApi = class {
  rpcClient;
  rundotGameApi;
  constructor(rpcClient, rundotGameApi) {
    this.rpcClient = rpcClient;
    this.rundotGameApi = rundotGameApi;
  }
  async requestTimeAsync() {
    return await this.rpcClient.call("H5_REQUEST_SERVER_TIME", {});
  }
  formatTime(timestamp, options) {
    const locale = this.rundotGameApi.getLocale();
    const date = new Date(timestamp);
    const dateTimeOptions = {
      dateStyle: options.dateStyle || "medium",
      timeStyle: options.timeStyle || "medium",
      hour12: options.hour12 !== void 0 ? options.hour12 : true,
      ...options
    };
    return date.toLocaleString(locale, dateTimeOptions);
  }
  formatNumber(value, options) {
    try {
      const locale = this.rundotGameApi.getLocale();
      const numberOptions = {
        style: options?.style || "decimal",
        minimumFractionDigits: options?.minimumFractionDigits || 0,
        maximumFractionDigits: options?.maximumFractionDigits || 2,
        ...options
      };
      return value.toLocaleString(locale, numberOptions);
    } catch (error) {
      console.error("[RUN] Error formatting number:", error);
      return String(value);
    }
  }
  async getFutureTimeAsync(options) {
    const timeInfo = await this.requestTimeAsync();
    const serverTime = new Date(timeInfo.serverTime);
    const result = new Date(serverTime);
    if (options?.days) result.setDate(result.getDate() + options.days);
    if (options?.hours) result.setHours(result.getHours() + options.hours);
    if (options?.minutes) result.setMinutes(result.getMinutes() + options.minutes);
    if (options?.timeOfDay) {
      const { hour = 0, minute = 0, second = 0 } = options.timeOfDay;
      timeInfo.timezoneOffset || (/* @__PURE__ */ new Date()).getTimezoneOffset();
      const localHour = hour;
      result.setHours(localHour, minute, second, 0);
    }
    if (options?.timezone) switch (options.timezone.toUpperCase()) {
      case "PT":
      case "PST":
      case "PDT": {
        const ptOffset = isPacificDaylightTime(result) ? -7 : -8;
        result.setUTCHours(0, 0, 0, 0);
        const { hour = 0, minute = 0, second = 0 } = options.timeOfDay || {};
        const utcHour = (hour - ptOffset) % 24;
        result.setUTCHours(utcHour, minute, second, 0);
        break;
      }
      default:
        console.warn("[RUN] Timezone " + options.timezone + " not supported, using local time");
    }
    return result.getTime();
  }
};
function initializeTime(rundotGameApi, host) {
  rundotGameApi.requestTimeAsync = () => {
    return host.time.requestTimeAsync();
  };
  rundotGameApi.getFutureTimeAsync = (options) => {
    return host.time.getFutureTimeAsync(options);
  };
  rundotGameApi.formatTime = (timestamp, options) => {
    return host.time.formatTime(timestamp, options);
  };
  rundotGameApi.formatNumber = (value, options) => {
    return host.time.formatNumber(value, options);
  };
}
var RpcLeaderboardApi = class {
  rpcClient;
  /** Cache of score tokens for automatic hash computation */
  tokenCache = /* @__PURE__ */ new Map();
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  /**
  * Create a score token for submitting a score.
  * Token is cached for automatic hash computation if score sealing is enabled.
  *
  * @param mode - Optional game mode
  * @returns Score token with sealing data if enabled
  */
  async createScoreToken(mode) {
    const token = await this.rpcClient.call("H5_LEADERBOARD_CREATE_SCORE_TOKEN", mode ? { mode } : {});
    this.tokenCache.set(token.token, token);
    return token;
  }
  /**
  * Submit a score to the leaderboard.
  * Automatically computes hash if score sealing is enabled and token was created via createScoreToken().
  *
  * @param params - Score submission parameters
  * @returns Submission result with acceptance status and rank
  * @throws Error if token not found in cache
  */
  async submitScore(params) {
    if (params.replay !== void 0) assertReplayWithinInlineCap(params.replay);
    let hash;
    if (params.token) {
      const cachedToken = this.tokenCache.get(params.token);
      if (!cachedToken) throw new Error("Invalid token: not found in cache. Did you call createScoreToken() first?");
      if (cachedToken.sealingNonce && cachedToken.sealingSecret) hash = await computeScoreHash(params.score, params.duration, params.token, cachedToken.sealingNonce, cachedToken.sealingSecret);
      this.tokenCache.delete(params.token);
    }
    try {
      return await this.rpcClient.call("H5_LEADERBOARD_SUBMIT_SCORE", {
        token: params.token,
        score: params.score,
        duration: params.duration,
        mode: params.mode,
        period: params.period,
        telemetry: params.telemetry,
        metadata: params.metadata,
        hash,
        replay: params.replay
      });
    } catch (error) {
      const mapped = mapSubmitScoreFailure(error);
      if (mapped) return mapped;
      throw error;
    }
  }
  getPagedScores(options) {
    return this.rpcClient.call("H5_LEADERBOARD_GET_PAGED_SCORES", options ?? {});
  }
  getMyRank(options) {
    return this.rpcClient.call("H5_LEADERBOARD_GET_MY_RANK", options ?? {});
  }
  getPodiumScores(options) {
    return this.rpcClient.call("H5_LEADERBOARD_GET_PODIUM_SCORES", options ?? {});
  }
};
var MIN_SCORE = 0;
var MAX_SCORE = 999999999;
var MIN_DURATION_SEC = 10;
var MAX_DURATION_SEC = 3600;
var MAX_METADATA_BYTES = 20480;
function validateSubmitScore(params) {
  const { score, duration, metadata } = params;
  if (typeof score !== "number" || Number.isNaN(score)) throw new RundotApiError("INVALID_ARGUMENT", "Score must be a valid number", 400);
  if (score < MIN_SCORE || score > MAX_SCORE) throw new RundotApiError("INVALID_ARGUMENT", "Score out of bounds", 400);
  if (!Number.isFinite(duration) || duration < 0) throw new RundotApiError("INVALID_ARGUMENT", "Duration must be a positive number", 400);
  if (duration < MIN_DURATION_SEC || duration > MAX_DURATION_SEC) throw new RundotApiError("INVALID_ARGUMENT", "Duration out of bounds", 400);
  if (metadata !== void 0 && metadata !== null) {
    if (typeof metadata !== "object" || Array.isArray(metadata)) throw new RundotApiError("INVALID_ARGUMENT", "Metadata must be a plain object", 400);
    let serialized;
    try {
      serialized = JSON.stringify(metadata);
    } catch {
      throw new RundotApiError("INVALID_ARGUMENT", "Metadata must be JSON serializable", 400);
    }
    if (utf8ByteLength(serialized) > MAX_METADATA_BYTES) throw new RundotApiError("INVALID_ARGUMENT", "Metadata exceeds 20KB limit", 400);
    const reparsed = JSON.parse(serialized);
    if (typeof reparsed !== "object" || reparsed === null || Array.isArray(reparsed)) throw new RundotApiError("INVALID_ARGUMENT", "Metadata must be an object", 400);
  }
}
var MockLeaderboardApi = class {
  tokens = /* @__PURE__ */ new Map();
  /** Cache of score tokens for automatic hash computation */
  tokenCache = /* @__PURE__ */ new Map();
  entriesByMode = /* @__PURE__ */ new Map();
  tokenCounter = 0;
  enableScoreSealing = false;
  scoreSealingSecret = "mock-leaderboard-secret-key";
  constructor(options) {
    if (options?.enableScoreSealing) this.enableScoreSealing = true;
    if (options?.scoreSealingSecret) this.scoreSealingSecret = options.scoreSealingSecret;
  }
  /**
  * Configure mock leaderboard settings
  *
  * @param options - Configuration options
  */
  configure(options) {
    if (typeof options.enableScoreSealing === "boolean") this.enableScoreSealing = options.enableScoreSealing;
    if (options.scoreSealingSecret) this.scoreSealingSecret = options.scoreSealingSecret;
  }
  generateNonce() {
    return (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 64);
  }
  getModeKey(mode) {
    return `${mode || "default"}`;
  }
  getEntriesForMode(mode) {
    const key = this.getModeKey(mode);
    if (!this.entriesByMode.has(key)) this.entriesByMode.set(key, []);
    return this.entriesByMode.get(key);
  }
  /**
  * Create a mock score token for testing.
  * Token is cached for automatic hash computation if score sealing is enabled.
  *
  * @param mode - Optional game mode
  * @returns Score token with sealing data if enabled
  */
  async createScoreToken(mode) {
    const token = `mock_token_${++this.tokenCounter}`;
    const startTime = Date.now();
    const expiresAt = startTime + 36e5;
    const resolvedMode = mode || "default";
    const sealingNonce = this.enableScoreSealing ? this.generateNonce() : null;
    const sealingSecret = this.enableScoreSealing ? this.scoreSealingSecret : null;
    this.tokens.set(token, {
      id: token,
      expiresAt,
      mode: resolvedMode,
      sealingNonce,
      used: false
    });
    const result = {
      token,
      startTime,
      expiresAt,
      sealingNonce,
      sealingSecret,
      mode: resolvedMode
    };
    this.tokenCache.set(token, result);
    return result;
  }
  /**
  * Submit a mock score to the leaderboard.
  * Automatically computes hash if score sealing is enabled and token was created via createScoreToken().
  *
  * @param params - Score submission parameters
  * @returns Submission result with acceptance status and rank
  * @throws Error if token not found in cache or validation fails
  */
  async submitScore(params) {
    validateSubmitScore(params);
    let hash;
    if (params.token) {
      const cachedToken = this.tokenCache.get(params.token);
      if (!cachedToken) throw new Error("Invalid token: not found in cache. Did you call createScoreToken() first?");
      if (cachedToken.sealingNonce && cachedToken.sealingSecret) hash = await computeScoreHash(params.score, params.duration, params.token, cachedToken.sealingNonce, cachedToken.sealingSecret);
    }
    if (!params.token) {
      const mode = params.mode || "default";
      const submittedAt2 = Date.now();
      const entry2 = {
        profileId: `mock_profile`,
        username: "Mock Player",
        avatarUrl: null,
        score: params.score,
        duration: params.duration,
        submittedAt: submittedAt2,
        token: "simple-mode",
        rank: null,
        zScore: null,
        isAnomaly: false,
        trustScore: 50,
        metadata: params.metadata ?? null,
        isSeed: false
      };
      const modeEntries2 = this.getEntriesForMode(mode);
      const existingIndex2 = modeEntries2.findIndex((e) => e.profileId === entry2.profileId);
      if (existingIndex2 !== -1) {
        const existingScore = modeEntries2[existingIndex2].score;
        if (params.score <= existingScore) return {
          accepted: false,
          rank: null
        };
        modeEntries2.splice(existingIndex2, 1);
      }
      modeEntries2.push(entry2);
      modeEntries2.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.submittedAt - b.submittedAt;
      });
      modeEntries2.forEach((e, index) => {
        modeEntries2[index] = {
          ...e,
          rank: index + 1
        };
      });
      return {
        accepted: true,
        rank: modeEntries2.find((e) => e.submittedAt === submittedAt2)?.rank ?? null
      };
    }
    const scoreToken = this.tokens.get(params.token);
    if (!scoreToken) throw new Error("Invalid score token");
    if (scoreToken.expiresAt < Date.now()) throw new Error("Invalid or expired score token");
    if (scoreToken.used) throw new Error("Score token already used");
    if (params.mode && params.mode !== scoreToken.mode) throw new Error("Submission mode does not match token mode");
    if (scoreToken.sealingNonce && !hash) throw new Error("Score hash required when score sealing is enabled");
    const submittedAt = Date.now();
    const entry = {
      profileId: `mock_profile`,
      username: "Mock Player",
      avatarUrl: null,
      score: params.score,
      duration: params.duration,
      submittedAt,
      token: params.token,
      rank: null,
      zScore: null,
      isAnomaly: false,
      trustScore: 50,
      metadata: params.metadata ?? null,
      isSeed: false
    };
    const modeEntries = this.getEntriesForMode(scoreToken.mode);
    const existingIndex = modeEntries.findIndex((e) => e.profileId === entry.profileId);
    let scoreAccepted = true;
    if (existingIndex !== -1) {
      const existingScore = modeEntries[existingIndex].score;
      if (params.score <= existingScore) scoreAccepted = false;
      else modeEntries.splice(existingIndex, 1);
    }
    if (scoreAccepted) {
      modeEntries.push(entry);
      modeEntries.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.submittedAt - b.submittedAt;
      });
      modeEntries.forEach((e, index) => {
        modeEntries[index] = {
          ...e,
          rank: index + 1
        };
      });
    }
    scoreToken.used = true;
    scoreToken.sealingNonce = null;
    this.tokenCache.delete(params.token);
    const inserted = scoreAccepted ? modeEntries.find((e) => e.token === params.token && e.submittedAt === submittedAt) : null;
    return {
      accepted: scoreAccepted,
      rank: inserted?.rank ?? null
    };
  }
  async getPagedScores(options) {
    const limit = options?.limit ?? 10;
    const mode = options?.mode ?? "default";
    const modeEntries = [...this.getEntriesForMode(mode)];
    return {
      variant: "standard",
      entries: modeEntries.slice(0, limit).map((entry) => ({ ...entry })),
      totalEntries: modeEntries.length,
      nextCursor: null,
      playerRank: null,
      periodInstance: options?.period ?? "alltime"
    };
  }
  async getMyRank(_options) {
    const mode = _options?.mode ?? "default";
    const modeEntries = this.getEntriesForMode(mode);
    const playerEntry = modeEntries[0] ?? null;
    return {
      rank: playerEntry?.rank ?? null,
      score: playerEntry?.score,
      totalPlayers: modeEntries.length,
      percentile: playerEntry ? Math.max(0, 1 - ((playerEntry.rank ?? 1) - 1) / Math.max(modeEntries.length, 1)) : void 0,
      trustScore: 50,
      periodInstance: _options?.period ?? "alltime"
    };
  }
  async getPodiumScores(options) {
    const mode = options?.mode ?? "default";
    const modeEntries = [...this.getEntriesForMode(mode)];
    const topCount = Math.max(1, Math.min(options?.topCount ?? 3, 10));
    const aheadCount = Math.max(0, Math.min(options?.contextAhead ?? 4, 10));
    const behindCount = Math.max(0, Math.min(options?.contextBehind ?? 2, 10));
    const topEntries = modeEntries.slice(0, topCount);
    const playerEntry = modeEntries[0] ?? null;
    const totalEntries = modeEntries.length;
    let playerRank = playerEntry?.rank ?? null;
    let beforePlayer = [];
    let afterPlayer = [];
    let totalBefore = playerRank ? playerRank - 1 : 0;
    let totalAfter = playerRank ? Math.max(totalEntries - playerRank, 0) : 0;
    let omittedBefore = totalBefore;
    let omittedAfter = totalAfter;
    if (playerRank && playerRank > 0) {
      const beforeStart = Math.max(playerRank - aheadCount - 1, 0);
      beforePlayer = modeEntries.slice(beforeStart, playerRank - 1);
      const afterEnd = Math.min(playerRank + behindCount, totalEntries);
      afterPlayer = modeEntries.slice(playerRank, afterEnd);
      const shownTopAhead = topEntries.filter((entry) => (entry.rank ?? 0) > 0 && (entry.rank ?? 0) < playerRank).length;
      omittedBefore = Math.max(totalBefore - (beforePlayer.length + shownTopAhead), 0);
      omittedAfter = Math.max(totalAfter - afterPlayer.length, 0);
    }
    return {
      variant: "highlight",
      entries: topEntries,
      totalEntries,
      nextCursor: null,
      playerRank: playerRank ?? null,
      periodInstance: options?.period ?? "alltime",
      context: {
        topEntries,
        beforePlayer,
        playerEntry: playerEntry ?? null,
        afterPlayer,
        totalBefore,
        totalAfter,
        omittedBefore,
        omittedAfter
      }
    };
  }
};
function initializeLeaderboard(rundotGameApiInstance, host) {
  rundotGameApiInstance.leaderboard = host.leaderboard;
}
var RpcEntitlementApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async listEntitlements(options) {
    return (await this.rpcClient.call("H5_ENTITLEMENT_LIST", { scope: options?.scope })).entitlements;
  }
  async getQuantity(entitlementId, options) {
    return (await this.rpcClient.call("H5_ENTITLEMENT_GET_QUANTITY", {
      entitlementId,
      scope: options?.scope
    })).quantity;
  }
  async consumeEntitlement(entitlementId, quantity, callback, reason, referenceId) {
    referenceId = referenceId ?? generateId();
    const entitlement = (await this.rpcClient.call("H5_ENTITLEMENT_CONSUME", {
      entitlementId,
      quantity,
      referenceId,
      reason
    })).entitlement;
    if (callback) try {
      await callback(entitlement, referenceId);
    } catch (e) {
      console.warn("[RUN] consumeEntitlement callback threw, but consume succeeded", e);
    }
    return entitlement;
  }
  async getLedger(entitlementId, limit, startAfter) {
    return (await this.rpcClient.call("H5_ENTITLEMENT_GET_LEDGER", {
      entitlementId,
      limit,
      startAfter
    })).ledger;
  }
};
var TAG$22 = "Mock Entitlements";
var MockEntitlementApi = class {
  entitlements = [
    {
      docId: "mock-ent-1",
      userId: "mock-user",
      gameId: "mock-game",
      ownerUserId: "mock-owner",
      entitlementId: "boost_speed",
      quantity: 5,
      consumable: true,
      status: "active",
      expiresAt: null,
      createdAt: Date.now() - 864e5,
      updatedAt: Date.now() - 864e5,
      revokedAt: null
    },
    {
      docId: "mock-ent-2",
      userId: "mock-user",
      gameId: "mock-game",
      ownerUserId: "mock-owner",
      entitlementId: "sword_legendary",
      quantity: 1,
      consumable: false,
      status: "active",
      expiresAt: null,
      createdAt: Date.now() - 1728e5,
      updatedAt: Date.now() - 1728e5,
      revokedAt: null
    },
    {
      docId: "mock-ent-3",
      userId: "mock-user",
      gameId: "mock-game",
      ownerUserId: "mock-owner",
      entitlementId: "vip_pass",
      quantity: 1,
      consumable: false,
      status: "active",
      expiresAt: Date.now() + 6048e5,
      createdAt: Date.now() - 864e5,
      updatedAt: Date.now() - 864e5,
      revokedAt: null
    }
  ];
  ledger = [
    {
      ledgerId: "mock-ledger-1",
      userId: "mock-user",
      gameId: "mock-game",
      entitlementId: "boost_speed",
      change: 5,
      action: "grant",
      source: "admin",
      referenceId: "mock-ref-1",
      reason: "Initial grant",
      createdAt: Date.now() - 864e5,
      balanceAfter: 5
    },
    {
      ledgerId: "mock-ledger-2",
      userId: "mock-user",
      gameId: "mock-game",
      entitlementId: "sword_legendary",
      change: 1,
      action: "grant",
      source: "purchase",
      referenceId: "mock-ref-2",
      reason: null,
      createdAt: Date.now() - 1728e5,
      balanceAfter: 1
    },
    {
      ledgerId: "mock-ledger-3",
      userId: "mock-user",
      gameId: "mock-game",
      entitlementId: "vip_pass",
      change: 1,
      action: "grant",
      source: "purchase",
      referenceId: "mock-ref-3",
      reason: null,
      createdAt: Date.now() - 864e5,
      balanceAfter: 1
    }
  ];
  async listEntitlements(options) {
    const targetGameId = typeof options?.scope === "object" && options.scope && "gameId" in options.scope ? options.scope.gameId : void 0;
    return this.entitlements.filter((e) => {
      if (e.status !== "active") return false;
      if (targetGameId) return e.gameId === targetGameId;
      if (options?.scope === "owner") return true;
      return e.gameId === "mock-game";
    });
  }
  async getQuantity(entitlementId, options) {
    return (await this.listEntitlements(options)).filter((e) => e.entitlementId === entitlementId).reduce((acc, curr) => acc + curr.quantity, 0);
  }
  async consumeEntitlement(entitlementId, quantity, callback, reason, referenceId) {
    mockLog(TAG$22, `consumeEntitlement id=${entitlementId} qty=${quantity}`);
    referenceId = referenceId ?? generateId();
    if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(quantity)) throw new RundotApiError("UNKNOWN", "quantity must be a positive integer", 0);
    const entitlement = this.entitlements.find((e) => e.entitlementId === entitlementId && e.status === "active");
    if (!entitlement) throw new Error(`Entitlement not found: ${entitlementId}`);
    if (!entitlement.consumable) throw new Error(`Entitlement is not consumable: ${entitlementId}`);
    if (entitlement.quantity < quantity) throw new Error(`Insufficient quantity: have ${entitlement.quantity}, need ${quantity}`);
    entitlement.quantity -= quantity;
    entitlement.updatedAt = Date.now();
    this.ledger.push({
      ledgerId: `mock-ledger-${Date.now()}`,
      userId: entitlement.userId,
      gameId: entitlement.gameId,
      entitlementId,
      change: -quantity,
      action: "consume",
      source: "progression",
      referenceId,
      reason: reason ?? null,
      createdAt: Date.now(),
      balanceAfter: entitlement.quantity
    });
    const result = { ...entitlement };
    if (callback) try {
      await callback(result, referenceId);
    } catch (e) {
      console.warn("[RUN:mock] consumeEntitlement callback threw, but consume succeeded", e);
    }
    return result;
  }
  async getLedger(entitlementId, limit, startAfter) {
    let entries = [...this.ledger];
    if (entitlementId) entries = entries.filter((e) => e.entitlementId === entitlementId);
    entries.sort((a, b) => b.createdAt - a.createdAt);
    if (startAfter) entries = entries.filter((e) => e.createdAt < startAfter);
    if (limit) entries = entries.slice(0, limit);
    return entries;
  }
  /** Test helper: seed an entitlement */
  _seedEntitlement(entitlement) {
    const idx = this.entitlements.findIndex((e) => e.docId === entitlement.docId);
    if (idx >= 0) this.entitlements[idx] = entitlement;
    else this.entitlements.push(entitlement);
  }
  /** Test helper: reset state */
  _reset() {
    this.entitlements = [];
    this.ledger = [];
  }
};
function initializeEntitlements(rundotGameApiInstance, host) {
  rundotGameApiInstance.entitlements = host.entitlements;
}
var RpcStatsApi = class {
  rpcClient;
  pending = /* @__PURE__ */ new Map();
  scheduledFlush = false;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async submit(statId, value) {
    return new Promise((resolve, reject) => {
      const resolver = {
        resolve,
        reject
      };
      const existing = this.pending.get(statId);
      if (existing) {
        existing.value = value;
        existing.resolvers.push(resolver);
      } else this.pending.set(statId, {
        value,
        resolvers: [resolver]
      });
      this.scheduleFlush();
    });
  }
  async getValue(statId) {
    return (await this.rpcClient.call("H5_STATS_GET_VALUE", { statId })).value;
  }
  async getAllValues() {
    return (await this.rpcClient.call("H5_STATS_GET_ALL", {})).stats;
  }
  scheduleFlush() {
    if (this.scheduledFlush) return;
    this.scheduledFlush = true;
    Promise.resolve().then(() => this.flushNow());
  }
  async flushNow() {
    this.scheduledFlush = false;
    if (this.pending.size === 0) return;
    const batchValues = {};
    const resolversByStatId = /* @__PURE__ */ new Map();
    for (const [statId, entry] of this.pending) {
      batchValues[statId] = entry.value;
      resolversByStatId.set(statId, entry.resolvers);
    }
    this.pending = /* @__PURE__ */ new Map();
    try {
      const results = await this.sendBatch(batchValues);
      const resultsByStatId = new Map(results.map((r2) => [r2.statId, r2]));
      for (const [statId, resolvers] of resolversByStatId) {
        const r2 = resultsByStatId.get(statId);
        if (!r2 || !r2.ok) {
          const err = new Error(r2?.error ?? "stat submit failed");
          for (const resolver of resolvers) resolver.reject(err);
        } else for (const resolver of resolvers) resolver.resolve({ grants: r2.grants ?? [] });
      }
    } catch (err) {
      for (const [, resolvers] of resolversByStatId) for (const resolver of resolvers) resolver.reject(err);
    }
  }
  async sendBatch(stats) {
    return (await this.rpcClient.call("H5_STATS_SUBMIT_BATCH", { stats })).results ?? [];
  }
};
function initializeStats(rundotGameApiInstance, host) {
  rundotGameApiInstance.stats = host.stats;
}
var RpcCollectiblesApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async listCards() {
    return (await this.rpcClient.call("H5_COLLECTIBLES_LIST_CARDS", {})).cards ?? [];
  }
  async claimVipCard(seriesId, cardId) {
    const response = await this.rpcClient.call("H5_COLLECTIBLES_VIP_CLAIM", {
      seriesId,
      cardId
    });
    return {
      granted: response.granted,
      cardId: response.cardId
    };
  }
};
function initializeCollectibles(rundotGameApiInstance, host) {
  rundotGameApiInstance.collectibles = host.collectibles;
}
var INTERACTIVE_PURCHASE_TIMEOUT = -1;
var USER_CANCELLED_CODE = "USER_CANCELLED";
function isUserCancelled(error) {
  return error?.code === USER_CANCELLED_CODE;
}
var RpcShopApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async getCatalog(includeInactive, includeExpired, includeUnreleased) {
    return await this.rpcClient.call("H5_SHOP_GET_CATALOG", {
      includeInactive,
      includeExpired,
      includeUnreleased
    });
  }
  async getItemDetail(itemId) {
    return (await this.rpcClient.call("H5_SHOP_GET_ITEM_DETAIL", { itemId })).item;
  }
  async purchase(itemId, idempotencyKey) {
    return this.callPurchase({
      itemId,
      idempotencyKey
    });
  }
  async purchaseCollectionItem(collectionId, itemId, idempotencyKey) {
    return this.callPurchase({
      itemId,
      idempotencyKey,
      collectionId
    });
  }
  /**
  * Turn the host's cancel rejection into a resolved result so a dismissed
  * paywall is a RESULT, not an error. Everything else still rejects, so real
  * failures keep reaching the game's catch block.
  *
  * This lives in the SDK rather than the host on purpose: games bundle their
  * own SDK copy, so already-deployed games keep the old rejection until they
  * rebuild, and the new contract holds against every host version that
  * reports the dismissal with `USER_CANCELLED` — old and new alike.
  */
  async callPurchase(args) {
    try {
      return await this.rpcClient.call("H5_SHOP_PURCHASE", args, INTERACTIVE_PURCHASE_TIMEOUT);
    } catch (error) {
      if (!isUserCancelled(error)) throw error;
      return {
        success: false,
        cancelled: true,
        order: null
      };
    }
  }
  async getOrder(orderId) {
    return await this.rpcClient.call("H5_SHOP_GET_ORDER_STATUS", { orderId });
  }
  async getOrderHistory(options) {
    return await this.rpcClient.call("H5_SHOP_GET_ORDER_HISTORY", { limit: options?.limit });
  }
  async requestRefund(orderId, reasonCode) {
    return await this.rpcClient.call("H5_SHOP_REQUEST_REFUND", {
      orderId,
      reasonCode
    });
  }
};
var TAG$12 = "Mock Shop";
var VALID_REFUND_REASONS = /* @__PURE__ */ new Set([
  "not_as_expected",
  "accidental_purchase",
  "technical_issue",
  "changed_mind",
  "other"
]);
var MOCK_ITEMS = [{
  itemId: "speed_boost",
  name: "Speed Boost",
  description: "Doubles movement speed for 60 seconds",
  assets: { icon: "speed_icon.png" },
  price: {
    type: "bucks",
    value: "100"
  },
  category: "consumable",
  unique: false,
  active: true,
  regions: [],
  tags: ["boost", "consumable"],
  sortOrder: 1,
  releasedAt: null,
  expiresAt: null,
  entitlements: [{
    entitlementId: "speed_boost_ent",
    quantity: 1,
    consumable: true
  }],
  refundEligible: true,
  refundWindowHours: 24,
  resolvedPrice: {
    originalPrice: {
      type: "bucks",
      value: "100"
    },
    finalPrice: {
      type: "bucks",
      value: "75"
    },
    appliedSales: [{
      saleId: "launch_sale",
      discountType: "percentage",
      discountValue: 25
    }]
  }
}, {
  itemId: "premium_skin",
  name: "Premium Skin",
  description: "Exclusive character skin",
  assets: { thumbnail: "premium_skin.png" },
  price: {
    type: "bucks",
    value: "500"
  },
  category: "non_consumable",
  unique: true,
  active: true,
  regions: [],
  tags: ["cosmetic", "exclusive"],
  sortOrder: 2,
  releasedAt: null,
  expiresAt: null,
  entitlements: [{
    entitlementId: "premium_skin_ent",
    quantity: 1,
    consumable: false
  }],
  refundEligible: false,
  refundWindowHours: 0,
  resolvedPrice: {
    originalPrice: {
      type: "bucks",
      value: "500"
    },
    finalPrice: {
      type: "bucks",
      value: "500"
    },
    appliedSales: []
  }
}];
var MOCK_COLLECTIONS = [{
  collectionId: "episodes",
  price: {
    type: "bucks",
    value: "50"
  },
  entitlement: { consumable: false },
  refundEligible: true,
  refundWindowHours: 24,
  resolvedDefaults: {
    originalPrice: {
      type: "bucks",
      value: "50"
    },
    finalPrice: {
      type: "bucks",
      value: "50"
    },
    appliedSales: []
  },
  items: [{
    itemId: "ep-premium-1",
    resolvedPrice: {
      originalPrice: {
        type: "bucks",
        value: "100"
      },
      finalPrice: {
        type: "bucks",
        value: "100"
      },
      appliedSales: []
    }
  }]
}];
function createMockOrder(itemId, item) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const mockItem = item || MOCK_ITEMS[0];
  return {
    orderId: "mock-order-" + Date.now(),
    userId: "mock-user-123",
    gameId: "mock-game-123",
    configId: "mock-config-123",
    itemId,
    itemSnapshot: {
      name: mockItem.name,
      price: mockItem.price,
      entitlements: mockItem.entitlements
    },
    originalPrice: mockItem.resolvedPrice.originalPrice,
    finalPrice: mockItem.resolvedPrice.finalPrice,
    appliedSales: mockItem.resolvedPrice.appliedSales,
    status: "fulfilled",
    statusHistory: [
      {
        status: "created",
        timestamp: now
      },
      {
        status: "pending_payment",
        timestamp: now
      },
      {
        status: "paid",
        timestamp: now
      },
      {
        status: "fulfilled",
        timestamp: now
      }
    ],
    refund: null,
    idempotencyKey: "mock-idem-" + Date.now(),
    createdAt: now,
    updatedAt: now
  };
}
var MockShopApi = class {
  async getCatalog(includeInactive, includeExpired, includeUnreleased) {
    const now = Date.now();
    let items = [...MOCK_ITEMS];
    if (!includeInactive) items = items.filter((i) => i.active);
    if (!includeExpired) items = items.filter((i) => i.expiresAt === null || i.expiresAt > now);
    if (!includeUnreleased) items = items.filter((i) => i.releasedAt === null || i.releasedAt <= now);
    return {
      configId: "mock-config-123",
      items,
      collections: MOCK_COLLECTIONS
    };
  }
  async getItemDetail(itemId) {
    const item = MOCK_ITEMS.find((i) => i.itemId === itemId);
    if (!item) throw new Error(`[RUN:mock] Item not found: ${itemId}`);
    return item;
  }
  async purchase(itemId, _idempotencyKey) {
    mockLog(TAG$12, `purchase itemId=${itemId}`);
    const item = MOCK_ITEMS.find((i) => i.itemId === itemId);
    if (!item) throw new RundotApiError("UNKNOWN", "Item not found", 0);
    return {
      success: true,
      order: createMockOrder(itemId, item)
    };
  }
  async purchaseCollectionItem(collectionId, itemId, _idempotencyKey) {
    mockLog(TAG$12, `purchaseCollectionItem collectionId=${collectionId} itemId=${itemId}`);
    const order = createMockOrder(itemId);
    order.collectionId = collectionId;
    return {
      success: true,
      order
    };
  }
  async getOrder(orderId) {
    const order = createMockOrder("speed_boost");
    order.orderId = orderId;
    return {
      success: true,
      order
    };
  }
  async getOrderHistory(_options) {
    return {
      success: true,
      orders: [createMockOrder("speed_boost")]
    };
  }
  async requestRefund(orderId, reasonCode) {
    mockLog(TAG$12, `requestRefund orderId=${orderId} reason=${reasonCode}`);
    if (!VALID_REFUND_REASONS.has(reasonCode)) throw new RundotApiError("UNKNOWN", "Invalid reason code", 0);
    const order = createMockOrder("speed_boost");
    order.orderId = orderId;
    order.status = "refunded";
    order.statusHistory.push({
      status: "refunded",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    order.refund = {
      amount: order.finalPrice,
      reasonCode,
      requestedAt: (/* @__PURE__ */ new Date()).toISOString(),
      processedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return {
      success: true,
      order
    };
  }
};
function initializeShop(rundotGameApiInstance, host) {
  rundotGameApiInstance.shop = host.shop;
}
var RpcPreloaderApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async showLoadScreen() {
    await this.rpcClient.call("H5_SHOW_LOAD_SCREEN");
  }
  async hideLoadScreen() {
    await this.rpcClient.call("H5_HIDE_LOAD_SCREEN");
  }
  async setLoaderText(text) {
    await this.rpcClient.call("H5_SET_LOADER_TEXT", { text });
  }
  async setLoaderProgress(progress) {
    await this.rpcClient.call("H5_SET_LOADER_PROGRESS", { progress });
  }
};
function initializePreloader(rundotGameApi, host) {
  rundotGameApi.preloader = host.preloader;
}
var RpcUgcApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async create(params) {
    return this.rpcClient.call("H5_UGC_CREATE", params);
  }
  async update(params) {
    return this.rpcClient.call("H5_UGC_UPDATE", params);
  }
  async delete(id) {
    await this.rpcClient.call("H5_UGC_DELETE", { id });
  }
  async get(id) {
    return this.rpcClient.call("H5_UGC_GET", { id });
  }
  async listMine(params) {
    return this.rpcClient.call("H5_UGC_LIST_MINE", params ?? {});
  }
  async browse(params) {
    return this.rpcClient.call("H5_UGC_BROWSE", params ?? {});
  }
  async listShared(params) {
    return this.rpcClient.call("H5_UGC_LIST_SHARED", params ?? {});
  }
  async addCollaborator(params) {
    await this.rpcClient.call("H5_UGC_ADD_MEMBER", params);
  }
  async removeCollaborator(params) {
    await this.rpcClient.call("H5_UGC_REMOVE_MEMBER", params);
  }
  async listCollaborators(entryId) {
    return this.rpcClient.call("H5_UGC_LIST_MEMBERS", { entryId });
  }
  async getMany(params) {
    return this.rpcClient.call("H5_UGC_GET_MANY", params);
  }
  async like(id) {
    return this.rpcClient.call("H5_UGC_LIKE", { id });
  }
  async unlike(id) {
    return this.rpcClient.call("H5_UGC_UNLIKE", { id });
  }
  async recordUse(id) {
    return this.rpcClient.call("H5_UGC_RECORD_USE", { id });
  }
  async report(params) {
    await this.rpcClient.call("H5_UGC_REPORT", params);
  }
  async checkTextAsync(text, options) {
    return checkText(text, options);
  }
  async count(params) {
    return this.rpcClient.call("H5_UGC_COUNT", params ?? {});
  }
  async follow(targetProfileId) {
    await this.rpcClient.call("H5_UGC_FOLLOW", { targetProfileId });
  }
  async unfollow(targetProfileId) {
    await this.rpcClient.call("H5_UGC_UNFOLLOW", { targetProfileId });
  }
  async isFollowing(targetProfileId) {
    return this.rpcClient.call("H5_UGC_IS_FOLLOWING", { targetProfileId });
  }
  async getFollowCounts(targetProfileId) {
    return this.rpcClient.call("H5_UGC_GET_FOLLOW_COUNTS", { targetProfileId });
  }
  async crossAppBrowse(params) {
    return this.rpcClient.call("H5_UGC_CROSS_APP_BROWSE", params);
  }
  async crossAppGet(targetAppId, id) {
    return this.rpcClient.call("H5_UGC_CROSS_APP_GET", {
      targetAppId,
      id
    });
  }
  async crossAppGetMany(targetAppId, params) {
    return this.rpcClient.call("H5_UGC_CROSS_APP_GET_MANY", {
      targetAppId,
      ...params
    });
  }
  async crossAppCount(targetAppId, params) {
    return this.rpcClient.call("H5_UGC_CROSS_APP_COUNT", {
      targetAppId,
      ...params ?? {}
    });
  }
  async crossAppCreate(params) {
    return this.rpcClient.call("H5_UGC_CROSS_APP_CREATE", params);
  }
  async crossAppUpdate(params) {
    return this.rpcClient.call("H5_UGC_CROSS_APP_UPDATE", params);
  }
  async crossAppDelete(targetAppId, id) {
    await this.rpcClient.call("H5_UGC_CROSS_APP_DELETE", {
      targetAppId,
      id
    });
  }
  async getUserRecommendation(count, filter) {
    return this.rpcClient.call("H5_UGC_GET_USER_RECOMMENDATION", {
      count,
      filter
    });
  }
  async getItemRecommendation(ugcId, count, filter) {
    return this.rpcClient.call("H5_UGC_GET_ITEM_RECOMMENDATION", {
      ugcId,
      count,
      filter
    });
  }
  async getCompositeRecommendation(count, sourceFilter, resultFilter) {
    return this.rpcClient.call("H5_UGC_GET_COMPOSITE_RECOMMENDATION", {
      count,
      sourceFilter,
      resultFilter
    });
  }
  async getMoreRecommendations(origRecommId, count) {
    return this.rpcClient.call("H5_UGC_GET_MORE_RECOMMENDATIONS", {
      origRecommId,
      count
    });
  }
  async addDetailView(ugcId, recommId) {
    await this.rpcClient.call("H5_UGC_ADD_DETAIL_VIEW", {
      ugcId,
      recommId
    });
  }
  async addRating(ugcId, rating, recommId) {
    await this.rpcClient.call("H5_UGC_ADD_RATING", {
      ugcId,
      rating,
      recommId
    });
  }
  async addCartAddition(ugcId, recommId) {
    await this.rpcClient.call("H5_UGC_ADD_CART_ADDITION", {
      ugcId,
      recommId
    });
  }
  async setViewPortion(ugcId, portion, recommId) {
    await this.rpcClient.call("H5_UGC_SET_VIEW_PORTION", {
      ugcId,
      portion,
      recommId
    });
  }
  voting = {
    vote: (params) => {
      return this.rpcClient.call("H5_UGC_VOTING_VOTE", params);
    },
    unvote: (params) => {
      return this.rpcClient.call("H5_UGC_VOTING_UNVOTE", params);
    },
    getMyVotes: () => {
      return this.rpcClient.call("H5_UGC_VOTING_GET_MY_VOTES", {});
    },
    getLeaderboard: (params) => {
      return this.rpcClient.call("H5_UGC_VOTING_GET_LEADERBOARD", params ?? {});
    },
    getWinners: (params) => {
      return this.rpcClient.call("H5_UGC_VOTING_GET_WINNERS", params ?? {});
    }
  };
};
var MockUgcApi = class {
  async create(_params) {
    console.warn("[RUN] UGC API not available in mock mode");
    throw new Error("UGC API requires backend connection");
  }
  async update(_params) {
    console.warn("[RUN] UGC API not available in mock mode");
    throw new Error("UGC API requires backend connection");
  }
  async delete(_id) {
    console.warn("[RUN] UGC API not available in mock mode");
    throw new Error("UGC API requires backend connection");
  }
  async get(_id) {
    return null;
  }
  async listMine(_params) {
    return {
      entries: [],
      nextCursor: void 0
    };
  }
  async browse(_params) {
    return {
      entries: [],
      nextCursor: void 0
    };
  }
  async listShared(_params) {
    return {
      entries: [],
      nextCursor: void 0
    };
  }
  async addCollaborator(_params) {
    console.warn("[RUN] UGC API not available in mock mode");
    throw new Error("UGC API requires backend connection");
  }
  async removeCollaborator(_params) {
    console.warn("[RUN] UGC API not available in mock mode");
    throw new Error("UGC API requires backend connection");
  }
  async listCollaborators(_entryId) {
    return {
      authorId: "",
      editorIds: []
    };
  }
  async getMany(_params) {
    return { entries: [] };
  }
  async like(_id) {
    console.warn("[RUN] UGC API not available in mock mode");
    throw new Error("UGC API requires backend connection");
  }
  async unlike(_id) {
    console.warn("[RUN] UGC API not available in mock mode");
    throw new Error("UGC API requires backend connection");
  }
  async recordUse(_id) {
    console.warn("[RUN] UGC API not available in mock mode");
    throw new Error("UGC API requires backend connection");
  }
  async report(_params) {
    console.warn("[RUN] UGC API not available in mock mode");
    throw new Error("UGC API requires backend connection");
  }
  async checkTextAsync(text, options) {
    return checkText(text, options);
  }
  async count(_params) {
    return { count: 0 };
  }
  async follow(_targetProfileId) {
    console.warn("[RUN] UGC API not available in mock mode");
    throw new Error("UGC API requires backend connection");
  }
  async unfollow(_targetProfileId) {
    console.warn("[RUN] UGC API not available in mock mode");
    throw new Error("UGC API requires backend connection");
  }
  async isFollowing(_targetProfileId) {
    return { isFollowing: false };
  }
  async getFollowCounts(_targetProfileId) {
    return {
      followerCount: 0,
      followingCount: 0
    };
  }
  async crossAppBrowse(_params) {
    throw new Error("Cross-app UGC requires a backend connection");
  }
  async crossAppGet(_targetAppId, _id) {
    throw new Error("Cross-app UGC requires a backend connection");
  }
  async crossAppGetMany(_targetAppId, _params) {
    throw new Error("Cross-app UGC requires a backend connection");
  }
  async crossAppCount(_targetAppId, _params) {
    throw new Error("Cross-app UGC requires a backend connection");
  }
  async crossAppCreate(_params) {
    throw new Error("Cross-app UGC requires a backend connection");
  }
  async crossAppUpdate(_params) {
    throw new Error("Cross-app UGC requires a backend connection");
  }
  async crossAppDelete(_targetAppId, _id) {
    throw new Error("Cross-app UGC requires a backend connection");
  }
  async getUserRecommendation(_count, _filter) {
    return {
      recommId: "",
      entries: []
    };
  }
  async getItemRecommendation(_ugcId, _count, _filter) {
    return {
      recommId: "",
      entries: []
    };
  }
  async getCompositeRecommendation(_count, _sourceFilter, _resultFilter) {
    return {
      recommId: "",
      sourceEntry: null,
      entries: []
    };
  }
  async getMoreRecommendations(_origRecommId, _count) {
    return {
      recommId: "",
      entries: []
    };
  }
  async addDetailView(_ugcId, _recommId) {
  }
  async addRating(_ugcId, _rating, _recommId) {
  }
  async addCartAddition(_ugcId, _recommId) {
  }
  async setViewPortion(_ugcId, _portion, _recommId) {
  }
  voting = {
    vote: async () => {
      console.warn("[RUN] UGC voting not available in mock mode");
      throw new Error("UGC voting requires backend connection");
    },
    unvote: async () => {
      console.warn("[RUN] UGC voting not available in mock mode");
      throw new Error("UGC voting requires backend connection");
    },
    getMyVotes: async () => {
      return {
        weekKey: "mock",
        totals: {
          budget: 0,
          used: 0,
          remaining: 0
        },
        byEntry: []
      };
    },
    getLeaderboard: async () => {
      return {
        weekKey: "mock",
        items: [],
        nextCursor: null
      };
    },
    getWinners: async () => {
      return {
        items: [],
        nextCursor: null
      };
    }
  };
};
function initializeUgc(rundotGameApiInstance, host) {
  rundotGameApiInstance.ugc = host.ugc;
}
var MOCK_QR_CODE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
var MOCK_SHARE_LINK_ID = "mock-share-id";
var MockSocialApi = class {
  async shareLinkAsync(options) {
    validateShareParams(options.shareParams);
    validateShareMetadata(options.metadata);
    validateShareTarget(options.target);
    const shareUrl = this.createMockUrl(options.shareParams);
    if (typeof navigator !== "undefined" && navigator.clipboard) try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      console.warn("[RUN:mock] Failed to copy share URL to clipboard", error);
    }
    return {
      shareUrl,
      shareLinkId: MOCK_SHARE_LINK_ID
    };
  }
  async createQRCodeAsync(options) {
    validateShareParams(options.shareParams);
    validateShareMetadata(options.metadata);
    validateShareTarget(options.target);
    return {
      shareUrl: this.createMockUrl(options.shareParams),
      qrCode: MOCK_QR_CODE,
      shareLinkId: MOCK_SHARE_LINK_ID
    };
  }
  async setShareIntentAsync(options) {
    validateShareIntentParams(options.shareParams);
    validateShareMetadata(options.metadata);
    validateShareTarget(options.target);
  }
  async clearShareIntentAsync() {
  }
  async addShareClickDataAsync(options) {
    validateClickMetadata(options.metadata);
  }
  async getShareClicksAsync(options) {
    return {
      clicks: [],
      truncated: false
    };
  }
  async getMyShareClickDataAsync(options) {
    return null;
  }
  async shareFileAsync(options) {
    validateShareFile(options);
    console.warn("[RUN:mock] shareFileAsync called \u2014 returning cancelled: false");
    return { cancelled: false };
  }
  async canShareFileAsync() {
    return { supported: false };
  }
  async composeSocialPostAsync(options) {
    const text = stripComposeControlChars(options.text ?? "");
    const title = options.title === void 0 ? void 0 : stripComposeControlChars(options.title);
    validateComposePost({
      text,
      title,
      subreddit: options.subreddit
    });
    if (options.media) validateShareFile(options.media);
    validateShareParams(options.shareParams);
    validateShareMetadata(options.metadata);
    const link = options.shareParams ? this.createMockUrl(options.shareParams) : void 0;
    if (options.platform === "tiktok" || options.platform === "instagram") {
      console.warn(`[RUN:mock] composeSocialPostAsync: "${options.platform}" is a share-sheet destination with no mock UI \u2014 returning completed: false`);
      return { completed: false };
    }
    const destination = options.platform ?? "x";
    const url = destination === "reddit" ? buildRedditComposerUrl({
      text,
      link,
      title,
      subreddit: options.subreddit
    }) : buildXComposerUrl(text, link);
    if (typeof window !== "undefined" && typeof window.open === "function") window.open(url, "_blank", "noopener,noreferrer");
    else console.warn(`[RUN:mock] composeSocialPostAsync composer URL: ${url}`);
    return {
      completed: true,
      destination
    };
  }
  async openXFollowMeLinkAsync() {
    console.warn("[RUN:mock] openXFollowMeLinkAsync called \u2014 returning not_configured");
    return {
      completed: false,
      reason: "not_configured"
    };
  }
  async openInstagramFollowMeLinkAsync() {
    console.warn("[RUN:mock] openInstagramFollowMeLinkAsync called \u2014 returning not_configured");
    return {
      completed: false,
      reason: "not_configured"
    };
  }
  async openTikTokFollowMeLinkAsync() {
    console.warn("[RUN:mock] openTikTokFollowMeLinkAsync called \u2014 returning not_configured");
    return {
      completed: false,
      reason: "not_configured"
    };
  }
  async openDiscordFollowMeLinkAsync() {
    console.warn("[RUN:mock] openDiscordFollowMeLinkAsync called \u2014 returning not_configured");
    return {
      completed: false,
      reason: "not_configured"
    };
  }
  async getConfiguredFollowMePlatformsAsync() {
    return [];
  }
  createMockUrl(_shareParams) {
    console.warn("[RUN:mock] Share params are stored online \u2014 mock URL is just a template");
    console.warn("[RUN:mock] Actual share URL looks like: https://mock-share-url.com/97dt/mock-share-id");
    return `https://mock-share-url.com/97dt/mock-share-id`;
  }
};
var RpcAudioGenApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async generate(params) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_AUDIO_GEN_GENERATE", params, -1));
  }
  async getCompletedJobs() {
    return this.rpcClient.call("H5_POLL_COMPLETED_JOBS", { type: "audioGen" });
  }
  async listVoices() {
    return this.rpcClient.call("H5_AUDIO_GEN_LIST_VOICES");
  }
  async designVoices(params) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_AUDIO_GEN_DESIGN_VOICES", params, -1));
  }
  async saveDesignedVoice(params) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_AUDIO_GEN_SAVE_DESIGNED_VOICE", params, -1));
  }
};
var MockAudioGenApi = class {
  async generate(_params) {
    console.warn("[RUN] Audio generation API not available in mock mode");
    throw new Error("Audio generation API requires backend connection");
  }
  async getCompletedJobs() {
    return [];
  }
  async listVoices() {
    console.warn("[RUN] Voice library API not available in mock mode");
    return { voices: [] };
  }
  async designVoices(_params) {
    console.warn("[RUN] designVoices not available in mock mode");
    throw new Error("Voice design API requires backend connection");
  }
  async saveDesignedVoice(_params) {
    console.warn("[RUN] saveDesignedVoice not available in mock mode");
    throw new Error("Save designed voice API requires backend connection");
  }
};
var RpcVideoGenApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async generate(params) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_VIDEO_GEN_GENERATE", params, -1));
  }
  async getCompletedJobs() {
    return this.rpcClient.call("H5_POLL_COMPLETED_JOBS", { type: "videoGen" });
  }
  async cancel(jobId) {
    await this.rpcClient.call("H5_VIDEO_GEN_CANCEL", { jobId });
  }
  onJobStarted(callback) {
    return this.rpcClient.onNotification("H5_VIDEO_GEN_JOB_STARTED", callback);
  }
};
var MockVideoGenApi = class {
  async generate(_params) {
    console.warn("[RUN] Video generation API not available in mock mode");
    throw new Error("Video generation API requires backend connection");
  }
  async getCompletedJobs() {
    return [];
  }
  async cancel(_jobId) {
  }
  onJobStarted(_callback) {
    return { unsubscribe: () => {
    } };
  }
};
var RpcFilesApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async upload(params) {
    return this.rpcClient.call("H5_FILES_UPLOAD", params);
  }
  async confirmUpload(key, options) {
    return this.rpcClient.call("H5_FILES_CONFIRM_UPLOAD", {
      key,
      ...options
    }, -1);
  }
  async batchUpload(params) {
    return this.rpcClient.call("H5_FILES_BATCH_UPLOAD", params);
  }
  async batchCopy(params) {
    return this.rpcClient.call("H5_FILES_BATCH_COPY", params, -1);
  }
  async batchConfirm(keys, options) {
    return this.rpcClient.call("H5_FILES_BATCH_CONFIRM", {
      keys,
      ...options
    });
  }
  async getUrl(params) {
    return (await this.rpcClient.call("H5_FILES_GET_URL", params)).url;
  }
  async getUrls(params) {
    return this.rpcClient.call("H5_FILES_GET_URLS", params);
  }
  async getMetadata(params) {
    return this.rpcClient.call("H5_FILES_GET_METADATA", params);
  }
  async exists(params) {
    return this.rpcClient.call("H5_FILES_EXISTS", params);
  }
  async batchGetMetadata(params) {
    return this.rpcClient.call("H5_FILES_BATCH_METADATA", params);
  }
  async batchExists(params) {
    return this.rpcClient.call("H5_FILES_BATCH_EXISTS", params);
  }
  async delete(key) {
    await this.rpcClient.call("H5_FILES_DELETE", { key });
  }
  async list(params) {
    return this.rpcClient.call("H5_FILES_LIST", params ?? {});
  }
  async getQuota() {
    return this.rpcClient.call("H5_FILES_GET_QUOTA", {});
  }
  async hasStorageAvailable(sizeBytes, contentType) {
    const quota = await this.getQuota();
    const cap = contentType === "application/zip" ? quota.maxArchiveBytes : quota.maxFileBytes;
    return quota.availableBytes >= sizeBytes && sizeBytes <= cap;
  }
  async setVisibility(key, visibility) {
    return this.rpcClient.call("H5_FILES_SET_VISIBILITY", {
      key,
      visibility
    });
  }
  async transform(params) {
    return this.rpcClient.call("H5_FILES_TRANSFORM", params, -1);
  }
  async exportToCloudinary(params) {
    return this.rpcClient.call("H5_FILES_EXPORT_CLOUDINARY", params, -1);
  }
  async getCompletedJobs() {
    return this.rpcClient.call("H5_POLL_COMPLETED_JOBS", { type: "files" });
  }
};
var MockFilesApi = class {
  async upload(_params) {
    console.warn("[RUN] Files API not available in mock mode");
    throw new Error("Files API requires backend connection");
  }
  async confirmUpload(_key, _options) {
    throw new Error("Files API requires backend connection");
  }
  async batchUpload(_params) {
    throw new Error("Files API requires backend connection");
  }
  async batchCopy(_params) {
    throw new Error("Files API requires backend connection");
  }
  async batchConfirm(_keys, _options) {
    throw new Error("Files API requires backend connection");
  }
  async getUrl(_params) {
    throw new Error("Files API requires backend connection");
  }
  async getUrls(_params) {
    throw new Error("Files API requires backend connection");
  }
  async getMetadata(_params) {
    throw new Error("Files API requires backend connection");
  }
  async exists(_params) {
    return false;
  }
  async batchGetMetadata(_params) {
    return {
      entries: {},
      ttlMs: 0
    };
  }
  async batchExists(params) {
    const results = {};
    for (const key of params.keys) results[key] = false;
    return { results };
  }
  async delete(_key) {
    throw new Error("Files API requires backend connection");
  }
  async list(_params) {
    return { files: [] };
  }
  async getQuota() {
    return {
      usedBytes: 0,
      capBytes: 0,
      availableBytes: 0,
      maxFileBytes: 0,
      maxArchiveBytes: 0,
      tier: "free"
    };
  }
  async hasStorageAvailable(_sizeBytes, _contentType) {
    return false;
  }
  async setVisibility(_key, _visibility) {
    throw new Error("Files API requires backend connection");
  }
  async transform(_params) {
    throw new Error("Files API requires backend connection");
  }
  async exportToCloudinary(_params) {
    throw new Error("Files API requires backend connection");
  }
  async getCompletedJobs() {
    return [];
  }
};
var MockClipsApi = class {
  async isSupportedAsync() {
    return {
      canRecord: false,
      canUseMicrophone: false,
      canUseCamera: false,
      reason: "mock host"
    };
  }
  async getCaptureConsentAsync() {
    return {
      status: "granted",
      canAskAgain: true
    };
  }
  async requestCaptureConsentAsync(_opts) {
    return {
      status: "granted",
      canAskAgain: true
    };
  }
  useGameAudio(_node) {
  }
  async startRecordingAsync(_options) {
    console.warn("[RUN:mock] clips.startRecordingAsync is a no-op");
  }
  captureFrame() {
  }
  async stopRecordingAsync(_persist) {
    throw new Error("[RUN:mock] clips recording is not available in the mock host");
  }
  async cancelRecordingAsync() {
  }
  async publishClipAsync(_ugcId) {
    throw new Error("[RUN:mock] clips.publishClipAsync is not available in the mock host");
  }
};
var RpcThreeDGenApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async generate(params) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_THREE_D_GEN_GENERATE", params, -1));
  }
  async remesh(params) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_THREE_D_GEN_REMESH", params, -1));
  }
  async rig(params) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_THREE_D_GEN_RIG", params, -1));
  }
  async animate(params) {
    return mapCreditsExhaustion(this.rpcClient.call("H5_THREE_D_GEN_ANIMATE", params, -1));
  }
  async getCompletedJobs() {
    return this.rpcClient.call("H5_POLL_COMPLETED_JOBS", { type: "threeDGen" });
  }
};
var MockThreeDGenApi = class {
  async generate(_params) {
    console.warn("[RUN] 3D generation API not available in mock mode");
    throw new Error("3D generation API requires backend connection");
  }
  async remesh(_params) {
    console.warn("[RUN] 3D remesh API not available in mock mode");
    throw new Error("3D remesh API requires backend connection");
  }
  async rig(_params) {
    console.warn("[RUN] 3D rig API not available in mock mode");
    throw new Error("3D rig API requires backend connection");
  }
  async animate(_params) {
    console.warn("[RUN] 3D animate API not available in mock mode");
    throw new Error("3D animate API requires backend connection");
  }
  async getCompletedJobs() {
    return [];
  }
};
var RpcChoicesApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async getBalance() {
    return this.rpcClient.call("H5_CHOICES_GET_BALANCE", {});
  }
  async spend(request) {
    return this.rpcClient.call("H5_CHOICES_SPEND", { ...request });
  }
};
var TAG2 = "Mock Choices";
var INITIAL_BALANCE = 5e3;
var MockChoicesApi = class {
  balance;
  seenRequests;
  constructor(initialBalance = INITIAL_BALANCE) {
    this.balance = initialBalance;
    this.seenRequests = /* @__PURE__ */ new Map();
  }
  async getBalance() {
    mockLog(TAG2, `getBalance() \u2192 ${this.balance}`);
    return { diamonds: this.balance };
  }
  async spend(request) {
    const { amount, reason, clientRequestId } = request;
    if (!clientRequestId || typeof clientRequestId !== "string") throw new RundotApiError("MALFORMED_REQUEST", "clientRequestId is required", 400);
    if (!reason || typeof reason !== "string") throw new RundotApiError("MALFORMED_REQUEST", "reason is required", 400);
    if (typeof amount !== "number" || !Number.isInteger(amount) || amount < 1) throw new RundotApiError("INVALID_AMOUNT", "amount must be a positive integer", 400);
    const prior = this.seenRequests.get(clientRequestId);
    if (prior) {
      mockLog(TAG2, `spend() replay for ${clientRequestId}`);
      return {
        ...prior,
        alreadyProcessed: true
      };
    }
    if (this.balance < amount) throw new RundotApiError("INSUFFICIENT_FUNDS", `balance ${this.balance} < amount ${amount}`, 402);
    this.balance -= amount;
    const result = {
      newDiamonds: this.balance,
      amountDebited: amount,
      transactionRef: generateId(),
      alreadyProcessed: false
    };
    this.seenRequests.set(clientRequestId, result);
    mockLog(TAG2, `spend(${amount}, "${reason}") \u2192 ${this.balance}`);
    return result;
  }
};
function isAnonymousMultiplayerAllowed() {
  if (typeof window === "undefined") return false;
  return window.rundotGame?._config?.anonymousMultiplayerAllowed === true;
}
var RpcAccessGateApi = class {
  rpcClient;
  rundotGameApi;
  autoPromptLogin = true;
  inFlightLogin = null;
  constructor(rpcClient, rundotGameApi) {
    this.rpcClient = rpcClient;
    this.rundotGameApi = rundotGameApi;
  }
  getAccessTier() {
    const profile = this.rundotGameApi._profileData;
    if (!profile || profile.isAnonymous) return "anonymous";
    return "authenticated_18plus";
  }
  isAnonymous() {
    return this.getAccessTier() === "anonymous";
  }
  async promptLogin() {
    if (this.inFlightLogin) return this.inFlightLogin;
    this.inFlightLogin = this.doPromptLogin().finally(() => {
      this.inFlightLogin = null;
    });
    return this.inFlightLogin;
  }
  async doPromptLogin() {
    const result = await this.rpcClient.call("H5_PROMPT_LOGIN", {}, -1);
    if (result.success && result.profile) this.rundotGameApi._profileData = sanitizeProfile(result.profile);
    return result;
  }
};
function initializeAccessGate(rundotGameApi, host) {
  rundotGameApi.accessGate = host.accessGate;
}
var RpcVideoApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async requestPiPAsync(input) {
    return await this.rpcClient.call("H5_VIDEO_REQUEST_PIP", input);
  }
  async readyForPlaybackResumeAsync(input) {
    await this.rpcClient.call("H5_VIDEO_WEB_READY", input);
  }
  async resumeAckAsync(input) {
    await this.rpcClient.call("H5_VIDEO_RESUME_ACK", input);
  }
  onResumeFromNativePlayback(callback) {
    return this.rpcClient.onNotification("H5_VIDEO_RESUME_FROM_NATIVE_PLAYBACK", callback);
  }
};
function initializeVideo(rundotGameApi, host) {
  rundotGameApi.video = host.video;
}
var RpcActivityApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async startActivityAsync(intent) {
    try {
      return await this.rpcClient.call("H5_ACTIVITY_START", intent);
    } catch (error) {
      if (isUnsupportedMessageError(error)) return {
        activityId: `unsupported:${intent.key}`,
        status: "skipped",
        reason: "unsupported_surface"
      };
      throw error;
    }
  }
  updateActivity(input) {
    this.rpcClient.notify("H5_ACTIVITY_UPDATE", input);
  }
  async endActivityAsync(input) {
    try {
      await this.rpcClient.call("H5_ACTIVITY_END", input);
    } catch (error) {
      if (isUnsupportedMessageError(error)) return;
      throw error;
    }
  }
  onActivityAction(callback) {
    return this.rpcClient.onNotification("ACTIVITY_ACTION", (payload) => {
      if (!isActivityActionEvent(payload)) return;
      callback(payload);
    });
  }
};
function initializeActivity(rundotGameApi, host) {
  rundotGameApi.activity = host.activity;
}
var RpcAdminUgcApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async browse(params) {
    return this.rpcClient.call("H5_APP_ADMIN_UGC_BROWSE", params ?? {});
  }
  async removeEntry(entryId) {
    await this.rpcClient.call("H5_APP_ADMIN_UGC_REMOVE_ENTRY", { entryId });
  }
  async listReports(params) {
    return this.rpcClient.call("H5_APP_ADMIN_UGC_LIST_REPORTS", params ?? {});
  }
  async resolveReport(reportId, action) {
    await this.rpcClient.call("H5_APP_ADMIN_UGC_RESOLVE_REPORT", {
      reportId,
      action
    });
  }
};
var RpcAppApi = class {
  rpcClient;
  adminUgc;
  adminImageGen;
  adminVideoGen;
  adminSpriteGen;
  adminAudioGen;
  adminThreeDGen;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
    this.adminUgc = new RpcAdminUgcApi(rpcClient);
    this.adminImageGen = createRpcAdminGenApi(rpcClient, {
      browse: "H5_APP_ADMIN_IMAGEGEN_BROWSE",
      removeEntry: "H5_APP_ADMIN_IMAGEGEN_REMOVE_ENTRY",
      listReports: "H5_APP_ADMIN_IMAGEGEN_LIST_REPORTS",
      resolveReport: "H5_APP_ADMIN_IMAGEGEN_RESOLVE_REPORT"
    });
    this.adminVideoGen = createRpcAdminGenApi(rpcClient, {
      browse: "H5_APP_ADMIN_VIDEOGEN_BROWSE",
      removeEntry: "H5_APP_ADMIN_VIDEOGEN_REMOVE_ENTRY",
      listReports: "H5_APP_ADMIN_VIDEOGEN_LIST_REPORTS",
      resolveReport: "H5_APP_ADMIN_VIDEOGEN_RESOLVE_REPORT"
    });
    this.adminSpriteGen = createRpcAdminGenApi(rpcClient, {
      browse: "H5_APP_ADMIN_SPRITEGEN_BROWSE",
      removeEntry: "H5_APP_ADMIN_SPRITEGEN_REMOVE_ENTRY",
      listReports: "H5_APP_ADMIN_SPRITEGEN_LIST_REPORTS",
      resolveReport: "H5_APP_ADMIN_SPRITEGEN_RESOLVE_REPORT"
    });
    this.adminAudioGen = createRpcAdminGenApi(rpcClient, {
      browse: "H5_APP_ADMIN_AUDIOGEN_BROWSE",
      removeEntry: "H5_APP_ADMIN_AUDIOGEN_REMOVE_ENTRY",
      listReports: "H5_APP_ADMIN_AUDIOGEN_LIST_REPORTS",
      resolveReport: "H5_APP_ADMIN_AUDIOGEN_RESOLVE_REPORT"
    });
    this.adminThreeDGen = createRpcAdminGenApi(rpcClient, {
      browse: "H5_APP_ADMIN_THREEDGEN_BROWSE",
      removeEntry: "H5_APP_ADMIN_THREEDGEN_REMOVE_ENTRY",
      listReports: "H5_APP_ADMIN_THREEDGEN_LIST_REPORTS",
      resolveReport: "H5_APP_ADMIN_THREEDGEN_RESOLVE_REPORT"
    });
  }
  async getMyRole() {
    return (await this.rpcClient.call("H5_APP_GET_MY_ROLE", {})).role;
  }
  async resolveLaunchIntent(options) {
    return this.rpcClient.call("H5_RESOLVE_LAUNCH_INTENT", { maxWaitMs: options?.maxWaitMs });
  }
  async getReleaseNotesAsync() {
    return (await this.rpcClient.call("H5_GET_RELEASE_NOTES")).releaseNotes;
  }
  async openReleaseNotesAsync() {
    await this.rpcClient.call("H5_OPEN_RELEASE_NOTES");
  }
};
function initializeApp(rundotGameApiInstance, host) {
  rundotGameApiInstance.app = host.app;
}
var RpcAttributionApi = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async getAttributionParams() {
    return this.rpcClient.call("H5_GET_ATTRIBUTION_PARAMS", {});
  }
};
var RpcPlayableApi = class {
  rpcClient;
  rundotGameApi;
  preSaveHooks = /* @__PURE__ */ new Set();
  constructor(rpcClient, rundotGameApi) {
    this.rpcClient = rpcClient;
    this.rundotGameApi = rundotGameApi;
    this.rpcClient.onNotification("HOST_FLUSH_STATE", async () => {
      try {
        for (const hook of this.preSaveHooks) await hook();
      } catch (error) {
        console.error("[RUN:playable] Error running preSave hook:", error);
      } finally {
        this.rpcClient.notify("H5_FLUSH_STATE_ACK", {
          success: true,
          timestamp: Date.now()
        });
      }
    });
  }
  isPlayable() {
    const env = this.rundotGameApi._environmentData;
    if (!env) return false;
    return env.executionMode === "playable";
  }
  async cta(options) {
    try {
      return await this.rpcClient.call("H5_PLAYABLE_CTA", options ?? {});
    } catch {
      return { completed: false };
    }
  }
  async complete(outcome) {
    try {
      await this.rpcClient.call("H5_PLAYABLE_COMPLETE", outcome ?? {});
    } catch {
    }
  }
  milestone(name, params) {
    this.rpcClient.notify("H5_PLAYABLE_MILESTONE", {
      name,
      params: params ?? {},
      timestamp: Date.now()
    });
  }
  onPreSave(hook) {
    this.preSaveHooks.add(hook);
    return () => {
      this.preSaveHooks.delete(hook);
    };
  }
};
function initializePlayable(rundotGameApiInstance, host) {
  rundotGameApiInstance.playable = host.playable;
}
var ROOMS_UNAVAILABLE_MESSAGE = "[RUN] Rooms API is only available when running inside the RUN.world host environment.";
function createUnavailableRoomsApi() {
  const roomsUnavailableError = () => /* @__PURE__ */ new Error(ROOMS_UNAVAILABLE_MESSAGE);
  return {
    async createRoomAsync() {
      throw roomsUnavailableError();
    },
    async joinOrCreateRoomAsync() {
      throw roomsUnavailableError();
    },
    async joinRoomByCodeAsync() {
      throw roomsUnavailableError();
    },
    async getUserRoomsAsync() {
      throw roomsUnavailableError();
    },
    async subscribeAsync() {
      throw roomsUnavailableError();
    },
    async updateRoomDataAsync() {
      throw roomsUnavailableError();
    },
    async getRoomDataAsync() {
      throw roomsUnavailableError();
    },
    async sendRoomMessageAsync() {
      throw roomsUnavailableError();
    },
    async leaveRoomAsync() {
      throw roomsUnavailableError();
    },
    async kickPlayerAsync() {
      throw roomsUnavailableError();
    },
    async startRoomGameAsync() {
      throw roomsUnavailableError();
    },
    async proposeMoveAsync() {
      throw roomsUnavailableError();
    },
    async validateMoveAsync() {
      throw roomsUnavailableError();
    }
  };
}
var SIMULATION_UNAVAILABLE_MESSAGE = "[RUN] Simulation API is only available when running inside the RUN.world host environment.";
function createUnavailableSimulationApi() {
  const simulationUnavailableError = () => /* @__PURE__ */ new Error(SIMULATION_UNAVAILABLE_MESSAGE);
  return {
    isEnabled() {
      return false;
    },
    async getStateAsync() {
      throw simulationUnavailableError();
    },
    async getConfigAsync() {
      throw simulationUnavailableError();
    },
    async executeRecipeAsync() {
      throw simulationUnavailableError();
    },
    async getActiveRunsAsync() {
      throw simulationUnavailableError();
    },
    async collectRecipeAsync() {
      throw simulationUnavailableError();
    },
    async executeScopedRecipeAsync() {
      throw simulationUnavailableError();
    },
    async triggerRecipeChainAsync() {
      throw simulationUnavailableError();
    },
    async getAvailableRecipesAsync() {
      throw simulationUnavailableError();
    },
    async getRecipeRequirementsAsync() {
      throw simulationUnavailableError();
    },
    async getBatchRecipeRequirementsAsync() {
      throw simulationUnavailableError();
    },
    async resolveFieldValueAsync() {
      throw simulationUnavailableError();
    },
    async getEntityMetadataAsync() {
      throw simulationUnavailableError();
    },
    async getSlotContainersAsync() {
      throw simulationUnavailableError();
    },
    async getSlotAssignmentsAsync() {
      throw simulationUnavailableError();
    },
    async assignItemToSlotAsync() {
      throw simulationUnavailableError();
    },
    async removeItemFromSlotAsync() {
      throw simulationUnavailableError();
    },
    async getAvailableItemsAsync() {
      throw simulationUnavailableError();
    },
    async calculatePowerPreviewAsync() {
      throw simulationUnavailableError();
    },
    async validateSlotAssignmentAsync() {
      throw simulationUnavailableError();
    },
    async executeBatchOperationsAsync() {
      throw simulationUnavailableError();
    },
    async subscribeAsync() {
      throw simulationUnavailableError();
    },
    async resetStateAsync() {
      throw simulationUnavailableError();
    }
  };
}
var MockHost = class {
  ads;
  analytics;
  deviceCache;
  appStorage;
  ownerStorage;
  sharedStorage;
  /** @deprecated */
  avatar3d;
  navigation;
  notifications;
  popups;
  profile;
  system;
  cdn;
  time;
  ai;
  textGen;
  haptics;
  gamepad;
  features;
  liveops;
  lifecycle;
  simulation;
  rooms;
  logging;
  iap;
  credits;
  leaderboard;
  ugc;
  preloader;
  social;
  imageGen;
  audioGen;
  videoGen;
  files;
  clips;
  spriteGen;
  threeDGen;
  entitlements;
  choices;
  stats;
  collectibles;
  shop;
  accessGate;
  multiplayer;
  video;
  activity;
  app;
  attribution;
  assetLibrary;
  playable;
  context;
  instanceId = "mock";
  state = 0;
  get isInitialized() {
    return this._isInitialized;
  }
  rundotGameApi;
  _isInitialized = false;
  _overlay;
  _mockLifecyclesApi;
  _mockAdsApi;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
    this._overlay = this.createOverlay();
    this._mockAdsApi = new MockAdsApi(this._overlay);
    this._mockLifecyclesApi = new MockLifecycleApi();
    this.ads = this._mockAdsApi;
    this.analytics = new MockAnalyticsApi();
    const appUrl = typeof window !== "undefined" ? window.location.href : "";
    this.deviceCache = createMockStorageApi("deviceCache", appUrl);
    this.appStorage = createMockStorageApi("appStorage", appUrl);
    this.ownerStorage = createMockStorageApi("ownerStorage", appUrl);
    this.sharedStorage = {
      open: ({ appId, namespace }) => {
        if (appId === "") throw new Error("sharedStorage.open: appId must be a non-empty string or omitted");
        return createMockStorageApi("appStorage", `mock#shared/${appId ?? "mock-app"}/${namespace}`);
      },
      read: ({ appId }) => {
        if (appId === "") throw new Error("sharedStorage.read: appId must be a non-empty string or omitted");
        return {
          listSources: async () => [],
          getAllFromSource: async () => ({}),
          get: async () => null,
          getAllForKey: async () => []
        };
      }
    };
    this.simulation = createUnavailableSimulationApi();
    this.rooms = createUnavailableRoomsApi();
    this.leaderboard = new MockLeaderboardApi();
    this.ugc = new MockUgcApi();
    this.avatar3d = new MockAvatarApi(rundotGameApi);
    this.navigation = new MockNavigationApi(rundotGameApi);
    this.notifications = new MockNotificationsApi(rundotGameApi);
    this.popups = new MockPopupsApi(this._overlay);
    this.profile = new MockProfileApi(rundotGameApi);
    const deviceApi = new MockDeviceApi(rundotGameApi);
    const environmentApi = new MockEnvironmentApi(rundotGameApi);
    this.system = new MockSystemApi(deviceApi, environmentApi, rundotGameApi);
    this.cdn = new MockCdnApi(rundotGameApi);
    this.time = new MockTimeApi(rundotGameApi);
    this.ai = new MockAiApi();
    this.textGen = this.ai;
    this.haptics = new MockHapticsApi(rundotGameApi);
    this.gamepad = new MockGamepadApi();
    this.features = new MockFeaturesApi();
    this.liveops = new MockLiveOpsApi(() => rundotGameApi._mock?.liveops?.client, {
      getUnitId: () => rundotGameApi._profileData?.id,
      onExposure: (assignment, configVersion) => {
        this.analytics.recordCustomEvent("liveops_experiment_exposure", {
          experiment_id: assignment.experimentId,
          variant_id: assignment.variantId,
          variant_weight: assignment.variantWeight,
          total_weight: assignment.totalWeight,
          config_version: configVersion
        }).catch(() => {
        });
      }
    });
    this.lifecycle = this._mockLifecyclesApi;
    this.logging = new MockLoggingApi();
    this.iap = new MockIapApi();
    this.credits = new MockCreditsApi();
    this.social = new MockSocialApi();
    this.imageGen = new MockImageGenApi();
    this.audioGen = new MockAudioGenApi();
    this.videoGen = new MockVideoGenApi();
    this.files = new MockFilesApi();
    this.clips = new MockClipsApi();
    this.spriteGen = new MockSpriteGenApi();
    this.threeDGen = new MockThreeDGenApi();
    this.entitlements = new MockEntitlementApi();
    this.choices = new MockChoicesApi();
    this.stats = new MockStatsApi();
    this.collectibles = new MockCollectiblesApi();
    this.shop = new MockShopApi();
    this.video = new MockVideoApi();
    this.activity = new MockActivityApi();
    this.app = new MockAppApi(rundotGameApi);
    this.attribution = new MockAttributionApi();
    this.assetLibrary = new MockAssetLibraryApi(rundotGameApi);
    this.playable = new MockPlayableApi(rundotGameApi);
    initializeRoomsApi(this.rundotGameApi, this);
    this.preloader = new MockPreloaderApi();
    rundotGameApi.isMock = () => true;
    this.rundotGameApi.sharedAssets = this.assetLibrary;
    this.accessGate = new MockAccessGateApi(rundotGameApi);
    this.multiplayer = new MockMultiplayerApi({ getProfile: () => rundotGameApi.getProfile() });
    applyAccessGates(this);
  }
  initialize(options) {
    this._isInitialized = true;
    this.rundotGameApi._profileData = this.profile.getCurrentProfile();
    this.rundotGameApi._deviceData = this.system.getDevice();
    this.rundotGameApi._environmentData = this.system.getEnvironment();
    this.rundotGameApi._localeData = this.rundotGameApi._mock?.locale || "en-US";
    this.rundotGameApi._languageCodeData = this.rundotGameApi._mock?.languageCode || "en";
    applySafeAreaUpdate(this.rundotGameApi, this.rundotGameApi._safeAreaData || {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    });
    if (typeof window !== "undefined") window.addEventListener("resize", () => {
      const newDevice = this.system.getDevice();
      this.rundotGameApi._deviceData = newDevice;
      this._mockLifecyclesApi.triggerDeviceChanged(newDevice);
    });
    this.context = {
      initializeAsleep: false,
      safeArea: this.rundotGameApi._safeAreaData,
      launchParams: options?.launchParams || { "MOCK_LAUNCH_PARAMS_KEY": "MOCK_LAUNCH_PARAMS_VALUE" },
      shareParams: options?.shareParams || { "MOCK_SHARE_PARAMS_KEY": "MOCK_SHARE_PARAMS_VALUE" },
      notificationParams: {},
      shareLinkId: options?.shareParams ? "mock-share-id" : void 0
    };
    return Promise.resolve(this.context);
  }
  onNotificationParamsUpdate(_callback) {
    return () => {
    };
  }
  createOverlay() {
    const overlayContainer = document.createElement("div");
    overlayContainer.id = "rundot-game-mock-overlay";
    overlayContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10000;
    `;
    document.body.appendChild(overlayContainer);
    const adOverlay = this.setupAdOverlay();
    return {
      container: overlayContainer,
      elements: {},
      appVisibilityState: "visible",
      actionSheetOverlay: this.setupActionSheetOverlay(),
      adOverlay,
      showAdOverlay: (adType) => {
        return this.showAdOverlay(adType);
      },
      showActionSheet: (items, options) => {
        return this.showActionSheetOverlay(items, options);
      }
    };
  }
  tryAwake() {
    if (this.state === 2) {
      this.triggerLifecycleEvent("AWAKE");
      this.state = 1;
    }
  }
  trySleep() {
    if (this.state === 1) {
      this.triggerLifecycleEvent("SLEEP");
      this.state = 2;
    }
  }
  tryPlay() {
    if (this.state === 3) {
      this.triggerLifecycleEvent("AWAKE");
      this.state = 1;
      this.triggerLifecycleEvent("RESUME");
      this.state = 0;
    }
  }
  tryQuit() {
    if (this.state === 0) {
      this.triggerLifecycleEvent("PAUSE");
      this.state = 1;
    }
    if (this.state === 1) {
      this.triggerLifecycleEvent("SLEEP");
      this.state = 2;
    }
    if (this.state === 2) {
      this.triggerLifecycleEvent("QUIT");
      this.state = 3;
    }
  }
  tryResume() {
    if (this.state === 1) {
      this.triggerLifecycleEvent("RESUME");
      this.state = 0;
    }
  }
  async showAdOverlay(type) {
    return new Promise((resolve, reject) => {
      const overlay = this._overlay;
      const adOverlay = overlay.adOverlay;
      overlay.adOverlay.innerHTML = "";
      const heading = document.createElement("h1");
      heading.style.cssText = `
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
      `;
      heading.innerText = type === "interstitial" ? "INTERSTITIAL AD" : "REWARDED VIDEO AD";
      overlay.adOverlay.appendChild(heading);
      const content = document.createElement("div");
      content.style.cssText = `
        width: 300px;
        height: 250px;
        background-color: #1e40af;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        border-radius: 8px;
      `;
      content.innerText = "Mock Ad Content";
      adOverlay.appendChild(content);
      const timer = document.createElement("p");
      timer.style.cssText = `
        margin-bottom: 20px;
        font-size: 16px;
      `;
      timer.innerText = "Normally ads would have a timer...";
      adOverlay.appendChild(timer);
      const okButton = document.createElement("button");
      okButton.style.cssText = `
        padding: 10px 40px;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
      `;
      okButton.innerText = "Close Ad";
      adOverlay.appendChild(okButton);
      adOverlay.style.display = "flex";
      okButton.onclick = () => {
        this.hideAdOverlay();
        resolve(true);
      };
    });
  }
  hideAdOverlay() {
    const overlay = this._overlay;
    if (overlay.adOverlay) overlay.adOverlay.style.display = "none";
  }
  setupActionSheetOverlay() {
    const actionSheetOverlay = document.createElement("div");
    actionSheetOverlay.id = "rundot-game-action-sheet-overlay";
    actionSheetOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10600;
        font-family: sans-serif;
        display: none;
      `;
    document.body.appendChild(actionSheetOverlay);
    return actionSheetOverlay;
  }
  createOverlayButton(id, text, position, onClick, background, color) {
    const button = document.createElement("button");
    button.id = `rundot-game-mock-${id}-button`;
    button.innerText = text;
    button.style.cssText = `
      position: absolute;
      left: ${position.x}px;
      top: ${position.y}px;
      width: ${position.width}px;
      min-width: ${position.width}px;
      height: ${position.height}px;
      background: ${background};
      color: ${color};
      border: none;
      border-radius: 8px;
      font-family: sans-serif;
      font-weight: bold;
      font-size: ${Math.min(position.width, position.height) / 3}px;
      cursor: pointer;
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.9;
      transition: opacity 0.2s;
    `;
    button.addEventListener("click", onClick);
    button.addEventListener("mouseover", () => {
      button.style.opacity = "1";
    });
    button.addEventListener("mouseout", () => {
      button.style.opacity = "0.9";
    });
    return button;
  }
  triggerLifecycleEvent(name) {
    if (name == "PAUSE") this._mockLifecyclesApi.triggerPauseCallbacks();
    else if (name == "RESUME") this._mockLifecyclesApi.triggerResumeCallbacks();
    else if (name == "QUIT") this._mockLifecyclesApi.triggerQuitCallbacks();
    else if (name == "AWAKE") this._mockLifecyclesApi.triggerAwakeCallbacks();
    else if (name == "SLEEP") this._mockLifecyclesApi.triggerSleepCallbacks();
  }
  setupAdOverlay() {
    const adOverlay = document.createElement("div");
    adOverlay.id = "rundot-game-ad-overlay";
    adOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(37, 99, 235, 0.9);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10500;
        font-family: sans-serif;
        display: none;
      `;
    document.body.appendChild(adOverlay);
    return adOverlay;
  }
  showActionSheetOverlay(items, options) {
    return new Promise((resolve, reject) => {
      const overlay = this._overlay;
      overlay.actionSheetOverlay.innerHTML = "";
      overlay.actionSheetOverlay.style.display = "flex";
      const actionSheet = document.createElement("div");
      actionSheet.className = "rundot-game-action-sheet";
      actionSheet.style.cssText = `
        background-color: white;
        border-radius: 8px;
        width: 80%;
        max-width: 400px;
        max-height: 80%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: black;
      `;
      if (options?.title) {
        const titleContainer = document.createElement("div");
        titleContainer.style.cssText = `
          padding: 16px;
          border-bottom: 1px solid #eaeaea;
          font-weight: bold;
          font-size: 18px;
          text-align: center;
          color: black;
        `;
        titleContainer.innerText = options.title;
        actionSheet.appendChild(titleContainer);
      }
      if (options?.message) {
        const messageContainer = document.createElement("div");
        messageContainer.style.cssText = `
          padding: 8px 16px;
          color: #666;
          font-size: 14px;
          text-align: center;
        `;
        messageContainer.innerText = options.message;
        actionSheet.appendChild(messageContainer);
      }
      const optionsContainer = document.createElement("div");
      optionsContainer.style.cssText = `
        overflow-y: auto;
        max-height: 300px;
      `;
      items.forEach((item, index) => {
        const optionItem = document.createElement("div");
        optionItem.style.cssText = `
          padding: 12px 16px;
          border-bottom: 1px solid #eaeaea;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.2s;
          color: black;
        `;
        optionItem.addEventListener("mouseover", () => {
          optionItem.style.backgroundColor = "#f5f5f5";
        });
        optionItem.addEventListener("mouseout", () => {
          optionItem.style.backgroundColor = "white";
        });
        if (item.icon) {
          const iconSpan = document.createElement("span");
          iconSpan.style.cssText = `
          margin-right: 12px;
          font-size: 16px;
        `;
          iconSpan.innerText = item.icon;
          optionItem.appendChild(iconSpan);
        }
        const labelSpan = document.createElement("span");
        labelSpan.style.cssText = `
        color: black;
      `;
        labelSpan.innerText = item.label;
        optionItem.appendChild(labelSpan);
        optionItem.addEventListener("click", () => {
          this.hideActionSheetOverlay();
          resolve(item.id !== void 0 ? item.id : index);
        });
        optionsContainer.appendChild(optionItem);
      });
      actionSheet.appendChild(optionsContainer);
      if (!options?.disableCancel) {
        const cancelButton = document.createElement("div");
        cancelButton.style.cssText = `
        padding: 14px 16px;
        text-align: center;
        font-weight: bold;
        cursor: pointer;
        color: #3b82f6;
        border-top: 1px solid #eaeaea;
      `;
        cancelButton.innerText = options?.cancelButtonText || "Cancel";
        cancelButton.addEventListener("click", () => {
          this.hideActionSheetOverlay();
          resolve(null);
        });
        actionSheet.appendChild(cancelButton);
      }
      if (!options?.disableCancel) {
        const closeButton = document.createElement("div");
        closeButton.style.cssText = `
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border-radius: 12px;
          background-color: rgba(0,0,0,0.1);
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
        `;
        closeButton.innerText = "\u2715";
        closeButton.addEventListener("click", () => {
          this.hideActionSheetOverlay();
          resolve(null);
        });
        actionSheet.appendChild(closeButton);
        overlay.actionSheetOverlay.appendChild(actionSheet);
      }
    });
  }
  hideActionSheetOverlay() {
    const overlay = this._overlay;
    if (overlay.actionSheetOverlay) overlay.actionSheetOverlay.style.display = "none";
  }
};
var RundotGameTransport = class {
  messageHandler;
  onNotificationCallbacks = [];
  onNotificationCallbacksToRemove = [];
  onRundotGameMessageCallbacks = [];
  onResponseCallbacks = [];
  onResponseCallbacksToRemove = [];
  _instanceId = null;
  isStarted = false;
  isProcessingMessage = false;
  constructor() {
    this.messageHandler = async (event) => {
      const cfg = typeof window !== "undefined" && window.__rundotConfig || null;
      const expectedParentOrigin = cfg && cfg.parentOrigin || "";
      const expectedNonce = cfg && cfg.nonce || "";
      if (!(event.origin === "" && event.source == null)) {
        if (expectedParentOrigin && event.origin !== expectedParentOrigin) return;
        if (typeof window !== "undefined" && event.source !== window.parent) return;
      }
      this.isProcessingMessage = true;
      let message;
      if (typeof event.data === "string") try {
        message = JSON.parse(event.data);
      } catch {
        this.isProcessingMessage = false;
        return;
      }
      else message = event.data;
      if (!message) {
        this.logInfo("No message found. Ignoring message...");
        this.isProcessingMessage = false;
        return;
      }
      if (expectedNonce && message.nonce !== expectedNonce) {
        this.isProcessingMessage = false;
        return;
      }
      this.notifyRundotGameMessageReceived(message);
      if (message.type === "PAUSE" || message.type === "RESUME" || message.type === "AWAKE" || message.type === "SLEEP" || message.type === "QUIT" || message.type === "IDENTITY_CHANGED" || message.type === "BACK_BUTTON" || message.type === "H5_SYSTEM_FULLSCREEN_STATE_CHANGED" || message.type === "H5_SYSTEM_POINTER_INPUT" || message.type === "H5_SAFE_AREA_CHANGED" || message.type === "H5_DEVICE_CHANGED") {
        const notification = {
          type: "rpc-notification",
          id: message.type,
          payload: message.data
        };
        this.handleNotification(notification);
        this.isProcessingMessage = false;
        return;
      }
      const messageData = message.data;
      if (!messageData) {
        this.logWarn("No data found. Ignoring message...");
        this.isProcessingMessage = false;
        return;
      }
      if (message.type === "H5_SIMULATION_UPDATE") {
        const notification = {
          type: "rpc-notification",
          id: message.type,
          payload: message.data
        };
        this.handleNotification(notification);
        this.isProcessingMessage = false;
        return;
      }
      if (message.type === "H5_VIDEO_RESUME_FROM_NATIVE_PLAYBACK") {
        const notification = {
          type: "rpc-notification",
          id: message.type,
          payload: message.data
        };
        this.handleNotification(notification);
        this.isProcessingMessage = false;
        return;
      }
      if (message.type === "H5_VIDEO_GEN_JOB_STARTED") {
        const notification = {
          type: "rpc-notification",
          id: message.type,
          payload: message.data
        };
        this.handleNotification(notification);
        this.isProcessingMessage = false;
        return;
      }
      if (message.type === "NOTIFICATION_PARAMS_UPDATE") {
        const notification = {
          type: "rpc-notification",
          id: message.type,
          payload: message.data
        };
        this.handleNotification(notification);
        this.isProcessingMessage = false;
        return;
      }
      if (message.type === "CREDITS_BALANCE_UPDATE") {
        const notification = {
          type: "rpc-notification",
          id: message.type,
          payload: message.data
        };
        this.handleNotification(notification);
        this.isProcessingMessage = false;
        return;
      }
      if (message.type === "ACTIVITY_ACTION") {
        const notification = {
          type: "rpc-notification",
          id: message.type,
          payload: message.data
        };
        this.handleNotification(notification);
        this.isProcessingMessage = false;
        return;
      }
      if (message.type === "GAMEPAD_SNAPSHOT" || message.type === "GAMEPAD_CONNECTED" || message.type === "GAMEPAD_DISCONNECTED") {
        const notification = {
          type: "rpc-notification",
          id: message.type,
          payload: message.data
        };
        this.handleNotification(notification);
        this.isProcessingMessage = false;
        return;
      }
      if (message.type === "H5_AI_CHAT_COMPLETION_STREAM_CHUNK" || message.type === "H5_AI_CHAT_COMPLETION_STREAM_DONE" || message.type === "H5_AI_CHAT_COMPLETION_STREAM_ERROR") {
        const notification = {
          type: "rpc-notification",
          id: message.type,
          payload: message.data
        };
        this.handleNotification(notification);
        this.isProcessingMessage = false;
        return;
      }
      if (message.type === "HOST_FLUSH_STATE") {
        const notification = {
          type: "rpc-notification",
          id: message.type,
          payload: message.data
        };
        this.handleNotification(notification);
        this.isProcessingMessage = false;
        return;
      }
      const requestId = messageData.requestId;
      if (!requestId) {
        this.logWarn("No requestId. Ignoring message...");
        this.isProcessingMessage = false;
        return;
      }
      if (message.type !== "H5_RESPONSE") {
        this.logWarn(`Ignoring unknown message type: ${message.type}`);
        this.isProcessingMessage = false;
        return;
      }
      const success = messageData.success;
      let error = void 0;
      if (!success) error = {
        message: messageData.error || "Unknown error",
        ...messageData.errorCode ? { code: messageData.errorCode } : {},
        ...messageData.errorDetail ? { detail: messageData.errorDetail } : {},
        ...messageData.errorInfo ? { errorDetail: messageData.errorInfo } : {},
        ...messageData.retryAfterMs !== void 0 ? { retryAfterMs: messageData.retryAfterMs } : {}
      };
      let result = messageData.value;
      if (result === void 0) result = messageData.data;
      const response = {
        type: "rpc-response",
        id: requestId,
        result,
        method: message.type,
        error
      };
      await this.handleResponse(response);
      this.isProcessingMessage = false;
    };
  }
  onNotification(callback) {
    this.onNotificationCallbacks.push(callback);
    return { unsubscribe: () => {
      if (this.isProcessingMessage) this.onNotificationCallbacks.push(callback);
      else this.removeOnNotificationCallback(callback);
    } };
  }
  onRequest(callback) {
    throw new Error("Method not implemented.");
  }
  onResponse(callback) {
    this.onResponseCallbacks.push(callback);
    return { unsubscribe: () => {
      if (this.isProcessingMessage) this.onResponseCallbacksToRemove.push(callback);
      else this.removeOnResponseCallback(callback);
    } };
  }
  get instanceId() {
    return this._instanceId;
  }
  set instanceId(instanceId) {
    this._instanceId = instanceId;
  }
  sendRequest(request) {
    const instanceId = this.instanceId || "unknown";
    const message = {
      type: request.method,
      direction: "H5_TO_APP",
      data: {
        ...request.args && typeof request.args === "object" ? request.args : {},
        requestId: request.id
      },
      instanceId,
      timestamp: Date.now()
    };
    this.sendRundotGameMessage(message);
  }
  sendRundotGameMessage(message) {
    const cfg = typeof window !== "undefined" && window.__rundotConfig || null;
    const nonce = cfg && cfg.nonce || "";
    if (nonce && !message.nonce) message.nonce = nonce;
    const messageAsString = JSON.stringify(message, null, 2);
    const reactNativeWebView = window.ReactNativeWebView;
    if (reactNativeWebView) reactNativeWebView.postMessage(messageAsString);
    else {
      const parentOrigin = cfg && cfg.parentOrigin || "*";
      window.parent.postMessage(messageAsString, parentOrigin);
    }
  }
  sendResponse(response) {
    throw new Error("Method not implemented.");
  }
  start() {
    if (this.isStarted) return;
    this.isStarted = true;
    window.addEventListener("message", this.messageHandler, true);
    this.logInfo(`Started`);
  }
  stop() {
    if (!this.isStarted) return;
    this.isStarted = false;
    window.removeEventListener("message", this.messageHandler);
    this.logInfo(`Stopped`);
  }
  handleNotification(notification) {
    for (const callback of this.onNotificationCallbacks) callback(notification);
    for (const callback of this.onNotificationCallbacksToRemove) this.removeOnNotificationCallback(callback);
    this.onNotificationCallbacksToRemove.length = 0;
  }
  async handleResponse(response) {
    for (const callback of this.onResponseCallbacks) if (await callback(response)) break;
    for (const callback of this.onResponseCallbacksToRemove) this.removeOnResponseCallback(callback);
    this.onResponseCallbacksToRemove.length = 0;
  }
  removeOnResponseCallback(callback) {
    this.onResponseCallbacks.splice(this.onResponseCallbacks.indexOf(callback), 1);
  }
  removeOnNotificationCallback(callback) {
    this.onNotificationCallbacks.splice(this.onNotificationCallbacks.indexOf(callback), 1);
  }
  logInfo(message, ...params) {
  }
  logWarn(message, ...params) {
    console.warn(`[RUN:transport] ${message}`, ...params);
  }
  onRundotGameMessage(callback) {
    this.onRundotGameMessageCallbacks.push(callback);
    return { unsubscribe: () => {
      this.onRundotGameMessageCallbacks.splice(this.onRundotGameMessageCallbacks.indexOf(callback), 1);
    } };
  }
  notifyRundotGameMessageReceived(message) {
    for (const callback of this.onRundotGameMessageCallbacks) callback(message);
  }
};
var NOOP_SUBSCRIPTION = { unsubscribe: () => {
} };
function attachBrowserLifecycleResumeRecovery(lifecycle, win = typeof window === "undefined" ? void 0 : window, doc = typeof document === "undefined" ? void 0 : document) {
  if (!win || !doc || win.parent === win || typeof win.ReactNativeWebView !== "undefined") return NOOP_SUBSCRIPTION;
  let disposed = false;
  let quitSubscription = null;
  const isVisible = () => !disposed && doc.visibilityState === "visible";
  const onForeground = () => {
    if (isVisible()) lifecycle.scheduleResumeRecovery(isVisible);
  };
  const onVisibilityChange = () => {
    if (isVisible()) lifecycle.scheduleResumeRecovery(isVisible);
    else lifecycle.cancelResumeRecovery();
  };
  const onBackground = () => {
    lifecycle.cancelResumeRecovery();
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    lifecycle.cancelResumeRecovery();
    doc.removeEventListener("visibilitychange", onVisibilityChange);
    doc.removeEventListener("resume", onForeground);
    win.removeEventListener("pageshow", onForeground);
    win.removeEventListener("pagehide", onBackground);
    quitSubscription?.unsubscribe();
    quitSubscription = null;
  };
  doc.addEventListener("visibilitychange", onVisibilityChange);
  doc.addEventListener("resume", onForeground);
  win.addEventListener("pageshow", onForeground);
  win.addEventListener("pagehide", onBackground);
  quitSubscription = lifecycle.onQuit(dispose);
  return { unsubscribe: dispose };
}
function buildInitSdkArgs() {
  return { sdkVersion: SDK_VERSION };
}
var RpcSocialApi = class {
  rpcClient;
  lastSentShareIntent = null;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  async setShareIntentAsync(options) {
    validateShareIntentParams(options.shareParams);
    validateShareMetadata(options.metadata);
    validateShareTarget(options.target);
    const payload = {
      shareParams: options.shareParams,
      metadata: options.metadata ?? {},
      slug: options.slug,
      target: options.target
    };
    const snapshot = JSON.stringify(payload);
    if (snapshot === this.lastSentShareIntent) return;
    this.lastSentShareIntent = snapshot;
    try {
      await this.rpcClient.call("H5_SHARE_SET_INTENT", payload);
    } catch (error) {
      if (this.lastSentShareIntent === snapshot) this.lastSentShareIntent = null;
      throw error;
    }
  }
  async clearShareIntentAsync() {
    const previous = this.lastSentShareIntent;
    this.lastSentShareIntent = null;
    try {
      await this.rpcClient.call("H5_SHARE_CLEAR_INTENT", {});
    } catch (error) {
      if (this.lastSentShareIntent === null) this.lastSentShareIntent = previous;
      throw error;
    }
  }
  async shareLinkAsync(options) {
    validateShareTarget(options.target);
    const result = await this.rpcClient.call("H5_SHARE_LINK", {
      shareParams: options.shareParams,
      metadata: options.metadata ?? {},
      slug: options.slug,
      target: options.target
    });
    return {
      shareUrl: result.shareUrl,
      shareLinkId: result.shareLinkId
    };
  }
  async createQRCodeAsync(options) {
    validateShareTarget(options.target);
    const result = await this.rpcClient.call("H5_CREATE_SHARE_QRCODE", {
      shareParams: options.shareParams,
      metadata: options.metadata ?? {},
      qrOptions: options.qrOptions ?? {},
      slug: options.slug,
      target: options.target
    });
    return {
      shareUrl: result.shareUrl,
      qrCode: result.qrCode,
      shareLinkId: result.shareLinkId
    };
  }
  async addShareClickDataAsync(options) {
    await this.rpcClient.call("H5_SHARE_ADD_CLICK_DATA", {
      shareLinkId: options.shareLinkId,
      metadata: options.metadata
    });
  }
  async getShareClicksAsync(options) {
    return await this.rpcClient.call("H5_SHARE_GET_CLICKS", { shareLinkId: options.shareLinkId });
  }
  async getMyShareClickDataAsync(options) {
    return await this.rpcClient.call("H5_SHARE_GET_MY_CLICK_DATA", { shareLinkId: options.shareLinkId });
  }
  async shareFileAsync(options) {
    const { data, filename, mimeType, title, text } = options;
    if (!SHARE_FILE_ALLOWED_MIME_TYPES.includes(mimeType)) throw new Error(`unsupported MIME type "${mimeType}". Allowed: ${SHARE_FILE_ALLOWED_MIME_TYPES.join(", ")}`);
    const rawSize = data instanceof Blob ? data.size : data instanceof ArrayBuffer ? data.byteLength : void 0;
    if (rawSize !== void 0 && rawSize > 10485760) throw new Error(`file size (${rawSize} bytes) exceeds max allowed (${SHARE_FILE_MAX_SIZE_BYTES} bytes)`);
    const base64 = await this.toBase64(data);
    if (rawSize === void 0) {
      const len = base64.length;
      const paddingChars = (base64[len - 1] === "=" ? 1 : 0) + (base64[len - 2] === "=" ? 1 : 0);
      const sizeBytes = Math.floor(len * 3 / 4) - paddingChars;
      if (sizeBytes > 10485760) throw new Error(`file size (${sizeBytes} bytes) exceeds max allowed (${SHARE_FILE_MAX_SIZE_BYTES} bytes)`);
    }
    return { cancelled: (await this.rpcClient.call("H5_SHARE_FILE", {
      base64,
      filename,
      mimeType,
      title,
      text
    })).cancelled };
  }
  async canShareFileAsync() {
    return { supported: (await this.rpcClient.call("H5_CAN_SHARE_FILE", {})).supported };
  }
  async composeSocialPostAsync(options) {
    const text = stripComposeControlChars(options.text ?? "");
    const title = options.title === void 0 ? void 0 : stripComposeControlChars(options.title);
    validateComposePost({
      text,
      title,
      subreddit: options.subreddit
    });
    let media;
    if (options.media) {
      validateShareFile(options.media);
      media = {
        base64: await this.toBase64(options.media.data),
        filename: options.media.filename,
        mimeType: options.media.mimeType
      };
    }
    const result = await this.rpcClient.call("H5_SHARE_COMPOSE_POST", {
      text,
      title,
      subreddit: options.subreddit,
      platform: options.platform,
      shareParams: options.shareParams,
      metadata: options.metadata ?? {},
      media
    }, -1);
    return {
      completed: result.completed,
      destination: result.destination
    };
  }
  async openXFollowMeLinkAsync() {
    return this.openFollowMeLink("x");
  }
  async openInstagramFollowMeLinkAsync() {
    return this.openFollowMeLink("instagram");
  }
  async openTikTokFollowMeLinkAsync() {
    return this.openFollowMeLink("tiktok");
  }
  async openDiscordFollowMeLinkAsync() {
    return this.openFollowMeLink("discord");
  }
  async getConfiguredFollowMePlatformsAsync() {
    return (await this.rpcClient.call("H5_SHARE_GET_FOLLOW_ME_PLATFORMS", {})).platforms;
  }
  async openFollowMeLink(platform) {
    const result = await this.rpcClient.call("H5_SHARE_OPEN_FOLLOW_ME", { platform }, -1);
    return {
      completed: result.completed,
      reason: result.reason
    };
  }
  async toBase64(data) {
    if (typeof data === "string") return data;
    const blob = data instanceof Blob ? data : new Blob([data]);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const commaIdx = dataUrl.indexOf(",");
        resolve(commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }
};
var RpcCaptureConsent = class {
  rpcClient;
  constructor(rpcClient) {
    this.rpcClient = rpcClient;
  }
  get() {
    return this.rpcClient.call("H5_CLIPS_GET_CAPTURE_CONSENT");
  }
  request(opts) {
    return this.rpcClient.call("H5_CLIPS_REQUEST_CAPTURE_CONSENT", opts, -1);
  }
  set(status) {
    return this.rpcClient.call("H5_CLIPS_SET_CAPTURE_CONSENT", { status });
  }
};
var RemoteHost = class {
  ads;
  analytics;
  deviceCache;
  appStorage;
  ownerStorage;
  sharedStorage;
  /** @deprecated */
  avatar3d;
  navigation;
  notifications;
  popups;
  profile;
  system;
  cdn;
  time;
  ai;
  textGen;
  haptics;
  gamepad;
  features;
  liveops;
  lifecycle;
  simulation;
  rooms;
  logging;
  iap;
  credits;
  leaderboard;
  ugc;
  preloader;
  social;
  imageGen;
  audioGen;
  videoGen;
  files;
  clips;
  spriteGen;
  threeDGen;
  entitlements;
  choices;
  stats;
  collectibles;
  shop;
  accessGate;
  multiplayer;
  video;
  activity;
  app;
  attribution;
  assetLibrary;
  playable;
  /** See GatableHost.anonymousMultiplayerAllowed. */
  anonymousMultiplayerAllowed;
  context;
  instanceId = "unknown";
  get isInitialized() {
    return this._isInitialized;
  }
  rundotGameApi;
  rpcClient;
  _isInitialized = false;
  _roomServerUrl = "";
  lifecycleRecoverySubscription = null;
  constructor(rundotGameApi) {
    this.rundotGameApi = rundotGameApi;
    const rpcClient = new RpcClient();
    this.rpcClient = rpcClient;
    this.ads = new RpcAdsApi(rpcClient);
    this.analytics = new RpcAnalyticsApi(rpcClient);
    this.deviceCache = new RpcStorageApi(rpcClient, {
      clear: "H5_DEVICE_CACHE_CLEAR",
      getItem: "H5_DEVICE_CACHE_GET_ITEM",
      getKey: "H5_DEVICE_CACHE_KEY",
      length: "H5_DEVICE_CACHE_LENGTH",
      removeItem: "H5_DEVICE_CACHE_REMOVE_ITEM",
      setItem: "H5_DEVICE_CACHE_SET_ITEM"
    });
    this.appStorage = new ValidatingStorageApi(new RpcStorageApi(rpcClient, {
      clear: "H5_APP_STORAGE_CLEAR",
      getItem: "H5_APP_STORAGE_GET_ITEM",
      getKey: "H5_APP_STORAGE_KEY",
      length: "H5_APP_STORAGE_LENGTH",
      removeItem: "H5_APP_STORAGE_REMOVE_ITEM",
      setItem: "H5_APP_STORAGE_SET_ITEM",
      getAllItems: "H5_APP_STORAGE_GET_ALL_ITEMS",
      getAllData: "H5_APP_STORAGE_GET_ALL_DATA",
      setMultipleItems: "H5_APP_STORAGE_SET_MULTIPLE_ITEMS",
      removeMultipleItems: "H5_APP_STORAGE_REMOVE_MULTIPLE_ITEMS",
      compareAndSwap: "H5_APP_STORAGE_COMPARE_AND_SWAP",
      getMultipleItems: "H5_APP_STORAGE_GET_MULTIPLE_ITEMS"
    }));
    this.ownerStorage = new ValidatingStorageApi(new RpcStorageApi(rpcClient, {
      clear: "H5_OWNER_STORAGE_CLEAR",
      getItem: "H5_OWNER_STORAGE_GET_ITEM",
      getKey: "H5_OWNER_STORAGE_KEY",
      length: "H5_OWNER_STORAGE_LENGTH",
      removeItem: "H5_OWNER_STORAGE_REMOVE_ITEM",
      setItem: "H5_OWNER_STORAGE_SET_ITEM",
      getAllItems: "H5_OWNER_STORAGE_GET_ALL_ITEMS",
      getAllData: "H5_OWNER_STORAGE_GET_ALL_DATA",
      setMultipleItems: "H5_OWNER_STORAGE_SET_MULTIPLE_ITEMS",
      removeMultipleItems: "H5_OWNER_STORAGE_REMOVE_MULTIPLE_ITEMS"
    }));
    this.sharedStorage = {
      open: ({ appId, namespace }) => {
        if (appId === "") throw new Error("sharedStorage.open: appId must be a non-empty string or omitted");
        return new ValidatingStorageApi(new DualEmitStorageApi(rpcClient, {
          clear: "H5_SHARED_STORAGE_CLEAR",
          getItem: "H5_SHARED_STORAGE_GET_ITEM",
          getKey: "H5_SHARED_STORAGE_KEY",
          length: "H5_SHARED_STORAGE_LENGTH",
          removeItem: "H5_SHARED_STORAGE_REMOVE_ITEM",
          setItem: "H5_SHARED_STORAGE_SET_ITEM",
          getAllItems: "H5_SHARED_STORAGE_GET_ALL_ITEMS",
          getAllData: "H5_SHARED_STORAGE_GET_ALL_DATA",
          setMultipleItems: "H5_SHARED_STORAGE_SET_MULTIPLE_ITEMS",
          removeMultipleItems: "H5_SHARED_STORAGE_REMOVE_MULTIPLE_ITEMS"
        }, {
          targetAppId: appId,
          namespace
        }, {
          clear: "H5_GLOBAL_STORAGE_CLEAR",
          getItem: "H5_GLOBAL_STORAGE_GET_ITEM",
          getKey: "H5_GLOBAL_STORAGE_KEY",
          length: "H5_GLOBAL_STORAGE_LENGTH",
          removeItem: "H5_GLOBAL_STORAGE_REMOVE_ITEM",
          setItem: "H5_GLOBAL_STORAGE_SET_ITEM",
          getAllItems: "H5_GLOBAL_STORAGE_GET_ALL_ITEMS",
          setMultipleItems: "H5_GLOBAL_STORAGE_SET_MULTIPLE_ITEMS",
          removeMultipleItems: "H5_GLOBAL_STORAGE_REMOVE_MULTIPLE_ITEMS"
        }));
      },
      read: ({ appId, namespace }) => {
        if (appId === "") throw new Error("sharedStorage.read: appId must be a non-empty string or omitted");
        return new RpcInboundStorageApi(rpcClient, {
          listSources: "H5_SHARED_STORAGE_INBOUND_LIST_SOURCES",
          get: "H5_SHARED_STORAGE_INBOUND_GET",
          getAllFromSource: "H5_SHARED_STORAGE_INBOUND_GET_ALL_FROM_SOURCE",
          getAllForKey: "H5_SHARED_STORAGE_INBOUND_GET_ALL_FOR_KEY"
        }, {
          targetAppId: appId,
          namespace
        });
      }
    };
    this.avatar3d = new RpcAvatarApi(rpcClient, rundotGameApi);
    this.navigation = new RpcNavigationApi(rpcClient, rundotGameApi);
    this.notifications = new RpcNotificationsApi(rpcClient, { recordDeprecationEvent: (eventName) => {
      this.analytics.recordCustomEvent(eventName, {});
    } });
    this.popups = new RpcPopupsApi(rpcClient);
    this.profile = new HostProfileApi(rundotGameApi);
    const deviceApi = new HostDeviceApi(rundotGameApi);
    const environmentApi = new HostEnvironmentApi(rundotGameApi);
    this.system = new HostSystemApi(deviceApi, environmentApi, rundotGameApi, rpcClient);
    this.cdn = new HostCdnApi(rpcClient);
    this.time = new HostTimeApi(rpcClient, rundotGameApi);
    this.ai = new RpcAiApi(rpcClient);
    this.textGen = this.ai;
    this.haptics = new RpcHapticsApi(rpcClient);
    this.gamepad = new RpcGamepadApi(rpcClient, { autoSubscribe: false });
    this.features = new RpcFeaturesApi(rpcClient);
    this.liveops = new RpcLiveOpsApi(rpcClient, {
      getUnitId: () => this.rundotGameApi._profileData?.id,
      onExposure: (assignment, configVersion) => {
        this.analytics.recordCustomEvent("liveops_experiment_exposure", {
          experiment_id: assignment.experimentId,
          variant_id: assignment.variantId,
          variant_weight: assignment.variantWeight,
          total_weight: assignment.totalWeight,
          config_version: configVersion
        }).catch(() => {
        });
      }
    });
    this.lifecycle = new RpcLifecycleApi(rpcClient);
    this.simulation = new RpcSimulationApi(rpcClient);
    this.rooms = new RpcRoomsApi(rpcClient);
    this.logging = new RpcLoggingApi(this, rpcClient);
    this.iap = new RpcIapApi(rpcClient);
    this.credits = new RpcCreditsApi(rpcClient);
    this.leaderboard = new RpcLeaderboardApi(rpcClient);
    this.ugc = new RpcUgcApi(rpcClient);
    this.preloader = new RpcPreloaderApi(rpcClient);
    this.social = new RpcSocialApi(rpcClient);
    this.imageGen = new RpcImageGenApi(rpcClient);
    this.audioGen = new RpcAudioGenApi(rpcClient);
    this.videoGen = new RpcVideoGenApi(rpcClient);
    this.files = new RpcFilesApi(rpcClient);
    this.clips = new ClipsApiImpl({
      files: this.files,
      ugc: this.ugc,
      captureConsent: new RpcCaptureConsent(rpcClient)
    });
    this.spriteGen = new RpcSpriteGenApi(rpcClient);
    this.threeDGen = new RpcThreeDGenApi(rpcClient);
    this.entitlements = new RpcEntitlementApi(rpcClient);
    this.choices = new RpcChoicesApi(rpcClient);
    this.stats = new RpcStatsApi(rpcClient);
    this.collectibles = new RpcCollectiblesApi(rpcClient);
    this.shop = new RpcShopApi(rpcClient);
    this.video = new RpcVideoApi(rpcClient);
    this.activity = new RpcActivityApi(rpcClient);
    this.app = new RpcAppApi(rpcClient);
    this.attribution = new RpcAttributionApi(rpcClient);
    this.assetLibrary = new RpcAssetLibraryApi(rpcClient, rundotGameApi);
    this.playable = new RpcPlayableApi(rpcClient, rundotGameApi);
    rundotGameApi.isMock = () => false;
    this.rundotGameApi.sharedAssets = this.assetLibrary;
    initializeRoomsApi(this.rundotGameApi, this);
    this.accessGate = new RpcAccessGateApi(rpcClient, rundotGameApi);
    this.multiplayer = new WsMultiplayerApi({
      serverUrl: () => this._roomServerUrl,
      getJoinTicket: async (req) => {
        return (await rpcClient.call("H5_REQUEST_JOIN_TICKET", req)).ticket;
      },
      listUserRooms: async (options) => {
        return (await rpcClient.call("H5_LIST_USER_REALTIME_ROOMS", options ?? {})).rooms;
      }
    });
    this.anonymousMultiplayerAllowed = isAnonymousMultiplayerAllowed;
    applyAccessGates(this);
  }
  async initialize(options) {
    const transport = new RundotGameTransport();
    transport.start();
    this.rpcClient.start(transport);
    wireIdentityReplica(this.rpcClient, this.rundotGameApi);
    wireViewportReplica(this.rpcClient, this.rundotGameApi);
    this.lifecycle.wireNotificationReplay();
    this.rooms.setupNotifications(transport);
    const response = await this.rpcClient.call("INITIALIZE_SDK", buildInitSdkArgs(), -1);
    transport.instanceId = response.instanceId;
    this.instanceId = response.instanceId;
    this._roomServerUrl = response.roomServerUrl ?? "";
    this.rundotGameApi._profileData = sanitizeProfile(response.profile);
    this.rundotGameApi._deviceData = response.device;
    this.rundotGameApi._environmentData = response.environment;
    this.rundotGameApi._localeData = response.locale;
    this.rundotGameApi._languageCodeData = response.languageCode;
    applySafeAreaUpdate(this.rundotGameApi, response.safeArea);
    this._isInitialized = true;
    await this.rpcClient.call("READY", {});
    this.disposeLifecycleRecovery();
    this.lifecycleRecoverySubscription = attachBrowserLifecycleResumeRecovery(this.lifecycle);
    this.gamepad.subscribe();
    const { g2gLaunch, g2gReturn, ...launchParams } = response.launchParams ?? {};
    this.context = buildInitializationContext({
      safeArea: this.rundotGameApi._safeAreaData,
      initializeAsleep: response.initializeAsleep,
      launchParams,
      shareParams: response.shareParams,
      notificationParams: response.notificationParams,
      shareLinkId: response.shareLinkId,
      g2gLaunch,
      g2gReturn
    }, (field) => {
      this.analytics.recordCustomEvent("sdk_deprecated_context_read", { field });
    });
    return this.context;
  }
  /** @internal */
  disposeLifecycleRecovery() {
    this.lifecycleRecoverySubscription?.unsubscribe();
    this.lifecycleRecoverySubscription = null;
  }
  onNotificationParamsUpdate(callback) {
    const subscription = this.rpcClient.onNotification("NOTIFICATION_PARAMS_UPDATE", callback);
    return () => subscription.unsubscribe();
  }
  notifyNotificationParamsSubscribeReady() {
    this.rpcClient.notify("NOTIFICATION_PARAMS_SUBSCRIBE_READY");
  }
};
function buildInitializationContext(snapshot, onDeprecatedRead) {
  const context = {
    safeArea: snapshot.safeArea,
    initializeAsleep: snapshot.initializeAsleep,
    g2gLaunch: snapshot.g2gLaunch,
    g2gReturn: snapshot.g2gReturn
  };
  const warned2 = /* @__PURE__ */ new Set();
  const defineDeprecatedIntentField = (field, value) => {
    Object.defineProperty(context, field, {
      enumerable: true,
      configurable: true,
      get() {
        if (!warned2.has(field)) {
          warned2.add(field);
          console.warn(`RundotGameAPI.context.${field} is deprecated; use RundotGameAPI.app.resolveLaunchIntent(). Removed in v6.0.0.`);
          onDeprecatedRead?.(field);
        }
        return value;
      },
      set: field === "notificationParams" ? (nextValue) => {
        value = nextValue;
      } : void 0
    });
  };
  defineDeprecatedIntentField("launchParams", snapshot.launchParams);
  defineDeprecatedIntentField("shareParams", snapshot.shareParams);
  defineDeprecatedIntentField("notificationParams", snapshot.notificationParams);
  defineDeprecatedIntentField("shareLinkId", snapshot.shareLinkId);
  return context;
}
async function createHost(rundotGameApi, isMock) {
  if (isMock) {
    const factory = globalThis.__RUNDOT_PLAYGROUND_HOST_FACTORY__;
    if (factory) return factory(rundotGameApi);
    if (getPlaygroundConfig()?.sandboxedOrigin) throw new Error("[RUN] Playground runtime did not load, and this preview has no mock fallback. Reload the preview.");
    return new MockHost(rundotGameApi);
  }
  return new RemoteHost(rundotGameApi);
}
function initializeSocial(rundotGameApi, host) {
  rundotGameApi.social = host.social;
}
function initializeClips(rundotGameApi, host) {
  rundotGameApi.clips = host.clips;
}

// node_modules/@series-inc/rundot-game-sdk/dist/rundot-game-api/index.js
init_core_DLpmdjtO();
function initializeAudioGen(rundotGameApi, host) {
  rundotGameApi.audioGen = host.audioGen;
}
function initializeVideoGen(rundotGameApi, host) {
  rundotGameApi.videoGen = host.videoGen;
}
function initializeFiles(rundotGameApi, host) {
  rundotGameApi.files = host.files;
}
function initializeThreeDGen(rundotGameApi, host) {
  rundotGameApi.threeDGen = host.threeDGen;
}
function initializeChoices(rundotGameApiInstance, host) {
  rundotGameApiInstance.choices = host.choices;
}
function initializeAttribution(rundotGameApiInstance, host) {
  rundotGameApiInstance.attribution = host.attribution;
}
var RundotGameAssetLoader = class {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.blobUrls = /* @__PURE__ */ new Map();
    this.isWebView = false;
    this.rundotGameAPI = null;
  }
  setRundotGameAPI(api) {
    this.rundotGameAPI = api;
    this.isWebView = typeof window !== "undefined" && typeof window.ReactNativeWebView !== "undefined";
  }
  /**
  * Load any asset with automatic optimization
  * @param {string} url - Asset URL
  * @param {Object} options - Loading options
  * @returns {Promise<string>} - URL to use (original, blob, or object URL)
  */
  async loadAsset(url, options = {}) {
    const { type = "auto", cache = true, timeout = 3e4, isOptional = false } = options;
    const resolvedUrl = await this.rundotGameAPI.cdn.resolveAssetUrl(url);
    if (cache && this.cache.has(resolvedUrl)) return this.cache.get(resolvedUrl);
    const assetType = type === "auto" ? this._detectType(resolvedUrl) : type;
    try {
      let resultUrl = resolvedUrl;
      if (assetType === "text" || assetType === "json") {
        const content = await this._fetchText(resolvedUrl, timeout);
        this.cache.set(resolvedUrl, content);
        return content;
      }
      const isMockMode = this.rundotGameAPI && this.rundotGameAPI.isMock && this.rundotGameAPI.isMock();
      if (this.isWebView && !isMockMode && [
        "image",
        "audio",
        "video"
      ].includes(assetType)) {
        if (assetType === "video") {
          resultUrl = await this._loadAsBlob(resolvedUrl, assetType);
          if (cache) this.cache.set(resolvedUrl, resultUrl);
          return resultUrl;
        } else if (assetType === "audio") resultUrl = await this._loadAsBlob(resolvedUrl, assetType);
        else resultUrl = await this._loadAsBlob(resolvedUrl, assetType);
      }
      if (!(this.isWebView && !isMockMode && assetType === "video")) await this._verifyAsset(resultUrl, assetType);
      if (cache) this.cache.set(resolvedUrl, resultUrl);
      return resultUrl;
    } catch (error) {
      if (!isOptional) console.error(`[RUN:assets] Failed to load ${resolvedUrl}:`, error);
      throw error;
    }
  }
  async _fetchText(url, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.text();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  async _loadAsBlob(url, type) {
    if (this.blobUrls.has(url)) return this.blobUrls.get(url);
    const mimeType = {
      image: "image/*",
      audio: "audio/*",
      video: "video/*"
    }[type] || "*/*";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3e4);
    try {
      const response = await fetch(url, {
        mode: "cors",
        credentials: "omit",
        headers: { Accept: mimeType },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      this.blobUrls.set(url, blobUrl);
      return blobUrl;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  async _checkStreamingSupport(url) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      const acceptRanges = response.headers.get("Accept-Ranges") === "bytes";
      const contentLength = response.headers.get("Content-Length");
      return acceptRanges && !!contentLength;
    } catch {
      return false;
    }
  }
  async _verifyAsset(url, type) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(/* @__PURE__ */ new Error(`Verification timeout for ${type} asset`));
      }, 1e4);
      if (type === "image") {
        const img = new Image();
        img.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
        img.onerror = (error) => {
          clearTimeout(timeout);
          reject(/* @__PURE__ */ new Error("Failed to load image"));
        };
        img.src = url;
      } else if (type === "audio") {
        const audio = new Audio();
        audio.oncanplaythrough = () => {
          clearTimeout(timeout);
          resolve();
        };
        audio.onerror = () => {
          clearTimeout(timeout);
          reject(/* @__PURE__ */ new Error("Failed to load audio"));
        };
        audio.src = url;
        audio.load();
      } else if (type === "video") {
        const video = document.createElement("video");
        video.onloadedmetadata = () => {
          clearTimeout(timeout);
          video.src = "";
          resolve();
        };
        video.onerror = () => {
          clearTimeout(timeout);
          reject(/* @__PURE__ */ new Error("Failed to load video"));
        };
        video.src = url;
      } else {
        clearTimeout(timeout);
        resolve();
      }
    });
  }
  _detectType(url) {
    const ext = url.split(".").pop()?.toLowerCase();
    if ([
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "svg"
    ].includes(ext)) return "image";
    if ([
      "mp3",
      "wav",
      "ogg",
      "m4a",
      "aac"
    ].includes(ext)) return "audio";
    if ([
      "mp4",
      "webm",
      "mov",
      "m4v"
    ].includes(ext)) return "video";
    if (["json"].includes(ext)) return "json";
    return "text";
  }
  /**
  * Preload multiple assets in parallel
  * @param {(string|{url: string, isOptional?: boolean})[]} urls - Array of URLs or URL objects with optional metadata
  * @param {Object} options - Loading options
  */
  async preloadAssets(urls, options = {}) {
    const { onProgress } = options;
    let loaded = 0;
    const total = urls.length;
    const normalizedUrls = urls.map((item) => {
      if (typeof item === "string") return {
        url: item,
        isOptional: false
      };
      return {
        url: item.url,
        isOptional: item.isOptional || false
      };
    });
    const results = await Promise.allSettled(normalizedUrls.map(async (item) => {
      try {
        const result = await this.loadAsset(item.url, {
          ...options,
          isOptional: item.isOptional
        });
        loaded++;
        if (onProgress) onProgress(loaded / total, {
          loaded,
          total,
          current: item.url
        });
        return {
          url: item.url,
          result,
          success: true,
          isOptional: item.isOptional
        };
      } catch (error) {
        loaded++;
        if (onProgress) onProgress(loaded / total, {
          loaded,
          total,
          current: item.url,
          error
        });
        return {
          url: item.url,
          error,
          success: false,
          isOptional: item.isOptional
        };
      }
    }));
    const failedRequired = results.filter((r2) => (r2.status === "rejected" || !r2.value?.success) && !r2.value?.isOptional);
    if (failedRequired.length > 0) {
      console.warn(`[RUN:assets] ${failedRequired.length} required assets failed to load`);
      failedRequired.forEach((r2) => {
        console.warn(`[RUN:assets] Failed required asset: ${r2.value?.url}`);
      });
    }
    return results.map((r2) => r2.value);
  }
  /**
  * Clean up blob URLs to prevent memory leaks
  */
  cleanup() {
    for (const blobUrl of this.blobUrls.values()) URL.revokeObjectURL(blobUrl);
    this.blobUrls.clear();
    this.cache.clear();
  }
  /**
  * Get a cached asset URL if available
  */
  async getCached(url) {
    const resolvedUrl = await this.rundotGameAPI.cdn.resolveAssetUrl(url);
    return this.cache.get(resolvedUrl);
  }
};
if (typeof RundotGameAPI !== "undefined") {
  RundotGameAPI.assetLoader = new RundotGameAssetLoader();
  RundotGameAPI.loadAsset = (url, options) => RundotGameAPI.assetLoader.loadAsset(url, options);
  RundotGameAPI.preloadAssets = (urls, options) => RundotGameAPI.assetLoader.preloadAssets(urls, options);
  RundotGameAPI.cleanupAssets = () => RundotGameAPI.assetLoader.cleanup();
}
function initializeAssetLoader(rundotGameApi, createProxiedMethod2) {
  const assetLoader = new RundotGameAssetLoader();
  assetLoader.setRundotGameAPI(rundotGameApi);
  rundotGameApi._assetLoader = assetLoader;
  rundotGameApi.assetLoader = assetLoader;
  if (createProxiedMethod2) {
    rundotGameApi.loadAsset = createProxiedMethod2("loadAsset", function(url, options) {
      return assetLoader.loadAsset(url, options);
    });
    rundotGameApi.preloadAssets = createProxiedMethod2("preloadAssets", function(urls, options) {
      return assetLoader.preloadAssets(urls, options);
    });
    rundotGameApi.cleanupAssets = createProxiedMethod2("cleanupAssets", function() {
      return assetLoader.cleanup();
    });
  } else {
    rundotGameApi.loadAsset = function(url, options) {
      return assetLoader.loadAsset(url, options);
    };
    rundotGameApi.preloadAssets = function(urls, options) {
      return assetLoader.preloadAssets(urls, options);
    };
    rundotGameApi.cleanupAssets = function() {
      return assetLoader.cleanup();
    };
  }
  if (typeof window !== "undefined" && window.RundotGameAPI) {
    window.RundotGameAPI.loadAsset = rundotGameApi.loadAsset;
    window.RundotGameAPI.preloadAssets = rundotGameApi.preloadAssets;
    window.RundotGameAPI.cleanupAssets = rundotGameApi.cleanupAssets;
  }
}
function se(r2, n) {
  if (!(r2 instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function le(r2, n) {
  for (var e = 0; e < n.length; e++) {
    var t = n[e];
    t.enumerable = t.enumerable || false, t.configurable = true, "value" in t && (t.writable = true), Object.defineProperty(r2, t.key, t);
  }
}
function ue(r2, n, e) {
  return n && le(r2.prototype, n), e && le(r2, e), Object.defineProperty(r2, "prototype", { writable: false }), r2;
}
var me = (function() {
  function r2(n) {
    se(this, r2), this.map = /* @__PURE__ */ new Map(), this.first = void 0, this.last = void 0, this.maxSize = n;
  }
  return ue(r2, [
    {
      key: "size",
      get: function() {
        return this.map.size;
      }
    },
    {
      key: "get",
      value: function(e) {
        var t = this.map.get(e);
        if (t !== void 0) return t !== this.first && (t === this.last ? (this.last = t.prev, this.last.next = void 0) : (t.prev.next = t.next, t.next.prev = t.prev), t.next = this.first, this.first.prev = t, this.first = t), t.value;
      }
    },
    {
      key: "set",
      value: function(e, t) {
        if (!(this.maxSize < 1)) {
          if (this.map.has(e)) throw new Error("Cannot update existing keys in the cache");
          var i = new ge(e, t);
          for (this.first === void 0 ? (this.first = i, this.last = i) : (i.next = this.first, this.first.prev = i, this.first = i), this.map.set(e, i); this.map.size > this.maxSize; ) {
            var a = this.last;
            this.map.delete(a.key), this.last = a.prev, this.last.next = void 0;
          }
        }
      }
    }
  ]), r2;
})();
var ge = ue(function r(n, e) {
  se(this, r), this.next = void 0, this.prev = void 0, this.key = n, this.value = e;
});
var ne = 17;
var T = 9e15;
var ce = Math.log10(9e15);
var $ = 1 / 9e15;
var ve = 308;
var ye = -324;
var fe = 5;
var de = 1023;
var Ne = (function() {
  for (var r2 = [], n = ye + 1; n <= ve; n++) r2.push(+("1e" + n));
  var e = 323;
  return function(t) {
    return r2[t + e];
  };
})();
var _ = [
  2,
  Math.E,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10
];
var be = [
  [
    1,
    1.0891180521811203,
    1.1789767925673957,
    1.2701455431742086,
    1.3632090180450092,
    1.4587818160364217,
    1.5575237916251419,
    1.6601571006859253,
    1.767485818836978,
    1.8804192098842727,
    2
  ],
  [
    1,
    1.1121114330934079,
    1.231038924931609,
    1.3583836963111375,
    1.4960519303993531,
    1.6463542337511945,
    1.8121385357018724,
    1.996971324618307,
    2.2053895545527546,
    2.4432574483385254,
    Math.E
  ],
  [
    1,
    1.1187738849693603,
    1.2464963939368214,
    1.38527004705667,
    1.5376664685821402,
    1.7068895236551784,
    1.897001227148399,
    2.1132403089001035,
    2.362480153784171,
    2.6539010333870774,
    3
  ],
  [
    1,
    1.1367350847096405,
    1.2889510672956703,
    1.4606478703324786,
    1.6570295196661111,
    1.8850062585672889,
    2.1539465047453485,
    2.476829779693097,
    2.872061932789197,
    3.3664204535587183,
    4
  ],
  [
    1,
    1.1494592900767588,
    1.319708228183931,
    1.5166291280087583,
    1.748171114438024,
    2.0253263297298045,
    2.3636668498288547,
    2.7858359149579424,
    3.3257226212448145,
    4.035730287722532,
    5
  ],
  [
    1,
    1.159225940787673,
    1.343712473580932,
    1.5611293155111927,
    1.8221199554561318,
    2.14183924486326,
    2.542468319282638,
    3.0574682501653316,
    3.7390572020926873,
    4.6719550537360774,
    6
  ],
  [
    1,
    1.1670905356972596,
    1.3632807444991446,
    1.5979222279405536,
    1.8842640123816674,
    2.2416069644878687,
    2.69893426559423,
    3.3012632110403577,
    4.121250340630164,
    5.281493033448316,
    7
  ],
  [
    1,
    1.1736630594087796,
    1.379783782386201,
    1.6292821855668218,
    1.9378971836180754,
    2.3289975651071977,
    2.8384347394720835,
    3.5232708454565906,
    4.478242031114584,
    5.868592169644505,
    8
  ],
  [
    1,
    1.1793017514670474,
    1.394054150657457,
    1.65664127441059,
    1.985170999970283,
    2.4069682290577457,
    2.9647310119960752,
    3.7278665320924946,
    4.814462547283592,
    6.436522247411611,
    9
  ],
  [
    1,
    1.1840100246247336,
    1.4061375836156955,
    1.6802272208863964,
    2.026757028388619,
    2.4770056063449646,
    3.080525271755482,
    3.9191964192627284,
    5.135152840833187,
    6.989961179534715,
    10
  ]
];
var we = [
  [
    -1,
    -0.9194161097107025,
    -0.8335625019330468,
    -0.7425599821143978,
    -0.6466611521029437,
    -0.5462617907227869,
    -0.4419033816638769,
    -0.3342645487554494,
    -0.224140440909962,
    -0.11241087890006762,
    0
  ],
  [
    -1,
    -0.90603157029014,
    -0.80786507256596,
    -0.7064666939634,
    -0.60294836853664,
    -0.49849837513117,
    -0.39430303318768,
    -0.29147201034755,
    -0.19097820800866,
    -0.09361896280296,
    0
  ],
  [
    -1,
    -0.9021579584316141,
    -0.8005762598234203,
    -0.6964780623319391,
    -0.5911906810998454,
    -0.486050182576545,
    -0.3823089430815083,
    -0.28106046722897615,
    -0.1831906535795894,
    -0.08935809204418144,
    0
  ],
  [
    -1,
    -0.8917227442365535,
    -0.781258746326964,
    -0.6705130326902455,
    -0.5612813129406509,
    -0.4551067709033134,
    -0.35319256652135966,
    -0.2563741554088552,
    -0.1651412821106526,
    -0.0796919581982668,
    0
  ],
  [
    -1,
    -0.8843387974366064,
    -0.7678744063886243,
    -0.6529563724510552,
    -0.5415870994657841,
    -0.4352842206588936,
    -0.33504449124791424,
    -0.24138853420685147,
    -0.15445285440944467,
    -0.07409659641336663,
    0
  ],
  [
    -1,
    -0.8786709358426346,
    -0.7577735191184886,
    -0.6399546189952064,
    -0.527284921869926,
    -0.4211627631006314,
    -0.3223479611761232,
    -0.23107655627789858,
    -0.1472057700818259,
    -0.07035171210706326,
    0
  ],
  [
    -1,
    -0.8740862815291583,
    -0.7497032990976209,
    -0.6297119746181752,
    -0.5161838335958787,
    -0.41036238255751956,
    -0.31277212146489963,
    -0.2233976621705518,
    -0.1418697367979619,
    -0.06762117662323441,
    0
  ],
  [
    -1,
    -0.8702632331800649,
    -0.7430366914122081,
    -0.6213373075161548,
    -0.5072025698095242,
    -0.40171437727184167,
    -0.30517930701410456,
    -0.21736343968190863,
    -0.137710238299109,
    -0.06550774483471955,
    0
  ],
  [
    -1,
    -0.8670016295947213,
    -0.7373984232432306,
    -0.6143173985094293,
    -0.49973884395492807,
    -0.394584953527678,
    -0.2989649949848695,
    -0.21245647317021688,
    -0.13434688362382652,
    -0.0638072667348083,
    0
  ],
  [
    -1,
    -0.8641642839543857,
    -0.732534623168535,
    -0.6083127477059322,
    -0.4934049257184696,
    -0.3885773075899922,
    -0.29376029055315767,
    -0.2083678561173622,
    -0.13155653399373268,
    -0.062401588652553186,
    0
  ]
];
var s = function(n) {
  return k.fromValue_noAlloc(n);
};
var m = function(n, e, t) {
  return k.fromComponents(n, e, t);
};
var c = function(n, e, t) {
  return k.fromComponents_noNormalize(n, e, t);
};
var K = function(n, e) {
  var t = e + 1, i = Math.ceil(Math.log10(Math.abs(n))), a = Math.round(n * Math.pow(10, t - i)) * Math.pow(10, i - t);
  return parseFloat(a.toFixed(Math.max(t - i, 0)));
};
var ie = function(n) {
  return Math.sign(n) * Math.log10(Math.abs(n));
};
var ke = function(n) {
  if (!isFinite(n)) return n;
  if (n < -50) return n === Math.trunc(n) ? Number.NEGATIVE_INFINITY : 0;
  for (var e = 1; n < 10; ) e = e * n, ++n;
  n -= 1;
  var t = 0.9189385332046727;
  t = t + (n + 0.5) * Math.log(n), t = t - n;
  var i = n * n, a = n;
  return t = t + 1 / (12 * a), a = a * i, t = t - 1 / (360 * a), a = a * i, t = t + 1 / (1260 * a), a = a * i, t = t - 1 / (1680 * a), a = a * i, t = t + 1 / (1188 * a), a = a * i, t = t - 691 / (360360 * a), a = a * i, t = t + 7 / (1092 * a), a = a * i, t = t - 3617 / (122400 * a), Math.exp(t) / e;
};
var Me = 0.36787944117144233;
var oe = 0.5671432904097838;
var ae = function(n) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1e-10, t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true, i, a;
  if (!Number.isFinite(n)) return n;
  if (t) {
    if (n === 0) return n;
    if (n === 1) return oe;
    n < 10 ? i = 0 : i = Math.log(n) - Math.log(Math.log(n));
  } else {
    if (n === 0) return -1 / 0;
    n <= -0.1 ? i = -2 : i = Math.log(-n) - Math.log(-Math.log(-n));
  }
  for (var l = 0; l < 100; ++l) {
    if (a = (n * Math.exp(-i) + i * i) / (i + 1), Math.abs(a - i) < e * Math.abs(a)) return a;
    i = a;
  }
  throw Error("Iteration failed to converge: ".concat(n.toString()));
};
function he(r2) {
  var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1e-10, e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true, t, i, a, l;
  if (!Number.isFinite(r2.mag)) return new k(r2);
  if (e) {
    if (r2.eq(k.dZero)) return c(0, 0, 0);
    if (r2.eq(k.dOne)) return k.fromNumber(oe);
    t = k.ln(r2);
  } else {
    if (r2.eq(k.dZero)) return new k(k.dNegInf);
    t = k.ln(r2.neg());
  }
  for (var f = 0; f < 100; ++f) {
    if (i = t.neg().exp(), a = t.sub(r2.mul(i)), l = t.sub(a.div(t.add(1).sub(t.add(2).mul(a).div(k.mul(2, t).add(2))))), k.abs(l.sub(t)).lt(k.abs(l).mul(n))) return l;
    t = l;
  }
  throw Error("Iteration failed to converge: ".concat(r2.toString()));
}
var k = (function() {
  function r2(n) {
    se(this, r2), this.sign = 0, this.mag = 0, this.layer = 0, n instanceof r2 ? this.fromDecimal(n) : typeof n == "number" ? this.fromNumber(n) : typeof n == "string" && this.fromString(n);
  }
  return ue(r2, [
    {
      key: "m",
      get: function() {
        if (this.sign === 0) return 0;
        if (this.layer === 0) {
          var e = Math.floor(Math.log10(this.mag)), t;
          return this.mag === 5e-324 ? t = 5 : t = this.mag / Ne(e), this.sign * t;
        } else if (this.layer === 1) {
          var i = this.mag - Math.floor(this.mag);
          return this.sign * Math.pow(10, i);
        } else return this.sign;
      },
      set: function(e) {
        this.layer <= 2 ? this.fromMantissaExponent(e, this.e) : (this.sign = Math.sign(e), this.sign === 0 && (this.layer = 0, this.exponent = 0));
      }
    },
    {
      key: "e",
      get: function() {
        return this.sign === 0 ? 0 : this.layer === 0 ? Math.floor(Math.log10(this.mag)) : this.layer === 1 ? Math.floor(this.mag) : this.layer === 2 ? Math.floor(Math.sign(this.mag) * Math.pow(10, Math.abs(this.mag))) : this.mag * Number.POSITIVE_INFINITY;
      },
      set: function(e) {
        this.fromMantissaExponent(this.m, e);
      }
    },
    {
      key: "s",
      get: function() {
        return this.sign;
      },
      set: function(e) {
        e === 0 ? (this.sign = 0, this.layer = 0, this.mag = 0) : this.sign = e;
      }
    },
    {
      key: "mantissa",
      get: function() {
        return this.m;
      },
      set: function(e) {
        this.m = e;
      }
    },
    {
      key: "exponent",
      get: function() {
        return this.e;
      },
      set: function(e) {
        this.e = e;
      }
    },
    {
      key: "normalize",
      value: function() {
        if (this.sign === 0 || this.mag === 0 && this.layer === 0 || this.mag === Number.NEGATIVE_INFINITY && this.layer > 0 && Number.isFinite(this.layer)) return this.sign = 0, this.mag = 0, this.layer = 0, this;
        if (this.layer === 0 && this.mag < 0 && (this.mag = -this.mag, this.sign = -this.sign), this.mag === Number.POSITIVE_INFINITY || this.layer === Number.POSITIVE_INFINITY || this.mag === Number.NEGATIVE_INFINITY || this.layer === Number.NEGATIVE_INFINITY) return this.mag = Number.POSITIVE_INFINITY, this.layer = Number.POSITIVE_INFINITY, this;
        if (this.layer === 0 && this.mag < $) return this.layer += 1, this.mag = Math.log10(this.mag), this;
        var e = Math.abs(this.mag), t = Math.sign(this.mag);
        if (e >= T) return this.layer += 1, this.mag = t * Math.log10(e), this;
        for (; e < ce && this.layer > 0; ) this.layer -= 1, this.layer === 0 ? this.mag = Math.pow(10, this.mag) : (this.mag = t * Math.pow(10, e), e = Math.abs(this.mag), t = Math.sign(this.mag));
        return this.layer === 0 && (this.mag < 0 ? (this.mag = -this.mag, this.sign = -this.sign) : this.mag === 0 && (this.sign = 0)), (Number.isNaN(this.sign) || Number.isNaN(this.layer) || Number.isNaN(this.mag)) && (this.sign = NaN, this.layer = NaN, this.mag = NaN), this;
      }
    },
    {
      key: "fromComponents",
      value: function(e, t, i) {
        return this.sign = e, this.layer = t, this.mag = i, this.normalize(), this;
      }
    },
    {
      key: "fromComponents_noNormalize",
      value: function(e, t, i) {
        return this.sign = e, this.layer = t, this.mag = i, this;
      }
    },
    {
      key: "fromMantissaExponent",
      value: function(e, t) {
        return this.layer = 1, this.sign = Math.sign(e), e = Math.abs(e), this.mag = t + Math.log10(e), this.normalize(), this;
      }
    },
    {
      key: "fromMantissaExponent_noNormalize",
      value: function(e, t) {
        return this.fromMantissaExponent(e, t), this;
      }
    },
    {
      key: "fromDecimal",
      value: function(e) {
        return this.sign = e.sign, this.layer = e.layer, this.mag = e.mag, this;
      }
    },
    {
      key: "fromNumber",
      value: function(e) {
        return this.mag = Math.abs(e), this.sign = Math.sign(e), this.layer = 0, this.normalize(), this;
      }
    },
    {
      key: "fromString",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, i = e, a = r2.fromStringCache.get(i);
        if (a !== void 0) return this.fromDecimal(a);
        e = e.replace(",", "");
        var l = e.split("^^^");
        if (l.length === 2) {
          var f = parseFloat(l[0]), g = parseFloat(l[1]), h = l[1].split(";"), v = 1;
          if (h.length === 2 && (v = parseFloat(h[1]), isFinite(v) || (v = 1)), isFinite(f) && isFinite(g)) {
            var u = r2.pentate(f, g, v, t);
            return this.sign = u.sign, this.layer = u.layer, this.mag = u.mag, r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), this;
          }
        }
        var M = e.split("^^");
        if (M.length === 2) {
          var x = parseFloat(M[0]), w = parseFloat(M[1]), o = M[1].split(";"), F = 1;
          if (o.length === 2 && (F = parseFloat(o[1]), isFinite(F) || (F = 1)), isFinite(x) && isFinite(w)) {
            var A = r2.tetrate(x, w, F, t);
            return this.sign = A.sign, this.layer = A.layer, this.mag = A.mag, r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), this;
          }
        }
        var d = e.split("^");
        if (d.length === 2) {
          var S = parseFloat(d[0]), p = parseFloat(d[1]);
          if (isFinite(S) && isFinite(p)) {
            var q = r2.pow(S, p);
            return this.sign = q.sign, this.layer = q.layer, this.mag = q.mag, r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), this;
          }
        }
        e = e.trim().toLowerCase();
        var I, N, y = e.split("pt");
        if (y.length === 2) {
          I = 10;
          var V = false;
          y[0][0] == "-" && (V = true, y[0] = y[0].slice(1)), N = parseFloat(y[0]), y[1] = y[1].replace("(", ""), y[1] = y[1].replace(")", "");
          var C = parseFloat(y[1]);
          if (isFinite(C) || (C = 1), isFinite(I) && isFinite(N)) {
            var D = r2.tetrate(I, N, C, t);
            return this.sign = D.sign, this.layer = D.layer, this.mag = D.mag, r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), V && (this.sign *= -1), this;
          }
        }
        if (y = e.split("p"), y.length === 2) {
          I = 10;
          var Y = false;
          y[0][0] == "-" && (Y = true, y[0] = y[0].slice(1)), N = parseFloat(y[0]), y[1] = y[1].replace("(", ""), y[1] = y[1].replace(")", "");
          var L = parseFloat(y[1]);
          if (isFinite(L) || (L = 1), isFinite(I) && isFinite(N)) {
            var G = r2.tetrate(I, N, L, t);
            return this.sign = G.sign, this.layer = G.layer, this.mag = G.mag, r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), Y && (this.sign *= -1), this;
          }
        }
        if (y = e.split("f"), y.length === 2) {
          I = 10;
          var E = false;
          y[0][0] == "-" && (E = true, y[0] = y[0].slice(1)), y[0] = y[0].replace("(", ""), y[0] = y[0].replace(")", "");
          var X = parseFloat(y[0]);
          if (y[1] = y[1].replace("(", ""), y[1] = y[1].replace(")", ""), N = parseFloat(y[1]), isFinite(X) || (X = 1), isFinite(I) && isFinite(N)) {
            var Q = r2.tetrate(I, N, X, t);
            return this.sign = Q.sign, this.layer = Q.layer, this.mag = Q.mag, r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), E && (this.sign *= -1), this;
          }
        }
        var J = e.split("e"), Z = J.length - 1;
        if (Z === 0) {
          var re = parseFloat(e);
          if (isFinite(re)) return this.fromNumber(re), r2.fromStringCache.size >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), this;
        } else if (Z === 1) {
          var W = parseFloat(e);
          if (isFinite(W) && Math.abs(W) > 1e-307) return this.fromNumber(W), r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), this;
        }
        var H = e.split("e^");
        if (H.length === 2) {
          this.sign = 1, H[0].charAt(0) == "-" && (this.sign = -1);
          for (var te = "", U = 0; U < H[1].length; ++U) {
            var P = H[1].charCodeAt(U);
            if (P >= 43 && P <= 57 || P === 101) te += H[1].charAt(U);
            else {
              if (this.layer = parseFloat(te), this.mag = parseFloat(H[1].substr(U + 1)), this.layer < 0 || this.layer % 1 != 0) {
                var B = r2.tetrate(10, this.layer, this.mag, t);
                this.sign = B.sign, this.layer = B.layer, this.mag = B.mag;
              }
              return this.normalize(), r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), this;
            }
          }
        }
        if (Z < 1) return this.sign = 0, this.layer = 0, this.mag = 0, r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), this;
        var z = parseFloat(J[0]);
        if (z === 0) return this.sign = 0, this.layer = 0, this.mag = 0, r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), this;
        var R = parseFloat(J[J.length - 1]);
        if (Z >= 2) {
          var ee = parseFloat(J[J.length - 2]);
          isFinite(ee) && (R *= Math.sign(ee), R += ie(ee));
        }
        if (!isFinite(z)) this.sign = J[0] === "-" ? -1 : 1, this.layer = Z, this.mag = R;
        else if (Z === 1) this.sign = Math.sign(z), this.layer = 1, this.mag = R + Math.log10(Math.abs(z));
        else if (this.sign = Math.sign(z), this.layer = Z, Z === 2) {
          var j = r2.mul(m(1, 2, R), s(z));
          return this.sign = j.sign, this.layer = j.layer, this.mag = j.mag, r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), this;
        } else this.mag = R;
        return this.normalize(), r2.fromStringCache.maxSize >= 1 && r2.fromStringCache.set(i, r2.fromDecimal(this)), this;
      }
    },
    {
      key: "fromValue",
      value: function(e) {
        return e instanceof r2 ? this.fromDecimal(e) : typeof e == "number" ? this.fromNumber(e) : typeof e == "string" ? this.fromString(e) : (this.sign = 0, this.layer = 0, this.mag = 0, this);
      }
    },
    {
      key: "toNumber",
      value: function() {
        return this.mag === Number.POSITIVE_INFINITY && this.layer === Number.POSITIVE_INFINITY && this.sign === 1 ? Number.POSITIVE_INFINITY : this.mag === Number.POSITIVE_INFINITY && this.layer === Number.POSITIVE_INFINITY && this.sign === -1 ? Number.NEGATIVE_INFINITY : Number.isFinite(this.layer) ? this.layer === 0 ? this.sign * this.mag : this.layer === 1 ? this.sign * Math.pow(10, this.mag) : this.mag > 0 ? this.sign > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : 0 : NaN;
      }
    },
    {
      key: "mantissaWithDecimalPlaces",
      value: function(e) {
        return isNaN(this.m) ? NaN : this.m === 0 ? 0 : K(this.m, e);
      }
    },
    {
      key: "magnitudeWithDecimalPlaces",
      value: function(e) {
        return isNaN(this.mag) ? NaN : this.mag === 0 ? 0 : K(this.mag, e);
      }
    },
    {
      key: "toString",
      value: function() {
        return isNaN(this.layer) || isNaN(this.sign) || isNaN(this.mag) ? "NaN" : this.mag === Number.POSITIVE_INFINITY || this.layer === Number.POSITIVE_INFINITY ? this.sign === 1 ? "Infinity" : "-Infinity" : this.layer === 0 ? this.mag < 1e21 && this.mag > 1e-7 || this.mag === 0 ? (this.sign * this.mag).toString() : this.m + "e" + this.e : this.layer === 1 ? this.m + "e" + this.e : this.layer <= fe ? (this.sign === -1 ? "-" : "") + "e".repeat(this.layer) + this.mag : (this.sign === -1 ? "-" : "") + "(e^" + this.layer + ")" + this.mag;
      }
    },
    {
      key: "toExponential",
      value: function(e) {
        return this.layer === 0 ? (this.sign * this.mag).toExponential(e) : this.toStringWithDecimalPlaces(e);
      }
    },
    {
      key: "toFixed",
      value: function(e) {
        return this.layer === 0 ? (this.sign * this.mag).toFixed(e) : this.toStringWithDecimalPlaces(e);
      }
    },
    {
      key: "toPrecision",
      value: function(e) {
        return this.e <= -7 ? this.toExponential(e - 1) : e > this.e ? this.toFixed(e - this.exponent - 1) : this.toExponential(e - 1);
      }
    },
    {
      key: "valueOf",
      value: function() {
        return this.toString();
      }
    },
    {
      key: "toJSON",
      value: function() {
        return this.toString();
      }
    },
    {
      key: "toStringWithDecimalPlaces",
      value: function(e) {
        return this.layer === 0 ? this.mag < 1e21 && this.mag > 1e-7 || this.mag === 0 ? (this.sign * this.mag).toFixed(e) : K(this.m, e) + "e" + K(this.e, e) : this.layer === 1 ? K(this.m, e) + "e" + K(this.e, e) : this.layer <= fe ? (this.sign === -1 ? "-" : "") + "e".repeat(this.layer) + K(this.mag, e) : (this.sign === -1 ? "-" : "") + "(e^" + this.layer + ")" + K(this.mag, e);
      }
    },
    {
      key: "abs",
      value: function() {
        return c(this.sign === 0 ? 0 : 1, this.layer, this.mag);
      }
    },
    {
      key: "neg",
      value: function() {
        return c(-this.sign, this.layer, this.mag);
      }
    },
    {
      key: "negate",
      value: function() {
        return this.neg();
      }
    },
    {
      key: "negated",
      value: function() {
        return this.neg();
      }
    },
    {
      key: "sgn",
      value: function() {
        return this.sign;
      }
    },
    {
      key: "round",
      value: function() {
        return this.mag < 0 ? c(0, 0, 0) : this.layer === 0 ? m(this.sign, 0, Math.round(this.mag)) : new r2(this);
      }
    },
    {
      key: "floor",
      value: function() {
        return this.mag < 0 ? this.sign === -1 ? c(-1, 0, 1) : c(0, 0, 0) : this.sign === -1 ? this.neg().ceil().neg() : this.layer === 0 ? m(this.sign, 0, Math.floor(this.mag)) : new r2(this);
      }
    },
    {
      key: "ceil",
      value: function() {
        return this.mag < 0 ? this.sign === 1 ? c(1, 0, 1) : c(0, 0, 0) : this.sign === -1 ? this.neg().floor().neg() : this.layer === 0 ? m(this.sign, 0, Math.ceil(this.mag)) : new r2(this);
      }
    },
    {
      key: "trunc",
      value: function() {
        return this.mag < 0 ? c(0, 0, 0) : this.layer === 0 ? m(this.sign, 0, Math.trunc(this.mag)) : new r2(this);
      }
    },
    {
      key: "add",
      value: function(e) {
        var t = s(e);
        if (this.eq(r2.dInf) && t.eq(r2.dNegInf) || this.eq(r2.dNegInf) && t.eq(r2.dInf)) return new r2(r2.dNaN);
        if (!Number.isFinite(this.layer)) return new r2(this);
        if (!Number.isFinite(t.layer)) return new r2(t);
        if (this.sign === 0) return new r2(t);
        if (t.sign === 0) return new r2(this);
        if (this.sign === -t.sign && this.layer === t.layer && this.mag === t.mag) return c(0, 0, 0);
        var i, a;
        if (this.layer >= 2 || t.layer >= 2) return this.maxabs(t);
        if (r2.cmpabs(this, t) > 0 ? (i = new r2(this), a = new r2(t)) : (i = new r2(t), a = new r2(this)), i.layer === 0 && a.layer === 0) return r2.fromNumber(i.sign * i.mag + a.sign * a.mag);
        var l = i.layer * Math.sign(i.mag), f = a.layer * Math.sign(a.mag);
        if (l - f >= 2) return i;
        if (l === 0 && f === -1) {
          if (Math.abs(a.mag - Math.log10(i.mag)) > ne) return i;
          var g = Math.pow(10, Math.log10(i.mag) - a.mag), h = a.sign + i.sign * g;
          return m(Math.sign(h), 1, a.mag + Math.log10(Math.abs(h)));
        }
        if (l === 1 && f === 0) {
          if (Math.abs(i.mag - Math.log10(a.mag)) > ne) return i;
          var v = Math.pow(10, i.mag - Math.log10(a.mag)), u = a.sign + i.sign * v;
          return m(Math.sign(u), 1, Math.log10(a.mag) + Math.log10(Math.abs(u)));
        }
        if (Math.abs(i.mag - a.mag) > ne) return i;
        var M = Math.pow(10, i.mag - a.mag), x = a.sign + i.sign * M;
        return m(Math.sign(x), 1, a.mag + Math.log10(Math.abs(x)));
      }
    },
    {
      key: "plus",
      value: function(e) {
        return this.add(e);
      }
    },
    {
      key: "sub",
      value: function(e) {
        return this.add(s(e).neg());
      }
    },
    {
      key: "subtract",
      value: function(e) {
        return this.sub(e);
      }
    },
    {
      key: "minus",
      value: function(e) {
        return this.sub(e);
      }
    },
    {
      key: "mul",
      value: function(e) {
        var t = s(e);
        if (this.eq(r2.dInf) && t.eq(r2.dNegInf) || this.eq(r2.dNegInf) && t.eq(r2.dInf)) return new r2(r2.dNegInf);
        if (this.mag == Number.POSITIVE_INFINITY && t.eq(r2.dZero) || this.eq(r2.dZero) && this.mag == Number.POSITIVE_INFINITY) return new r2(r2.dNaN);
        if (this.eq(r2.dNegInf) && t.eq(r2.dNegInf)) return new r2(r2.dInf);
        if (!Number.isFinite(this.layer)) return new r2(this);
        if (!Number.isFinite(t.layer)) return new r2(t);
        if (this.sign === 0 || t.sign === 0) return c(0, 0, 0);
        if (this.layer === t.layer && this.mag === -t.mag) return c(this.sign * t.sign, 0, 1);
        var i, a;
        if (this.layer > t.layer || this.layer == t.layer && Math.abs(this.mag) > Math.abs(t.mag) ? (i = new r2(this), a = new r2(t)) : (i = new r2(t), a = new r2(this)), i.layer === 0 && a.layer === 0) return r2.fromNumber(i.sign * a.sign * i.mag * a.mag);
        if (i.layer >= 3 || i.layer - a.layer >= 2) return m(i.sign * a.sign, i.layer, i.mag);
        if (i.layer === 1 && a.layer === 0) return m(i.sign * a.sign, 1, i.mag + Math.log10(a.mag));
        if (i.layer === 1 && a.layer === 1) return m(i.sign * a.sign, 1, i.mag + a.mag);
        if (i.layer === 2 && a.layer === 1) {
          var l = m(Math.sign(i.mag), i.layer - 1, Math.abs(i.mag)).add(m(Math.sign(a.mag), a.layer - 1, Math.abs(a.mag)));
          return m(i.sign * a.sign, l.layer + 1, l.sign * l.mag);
        }
        if (i.layer === 2 && a.layer === 2) {
          var f = m(Math.sign(i.mag), i.layer - 1, Math.abs(i.mag)).add(m(Math.sign(a.mag), a.layer - 1, Math.abs(a.mag)));
          return m(i.sign * a.sign, f.layer + 1, f.sign * f.mag);
        }
        throw Error("Bad arguments to mul: " + this + ", " + e);
      }
    },
    {
      key: "multiply",
      value: function(e) {
        return this.mul(e);
      }
    },
    {
      key: "times",
      value: function(e) {
        return this.mul(e);
      }
    },
    {
      key: "div",
      value: function(e) {
        var t = s(e);
        return this.mul(t.recip());
      }
    },
    {
      key: "divide",
      value: function(e) {
        return this.div(e);
      }
    },
    {
      key: "divideBy",
      value: function(e) {
        return this.div(e);
      }
    },
    {
      key: "dividedBy",
      value: function(e) {
        return this.div(e);
      }
    },
    {
      key: "recip",
      value: function() {
        return this.mag === 0 ? new r2(r2.dNaN) : this.mag === Number.POSITIVE_INFINITY ? c(0, 0, 0) : this.layer === 0 ? m(this.sign, 0, 1 / this.mag) : m(this.sign, this.layer, -this.mag);
      }
    },
    {
      key: "reciprocal",
      value: function() {
        return this.recip();
      }
    },
    {
      key: "reciprocate",
      value: function() {
        return this.recip();
      }
    },
    {
      key: "mod",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, i = s(e), a = i.abs();
        if (this.eq(r2.dZero) || a.eq(r2.dZero)) return c(0, 0, 0);
        if (t) {
          var l = this.abs().mod(a);
          return this.sign == -1 != (i.sign == -1) && (l = i.abs().sub(l)), l.mul(i.sign);
        }
        var f = this.toNumber(), g = a.toNumber();
        return isFinite(f) && isFinite(g) && f != 0 && g != 0 ? new r2(f % g) : this.sub(a).eq(this) ? c(0, 0, 0) : a.sub(this).eq(a) ? new r2(this) : this.sign == -1 ? this.abs().mod(a).neg() : this.sub(this.div(a).floor().mul(a));
      }
    },
    {
      key: "modulo",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        return this.mod(e, t);
      }
    },
    {
      key: "modular",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        return this.mod(e, t);
      }
    },
    {
      key: "cmp",
      value: function(e) {
        var t = s(e);
        return this.sign > t.sign ? 1 : this.sign < t.sign ? -1 : this.sign * this.cmpabs(e);
      }
    },
    {
      key: "cmpabs",
      value: function(e) {
        var t = s(e), i = this.mag > 0 ? this.layer : -this.layer, a = t.mag > 0 ? t.layer : -t.layer;
        return i > a ? 1 : i < a ? -1 : this.mag > t.mag ? 1 : this.mag < t.mag ? -1 : 0;
      }
    },
    {
      key: "compare",
      value: function(e) {
        return this.cmp(e);
      }
    },
    {
      key: "isNan",
      value: function() {
        return isNaN(this.sign) || isNaN(this.layer) || isNaN(this.mag);
      }
    },
    {
      key: "isFinite",
      value: (function(n) {
        function e() {
          return n.apply(this, arguments);
        }
        return e.toString = function() {
          return n.toString();
        }, e;
      })(function() {
        return isFinite(this.sign) && isFinite(this.layer) && isFinite(this.mag);
      })
    },
    {
      key: "eq",
      value: function(e) {
        var t = s(e);
        return this.sign === t.sign && this.layer === t.layer && this.mag === t.mag;
      }
    },
    {
      key: "equals",
      value: function(e) {
        return this.eq(e);
      }
    },
    {
      key: "neq",
      value: function(e) {
        return !this.eq(e);
      }
    },
    {
      key: "notEquals",
      value: function(e) {
        return this.neq(e);
      }
    },
    {
      key: "lt",
      value: function(e) {
        return this.cmp(e) === -1;
      }
    },
    {
      key: "lte",
      value: function(e) {
        return !this.gt(e);
      }
    },
    {
      key: "gt",
      value: function(e) {
        return this.cmp(e) === 1;
      }
    },
    {
      key: "gte",
      value: function(e) {
        return !this.lt(e);
      }
    },
    {
      key: "max",
      value: function(e) {
        var t = s(e);
        return this.lt(t) ? new r2(t) : new r2(this);
      }
    },
    {
      key: "min",
      value: function(e) {
        var t = s(e);
        return this.gt(t) ? new r2(t) : new r2(this);
      }
    },
    {
      key: "maxabs",
      value: function(e) {
        var t = s(e);
        return this.cmpabs(t) < 0 ? new r2(t) : new r2(this);
      }
    },
    {
      key: "minabs",
      value: function(e) {
        var t = s(e);
        return this.cmpabs(t) > 0 ? new r2(t) : new r2(this);
      }
    },
    {
      key: "clamp",
      value: function(e, t) {
        return this.max(e).min(t);
      }
    },
    {
      key: "clampMin",
      value: function(e) {
        return this.max(e);
      }
    },
    {
      key: "clampMax",
      value: function(e) {
        return this.min(e);
      }
    },
    {
      key: "cmp_tolerance",
      value: function(e, t) {
        var i = s(e);
        return this.eq_tolerance(i, t) ? 0 : this.cmp(i);
      }
    },
    {
      key: "compare_tolerance",
      value: function(e, t) {
        return this.cmp_tolerance(e, t);
      }
    },
    {
      key: "eq_tolerance",
      value: function(e, t) {
        var i = s(e);
        if (t ??= 1e-7, this.sign !== i.sign || Math.abs(this.layer - i.layer) > 1) return false;
        var a = this.mag, l = i.mag;
        return this.layer > i.layer && (l = ie(l)), this.layer < i.layer && (a = ie(a)), Math.abs(a - l) <= t * Math.max(Math.abs(a), Math.abs(l));
      }
    },
    {
      key: "equals_tolerance",
      value: function(e, t) {
        return this.eq_tolerance(e, t);
      }
    },
    {
      key: "neq_tolerance",
      value: function(e, t) {
        return !this.eq_tolerance(e, t);
      }
    },
    {
      key: "notEquals_tolerance",
      value: function(e, t) {
        return this.neq_tolerance(e, t);
      }
    },
    {
      key: "lt_tolerance",
      value: function(e, t) {
        var i = s(e);
        return !this.eq_tolerance(i, t) && this.lt(i);
      }
    },
    {
      key: "lte_tolerance",
      value: function(e, t) {
        var i = s(e);
        return this.eq_tolerance(i, t) || this.lt(i);
      }
    },
    {
      key: "gt_tolerance",
      value: function(e, t) {
        var i = s(e);
        return !this.eq_tolerance(i, t) && this.gt(i);
      }
    },
    {
      key: "gte_tolerance",
      value: function(e, t) {
        var i = s(e);
        return this.eq_tolerance(i, t) || this.gt(i);
      }
    },
    {
      key: "pLog10",
      value: function() {
        return this.lt(r2.dZero) ? c(0, 0, 0) : this.log10();
      }
    },
    {
      key: "absLog10",
      value: function() {
        return this.sign === 0 ? new r2(r2.dNaN) : this.layer > 0 ? m(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag)) : m(1, 0, Math.log10(this.mag));
      }
    },
    {
      key: "log10",
      value: function() {
        return this.sign <= 0 ? new r2(r2.dNaN) : this.layer > 0 ? m(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag)) : m(this.sign, 0, Math.log10(this.mag));
      }
    },
    {
      key: "log",
      value: function(e) {
        return e = s(e), this.sign <= 0 ? new r2(r2.dNaN) : e.sign <= 0 ? new r2(r2.dNaN) : e.sign === 1 && e.layer === 0 && e.mag === 1 ? new r2(r2.dNaN) : this.layer === 0 && e.layer === 0 ? m(this.sign, 0, Math.log(this.mag) / Math.log(e.mag)) : r2.div(this.log10(), e.log10());
      }
    },
    {
      key: "log2",
      value: function() {
        return this.sign <= 0 ? new r2(r2.dNaN) : this.layer === 0 ? m(this.sign, 0, Math.log2(this.mag)) : this.layer === 1 ? m(Math.sign(this.mag), 0, Math.abs(this.mag) * 3.321928094887362) : this.layer === 2 ? m(Math.sign(this.mag), 1, Math.abs(this.mag) + 0.5213902276543247) : m(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
      }
    },
    {
      key: "ln",
      value: function() {
        return this.sign <= 0 ? new r2(r2.dNaN) : this.layer === 0 ? m(this.sign, 0, Math.log(this.mag)) : this.layer === 1 ? m(Math.sign(this.mag), 0, Math.abs(this.mag) * 2.302585092994046) : this.layer === 2 ? m(Math.sign(this.mag), 1, Math.abs(this.mag) + 0.36221568869946325) : m(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
      }
    },
    {
      key: "logarithm",
      value: function(e) {
        return this.log(e);
      }
    },
    {
      key: "pow",
      value: function(e) {
        var t = s(e), i = new r2(this), a = new r2(t);
        if (i.sign === 0) return a.eq(0) ? c(1, 0, 1) : i;
        if (i.sign === 1 && i.layer === 0 && i.mag === 1) return i;
        if (a.sign === 0) return c(1, 0, 1);
        if (a.sign === 1 && a.layer === 0 && a.mag === 1) return i;
        var l = i.absLog10().mul(a).pow10();
        return this.sign === -1 ? Math.abs(a.toNumber() % 2) % 2 === 1 ? l.neg() : Math.abs(a.toNumber() % 2) % 2 === 0 ? l : new r2(r2.dNaN) : l;
      }
    },
    {
      key: "pow10",
      value: function() {
        if (this.eq(r2.dInf)) return new r2(r2.dInf);
        if (this.eq(r2.dNegInf)) return c(0, 0, 0);
        if (!Number.isFinite(this.layer) || !Number.isFinite(this.mag)) return new r2(r2.dNaN);
        var e = new r2(this);
        if (e.layer === 0) {
          var t = Math.pow(10, e.sign * e.mag);
          if (Number.isFinite(t) && Math.abs(t) >= 0.1) return m(1, 0, t);
          if (e.sign === 0) return c(1, 0, 1);
          e = c(e.sign, e.layer + 1, Math.log10(e.mag));
        }
        return e.sign > 0 && e.mag >= 0 ? m(e.sign, e.layer + 1, e.mag) : e.sign < 0 && e.mag >= 0 ? m(-e.sign, e.layer + 1, -e.mag) : c(1, 0, 1);
      }
    },
    {
      key: "pow_base",
      value: function(e) {
        return s(e).pow(this);
      }
    },
    {
      key: "root",
      value: function(e) {
        var t = s(e);
        return this.lt(0) && t.mod(2, true).eq(1) ? this.neg().root(t).neg() : this.pow(t.recip());
      }
    },
    {
      key: "factorial",
      value: function() {
        return this.mag < 0 ? this.add(1).gamma() : this.layer === 0 ? this.add(1).gamma() : this.layer === 1 ? r2.exp(r2.mul(this, r2.ln(this).sub(1))) : r2.exp(this);
      }
    },
    {
      key: "gamma",
      value: function() {
        if (this.mag < 0) return this.recip();
        if (this.layer === 0) {
          if (this.lt(c(1, 0, 24))) return r2.fromNumber(ke(this.sign * this.mag));
          var e = this.mag - 1, t = 0.9189385332046727;
          t = t + (e + 0.5) * Math.log(e), t = t - e;
          var i = e * e, a = e, l = 12 * a, f = 1 / l, g = t + f;
          if (g === t || (t = g, a = a * i, l = 360 * a, f = 1 / l, g = t - f, g === t)) return r2.exp(t);
          t = g, a = a * i, l = 1260 * a;
          var h = 1 / l;
          return t = t + h, a = a * i, l = 1680 * a, h = 1 / l, t = t - h, r2.exp(t);
        } else return this.layer === 1 ? r2.exp(r2.mul(this, r2.ln(this).sub(1))) : r2.exp(this);
      }
    },
    {
      key: "lngamma",
      value: function() {
        return this.gamma().ln();
      }
    },
    {
      key: "exp",
      value: function() {
        return this.mag < 0 ? c(1, 0, 1) : this.layer === 0 && this.mag <= 709.7 ? r2.fromNumber(Math.exp(this.sign * this.mag)) : this.layer === 0 ? m(1, 1, this.sign * Math.log10(Math.E) * this.mag) : this.layer === 1 ? m(1, 2, this.sign * (Math.log10(0.4342944819032518) + this.mag)) : m(1, this.layer + 1, this.sign * this.mag);
      }
    },
    {
      key: "sqr",
      value: function() {
        return this.pow(2);
      }
    },
    {
      key: "sqrt",
      value: function() {
        if (this.layer === 0) return r2.fromNumber(Math.sqrt(this.sign * this.mag));
        if (this.layer === 1) return m(1, 2, Math.log10(this.mag) - 0.3010299956639812);
        var e = r2.div(c(this.sign, this.layer - 1, this.mag), c(1, 0, 2));
        return e.layer += 1, e.normalize(), e;
      }
    },
    {
      key: "cube",
      value: function() {
        return this.pow(3);
      }
    },
    {
      key: "cbrt",
      value: function() {
        return this.lt(0) ? this.neg().pow(1 / 3).neg() : this.pow(1 / 3);
      }
    },
    {
      key: "tetrate",
      value: function() {
        var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 2, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : c(1, 0, 1), i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        if (e === 1) return r2.pow(this, t);
        if (e === 0) return new r2(t);
        if (this.eq(r2.dOne)) return c(1, 0, 1);
        if (this.eq(-1)) return r2.pow(this, t);
        if (e === Number.POSITIVE_INFINITY) {
          var a = this.toNumber();
          if (a <= 1.444667861009766 && a >= 0.06598803584531254) {
            var l = r2.ln(this).neg(), f = l.lambertw().div(l);
            if (a < 1) return f;
            var g = l.lambertw(false).div(l);
            return a > 1.444667861009099 && (f = g = r2.fromNumber(Math.E)), t = s(t), t.eq(g) ? g : t.lt(g) ? f : new r2(r2.dInf);
          } else return a > 1.444667861009766 ? new r2(r2.dInf) : new r2(r2.dNaN);
        }
        if (this.eq(r2.dZero)) {
          var h = Math.abs((e + 1) % 2);
          return h > 1 && (h = 2 - h), r2.fromNumber(h);
        }
        if (e < 0) return r2.iteratedlog(t, this, -e, i);
        t = new r2(t);
        var v = e;
        e = Math.trunc(e);
        var u = v - e;
        if (this.gt(r2.dZero) && (this.lt(1) || this.lte(1.444667861009766) && t.lte(r2.ln(this).neg().lambertw(false).div(r2.ln(this).neg()))) && (v > 1e4 || !i)) {
          var M = Math.min(1e4, e);
          t.eq(r2.dOne) ? t = this.pow(u) : this.lt(1) ? t = t.pow(1 - u).mul(this.pow(t).pow(u)) : t = t.layeradd(u, this);
          for (var x = 0; x < M; ++x) {
            var w = t;
            if (t = this.pow(t), w.eq(t)) return t;
          }
          return v > 1e4 && Math.ceil(v) % 2 == 1 ? this.pow(t) : t;
        }
        u !== 0 && (t.eq(r2.dOne) ? this.gt(10) || i ? t = this.pow(u) : (t = r2.fromNumber(r2.tetrate_critical(this.toNumber(), u)), this.lt(2) && (t = t.sub(1).mul(this.minus(1)).plus(1))) : this.eq(10) ? t = t.layeradd10(u, i) : this.lt(1) ? t = t.pow(1 - u).mul(this.pow(t).pow(u)) : t = t.layeradd(u, this, i));
        for (var o = 0; o < e; ++o) {
          if (t = this.pow(t), !isFinite(t.layer) || !isFinite(t.mag)) return t.normalize();
          if (t.layer - this.layer > 3) return c(t.sign, t.layer + (e - o - 1), t.mag);
          if (o > 1e4) return t;
        }
        return t;
      }
    },
    {
      key: "iteratedexp",
      value: function() {
        var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 2, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : c(1, 0, 1), i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        return this.tetrate(e, t, i);
      }
    },
    {
      key: "iteratedlog",
      value: function() {
        var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        if (t < 0) return r2.tetrate(e, -t, this, i);
        e = s(e);
        var a = r2.fromDecimal(this), l = t;
        t = Math.trunc(t);
        var f = l - t;
        if (a.layer - e.layer > 3) {
          var g = Math.min(t, a.layer - e.layer - 3);
          t -= g, a.layer -= g;
        }
        for (var h = 0; h < t; ++h) {
          if (a = a.log(e), !isFinite(a.layer) || !isFinite(a.mag)) return a.normalize();
          if (h > 1e4) return a;
        }
        return f > 0 && f < 1 && (e.eq(10) ? a = a.layeradd10(-f, i) : a = a.layeradd(-f, e, i)), a;
      }
    },
    {
      key: "slog",
      value: function() {
        for (var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, a = 1e-3, l = false, f = false, g = this.slog_internal(e, i).toNumber(), h = 1; h < t; ++h) {
          var u = new r2(e).tetrate(g, r2.dOne, i).gt(this);
          if (h > 1 && f != u && (l = true), f = u, l ? a /= 2 : a *= 2, a = Math.abs(a) * (u ? -1 : 1), g += a, a === 0) break;
        }
        return r2.fromNumber(g);
      }
    },
    {
      key: "slog_internal",
      value: function() {
        var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        if (e = s(e), e.lte(r2.dZero)) return new r2(r2.dNaN);
        if (e.eq(r2.dOne)) return new r2(r2.dNaN);
        if (e.lt(r2.dOne)) return this.eq(r2.dOne) ? c(0, 0, 0) : this.eq(r2.dZero) ? c(-1, 0, 1) : new r2(r2.dNaN);
        if (this.mag < 0 || this.eq(r2.dZero)) return c(-1, 0, 1);
        if (e.lt(1.444667861009766)) {
          var i = r2.ln(e).neg(), a = i.lambertw().div(i);
          if (this.eq(a)) return new r2(r2.dInf);
          if (this.gt(a)) return new r2(r2.dNaN);
        }
        var l = 0, f = r2.fromDecimal(this);
        if (f.layer - e.layer > 3) {
          var g = f.layer - e.layer - 3;
          l += g, f.layer -= g;
        }
        for (var h = 0; h < 100; ++h) if (f.lt(r2.dZero)) f = r2.pow(e, f), l -= 1;
        else {
          if (f.lte(r2.dOne)) return t ? r2.fromNumber(l + f.toNumber() - 1) : r2.fromNumber(l + r2.slog_critical(e.toNumber(), f.toNumber()));
          l += 1, f = r2.log(f, e);
        }
        return r2.fromNumber(l);
      }
    },
    {
      key: "layeradd10",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        e = r2.fromValue_noAlloc(e).toNumber();
        var i = r2.fromDecimal(this);
        if (e >= 1) {
          i.mag < 0 && i.layer > 0 ? (i.sign = 0, i.mag = 0, i.layer = 0) : i.sign === -1 && i.layer == 0 && (i.sign = 1, i.mag = -i.mag);
          var a = Math.trunc(e);
          e -= a, i.layer += a;
        }
        if (e <= -1) {
          var l = Math.trunc(e);
          if (e -= l, i.layer += l, i.layer < 0) for (var f = 0; f < 100; ++f) {
            if (i.layer++, i.mag = Math.log10(i.mag), !isFinite(i.mag)) return i.sign === 0 && (i.sign = 1), i.layer < 0 && (i.layer = 0), i.normalize();
            if (i.layer >= 0) break;
          }
        }
        for (; i.layer < 0; ) i.layer++, i.mag = Math.log10(i.mag);
        return i.sign === 0 && (i.sign = 1, i.mag === 0 && i.layer >= 1 && (i.layer -= 1, i.mag = 1)), i.normalize(), e !== 0 ? i.layeradd(e, 10, t) : i;
      }
    },
    {
      key: "layeradd",
      value: function(e, t) {
        var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, a = s(t);
        if (a.gt(1) && a.lte(1.444667861009766)) {
          var l = r2.excess_slog(this, t, i), f = l[0].toNumber(), g = l[1], h = f + e, v = r2.ln(t).neg(), u = v.lambertw().div(v), M = v.lambertw(false).div(v), x = r2.dOne;
          g == 1 ? x = u.mul(M).sqrt() : g == 2 && (x = M.mul(2));
          var w = a.pow(x), o = Math.floor(h), F = h - o, A = x.pow(1 - F).mul(w.pow(F));
          return r2.tetrate(a, o, A, i);
        }
        var S = this.slog(t, 100, i).toNumber() + e;
        return S >= 0 ? r2.tetrate(t, S, r2.dOne, i) : Number.isFinite(S) ? S >= -1 ? r2.log(r2.tetrate(t, S + 1, r2.dOne, i), t) : r2.log(r2.log(r2.tetrate(t, S + 2, r2.dOne, i), t), t) : new r2(r2.dNaN);
      }
    },
    {
      key: "lambertw",
      value: function() {
        var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
        return this.lt(-0.3678794411710499) ? new r2(r2.dNaN) : e ? this.abs().lt("1e-300") ? new r2(this) : this.mag < 0 ? r2.fromNumber(ae(this.toNumber())) : this.layer === 0 ? r2.fromNumber(ae(this.sign * this.mag)) : this.lt("eee15") ? he(this) : this.ln() : this.sign === 1 ? new r2(r2.dNaN) : this.layer === 0 ? r2.fromNumber(ae(this.sign * this.mag, 1e-10, false)) : this.layer == 1 ? he(this, 1e-10, false) : this.neg().recip().lambertw().neg();
      }
    },
    {
      key: "ssqrt",
      value: function() {
        return this.linear_sroot(2);
      }
    },
    {
      key: "linear_sroot",
      value: function(e) {
        if (e == 1) return this;
        if (this.eq(r2.dInf)) return new r2(r2.dInf);
        if (!this.isFinite()) return new r2(r2.dNaN);
        if (e > 0 && e < 1) return this.root(e);
        if (e > -2 && e < -1) return r2.fromNumber(e).add(2).pow(this.recip());
        if (e <= 0) return new r2(r2.dNaN);
        if (e == Number.POSITIVE_INFINITY) {
          var t = this.toNumber();
          return t < Math.E && t > Me ? this.pow(this.recip()) : new r2(r2.dNaN);
        }
        if (this.eq(1)) return c(1, 0, 1);
        if (this.lt(0)) return new r2(r2.dNaN);
        if (this.lte("1ee-16")) return e % 2 == 1 ? new r2(this) : new r2(r2.dNaN);
        if (this.gt(1)) {
          var i = r2.dTen;
          this.gte(r2.tetrate(10, e, 1, true)) && (i = this.iteratedlog(10, e - 1, true)), e <= 1 && (i = this.root(e));
          for (var a = r2.dZero, l = i.layer, f = i.iteratedlog(10, l, true), g = f, h = f.div(2), v = true; v; ) h = a.add(f).div(2), r2.iteratedexp(10, l, h, true).tetrate(e, 1, true).gt(this) ? f = h : a = h, h.eq(g) ? v = false : g = h;
          return r2.iteratedexp(10, l, h, true);
        } else {
          for (var u = 1, M = m(1, 10, 1), x = m(1, 10, 1), w = m(1, 10, 1), o = m(1, 1, -16), F = r2.dZero, A = m(1, 10, 1), d = o.pow10().recip(), S = r2.dZero, p = d, q = d, I = Math.ceil(e) % 2 == 0, N = 0, y = m(1, 10, 1), V = false, C = r2.dZero, D = false; u < 4; ) {
            if (u == 2) {
              if (I) break;
              w = m(1, 10, 1), o = M, u = 3, A = m(1, 10, 1), y = m(1, 10, 1);
            }
            for (V = false; o.neq(w); ) {
              if (C = o, o.pow10().recip().tetrate(e, 1, true).eq(1) && o.pow10().recip().lt(0.4)) d = o.pow10().recip(), p = o.pow10().recip(), q = o.pow10().recip(), S = r2.dZero, N = -1, u == 3 && (y = o);
              else if (o.pow10().recip().tetrate(e, 1, true).eq(o.pow10().recip()) && !I && o.pow10().recip().lt(0.4)) d = o.pow10().recip(), p = o.pow10().recip(), q = o.pow10().recip(), S = r2.dZero, N = 0;
              else if (o.pow10().recip().tetrate(e, 1, true).eq(o.pow10().recip().mul(2).tetrate(e, 1, true))) d = o.pow10().recip(), p = r2.dZero, q = d.mul(2), S = d, I ? N = -1 : N = 0;
              else {
                for (F = o.mul(12e-17), d = o.pow10().recip(), p = o.add(F).pow10().recip(), S = d.sub(p), q = d.add(S); p.tetrate(e, 1, true).eq(d.tetrate(e, 1, true)) || q.tetrate(e, 1, true).eq(d.tetrate(e, 1, true)) || p.gte(d) || q.lte(d); ) F = F.mul(2), p = o.add(F).pow10().recip(), S = d.sub(p), q = d.add(S);
                if ((u == 1 && q.tetrate(e, 1, true).gt(d.tetrate(e, 1, true)) && p.tetrate(e, 1, true).gt(d.tetrate(e, 1, true)) || u == 3 && q.tetrate(e, 1, true).lt(d.tetrate(e, 1, true)) && p.tetrate(e, 1, true).lt(d.tetrate(e, 1, true))) && (y = o), q.tetrate(e, 1, true).lt(d.tetrate(e, 1, true))) N = -1;
                else if (I) N = 1;
                else if (u == 3 && o.gt_tolerance(M, 1e-8)) N = 0;
                else {
                  for (; p.tetrate(e, 1, true).eq_tolerance(d.tetrate(e, 1, true), 1e-8) || q.tetrate(e, 1, true).eq_tolerance(d.tetrate(e, 1, true), 1e-8) || p.gte(d) || q.lte(d); ) F = F.mul(2), p = o.add(F).pow10().recip(), S = d.sub(p), q = d.add(S);
                  q.tetrate(e, 1, true).sub(d.tetrate(e, 1, true)).lt(d.tetrate(e, 1, true).sub(p.tetrate(e, 1, true))) ? N = 0 : N = 1;
                }
              }
              if (N == -1 && (D = true), u == 1 && N == 1 || u == 3 && N != 0) if (w.eq(m(1, 10, 1))) o = o.mul(2);
              else {
                var Y = false;
                if (V && (N == 1 && u == 1 || N == -1 && u == 3) && (Y = true), o = o.add(w).div(2), Y) break;
              }
              else if (w.eq(m(1, 10, 1))) w = o, o = o.div(2);
              else {
                var L = false;
                if (V && (N == 1 && u == 1 || N == -1 && u == 3) && (L = true), w = w.sub(A), o = o.sub(A), L) break;
              }
              if (w.sub(o).div(2).abs().gt(A.mul(1.5)) && (V = true), A = w.sub(o).div(2).abs(), o.gt("1e18") || o.eq(C)) break;
            }
            if (o.gt("1e18") || !D || y == m(1, 10, 1)) break;
            u == 1 ? M = y : u == 3 && (x = y), u++;
          }
          w = M, o = m(1, 1, -18);
          for (var G = o, E = r2.dZero, X = true; X; ) if (w.eq(m(1, 10, 1)) ? E = o.mul(2) : E = w.add(o).div(2), r2.pow(10, E).recip().tetrate(e, 1, true).gt(this) ? o = E : w = E, E.eq(G) ? X = false : G = E, o.gt("1e18")) return new r2(r2.dNaN);
          if (E.eq_tolerance(M, 1e-15)) {
            if (x.eq(m(1, 10, 1))) return new r2(r2.dNaN);
            for (w = m(1, 10, 1), o = x, G = o, E = r2.dZero, X = true; X; ) if (w.eq(m(1, 10, 1)) ? E = o.mul(2) : E = w.add(o).div(2), r2.pow(10, E).recip().tetrate(e, 1, true).gt(this) ? o = E : w = E, E.eq(G) ? X = false : G = E, o.gt("1e18")) return new r2(r2.dNaN);
            return E.pow10().recip();
          } else return E.pow10().recip();
        }
      }
    },
    {
      key: "pentate",
      value: function() {
        var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 2, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : c(1, 0, 1), i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        t = new r2(t);
        var a = e;
        e = Math.floor(e);
        var l = a - e, f = r2.dZero, g = r2.dZero;
        if (l !== 0) if (t.eq(r2.dOne)) ++e, t = r2.fromNumber(l);
        else return this.pentate(t.penta_log(this, void 0, i).plus(a).toNumber(), 1, i);
        if (e > 0) for (var h = 0; h < e; ) {
          if (g = f, f = t, t = this.tetrate(t.toNumber(), r2.dOne, i), ++h, this.gt(0) && this.lte(1) && t.gt(0) && t.lte(1)) return this.tetrate(e - h, t, i);
          if (t.eq(f) || t.eq(g) && h % 2 == e % 2 || !isFinite(t.layer) || !isFinite(t.mag)) return t.normalize();
          if (h > 1e4) return t;
        }
        else for (var v = 0; v < -e; ++v) {
          if (f = t, t = t.slog(this, void 0, i), t.eq(f) || !isFinite(t.layer) || !isFinite(t.mag)) return t.normalize();
          if (v > 100) return t;
        }
        return t;
      }
    },
    {
      key: "penta_log",
      value: function() {
        var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 10, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        if (e = new r2(e), e.lte(1)) return new r2(r2.dNaN);
        if (this.eq(1)) return c(0, 0, 0);
        if (this.eq(r2.dInf)) return new r2(r2.dInf);
        var a = new r2(1), l = 0, f = 1;
        if (this.lt(-1)) {
          if (this.lte(-2)) return new r2(r2.dNaN);
          var g = e.tetrate(this.toNumber(), 1, i);
          if (this.eq(g)) return new r2(r2.dNegInf);
          if (this.gt(g)) return new r2(r2.dNaN);
        }
        if (this.gt(1)) {
          for (; a.lt(this); ) if (l++, a = r2.tetrate(e, a.toNumber(), 1, i), l > 1e3) return new r2(r2.dNaN);
        } else for (; a.gt(this); ) if (l--, a = r2.slog(a, e, i), l > 100) return new r2(r2.dNaN);
        for (var h = 1; h < t; ++h) {
          var v = e.pentate(l, r2.dOne, i);
          if (v.eq(this)) break;
          var u = v.gt(this);
          if (f = Math.abs(f) * (u ? -1 : 1), l += f, f /= 2, f === 0) break;
        }
        return r2.fromNumber(l);
      }
    },
    {
      key: "linear_penta_root",
      value: function(e) {
        return e == 1 ? this : e < 0 ? new r2(r2.dNaN) : this.eq(r2.dInf) ? new r2(r2.dInf) : this.isFinite() ? e > 0 && e < 1 ? this.root(e) : this.eq(1) ? c(1, 0, 1) : this.lt(0) ? new r2(r2.dNaN) : this.lt(1) ? this.linear_sroot(e) : r2.increasingInverse(function(t) {
          return r2.pentate(t, e, 1, true);
        })(this) : new r2(r2.dNaN);
      }
    },
    {
      key: "sin",
      value: function() {
        return this.mag < 0 ? new r2(this) : this.layer === 0 ? r2.fromNumber(Math.sin(this.sign * this.mag)) : c(0, 0, 0);
      }
    },
    {
      key: "cos",
      value: function() {
        return this.mag < 0 ? c(1, 0, 1) : this.layer === 0 ? r2.fromNumber(Math.cos(this.sign * this.mag)) : c(0, 0, 0);
      }
    },
    {
      key: "tan",
      value: function() {
        return this.mag < 0 ? new r2(this) : this.layer === 0 ? r2.fromNumber(Math.tan(this.sign * this.mag)) : c(0, 0, 0);
      }
    },
    {
      key: "asin",
      value: function() {
        return this.mag < 0 ? new r2(this) : this.layer === 0 ? r2.fromNumber(Math.asin(this.sign * this.mag)) : new r2(r2.dNaN);
      }
    },
    {
      key: "acos",
      value: function() {
        return this.mag < 0 ? r2.fromNumber(Math.acos(this.toNumber())) : this.layer === 0 ? r2.fromNumber(Math.acos(this.sign * this.mag)) : new r2(r2.dNaN);
      }
    },
    {
      key: "atan",
      value: function() {
        return this.mag < 0 ? new r2(this) : this.layer === 0 ? r2.fromNumber(Math.atan(this.sign * this.mag)) : r2.fromNumber(Math.atan(this.sign * (1 / 0)));
      }
    },
    {
      key: "sinh",
      value: function() {
        return this.exp().sub(this.negate().exp()).div(2);
      }
    },
    {
      key: "cosh",
      value: function() {
        return this.exp().add(this.negate().exp()).div(2);
      }
    },
    {
      key: "tanh",
      value: function() {
        return this.sinh().div(this.cosh());
      }
    },
    {
      key: "asinh",
      value: function() {
        return r2.ln(this.add(this.sqr().add(1).sqrt()));
      }
    },
    {
      key: "acosh",
      value: function() {
        return r2.ln(this.add(this.sqr().sub(1).sqrt()));
      }
    },
    {
      key: "atanh",
      value: function() {
        return this.abs().gte(1) ? new r2(r2.dNaN) : r2.ln(this.add(1).div(r2.fromNumber(1).sub(this))).div(2);
      }
    },
    {
      key: "ascensionPenalty",
      value: function(e) {
        return e === 0 ? new r2(this) : this.root(r2.pow(10, e));
      }
    },
    {
      key: "egg",
      value: function() {
        return this.add(9);
      }
    },
    {
      key: "lessThanOrEqualTo",
      value: function(e) {
        return this.cmp(e) < 1;
      }
    },
    {
      key: "lessThan",
      value: function(e) {
        return this.cmp(e) < 0;
      }
    },
    {
      key: "greaterThanOrEqualTo",
      value: function(e) {
        return this.cmp(e) > -1;
      }
    },
    {
      key: "greaterThan",
      value: function(e) {
        return this.cmp(e) > 0;
      }
    }
  ], [
    {
      key: "fromComponents",
      value: function(e, t, i) {
        return new r2().fromComponents(e, t, i);
      }
    },
    {
      key: "fromComponents_noNormalize",
      value: function(e, t, i) {
        return new r2().fromComponents_noNormalize(e, t, i);
      }
    },
    {
      key: "fromMantissaExponent",
      value: function(e, t) {
        return new r2().fromMantissaExponent(e, t);
      }
    },
    {
      key: "fromMantissaExponent_noNormalize",
      value: function(e, t) {
        return new r2().fromMantissaExponent_noNormalize(e, t);
      }
    },
    {
      key: "fromDecimal",
      value: function(e) {
        return new r2().fromDecimal(e);
      }
    },
    {
      key: "fromNumber",
      value: function(e) {
        return new r2().fromNumber(e);
      }
    },
    {
      key: "fromString",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        return new r2().fromString(e, t);
      }
    },
    {
      key: "fromValue",
      value: function(e) {
        return new r2().fromValue(e);
      }
    },
    {
      key: "fromValue_noAlloc",
      value: function(e) {
        if (e instanceof r2) return e;
        if (typeof e == "string") {
          var t = r2.fromStringCache.get(e);
          return t !== void 0 ? t : r2.fromString(e);
        } else return typeof e == "number" ? r2.fromNumber(e) : c(0, 0, 0);
      }
    },
    {
      key: "abs",
      value: function(e) {
        return s(e).abs();
      }
    },
    {
      key: "neg",
      value: function(e) {
        return s(e).neg();
      }
    },
    {
      key: "negate",
      value: function(e) {
        return s(e).neg();
      }
    },
    {
      key: "negated",
      value: function(e) {
        return s(e).neg();
      }
    },
    {
      key: "sign",
      value: function(e) {
        return s(e).sign;
      }
    },
    {
      key: "sgn",
      value: function(e) {
        return s(e).sign;
      }
    },
    {
      key: "round",
      value: function(e) {
        return s(e).round();
      }
    },
    {
      key: "floor",
      value: function(e) {
        return s(e).floor();
      }
    },
    {
      key: "ceil",
      value: function(e) {
        return s(e).ceil();
      }
    },
    {
      key: "trunc",
      value: function(e) {
        return s(e).trunc();
      }
    },
    {
      key: "add",
      value: function(e, t) {
        return s(e).add(t);
      }
    },
    {
      key: "plus",
      value: function(e, t) {
        return s(e).add(t);
      }
    },
    {
      key: "sub",
      value: function(e, t) {
        return s(e).sub(t);
      }
    },
    {
      key: "subtract",
      value: function(e, t) {
        return s(e).sub(t);
      }
    },
    {
      key: "minus",
      value: function(e, t) {
        return s(e).sub(t);
      }
    },
    {
      key: "mul",
      value: function(e, t) {
        return s(e).mul(t);
      }
    },
    {
      key: "multiply",
      value: function(e, t) {
        return s(e).mul(t);
      }
    },
    {
      key: "times",
      value: function(e, t) {
        return s(e).mul(t);
      }
    },
    {
      key: "div",
      value: function(e, t) {
        return s(e).div(t);
      }
    },
    {
      key: "divide",
      value: function(e, t) {
        return s(e).div(t);
      }
    },
    {
      key: "recip",
      value: function(e) {
        return s(e).recip();
      }
    },
    {
      key: "reciprocal",
      value: function(e) {
        return s(e).recip();
      }
    },
    {
      key: "reciprocate",
      value: function(e) {
        return s(e).reciprocate();
      }
    },
    {
      key: "mod",
      value: function(e, t) {
        var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        return s(e).mod(t, i);
      }
    },
    {
      key: "modulo",
      value: function(e, t) {
        var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        return s(e).modulo(t, i);
      }
    },
    {
      key: "modular",
      value: function(e, t) {
        var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        return s(e).modular(t, i);
      }
    },
    {
      key: "cmp",
      value: function(e, t) {
        return s(e).cmp(t);
      }
    },
    {
      key: "cmpabs",
      value: function(e, t) {
        return s(e).cmpabs(t);
      }
    },
    {
      key: "compare",
      value: function(e, t) {
        return s(e).cmp(t);
      }
    },
    {
      key: "isNaN",
      value: (function(n) {
        function e(t) {
          return n.apply(this, arguments);
        }
        return e.toString = function() {
          return n.toString();
        }, e;
      })(function(n) {
        return n = s(n), isNaN(n.sign) || isNaN(n.layer) || isNaN(n.mag);
      })
    },
    {
      key: "isFinite",
      value: (function(n) {
        function e(t) {
          return n.apply(this, arguments);
        }
        return e.toString = function() {
          return n.toString();
        }, e;
      })(function(n) {
        return n = s(n), isFinite(n.sign) && isFinite(n.layer) && isFinite(n.mag);
      })
    },
    {
      key: "eq",
      value: function(e, t) {
        return s(e).eq(t);
      }
    },
    {
      key: "equals",
      value: function(e, t) {
        return s(e).eq(t);
      }
    },
    {
      key: "neq",
      value: function(e, t) {
        return s(e).neq(t);
      }
    },
    {
      key: "notEquals",
      value: function(e, t) {
        return s(e).notEquals(t);
      }
    },
    {
      key: "lt",
      value: function(e, t) {
        return s(e).lt(t);
      }
    },
    {
      key: "lte",
      value: function(e, t) {
        return s(e).lte(t);
      }
    },
    {
      key: "gt",
      value: function(e, t) {
        return s(e).gt(t);
      }
    },
    {
      key: "gte",
      value: function(e, t) {
        return s(e).gte(t);
      }
    },
    {
      key: "max",
      value: function(e, t) {
        return s(e).max(t);
      }
    },
    {
      key: "min",
      value: function(e, t) {
        return s(e).min(t);
      }
    },
    {
      key: "minabs",
      value: function(e, t) {
        return s(e).minabs(t);
      }
    },
    {
      key: "maxabs",
      value: function(e, t) {
        return s(e).maxabs(t);
      }
    },
    {
      key: "clamp",
      value: function(e, t, i) {
        return s(e).clamp(t, i);
      }
    },
    {
      key: "clampMin",
      value: function(e, t) {
        return s(e).clampMin(t);
      }
    },
    {
      key: "clampMax",
      value: function(e, t) {
        return s(e).clampMax(t);
      }
    },
    {
      key: "cmp_tolerance",
      value: function(e, t, i) {
        return s(e).cmp_tolerance(t, i);
      }
    },
    {
      key: "compare_tolerance",
      value: function(e, t, i) {
        return s(e).cmp_tolerance(t, i);
      }
    },
    {
      key: "eq_tolerance",
      value: function(e, t, i) {
        return s(e).eq_tolerance(t, i);
      }
    },
    {
      key: "equals_tolerance",
      value: function(e, t, i) {
        return s(e).eq_tolerance(t, i);
      }
    },
    {
      key: "neq_tolerance",
      value: function(e, t, i) {
        return s(e).neq_tolerance(t, i);
      }
    },
    {
      key: "notEquals_tolerance",
      value: function(e, t, i) {
        return s(e).notEquals_tolerance(t, i);
      }
    },
    {
      key: "lt_tolerance",
      value: function(e, t, i) {
        return s(e).lt_tolerance(t, i);
      }
    },
    {
      key: "lte_tolerance",
      value: function(e, t, i) {
        return s(e).lte_tolerance(t, i);
      }
    },
    {
      key: "gt_tolerance",
      value: function(e, t, i) {
        return s(e).gt_tolerance(t, i);
      }
    },
    {
      key: "gte_tolerance",
      value: function(e, t, i) {
        return s(e).gte_tolerance(t, i);
      }
    },
    {
      key: "pLog10",
      value: function(e) {
        return s(e).pLog10();
      }
    },
    {
      key: "absLog10",
      value: function(e) {
        return s(e).absLog10();
      }
    },
    {
      key: "log10",
      value: function(e) {
        return s(e).log10();
      }
    },
    {
      key: "log",
      value: function(e, t) {
        return s(e).log(t);
      }
    },
    {
      key: "log2",
      value: function(e) {
        return s(e).log2();
      }
    },
    {
      key: "ln",
      value: function(e) {
        return s(e).ln();
      }
    },
    {
      key: "logarithm",
      value: function(e, t) {
        return s(e).logarithm(t);
      }
    },
    {
      key: "pow",
      value: function(e, t) {
        return s(e).pow(t);
      }
    },
    {
      key: "pow10",
      value: function(e) {
        return s(e).pow10();
      }
    },
    {
      key: "root",
      value: function(e, t) {
        return s(e).root(t);
      }
    },
    {
      key: "factorial",
      value: function(e, t) {
        return s(e).factorial();
      }
    },
    {
      key: "gamma",
      value: function(e, t) {
        return s(e).gamma();
      }
    },
    {
      key: "lngamma",
      value: function(e, t) {
        return s(e).lngamma();
      }
    },
    {
      key: "exp",
      value: function(e) {
        return s(e).exp();
      }
    },
    {
      key: "sqr",
      value: function(e) {
        return s(e).sqr();
      }
    },
    {
      key: "sqrt",
      value: function(e) {
        return s(e).sqrt();
      }
    },
    {
      key: "cube",
      value: function(e) {
        return s(e).cube();
      }
    },
    {
      key: "cbrt",
      value: function(e) {
        return s(e).cbrt();
      }
    },
    {
      key: "tetrate",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : c(1, 0, 1), a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
        return s(e).tetrate(t, i, a);
      }
    },
    {
      key: "iteratedexp",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : c(1, 0, 1), a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
        return s(e).iteratedexp(t, i, a);
      }
    },
    {
      key: "iteratedlog",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
        return s(e).iteratedlog(t, i, a);
      }
    },
    {
      key: "layeradd10",
      value: function(e, t) {
        var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        return s(e).layeradd10(t, i);
      }
    },
    {
      key: "layeradd",
      value: function(e, t) {
        var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 10, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
        return s(e).layeradd(t, i, a);
      }
    },
    {
      key: "slog",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        return s(e).slog(t, 100, i);
      }
    },
    {
      key: "lambertw",
      value: function(e, t) {
        return s(e).lambertw(t);
      }
    },
    {
      key: "ssqrt",
      value: function(e) {
        return s(e).ssqrt();
      }
    },
    {
      key: "linear_sroot",
      value: function(e, t) {
        return s(e).linear_sroot(t);
      }
    },
    {
      key: "pentate",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : c(1, 0, 1), a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
        return s(e).pentate(t, i, a);
      }
    },
    {
      key: "penta_log",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 10, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        return s(e).penta_log(t, 100, i);
      }
    },
    {
      key: "linear_penta_root",
      value: function(e, t) {
        return s(e).linear_penta_root(t);
      }
    },
    {
      key: "sin",
      value: function(e) {
        return s(e).sin();
      }
    },
    {
      key: "cos",
      value: function(e) {
        return s(e).cos();
      }
    },
    {
      key: "tan",
      value: function(e) {
        return s(e).tan();
      }
    },
    {
      key: "asin",
      value: function(e) {
        return s(e).asin();
      }
    },
    {
      key: "acos",
      value: function(e) {
        return s(e).acos();
      }
    },
    {
      key: "atan",
      value: function(e) {
        return s(e).atan();
      }
    },
    {
      key: "sinh",
      value: function(e) {
        return s(e).sinh();
      }
    },
    {
      key: "cosh",
      value: function(e) {
        return s(e).cosh();
      }
    },
    {
      key: "tanh",
      value: function(e) {
        return s(e).tanh();
      }
    },
    {
      key: "asinh",
      value: function(e) {
        return s(e).asinh();
      }
    },
    {
      key: "acosh",
      value: function(e) {
        return s(e).acosh();
      }
    },
    {
      key: "atanh",
      value: function(e) {
        return s(e).atanh();
      }
    },
    {
      key: "affordGeometricSeries",
      value: function(e, t, i, a) {
        return this.affordGeometricSeries_core(s(e), s(t), s(i), a);
      }
    },
    {
      key: "sumGeometricSeries",
      value: function(e, t, i, a) {
        return this.sumGeometricSeries_core(e, s(t), s(i), a);
      }
    },
    {
      key: "affordArithmeticSeries",
      value: function(e, t, i, a) {
        return this.affordArithmeticSeries_core(s(e), s(t), s(i), s(a));
      }
    },
    {
      key: "sumArithmeticSeries",
      value: function(e, t, i, a) {
        return this.sumArithmeticSeries_core(s(e), s(t), s(i), s(a));
      }
    },
    {
      key: "efficiencyOfPurchase",
      value: function(e, t, i) {
        return this.efficiencyOfPurchase_core(s(e), s(t), s(i));
      }
    },
    {
      key: "randomDecimalForTesting",
      value: function(e) {
        if (Math.random() * 20 < 1) return c(0, 0, 0);
        var t = Math.random() > 0.5 ? 1 : -1;
        if (Math.random() * 20 < 1) return c(t, 0, 1);
        var i = Math.floor(Math.random() * (e + 1)), a = i === 0 ? Math.random() * 616 - 308 : Math.random() * 16;
        Math.random() > 0.9 && (a = Math.trunc(a));
        var l = Math.pow(10, a);
        return Math.random() > 0.9 && (l = Math.trunc(l)), m(t, i, l);
      }
    },
    {
      key: "affordGeometricSeries_core",
      value: function(e, t, i, a) {
        var l = t.mul(i.pow(a));
        return r2.floor(e.div(l).mul(i.sub(1)).add(1).log10().div(i.log10()));
      }
    },
    {
      key: "sumGeometricSeries_core",
      value: function(e, t, i, a) {
        return t.mul(i.pow(a)).mul(r2.sub(1, i.pow(e))).div(r2.sub(1, i));
      }
    },
    {
      key: "affordArithmeticSeries_core",
      value: function(e, t, i, a) {
        var f = t.add(a.mul(i)).sub(i.div(2)), g = f.pow(2);
        return f.neg().add(g.add(i.mul(e).mul(2)).sqrt()).div(i).floor();
      }
    },
    {
      key: "sumArithmeticSeries_core",
      value: function(e, t, i, a) {
        var l = t.add(a.mul(i));
        return e.div(2).mul(l.mul(2).plus(e.sub(1).mul(i)));
      }
    },
    {
      key: "efficiencyOfPurchase_core",
      value: function(e, t, i) {
        return e.div(t).add(e.div(i));
      }
    },
    {
      key: "slog_critical",
      value: function(e, t) {
        return e > 10 ? t - 1 : r2.critical_section(e, t, we);
      }
    },
    {
      key: "tetrate_critical",
      value: function(e, t) {
        return r2.critical_section(e, t, be);
      }
    },
    {
      key: "critical_section",
      value: function(e, t, i) {
        t *= 10, t < 0 && (t = 0), t > 10 && (t = 10), e < 2 && (e = 2), e > 10 && (e = 10);
        for (var a = 0, l = 0, f = 0; f < _.length; ++f) if (_[f] == e) {
          a = i[f][Math.floor(t)], l = i[f][Math.ceil(t)];
          break;
        } else if (_[f] < e && _[f + 1] > e) {
          var g = (e - _[f]) / (_[f + 1] - _[f]);
          a = i[f][Math.floor(t)] * (1 - g) + i[f + 1][Math.floor(t)] * g, l = i[f][Math.ceil(t)] * (1 - g) + i[f + 1][Math.ceil(t)] * g;
          break;
        }
        var h = t - Math.floor(t);
        return a <= 0 || l <= 0 ? a * (1 - h) + l * h : Math.pow(e, Math.log(a) / Math.log(e) * (1 - h) + Math.log(l) / Math.log(e) * h);
      }
    },
    {
      key: "excess_slog",
      value: function(e, t) {
        var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        e = s(e), t = s(t);
        var a = t;
        if (t = t.toNumber(), t == 1 || t <= 0) return [new r2(r2.dNaN), 0];
        if (t > 1.444667861009766) return [e.slog(t, 100, i), 0];
        var l = r2.ln(t).neg(), f = l.lambertw().div(l), g = r2.dInf;
        if (t > 1 && (g = l.lambertw(false).div(l)), t > 1.444667861009099 && (f = g = r2.fromNumber(Math.E)), e.lt(f)) return [e.slog(t, 100, i), 0];
        if (e.eq(f)) return [new r2(r2.dInf), 0];
        if (e.eq(g)) return [new r2(r2.dNegInf), 2];
        if (e.gt(g)) {
          var h = g.mul(2), v = a.pow(h), u = 0;
          if (e.gte(h) && e.lt(v)) u = 0;
          else if (e.gte(v)) {
            var M = v;
            for (u = 1; M.lt(e); ) if (M = a.pow(M), u = u + 1, M.layer > 3) {
              var x = Math.floor(e.layer - M.layer + 1);
              M = a.iteratedexp(x, M, i), u = u + x;
            }
            M.gt(e) && (M = M.log(t), u = u - 1);
          } else if (e.lt(h)) {
            var w = h;
            for (u = 0; w.gt(e); ) w = w.log(t), u = u - 1;
          }
          for (var o = 0, F = 0, A = 0.5, d = h, S = r2.dZero; A > 1e-16; ) {
            if (F = o + A, d = h.pow(1 - F).mul(v.pow(F)), S = r2.iteratedexp(t, u, d), S.eq(e)) return [new r2(u + F), 2];
            S.lt(e) && (o += A), A /= 2;
          }
          return S.neq_tolerance(e, 1e-7) ? [new r2(r2.dNaN), 0] : [new r2(u + o), 2];
        }
        if (e.lt(g) && e.gt(f)) {
          var p = f.mul(g).sqrt(), q = a.pow(p), I = 0;
          if (e.lte(p) && e.gt(q)) I = 0;
          else if (e.lte(q)) {
            var N = q;
            for (I = 1; N.gt(e); ) N = a.pow(N), I = I + 1;
            N.lt(e) && (N = N.log(t), I = I - 1);
          } else if (e.gt(p)) {
            var y = p;
            for (I = 0; y.lt(e); ) y = y.log(t), I = I - 1;
          }
          for (var V = 0, C = 0, D = 0.5, Y = p, L = r2.dZero; D > 1e-16; ) {
            if (C = V + D, Y = p.pow(1 - C).mul(q.pow(C)), L = r2.iteratedexp(t, I, Y), L.eq(e)) return [new r2(I + C), 1];
            L.gt(e) && (V += D), D /= 2;
          }
          return L.neq_tolerance(e, 1e-7) ? [new r2(r2.dNaN), 0] : [new r2(I + V), 1];
        }
        throw new Error("Unhandled behavior in excess_slog");
      }
    },
    {
      key: "increasingInverse",
      value: function(e) {
        var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 120, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : r2.dLayerMax.neg(), l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : r2.dLayerMax, f = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : r2.dLayerMax.neg(), g = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : r2.dLayerMax;
        return function(h) {
          if (h = new r2(h), a = new r2(a), l = new r2(l), f = new r2(f), g = new r2(g), h.isNan() || l.lt(a) || h.lt(f) || h.gt(g)) return new r2(r2.dNaN);
          var v = function(b) {
            return new r2(b);
          }, u = true;
          if (l.lt(0)) u = false;
          else if (a.gt(0)) u = true;
          else {
            var M = e(r2.dZero);
            if (M.eq(h)) return c(0, 0, 0);
            u = h.gt(M), t && (u = !u);
          }
          var x = u, w;
          if (u) {
            if (l.lt($)) u = true;
            else if (a.gt($)) u = false;
            else {
              var o = e(new r2($));
              u = h.lt(o), t && (u = !u);
            }
            if (u) {
              w = true;
              var F = r2.pow(10, T).recip();
              if (l.lt(F)) u = false;
              else if (a.gt(F)) u = true;
              else {
                var A = e(new r2(F));
                u = h.gt(A), t && (u = !u);
              }
              if (u) v = function(b) {
                return r2.pow(10, b).recip();
              };
              else {
                var d = r2.tetrate(10, T);
                if (l.lt(d)) u = false;
                else if (a.gt(d)) u = true;
                else {
                  var S = e(new r2(d));
                  u = h.gt(S), t && (u = !u);
                }
                u ? v = function(b) {
                  return r2.tetrate(10, new r2(b).toNumber()).recip();
                } : v = function(b) {
                  return new r2(b).gt(Math.log10(Number.MAX_VALUE)) ? r2.dZero : r2.tetrate(10, r2.pow(10, b).toNumber()).recip();
                };
              }
            } else {
              if (w = false, l.lt(T)) u = true;
              else if (a.gt(T)) u = false;
              else {
                var p = e(new r2(T));
                u = h.lt(p), t && (u = !u);
              }
              if (u) v = function(b) {
                return new r2(b);
              };
              else {
                var q = r2.pow(10, T);
                if (l.lt(q)) u = true;
                else if (a.gt(q)) u = false;
                else {
                  var I = e(new r2(q));
                  u = h.lt(I), t && (u = !u);
                }
                if (u) v = function(b) {
                  return r2.pow(10, b);
                };
                else {
                  var N = r2.tetrate(10, T);
                  if (l.lt(N)) u = true;
                  else if (a.gt(N)) u = false;
                  else {
                    var y = e(new r2(N));
                    u = h.lt(y), t && (u = !u);
                  }
                  u ? v = function(b) {
                    return r2.tetrate(10, new r2(b).toNumber());
                  } : v = function(b) {
                    return new r2(b).gt(Math.log10(Number.MAX_VALUE)) ? r2.dInf : r2.tetrate(10, r2.pow(10, b).toNumber());
                  };
                }
              }
            }
          } else {
            if (w = true, l.lt(-$)) u = false;
            else if (a.gt(-$)) u = true;
            else {
              var V = e(new r2(-$));
              u = h.gt(V), t && (u = !u);
            }
            if (u) {
              var C = r2.pow(10, T).recip().neg();
              if (l.lt(C)) u = true;
              else if (a.gt(C)) u = false;
              else {
                var D = e(new r2(C));
                u = h.lt(D), t && (u = !u);
              }
              if (u) v = function(b) {
                return r2.pow(10, b).recip().neg();
              };
              else {
                var Y = r2.tetrate(10, T).neg();
                if (l.lt(Y)) u = true;
                else if (a.gt(Y)) u = false;
                else {
                  var L = e(new r2(Y));
                  u = h.lt(L), t && (u = !u);
                }
                u ? v = function(b) {
                  return r2.tetrate(10, new r2(b).toNumber()).recip().neg();
                } : v = function(b) {
                  return new r2(b).gt(Math.log10(Number.MAX_VALUE)) ? r2.dZero : r2.tetrate(10, r2.pow(10, b).toNumber()).recip().neg();
                };
              }
            } else {
              if (w = false, l.lt(-T)) u = false;
              else if (a.gt(-T)) u = true;
              else {
                var G = e(new r2(-T));
                u = h.gt(G), t && (u = !u);
              }
              if (u) v = function(b) {
                return r2.neg(b);
              };
              else {
                var E = r2.pow(10, T).neg();
                if (l.lt(E)) u = false;
                else if (a.gt(E)) u = true;
                else {
                  var X = e(new r2(E));
                  u = h.gt(X), t && (u = !u);
                }
                if (u) v = function(b) {
                  return r2.pow(10, b).neg();
                };
                else {
                  var Q = r2.tetrate(10, T).neg();
                  if (l.lt(Q)) u = false;
                  else if (a.gt(Q)) u = true;
                  else {
                    var J = e(new r2(Q));
                    u = h.gt(J), t && (u = !u);
                  }
                  u ? v = function(b) {
                    return r2.tetrate(10, new r2(b).toNumber()).neg();
                  } : v = function(b) {
                    return new r2(b).gt(Math.log10(Number.MAX_VALUE)) ? r2.dNegInf : r2.tetrate(10, r2.pow(10, b).toNumber()).neg();
                  };
                }
              }
            }
          }
          for (var Z = x != w != t, re = Z ? function(O, b) {
            return r2.gt(O, b);
          } : function(O, b) {
            return r2.lt(O, b);
          }, W = 1e-3, H = false, te = false, U = 1, P = r2.dOne, B = 0, z = false, R = 1; R < i; ++R) {
            z = false, B = U, P = v(U), P.gt(l) && (P = l, z = true), P.lt(a) && (P = a, z = true);
            var ee = e(P);
            if (ee.eq(h) && !z) break;
            var j = re(ee, h);
            if (R > 1 && te != j && (H = true), te = j, H ? W /= 2 : W *= 2, j != Z && P.eq(l) || j == Z && P.eq(a)) return new r2(r2.dNaN);
            if (W = Math.abs(W) * (j ? -1 : 1), U += W, W === 0 || B == U) break;
          }
          return v(U);
        };
      }
    }
  ]), r2;
})();
k.dZero = c(0, 0, 0);
k.dOne = c(1, 0, 1);
k.dNegOne = c(-1, 0, 1);
k.dTwo = c(1, 0, 2);
k.dTen = c(1, 0, 10);
k.dNaN = c(NaN, NaN, NaN);
k.dInf = c(1, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
k.dNegInf = c(-1, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
k.dNumberMax = m(1, 0, Number.MAX_VALUE);
k.dNumberMin = m(1, 0, Number.MIN_VALUE);
k.dLayerSafeMax = m(1, Number.MAX_SAFE_INTEGER, T - 1);
k.dLayerSafeMin = m(1, Number.MAX_SAFE_INTEGER, -(T - 1));
k.dLayerMax = m(1, Number.MAX_VALUE, T - 1);
k.dLayerMin = m(1, Number.MAX_VALUE, -(T - 1));
k.fromStringCache = new me(de);
s = k.fromValue_noAlloc;
m = k.fromComponents;
c = k.fromComponents_noNormalize;
k.fromMantissaExponent;
k.fromMantissaExponent_noNormalize;
function createNumbersAPI() {
  const numbersAPI = {
    isBigNumber: (value) => {
      if (typeof value === "string" && value.startsWith("BE:")) return true;
      if (value instanceof k) return true;
      if (typeof value === "number" && (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER)) return true;
      return false;
    },
    normalize: (value) => {
      if (value instanceof k) return value;
      if (typeof value === "string" && value.startsWith("BE:")) return new k(value.slice(3));
      return new k(value);
    },
    format: { incremental: (value) => {
      const decimal = value instanceof k ? value : new k(value);
      const suffixes = [
        "",
        "K",
        "M",
        "B",
        "T",
        "Qa",
        "Qi",
        "Sx",
        "Sp",
        "Oc",
        "No",
        "Dc"
      ];
      if (decimal.lt(1e3)) return decimal.toFixed(0);
      const log = decimal.log10();
      const suffixIndex = Math.floor(log / 3);
      if (suffixIndex < suffixes.length) {
        const divisor = k.pow(1e3, suffixIndex);
        return `${decimal.div(divisor).toFixed(2)}${suffixes[suffixIndex]}`;
      }
      return decimal.toExponential(2);
    } },
    calculateGeometricSeriesCost: (baseCost, multiplier, currentQuantity, purchaseAmount) => {
      try {
        const base = new k(baseCost);
        const r2 = new k(multiplier);
        const q = new k(currentQuantity);
        const n = new k(purchaseAmount);
        if (r2.eq(1)) return base.mul(n);
        const numerator = base.mul(r2.pow(q)).mul(r2.pow(n).sub(1));
        const denominator = r2.sub(1);
        return numerator.div(denominator);
      } catch (error) {
        console.error("[RUN] Decimal calculation failed, falling back to regular math:", error);
        const base = Number(baseCost);
        const r2 = Number(multiplier);
        if (r2 === 1) return base * purchaseAmount;
        return base * Math.pow(r2, currentQuantity) * (Math.pow(r2, purchaseAmount) - 1) / (r2 - 1);
      }
    },
    calculateMaxAffordableDecimal: (availableCash, baseCost, multiplier, currentQuantity) => {
      try {
        const cash = new k(availableCash);
        const costOne = numbersAPI.calculateGeometricSeriesCost(baseCost, multiplier, currentQuantity, 1);
        if (cash.lt(costOne)) return 0;
        let low = 1;
        let high = 1;
        while (high < 1e6) {
          if (numbersAPI.calculateGeometricSeriesCost(baseCost, multiplier, currentQuantity, high).gt(cash)) break;
          low = high;
          high *= 2;
        }
        while (low < high) {
          const mid = Math.floor((low + high + 1) / 2);
          if (numbersAPI.calculateGeometricSeriesCost(baseCost, multiplier, currentQuantity, mid).lte(cash)) low = mid;
          else high = mid - 1;
        }
        return low;
      } catch (error) {
        console.error("[RUN] Decimal max affordable calculation failed:", error);
        return Math.floor(Number(availableCash) / Number(baseCost));
      }
    },
    formatDecimalCurrency: (decimalValue) => {
      try {
        if (numbersAPI.isBigNumber(decimalValue)) return `$${numbersAPI.format.incremental(decimalValue)}`;
        return `$${numbersAPI.format.incremental(decimalValue)}`;
      } catch (error) {
        console.error("[RUN] Decimal formatting failed:", error);
        return `$${Number(decimalValue).toLocaleString()}`;
      }
    }
  };
  return numbersAPI;
}
async function initializeNumbers(rundotGameApiInstance) {
  const { createProxiedObject: createProxiedObject2, createProxiedMethod: createProxiedMethod2 } = await Promise.resolve().then(() => (init_core_CUZ70pdB(), core_CUZ70pdB_exports));
  const numbersAPI = createNumbersAPI();
  rundotGameApiInstance.numbers = createProxiedObject2.call(rundotGameApiInstance, "numbers", {
    isBigNumber: numbersAPI.isBigNumber,
    normalize: numbersAPI.normalize,
    format: { incremental: numbersAPI.format.incremental },
    calculateGeometricSeriesCost: numbersAPI.calculateGeometricSeriesCost,
    calculateMaxAffordableDecimal: numbersAPI.calculateMaxAffordableDecimal,
    formatDecimalCurrency: numbersAPI.formatDecimalCurrency,
    Decimal: k
  });
}
function initializeContext(rundotGameApi, host) {
  rundotGameApi.context = host.context || {
    initializeAsleep: false,
    launchParams: {},
    shareParams: {},
    notificationParams: {}
  };
  host.onNotificationParamsUpdate?.((params) => {
    if (rundotGameApi.context) rundotGameApi.context.notificationParams = params;
  });
  host.notifyNotificationParamsSubscribeReady?.();
}
function initializeMultiplayerApi(rundotGameApi, host) {
  rundotGameApi.realtime = host.multiplayer;
}
var HOST_MOUNT_PARAM = "_pid";
function mountParams(win) {
  try {
    return new URLSearchParams(win.location?.search ?? "");
  } catch {
    return null;
  }
}
function isInsideHostedEnvironment(win) {
  if (!win) return false;
  const params = mountParams(win);
  if (params?.get("forceLocal") === "true") return false;
  if (typeof win.ReactNativeWebView !== "undefined") return true;
  return params?.has(HOST_MOUNT_PARAM) === true;
}
var HEARTBEAT_INTERVAL_MS = 1e4;
var BYTES_PER_MB = 1048576;
var LIFECYCLE_PAUSE_TYPES = /* @__PURE__ */ new Set(["SLEEP", "PAUSE"]);
var LIFECYCLE_RESUME_TYPES = /* @__PURE__ */ new Set(["AWAKE", "RESUME"]);
function getPerformanceMemory() {
  if (typeof performance !== "undefined" && "memory" in performance && performance.memory != null) return performance.memory;
  return null;
}
function bytesToMB(bytes) {
  return Math.round(bytes / BYTES_PER_MB * 100) / 100;
}
function getDomNodeCount() {
  if (typeof document !== "undefined") return document.getElementsByTagName("*").length;
  return null;
}
var PostMessageHeartbeatTransport = class {
  instanceId;
  constructor(instanceId) {
    this.instanceId = instanceId;
  }
  sendHeartbeat(payload) {
    const cfg = typeof window !== "undefined" && window.__rundotConfig || null;
    const nonce = cfg && cfg.nonce || "";
    const parentOrigin = cfg && cfg.parentOrigin || "*";
    const message = JSON.stringify({
      type: "H5_HEARTBEAT",
      direction: "H5_TO_APP",
      data: payload,
      instanceId: this.instanceId,
      timestamp: Date.now(),
      ...nonce ? { nonce } : {}
    });
    try {
      const rn = window.ReactNativeWebView;
      if (rn) rn.postMessage(message);
      else window.parent.postMessage(message, parentOrigin);
    } catch (_2) {
    }
  }
};
var HeartbeatService = class {
  transport;
  startTime = Date.now();
  intervalId = null;
  rafId = null;
  frameCount = 0;
  lastTickTime = Date.now();
  running = false;
  onMessage;
  constructor(transport) {
    this.transport = transport;
    this.onMessage = (event) => {
      const cfg = typeof window !== "undefined" && window.__rundotConfig || null;
      const expectedParentOrigin = cfg && cfg.parentOrigin || "";
      const expectedNonce = cfg && cfg.nonce || "";
      if (!(event.origin === "" && event.source == null)) {
        if (expectedParentOrigin && event.origin !== expectedParentOrigin) return;
        if (typeof window !== "undefined" && event.source !== window.parent) return;
      }
      let type;
      let nonce;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        type = data?.type;
        nonce = data?.nonce;
      } catch {
        return;
      }
      if (!type) return;
      if (expectedNonce && nonce !== expectedNonce) return;
      if (LIFECYCLE_PAUSE_TYPES.has(type)) this.pause();
      else if (LIFECYCLE_RESUME_TYPES.has(type)) this.resume();
      else if (type === "QUIT") this.stop();
    };
  }
  attach() {
    if (typeof window !== "undefined") window.addEventListener("message", this.onMessage);
  }
  start() {
    if (this.running) return;
    this.running = true;
    this.lastTickTime = Date.now();
    this.frameCount = 0;
    this.startRafLoop();
    this.intervalId = setInterval(() => this.tick(), HEARTBEAT_INTERVAL_MS);
  }
  stop() {
    this.running = false;
    this.stopInterval();
    this.stopRafLoop();
    if (typeof window !== "undefined") window.removeEventListener("message", this.onMessage);
  }
  isRunning() {
    return this.running;
  }
  collect() {
    const now = Date.now();
    const elapsedSinceLastTick = now - this.lastTickTime;
    let fps = null;
    if (elapsedSinceLastTick > 0 && this.frameCount > 0) fps = Math.round(this.frameCount / (elapsedSinceLastTick / 1e3) * 10) / 10;
    const mem = getPerformanceMemory();
    return {
      uptimeMs: now - this.startTime,
      heapUsedMB: mem ? bytesToMB(mem.usedJSHeapSize) : null,
      heapTotalMB: mem ? bytesToMB(mem.totalJSHeapSize) : null,
      heapLimitMB: mem ? bytesToMB(mem.jsHeapSizeLimit) : null,
      fps,
      domNodeCount: getDomNodeCount()
    };
  }
  tick() {
    const payload = this.collect();
    this.frameCount = 0;
    this.lastTickTime = Date.now();
    try {
      this.transport.sendHeartbeat(payload);
    } catch (_2) {
    }
  }
  pause() {
    this.stopInterval();
    this.stopRafLoop();
  }
  resume() {
    if (this.running) {
      this.lastTickTime = Date.now();
      this.frameCount = 0;
      this.startRafLoop();
      if (this.intervalId == null) this.intervalId = setInterval(() => this.tick(), HEARTBEAT_INTERVAL_MS);
    } else this.start();
  }
  startRafLoop() {
    if (this.rafId != null) return;
    if (typeof requestAnimationFrame === "undefined") return;
    const loop = () => {
      this.frameCount++;
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
  stopRafLoop() {
    if (this.rafId != null && typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }
  stopInterval() {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
};
var HapticStyle = {
  LIGHT: "light",
  MEDIUM: "medium",
  HEAVY: "heavy",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error"
};
var RundotGameAPI$1 = class {
  constructor() {
    this._shared = {
      initialized: false,
      initPromise: null
    };
    this._bootstrap = {
      apiInjected: false,
      apiInjectionTimeout: null,
      rundotGame: null,
      isInsideHostedEnvironment: false,
      _localHandlers: {},
      _pendingMessages: []
    };
    const deterministicInstanceId = this._generateDeterministicInstanceId();
    this._mock = {
      appId: "mock-app",
      mode: "preview",
      instanceId: deterministicInstanceId,
      appUrl: "mock-app/index.html",
      safeAreaInsets: {
        top: 10,
        right: 0,
        bottom: 10,
        left: 0
      },
      environment: {
        isDevelopment: true,
        platform: "web",
        platformVersion: "mock-1.0",
        browserInfo: {
          browser: "MockBrowser",
          userAgent: navigator.userAgent,
          isMobile: /Mobi|Android/i.test(navigator.userAgent),
          isTablet: /iPad|Tablet|Pad/i.test(navigator.userAgent),
          language: navigator.language || "en-US"
        }
      },
      device: {
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        viewportSize: {
          width: window.innerWidth - 20,
          height: window.innerHeight - 20
        },
        orientation: window.innerWidth > window.innerHeight ? "landscape" : "portrait",
        pixelRatio: window.devicePixelRatio || 1,
        fontScale: 1,
        deviceType: window.innerWidth > 768 ? "tablet" : "phone",
        platform: "web",
        isWeb: true,
        isMobile: /Mobi|Android/i.test(navigator.userAgent),
        hapticsEnabled: false,
        haptics: {
          supported: false,
          enabled: false
        }
      },
      context: {
        postData: void 0,
        stack: {
          isInStack: false,
          stackPosition: 0,
          parentInstanceId: void 0
        }
      },
      handlers: {
        onPlay: null,
        onPause: null,
        onResume: null,
        onQuit: null,
        onHide: null,
        onShow: null
      },
      platformOverrides: {
        isMobile: true,
        isWeb: false
      }
    };
    if (typeof window !== "undefined" && window.__RUNDOT_GAME_MOCK__) Object.assign(this._mock, window.__RUNDOT_GAME_MOCK__);
    this._detectHostedEnvironment();
    this.config = createProxiedObject.call(this, "config", {});
    const originalConfig = this.config;
    this.config = new Proxy(originalConfig, {
      get(target, prop) {
        if (prop === "locale") throw new Error("Use RundotGameAPI.getLocale() instead.");
        if (prop === "languageCode") throw new Error("Use RundotGameAPI.getLanguageCode() instead.");
        if (prop === "user") throw new Error("Use RundotGameAPI.getLocale() and RundotGameAPI.getLanguageCode() instead.");
        if (prop === "device") throw new Error("Use RundotGameAPI.system.getDevice() instead.");
        if (prop === "environment") throw new Error("Use RundotGameAPI.system.getEnvironment() instead.");
        if (prop === "profile") throw new Error("Use RundotGameAPI.getProfile() instead.");
        if (prop === "rooms") throw new Error("Rooms configuration is internal. Realtime (RundotGameAPI.realtime) is the supported multiplayer API.");
        if (prop === "ui") return new Proxy({}, { get(uiTarget, uiProp) {
          if (uiProp === "safeArea") throw new Error("Use RundotGameAPI.system.getSafeArea() instead.");
          if (uiProp === "hudInsets") throw new Error("Use RundotGameAPI.system.getSafeArea() instead.");
          if (uiProp === "controls") throw new Error("UI controls are no longer supported.");
          throw new Error(`RundotGameAPI.config.ui.${uiProp} is not supported.`);
        } });
        return target[prop];
      },
      set(target, prop, value) {
        if (prop === "locale" || prop === "languageCode" || prop === "user" || prop === "device" || prop === "environment" || prop === "profile") throw new Error(`RundotGameAPI.config.${prop} cannot be set. Configuration is read-only.`);
        if (prop === "ui") {
          console.warn("[RUN] Cannot set config.ui");
          return true;
        }
        target[prop] = value;
        return true;
      },
      has(target, prop) {
        if (prop === "ui") return false;
        return prop in target;
      },
      ownKeys(target) {
        return Reflect.ownKeys(target).filter((key) => key !== "ui");
      },
      getOwnPropertyDescriptor(target, prop) {
        if (prop === "ui") return;
        return Reflect.getOwnPropertyDescriptor(target, prop);
      }
    });
    this._hostPromise = this._createHostAsync();
    initializeAssetLoader(this, createProxiedMethod);
    this.getLocale = () => {
      if (this._localeData) return this._localeData;
      if (typeof navigator !== "undefined" && navigator.language) return navigator.language;
      return "en-US";
    };
    this.getLanguageCode = () => {
      if (this._languageCodeData) return this._languageCodeData;
      return this.getLocale().split("-")[0];
    };
  }
  _generateDeterministicInstanceId() {
    try {
      let normalizedUrl = (window.location.href || "").replace(/^https?:\/\/[^\/]+/, "");
      normalizedUrl = normalizedUrl.split("?")[0].split("#")[0].trim();
      if (!normalizedUrl.startsWith("/H5/") && !normalizedUrl.startsWith("H5/")) {
        if (!normalizedUrl.includes("/")) normalizedUrl = `/H5/${normalizedUrl}/index.html`;
        else if (!normalizedUrl.startsWith("/")) normalizedUrl = `/${normalizedUrl}`;
      }
      let hash = 0;
      for (let i = 0; i < normalizedUrl.length; i++) {
        const char = normalizedUrl.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return `app-${Math.abs(hash).toString(36).substring(0, 8).padEnd(8, "0")}`;
    } catch (error) {
      console.error("[RUN] Error generating deterministic ID, falling back to random:", error);
      return "app-" + Math.random().toString(36).substr(2, 8);
    }
  }
  _detectHostedEnvironment() {
    this._bootstrap.isInsideHostedEnvironment = isInsideHostedEnvironment(typeof window !== "undefined" ? window : void 0);
  }
  /**
  * Create and initialize the Host asynchronously.
  *
  * This is async because createHost uses dynamic import for PlaygroundHost,
  * which prevents Firebase from being bundled in production builds.
  */
  async _createHostAsync() {
    const isInsideHostedEnv = this._bootstrap.isInsideHostedEnvironment;
    const host = await createHost(this, !isInsideHostedEnv);
    this.host = host;
    initializeStorage(this, host);
    initializeRoomsApi(this, host);
    initializeAds(this, host);
    initializePopups(this, host);
    initializeAnalytics(this, host);
    initializeIap(this, host);
    initializeCredits(this, host);
    initializeLeaderboard(this, host);
    initializeUgc(this, host);
    initializeLocalNotifications(this, host);
    initializePreloader(this, host);
    initializeTime(this, host);
    initializeLifecycleApi(this, host);
    initializeHaptics(this, host);
    initializeGamepad(this, host);
    initializeCdn(this, host);
    initializeFeaturesApi(this, host);
    initializeLoggingApi(this, host);
    const isAvatar3dDisabled = typeof window !== "undefined" && window.location.search.includes("EXPO_PUBLIC_DISABLE_3D_AVATARS=true");
    initializeProfile(this, host);
    initializeSystem(this, host);
    if (!isAvatar3dDisabled) initializeAvatar3d(this, host);
    initializeStackNavigation(this, host);
    initializeTextGen(this, host);
    initializeAi(this, host);
    initializeImageGen(this, host);
    initializeAudioGen(this, host);
    initializeVideoGen(this, host);
    initializeFiles(this, host);
    initializeClips(this, host);
    initializeSpriteGen(this, host);
    initializeThreeDGen(this, host);
    initializeSimulation(this, host);
    initializeLiveOps(this, host);
    initializeSocial(this, host);
    initializeEntitlements(this, host);
    initializeChoices(this, host);
    initializeStats(this, host);
    initializeCollectibles(this, host);
    initializeShop(this, host);
    initializeAccessGate(this, host);
    initializeMultiplayerApi(this, host);
    initializeVideo(this, host);
    initializeActivity(this, host);
    initializeApp(this, host);
    initializeAttribution(this, host);
    initializeAssetLibrary(this, host);
    initializePlayable(this, host);
    return host;
  }
  /**
  * @deprecated No longer need to call this method. This will get called on import.
  */
  async initializeAsync() {
    if (this._shared.initialized) return Promise.resolve(this.host.context);
    if (this._shared.initPromise) return this._shared.initPromise;
    this._shared.initPromise = new Promise(async (resolve, reject) => {
      try {
        await this._hostPromise;
        const result = await this.host.initialize();
        initializeContext(this, this.host);
        const heartbeat = new HeartbeatService(new PostMessageHeartbeatTransport(this.host.instanceId));
        heartbeat.attach();
        if (!result.initializeAsleep) heartbeat.start();
        this._shared.initialized = true;
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
    return this._shared.initPromise;
  }
};
var instance = new RundotGameAPI$1();
window.RundotGameAPI = instance;
instance.HapticStyle = HapticStyle;
instance.isAvailable = function() {
  try {
    return !!(typeof window !== "undefined" && window.RundotGameAPI) || !!this;
  } catch {
    return false;
  }
};
try {
  await initializeNumbers(instance);
} catch (error) {
  console.error("[RUN] Failed to initialize numbers system:", error);
}
try {
  await instance.initializeAsync();
  instance.log(`[RUN] v${SDK_VERSION} initialized.`);
} catch (error) {
  console.error("[RUN] Failed to initialize RUN.world SDK:", error);
}

// scripts/rundot-ads-entry.mjs
function isRunHost() {
  try {
    if (typeof window === "undefined") return false;
    let params = null;
    try {
      params = new URLSearchParams(window.location.search || "");
    } catch (_2) {
    }
    if (params && params.get("forceLocal") === "true") return false;
    const boot = instance && instance._bootstrap;
    const hosted = typeof window.ReactNativeWebView !== "undefined" || (params ? params.has("_pid") : false) || !!(boot && boot.isInsideHostedEnvironment === true);
    if (!hosted) return false;
    if (instance && typeof instance.isMock === "function" && instance.isMock() === true) return false;
    return true;
  } catch (_2) {
    return false;
  }
}
function adsApi() {
  try {
    if (!isRunHost()) return null;
    return instance && instance.ads ? instance.ads : null;
  } catch (_2) {
    return null;
  }
}
function analyticsApi() {
  try {
    return instance && instance.analytics ? instance.analytics : null;
  } catch (_2) {
    return null;
  }
}
function catchVoid(result) {
  try {
    if (result != null && typeof result.then === "function" && typeof result.catch === "function") {
      result.catch(function() {
      });
    }
  } catch (_2) {
  }
}
var ScrapAnalytics = {
  available: true,
  isRunHost,
  recordCustomEvent(name, payload) {
    try {
      const a = analyticsApi();
      if (!a || typeof a.recordCustomEvent !== "function") return;
      catchVoid(a.recordCustomEvent(name, payload || {}));
    } catch (_2) {
    }
  },
  trackFunnelStep(step, name, funnel, funnelOrder) {
    try {
      const a = analyticsApi();
      if (!a || typeof a.trackFunnelStep !== "function") return;
      catchVoid(a.trackFunnelStep(step, name, funnel, funnelOrder));
    } catch (_2) {
    }
  }
};
var ScrapAds = {
  available: true,
  isRunHost,
  async isRewardedReady() {
    try {
      const ads = adsApi();
      if (!ads || typeof ads.isRewardedAdReadyAsync !== "function") return false;
      return !!await ads.isRewardedAdReadyAsync();
    } catch (_2) {
      return false;
    }
  },
  async showRewarded(options) {
    try {
      const ads = adsApi();
      if (!ads || typeof ads.showRewardedAdAsync !== "function") return false;
      const ready = await ScrapAds.isRewardedReady();
      if (!ready) return false;
      const earned = await ads.showRewardedAdAsync(options || {
        adDisplayId: "rewarded",
        adDisplayName: "Rewarded"
      });
      return !!earned;
    } catch (_2) {
      return false;
    }
  },
  async showInterstitial(options) {
    try {
      const ads = adsApi();
      if (!ads || typeof ads.showInterstitialAd !== "function") return false;
      if (typeof ads.isInterstitialAdReadyAsync === "function") {
        const ready = await ads.isInterstitialAdReadyAsync();
        if (!ready) return false;
      }
      const shown = await ads.showInterstitialAd(options || {
        adDisplayId: "sector_transition",
        adDisplayName: "Sector Transition"
      });
      return !!shown;
    } catch (_2) {
      return false;
    }
  }
};
try {
  window.ScrapAds = ScrapAds;
  window.ScrapAnalytics = ScrapAnalytics;
  window.RundotGameAPI = instance;
} catch (_2) {
}
var rundot_ads_entry_default = ScrapAds;
export {
  rundot_ads_entry_default as default
};
/*! Bundled license information:

@series-inc/rundot-game-sdk/dist/dist-DxOnYUkS.js:
  (*! Bundled license information:
  
  react/cjs/react.production.min.js:
  (**
  * @license React
  * react.production.min.js
  *
  * Copyright (c) Facebook, Inc. and its affiliates.
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE file in the root directory of this source tree.
  *)
  
  react/cjs/react.development.js:
  (**
  * @license React
  * react.development.js
  *
  * Copyright (c) Facebook, Inc. and its affiliates.
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE file in the root directory of this source tree.
  *)
  *)
*/
