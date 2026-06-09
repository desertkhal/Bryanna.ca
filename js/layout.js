/* Shared masthead + footer, injected into every page.
   Keeps navigation in ONE place so adding/renaming wings is a single edit. */
(function () {
  var WINGS = [
    { id: "home",       label: "Entrance",  href: "index.html" },
    { id: "portraits",  label: "Portraits", href: "portraits.html" },
    { id: "collection", label: "Collection",href: "collection.html" },
    { id: "voyage",     label: "Travel",    href: "voyage.html" },
    { id: "cuisine",    label: "Cuisine",   href: "cuisine.html" },
    { id: "guestbook",  label: "Guestbook", href: "guestbook.html" }
  ];

  var current = document.body.getAttribute("data-page") || "home";
  var year = "MMXXVI"; // engraved est. year, edit in one place if needed

  // ---- masthead ----
  var links = WINGS.map(function (w) {
    var cur = w.id === current ? ' aria-current="page"' : "";
    return '<a href="' + w.href + '"' + cur + ">" + w.label + "</a>";
  }).join("");

  var masthead =
    '<header class="masthead"><div class="bar">' +
      '<a class="brand" href="index.html">Le Musée de Bryanna ' +
        '<span class="est">Est. ' + year + '</span></a>' +
      '<button class="nav-toggle" aria-label="Menu" aria-expanded="false">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>' +
        '<line x1="3" y1="18" x2="21" y2="18"/></svg></button>' +
      '<nav class="nav-links">' + links + '</nav>' +
    '</div></header>';

  var footer =
    '<footer class="museum-foot">' +
      '<div class="name">Le Musée de Bryanna</div>' +
      '<div class="small">Admission: Free &middot; Closing Date: Never</div>' +
    '</footer>';

  // inject
  var top = document.getElementById("masthead");
  if (top) top.outerHTML = masthead;
  var bottom = document.getElementById("footer");
  if (bottom) bottom.outerHTML = footer;

  // mobile toggle (re-query because we replaced the node)
  var btn = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav-links");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // gentle image fade-in for anything tagged .fade-img
  document.querySelectorAll("img.fade-img").forEach(function (img) {
    if (img.complete) img.classList.add("loaded");
    else img.addEventListener("load", function () { img.classList.add("loaded"); });
  });
})();
