/* Renders the static wings (portraits, collection, cuisine) from the
   data/*.js files. Each function no-ops if its container isn't on the page. */
(function () {
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function img(src, cls) {
    return '<img class="' + cls + ' fade-img" loading="lazy" src="' + esc(src) + '" alt="">';
  }

  // ---- Portrait Gallery ----
  var g = document.getElementById("gallery");
  if (g) {
    var P = window.PORTRAITS || [];
    if (!P.length) {
      g.outerHTML = '<div class="placeholder">The Portrait Gallery is being hung. ' +
        'The first acquisitions arrive shortly.</div>';
    } else {
      g.innerHTML = P.map(function (p) {
        var art = p.file
          ? img("images/portraits/" + p.file, "")
          : "";
        return '<figure class="frame"><div class="art">' + art + "</div>" +
          '<figcaption class="placard">' +
          '<div class="t">' + esc(p.title) + "</div>" +
          (p.meta ? '<div class="meta">' + esc(p.meta) + "</div>" : "") +
          (p.desc ? '<p class="desc">' + esc(p.desc) + "</p>" : "") +
          "</figcaption></figure>";
      }).join("");
    }
  }

  // ---- Permanent Collection (timeline) ----
  var t = document.getElementById("timeline");
  if (t) {
    var E = window.EVENTS || [];
    if (!E.length) {
      t.outerHTML = '<div class="placeholder">The record begins soon.</div>';
    } else {
      t.innerHTML = E.map(function (e) {
        var photo = e.photo
          ? '<div class="ephoto">' + img(e.photo, "") + "</div>" : "";
        return '<div class="event">' +
          '<div class="date">' + esc(e.date) + "</div>" +
          '<div class="et">' + esc(e.title) + "</div>" +
          '<p class="ed">' + esc(e.desc) + "</p>" + photo + "</div>";
      }).join("");
    }
  }

  // ---- Culinary Archive (menus) ----
  var c = document.getElementById("cuisine");
  if (c) {
    var M = window.MENUS || [];
    if (!M.length) {
      c.outerHTML = '<div class="placeholder">The kitchen is warming up.</div>';
    } else {
      c.innerHTML = M.map(function (m) {
        var courses = (m.courses || []).map(function (co) {
          return '<div class="course">' +
            (co.kind ? '<div class="ckind">' + esc(co.kind) + "</div>" : "") +
            '<div class="cname">' + esc(co.name) + "</div>" +
            (co.history ? '<p class="chist">' + esc(co.history) + "</p>" : "") +
            "</div>";
        }).join("");
        return '<article class="menu"><div class="mhead">' +
          (m.occasion ? '<div class="occasion">' + esc(m.occasion) + "</div>" : "") +
          '<div class="mtitle">' + esc(m.title) + "</div>" +
          (m.date ? '<div class="mdate">' + esc(m.date) + "</div>" : "") +
          "</div>" + courses + "</article>";
      }).join("");
    }
  }
})();
