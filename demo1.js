// ==========================================================================
// MeSage AI — Live Interactive Demo: Natural Conversation & Lead Workflow
// Fully Interactive: User can type anything in natural language (NO BUTTONS!)
// ==========================================================================

// DOM Elements
const stageDynamicContainer = document.getElementById('stageDynamicContainer');
const flightTransitOverlay = document.getElementById('flightTransitOverlay');
const waChatStream = document.getElementById('waChatStream');
const waChatCanvas = document.getElementById('waChatCanvas');
const waTypingBox = document.getElementById('waTypingBox');
const typingSender = document.getElementById('typingSender');
const waStatusText = document.getElementById('waStatusText');
const phoneFrame = document.getElementById('phoneFrame');
const waUserInput = document.getElementById('waUserInput');
const waSendBtn = document.getElementById('waSendBtn');
const waChatForm = document.getElementById('waChatForm');

// Full-Span Paper Plane Flight Elements (Green, Indigo, White)
const planeGreen = document.getElementById('planeGreen');
const planeIndigo = document.getElementById('planeIndigo');
const planeWhite = document.getElementById('planeWhite');

// In-Between Agent Elements (Distance Kept Blank Till Agent Enters!)
const colAgentInbetween = document.getElementById('colAgentInbetween');
const colConn1 = document.getElementById('colConn1');
const colConn2 = document.getElementById('colConn2');
const crmChatCanvas = document.getElementById('crmChatCanvas');
const crmChatStream = document.getElementById('crmChatStream');

// AI Automation Elements (Right Side - Futuristic Robot Face & Soundwave)
const colAiBot = document.getElementById('colAiBot');
const robotFaceCore = document.getElementById('robotFaceCore');
const aiWaveform = document.getElementById('aiWaveform');
const agentPanelTitle = document.getElementById('agentPanelTitle');

// Authentic WhatsApp Blue Double Checkmark SVG
const WA_BLUE_TICKS_SVG = `<svg viewBox="0 0 16 11" width="14" height="10" fill="none" class="wa-double-ticks"><path d="M11.04 1.15L5.78 8.08 3.12 5.09.8 7.18 5.78 12.8 13.36 2.87 11.04 1.15z" fill="#53bdeb"/><path d="M14.04 1.15L8.78 8.08 7.9 7.08 7.08 8.08 8.78 10.02 16.36 2.87 14.04 1.15z" fill="#53bdeb"/></svg>`;

// State Machine
let isAutoPlaying = true;
let currentStage = 0;
let actionTimeout = null;

// Helper: Get Current Time string
function getCurrentTime() {
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  return `${hrs}:${mins}`;
}

// Helper: Scroll WhatsApp canvas smoothly
function scrollWaCanvas() {
  if (waChatCanvas) {
    waChatCanvas.scrollTop = waChatCanvas.scrollHeight;
    setTimeout(() => {
      if (waChatCanvas) waChatCanvas.scrollTop = waChatCanvas.scrollHeight;
    }, 60);
  }
}

// Helper: Scroll CRM Canvas
function scrollCrmCanvas() {
  if (crmChatCanvas) {
    crmChatCanvas.scrollTop = crmChatCanvas.scrollHeight;
  }
}

// Helper: Get vertical Y position of active chat bubble
function getActiveBubbleCenterY() {
  if (waTypingBox && waTypingBox.style.display !== 'none') {
    const rect = waTypingBox.getBoundingClientRect();
    if (rect.height > 0) return rect.top + (rect.height / 2);
  }
  if (waChatStream && waChatStream.lastElementChild) {
    const rect = waChatStream.lastElementChild.getBoundingClientRect();
    return rect.top + (rect.height / 2);
  }
  return null;
}

// ==========================================================================
// FULL-SPAN PAPER PLANE FLIGHT ENGINE (DYNAMIC HORIZONTAL & AERODYNAMIC)
// Glides completely from panel to panel across the stage (never short!)
// ==========================================================================
function launchPaperPlane({ planeEl, fromEl, toEl, direction = 'forward', duration = 720, onComplete }) {
  if (!planeEl || !stageDynamicContainer || !fromEl || !toEl) {
    if (onComplete) onComplete();
    return;
  }

  const stageRect = stageDynamicContainer.getBoundingClientRect();
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();

  const isForward = direction === 'forward'; // Left to Right

  let startX, endX;
  if (isForward) {
    // Left edge of transit: starts right at the sending panel's right border
    startX = fromRect.right - stageRect.left - 6;
    // Right edge of transit: flies completely to the receiving panel's left border
    endX = toRect.left - stageRect.left + 14;
  } else {
    // Flying Right to Left: starts at sending panel's left border
    startX = fromRect.left - stageRect.left + 6;
    // Flies completely to the receiving panel's right border
    endX = toRect.right - stageRect.left - 14;
  }

  // Calculate dynamic vertical flight altitude aligned with active bubble
  let targetY = 160;
  const bubbleCenterY = getActiveBubbleCenterY();
  if (bubbleCenterY !== null && stageRect.height > 0) {
    targetY = bubbleCenterY - stageRect.top - 11;
  }
  targetY = Math.max(30, Math.min(targetY, 440));

  const scaleFlip = isForward ? 'scaleX(1)' : 'scaleX(-1)';
  const midX = startX + (endX - startX) * 0.5;
  const midY = targetY - 10; // gentle mid-air lift

  if (planeEl.getAnimations) {
    planeEl.getAnimations().forEach(anim => anim.cancel());
  }

  planeEl.style.opacity = '0';

  const animation = planeEl.animate([
    {
      transform: `translate3d(${startX}px, ${targetY + 4}px, 0) ${scaleFlip} scale(0.6) rotate(${isForward ? -4 : 4}deg)`,
      opacity: 0
    },
    {
      transform: `translate3d(${startX + (endX - startX) * 0.12}px, ${targetY}px, 0) ${scaleFlip} scale(1.12) rotate(${isForward ? 2 : -2}deg)`,
      opacity: 1,
      offset: 0.12
    },
    {
      transform: `translate3d(${midX}px, ${midY}px, 0) ${scaleFlip} scale(1.22) rotate(0deg)`,
      opacity: 1,
      offset: 0.5
    },
    {
      transform: `translate3d(${startX + (endX - startX) * 0.88}px, ${targetY}px, 0) ${scaleFlip} scale(1.12) rotate(${isForward ? -2 : 2}deg)`,
      opacity: 1,
      offset: 0.88
    },
    {
      transform: `translate3d(${endX}px, ${targetY}px, 0) ${scaleFlip} scale(0.6) rotate(0deg)`,
      opacity: 0
    }
  ], {
    duration: duration,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'forwards'
  });

  animation.onfinish = () => {
    planeEl.style.opacity = '0';
    if (onComplete) onComplete();
  };
}

// 1. Green Paper Plane: Customer WhatsApp -> AI or Live Agent
function fireGreenForwardSignal(targetElOrCallback, maybeCallback) {
  let targetEl = colAiBot;
  let callback = null;

  if (typeof targetElOrCallback === 'function') {
    callback = targetElOrCallback;
    if (colAgentInbetween && colAgentInbetween.classList.contains('active-inbetween')) {
      targetEl = colAgentInbetween;
    } else {
      targetEl = colAiBot;
    }
  } else if (targetElOrCallback && targetElOrCallback.nodeType) {
    targetEl = targetElOrCallback;
    callback = maybeCallback;
  } else {
    callback = maybeCallback;
  }

  launchPaperPlane({
    planeEl: planeGreen,
    fromEl: phoneFrame,
    toEl: targetEl,
    direction: 'forward',
    duration: 720,
    onComplete: () => {
      if (targetEl === colAiBot && robotFaceCore) {
        robotFaceCore.style.transform = 'scale(1.14)';
        setTimeout(() => {
          if (robotFaceCore) robotFaceCore.style.transform = 'scale(1)';
        }, 320);
      } else if (targetEl === colAgentInbetween) {
        const inboxCard = document.getElementById('agentInboxCard');
        if (inboxCard) {
          inboxCard.style.boxShadow = '0 0 35px rgba(99, 102, 241, 0.6)';
          setTimeout(() => {
            if (inboxCard) inboxCard.style.boxShadow = '';
          }, 350);
        }
      }
      if (callback) callback();
    }
  });
}

// 2. Indigo Paper Plane: AI -> Customer WhatsApp
function fireIndigoBackwardSignal(callback) {
  launchPaperPlane({
    planeEl: planeIndigo,
    fromEl: colAiBot,
    toEl: phoneFrame,
    direction: 'backward',
    duration: 720,
    onComplete: () => {
      if (callback) callback();
    }
  });
}

// 3. White Paper Plane: Live Agent -> Customer WhatsApp
function fireWhiteBackwardSignal(callback) {
  launchPaperPlane({
    planeEl: planeWhite,
    fromEl: colAgentInbetween,
    toEl: phoneFrame,
    direction: 'backward',
    duration: 720,
    onComplete: () => {
      if (callback) callback();
    }
  });
}

// Typing Indicator
function showTyping(senderName) {
  if (typingSender) typingSender.textContent = senderName;
  if (waTypingBox) waTypingBox.style.display = 'block';
  updateSignalLevel(true);
  scrollWaCanvas();
}

function hideTyping() {
  if (waTypingBox) waTypingBox.style.display = 'none';
  updateSignalLevel(true);
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// Helper: Render CRM Inbox Messages (Live Synced with WhatsApp)
function addCrmUserMessage(text, time = '14:15') {
  if (!crmChatStream) return;
  const item = document.createElement('div');
  item.className = 'crm-msg-item customer';
  item.innerHTML = `
    <div class="crm-msg-meta">
      <span class="crm-msg-sender">Alex Turner</span>
      <span class="crm-msg-time">${time}</span>
    </div>
    <div class="crm-msg-bubble">${text}</div>
  `;
  crmChatStream.appendChild(item);
  scrollCrmCanvas();
}

function addCrmBotMessage(text, time = '14:15') {
  if (!crmChatStream) return;
  const item = document.createElement('div');
  item.className = 'crm-msg-item bot';
  const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  item.innerHTML = `
    <div class="crm-msg-meta right">
      <span class="crm-msg-sender indigo">🤖 MeSage AI (Bot Flow)</span>
      <span class="crm-msg-time">${time}</span>
    </div>
    <div class="crm-msg-bubble bot-bubble">${formatted}</div>
  `;
  crmChatStream.appendChild(item);
  scrollCrmCanvas();
}

function addCrmBrochureMessage(text, fileTitle, time = '14:17') {
  if (!crmChatStream) return;
  const item = document.createElement('div');
  item.className = 'crm-msg-item bot';
  item.innerHTML = `
    <div class="crm-msg-meta right">
      <span class="crm-msg-sender indigo">🤖 MeSage AI (Brochure Auto-Sent)</span>
      <span class="crm-msg-time">${time}</span>
    </div>
    <div class="crm-msg-bubble bot-bubble">
      ${text}
      <div class="crm-doc-chip">
        <span>📄 ${fileTitle}</span>
        <small>✓ Sent to WhatsApp</small>
      </div>
    </div>
  `;
  crmChatStream.appendChild(item);
  scrollCrmCanvas();
}

function addCrmAgentMessage(text, time = '14:19') {
  if (!crmChatStream) return;
  const item = document.createElement('div');
  item.className = 'crm-msg-item agent';
  const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  item.innerHTML = `
    <div class="crm-msg-meta right">
      <span class="crm-msg-sender agent-tag">🧑‍💼 Sarah Mitchell (Property Advisor)</span>
      <span class="crm-msg-time">${time}</span>
    </div>
    <div class="crm-msg-bubble agent-bubble">
      ${formatted}
      <div class="crm-delivery-tag">
        <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
        <span>Delivered to WhatsApp</span>
      </div>
    </div>
  `;
  crmChatStream.appendChild(item);
  scrollCrmCanvas();
}

// Helper: Render WhatsApp Messages
function addWaUserMessage(text, time = '14:15') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-msg-row wa-customer';
  item.innerHTML = `
    <div class="wa-bubble customer-bubble">
      <div class="wa-bubble-content">${formatMarkdown(text)}</div>
      <div class="wa-meta-time">
        <span>${time}</span>
        ${WA_BLUE_TICKS_SVG}
      </div>
    </div>
  `;
  waChatStream.appendChild(item);
  addCrmUserMessage(text, time);
  scrollWaCanvas();
}

function addWaBotMessage(text, time = '14:15') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-msg-row wa-bot';
  item.innerHTML = `
    <div class="wa-bubble bot-bubble">
      <div class="wa-bubble-content">${formatMarkdown(text)}</div>
      <div class="wa-meta-time">
        <span>${time}</span>
      </div>
    </div>
  `;
  waChatStream.appendChild(item);
  addCrmBotMessage(text, time);
  scrollWaCanvas();
}

function addWaBrochureMessage(text, fileTitle, fileSize, promptText, time = '14:17') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-msg-row wa-bot';
  item.innerHTML = `
    <div class="wa-bubble bot-bubble wa-media-bubble">
      <div class="wa-bubble-content">${formatMarkdown(text)}</div>
      
      <div class="wa-doc-attachment-card">
        <div class="wa-doc-icon-red">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zm4.5 2H15v-3h-1.5v3zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/></svg>
        </div>
        <div class="wa-doc-details">
          <strong class="wa-doc-title">${fileTitle}</strong>
          <span class="wa-doc-size">${fileSize}</span>
        </div>
        <div class="wa-doc-dl-btn" title="Download Brochure">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="#8696a0"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
        </div>
      </div>

      <div class="wa-bubble-content" style="margin-top:6px; font-size:11px">${formatMarkdown(promptText)}</div>

      <div class="wa-meta-time">
        <span>${time}</span>
      </div>
    </div>
  `;
  waChatStream.appendChild(item);
  addCrmBrochureMessage(text, fileTitle, time);
  scrollWaCanvas();
}

function addWaAgentMessage(text, time = '14:19') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-msg-row wa-bot wa-agent-override';
  item.innerHTML = `
    <div class="wa-agent-sender-tag">
      <span class="agent-avatar-mini">S</span>
      <span>Sarah Mitchell • Senior Property Advisor</span>
    </div>
    <div class="wa-bubble agent-bubble">
      <div class="wa-bubble-content">${formatMarkdown(text)}</div>
      <div class="wa-meta-time">
        <span>${time}</span>
      </div>
    </div>
  `;
  waChatStream.appendChild(item);
  addCrmAgentMessage(text, time);
  scrollWaCanvas();
}

function addWaHandoffBanner(html) {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-system-banner';
  item.innerHTML = `<span>${html}</span>`;
  waChatStream.appendChild(item);
  scrollWaCanvas();
  updateSignalLevel(true);
}

// Scheduling timer helper
function scheduleNext(fn, delayMs) {
  clearTimeout(actionTimeout);
  if (!isAutoPlaying) return;
  actionTimeout = setTimeout(() => {
    if (isAutoPlaying) fn();
  }, delayMs);
}

// ==========================================================================
// NATURAL LANGUAGE INTENT ENGINE (USER CAN ASK ANYTHING ANY WAY!)
// ==========================================================================
function processCustomInquiry(rawText) {
  // When visitor types, pause auto-play so user has full control
  clearTimeout(actionTimeout);
  isAutoPlaying = false;

  const time = getCurrentTime();

  // 1. Add user message to WhatsApp & CRM
  addWaUserMessage(rawText, time);

  // 2. Fire Green Forward Signal to AI / Agent
  fireGreenForwardSignal(() => {
    scheduleNextForUser(() => {
      respondToInquiry(rawText, time);
    }, 450);
  });
}

function scheduleNextForUser(fn, delayMs) {
  clearTimeout(actionTimeout);
  actionTimeout = setTimeout(fn, delayMs);
}

function respondToInquiry(rawText, time) {
  const text = rawText.toLowerCase().trim();

  // -------------------------------------------------------------
  // 1. INTENT: PRICE / PAYMENT PLAN / COST / DISCOUNT / OFFERS
  // Handled by LIVE HUMAN AGENT Sarah Mitchell stepping in!
  // -------------------------------------------------------------
  if (/(price|cost|how much|rate|payment|scheme|discount|offer|budget|cr|lakh|inr|₹|emi|downpayment|quote|pricing|deal)/i.test(text)) {
    // Sarah Mitchell steps in without moving Customer or AI panel!
    if (colAgentInbetween) colAgentInbetween.classList.add('active-inbetween');
    if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT (ACTIVE)";

    addWaHandoffBanner("🤝 <strong>Senior Property Advisor Sarah Mitchell</strong> joined the chat in-between.");
    if (waStatusText) waStatusText.textContent = "Chatting with Sarah Mitchell (Property Advisor)";
    updateSignalLevel(true);
    scrollCrmCanvas();

    showTyping('Sarah Mitchell');
    scheduleNextForUser(() => {
      fireWhiteBackwardSignal(() => {
        hideTyping();
        const priceMsg = "Hello! **Sarah Mitchell** here from the Sales Office. 👋<br><br>Our luxury 3 BHK residences start at **₹2.45 Cr all-inclusive** (approx. ₹13,500/sq.ft) with an exclusive **10:90 festive payment scheme** (pay 10% on booking, zero pre-EMI until possession).<br><br>When would you like to come in for an exclusive VIP site visit and private model apartment tour?";
        addWaAgentMessage(priceMsg, time);
      });
    }, 1100);
    return;
  }

  // -------------------------------------------------------------
  // 2. INTENT: APPOINTMENT / SITE VISIT / BOOKING / SCHEDULE / SLOTS
  // Handled by AUTONOMOUS AI CONCIERGE taking over!
  // -------------------------------------------------------------
  if (/(book|appointment|visit|tour|schedule|slot|time|date|tomorrow|saturday|sunday|weekend|monday|tuesday|wednesday|thursday|friday|come|coming)/i.test(text)) {
    // If agent was active, agent steps out gracefully, AI confirms
    if (colAgentInbetween && colAgentInbetween.classList.contains('active-inbetween')) {
      colAgentInbetween.classList.remove('active-inbetween');
      if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT";
      addWaHandoffBanner("⚡ <strong>Sarah Mitchell</strong> completed pricing consultation &amp; stepped out. <strong>Autonomous AI Concierge</strong> takes over to confirm your booking.");
      if (waStatusText) waStatusText.textContent = "online";
    }

    let schedule = "This Saturday at 11:00 AM";
    if (/tomorrow/i.test(text)) schedule = "Tomorrow at 11:00 AM";
    else if (/sunday/i.test(text)) schedule = "This Sunday at 3:30 PM";
    else if (/saturday/i.test(text)) schedule = "This Saturday at 11:00 AM";
    else if (/\b(at\s+\d+|am|pm)\b/i.test(text)) {
      schedule = rawText;
    }

    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireIndigoBackwardSignal(() => {
        hideTyping();
        const confirmMsg = `🎉 **Your VIP Site Visit is Confirmed!**<br><br>🗓️ **Schedule:** ${schedule}<br>📍 **Location:** Prime Residency Experience Center, Tower A<br>👤 **Host:** Sarah Mitchell will personally welcome you and guide your private model apartment tour.<br><br>A location pin, gate pass QR code, and confirmation details have been sent to your WhatsApp. We look forward to hosting you!`;
        addWaBotMessage(confirmMsg, time);

        const activeBadge = document.querySelector('.crm-active-badge');
        if (activeBadge) {
          activeBadge.textContent = "Visit Booked";
          activeBadge.style.background = "rgba(16, 185, 129, 0.2)";
          activeBadge.style.color = "#34d399";
        }
      });
    }, 900);
    return;
  }

  // -------------------------------------------------------------
  // 3. INTENT: BROCHURE / FLOOR PLANS / CATALOG / PDF / LAYOUT
  // -------------------------------------------------------------
  if (/(brochure|floor\s*plan|plan|pdf|catalog|layout|master\s*plan|document)/i.test(text)) {
    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireIndigoBackwardSignal(() => {
        hideTyping();
        addWaBrochureMessage(
          "Here is the official project brochure with comprehensive 2 BHK, 3 BHK & Penthouse floor plans, master layout, and 40+ world-class club amenities:",
          "Prime_Residency_Luxury_Brochure.pdf",
          "4.2 MB • Verified PDF Brochure",
          "Feel free to ask about pricing, payment schemes, or scheduling a private site visit.",
          time
        );
      });
    }, 800);
    return;
  }

  // -------------------------------------------------------------
  // 4. INTENT: CONFIGURATIONS / 2 BHK / 3 BHK / 4 BHK / PENTHOUSE
  // -------------------------------------------------------------
  if (/(2\s*bhk|3\s*bhk|4\s*bhk|penthouse|bhk|bedroom|sqft|sq\.ft|size|area|config)/i.test(text)) {
    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireIndigoBackwardSignal(() => {
        hideTyping();
        let resp = "";
        if (/2\s*bhk/i.test(text)) {
          resp = "Our **2 BHK Residences** range from **850 to 1,150 sq.ft** with contemporary open-plan layouts, modular German kitchens, and spacious sundeck balconies.<br><br>Starting from **₹1.65 Cr** with flexible payment options. Would you like to download the floor plan brochure or check pricing?";
        } else if (/4\s*bhk|penthouse/i.test(text)) {
          resp = "Our **4 BHK Sky Penthouses** offer **2,400+ sq.ft** with double-height living ceilings, private rooftop plunge pool, landscaped terrace garden, and 360° panoramic skyline views.<br><br>Starting from **₹3.85 Cr**. Would you like to schedule an exclusive VIP model tour?";
        } else {
          resp = "Our **3 BHK Premium Residences** range from **1,450 to 1,850 sq.ft** with panoramic skyline views, private sundecks, Italian marble flooring, and smart home automation.<br><br>📍 **Location:** Central Business District, Sector 48 (5 mins from Metro &amp; Express Highway).<br><br>You can ask for the brochure, pricing, or book a private site visit!";
        }
        addWaBotMessage(resp, time);
      });
    }, 800);
    return;
  }

  // -------------------------------------------------------------
  // 5. INTENT: LOCATION / WHERE / SECTOR / METRO / HIGHWAY
  // -------------------------------------------------------------
  if (/(where|location|address|sector|metro|highway|airport|distance|situated|map)/i.test(text)) {
    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireIndigoBackwardSignal(() => {
        hideTyping();
        const resp = "📍 **Prime Residency Location &amp; Connectivity:**<br><br>Located in the heart of **Sector 48, Central Business District**.<br>• 🚇 5 mins to Sector 48 Metro Station<br>• 🚗 2 mins to Express Highway &amp; Golf Course Ext.<br>• ✈️ 20 mins to International Airport<br>• Top international schools &amp; multispecialty hospitals within 3 km.<br><br>Would you like to book a site visit or ask about pricing?";
        addWaBotMessage(resp, time);
      });
    }, 800);
    return;
  }

  // -------------------------------------------------------------
  // 6. INTENT: AMENITIES / CLUBHOUSE / POOL / GYM / SECURITY
  // -------------------------------------------------------------
  if (/(amenit|facilit|pool|gym|club|garden|security|park|sports|tennis|squash)/i.test(text)) {
    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireIndigoBackwardSignal(() => {
        hideTyping();
        const resp = "🏛️ **40+ World-Class Amenities at Prime Residency:**<br><br>• 🏊 Rooftop Infinity Swimming Pool &amp; Sky Lounge<br>• 🏋️ 25,000 sq.ft Luxury Clubhouse with Technogym setup<br>• 🎾 Tennis &amp; Indoor Squash Courts<br>• 🌳 80% Green Open Spaces with Reflexology Park<br>• 🛡️ 3-Tier Biometric &amp; Smart IoT Security 24/7.<br><br>Would you like to download our brochure or schedule a visit?";
        addWaBotMessage(resp, time);
      });
    }, 800);
    return;
  }

  // -------------------------------------------------------------
  // 7. INTENT: TALK TO HUMAN / AGENT / CALL
  // -------------------------------------------------------------
  if (/(agent|human|person|call|phone|talk|representative|sales\s*rep)/i.test(text)) {
    if (colAgentInbetween) colAgentInbetween.classList.add('active-inbetween');
    if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT (ACTIVE)";

    addWaHandoffBanner("🤝 <strong>Senior Property Advisor Sarah Mitchell</strong> joined the chat in-between.");
    if (waStatusText) waStatusText.textContent = "Chatting with Sarah Mitchell (Property Advisor)";
    updateSignalLevel(true);

    showTyping('Sarah Mitchell');
    scheduleNextForUser(() => {
      fireWhiteBackwardSignal(() => {
        hideTyping();
        addWaAgentMessage("Hello! **Sarah Mitchell** here from the Sales Office. 👋<br><br>I am happy to assist you personally with customized floor plans, festive pricing schemes, and private tours. What can I help you with today?", time);
      });
    }, 900);
    return;
  }

  // -------------------------------------------------------------
  // 8. INTENT: REPLAY / RESET / RESTART
  // -------------------------------------------------------------
  if (/(replay|reset|restart|start\s*over)/i.test(text)) {
    restartSimulation();
    return;
  }

  // -------------------------------------------------------------
  // 9. INTENT: GREETINGS / HELLO / HI
  // -------------------------------------------------------------
  if (/(hi|hello|hey|good\s*(morning|afternoon|evening))/i.test(text)) {
    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireIndigoBackwardSignal(() => {
        hideTyping();
        const resp = "Hello! 👋 Welcome to **Prime Residency Concierge** powered by MeSage AI.<br><br>I can answer any questions about our luxury residences, share floor plans and brochures, get you pricing from our sales team, or schedule your VIP site visit.<br><br>What would you like to explore?";
        addWaBotMessage(resp, time);
      });
    }, 700);
    return;
  }

  // -------------------------------------------------------------
  // 10. DEFAULT CONTEXTUAL ASSISTANT REPLY
  // -------------------------------------------------------------
  showTyping('MeSage AI');
  scheduleNextForUser(() => {
    fireIndigoBackwardSignal(() => {
      hideTyping();
      const resp = "Thank you for asking! Prime Residency offers world-class luxury residences in Sector 48 with panoramic views and smart home automation.<br><br>You can ask me anything about:<br>• **Configurations:** 2 BHK, 3 BHK, and 4 BHK Penthouses<br>• **Brochure:** Instant PDF download with floor plans<br>• **Pricing &amp; Offers:** Live agent consultation<br>• **Site Visit Booking:** Select your preferred date &amp; time";
      addWaBotMessage(resp, time);
    });
  }, 800);
}

// User submission handler (bound to form onsubmit and Enter key)
function handleUserSubmit() {
  const inputEl = document.getElementById('waUserInput');
  if (!inputEl) return;
  const rawText = inputEl.value.trim();
  if (!rawText) return;

  inputEl.value = '';
  processCustomInquiry(rawText);
}
window.handleUserSubmit = handleUserSubmit;

// ==========================================================================
// AUTONOMOUS SIMULATION (Plays natural dialogue without any clickable buttons!)
// ==========================================================================
function executeStage(stageNumber) {
  currentStage = stageNumber;

  switch (stageNumber) {
    // -------------------------------------------------------------
    // STAGE 1: Buyer Inquires about Apartment Configurations
    // -------------------------------------------------------------
    case 1: {
      addWaUserMessage("Hi, I am looking for a luxury apartment in Prime Residency. What configurations are available?", "14:15");

      fireGreenForwardSignal(() => {
        scheduleNext(() => {
          showTyping('MeSage AI');
          fireIndigoBackwardSignal(() => {
            hideTyping();
            executeStage(2);
          });
        }, 700);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 2: AI answers with BHK configurations (NO BUTTONS!)
    // -------------------------------------------------------------
    case 2: {
      addWaBotMessage(
        "Hello! 👋 Welcome to **Prime Residency Concierge** powered by MeSage AI.<br><br>We offer premium **2 BHK** (850 - 1,150 sq.ft), **3 BHK** (1,450 - 1,850 sq.ft), and **4 BHK Penthouse** (2,400+ sq.ft) residences with contemporary architecture.<br><br>Feel free to ask me anything about configurations, floor plans, location, or pricing!",
        "14:15"
      );

      // Auto-advance naturally (Customer asks about 3 BHK)
      scheduleNext(() => {
        executeStage(3);
      }, 3600);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 3: Customer naturally asks for 3 BHK floor plans & brochure
    // -------------------------------------------------------------
    case 3: {
      addWaUserMessage("Tell me more about the 3 BHK floor plans and brochure.", "14:16");

      fireGreenForwardSignal(() => {
        scheduleNext(() => {
          showTyping('MeSage AI');
          fireIndigoBackwardSignal(() => {
            hideTyping();
            executeStage(4);
          });
        }, 700);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 4: AI sends 3 BHK Specs + PDF Brochure Card
    // -------------------------------------------------------------
    case 4: {
      addWaBotMessage(
        "Our **3 BHK Premium Residences** range from **1,450 to 1,850 sq.ft** with panoramic skyline views, private sundecks, Italian marble flooring, and smart home automation.<br><br>📍 **Location:** Central Business District, Sector 48 (5 mins from Metro &amp; Express Highway).",
        "14:16"
      );

      scheduleNext(() => {
        addWaBrochureMessage(
          "Here is our complete project brochure with 3 BHK floor plans, master layout, and 40+ world-class club amenities:",
          "Prime_Residency_3BHK_Brochure.pdf",
          "4.2 MB • Verified PDF Brochure",
          "Feel free to ask about pricing, payment plans, or booking a private site visit.",
          "14:17"
        );

        // Auto advance to price inquiry
        scheduleNext(() => {
          executeStage(5);
        }, 3800);
      }, 800);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 5: Buyer asks PRICE -> HANDLED BY LIVE AGENT!
    // -------------------------------------------------------------
    case 5: {
      addWaUserMessage("What is the exact price and available payment schemes?", "14:18");

      fireGreenForwardSignal(() => {
        // AGENT COMES IN-BETWEEN!
        scheduleNext(() => {
          executeStage(6);
        }, 900);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 6: Agent steps IN-BETWEEN (Without moving Customer or AI panel!)
    // -------------------------------------------------------------
    case 6: {
      if (colAgentInbetween) colAgentInbetween.classList.add('active-inbetween');
      if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT (ACTIVE)";

      addWaHandoffBanner("🤝 <strong>Senior Property Advisor Sarah Mitchell</strong> joined the chat in-between.");
      if (waStatusText) waStatusText.textContent = "Chatting with Sarah Mitchell (Property Advisor)";

      updateSignalLevel(true);
      scrollCrmCanvas();

      scheduleNext(() => {
        executeStage(7);
      }, 1100);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 7: Sarah Mitchell quotes price via Solid White Ball
    // -------------------------------------------------------------
    case 7: {
      showTyping('Sarah Mitchell');
      fireWhiteBackwardSignal(() => {
        hideTyping();
        addWaAgentMessage(
          "Hello Alex! **Sarah Mitchell** here from the Sales Office. 👋<br><br>Our 3 BHK luxury residences start at **₹2.45 Cr all-inclusive** with an exclusive **10:90 festive payment scheme** and zero pre-EMI until possession.<br><br>Would you like to schedule an exclusive VIP site visit and private model apartment tour?",
          "14:19"
        );

        // Auto-advance naturally (Customer books appointment)
        scheduleNext(() => {
          executeStage(8);
        }, 4000);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 8: Customer wants appointment -> AGENT DROPS OUT, AI TAKES OVER!
    // -------------------------------------------------------------
    case 8: {
      addWaUserMessage("I want to book an appointment for a site visit this Saturday at 11:00 AM.", "14:20");

      // AGENT DROPS OUT SMOOTHLY (Customer & AI panel never move!)
      if (colAgentInbetween) colAgentInbetween.classList.remove('active-inbetween');
      if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT";

      addWaHandoffBanner("⚡ <strong>Sarah Mitchell</strong> completed pricing consultation &amp; stepped out. <strong>Autonomous AI Concierge</strong> takes over to confirm your booking.");
      if (waStatusText) waStatusText.textContent = "online";

      scheduleNext(() => {
        updateSignalLevel(true);
        fireGreenForwardSignal(() => {
          scheduleNext(() => {
            showTyping('MeSage AI');
            fireIndigoBackwardSignal(() => {
              hideTyping();
              executeStage(9);
            });
          }, 700);
        });
      }, 500);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 9: AI Confirms Site Visit Booking! (NO BUTTONS!)
    // -------------------------------------------------------------
    case 9: {
      const activeBadge = document.querySelector('.crm-active-badge');
      if (activeBadge) {
        activeBadge.textContent = "Visit Booked";
        activeBadge.style.background = "rgba(16, 185, 129, 0.2)";
        activeBadge.style.color = "#34d399";
      }

      addWaBotMessage(
        "🎉 **Your VIP Site Visit is Confirmed!**<br><br>🗓️ **Schedule:** This Saturday at 11:00 AM<br>📍 **Location:** Prime Residency Experience Center, Tower A<br>👤 **Host:** Sarah Mitchell will personally welcome you and guide your model apartment tour.<br><br>A location pin, gate pass QR code, and confirmation details have been sent to your WhatsApp. We look forward to hosting you!",
        "14:21"
      );

      // Auto replay after 12s in a continuous loop for visitors watching
      scheduleNext(() => {
        restartSimulation();
      }, 12000);
      break;
    }
  }
}

// Restart Simulation (Continuous loop or 1-click Replay)
function restartSimulation() {
  clearTimeout(actionTimeout);
  isAutoPlaying = true;
  currentStage = 0;

  // Clear chat
  if (waChatStream) waChatStream.innerHTML = '';
  if (crmChatStream) crmChatStream.innerHTML = '';
  hideTyping();

  // Reset WhatsApp Status
  if (waStatusText) waStatusText.textContent = 'online';

  // Reset In-Between Agent slot to standby (Customer & AI positions stay fixed!)
  if (colAgentInbetween) colAgentInbetween.classList.remove('active-inbetween');
  if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT";

  // Reset Signal Orbs
  if (orbGreenForward) orbGreenForward.classList.remove('shooting-right');
  if (orbIndigoBackward) orbIndigoBackward.classList.remove('shooting-left');
  if (orbWhiteBackward) orbWhiteBackward.classList.remove('shooting-left');
  if (connectorTrackHolder) connectorTrackHolder.style.top = '95px';

  // Reset AI Robot Stage
  if (robotFaceCore) robotFaceCore.style.transform = 'scale(1)';

  // Reset CRM status
  const activeBadge = document.querySelector('.crm-active-badge');
  if (activeBadge) {
    activeBadge.textContent = "active";
    activeBadge.style.background = "";
    activeBadge.style.color = "";
  }

  // Clear input
  if (waUserInput) waUserInput.value = '';

  // Start at Stage 1
  scheduleNext(() => {
    executeStage(1);
  }, 500);
}
window.restartSimulation = restartSimulation;

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    executeStage(1);
  }, 600);
});
