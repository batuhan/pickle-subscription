!(function(t, e) {
  if (typeof define === "function" && define.amd)
    define(["underscore", "jquery", "exports"], function(i, n, s) {
      t.Backbone = e(t, s, i, n);
    });
  else if (typeof exports !== "undefined") {
    const i = require("underscore");
    e(t, exports, i);
  } else t.Backbone = e(t, {}, t._, t.jQuery || t.Zepto || t.ender || t.$);
})(this, function(t, e, i, n) {
  const s = t.Backbone;
    const r = [];
    const a = (r.push, r.slice);
  r.splice;
  (e.VERSION = "1.1.2"),
    (e.$ = n),
    (e.noConflict = function() {
      return (t.Backbone = s), this;
    }),
    (e.emulateHTTP = !1),
    (e.emulateJSON = !1);
  const o = (e.Events = {
      on(t, e, i) {
        if (!c(this, "on", t, [e, i]) || !e) return this;
        this._events || (this._events = {});
        const n = this._events[t] || (this._events[t] = []);
        return n.push({ callback: e, context: i, ctx: i || this }), this;
      },
      once(t, e, n) {
        if (!c(this, "once", t, [e, n]) || !e) return this;
        const s = this;
          var r = i.once(function() {
            s.off(t, r), e.apply(this, arguments);
          });
        return (r._callback = e), this.on(t, r, n);
      },
      off(t, e, n) {
        let s; let r; let a; let o; let h; let u; let l; let d;
        if (!this._events || !c(this, "off", t, [e, n])) return this;
        if (!t && !e && !n) return (this._events = void 0), this;
        for (
          o = t ? [t] : i.keys(this._events), h = 0, u = o.length;
          h < u;
          h++
        )
          if (((t = o[h]), (a = this._events[t]))) {
            if (((this._events[t] = s = []), e || n))
              for (l = 0, d = a.length; l < d; l++)
                (r = a[l]),
                  ((e && e !== r.callback && e !== r.callback._callback) ||
                    (n && n !== r.context)) &&
                    s.push(r);
            s.length || delete this._events[t];
          }
        return this;
      },
      trigger(t) {
        if (!this._events) return this;
        const e = a.call(arguments, 1);
        if (!c(this, "trigger", t, e)) return this;
        const i = this._events[t];
          const n = this._events.all;
        return i && u(i, e), n && u(n, arguments), this;
      },
      stopListening(t, e, n) {
        let s = this._listeningTo;
        if (!s) return this;
        const r = !e && !n;
        n || typeof e !== "object" || (n = this),
          t && ((s = {})[t._listenId] = t);
        for (const a in s)
          (t = s[a]),
            t.off(e, n, this),
            (r || i.isEmpty(t._events)) && delete this._listeningTo[a];
        return this;
      },
    });
    const h = /\s+/;
    var c = function(t, e, i, n) {
      if (!i) return !0;
      if (typeof i === "object") {
        for (const s in i) t[e].apply(t, [s, i[s]].concat(n));
        return !1;
      }
      if (h.test(i)) {
        for (let r = i.split(h), a = 0, o = r.length; a < o; a++)
          t[e].apply(t, [r[a]].concat(n));
        return !1;
      }
      return !0;
    };
    var u = function(t, e) {
      let i;
        let n = -1;
        const s = t.length;
        const r = e[0];
        const a = e[1];
        const o = e[2];
      switch (e.length) {
        case 0:
          for (; ++n < s; ) (i = t[n]).callback.call(i.ctx);
          return;
        case 1:
          for (; ++n < s; ) (i = t[n]).callback.call(i.ctx, r);
          return;
        case 2:
          for (; ++n < s; ) (i = t[n]).callback.call(i.ctx, r, a);
          return;
        case 3:
          for (; ++n < s; ) (i = t[n]).callback.call(i.ctx, r, a, o);
          return;
        default:
          for (; ++n < s; ) (i = t[n]).callback.apply(i.ctx, e);
          
      }
    };
    const l = { listenTo: "on", listenToOnce: "once" };
  i.each(l, function(t, e) {
    o[e] = function(e, n, s) {
      const r = this._listeningTo || (this._listeningTo = {});
        const a = e._listenId || (e._listenId = i.uniqueId("l"));
      return (
        (r[a] = e),
        s || typeof n !== "object" || (s = this),
        e[t](n, s, this),
        this
      );
    };
  }),
    (o.bind = o.on),
    (o.unbind = o.off),
    i.extend(e, o);
  const d = (e.Model = function(t, e) {
    let n = t || {};
    e || (e = {}),
      (this.cid = i.uniqueId("c")),
      (this.attributes = {}),
      e.collection && (this.collection = e.collection),
      e.parse && (n = this.parse(n, e) || {}),
      (n = i.defaults({}, n, i.result(this, "defaults"))),
      this.set(n, e),
      (this.changed = {}),
      this.initialize.apply(this, arguments);
  });
  i.extend(d.prototype, o, {
    changed: null,
    validationError: null,
    idAttribute: "id",
    initialize() {},
    toJSON(t) {
      return i.clone(this.attributes);
    },
    sync() {
      return e.sync.apply(this, arguments);
    },
    get(t) {
      return this.attributes[t];
    },
    escape(t) {
      return i.escape(this.get(t));
    },
    has(t) {
      return this.get(t) != null;
    },
    set(t, e, n) {
      let s; let r; let a; let o; let h; let c; let u; let l;
      if (t == null) return this;
      if (
        (typeof t === "object" ? ((r = t), (n = e)) : ((r = {})[t] = e),
        n || (n = {}),
        !this._validate(r, n))
      )
        return !1;
      (a = n.unset),
        (h = n.silent),
        (o = []),
        (c = this._changing),
        (this._changing = !0),
        c ||
          ((this._previousAttributes = i.clone(this.attributes)),
          (this.changed = {})),
        (l = this.attributes),
        (u = this._previousAttributes),
        this.idAttribute in r && (this.id = r[this.idAttribute]);
      for (s in r)
        (e = r[s]),
          i.isEqual(l[s], e) || o.push(s),
          i.isEqual(u[s], e) ? delete this.changed[s] : (this.changed[s] = e),
          a ? delete l[s] : (l[s] = e);
      if (!h) {
        o.length && (this._pending = n);
        for (let d = 0, f = o.length; d < f; d++)
          this.trigger(`change:${  o[d]}`, this, l[o[d]], n);
      }
      if (c) return this;
      if (!h)
        for (; this._pending; )
          (n = this._pending),
            (this._pending = !1),
            this.trigger("change", this, n);
      return (this._pending = !1), (this._changing = !1), this;
    },
    unset(t, e) {
      return this.set(t, void 0, i.extend({}, e, { unset: !0 }));
    },
    clear(t) {
      const e = {};
      for (const n in this.attributes) e[n] = void 0;
      return this.set(e, i.extend({}, t, { unset: !0 }));
    },
    hasChanged(t) {
      return t == null ? !i.isEmpty(this.changed) : i.has(this.changed, t);
    },
    changedAttributes(t) {
      if (!t) return !!this.hasChanged() && i.clone(this.changed);
      let e;
        let n = !1;
        const s = this._changing ? this._previousAttributes : this.attributes;
      for (const r in t) i.isEqual(s[r], (e = t[r])) || ((n || (n = {}))[r] = e);
      return n;
    },
    previous(t) {
      return t != null && this._previousAttributes
        ? this._previousAttributes[t]
        : null;
    },
    previousAttributes() {
      return i.clone(this._previousAttributes);
    },
    fetch(t) {
      (t = t ? i.clone(t) : {}), void 0 === t.parse && (t.parse = !0);
      const e = this;
        const n = t.success;
      return (
        (t.success = function(i) {
          return (
            !!e.set(e.parse(i, t), t) &&
            (n && n(e, i, t), void e.trigger("sync", e, i, t))
          );
        }),
        U(this, t),
        this.sync("read", this, t)
      );
    },
    save(t, e, n) {
      let s;
        let r;
        let a;
        const o = this.attributes;
      if (
        (t == null || typeof t === "object"
          ? ((s = t), (n = e))
          : ((s = {})[t] = e),
        (n = i.extend({ validate: !0 }, n)),
        s && !n.wait)
      ) {
        if (!this.set(s, n)) return !1;
      } else if (!this._validate(s, n)) return !1;
      s && n.wait && (this.attributes = i.extend({}, o, s)),
        void 0 === n.parse && (n.parse = !0);
      const h = this;
        const c = n.success;
      return (
        (n.success = function(t) {
          h.attributes = o;
          let e = h.parse(t, n);
          return (
            n.wait && (e = i.extend(s || {}, e)),
            !(i.isObject(e) && !h.set(e, n)) &&
              (c && c(h, t, n), void h.trigger("sync", h, t, n))
          );
        }),
        U(this, n),
        (r = this.isNew() ? "create" : n.patch ? "patch" : "update"),
        r === "patch" && (n.attrs = s),
        (a = this.sync(r, this, n)),
        s && n.wait && (this.attributes = o),
        a
      );
    },
    destroy(t) {
      t = t ? i.clone(t) : {};
      const e = this;
        const n = t.success;
        const s = function() {
          e.trigger("destroy", e, e.collection, t);
        };
      if (
        ((t.success = function(i) {
          (t.wait || e.isNew()) && s(),
            n && n(e, i, t),
            e.isNew() || e.trigger("sync", e, i, t);
        }),
        this.isNew())
      )
        return t.success(), !1;
      U(this, t);
      const r = this.sync("delete", this, t);
      return t.wait || s(), r;
    },
    url() {
      const t =
        i.result(this, "urlRoot") || i.result(this.collection, "url") || j();
      return this.isNew()
        ? t
        : t.replace(/([^\/])$/, "$1/") + encodeURIComponent(this.id);
    },
    parse(t, e) {
      return t;
    },
    clone() {
      return new this.constructor(this.attributes);
    },
    isNew() {
      return !this.has(this.idAttribute);
    },
    isValid(t) {
      return this._validate({}, i.extend(t || {}, { validate: !0 }));
    },
    _validate(t, e) {
      if (!e.validate || !this.validate) return !0;
      t = i.extend({}, this.attributes, t);
      const n = (this.validationError = this.validate(t, e) || null);
      return (
        !n ||
        (this.trigger("invalid", this, n, i.extend(e, { validationError: n })),
        !1)
      );
    },
  });
  const f = ["keys", "values", "pairs", "invert", "pick", "omit"];
  i.each(f, function(t) {
    d.prototype[t] = function() {
      const e = a.call(arguments);
      return e.unshift(this.attributes), i[t].apply(i, e);
    };
  });
  const p = (e.Collection = function(t, e) {
      e || (e = {}),
        e.model && (this.model = e.model),
        void 0 !== e.comparator && (this.comparator = e.comparator),
        this._reset(),
        this.initialize.apply(this, arguments),
        t && this.reset(t, i.extend({ silent: !0 }, e));
    });
    const g = { add: !0, remove: !0, merge: !0 };
    const v = { add: !0, remove: !1 };
  i.extend(p.prototype, o, {
    model: d,
    initialize() {},
    toJSON(t) {
      return this.map(function(e) {
        return e.toJSON(t);
      });
    },
    sync() {
      return e.sync.apply(this, arguments);
    },
    add(t, e) {
      return this.set(t, i.extend({ merge: !1 }, e, v));
    },
    remove(t, e) {
      const n = !i.isArray(t);
      (t = n ? [t] : i.clone(t)), e || (e = {});
      let s; let r; let a; let o;
      for (s = 0, r = t.length; s < r; s++)
        (o = t[s] = this.get(t[s])),
          o &&
            (delete this._byId[o.id],
            delete this._byId[o.cid],
            (a = this.indexOf(o)),
            this.models.splice(a, 1),
            this.length--,
            e.silent || ((e.index = a), o.trigger("remove", o, this, e)),
            this._removeReference(o, e));
      return n ? t[0] : t;
    },
    set(t, e) {
      (e = i.defaults({}, e, g)), e.parse && (t = this.parse(t, e));
      const n = !i.isArray(t);
      t = n ? (t ? [t] : []) : i.clone(t);
      let s;
        let r;
        let a;
        let o;
        let h;
        let c;
        let u;
        const l = e.at;
        const f = this.model;
        const p = this.comparator && l == null && e.sort !== !1;
        const v = i.isString(this.comparator) ? this.comparator : null;
        const m = [];
        const y = [];
        const _ = {};
        const b = e.add;
        const w = e.merge;
        const x = e.remove;
        const E = !(p || !b || !x) && [];
      for (s = 0, r = t.length; s < r; s++) {
        if (
          ((h = t[s] || {}),
          (a = h instanceof d ? (o = h) : h[f.prototype.idAttribute || "id"]),
          (c = this.get(a)))
        )
          x && (_[c.cid] = !0),
            w &&
              ((h = h === o ? o.attributes : h),
              e.parse && (h = c.parse(h, e)),
              c.set(h, e),
              p && !u && c.hasChanged(v) && (u = !0)),
            (t[s] = c);
        else if (b) {
          if (((o = t[s] = this._prepareModel(h, e)), !o)) continue;
          m.push(o), this._addReference(o, e);
        }
        (o = c || o),
          !E || (!o.isNew() && _[o.id]) || E.push(o),
          (_[o.id] = !0);
      }
      if (x) {
        for (s = 0, r = this.length; s < r; ++s)
          _[(o = this.models[s]).cid] || y.push(o);
        y.length && this.remove(y, e);
      }
      if (m.length || (E && E.length))
        if ((p && (u = !0), (this.length += m.length), l != null))
          for (s = 0, r = m.length; s < r; s++)
            this.models.splice(l + s, 0, m[s]);
        else {
          E && (this.models.length = 0);
          const k = E || m;
          for (s = 0, r = k.length; s < r; s++) this.models.push(k[s]);
        }
      if ((u && this.sort({ silent: !0 }), !e.silent)) {
        for (s = 0, r = m.length; s < r; s++)
          (o = m[s]).trigger("add", o, this, e);
        (u || (E && E.length)) && this.trigger("sort", this, e);
      }
      return n ? t[0] : t;
    },
    reset(t, e) {
      e || (e = {});
      for (let n = 0, s = this.models.length; n < s; n++)
        this._removeReference(this.models[n], e);
      return (
        (e.previousModels = this.models),
        this._reset(),
        (t = this.add(t, i.extend({ silent: !0 }, e))),
        e.silent || this.trigger("reset", this, e),
        t
      );
    },
    push(t, e) {
      return this.add(t, i.extend({ at: this.length }, e));
    },
    pop(t) {
      const e = this.at(this.length - 1);
      return this.remove(e, t), e;
    },
    unshift(t, e) {
      return this.add(t, i.extend({ at: 0 }, e));
    },
    shift(t) {
      const e = this.at(0);
      return this.remove(e, t), e;
    },
    slice() {
      return a.apply(this.models, arguments);
    },
    get(t) {
      if (t != null)
        return this._byId[t] || this._byId[t.id] || this._byId[t.cid];
    },
    at(t) {
      return this.models[t];
    },
    where(t, e) {
      return i.isEmpty(t)
        ? e
          ? void 0
          : []
        : this[e ? "find" : "filter"](function(e) {
            for (const i in t) if (t[i] !== e.get(i)) return !1;
            return !0;
          });
    },
    findWhere(t) {
      return this.where(t, !0);
    },
    sort(t) {
      if (!this.comparator)
        throw new Error("Cannot sort a set without a comparator");
      return (
        t || (t = {}),
        i.isString(this.comparator) || this.comparator.length === 1
          ? (this.models = this.sortBy(this.comparator, this))
          : this.models.sort(i.bind(this.comparator, this)),
        t.silent || this.trigger("sort", this, t),
        this
      );
    },
    pluck(t) {
      return i.invoke(this.models, "get", t);
    },
    fetch(t) {
      (t = t ? i.clone(t) : {}), void 0 === t.parse && (t.parse = !0);
      const e = t.success;
        const n = this;
      return (
        (t.success = function(i) {
          const s = t.reset ? "reset" : "set";
          n[s](i, t), e && e(n, i, t), n.trigger("sync", n, i, t);
        }),
        U(this, t),
        this.sync("read", this, t)
      );
    },
    create(t, e) {
      if (((e = e ? i.clone(e) : {}), !(t = this._prepareModel(t, e))))
        return !1;
      e.wait || this.add(t, e);
      const n = this;
        const s = e.success;
      return (
        (e.success = function(t, i) {
          e.wait && n.add(t, e), s && s(t, i, e);
        }),
        t.save(null, e),
        t
      );
    },
    parse(t, e) {
      return t;
    },
    clone() {
      return new this.constructor(this.models);
    },
    _reset() {
      (this.length = 0), (this.models = []), (this._byId = {});
    },
    _prepareModel(t, e) {
      if (t instanceof d) return t;
      (e = e ? i.clone(e) : {}), (e.collection = this);
      const n = new this.model(t, e);
      return n.validationError
        ? (this.trigger("invalid", this, n.validationError, e), !1)
        : n;
    },
    _addReference(t, e) {
      (this._byId[t.cid] = t),
        t.id != null && (this._byId[t.id] = t),
        t.collection || (t.collection = this),
        t.on("all", this._onModelEvent, this);
    },
    _removeReference(t, e) {
      this === t.collection && delete t.collection,
        t.off("all", this._onModelEvent, this);
    },
    _onModelEvent(t, e, i, n) {
      ((t !== "add" && t !== "remove") || i === this) &&
        (t === "destroy" && this.remove(e, n),
        e &&
          t === `change:${  e.idAttribute}` &&
          (delete this._byId[e.previous(e.idAttribute)],
          e.id != null && (this._byId[e.id] = e)),
        this.trigger.apply(this, arguments));
    },
  });
  const m = [
    "forEach",
    "each",
    "map",
    "collect",
    "reduce",
    "foldl",
    "inject",
    "reduceRight",
    "foldr",
    "find",
    "detect",
    "filter",
    "select",
    "reject",
    "every",
    "all",
    "some",
    "any",
    "include",
    "contains",
    "invoke",
    "max",
    "min",
    "toArray",
    "size",
    "first",
    "head",
    "take",
    "initial",
    "rest",
    "tail",
    "drop",
    "last",
    "without",
    "difference",
    "indexOf",
    "shuffle",
    "lastIndexOf",
    "isEmpty",
    "chain",
    "sample",
  ];
  i.each(m, function(t) {
    p.prototype[t] = function() {
      const e = a.call(arguments);
      return e.unshift(this.models), i[t].apply(i, e);
    };
  });
  const y = ["groupBy", "countBy", "sortBy", "indexBy"];
  i.each(y, function(t) {
    p.prototype[t] = function(e, n) {
      const s = i.isFunction(e)
        ? e
        : function(t) {
            return t.get(e);
          };
      return i[t](this.models, s, n);
    };
  });
  const _ = (e.View = function(t) {
      (this.cid = i.uniqueId("view")),
        t || (t = {}),
        i.extend(this, i.pick(t, w)),
        this._ensureElement(),
        this.initialize.apply(this, arguments),
        this.delegateEvents();
    });
    const b = /^(\S+)\s*(.*)$/;
    var w = [
      "model",
      "collection",
      "el",
      "id",
      "attributes",
      "className",
      "tagName",
      "events",
    ];
  i.extend(_.prototype, o, {
    tagName: "div",
    $(t) {
      return this.$el.find(t);
    },
    initialize() {},
    render() {
      return this;
    },
    remove() {
      return this.$el.remove(), this.stopListening(), this;
    },
    setElement(t, i) {
      return (
        this.$el && this.undelegateEvents(),
        (this.$el = t instanceof e.$ ? t : e.$(t)),
        (this.el = this.$el[0]),
        i !== !1 && this.delegateEvents(),
        this
      );
    },
    delegateEvents(t) {
      if (!t && !(t = i.result(this, "events"))) return this;
      this.undelegateEvents();
      for (const e in t) {
        let n = t[e];
        if ((i.isFunction(n) || (n = this[t[e]]), n)) {
          const s = e.match(b);
            let r = s[1];
            const a = s[2];
          (n = i.bind(n, this)),
            (r += `.delegateEvents${  this.cid}`),
            a === "" ? this.$el.on(r, n) : this.$el.on(r, a, n);
        }
      }
      return this;
    },
    undelegateEvents() {
      return this.$el.off(`.delegateEvents${  this.cid}`), this;
    },
    _ensureElement() {
      if (this.el) this.setElement(i.result(this, "el"), !1);
      else {
        const t = i.extend({}, i.result(this, "attributes"));
        this.id && (t.id = i.result(this, "id")),
          this.className && (t.class = i.result(this, "className"));
        const n = e.$(`<${  i.result(this, "tagName")  }>`).attr(t);
        this.setElement(n, !1);
      }
    },
  }),
    (e.sync = function(t, n, s) {
      const r = E[t];
      i.defaults(s || (s = {}), {
        emulateHTTP: e.emulateHTTP,
        emulateJSON: e.emulateJSON,
      });
      const a = { type: r, dataType: "json" };
      if (
        (s.url || (a.url = i.result(n, "url") || j()),
        s.data != null ||
          !n ||
          (t !== "create" && t !== "update" && t !== "patch") ||
          ((a.contentType = "application/json"),
          (a.data = JSON.stringify(s.attrs || n.toJSON(s)))),
        s.emulateJSON &&
          ((a.contentType = "application/x-www-form-urlencoded"),
          (a.data = a.data ? { model: a.data } : {})),
        s.emulateHTTP && (r === "PUT" || r === "DELETE" || r === "PATCH"))
      ) {
        (a.type = "POST"), s.emulateJSON && (a.data._method = r);
        const o = s.beforeSend;
        s.beforeSend = function(t) {
          if ((t.setRequestHeader("X-HTTP-Method-Override", r), o))
            return o.apply(this, arguments);
        };
      }
      a.type === "GET" || s.emulateJSON || (a.processData = !1),
        a.type === "PATCH" &&
          x &&
          (a.xhr = function() {
            return new ActiveXObject("Microsoft.XMLHTTP");
          });
      const h = (s.xhr = e.ajax(i.extend(a, s)));
      return n.trigger("request", n, h, s), h;
    });
  var x = !(
      typeof window === "undefined" ||
      !window.ActiveXObject ||
      (window.XMLHttpRequest && new XMLHttpRequest().dispatchEvent)
    );
    var E = {
      create: "POST",
      update: "PUT",
      patch: "PATCH",
      delete: "DELETE",
      read: "GET",
    };
  e.ajax = function() {
    return e.$.ajax.apply(e.$, arguments);
  };
  const k = (e.Router = function(t) {
      t || (t = {}),
        t.routes && (this.routes = t.routes),
        this._bindRoutes(),
        this.initialize.apply(this, arguments);
    });
    const T = /\((.*?)\)/g;
    const $ = /(\(\?)?:\w+/g;
    const S = /\*\w+/g;
    const H = /[\-{}\[\]+?.,\\\^$|#\s]/g;
  i.extend(k.prototype, o, {
    initialize() {},
    route(t, n, s) {
      i.isRegExp(t) || (t = this._routeToRegExp(t)),
        i.isFunction(n) && ((s = n), (n = "")),
        s || (s = this[n]);
      const r = this;
      return (
        e.history.route(t, function(i) {
          const a = r._extractParameters(t, i);
          r.execute(s, a),
            r.trigger.apply(r, [`route:${  n}`].concat(a)),
            r.trigger("route", n, a),
            e.history.trigger("route", r, n, a);
        }),
        this
      );
    },
    execute(t, e) {
      t && t.apply(this, e);
    },
    navigate(t, i) {
      return e.history.navigate(t, i), this;
    },
    _bindRoutes() {
      if (this.routes) {
        this.routes = i.result(this, "routes");
        for (var t, e = i.keys(this.routes); (t = e.pop()) != null; )
          this.route(t, this.routes[t]);
      }
    },
    _routeToRegExp(t) {
      return (
        (t = t
          .replace(H, "\\$&")
          .replace(T, "(?:$1)?")
          .replace($, function(t, e) {
            return e ? t : "([^/?]+)";
          })
          .replace(S, "([^?]*?)")),
        new RegExp(`^${  t  }(?:\\?([\\s\\S]*))?$`)
      );
    },
    _extractParameters(t, e) {
      const n = t.exec(e).slice(1);
      return i.map(n, function(t, e) {
        return e === n.length - 1
          ? t || null
          : t
          ? decodeURIComponent(t)
          : null;
      });
    },
  });
  const A = (e.History = function() {
      (this.handlers = []),
        i.bindAll(this, "checkUrl"),
        typeof window !== "undefined" &&
          ((this.location = window.location), (this.history = window.history));
    });
    const I = /^[#\/]|\s+$/g;
    const N = /^\/+|\/+$/g;
    const R = /msie [\w.]+/;
    const O = /\/$/;
    const P = /#.*$/;
  (A.started = !1),
    i.extend(A.prototype, o, {
      interval: 50,
      atRoot() {
        return this.location.pathname.replace(/[^\/]$/, "$&/") === this.root;
      },
      getHash(t) {
        const e = (t || this).location.href.match(/#(.*)$/);
        return e ? e[1] : "";
      },
      getFragment(t, e) {
        if (t == null)
          if (this._hasPushState || !this._wantsHashChange || e) {
            t = decodeURI(this.location.pathname + this.location.search);
            const i = this.root.replace(O, "");
            t.indexOf(i) || (t = t.slice(i.length));
          } else t = this.getHash();
        return t.replace(I, "");
      },
      start(t) {
        if (A.started)
          throw new Error("Backbone.history has already been started");
        (A.started = !0),
          (this.options = i.extend({ root: "/" }, this.options, t)),
          (this.root = this.options.root),
          (this._wantsHashChange = this.options.hashChange !== !1),
          (this._wantsPushState = !!this.options.pushState),
          (this._hasPushState = !!(
            this.options.pushState &&
            this.history &&
            this.history.pushState
          ));
        const n = this.getFragment();
          const s = document.documentMode;
          const r = R.exec(navigator.userAgent.toLowerCase()) && (!s || s <= 7);
        if (
          ((this.root = (`/${  this.root  }/`).replace(N, "/")),
          r && this._wantsHashChange)
        ) {
          const a = e.$('<iframe src="javascript:0" tabindex="-1">');
          (this.iframe = a.hide().appendTo("body")[0].contentWindow),
            this.navigate(n);
        }
        this._hasPushState
          ? e.$(window).on("popstate", this.checkUrl)
          : this._wantsHashChange && "onhashchange" in window && !r
          ? e.$(window).on("hashchange", this.checkUrl)
          : this._wantsHashChange &&
            (this._checkUrlInterval = setInterval(
              this.checkUrl,
              this.interval,
            )),
          (this.fragment = n);
        const o = this.location;
        if (this._wantsHashChange && this._wantsPushState) {
          if (!this._hasPushState && !this.atRoot())
            return (
              (this.fragment = this.getFragment(null, !0)),
              this.location.replace(`${this.root  }#${  this.fragment}`),
              !0
            );
          this._hasPushState &&
            this.atRoot() &&
            o.hash &&
            ((this.fragment = this.getHash().replace(I, "")),
            this.history.replaceState(
              {},
              document.title,
              this.root + this.fragment,
            ));
        }
        if (!this.options.silent) return this.loadUrl();
      },
      stop() {
        e
          .$(window)
          .off("popstate", this.checkUrl)
          .off("hashchange", this.checkUrl),
          this._checkUrlInterval && clearInterval(this._checkUrlInterval),
          (A.started = !1);
      },
      route(t, e) {
        this.handlers.unshift({ route: t, callback: e });
      },
      checkUrl(t) {
        let e = this.getFragment();
        return (
          e === this.fragment &&
            this.iframe &&
            (e = this.getFragment(this.getHash(this.iframe))),
          e !== this.fragment &&
            (this.iframe && this.navigate(e), void this.loadUrl())
        );
      },
      loadUrl(t) {
        return (
          (t = this.fragment = this.getFragment(t)),
          i.any(this.handlers, function(e) {
            if (e.route.test(t)) return e.callback(t), !0;
          })
        );
      },
      navigate(t, e) {
        if (!A.started) return !1;
        (e && e !== !0) || (e = { trigger: !!e });
        let i = this.root + (t = this.getFragment(t || ""));
        if (((t = t.replace(P, "")), this.fragment !== t)) {
          if (
            ((this.fragment = t),
            t === "" && i !== "/" && (i = i.slice(0, -1)),
            this._hasPushState)
          )
            this.history[e.replace ? "replaceState" : "pushState"](
              {},
              document.title,
              i,
            );
          else {
            if (!this._wantsHashChange) return this.location.assign(i);
            this._updateHash(this.location, t, e.replace),
              this.iframe &&
                t !== this.getFragment(this.getHash(this.iframe)) &&
                (e.replace || this.iframe.document.open().close(),
                this._updateHash(this.iframe.location, t, e.replace));
          }
          return e.trigger ? this.loadUrl(t) : void 0;
        }
      },
      _updateHash(t, e, i) {
        if (i) {
          const n = t.href.replace(/(javascript:|#).*$/, "");
          t.replace(`${n  }#${  e}`);
        } else t.hash = `#${  e}`;
      },
    }),
    (e.history = new A());
  const C = function(t, e) {
    let n;
      const s = this;
    (n =
      t && i.has(t, "constructor")
        ? t.constructor
        : function() {
            return s.apply(this, arguments);
          }),
      i.extend(n, s, e);
    const r = function() {
      this.constructor = n;
    };
    return (
      (r.prototype = s.prototype),
      (n.prototype = new r()),
      t && i.extend(n.prototype, t),
      (n.__super__ = s.prototype),
      n
    );
  };
  d.extend = p.extend = k.extend = _.extend = A.extend = C;
  var j = function() {
      throw new Error('A "url" property or function must be specified');
    };
    var U = function(t, e) {
      const i = e.error;
      e.error = function(n) {
        i && i(t, n, e), t.trigger("error", t, n, e);
      };
    };
  return e;
}),
  (Backbone.View = (function(t) {
    return t.extend({
      constructor(e) {
        (this.options = e || {}), t.apply(this, arguments);
      },
    });
  })(Backbone.View));
