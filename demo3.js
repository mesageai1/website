/* ==========================================================================
   MeSage AI — Demo 3 Interactive Controller
   Handles live search, category filtering, and micro-interactive visual states.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSearchAndFilter();
  initMicroInteractions();
});

// 1. FILTERING & SEARCH
function initSearchAndFilter() {
  const searchInput = document.getElementById('featuresSearch');
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.feat-card');

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    cards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardTitle = (card.querySelector('.feat-title')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.feat-desc')?.textContent || '').toLowerCase();
      const cardKeywords = (card.dataset.keywords || '').toLowerCase();

      const matchesCat = (currentCategory === 'all') || cardCategory.includes(currentCategory);

      const matchesSearch = !searchQuery || 
                            cardTitle.includes(searchQuery) || 
                            cardDesc.includes(searchQuery) || 
                            cardKeywords.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Filter Pill Click Events
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.filter;
      applyFilters();
    });
  });

  // Search Input Keyup
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

// 2. MICRO INTERACTIONS INSIDE THE VISUAL MOCKUPS
function initMicroInteractions() {
  // A. Interactive AI Response Tester
  const sampleQuestions = document.querySelectorAll('.ai-sample-q');
  const answerDisplay = document.getElementById('aiSampleAnswer');

  const answersMap = {
    'timing': '✦ MeSage AI: We are open Mon-Sat 9am to 8pm. Site visits can be scheduled instantly on WhatsApp!',
    'pricing': '✦ MeSage AI: 2 & 3 BHK luxury units start at ₹1.25 Cr. Escalating to Closer Priya for payment schemes...',
    'brochure': '✦ MeSage AI: PDF Brochure & Floor Plans dispatched directly to your WhatsApp number (File: Skyline_Brochure.pdf).'
  };

  sampleQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const qKey = btn.dataset.q;
      if (answerDisplay && answersMap[qKey]) {
        answerDisplay.style.opacity = '0.4';
        answerDisplay.textContent = 'Generating instant AI response...';
        setTimeout(() => {
          answerDisplay.innerHTML = answersMap[qKey];
          answerDisplay.style.opacity = '1';
        }, 250);
      }
    });
  });

  // B. Human Agent Takeover Switcher
  const takeoverBtn = document.getElementById('btnToggleTakeover');
  const takeoverStatus = document.getElementById('takeoverStatusLabel');
  const takeoverBubble = document.getElementById('takeoverChatBubble');
  let isAgentActive = true;

  if (takeoverBtn && takeoverStatus && takeoverBubble) {
    takeoverBtn.addEventListener('click', () => {
      isAgentActive = !isAgentActive;
      if (isAgentActive) {
        takeoverBtn.textContent = 'Agent Active';
        takeoverBtn.style.background = '#10b981';
        takeoverStatus.textContent = '🟢 Closer Priya Sharma entered chat';
        takeoverStatus.style.color = '#34d399';
        takeoverBubble.innerHTML = '<strong>Priya (Live Closer):</strong> "Hi Rahul, I can offer an exclusive 10:90 festive scheme today. Can we talk?"';
        takeoverBubble.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      } else {
        takeoverBtn.textContent = 'Switch to Agent';
        takeoverBtn.style.background = '#6366f1';
        takeoverStatus.textContent = '🤖 Autonomous AI Bot Replying';
        takeoverStatus.style.color = '#818cf8';
        takeoverBubble.innerHTML = '<strong>MeSage AI Bot:</strong> "Hello! Welcome to Skyline Residences. How can I help you today?"';
        takeoverBubble.style.borderColor = 'rgba(99, 102, 241, 0.3)';
      }
    });
  }

  // C. Unified Inbox Channel Selector
  const inboxTabs = document.querySelectorAll('.if-tab');
  const inboxName = document.getElementById('inboxSelectedName');
  const inboxMsg = document.getElementById('inboxSelectedMsg');
  const inboxChannelDot = document.getElementById('inboxChannelDot');

  const channelPreviewData = {
    'all': { name: 'Priya Sharma (WhatsApp API)', msg: 'What are the pricing details?', color: '#25d366' },
    'wa': { name: 'Priya Sharma (WhatsApp API)', msg: 'Shared brochure for 3 BHK luxury.', color: '#25d366' },
    'ig': { name: 'Arjun Kumar (@arjun_design)', msg: 'Sent DM: Is this unit available for weekend visits?', color: '#f43f5e' },
    'web': { name: 'Website Visitor #409', msg: 'Checking amenities & floor plans.', color: '#818cf8' },
    'mail': { name: 'director@investments.com', msg: 'Re: Commercial Unit Proposal', color: '#f59e0b' }
  };

  inboxTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      inboxTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const ch = tab.dataset.ch;
      if (channelPreviewData[ch] && inboxName && inboxMsg && inboxChannelDot) {
        inboxName.textContent = channelPreviewData[ch].name;
        inboxMsg.textContent = channelPreviewData[ch].msg;
        inboxChannelDot.style.background = channelPreviewData[ch].color;
      }
    });
  });
}
