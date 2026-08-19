/* ── Consentement cookies (RGPD) — bloque GTM/GA4 tant que l'utilisateur n'a pas choisi ── */
(function () {
  const KEY = 'at-cookie-consent';
  const GTM_ID = 'GTM-53JGH6XX';

  function loadGTM() {
    if (window.__gtmLoaded) return;
    window.__gtmLoaded = true;
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', GTM_ID);
  }

  function hideBanner() {
    const el = document.getElementById('cookieBanner');
    if (el) el.remove();
  }

  function showBanner() {
    if (document.getElementById('cookieBanner')) return;

    const bar = document.createElement('div');
    bar.id = 'cookieBanner';
    bar.className = 'cookie-banner';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Consentement aux cookies');

    const text = document.createElement('p');
    text.className = 'cookie-banner-text';
    const link = document.createElement('a');
    link.href = 'mentions-legales.html#cookies';
    link.textContent = 'En savoir plus';
    text.append('Nous utilisons des cookies de mesure d\u2019audience (Google Analytics) pour améliorer le site. Vous pouvez accepter ou refuser à tout moment. ', link);

    const actions = document.createElement('div');
    actions.className = 'cookie-banner-actions';

    const btnRefuse = document.createElement('button');
    btnRefuse.type = 'button';
    btnRefuse.className = 'btn btn-cookie-ghost';
    btnRefuse.textContent = 'Refuser';
    btnRefuse.addEventListener('click', function () {
      localStorage.setItem(KEY, 'refused');
      hideBanner();
    });

    const btnAccept = document.createElement('button');
    btnAccept.type = 'button';
    btnAccept.className = 'btn btn-primary';
    btnAccept.textContent = 'Accepter';
    btnAccept.addEventListener('click', function () {
      localStorage.setItem(KEY, 'accepted');
      hideBanner();
      loadGTM();
    });

    actions.append(btnRefuse, btnAccept);
    bar.append(text, actions);
    document.body.appendChild(bar);
  }

  // Permet de rouvrir le bandeau depuis un lien "Gérer les cookies" (ex. footer, mentions légales)
  window.openCookiePreferences = showBanner;

  function init() {
    const consent = localStorage.getItem(KEY);
    if (consent === 'accepted') {
      loadGTM();
    } else if (consent !== 'refused') {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
