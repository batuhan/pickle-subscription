!(function() {
  let h;
  let l;
  (h = hljs.configure),
    (hljs.configure = function(l) {
      const i = l.highlightSizeThreshold;
      (hljs.highlightSizeThreshold = i === +i ? i : null), h.call(this, l);
    }),
    (l = hljs.highlightBlock),
    (hljs.highlightBlock = function(h) {
      const i = h.innerHTML;
      const g = hljs.highlightSizeThreshold;
      (g == null || g > i.length) && l.call(hljs, h);
    });
})();
