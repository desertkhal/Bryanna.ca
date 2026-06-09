/* Elegant lightbox for gallery images.
   Any <a class="zoomable" href="image.jpg"> opens in an animated overlay
   instead of navigating. Close with the ×, a click on the backdrop, or Esc. */
(function () {
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.setAttribute("aria-hidden", "true");
  lb.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<img class="lb-img" src="" alt="">';
  document.body.appendChild(lb);

  var img = lb.querySelector(".lb-img");
  var closeBtn = lb.querySelector(".lb-close");
  var hideTimer;

  function open(src) {
    clearTimeout(hideTimer);
    img.src = src;
    lb.style.display = "flex";
    void lb.offsetWidth;            // force reflow so the transition runs
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    hideTimer = setTimeout(function () { lb.style.display = "none"; img.src = ""; }, 320);
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a.zoomable");
    if (a) { e.preventDefault(); open(a.getAttribute("href")); return; }
    // click on backdrop or close button (but not the image itself)
    if (e.target === lb || e.target === closeBtn) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lb.classList.contains("open")) close();
  });
})();
