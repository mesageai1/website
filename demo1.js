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

// Connector 1 Elements (WhatsApp <--> Middle Responder)
const conn1Label = document.getElementById('conn1Label');
const trackUserToMiddle = document.getElementById('trackUserToMiddle');
const trackMiddleToUser = document.getElementById('trackMiddleToUser');

// Middle Responder Elements (AI Bot <-> Human Agent Inbox)
const middleResponderBox = document.getElementById('middleResponderBox');
const middleStageTag = document.getElementById('middleStageTag');
const middleStageTitle = document.getElementById('middleStageTitle');
const middleStageCaption = document.getElementById('middleStageCaption');
const middleAiView = document.getElementById('middleAiView');
const middleAgentInboxView = document.getElementById('middleAgentInboxView');

const aiAvatarCore = document.getElementById('aiAvatarCore');
const aiStatusPill = document.getElementById('aiStatusPill');
const aiActionTitle = document.getElementById('aiActionTitle');
const aiActionDesc = document.getElementById('aiActionDesc');
const aiSpeedValue = document.getElementById('aiSpeedValue');
const aiConfidenceValue = document.getElementById('aiConfidenceValue');
const aiTransferNotice = document.getElementById('aiTransferNotice');

// Connector 2 Elements (Middle Inbox <--> Agent Team)
const conn2Label = document.getElementById('conn2Label');
const trackAgentToMiddle = document.getElementById('trackAgentToMiddle');
const trackMiddleToAgent = document.getElementById('trackMiddleToAgent');

// Right Team & CRM Elements
const agentBox = document.getElementById('agentBox');
const teamMemberPriya = document.getElementById('teamMemberPriya');
const priyaStatusText = document.getElementById('priyaStatusText');
const priyaPill = document.getElementById('priyaPill');
const leadHeat = document.getElementById('leadHeat');
const agentLookingFor = document.getElementById('agentLookingFor');
const agentBrochureStatus = document.getElementById('agentBrochureStatus');
const leadStageText = document.getElementById('leadStageText');

// Progress Pills
const pills = [
  document.getElementById('pill-1'),
  document.getElementById('pill-2'),
  document.getElementById('pill-3'),
  document.getElementById('pill-4'),
  document.getElementById('pill-5')
];

// State Machine
let isPlaying = true;
let currentStage = 0;
let actionTimeout = null;

// Helper: Scroll WhatsApp canvas smoothly
function scrollWaCanvas() {
  if (waChatCanvas) {
    waChatCanvas.scrollTop = waChatCanvas.scrollHeight;
  }
}

// Helper: Set Active Step Pill
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

// Helper: Reset signal track animations
function resetTrack(el) {
  if (!el) return;
  el.classList.remove('fire-forward', 'fire-backward', 'shooting');
  void el.offsetWidth; // force DOM reflow
}

// ==========================================================================
// Synchronized Signal Beams
// ==========================================================================

// 1. Signal: User (Phone) -> Middle Responder
function fireSignalUserToMiddle(callback) {
  if (!isPlaying) {
    if (callback) callback();
    return;
  }
  if (conn1Label) {
    conn1Label.textContent = "Customer Signal ➔";
    conn1Label.classList.add('active-link');
  }
  resetTrack(trackUserToMiddle);
  if (trackUserToMiddle) {
    trackUserToMiddle.classList.add('fire-forward', 'shooting');
  }

  // Arrival at Middle (650ms animation duration)
  setTimeout(() => {
    if (trackUserToMiddle) trackUserToMiddle.classList.remove('shooting');
    if (aiAvatarCore) {
      aiAvatarCore.style.boxShadow = '0 0 35px #818cf8, 0 0 10px #ffffff';
      setTimeout(() => {
        aiAvatarCore.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.5)';
      }, 500);
    }
    if (callback) callback();
  }, 650);
}

// 2. Signal: Middle Responder -> User (Phone)
function fireSignalMiddleToUser(callback) {
  if (!isPlaying) {
    if (callback) callback();
    return;
  }
  if (conn1Label) {
    conn1Label.textContent = "Response Signal ➔";
    conn1Label.classList.add('active-link');
  }
  resetTrack(trackMiddleToUser);
  if (trackMiddleToUser) {
    trackMiddleToUser.classList.add('fire-backward', 'shooting');
  }

  // Arrival at Phone (650ms animation duration)
  setTimeout(() => {
    if (trackMiddleToUser) trackMiddleToUser.classList.remove('shooting');
    if (callback) callback();
  }, 650);
}

// 3. Signal: Agent Team (Right) -> Middle Inbox
function fireSignalAgentToMiddle(callback) {
  if (!isPlaying) {
    if (callback) callback();
    return;
  }
  if (conn2Label) {
    conn2Label.textContent = "Priya Assigned ➔";
    conn2Label.classList.add('active-link');
  }
  resetTrack(trackAgentToMiddle);
  if (trackAgentToMiddle) {
    trackAgentToMiddle.classList.add('fire-backward', 'shooting');
  }

  // Arrival at Middle (650ms animation duration)
  setTimeout(() => {
    if (trackAgentToMiddle) trackAgentToMiddle.classList.remove('shooting');
    if (callback) callback();
  }, 650);
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

// Helper: Render WhatsApp Messages
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

function addWaBrochureMessage(text, fileTitle, fileSize, promptText, time = '14:17') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-chat-bubble-item bot';
  item.innerHTML = `
    <div class="bubble-text-box">
      ${text}
      <div class="wa-attachment-box">
        <span style="font-size: 18px;">📄</span>
        <div>
          <b>${fileTitle}</b>
          <small>${fileSize}</small>
        </div>
      </div>
      <p style="margin: 5px 0 0;">${promptText}</p>
    </div>
    <div class="bubble-footer">
      <span>${time}</span>
    </div>
  `;
  waChatStream.appendChild(item);
  scrollWaCanvas();
}

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

function addWaHandoffBanner(html) {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-handoff-pill-alert';
  item.innerHTML = html;
  waChatStream.appendChild(item);
  scrollWaCanvas();
}

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

function scheduleNext(fn, delayMs) {
  clearTimeout(actionTimeout);
  if (!isPlaying) return;
  actionTimeout = setTimeout(() => {
    if (isPlaying) fn();
  }, delayMs);
}

// ==========================================================================
// Interactive Conversation Flow
// ==========================================================================

function executeStage(stageNumber) {
  currentStage = stageNumber;

  switch (stageNumber) {
    // -------------------------------------------------------------
    // STAGE 1: Buyer inquiries about apartments
    // -------------------------------------------------------------
    case 1: {
      setActivePill(1);

      // 1. User message appears in WhatsApp
      addWaUserMessage("Hi, I am looking for an apartment in your new project.", "14:15");

      // 2. Synchronized signal travels from Phone -> Middle AI Bot
      fireSignalUserToMiddle(() => {
        // Signal hits Middle AI Bot!
        if (aiActionTitle) aiActionTitle.textContent = "Analyzing Customer Inquiry...";
        if (aiActionDesc) aiActionDesc.textContent = "Intent: Apartment_Search (2, 3, 4 BHK luxury residences). Fetching live project availability...";
        if (aiSpeedValue) aiSpeedValue.textContent = "0.8s";
        if (aiConfidenceValue) aiConfidenceValue.textContent = "99.4%";

        scheduleNext(() => {
          // AI formulated response -> signal travels Middle -> Phone
          fireSignalMiddleToUser(() => {
            showTyping('MeSage AI');
            scheduleNext(() => {
              hideTyping();
              executeStage(2);
            }, 600);
          });
        }, 900);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 2: AI answers with 2, 3, 4 BHK options
    // -------------------------------------------------------------
    case 2: {
      setActivePill(2);
      if (aiActionTitle) aiActionTitle.textContent = "Dispatched Apartment Configurations";
      if (aiActionDesc) aiActionDesc.textContent = "Offered 2, 3 & 4 BHK choices with instant interactive selection buttons.";
      if (aiSpeedValue) aiSpeedValue.textContent = "1.2s";

      addWaBotMessage(
        "Hello! 👋 Welcome to **Skyline Residences** by MeSage Realty.<br><br>We have premium **2, 3, and 4 BHK** luxury residences available for you. Which configuration would you like to explore?",
        "14:15"
      );

      renderButtons([
        { label: "2 BHK", action: () => selectConfiguration("2 BHK") },
        { label: "3 BHK (Recommended)", action: () => selectConfiguration("3 BHK") },
        { label: "4 BHK Penthouse", action: () => selectConfiguration("4 BHK") }
      ]);

      // Auto-advance after 3.2s
      scheduleNext(() => {
        selectConfiguration("3 BHK");
      }, 3400);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 3: Customer chooses 3 BHK -> AI explains area specs
    // -------------------------------------------------------------
    case 3: {
      setActivePill(2);
      clearButtons();

      // 1. User message in WhatsApp
      addWaUserMessage("3 BHK", "14:16");

      // 2. Signal travels Phone -> Middle AI Bot
      fireSignalUserToMiddle(() => {
        if (agentLookingFor) agentLookingFor.textContent = "3 BHK (1,450-1,850 sq.ft)";
        if (aiActionTitle) aiActionTitle.textContent = "Retrieving 3 BHK Specs";
        if (aiActionDesc) aiActionDesc.textContent = "Pulling super built-up area (1,450 to 1,850 sq.ft), master floor layouts, and balcony views.";
        if (aiSpeedValue) aiSpeedValue.textContent = "0.9s";

        scheduleNext(() => {
          // AI sends response back -> signal travels Middle -> Phone
          fireSignalMiddleToUser(() => {
            showTyping('MeSage AI');
            scheduleNext(() => {
              hideTyping();
              if (aiActionTitle) aiActionTitle.textContent = "Delivered 3 BHK Specs";
              if (aiActionDesc) aiActionDesc.textContent = "Provided dimensions & prompt for Brochure, Location, or Pricing.";
              if (aiSpeedValue) aiSpeedValue.textContent = "1.1s";

              addWaBotMessage(
                "Nice choice! Our 3 BHK luxury residences range from **1,450 to 1,850 sq. ft.** of super built-up area with panoramic skyline balconies.<br><br>What would you like to know more about our 3 BHK homes?",
                "14:16"
              );

              renderButtons([
                { label: "📄 Project Brochure", action: () => selectBrochureOption() },
                { label: "📍 Location & Amenities", action: () => selectBrochureOption() },
                { label: "💰 Pricing & Plans", action: () => triggerPriceInquiry() }
              ]);

              // Auto advance to Brochure
              scheduleNext(() => {
                selectBrochureOption();
              }, 3400);
            }, 600);
          });
        }, 900);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 4: Customer asks Brochure -> AI sends PDF
    // -------------------------------------------------------------
    case 4: {
      setActivePill(3);
      clearButtons();

      addWaUserMessage("Brochure", "14:17");

      fireSignalUserToMiddle(() => {
        if (aiActionTitle) aiActionTitle.textContent = "Generating PDF Brochure";
        if (aiActionDesc) aiActionDesc.textContent = "Fetching verified Skyline_Residences_3BHK_Brochure.pdf via WhatsApp Media API.";
        if (aiSpeedValue) aiSpeedValue.textContent = "1.0s";

        scheduleNext(() => {
          fireSignalMiddleToUser(() => {
            showTyping('MeSage AI');
            scheduleNext(() => {
              hideTyping();
              if (agentBrochureStatus) agentBrochureStatus.textContent = "Sent via PDF ✓";
              if (aiActionTitle) aiActionTitle.textContent = "Brochure Dispatched";
              if (aiActionDesc) aiActionDesc.textContent = "Delivered floor layouts. Inquiring if buyer would like pricing.";
              if (aiSpeedValue) aiSpeedValue.textContent = "1.2s";

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

              // Auto advance to price
              scheduleNext(() => {
                triggerPriceInquiry();
              }, 3600);
            }, 600);
          });
        }, 900);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 5: Buyer asks PRICE -> ESCALATION & HUMAN AGENT ENTERS MIDDLE!
    // -------------------------------------------------------------
    case 5: {
      setActivePill(4);
      clearButtons();

      // 1. User asks for price in WhatsApp
      addWaUserMessage("I want to know the price as well.", "14:18");

      // 2. Signal travels Phone -> Middle AI Bot
      fireSignalUserToMiddle(() => {
        // AI Bot detects price inquiry!
        if (aiActionTitle) aiActionTitle.textContent = "⚠️ PRICE INQUIRY DETECTED!";
        if (aiActionDesc) aiActionDesc.textContent = "Commercial negotiation requested. Pausing automated bot to bring Live Closer Priya Sharma into Middle Inbox.";
        if (aiSpeedValue) aiSpeedValue.textContent = "0.4s";
        if (aiTransferNotice) aiTransferNotice.style.display = 'flex';

        // Update Right CRM
        if (leadHeat) {
          leadHeat.className = 'lead-heat hot';
          leadHeat.textContent = '🔥 Hot Buyer / Pricing';
        }
        if (leadStageText) leadStageText.textContent = "Commercial Negotiation";

        // Step 6: Bring Human Agent into Middle from Inbox!
        scheduleNext(() => {
          executeStage(6);
        }, 1300);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 6: Priya Assigned & Steps into Middle Inbox!
    // -------------------------------------------------------------
    case 6: {
      setActivePill(5);

      // Signal shoots from Right (Sales Team) -> Middle Inbox
      fireSignalAgentToMiddle(() => {
        // Right team updates
        if (teamMemberPriya) teamMemberPriya.classList.add('closer-assigned');
        if (priyaStatusText) priyaStatusText.textContent = "🟢 Active in Middle Inbox!";
        if (priyaPill) {
          priyaPill.className = "tm-pill live";
          priyaPill.textContent = "In Chat";
        }

        // Middle Panel transforms into Human Agent Inbox!
        if (middleResponderBox) middleResponderBox.classList.add('agent-mode-active');
        if (middleStageTag) {
          middleStageTag.className = "stage-tag inbox-tag";
          middleStageTag.textContent = "STEP 2: HUMAN AGENT INBOX";
        }
        if (middleStageTitle) middleStageTitle.textContent = "Priya's Live Inbox";
        if (middleStageCaption) middleStageCaption.textContent = "Senior Sales Closer answering live from unified inbox";

        if (middleAiView) middleAiView.style.display = 'none';
        if (middleAgentInboxView) middleAgentInboxView.style.display = 'flex';

        // WhatsApp Chat Notification Banner
        addWaHandoffBanner("🤝 <strong>Senior Sales Advisor Priya Sharma</strong> has joined the conversation.");
        if (waStatusText) waStatusText.textContent = "Chatting with Priya Sharma (Sales Closer)";

        // Agent in Middle Inbox prepares and dispatches quote
        scheduleNext(() => {
          sendAgentPricingMessage();
        }, 1400);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 7: Priya dispatches pricing & Saturday site visit
    // -------------------------------------------------------------
    case 7: {
      setActivePill(5);

      // Green signal shoots from Middle Inbox -> Phone
      fireSignalMiddleToUser(() => {
        showTyping('Priya Sharma');
        scheduleNext(() => {
          hideTyping();
          addWaAgentMessage(
            "Hello Rahul! **Priya Sharma** here from the Skyline Advisory Team. 👋<br><br>Our 3 BHK luxury residences start at **₹1.85 Cr**, with an exclusive **10:90 festive payment scheme** available this month (pay 10% now, nothing until possession).<br><br>Can I reserve a private VIP site walkthrough for you this **Saturday at 11:00 AM**?",
            "14:19"
          );

          renderButtons([
            { label: "✅ Yes, Saturday 11 AM works!", action: () => userConfirmsSiteVisit() },
            { label: "📞 Call me directly", action: () => userRequestsCall() },
            { label: "↺ Replay Demo", action: () => restartSimulation() }
          ]);

          // Auto-confirm after 5.5s
          scheduleNext(() => {
            userConfirmsSiteVisit();
          }, 5500);
        }, 600);
      });
      break;
    }
  }
}

// User Action Handlers
function selectConfiguration(cfg) {
  clearButtons();
  executeStage(3);
}

function selectBrochureOption() {
  clearButtons();
  executeStage(4);
}

function triggerPriceInquiry() {
  clearButtons();
  executeStage(5);
}

function sendAgentPricingMessage() {
  executeStage(7);
}

// Triggered by "Dispatched via WhatsApp Inbox" button in Middle Card
window.sendAgentMessageNow = function() {
  if (currentStage === 6) {
    clearTimeout(actionTimeout);
    sendAgentPricingMessage();
  }
};

function userConfirmsSiteVisit() {
  clearButtons();
  addWaUserMessage("Yes, Saturday 11 AM works great for me!", "14:20");

  fireSignalUserToMiddle(() => {
    scheduleNext(() => {
      fireSignalMiddleToUser(() => {
        showTyping('Priya Sharma');
        scheduleNext(() => {
          hideTyping();
          if (conn2Label) conn2Label.textContent = "VIP Tour Booked! 🎉";
          addWaAgentMessage(
            "Wonderful Rahul! 🎉 Your VIP site consultation is confirmed for **Saturday at 11:00 AM**. I will personally welcome you at our experience gallery with the customized cost breakdown. Looking forward to meeting you!",
            "14:20"
          );

          renderButtons([
            { label: "↺ Replay Demo from Start", action: () => restartSimulation() }
          ]);

          scheduleNext(() => {
            restartSimulation();
          }, 10000);
        }, 600);
      });
    }, 700);
  });
}

function userRequestsCall() {
  clearButtons();
  addWaUserMessage("Can you please call me directly to discuss?", "14:20");

  fireSignalUserToMiddle(() => {
    scheduleNext(() => {
      fireSignalMiddleToUser(() => {
        showTyping('Priya Sharma');
        scheduleNext(() => {
          hideTyping();
          addWaAgentMessage("Absolutely! Dialing your registered WhatsApp phone number right away. Looking forward to speaking with you!", "14:20");
          renderButtons([
            { label: "↺ Replay Demo", action: () => restartSimulation() }
          ]);
        }, 600);
      });
    }, 600);
  });
}

// Play / Pause Simulation
window.togglePlayPause = function() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    if (playIcon) playIcon.textContent = '⏸';
    if (playLabel) playLabel.textContent = 'Pause Demo';
    executeStage(currentStage + 1 <= 7 ? currentStage + 1 : 1);
  } else {
    if (playIcon) playIcon.textContent = '▶';
    if (playLabel) playLabel.textContent = 'Resume Demo';
    clearTimeout(actionTimeout);
    if (trackUserToMiddle) resetTrack(trackUserToMiddle);
    if (trackMiddleToUser) resetTrack(trackMiddleToUser);
    if (trackAgentToMiddle) resetTrack(trackAgentToMiddle);
  }
};

// Restart Simulation
window.restartSimulation = function() {
  clearTimeout(actionTimeout);
  isPlaying = true;
  currentStage = 0;

  if (playIcon) playIcon.textContent = '⏸';
  if (playLabel) playLabel.textContent = 'Pause Demo';

  // Clear chat
  if (waChatStream) waChatStream.innerHTML = '';
  clearButtons();
  hideTyping();

  // Reset WhatsApp Status
  if (waStatusText) waStatusText.textContent = 'AI Bot Online (Replies in 2s)';

  // Reset Connectors
  if (trackUserToMiddle) resetTrack(trackUserToMiddle);
  if (trackMiddleToUser) resetTrack(trackMiddleToUser);
  if (trackAgentToMiddle) resetTrack(trackAgentToMiddle);

  if (conn1Label) {
    conn1Label.textContent = "Live Signal Link";
    conn1Label.classList.remove('active-link');
  }
  if (conn2Label) {
    conn2Label.textContent = "Team Standby";
    conn2Label.classList.remove('active-link');
  }

  // Reset Middle Responder to AI Bot View
  if (middleResponderBox) middleResponderBox.classList.remove('agent-mode-active');
  if (middleStageTag) {
    middleStageTag.className = "stage-tag ai-tag";
    middleStageTag.textContent = "STEP 2: AI BOT ACTIVE";
  }
  if (middleStageTitle) middleStageTitle.textContent = "Active Responder";
  if (middleStageCaption) middleStageCaption.textContent = "Handles routine queries & hands over on price";

  if (middleAiView) middleAiView.style.display = 'flex';
  if (middleAgentInboxView) middleAgentInboxView.style.display = 'none';

  if (aiStatusPill) {
    aiStatusPill.textContent = '🟢 Auto-Replying in < 2s';
  }
  if (aiActionTitle) aiActionTitle.textContent = "Listening for customer inquiry...";
  if (aiActionDesc) aiActionDesc.textContent = "Ready to answer questions about 2, 3, 4 BHK apartments, floor plans, and amenities.";
  if (aiSpeedValue) aiSpeedValue.textContent = "1.1s";
  if (aiConfidenceValue) aiConfidenceValue.textContent = "99.4%";
  if (aiTransferNotice) aiTransferNotice.style.display = 'none';

  // Reset Right Team & CRM
  if (teamMemberPriya) teamMemberPriya.classList.remove('closer-assigned');
  if (priyaStatusText) priyaStatusText.textContent = "Standby ⏳ (Listening to AI)";
  if (priyaPill) {
    priyaPill.className = "tm-pill";
    priyaPill.textContent = "Standby";
  }
  if (leadHeat) {
    leadHeat.className = 'lead-heat';
    leadHeat.textContent = 'Interested';
  }
  if (agentLookingFor) agentLookingFor.textContent = "3 BHK Apartment";
  if (agentBrochureStatus) agentBrochureStatus.textContent = "Pending";
  if (leadStageText) leadStageText.textContent = "AI Qualification";

  // Reset Pills
  setActivePill(1);

  // Start at Stage 1
  scheduleNext(() => {
    executeStage(1);
  }, 500);
};

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    executeStage(1);
  }, 600);
});
