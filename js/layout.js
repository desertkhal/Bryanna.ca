/* Shared masthead + footer, injected into every page.
   Keeps navigation in ONE place so adding/renaming wings is a single edit. */
(function () {
  var WINGS = [
    { id: "home",       label: "Entrance",  href: "index.html",      full: "the Entrance" },
    { id: "portraits",  label: "Portraits", href: "portraits.html",  full: "the Portrait Gallery" },
    { id: "collection", label: "Collection",href: "collection.html", full: "the Collection" },
    { id: "voyage",     label: "Travel",    href: "voyage.html",     full: "the Travel Wing" },
    { id: "cuisine",    label: "Cuisine",   href: "cuisine.html",    full: "the Culinary Archive" },
    { id: "guestbook",  label: "Guestbook", href: "guestbook.html",  full: "the Guestbook" }
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

  // a subtle "next wing" link at the foot of every wing (not the entrance)
  var nextNav = "";
  var idx = -1;
  for (var k = 0; k < WINGS.length; k++) { if (WINGS[k].id === current) idx = k; }
  if (current !== "home" && idx !== -1) {
    var nxt = WINGS[(idx + 1) % WINGS.length];
    var verb = nxt.id === "home" ? "Return to" : "Continue to";
    nextNav =
      '<div class="next-wing-wrap"><a class="next-wing" href="' + nxt.href + '">' +
        '<span class="nw-label">' + verb + '</span>' +
        '<span class="nw-name">' + nxt.full + '</span>' +
        '<span class="nw-arrow" aria-hidden="true">→</span>' +
      '</a></div>';
  }

  // inject
  var top = document.getElementById("masthead");
  if (top) top.outerHTML = masthead;
  var bottom = document.getElementById("footer");
  if (bottom) bottom.outerHTML = nextNav + footer;

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

  // animated transition when leaving via the "next wing" button
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nwLink = document.querySelector(".next-wing");
  if (nwLink) {
    nwLink.addEventListener("click", function (e) {
      if (reduce || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      var href = nwLink.getAttribute("href");
      document.body.classList.add("is-leaving");
      setTimeout(function () { window.location.href = href; }, 280);
    });
  }
})();
