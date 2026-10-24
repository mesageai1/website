// ==========================================================================
// MeSage AI — Live Interactive Demo: WhatsApp Automation & Live Agent Transfer
// ==========================================================================

// DOM Elements
const waChatStream = document.getElementById('waChatStream');
const waChatCanvas = document.getElementById('waChatCanvas');
const waTypingBox = document.getElementById('waTypingBox');
const typingSender = document.getElementById('typingSender');
const waButtonsTray = document.getElementById('waButtonsTray');
const waStatusText = document.getElementById('waStatusText');

const btnPlayPause = document.getElementById('btnPlayPause');
const playIcon = document.getElementById('playIcon');
const playLabel = document.getElementById('playLabel');

// Connector 1 Elements (Left <-> Middle)
const conn1Label = document.getElementById('conn1Label');
const arrowUserToAI = document.getElementById('arrowUserToAI');
const arrowAIToUser = document.getElementById('arrowAIToUser');

// AI Bot Box Elements (Middle)
const aiStatusPill = document.getElementById('aiStatusPill');
const aiActionTitle = document.getElementById('aiActionTitle');
const aiActionDesc = document.getElementById('aiActionDesc');
const aiSpeedValue = document.getElementById('aiSpeedValue');
const aiTransferNotice = document.getElementById('aiTransferNotice');

// Connector 2 Elements (Middle -> Right -> Left)
const conn2Label = document.getElementById('conn2Label');
const arrowAIToAgent = document.getElementById('arrowAIToAgent');
const arrowAgentToUser = document.getElementById('arrowAgentToUser');

// Human Agent Elements (Right)
const agentBox = document.getElementById('agentBox');
const agentStatusBadge = document.getElementById('agentStatusBadge');
const leadHeat = document.getElementById('leadHeat');
const agentLookingFor = document.getElementById('agentLookingFor');
const agentBrochureStatus = document.getElementById('agentBrochureStatus');
const agentStandbyView = document.getElementById('agentStandbyView');
const agentJoinedView = document.getElementById('agentJoinedView');

// Pills
const pills = [
  document.getElementById('pill-1'),
  document.getElementById('pill-2'),
  document.getElementById('pill-3'),
  document.getElementById('pill-4'),
  document.getElementById('pill-5')
];

// State Machine
let isPlaying = true;
let currentStep = 0;
let stepTimeout = null;

// Helper: Scroll WhatsApp canvas smoothly
function scrollWaCanvas() {
  if (waChatCanvas) {
    waChatCanvas.scrollTop = waChatCanvas.scrollHeight;
  }
}

// Helper: Set Arrow Flow State
function setArrowState(state) {
  // Clear all
  if (arrowUserToAI) arrowUserToAI.classList.remove('active');
  if (arrowAIToUser) arrowAIToUser.classList.remove('active');
  if (arrowAIToAgent) arrowAIToAgent.classList.remove('active');
  if (arrowAgentToUser) arrowAgentToUser.classList.remove('active');

  if (state === 'user_to_ai' && arrowUserToAI) {
    arrowUserToAI.classList.add('active');
  } else if (state === 'ai_to_user' && arrowAIToUser) {
    arrowAIToUser.classList.add('active');
  } else if (state === 'ai_to_agent' && arrowAIToAgent) {
    arrowAIToAgent.classList.add('active');
  } else if (state === 'agent_to_user' && arrowAgentToUser) {
    arrowAgentToUser.classList.add('active');
  }
}

// Helper: Highlight active step pill (1 to 5)
function setActivePill(num) {
  pills.forEach((p, idx) => {
    if (!p) return;
    if (idx + 1 === num) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
}

// Helper: Show typing indicator
function showTyping(name = 'AI Bot') {
  if (waTypingBox && typingSender) {
    typingSender.textContent = name;
    waTypingBox.style.display = 'flex';
    scrollWaCanvas();
  }
}

// Helper: Hide typing indicator
function hideTyping() {
  if (waTypingBox) {
    waTypingBox.style.display = 'none';
  }
}

// Helper: Render WhatsApp Customer Message
function addWaUserMessage(text, time = '14:15') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-chat-bubble-item user';
  item.innerHTML = `
    <div class="bubble-text-box">${text}</div>
    <div class="bubble-footer">
      <span>${time}</span>
      <span>✓✓</span>
    </div>
  `;
  waChatStream.appendChild(item);
  scrollWaCanvas();
}

// Helper: Render WhatsApp AI Bot Message
function addWaBotMessage(text, time = '14:15') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-chat-bubble-item bot';
  const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  item.innerHTML = `
    <div class="bubble-text-box">${formatted}</div>
    <div class="bubble-footer">
      <span>${time}</span>
    </div>
  `;
  waChatStream.appendChild(item);
  scrollWaCanvas();
}

// Helper: Render WhatsApp Brochure Message with Download Box
function addWaBrochureMessage(text, fileTitle, fileSize, promptText, time = '14:17') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-chat-bubble-item bot';
  item.innerHTML = `
    <div class="bubble-text-box">
      ${text}
      <div class="wa-attachment-box">
        <span style="font-size: 20px;">📄</span>
        <div>
          <b>${fileTitle}</b>
          <small>${fileSize}</small>
        </div>
      </div>
      <p style="margin: 6px 0 0;">${promptText}</p>
    </div>
    <div class="bubble-footer">
      <span>${time}</span>
    </div>
  `;
  waChatStream.appendChild(item);
  scrollWaCanvas();
}

// Helper: Render WhatsApp Human Agent Message
function addWaAgentMessage(text, time = '14:19') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-chat-bubble-item agent';
  const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  item.innerHTML = `
    <div class="bubble-text-box">
      <small style="color: #34d399; font-weight: 800; display: block; margin-bottom: 3px;">
        🧑‍💼 Priya Sharma (Senior Property Advisor)
      </small>
      ${formatted}
    </div>
    <div class="bubble-footer">
      <span>${time}</span>
    </div>
  `;
  waChatStream.appendChild(item);
  scrollWaCanvas();
}

// Helper: Render Handoff Alert in WhatsApp Stream
function addWaHandoffBanner(html) {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-handoff-pill-alert';
  item.innerHTML = html;
  waChatStream.appendChild(item);
  scrollWaCanvas();
}

// Helper: Render Quick Action Buttons
function renderButtons(btnList) {
  if (!waButtonsTray) return;
  waButtonsTray.innerHTML = '';
  btnList.forEach(btn => {
    const el = document.createElement('button');
    el.className = 'wa-btn-option';
    el.innerHTML = btn.label;
    el.onclick = () => {
      clearButtons();
      btn.action();
    };
    waButtonsTray.appendChild(el);
  });
}

function clearButtons() {
  if (waButtonsTray) waButtonsTray.innerHTML = '';
}

// Safe scheduling function honoring isPlaying
function scheduleNext(fn, delayMs) {
  clearTimeout(stepTimeout);
  if (!isPlaying) return;
  stepTimeout = setTimeout(() => {
    if (isPlaying) fn();
  }, delayMs);
}

// ==========================================================================
// Simulation Step Orchestration
// ==========================================================================

function runStep(stepNumber) {
  currentStep = stepNumber;

  switch (stepNumber) {
    // -------------------------------------------------------------
    // STEP 1: Buyer Inquires about Apartments
    // -------------------------------------------------------------
    case 1: {
      setActivePill(1);
      setArrowState('user_to_ai');
      if (conn1Label) conn1Label.textContent = "Customer Message Sent ➔";
      if (conn2Label) conn2Label.textContent = "Standby...";

      if (aiActionTitle) aiActionTitle.textContent = "Analyzing Customer Inquiry...";
      if (aiActionDesc) aiActionDesc.textContent = "Customer is searching for available luxury apartments in Skyline Residences.";
      if (aiSpeedValue) aiSpeedValue.textContent = "0.8 Seconds";

      addWaUserMessage("Hi, I am looking for an apartment in your new project.", "14:15");

      scheduleNext(() => {
        showTyping('MeSage AI');
        scheduleNext(() => {
          hideTyping();
          runStep(2);
        }, 1100);
      }, 900);
      break;
    }

    // -------------------------------------------------------------
    // STEP 2: AI Bot Replies in <2s with 2, 3, 4 BHK options
    // -------------------------------------------------------------
    case 2: {
      setActivePill(2);
      setArrowState('ai_to_user');
      if (conn1Label) conn1Label.textContent = "AI Responded in 1.2s ➔";

      if (aiActionTitle) aiActionTitle.textContent = "Dispatched Apartment Configurations";
      if (aiActionDesc) aiActionDesc.textContent = "Offered 2, 3 & 4 BHK choices with instant interactive selection buttons.";
      if (aiSpeedValue) aiSpeedValue.textContent = "1.2 Seconds";

      addWaBotMessage(
        "Hello! 👋 Welcome to **Skyline Residences** by MeSage Realty.<br><br>We have premium **2, 3, and 4 BHK** luxury residences available for you. Which configuration would you like to explore?",
        "14:15"
      );

      renderButtons([
        { label: "2 BHK", action: () => selectConfig("2 BHK") },
        { label: "3 BHK (Recommended)", action: () => selectConfig("3 BHK") },
        { label: "4 BHK Penthouse", action: () => selectConfig("4 BHK") }
      ]);

      // Auto-advance after 3.2s if user doesn't click
      scheduleNext(() => {
        selectConfig("3 BHK");
      }, 3400);
      break;
    }

    // -------------------------------------------------------------
    // STEP 3: Customer Chooses 3 BHK -> AI Explains 1450-1850 sq.ft
    // -------------------------------------------------------------
    case 3: {
      setActivePill(2);
      setArrowState('user_to_ai');
      if (conn1Label) conn1Label.textContent = "Selected: 3 BHK ➔";

      if (agentLookingFor) agentLookingFor.textContent = "3 BHK (1,450 - 1,850 sq.ft)";

      if (aiActionTitle) aiActionTitle.textContent = "Fetching 3 BHK Specs";
      if (aiActionDesc) aiActionDesc.textContent = "Retrieving built-up area (1,450 to 1,850 sq.ft), floor layouts, and master plans.";
      if (aiSpeedValue) aiSpeedValue.textContent = "0.9 Seconds";

      addWaUserMessage("3 BHK", "14:16");

      scheduleNext(() => {
        showTyping('MeSage AI');
        scheduleNext(() => {
          hideTyping();
          setArrowState('ai_to_user');
          if (conn1Label) conn1Label.textContent = "AI Responded in 1.1s ➔";

          if (aiActionTitle) aiActionTitle.textContent = "Delivered 3 BHK Specs";
          if (aiActionDesc) aiActionDesc.textContent = "Provided area specifications and presented Brochure, Location, or Pricing options.";
          if (aiSpeedValue) aiSpeedValue.textContent = "1.1 Seconds";

          addWaBotMessage(
            "Nice choice! Our 3 BHK luxury residences range from **1,450 to 1,850 sq. ft.** of super built-up area with panoramic skyline balconies.<br><br>What would you like to know more about our 3 BHK homes?",
            "14:16"
          );

          renderButtons([
            { label: "📄 Project Brochure", action: () => selectSubOption("Brochure") },
            { label: "📍 Location & Amenities", action: () => selectSubOption("Location") },
            { label: "💰 Pricing & Plans", action: () => selectSubOption("Pricing") }
          ]);

          // Auto-advance to Brochure
          scheduleNext(() => {
            selectSubOption("Brochure");
          }, 3500);
        }, 1100);
      }, 800);
      break;
    }

    // -------------------------------------------------------------
    // STEP 4: Buyer Asks for Brochure -> AI Delivers PDF
    // -------------------------------------------------------------
    case 4: {
      setActivePill(3);
      setArrowState('user_to_ai');
      if (conn1Label) conn1Label.textContent = "Brochure Requested ➔";

      if (aiActionTitle) aiActionTitle.textContent = "Generating Project Brochure";
      if (aiActionDesc) aiActionDesc.textContent = "Transmitting verified Skyline_Residences_3BHK_Brochure.pdf via WhatsApp Media API.";
      if (aiSpeedValue) aiSpeedValue.textContent = "1.0 Seconds";

      addWaUserMessage("Brochure", "14:17");

      scheduleNext(() => {
        showTyping('MeSage AI');
        scheduleNext(() => {
          hideTyping();
          setArrowState('ai_to_user');
          if (conn1Label) conn1Label.textContent = "Brochure Delivered ➔";

          if (agentBrochureStatus) agentBrochureStatus.textContent = "Delivered via PDF ✓";
          if (aiActionTitle) aiActionTitle.textContent = "Brochure Delivered";
          if (aiActionDesc) aiActionDesc.textContent = "PDF floor layout delivered. Asking customer if they would also like pricing.";
          if (aiSpeedValue) aiSpeedValue.textContent = "1.2 Seconds";

          addWaBrochureMessage(
            "Here is our official project brochure with architectural floor layouts, master planning, and club amenities:",
            "Skyline_Residences_3BHK_Brochure.pdf",
            "4.2 MB · Verified PDF Document",
            "Would you also like to know the pricing and available payment plans?",
            "14:17"
          );

          renderButtons([
            { label: "💰 I want to know the price as well", action: () => triggerPriceInquiry() }
          ]);

          // Auto advance to asking price
          scheduleNext(() => {
            triggerPriceInquiry();
          }, 3600);
        }, 1200);
      }, 800);
      break;
    }

    // -------------------------------------------------------------
    // STEP 5: Buyer asks for PRICE (The Turning Point / Escalation)
    // -------------------------------------------------------------
    case 5: {
      setActivePill(4);
      setArrowState('user_to_ai');
      if (conn1Label) conn1Label.textContent = "Price Inquiry Inbound ➔";

      addWaUserMessage("I want to know the price as well.", "14:18");

      if (aiActionTitle) aiActionTitle.textContent = "⚠️ PRICE INQUIRY DETECTED!";
      if (aiActionDesc) aiActionDesc.textContent = "Commercial negotiation requested. Pausing AI bot automation to transfer hot deal to live Closer.";
      if (aiSpeedValue) aiSpeedValue.textContent = "0.4 Seconds";

      if (aiTransferNotice) aiTransferNotice.style.display = 'flex';
      if (aiStatusPill) {
        aiStatusPill.textContent = '⏸ Paused for Live Agent';
        aiStatusPill.style.borderColor = '#f59e0b';
        aiStatusPill.style.color = '#fde68a';
      }

      scheduleNext(() => {
        runStep(6);
      }, 1500);
      break;
    }

    // -------------------------------------------------------------
    // STEP 6: AI Bot routes to Human Agent -> Priya Sharma Joins!
    // -------------------------------------------------------------
    case 6: {
      setActivePill(5);
      setArrowState('ai_to_agent');
      if (conn1Label) conn1Label.textContent = "AI Bot Paused ⏸";
      if (conn2Label) conn2Label.textContent = "Routing to Closer ➔";

      if (agentBox) agentBox.classList.add('active-closer');
      if (agentStatusBadge) {
        agentStatusBadge.className = 'agent-status-badge live';
        agentStatusBadge.textContent = 'Agent Joined! 🟢';
      }
      if (leadHeat) {
        leadHeat.className = 'lead-heat hot';
        leadHeat.textContent = '🔥 Hot Buyer / Pricing';
      }
      if (agentStandbyView) agentStandbyView.style.display = 'none';
      if (agentJoinedView) agentJoinedView.style.display = 'block';

      // WhatsApp Chat Notification Banner
      addWaHandoffBanner("🤝 <strong>Senior Sales Advisor Priya Sharma</strong> has joined the conversation.");
      if (waStatusText) waStatusText.textContent = "Chatting with Priya Sharma (Sales Closer)";

      scheduleNext(() => {
        showTyping('Priya Sharma');
        scheduleNext(() => {
          hideTyping();
          runStep(7);
        }, 1300);
      }, 1200);
      break;
    }

    // -------------------------------------------------------------
    // STEP 7: Priya Sharma sends personalized pricing & site visit
    // -------------------------------------------------------------
    case 7: {
      setActivePill(5);
      setArrowState('agent_to_user');
      if (conn2Label) conn2Label.textContent = "Agent Live Closing ➔";

      addWaAgentMessage(
        "Hello Rahul! **Priya Sharma** here from the Skyline Advisory Team. 👋<br><br>Our 3 BHK luxury residences start at **₹1.85 Cr**, with an exclusive **10:90 festive payment scheme** available this month (pay 10% now, nothing until possession).<br><br>Can I reserve a private VIP site walkthrough for you this **Saturday at 11:00 AM**?",
        "14:19"
      );

      renderButtons([
        { label: "✅ Yes, Saturday 11 AM works!", action: () => userConfirmsSiteVisit() },
        { label: "📞 Call me directly", action: () => userRequestsCall() },
        { label: "↺ Replay Demo", action: () => restartSimulation() }
      ]);

      // Automatically complete the deal after 5 seconds if not clicked
      scheduleNext(() => {
        userConfirmsSiteVisit();
      }, 5500);
      break;
    }
  }
}

// User Action Callbacks
function selectConfig(cfg) {
  clearButtons();
  runStep(3);
}

function selectSubOption(opt) {
  clearButtons();
  if (opt === "Brochure") {
    runStep(4);
  } else {
    triggerPriceInquiry();
  }
}

function triggerPriceInquiry() {
  clearButtons();
  runStep(5);
}

// User confirms visit
function userConfirmsSiteVisit() {
  clearButtons();
  setArrowState('user_to_ai');
  if (conn1Label) conn1Label.textContent = "Site Visit Confirmed ➔";
  addWaUserMessage("Yes, Saturday 11 AM works great for me!", "14:20");

  scheduleNext(() => {
    showTyping('Priya Sharma');
    scheduleNext(() => {
      hideTyping();
      setArrowState('agent_to_user');
      if (conn2Label) conn2Label.textContent = "Booking Confirmed! 🎉";
      addWaAgentMessage(
        "Wonderful Rahul! 🎉 Your VIP site consultation is confirmed for **Saturday at 11:00 AM**. I will personally welcome you at our experience gallery with the customized cost breakdown. Looking forward to meeting you!",
        "14:20"
      );

      renderButtons([
        { label: "↺ Replay Demo from Start", action: () => restartSimulation() }
      ]);

      // Auto loop after 10s
      scheduleNext(() => {
        restartSimulation();
      }, 10000);
    }, 1100);
  }, 700);
}

function userRequestsCall() {
  clearButtons();
  addWaUserMessage("Can you please call me directly to discuss?", "14:20");
  scheduleNext(() => {
    showTyping('Priya Sharma');
    scheduleNext(() => {
      hideTyping();
      addWaAgentMessage("Absolutely! Dialing your registered WhatsApp phone number right away. Looking forward to speaking with you!", "14:20");
      renderButtons([
        { label: "↺ Replay Demo", action: () => restartSimulation() }
      ]);
    }, 1000);
  }, 600);
}

// Manual trigger from Agent card button "Dispatched to WhatsApp ➔"
window.sendAgentMessageNow = function() {
  if (currentStep === 6) {
    clearTimeout(stepTimeout);
    hideTyping();
    runStep(7);
  }
};

// Play / Pause Simulation
window.togglePlayPause = function() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    if (playIcon) playIcon.textContent = '⏸';
    if (playLabel) playLabel.textContent = 'Pause Demo';
    runStep(currentStep + 1 <= 7 ? currentStep + 1 : 1);
  } else {
    if (playIcon) playIcon.textContent = '▶';
    if (playLabel) playLabel.textContent = 'Resume Demo';
    clearTimeout(stepTimeout);
    setArrowState('none');
  }
};

// Restart Simulation
window.restartSimulation = function() {
  clearTimeout(stepTimeout);
  isPlaying = true;
  currentStep = 0;

  if (playIcon) playIcon.textContent = '⏸';
  if (playLabel) playLabel.textContent = 'Pause Demo';

  // Clear chat
  if (waChatStream) waChatStream.innerHTML = '';
  clearButtons();
  hideTyping();

  // Reset WhatsApp Status
  if (waStatusText) waStatusText.textContent = 'AI Bot Online (Replies in 2s)';

  // Reset Connectors
  setArrowState('none');
  if (conn1Label) conn1Label.textContent = "AI Answering (<2s)";
  if (conn2Label) conn2Label.textContent = "Standby...";

  // Reset AI Box
  if (aiStatusPill) {
    aiStatusPill.textContent = '🟢 Active & Replying Auto';
    aiStatusPill.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    aiStatusPill.style.color = 'var(--green-light)';
  }
  if (aiActionTitle) aiActionTitle.textContent = "Listening for customer questions...";
  if (aiActionDesc) aiActionDesc.textContent = "Ready to answer questions about 2, 3, 4 BHK apartments, floor plans, and amenities.";
  if (aiSpeedValue) aiSpeedValue.textContent = "1.2 Seconds";
  if (aiTransferNotice) aiTransferNotice.style.display = 'none';

  // Reset Agent Box
  if (agentBox) agentBox.classList.remove('active-closer');
  if (agentStatusBadge) {
    agentStatusBadge.className = 'agent-status-badge';
    agentStatusBadge.textContent = 'Standby ⏳';
  }
  if (leadHeat) {
    leadHeat.className = 'lead-heat';
    leadHeat.textContent = 'Interested';
  }
  if (agentLookingFor) agentLookingFor.textContent = "3 BHK Apartment";
  if (agentBrochureStatus) agentBrochureStatus.textContent = "Standby";
  if (agentStandbyView) agentStandbyView.style.display = 'block';
  if (agentJoinedView) agentJoinedView.style.display = 'none';

  // Reset Pills
  setActivePill(1);

  // Start at Step 1
  scheduleNext(() => {
    runStep(1);
  }, 600);
};

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    runStep(1);
  }, 700);
});
