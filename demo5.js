/* ==========================================================================
   MeSage AI — Demo 5 Interactive Controller
   Handles live micro-interactions: Voice Audio Simulator, AI Handover Switch,
   Channel Inbox filter, and smooth feature jump navigation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initVoiceCallSimulator();
  initAiHandoverToggle();
  initInboxChannelFilter();
  initSampleQuestionTester();
  initFeatureNavScroll();
});

// 1. VOICE CALL SIMULATOR (Play / Pause Audio Waveform & Transcript)
function initVoiceCallSimulator() {
  const playBtn = document.getElementById('btnToggleVoiceCall');
  const waveBars = document.querySelectorAll('.wave-bar');
  const callStatus = document.getElementById('voiceCallStatusText');
  let isPlaying = true;

  if (playBtn && callStatus) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playBtn.textContent = '⏸ Pause Call Simulation';
        callStatus.textContent = '🟢 AI Call Active (0:42) — Speaking Hindi / English';
        waveBars.forEach(bar => {
          bar.style.animationPlayState = 'running';
        });
      } else {
        playBtn.textContent = '▶ Play Sample AI Voice Call';
        callStatus.textContent = '⏸ Call Paused';
        waveBars.forEach(bar => {
          bar.style.animationPlayState = 'paused';
        });
      }
    });
  }
}

// 2. HUMAN CLOSER TAKEOVER SWITCH
function initAiHandoverToggle() {
  const toggleBtn = document.getElementById('btnTakeoverToggle');
  const statusBadge = document.getElementById('takeoverStatusBadge');
  const chatBubble = document.getElementById('takeoverChatBubble');
  let isCloserActive = false;

  if (toggleBtn && statusBadge && chatBubble) {
    toggleBtn.addEventListener('click', () => {
      isCloserActive = !isCloserActive;
      if (isCloserActive) {
        toggleBtn.textContent = 'Switch Back to AI';
        toggleBtn.style.background = '#6366f1';
        statusBadge.textContent = '🟢 Closer Priya Sharma entered chat';
        statusBadge.style.color = '#34d399';
        statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        chatBubble.innerHTML = '<strong>Priya (Closer):</strong> "Hi Rahul, I saw you were asking about payment plans. I can offer an exclusive 10:90 festival booking scheme today. Shall we do a quick 2-min call?"';
        chatBubble.style.borderColor = 'rgba(16, 185, 129, 0.5)';
      } else {
        toggleBtn.textContent = 'Simulate Human Closer Takeover';
        toggleBtn.style.background = '#f59e0b';
        statusBadge.textContent = '🤖 Autonomous AI Bot Replying';
        statusBadge.style.color = '#818cf8';
        statusBadge.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        chatBubble.innerHTML = '<strong>MeSage AI (1.2s):</strong> "I can share the payment schedule right away! Let me also notify our senior sales specialist to assist you with festive discount offers."';
        chatBubble.style.borderColor = 'rgba(6, 182, 212, 0.4)';
      }
    });
  }
}

// 3. TEAM INBOX CHANNEL FILTERING
function initInboxChannelFilter() {
  const chips = document.querySelectorAll('.inbox-tab-chip');
  const threadItems = document.querySelectorAll('.inbox-thread-item');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const selectedCh = chip.dataset.channel;

      threadItems.forEach(item => {
        const itemCh = item.dataset.channel;
        if (selectedCh === 'all' || itemCh === selectedCh) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// 4. INSTANT AI QUESTION CLICKER
function initSampleQuestionTester() {
  const qPills = document.querySelectorAll('.demo-q-pill');
  const botAnswerBubble = document.getElementById('demoBotAnswer');

  const answers = {
    'pricing': '✦ <strong>Bot:</strong> 2 & 3 BHK luxury units start at ₹1.25 Cr. I have also dispatched the complete PDF cost sheet to your WhatsApp!',
    'brochure': '✦ <strong>Bot:</strong> Full high-res brochure (Skyline_Residences_2026.pdf) has been sent directly to this chat. Would you like to schedule a site tour?',
    'timing': '✦ <strong>Bot:</strong> Our site experience center is open 7 days a week, 9 AM to 8 PM. Shall I book an appointment for tomorrow?'
  };

  qPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const qKey = pill.dataset.q;
      if (botAnswerBubble && answers[qKey]) {
        botAnswerBubble.style.opacity = '0.4';
        botAnswerBubble.innerHTML = '<em>✦ AI answering in 1.2s...</em>';
        setTimeout(() => {
          botAnswerBubble.innerHTML = answers[qKey];
          botAnswerBubble.style.opacity = '1';
        }, 200);
      }
    });
  });
}

// 5. SMOOTH FEATURE JUMP NAVIGATION
function initFeatureNavScroll() {
  const navBtns = document.querySelectorAll('.feat-nav-btn');

  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
