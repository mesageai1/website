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
const phoneFrame = document.getElementById('phoneFrame');

const btnPlayPause = document.getElementById('btnPlayPause');
const playIcon = document.getElementById('playIcon');
const playLabel = document.getElementById('playLabel');

// Connector 1 Elements (Dynamic Vertical Tracks)
const colConn1 = document.getElementById('colConn1');
const conn1Label = document.getElementById('conn1Label');
const connectorTrackHolder = document.getElementById('connectorTrackHolder');
const lineForward = document.getElementById('lineForward');
const lineBackward = document.getElementById('lineBackward');

// In-Between Agent Elements (Slides in between on price!)
const colAgentInbetween = document.getElementById('colAgentInbetween');
const colConn2 = document.getElementById('colConn2');

// AI Bot Elements (Right)
const colAiBot = document.getElementById('colAiBot');
const aiBotBox = document.getElementById('aiBotBox');
const aiAvatarCore = document.getElementById('aiAvatarCore');
const aiStatusPill = document.getElementById('aiStatusPill');
const aiActionTitle = document.getElementById('aiActionTitle');
const aiActionDesc = document.getElementById('aiActionDesc');
const aiSpeedValue = document.getElementById('aiSpeedValue');
const aiConfidenceValue = document.getElementById('aiConfidenceValue');
const aiModeValue = document.getElementById('aiModeValue');
const aiTransferNotice = document.getElementById('aiTransferNotice');

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

// ==========================================================================
// Dynamic Vertical Signal Positioning ("lines come slowly below with messages")
// ==========================================================================
function updateSignalLevel() {
  if (!connectorTrackHolder || !waChatStream || !phoneFrame) return;

  const lastBubble = waChatStream.lastElementChild;
  if (!lastBubble) {
    connectorTrackHolder.style.top = '85px';
    return;
  }

  const phoneRect = phoneFrame.getBoundingClientRect();
  const bubbleRect = lastBubble.getBoundingClientRect();

  // Vertical center of the latest message bubble relative to top of phone
  const bubbleCenterY = (bubbleRect.top + bubbleRect.height / 2) - phoneRect.top;

  // Clamp within the visible chat canvas
  const clampedY = Math.max(65, Math.min(bubbleCenterY, 320));

  connectorTrackHolder.style.top = `${clampedY}px`;
}

// Reset signal line animations
function resetLine(line) {
  if (!line) return;
  line.classList.remove('active-fire', 'shooting');
  void line.offsetWidth; // trigger reflow
}

// 1. Forward Signal: Phone -> AI / Agent (moves down with message)
function fireForwardSignal(callback) {
  updateSignalLevel();
  if (!isPlaying) {
    if (callback) callback();
    return;
  }

  if (conn1Label) {
    conn1Label.textContent = "Inbound ➔";
    conn1Label.classList.add('active-pulse');
  }

  resetLine(lineForward);
  if (lineForward) {
    lineForward.classList.add('active-fire', 'shooting');
  }

  // 600ms arrival
  setTimeout(() => {
    if (lineForward) lineForward.classList.remove('shooting');
    if (aiAvatarCore) {
      aiAvatarCore.style.boxShadow = '0 0 32px #818cf8, 0 0 10px #ffffff';
      setTimeout(() => {
        aiAvatarCore.style.boxShadow = '0 0 16px rgba(99, 102, 241, 0.5)';
      }, 450);
    }
    if (callback) callback();
  }, 600);
}

// 2. Backward Signal: AI / Agent -> Phone (moves down with reply)
function fireBackwardSignal(callback) {
  updateSignalLevel();
  if (!isPlaying) {
    if (callback) callback();
    return;
  }

  if (conn1Label) {
    conn1Label.textContent = "Outbound ➔";
    conn1Label.classList.add('active-pulse');
  }

  resetLine(lineBackward);
  if (lineBackward) {
    lineBackward.classList.add('active-fire', 'shooting');
  }

  // 600ms arrival
  setTimeout(() => {
    if (lineBackward) lineBackward.classList.remove('shooting');
    if (callback) callback();
  }, 600);
}

// Helper: Show typing indicator
function showTyping(name = 'AI Bot') {
  if (waTypingBox && typingSender) {
    typingSender.textContent = name;
    waTypingBox.style.display = 'flex';
    scrollWaCanvas();
    updateSignalLevel();
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
  updateSignalLevel();
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
  updateSignalLevel();
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
  updateSignalLevel();
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
  updateSignalLevel();
}

function addWaHandoffBanner(html) {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-handoff-pill-alert';
  item.innerHTML = html;
  waChatStream.appendChild(item);
  scrollWaCanvas();
  updateSignalLevel();
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
    // STAGE 1: Buyer Inquires about apartments
    // -------------------------------------------------------------
    case 1: {
      setActivePill(1);

      // User sends message
      addWaUserMessage("Hi, I am looking for an apartment in your new project.", "14:15");

      // Signal line moves to message 1 level and fires forward to AI
      fireForwardSignal(() => {
        if (aiActionTitle) aiActionTitle.textContent = "Analyzing Customer Inquiry...";
        if (aiActionDesc) aiActionDesc.textContent = "Intent: Apartment_Search. Scanning project inventory for 2, 3, 4 BHK luxury residences...";
        if (aiSpeedValue) aiSpeedValue.textContent = "0.8s";
        if (aiConfidenceValue) aiConfidenceValue.textContent = "99.4%";

        scheduleNext(() => {
          // AI dispatches reply back along the line
          fireBackwardSignal(() => {
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
    // STAGE 3: Customer chooses 3 BHK -> Lines move down with message!
    // -------------------------------------------------------------
    case 3: {
      setActivePill(2);
      clearButtons();

      addWaUserMessage("3 BHK", "14:16");

      // Signal lines smoothly slide down to message 3 and fire forward
      fireForwardSignal(() => {
        if (aiActionTitle) aiActionTitle.textContent = "Retrieving 3 BHK Specs";
        if (aiActionDesc) aiActionDesc.textContent = "Pulling super built-up area (1,450 to 1,850 sq.ft), master floor layouts, and balcony specs.";
        if (aiSpeedValue) aiSpeedValue.textContent = "0.9s";

        scheduleNext(() => {
          fireBackwardSignal(() => {
            showTyping('MeSage AI');
            scheduleNext(() => {
              hideTyping();
              if (aiActionTitle) aiActionTitle.textContent = "Delivered 3 BHK Specs";
              if (aiActionDesc) aiActionDesc.textContent = "Provided dimensions & prompt for Brochure, Location, or Pricing.";
              if (aiSpeedValue) aiSpeedValue.textContent = "1.1s";

              addWaBotMessage(
                "Nice choice! Our 3 BHK luxury residences range from **1,450 to 1,850 sq. ft.** super built-up area with panoramic balconies.<br><br>What would you like to know more about our 3 BHK homes?",
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
    // STAGE 4: Customer asks Brochure -> Lines move down with message!
    // -------------------------------------------------------------
    case 4: {
      setActivePill(3);
      clearButtons();

      addWaUserMessage("Brochure", "14:17");

      // Signal lines slide down to brochure message level
      fireForwardSignal(() => {
        if (aiActionTitle) aiActionTitle.textContent = "Generating PDF Brochure";
        if (aiActionDesc) aiActionDesc.textContent = "Transmitting verified Skyline_Residences_3BHK_Brochure.pdf via WhatsApp Media API.";
        if (aiSpeedValue) aiSpeedValue.textContent = "1.0s";

        scheduleNext(() => {
          fireBackwardSignal(() => {
            showTyping('MeSage AI');
            scheduleNext(() => {
              hideTyping();
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
    // STAGE 5: Buyer asks PRICE -> AGENT ENTERS IN-BETWEEN!
    // -------------------------------------------------------------
    case 5: {
      setActivePill(4);
      clearButtons();

      addWaUserMessage("I want to know the price as well.", "14:18");

      // Lines slide down to the bottom message and fire forward
      fireForwardSignal(() => {
        // AI detects price inquiry!
        if (aiActionTitle) aiActionTitle.textContent = "⚠️ PRICE INQUIRY DETECTED!";
        if (aiActionDesc) aiActionDesc.textContent = "Commercial negotiation requested. Pausing AI bot. Closer Priya Sharma entering in-between from Live Inbox.";
        if (aiSpeedValue) aiSpeedValue.textContent = "0.4s";
        if (aiModeValue) {
          aiModeValue.textContent = "Paused ⏸";
          aiModeValue.style.color = "#f59e0b";
        }
        if (aiTransferNotice) aiTransferNotice.style.display = 'flex';
        if (aiBotBox) aiBotBox.classList.add('ai-paused');
        if (aiStatusPill) {
          aiStatusPill.textContent = "⏸ Paused (Closer In-Between)";
        }

        // STEP 6: AGENT COMES IN-BETWEEN!
        scheduleNext(() => {
          executeStage(6);
        }, 1200);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 6: Agent expands IN-BETWEEN WhatsApp & AI!
    // -------------------------------------------------------------
    case 6: {
      setActivePill(5);

      // AI Bot paused state indicator
      if (aiBotBox) aiBotBox.classList.add('ai-paused');
      if (aiStatusPill) {
        aiStatusPill.textContent = "⏸ Paused (Closer In-Between)";
        aiStatusPill.style.background = "rgba(245, 158, 11, 0.2)";
        aiStatusPill.style.color = "#f59e0b";
        aiStatusPill.style.borderColor = "rgba(245, 158, 11, 0.45)";
      }
      if (aiModeValue) {
        aiModeValue.textContent = "Paused ⏸";
        aiModeValue.style.color = "#f59e0b";
      }
      if (aiTransferNotice) aiTransferNotice.style.display = 'flex';

      // Expand In-Between Slot smoothly
      if (colAgentInbetween) colAgentInbetween.classList.add('active-inbetween');
      if (colConn2) colConn2.classList.add('active-inbetween');
      if (colConn1) colConn1.classList.add('narrowed');

      // WhatsApp Chat Notification Banner
      addWaHandoffBanner("🤝 <strong>Senior Sales Advisor Priya Sharma</strong> has joined the conversation in-between.");
      if (waStatusText) waStatusText.textContent = "Chatting with Priya Sharma (Sales Closer)";

      // Update signal level to align with handoff banner / bottom
      updateSignalLevel();

      // Agent in-between prepares & dispatches pricing quote
      scheduleNext(() => {
        sendAgentPricingMessage();
      }, 1500);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 7: Priya dispatches pricing & Saturday site visit
    // -------------------------------------------------------------
    case 7: {
      setActivePill(5);

      // Signal shoots from Agent in-between -> Phone along the level
      fireBackwardSignal(() => {
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

// Triggered by button in Agent in-between card
window.sendAgentMessageNow = function() {
  if (currentStage === 6) {
    clearTimeout(actionTimeout);
    sendAgentPricingMessage();
  }
};

function userConfirmsSiteVisit() {
  clearButtons();
  addWaUserMessage("Yes, Saturday 11 AM works great for me!", "14:20");

  fireForwardSignal(() => {
    scheduleNext(() => {
      fireBackwardSignal(() => {
        showTyping('Priya Sharma');
        scheduleNext(() => {
          hideTyping();
          if (conn1Label) conn1Label.textContent = "Booking Confirmed! 🎉";
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

  fireForwardSignal(() => {
    scheduleNext(() => {
      fireBackwardSignal(() => {
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
    if (lineForward) resetLine(lineForward);
    if (lineBackward) resetLine(lineBackward);
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

  // Reset In-Between Agent slot to closed
  if (colAgentInbetween) colAgentInbetween.classList.remove('active-inbetween');
  if (colConn2) colConn2.classList.remove('active-inbetween');
  if (colConn1) colConn1.classList.remove('narrowed');

  // Reset Signal Lines to top
  if (lineForward) resetLine(lineForward);
  if (lineBackward) resetLine(lineBackward);
  if (connectorTrackHolder) connectorTrackHolder.style.top = '85px';
  if (conn1Label) {
    conn1Label.textContent = "⚡ Signal Link";
    conn1Label.classList.remove('active-pulse');
  }

  // Reset AI Bot Box
  if (aiBotBox) aiBotBox.classList.remove('ai-paused');
  if (aiStatusPill) {
    aiStatusPill.textContent = '🟢 Active & Replying (<2s)';
    aiStatusPill.style.background = '';
    aiStatusPill.style.color = '';
    aiStatusPill.style.borderColor = '';
  }
  if (aiActionTitle) aiActionTitle.textContent = "Listening for customer inquiry...";
  if (aiActionDesc) aiActionDesc.textContent = "Ready to answer questions about 2, 3, 4 BHK apartments, floor plans, and amenities.";
  if (aiSpeedValue) aiSpeedValue.textContent = "1.1s";
  if (aiConfidenceValue) aiConfidenceValue.textContent = "99.4%";
  if (aiModeValue) {
    aiModeValue.textContent = "Auto ⚡";
    aiModeValue.style.color = "#34d399";
  }
  if (aiTransferNotice) aiTransferNotice.style.display = 'none';

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
