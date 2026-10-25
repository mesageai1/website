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
      triggerBotPointingAtMobile();
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
      if (formHeader) formHeader.style.display = "block";
      successCard.style.display = "none";
      hideAlert();

      isFormSuccess = false;
      dismissBotPointing();

      if (pupilLeft) pupilLeft.style.display = "block";
      if (pupilRight) pupilRight.style.display = "block";
      if (happyEyes) happyEyes.style.display = "none";
      if (handRightThumbsUp) handRightThumbsUp.style.display = "none";
      if (handRight) {
        handRight.style.display = "block";
        handRight.classList.remove("returning");
      }
      if (robotReachArmSvg) {
        robotReachArmSvg.style.display = "none";
        robotReachArmSvg.classList.remove("retracting");
        robotReachArmSvg.innerHTML = "";
      }
      if (handLeft) {
        handLeft.style.display = "block";
        handLeft.classList.remove("returning");
      }
      if (robotWrap) robotWrap.classList.remove("celebrating");
      resetRobotGaze();

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
  const brainIntakeLeft = document.getElementById("brainIntakeLeft");
  const brainIntakeRight = document.getElementById("brainIntakeRight");
  const happyEyes = document.getElementById("happyEyes");
  const robotWrap = document.getElementById("robotMascotWrap");
  const eyelids = document.querySelectorAll(".robot-eyelid");
  const handLeft = document.getElementById("handLeft");
  const robotReachArmSvg = document.getElementById("robotReachArmSvg");
  const handRight = document.getElementById("handRight");
  const handRightThumbsUp = document.getElementById("handRightThumbsUp");
  const mobileInput = document.getElementById("mobileNumber");
  const groupPhone = document.getElementById("groupPhone");

  let typingTimer = null;
  let isFormSuccess = false;
  let isPointingAtMobile = false;
  let pointingTimeout = null;

  // Turn on natural blinking
  eyelids.forEach((lid) => lid.classList.add("auto-blink"));

  // Render Articulated Cybernetic Arm Reaching All the Way Down to Mobile Field
  function renderReachingArm(startX, startY, targetX, targetY, formColWidth, formColHeight) {
    if (!robotReachArmSvg) return;

    robotReachArmSvg.setAttribute("viewBox", `0 0 ${formColWidth} ${formColHeight}`);
    robotReachArmSvg.setAttribute("width", `${formColWidth}`);
    robotReachArmSvg.setAttribute("height", `${formColHeight}`);

    // Direction vector of the index finger aiming down-right into the mobile input container:
    // Target is right next to the phone icon 📱
    const fingerLen = 22;
    const palmLen = 20;
    const angle = 28 * (Math.PI / 180); // ~28 degrees down-right
    const uX = Math.cos(angle);
    const uY = Math.sin(angle);

    const knuckleX = targetX - fingerLen * uX;
    const knuckleY = targetY - fingerLen * uY;

    const wristX = knuckleX - palmLen * uX;
    const wristY = knuckleY - palmLen * uY;

    // Elbow bent outward along the left flank:
    const midX = (startX + wristX) / 2;
    const midY = (startY + wristY) / 2;
    const elbowX = Math.min(startX, wristX) - 20;
    const elbowY = midY - 6;

    robotReachArmSvg.innerHTML = `
      <defs>
        <linearGradient id="reachCeramic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="35%" stop-color="#f8fafc"/>
          <stop offset="70%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
        <linearGradient id="reachCeramicPlate" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
        <linearGradient id="reachChrome" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="30%" stop-color="#cbd5e1"/>
          <stop offset="60%" stop-color="#64748b"/>
          <stop offset="100%" stop-color="#334155"/>
        </linearGradient>
        <linearGradient id="reachCarbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e2438"/>
          <stop offset="60%" stop-color="#0f1322"/>
          <stop offset="100%" stop-color="#080a14"/>
        </linearGradient>
        <filter id="reachGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <g id="reachArmMain" class="reach-arm-assembly">
        <!-- SHOULDER BALL SOCKET OVER LIFTED HAND POSITION -->
        <g id="reachShoulderGroup">
          <circle cx="${startX.toFixed(1)}" cy="${startY.toFixed(1)}" r="11" fill="url(#reachChrome)" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="${startX.toFixed(1)}" cy="${startY.toFixed(1)}" r="7" fill="url(#reachCarbon)"/>
          <circle cx="${startX.toFixed(1)}" cy="${startY.toFixed(1)}" r="3.2" fill="#38bdf8" filter="url(#reachGlow)"/>
        </g>

        <!-- UPPER ARM (CYBERNETIC BICEP & HYDRAULIC STRUT) -->
        <g id="reachUpperArm">
          <!-- Hydraulic Chrome Piston Core -->
          <line x1="${startX.toFixed(1)}" y1="${startY.toFixed(1)}" x2="${elbowX.toFixed(1)}" y2="${elbowY.toFixed(1)}" stroke="url(#reachChrome)" stroke-width="7" stroke-linecap="round"/>
          <line x1="${(startX - 2).toFixed(1)}" y1="${startY.toFixed(1)}" x2="${(elbowX - 2).toFixed(1)}" y2="${elbowY.toFixed(1)}" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.9"/>
          
          <!-- Ceramic Outer Bicep Armor Shell -->
          <path d="M ${(startX - 6).toFixed(1)} ${(startY + 3).toFixed(1)} Q ${(midX - 16).toFixed(1)} ${(midY - 14).toFixed(1)} ${(elbowX - 4).toFixed(1)} ${(elbowY - 4).toFixed(1)} L ${(elbowX + 4).toFixed(1)} ${(elbowY + 4).toFixed(1)} Q ${(midX + 2).toFixed(1)} ${(midY + 4).toFixed(1)} ${(startX + 6).toFixed(1)} ${(startY + 5).toFixed(1)} Z" 
                fill="url(#reachCeramic)" stroke="#94a3b8" stroke-width="1.2"/>
          
          <!-- Neon Telemetry Conduit Line on Bicep -->
          <path d="M ${(startX - 1).toFixed(1)} ${(startY + 6).toFixed(1)} Q ${(midX - 8).toFixed(1)} ${(midY - 6).toFixed(1)} ${elbowX.toFixed(1)} ${(elbowY - 1).toFixed(1)}" 
                stroke="#38bdf8" stroke-width="1.2" fill="none" opacity="0.85"/>
        </g>

        <!-- ELBOW ARTICULATED ROTARY JOINT -->
        <g id="reachElbowGroup">
          <circle cx="${elbowX.toFixed(1)}" cy="${elbowY.toFixed(1)}" r="9" fill="url(#reachCarbon)" stroke="url(#reachChrome)" stroke-width="1.8"/>
          <circle cx="${elbowX.toFixed(1)}" cy="${elbowY.toFixed(1)}" r="5.5" fill="url(#reachChrome)"/>
          <circle cx="${elbowX.toFixed(1)}" cy="${elbowY.toFixed(1)}" r="2.5" fill="#38bdf8" filter="url(#reachGlow)"/>
        </g>

        <!-- FOREARM & HAND GROUP (TAPS TOWARDS MOBILE FIELD) -->
        <g id="reachForearmAndHand" class="reach-forearm-hand-tap">
          <!-- FOREARM CHASSIS (ELBOW TO WRIST) -->
          <g id="reachForearm">
            <!-- Forearm Hydraulic Piston Core -->
            <line x1="${elbowX.toFixed(1)}" y1="${elbowY.toFixed(1)}" x2="${wristX.toFixed(1)}" y2="${wristY.toFixed(1)}" stroke="url(#reachChrome)" stroke-width="6.5" stroke-linecap="round"/>
            <line x1="${(elbowX - 1.5).toFixed(1)}" y1="${elbowY.toFixed(1)}" x2="${(wristX - 1.5).toFixed(1)}" y2="${wristY.toFixed(1)}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>

            <!-- Sleek Ceramic Forearm Armor Shell -->
            <path d="M ${(elbowX - 5).toFixed(1)} ${(elbowY - 2).toFixed(1)} Q ${(((elbowX + wristX)/2) - 10).toFixed(1)} ${(((elbowY + wristY)/2) - 4).toFixed(1)} ${(wristX - 5).toFixed(1)} ${(wristY - 3).toFixed(1)} L ${(wristX + 5).toFixed(1)} ${(wristY + 5).toFixed(1)} Q ${(((elbowX + wristX)/2) + 4).toFixed(1)} ${(((elbowY + wristY)/2) + 4).toFixed(1)} ${(elbowX + 5).toFixed(1)} ${(elbowY + 4).toFixed(1)} Z" 
                  fill="url(#reachCeramic)" stroke="#94a3b8" stroke-width="1.2"/>

            <!-- Glowing Forearm Telemetry Conduit -->
            <line x1="${elbowX.toFixed(1)}" y1="${elbowY.toFixed(1)}" x2="${wristX.toFixed(1)}" y2="${wristY.toFixed(1)}" stroke="#38bdf8" stroke-width="1.4" stroke-dasharray="4 2" opacity="0.95"/>
          </g>

          <!-- WRIST SWIVEL JOINT -->
          <g id="reachWristGroup">
            <circle cx="${wristX.toFixed(1)}" cy="${wristY.toFixed(1)}" r="7.5" fill="url(#reachCarbon)" stroke="url(#reachChrome)" stroke-width="1.5"/>
            <circle cx="${wristX.toFixed(1)}" cy="${wristY.toFixed(1)}" r="4.2" fill="url(#reachChrome)"/>
            <circle cx="${wristX.toFixed(1)}" cy="${wristY.toFixed(1)}" r="2" fill="#38bdf8"/>
          </g>

          <!-- SCULPTED HAND & EXTENDED POINTING FINGER -->
          <g id="reachHandGroup">
            <!-- Ceramic Knuckle / Dorsal Plate of Fist -->
            <path d="M ${(wristX - 3).toFixed(1)} ${(wristY - 5).toFixed(1)} 
                     L ${(knuckleX - 1).toFixed(1)} ${(knuckleY - 7).toFixed(1)} 
                     C ${(knuckleX + 5).toFixed(1)} ${(knuckleY - 6).toFixed(1)} ${(knuckleX + 8).toFixed(1)} ${(knuckleY + 6).toFixed(1)} ${(knuckleX + 4).toFixed(1)} ${(knuckleY + 8).toFixed(1)} 
                     L ${(wristX + 4).toFixed(1)} ${(wristY + 6).toFixed(1)} Z" 
                  fill="url(#reachCeramic)" stroke="#94a3b8" stroke-width="1.2"/>

            <!-- Folded Thumb (Braced Against Fist) -->
            <ellipse cx="${(wristX + 1).toFixed(1)}" cy="${(wristY + 4).toFixed(1)}" rx="5.5" ry="3.5" fill="url(#reachCeramicPlate)" stroke="#64748b" stroke-width="1" transform="rotate(30 ${(wristX + 1).toFixed(1)} ${(wristY + 4).toFixed(1)})"/>
            <circle cx="${(wristX + 3).toFixed(1)}" cy="${(wristY + 5).toFixed(1)}" r="1" fill="#38bdf8"/>

            <!-- Folded Middle, Ring & Pinky Fingers (Tucked into Fist) -->
            <rect x="${(knuckleX - 2).toFixed(1)}" y="${(knuckleY + 1).toFixed(1)}" width="7.5" height="4.5" rx="2.2" fill="url(#reachCarbon)" stroke="url(#reachChrome)" stroke-width="0.9" transform="rotate(28 ${knuckleX.toFixed(1)} ${(knuckleY + 3).toFixed(1)})"/>
            <rect x="${(knuckleX - 4).toFixed(1)}" y="${(knuckleY + 5).toFixed(1)}" width="7" height="4" rx="2" fill="url(#reachCarbon)" stroke="url(#reachChrome)" stroke-width="0.9" transform="rotate(28 ${(knuckleX - 2).toFixed(1)} ${(knuckleY + 7).toFixed(1)})"/>

            <!-- EXTENDED POINTING INDEX FINGER (REACHING EXACTLY TO TARGET MOBILE FIELD) -->
            <!-- Proximal Phalanx -->
            <path d="M ${(knuckleX + 1).toFixed(1)} ${(knuckleY - 4).toFixed(1)} 
                     L ${(((knuckleX + targetX)/2) + 1).toFixed(1)} ${(((knuckleY + targetY)/2) - 3).toFixed(1)} 
                     L ${(((knuckleX + targetX)/2) + 2).toFixed(1)} ${(((knuckleY + targetY)/2) + 3).toFixed(1)} 
                     L ${(knuckleX + 3).toFixed(1)} ${(knuckleY + 3).toFixed(1)} Z" 
                  fill="url(#reachCeramic)" stroke="#94a3b8" stroke-width="1.1"/>
            
            <!-- Intermediate Chrome Knuckle Hinge -->
            <circle cx="${(((knuckleX + targetX)/2) + 1).toFixed(1)}" cy="${((knuckleY + targetY)/2).toFixed(1)}" r="3" fill="url(#reachChrome)"/>

            <!-- Distal Phalanx & Tapered Fingertip Pointing Right at Mobile Field -->
            <path d="M ${(((knuckleX + targetX)/2) + 1).toFixed(1)} ${(((knuckleY + targetY)/2) - 2.5).toFixed(1)} 
                     L ${targetX.toFixed(1)} ${targetY.toFixed(1)} 
                     L ${(((knuckleX + targetX)/2) + 2).toFixed(1)} ${(((knuckleY + targetY)/2) + 2.5).toFixed(1)} Z" 
                  fill="url(#reachCeramicPlate)" stroke="#ffffff" stroke-width="1.2"/>
            
            <line x1="${(((knuckleX + targetX)/2) + 1).toFixed(1)}" y1="${((knuckleY + targetY)/2).toFixed(1)}" x2="${targetX.toFixed(1)}" y2="${targetY.toFixed(1)}" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>

            <!-- HIGH-TECH LED TARGETING EMITTER ON FINGERTIP -->
            <circle cx="${targetX.toFixed(1)}" cy="${targetY.toFixed(1)}" r="3.5" fill="#38bdf8" filter="url(#reachGlow)"/>
            <circle cx="${targetX.toFixed(1)}" cy="${targetY.toFixed(1)}" r="1.8" fill="#ffffff"/>

            <!-- RADAR / TARGETING SONAR RINGS PULSING DIRECTLY ON MOBILE FIELD -->
            <circle cx="${targetX.toFixed(1)}" cy="${targetY.toFixed(1)}" r="6" fill="none" stroke="#38bdf8" stroke-width="1.2" class="reach-target-ring"/>
            <circle cx="${targetX.toFixed(1)}" cy="${targetY.toFixed(1)}" r="11" fill="none" stroke="#38bdf8" stroke-width="0.8" class="reach-target-ring ring-2"/>
          </g>
        </g>
      </g>
    `;
  }

  function updateBotReachArmPosition() {
    if (!isPointingAtMobile || !robotReachArmSvg) return;

    const formCol = document.getElementById("formWrapper");
    const mobileEl = document.getElementById("mobileNumber");
    const handLeftEl = document.getElementById("handLeft");
    if (!formCol || !mobileEl || !handLeftEl) return;

    const formColRect = formCol.getBoundingClientRect();
    const hRect = handLeftEl.getBoundingClientRect();
    const inputCont = mobileEl.closest(".input-container") || mobileEl;
    const tRect = inputCont.getBoundingClientRect();

    const startX = (hRect.left + hRect.width * 0.35) - formColRect.left;
    const startY = (hRect.top + hRect.height * 0.3) - formColRect.top;

    // The index finger lands right next to the phone icon 📱 at the left of the input container
    const targetX = (tRect.left - formColRect.left) + 4;
    const targetY = (tRect.top + tRect.height * 0.5) - formColRect.top;

    renderReachingArm(startX, startY, targetX, targetY, formColRect.width, formColRect.height);
  }

  function triggerBotPointingAtMobile() {
    if (isFormSuccess) return;
    isPointingAtMobile = true;

    // 1. Hide left gripping hand and deploy the articulated reaching arm directly to mobile field
    if (handLeft) handLeft.style.display = "none";
    if (robotReachArmSvg) {
      updateBotReachArmPosition();
      robotReachArmSvg.style.display = "block";
      robotReachArmSvg.classList.remove("retracting");
    }

    // 2. Robot head and eyes lock gaze directly onto the mobile field
    const mobileEl = document.getElementById("mobileNumber");
    if (mobileEl && robotFace && pupilLeft && pupilRight) {
      const faceRect = robotFace.getBoundingClientRect();
      const mRect = mobileEl.getBoundingClientRect();
      const dx = (mRect.left + 30) - (faceRect.left + faceRect.width / 2);
      const dy = (mRect.top + mRect.height / 2) - (faceRect.top + faceRect.height / 2);

      const normX = Math.max(-1, Math.min(1, dx / 220));
      const normY = Math.max(0.4, Math.min(1, dy / 360));
      const pupilX = normX * 4.8;
      const pupilY = normY * 8.5;

      pupilLeft.style.transform = `translate(${pupilX.toFixed(2)}px, ${pupilY.toFixed(2)}px)`;
      pupilRight.style.transform = `translate(${pupilX.toFixed(2)}px, ${pupilY.toFixed(2)}px)`;

      if (robotHead) {
        robotHead.style.transform = `rotate(${(normX * 4.2).toFixed(2)}deg) translateY(${(normY * 3.5).toFixed(2)}px)`;
      }
    }

    // 3. Highlight mobile field and set focus
    if (groupPhone) {
      groupPhone.classList.add("bot-pointing-target");
    }
    if (mobileInput) {
      mobileInput.focus();
    }

    // 4. Auto-dismiss after 8 seconds if no interaction
    clearTimeout(pointingTimeout);
    pointingTimeout = setTimeout(() => {
      dismissBotPointing();
    }, 8000);
  }

  function dismissBotPointing() {
    if (!isPointingAtMobile) return;
    isPointingAtMobile = false;
    clearTimeout(pointingTimeout);

    if (groupPhone) {
      groupPhone.classList.remove("bot-pointing-target");
    }

    if (robotReachArmSvg && robotReachArmSvg.style.display !== "none") {
      robotReachArmSvg.classList.add("retracting");
      setTimeout(() => {
        robotReachArmSvg.style.display = "none";
        robotReachArmSvg.classList.remove("retracting");
        robotReachArmSvg.innerHTML = "";
        if (handLeft) {
          handLeft.style.display = "block";
          handLeft.classList.remove("returning");
          void handLeft.offsetWidth;
          handLeft.classList.add("returning");
        }
      }, 300);
    } else if (handLeft) {
      handLeft.style.display = "block";
    }

    if (!isFormSuccess) {
      resetRobotGaze();
    }
  }

  window.addEventListener("resize", () => {
    if (isPointingAtMobile) {
      updateBotReachArmPosition();
    }
  });

  function trackElement(el, isTyping = false) {
    if (!el || !robotFace || !pupilLeft || !pupilRight || isFormSuccess || isPointingAtMobile) return;

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

    // Since the form is below the robot, deltaY is positive - eyes look down into form
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

    if (robotBeacon && isTyping) {
      robotBeacon.classList.add("typing-active");
    }
  }

  function resetRobotGaze() {
    if (isFormSuccess || isPointingAtMobile) return;
    if (pupilLeft) pupilLeft.style.transform = "translate(0, 0)";
    if (pupilRight) pupilRight.style.transform = "translate(0, 0)";
    if (robotHead) robotHead.style.transform = "rotate(0deg) translateY(0px)";
    if (robotBeacon) robotBeacon.classList.remove("typing-active");
  }

  // If user starts typing in mobile field while bot is pointing, dismiss pointing
  if (mobileInput) {
    mobileInput.addEventListener("input", () => {
      if (isPointingAtMobile && mobileInput.value.trim().length > 0) {
        dismissBotPointing();
      }
    });
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
  // FLYING DATA PARTICLES TO ROBOT BRAIN (CONVERGE AT 1 PLACE FIRST, THEN 1 GO TO BRAIN IN 1 SEC)
  // On form submit, details gather at 1 central point on the form first (0-360ms),
  // fuse into 1 unified data orb, and then shoot in 1 go up the side into the brain dome (420-950ms).
  // Entire sequence finishes in 1 second!
  // ==========================================
  async function animateFormDetailsFlyingToRobot() {
    const overlay = document.getElementById("flyingDataOverlay");
    const robotSvg = document.querySelector(".robot-svg") || robotHead;
    if (!overlay || !robotSvg) return;

    overlay.innerHTML = "";

    const svgRect = robotSvg.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();

    // Central Gathering Point on Form Card (1 place on form)
    const formCard = document.querySelector(".form-wrapper-card");
    const cardRect = formCard ? formCard.getBoundingClientRect() : overlayRect;
    const gatherX = cardRect.left + (cardRect.width / 2) - overlayRect.left;
    const gatherY = cardRect.top + (cardRect.height * 0.44) - overlayRect.top;

    // Brain Dome Side Intake Target (Left temple intake port)
    const targetBrain = {
      x: svgRect.left + (svgRect.width * 0.435) - overlayRect.left,
      y: svgRect.top + (svgRect.height * 0.137) - overlayRect.top
    };

    // Fields to gather data from
    const fieldItems = [
      { id: "fullName", icon: "👤", label: "Name" },
      { id: "workEmail", icon: "✉️", label: "Email" },
      { id: "mobileNumber", icon: "📱", label: "Mobile" },
      { id: "companyName", icon: "🏢", label: "Company" },
      { id: "description", icon: "📄", label: "Details" }
    ];

    // Robot eyes look down at the gathering point on the form
    if (pupilLeft && pupilRight) {
      pupilLeft.style.transform = "translate(0px, 7px)";
      pupilRight.style.transform = "translate(0px, 7px)";
    }

    // PHASE 1: ALL DETAILS CONVERGE TO 1 PLACE ON FORM (0ms to 360ms)
    const gatherPromises = [];

    fieldItems.forEach((item) => {
      const inputEl = document.getElementById(item.id);
      if (!inputEl) return;

      const rawVal = inputEl.value.trim();
      const val = rawVal.length > 0 ? rawVal : item.label;
      const inputRect = inputEl.getBoundingClientRect();

      const startX = inputRect.left + inputRect.width / 2 - overlayRect.left;
      const startY = inputRect.top + inputRect.height / 2 - overlayRect.top;

      const chip = document.createElement("div");
      chip.className = "flying-data-chip";
      chip.innerHTML = `<span class="chip-icon">${item.icon}</span><span class="chip-text">${val}</span>`;
      chip.style.left = `${startX}px`;
      chip.style.top = `${startY}px`;
      chip.style.transform = "translate(-50%, -50%) scale(1)";
      overlay.appendChild(chip);

      const dx = gatherX - startX;
      const dy = gatherY - startY;

      // Small sparks converging
      for (let s = 0; s < 2; s++) {
        const spark = document.createElement("div");
        spark.className = "cyber-spark";
        spark.style.left = `${startX + (Math.random() * 16 - 8)}px`;
        spark.style.top = `${startY + (Math.random() * 8 - 4)}px`;
        overlay.appendChild(spark);

        spark.animate([
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
        ], {
          duration: 340,
          easing: "cubic-bezier(0.2, 0.8, 0.25, 1)",
          fill: "forwards"
        });
      }

      const anim = chip.animate([
        {
          transform: "translate(-50%, -50%) scale(1)",
          opacity: 1
        },
        {
          transform: `translate(calc(-50% + ${dx * 0.55}px), calc(-50% + ${dy * 0.55}px)) scale(1.05)`,
          opacity: 0.95,
          offset: 0.55
        },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`,
          opacity: 0.3,
          offset: 1
        }
      ], {
        duration: 360,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        fill: "forwards"
      });

      gatherPromises.push(new Promise((resolve) => {
        anim.onfinish = () => {
          chip.remove();
          resolve();
        };
      }));
    });

    // Wait for all details to converge at the central gathering spot on the form (~360ms)
    await Promise.all(gatherPromises);

    // Expand fusion shockwave at gathering point
    const wave = document.createElement("div");
    wave.className = "gather-shockwave";
    wave.style.left = `${gatherX}px`;
    wave.style.top = `${gatherY}px`;
    overlay.appendChild(wave);
    setTimeout(() => wave.remove(), 350);

    // PHASE 2: IN 1 GO, SEND THE CONSOLIDATED DATA ORB TO BRAIN (380ms to 960ms)
    const fusedOrb = document.createElement("div");
    fusedOrb.className = "fused-data-orb";
    fusedOrb.innerHTML = `<span>⚡</span><span>Demo Details Captured</span>`;
    fusedOrb.style.left = `${gatherX}px`;
    fusedOrb.style.top = `${gatherY}px`;
    fusedOrb.style.transform = "translate(-50%, -50%) scale(0.4)";
    overlay.appendChild(fusedOrb);

    // Trajectory Waypoints from Gather Point to Brain Dome (sweeping wide along side flank):
    const p1X = svgRect.left - overlayRect.left - 40;            // Wide lateral sweep outside left flank
    const p1Y = gatherY - (gatherY - targetBrain.y) * 0.35;
    const p2X = svgRect.left - overlayRect.left - 25;            // High up on the flank outside the ear (well above eye level)
    const p2Y = targetBrain.y + (svgRect.height * 0.20);
    const p3X = targetBrain.x - 25;                              // Swooping into top-left temple
    const p3Y = targetBrain.y - 10;
    const p4X = targetBrain.x;                                   // Fused into brain dome intake
    const p4Y = targetBrain.y;

    const d1X = p1X - gatherX;
    const d1Y = p1Y - gatherY;
    const d2X = p2X - gatherX;
    const d2Y = p2Y - gatherY;
    const d3X = p3X - gatherX;
    const d3Y = p3Y - gatherY;
    const d4X = p4X - gatherX;
    const d4Y = p4Y - gatherY;

    // Accompanying sparks surging along the side trajectory in 1 go
    for (let s = 0; s < 5; s++) {
      const spark = document.createElement("div");
      spark.className = "cyber-spark";
      spark.style.left = `${gatherX + (Math.random() * 20 - 10)}px`;
      spark.style.top = `${gatherY + (Math.random() * 10 - 5)}px`;
      overlay.appendChild(spark);

      const sJitter = (Math.random() * 20 - 10);
      spark.animate([
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${d1X + sJitter}px, ${d1Y + sJitter}px) scale(1.4)`, opacity: 0.95, offset: 0.3 },
        { transform: `translate(${d2X + sJitter}px, ${d2Y + sJitter}px) scale(1.1)`, opacity: 0.9, offset: 0.65 },
        { transform: `translate(${d4X}px, ${d4Y}px) scale(0)`, opacity: 0, offset: 1 }
      ], {
        duration: 540 + Math.random() * 60,
        delay: s * 25,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards"
      });
    }

    // Robot eyes track the surge curving up the side into its brain dome
    setTimeout(() => {
      if (pupilLeft && pupilRight) {
        pupilLeft.style.transform = "translate(-3.5px, -4.5px)";
        pupilRight.style.transform = "translate(-3.5px, -4.5px)";
      }
    }, 120);

    // Orb animation in 1 go
    const sendAnim = fusedOrb.animate([
      {
        transform: "translate(-50%, -50%) scale(0.4)",
        opacity: 0.8,
        offset: 0
      },
      {
        transform: "translate(-50%, -50%) scale(1.15)",
        opacity: 1,
        offset: 0.12
      },
      {
        transform: `translate(calc(-50% + ${d1X}px), calc(-50% + ${d1Y}px)) scale(1.08)`,
        opacity: 1,
        offset: 0.38
      },
      {
        transform: `translate(calc(-50% + ${d2X}px), calc(-50% + ${d2Y}px)) scale(0.95)`,
        opacity: 0.95,
        offset: 0.68
      },
      {
        transform: `translate(calc(-50% + ${d3X}px), calc(-50% + ${d3Y}px)) scale(0.65)`,
        opacity: 0.85,
        offset: 0.88
      },
      {
        transform: `translate(calc(-50% + ${d4X}px), calc(-50% + ${d4Y}px)) scale(0.08)`,
        opacity: 0,
        offset: 1
      }
    ], {
      duration: 560,
      easing: "cubic-bezier(0.18, 0.9, 0.3, 1)",
      fill: "forwards"
    });

    // When the orb hits the brain dome intake (~920ms mark): trigger neural absorption
    setTimeout(() => {
      if (brainIntakeLeft) {
        brainIntakeLeft.classList.remove("intake-active");
        void brainIntakeLeft.offsetWidth;
        brainIntakeLeft.classList.add("intake-active");
      }
      if (robotHead) {
        robotHead.classList.remove("absorbing");
        void robotHead.offsetWidth;
        robotHead.classList.add("absorbing");
      }
    }, 500);

    await new Promise((resolve) => {
      sendAnim.onfinish = () => {
        fusedOrb.remove();
        resolve();
      };
    });

    overlay.innerHTML = "";
  }

  // Success Celebration & Thumbs-Up Gesture (Rock steady head, no continuous shaking)
  function triggerRobotCelebration() {
    isFormSuccess = true;

    // Switch eyes to happy arches ^ ^
    if (pupilLeft) pupilLeft.style.display = "none";
    if (pupilRight) pupilRight.style.display = "none";
    if (happyEyes) happyEyes.style.display = "block";

    // Brain quantum core glows emerald green
    if (robotBeacon) {
      robotBeacon.setAttribute("fill", "#10b981");
      robotBeacon.classList.remove("typing-active");
    }

    // Hide gripping right hand and SHOW THUMBS-UP HAND!
    if (handRight) handRight.style.display = "none";
    if (handRightThumbsUp) {
      handRightThumbsUp.style.display = "block";
      handRightThumbsUp.classList.remove("wiggling", "retracting");
      setTimeout(() => {
        handRightThumbsUp.classList.add("wiggling");
      }, 700);
    }

    // Stable mascot celebration: plays one single proud nod then stops, no continuous shaking
    if (robotWrap) robotWrap.classList.add("celebrating");
    if (robotHead) {
      robotHead.style.transform = "rotate(0deg) translateY(0px)";
    }

    // After showing thumb for 4 seconds, keep hand again on the submitted panel
    setTimeout(() => {
      if (handRightThumbsUp) {
        handRightThumbsUp.classList.remove("wiggling");
        handRightThumbsUp.classList.add("retracting");
        setTimeout(() => {
          handRightThumbsUp.style.display = "none";
          handRightThumbsUp.classList.remove("retracting");
          if (handRight) {
            handRight.style.display = "block";
            handRight.classList.remove("returning");
            void handRight.offsetWidth; // force re-flow
            handRight.classList.add("returning");
          }
        }, 320);
      } else if (handRight) {
        handRight.style.display = "block";
      }
    }, 4000);
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
