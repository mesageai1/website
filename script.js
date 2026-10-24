// ===================== NAVIGATION =====================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

// Current Year in Footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===================== FAQ ACCORDION =====================
window.toggleFAQ = function(btn) {
  const card = btn.closest('.faq-card');
  const wasActive = card.classList.contains('active');
  document.querySelectorAll('.faq-card').forEach(el => el.classList.remove('active'));
  if (!wasActive) {
    card.classList.add('active');
  }
};

// ===================== FLOW STEPS HIGHLIGHT =====================
function highlightStep(stepNum) {
  document.querySelectorAll('.flow-step-card').forEach(s => s.classList.remove('active'));
  const activeEl = document.getElementById('fstep-' + stepNum);
  if (activeEl) activeEl.classList.add('active');
}

// ===================== WHATSAPP BOT SIMULATION =====================
const waMsgs = document.getElementById('waMsgs');
const waTyping = document.getElementById('waTyping');
const waQuickArea = document.getElementById('waQuickArea');
const waChatBg = document.getElementById('waChatBg');

const botFlows = {
  start: {
    msg: "👋 Welcome to *MeSage AI*!\n\nI can help you book appointments, check pricing, or track orders. What would you like to do?",
    replies: [
      { label: "📅 Book an Appointment", next: "book1" },
      { label: "🛍️ Explore Pricing & Plans", next: "plans1" },
      { label: "🎫 Support Request", next: "support1" },
      { label: "📦 Track an Order", next: "order1" }
    ],
    step: 1
  },

  // Appointment Flow
  book1: {
    msg: "I can help you book an appointment in seconds! ⚡\n\nWhat kind of appointment do you need?",
    replies: [
      { label: "🩺 Doctor Consultation", next: "book2" },
      { label: "💼 Business Strategy Call", next: "book2" },
      { label: "💇 Salon & Spa Slot", next: "book2" },
      { label: "🏢 Real Estate Site Visit", next: "book2" }
    ],
    step: 2
  },
  book2: {
    msg: "Which date works best for your schedule?",
    replies: [
      { label: "📆 Today", next: "book3" },
      { label: "📆 Tomorrow", next: "book3" },
      { label: "📆 This Weekend", next: "book3" },
      { label: "📆 Next Week", next: "book3" }
    ],
    step: 2
  },
  book3: {
    msg: "Here are open slots for your selected day:",
    replies: [
      { label: "🕙 10:00 AM", next: "book4" },
      { label: "🕐 1:30 PM", next: "book4" },
      { label: "🕓 4:00 PM", next: "book4" },
      { label: "🕕 6:30 PM", next: "book4" }
    ],
    step: 3
  },
  book4: {
    msg: "Great! Let's lock this in for you:\n\n👤 *Rahul Sharma*\n📱 *+91 98765 43210*\n🕒 *Selected Slot: 4:00 PM*",
    replies: [
      { label: "✅ Confirm & Lock Slot", next: "book5" },
      { label: "✏️ Change Details", next: "book1" }
    ],
    step: 3
  },
  book5: {
    msg: "🎉 *Appointment Confirmed!*\n\n✅ Reserved in Google Calendar\n✅ Synced to CRM\n🔔 WhatsApp reminder scheduled 2h before.\n\nNeed directions or further help?",
    replies: [
      { label: "📍 Send Office Location", next: "book6" },
      { label: "🧑‍💼 Talk to an Agent", next: "agent" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    step: 4
  },
  book6: {
    msg: "📍 Here is our location:\n\n🔗 *maps.google.com/?q=MeSageAI*\n\nWe look forward to seeing you!",
    replies: [
      { label: "🏠 Main Menu", next: "start" }
    ],
    step: 4
  },

  // Plans Flow
  plans1: {
    msg: "MeSage AI brings everything into one clean workspace:\n\n1️⃣ Official WhatsApp Business API\n2️⃣ 24/7 AI Knowledge Base\n3️⃣ Multi-Agent Shared Inbox\n4️⃣ Drag-and-Drop Flow Builder\n5️⃣ High-Speed Smart Broadcasts\n\nWould you like pricing details?",
    replies: [
      { label: "💰 View Pricing Tiers", next: "plans2" },
      { label: "📅 Book a 1-on-1 Demo", next: "book1" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    step: 2
  },
  plans2: {
    msg: "🏷️ *Available Plans:*\n\n🥉 *Starter:* ₹999/mo (1 Channel, 1,000 Contacts)\n🥈 *Growth:* ₹2,499/mo (All Channels, Unlimited Agents)\n🥇 *Enterprise:* Custom Workflows & Dedicated Manager\n\nWould you like our team to get in touch?",
    replies: [
      { label: "📞 Connect with Sales", next: "agent" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    step: 3
  },

  // Support Flow
  support1: {
    msg: "I'm ready to assist! What issue are you experiencing?",
    replies: [
      { label: "🔧 Technical Setup Help", next: "support2" },
      { label: "💳 Billing / Invoicing", next: "support2" },
      { label: "🟢 Meta Green Tick Approval", next: "support2" }
    ],
    step: 2
  },
  support2: {
    msg: "Ticket generated: 🎫 *#MSG-2024-9401*\n\nPriority: High ⚡\nStatus: Assigned to Technical Specialist\n\nEstimated resolution: Under 15 minutes.",
    replies: [
      { label: "🧑‍💼 Speak with Agent Now", next: "agent" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    step: 4
  },

  // Order Flow
  order1: {
    msg: "📦 *Order #ORD-88192 Status:*\n\n✅ Dispatched via BlueDart\n🚚 *Out for delivery today by 5:00 PM*\nDriver: Suresh (+91 98200 XXXXX)",
    replies: [
      { label: "📞 Call Delivery Agent", next: "order2" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    step: 3
  },
  order2: {
    msg: "Connecting you to driver Suresh at +91 98200 XXXXX... 📞",
    replies: [
      { label: "🏠 Main Menu", next: "start" }
    ],
    step: 4
  },

  // Agent Takeover
  agent: {
    msg: "🧑‍💼 *Human Agent Joined!*\n\n_Agent Priya: Hello Rahul! I've taken over this chat. How can I assist you right now?_",
    replies: [
      { label: "💬 Return to AI Bot", next: "start" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    step: 5
  }
};

function scrollChat() {
  if (waChatBg) waChatBg.scrollTop = waChatBg.scrollHeight;
}

function appendMessage(text, sender) {
  const msgEl = document.createElement('div');
  msgEl.className = `wa-msg wa-msg-${sender}`;
  const formatted = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  msgEl.innerHTML = `<div class="wa-bubble-inner">${formatted}</div><div class="wa-tick-${sender}">✓✓</div>`;
  waMsgs.appendChild(msgEl);
  scrollChat();
}

function renderReplies(replyList) {
  if (!waQuickArea) return;
  waQuickArea.innerHTML = '';
  replyList.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'wa-qr-btn';
    btn.textContent = item.label;
    btn.onclick = () => {
      waQuickArea.innerHTML = '';
      appendMessage(item.label, 'user');
      setTimeout(() => executeFlow(item.next), 350);
    };
    waQuickArea.appendChild(btn);
  });
}

function executeFlow(flowKey) {
  const current = botFlows[flowKey];
  if (!current) return;

  highlightStep(current.step || 1);
  if (waTyping) {
    waTyping.style.display = 'flex';
    scrollChat();
  }

  const delay = Math.min(500 + current.msg.length * 6, 1600);

  setTimeout(() => {
    if (waTyping) waTyping.style.display = 'none';
    appendMessage(current.msg, 'bot');
    setTimeout(() => renderReplies(current.replies || []), 300);
  }, delay);
}

window.resetWADemo = function() {
  if (waMsgs) waMsgs.innerHTML = '';
  if (waQuickArea) waQuickArea.innerHTML = '';
  if (waTyping) waTyping.style.display = 'none';
  highlightStep(1);
  setTimeout(() => initDemo(), 200);
};

function initDemo() {
  highlightStep(1);
  if (waTyping) waTyping.style.display = 'flex';
  setTimeout(() => {
    if (waTyping) waTyping.style.display = 'none';
    appendMessage(botFlows.start.msg, 'bot');
    setTimeout(() => renderReplies(botFlows.start.replies), 300);
  }, 750);
}

// Auto-start when in viewport
const demoSec = document.getElementById('demo');
if (demoSec) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initDemo();
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });
  observer.observe(demoSec);
}
