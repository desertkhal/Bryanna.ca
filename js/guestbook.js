/* Le Livre d'Or — the Guestbook. Stores signatures in Supabase.
   Table expected: public.guestbook (id, name, message, created_at, hidden).
   See supabase-setup.sql for the exact table + security rules. */
(function () {
  var cfg = window.MUSEUM_CONFIG || {};
  var statusEl = document.getElementById("gb-status");
  var listEl = document.getElementById("entries");
  var form = document.getElementById("gb-form");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function say(msg) { if (statusEl) statusEl.textContent = msg; }

  var ready = cfg.SUPABASE_URL && cfg.SUPABASE_URL.indexOf("PASTE_") !== 0 &&
              typeof supabase !== "undefined";

  if (!ready) {
    if (listEl) listEl.innerHTML = '<div class="placeholder">The Guestbook ' +
      'opens once the museum is connected. (Add your Supabase keys in ' +
      'js/config.js.)</div>';
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault(); say("Guestbook not connected yet.");
    });
    return;
  }

  var db = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleDateString(undefined,
        { year: "numeric", month: "long", day: "numeric" });
    } catch (e) { return ""; }
  }

  function load() {
    db.from("guestbook")
      .select("name,message,created_at")
      .eq("hidden", false)
      .order("created_at", { ascending: false })
      .limit(500)
      .then(function (res) {
        if (res.error) { say("Could not load the guestbook."); return; }
        var rows = res.data || [];
        if (!listEl) return;
        if (!rows.length) {
          listEl.innerHTML = '<div class="placeholder">No one has signed yet. ' +
            'Be the first.</div>';
          return;
        }
        listEl.innerHTML = rows.map(function (r) {
          return '<div class="entry"><p class="msg">' + esc(r.message) + "</p>" +
            '<div class="sig"><span class="name">' + esc(r.name) + "</span>" +
            '<span class="date">' + fmtDate(r.created_at) + "</span></div></div>";
        }).join("");
      });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var hp = form.querySelector(".gb-hp input");
      if (hp && hp.value) return; // bot caught in honeypot

      var name = (form.name.value || "").trim();
      var message = (form.message.value || "").trim();
      if (!name || !message) { say("Please add your name and a message."); return; }
      if (name.length > 80) name = name.slice(0, 80);
      if (message.length > 1000) message = message.slice(0, 1000);

      say("Signing…");
      var btn = form.querySelector("button[type=submit]");
      if (btn) btn.disabled = true;

      db.from("guestbook").insert({ name: name, message: message })
        .then(function (res) {
          if (btn) btn.disabled = false;
          if (res.error) { say("Something went wrong — please try again."); return; }
          form.reset();
          say("Thank you for signing. ✦");
          load();
        });
    });
  }

  load();
})();
