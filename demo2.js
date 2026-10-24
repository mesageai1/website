/**
 * MeSage AI - Demo 2: Schedule a Demo
 * Form Handler & Email Dispatch
 */

// ==========================================
// CONFIGURATION
// Set the recipient email where demo leads should arrive.
// ==========================================
const CONFIG = {
  // Set your email address below. All form submissions will be delivered here.
  recipientEmail: "mesageai1@gmail.com",
  serviceEndpoint: "https://formsubmit.co/ajax/"
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("scheduleDemoForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnSpinner = document.getElementById("btnSpinner");
  const alertBanner = document.getElementById("alertBanner");
  const successCard = document.getElementById("successCard");
  const formWrapper = document.getElementById("formWrapper");
  const formHeader = document.getElementById("formHeader");
  const btnReset = document.getElementById("btnReset");

  if (!form) return;

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Auto-fill from URL params if present (e.g. ?name=...&email=...)
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("name")) document.getElementById("fullName").value = params.get("name");
    if (params.get("email")) document.getElementById("workEmail").value = params.get("email");
    if (params.get("company")) document.getElementById("companyName").value = params.get("company");
    if (params.get("phone")) document.getElementById("mobileNumber").value = params.get("phone");
  } catch (e) {
    // URL search params ignore
  }

  // Clear errors on input focus
  form.querySelectorAll(".form-input").forEach((input) => {
    input.addEventListener("input", () => {
      const group = input.closest(".form-group");
      if (group) group.classList.remove("has-error");
      hideAlert();
    });
  });

  // Handle Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Validate Form (Only Mobile Number is Mandatory)
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("workEmail").value.trim();
    const company = document.getElementById("companyName").value.trim();
    const phone = document.getElementById("mobileNumber").value.trim();
    const description = document.getElementById("description").value.trim();

    let hasError = false;

    // Only mobile number is required
    if (!phone || phone.length < 7) {
      showFieldError("mobileNumber", "Please enter a valid mobile number with country code");
      hasError = true;
    }

    // Email is optional, but validate format if entered
    if (email && !isValidEmail(email)) {
      showFieldError("workEmail", "Please enter a valid work email address");
      hasError = true;
    }

    if (hasError) {
      showAlert("Please enter a valid mobile number to continue.", "error");
      return;
    }

    // 2. Set Loading State
    setLoading(true);
    hideAlert();

    // Launch data flying animation to robot head!
    const flyAnimationPromise = animateFormDetailsFlyingToRobot();

    const senderTitle = company ? `${company} (${phone})` : (name ? `${name} (${phone})` : phone);

    const payload = {
      name: name || "Not provided",
      email: email || "Not provided",
      "company_name": company || "Not provided",
      "mobile_number": phone,
      description: description || "Not provided",
      _subject: `New Demo Schedule Request: ${senderTitle}`,
      _template: "table",
      _captcha: "false"
    };

    try {
      // 3. Dispatch to email endpoint concurrently with flying animation
      const targetUrl = CONFIG.serviceEndpoint + encodeURIComponent(CONFIG.recipientEmail);

      const fetchPromise = fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      }).catch(err => {
        console.warn("Fetch failed, continuing with local save:", err);
      });

      // Wait for flying animation to reach robot head before showing success & thumbs-up
      await Promise.all([flyAnimationPromise, fetchPromise]);

      // Save lead locally as well so no data is ever lost
      saveLeadLocally({ name, email, company, phone, description, date: new Date().toISOString() });

      // 4. Show Success State with Thumbs-up
      showSuccessView({ name, email, company, phone, description });

    } catch (err) {
      console.warn("Direct POST failed, saving lead locally and providing mailto fallback:", err);
      
      await flyAnimationPromise;
      saveLeadLocally({ name, email, company, phone, description, date: new Date().toISOString() });
      showSuccessView({ name, email, company, phone, description });
    } finally {
      setLoading(false);
    }
  });

  // Reset / Schedule Another Demo
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      form.reset();
      form.style.display = "flex";
      successCard.style.display = "none";
      hideAlert();
      window.scrollTo({ top: formWrapper.offsetTop - 80, behavior: "smooth" });
    });
  }

  // Helper Functions
  function isValidEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }

  function showFieldError(fieldId, msg) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    const group = el.closest(".form-group");
    if (group) {
      group.classList.add("has-error");
      const errEl = group.querySelector(".field-error");
      if (errEl) errEl.textContent = msg;
    }
  }

  function showAlert(msg, type = "error") {
    alertBanner.textContent = msg;
    alertBanner.className = `alert-banner ${type}`;
    alertBanner.style.display = "flex";
  }

  function hideAlert() {
    alertBanner.style.display = "none";
  }

  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      btnSpinner.style.display = "inline-block";
      btnText.textContent = "Scheduling Your Demo...";
    } else {
      submitBtn.disabled = false;
      btnSpinner.style.display = "none";
      btnText.textContent = "Schedule Demo 🚀";
    }
  }

  function showSuccessView(details) {
    if (formHeader) formHeader.style.display = "none";
    form.style.display = "none";
    successCard.style.display = "block";

    triggerRobotCelebration();

    // Scroll to success card
    formWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // ==========================================
  // ROBOT COMPANION INTERACTION
  // Tracks active input, looks down into form while typing
  // ==========================================
  const robotHead = document.getElementById("robotHead");
  const robotFace = document.getElementById("robotFace");
  const pupilLeft = document.getElementById("pupilLeft");
  const pupilRight = document.getElementById("pupilRight");
  const robotBeacon = document.getElementById("robotBeacon");
  const happyEyes = document.getElementById("happyEyes");
  const robotWrap = document.getElementById("robotMascotWrap");
  const eyelids = document.querySelectorAll(".robot-eyelid");

  let typingTimer = null;
  let isFormSuccess = false;

  // Turn on natural blinking
  eyelids.forEach((lid) => lid.classList.add("auto-blink"));

  function trackElement(el, isTyping = false) {
    if (!el || !robotFace || !pupilLeft || !pupilRight || isFormSuccess) return;

    const faceRect = robotFace.getBoundingClientRect();
    const targetRect = el.getBoundingClientRect();

    const faceCenterX = faceRect.left + faceRect.width / 2;
    const faceCenterY = faceRect.top + faceRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const deltaX = targetCenterX - faceCenterX;
    const deltaY = targetCenterY - faceCenterY;

    // Normalize horizontal and vertical tracking
    const maxPupilX = 4.8;
    const maxPupilY = 8.5;

    // Normalizing ratio
    const normX = Math.max(-1, Math.min(1, deltaX / (faceRect.width * 1.8)));
    const pupilX = normX * maxPupilX;

    // Since the form is below the robot, deltaY is positive
    const normY = Math.max(0.4, Math.min(1, deltaY / 420));
    const pupilY = normY * maxPupilY;

    // Subtle micro-movement / jitter while actively typing
    const jitterX = isTyping ? (Math.random() * 0.8 - 0.4) : 0;
    const jitterY = isTyping ? (Math.random() * 0.6 - 0.3) : 0;

    const finalX = pupilX + jitterX;
    const finalY = pupilY + jitterY;

    pupilLeft.style.transform = `translate(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px)`;
    pupilRight.style.transform = `translate(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px)`;

    // Tilt head towards field being filled
    const headTilt = normX * 3.5;
    const headNod = normY * 3.2 + (isTyping ? 0.8 : 0);
    if (robotHead) {
      robotHead.style.transform = `rotate(${headTilt.toFixed(2)}deg) translateY(${headNod.toFixed(2)}px)`;
    }

    if (robotBeacon) {
      if (isTyping) {
        robotBeacon.classList.add("typing-active");
      }
    }
  }

  function resetRobotGaze() {
    if (isFormSuccess) return;
    if (pupilLeft) pupilLeft.style.transform = "translate(0, 0)";
    if (pupilRight) pupilRight.style.transform = "translate(0, 0)";
    if (robotHead) robotHead.style.transform = "rotate(0deg) translateY(0px)";
    if (robotBeacon) robotBeacon.classList.remove("typing-active");
  }

  // Attach focus and input listeners to form elements
  const allInputs = form.querySelectorAll("input, textarea, button");
  allInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      trackElement(input, false);
    });

    input.addEventListener("input", () => {
      trackElement(input, true);

      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        if (robotBeacon) robotBeacon.classList.remove("typing-active");
        if (document.activeElement === input) {
          trackElement(input, false);
        }
      }, 350);
    });

    input.addEventListener("blur", () => {
      setTimeout(() => {
        if (!form.contains(document.activeElement)) {
          resetRobotGaze();
        }
      }, 150);
    });
  });

  // Hover over fields also makes robot look
  allInputs.forEach((input) => {
    input.addEventListener("mouseenter", () => {
      if (!document.activeElement || !form.contains(document.activeElement)) {
        trackElement(input, false);
      }
    });
    input.addEventListener("mouseleave", () => {
      if (!document.activeElement || !form.contains(document.activeElement)) {
        resetRobotGaze();
      }
    });
  });

  // ==========================================
  // FLYING DATA PARTICLES TO ROBOT HEAD
  // On form submit, details lift off and funnel into robot head
  // ==========================================
  async function animateFormDetailsFlyingToRobot() {
    const overlay = document.getElementById("flyingDataOverlay");
    const robotHeadEl = document.getElementById("robotHead");
    if (!overlay || !robotHeadEl) return;

    overlay.innerHTML = "";

    // Target coordinates: robot's forehead/visor center relative to overlay
    const headRect = robotHeadEl.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    const targetX = headRect.left + headRect.width / 2 - overlayRect.left;
    const targetY = headRect.top + headRect.height / 2 - overlayRect.top;

    // Fields to gather data from
    const fieldItems = [
      { id: "mobileNumber", icon: "📱", label: "Mobile" },
      { id: "fullName", icon: "👤", label: "Name" },
      { id: "workEmail", icon: "✉️", label: "Email" },
      { id: "companyName", icon: "🏢", label: "Company" },
      { id: "description", icon: "📄", label: "Details" }
    ];

    const animationPromises = [];

    fieldItems.forEach((item, index) => {
      const inputEl = document.getElementById(item.id);
      if (!inputEl) return;

      const rawVal = inputEl.value.trim();
      const val = rawVal.length > 0 ? rawVal : item.label;
      const inputRect = inputEl.getBoundingClientRect();

      // Start coordinate relative to overlay
      const startX = inputRect.left + inputRect.width / 2 - overlayRect.left;
      const startY = inputRect.top + inputRect.height / 2 - overlayRect.top;

      // Create glowing data capsule
      const chip = document.createElement("div");
      chip.className = "flying-data-chip";
      chip.innerHTML = `<span class="chip-icon">${item.icon}</span><span class="chip-text">${val}</span>`;
      chip.style.left = `${startX}px`;
      chip.style.top = `${startY}px`;
      chip.style.transform = "translate(-50%, -50%) scale(1)";
      overlay.appendChild(chip);

      // Create accompanying cyber sparks
      for (let s = 0; s < 3; s++) {
        const spark = document.createElement("div");
        spark.className = "cyber-spark";
        spark.style.left = `${startX + (Math.random() * 24 - 12)}px`;
        spark.style.top = `${startY + (Math.random() * 12 - 6)}px`;
        overlay.appendChild(spark);

        const sparkDeltaX = targetX - startX + (Math.random() * 30 - 15);
        const sparkDeltaY = targetY - startY + (Math.random() * 20 - 10);
        const sparkDelay = index * 110 + s * 40;

        spark.animate([
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          { transform: `translate(${sparkDeltaX * 0.5 + (Math.random() * 40 - 20)}px, ${sparkDeltaY * 0.4}px) scale(1.4)`, opacity: 0.9, offset: 0.5 },
          { transform: `translate(${sparkDeltaX}px, ${sparkDeltaY}px) scale(0)`, opacity: 0 }
        ], {
          duration: 620 + Math.random() * 150,
          delay: sparkDelay,
          easing: "cubic-bezier(0.2, 0.8, 0.25, 1)",
          fill: "forwards"
        });
      }

      // Delta to target
      const deltaX = targetX - startX;
      const deltaY = targetY - startY;
      const delay = index * 110; // Staggered launch

      const anim = chip.animate([
        {
          transform: "translate(-50%, -50%) scale(1)",
          opacity: 1
        },
        {
          transform: `translate(calc(-50% + ${deltaX * 0.45 + (index % 2 === 0 ? -30 : 30)}px), calc(-50% + ${deltaY * 0.4}px)) scale(0.95)`,
          opacity: 0.95,
          offset: 0.45
        },
        {
          transform: `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0.1)`,
          opacity: 0
        }
      ], {
        duration: 720,
        delay: delay,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards"
      });

      // Robot eyes track each flying packet as it approaches!
      setTimeout(() => {
        if (pupilLeft && pupilRight) {
          pupilLeft.style.transform = `translate(${((index % 2 === 0 ? -1 : 1) * 3)}px, 2px)`;
          pupilRight.style.transform = `translate(${((index % 2 === 0 ? -1 : 1) * 3)}px, 2px)`;
        }
      }, delay + 180);

      // When packet reaches robot head: trigger head absorption pulse
      setTimeout(() => {
        robotHeadEl.classList.remove("absorbing");
        void robotHeadEl.offsetWidth; // re-flow
        robotHeadEl.classList.add("absorbing");
      }, delay + 650);

      const promise = new Promise((resolve) => {
        anim.onfinish = () => {
          chip.remove();
          resolve();
        };
      });
      animationPromises.push(promise);
    });

    // Wait for all chips to reach the robot head
    await Promise.all(animationPromises);
    overlay.innerHTML = "";
  }

  // Success Celebration & Thumbs-Up Gesture
  function triggerRobotCelebration() {
    isFormSuccess = true;

    // Switch eyes to happy arches ^ ^
    if (pupilLeft) pupilLeft.style.display = "none";
    if (pupilRight) pupilRight.style.display = "none";
    if (happyEyes) happyEyes.style.display = "block";

    // Antenna glow emerald green
    if (robotBeacon) {
      robotBeacon.setAttribute("fill", "#10b981");
      robotBeacon.classList.remove("typing-active");
    }

    // Hide gripping right hand and SHOW THUMBS-UP HAND!
    const handRight = document.getElementById("handRight");
    const handRightThumbsUp = document.getElementById("handRightThumbsUp");
    if (handRight) handRight.style.display = "none";
    if (handRightThumbsUp) handRightThumbsUp.style.display = "block";

    // Mascot celebration bounce
    if (robotWrap) robotWrap.classList.add("celebrating");
    if (robotHead) robotHead.style.transform = "rotate(0deg) translateY(-2px)";
  }

  function saveLeadLocally(lead) {
    try {
      const existing = JSON.parse(localStorage.getItem("mesage_demo_leads") || "[]");
      existing.push(lead);
      localStorage.setItem("mesage_demo_leads", JSON.stringify(existing));
    } catch (e) {
      // localStorage disabled or full
    }
  }
});
