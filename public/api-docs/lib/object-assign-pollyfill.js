typeof Object.assign !== "function" &&
  !(function() {
    Object.assign = function(n) {
      if (void 0 === n || n === null)
        throw new TypeError("Cannot convert undefined or null to object");
      for (var t = Object(n), o = 1; o < arguments.length; o++) {
        const r = arguments[o];
        if (void 0 !== r && r !== null)
          for (const e in r)
            Object.prototype.hasOwnProperty.call(r, e) && (t[e] = r[e]);
      }
      return t;
    };
  })();
