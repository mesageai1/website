// =========================================================
// MeSage AI — Advanced WhatsApp Automation Simulation Engine
// =========================================================

// Elements
const waChatStream = document.getElementById('waChatStream');
const waTypingBubble = document.getElementById('waTypingBubble');
const typingName = document.getElementById('typingName');
const waButtonsTray = document.getElementById('waButtonsTray');
const waCanvas = document.getElementById('waCanvas');
const waStatusText = document.getElementById('waStatusText');

const streamInbound = document.getElementById('streamInbound');
const streamIntent = document.getElementById('streamIntent');
const telemetryConfidence = document.getElementById('telemetryConfidence');
const telemetryLatency = document.getElementById('telemetryLatency');
const aiLatencyBadge = document.getElementById('aiLatencyBadge');
const aiLogStream = document.getElementById('aiLogStream');
const handoffAlert = document.getElementById('handoffAlert');

const agentStatePill = document.getElementById('agentStatePill');
const agentViewerFeed = document.getElementById('agentViewerFeed');
const takeoverPrompt = document.getElementById('takeoverPrompt');
const agentActiveCompose = document.getElementById('agentActiveCompose');

const playIcon = document.getElementById('playIcon');
const playLabel = document.getElementById('playLabel');

// State Machine
let isPlaying = true;
let currentStepIndex = 0;
let simulationTimeout = null;

// Scripted Sequence
const scriptSteps = [
  // 1. User Inbound: Looking for apartment
  {
    type: 'user',
    text: "Hi, I am looking for an apartment in your new project.",
    time: "14:15",
    inboundCode: '"Looking for apartment in project..."',
    intent: "Apartment_Search",
    confidence: "99.4%",
    latency: "1.18s",
    log: "[AI_CORE] Inbound WhatsApp packet received. Intent: Apartment_Search (99.4%). Querying project inventory database...",
    stepNum: 1,
    progress: 20
  },
  // 2. AI Responds: 2, 3, 4 BHK
  {
    type: 'bot',
    text: "Hello! 👋 Welcome to **Skyline Residences** by MeSage Realty. We have premium 2, 3, and 4 BHK luxury residences available. Which configuration would you like to explore?",
    time: "14:15",
    buttons: [
      { label: "2 BHK", val: "2 BHK" },
      { label: "3 BHK (Recommended)", val: "3 BHK" },
      { label: "4 BHK Penthouse", val: "4 BHK" }
    ],
    log: "[AI_CORE] Response dispatched in 1.18s. Rendered interactive configuration buttons.",
    stepNum: 2,
    progress: 35
  },
  // 3. User Selects: 3 BHK
  {
    type: 'user',
    text: "3 BHK",
    time: "14:16",
    inboundCode: '"3 BHK"',
    intent: "Unit_Selection_3BHK",
    confidence: "99.8%",
    latency: "1.12s",
    log: "[AI_CORE] User selected 3 BHK. Fetching unit area (1,450 - 1,850 sq.ft) and master floor plan specs...",
    stepNum: 2,
    progress: 50
  },
  // 4. AI Responds: Details & Asks about brochure/pricing
  {
    type: 'bot',
    text: "Nice choice! Our 3 BHK luxury residences range from **1,450 to 1,850 sq. ft.** of super built-up area with panoramic skyline balconies. What would you like to explore next?",
    time: "14:16",
    buttons: [
      { label: "📄 Project Brochure", val: "Brochure" },
      { label: "📍 Location & Amenities", val: "Location" },
      { label: "💰 Pricing & Payment Plans", val: "Pricing" }
    ],
    log: "[AI_CORE] Response sent in 1.12s. Presenting options: Brochure, Location, Pricing.",
    stepNum: 3,
    progress: 65
  },
  // 5. User selects: Brochure
  {
    type: 'user',
    text: "Brochure",
    time: "14:17",
    inboundCode: '"Brochure"',
    intent: "Brochure_PDF_Download",
    confidence: "99.9%",
    latency: "1.25s",
    log: "[AI_CORE] Asset request: Skyline_Residences_3BHK_Brochure.pdf. Verified CDN link prepared.",
    stepNum: 3,
    progress: 75
  },
  // 6. AI Delivers Brochure
  {
    type: 'bot_brochure',
    text: "Here is our official project brochure with complete floor layouts and architectural specifications:",
    brochureTitle: "Skyline_Residences_3BHK_Brochure.pdf",
    brochureSize: "4.2 MB · Verified PDF Document",
    afterText: "Would you also like to check available pricing and flexible payment plans?",
    buttons: [
      { label: "💰 Yes, tell me the price", val: "Price" },
      { label: "📍 View Location Map", val: "Location" }
    ],
    time: "14:17",
    log: "[AI_CORE] Brochure PDF dispatched. Asking if buyer wants pricing & payment schedules.",
    stepNum: 3,
    progress: 80
  },
  // 7. USER ASKS PRICE (THE TURNING POINT)
  {
    type: 'user',
    text: "I want to know the price as well.",
    time: "14:18",
    inboundCode: '"I want to know the price as well."',
    intent: "High_Intent_Pricing_Negotiation",
    confidence: "99.6%",
    latency: "0.85s",
    log: "[ESCALATION_TRIGGER] Intent: High_Intent_Pricing_Negotiation. Flagged as High-Value Closer Opportunity. Pausing AI automated responses.",
    stepNum: 4,
    progress: 90,
    isEscalation: true
  },
  // 8. Human Agent Takeover Handoff
  {
    type: 'agent_takeover',
    log: "[ROUTING] Live session assigned to Senior Advisor Priya Sharma. Full context and 3 BHK preference loaded into agent workspace.",
    stepNum: 5,
    progress: 95
  },
  // 9. Human Agent sends custom quote & Site Visit invitation
  {
    type: 'agent',
    text: "Hello Rahul! **Priya Sharma** here from the Skyline Advisory Team. 👋\n\nOur 3 BHK luxury residences start at **₹1.85 Cr**, with an exclusive **10:90 festive payment plan** available this month.\n\nWould you prefer a private site walkthrough this **Saturday at 11:00 AM**, or a detailed cost sheet over a call?",
    time: "14:19",
    log: "[AGENT_CONSOLE] Priya Sharma dispatched customized pricing & festive payment plan with VIP site visit offer.",
    stepNum: 5,
    progress: 100
  }
];

function scrollCanvases() {
  if (waCanvas) waCanvas.scrollTop = waCanvas.scrollHeight;
  if (agentViewerFeed) agentViewerFeed.scrollTop = agentViewerFeed.scrollHeight;
  if (aiLogStream) aiLogStream.scrollTop = aiLogStream.scrollHeight;
}

function updateTimeline(stepNum, progressPercent) {
  // Update timeline steps
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById('tstep-' + i);
    if (!el) continue;
    if (i < stepNum) {
      el.className = 'timeline-step completed';
    } else if (i === stepNum) {
      el.className = 'timeline-step active';
    } else {
      el.className = 'timeline-step';
    }
  }

  // Update progress bars
  const fills = [
    { el: document.getElementById('tbar-1'), threshold: 25 },
    { el: document.getElementById('tbar-2'), threshold: 50 },
    { el: document.getElementById('tbar-3'), threshold: 75 },
    { el: document.getElementById('tbar-4'), threshold: 95 }
  ];

  fills.forEach((item, idx) => {
    if (!item.el) return;
    if (progressPercent >= item.threshold) {
      item.el.style.width = '100%';
    } else {
      item.el.style.width = '0%';
    }
  });
}

function addLogEntry(text, type = 'system') {
  if (!aiLogStream) return;
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  div.textContent = `[${time}] ${text}`;
  aiLogStream.appendChild(div);
  scrollCanvases();
}

function renderWhatsAppUserMessage(text, time) {
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

  // Mirror to Agent Viewer
  if (agentViewerFeed) {
    const vRow = document.createElement('div');
    vRow.className = 'viewer-row customer';
    vRow.innerHTML = `
      <div class="vbubble"><strong>Buyer:</strong> ${text}</div>
      <div class="vmeta">${time} · Customer</div>
    `;
    agentViewerFeed.appendChild(vRow);
  }
  scrollCanvases();
}

function renderWhatsAppBotMessage(text, time, buttons = []) {
  const item = document.createElement('div');
  item.className = 'wa-chat-bubble-item bot';
  const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  item.innerHTML = `
    <div class="bubble-text-box">${formatted}</div>
    <div class="bubble-footer">
      <span>${time}</span>
    </div>
  `;
  waChatStream.appendChild(item);

  // Buttons in tray
  if (waButtonsTray) {
    waButtonsTray.innerHTML = '';
    buttons.forEach(btn => {
      const bEl = document.createElement('button');
      bEl.className = 'wa-choice-btn';
      bEl.textContent = btn.label;
      bEl.onclick = () => {
        if (!isPlaying) isPlaying = true;
        // Skip to next step
        proceedNextScriptStep();
      };
      waButtonsTray.appendChild(bEl);
    });
  }

  // Mirror to Agent Viewer
  if (agentViewerFeed) {
    const vRow = document.createElement('div');
    vRow.className = 'viewer-row bot';
    vRow.innerHTML = `
      <div class="vbubble"><strong>✦ MeSage AI:</strong> ${formatted}</div>
      <div class="vmeta">${time} · Auto-Dispatched</div>
    `;
    agentViewerFeed.appendChild(vRow);
  }
  scrollCanvases();
}

function renderWhatsAppBrochureMessage(step) {
  const item = document.createElement('div');
  item.className = 'wa-chat-bubble-item bot';
  item.innerHTML = `
    <div class="bubble-text-box">
      ${step.text}
      <div class="wa-attachment-card">
        <span class="att-icon">📄</span>
        <div class="att-meta">
          <b>${step.brochureTitle}</b>
          <small>${step.brochureSize}</small>
        </div>
      </div>
      <p style="margin: 6px 0 0;">${step.afterText}</p>
    </div>
    <div class="bubble-footer">
      <span>${step.time}</span>
    </div>
  `;
  waChatStream.appendChild(item);

  if (waButtonsTray) {
    waButtonsTray.innerHTML = '';
    (step.buttons || []).forEach(btn => {
      const bEl = document.createElement('button');
      bEl.className = 'wa-choice-btn';
      bEl.textContent = btn.label;
      bEl.onclick = () => proceedNextScriptStep();
      waButtonsTray.appendChild(bEl);
    });
  }

  // Mirror to Agent Viewer
  if (agentViewerFeed) {
    const vRow = document.createElement('div');
    vRow.className = 'viewer-row bot';
    vRow.innerHTML = `
      <div class="vbubble"><strong>✦ MeSage AI:</strong> Sent official 3 BHK PDF brochure.</div>
      <div class="vmeta">${step.time} · Asset Delivered</div>
    `;
    agentViewerFeed.appendChild(vRow);
  }
  scrollCanvases();
}

function renderWhatsAppAgentMessage(text, time) {
  const item = document.createElement('div');
  item.className = 'wa-chat-bubble-item agent';
  const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  item.innerHTML = `
    <div class="bubble-text-box">
      <small style="color: #34d399; font-weight: 800; display: block; margin-bottom: 2px;">🧑‍💼 Priya Sharma (Senior Property Advisor)</small>
      ${formatted}
    </div>
    <div class="bubble-footer">
      <span>${time}</span>
    </div>
  `;
  waChatStream.appendChild(item);

  // Mirror to Agent Viewer
  if (agentViewerFeed) {
    const vRow = document.createElement('div');
    vRow.className = 'viewer-row agent';
    vRow.innerHTML = `
      <div class="vbubble"><strong>Priya Sharma:</strong> Dispatched quote & Saturday site visit invite.</div>
      <div class="vmeta">${time} · Human Agent</div>
    `;
    agentViewerFeed.appendChild(vRow);
  }
  scrollCanvases();
}

function showTyping(who = 'AI Bot') {
  if (waTypingBubble && typingName) {
    typingName.textContent = who;
    waTypingBubble.style.display = 'flex';
    scrollCanvases();
  }
}

function hideTyping() {
  if (waTypingBubble) {
    waTypingBubble.style.display = 'none';
  }
}

function executeSimulationStep(index) {
  if (index >= scriptSteps.length) {
    // Finished simulation loop
    addLogEntry("[STATUS] Complete buyer journey finished. Auto-restarting in 8 seconds...", "system");
    simulationTimeout = setTimeout(() => {
      restartSimulation();
    }, 8000);
    return;
  }

  const step = scriptSteps[index];
  currentStepIndex = index;
  updateTimeline(step.stepNum, step.progress);

  // User Step
  if (step.type === 'user') {
    if (waButtonsTray) waButtonsTray.innerHTML = '';
    renderWhatsAppUserMessage(step.text, step.time);

    // Update Telemetry
    if (streamInbound) streamInbound.textContent = step.inboundCode;
    if (streamIntent) streamIntent.textContent = step.intent;
    if (telemetryConfidence) telemetryConfidence.textContent = step.confidence;
    if (telemetryLatency) telemetryLatency.textContent = step.latency;
    if (aiLatencyBadge) aiLatencyBadge.textContent = step.latency;
    addLogEntry(step.log, 'inbound');

    if (step.isEscalation) {
      // Trigger Handoff Banner in Center & Right
      triggerHumanEscalation();
      return;
    }

    // Next step (Bot typing)
    if (isPlaying) {
      simulationTimeout = setTimeout(() => {
        showTyping('AI Bot');
        simulationTimeout = setTimeout(() => {
          hideTyping();
          proceedNextScriptStep();
        }, 1100);
      }, 700);
    }
  } 
  // Bot Step
  else if (step.type === 'bot') {
    renderWhatsAppBotMessage(step.text, step.time, step.buttons);
    addLogEntry(step.log, 'outbound');

    if (isPlaying) {
      simulationTimeout = setTimeout(() => {
        proceedNextScriptStep();
      }, 3200);
    }
  } 
  // Bot Brochure Step
  else if (step.type === 'bot_brochure') {
    renderWhatsAppBrochureMessage(step);
    addLogEntry(step.log, 'outbound');

    if (isPlaying) {
      simulationTimeout = setTimeout(() => {
        proceedNextScriptStep();
      }, 3400);
    }
  } 
  // Agent Takeover Step
  else if (step.type === 'agent_takeover') {
    executeAgentTakeoverUI(step);
  } 
  // Agent Message Step
  else if (step.type === 'agent') {
    showTyping('Priya Sharma');
    simulationTimeout = setTimeout(() => {
      hideTyping();
      renderWhatsAppAgentMessage(step.text, step.time);
      addLogEntry(step.log, 'alert');
      if (waButtonsTray) {
        waButtonsTray.innerHTML = `
          <button class="wa-choice-btn" onclick="userConfirmsVisit()">✅ Yes, Saturday 11 AM works!</button>
          <button class="wa-choice-btn" onclick="restartSimulation()">↺ Replay Simulation</button>
        `;
      }
      if (isPlaying) {
        simulationTimeout = setTimeout(() => {
          proceedNextScriptStep();
        }, 4000);
      }
    }, 1200);
  }
}

function proceedNextScriptStep() {
  clearTimeout(simulationTimeout);
  executeSimulationStep(currentStepIndex + 1);
}

function triggerHumanEscalation() {
  // 1. Center alert
  if (handoffAlert) handoffAlert.style.display = 'flex';
  addLogEntry("[ALERT] Live Agent Handoff condition met: Price negotiation.", 'alert');

  // 2. Right workspace prompt
  if (agentStatePill) {
    agentStatePill.className = 'agent-state-pill live';
    agentStatePill.textContent = 'Active Takeover';
  }
  if (takeoverPrompt) takeoverPrompt.style.display = 'none';
  if (agentActiveCompose) agentActiveCompose.style.display = 'flex';

  // 3. Left notification banner
  const banner = document.createElement('div');
  banner.className = 'wa-handoff-banner';
  banner.innerHTML = '🧑‍💼 <strong>Senior Advisor Priya Sharma</strong> has joined the conversation.';
  waChatStream.appendChild(banner);
  scrollCanvases();

  // 4. Update WhatsApp status
  if (waStatusText) waStatusText.textContent = 'Chatting with Priya (Senior Advisor)';

  if (isPlaying) {
    simulationTimeout = setTimeout(() => {
      proceedNextScriptStep();
    }, 1800);
  }
}

function executeAgentTakeoverUI(step) {
  addLogEntry(step.log, 'system');
  if (isPlaying) {
    simulationTimeout = setTimeout(() => {
      proceedNextScriptStep();
    }, 1200);
  }
}

// User can manually click "Send Pricing" in right console
window.sendAgentPricingMessage = function() {
  proceedNextScriptStep();
};

window.manualAgentTakeover = function() {
  triggerHumanEscalation();
};

window.userConfirmsVisit = function() {
  renderWhatsAppUserMessage("Yes, Saturday 11 AM works great for me!", "14:20");
  setTimeout(() => {
    renderWhatsAppAgentMessage("Wonderful Rahul! I've reserved our private consultation lounge for you this Saturday at 11:00 AM. I will personally welcome you at the site. Have a great day!", "14:20");
  }, 900);
};

// Play / Pause controls
window.togglePlayPause = function() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    if (playIcon) playIcon.textContent = '⏸';
    if (playLabel) playLabel.textContent = 'Pause Demo';
    proceedNextScriptStep();
  } else {
    if (playIcon) playIcon.textContent = '▶';
    if (playLabel) playLabel.textContent = 'Resume Demo';
    clearTimeout(simulationTimeout);
  }
};

window.restartSimulation = function() {
  clearTimeout(simulationTimeout);
  currentStepIndex = 0;
  isPlaying = true;
  if (playIcon) playIcon.textContent = '⏸';
  if (playLabel) playLabel.textContent = 'Pause Demo';

  if (waChatStream) waChatStream.innerHTML = '';
  if (agentViewerFeed) agentViewerFeed.innerHTML = '';
  if (waButtonsTray) waButtonsTray.innerHTML = '';
  if (handoffAlert) handoffAlert.style.display = 'none';
  if (takeoverPrompt) takeoverPrompt.style.display = 'flex';
  if (agentActiveCompose) agentActiveCompose.style.display = 'none';
  if (agentStatePill) {
    agentStatePill.className = 'agent-state-pill';
    agentStatePill.textContent = 'Monitoring AI';
  }
  if (waStatusText) waStatusText.textContent = 'Official Business Account';

  if (aiLogStream) {
    aiLogStream.innerHTML = '<div class="log-entry system">[SYSTEM] Automation pipeline active and ready.</div>';
  }

  updateTimeline(1, 10);
  executeSimulationStep(0);
};

// Start simulation on load
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    executeSimulationStep(0);
  }, 600);
});
