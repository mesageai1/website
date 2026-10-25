(() => {
// ==========================================================================
// How It Works: Flow Based Bot (Real WhatsApp & Automated Flow Runner)
// Supports BOTH:
//   1. Interactive 3-Button Cards (Max 3 buttons per WhatsApp Cloud API)
//   2. Interactive List Messages (Native List Picker Menu for >3 options)
// ==========================================================================

// Authentic WhatsApp Blue Double Checkmark SVG
const WA_BLUE_TICKS_SVG = `<svg viewBox="0 0 16 11" width="14" height="10" fill="none" class="wa-double-ticks"><path d="M11.04 1.15L5.78 8.08 3.12 5.09.8 7.18 5.78 12.8 13.36 2.87 11.04 1.15z" fill="#53bdeb"/><path d="M14.04 1.15L8.78 8.08 7.9 7.08 7.08 8.08 8.78 10.02 16.36 2.87 14.04 1.15z" fill="#53bdeb"/></svg>`;

// Helper: Get Current Time (e.g. "9:41")
function getCurrentTime() {
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  return `${hrs}:${mins}`;
}

// Conversation flows showing BOTH Interactive Lists (>3 items) and 3-Button Cards (<=3 buttons)
const flows = {
  // --- 1. START: WhatsApp Interactive List Message (4 options > 3 max cards limit) ---
  start: {
    format: "list",
    listTriggerText: "📋 View Services (4 options)",
    listSheetTitle: "Select a Service",
    listSecTitle: "OUR SERVICES",
    botMsg: "👋 Hi! I'm MeSage AI — your smart business assistant.\n\nHow can I help you today?",
    options: [
      { label: "📅 Book an Appointment", desc: "Doctor, meeting, repair & salon booking", next: "book1" },
      { label: "🛍️ Product Enquiry", desc: "Explore software plans, features & pricing", next: "product1" },
      { label: "🎫 Raise a Support Ticket", desc: "Technical support & billing assistance", next: "support1" },
      { label: "📦 Track my Order", desc: "Live dispatch & courier delivery updates", next: "order1" },
    ],
    flowStep: 1
  },

  // --- 2. APPOINTMENT TYPE: WhatsApp 3-Button Card (Max 3 buttons) ---
  book1: {
    format: "buttons",
    userMsg: "📅 Book an Appointment",
    botMsg: "Great! I'll help you book an appointment. 😊\n\nWhat type of appointment would you like?",
    options: [
      { label: "🩺 Doctor Consultation", next: "book2" },
      { label: "💼 Business Meeting", next: "book2" },
      { label: "💇 Salon / Spa", next: "book2" }
    ],
    flowStep: 2
  },

  // --- 3. DATE SELECTION: WhatsApp 3-Button Card (Max 3 buttons) ---
  book2: {
    format: "buttons",
    userMsg: "🩺 Doctor Consultation",
    botMsg: "Perfect! Which date works best for you?",
    options: [
      { label: "📆 Today", next: "book3" },
      { label: "📆 Tomorrow", next: "book3" },
      { label: "📆 This Weekend", next: "book3" }
    ],
    flowStep: 2
  },

  // --- 4. TIME SLOT: WhatsApp Interactive List Message (4 slots > 3 max buttons limit) ---
  book3: {
    format: "list",
    userMsg: "📆 Tomorrow",
    listTriggerText: "⏰ Choose Time Slot (4 available)",
    listSheetTitle: "Available Slots",
    listSecTitle: "TOMORROW'S SLOTS",
    botMsg: "And what time slot would you prefer tomorrow?",
    options: [
      { label: "🕘 9:00 AM", desc: "Morning Slot (Available)", next: "book4" },
      { label: "🕛 12:00 PM", desc: "Noon Slot (Available)", next: "book4" },
      { label: "🕒 3:00 PM", desc: "Afternoon Slot (Recommended)", next: "book4" },
      { label: "🕔 5:00 PM", desc: "Evening Slot (Available)", next: "book4" }
    ],
    flowStep: 3
  },

  // --- 5. CONTACT DETAILS: WhatsApp 2-Button Card ---
  book4: {
    format: "buttons",
    userMsg: "🕒 3:00 PM",
    botMsg: "Almost done! May I know your name for the booking?",
    options: [
      { label: "👤 Rahul Sharma", next: "book5" },
      { label: "✏️ Enter name manually", next: "book5" }
    ],
    flowStep: 3
  },

  // --- 6. CONFIRMATION: WhatsApp 3-Button Action Card (Max 3 buttons) ---
  book5: {
    format: "buttons",
    userMsg: "👤 Rahul Sharma",
    botMsg: "✅ *Appointment Confirmed!*\n\n📅 Date: Tomorrow\n⏰ Time: 3:00 PM\n👤 Name: Rahul Sharma\n🩺 Type: Doctor Consultation\n\nYou will receive a reminder 1 hour before. Thank you! 🎉",
    options: [
      { label: "🔔 Set Reminder", next: "book6" },
      { label: "🧑‍💼 Talk to a Human Agent", next: "human" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 4
  },
  book6: {
    format: "buttons",
    userMsg: "🔔 Set Reminder",
    botMsg: "Done! ✅ Reminder set. Our team will also call you 30 mins before.\n\nNeed anything else?",
    options: [
      { label: "🧑‍💼 Talk to a Human Agent", next: "human" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 4
  },

  // --- PRODUCT ENQUIRY: 3-Button Card ---
  product1: {
    format: "buttons",
    userMsg: "🛍️ Product Enquiry",
    botMsg: "Sure! MeSage AI omnichannel platform offers:\n\n✅ WhatsApp Business Cloud API\n✅ Unified Team Inbox\n✅ AI Chatbot + Flow Builder\n\nWould you like to see pricing?",
    options: [
      { label: "💰 View Pricing", next: "product2" },
      { label: "📅 Book a Demo", next: "book1" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 2
  },
  product2: {
    format: "buttons",
    userMsg: "💰 View Pricing",
    botMsg: "Our plans start from *₹999/month* 🎯\n\n🥉 Starter — ₹999/mo\n🥈 Growth — ₹2,499/mo\n🥇 Enterprise — Custom",
    options: [
      { label: "🧑‍💼 Connect with Sales", next: "human" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 3
  },

  // --- SUPPORT TICKET: 3-Button Card ---
  support1: {
    format: "buttons",
    userMsg: "🎫 Raise a Support Ticket",
    botMsg: "Got it! I've created ticket 🎫 *#MSG-2024-0847*.\n\nOur support team will reply within *2 hours*.\n\nWant to talk to an agent now?",
    options: [
      { label: "🧑‍💼 Yes, talk to agent now", next: "human" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 4
  },

  // --- ORDER TRACKING: 2-Button Card ---
  order1: {
    format: "buttons",
    userMsg: "📦 Track my Order",
    botMsg: "📦 *Order #ORD-98712 Status:*\n\n✅ Packed — Oct 21\n🚚 Out for Delivery — *Today, by 5 PM*\nDelivery Agent: Ravi K. (+91 98765 XXXXX)",
    options: [
      { label: "🧑‍💼 Talk to an Agent", next: "human" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 4
  },

  // --- 7. HUMAN AGENT TAKEOVER ---
  human: {
    format: "none",
    userMsg: "🧑‍💼 Talk to a Human Agent",
    botMsg: "Hi Rahul! I see your doctor appointment is confirmed for tomorrow at 3:00 PM. I'm here in case you have any special requests or need to reschedule! 😊",
    flowStep: 5,
    agentJoined: true
  }
};

// DOM references
let waMsgs = null;
let waTyping = null;
let waChatBg = null;
let waInputField = null;
let waStatusText = null;
let waListSheet = null;
let waListSheetTitle = null;
let waListSecTitle = null;
let waListItemsContainer = null;
let waListBackdrop = null;

// Auto-run state
let autoRunTimer = null;
let autoRunStepIndex = 0;
let isUserManualClick = false;

// Automated Journey Sequence (Shows BOTH Interactive List and 3-Button Cards):
const autoFlowJourney = [
  // Step 1: Start (Interactive List Message -> selects "Book an Appointment")
  { type: "list", targetText: "📅 Book an Appointment", nextKey: "book1", waitMs: 1400 },
  // Step 2: Book1 (3-Button Card -> selects "Doctor Consultation")
  { type: "button", targetText: "🩺 Doctor Consultation", nextKey: "book2", waitMs: 1400 },
  // Step 3: Book2 (3-Button Card -> selects "Tomorrow")
  { type: "button", targetText: "📆 Tomorrow", nextKey: "book3", waitMs: 1400 },
  // Step 4: Book3 (Interactive List Message -> selects "3:00 PM")
  { type: "list", targetText: "🕒 3:00 PM", nextKey: "book4", waitMs: 1400 },
  // Step 5: Book4 (2-Button Card -> selects "Rahul Sharma")
  { type: "button", targetText: "👤 Rahul Sharma", nextKey: "book5", waitMs: 1500 },
  // Step 6: Book5 (3-Button Action Card -> selects "Talk to a Human Agent")
  { type: "button", targetText: "🧑‍💼 Talk to a Human Agent", nextKey: "human", waitMs: 1700 }
];

function initDOM() {
  waMsgs = document.getElementById('waMsgs');
  waTyping = document.getElementById('waTyping');
  waChatBg = document.getElementById('waChatBg');
  waInputField = document.getElementById('waInputField');
  waStatusText = document.getElementById('waStatusText');
  waListSheet = document.getElementById('waListSheet');
  waListSheetTitle = document.getElementById('waListSheetTitle');
  waListSecTitle = document.getElementById('waListSecTitle');
  waListItemsContainer = document.getElementById('waListItemsContainer');
  waListBackdrop = document.getElementById('waListBackdrop');
}

function scrollWA() {
  if (waChatBg) {
    waChatBg.scrollTop = waChatBg.scrollHeight;
  }
}

// Close the WhatsApp List Sheet Drawer
function closeWaListSheet() {
  if (!waListSheet) initDOM();
  if (waListSheet) {
    waListSheet.style.display = 'none';
  }
  if (waListBackdrop) {
    waListBackdrop.style.display = 'none';
  }
}
window.closeWaListSheet = closeWaListSheet;

// Open the WhatsApp List Sheet Drawer
function openWaListSheet(flow) {
  if (!waListSheet) initDOM();
  if (!waListSheet || !flow || !flow.options) return;

  if (waListSheetTitle) waListSheetTitle.textContent = flow.listSheetTitle || "Select an Option";
  if (waListSecTitle) waListSecTitle.textContent = flow.listSecTitle || "OPTIONS";

  if (waListItemsContainer) {
    waListItemsContainer.innerHTML = '';
    flow.options.forEach((opt) => {
      const item = document.createElement('div');
      item.className = 'wa-list-item';
      item.dataset.label = opt.label;
      item.dataset.next = opt.next;
      item.innerHTML = `
        <div class="wa-list-item-content">
          <div class="wa-list-item-title">${opt.label}</div>
          ${opt.desc ? `<div class="wa-list-item-desc">${opt.desc}</div>` : ''}
        </div>
        <div class="wa-list-item-radio"></div>
      `;
      item.onclick = () => {
        if (autoRunTimer) clearTimeout(autoRunTimer);
        isUserManualClick = true;
        closeWaListSheet();
        handleWAChoice(opt.label, opt.next);
      };
      waListItemsContainer.appendChild(item);
    });
  }

  if (waListBackdrop) {
    waListBackdrop.style.display = 'block';
  }
  waListSheet.style.display = 'flex';
  scrollWA();
}
window.openWaListSheet = openWaListSheet;

// Add message with authentic WhatsApp styling
function addWAMsg(text, type, flowOptions = null, flow = null) {
  if (!waMsgs) initDOM();
  if (!waMsgs) return;

  const row = document.createElement('div');
  row.className = `wa-msg-row ${type === 'user' ? 'wa-customer' : 'wa-bot'}`;

  const time = getCurrentTime();
  const ticks = type === 'user' ? WA_BLUE_TICKS_SVG : '';
  const lines = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');

  let interactiveContent = '';

  // 1. FORMAT: 3-Button Card attached to bubble (Max 3 buttons per WhatsApp Cloud API)
  if (type === 'bot' && flow && flow.format === 'buttons' && flow.options && flow.options.length) {
    const buttonsHtml = flow.options.slice(0, 3).map((opt) => {
      return `<button type="button" class="wa-card-btn" data-label="${opt.label}" data-next="${opt.next}">
        ${opt.label}
      </button>`;
    }).join('');

    interactiveContent = `<div class="wa-attached-buttons">${buttonsHtml}</div>`;
  }

  // 2. FORMAT: Interactive List Message Trigger attached to bubble (>3 options)
  else if (type === 'bot' && flow && flow.format === 'list' && flow.options && flow.options.length) {
    interactiveContent = `
      <div class="wa-list-trigger-bar" id="currentListTrigger" title="Click to view full list">
        <div class="wa-list-trigger-left">
          <span class="wa-list-trigger-icon">☰</span>
          <span>${flow.listTriggerText || 'View Options'}</span>
        </div>
        <span class="wa-list-trigger-arrow">▾</span>
      </div>
    `;
  }

  row.innerHTML = `
    <div class="wa-bubble ${type === 'user' ? 'customer-bubble' : 'bot-bubble'}">
      <div class="wa-bubble-text">${lines}</div>
      <div class="wa-meta-time">
        <span>${time}</span>
        ${ticks}
      </div>
      ${interactiveContent}
    </div>
  `;

  waMsgs.appendChild(row);

  // Bind click handlers for attached 3-button cards
  if (type === 'bot' && flow && flow.format === 'buttons') {
    const btns = row.querySelectorAll('.wa-card-btn');
    btns.forEach(b => {
      b.onclick = () => {
        if (autoRunTimer) clearTimeout(autoRunTimer);
        isUserManualClick = true;
        handleWAChoice(b.dataset.label, b.dataset.next);
      };
    });
  }

  // Bind click handler for interactive list trigger bar
  if (type === 'bot' && flow && flow.format === 'list') {
    const trigger = row.querySelector('#currentListTrigger');
    if (trigger) {
      trigger.onclick = () => {
        openWaListSheet(flow);
      };
    }
  }

  scrollWA();
}

// Typing indicator state
function showTyping() {
  if (!waTyping) initDOM();
  if (waTyping) waTyping.style.display = 'flex';
  if (waStatusText) waStatusText.textContent = 'typing...';
  scrollWA();
}

function hideTyping() {
  if (waTyping) waTyping.style.display = 'none';
  if (waStatusText) waStatusText.textContent = 'online';
}

// Schedule automatic clicking (auto-runs both list items & button cards)
function scheduleNextAutoClick(currentFlow) {
  if (autoRunTimer) clearTimeout(autoRunTimer);

  if (autoRunStepIndex >= autoFlowJourney.length) {
    // Entire 5-step journey complete! Wait 5.5s then restart simulation
    autoRunTimer = setTimeout(() => {
      if (!isUserManualClick) {
        resetWADemo();
      }
    }, 5500);
    return;
  }

  const step = autoFlowJourney[autoRunStepIndex];

  autoRunTimer = setTimeout(() => {
    // 1. AUTO-RUN INTERACTIVE LIST MESSAGE (>3 items): Open list sheet & select item
    if (step.type === 'list') {
      openWaListSheet(currentFlow);

      setTimeout(() => {
        if (!waListItemsContainer) return;
        const items = waListItemsContainer.querySelectorAll('.wa-list-item');
        let targetItem = null;
        items.forEach(it => {
          if (it.dataset.label === step.targetText || it.textContent.includes(step.targetText.replace(/[^\w\s]/g, '').trim())) {
            targetItem = it;
          }
        });

        if (!targetItem && items.length) targetItem = items[0];

        if (targetItem) {
          targetItem.classList.add('auto-clicking');
          setTimeout(() => {
            closeWaListSheet();
            autoRunStepIndex++;
            handleWAChoice(step.targetText, step.nextKey);
          }, 320);
        }
      }, 700);
    }

    // 2. AUTO-RUN 3-BUTTON CARD (<=3 cards): Highlight button & click
    else if (step.type === 'button') {
      const cardBtns = document.querySelectorAll('.wa-card-btn');
      let targetBtn = null;
      cardBtns.forEach(btn => {
        if (btn.dataset.label === step.targetText || btn.textContent.trim().includes(step.targetText.replace(/[^\w\s]/g, '').trim())) {
          targetBtn = btn;
        }
      });

      if (!targetBtn && cardBtns.length) targetBtn = cardBtns[cardBtns.length - 1];

      if (targetBtn) {
        targetBtn.classList.add('auto-clicking');
        setTimeout(() => {
          autoRunStepIndex++;
          handleWAChoice(step.targetText, step.nextKey);
        }, 240);
      }
    }
  }, step.waitMs);
}

// Handle selection
function handleWAChoice(label, nextKey) {
  closeWaListSheet();
  addWAMsg(label, 'user');
  setTimeout(() => runWAFlow(nextKey), 250);
}

// Highlight left flow steps (fs1 to fs5)
function highlightFlowStep(n) {
  document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('fs' + n);
  if (el) el.classList.add('active');
}

// Execute flow
function runWAFlow(key) {
  const flow = flows[key];
  if (!flow) return;

  highlightFlowStep(flow.flowStep || 1);
  showTyping();

  const delay = Math.min(500 + (flow.botMsg ? flow.botMsg.length * 5 : 250), 1200);

  setTimeout(() => {
    hideTyping();

    if (flow.agentJoined) {
      // Direct agent takeover: Do not inform customer that agent has joined
      addWAMsg(flow.botMsg, 'bot');
      if (!isUserManualClick) {
        scheduleNextAutoClick(flow);
      }
    } else {
      // Add Bot Message with its attached 3-Button Card or Interactive List Message
      addWAMsg(flow.botMsg, 'bot', flow.options, flow);

      // If in automated mode, trigger the next auto-click!
      if (!isUserManualClick) {
        scheduleNextAutoClick(flow);
      }
    }
  }, delay);
}

// User text input submit handler
function handleWAInputSubmit(e) {
  if (e) e.preventDefault();
  if (autoRunTimer) clearTimeout(autoRunTimer);
  isUserManualClick = true;
  closeWaListSheet();

  if (!waInputField) initDOM();
  if (!waInputField) return;
  const text = waInputField.value.trim();
  if (!text) return;

  waInputField.value = '';
  addWAMsg(text, 'user');

  const lower = text.toLowerCase();
  showTyping();

  setTimeout(() => {
    hideTyping();
    if (lower.includes('book') || lower.includes('appoint') || lower.includes('doctor') || lower.includes('salon')) {
      runWAFlow('book1');
    } else if (lower.includes('price') || lower.includes('plan') || lower.includes('cost') || lower.includes('product')) {
      runWAFlow('product1');
    } else if (lower.includes('support') || lower.includes('help') || lower.includes('issue') || lower.includes('ticket')) {
      runWAFlow('support1');
    } else if (lower.includes('order') || lower.includes('track') || lower.includes('delivery')) {
      runWAFlow('order1');
    } else if (lower.includes('agent') || lower.includes('human') || lower.includes('talk') || lower.includes('call')) {
      runWAFlow('human');
    } else {
      addWAMsg("Got it! Here are quick services available right now:", 'bot', flows.start.options, flows.start);
      highlightFlowStep(1);
    }
  }, 650);
}

// Reset simulation & restart auto-run loop
function resetWADemo() {
  if (autoRunTimer) clearTimeout(autoRunTimer);
  closeWaListSheet();
  initDOM();
  if (waMsgs) waMsgs.innerHTML = '';
  hideTyping();
  document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active'));

  autoRunStepIndex = 0;
  isUserManualClick = false;

  setTimeout(() => initWADemo(), 180);
}

// Initialize simulation
function initWADemo() {
  initDOM();
  highlightFlowStep(1);
  showTyping();

  setTimeout(() => {
    hideTyping();
    // Start greeting showing WhatsApp Interactive List Message (4 options > 3 max cards limit)
    addWAMsg(flows.start.botMsg, 'bot', flows.start.options, flows.start);

    // Auto-run start
    if (!isUserManualClick) {
      scheduleNextAutoClick(flows.start);
    }
  }, 750);
}

// Expose globally
window.resetWADemo = resetWADemo;
window.handleWAInputSubmit = handleWAInputSubmit;

// Auto-start on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWADemo);
} else {
  initWADemo();
}

})();
