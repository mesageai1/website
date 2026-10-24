/* ==========================================================================
   MeSage AI — Demo 4: Problem-Solution-ROI Controller
   Handles live search, category filtering, dynamic counter updates,
   and smooth micro-interactions.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProblemFilters();
});

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
