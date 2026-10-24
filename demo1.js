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
const orbGreenForward = document.getElementById('orbGreenForward');
const orbIndigoBackward = document.getElementById('orbIndigoBackward');
const orbWhiteBackward = document.getElementById('orbWhiteBackward');

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

// AI Automation Elements (Right Side - Clean Logo & Soundwave only)
const colAiBot = document.getElementById('colAiBot');
const companyLogoCore = document.getElementById('companyLogoCore');
const aiWaveform = document.getElementById('aiWaveform');

// Authentic WhatsApp Blue Double Checkmark SVG
const WA_BLUE_TICKS_SVG = `<svg viewBox="0 0 16 11" width="14" height="10" fill="none" class="wa-double-ticks"><path d="M11.04 1.15L5.78 8.08 3.12 5.09.8 7.18 5.78 12.8 13.36 2.87 11.04 1.15z" fill="#53bdeb"/><path d="M14.04 1.15L8.78 8.08 7.9 7.08 7.08 8.08 8.78 10.02 16.36 2.87 14.04 1.15z" fill="#53bdeb"/></svg>`;

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
// Dynamic Exact Horizontal Signal Alignment (ZERO vertical drift)
// ==========================================================================
function getActiveBubbleCenterY() {
  // If typing indicator is active, track typing indicator position
  if (waTypingBox && waTypingBox.style.display !== 'none') {
    const rect = waTypingBox.getBoundingClientRect();
    if (rect.height > 0) {
      return rect.top + (rect.height / 2);
    }
  }
  // Otherwise track the latest chat bubble
  if (waChatStream && waChatStream.lastElementChild) {
    const rect = waChatStream.lastElementChild.getBoundingClientRect();
    return rect.top + (rect.height / 2);
  }
  return null;
}

function updateSignalLevel(immediate = true) {
  if (!connectorTrackHolder || !colConn1) return;

  const targetCenterY = getActiveBubbleCenterY();
  const connRect = colConn1.getBoundingClientRect();

  if (targetCenterY !== null && connRect.height > 0) {
    // 7px is half of 14px orb height -> exact horizontal alignment
    const exactTop = targetCenterY - connRect.top - 7;
    const clampedY = Math.max(15, Math.min(exactTop, connRect.height - 30));

    if (immediate) {
      connectorTrackHolder.style.transition = 'none';
      connectorTrackHolder.style.top = `${clampedY}px`;
      // Flush layout reflow before launching ball animation
      void connectorTrackHolder.offsetHeight;
    } else {
      connectorTrackHolder.style.transition = 'top 0.2s ease';
      connectorTrackHolder.style.top = `${clampedY}px`;
    }
  } else {
    connectorTrackHolder.style.top = '95px';
  }
}

// 1. Green Ball: WhatsApp (Left) -> AI / Human Agent (Right) in exact horizontal line
function fireGreenForwardSignal(callback) {
  updateSignalLevel(true);

  if (orbGreenForward) {
    orbGreenForward.classList.remove('shooting-right');
    void orbGreenForward.offsetWidth; // reflow
    orbGreenForward.classList.add('shooting-right');
  }

  setTimeout(() => {
    if (orbGreenForward) orbGreenForward.classList.remove('shooting-right');
    if (companyLogoCore) {
      companyLogoCore.style.transform = 'scale(1.12)';
      setTimeout(() => {
        companyLogoCore.style.transform = 'scale(1)';
      }, 350);
    }
    if (callback) callback();
  }, 650);
}

// 2. Indigo Ball: AI (Right) -> WhatsApp User (Left) in exact horizontal line
function fireIndigoBackwardSignal(callback) {
  updateSignalLevel(true);

  if (orbIndigoBackward) {
    orbIndigoBackward.classList.remove('shooting-left');
    void orbIndigoBackward.offsetWidth; // reflow
    orbIndigoBackward.classList.add('shooting-left');
  }

  setTimeout(() => {
    if (orbIndigoBackward) orbIndigoBackward.classList.remove('shooting-left');
    if (callback) callback();
  }, 650);
}

// 3. White Ball: Live Agent (Right) -> WhatsApp User (Left) in exact horizontal line
function fireWhiteBackwardSignal(callback) {
  updateSignalLevel(true);

  if (orbWhiteBackward) {
    orbWhiteBackward.classList.remove('shooting-left');
    void orbWhiteBackward.offsetWidth; // reflow
    orbWhiteBackward.classList.add('shooting-left');
  }

  setTimeout(() => {
    if (orbWhiteBackward) orbWhiteBackward.classList.remove('shooting-left');
    if (callback) callback();
  }, 650);
}

// Helper: Show typing indicator
function showTyping(name = 'MeSage AI') {
  if (waTypingBox && typingSender) {
    typingSender.textContent = name;
    waTypingBox.style.display = 'flex';
    scrollWaCanvas();
    updateSignalLevel(true);
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
      ${WA_BLUE_TICKS_SVG}
    </div>
  `;
  waChatStream.appendChild(item);
  scrollWaCanvas();
  updateSignalLevel(true);
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
  updateSignalLevel(true);
}

function addWaBrochureMessage(text, fileTitle, fileSize, promptText, time = '14:17') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-chat-bubble-item bot';
  item.innerHTML = `
    <div class="bubble-text-box">
      ${text}
      <div class="wa-doc-attachment-card">
        <div class="wa-doc-icon-badge">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#ea4335"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        </div>
        <div class="wa-doc-meta">
          <span class="wa-doc-name">${fileTitle}</span>
          <span class="wa-doc-sub">${fileSize}</span>
        </div>
        <div class="wa-doc-download-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#8696a0"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
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
  updateSignalLevel(true);
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
  updateSignalLevel(true);
}

function addWaHandoffBanner(html) {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-handoff-pill-alert';
  item.innerHTML = html;
  waChatStream.appendChild(item);
  scrollWaCanvas();
  updateSignalLevel(true);
}

function renderButtons(btnList) {
  if (!waButtonsTray) return;
  waButtonsTray.innerHTML = '';
  btnList.forEach(btn => {
    const el = document.createElement('button');
    el.className = 'wa-btn-option';
    el.innerHTML = `
      <svg viewBox="0 0 24 24" width="12" height="12" fill="#00a884" style="flex-shrink:0"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>
      <span>${btn.label}</span>
    `;
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

      // Glowing Green Ball shoots from WhatsApp to AI Automation
      fireGreenForwardSignal(() => {
        scheduleNext(() => {
          showTyping('MeSage AI');
          // Glowing Indigo Ball shoots back from AI to WhatsApp
          fireIndigoBackwardSignal(() => {
            hideTyping();
            executeStage(2);
          });
        }, 700);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 2: AI answers with service tiers (< 2s)
    // -------------------------------------------------------------
    case 2: {
      addWaBotMessage(
        "Hello! 👋 Welcome to **MeSage Concierge**.<br><br>We would love to help you get started! Are you looking for our **Growth**, **Enterprise**, or **Custom VIP** plan?",
        "14:15"
      );

      renderButtons([
        { label: "🚀 Growth Tier", action: () => selectTier("Growth Tier") },
        { label: "⚡ Enterprise Tier (Recommended)", action: () => selectTier("Enterprise Tier") },
        { label: "💎 Custom VIP", action: () => selectTier("Custom VIP") }
      ]);

      // Auto-advance after 3.4s
      scheduleNext(() => {
        selectTier("Enterprise Tier");
      }, 3400);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 3: Customer chooses Enterprise Tier
    // -------------------------------------------------------------
    case 3: {
      clearButtons();

      addWaUserMessage("Enterprise Tier", "14:16");

      // Glowing Green Ball shoots from WhatsApp to AI Automation
      fireGreenForwardSignal(() => {
        scheduleNext(() => {
          showTyping('MeSage AI');
          // Glowing Indigo Ball shoots back from AI to WhatsApp
          fireIndigoBackwardSignal(() => {
            hideTyping();

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
          });
        }, 700);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 4: Customer asks Brochure -> AI sends verified PDF
    // -------------------------------------------------------------
    case 4: {
      clearButtons();

      addWaUserMessage("Download Solution Overview", "14:17");

      // Glowing Green Ball shoots from WhatsApp to AI
      fireGreenForwardSignal(() => {
        scheduleNext(() => {
          showTyping('MeSage AI');
          // Glowing Indigo Ball shoots back from AI to WhatsApp
          fireIndigoBackwardSignal(() => {
            hideTyping();

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
          });
        }, 700);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 5: Buyer asks PRICE -> AGENT CAN STEP IN ANYTIME!
    // -------------------------------------------------------------
    case 5: {
      clearButtons();

      addWaUserMessage("What is your custom pricing and onboarding schedule?", "14:18");

      // Green ball shoots from WhatsApp to AI / Agent Inbox
      fireGreenForwardSignal(() => {
        // STEP 6: AGENT COMES IN-BETWEEN!
        scheduleNext(() => {
          executeStage(6);
        }, 1000);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 6: Agent expands IN-BETWEEN in Pure White Panel!
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
      updateSignalLevel(true);

      // Agent prepares & dispatches pricing quote
      scheduleNext(() => {
        sendAgentPricingMessage();
      }, 1200);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 7: Sarah Mitchell quotes price via White Ball
    // -------------------------------------------------------------
    case 7: {
      showTyping('Sarah Mitchell');
      // Glowing White Ball shoots from Agent in-between -> WhatsApp User
      fireWhiteBackwardSignal(() => {
        hideTyping();
        addWaAgentMessage(
          "Hello Alex! **Sarah Mitchell** here from the Enterprise Solutions Team. 👋<br><br>Our Enterprise tier starts at **$1,499/mo** with custom volume discounts and an introductory **quarterly flex schedule**.<br><br>Would you like to schedule a private VIP onboarding consultation with us?",
          "14:19"
        );

        renderButtons([
          { label: "📅 I want to book an appointment for a consultation", action: () => triggerAppointmentBooking() }
        ]);

        // Auto-advance after 3.8s
        scheduleNext(() => {
          triggerAppointmentBooking();
        }, 3800);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 8: Customer wants appointment -> AI TAKES BACK OVER!
    // -------------------------------------------------------------
    case 8: {
      clearButtons();

      addWaUserMessage("I want to book an appointment for a consultation.", "14:20");

      // Green ball shoots from WhatsApp user to Agent & AI
      fireGreenForwardSignal(() => {
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

        // AI asks for Date and Time via Indigo Ball
        scheduleNext(() => {
          showTyping('MeSage AI');
          fireIndigoBackwardSignal(() => {
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
          });
        }, 700);
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

      // Green Ball shoots from WhatsApp user to AI Automation
      fireGreenForwardSignal(() => {
        scheduleNext(() => {
          showTyping('MeSage AI');
          // Indigo Ball shoots from AI back to WhatsApp
          fireIndigoBackwardSignal(() => {
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
          });
        }, 700);
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
  if (orbGreenForward) orbGreenForward.classList.remove('shooting-right');
  if (orbIndigoBackward) orbIndigoBackward.classList.remove('shooting-left');
  if (orbWhiteBackward) orbWhiteBackward.classList.remove('shooting-left');
  if (connectorTrackHolder) connectorTrackHolder.style.top = '95px';

  // Reset AI Robot Stage
  if (companyLogoCore) companyLogoCore.style.transform = 'scale(1)';

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
