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
  const countLabel = document.getElementById('visibleFeatCount');

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardTitle = (card.querySelector('.feat-title')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.feat-desc')?.textContent || '').toLowerCase();
      const cardTags = (card.dataset.keywords || '').toLowerCase();
      const cardNum = card.dataset.featnum || '';

      const matchesCat = (currentCategory === 'all') || 
                         (cardCategory.includes(currentCategory)) ||
                         (currentCategory === 'top6' && card.dataset.top6 === 'true');

      const matchesSearch = !searchQuery || 
                            cardTitle.includes(searchQuery) || 
                            cardDesc.includes(searchQuery) || 
                            cardTags.includes(searchQuery) ||
                            cardNum.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        card.style.animation = 'fadeInCard 0.3s ease forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countLabel) {
      countLabel.textContent = visibleCount;
    }
  }

  // Filter Pill Click Events
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.filter;
      applyFilters();

      // If user clicked Top 6 filter, smoothly bring top 6 or matrix into view
      if (currentCategory === 'top6') {
        const top6Sec = document.getElementById('top6Section');
        if (top6Sec) {
          top6Sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
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
  // A. Feature 12: Interactive AI Response Tester
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
        answerDisplay.style.opacity = '0.3';
        answerDisplay.textContent = 'Generating instant AI response...';
        setTimeout(() => {
          answerDisplay.textContent = answersMap[qKey];
          answerDisplay.style.opacity = '1';
        }, 300);
      }
    });
  });

  // B. Feature 08: Human Agent Takeover Switcher
  const takeoverBtn = document.getElementById('btnToggleTakeover');
  const takeoverStatus = document.getElementById('takeoverStatusLabel');
  const takeoverBubble = document.getElementById('takeoverChatBubble');
  let isAgentActive = true;

  if (takeoverBtn && takeoverStatus && takeoverBubble) {
    takeoverBtn.addEventListener('click', () => {
      isAgentActive = !isAgentActive;
      if (isAgentActive) {
        takeoverBtn.textContent = 'Agent Mode Active';
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

  // C. Feature 07: Unified Inbox Channel Selector
  const inboxTabs = document.querySelectorAll('.if-tab');
  const inboxName = document.getElementById('inboxSelectedName');
  const inboxMsg = document.getElementById('inboxSelectedMsg');
  const inboxChannelDot = document.getElementById('inboxChannelDot');

  const channelPreviewData = {
    'all': { name: 'Priya Sharma (WhatsApp)', msg: 'What are the pricing details?', color: '#25d366' },
    'wa': { name: 'Priya Sharma (WhatsApp API)', msg: 'Shared brochure for 3 BHK luxury.', color: '#25d366' },
    'ig': { name: 'Arjun Kumar (@arjun_k)', msg: 'Sent DM: Is 2 BHK available?', color: '#f43f5e' },
    'fb': { name: 'Sara Mehta (Messenger)', msg: 'Thank you, booking our walkthrough!', color: '#1877f2' },
    'web': { name: 'Website Visitor #409', msg: 'Checking amenities & floor plans.', color: '#818cf8' },
    'tg': { name: 'Rahul K. (@rahulk_tg)', msg: 'Requested callback on pricing.', color: '#29b6f6' },
    'mail': { name: 'support@prospect.com', msg: 'Enterprise commercial quote request.', color: '#f59e0b' }
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
