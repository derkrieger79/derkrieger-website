/* DER KRIEGER — main.js | Teaser */

// ── Google Fonts (nur nach Zustimmung laden) ──────────────
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Manrope:wght@300;400;700&display=swap';

function loadFonts() {
  if (document.getElementById('gfonts')) return;
  const l = document.createElement('link');
  l.id = 'gfonts'; l.rel = 'stylesheet'; l.href = FONTS_URL;
  document.head.appendChild(l);
}

// ── Cookie Consent ────────────────────────────────────────
const CONSENT_KEY = 'dk_cookie_consent';

function initCookieBanner() {
  const banner  = document.getElementById('cookieBanner');
  const accept  = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');
  if (!banner) return;

  const saved = localStorage.getItem(CONSENT_KEY);
  if (saved === 'accepted') { loadFonts(); return; }
  if (saved === 'declined') return;

  // Show banner after short delay
  setTimeout(() => banner.classList.add('visible'), 600);

  accept.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    banner.classList.remove('visible');
    loadFonts();
  });

  decline.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    banner.classList.remove('visible');
  });
}

// ── Navbar ────────────────────────────────────────────────
const navbar  = document.getElementById('navbar');
const toggle  = document.getElementById('navToggle');
const navMenu = document.getElementById('navLinks');

window.addEventListener('scroll', () =>
  navbar.classList.toggle('scrolled', window.scrollY > 40), {passive: true});

toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(l =>
  l.addEventListener('click', () => {
    toggle.classList.remove('open');
    navMenu.classList.remove('open');
  })
);

// ── Scroll Reveal ─────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, {threshold: 0.1});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Newsletter Form ───────────────────────────────────────
function initNewsletter() {
  const form    = document.getElementById('newsletterForm');
  const success = document.getElementById('nlSuccess');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.nl-btn');
    btn.textContent = 'Wird eingetragen…';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      await fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams(data).toString()
      });
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    } catch {
      btn.textContent = 'Jetzt eintragen';
      btn.disabled = false;
      alert('Leider ist ein Fehler aufgetreten. Bitte versuche es nochmal.');
    }
  });
}

// ── Dein-Gespräch Anfrage-Form ────────────────────────────
function initGespraech() {
  const form    = document.getElementById('gespraechForm');
  const success = document.getElementById('dgSuccess');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.dgp-submit');
    btn.textContent = 'Wird gesendet…';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      await fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams(data).toString()
      });
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    } catch {
      btn.textContent = 'Ich bin bereit.';
      btn.disabled = false;
      alert('Leider ist ein Fehler aufgetreten. Bitte versuche es nochmal oder schreib direkt an martin@derkrieger.at.');
    }
  });
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCookieBanner();
  initNewsletter();
  initGespraech();
});
