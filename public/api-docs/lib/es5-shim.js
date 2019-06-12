!(function(t, e) {
  typeof define === "function" && define.amd
    ? define(e)
    : typeof exports === "object"
    ? (module.exports = e())
    : (t.returnExports = e());
})(this, function() {
  var t;
  let e;
  const r = Array;
  const n = r.prototype;
  const o = Object;
  const i = o.prototype;
  const a = Function;
  const u = a.prototype;
  const f = String;
  const s = f.prototype;
  const l = Number;
  const c = l.prototype;
  const h = n.slice;
  const p = n.splice;
  const y = n.push;
  const d = n.unshift;
  const g = n.concat;
  const v = n.join;
  const b = u.call;
  const w = u.apply;
  const T = Math.max;
  const m = Math.min;
  const D = i.toString;
  const x =
    typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
  const S = Function.prototype.toString;
  const O = /^\s*class /;
  const j = function(t) {
    try {
      const e = S.call(t);
      const r = e.replace(/\/\/.*\n/g, "");
      const n = r.replace(/\/\*[.\s\S]*\*\//g, "");
      const o = n.replace(/\n/gm, " ").replace(/ {2}/g, " ");
      return O.test(o);
    } catch (i) {
      return !1;
    }
  };
  const E = function(t) {
    try {
      return !j(t) && (S.call(t), !0);
    } catch (e) {
      return !1;
    }
  };
  const M = "[object Function]";
  const I = "[object GeneratorFunction]";
  var t = function(t) {
    if (!t) return !1;
    if (typeof t !== "function" && typeof t !== "object") return !1;
    if (x) return E(t);
    if (j(t)) return !1;
    const e = D.call(t);
    return e === M || e === I;
  };
  const U = RegExp.prototype.exec;
  const F = function(t) {
    try {
      return U.call(t), !0;
    } catch (e) {
      return !1;
    }
  };
  const N = "[object RegExp]";
  e = function(t) {
    return typeof t === "object" && (x ? F(t) : D.call(t) === N);
  };
  let k;
  const C = String.prototype.valueOf;
  const R = function(t) {
    try {
      return C.call(t), !0;
    } catch (e) {
      return !1;
    }
  };
  const A = "[object String]";
  k = function(t) {
    return (
      typeof t === "string" ||
      (typeof t === "object" && (x ? R(t) : D.call(t) === A))
    );
  };
  const $ =
    o.defineProperty &&
    (function() {
      try {
        const t = {};
        o.defineProperty(t, "x", { enumerable: !1, value: t });
        for (const e in t) return !1;
        return t.x === t;
      } catch (r) {
        return !1;
      }
    })();
  const P = (function(t) {
    let e;
    return (
      (e = $
        ? function(t, e, r, n) {
            (!n && e in t) ||
              o.defineProperty(t, e, {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: r,
              });
          }
        : function(t, e, r, n) {
            (!n && e in t) || (t[e] = r);
          }),
      function(r, n, o) {
        for (const i in n) t.call(n, i) && e(r, i, n[i], o);
      }
    );
  })(i.hasOwnProperty);
  const J = function(t) {
    const e = typeof t;
    return t === null || (e !== "object" && e !== "function");
  };
  const Z =
    l.isNaN ||
    function(t) {
      return t !== t;
    };
  const z = {
    ToInteger(t) {
      let e = +t;
      return (
        Z(e)
          ? (e = 0)
          : e !== 0 &&
            e !== 1 / 0 &&
            e !== -(1 / 0) &&
            (e = (e > 0 || -1) * Math.floor(Math.abs(e))),
        e
      );
    },
    ToPrimitive(e) {
      let r;
      let n;
      let o;
      if (J(e)) return e;
      if (((n = e.valueOf), t(n) && ((r = n.call(e)), J(r)))) return r;
      if (((o = e.toString), t(o) && ((r = o.call(e)), J(r)))) return r;
      throw new TypeError();
    },
    ToObject(t) {
      if (t == null) throw new TypeError(`can't convert ${t} to object`);
      return o(t);
    },
    ToUint32(t) {
      return t >>> 0;
    },
  };
  const G = function() {};
  P(u, {
    bind(e) {
      const r = this;
      if (!t(r))
        throw new TypeError(
          `Function.prototype.bind called on incompatible ${r}`,
        );
      for (
        var n,
          i = h.call(arguments, 1),
          u = function() {
            if (this instanceof n) {
              const t = w.call(r, this, g.call(i, h.call(arguments)));
              return o(t) === t ? t : this;
            }
            return w.call(r, e, g.call(i, h.call(arguments)));
          },
          f = T(0, r.length - i.length),
          s = [],
          l = 0;
        l < f;
        l++
      )
        y.call(s, `$${l}`);
      return (
        (n = a(
          "binder",
          `return function (${v.call(
            s,
            ",",
          )}){ return binder.apply(this, arguments); }`,
        )(u)),
        r.prototype &&
          ((G.prototype = r.prototype),
          (n.prototype = new G()),
          (G.prototype = null)),
        n
      );
    },
  });
  const Y = b.bind(i.hasOwnProperty);
  const B = b.bind(i.toString);
  const H = b.bind(h);
  const W = w.bind(h);
  const L = b.bind(s.slice);
  const X = b.bind(s.split);
  const q = b.bind(s.indexOf);
  const K = b.bind(y);
  const Q = b.bind(i.propertyIsEnumerable);
  const V = b.bind(n.sort);
  const _ =
    r.isArray ||
    function(t) {
      return B(t) === "[object Array]";
    };
  const tt = [].unshift(0) !== 1;
  P(
    n,
    {
      unshift() {
        return d.apply(this, arguments), this.length;
      },
    },
    tt,
  ),
    P(r, { isArray: _ });
  const et = o("a");
  const rt = et[0] !== "a" || !(0 in et);
  const nt = function(t) {
    let e = !0;
    let r = !0;
    let n = !1;
    if (t)
      try {
        t.call("foo", function(t, r, n) {
          typeof n !== "object" && (e = !1);
        }),
          t.call(
            [1],
            function() {
              r = typeof this === "string";
            },
            "x",
          );
      } catch (o) {
        n = !0;
      }
    return !!t && !n && e && r;
  };
  P(
    n,
    {
      forEach(e) {
        let r;
        const n = z.ToObject(this);
        const o = rt && k(this) ? X(this, "") : n;
        let i = -1;
        const a = z.ToUint32(o.length);
        if ((arguments.length > 1 && (r = arguments[1]), !t(e)))
          throw new TypeError(
            "Array.prototype.forEach callback must be a function",
          );
        for (; ++i < a; )
          i in o &&
            (typeof r === "undefined" ? e(o[i], i, n) : e.call(r, o[i], i, n));
      },
    },
    !nt(n.forEach),
  ),
    P(
      n,
      {
        map(e) {
          let n;
          const o = z.ToObject(this);
          const i = rt && k(this) ? X(this, "") : o;
          const a = z.ToUint32(i.length);
          const u = r(a);
          if ((arguments.length > 1 && (n = arguments[1]), !t(e)))
            throw new TypeError(
              "Array.prototype.map callback must be a function",
            );
          for (let f = 0; f < a; f++)
            f in i &&
              (typeof n === "undefined"
                ? (u[f] = e(i[f], f, o))
                : (u[f] = e.call(n, i[f], f, o)));
          return u;
        },
      },
      !nt(n.map),
    ),
    P(
      n,
      {
        filter(e) {
          let r;
          let n;
          const o = z.ToObject(this);
          const i = rt && k(this) ? X(this, "") : o;
          const a = z.ToUint32(i.length);
          const u = [];
          if ((arguments.length > 1 && (n = arguments[1]), !t(e)))
            throw new TypeError(
              "Array.prototype.filter callback must be a function",
            );
          for (let f = 0; f < a; f++)
            f in i &&
              ((r = i[f]),
              (typeof n === "undefined" ? e(r, f, o) : e.call(n, r, f, o)) &&
                K(u, r));
          return u;
        },
      },
      !nt(n.filter),
    ),
    P(
      n,
      {
        every(e) {
          let r;
          const n = z.ToObject(this);
          const o = rt && k(this) ? X(this, "") : n;
          const i = z.ToUint32(o.length);
          if ((arguments.length > 1 && (r = arguments[1]), !t(e)))
            throw new TypeError(
              "Array.prototype.every callback must be a function",
            );
          for (let a = 0; a < i; a++)
            if (
              a in o &&
              !(typeof r === "undefined"
                ? e(o[a], a, n)
                : e.call(r, o[a], a, n))
            )
              return !1;
          return !0;
        },
      },
      !nt(n.every),
    ),
    P(
      n,
      {
        some(e) {
          let r;
          const n = z.ToObject(this);
          const o = rt && k(this) ? X(this, "") : n;
          const i = z.ToUint32(o.length);
          if ((arguments.length > 1 && (r = arguments[1]), !t(e)))
            throw new TypeError(
              "Array.prototype.some callback must be a function",
            );
          for (let a = 0; a < i; a++)
            if (
              a in o &&
              (typeof r === "undefined" ? e(o[a], a, n) : e.call(r, o[a], a, n))
            )
              return !0;
          return !1;
        },
      },
      !nt(n.some),
    );
  let ot = !1;
  n.reduce &&
    (ot =
      typeof n.reduce.call("es5", function(t, e, r, n) {
        return n;
      }) === "object"),
    P(
      n,
      {
        reduce(e) {
          const r = z.ToObject(this);
          const n = rt && k(this) ? X(this, "") : r;
          const o = z.ToUint32(n.length);
          if (!t(e))
            throw new TypeError(
              "Array.prototype.reduce callback must be a function",
            );
          if (o === 0 && arguments.length === 1)
            throw new TypeError("reduce of empty array with no initial value");
          let i;
          let a = 0;
          if (arguments.length >= 2) i = arguments[1];
          else
            for (;;) {
              if (a in n) {
                i = n[a++];
                break;
              }
              if (++a >= o)
                throw new TypeError(
                  "reduce of empty array with no initial value",
                );
            }
          for (; a < o; a++) a in n && (i = e(i, n[a], a, r));
          return i;
        },
      },
      !ot,
    );
  let it = !1;
  n.reduceRight &&
    (it =
      typeof n.reduceRight.call("es5", function(t, e, r, n) {
        return n;
      }) === "object"),
    P(
      n,
      {
        reduceRight(e) {
          const r = z.ToObject(this);
          const n = rt && k(this) ? X(this, "") : r;
          const o = z.ToUint32(n.length);
          if (!t(e))
            throw new TypeError(
              "Array.prototype.reduceRight callback must be a function",
            );
          if (o === 0 && arguments.length === 1)
            throw new TypeError(
              "reduceRight of empty array with no initial value",
            );
          let i;
          let a = o - 1;
          if (arguments.length >= 2) i = arguments[1];
          else
            for (;;) {
              if (a in n) {
                i = n[a--];
                break;
              }
              if (--a < 0)
                throw new TypeError(
                  "reduceRight of empty array with no initial value",
                );
            }
          if (a < 0) return i;
          do a in n && (i = e(i, n[a], a, r));
          while (a--);
          return i;
        },
      },
      !it,
    );
  const at = n.indexOf && [0, 1].indexOf(1, 2) !== -1;
  P(
    n,
    {
      indexOf(t) {
        const e = rt && k(this) ? X(this, "") : z.ToObject(this);
        const r = z.ToUint32(e.length);
        if (r === 0) return -1;
        let n = 0;
        for (
          arguments.length > 1 && (n = z.ToInteger(arguments[1])),
            n = n >= 0 ? n : T(0, r + n);
          n < r;
          n++
        )
          if (n in e && e[n] === t) return n;
        return -1;
      },
    },
    at,
  );
  const ut = n.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
  P(
    n,
    {
      lastIndexOf(t) {
        const e = rt && k(this) ? X(this, "") : z.ToObject(this);
        const r = z.ToUint32(e.length);
        if (r === 0) return -1;
        let n = r - 1;
        for (
          arguments.length > 1 && (n = m(n, z.ToInteger(arguments[1]))),
            n = n >= 0 ? n : r - Math.abs(n);
          n >= 0;
          n--
        )
          if (n in e && t === e[n]) return n;
        return -1;
      },
    },
    ut,
  );
  const ft = (function() {
    const t = [1, 2];
    const e = t.splice();
    return t.length === 2 && _(e) && e.length === 0;
  })();
  P(
    n,
    {
      splice(t, e) {
        return arguments.length === 0 ? [] : p.apply(this, arguments);
      },
    },
    !ft,
  );
  const st = (function() {
    const t = {};
    return n.splice.call(t, 0, 0, 1), t.length === 1;
  })();
  P(
    n,
    {
      splice(t, e) {
        if (arguments.length === 0) return [];
        let r = arguments;
        return (
          (this.length = T(z.ToInteger(this.length), 0)),
          arguments.length > 0 &&
            typeof e !== "number" &&
            ((r = H(arguments)),
            r.length < 2 ? K(r, this.length - t) : (r[1] = z.ToInteger(e))),
          p.apply(this, r)
        );
      },
    },
    !st,
  );
  const lt = (function() {
    const t = new r(1e5);
    return (t[8] = "x"), t.splice(1, 1), t.indexOf("x") === 7;
  })();
  const ct = (function() {
    const t = 256;
    const e = [];
    return (e[t] = "a"), e.splice(t + 1, 0, "b"), e[t] === "a";
  })();
  P(
    n,
    {
      splice(t, e) {
        for (
          var r,
            n = z.ToObject(this),
            o = [],
            i = z.ToUint32(n.length),
            a = z.ToInteger(t),
            u = a < 0 ? T(i + a, 0) : m(a, i),
            s = m(T(z.ToInteger(e), 0), i - u),
            l = 0;
          l < s;

        )
          (r = f(u + l)), Y(n, r) && (o[l] = n[r]), (l += 1);
        let c;
        const h = H(arguments, 2);
        const p = h.length;
        if (p < s) {
          l = u;
          for (let y = i - s; l < y; )
            (r = f(l + s)),
              (c = f(l + p)),
              Y(n, r) ? (n[c] = n[r]) : delete n[c],
              (l += 1);
          l = i;
          for (let d = i - s + p; l > d; ) delete n[l - 1], (l -= 1);
        } else if (p > s)
          for (l = i - s; l > u; )
            (r = f(l + s - 1)),
              (c = f(l + p - 1)),
              Y(n, r) ? (n[c] = n[r]) : delete n[c],
              (l -= 1);
        l = u;
        for (let g = 0; g < h.length; ++g) (n[l] = h[g]), (l += 1);
        return (n.length = i - s + p), o;
      },
    },
    !lt || !ct,
  );
  let ht;
  const pt = n.join;
  try {
    ht = Array.prototype.join.call("123", ",") !== "1,2,3";
  } catch (yt) {
    ht = !0;
  }
  ht &&
    P(
      n,
      {
        join(t) {
          const e = typeof t === "undefined" ? "," : t;
          return pt.call(k(this) ? X(this, "") : this, e);
        },
      },
      ht,
    );
  const dt = [1, 2].join(void 0) !== "1,2";
  dt &&
    P(
      n,
      {
        join(t) {
          const e = typeof t === "undefined" ? "," : t;
          return pt.call(this, e);
        },
      },
      dt,
    );
  const gt = function(t) {
    for (
      var e = z.ToObject(this), r = z.ToUint32(e.length), n = 0;
      n < arguments.length;

    )
      (e[r + n] = arguments[n]), (n += 1);
    return (e.length = r + n), r + n;
  };
  const vt = (function() {
    const t = {};
    const e = Array.prototype.push.call(t, void 0);
    return e !== 1 || t.length !== 1 || typeof t[0] !== "undefined" || !Y(t, 0);
  })();
  P(
    n,
    {
      push(t) {
        return _(this) ? y.apply(this, arguments) : gt.apply(this, arguments);
      },
    },
    vt,
  );
  const bt = (function() {
    const t = [];
    const e = t.push(void 0);
    return e !== 1 || t.length !== 1 || typeof t[0] !== "undefined" || !Y(t, 0);
  })();
  P(n, { push: gt }, bt),
    P(
      n,
      {
        slice(t, e) {
          const r = k(this) ? X(this, "") : this;
          return W(r, arguments);
        },
      },
      rt,
    );
  const wt = (function() {
    try {
      return [1, 2].sort(null), [1, 2].sort({}), !0;
    } catch (t) {}
    return !1;
  })();
  const Tt = (function() {
    try {
      return [1, 2].sort(/a/), !1;
    } catch (t) {}
    return !0;
  })();
  const mt = (function() {
    try {
      return [1, 2].sort(void 0), !0;
    } catch (t) {}
    return !1;
  })();
  P(
    n,
    {
      sort(e) {
        if (typeof e === "undefined") return V(this);
        if (!t(e))
          throw new TypeError(
            "Array.prototype.sort callback must be a function",
          );
        return V(this, e);
      },
    },
    wt || !mt || !Tt,
  );
  const Dt = !Q({ toString: null }, "toString");
  const xt = Q(function() {}, "prototype");
  const St = !Y("x", "0");
  const Ot = function(t) {
    const e = t.constructor;
    return e && e.prototype === t;
  };
  const jt = {
    $window: !0,
    $console: !0,
    $parent: !0,
    $self: !0,
    $frame: !0,
    $frames: !0,
    $frameElement: !0,
    $webkitIndexedDB: !0,
    $webkitStorageInfo: !0,
    $external: !0,
  };
  const Et = (function() {
    if (typeof window === "undefined") return !1;
    for (const t in window)
      try {
        !jt[`$${t}`] &&
          Y(window, t) &&
          window[t] !== null &&
          typeof window[t] === "object" &&
          Ot(window[t]);
      } catch (e) {
        return !0;
      }
    return !1;
  })();
  const Mt = function(t) {
    if (typeof window === "undefined" || !Et) return Ot(t);
    try {
      return Ot(t);
    } catch (e) {
      return !1;
    }
  };
  const It = [
    "toString",
    "toLocaleString",
    "valueOf",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "constructor",
  ];
  const Ut = It.length;
  const Ft = function(t) {
    return B(t) === "[object Arguments]";
  };
  const Nt = function(e) {
    return (
      e !== null &&
      typeof e === "object" &&
      typeof e.length === "number" &&
      e.length >= 0 &&
      !_(e) &&
      t(e.callee)
    );
  };
  const kt = Ft(arguments) ? Ft : Nt;
  P(o, {
    keys(e) {
      const r = t(e);
      const n = kt(e);
      const o = e !== null && typeof e === "object";
      const i = o && k(e);
      if (!o && !r && !n)
        throw new TypeError("Object.keys called on a non-object");
      const a = [];
      const u = xt && r;
      if ((i && St) || n) for (let s = 0; s < e.length; ++s) K(a, f(s));
      if (!n)
        for (const l in e) (u && l === "prototype") || !Y(e, l) || K(a, f(l));
      if (Dt)
        for (let c = Mt(e), h = 0; h < Ut; h++) {
          const p = It[h];
          (c && p === "constructor") || !Y(e, p) || K(a, p);
        }
      return a;
    },
  });
  const Ct =
    o.keys &&
    (function() {
      return o.keys(arguments).length === 2;
    })(1, 2);
  const Rt =
    o.keys &&
    (function() {
      const t = o.keys(arguments);
      return arguments.length !== 1 || t.length !== 1 || t[0] !== 1;
    })(1);
  const At = o.keys;
  P(
    o,
    {
      keys(t) {
        return At(kt(t) ? H(t) : t);
      },
    },
    !Ct || Rt,
  );
  let $t;
  let Pt;
  const Jt = new Date(-0xc782b5b342b24).getUTCMonth() !== 0;
  const Zt = new Date(-0x55d318d56a724);
  const zt = new Date(14496624e5);
  const Gt = Zt.toUTCString() !== "Mon, 01 Jan -45875 11:59:59 GMT";
  const Yt = Zt.getTimezoneOffset();
  Yt < -720
    ? (($t = Zt.toDateString() !== "Tue Jan 02 -45875"),
      (Pt = !/^Thu Dec 10 2015 \d\d:\d\d:\d\d GMT[-\+]\d\d\d\d(?: |$)/.test(
        zt.toString(),
      )))
    : (($t = Zt.toDateString() !== "Mon Jan 01 -45875"),
      (Pt = !/^Wed Dec 09 2015 \d\d:\d\d:\d\d GMT[-\+]\d\d\d\d(?: |$)/.test(
        zt.toString(),
      )));
  const Bt = b.bind(Date.prototype.getFullYear);
  const Ht = b.bind(Date.prototype.getMonth);
  const Wt = b.bind(Date.prototype.getDate);
  const Lt = b.bind(Date.prototype.getUTCFullYear);
  const Xt = b.bind(Date.prototype.getUTCMonth);
  const qt = b.bind(Date.prototype.getUTCDate);
  const Kt = b.bind(Date.prototype.getUTCDay);
  const Qt = b.bind(Date.prototype.getUTCHours);
  const Vt = b.bind(Date.prototype.getUTCMinutes);
  const _t = b.bind(Date.prototype.getUTCSeconds);
  const te = b.bind(Date.prototype.getUTCMilliseconds);
  const ee = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const re = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const ne = function(t, e) {
    return Wt(new Date(e, t, 0));
  };
  P(
    Date.prototype,
    {
      getFullYear() {
        if (!(this && this instanceof Date))
          throw new TypeError("this is not a Date object.");
        const t = Bt(this);
        return t < 0 && Ht(this) > 11 ? t + 1 : t;
      },
      getMonth() {
        if (!(this && this instanceof Date))
          throw new TypeError("this is not a Date object.");
        const t = Bt(this);
        const e = Ht(this);
        return t < 0 && e > 11 ? 0 : e;
      },
      getDate() {
        if (!(this && this instanceof Date))
          throw new TypeError("this is not a Date object.");
        const t = Bt(this);
        const e = Ht(this);
        const r = Wt(this);
        if (t < 0 && e > 11) {
          if (e === 12) return r;
          const n = ne(0, t + 1);
          return n - r + 1;
        }
        return r;
      },
      getUTCFullYear() {
        if (!(this && this instanceof Date))
          throw new TypeError("this is not a Date object.");
        const t = Lt(this);
        return t < 0 && Xt(this) > 11 ? t + 1 : t;
      },
      getUTCMonth() {
        if (!(this && this instanceof Date))
          throw new TypeError("this is not a Date object.");
        const t = Lt(this);
        const e = Xt(this);
        return t < 0 && e > 11 ? 0 : e;
      },
      getUTCDate() {
        if (!(this && this instanceof Date))
          throw new TypeError("this is not a Date object.");
        const t = Lt(this);
        const e = Xt(this);
        const r = qt(this);
        if (t < 0 && e > 11) {
          if (e === 12) return r;
          const n = ne(0, t + 1);
          return n - r + 1;
        }
        return r;
      },
    },
    Jt,
  ),
    P(
      Date.prototype,
      {
        toUTCString() {
          if (!(this && this instanceof Date))
            throw new TypeError("this is not a Date object.");
          const t = Kt(this);
          const e = qt(this);
          const r = Xt(this);
          const n = Lt(this);
          const o = Qt(this);
          const i = Vt(this);
          const a = _t(this);
          return `${ee[t]}, ${e < 10 ? `0${e}` : e} ${re[r]} ${n} ${
            o < 10 ? `0${o}` : o
          }:${i < 10 ? `0${i}` : i}:${a < 10 ? `0${a}` : a} GMT`;
        },
      },
      Jt || Gt,
    ),
    P(
      Date.prototype,
      {
        toDateString() {
          if (!(this && this instanceof Date))
            throw new TypeError("this is not a Date object.");
          const t = this.getDay();
          const e = this.getDate();
          const r = this.getMonth();
          const n = this.getFullYear();
          return `${ee[t]} ${re[r]} ${e < 10 ? `0${e}` : e} ${n}`;
        },
      },
      Jt || $t,
    ),
    (Jt || Pt) &&
      ((Date.prototype.toString = function() {
        if (!(this && this instanceof Date))
          throw new TypeError("this is not a Date object.");
        const t = this.getDay();
        const e = this.getDate();
        const r = this.getMonth();
        const n = this.getFullYear();
        const o = this.getHours();
        const i = this.getMinutes();
        const a = this.getSeconds();
        const u = this.getTimezoneOffset();
        const f = Math.floor(Math.abs(u) / 60);
        const s = Math.floor(Math.abs(u) % 60);
        return `${ee[t]} ${re[r]} ${e < 10 ? `0${e}` : e} ${n} ${
          o < 10 ? `0${o}` : o
        }:${i < 10 ? `0${i}` : i}:${a < 10 ? `0${a}` : a} GMT${
          u > 0 ? "-" : "+"
        }${f < 10 ? `0${f}` : f}${s < 10 ? `0${s}` : s}`;
      }),
      $ &&
        o.defineProperty(Date.prototype, "toString", {
          configurable: !0,
          enumerable: !1,
          writable: !0,
        }));
  const oe = -621987552e5;
  const ie = "-000001";
  const ae =
    Date.prototype.toISOString && new Date(oe).toISOString().indexOf(ie) === -1;
  const ue =
    Date.prototype.toISOString &&
    new Date(-1).toISOString() !== "1969-12-31T23:59:59.999Z";
  const fe = b.bind(Date.prototype.getTime);
  P(
    Date.prototype,
    {
      toISOString() {
        if (!isFinite(this) || !isFinite(fe(this)))
          throw new RangeError(
            "Date.prototype.toISOString called on non-finite value.",
          );
        let t = Lt(this);
        let e = Xt(this);
        (t += Math.floor(e / 12)), (e = ((e % 12) + 12) % 12);
        const r = [e + 1, qt(this), Qt(this), Vt(this), _t(this)];
        t =
          (t < 0 ? "-" : t > 9999 ? "+" : "") +
          L(`00000${Math.abs(t)}`, t >= 0 && t <= 9999 ? -4 : -6);
        for (let n = 0; n < r.length; ++n) r[n] = L(`00${r[n]}`, -2);
        return `${t}-${H(r, 0, 2).join("-")}T${H(r, 2).join(":")}.${L(
          `000${te(this)}`,
          -3,
        )}Z`;
      },
    },
    ae || ue,
  );
  const se = (function() {
    try {
      return (
        Date.prototype.toJSON &&
        new Date(NaN).toJSON() === null &&
        new Date(oe).toJSON().indexOf(ie) !== -1 &&
        Date.prototype.toJSON.call({
          toISOString() {
            return !0;
          },
        })
      );
    } catch (t) {
      return !1;
    }
  })();
  se ||
    (Date.prototype.toJSON = function(e) {
      const r = o(this);
      const n = z.ToPrimitive(r);
      if (typeof n === "number" && !isFinite(n)) return null;
      const i = r.toISOString;
      if (!t(i)) throw new TypeError("toISOString property is not callable");
      return i.call(r);
    });
  const le = Date.parse("+033658-09-27T01:46:40.000Z") === 1e15;
  const ce =
    !isNaN(Date.parse("2012-04-04T24:00:00.500Z")) ||
    !isNaN(Date.parse("2012-11-31T23:59:59.000Z")) ||
    !isNaN(Date.parse("2012-12-31T23:59:60.000Z"));
  const he = isNaN(Date.parse("2000-01-01T00:00:00.000Z"));
  if (he || ce || !le) {
    const pe = Math.pow(2, 31) - 1;
    const ye = Z(new Date(1970, 0, 1, 0, 0, 0, pe + 1).getTime());
    Date = (function(t) {
      var e = function(r, n, o, i, a, u, s) {
        let l;
        const c = arguments.length;
        if (this instanceof t) {
          let h = u;
          let p = s;
          if (ye && c >= 7 && s > pe) {
            const y = Math.floor(s / pe) * pe;
            const d = Math.floor(y / 1e3);
            (h += d), (p -= 1e3 * d);
          }
          l =
            c === 1 && f(r) === r
              ? new t(e.parse(r))
              : c >= 7
              ? new t(r, n, o, i, a, h, p)
              : c >= 6
              ? new t(r, n, o, i, a, h)
              : c >= 5
              ? new t(r, n, o, i, a)
              : c >= 4
              ? new t(r, n, o, i)
              : c >= 3
              ? new t(r, n, o)
              : c >= 2
              ? new t(r, n)
              : c >= 1
              ? new t(r instanceof t ? +r : r)
              : new t();
        } else l = t.apply(this, arguments);
        return J(l) || P(l, { constructor: e }, !0), l;
      };
      const r = new RegExp(
        "^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:(\\.\\d{1,}))?)?(Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$",
      );
      const n = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
      const o = function(t, e) {
        const r = e > 1 ? 1 : 0;
        return (
          n[e] +
          Math.floor((t - 1969 + r) / 4) -
          Math.floor((t - 1901 + r) / 100) +
          Math.floor((t - 1601 + r) / 400) +
          365 * (t - 1970)
        );
      };
      const i = function(e) {
        let r = 0;
        let n = e;
        if (ye && n > pe) {
          const o = Math.floor(n / pe) * pe;
          const i = Math.floor(o / 1e3);
          (r += i), (n -= 1e3 * i);
        }
        return l(new t(1970, 0, 1, 0, 0, r, n));
      };
      for (const a in t) Y(t, a) && (e[a] = t[a]);
      P(e, { now: t.now, UTC: t.UTC }, !0),
        (e.prototype = t.prototype),
        P(e.prototype, { constructor: e }, !0);
      const u = function(e) {
        const n = r.exec(e);
        if (n) {
          let a;
          const u = l(n[1]);
          const f = l(n[2] || 1) - 1;
          const s = l(n[3] || 1) - 1;
          const c = l(n[4] || 0);
          const h = l(n[5] || 0);
          const p = l(n[6] || 0);
          const y = Math.floor(1e3 * l(n[7] || 0));
          const d = Boolean(n[4] && !n[8]);
          const g = n[9] === "-" ? 1 : -1;
          const v = l(n[10] || 0);
          const b = l(n[11] || 0);
          const w = h > 0 || p > 0 || y > 0;
          return c < (w ? 24 : 25) &&
            h < 60 &&
            p < 60 &&
            y < 1e3 &&
            f > -1 &&
            f < 12 &&
            v < 24 &&
            b < 60 &&
            s > -1 &&
            s < o(u, f + 1) - o(u, f) &&
            ((a = 60 * (24 * (o(u, f) + s) + c + v * g)),
            (a = 1e3 * (60 * (a + h + b * g) + p) + y),
            d && (a = i(a)),
            a >= -864e13 && a <= 864e13)
            ? a
            : NaN;
        }
        return t.parse.apply(this, arguments);
      };
      return P(e, { parse: u }), e;
    })(Date);
  }
  Date.now ||
    (Date.now = function() {
      return new Date().getTime();
    });
  const de =
    c.toFixed &&
    ((8e-5).toFixed(3) !== "0.000" ||
      (0.9).toFixed(0) !== "1" ||
      (1.255).toFixed(2) !== "1.25" ||
      (0xde0b6b3a7640080).toFixed(0) !== "1000000000000000128");
  var ge = {
    base: 1e7,
    size: 6,
    data: [0, 0, 0, 0, 0, 0],
    multiply(t, e) {
      for (let r = -1, n = e; ++r < ge.size; )
        (n += t * ge.data[r]),
          (ge.data[r] = n % ge.base),
          (n = Math.floor(n / ge.base));
    },
    divide(t) {
      for (let e = ge.size, r = 0; --e >= 0; )
        (r += ge.data[e]),
          (ge.data[e] = Math.floor(r / t)),
          (r = (r % t) * ge.base);
    },
    numToString() {
      for (var t = ge.size, e = ""; --t >= 0; )
        if (e !== "" || t === 0 || ge.data[t] !== 0) {
          const r = f(ge.data[t]);
          e === "" ? (e = r) : (e += L("0000000", 0, 7 - r.length) + r);
        }
      return e;
    },
    pow: function Ae(t, e, r) {
      return e === 0
        ? r
        : e % 2 === 1
        ? Ae(t, e - 1, r * t)
        : Ae(t * t, e / 2, r);
    },
    log(t) {
      for (var e = 0, r = t; r >= 4096; ) (e += 12), (r /= 4096);
      for (; r >= 2; ) (e += 1), (r /= 2);
      return e;
    },
  };
  const ve = function(t) {
    let e;
    let r;
    let n;
    let o;
    let i;
    let a;
    let u;
    let s;
    if (((e = l(t)), (e = Z(e) ? 0 : Math.floor(e)), e < 0 || e > 20))
      throw new RangeError(
        "Number.toFixed called with invalid number of decimals",
      );
    if (((r = l(this)), Z(r))) return "NaN";
    if (r <= -1e21 || r >= 1e21) return f(r);
    if (((n = ""), r < 0 && ((n = "-"), (r = -r)), (o = "0"), r > 1e-21))
      if (
        ((i = ge.log(r * ge.pow(2, 69, 1)) - 69),
        (a = i < 0 ? r * ge.pow(2, -i, 1) : r / ge.pow(2, i, 1)),
        (a *= 4503599627370496),
        (i = 52 - i),
        i > 0)
      ) {
        for (ge.multiply(0, a), u = e; u >= 7; ) ge.multiply(1e7, 0), (u -= 7);
        for (ge.multiply(ge.pow(10, u, 1), 0), u = i - 1; u >= 23; )
          ge.divide(1 << 23), (u -= 23);
        ge.divide(1 << u),
          ge.multiply(1, 1),
          ge.divide(2),
          (o = ge.numToString());
      } else
        ge.multiply(0, a),
          ge.multiply(1 << -i, 0),
          (o = ge.numToString() + L("0.00000000000000000000", 2, 2 + e));
    return (
      e > 0
        ? ((s = o.length),
          (o =
            s <= e
              ? n + L("0.0000000000000000000", 0, e - s + 2) + o
              : `${n + L(o, 0, s - e)}.${L(o, s - e)}`))
        : (o = n + o),
      o
    );
  };
  P(c, { toFixed: ve }, de);
  const be = (function() {
    try {
      return (1).toPrecision(void 0) === "1";
    } catch (t) {
      return !0;
    }
  })();
  const we = c.toPrecision;
  P(
    c,
    {
      toPrecision(t) {
        return typeof t === "undefined" ? we.call(this) : we.call(this, t);
      },
    },
    be,
  ),
    "ab".split(/(?:ab)*/).length !== 2 ||
    ".".split(/(.?)(.?)/).length !== 4 ||
    "tesst".split(/(s)*/)[1] === "t" ||
    "test".split(/(?:)/, -1).length !== 4 ||
    "".split(/.?/).length ||
    ".".split(/()()/).length > 1
      ? !(function() {
          const t = typeof /()??/.exec("")[1] === "undefined";
          const r = Math.pow(2, 32) - 1;
          s.split = function(n, o) {
            const i = String(this);
            if (typeof n === "undefined" && o === 0) return [];
            if (!e(n)) return X(this, n, o);
            let a;
            let u;
            let f;
            let s;
            const l = [];
            const c =
              (n.ignoreCase ? "i" : "") +
              (n.multiline ? "m" : "") +
              (n.unicode ? "u" : "") +
              (n.sticky ? "y" : "");
            let h = 0;
            const p = new RegExp(n.source, `${c}g`);
            t || (a = new RegExp(`^${p.source}$(?!\\s)`, c));
            const d = typeof o === "undefined" ? r : z.ToUint32(o);
            for (
              u = p.exec(i);
              u &&
              ((f = u.index + u[0].length),
              !(
                f > h &&
                (K(l, L(i, h, u.index)),
                !t &&
                  u.length > 1 &&
                  u[0].replace(a, function() {
                    for (let t = 1; t < arguments.length - 2; t++)
                      typeof arguments[t] === "undefined" && (u[t] = void 0);
                  }),
                u.length > 1 && u.index < i.length && y.apply(l, H(u, 1)),
                (s = u[0].length),
                (h = f),
                l.length >= d)
              ));

            )
              p.lastIndex === u.index && p.lastIndex++, (u = p.exec(i));
            return (
              h === i.length ? (!s && p.test("")) || K(l, "") : K(l, L(i, h)),
              l.length > d ? H(l, 0, d) : l
            );
          };
        })()
      : "0".split(void 0, 0).length &&
        (s.split = function(t, e) {
          return typeof t === "undefined" && e === 0 ? [] : X(this, t, e);
        });
  const Te = s.replace;
  const me = (function() {
    const t = [];
    return (
      "x".replace(/x(.)?/g, function(e, r) {
        K(t, r);
      }),
      t.length === 1 && typeof t[0] === "undefined"
    );
  })();
  me ||
    (s.replace = function(r, n) {
      const o = t(n);
      const i = e(r) && /\)[*?]/.test(r.source);
      if (o && i) {
        const a = function(t) {
          const e = arguments.length;
          const o = r.lastIndex;
          r.lastIndex = 0;
          const i = r.exec(t) || [];
          return (
            (r.lastIndex = o),
            K(i, arguments[e - 2], arguments[e - 1]),
            n.apply(this, i)
          );
        };
        return Te.call(this, r, a);
      }
      return Te.call(this, r, n);
    });
  const De = s.substr;
  const xe = "".substr && "0b".substr(-1) !== "b";
  P(
    s,
    {
      substr(t, e) {
        let r = t;
        return t < 0 && (r = T(this.length + t, 0)), De.call(this, r, e);
      },
    },
    xe,
  );
  const Se = "\t\n\x0B\f\r   ᠎             　\u2028\u2029\ufeff";
  const Oe = "​";
  const je = `[${Se}]`;
  const Ee = new RegExp(`^${je}${je}*`);
  const Me = new RegExp(`${je + je}*$`);
  const Ie = s.trim && (Se.trim() || !Oe.trim());
  P(
    s,
    {
      trim() {
        if (typeof this === "undefined" || this === null)
          throw new TypeError(`can't convert ${this} to object`);
        return f(this)
          .replace(Ee, "")
          .replace(Me, "");
      },
    },
    Ie,
  );
  const Ue = b.bind(String.prototype.trim);
  const Fe = s.lastIndexOf && "abcあい".lastIndexOf("あい", 2) !== -1;
  P(
    s,
    {
      lastIndexOf(t) {
        if (typeof this === "undefined" || this === null)
          throw new TypeError(`can't convert ${this} to object`);
        for (
          let e = f(this),
            r = f(t),
            n = arguments.length > 1 ? l(arguments[1]) : NaN,
            o = Z(n) ? 1 / 0 : z.ToInteger(n),
            i = m(T(o, 0), e.length),
            a = r.length,
            u = i + a;
          u > 0;

        ) {
          u = T(0, u - a);
          const s = q(L(e, u, i + a), r);
          if (s !== -1) return u + s;
        }
        return -1;
      },
    },
    Fe,
  );
  const Ne = s.lastIndexOf;
  if (
    (P(
      s,
      {
        lastIndexOf(t) {
          return Ne.apply(this, arguments);
        },
      },
      s.lastIndexOf.length !== 1,
    ),
    (parseInt(`${Se}08`) === 8 && parseInt(`${Se}0x16`) === 22) ||
      (parseInt = (function(t) {
        const e = /^[\-+]?0[xX]/;
        return function(r, n) {
          const o = Ue(String(r));
          const i = l(n) || (e.test(o) ? 16 : 10);
          return t(o, i);
        };
      })(parseInt)),
    1 / parseFloat("-0") !== -(1 / 0) &&
      (parseFloat = (function(t) {
        return function(e) {
          const r = Ue(String(e));
          const n = t(r);
          return n === 0 && L(r, 0, 1) === "-" ? -0 : n;
        };
      })(parseFloat)),
    String(new RangeError("test")) !== "RangeError: test")
  ) {
    const ke = function() {
      if (typeof this === "undefined" || this === null)
        throw new TypeError(`can't convert ${this} to object`);
      let t = this.name;
      typeof t === "undefined"
        ? (t = "Error")
        : typeof t !== "string" && (t = f(t));
      let e = this.message;
      return (
        typeof e === "undefined"
          ? (e = "")
          : typeof e !== "string" && (e = f(e)),
        t ? (e ? `${t}: ${e}` : t) : e
      );
    };
    Error.prototype.toString = ke;
  }
  if ($) {
    const Ce = function(t, e) {
      if (Q(t, e)) {
        const r = Object.getOwnPropertyDescriptor(t, e);
        r.configurable && ((r.enumerable = !1), Object.defineProperty(t, e, r));
      }
    };
    Ce(Error.prototype, "message"),
      Error.prototype.message !== "" && (Error.prototype.message = ""),
      Ce(Error.prototype, "name");
  }
  if (String(/a/gim) !== "/a/gim") {
    const Re = function() {
      let t = `/${this.source}/`;
      return (
        this.global && (t += "g"),
        this.ignoreCase && (t += "i"),
        this.multiline && (t += "m"),
        t
      );
    };
    RegExp.prototype.toString = Re;
  }
});
