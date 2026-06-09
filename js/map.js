/* The Travel Wing: Leaflet map (free, no API key) + matching trip cards.
   Reads window.TRIPS from data/trips.js. */
(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  var TRIPS = window.TRIPS || [];

  // ---- cards ----
  var list = document.getElementById("trips");
  if (list) {
    if (!TRIPS.length) {
      list.outerHTML = '<div class="placeholder">The passport is empty — ' +
        'for now. The first expeditions will be logged here.</div>';
    } else {
      list.innerHTML = TRIPS.map(function (t, i) {
        var art = t.file
          ? '<div class="art"><img class="fade-img" loading="lazy" src="images/trips/' +
            esc(t.file) + '" alt=""></div>' : "";
        return '<article class="trip" id="trip-' + i + '">' + art +
          '<div class="body"><div class="place">' + esc(t.place) + "</div>" +
          (t.when ? '<div class="when">' + esc(t.when) + "</div>" : "") +
          (t.story ? '<p class="story">' + esc(t.story) + "</p>" : "") +
          "</div></article>";
      }).join("");
    }
  }

  // ---- map ----
  var mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return;

  var pts = TRIPS.filter(function (t) {
    return typeof t.lat === "number" && typeof t.lng === "number";
  });

  var map = L.map("map", { scrollWheelZoom: false });
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    maxZoom: 19
  }).addTo(map);

  if (!pts.length) {
    map.setView([20, 0], 2);
    return;
  }

  var brass = "#a8895a";
  var markers = pts.map(function (t) {
    var i = TRIPS.indexOf(t);
    var icon = L.divIcon({
      className: "",
      html: '<div style="width:14px;height:14px;border-radius:50%;background:' + brass +
        ';border:2.5px solid #fff;box-shadow:0 0 0 1px rgba(138,109,66,.55),0 2px 6px rgba(40,30,10,.45)"></div>',
      iconSize: [14, 14], iconAnchor: [7, 7]
    });
    var m = L.marker([t.lat, t.lng], { icon: icon }).addTo(map);
    m.bindPopup("<b>" + esc(t.place) + "</b>" +
      (t.when ? "<br>" + esc(t.when) : ""));
    m.on("click", function () {
      var card = document.getElementById("trip-" + i);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return [t.lat, t.lng];
  });

  if (markers.length === 1) map.setView(markers[0], 6);
  else map.fitBounds(markers, { padding: [40, 40] });
})();
