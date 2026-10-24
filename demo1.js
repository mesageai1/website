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

// Connector 1 Elements (Signal Transit Zone & Glowing Orbs)
const colConn1 = document.getElementById('colConn1');
const connectorTrackHolder = document.getElementById('connectorTrackHolder');
const orbForward = document.getElementById('orbForward');
const orbBackward = document.getElementById('orbBackward');

// In-Between Agent Elements (Slides in between)
const colAgentInbetween = document.getElementById('colAgentInbetween');
const colConn2 = document.getElementById('colConn2');
const agentStatusPill = document.getElementById('agentStatusPill');
const agentContextTitle = document.getElementById('agentContextTitle');
const agentContextQuote = document.getElementById('agentContextQuote');
const composerTitle = document.getElementById('composerTitle');
const compReadyTag = document.getElementById('compReadyTag');
const composerTextBox = document.getElementById('composerTextBox');
const agentDispatchStatus = document.getElementById('agentDispatchStatus');

// AI Robot Elements (Right Side)
const colAiBot = document.getElementById('colAiBot');
const robotFaceSphere = document.getElementById('robotFaceSphere');
const aiStatusPill = document.getElementById('aiStatusPill');
const aiBeacon = document.getElementById('aiBeacon');
const aiStatusText = document.getElementById('aiStatusText');
const aiActionTitle = document.getElementById('aiActionTitle');
const aiActionDesc = document.getElementById('aiActionDesc');
const aiWaveform = document.getElementById('aiWaveform');

// State Machine
let isPlaying = true;
let currentStage = 0;
let actionTimeout = null;

// Helper: Scroll WhatsApp canvas smoothly (No scrollbar visible)
function scrollWaCanvas() {
  if (waChatCanvas) {
    waChatCanvas.scrollTop = waChatCanvas.scrollHeight;
  }
}

// ==========================================================================
// Dynamic Vertical Signal Positioning (Balls travel at exact message level)
// ==========================================================================
function updateSignalLevel() {
  if (!connectorTrackHolder || !waChatStream || !phoneFrame) return;

  const lastBubble = waChatStream.lastElementChild;
  if (!lastBubble) {
    connectorTrackHolder.style.top = '95px';
    return;
  }

  const phoneRect = phoneFrame.getBoundingClientRect();
  const bubbleRect = lastBubble.getBoundingClientRect();

  // Vertical center of the latest message bubble relative to top of phone
  const bubbleCenterY = (bubbleRect.top + bubbleRect.height / 2) - phoneRect.top;

  // Clamp within the visible chat canvas (between 80px and 390px for 465px height phone)
  const clampedY = Math.max(80, Math.min(bubbleCenterY, 390));

  connectorTrackHolder.style.top = `${clampedY}px`;
}

// 1. Forward Signal: Glowing Blue Ball shoots Phone -> AI/Agent at exact message level
function fireForwardSignal(callback) {
  updateSignalLevel();

  if (orbForward) {
    orbForward.classList.remove('shooting');
    void orbForward.offsetWidth; // trigger reflow
    orbForward.classList.add('shooting');
  }

  // 650ms transit
  setTimeout(() => {
    if (orbForward) orbForward.classList.remove('shooting');
    if (robotFaceSphere) {
      robotFaceSphere.style.transform = 'scale(1.08)';
      setTimeout(() => {
        robotFaceSphere.style.transform = 'scale(1)';
      }, 350);
    }
    if (callback) callback();
  }, 650);
}

// 2. Backward Signal: Glowing Green Ball shoots AI/Agent -> Phone at exact message level
function fireBackwardSignal(callback) {
  updateSignalLevel();

  if (orbBackward) {
    orbBackward.classList.remove('shooting');
    void orbBackward.offsetWidth; // trigger reflow
    orbBackward.classList.add('shooting');
  }

  // 650ms transit
  setTimeout(() => {
    if (orbBackward) orbBackward.classList.remove('shooting');
    if (callback) callback();
  }, 650);
}

// Helper: Show typing indicator
function showTyping(name = 'MeSage AI') {
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
        <span style="font-size: 22px;">📄</span>
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
  updateSignalLevel();
}

function addWaAgentMessage(text, time = '14:19') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-chat-bubble-item agent';
  const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  item.innerHTML = `
    <div class="bubble-text-box">
      <small style="color: #34d399; font-weight: 800; display: block; margin-bottom: 4px;">
        🧑‍💼 Sarah Mitchell (Live Advisor)
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
    // STAGE 1: Buyer Inquires about service
    // -------------------------------------------------------------
    case 1: {
      // User sends message
      addWaUserMessage("Hi, I have a quick question about getting started with your premium service.", "14:15");

      // Glowing Blue Ball shoots to AI Robot
      fireForwardSignal(() => {
        if (aiActionTitle) aiActionTitle.textContent = "Analyzing customer query...";
        if (aiActionDesc) aiActionDesc.textContent = "Intent: Plan_Inquiry · Scanning solution packages";

        scheduleNext(() => {
          // Glowing Green Ball shoots back to WhatsApp
          fireBackwardSignal(() => {
            showTyping('MeSage AI');
            scheduleNext(() => {
              hideTyping();
              executeStage(2);
            }, 600);
          });
        }, 800);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 2: AI answers with service tiers (< 2s)
    // -------------------------------------------------------------
    case 2: {
      if (aiActionTitle) aiActionTitle.textContent = "Dispatched plan options";
      if (aiActionDesc) aiActionDesc.textContent = "Offered Growth, Enterprise, and Custom VIP tiers";

      addWaBotMessage(
        "Hello! 👋 Welcome to **MeSage Concierge**.<br><br>We would love to help you get started! Are you looking for our **Growth**, **Enterprise**, or **Custom VIP** plan?",
        "14:15"
      );

      renderButtons([
        { label: "🚀 Growth Tier", action: () => selectTier("Growth Tier") },
        { label: "⚡ Enterprise Tier (Recommended)", action: () => selectTier("Enterprise Tier") },
        { label: "💎 Custom VIP", action: () => selectTier("Custom VIP") }
      ]);

      // Auto-advance after 3.2s
      scheduleNext(() => {
        selectTier("Enterprise Tier");
      }, 3400);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 3: Customer chooses Enterprise
    // -------------------------------------------------------------
    case 3: {
      clearButtons();

      addWaUserMessage("Enterprise Tier", "14:16");

      // Glowing Blue Ball shoots to AI Robot
      fireForwardSignal(() => {
        if (aiActionTitle) aiActionTitle.textContent = "Retrieving Enterprise Specs...";
        if (aiActionDesc) aiActionDesc.textContent = "Pulling dedicated SLA, custom workflows, and API capacity";

        scheduleNext(() => {
          fireBackwardSignal(() => {
            showTyping('MeSage AI');
            scheduleNext(() => {
              hideTyping();
              if (aiActionTitle) aiActionTitle.textContent = "Delivered tier specs & brochure prompt";
              if (aiActionDesc) aiActionDesc.textContent = "Offered solution overview PDF & pricing inquiry";

              addWaBotMessage(
                "Excellent choice! Our **Enterprise Tier** includes 24/7 dedicated priority SLA, custom webhook workflows, and isolated cloud deployment.<br><br>Would you like our solution overview PDF?",
                "14:16"
              );

              renderButtons([
                { label: "📄 Download Solution Overview", action: () => selectBrochureOption() },
                { label: "💰 Request Custom Pricing & Terms", action: () => triggerPriceInquiry() }
              ]);

              // Auto advance to Brochure
              scheduleNext(() => {
                selectBrochureOption();
              }, 3400);
            }, 600);
          });
        }, 800);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 4: Customer asks Brochure -> AI sends verified PDF
    // -------------------------------------------------------------
    case 4: {
      clearButtons();

      addWaUserMessage("Download Solution Overview", "14:17");

      // Glowing Blue Ball shoots to AI Robot
      fireForwardSignal(() => {
        if (aiActionTitle) aiActionTitle.textContent = "Transmitting PDF Document...";
        if (aiActionDesc) aiActionDesc.textContent = "Dispatched MeSage_Enterprise_Overview.pdf via Media API";

        scheduleNext(() => {
          fireBackwardSignal(() => {
            showTyping('MeSage AI');
            scheduleNext(() => {
              hideTyping();
              if (aiActionTitle) aiActionTitle.textContent = "Overview document delivered";
              if (aiActionDesc) aiActionDesc.textContent = "Prompting if customer needs commercial pricing";

              addWaBrochureMessage(
                "Here is our official solution overview with architectural diagrams, security compliance, and integration specs:",
                "MeSage_Enterprise_Overview.pdf",
                "3.8 MB · Verified PDF Document",
                "Would you like to review customized pricing and available payment terms?",
                "14:17"
              );

              renderButtons([
                { label: "💰 What is your custom pricing?", action: () => triggerPriceInquiry() }
              ]);

              // Auto advance to price
              scheduleNext(() => {
                triggerPriceInquiry();
              }, 3600);
            }, 600);
          });
        }, 800);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 5: Buyer asks PRICE -> AGENT STEPS IN ANYTIME!
    // -------------------------------------------------------------
    case 5: {
      clearButtons();

      addWaUserMessage("What is your custom pricing and onboarding schedule?", "14:18");

      // Blue ball shoots to Robot
      fireForwardSignal(() => {
        // AI pauses and routes to Live Agent Sarah Mitchell
        if (aiActionTitle) aiActionTitle.textContent = "Routing to Live Advisor Sarah Mitchell...";
        if (aiActionDesc) aiActionDesc.textContent = "Commercial negotiation requested · Live Specialist joining chat";
        if (aiStatusText) aiStatusText.textContent = "⏸ Handoff (Closer In-Between)";
        if (aiStatusPill) {
          aiStatusPill.style.background = "rgba(245, 158, 11, 0.2)";
          aiStatusPill.style.color = "#f59e0b";
          aiStatusPill.style.borderColor = "rgba(245, 158, 11, 0.45)";
        }
        if (aiBeacon) {
          aiBeacon.style.background = "#f59e0b";
          aiBeacon.style.boxShadow = "0 0 8px #f59e0b";
        }

        // STEP 6: AGENT COMES IN-BETWEEN!
        scheduleNext(() => {
          executeStage(6);
        }, 1100);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 6: Agent expands IN-BETWEEN in White Panel!
    // -------------------------------------------------------------
    case 6: {
      // Expand In-Between Slot smoothly
      if (colAgentInbetween) colAgentInbetween.classList.add('active-inbetween');
      if (colConn2) colConn2.classList.add('active-inbetween');
      if (colConn1) colConn1.classList.add('narrowed');

      // WhatsApp Chat Notification Banner
      addWaHandoffBanner("🤝 <strong>Senior Live Advisor Sarah Mitchell</strong> joined the chat in-between.");
      if (waStatusText) waStatusText.textContent = "Chatting with Sarah Mitchell (Live Advisor)";

      // Update signal level to align with handoff banner
      updateSignalLevel();

      // Agent prepares & dispatches pricing quote
      scheduleNext(() => {
        sendAgentPricingMessage();
      }, 1400);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 7: Sarah quotes price -> Customer requests appointment
    // -------------------------------------------------------------
    case 7: {
      // Glowing Green Ball shoots from Agent in-between -> Phone
      fireBackwardSignal(() => {
        showTyping('Sarah Mitchell');
        scheduleNext(() => {
          hideTyping();
          addWaAgentMessage(
            "Hello Alex! **Sarah Mitchell** here from the Enterprise Solutions Team. 👋<br><br>Our Enterprise tier starts at **$1,499/mo** with custom volume discounts and an introductory **quarterly flex schedule**.<br><br>Would you like to schedule a private VIP onboarding consultation with us?",
            "14:19"
          );

          renderButtons([
            { label: "📅 I want to book an appointment for a consultation", action: () => triggerAppointmentBooking() }
          ]);

          // Auto-confirm after 3.8s
          scheduleNext(() => {
            triggerAppointmentBooking();
          }, 3800);
        }, 600);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 8: Customer wants appointment -> AI TAKES BACK OVER!
    // -------------------------------------------------------------
    case 8: {
      clearButtons();

      addWaUserMessage("I want to book an appointment for a consultation.", "14:20");

      fireForwardSignal(() => {
        // Agent panel updates to reflect handoff back to AI
        if (agentStatusPill) {
          agentStatusPill.textContent = "🔄 Handed to AI";
          agentStatusPill.style.background = "#e0f2fe";
          agentStatusPill.style.color = "#0369a1";
          agentStatusPill.style.borderColor = "#7dd3fc";
        }
        if (agentDispatchStatus) {
          agentDispatchStatus.textContent = "Transferred to AI Scheduler ➔";
        }

        // WhatsApp handoff notice
        addWaHandoffBanner("⚡ <strong>Sarah Mitchell</strong> handed over to <strong>AI Booking Assistant</strong> for instant scheduling.");
        if (waStatusText) waStatusText.textContent = "AI Scheduler Online (Booking Consultation)";

        // AI Robot wakes up and resumes active automation!
        if (aiStatusText) aiStatusText.textContent = "Autonomous AI Active (<2s)";
        if (aiStatusPill) {
          aiStatusPill.style.background = "rgba(16, 185, 129, 0.16)";
          aiStatusPill.style.color = "#34d399";
          aiStatusPill.style.borderColor = "rgba(16, 185, 129, 0.4)";
        }
        if (aiBeacon) {
          aiBeacon.style.background = "#10b981";
          aiBeacon.style.boxShadow = "0 0 8px #10b981";
        }
        if (aiActionTitle) aiActionTitle.textContent = "Arranging VIP Onboarding Consultation...";
        if (aiActionDesc) aiActionDesc.textContent = "Checking calendar availability for private meeting link";

        // AI asks for Date and Time
        scheduleNext(() => {
          fireBackwardSignal(() => {
            showTyping('MeSage AI');
            scheduleNext(() => {
              hideTyping();
              addWaBotMessage(
                "I would be delighted to schedule your VIP onboarding consultation! 🏛️<br><br>Please select your preferred date and time slot:",
                "14:20"
              );

              renderButtons([
                { label: "📅 Tomorrow, 11:00 AM", action: () => confirmAppointment("Tomorrow at 11:00 AM") },
                { label: "📅 Saturday, 11:00 AM (Recommended)", action: () => confirmAppointment("Saturday at 11:00 AM") },
                { label: "📅 Sunday, 3:30 PM", action: () => confirmAppointment("Sunday at 3:30 PM") }
              ]);

              // Auto advance to Saturday booking
              scheduleNext(() => {
                confirmAppointment("Saturday at 11:00 AM");
              }, 4200);
            }, 600);
          });
        }, 800);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 9: Customer selects Date & Time -> AI Confirms Booking!
    // -------------------------------------------------------------
    case 9: {
      clearButtons();

      if (agentStatusPill) {
        agentStatusPill.textContent = "📅 Consultation Set";
        agentStatusPill.style.background = "#dcfce7";
        agentStatusPill.style.color = "#15803d";
        agentStatusPill.style.borderColor = "#86efac";
      }
      if (agentDispatchStatus) {
        agentDispatchStatus.textContent = "Confirmed for Saturday 11 AM 🎉";
      }

      addWaUserMessage("Saturday at 11:00 AM", "14:21");

      fireForwardSignal(() => {
        if (aiActionTitle) aiActionTitle.textContent = "Consultation Confirmed & Synced! 🎉";
        if (aiActionDesc) aiActionDesc.textContent = "Calendar invite dispatched · Assigned Host: Sarah Mitchell";

        scheduleNext(() => {
          fireBackwardSignal(() => {
            showTyping('MeSage AI');
            scheduleNext(() => {
              hideTyping();

              addWaBotMessage(
                "🎉 **Your VIP Consultation is Confirmed!**<br><br>🗓️ **Schedule:** This Saturday at 11:00 AM<br>📍 **Channel:** Dedicated Google Meet &amp; Executive Briefing Link<br>👤 **Host:** Sarah Mitchell will personally lead your deployment walk-through.<br><br>A calendar invite and preparation notes have been sent to your WhatsApp. We look forward to meeting you!",
                "14:21"
              );

              renderButtons([
                { label: "↺ Replay Interactive Demo", action: () => restartSimulation() }
              ]);

              // Auto replay after 10s in a continuous loop
              scheduleNext(() => {
                restartSimulation();
              }, 10000);
            }, 600);
          });
        }, 800);
      });
      break;
    }
  }
}

// User Action Handlers
function selectTier(tier) {
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

function triggerAppointmentBooking() {
  clearButtons();
  executeStage(8);
}

function confirmAppointment(slotText) {
  clearButtons();
  executeStage(9);
}

// Restart Simulation (Continuous loop)
window.restartSimulation = function() {
  clearTimeout(actionTimeout);
  isPlaying = true;
  currentStage = 0;

  // Clear chat
  if (waChatStream) waChatStream.innerHTML = '';
  clearButtons();
  hideTyping();

  // Reset WhatsApp Status
  if (waStatusText) waStatusText.textContent = 'online';

  // Reset In-Between Agent slot to closed
  if (colAgentInbetween) colAgentInbetween.classList.remove('active-inbetween');
  if (colConn2) colConn2.classList.remove('active-inbetween');
  if (colConn1) colConn1.classList.remove('narrowed');

  // Reset Agent status pill and composer
  if (agentStatusPill) {
    agentStatusPill.textContent = "🟢 Live in Chat";
    agentStatusPill.style.background = "#dcfce7";
    agentStatusPill.style.color = "#15803d";
    agentStatusPill.style.borderColor = "#86efac";
  }
  if (agentDispatchStatus) {
    agentDispatchStatus.textContent = "✓ Sent to WhatsApp chat";
  }

  // Reset Signal Orbs
  if (orbForward) orbForward.classList.remove('shooting');
  if (orbBackward) orbBackward.classList.remove('shooting');
  if (connectorTrackHolder) connectorTrackHolder.style.top = '95px';

  // Reset AI Robot Stage
  if (aiStatusText) aiStatusText.textContent = 'Autonomous AI Online (<2s)';
  if (aiStatusPill) {
    aiStatusPill.style.background = "rgba(16, 185, 129, 0.16)";
    aiStatusPill.style.color = "#34d399";
    aiStatusPill.style.borderColor = "rgba(16, 185, 129, 0.4)";
  }
  if (aiBeacon) {
    aiBeacon.style.background = "#10b981";
    aiBeacon.style.boxShadow = "0 0 8px #10b981";
  }
  if (aiActionTitle) aiActionTitle.textContent = "Listening for customer query...";
  if (aiActionDesc) aiActionDesc.textContent = "Instant answers in < 2 seconds";

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
