!(function(t, e) {
  typeof exports === "object" && typeof module === "object"
    ? (module.exports = e())
    : typeof define === "function" && define.amd
    ? define([], e)
    : typeof exports === "object"
    ? (exports.Handlebars = e())
    : (t.Handlebars = e());
})(this, function() {
  return (function(t) {
    function e(s) {
      if (r[s]) return r[s].exports;
      const i = (r[s] = { exports: {}, id: s, loaded: !1 });
      return t[s].call(i.exports, i, i.exports, e), (i.loaded = !0), i.exports;
    }
    var r = {};
    return (e.m = t), (e.c = r), (e.p = ""), e(0);
  })([
    function(t, e, r) {
      function s() {
        const t = v();
        return (
          (t.compile = function(e, r) {
            return l.compile(e, r, t);
          }),
          (t.precompile = function(e, r) {
            return l.precompile(e, r, t);
          }),
          (t.AST = c.default),
          (t.Compiler = l.Compiler),
          (t.JavaScriptCompiler = u.default),
          (t.Parser = h.parser),
          (t.parse = h.parse),
          t
        );
      }
      const i = r(1).default;
      e.__esModule = !0;
      const a = r(2);
      const n = i(a);
      const o = r(21);
      var c = i(o);
      var h = r(22);
      var l = r(27);
      const p = r(28);
      var u = i(p);
      const f = r(25);
      const d = i(f);
      const m = r(20);
      const g = i(m);
      var v = n.default.create;
      const y = s();
      (y.create = s),
        g.default(y),
        (y.Visitor = d.default),
        (y.default = y),
        (e.default = y),
        (t.exports = e.default);
    },
    function(t, e) {
      (e.default = function(t) {
        return t && t.__esModule ? t : { default: t };
      }),
        (e.__esModule = !0);
    },
    function(t, e, r) {
      function s() {
        const t = new o.HandlebarsEnvironment();
        return (
          f.extend(t, o),
          (t.SafeString = h.default),
          (t.Exception = p.default),
          (t.Utils = f),
          (t.escapeExpression = f.escapeExpression),
          (t.VM = m),
          (t.template = function(e) {
            return m.template(e, t);
          }),
          t
        );
      }
      const i = r(3).default;
      const a = r(1).default;
      e.__esModule = !0;
      const n = r(4);
      var o = i(n);
      const c = r(18);
      var h = a(c);
      const l = r(6);
      var p = a(l);
      const u = r(5);
      var f = i(u);
      const d = r(19);
      var m = i(d);
      const g = r(20);
      const v = a(g);
      const y = s();
      (y.create = s),
        v.default(y),
        (y.default = y),
        (e.default = y),
        (t.exports = e.default);
    },
    function(t, e) {
      (e.default = function(t) {
        if (t && t.__esModule) return t;
        const e = {};
        if (t != null)
          for (const r in t)
            Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
        return (e.default = t), e;
      }),
        (e.__esModule = !0);
    },
    function(t, e, r) {
      function s(t, e, r) {
        (this.helpers = t || {}),
          (this.partials = e || {}),
          (this.decorators = r || {}),
          c.registerDefaultHelpers(this),
          h.registerDefaultDecorators(this);
      }
      const i = r(1).default;
      (e.__esModule = !0), (e.HandlebarsEnvironment = s);
      const a = r(5);
      const n = r(6);
      const o = i(n);
      var c = r(7);
      var h = r(15);
      const l = r(17);
      const p = i(l);
      const u = "4.0.5";
      e.VERSION = u;
      const f = 7;
      e.COMPILER_REVISION = f;
      const d = {
        1: "<= 1.0.rc.2",
        2: "== 1.0.0-rc.3",
        3: "== 1.0.0-rc.4",
        4: "== 1.x.x",
        5: "== 2.0.0-alpha.x",
        6: ">= 2.0.0-beta.1",
        7: ">= 4.0.0",
      };
      e.REVISION_CHANGES = d;
      const m = "[object Object]";
      s.prototype = {
        constructor: s,
        logger: p.default,
        log: p.default.log,
        registerHelper(t, e) {
          if (a.toString.call(t) === m) {
            if (e)
              throw new o.default("Arg not supported with multiple helpers");
            a.extend(this.helpers, t);
          } else this.helpers[t] = e;
        },
        unregisterHelper(t) {
          delete this.helpers[t];
        },
        registerPartial(t, e) {
          if (a.toString.call(t) === m) a.extend(this.partials, t);
          else {
            if (typeof e === "undefined")
              throw new o.default(
                `Attempting to register a partial called "${t}" as undefined`,
              );
            this.partials[t] = e;
          }
        },
        unregisterPartial(t) {
          delete this.partials[t];
        },
        registerDecorator(t, e) {
          if (a.toString.call(t) === m) {
            if (e)
              throw new o.default("Arg not supported with multiple decorators");
            a.extend(this.decorators, t);
          } else this.decorators[t] = e;
        },
        unregisterDecorator(t) {
          delete this.decorators[t];
        },
      };
      const g = p.default.log;
      (e.log = g), (e.createFrame = a.createFrame), (e.logger = p.default);
    },
    function(t, e) {
      function r(t) {
        return l[t];
      }
      function s(t) {
        for (let e = 1; e < arguments.length; e++)
          for (const r in arguments[e])
            Object.prototype.hasOwnProperty.call(arguments[e], r) &&
              (t[r] = arguments[e][r]);
        return t;
      }
      function i(t, e) {
        for (let r = 0, s = t.length; r < s; r++) if (t[r] === e) return r;
        return -1;
      }
      function a(t) {
        if (typeof t !== "string") {
          if (t && t.toHTML) return t.toHTML();
          if (t == null) return "";
          if (!t) return `${t}`;
          t = `${t}`;
        }
        return u.test(t) ? t.replace(p, r) : t;
      }
      function n(t) {
        return (!t && t !== 0) || !(!m(t) || t.length !== 0);
      }
      function o(t) {
        const e = s({}, t);
        return (e._parent = t), e;
      }
      function c(t, e) {
        return (t.path = e), t;
      }
      function h(t, e) {
        return (t ? `${t}.` : "") + e;
      }
      (e.__esModule = !0),
        (e.extend = s),
        (e.indexOf = i),
        (e.escapeExpression = a),
        (e.isEmpty = n),
        (e.createFrame = o),
        (e.blockParams = c),
        (e.appendContextPath = h);
      var l = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;",
        "=": "&#x3D;",
      };
      var p = /[&<>"'`=]/g;
      var u = /[&<>"'`=]/;
      const f = Object.prototype.toString;
      e.toString = f;
      let d = function(t) {
        return typeof t === "function";
      };
      d(/x/) &&
        (e.isFunction = d = function(t) {
          return typeof t === "function" && f.call(t) === "[object Function]";
        }),
        (e.isFunction = d);
      var m =
        Array.isArray ||
        function(t) {
          return (
            !(!t || typeof t !== "object") && f.call(t) === "[object Array]"
          );
        };
      e.isArray = m;
    },
    function(t, e) {
      function r(t, e) {
        const i = e && e.loc;
        let a = void 0;
        let n = void 0;
        i && ((a = i.start.line), (n = i.start.column), (t += ` - ${a}:${n}`));
        for (
          let o = Error.prototype.constructor.call(this, t), c = 0;
          c < s.length;
          c++
        )
          this[s[c]] = o[s[c]];
        Error.captureStackTrace && Error.captureStackTrace(this, r),
          i && ((this.lineNumber = a), (this.column = n));
      }
      e.__esModule = !0;
      var s = [
        "description",
        "fileName",
        "lineNumber",
        "message",
        "name",
        "number",
        "stack",
      ];
      (r.prototype = new Error()), (e.default = r), (t.exports = e.default);
    },
    function(t, e, r) {
      function s(t) {
        n.default(t),
          c.default(t),
          l.default(t),
          u.default(t),
          d.default(t),
          g.default(t),
          y.default(t);
      }
      const i = r(1).default;
      (e.__esModule = !0), (e.registerDefaultHelpers = s);
      const a = r(8);
      var n = i(a);
      const o = r(9);
      var c = i(o);
      const h = r(10);
      var l = i(h);
      const p = r(11);
      var u = i(p);
      const f = r(12);
      var d = i(f);
      const m = r(13);
      var g = i(m);
      const v = r(14);
      var y = i(v);
    },
    function(t, e, r) {
      e.__esModule = !0;
      const s = r(5);
      (e.default = function(t) {
        t.registerHelper("blockHelperMissing", function(e, r) {
          const i = r.inverse;
          const a = r.fn;
          if (e === !0) return a(this);
          if (e === !1 || e == null) return i(this);
          if (s.isArray(e))
            return e.length > 0
              ? (r.ids && (r.ids = [r.name]), t.helpers.each(e, r))
              : i(this);
          if (r.data && r.ids) {
            const n = s.createFrame(r.data);
            (n.contextPath = s.appendContextPath(r.data.contextPath, r.name)),
              (r = { data: n });
          }
          return a(e, r);
        });
      }),
        (t.exports = e.default);
    },
    function(t, e, r) {
      const s = r(1).default;
      e.__esModule = !0;
      const i = r(5);
      const a = r(6);
      const n = s(a);
      (e.default = function(t) {
        t.registerHelper("each", function(t, e) {
          function r(e, r, a) {
            h &&
              ((h.key = e),
              (h.index = r),
              (h.first = r === 0),
              (h.last = !!a),
              l && (h.contextPath = l + e)),
              (c += s(t[e], {
                data: h,
                blockParams: i.blockParams([t[e], e], [l + e, null]),
              }));
          }
          if (!e) throw new n.default("Must pass iterator to #each");
          var s = e.fn;
          const a = e.inverse;
          let o = 0;
          var c = "";
          var h = void 0;
          var l = void 0;
          if (
            (e.data &&
              e.ids &&
              (l = `${i.appendContextPath(e.data.contextPath, e.ids[0])}.`),
            i.isFunction(t) && (t = t.call(this)),
            e.data && (h = i.createFrame(e.data)),
            t && typeof t === "object")
          )
            if (i.isArray(t))
              for (let p = t.length; o < p; o++)
                o in t && r(o, o, o === t.length - 1);
            else {
              let u = void 0;
              for (const f in t)
                t.hasOwnProperty(f) &&
                  (void 0 !== u && r(u, o - 1), (u = f), o++);
              void 0 !== u && r(u, o - 1, !0);
            }
          return o === 0 && (c = a(this)), c;
        });
      }),
        (t.exports = e.default);
    },
    function(t, e, r) {
      const s = r(1).default;
      e.__esModule = !0;
      const i = r(6);
      const a = s(i);
      (e.default = function(t) {
        t.registerHelper("helperMissing", function() {
          if (arguments.length !== 1)
            throw new a.default(
              `Missing helper: "${arguments[arguments.length - 1].name}"`,
            );
        });
      }),
        (t.exports = e.default);
    },
    function(t, e, r) {
      e.__esModule = !0;
      const s = r(5);
      (e.default = function(t) {
        t.registerHelper("if", function(t, e) {
          return (
            s.isFunction(t) && (t = t.call(this)),
            (!e.hash.includeZero && !t) || s.isEmpty(t)
              ? e.inverse(this)
              : e.fn(this)
          );
        }),
          t.registerHelper("unless", function(e, r) {
            return t.helpers.if.call(this, e, {
              fn: r.inverse,
              inverse: r.fn,
              hash: r.hash,
            });
          });
      }),
        (t.exports = e.default);
    },
    function(t, e) {
      (e.__esModule = !0),
        (e.default = function(t) {
          t.registerHelper("log", function() {
            for (
              var e = [void 0], r = arguments[arguments.length - 1], s = 0;
              s < arguments.length - 1;
              s++
            )
              e.push(arguments[s]);
            let i = 1;
            r.hash.level != null
              ? (i = r.hash.level)
              : r.data && r.data.level != null && (i = r.data.level),
              (e[0] = i),
              t.log.apply(t, e);
          });
        }),
        (t.exports = e.default);
    },
    function(t, e) {
      (e.__esModule = !0),
        (e.default = function(t) {
          t.registerHelper("lookup", function(t, e) {
            return t && t[e];
          });
        }),
        (t.exports = e.default);
    },
    function(t, e, r) {
      e.__esModule = !0;
      const s = r(5);
      (e.default = function(t) {
        t.registerHelper("with", function(t, e) {
          s.isFunction(t) && (t = t.call(this));
          const r = e.fn;
          if (s.isEmpty(t)) return e.inverse(this);
          let i = e.data;
          return (
            e.data &&
              e.ids &&
              ((i = s.createFrame(e.data)),
              (i.contextPath = s.appendContextPath(
                e.data.contextPath,
                e.ids[0],
              ))),
            r(t, {
              data: i,
              blockParams: s.blockParams([t], [i && i.contextPath]),
            })
          );
        });
      }),
        (t.exports = e.default);
    },
    function(t, e, r) {
      function s(t) {
        n.default(t);
      }
      const i = r(1).default;
      (e.__esModule = !0), (e.registerDefaultDecorators = s);
      const a = r(16);
      var n = i(a);
    },
    function(t, e, r) {
      e.__esModule = !0;
      const s = r(5);
      (e.default = function(t) {
        t.registerDecorator("inline", function(t, e, r, i) {
          let a = t;
          return (
            e.partials ||
              ((e.partials = {}),
              (a = function(i, a) {
                const n = r.partials;
                r.partials = s.extend({}, n, e.partials);
                const o = t(i, a);
                return (r.partials = n), o;
              })),
            (e.partials[i.args[0]] = i.fn),
            a
          );
        });
      }),
        (t.exports = e.default);
    },
    function(t, e, r) {
      e.__esModule = !0;
      const s = r(5);
      var i = {
        methodMap: ["debug", "info", "warn", "error"],
        level: "info",
        lookupLevel(t) {
          if (typeof t === "string") {
            const e = s.indexOf(i.methodMap, t.toLowerCase());
            t = e >= 0 ? e : parseInt(t, 10);
          }
          return t;
        },
        log(t) {
          if (
            ((t = i.lookupLevel(t)),
            typeof console !== "undefined" && i.lookupLevel(i.level) <= t)
          ) {
            let e = i.methodMap[t];
            console[e] || (e = "log");
            for (
              var r = arguments.length, s = Array(r > 1 ? r - 1 : 0), a = 1;
              a < r;
              a++
            )
              s[a - 1] = arguments[a];
            console[e].apply(console, s);
          }
        },
      };
      (e.default = i), (t.exports = e.default);
    },
    function(t, e) {
      function r(t) {
        this.string = t;
      }
      (e.__esModule = !0),
        (r.prototype.toString = r.prototype.toHTML = function() {
          return `${this.string}`;
        }),
        (e.default = r),
        (t.exports = e.default);
    },
    function(t, e, r) {
      function s(t) {
        const e = (t && t[0]) || 1;
        const r = v.COMPILER_REVISION;
        if (e !== r) {
          if (e < r) {
            const s = v.REVISION_CHANGES[r];
            const i = v.REVISION_CHANGES[e];
            throw new g.default(
              `Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (${s}) or downgrade your runtime to an older version (${i}).`,
            );
          }
          throw new g.default(
            `Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (${
              t[1]
            }).`,
          );
        }
      }
      function i(t, e) {
        function r(r, s, i) {
          i.hash && ((s = d.extend({}, s, i.hash)), i.ids && (i.ids[0] = !0)),
            (r = e.VM.resolvePartial.call(this, r, s, i));
          let a = e.VM.invokePartial.call(this, r, s, i);
          if (
            (a == null &&
              e.compile &&
              ((i.partials[i.name] = e.compile(r, t.compilerOptions, e)),
              (a = i.partials[i.name](s, i))),
            a != null)
          ) {
            if (i.indent) {
              for (
                var n = a.split("\n"), o = 0, c = n.length;
                o < c && (n[o] || o + 1 !== c);
                o++
              )
                n[o] = i.indent + n[o];
              a = n.join("\n");
            }
            return a;
          }
          throw new g.default(
            `The partial ${i.name} could not be compiled when running in runtime-only mode`,
          );
        }
        function s(e) {
          function r(e) {
            return `${t.main(i, e, i.helpers, i.partials, n, c, o)}`;
          }
          const a =
            arguments.length <= 1 || void 0 === arguments[1]
              ? {}
              : arguments[1];
          var n = a.data;
          s._setup(a), !a.partial && t.useData && (n = h(e, n));
          var o = void 0;
          var c = t.useBlockParams ? [] : void 0;
          return (
            t.useDepths &&
              (o = a.depths
                ? e !== a.depths[0]
                  ? [e].concat(a.depths)
                  : a.depths
                : [e]),
            (r = l(t.main, r, i, a.depths || [], n, c))(e, a)
          );
        }
        if (!e) throw new g.default("No environment passed to template");
        if (!t || !t.main)
          throw new g.default(`Unknown template object: ${typeof t}`);
        (t.main.decorator = t.main_d), e.VM.checkRevision(t.compiler);
        var i = {
          strict(t, e) {
            if (!(e in t)) throw new g.default(`"${e}" not defined in ${t}`);
            return t[e];
          },
          lookup(t, e) {
            for (let r = t.length, s = 0; s < r; s++)
              if (t[s] && t[s][e] != null) return t[s][e];
          },
          lambda(t, e) {
            return typeof t === "function" ? t.call(e) : t;
          },
          escapeExpression: d.escapeExpression,
          invokePartial: r,
          fn(e) {
            const r = t[e];
            return (r.decorator = t[`${e}_d`]), r;
          },
          programs: [],
          program(t, e, r, s, i) {
            let n = this.programs[t];
            const o = this.fn(t);
            return (
              e || i || s || r
                ? (n = a(this, t, o, e, r, s, i))
                : n || (n = this.programs[t] = a(this, t, o)),
              n
            );
          },
          data(t, e) {
            for (; t && e--; ) t = t._parent;
            return t;
          },
          merge(t, e) {
            let r = t || e;
            return t && e && t !== e && (r = d.extend({}, e, t)), r;
          },
          noop: e.VM.noop,
          compilerInfo: t.compiler,
        };
        return (
          (s.isTop = !0),
          (s._setup = function(r) {
            r.partial
              ? ((i.helpers = r.helpers),
                (i.partials = r.partials),
                (i.decorators = r.decorators))
              : ((i.helpers = i.merge(r.helpers, e.helpers)),
                t.usePartial && (i.partials = i.merge(r.partials, e.partials)),
                (t.usePartial || t.useDecorators) &&
                  (i.decorators = i.merge(r.decorators, e.decorators)));
          }),
          (s._child = function(e, r, s, n) {
            if (t.useBlockParams && !s)
              throw new g.default("must pass block params");
            if (t.useDepths && !n)
              throw new g.default("must pass parent depths");
            return a(i, e, t[e], r, 0, s, n);
          }),
          s
        );
      }
      function a(t, e, r, s, i, a, n) {
        function o(e) {
          const i =
            arguments.length <= 1 || void 0 === arguments[1]
              ? {}
              : arguments[1];
          let o = n;
          return (
            n && e !== n[0] && (o = [e].concat(n)),
            r(
              t,
              e,
              t.helpers,
              t.partials,
              i.data || s,
              a && [i.blockParams].concat(a),
              o,
            )
          );
        }
        return (
          (o = l(r, o, t, n, s, a)),
          (o.program = e),
          (o.depth = n ? n.length : 0),
          (o.blockParams = i || 0),
          o
        );
      }
      function n(t, e, r) {
        return (
          t
            ? t.call || r.name || ((r.name = t), (t = r.partials[t]))
            : (t =
                r.name === "@partial-block"
                  ? r.data["partial-block"]
                  : r.partials[r.name]),
          t
        );
      }
      function o(t, e, r) {
        (r.partial = !0),
          r.ids && (r.data.contextPath = r.ids[0] || r.data.contextPath);
        let s = void 0;
        if (
          (r.fn &&
            r.fn !== c &&
            ((r.data = v.createFrame(r.data)),
            (s = r.data["partial-block"] = r.fn),
            s.partials && (r.partials = d.extend({}, r.partials, s.partials))),
          void 0 === t && s && (t = s),
          void 0 === t)
        )
          throw new g.default(`The partial ${r.name} could not be found`);
        if (t instanceof Function) return t(e, r);
      }
      function c() {
        return "";
      }
      function h(t, e) {
        return (
          (e && "root" in e) || ((e = e ? v.createFrame(e) : {}), (e.root = t)),
          e
        );
      }
      function l(t, e, r, s, i, a) {
        if (t.decorator) {
          const n = {};
          (e = t.decorator(e, n, r, s && s[0], i, a, s)), d.extend(e, n);
        }
        return e;
      }
      const p = r(3).default;
      const u = r(1).default;
      (e.__esModule = !0),
        (e.checkRevision = s),
        (e.template = i),
        (e.wrapProgram = a),
        (e.resolvePartial = n),
        (e.invokePartial = o),
        (e.noop = c);
      const f = r(5);
      var d = p(f);
      const m = r(6);
      var g = u(m);
      var v = r(4);
    },
    function(t, e) {
      (function(r) {
        (e.__esModule = !0),
          (e.default = function(t) {
            const e = typeof r !== "undefined" ? r : window;
            const s = e.Handlebars;
            t.noConflict = function() {
              return e.Handlebars === t && (e.Handlebars = s), t;
            };
          }),
          (t.exports = e.default);
      }.call(
        e,
        (function() {
          return this;
        })(),
      ));
    },
    function(t, e) {
      e.__esModule = !0;
      var r = {
        helpers: {
          helperExpression(t) {
            return (
              t.type === "SubExpression" ||
              ((t.type === "MustacheStatement" ||
                t.type === "BlockStatement") &&
                !!((t.params && t.params.length) || t.hash))
            );
          },
          scopedId(t) {
            return /^\.|this\b/.test(t.original);
          },
          simpleId(t) {
            return t.parts.length === 1 && !r.helpers.scopedId(t) && !t.depth;
          },
        },
      };
      (e.default = r), (t.exports = e.default);
    },
    function(t, e, r) {
      function s(t, e) {
        if (t.type === "Program") return t;
        (o.default.yy = f),
          (f.locInfo = function(t) {
            return new f.SourceLocation(e && e.srcName, t);
          });
        const r = new h.default(e);
        return r.accept(o.default.parse(t));
      }
      const i = r(1).default;
      const a = r(3).default;
      (e.__esModule = !0), (e.parse = s);
      const n = r(23);
      var o = i(n);
      const c = r(24);
      var h = i(c);
      const l = r(26);
      const p = a(l);
      const u = r(5);
      e.parser = o.default;
      var f = {};
      u.extend(f, p);
    },
    function(t, e) {
      const r = (function() {
        function t() {
          this.yy = {};
        }
        const e = {
          trace() {},
          yy: {},
          symbols_: {
            error: 2,
            root: 3,
            program: 4,
            EOF: 5,
            program_repetition0: 6,
            statement: 7,
            mustache: 8,
            block: 9,
            rawBlock: 10,
            partial: 11,
            partialBlock: 12,
            content: 13,
            COMMENT: 14,
            CONTENT: 15,
            openRawBlock: 16,
            rawBlock_repetition_plus0: 17,
            END_RAW_BLOCK: 18,
            OPEN_RAW_BLOCK: 19,
            helperName: 20,
            openRawBlock_repetition0: 21,
            openRawBlock_option0: 22,
            CLOSE_RAW_BLOCK: 23,
            openBlock: 24,
            block_option0: 25,
            closeBlock: 26,
            openInverse: 27,
            block_option1: 28,
            OPEN_BLOCK: 29,
            openBlock_repetition0: 30,
            openBlock_option0: 31,
            openBlock_option1: 32,
            CLOSE: 33,
            OPEN_INVERSE: 34,
            openInverse_repetition0: 35,
            openInverse_option0: 36,
            openInverse_option1: 37,
            openInverseChain: 38,
            OPEN_INVERSE_CHAIN: 39,
            openInverseChain_repetition0: 40,
            openInverseChain_option0: 41,
            openInverseChain_option1: 42,
            inverseAndProgram: 43,
            INVERSE: 44,
            inverseChain: 45,
            inverseChain_option0: 46,
            OPEN_ENDBLOCK: 47,
            OPEN: 48,
            mustache_repetition0: 49,
            mustache_option0: 50,
            OPEN_UNESCAPED: 51,
            mustache_repetition1: 52,
            mustache_option1: 53,
            CLOSE_UNESCAPED: 54,
            OPEN_PARTIAL: 55,
            partialName: 56,
            partial_repetition0: 57,
            partial_option0: 58,
            openPartialBlock: 59,
            OPEN_PARTIAL_BLOCK: 60,
            openPartialBlock_repetition0: 61,
            openPartialBlock_option0: 62,
            param: 63,
            sexpr: 64,
            OPEN_SEXPR: 65,
            sexpr_repetition0: 66,
            sexpr_option0: 67,
            CLOSE_SEXPR: 68,
            hash: 69,
            hash_repetition_plus0: 70,
            hashSegment: 71,
            ID: 72,
            EQUALS: 73,
            blockParams: 74,
            OPEN_BLOCK_PARAMS: 75,
            blockParams_repetition_plus0: 76,
            CLOSE_BLOCK_PARAMS: 77,
            path: 78,
            dataName: 79,
            STRING: 80,
            NUMBER: 81,
            BOOLEAN: 82,
            UNDEFINED: 83,
            NULL: 84,
            DATA: 85,
            pathSegments: 86,
            SEP: 87,
            $accept: 0,
            $end: 1,
          },
          terminals_: {
            2: "error",
            5: "EOF",
            14: "COMMENT",
            15: "CONTENT",
            18: "END_RAW_BLOCK",
            19: "OPEN_RAW_BLOCK",
            23: "CLOSE_RAW_BLOCK",
            29: "OPEN_BLOCK",
            33: "CLOSE",
            34: "OPEN_INVERSE",
            39: "OPEN_INVERSE_CHAIN",
            44: "INVERSE",
            47: "OPEN_ENDBLOCK",
            48: "OPEN",
            51: "OPEN_UNESCAPED",
            54: "CLOSE_UNESCAPED",
            55: "OPEN_PARTIAL",
            60: "OPEN_PARTIAL_BLOCK",
            65: "OPEN_SEXPR",
            68: "CLOSE_SEXPR",
            72: "ID",
            73: "EQUALS",
            75: "OPEN_BLOCK_PARAMS",
            77: "CLOSE_BLOCK_PARAMS",
            80: "STRING",
            81: "NUMBER",
            82: "BOOLEAN",
            83: "UNDEFINED",
            84: "NULL",
            85: "DATA",
            87: "SEP",
          },
          productions_: [
            0,
            [3, 2],
            [4, 1],
            [7, 1],
            [7, 1],
            [7, 1],
            [7, 1],
            [7, 1],
            [7, 1],
            [7, 1],
            [13, 1],
            [10, 3],
            [16, 5],
            [9, 4],
            [9, 4],
            [24, 6],
            [27, 6],
            [38, 6],
            [43, 2],
            [45, 3],
            [45, 1],
            [26, 3],
            [8, 5],
            [8, 5],
            [11, 5],
            [12, 3],
            [59, 5],
            [63, 1],
            [63, 1],
            [64, 5],
            [69, 1],
            [71, 3],
            [74, 3],
            [20, 1],
            [20, 1],
            [20, 1],
            [20, 1],
            [20, 1],
            [20, 1],
            [20, 1],
            [56, 1],
            [56, 1],
            [79, 2],
            [78, 1],
            [86, 3],
            [86, 1],
            [6, 0],
            [6, 2],
            [17, 1],
            [17, 2],
            [21, 0],
            [21, 2],
            [22, 0],
            [22, 1],
            [25, 0],
            [25, 1],
            [28, 0],
            [28, 1],
            [30, 0],
            [30, 2],
            [31, 0],
            [31, 1],
            [32, 0],
            [32, 1],
            [35, 0],
            [35, 2],
            [36, 0],
            [36, 1],
            [37, 0],
            [37, 1],
            [40, 0],
            [40, 2],
            [41, 0],
            [41, 1],
            [42, 0],
            [42, 1],
            [46, 0],
            [46, 1],
            [49, 0],
            [49, 2],
            [50, 0],
            [50, 1],
            [52, 0],
            [52, 2],
            [53, 0],
            [53, 1],
            [57, 0],
            [57, 2],
            [58, 0],
            [58, 1],
            [61, 0],
            [61, 2],
            [62, 0],
            [62, 1],
            [66, 0],
            [66, 2],
            [67, 0],
            [67, 1],
            [70, 1],
            [70, 2],
            [76, 1],
            [76, 2],
          ],
          performAction(t, e, r, s, i, a, n) {
            const o = a.length - 1;
            switch (i) {
              case 1:
                return a[o - 1];
              case 2:
                this.$ = s.prepareProgram(a[o]);
                break;
              case 3:
                this.$ = a[o];
                break;
              case 4:
                this.$ = a[o];
                break;
              case 5:
                this.$ = a[o];
                break;
              case 6:
                this.$ = a[o];
                break;
              case 7:
                this.$ = a[o];
                break;
              case 8:
                this.$ = a[o];
                break;
              case 9:
                this.$ = {
                  type: "CommentStatement",
                  value: s.stripComment(a[o]),
                  strip: s.stripFlags(a[o], a[o]),
                  loc: s.locInfo(this._$),
                };
                break;
              case 10:
                this.$ = {
                  type: "ContentStatement",
                  original: a[o],
                  value: a[o],
                  loc: s.locInfo(this._$),
                };
                break;
              case 11:
                this.$ = s.prepareRawBlock(a[o - 2], a[o - 1], a[o], this._$);
                break;
              case 12:
                this.$ = { path: a[o - 3], params: a[o - 2], hash: a[o - 1] };
                break;
              case 13:
                this.$ = s.prepareBlock(
                  a[o - 3],
                  a[o - 2],
                  a[o - 1],
                  a[o],
                  !1,
                  this._$,
                );
                break;
              case 14:
                this.$ = s.prepareBlock(
                  a[o - 3],
                  a[o - 2],
                  a[o - 1],
                  a[o],
                  !0,
                  this._$,
                );
                break;
              case 15:
                this.$ = {
                  open: a[o - 5],
                  path: a[o - 4],
                  params: a[o - 3],
                  hash: a[o - 2],
                  blockParams: a[o - 1],
                  strip: s.stripFlags(a[o - 5], a[o]),
                };
                break;
              case 16:
                this.$ = {
                  path: a[o - 4],
                  params: a[o - 3],
                  hash: a[o - 2],
                  blockParams: a[o - 1],
                  strip: s.stripFlags(a[o - 5], a[o]),
                };
                break;
              case 17:
                this.$ = {
                  path: a[o - 4],
                  params: a[o - 3],
                  hash: a[o - 2],
                  blockParams: a[o - 1],
                  strip: s.stripFlags(a[o - 5], a[o]),
                };
                break;
              case 18:
                this.$ = {
                  strip: s.stripFlags(a[o - 1], a[o - 1]),
                  program: a[o],
                };
                break;
              case 19:
                var c = s.prepareBlock(
                  a[o - 2],
                  a[o - 1],
                  a[o],
                  a[o],
                  !1,
                  this._$,
                );
                var h = s.prepareProgram([c], a[o - 1].loc);
                (h.chained = !0),
                  (this.$ = { strip: a[o - 2].strip, program: h, chain: !0 });
                break;
              case 20:
                this.$ = a[o];
                break;
              case 21:
                this.$ = {
                  path: a[o - 1],
                  strip: s.stripFlags(a[o - 2], a[o]),
                };
                break;
              case 22:
                this.$ = s.prepareMustache(
                  a[o - 3],
                  a[o - 2],
                  a[o - 1],
                  a[o - 4],
                  s.stripFlags(a[o - 4], a[o]),
                  this._$,
                );
                break;
              case 23:
                this.$ = s.prepareMustache(
                  a[o - 3],
                  a[o - 2],
                  a[o - 1],
                  a[o - 4],
                  s.stripFlags(a[o - 4], a[o]),
                  this._$,
                );
                break;
              case 24:
                this.$ = {
                  type: "PartialStatement",
                  name: a[o - 3],
                  params: a[o - 2],
                  hash: a[o - 1],
                  indent: "",
                  strip: s.stripFlags(a[o - 4], a[o]),
                  loc: s.locInfo(this._$),
                };
                break;
              case 25:
                this.$ = s.preparePartialBlock(
                  a[o - 2],
                  a[o - 1],
                  a[o],
                  this._$,
                );
                break;
              case 26:
                this.$ = {
                  path: a[o - 3],
                  params: a[o - 2],
                  hash: a[o - 1],
                  strip: s.stripFlags(a[o - 4], a[o]),
                };
                break;
              case 27:
                this.$ = a[o];
                break;
              case 28:
                this.$ = a[o];
                break;
              case 29:
                this.$ = {
                  type: "SubExpression",
                  path: a[o - 3],
                  params: a[o - 2],
                  hash: a[o - 1],
                  loc: s.locInfo(this._$),
                };
                break;
              case 30:
                this.$ = {
                  type: "Hash",
                  pairs: a[o],
                  loc: s.locInfo(this._$),
                };
                break;
              case 31:
                this.$ = {
                  type: "HashPair",
                  key: s.id(a[o - 2]),
                  value: a[o],
                  loc: s.locInfo(this._$),
                };
                break;
              case 32:
                this.$ = s.id(a[o - 1]);
                break;
              case 33:
                this.$ = a[o];
                break;
              case 34:
                this.$ = a[o];
                break;
              case 35:
                this.$ = {
                  type: "StringLiteral",
                  value: a[o],
                  original: a[o],
                  loc: s.locInfo(this._$),
                };
                break;
              case 36:
                this.$ = {
                  type: "NumberLiteral",
                  value: Number(a[o]),
                  original: Number(a[o]),
                  loc: s.locInfo(this._$),
                };
                break;
              case 37:
                this.$ = {
                  type: "BooleanLiteral",
                  value: a[o] === "true",
                  original: a[o] === "true",
                  loc: s.locInfo(this._$),
                };
                break;
              case 38:
                this.$ = {
                  type: "UndefinedLiteral",
                  original: void 0,
                  value: void 0,
                  loc: s.locInfo(this._$),
                };
                break;
              case 39:
                this.$ = {
                  type: "NullLiteral",
                  original: null,
                  value: null,
                  loc: s.locInfo(this._$),
                };
                break;
              case 40:
                this.$ = a[o];
                break;
              case 41:
                this.$ = a[o];
                break;
              case 42:
                this.$ = s.preparePath(!0, a[o], this._$);
                break;
              case 43:
                this.$ = s.preparePath(!1, a[o], this._$);
                break;
              case 44:
                a[o - 2].push({
                  part: s.id(a[o]),
                  original: a[o],
                  separator: a[o - 1],
                }),
                  (this.$ = a[o - 2]);
                break;
              case 45:
                this.$ = [{ part: s.id(a[o]), original: a[o] }];
                break;
              case 46:
                this.$ = [];
                break;
              case 47:
                a[o - 1].push(a[o]);
                break;
              case 48:
                this.$ = [a[o]];
                break;
              case 49:
                a[o - 1].push(a[o]);
                break;
              case 50:
                this.$ = [];
                break;
              case 51:
                a[o - 1].push(a[o]);
                break;
              case 58:
                this.$ = [];
                break;
              case 59:
                a[o - 1].push(a[o]);
                break;
              case 64:
                this.$ = [];
                break;
              case 65:
                a[o - 1].push(a[o]);
                break;
              case 70:
                this.$ = [];
                break;
              case 71:
                a[o - 1].push(a[o]);
                break;
              case 78:
                this.$ = [];
                break;
              case 79:
                a[o - 1].push(a[o]);
                break;
              case 82:
                this.$ = [];
                break;
              case 83:
                a[o - 1].push(a[o]);
                break;
              case 86:
                this.$ = [];
                break;
              case 87:
                a[o - 1].push(a[o]);
                break;
              case 90:
                this.$ = [];
                break;
              case 91:
                a[o - 1].push(a[o]);
                break;
              case 94:
                this.$ = [];
                break;
              case 95:
                a[o - 1].push(a[o]);
                break;
              case 98:
                this.$ = [a[o]];
                break;
              case 99:
                a[o - 1].push(a[o]);
                break;
              case 100:
                this.$ = [a[o]];
                break;
              case 101:
                a[o - 1].push(a[o]);
            }
          },
          table: [
            {
              3: 1,
              4: 2,
              5: [2, 46],
              6: 3,
              14: [2, 46],
              15: [2, 46],
              19: [2, 46],
              29: [2, 46],
              34: [2, 46],
              48: [2, 46],
              51: [2, 46],
              55: [2, 46],
              60: [2, 46],
            },
            { 1: [3] },
            { 5: [1, 4] },
            {
              5: [2, 2],
              7: 5,
              8: 6,
              9: 7,
              10: 8,
              11: 9,
              12: 10,
              13: 11,
              14: [1, 12],
              15: [1, 20],
              16: 17,
              19: [1, 23],
              24: 15,
              27: 16,
              29: [1, 21],
              34: [1, 22],
              39: [2, 2],
              44: [2, 2],
              47: [2, 2],
              48: [1, 13],
              51: [1, 14],
              55: [1, 18],
              59: 19,
              60: [1, 24],
            },
            { 1: [2, 1] },
            {
              5: [2, 47],
              14: [2, 47],
              15: [2, 47],
              19: [2, 47],
              29: [2, 47],
              34: [2, 47],
              39: [2, 47],
              44: [2, 47],
              47: [2, 47],
              48: [2, 47],
              51: [2, 47],
              55: [2, 47],
              60: [2, 47],
            },
            {
              5: [2, 3],
              14: [2, 3],
              15: [2, 3],
              19: [2, 3],
              29: [2, 3],
              34: [2, 3],
              39: [2, 3],
              44: [2, 3],
              47: [2, 3],
              48: [2, 3],
              51: [2, 3],
              55: [2, 3],
              60: [2, 3],
            },
            {
              5: [2, 4],
              14: [2, 4],
              15: [2, 4],
              19: [2, 4],
              29: [2, 4],
              34: [2, 4],
              39: [2, 4],
              44: [2, 4],
              47: [2, 4],
              48: [2, 4],
              51: [2, 4],
              55: [2, 4],
              60: [2, 4],
            },
            {
              5: [2, 5],
              14: [2, 5],
              15: [2, 5],
              19: [2, 5],
              29: [2, 5],
              34: [2, 5],
              39: [2, 5],
              44: [2, 5],
              47: [2, 5],
              48: [2, 5],
              51: [2, 5],
              55: [2, 5],
              60: [2, 5],
            },
            {
              5: [2, 6],
              14: [2, 6],
              15: [2, 6],
              19: [2, 6],
              29: [2, 6],
              34: [2, 6],
              39: [2, 6],
              44: [2, 6],
              47: [2, 6],
              48: [2, 6],
              51: [2, 6],
              55: [2, 6],
              60: [2, 6],
            },
            {
              5: [2, 7],
              14: [2, 7],
              15: [2, 7],
              19: [2, 7],
              29: [2, 7],
              34: [2, 7],
              39: [2, 7],
              44: [2, 7],
              47: [2, 7],
              48: [2, 7],
              51: [2, 7],
              55: [2, 7],
              60: [2, 7],
            },
            {
              5: [2, 8],
              14: [2, 8],
              15: [2, 8],
              19: [2, 8],
              29: [2, 8],
              34: [2, 8],
              39: [2, 8],
              44: [2, 8],
              47: [2, 8],
              48: [2, 8],
              51: [2, 8],
              55: [2, 8],
              60: [2, 8],
            },
            {
              5: [2, 9],
              14: [2, 9],
              15: [2, 9],
              19: [2, 9],
              29: [2, 9],
              34: [2, 9],
              39: [2, 9],
              44: [2, 9],
              47: [2, 9],
              48: [2, 9],
              51: [2, 9],
              55: [2, 9],
              60: [2, 9],
            },
            {
              20: 25,
              72: [1, 35],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              20: 36,
              72: [1, 35],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              4: 37,
              6: 3,
              14: [2, 46],
              15: [2, 46],
              19: [2, 46],
              29: [2, 46],
              34: [2, 46],
              39: [2, 46],
              44: [2, 46],
              47: [2, 46],
              48: [2, 46],
              51: [2, 46],
              55: [2, 46],
              60: [2, 46],
            },
            {
              4: 38,
              6: 3,
              14: [2, 46],
              15: [2, 46],
              19: [2, 46],
              29: [2, 46],
              34: [2, 46],
              44: [2, 46],
              47: [2, 46],
              48: [2, 46],
              51: [2, 46],
              55: [2, 46],
              60: [2, 46],
            },
            { 13: 40, 15: [1, 20], 17: 39 },
            {
              20: 42,
              56: 41,
              64: 43,
              65: [1, 44],
              72: [1, 35],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              4: 45,
              6: 3,
              14: [2, 46],
              15: [2, 46],
              19: [2, 46],
              29: [2, 46],
              34: [2, 46],
              47: [2, 46],
              48: [2, 46],
              51: [2, 46],
              55: [2, 46],
              60: [2, 46],
            },
            {
              5: [2, 10],
              14: [2, 10],
              15: [2, 10],
              18: [2, 10],
              19: [2, 10],
              29: [2, 10],
              34: [2, 10],
              39: [2, 10],
              44: [2, 10],
              47: [2, 10],
              48: [2, 10],
              51: [2, 10],
              55: [2, 10],
              60: [2, 10],
            },
            {
              20: 46,
              72: [1, 35],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              20: 47,
              72: [1, 35],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              20: 48,
              72: [1, 35],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              20: 42,
              56: 49,
              64: 43,
              65: [1, 44],
              72: [1, 35],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              33: [2, 78],
              49: 50,
              65: [2, 78],
              72: [2, 78],
              80: [2, 78],
              81: [2, 78],
              82: [2, 78],
              83: [2, 78],
              84: [2, 78],
              85: [2, 78],
            },
            {
              23: [2, 33],
              33: [2, 33],
              54: [2, 33],
              65: [2, 33],
              68: [2, 33],
              72: [2, 33],
              75: [2, 33],
              80: [2, 33],
              81: [2, 33],
              82: [2, 33],
              83: [2, 33],
              84: [2, 33],
              85: [2, 33],
            },
            {
              23: [2, 34],
              33: [2, 34],
              54: [2, 34],
              65: [2, 34],
              68: [2, 34],
              72: [2, 34],
              75: [2, 34],
              80: [2, 34],
              81: [2, 34],
              82: [2, 34],
              83: [2, 34],
              84: [2, 34],
              85: [2, 34],
            },
            {
              23: [2, 35],
              33: [2, 35],
              54: [2, 35],
              65: [2, 35],
              68: [2, 35],
              72: [2, 35],
              75: [2, 35],
              80: [2, 35],
              81: [2, 35],
              82: [2, 35],
              83: [2, 35],
              84: [2, 35],
              85: [2, 35],
            },
            {
              23: [2, 36],
              33: [2, 36],
              54: [2, 36],
              65: [2, 36],
              68: [2, 36],
              72: [2, 36],
              75: [2, 36],
              80: [2, 36],
              81: [2, 36],
              82: [2, 36],
              83: [2, 36],
              84: [2, 36],
              85: [2, 36],
            },
            {
              23: [2, 37],
              33: [2, 37],
              54: [2, 37],
              65: [2, 37],
              68: [2, 37],
              72: [2, 37],
              75: [2, 37],
              80: [2, 37],
              81: [2, 37],
              82: [2, 37],
              83: [2, 37],
              84: [2, 37],
              85: [2, 37],
            },
            {
              23: [2, 38],
              33: [2, 38],
              54: [2, 38],
              65: [2, 38],
              68: [2, 38],
              72: [2, 38],
              75: [2, 38],
              80: [2, 38],
              81: [2, 38],
              82: [2, 38],
              83: [2, 38],
              84: [2, 38],
              85: [2, 38],
            },
            {
              23: [2, 39],
              33: [2, 39],
              54: [2, 39],
              65: [2, 39],
              68: [2, 39],
              72: [2, 39],
              75: [2, 39],
              80: [2, 39],
              81: [2, 39],
              82: [2, 39],
              83: [2, 39],
              84: [2, 39],
              85: [2, 39],
            },
            {
              23: [2, 43],
              33: [2, 43],
              54: [2, 43],
              65: [2, 43],
              68: [2, 43],
              72: [2, 43],
              75: [2, 43],
              80: [2, 43],
              81: [2, 43],
              82: [2, 43],
              83: [2, 43],
              84: [2, 43],
              85: [2, 43],
              87: [1, 51],
            },
            { 72: [1, 35], 86: 52 },
            {
              23: [2, 45],
              33: [2, 45],
              54: [2, 45],
              65: [2, 45],
              68: [2, 45],
              72: [2, 45],
              75: [2, 45],
              80: [2, 45],
              81: [2, 45],
              82: [2, 45],
              83: [2, 45],
              84: [2, 45],
              85: [2, 45],
              87: [2, 45],
            },
            {
              52: 53,
              54: [2, 82],
              65: [2, 82],
              72: [2, 82],
              80: [2, 82],
              81: [2, 82],
              82: [2, 82],
              83: [2, 82],
              84: [2, 82],
              85: [2, 82],
            },
            {
              25: 54,
              38: 56,
              39: [1, 58],
              43: 57,
              44: [1, 59],
              45: 55,
              47: [2, 54],
            },
            { 28: 60, 43: 61, 44: [1, 59], 47: [2, 56] },
            { 13: 63, 15: [1, 20], 18: [1, 62] },
            { 15: [2, 48], 18: [2, 48] },
            {
              33: [2, 86],
              57: 64,
              65: [2, 86],
              72: [2, 86],
              80: [2, 86],
              81: [2, 86],
              82: [2, 86],
              83: [2, 86],
              84: [2, 86],
              85: [2, 86],
            },
            {
              33: [2, 40],
              65: [2, 40],
              72: [2, 40],
              80: [2, 40],
              81: [2, 40],
              82: [2, 40],
              83: [2, 40],
              84: [2, 40],
              85: [2, 40],
            },
            {
              33: [2, 41],
              65: [2, 41],
              72: [2, 41],
              80: [2, 41],
              81: [2, 41],
              82: [2, 41],
              83: [2, 41],
              84: [2, 41],
              85: [2, 41],
            },
            {
              20: 65,
              72: [1, 35],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            { 26: 66, 47: [1, 67] },
            {
              30: 68,
              33: [2, 58],
              65: [2, 58],
              72: [2, 58],
              75: [2, 58],
              80: [2, 58],
              81: [2, 58],
              82: [2, 58],
              83: [2, 58],
              84: [2, 58],
              85: [2, 58],
            },
            {
              33: [2, 64],
              35: 69,
              65: [2, 64],
              72: [2, 64],
              75: [2, 64],
              80: [2, 64],
              81: [2, 64],
              82: [2, 64],
              83: [2, 64],
              84: [2, 64],
              85: [2, 64],
            },
            {
              21: 70,
              23: [2, 50],
              65: [2, 50],
              72: [2, 50],
              80: [2, 50],
              81: [2, 50],
              82: [2, 50],
              83: [2, 50],
              84: [2, 50],
              85: [2, 50],
            },
            {
              33: [2, 90],
              61: 71,
              65: [2, 90],
              72: [2, 90],
              80: [2, 90],
              81: [2, 90],
              82: [2, 90],
              83: [2, 90],
              84: [2, 90],
              85: [2, 90],
            },
            {
              20: 75,
              33: [2, 80],
              50: 72,
              63: 73,
              64: 76,
              65: [1, 44],
              69: 74,
              70: 77,
              71: 78,
              72: [1, 79],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            { 72: [1, 80] },
            {
              23: [2, 42],
              33: [2, 42],
              54: [2, 42],
              65: [2, 42],
              68: [2, 42],
              72: [2, 42],
              75: [2, 42],
              80: [2, 42],
              81: [2, 42],
              82: [2, 42],
              83: [2, 42],
              84: [2, 42],
              85: [2, 42],
              87: [1, 51],
            },
            {
              20: 75,
              53: 81,
              54: [2, 84],
              63: 82,
              64: 76,
              65: [1, 44],
              69: 83,
              70: 77,
              71: 78,
              72: [1, 79],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            { 26: 84, 47: [1, 67] },
            { 47: [2, 55] },
            {
              4: 85,
              6: 3,
              14: [2, 46],
              15: [2, 46],
              19: [2, 46],
              29: [2, 46],
              34: [2, 46],
              39: [2, 46],
              44: [2, 46],
              47: [2, 46],
              48: [2, 46],
              51: [2, 46],
              55: [2, 46],
              60: [2, 46],
            },
            { 47: [2, 20] },
            {
              20: 86,
              72: [1, 35],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              4: 87,
              6: 3,
              14: [2, 46],
              15: [2, 46],
              19: [2, 46],
              29: [2, 46],
              34: [2, 46],
              47: [2, 46],
              48: [2, 46],
              51: [2, 46],
              55: [2, 46],
              60: [2, 46],
            },
            { 26: 88, 47: [1, 67] },
            { 47: [2, 57] },
            {
              5: [2, 11],
              14: [2, 11],
              15: [2, 11],
              19: [2, 11],
              29: [2, 11],
              34: [2, 11],
              39: [2, 11],
              44: [2, 11],
              47: [2, 11],
              48: [2, 11],
              51: [2, 11],
              55: [2, 11],
              60: [2, 11],
            },
            { 15: [2, 49], 18: [2, 49] },
            {
              20: 75,
              33: [2, 88],
              58: 89,
              63: 90,
              64: 76,
              65: [1, 44],
              69: 91,
              70: 77,
              71: 78,
              72: [1, 79],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              65: [2, 94],
              66: 92,
              68: [2, 94],
              72: [2, 94],
              80: [2, 94],
              81: [2, 94],
              82: [2, 94],
              83: [2, 94],
              84: [2, 94],
              85: [2, 94],
            },
            {
              5: [2, 25],
              14: [2, 25],
              15: [2, 25],
              19: [2, 25],
              29: [2, 25],
              34: [2, 25],
              39: [2, 25],
              44: [2, 25],
              47: [2, 25],
              48: [2, 25],
              51: [2, 25],
              55: [2, 25],
              60: [2, 25],
            },
            {
              20: 93,
              72: [1, 35],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              20: 75,
              31: 94,
              33: [2, 60],
              63: 95,
              64: 76,
              65: [1, 44],
              69: 96,
              70: 77,
              71: 78,
              72: [1, 79],
              75: [2, 60],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              20: 75,
              33: [2, 66],
              36: 97,
              63: 98,
              64: 76,
              65: [1, 44],
              69: 99,
              70: 77,
              71: 78,
              72: [1, 79],
              75: [2, 66],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              20: 75,
              22: 100,
              23: [2, 52],
              63: 101,
              64: 76,
              65: [1, 44],
              69: 102,
              70: 77,
              71: 78,
              72: [1, 79],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              20: 75,
              33: [2, 92],
              62: 103,
              63: 104,
              64: 76,
              65: [1, 44],
              69: 105,
              70: 77,
              71: 78,
              72: [1, 79],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            { 33: [1, 106] },
            {
              33: [2, 79],
              65: [2, 79],
              72: [2, 79],
              80: [2, 79],
              81: [2, 79],
              82: [2, 79],
              83: [2, 79],
              84: [2, 79],
              85: [2, 79],
            },
            { 33: [2, 81] },
            {
              23: [2, 27],
              33: [2, 27],
              54: [2, 27],
              65: [2, 27],
              68: [2, 27],
              72: [2, 27],
              75: [2, 27],
              80: [2, 27],
              81: [2, 27],
              82: [2, 27],
              83: [2, 27],
              84: [2, 27],
              85: [2, 27],
            },
            {
              23: [2, 28],
              33: [2, 28],
              54: [2, 28],
              65: [2, 28],
              68: [2, 28],
              72: [2, 28],
              75: [2, 28],
              80: [2, 28],
              81: [2, 28],
              82: [2, 28],
              83: [2, 28],
              84: [2, 28],
              85: [2, 28],
            },
            {
              23: [2, 30],
              33: [2, 30],
              54: [2, 30],
              68: [2, 30],
              71: 107,
              72: [1, 108],
              75: [2, 30],
            },
            {
              23: [2, 98],
              33: [2, 98],
              54: [2, 98],
              68: [2, 98],
              72: [2, 98],
              75: [2, 98],
            },
            {
              23: [2, 45],
              33: [2, 45],
              54: [2, 45],
              65: [2, 45],
              68: [2, 45],
              72: [2, 45],
              73: [1, 109],
              75: [2, 45],
              80: [2, 45],
              81: [2, 45],
              82: [2, 45],
              83: [2, 45],
              84: [2, 45],
              85: [2, 45],
              87: [2, 45],
            },
            {
              23: [2, 44],
              33: [2, 44],
              54: [2, 44],
              65: [2, 44],
              68: [2, 44],
              72: [2, 44],
              75: [2, 44],
              80: [2, 44],
              81: [2, 44],
              82: [2, 44],
              83: [2, 44],
              84: [2, 44],
              85: [2, 44],
              87: [2, 44],
            },
            { 54: [1, 110] },
            {
              54: [2, 83],
              65: [2, 83],
              72: [2, 83],
              80: [2, 83],
              81: [2, 83],
              82: [2, 83],
              83: [2, 83],
              84: [2, 83],
              85: [2, 83],
            },
            { 54: [2, 85] },
            {
              5: [2, 13],
              14: [2, 13],
              15: [2, 13],
              19: [2, 13],
              29: [2, 13],
              34: [2, 13],
              39: [2, 13],
              44: [2, 13],
              47: [2, 13],
              48: [2, 13],
              51: [2, 13],
              55: [2, 13],
              60: [2, 13],
            },
            {
              38: 56,
              39: [1, 58],
              43: 57,
              44: [1, 59],
              45: 112,
              46: 111,
              47: [2, 76],
            },
            {
              33: [2, 70],
              40: 113,
              65: [2, 70],
              72: [2, 70],
              75: [2, 70],
              80: [2, 70],
              81: [2, 70],
              82: [2, 70],
              83: [2, 70],
              84: [2, 70],
              85: [2, 70],
            },
            { 47: [2, 18] },
            {
              5: [2, 14],
              14: [2, 14],
              15: [2, 14],
              19: [2, 14],
              29: [2, 14],
              34: [2, 14],
              39: [2, 14],
              44: [2, 14],
              47: [2, 14],
              48: [2, 14],
              51: [2, 14],
              55: [2, 14],
              60: [2, 14],
            },
            { 33: [1, 114] },
            {
              33: [2, 87],
              65: [2, 87],
              72: [2, 87],
              80: [2, 87],
              81: [2, 87],
              82: [2, 87],
              83: [2, 87],
              84: [2, 87],
              85: [2, 87],
            },
            { 33: [2, 89] },
            {
              20: 75,
              63: 116,
              64: 76,
              65: [1, 44],
              67: 115,
              68: [2, 96],
              69: 117,
              70: 77,
              71: 78,
              72: [1, 79],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            { 33: [1, 118] },
            { 32: 119, 33: [2, 62], 74: 120, 75: [1, 121] },
            {
              33: [2, 59],
              65: [2, 59],
              72: [2, 59],
              75: [2, 59],
              80: [2, 59],
              81: [2, 59],
              82: [2, 59],
              83: [2, 59],
              84: [2, 59],
              85: [2, 59],
            },
            { 33: [2, 61], 75: [2, 61] },
            { 33: [2, 68], 37: 122, 74: 123, 75: [1, 121] },
            {
              33: [2, 65],
              65: [2, 65],
              72: [2, 65],
              75: [2, 65],
              80: [2, 65],
              81: [2, 65],
              82: [2, 65],
              83: [2, 65],
              84: [2, 65],
              85: [2, 65],
            },
            { 33: [2, 67], 75: [2, 67] },
            { 23: [1, 124] },
            {
              23: [2, 51],
              65: [2, 51],
              72: [2, 51],
              80: [2, 51],
              81: [2, 51],
              82: [2, 51],
              83: [2, 51],
              84: [2, 51],
              85: [2, 51],
            },
            { 23: [2, 53] },
            { 33: [1, 125] },
            {
              33: [2, 91],
              65: [2, 91],
              72: [2, 91],
              80: [2, 91],
              81: [2, 91],
              82: [2, 91],
              83: [2, 91],
              84: [2, 91],
              85: [2, 91],
            },
            { 33: [2, 93] },
            {
              5: [2, 22],
              14: [2, 22],
              15: [2, 22],
              19: [2, 22],
              29: [2, 22],
              34: [2, 22],
              39: [2, 22],
              44: [2, 22],
              47: [2, 22],
              48: [2, 22],
              51: [2, 22],
              55: [2, 22],
              60: [2, 22],
            },
            {
              23: [2, 99],
              33: [2, 99],
              54: [2, 99],
              68: [2, 99],
              72: [2, 99],
              75: [2, 99],
            },
            { 73: [1, 109] },
            {
              20: 75,
              63: 126,
              64: 76,
              65: [1, 44],
              72: [1, 35],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              5: [2, 23],
              14: [2, 23],
              15: [2, 23],
              19: [2, 23],
              29: [2, 23],
              34: [2, 23],
              39: [2, 23],
              44: [2, 23],
              47: [2, 23],
              48: [2, 23],
              51: [2, 23],
              55: [2, 23],
              60: [2, 23],
            },
            { 47: [2, 19] },
            { 47: [2, 77] },
            {
              20: 75,
              33: [2, 72],
              41: 127,
              63: 128,
              64: 76,
              65: [1, 44],
              69: 129,
              70: 77,
              71: 78,
              72: [1, 79],
              75: [2, 72],
              78: 26,
              79: 27,
              80: [1, 28],
              81: [1, 29],
              82: [1, 30],
              83: [1, 31],
              84: [1, 32],
              85: [1, 34],
              86: 33,
            },
            {
              5: [2, 24],
              14: [2, 24],
              15: [2, 24],
              19: [2, 24],
              29: [2, 24],
              34: [2, 24],
              39: [2, 24],
              44: [2, 24],
              47: [2, 24],
              48: [2, 24],
              51: [2, 24],
              55: [2, 24],
              60: [2, 24],
            },
            { 68: [1, 130] },
            {
              65: [2, 95],
              68: [2, 95],
              72: [2, 95],
              80: [2, 95],
              81: [2, 95],
              82: [2, 95],
              83: [2, 95],
              84: [2, 95],
              85: [2, 95],
            },
            { 68: [2, 97] },
            {
              5: [2, 21],
              14: [2, 21],
              15: [2, 21],
              19: [2, 21],
              29: [2, 21],
              34: [2, 21],
              39: [2, 21],
              44: [2, 21],
              47: [2, 21],
              48: [2, 21],
              51: [2, 21],
              55: [2, 21],
              60: [2, 21],
            },
            { 33: [1, 131] },
            { 33: [2, 63] },
            { 72: [1, 133], 76: 132 },
            { 33: [1, 134] },
            { 33: [2, 69] },
            { 15: [2, 12] },
            {
              14: [2, 26],
              15: [2, 26],
              19: [2, 26],
              29: [2, 26],
              34: [2, 26],
              47: [2, 26],
              48: [2, 26],
              51: [2, 26],
              55: [2, 26],
              60: [2, 26],
            },
            {
              23: [2, 31],
              33: [2, 31],
              54: [2, 31],
              68: [2, 31],
              72: [2, 31],
              75: [2, 31],
            },
            { 33: [2, 74], 42: 135, 74: 136, 75: [1, 121] },
            {
              33: [2, 71],
              65: [2, 71],
              72: [2, 71],
              75: [2, 71],
              80: [2, 71],
              81: [2, 71],
              82: [2, 71],
              83: [2, 71],
              84: [2, 71],
              85: [2, 71],
            },
            { 33: [2, 73], 75: [2, 73] },
            {
              23: [2, 29],
              33: [2, 29],
              54: [2, 29],
              65: [2, 29],
              68: [2, 29],
              72: [2, 29],
              75: [2, 29],
              80: [2, 29],
              81: [2, 29],
              82: [2, 29],
              83: [2, 29],
              84: [2, 29],
              85: [2, 29],
            },
            {
              14: [2, 15],
              15: [2, 15],
              19: [2, 15],
              29: [2, 15],
              34: [2, 15],
              39: [2, 15],
              44: [2, 15],
              47: [2, 15],
              48: [2, 15],
              51: [2, 15],
              55: [2, 15],
              60: [2, 15],
            },
            { 72: [1, 138], 77: [1, 137] },
            { 72: [2, 100], 77: [2, 100] },
            {
              14: [2, 16],
              15: [2, 16],
              19: [2, 16],
              29: [2, 16],
              34: [2, 16],
              44: [2, 16],
              47: [2, 16],
              48: [2, 16],
              51: [2, 16],
              55: [2, 16],
              60: [2, 16],
            },
            { 33: [1, 139] },
            { 33: [2, 75] },
            { 33: [2, 32] },
            { 72: [2, 101], 77: [2, 101] },
            {
              14: [2, 17],
              15: [2, 17],
              19: [2, 17],
              29: [2, 17],
              34: [2, 17],
              39: [2, 17],
              44: [2, 17],
              47: [2, 17],
              48: [2, 17],
              51: [2, 17],
              55: [2, 17],
              60: [2, 17],
            },
          ],
          defaultActions: {
            4: [2, 1],
            55: [2, 55],
            57: [2, 20],
            61: [2, 57],
            74: [2, 81],
            83: [2, 85],
            87: [2, 18],
            91: [2, 89],
            102: [2, 53],
            105: [2, 93],
            111: [2, 19],
            112: [2, 77],
            117: [2, 97],
            120: [2, 63],
            123: [2, 69],
            124: [2, 12],
            136: [2, 75],
            137: [2, 32],
          },
          parseError(t, e) {
            throw new Error(t);
          },
          parse(t) {
            function e() {
              let t;
              return (
                (t = r.lexer.lex() || 1),
                typeof t !== "number" && (t = r.symbols_[t] || t),
                t
              );
            }
            var r = this;
            let s = [0];
            let i = [null];
            let a = [];
            const n = this.table;
            let o = "";
            let c = 0;
            let h = 0;
            let l = 0;
            this.lexer.setInput(t),
              (this.lexer.yy = this.yy),
              (this.yy.lexer = this.lexer),
              (this.yy.parser = this),
              typeof this.lexer.yylloc === "undefined" &&
                (this.lexer.yylloc = {});
            let p = this.lexer.yylloc;
            a.push(p);
            const u = this.lexer.options && this.lexer.options.ranges;
            typeof this.yy.parseError === "function" &&
              (this.parseError = this.yy.parseError);
            for (var f, d, m, g, v, y, k, S, b, _ = {}; ; ) {
              if (
                ((m = s[s.length - 1]),
                this.defaultActions[m]
                  ? (g = this.defaultActions[m])
                  : ((f !== null && typeof f !== "undefined") || (f = e()),
                    (g = n[m] && n[m][f])),
                typeof g === "undefined" || !g.length || !g[0])
              ) {
                let P = "";
                if (!l) {
                  b = [];
                  for (y in n[m])
                    this.terminals_[y] &&
                      y > 2 &&
                      b.push(`'${this.terminals_[y]}'`);
                  (P = this.lexer.showPosition
                    ? `Parse error on line ${c +
                        1}:\n${this.lexer.showPosition()}\nExpecting ${b.join(
                        ", ",
                      )}, got '${this.terminals_[f] || f}'`
                    : `Parse error on line ${c + 1}: Unexpected ${
                        f == 1 ? "end of input" : `'${this.terminals_[f] || f}'`
                      }`),
                    this.parseError(P, {
                      text: this.lexer.match,
                      token: this.terminals_[f] || f,
                      line: this.lexer.yylineno,
                      loc: p,
                      expected: b,
                    });
                }
              }
              if (g[0] instanceof Array && g.length > 1)
                throw new Error(
                  `Parse Error: multiple actions possible at state: ${m}, token: ${f}`,
                );
              switch (g[0]) {
                case 1:
                  s.push(f),
                    i.push(this.lexer.yytext),
                    a.push(this.lexer.yylloc),
                    s.push(g[1]),
                    (f = null),
                    d
                      ? ((f = d), (d = null))
                      : ((h = this.lexer.yyleng),
                        (o = this.lexer.yytext),
                        (c = this.lexer.yylineno),
                        (p = this.lexer.yylloc),
                        l > 0 && l--);
                  break;
                case 2:
                  if (
                    ((k = this.productions_[g[1]][1]),
                    (_.$ = i[i.length - k]),
                    (_._$ = {
                      first_line: a[a.length - (k || 1)].first_line,
                      last_line: a[a.length - 1].last_line,
                      first_column: a[a.length - (k || 1)].first_column,
                      last_column: a[a.length - 1].last_column,
                    }),
                    u &&
                      (_._$.range = [
                        a[a.length - (k || 1)].range[0],
                        a[a.length - 1].range[1],
                      ]),
                    (v = this.performAction.call(
                      _,
                      o,
                      h,
                      c,
                      this.yy,
                      g[1],
                      i,
                      a,
                    )),
                    typeof v !== "undefined")
                  )
                    return v;
                  k &&
                    ((s = s.slice(0, -1 * k * 2)),
                    (i = i.slice(0, -1 * k)),
                    (a = a.slice(0, -1 * k))),
                    s.push(this.productions_[g[1]][0]),
                    i.push(_.$),
                    a.push(_._$),
                    (S = n[s[s.length - 2]][s[s.length - 1]]),
                    s.push(S);
                  break;
                case 3:
                  return !0;
              }
            }
            return !0;
          },
        };
        const r = (function() {
          const t = {
            EOF: 1,
            parseError(t, e) {
              if (!this.yy.parser) throw new Error(t);
              this.yy.parser.parseError(t, e);
            },
            setInput(t) {
              return (
                (this._input = t),
                (this._more = this._less = this.done = !1),
                (this.yylineno = this.yyleng = 0),
                (this.yytext = this.matched = this.match = ""),
                (this.conditionStack = ["INITIAL"]),
                (this.yylloc = {
                  first_line: 1,
                  first_column: 0,
                  last_line: 1,
                  last_column: 0,
                }),
                this.options.ranges && (this.yylloc.range = [0, 0]),
                (this.offset = 0),
                this
              );
            },
            input() {
              const t = this._input[0];
              (this.yytext += t),
                this.yyleng++,
                this.offset++,
                (this.match += t),
                (this.matched += t);
              const e = t.match(/(?:\r\n?|\n).*/g);
              return (
                e
                  ? (this.yylineno++, this.yylloc.last_line++)
                  : this.yylloc.last_column++,
                this.options.ranges && this.yylloc.range[1]++,
                (this._input = this._input.slice(1)),
                t
              );
            },
            unput(t) {
              const e = t.length;
              const r = t.split(/(?:\r\n?|\n)/g);
              (this._input = t + this._input),
                (this.yytext = this.yytext.substr(
                  0,
                  this.yytext.length - e - 1,
                )),
                (this.offset -= e);
              const s = this.match.split(/(?:\r\n?|\n)/g);
              (this.match = this.match.substr(0, this.match.length - 1)),
                (this.matched = this.matched.substr(
                  0,
                  this.matched.length - 1,
                )),
                r.length - 1 && (this.yylineno -= r.length - 1);
              const i = this.yylloc.range;
              return (
                (this.yylloc = {
                  first_line: this.yylloc.first_line,
                  last_line: this.yylineno + 1,
                  first_column: this.yylloc.first_column,
                  last_column: r
                    ? (r.length === s.length ? this.yylloc.first_column : 0) +
                      s[s.length - r.length].length -
                      r[0].length
                    : this.yylloc.first_column - e,
                }),
                this.options.ranges &&
                  (this.yylloc.range = [i[0], i[0] + this.yyleng - e]),
                this
              );
            },
            more() {
              return (this._more = !0), this;
            },
            less(t) {
              this.unput(this.match.slice(t));
            },
            pastInput() {
              const t = this.matched.substr(
                0,
                this.matched.length - this.match.length,
              );
              return (
                (t.length > 20 ? "..." : "") + t.substr(-20).replace(/\n/g, "")
              );
            },
            upcomingInput() {
              let t = this.match;
              return (
                t.length < 20 && (t += this._input.substr(0, 20 - t.length)),
                (t.substr(0, 20) + (t.length > 20 ? "..." : "")).replace(
                  /\n/g,
                  "",
                )
              );
            },
            showPosition() {
              const t = this.pastInput();
              const e = new Array(t.length + 1).join("-");
              return `${t + this.upcomingInput()}\n${e}^`;
            },
            next() {
              if (this.done) return this.EOF;
              this._input || (this.done = !0);
              let t;
              let e;
              let r;
              let s;
              let i;
              this._more || ((this.yytext = ""), (this.match = ""));
              for (
                var a = this._currentRules(), n = 0;
                n < a.length &&
                ((r = this._input.match(this.rules[a[n]])),
                !r ||
                  (e && !(r[0].length > e[0].length)) ||
                  ((e = r), (s = n), this.options.flex));
                n++
              );
              return e
                ? ((i = e[0].match(/(?:\r\n?|\n).*/g)),
                  i && (this.yylineno += i.length),
                  (this.yylloc = {
                    first_line: this.yylloc.last_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.last_column,
                    last_column: i
                      ? i[i.length - 1].length -
                        i[i.length - 1].match(/\r?\n?/)[0].length
                      : this.yylloc.last_column + e[0].length,
                  }),
                  (this.yytext += e[0]),
                  (this.match += e[0]),
                  (this.matches = e),
                  (this.yyleng = this.yytext.length),
                  this.options.ranges &&
                    (this.yylloc.range = [
                      this.offset,
                      (this.offset += this.yyleng),
                    ]),
                  (this._more = !1),
                  (this._input = this._input.slice(e[0].length)),
                  (this.matched += e[0]),
                  (t = this.performAction.call(
                    this,
                    this.yy,
                    this,
                    a[s],
                    this.conditionStack[this.conditionStack.length - 1],
                  )),
                  this.done && this._input && (this.done = !1),
                  t || void 0)
                : this._input === ""
                ? this.EOF
                : this.parseError(
                    `Lexical error on line ${this.yylineno +
                      1}. Unrecognized text.\n${this.showPosition()}`,
                    { text: "", token: null, line: this.yylineno },
                  );
            },
            lex() {
              const t = this.next();
              return typeof t !== "undefined" ? t : this.lex();
            },
            begin(t) {
              this.conditionStack.push(t);
            },
            popState() {
              return this.conditionStack.pop();
            },
            _currentRules() {
              return this.conditions[
                this.conditionStack[this.conditionStack.length - 1]
              ].rules;
            },
            topState() {
              return this.conditionStack[this.conditionStack.length - 2];
            },
            pushState(t) {
              this.begin(t);
            },
          };
          return (
            (t.options = {}),
            (t.performAction = function(t, e, r, s) {
              function i(t, r) {
                return (e.yytext = e.yytext.substr(t, e.yyleng - r));
              }
              switch (r) {
                case 0:
                  if (
                    (e.yytext.slice(-2) === "\\\\"
                      ? (i(0, 1), this.begin("mu"))
                      : e.yytext.slice(-1) === "\\"
                      ? (i(0, 1), this.begin("emu"))
                      : this.begin("mu"),
                    e.yytext)
                  )
                    return 15;
                  break;
                case 1:
                  return 15;
                case 2:
                  return this.popState(), 15;
                case 3:
                  return this.begin("raw"), 15;
                case 4:
                  return (
                    this.popState(),
                    this.conditionStack[this.conditionStack.length - 1] ===
                    "raw"
                      ? 15
                      : ((e.yytext = e.yytext.substr(5, e.yyleng - 9)),
                        "END_RAW_BLOCK")
                  );
                case 5:
                  return 15;
                case 6:
                  return this.popState(), 14;
                case 7:
                  return 65;
                case 8:
                  return 68;
                case 9:
                  return 19;
                case 10:
                  return this.popState(), this.begin("raw"), 23;
                case 11:
                  return 55;
                case 12:
                  return 60;
                case 13:
                  return 29;
                case 14:
                  return 47;
                case 15:
                  return this.popState(), 44;
                case 16:
                  return this.popState(), 44;
                case 17:
                  return 34;
                case 18:
                  return 39;
                case 19:
                  return 51;
                case 20:
                  return 48;
                case 21:
                  this.unput(e.yytext), this.popState(), this.begin("com");
                  break;
                case 22:
                  return this.popState(), 14;
                case 23:
                  return 48;
                case 24:
                  return 73;
                case 25:
                  return 72;
                case 26:
                  return 72;
                case 27:
                  return 87;
                case 28:
                  break;
                case 29:
                  return this.popState(), 54;
                case 30:
                  return this.popState(), 33;
                case 31:
                  return (e.yytext = i(1, 2).replace(/\\"/g, '"')), 80;
                case 32:
                  return (e.yytext = i(1, 2).replace(/\\'/g, "'")), 80;
                case 33:
                  return 85;
                case 34:
                  return 82;
                case 35:
                  return 82;
                case 36:
                  return 83;
                case 37:
                  return 84;
                case 38:
                  return 81;
                case 39:
                  return 75;
                case 40:
                  return 77;
                case 41:
                  return 72;
                case 42:
                  return (e.yytext = e.yytext.replace(/\\([\\\]])/g, "$1")), 72;
                case 43:
                  return "INVALID";
                case 44:
                  return 5;
              }
            }),
            (t.rules = [
              /^(?:[^\x00]*?(?=(\{\{)))/,
              /^(?:[^\x00]+)/,
              /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,
              /^(?:\{\{\{\{(?=[^\/]))/,
              /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,
              /^(?:[^\x00]*?(?=(\{\{\{\{)))/,
              /^(?:[\s\S]*?--(~)?\}\})/,
              /^(?:\()/,
              /^(?:\))/,
              /^(?:\{\{\{\{)/,
              /^(?:\}\}\}\})/,
              /^(?:\{\{(~)?>)/,
              /^(?:\{\{(~)?#>)/,
              /^(?:\{\{(~)?#\*?)/,
              /^(?:\{\{(~)?\/)/,
              /^(?:\{\{(~)?\^\s*(~)?\}\})/,
              /^(?:\{\{(~)?\s*else\s*(~)?\}\})/,
              /^(?:\{\{(~)?\^)/,
              /^(?:\{\{(~)?\s*else\b)/,
              /^(?:\{\{(~)?\{)/,
              /^(?:\{\{(~)?&)/,
              /^(?:\{\{(~)?!--)/,
              /^(?:\{\{(~)?![\s\S]*?\}\})/,
              /^(?:\{\{(~)?\*?)/,
              /^(?:=)/,
              /^(?:\.\.)/,
              /^(?:\.(?=([=~}\s\/.)|])))/,
              /^(?:[\/.])/,
              /^(?:\s+)/,
              /^(?:\}(~)?\}\})/,
              /^(?:(~)?\}\})/,
              /^(?:"(\\["]|[^"])*")/,
              /^(?:'(\\[']|[^'])*')/,
              /^(?:@)/,
              /^(?:true(?=([~}\s)])))/,
              /^(?:false(?=([~}\s)])))/,
              /^(?:undefined(?=([~}\s)])))/,
              /^(?:null(?=([~}\s)])))/,
              /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,
              /^(?:as\s+\|)/,
              /^(?:\|)/,
              /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,
              /^(?:\[(\\\]|[^\]])*\])/,
              /^(?:.)/,
              /^(?:$)/,
            ]),
            (t.conditions = {
              mu: {
                rules: [
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                  13,
                  14,
                  15,
                  16,
                  17,
                  18,
                  19,
                  20,
                  21,
                  22,
                  23,
                  24,
                  25,
                  26,
                  27,
                  28,
                  29,
                  30,
                  31,
                  32,
                  33,
                  34,
                  35,
                  36,
                  37,
                  38,
                  39,
                  40,
                  41,
                  42,
                  43,
                  44,
                ],
                inclusive: !1,
              },
              emu: { rules: [2], inclusive: !1 },
              com: { rules: [6], inclusive: !1 },
              raw: { rules: [3, 4, 5], inclusive: !1 },
              INITIAL: { rules: [0, 1, 44], inclusive: !0 },
            }),
            t
          );
        })();
        return (e.lexer = r), (t.prototype = e), (e.Parser = t), new t();
      })();
      (e.__esModule = !0), (e.default = r);
    },
    function(t, e, r) {
      function s() {
        const t =
          arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
        this.options = t;
      }
      function i(t, e, r) {
        void 0 === e && (e = t.length);
        const s = t[e - 1];
        const i = t[e - 2];
        return s
          ? s.type === "ContentStatement"
            ? (i || !r ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(s.original)
            : void 0
          : r;
      }
      function a(t, e, r) {
        void 0 === e && (e = -1);
        const s = t[e + 1];
        const i = t[e + 2];
        return s
          ? s.type === "ContentStatement"
            ? (i || !r ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(s.original)
            : void 0
          : r;
      }
      function n(t, e, r) {
        const s = t[e == null ? 0 : e + 1];
        if (s && s.type === "ContentStatement" && (r || !s.rightStripped)) {
          const i = s.value;
          (s.value = s.value.replace(r ? /^\s+/ : /^[ \t]*\r?\n?/, "")),
            (s.rightStripped = s.value !== i);
        }
      }
      function o(t, e, r) {
        const s = t[e == null ? t.length - 1 : e - 1];
        if (s && s.type === "ContentStatement" && (r || !s.leftStripped)) {
          const i = s.value;
          return (
            (s.value = s.value.replace(r ? /\s+$/ : /[ \t]+$/, "")),
            (s.leftStripped = s.value !== i),
            s.leftStripped
          );
        }
      }
      const c = r(1).default;
      e.__esModule = !0;
      const h = r(25);
      const l = c(h);
      (s.prototype = new l.default()),
        (s.prototype.Program = function(t) {
          const e = !this.options.ignoreStandalone;
          const r = !this.isRootSeen;
          this.isRootSeen = !0;
          for (let s = t.body, c = 0, h = s.length; c < h; c++) {
            const l = s[c];
            const p = this.accept(l);
            if (p) {
              const u = i(s, c, r);
              const f = a(s, c, r);
              const d = p.openStandalone && u;
              const m = p.closeStandalone && f;
              const g = p.inlineStandalone && u && f;
              p.close && n(s, c, !0),
                p.open && o(s, c, !0),
                e &&
                  g &&
                  (n(s, c),
                  o(s, c) &&
                    l.type === "PartialStatement" &&
                    (l.indent = /([ \t]+$)/.exec(s[c - 1].original)[1])),
                e && d && (n((l.program || l.inverse).body), o(s, c)),
                e && m && (n(s, c), o((l.inverse || l.program).body));
            }
          }
          return t;
        }),
        (s.prototype.BlockStatement = s.prototype.DecoratorBlock = s.prototype.PartialBlockStatement = function(
          t,
        ) {
          this.accept(t.program), this.accept(t.inverse);
          const e = t.program || t.inverse;
          const r = t.program && t.inverse;
          let s = r;
          let c = r;
          if (r && r.chained)
            for (s = r.body[0].program; c.chained; )
              c = c.body[c.body.length - 1].program;
          const h = {
            open: t.openStrip.open,
            close: t.closeStrip.close,
            openStandalone: a(e.body),
            closeStandalone: i((s || e).body),
          };
          if ((t.openStrip.close && n(e.body, null, !0), r)) {
            const l = t.inverseStrip;
            l.open && o(e.body, null, !0),
              l.close && n(s.body, null, !0),
              t.closeStrip.open && o(c.body, null, !0),
              !this.options.ignoreStandalone &&
                i(e.body) &&
                a(s.body) &&
                (o(e.body), n(s.body));
          } else t.closeStrip.open && o(e.body, null, !0);
          return h;
        }),
        (s.prototype.Decorator = s.prototype.MustacheStatement = function(t) {
          return t.strip;
        }),
        (s.prototype.PartialStatement = s.prototype.CommentStatement = function(
          t,
        ) {
          const e = t.strip || {};
          return { inlineStandalone: !0, open: e.open, close: e.close };
        }),
        (e.default = s),
        (t.exports = e.default);
    },
    function(t, e, r) {
      function s() {
        this.parents = [];
      }
      function i(t) {
        this.acceptRequired(t, "path"),
          this.acceptArray(t.params),
          this.acceptKey(t, "hash");
      }
      function a(t) {
        i.call(this, t),
          this.acceptKey(t, "program"),
          this.acceptKey(t, "inverse");
      }
      function n(t) {
        this.acceptRequired(t, "name"),
          this.acceptArray(t.params),
          this.acceptKey(t, "hash");
      }
      const o = r(1).default;
      e.__esModule = !0;
      const c = r(6);
      const h = o(c);
      (s.prototype = {
        constructor: s,
        mutating: !1,
        acceptKey(t, e) {
          const r = this.accept(t[e]);
          if (this.mutating) {
            if (r && !s.prototype[r.type])
              throw new h.default(
                `Unexpected node type "${r.type}" found when accepting ${e} on ${t.type}`,
              );
            t[e] = r;
          }
        },
        acceptRequired(t, e) {
          if ((this.acceptKey(t, e), !t[e]))
            throw new h.default(`${t.type} requires ${e}`);
        },
        acceptArray(t) {
          for (let e = 0, r = t.length; e < r; e++)
            this.acceptKey(t, e), t[e] || (t.splice(e, 1), e--, r--);
        },
        accept(t) {
          if (t) {
            if (!this[t.type])
              throw new h.default(`Unknown type: ${t.type}`, t);
            this.current && this.parents.unshift(this.current),
              (this.current = t);
            const e = this[t.type](t);
            return (
              (this.current = this.parents.shift()),
              !this.mutating || e ? e : e !== !1 ? t : void 0
            );
          }
        },
        Program(t) {
          this.acceptArray(t.body);
        },
        MustacheStatement: i,
        Decorator: i,
        BlockStatement: a,
        DecoratorBlock: a,
        PartialStatement: n,
        PartialBlockStatement(t) {
          n.call(this, t), this.acceptKey(t, "program");
        },
        ContentStatement() {},
        CommentStatement() {},
        SubExpression: i,
        PathExpression() {},
        StringLiteral() {},
        NumberLiteral() {},
        BooleanLiteral() {},
        UndefinedLiteral() {},
        NullLiteral() {},
        Hash(t) {
          this.acceptArray(t.pairs);
        },
        HashPair(t) {
          this.acceptRequired(t, "value");
        },
      }),
        (e.default = s),
        (t.exports = e.default);
    },
    function(t, e, r) {
      function s(t, e) {
        if (((e = e.path ? e.path.original : e), t.path.original !== e)) {
          const r = { loc: t.path.loc };
          throw new g.default(`${t.path.original} doesn't match ${e}`, r);
        }
      }
      function i(t, e) {
        (this.source = t),
          (this.start = { line: e.first_line, column: e.first_column }),
          (this.end = { line: e.last_line, column: e.last_column });
      }
      function a(t) {
        return /^\[.*\]$/.test(t) ? t.substr(1, t.length - 2) : t;
      }
      function n(t, e) {
        return {
          open: t.charAt(2) === "~",
          close: e.charAt(e.length - 3) === "~",
        };
      }
      function o(t) {
        return t.replace(/^\{\{~?\!-?-?/, "").replace(/-?-?~?\}\}$/, "");
      }
      function c(t, e, r) {
        r = this.locInfo(r);
        for (
          var s = t ? "@" : "", i = [], a = 0, n = "", o = 0, c = e.length;
          o < c;
          o++
        ) {
          const h = e[o].part;
          const l = e[o].original !== h;
          if (
            ((s += (e[o].separator || "") + h),
            l || (h !== ".." && h !== "." && h !== "this"))
          )
            i.push(h);
          else {
            if (i.length > 0)
              throw new g.default(`Invalid path: ${s}`, { loc: r });
            h === ".." && (a++, (n += "../"));
          }
        }
        return {
          type: "PathExpression",
          data: t,
          depth: a,
          parts: i,
          original: s,
          loc: r,
        };
      }
      function h(t, e, r, s, i, a) {
        const n = s.charAt(3) || s.charAt(2);
        const o = n !== "{" && n !== "&";
        const c = /\*/.test(s);
        return {
          type: c ? "Decorator" : "MustacheStatement",
          path: t,
          params: e,
          hash: r,
          escaped: o,
          strip: i,
          loc: this.locInfo(a),
        };
      }
      function l(t, e, r, i) {
        s(t, r), (i = this.locInfo(i));
        const a = { type: "Program", body: e, strip: {}, loc: i };
        return {
          type: "BlockStatement",
          path: t.path,
          params: t.params,
          hash: t.hash,
          program: a,
          openStrip: {},
          inverseStrip: {},
          closeStrip: {},
          loc: i,
        };
      }
      function p(t, e, r, i, a, n) {
        i && i.path && s(t, i);
        const o = /\*/.test(t.open);
        e.blockParams = t.blockParams;
        let c = void 0;
        let h = void 0;
        if (r) {
          if (o)
            throw new g.default("Unexpected inverse block on decorator", r);
          r.chain && (r.program.body[0].closeStrip = i.strip),
            (h = r.strip),
            (c = r.program);
        }
        return (
          a && ((a = c), (c = e), (e = a)),
          {
            type: o ? "DecoratorBlock" : "BlockStatement",
            path: t.path,
            params: t.params,
            hash: t.hash,
            program: e,
            inverse: c,
            openStrip: t.strip,
            inverseStrip: h,
            closeStrip: i && i.strip,
            loc: this.locInfo(n),
          }
        );
      }
      function u(t, e) {
        if (!e && t.length) {
          const r = t[0].loc;
          const s = t[t.length - 1].loc;
          r &&
            s &&
            (e = {
              source: r.source,
              start: { line: r.start.line, column: r.start.column },
              end: { line: s.end.line, column: s.end.column },
            });
        }
        return { type: "Program", body: t, strip: {}, loc: e };
      }
      function f(t, e, r, i) {
        return (
          s(t, r),
          {
            type: "PartialBlockStatement",
            name: t.path,
            params: t.params,
            hash: t.hash,
            program: e,
            openStrip: t.strip,
            closeStrip: r && r.strip,
            loc: this.locInfo(i),
          }
        );
      }
      const d = r(1).default;
      (e.__esModule = !0),
        (e.SourceLocation = i),
        (e.id = a),
        (e.stripFlags = n),
        (e.stripComment = o),
        (e.preparePath = c),
        (e.prepareMustache = h),
        (e.prepareRawBlock = l),
        (e.prepareBlock = p),
        (e.prepareProgram = u),
        (e.preparePartialBlock = f);
      const m = r(6);
      var g = d(m);
    },
    function(t, e, r) {
      function s() {}
      function i(t, e, r) {
        if (t == null || (typeof t !== "string" && t.type !== "Program"))
          throw new l.default(
            `You must pass a string or Handlebars AST to Handlebars.precompile. You passed ${t}`,
          );
        (e = e || {}),
          "data" in e || (e.data = !0),
          e.compat && (e.useDepths = !0);
        const s = r.parse(t, e);
        const i = new r.Compiler().compile(s, e);
        return new r.JavaScriptCompiler().compile(i, e);
      }
      function a(t, e, r) {
        function s() {
          const s = r.parse(t, e);
          const i = new r.Compiler().compile(s, e);
          const a = new r.JavaScriptCompiler().compile(i, e, void 0, !0);
          return r.template(a);
        }
        function i(t, e) {
          return a || (a = s()), a.call(this, t, e);
        }
        if (
          (void 0 === e && (e = {}),
          t == null || (typeof t !== "string" && t.type !== "Program"))
        )
          throw new l.default(
            `You must pass a string or Handlebars AST to Handlebars.compile. You passed ${t}`,
          );
        "data" in e || (e.data = !0), e.compat && (e.useDepths = !0);
        var a = void 0;
        return (
          (i._setup = function(t) {
            return a || (a = s()), a._setup(t);
          }),
          (i._child = function(t, e, r, i) {
            return a || (a = s()), a._child(t, e, r, i);
          }),
          i
        );
      }
      function n(t, e) {
        if (t === e) return !0;
        if (p.isArray(t) && p.isArray(e) && t.length === e.length) {
          for (let r = 0; r < t.length; r++) if (!n(t[r], e[r])) return !1;
          return !0;
        }
      }
      function o(t) {
        if (!t.path.parts) {
          const e = t.path;
          t.path = {
            type: "PathExpression",
            data: !1,
            depth: 0,
            parts: [`${e.original}`],
            original: `${e.original}`,
            loc: e.loc,
          };
        }
      }
      const c = r(1).default;
      (e.__esModule = !0),
        (e.Compiler = s),
        (e.precompile = i),
        (e.compile = a);
      const h = r(6);
      var l = c(h);
      var p = r(5);
      const u = r(21);
      const f = c(u);
      const d = [].slice;
      s.prototype = {
        compiler: s,
        equals(t) {
          let e = this.opcodes.length;
          if (t.opcodes.length !== e) return !1;
          for (var r = 0; r < e; r++) {
            const s = this.opcodes[r];
            const i = t.opcodes[r];
            if (s.opcode !== i.opcode || !n(s.args, i.args)) return !1;
          }
          e = this.children.length;
          for (var r = 0; r < e; r++)
            if (!this.children[r].equals(t.children[r])) return !1;
          return !0;
        },
        guid: 0,
        compile(t, e) {
          (this.sourceNode = []),
            (this.opcodes = []),
            (this.children = []),
            (this.options = e),
            (this.stringParams = e.stringParams),
            (this.trackIds = e.trackIds),
            (e.blockParams = e.blockParams || []);
          const r = e.knownHelpers;
          if (
            ((e.knownHelpers = {
              helperMissing: !0,
              blockHelperMissing: !0,
              each: !0,
              if: !0,
              unless: !0,
              with: !0,
              log: !0,
              lookup: !0,
            }),
            r)
          )
            for (const s in r) s in r && (e.knownHelpers[s] = r[s]);
          return this.accept(t);
        },
        compileProgram(t) {
          const e = new this.compiler();
          const r = e.compile(t, this.options);
          const s = this.guid++;
          return (
            (this.usePartial = this.usePartial || r.usePartial),
            (this.children[s] = r),
            (this.useDepths = this.useDepths || r.useDepths),
            s
          );
        },
        accept(t) {
          if (!this[t.type]) throw new l.default(`Unknown type: ${t.type}`, t);
          this.sourceNode.unshift(t);
          const e = this[t.type](t);
          return this.sourceNode.shift(), e;
        },
        Program(t) {
          this.options.blockParams.unshift(t.blockParams);
          for (var e = t.body, r = e.length, s = 0; s < r; s++)
            this.accept(e[s]);
          return (
            this.options.blockParams.shift(),
            (this.isSimple = r === 1),
            (this.blockParams = t.blockParams ? t.blockParams.length : 0),
            this
          );
        },
        BlockStatement(t) {
          o(t);
          let e = t.program;
          let r = t.inverse;
          (e = e && this.compileProgram(e)), (r = r && this.compileProgram(r));
          const s = this.classifySexpr(t);
          s === "helper"
            ? this.helperSexpr(t, e, r)
            : s === "simple"
            ? (this.simpleSexpr(t),
              this.opcode("pushProgram", e),
              this.opcode("pushProgram", r),
              this.opcode("emptyHash"),
              this.opcode("blockValue", t.path.original))
            : (this.ambiguousSexpr(t, e, r),
              this.opcode("pushProgram", e),
              this.opcode("pushProgram", r),
              this.opcode("emptyHash"),
              this.opcode("ambiguousBlockValue")),
            this.opcode("append");
        },
        DecoratorBlock(t) {
          const e = t.program && this.compileProgram(t.program);
          const r = this.setupFullMustacheParams(t, e, void 0);
          const s = t.path;
          (this.useDecorators = !0),
            this.opcode("registerDecorator", r.length, s.original);
        },
        PartialStatement(t) {
          this.usePartial = !0;
          let e = t.program;
          e && (e = this.compileProgram(t.program));
          const r = t.params;
          if (r.length > 1)
            throw new l.default(
              `Unsupported number of partial arguments: ${r.length}`,
              t,
            );
          r.length ||
            (this.options.explicitPartialContext
              ? this.opcode("pushLiteral", "undefined")
              : r.push({ type: "PathExpression", parts: [], depth: 0 }));
          const s = t.name.original;
          const i = t.name.type === "SubExpression";
          i && this.accept(t.name),
            this.setupFullMustacheParams(t, e, void 0, !0);
          let a = t.indent || "";
          this.options.preventIndent &&
            a &&
            (this.opcode("appendContent", a), (a = "")),
            this.opcode("invokePartial", i, s, a),
            this.opcode("append");
        },
        PartialBlockStatement(t) {
          this.PartialStatement(t);
        },
        MustacheStatement(t) {
          this.SubExpression(t),
            t.escaped && !this.options.noEscape
              ? this.opcode("appendEscaped")
              : this.opcode("append");
        },
        Decorator(t) {
          this.DecoratorBlock(t);
        },
        ContentStatement(t) {
          t.value && this.opcode("appendContent", t.value);
        },
        CommentStatement() {},
        SubExpression(t) {
          o(t);
          const e = this.classifySexpr(t);
          e === "simple"
            ? this.simpleSexpr(t)
            : e === "helper"
            ? this.helperSexpr(t)
            : this.ambiguousSexpr(t);
        },
        ambiguousSexpr(t, e, r) {
          const s = t.path;
          const i = s.parts[0];
          const a = e != null || r != null;
          this.opcode("getContext", s.depth),
            this.opcode("pushProgram", e),
            this.opcode("pushProgram", r),
            (s.strict = !0),
            this.accept(s),
            this.opcode("invokeAmbiguous", i, a);
        },
        simpleSexpr(t) {
          const e = t.path;
          (e.strict = !0), this.accept(e), this.opcode("resolvePossibleLambda");
        },
        helperSexpr(t, e, r) {
          const s = this.setupFullMustacheParams(t, e, r);
          const i = t.path;
          const a = i.parts[0];
          if (this.options.knownHelpers[a])
            this.opcode("invokeKnownHelper", s.length, a);
          else {
            if (this.options.knownHelpersOnly)
              throw new l.default(
                `You specified knownHelpersOnly, but used the unknown helper ${a}`,
                t,
              );
            (i.strict = !0),
              (i.falsy = !0),
              this.accept(i),
              this.opcode(
                "invokeHelper",
                s.length,
                i.original,
                f.default.helpers.simpleId(i),
              );
          }
        },
        PathExpression(t) {
          this.addDepth(t.depth), this.opcode("getContext", t.depth);
          const e = t.parts[0];
          const r = f.default.helpers.scopedId(t);
          const s = !t.depth && !r && this.blockParamIndex(e);
          s
            ? this.opcode("lookupBlockParam", s, t.parts)
            : e
            ? t.data
              ? ((this.options.data = !0),
                this.opcode("lookupData", t.depth, t.parts, t.strict))
              : this.opcode("lookupOnContext", t.parts, t.falsy, t.strict, r)
            : this.opcode("pushContext");
        },
        StringLiteral(t) {
          this.opcode("pushString", t.value);
        },
        NumberLiteral(t) {
          this.opcode("pushLiteral", t.value);
        },
        BooleanLiteral(t) {
          this.opcode("pushLiteral", t.value);
        },
        UndefinedLiteral() {
          this.opcode("pushLiteral", "undefined");
        },
        NullLiteral() {
          this.opcode("pushLiteral", "null");
        },
        Hash(t) {
          const e = t.pairs;
          let r = 0;
          const s = e.length;
          for (this.opcode("pushHash"); r < s; r++) this.pushParam(e[r].value);
          for (; r--; ) this.opcode("assignToHash", e[r].key);
          this.opcode("popHash");
        },
        opcode(t) {
          this.opcodes.push({
            opcode: t,
            args: d.call(arguments, 1),
            loc: this.sourceNode[0].loc,
          });
        },
        addDepth(t) {
          t && (this.useDepths = !0);
        },
        classifySexpr(t) {
          const e = f.default.helpers.simpleId(t.path);
          const r = e && !!this.blockParamIndex(t.path.parts[0]);
          let s = !r && f.default.helpers.helperExpression(t);
          let i = !r && (s || e);
          if (i && !s) {
            const a = t.path.parts[0];
            const n = this.options;
            n.knownHelpers[a] ? (s = !0) : n.knownHelpersOnly && (i = !1);
          }
          return s ? "helper" : i ? "ambiguous" : "simple";
        },
        pushParams(t) {
          for (let e = 0, r = t.length; e < r; e++) this.pushParam(t[e]);
        },
        pushParam(t) {
          let e = t.value != null ? t.value : t.original || "";
          if (this.stringParams)
            e.replace &&
              (e = e.replace(/^(\.?\.\/)*/g, "").replace(/\//g, ".")),
              t.depth && this.addDepth(t.depth),
              this.opcode("getContext", t.depth || 0),
              this.opcode("pushStringParam", e, t.type),
              t.type === "SubExpression" && this.accept(t);
          else {
            if (this.trackIds) {
              let r = void 0;
              if (
                (!t.parts ||
                  f.default.helpers.scopedId(t) ||
                  t.depth ||
                  (r = this.blockParamIndex(t.parts[0])),
                r)
              ) {
                const s = t.parts.slice(1).join(".");
                this.opcode("pushId", "BlockParam", r, s);
              } else
                (e = t.original || e),
                  e.replace &&
                    (e = e
                      .replace(/^this(?:\.|$)/, "")
                      .replace(/^\.\//, "")
                      .replace(/^\.$/, "")),
                  this.opcode("pushId", t.type, e);
            }
            this.accept(t);
          }
        },
        setupFullMustacheParams(t, e, r, s) {
          const i = t.params;
          return (
            this.pushParams(i),
            this.opcode("pushProgram", e),
            this.opcode("pushProgram", r),
            t.hash ? this.accept(t.hash) : this.opcode("emptyHash", s),
            i
          );
        },
        blockParamIndex(t) {
          for (let e = 0, r = this.options.blockParams.length; e < r; e++) {
            const s = this.options.blockParams[e];
            const i = s && p.indexOf(s, t);
            if (s && i >= 0) return [e, i];
          }
        },
      };
    },
    function(t, e, r) {
      function s(t) {
        this.value = t;
      }
      function i() {}
      function a(t, e, r, s) {
        let i = e.popStack();
        let a = 0;
        let n = r.length;
        for (t && n--; a < n; a++) i = e.nameLookup(i, r[a], s);
        return t
          ? [
              e.aliasable("container.strict"),
              "(",
              i,
              ", ",
              e.quotedString(r[a]),
              ")",
            ]
          : i;
      }
      const n = r(1).default;
      e.__esModule = !0;
      const o = r(4);
      const c = r(6);
      const h = n(c);
      const l = r(5);
      const p = r(29);
      const u = n(p);
      (i.prototype = {
        nameLookup(t, e) {
          return i.isValidJavaScriptVariableName(e)
            ? [t, ".", e]
            : [t, "[", JSON.stringify(e), "]"];
        },
        depthedLookup(t) {
          return [this.aliasable("container.lookup"), '(depths, "', t, '")'];
        },
        compilerInfo() {
          const t = o.COMPILER_REVISION;
          const e = o.REVISION_CHANGES[t];
          return [t, e];
        },
        appendToBuffer(t, e, r) {
          return (
            l.isArray(t) || (t = [t]),
            (t = this.source.wrap(t, e)),
            this.environment.isSimple
              ? ["return ", t, ";"]
              : r
              ? ["buffer += ", t, ";"]
              : ((t.appendToBuffer = !0), t)
          );
        },
        initializeBuffer() {
          return this.quotedString("");
        },
        compile(t, e, r, s) {
          (this.environment = t),
            (this.options = e),
            (this.stringParams = this.options.stringParams),
            (this.trackIds = this.options.trackIds),
            (this.precompile = !s),
            (this.name = this.environment.name),
            (this.isChild = !!r),
            (this.context = r || {
              decorators: [],
              programs: [],
              environments: [],
            }),
            this.preamble(),
            (this.stackSlot = 0),
            (this.stackVars = []),
            (this.aliases = {}),
            (this.registers = { list: [] }),
            (this.hashes = []),
            (this.compileStack = []),
            (this.inlineStack = []),
            (this.blockParams = []),
            this.compileChildren(t, e),
            (this.useDepths =
              this.useDepths ||
              t.useDepths ||
              t.useDecorators ||
              this.options.compat),
            (this.useBlockParams = this.useBlockParams || t.useBlockParams);
          const i = t.opcodes;
          let a = void 0;
          let n = void 0;
          let o = void 0;
          let c = void 0;
          for (o = 0, c = i.length; o < c; o++)
            (a = i[o]),
              (this.source.currentLocation = a.loc),
              (n = n || a.loc),
              this[a.opcode].apply(this, a.args);
          if (
            ((this.source.currentLocation = n),
            this.pushSource(""),
            this.stackSlot ||
              this.inlineStack.length ||
              this.compileStack.length)
          )
            throw new h.default("Compile completed with content left on stack");
          this.decorators.isEmpty()
            ? (this.decorators = void 0)
            : ((this.useDecorators = !0),
              this.decorators.prepend(
                "var decorators = container.decorators;\n",
              ),
              this.decorators.push("return fn;"),
              s
                ? (this.decorators = Function.apply(this, [
                    "fn",
                    "props",
                    "container",
                    "depth0",
                    "data",
                    "blockParams",
                    "depths",
                    this.decorators.merge(),
                  ]))
                : (this.decorators.prepend(
                    "function(fn, props, container, depth0, data, blockParams, depths) {\n",
                  ),
                  this.decorators.push("}\n"),
                  (this.decorators = this.decorators.merge())));
          const l = this.createFunctionContext(s);
          if (this.isChild) return l;
          let p = { compiler: this.compilerInfo(), main: l };
          this.decorators &&
            ((p.main_d = this.decorators), (p.useDecorators = !0));
          const u = this.context;
          const f = u.programs;
          const d = u.decorators;
          for (o = 0, c = f.length; o < c; o++)
            f[o] &&
              ((p[o] = f[o]),
              d[o] && ((p[`${o}_d`] = d[o]), (p.useDecorators = !0)));
          return (
            this.environment.usePartial && (p.usePartial = !0),
            this.options.data && (p.useData = !0),
            this.useDepths && (p.useDepths = !0),
            this.useBlockParams && (p.useBlockParams = !0),
            this.options.compat && (p.compat = !0),
            s
              ? (p.compilerOptions = this.options)
              : ((p.compiler = JSON.stringify(p.compiler)),
                (this.source.currentLocation = {
                  start: { line: 1, column: 0 },
                }),
                (p = this.objectLiteral(p)),
                e.srcName
                  ? ((p = p.toStringWithSourceMap({ file: e.destName })),
                    (p.map = p.map && p.map.toString()))
                  : (p = p.toString())),
            p
          );
        },
        preamble() {
          (this.lastContext = 0),
            (this.source = new u.default(this.options.srcName)),
            (this.decorators = new u.default(this.options.srcName));
        },
        createFunctionContext(t) {
          let e = "";
          const r = this.stackVars.concat(this.registers.list);
          r.length > 0 && (e += `, ${r.join(", ")}`);
          let s = 0;
          for (const i in this.aliases) {
            const a = this.aliases[i];
            this.aliases.hasOwnProperty(i) &&
              a.children &&
              a.referenceCount > 1 &&
              ((e += `, alias${++s}=${i}`), (a.children[0] = `alias${s}`));
          }
          const n = ["container", "depth0", "helpers", "partials", "data"];
          (this.useBlockParams || this.useDepths) && n.push("blockParams"),
            this.useDepths && n.push("depths");
          const o = this.mergeSource(e);
          return t
            ? (n.push(o), Function.apply(this, n))
            : this.source.wrap(["function(", n.join(","), ") {\n  ", o, "}"]);
        },
        mergeSource(t) {
          const e = this.environment.isSimple;
          let r = !this.forceBuffer;
          let s = void 0;
          let i = void 0;
          let a = void 0;
          let n = void 0;
          return (
            this.source.each(function(t) {
              t.appendToBuffer
                ? (a ? t.prepend("  + ") : (a = t), (n = t))
                : (a &&
                    (i ? a.prepend("buffer += ") : (s = !0),
                    n.add(";"),
                    (a = n = void 0)),
                  (i = !0),
                  e || (r = !1));
            }),
            r
              ? a
                ? (a.prepend("return "), n.add(";"))
                : i || this.source.push('return "";')
              : ((t += `, buffer = ${s ? "" : this.initializeBuffer()}`),
                a
                  ? (a.prepend("return buffer + "), n.add(";"))
                  : this.source.push("return buffer;")),
            t && this.source.prepend(`var ${t.substring(2)}${s ? "" : ";\n"}`),
            this.source.merge()
          );
        },
        blockValue(t) {
          const e = this.aliasable("helpers.blockHelperMissing");
          const r = [this.contextName(0)];
          this.setupHelperArgs(t, 0, r);
          const s = this.popStack();
          r.splice(1, 0, s), this.push(this.source.functionCall(e, "call", r));
        },
        ambiguousBlockValue() {
          const t = this.aliasable("helpers.blockHelperMissing");
          const e = [this.contextName(0)];
          this.setupHelperArgs("", 0, e, !0), this.flushInline();
          const r = this.topStack();
          e.splice(1, 0, r),
            this.pushSource([
              "if (!",
              this.lastHelper,
              ") { ",
              r,
              " = ",
              this.source.functionCall(t, "call", e),
              "}",
            ]);
        },
        appendContent(t) {
          this.pendingContent
            ? (t = this.pendingContent + t)
            : (this.pendingLocation = this.source.currentLocation),
            (this.pendingContent = t);
        },
        append() {
          if (this.isInline())
            this.replaceStack(function(t) {
              return [" != null ? ", t, ' : ""'];
            }),
              this.pushSource(this.appendToBuffer(this.popStack()));
          else {
            const t = this.popStack();
            this.pushSource([
              "if (",
              t,
              " != null) { ",
              this.appendToBuffer(t, void 0, !0),
              " }",
            ]),
              this.environment.isSimple &&
                this.pushSource([
                  "else { ",
                  this.appendToBuffer("''", void 0, !0),
                  " }",
                ]);
          }
        },
        appendEscaped() {
          this.pushSource(
            this.appendToBuffer([
              this.aliasable("container.escapeExpression"),
              "(",
              this.popStack(),
              ")",
            ]),
          );
        },
        getContext(t) {
          this.lastContext = t;
        },
        pushContext() {
          this.pushStackLiteral(this.contextName(this.lastContext));
        },
        lookupOnContext(t, e, r, s) {
          let i = 0;
          s || !this.options.compat || this.lastContext
            ? this.pushContext()
            : this.push(this.depthedLookup(t[i++])),
            this.resolvePath("context", t, i, e, r);
        },
        lookupBlockParam(t, e) {
          (this.useBlockParams = !0),
            this.push(["blockParams[", t[0], "][", t[1], "]"]),
            this.resolvePath("context", e, 1);
        },
        lookupData(t, e, r) {
          t
            ? this.pushStackLiteral(`container.data(data, ${t})`)
            : this.pushStackLiteral("data"),
            this.resolvePath("data", e, 0, !0, r);
        },
        resolvePath(t, e, r, s, i) {
          const n = this;
          if (this.options.strict || this.options.assumeObjects)
            return void this.push(a(this.options.strict && i, this, e, t));
          for (let o = e.length; r < o; r++)
            this.replaceStack(function(i) {
              const a = n.nameLookup(i, e[r], t);
              return s ? [" && ", a] : [" != null ? ", a, " : ", i];
            });
        },
        resolvePossibleLambda() {
          this.push([
            this.aliasable("container.lambda"),
            "(",
            this.popStack(),
            ", ",
            this.contextName(0),
            ")",
          ]);
        },
        pushStringParam(t, e) {
          this.pushContext(),
            this.pushString(e),
            e !== "SubExpression" &&
              (typeof t === "string"
                ? this.pushString(t)
                : this.pushStackLiteral(t));
        },
        emptyHash(t) {
          this.trackIds && this.push("{}"),
            this.stringParams && (this.push("{}"), this.push("{}")),
            this.pushStackLiteral(t ? "undefined" : "{}");
        },
        pushHash() {
          this.hash && this.hashes.push(this.hash),
            (this.hash = { values: [], types: [], contexts: [], ids: [] });
        },
        popHash() {
          const t = this.hash;
          (this.hash = this.hashes.pop()),
            this.trackIds && this.push(this.objectLiteral(t.ids)),
            this.stringParams &&
              (this.push(this.objectLiteral(t.contexts)),
              this.push(this.objectLiteral(t.types))),
            this.push(this.objectLiteral(t.values));
        },
        pushString(t) {
          this.pushStackLiteral(this.quotedString(t));
        },
        pushLiteral(t) {
          this.pushStackLiteral(t);
        },
        pushProgram(t) {
          t != null
            ? this.pushStackLiteral(this.programExpression(t))
            : this.pushStackLiteral(null);
        },
        registerDecorator(t, e) {
          const r = this.nameLookup("decorators", e, "decorator");
          const s = this.setupHelperArgs(e, t);
          this.decorators.push([
            "fn = ",
            this.decorators.functionCall(r, "", [
              "fn",
              "props",
              "container",
              s,
            ]),
            " || fn;",
          ]);
        },
        invokeHelper(t, e, r) {
          const s = this.popStack();
          const i = this.setupHelper(t, e);
          const a = r ? [i.name, " || "] : "";
          const n = ["("].concat(a, s);
          this.options.strict ||
            n.push(" || ", this.aliasable("helpers.helperMissing")),
            n.push(")"),
            this.push(this.source.functionCall(n, "call", i.callParams));
        },
        invokeKnownHelper(t, e) {
          const r = this.setupHelper(t, e);
          this.push(this.source.functionCall(r.name, "call", r.callParams));
        },
        invokeAmbiguous(t, e) {
          this.useRegister("helper");
          const r = this.popStack();
          this.emptyHash();
          const s = this.setupHelper(0, t, e);
          const i = (this.lastHelper = this.nameLookup("helpers", t, "helper"));
          const a = ["(", "(helper = ", i, " || ", r, ")"];
          this.options.strict ||
            ((a[0] = "(helper = "),
            a.push(
              " != null ? helper : ",
              this.aliasable("helpers.helperMissing"),
            )),
            this.push([
              "(",
              a,
              s.paramsInit ? ["),(", s.paramsInit] : [],
              "),",
              "(typeof helper === ",
              this.aliasable('"function"'),
              " ? ",
              this.source.functionCall("helper", "call", s.callParams),
              " : helper))",
            ]);
        },
        invokePartial(t, e, r) {
          const s = [];
          let i = this.setupParams(e, 1, s);
          t && ((e = this.popStack()), delete i.name),
            r && (i.indent = JSON.stringify(r)),
            (i.helpers = "helpers"),
            (i.partials = "partials"),
            (i.decorators = "container.decorators"),
            t
              ? s.unshift(e)
              : s.unshift(this.nameLookup("partials", e, "partial")),
            this.options.compat && (i.depths = "depths"),
            (i = this.objectLiteral(i)),
            s.push(i),
            this.push(
              this.source.functionCall("container.invokePartial", "", s),
            );
        },
        assignToHash(t) {
          const e = this.popStack();
          let r = void 0;
          let s = void 0;
          let i = void 0;
          this.trackIds && (i = this.popStack()),
            this.stringParams && ((s = this.popStack()), (r = this.popStack()));
          const a = this.hash;
          r && (a.contexts[t] = r),
            s && (a.types[t] = s),
            i && (a.ids[t] = i),
            (a.values[t] = e);
        },
        pushId(t, e, r) {
          t === "BlockParam"
            ? this.pushStackLiteral(
                `blockParams[${e[0]}].path[${e[1]}]${
                  r ? ` + ${JSON.stringify(`.${r}`)}` : ""
                }`,
              )
            : t === "PathExpression"
            ? this.pushString(e)
            : t === "SubExpression"
            ? this.pushStackLiteral("true")
            : this.pushStackLiteral("null");
        },
        compiler: i,
        compileChildren(t, e) {
          for (
            let r = t.children, s = void 0, i = void 0, a = 0, n = r.length;
            a < n;
            a++
          ) {
            (s = r[a]), (i = new this.compiler());
            let o = this.matchExistingProgram(s);
            o == null
              ? (this.context.programs.push(""),
                (o = this.context.programs.length),
                (s.index = o),
                (s.name = `program${o}`),
                (this.context.programs[o] = i.compile(
                  s,
                  e,
                  this.context,
                  !this.precompile,
                )),
                (this.context.decorators[o] = i.decorators),
                (this.context.environments[o] = s),
                (this.useDepths = this.useDepths || i.useDepths),
                (this.useBlockParams = this.useBlockParams || i.useBlockParams))
              : ((s.index = o),
                (s.name = `program${o}`),
                (this.useDepths = this.useDepths || s.useDepths),
                (this.useBlockParams =
                  this.useBlockParams || s.useBlockParams));
          }
        },
        matchExistingProgram(t) {
          for (let e = 0, r = this.context.environments.length; e < r; e++) {
            const s = this.context.environments[e];
            if (s && s.equals(t)) return e;
          }
        },
        programExpression(t) {
          const e = this.environment.children[t];
          const r = [e.index, "data", e.blockParams];
          return (
            (this.useBlockParams || this.useDepths) && r.push("blockParams"),
            this.useDepths && r.push("depths"),
            `container.program(${r.join(", ")})`
          );
        },
        useRegister(t) {
          this.registers[t] ||
            ((this.registers[t] = !0), this.registers.list.push(t));
        },
        push(t) {
          return (
            t instanceof s || (t = this.source.wrap(t)),
            this.inlineStack.push(t),
            t
          );
        },
        pushStackLiteral(t) {
          this.push(new s(t));
        },
        pushSource(t) {
          this.pendingContent &&
            (this.source.push(
              this.appendToBuffer(
                this.source.quotedString(this.pendingContent),
                this.pendingLocation,
              ),
            ),
            (this.pendingContent = void 0)),
            t && this.source.push(t);
        },
        replaceStack(t) {
          let e = ["("];
          let r = void 0;
          let i = void 0;
          let a = void 0;
          if (!this.isInline())
            throw new h.default("replaceStack on non-inline");
          const n = this.popStack(!0);
          if (n instanceof s) (r = [n.value]), (e = ["(", r]), (a = !0);
          else {
            i = !0;
            const o = this.incrStack();
            (e = ["((", this.push(o), " = ", n, ")"]), (r = this.topStack());
          }
          const c = t.call(this, r);
          a || this.popStack(),
            i && this.stackSlot--,
            this.push(e.concat(c, ")"));
        },
        incrStack() {
          return (
            this.stackSlot++,
            this.stackSlot > this.stackVars.length &&
              this.stackVars.push(`stack${this.stackSlot}`),
            this.topStackName()
          );
        },
        topStackName() {
          return `stack${this.stackSlot}`;
        },
        flushInline() {
          const t = this.inlineStack;
          this.inlineStack = [];
          for (let e = 0, r = t.length; e < r; e++) {
            const i = t[e];
            if (i instanceof s) this.compileStack.push(i);
            else {
              const a = this.incrStack();
              this.pushSource([a, " = ", i, ";"]), this.compileStack.push(a);
            }
          }
        },
        isInline() {
          return this.inlineStack.length;
        },
        popStack(t) {
          const e = this.isInline();
          const r = (e ? this.inlineStack : this.compileStack).pop();
          if (!t && r instanceof s) return r.value;
          if (!e) {
            if (!this.stackSlot) throw new h.default("Invalid stack pop");
            this.stackSlot--;
          }
          return r;
        },
        topStack() {
          const t = this.isInline() ? this.inlineStack : this.compileStack;
          const e = t[t.length - 1];
          return e instanceof s ? e.value : e;
        },
        contextName(t) {
          return this.useDepths && t ? `depths[${t}]` : `depth${t}`;
        },
        quotedString(t) {
          return this.source.quotedString(t);
        },
        objectLiteral(t) {
          return this.source.objectLiteral(t);
        },
        aliasable(t) {
          let e = this.aliases[t];
          return e
            ? (e.referenceCount++, e)
            : ((e = this.aliases[t] = this.source.wrap(t)),
              (e.aliasable = !0),
              (e.referenceCount = 1),
              e);
        },
        setupHelper(t, e, r) {
          const s = [];
          const i = this.setupHelperArgs(e, t, s, r);
          const a = this.nameLookup("helpers", e, "helper");
          const n = this.aliasable(
            `${this.contextName(0)} != null ? ${this.contextName(0)} : {}`,
          );
          return {
            params: s,
            paramsInit: i,
            name: a,
            callParams: [n].concat(s),
          };
        },
        setupParams(t, e, r) {
          const s = {};
          const i = [];
          const a = [];
          const n = [];
          const o = !r;
          let c = void 0;
          o && (r = []),
            (s.name = this.quotedString(t)),
            (s.hash = this.popStack()),
            this.trackIds && (s.hashIds = this.popStack()),
            this.stringParams &&
              ((s.hashTypes = this.popStack()),
              (s.hashContexts = this.popStack()));
          const h = this.popStack();
          const l = this.popStack();
          (l || h) &&
            ((s.fn = l || "container.noop"),
            (s.inverse = h || "container.noop"));
          for (let p = e; p--; )
            (c = this.popStack()),
              (r[p] = c),
              this.trackIds && (n[p] = this.popStack()),
              this.stringParams &&
                ((a[p] = this.popStack()), (i[p] = this.popStack()));
          return (
            o && (s.args = this.source.generateArray(r)),
            this.trackIds && (s.ids = this.source.generateArray(n)),
            this.stringParams &&
              ((s.types = this.source.generateArray(a)),
              (s.contexts = this.source.generateArray(i))),
            this.options.data && (s.data = "data"),
            this.useBlockParams && (s.blockParams = "blockParams"),
            s
          );
        },
        setupHelperArgs(t, e, r, s) {
          let i = this.setupParams(t, e, r);
          return (
            (i = this.objectLiteral(i)),
            s
              ? (this.useRegister("options"),
                r.push("options"),
                ["options=", i])
              : r
              ? (r.push(i), "")
              : i
          );
        },
      }),
        (function() {
          for (
            let t = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield await null true false".split(
                " ",
              ),
              e = (i.RESERVED_WORDS = {}),
              r = 0,
              s = t.length;
            r < s;
            r++
          )
            e[t[r]] = !0;
        })(),
        (i.isValidJavaScriptVariableName = function(t) {
          return !i.RESERVED_WORDS[t] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(t);
        }),
        (e.default = i),
        (t.exports = e.default);
    },
    function(t, e, r) {
      function s(t, e, r) {
        if (a.isArray(t)) {
          for (var s = [], i = 0, n = t.length; i < n; i++)
            s.push(e.wrap(t[i], r));
          return s;
        }
        return typeof t === "boolean" || typeof t === "number" ? `${t}` : t;
      }
      function i(t) {
        (this.srcFile = t), (this.source = []);
      }
      e.__esModule = !0;
      var a = r(5);
      let n = void 0;
      try {
      } catch (o) {}
      n ||
        ((n = function(t, e, r, s) {
          (this.src = ""), s && this.add(s);
        }),
        (n.prototype = {
          add(t) {
            a.isArray(t) && (t = t.join("")), (this.src += t);
          },
          prepend(t) {
            a.isArray(t) && (t = t.join("")), (this.src = t + this.src);
          },
          toStringWithSourceMap() {
            return { code: this.toString() };
          },
          toString() {
            return this.src;
          },
        })),
        (i.prototype = {
          isEmpty() {
            return !this.source.length;
          },
          prepend(t, e) {
            this.source.unshift(this.wrap(t, e));
          },
          push(t, e) {
            this.source.push(this.wrap(t, e));
          },
          merge() {
            const t = this.empty();
            return (
              this.each(function(e) {
                t.add(["  ", e, "\n"]);
              }),
              t
            );
          },
          each(t) {
            for (let e = 0, r = this.source.length; e < r; e++)
              t(this.source[e]);
          },
          empty() {
            const t = this.currentLocation || { start: {} };
            return new n(t.start.line, t.start.column, this.srcFile);
          },
          wrap(t) {
            const e =
              arguments.length <= 1 || void 0 === arguments[1]
                ? this.currentLocation || { start: {} }
                : arguments[1];
            return t instanceof n
              ? t
              : ((t = s(t, this, e)),
                new n(e.start.line, e.start.column, this.srcFile, t));
          },
          functionCall(t, e, r) {
            return (
              (r = this.generateList(r)),
              this.wrap([t, e ? `.${e}(` : "(", r, ")"])
            );
          },
          quotedString(t) {
            return `"${`${t}`
              .replace(/\\/g, "\\\\")
              .replace(/"/g, '\\"')
              .replace(/\n/g, "\\n")
              .replace(/\r/g, "\\r")
              .replace(/\u2028/g, "\\u2028")
              .replace(/\u2029/g, "\\u2029")}"`;
          },
          objectLiteral(t) {
            const e = [];
            for (const r in t)
              if (t.hasOwnProperty(r)) {
                const i = s(t[r], this);
                i !== "undefined" && e.push([this.quotedString(r), ":", i]);
              }
            const a = this.generateList(e);
            return a.prepend("{"), a.add("}"), a;
          },
          generateList(t) {
            for (var e = this.empty(), r = 0, i = t.length; r < i; r++)
              r && e.add(","), e.add(s(t[r], this));
            return e;
          },
          generateArray(t) {
            const e = this.generateList(t);
            return e.prepend("["), e.add("]"), e;
          },
        }),
        (e.default = i),
        (t.exports = e.default);
    },
  ]);
});
