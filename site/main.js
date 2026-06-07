/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
const totop  = document.getElementById('totop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  navbar.classList.toggle('scrolled', scrolled);
  if (totop) totop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

if (totop) totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Burger menu ── */
const burger   = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Active nav link ── */
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* ── Smooth anchor scroll with offset ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── FAQ accordion ── */
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('open'));
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

/* ── Price Calculator ── */
const TARIFS = [
  { range: '≤ 100 m²',       price: 25,  passes: 8, monthly: 14.17, sap: 7.08  },
  { range: '100–200 m²',     price: 34,  passes: 8, monthly: 19.25, sap: 9.62  },
  { range: '200–350 m²',     price: 45,  passes: 8, monthly: 25.50, sap: 12.75 },
  { range: '350–500 m²',     price: 55,  passes: 8, monthly: 31.17, sap: 15.59 },
  { range: '500–750 m²',     price: 68,  passes: 8, monthly: 38.50, sap: 19.25 },
  { range: '750–1 000 m²',   price: 82,  passes: 7, monthly: 40.67, sap: 20.34 },
  { range: '1 000–1 500 m²', price: 110, passes: 7, monthly: 54.50, sap: 27.25 },
  { range: '1 500–2 000 m²', price: 135, passes: 6, monthly: 57.33, sap: 28.66 },
];

let calcMode = 'abo';

function fmtNum(n) { return n.toFixed(2).replace('.', ','); }

function updateSliderFill() {
  const sl = document.getElementById('calcSlider');
  if (!sl) return;
  const pct = (parseInt(sl.value) / 7) * 100;
  sl.style.background = `linear-gradient(to right, var(--green-light) ${pct}%, rgba(255,255,255,.18) ${pct}%)`;
}

function updateCalc() {
  const sliderEl = document.getElementById('calcSlider');
  if (!sliderEl) return;
  const idx = parseInt(sliderEl.value);
  const t = TARIFS[idx];
  updateSliderFill();
  document.getElementById('calcRangeDisplay').textContent = t.range;

  if (calcMode === 'abo') {
    const annuel  = t.monthly * 12;
    const economy = (t.price * t.passes) - annuel;
    document.getElementById('calcBadge').textContent = 'ABONNEMENT ANNUEL';
    document.getElementById('calcType').textContent  = 'ABONNEMENT CLASSIQUE';
    document.getElementById('calcPrice').innerHTML   = fmtNum(t.monthly) + ' <span class="unit">€/mois</span>';
    document.getElementById('calcSub').textContent   = 'soit ' + fmtNum(annuel) + ' €/an · lissé sur 12 mois · prélèvement SEPA';
    const ecoEl = document.getElementById('calcEconomy');
    if (economy > 0) { ecoEl.style.display = 'inline-flex'; ecoEl.textContent = '🌿 Économie de ' + fmtNum(economy) + ' € vs à la prestation'; }
    else { ecoEl.style.display = 'none'; }
    document.getElementById('calcDesc').textContent = "La tranquillité toute l'année — votre jardin tondu régulièrement, les allées soufflées en hiver, et les produits saisonniers livrés et posés lors de chaque passage. Un seul prélèvement mensuel, aucune mauvaise surprise.";
    document.getElementById('cl-passes').innerHTML  = t.passes + ' passages de tonte / an (avril → octobre) — <strong>' + t.passes + ' passages/an</strong>';
    document.getElementById('cl-souffleur').style.display = 'flex';
    document.getElementById('cl-resil').style.display     = 'flex';
    document.getElementById('cl-sepa').style.display      = 'flex';
    document.getElementById('calcSap').textContent        = fmtNum(t.sap) + ' €/mois réels';
    document.getElementById('calcSapNote').style.display  = 'block';
  } else {
    document.getElementById('calcBadge').textContent = 'PASSAGE UNIQUE';
    document.getElementById('calcType').textContent  = 'TARIF PASSAGE';
    document.getElementById('calcPrice').innerHTML   = t.price + ' <span class="unit">€</span>';
    document.getElementById('calcSub').textContent   = 'par passage · sans engagement';
    document.getElementById('calcEconomy').style.display  = 'none';
    document.getElementById('calcDesc').textContent = "Un passage ponctuel, sans engagement. Tonte complète au tracteur-tondeuse avec finition rotofil. Tarif calculé sur la superficie réelle de votre jardin.";
    document.getElementById('cl-passes').textContent      = 'Tonte complète bord à bord au tracteur-tondeuse';
    document.getElementById('cl-souffleur').style.display = 'none';
    document.getElementById('cl-resil').style.display     = 'none';
    document.getElementById('cl-sepa').style.display      = 'none';
    document.getElementById('calcSap').textContent        = fmtNum(t.price / 2) + ' € réels';
    document.getElementById('calcSapNote').style.display  = 'block';
  }
}

function setCalcMode(mode) {
  calcMode = mode;
  document.getElementById('tabAbo').classList.toggle('active', mode === 'abo');
  document.getElementById('tabPass').classList.toggle('active', mode === 'pass');
  updateCalc();
}

const sliderEl = document.getElementById('calcSlider');
if (sliderEl) { sliderEl.addEventListener('input', updateCalc); updateCalc(); }

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Form submission ── */
const _pageLoadTs = Date.now();

function _validEmail(v) { return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(v); }

function _checkRateLimit() {
  const now  = Date.now();
  const list = JSON.parse(localStorage.getItem('_at_rl') || '[]').filter(t => now - t < 3600000);
  if (list.length >= 3) return false;
  list.push(now);
  localStorage.setItem('_at_rl', JSON.stringify(list));
  return true;
}

const devisForm = document.getElementById('devisForm');
if (devisForm) {
  devisForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const prenom  = document.getElementById('prenom').value.trim();
    const email   = document.getElementById('email').value.trim();
    const ville   = document.getElementById('ville').value.trim();
    const success = document.getElementById('formSuccess');
    const error   = document.getElementById('formError');
    success.style.display = 'none';
    error.style.display   = 'none';

    if (!prenom || !email || !ville) {
      error.style.display = 'block';
      error.textContent   = '⚠️ Veuillez renseigner au moins votre prénom, e-mail et ville.';
      return;
    }
    if (!_validEmail(email)) {
      error.style.display = 'block';
      error.textContent   = '⚠️ Adresse e-mail invalide. Vérifiez le format (ex : jean@email.fr).';
      return;
    }
    if (Date.now() - _pageLoadTs < 4000) {
      success.style.display = 'block';
      success.textContent   = '✅ Votre demande a bien été envoyée ! Je vous réponds sous 48h.';
      this.reset(); return;
    }
    if (!_checkRateLimit()) {
      error.style.display = 'block';
      error.textContent   = '⚠️ Trop de tentatives. Attendez une heure ou écrivez directement à allotonte@gmail.com';
      return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true; submitBtn.textContent = 'Envoi en cours…';

    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(this) });
      const data = await response.json();
      if (data.success) {
        success.style.display = 'block';
        success.textContent   = '✅ Votre demande a bien été envoyée ! Je vous réponds sous 48h.';
        this.reset();
      } else { throw new Error(data.message || 'Erreur inconnue'); }
    } catch (err) {
      error.style.display = 'block';
      error.textContent   = "⚠️ Erreur lors de l'envoi. Écrivez-nous directement à allotonte@gmail.com";
    } finally {
      submitBtn.disabled = false; submitBtn.textContent = 'Envoyer ma demande de devis →';
    }
  });
}
