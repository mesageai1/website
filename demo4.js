/* ==========================================================================
   MeSage AI — Demo 4: Problem-Solution-ROI Controller
   Handles live search, category filtering, dynamic counter updates,
   and smooth micro-interactions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProblemFilters();
  initDashboardInteractions();
});

function initDashboardInteractions() {
  const pwaBtn = document.getElementById('pwaDemoBtn');
  if (pwaBtn) {
    pwaBtn.addEventListener('click', () => {
      showToast('📲 MeSage AI Mobile App: Panel pinned to home screen! Real-time sound & push notifications activated for upcoming appointments and due reminders.');
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('demoToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'demoToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.zIndex = '9999';
    toast.style.maxWidth = '420px';
    toast.style.padding = '14px 20px';
    toast.style.background = 'linear-gradient(135deg, #1e1b4b, #0f172a)';
    toast.style.border = '1px solid rgba(99, 102, 241, 0.4)';
    toast.style.borderRadius = '12px';
    toast.style.color = '#fff';
    toast.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    toast.style.fontSize = '13.5px';
    toast.style.lineHeight = '1.5';
    toast.style.boxShadow = '0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(99, 102, 241, 0.25)';
    toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 4000);
}

function initProblemFilters() {
  const searchInput = document.getElementById('problemsSearch');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.solve-card');
  const counterSpan = document.getElementById('activeProblemCount');
  const noResultsBox = document.getElementById('noProblemsMessage');
  const resetBtn = document.getElementById('resetProblemsBtn');

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardKeywords = (card.dataset.keywords || '').toLowerCase();
      const cardTitle = (card.querySelector('.solve-main-h3')?.textContent || '').toLowerCase();
      const cardStory = (card.querySelector('.col-story-title')?.textContent || '').toLowerCase();
      const cardText = card.textContent.toLowerCase();

      // Check category match
      const matchesCategory = (currentCategory === 'all') || (cardCategory === currentCategory);

      // Check search query match
      const matchesSearch = !searchQuery || 
                            cardKeywords.includes(searchQuery) || 
                            cardTitle.includes(searchQuery) || 
                            cardStory.includes(searchQuery) || 
                            cardText.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        card.setAttribute('data-hidden', 'false');
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.setAttribute('data-hidden', 'true');
      }
    });

    // Update Counter
    if (counterSpan) {
      counterSpan.textContent = visibleCount;
    }

    // Toggle No Results Message
    if (noResultsBox) {
      if (visibleCount === 0) {
        noResultsBox.style.display = 'block';
      } else {
        noResultsBox.style.display = 'none';
      }
    }

    // Toggle Clear Button
    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
    }
  }

  // Category Filter Pill Clicks
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      currentCategory = pill.dataset.category || 'all';
      applyFilters();
    });
  });

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // Clear Search Button
  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchInput.focus();
      applyFilters();
    });
  }

  // Reset Button
  if (resetBtn && searchInput) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      currentCategory = 'all';

      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      const allPill = document.querySelector('.filter-pill[data-category="all"]');
      if (allPill) {
        allPill.classList.add('active');
        allPill.setAttribute('aria-selected', 'true');
      }

      applyFilters();
    });
  }
}
