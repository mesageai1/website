// ===================== NAV =====================
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

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// ===================== ANIMATIONS =====================
const style = document.createElement('style');
style.textContent = `
  @keyframes voiceBar {
    from { transform: scaleY(0.4); opacity: 0.5; }
    to { transform: scaleY(1.4); opacity: 1; }
  }
  @keyframes blink {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes pulseAnim {
    0%, 100% { box-shadow: 0 0 8px #10b981; }
    50% { box-shadow: 0 0 20px #10b981; }
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes quickIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes flowPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
    50% { box-shadow: 0 0 0 6px rgba(99,102,241,0.15); }
  }
  @keyframes ucCycle {
    0%, 15% { opacity: 1; }
    20%, 100% { opacity: 0; }
  }
  .wa-msg-anim { animation: msgIn 0.3s ease forwards; }
  .quick-btn-anim { animation: quickIn 0.25s ease forwards; }
  .flow-step.active .fs-icon { animation: flowPulse 1.5s ease infinite; }
`;
document.head.appendChild(style);

// Voice wave
const bars = document.querySelectorAll('.voice-wave span');
bars.forEach((bar, i) => {
  bar.style.animation = `voiceBar 1.2s ease-in-out ${i * 0.08}s infinite alternate`;
});

// Typing dots
document.querySelectorAll('.typing i').forEach((el, i) => {
  el.style.animation = `blink 1.2s ease-in-out ${i * 0.2}s infinite`;
});

// Feature cards scroll animation
const featItems = document.querySelectorAll('.feature-box, .fo-item');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      setTimeout(() => {
        entry.target.style.transform = '';
      }, 500);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
featItems.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(24px)';
  item.style.transition = `opacity 0.45s ease ${(i % 3) * 0.08}s, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${(i % 3) * 0.08}s`;
  observer.observe(item);
});

// ===================== USE CASE CYCLING =====================
const ucTags = document.querySelectorAll('.uc-tag');
let ucIndex = 0;
function cycleUC() {
  ucTags.forEach(t => t.classList.remove('active-uc'));
  ucTags[ucIndex].classList.add('active-uc');
  ucIndex = (ucIndex + 1) % ucTags.length;
}
if (ucTags.length) setInterval(cycleUC, 2000);

// ===================== FLOW STEP HIGHLIGHT =====================
function highlightFlowStep(n) {
  document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('fs' + n);
  if (el) el.classList.add('active');
}

// ===================== WHATSAPP CHATBOT DEMO =====================
const waMsgs = document.getElementById('waMsgs');
const waTyping = document.getElementById('waTyping');
const waQuickArea = document.getElementById('waQuickArea');
const waChatBg = document.getElementById('waChatBg');

// Conversation flows
const flows = {
  start: {
    botMsg: "👋 Hi! I'm MeSage AI — your smart business assistant.\n\nHow can I help you today?",
    quickReplies: [
      { label: "📅 Book an Appointment", next: "book1" },
      { label: "🛍️ Product Enquiry", next: "product1" },
      { label: "🎫 Raise a Support Ticket", next: "support1" },
      { label: "📦 Track my Order", next: "order1" },
    ],
    flowStep: 1
  },

  // --- Appointment Booking Flow ---
  book1: {
    userMsg: "📅 Book an Appointment",
    botMsg: "Great! I'll help you book an appointment. 😊\n\nWhat type of appointment would you like?",
    quickReplies: [
      { label: "🩺 Doctor Consultation", next: "book2" },
      { label: "💼 Business Meeting", next: "book2" },
      { label: "💇 Salon / Spa", next: "book2" },
      { label: "🔧 Service / Repair", next: "book2" },
    ],
    flowStep: 2
  },
  book2: {
    botMsg: "Perfect! Which date works best for you?",
    quickReplies: [
      { label: "📆 Today", next: "book3" },
      { label: "📆 Tomorrow", next: "book3" },
      { label: "📆 This Weekend", next: "book3" },
      { label: "📆 Next Week", next: "book3" },
    ],
    flowStep: 2
  },
  book3: {
    botMsg: "And what time slot would you prefer?",
    quickReplies: [
      { label: "🕘 9:00 AM", next: "book4" },
      { label: "🕛 12:00 PM", next: "book4" },
      { label: "🕒 3:00 PM", next: "book4" },
      { label: "🕔 5:00 PM", next: "book4" },
    ],
    flowStep: 3
  },
  book4: {
    botMsg: "Almost done! May I have your name and contact number?",
    quickReplies: [
      { label: "👤 Rahul Sharma, +91 98765 43210", next: "book5" },
      { label: "✏️ Enter manually (demo)", next: "book5" },
    ],
    flowStep: 3
  },
  book5: {
    botMsg: "✅ *Appointment Confirmed!*\n\n📅 Date: Tomorrow\n⏰ Time: 3:00 PM\n👤 Name: Rahul Sharma\n\nYou will receive a reminder 1 hour before. Thank you! 🎉",
    quickReplies: [
      { label: "🔔 Set Reminder", next: "book6" },
      { label: "📋 View Details", next: "book6" },
      { label: "🏠 Back to Menu", next: "start" },
    ],
    flowStep: 4
  },
  book6: {
    botMsg: "Done! ✅ Reminder set. Our team will also call you 30 mins before.\n\nNeed anything else?",
    quickReplies: [
      { label: "🧑‍💼 Talk to a Human Agent", next: "human" },
      { label: "🏠 Back to Menu", next: "start" },
    ],
    flowStep: 4
  },

  // --- Product Enquiry ---
  product1: {
    userMsg: "🛍️ Product Enquiry",
    botMsg: "Sure! Which product category are you interested in?",
    quickReplies: [
      { label: "📱 Software Plans", next: "product2" },
      { label: "🤖 AI Features", next: "product2" },
      { label: "💰 Pricing", next: "product2" },
      { label: "🔗 Integrations", next: "product2" },
    ],
    flowStep: 2
  },
  product2: {
    botMsg: "Great choice! 🚀 MeSage AI offers:\n\n✅ WhatsApp Business API\n✅ Unified Inbox (all channels)\n✅ AI Chatbot + Flow Builder\n✅ Campaigns & Broadcasts\n✅ CRM Integration\n\nWould you like to see our pricing?",
    quickReplies: [
      { label: "💰 Yes, show pricing", next: "product3" },
      { label: "📞 Schedule a Demo", next: "book1" },
      { label: "🏠 Back to Menu", next: "start" },
    ],
    flowStep: 3
  },
  product3: {
    botMsg: "Our plans start from *₹999/month* 🎯\n\n🥉 Starter — ₹999/mo — 1 channel, 500 contacts\n🥈 Growth — ₹2,499/mo — All channels, 5,000 contacts\n🥇 Enterprise — Custom — Unlimited\n\nWant to talk to our sales team?",
    quickReplies: [
      { label: "✅ Yes, connect me", next: "human" },
      { label: "🏠 Back to Menu", next: "start" },
    ],
    flowStep: 4
  },

  // --- Support ---
  support1: {
    userMsg: "🎫 Raise a Support Ticket",
    botMsg: "I'm sorry to hear you're facing an issue! 😔 What's the problem about?",
    quickReplies: [
      { label: "🔧 Technical Issue", next: "support2" },
      { label: "💳 Billing / Payment", next: "support2" },
      { label: "🔗 Integration Help", next: "support2" },
      { label: "❓ Other", next: "support2" },
    ],
    flowStep: 2
  },
  support2: {
    botMsg: "Got it! I've created a support ticket 🎫 *#MSG-2024-0847*\n\nOur team will get back to you within *2 hours*.\n\nWant to talk to an agent right now?",
    quickReplies: [
      { label: "🧑‍💼 Yes, talk to agent now", next: "human" },
      { label: "📧 Send me email updates", next: "support3" },
      { label: "🏠 Back to Menu", next: "start" },
    ],
    flowStep: 4
  },
  support3: {
    botMsg: "✅ Done! You'll receive email updates at each step.\n\nTicket ID: *#MSG-2024-0847*\nExpected resolution: Within 2 hours",
    quickReplies: [
      { label: "🏠 Back to Menu", next: "start" },
    ],
    flowStep: 4
  },

  // --- Order Tracking ---
  order1: {
    userMsg: "📦 Track my Order",
    botMsg: "Sure! Please share your order ID or phone number to track your order.",
    quickReplies: [
      { label: "📋 Order #ORD-98712", next: "order2" },
      { label: "📋 Order #ORD-87234", next: "order2" },
    ],
    flowStep: 2
  },
  order2: {
    botMsg: "📦 *Order #ORD-98712 Status:*\n\n✅ Confirmed — Oct 20\n✅ Packed — Oct 21\n🚚 Out for Delivery — *Today, expected by 5 PM*\n\nYour delivery agent: Ravi K. (+91 98765 XXXXX)",
    quickReplies: [
      { label: "📞 Call Delivery Agent", next: "order3" },
      { label: "🏠 Back to Menu", next: "start" },
    ],
    flowStep: 4
  },
  order3: {
    botMsg: "📞 Connecting you to the delivery agent...\n\n*(In a real deployment, this would initiate a WhatsApp call or share the agent's number)*",
    quickReplies: [
      { label: "🏠 Back to Menu", next: "start" },
    ],
    flowStep: 4
  },

  // --- Human handoff ---
  human: {
    botMsg: "🧑‍💼 Connecting you to a *human agent* now...\n\nPlease hold on for a moment. Average wait time: *< 1 minute*",
    quickReplies: [
      { label: "🏠 Back to Main Menu", next: "start" },
    ],
    flowStep: 5,
    agentJoined: true
  }
};

let waQueue = [];
let waRunning = false;

function scrollWA() {
  if (waChatBg) waChatBg.scrollTop = waChatBg.scrollHeight;
}

function addWAMsg(text, type) {
  const div = document.createElement('div');
  div.className = `wa-msg wa-msg-${type} wa-msg-anim`;
  const lines = text.replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  div.innerHTML = `<div class="wa-bubble-inner">${lines}</div><div class="wa-tick-${type}">✓✓</div>`;
  waMsgs.appendChild(div);
  scrollWA();
}

function showTyping() {
  waTyping.style.display = 'flex';
  scrollWA();
}
function hideTyping() { waTyping.style.display = 'none'; }

function clearQuickReplies() { waQuickArea.innerHTML = ''; }

function showQuickReplies(replies) {
  clearQuickReplies();
  replies.forEach((r, i) => {
    const btn = document.createElement('button');
    btn.className = 'wa-qr-btn quick-btn-anim';
    btn.style.animationDelay = `${i * 0.07}s`;
    btn.textContent = r.label;
    btn.onclick = () => handleWAChoice(r.label, r.next);
    waQuickArea.appendChild(btn);
  });
}

function handleWAChoice(label, nextKey) {
  clearQuickReplies();
  addWAMsg(label, 'user');
  setTimeout(() => runWAFlow(nextKey), 300);
}

function runWAFlow(key) {
  const flow = flows[key];
  if (!flow) return;

  highlightFlowStep(flow.flowStep || 1);

  // Bot types...
  showTyping();

  // Calculate delay based on message length
  const delay = Math.min(800 + flow.botMsg.length * 10, 2400);

  setTimeout(() => {
    hideTyping();
    if (flow.agentJoined) {
      // Show agent join banner
      const banner = document.createElement('div');
      banner.className = 'wa-agent-banner';
      banner.innerHTML = '🧑‍💼 <strong>Agent Sarah</strong> has joined the conversation';
      waMsgs.appendChild(banner);
      scrollWA();
      setTimeout(() => {
        addWAMsg(flow.botMsg, 'bot');
        setTimeout(() => showQuickReplies(flow.quickReplies || []), 400);
      }, 500);
    } else {
      addWAMsg(flow.botMsg, 'bot');
      setTimeout(() => showQuickReplies(flow.quickReplies || []), 400);
    }
  }, delay);
}

function resetWADemo() {
  if (waMsgs) waMsgs.innerHTML = '';
  clearQuickReplies();
  hideTyping();
  document.querySelectorAll('.flow-step').forEach(s => s.classList.remove('active'));
  setTimeout(() => initWADemo(), 300);
}

function initWADemo() {
  highlightFlowStep(1);
  showTyping();
  setTimeout(() => {
    hideTyping();
    addWAMsg(flows.start.botMsg, 'bot');
    setTimeout(() => showQuickReplies(flows.start.quickReplies), 500);
  }, 1200);
}

// Auto-start when demo section is visible
const demoSection = document.getElementById('demo');
if (demoSection) {
  const demoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initWADemo();
        demoObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  demoObserver.observe(demoSection);
}

// Expose for reset button
window.resetWADemo = resetWADemo;
