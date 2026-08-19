/* ── Saisons : détection auto, bandeau services, offres & effets météo ── */
(function () {
  const SEASONS = {
    printemps: {
      label: 'Printemps', emoji: '🌱',
      tagline: "La pelouse repart — on la relance du bon pied.",
      services: ['Tonte de reprise', 'Scarification & semis', 'Débroussaillage'],
      fx: { chars: ['🌸', '🌷', '🌼'], count: 22 }
    },
    ete: {
      label: 'Été', emoji: '☀️',
      tagline: "Un jardin frais et net pour profiter de l'été.",
      services: ['Tonte régulière', 'Débroussaillage', 'Entretien général'],
      fx: { chars: ['✦', '✧', '☀️'], count: 16 }
    },
    automne: {
      label: 'Automne', emoji: '🍂',
      tagline: "On prépare le jardin avant l'hiver.",
      services: ['Souffleur feuilles mortes', 'Taille de haies', 'Débroussaillage fin de saison'],
      fx: { chars: ['🍁', '🍂', '🍃'], count: 24 }
    },
    hiver: {
      label: 'Hiver', emoji: '❄️',
      tagline: "Le jardin ne s'arrête jamais, même en hiver.",
      services: ['Débroussaillage', 'Taille de haies', 'Entretien général'],
      fx: { chars: ['❄', '❅', '❆'], count: 28 }
    }
  };

  // Forfait scarification + semis, réutilisé pour les deux fenêtres (mars-avril et novembre)
  const FORFAIT_SCARIF_1 = {
    label: 'FORFAIT 1', title: 'Tonte + scarification',
    desc: "Aérez, nettoyez et renforcez votre gazon en éliminant mousse, feutre et mauvaises herbes.",
    list: ['Tonte de la pelouse', 'Scarification en profondeur', 'Élimination de la mousse et du feutre', 'Aération du sol pour une meilleure absorption', 'Gazon plus dense, plus vert et plus résistant'],
    priceLead: 'À partir de', priceValue: '0,85 € / m²'
  };
  const FORFAIT_SCARIF_2 = {
    label: 'FORFAIT 2', title: 'Tonte + scarification + semis',
    desc: "Réparez les zones dégarnies et donnez à votre pelouse une base plus dense et plus homogène.",
    list: ['Tonte complète', 'Scarification profonde', 'Semis de gazon professionnel adapté', 'Réparation des zones clairsemées', 'Résultat durable et esthétique'],
    priceLead: 'À partir de', priceValue: '1,25 € / m²'
  };

  // Fenêtres d'offres couvrant toute l'année — chacune démarre et s'arrête toute seule selon la date du jour
  const OFFERS = [
    {
      start: [3, 1], end: [4, 30],
      badge: 'Offre spéciale — Printemps', title: 'Forfaits promo',
      desc: "Deux offres pour booster la qualité de votre pelouse : tonte + scarification, ou tonte + scarification + semis de gazon.",
      cards: [FORFAIT_SCARIF_1, FORFAIT_SCARIF_2]
    },
    {
      start: [5, 1], end: [6, 14],
      badge: 'Offre spéciale — Mai', title: 'Pack Jardin de Mai',
      desc: "Après la forte pousse du printemps, on remet le jardin en ordre avant l'été.",
      cards: [{
        label: 'PACK MAI', title: 'Débroussaillage + Taille de haies',
        desc: "Le combo idéal pour un jardin net après la forte pousse du printemps.",
        list: ['Débroussaillage complet', 'Taille de haies', 'Évacuation des déchets verts'],
        priceLead: 'À partir de', priceValue: '65 €'
      }]
    },
    {
      start: [6, 15], end: [8, 31],
      badge: 'Offre spéciale — Été', title: 'Pack Été',
      desc: "Une pelouse impéccable et un jardin maîtrisé malgré la pousse rapide de l'été.",
      cards: [{
        label: 'PACK ÉTÉ', title: 'Tonte régulière + Débroussaillage',
        desc: "Le combo idéal pour garder un jardin net pendant les fortes chaleurs.",
        list: ['Tonte de la pelouse', 'Débroussaillage', 'Évacuation des déchets verts'],
        priceLead: 'À partir de', priceValue: '50 €'
      }]
    },
    {
      start: [9, 1], end: [10, 31],
      badge: 'Offre spéciale — Rentrée', title: 'Pack Rentrée Jardin',
      desc: "On taille les haies et on prépare le jardin avant l'arrivée du froid.",
      cards: [{
        label: 'PACK RENTRÉE', title: 'Taille de haies + Débroussaillage',
        desc: "La taille d'automne pour des haies nettes avant l'hiver.",
        list: ['Taille de haies', 'Débroussaillage', 'Évacuation des déchets verts'],
        priceLead: 'À partir de', priceValue: '60 €'
      }]
    },
    {
      start: [11, 1], end: [11, 30],
      badge: 'Offre spéciale — Novembre', title: 'Forfaits promo',
      desc: "Deux offres pour préparer votre pelouse avant l'hiver : tonte + scarification, ou tonte + scarification + semis de gazon.",
      cards: [FORFAIT_SCARIF_1, FORFAIT_SCARIF_2]
    },
    {
      start: [12, 1], end: [2, 28],
      badge: 'Offre spéciale — Hiver', title: 'Pack Entretien Hiver',
      desc: "Le jardin reste entretenu même pendant les mois froids.",
      cards: [{
        label: 'PACK HIVER', title: 'Débroussaillage + Taille de haies',
        desc: "Un entretien complet du jardin malgré la saison froide.",
        list: ['Débroussaillage', 'Taille de haies', 'Entretien général du jardin'],
        priceLead: 'À partir de', priceValue: '70 €'
      }]
    }
  ];

  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  function frenchDate(month, day) { return day + ' ' + MOIS[month - 1]; }

  function inWindow(now, start, end) {
    const nowVal = (now.getMonth() + 1) * 100 + now.getDate();
    const startVal = start[0] * 100 + start[1];
    const endVal = end[0] * 100 + end[1];
    return startVal <= endVal ? (nowVal >= startVal && nowVal <= endVal) : (nowVal >= startVal || nowVal <= endVal);
  }

  // Nombre de jours restants avant la fin de l'offre (gère le passage à l'année suivante, ex. hiver déc.→fév.)
  function daysRemaining(now, end) {
    let endDate = new Date(now.getFullYear(), end[0] - 1, end[1]);
    const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (endDate < nowMid) endDate = new Date(now.getFullYear() + 1, end[0] - 1, end[1]);
    return Math.round((endDate - nowMid) / 86400000);
  }

  // Mars-Mai = printemps, Juin-Août = été, Sept-Nov = automne, Déc-Fév = hiver
  const MONTH_SEASON = ['hiver', 'hiver', 'printemps', 'printemps', 'printemps', 'ete', 'ete', 'ete', 'automne', 'automne', 'automne', 'hiver'];

  function getNow() {
    try {
      const testDate = localStorage.getItem('at-season-test-date');
      if (testDate) {
        const parsed = new Date(testDate + 'T12:00:00');
        if (!isNaN(parsed.getTime())) return parsed;
      }
    } catch (e) { /* localStorage indisponible */ }
    return new Date();
  }

  function currentSeason() {
    let override = null;
    try { override = localStorage.getItem('at-season-override'); } catch (e) { /* localStorage indisponible */ }
    if (override && override !== 'auto' && SEASONS[override]) return override;
    return MONTH_SEASON[getNow().getMonth()];
  }

  function fxEnabled() {
    try { return localStorage.getItem('at-season-fx') !== 'off'; } catch (e) { return true; }
  }

  function buildBanner(season) {
    const slot = document.getElementById('seasonalBanner');
    if (!slot) return;
    const data = SEASONS[season];

    const wrap = document.createElement('div');
    wrap.className = 'seasonal-banner';

    const inner = document.createElement('div');
    inner.className = 'container seasonal-banner-inner';

    const left = document.createElement('div');
    left.className = 'seasonal-banner-text';

    const tag = document.createElement('span');
    tag.className = 'season-tag';
    tag.textContent = data.emoji + ' Spécial ' + data.label;

    const title = document.createElement('h2');
    title.className = 'seasonal-banner-title';
    title.textContent = data.tagline;

    const note = document.createElement('p');
    note.className = 'seasonal-note';
    note.textContent = "Tous nos services restent disponibles toute l'année.";

    left.append(tag, title, note);

    const list = document.createElement('ul');
    list.className = 'seasonal-services';
    data.services.forEach(function (s) {
      const li = document.createElement('li');
      li.textContent = s;
      list.appendChild(li);
    });

    const cta = document.createElement('a');
    cta.href = 'contact.html';
    cta.className = 'btn btn-season';
    cta.textContent = 'Demander un devis →';

    inner.append(left, list, cta);
    wrap.appendChild(inner);
    slot.replaceWith(wrap);
  }

  function buildFx(season) {
    const existing = document.getElementById('seasonFx');
    if (existing) existing.remove();

    if (!fxEnabled()) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const data = SEASONS[season];
    const fx = document.createElement('div');
    fx.id = 'seasonFx';
    fx.className = 'season-fx';
    fx.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < data.fx.count; i++) {
      const el = document.createElement('span');
      el.className = 'flake';
      el.textContent = data.fx.chars[i % data.fx.chars.length];
      el.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      el.style.setProperty('--size', (16 + Math.random() * 18).toFixed(0) + 'px');
      el.style.setProperty('--dur', (8 + Math.random() * 10).toFixed(1) + 's');
      el.style.setProperty('--delay', (Math.random() * -14).toFixed(1) + 's');
      el.style.setProperty('--drift', (Math.random() * 140 - 70).toFixed(0) + 'px');
      el.style.setProperty('--op', (0.6 + Math.random() * 0.4).toFixed(2));
      fx.appendChild(el);
    }
    document.body.appendChild(fx);
  }

  function buildOffer() {
    const section = document.getElementById('offres');
    if (!section) return;
    const now = getNow();
    const offer = OFFERS.find(function (o) { return inWindow(now, o.start, o.end); });

    if (!offer) {
      section.style.display = 'none';
      return;
    }
    section.style.display = '';

    const container = section.querySelector('.container');
    if (!container) return;
    container.textContent = '';

    const badge = document.createElement('span');
    badge.className = 'badge badge-season';
    badge.textContent = offer.badge;

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.style.marginTop = '.6rem';
    title.textContent = offer.title;

    const sub = document.createElement('p');
    sub.className = 'section-sub';
    sub.textContent = offer.desc;

    const grid = document.createElement('div');
    grid.className = 'promo-grid';
    offer.cards.forEach(function (c, i) {
      const art = document.createElement('article');
      art.className = 'promo-card' + (i === 1 ? ' promo-card-2' : '');

      const lbl = document.createElement('div');
      lbl.className = 'promo-label';
      lbl.textContent = c.label;

      const h3 = document.createElement('h3');
      h3.textContent = c.title;

      const desc = document.createElement('p');
      desc.className = 'promo-desc';
      desc.textContent = c.desc;

      const ul = document.createElement('ul');
      ul.className = 'promo-list';
      c.list.forEach(function (item) {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });

      const price = document.createElement('div');
      price.className = 'promo-price';
      if (c.priceLead) price.append(c.priceLead + ' ');
      const strong = document.createElement('strong');
      strong.textContent = c.priceValue;
      price.appendChild(strong);

      art.append(lbl, h3, desc, ul, price);
      grid.appendChild(art);
    });

    const cta = document.createElement('div');
    cta.className = 'promo-cta';

    const textWrap = document.createElement('div');
    textWrap.className = 'promo-cta-text';

    const daysLeft = daysRemaining(now, offer.end);
    const countdown = document.createElement('span');
    countdown.className = 'promo-countdown';
    countdown.textContent = daysLeft <= 0 ? '⏳ Dernier jour !' : (daysLeft === 1 ? "⏳ Plus qu'1 jour" : '⏳ Plus que ' + daysLeft + ' jours');

    const dateText = document.createElement('span');
    dateText.className = 'promo-cta-date';
    dateText.textContent = "Offre valable jusqu'au " + frenchDate(offer.end[0], offer.end[1]);

    textWrap.append(countdown, dateText);

    const a = document.createElement('a');
    a.href = 'contact.html';
    a.className = 'btn btn-primary';
    a.textContent = 'Je demande mon devis →';
    cta.append(textWrap, a);

    container.append(badge, title, sub, grid, cta);
  }

  function buildTestBadge() {
    const existing = document.getElementById('seasonTestBadge');
    if (existing) existing.remove();
    let testDate = null;
    try { testDate = localStorage.getItem('at-season-test-date'); } catch (e) { /* localStorage indisponible */ }
    if (!testDate) return;
    const badge = document.createElement('div');
    badge.id = 'seasonTestBadge';
    badge.className = 'season-test-badge';
    badge.textContent = '🧪 Date de test : ' + frenchDate(parseInt(testDate.slice(5, 7), 10), parseInt(testDate.slice(8, 10), 10)) + ' ' + testDate.slice(0, 4);
    document.body.appendChild(badge);
  }

  function init() {
    const season = currentSeason();
    document.documentElement.setAttribute('data-season', season);
    buildBanner(season);
    buildFx(season);
    buildOffer();
    buildTestBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
