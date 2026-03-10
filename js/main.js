/* Thorne & Skinner — main.js */

/* ── Mobile Nav Toggle ────────────────────────────────────── */
(function() {
  var btn = document.getElementById('navHamburger');
  var links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', function() {
    links.classList.toggle('nav__links--open');
    var open = links.classList.contains('nav__links--open');
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      links.classList.remove('nav__links--open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('nav__links--open');
    }
  });
})();

/* ── Sticky Nav Shadow ────────────────────────────────────── */
(function() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(0,0,0,0.35)'
      : '0 2px 12px rgba(0,0,0,0.25)';
  }, { passive: true });
})();
