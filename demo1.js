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

  let isDone = false;
  const finishFlight = () => {
    if (isDone) return;
    isDone = true;
    planeEl.style.opacity = '0';
    if (typeof onComplete === 'function') {
      const cb = onComplete;
      onComplete = null;
      cb();
    }
  };

  animation.onfinish = finishFlight;
  // Fallback timer to guarantee single execution even in background/headless tabs
  setTimeout(finishFlight, duration + 50);
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

// Typing Indicator (Clean WhatsApp business typing status)
function showTyping(senderName) {
  if (typingSender) typingSender.textContent = 'MeSage Concierge';
  if (waTypingBox) waTypingBox.style.display = 'block';
  scrollWaCanvas();
}

function hideTyping() {
  if (waTypingBox) waTypingBox.style.display = 'none';
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

let lastBotMessageText = '';
let lastBotMessageTime = 0;

function addWaBotMessage(text, time = '14:15') {
  if (!waChatStream) return;
  const now = Date.now();
  if (text === lastBotMessageText && (now - lastBotMessageTime < 1500)) {
    console.warn('Prevented duplicate bot message');
    return;
  }
  lastBotMessageText = text;
  lastBotMessageTime = now;

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

function addWaBrochureMessage(text, fileTitle, fileSize, promptText = '', time = '14:17') {
  if (!waChatStream) return;
  const item = document.createElement('div');
  item.className = 'wa-msg-row wa-bot';
  const promptHtml = promptText ? `<div class="wa-bubble-content" style="margin-top:6px; font-size:11px">${formatMarkdown(promptText)}</div>` : '';
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

      ${promptHtml}

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
  addCrmAgentMessage(text, time);
  scrollWaCanvas();
}

function addWaHandoffBanner(html) {
  // Completely disabled: no agent joined banner or tag anywhere in WhatsApp
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

  // 2. Fire Green Forward Paper Plane to AI / Agent
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
  // 1. INTENT: PRICE / COST / QUOTE (Human Agent Thing 1)
  // -------------------------------------------------------------
  if (/(price|cost|how much|rate|quote|pricing|budget|cr|lakh|inr|₹)/i.test(text)) {
    if (colAgentInbetween) colAgentInbetween.classList.add('active-inbetween');
    if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT (ACTIVE)";

    scrollCrmCanvas();

    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireWhiteBackwardSignal(() => {
        hideTyping();
        const priceMsg = "Our 3 BHK starts at **₹2.45 Cr** for the 1,650 sq.ft layout.<br><br>We also have flexible payment options if you'd like to check them out.";
        addWaAgentMessage(priceMsg, time);
      });
    }, 1000);
    return;
  }

  // -------------------------------------------------------------
  // 2. INTENT: PAYMENT PLANS / SCHEMES / EMI (Human Agent Thing 2)
  // -------------------------------------------------------------
  if (/(payment|scheme|plan|subvention|emi|downpayment|financing|10:90|discount|offer|deal)/i.test(text)) {
    if (colAgentInbetween) colAgentInbetween.classList.add('active-inbetween');
    if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT (ACTIVE)";

    scrollCrmCanvas();

    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireWhiteBackwardSignal(() => {
        hideTyping();
        const planMsg = "We have a 10:90 plan right now—you pay 10% on booking and the rest upon possession.<br><br>Would you like to come by and see the sample flat this weekend?";
        addWaAgentMessage(planMsg, time);
      });
    }, 1000);
    return;
  }

  // -------------------------------------------------------------
  // 3. INTENT: APPOINTMENT / SITE VISIT / BOOKING -> RESTART WITH AI REPLIES!
  // -------------------------------------------------------------
  if (/(book|appointment|visit|tour|schedule|slot|time|date|tomorrow|saturday|sunday|weekend|monday|tuesday|wednesday|thursday|friday|come|coming)/i.test(text)) {
    // If agent was active, agent steps out gracefully, AI confirms!
    if (colAgentInbetween && colAgentInbetween.classList.contains('active-inbetween')) {
      colAgentInbetween.classList.remove('active-inbetween');
      if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT";
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
        const confirmMsg = `You're all set for ${schedule}! 👍<br><br>We'll have someone meet you at the Tower A reception to show you around. Looking forward to seeing you!`;
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
  // 4. INTENT: BROCHURE / FLOOR PLANS / CATALOG / PDF / LAYOUT
  // -------------------------------------------------------------
  if (/(brochure|floor\s*plan|plan|pdf|catalog|layout|master\s*plan|document)/i.test(text)) {
    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireIndigoBackwardSignal(() => {
        hideTyping();
        addWaBrochureMessage(
          "Here is our brochure with floor plans and specifications:",
          "Prime_Residency_Brochure.pdf",
          "4.2 MB • PDF Brochure",
          "",
          time
        );
      });
    }, 800);
    return;
  }

  // -------------------------------------------------------------
  // 5. INTENT: CONFIGURATIONS / 2 BHK / 3 BHK / 4 BHK / PENTHOUSE
  // -------------------------------------------------------------
  if (/(2\s*bhk|3\s*bhk|4\s*bhk|penthouse|bhk|bedroom|sqft|sq\.ft|size|area|config)/i.test(text)) {
    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireIndigoBackwardSignal(() => {
        hideTyping();
        let resp = "";
        if (/2\s*bhk/i.test(text)) {
          resp = "Our 2 BHK units range from 850 to 1,150 sq.ft, starting around **₹1.65 Cr**.<br><br>Would you like to see the floor plan or visit the site?";
        } else if (/4\s*bhk|penthouse/i.test(text)) {
          resp = "Our 4 BHK penthouses are 2,400+ sq.ft with private terrace space, starting at **₹3.85 Cr**.<br><br>Would you like to see the layout or arrange a visit?";
        } else {
          resp = "Our 3 BHK homes are 1,450 to 1,850 sq.ft with spacious balconies, starting at **₹2.45 Cr**.<br><br>Would you like the brochure or visit details?";
        }
        addWaBotMessage(resp, time);
      });
    }, 800);
    return;
  }

  // -------------------------------------------------------------
  // 6. INTENT: LOCATION / WHERE / SECTOR / METRO / HIGHWAY
  // -------------------------------------------------------------
  if (/(where|location|address|sector|metro|highway|airport|distance|situated|map)/i.test(text)) {
    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireIndigoBackwardSignal(() => {
        hideTyping();
        const resp = "We're located in **Sector 48**, just 5 minutes from the Sector 48 Metro Station and 2 minutes from the Express Highway.<br><br>Would you like directions or to schedule a visit?";
        addWaBotMessage(resp, time);
      });
    }, 800);
    return;
  }

  // -------------------------------------------------------------
  // 7. INTENT: AMENITIES / CLUBHOUSE / POOL / GYM / SECURITY
  // -------------------------------------------------------------
  if (/(amenit|facilit|pool|gym|club|garden|security|park|sports|tennis|squash)/i.test(text)) {
    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireIndigoBackwardSignal(() => {
        hideTyping();
        const resp = "We have a clubhouse, rooftop pool, gym, tennis court, and landscaped parks across the property.<br><br>Would you like to see the brochure with pictures or come take a look in person?";
        addWaBotMessage(resp, time);
      });
    }, 800);
    return;
  }

  // -------------------------------------------------------------
  // 8. INTENT: TALK TO HUMAN / AGENT / CALL
  // -------------------------------------------------------------
  if (/(agent|human|person|call|phone|talk|representative|sales\s*rep)/i.test(text)) {
    if (colAgentInbetween) colAgentInbetween.classList.add('active-inbetween');
    if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT (ACTIVE)";

    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireWhiteBackwardSignal(() => {
        hideTyping();
        addWaAgentMessage("Our team is right here. We can help with pricing, floor plans, or site visits. What can we help you with?", time);
      });
    }, 900);
    return;
  }

  // -------------------------------------------------------------
  // 9. INTENT: REPLAY / RESET / RESTART
  // -------------------------------------------------------------
  if (/(replay|reset|restart|start\s*over)/i.test(text)) {
    restartSimulation();
    return;
  }

  // -------------------------------------------------------------
  // 10. INTENT: GREETINGS / HELLO / HI
  // -------------------------------------------------------------
  if (/(hi|hello|hey|good\s*(morning|afternoon|evening))/i.test(text)) {
    showTyping('MeSage AI');
    scheduleNextForUser(() => {
      fireIndigoBackwardSignal(() => {
        hideTyping();
        const resp = "Hi there! How can I help you today? Feel free to ask about our 2 &amp; 3 BHK layouts, pricing, or scheduling a visit.";
        addWaBotMessage(resp, time);
      });
    }, 700);
    return;
  }

  // -------------------------------------------------------------
  // 11. DEFAULT CONTEXTUAL ASSISTANT REPLY
  // -------------------------------------------------------------
  showTyping('MeSage AI');
  scheduleNextForUser(() => {
    fireIndigoBackwardSignal(() => {
      hideTyping();
      const resp = "We offer 2 BHK, 3 BHK, and 4 BHK homes at Prime Residency.<br><br>Let me know if you'd like to check floor plans, pricing, or come visit the sample flat!";
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
let lastStage = -1;
let lastStageTime = 0;

function executeStage(stageNumber) {
  const now = Date.now();
  if (stageNumber === lastStage && (now - lastStageTime < 1000)) {
    console.warn(`Prevented duplicate execution of stage ${stageNumber}`);
    return;
  }
  lastStage = stageNumber;
  lastStageTime = now;
  currentStage = stageNumber;

  switch (stageNumber) {
    // -------------------------------------------------------------
    // STAGE 1: Buyer Inquires about Available Configurations
    // -------------------------------------------------------------
    case 1: {
      addWaUserMessage("Hi, what configurations do you have available at Prime Residency?", "14:15");

      // Green Paper Plane flies from WhatsApp Phone all the way to AI Bot!
      fireGreenForwardSignal(colAiBot, () => {
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
    // STAGE 2: AI answers naturally (Short, warm, human)
    // -------------------------------------------------------------
    case 2: {
      addWaBotMessage(
        "Hi there! We have 2 BHK, 3 BHK, and 4 BHK penthouses available.<br><br>Are you looking for a specific size or layout?",
        "14:15"
      );

      // Auto-advance naturally (Customer asks about 3 BHK)
      scheduleNext(() => {
        executeStage(3);
      }, 3400);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 3: Customer naturally asks for 3 BHK floor plans & brochure
    // -------------------------------------------------------------
    case 3: {
      addWaUserMessage("I'm looking for a 3 BHK. Could you share the floor plan and brochure?", "14:16");

      // Green Paper Plane flies from WhatsApp Phone all the way to AI Bot!
      fireGreenForwardSignal(colAiBot, () => {
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
    // STAGE 4: AI sends 3 BHK Specs + PDF Brochure Card (Clean, human)
    // -------------------------------------------------------------
    case 4: {
      addWaBrochureMessage(
        "Here is our 3 BHK brochure with detailed floor plans (1,450 – 1,850 sq.ft):",
        "Prime_Residency_3BHK_Brochure.pdf",
        "4.2 MB • PDF Brochure",
        "",
        "14:16"
      );

      // Auto advance to Thing 1: Price inquiry
      scheduleNext(() => {
        executeStage(5);
      }, 3800);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 5: HUMAN AGENT THING 1 — Buyer asks PRICE
    // -------------------------------------------------------------
    case 5: {
      addWaUserMessage("What is the starting price for a 3 BHK?", "14:18");

      // Green Paper Plane flies to Agent panel
      fireGreenForwardSignal(colAgentInbetween, () => {
        scheduleNext(() => {
          executeStage(6);
        }, 800);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 6: Agent steps IN-BETWEEN (Without moving Customer or AI panel!)
    // -------------------------------------------------------------
    case 6: {
      if (colAgentInbetween) colAgentInbetween.classList.add('active-inbetween');
      if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT (ACTIVE)";
      scrollCrmCanvas();

      scheduleNext(() => {
        executeStage(7);
      }, 900);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 7: Live Agent Handles THING 1 (Exact Price Quote)
    // -------------------------------------------------------------
    case 7: {
      showTyping('MeSage AI');
      // White Paper Plane flies from Agent to WhatsApp Customer
      fireWhiteBackwardSignal(() => {
        hideTyping();
        addWaAgentMessage(
          "Our 3 BHK starts at **₹2.45 Cr** for the 1,650 sq.ft layout.<br><br>We also have flexible payment options if you'd like to check them out.",
          "14:19"
        );

        // Auto-advance to THING 2: Payment Plans inquiry
        scheduleNext(() => {
          executeStage(8);
        }, 3800);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 8: HUMAN AGENT THING 2 — Customer asks PAYMENT PLANS
    // -------------------------------------------------------------
    case 8: {
      addWaUserMessage("Yes, what payment plans do you have?", "14:20");

      // Green Paper Plane flies to Agent panel
      fireGreenForwardSignal(colAgentInbetween, () => {
        scheduleNext(() => {
          executeStage(9);
        }, 700);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 9: Live Agent Handles THING 2 (Payment Plans)
    // -------------------------------------------------------------
    case 9: {
      showTyping('MeSage AI');
      // White Paper Plane flies from Agent to WhatsApp Customer
      fireWhiteBackwardSignal(() => {
        hideTyping();
        addWaAgentMessage(
          "We have a 10:90 plan right now—you pay 10% on booking and the rest upon possession.<br><br>Would you like to come by and see the sample flat this weekend?",
          "14:20"
        );

        // Auto-advance to AI RESTART: Customer books visit
        scheduleNext(() => {
          executeStage(10);
        }, 4000);
      });
      break;
    }

    // -------------------------------------------------------------
    // STAGE 10: RESTART WITH AI REPLIES — Customer books visit
    // Agent steps out gracefully; AI Concierge takes over!
    // -------------------------------------------------------------
    case 10: {
      addWaUserMessage("Sounds great! Can I visit this Saturday around 11 AM?", "14:21");

      // AGENT STEPS OUT SMOOTHLY (Panel space returns to blank, 0px shift!)
      if (colAgentInbetween) colAgentInbetween.classList.remove('active-inbetween');
      if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT";

      scheduleNext(() => {
        // Green Paper Plane flies from Customer all the way across to AI Bot!
        fireGreenForwardSignal(colAiBot, () => {
          scheduleNext(() => {
            showTyping('MeSage AI');
            // Indigo Paper Plane flies all the way across from AI Bot to Customer!
            fireIndigoBackwardSignal(() => {
              hideTyping();
              executeStage(11);
            });
          }, 700);
        });
      }, 500);
      break;
    }

    // -------------------------------------------------------------
    // STAGE 11: Autonomous AI Confirms Visit Booking (Simple & Human)
    // -------------------------------------------------------------
    case 11: {
      const activeBadge = document.querySelector('.crm-active-badge');
      if (activeBadge) {
        activeBadge.textContent = "Visit Booked";
        activeBadge.style.background = "rgba(16, 185, 129, 0.2)";
        activeBadge.style.color = "#34d399";
      }

      addWaBotMessage(
        "You're all set for Saturday at 11:00 AM! 👍<br><br>We'll have someone meet you at the Tower A reception to show you around. Looking forward to seeing you!",
        "14:21"
      );

      // Auto replay after 14s in a continuous loop for visitors watching
      scheduleNext(() => {
        restartSimulation();
      }, 14000);
      break;
    }
  }
}

// Restart Simulation (Continuous loop or 1-click Replay)
function restartSimulation() {
  clearTimeout(actionTimeout);
  isAutoPlaying = true;
  currentStage = 0;
  lastStage = -1;
  lastBotMessageText = '';

  // Clear chat
  if (waChatStream) waChatStream.innerHTML = '';
  if (crmChatStream) crmChatStream.innerHTML = '';
  hideTyping();

  // Reset WhatsApp Status
  if (waStatusText) waStatusText.textContent = 'online';

  // Reset In-Between Agent slot to standby (Customer & AI positions stay fixed!)
  if (colAgentInbetween) colAgentInbetween.classList.remove('active-inbetween');
  if (agentPanelTitle) agentPanelTitle.textContent = "LIVE AGENT";

  // Reset Paper Planes
  [planeGreen, planeIndigo, planeWhite].forEach(plane => {
    if (plane) {
      if (plane.getAnimations) {
        plane.getAnimations().forEach(anim => anim.cancel());
      }
      plane.style.opacity = '0';
    }
  });

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
window.resetDemoStages = restartSimulation;

// Initialize on page load (guaranteed single execution)
let isDemoInitialized = false;
function initDemo() {
  if (isDemoInitialized) return;
  isDemoInitialized = true;
  setTimeout(() => {
    executeStage(1);
  }, 600);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDemo);
} else {
  initDemo();
}
