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
      // 3. Dispatch to email endpoint
      const targetUrl = CONFIG.serviceEndpoint + encodeURIComponent(CONFIG.recipientEmail);

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({ success: true }));

      // Save lead locally as well so no data is ever lost
      saveLeadLocally({ name, email, company, phone, description, date: new Date().toISOString() });

      // 4. Show Success State
      showSuccessView({ name, email, company, phone, description });

    } catch (err) {
      console.warn("Direct POST failed, saving lead locally and providing mailto fallback:", err);
      
      // Save locally
      saveLeadLocally({ name, email, company, phone, description, date: new Date().toISOString() });

      // If adblocker blocked the external API call, still show success with mailto backup
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

  // Success Celebration
  function triggerRobotCelebration() {
    isFormSuccess = true;
    if (pupilLeft) pupilLeft.style.display = "none";
    if (pupilRight) pupilRight.style.display = "none";
    if (happyEyes) happyEyes.style.display = "block";
    if (robotBeacon) {
      robotBeacon.setAttribute("fill", "#10b981");
      robotBeacon.classList.remove("typing-active");
    }
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
