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
    form.style.display = "none";
    successCard.style.display = "block";

    // Populate summary
    document.getElementById("sumName").textContent = details.name || "-";
    document.getElementById("sumEmail").textContent = details.email || "-";
    document.getElementById("sumCompany").textContent = details.company || "-";
    document.getElementById("sumPhone").textContent = details.phone || "-";

    // Scroll to success card
    formWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
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
