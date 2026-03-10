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

  links.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      links.classList.remove('nav__links--open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function(e) {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('nav__links--open');
    }
  });
})();

/* ── Sticky Nav: Shadow + Frosted Glass on Scroll ─────────── */
(function() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    var scrolled = window.scrollY > 60;
    nav.classList.toggle('nav--scrolled', scrolled);
    nav.style.boxShadow = scrolled
      ? '0 2px 20px rgba(0,0,0,0.40)'
      : '0 2px 12px rgba(0,0,0,0.25)';
  }, { passive: true });
})();

/* ── Attorney Photo Fallback (initials placeholder) ──────── */
(function() {
  document.querySelectorAll('.attorney__photo img').forEach(function(img) {
    function markFallback() {
      var wrap = img.closest('.attorney__photo');
      if (wrap) wrap.classList.add('attorney__photo--fallback');
    }
    img.addEventListener('error', markFallback);
    // Defer the already-complete check so the browser finishes decoding first
    if (img.complete) {
      requestAnimationFrame(function() {
        if (img.naturalWidth === 0) markFallback();
      });
    }
  });
})();

/* ── Scroll Reveal (Intersection Observer) ───────────────── */
(function() {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(function(el) { el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

  els.forEach(function(el) { io.observe(el); });

  // Fallback: force-reveal any still-hidden elements after 3 s.
  // Covers full-page screenshots, print views, and edge cases
  // where IntersectionObserver never fires.
  setTimeout(function() {
    els.forEach(function(el) {
      if (!el.classList.contains('is-visible')) {
        el.classList.add('is-visible');
      }
    });
  }, 3000);
})();

/* ── Trust Bar: Counter Animation + Pop ─────────────────── */
(function() {
  var trust = document.querySelector('.trust');
  if (!trust) return;
  var triggered = false;

  function runCounters() {
    if (triggered) return;
    triggered = true;
    trust.classList.add('trust--pop');

    trust.querySelectorAll('.trust__num').forEach(function(el) {
      var raw = el.textContent.trim();
      var match = raw.match(/^(\$?)(\d+\.?\d*)(.*)$/);
      if (!match) return;
      var prefix   = match[1];
      var num      = parseFloat(match[2]);
      var suffix   = match[3];
      var decimals = raw.includes('.') ? 1 : 0;
      if (isNaN(num) || num === 0) return;

      var duration  = 1300;
      var startTime = null;

      (function animate(ts) {
        if (!startTime) startTime = ts;
        var p    = Math.min((ts - startTime) / duration, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (num * ease).toFixed(decimals) + suffix;
        if (p < 1) { requestAnimationFrame(animate); }
        else        { el.textContent = prefix + num.toFixed(decimals) + suffix; }
      })(performance.now());
    });
  }

  if (!('IntersectionObserver' in window)) { runCounters(); return; }

  var io = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) { runCounters(); io.disconnect(); }
  }, { threshold: 0.4 });
  io.observe(trust);
})();

/* ── Hero Parallax (desktop only, passive scroll) ───────── */
(function() {
  if (window.innerWidth < 768) return;
  var heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;
  var ticking = false;

  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      heroBg.style.transform = 'translateY(' + (window.scrollY * 0.4) + 'px)';
      ticking = false;
    });
  }, { passive: true });
})();
