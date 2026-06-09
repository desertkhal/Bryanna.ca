/* The Travel Wing: Leaflet map (free, no API key).
   Tapping a pin fills the detail panel BELOW the map with that trip's
   blurb + photo gallery. Reads window.TRIPS. */
(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var TRIPS = window.TRIPS || [];
  var mapEl = document.getElementById("map");
  var detailEl = document.getElementById("trip-detail");
  if (!mapEl || typeof L === "undefined") return;

  var pts = TRIPS.filter(function (t) {
    return typeof t.lat === "number" && typeof t.lng === "number";
  });

  var map = L.map("map", { scrollWheelZoom: false });
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    maxZoom: 19
  }).addTo(map);

  if (!pts.length) { map.setView([30, 0], 2); return; }

  // a proper red map pin (teardrop), tip anchored to the coordinate
  var PIN =
    '<svg width="30" height="40" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 0C5.37 0 0 5.37 0 12c0 8.4 12 20 12 20s12-11.6 12-20C24 5.37 18.63 0 12 0z" ' +
        'fill="#cf2b2b" stroke="#ffffff" stroke-width="1.6"/>' +
      '<circle cx="12" cy="12" r="4.4" fill="#ffffff"/>' +
    '</svg>';

  function renderDetail(t) {
    if (!detailEl) return;
    var photos = (t.photos && t.photos.length) ? t.photos : (t.file ? [t.file] : []);
    var h = '<div class="td-head">';
    h += '<h3 class="td-place">' + esc(t.place) + "</h3>";
    if (t.when) h += '<div class="td-when">' + esc(t.when) + "</div>";
    h += "</div>";
    if (t.story) h += '<p class="td-story">' + esc(t.story) + "</p>";

    if (photos.length) {
      h += '<div class="td-gallery">' + photos.map(function (f) {
        return '<a class="td-shot zoomable" href="images/trips/' + esc(f) + '">' +
          '<img loading="lazy" src="images/trips/' + esc(f) + '" alt=""></a>';
      }).join("") + "</div>";
    } else if (!t.story) {
      h += '<div class="td-empty">Field notes and photographs forthcoming.</div>';
    }
    detailEl.innerHTML = h;
  }

  var markers = [];
  function select(i, scroll) {
    renderDetail(pts[i]);
    markers.forEach(function (m, idx) {
      var el = m.getElement();
      if (el) el.classList.toggle("is-active", idx === i);
    });
    if (scroll && detailEl) {
      detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  var bounds = [];
  pts.forEach(function (t, i) {
    var icon = L.divIcon({
      className: "museum-pin", html: PIN,
      iconSize: [30, 40], iconAnchor: [15, 40]
    });
    var m = L.marker([t.lat, t.lng], { icon: icon }).addTo(map);
    m.on("click", function () { select(i, true); });
    markers.push(m);
    bounds.push([t.lat, t.lng]);
  });

  if (bounds.length === 1) map.setView(bounds[0], 6);
  else map.fitBounds(bounds, { padding: [55, 55], maxZoom: 6 });

  // nothing is shown below the map until the visitor taps a pin
})();
