// ===================== NAVIGATION =====================
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? '✕' : '☰';
  });
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}

// Current Year
document.getElementById('year').textContent = new Date().getFullYear();

// ===================== SHOWCASE TABS (Botflo style) =====================
window.switchShowcaseTab = function(index) {
  // Update buttons
  document.querySelectorAll('.showcase-tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
  // Update panels
  document.querySelectorAll('.showcase-panel').forEach((panel, i) => {
    panel.classList.toggle('active', i === index);
  });
};

// ===================== FAQ ACCORDION =====================
window.toggleFAQ = function(btn) {
  const item = btn.closest('.faq-item');
  const wasActive = item.classList.contains('active');
  // Close all
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
  // Toggle clicked
  if (!wasActive) {
    item.classList.add('active');
  }
};

// ===================== ANIMATIONS & USE CASES =====================
const ucTags = document.querySelectorAll('.uc-tag');
let ucIndex = 0;
function cycleUC() {
  ucTags.forEach(t => t.classList.remove('active-uc'));
  if (ucTags[ucIndex]) ucTags[ucIndex].classList.add('active-uc');
  ucIndex = (ucIndex + 1) % ucTags.length;
}
if (ucTags.length) setInterval(cycleUC, 2400);

function highlightFlowStep(n) {
  document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('fs' + n);
  if (el) el.classList.add('active');
}

// ===================== WHATSAPP LIVE DEMO =====================
const waMsgs = document.getElementById('waMsgs');
const waTyping = document.getElementById('waTyping');
const waQuickArea = document.getElementById('waQuickArea');
const waChatBg = document.getElementById('waChatBg');

const flows = {
  start: {
    botMsg: "👋 Welcome to *MeSage AI*!\n\nI can help you with appointments, product queries, support, or order tracking. How can I help you today?",
    quickReplies: [
      { label: "📅 Book Appointment", next: "book1" },
      { label: "🛍️ View Products & Plans", next: "product1" },
      { label: "🎫 Raise Support Ticket", next: "support1" },
      { label: "📦 Track Order", next: "order1" }
    ],
    flowStep: 1
  },

  // Appointment Flow
  book1: {
    userMsg: "📅 Book Appointment",
    botMsg: "Great! Let's book your slot in 30 seconds. ⚡\n\nWhat type of appointment do you need?",
    quickReplies: [
      { label: "🩺 Doctor Consultation", next: "book2" },
      { label: "💼 Business Strategy Call", next: "book2" },
      { label: "💇 Salon & Spa Service", next: "book2" },
      { label: "🏢 Real Estate Site Visit", next: "book2" }
    ],
    flowStep: 2
  },
  book2: {
    botMsg: "Awesome! Which day works best for you?",
    quickReplies: [
      { label: "📆 Today", next: "book3" },
      { label: "📆 Tomorrow", next: "book3" },
      { label: "📆 This Saturday", next: "book3" },
      { label: "📆 Next Monday", next: "book3" }
    ],
    flowStep: 2
  },
  book3: {
    botMsg: "Please select an available time slot:",
    quickReplies: [
      { label: "🕘 10:00 AM", next: "book4" },
      { label: "🕐 1:00 PM", next: "book4" },
      { label: "🕒 3:30 PM", next: "book4" },
      { label: "🕕 6:00 PM", next: "book4" }
    ],
    flowStep: 3
  },
  book4: {
    botMsg: "Almost done! Please confirm your booking details:\n\n👤 *Rahul Sharma*\n📱 *+91 98765 43210*\n🕒 *Tomorrow at 3:30 PM*",
    quickReplies: [
      { label: "✅ Confirm & Lock Slot", next: "book5" },
      { label: "✏️ Change Details", next: "book1" }
    ],
    flowStep: 3
  },
  book5: {
    botMsg: "🎉 *Appointment Confirmed!*\n\n✅ Added to Google Calendar\n✅ Synced with CRM\n🔔 Automated reminder scheduled 2 hours before.\n\nNeed directions or have any questions?",
    quickReplies: [
      { label: "📍 Send Location", next: "book6" },
      { label: "🧑‍💼 Talk to an Agent", next: "human" },
      { label: "🏠 Back to Menu", next: "start" }
    ],
    flowStep: 4
  },
  book6: {
    botMsg: "📍 Here is our office location on Google Maps:\n\n🔗 *maps.google.com/?q=MeSageAI*\n\nLooking forward to seeing you! 😊",
    quickReplies: [
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 4
  },

  // Products
  product1: {
    userMsg: "🛍️ View Products & Plans",
    botMsg: "MeSage AI brings everything you need to scale conversations:\n\n1️⃣ Official WhatsApp Business API\n2️⃣ 24/7 AI Knowledge Base Chatbot\n3️⃣ Shared Team Live Inbox\n4️⃣ Bulk Broadcasts with CTA Buttons\n5️⃣ Visual Drag-and-Drop Flow Builder\n\nWould you like pricing details?",
    quickReplies: [
      { label: "💰 View Pricing Plans", next: "product2" },
      { label: "📅 Schedule Live Demo", next: "book1" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 2
  },
  product2: {
    botMsg: "🏷️ *MeSage AI Plans:*\n\n🥉 *Starter:* ₹999/mo (1 Channel, 1,000 Contacts)\n🥈 *Growth:* ₹2,499/mo (All Channels, Unlimited Agents)\n🥇 *Enterprise:* Custom Solutions & Dedicated Support\n\nWould you like a representative to call you?",
    quickReplies: [
      { label: "📞 Connect with Sales", next: "human" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 3
  },

  // Support
  support1: {
    userMsg: "🎫 Raise Support Ticket",
    botMsg: "We're here to help! What issue are you experiencing?",
    quickReplies: [
      { label: "🔧 Technical Setup Help", next: "support2" },
      { label: "💳 Billing & Invoice", next: "support2" },
      { label: "🔗 Meta API Green Tick", next: "support2" }
    ],
    flowStep: 2
  },
  support2: {
    botMsg: "Ticket generated: 🎫 *#MSG-2024-9102*\n\nPriority: High ⚡\nStatus: Assigned to Tier-1 Support Engineer\n\nExpected response: Under 15 minutes.",
    quickReplies: [
      { label: "🧑‍💼 Chat with Agent Now", next: "human" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 4
  },

  // Order tracking
  order1: {
    userMsg: "📦 Track Order",
    botMsg: "📦 *Order #ORD-88192 Status:*\n\n✅ Order Confirmed (Oct 22)\n✅ Dispatched via BlueDart\n🚚 *Out for delivery today by 5:00 PM*\n\nDriver: Suresh (+91 98200 XXXXX)",
    quickReplies: [
      { label: "📞 Call Delivery Agent", next: "order2" },
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 3
  },
  order2: {
    botMsg: "Connecting you to driver Suresh at +91 98200 XXXXX... 📞\n\nHave a great delivery!",
    quickReplies: [
      { label: "🏠 Main Menu", next: "start" }
    ],
    flowStep: 4
  },

  // Human Takeover
  human: {
    botMsg: "🧑‍💼 *Human Agent Handoff:*\n\nAgent Priya from our specialist team has joined the conversation!\n\n_Priya: Hello Rahul! I can see your inquiry. How can I assist you right now?_",
    quickReplies: [
      { label: "💬 Ask a Custom Question", next: "start" },
      { label: "🏠 Return to AI Bot", next: "start" }
    ],
    flowStep: 5
  }
};

function scrollWA() {
  if (waChatBg) waChatBg.scrollTop = waChatBg.scrollHeight;
}

function addWAMsg(text, type) {
  const div = document.createElement('div');
  div.className = `wa-msg wa-msg-${type}`;
  const lines = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  div.innerHTML = `<div class="wa-bubble-inner">${lines}</div><div class="wa-tick-${type}">✓✓</div>`;
  waMsgs.appendChild(div);
  scrollWA();
}

function showTyping() {
  if (waTyping) {
    waTyping.style.display = 'flex';
    scrollWA();
  }
}

function hideTyping() {
  if (waTyping) waTyping.style.display = 'none';
}

function clearQuickReplies() {
  if (waQuickArea) waQuickArea.innerHTML = '';
}

function showQuickReplies(replies) {
  clearQuickReplies();
  replies.forEach((r) => {
    const btn = document.createElement('button');
    btn.className = 'wa-qr-btn';
    btn.textContent = r.label;
    btn.onclick = () => handleWAChoice(r.label, r.next);
    waQuickArea.appendChild(btn);
  });
}

function handleWAChoice(label, nextKey) {
  clearQuickReplies();
  addWAMsg(label, 'user');
  setTimeout(() => runWAFlow(nextKey), 350);
}

function runWAFlow(key) {
  const flow = flows[key];
  if (!flow) return;

  highlightFlowStep(flow.flowStep || 1);
  showTyping();

  const delay = Math.min(600 + (flow.botMsg ? flow.botMsg.length * 7 : 400), 1800);

  setTimeout(() => {
    hideTyping();
    addWAMsg(flow.botMsg, 'bot');
    setTimeout(() => showQuickReplies(flow.quickReplies || []), 350);
  }, delay);
}

window.resetWADemo = function() {
  if (waMsgs) waMsgs.innerHTML = '';
  clearQuickReplies();
  hideTyping();
  setTimeout(() => initWADemo(), 200);
};

function initWADemo() {
  highlightFlowStep(1);
  showTyping();
  setTimeout(() => {
    hideTyping();
    addWAMsg(flows.start.botMsg, 'bot');
    setTimeout(() => showQuickReplies(flows.start.quickReplies), 400);
  }, 900);
}

// Auto start demo when scrolled into view
const demoSection = document.getElementById('demo');
if (demoSection) {
  const demoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initWADemo();
        demoObserver.disconnect();
      }
    });
  }, { threshold: 0.25 });
  demoObserver.observe(demoSection);
}
