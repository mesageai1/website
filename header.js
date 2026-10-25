// ==========================================================================
// UNIFIED HEADER JAVASCRIPT - MOBILE TOGGLE FOR ALL PAGES
// ==========================================================================

(function () {
  function initHeaderMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    if (toggle.dataset.menuInitialized === 'true') return;
    toggle.dataset.menuInitialized = 'true';

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.textContent = isOpen ? '✕' : '☰';
    });

    var navAnchors = links.querySelectorAll('a');
    for (var i = 0; i < navAnchors.length; i++) {
      navAnchors[i].addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    }

    document.addEventListener('click', function (e) {
      if (!links.contains(e.target) && !toggle.contains(e.target) && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderMenu);
  } else {
    initHeaderMenu();
  }
})();
