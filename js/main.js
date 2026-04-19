// ============================================
// DER KRIEGER — main.js
// ============================================

// --- NAVBAR SCROLL ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// --- MOBILE MENU ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

// Menü schließen beim Klick auf Link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// --- SCROLL REVEAL ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// --- EPISODE CLICK ---
document.querySelectorAll('.episode').forEach(ep => {
  ep.addEventListener('click', function () {
    document.querySelectorAll('.episode').forEach(e => e.classList.remove('active'));
    this.classList.add('active');
  });
});

// --- BOOKING FORM ---
const form = document.getElementById('bookingForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Nachricht gesendet ✓';
    btn.style.background = '#1a6e3a';
    setTimeout(() => {
      btn.textContent = 'Anfrage absenden';
      btn.style.background = '';
      form.reset();
    }, 4000);
  });
}
