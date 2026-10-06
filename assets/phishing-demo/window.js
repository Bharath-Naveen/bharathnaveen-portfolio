/*
 * Opens the phishing live demo as a window over the project page (bharathnaveen.com).
 * A link to this page ending in #try opens the window directly.
 */
(function () {
  "use strict";
  var app = document.getElementById("pd-app");
  if (!app) return;
  var win = app.querySelector(".pd-win"), tabs = [].slice.call(app.querySelectorAll(".pd-tabs button"));
  var panes = [].slice.call(app.querySelectorAll(".pd-pane")), opener = null;
  var OPEN = { "#try": 1, "#demo-window": 1 };

  function show(name) {
    tabs.forEach(function (t) { t.setAttribute("aria-selected", t.getAttribute("data-tab") === name ? "true" : "false"); });
    panes.forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== name; });
    if (name === "replays") { var g = app.querySelector(".pd-gallery"); if (g) g.dispatchEvent(new Event("scroll")); }
  }
  function open(from) {
    if (!app.hidden) return;
    opener = from || document.activeElement;
    app.hidden = false; document.documentElement.style.overflow = "hidden";
    var input = app.querySelector("#pd-url");
    if (input && window.matchMedia("(min-width:681px)").matches) input.focus(); else win.querySelector(".pd-x").focus();
  }
  function close() {
    if (app.hidden) return;
    app.hidden = true; document.documentElement.style.overflow = "";
    if (OPEN[location.hash]) history.replaceState(null, "", location.pathname + location.search);
    if (opener && opener.focus) opener.focus();
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { show(t.getAttribute("data-tab")); }); });
  app.querySelector(".pd-x").addEventListener("click", close);
  app.addEventListener("mousedown", function (e) { if (e.target === app) close(); });
  document.addEventListener("keydown", function (e) {
    if (app.hidden) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    var f = [].slice.call(win.querySelectorAll("a[href],button:not([disabled]),input,summary,[tabindex='0']")).filter(function (n) { return n.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href="#try"]');
    if (a) { e.preventDefault(); open(a); }
  });
  function fromHash() { if (OPEN[location.hash]) open(null); }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
