/**
 * login.js
 * Handles regex-based validation for the sign-in form and a simple
 * client-side "auth" check against demo credentials. There is no
 * backend here — this purely demonstrates form validation with
 * regular expressions, then gates access to index.html using
 * sessionStorage.
 */

// ---- Regex patterns -------------------------------------------------
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PW_LENGTH_REGEX = /.{8,}/;
const PW_UPPER_REGEX = /[A-Z]/;
const PW_NUMBER_REGEX = /[0-9]/;

// Demo account — swap for whatever you want people to type in.
const DEMO_EMAIL = "demo@student.dev";
const DEMO_PASSWORD = "Student123";

// ---- Elements ---------------------------------------------------------
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const formBanner = document.getElementById("formBanner");
const pwRules = document.querySelectorAll("#pwRules li");

// ---- Live clock + footer year -----------------------------------------
startStatusClock("statusTime", "statusDate");
document.getElementById("liveYear").textContent = new Date().getFullYear();

// If already signed in this session, skip straight to the portfolio.
if (sessionStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "index.html";
}

// ---- Validation helpers -------------------------------------------------
function validateEmail(showError) {
  const value = emailInput.value.trim();
  const valid = EMAIL_REGEX.test(value);

  emailInput.classList.toggle("is-valid", valid && value.length > 0);
  emailInput.classList.toggle("is-invalid", showError && !valid);
  emailError.textContent = showError && !valid ? "Enter a valid email address (e.g. name@example.com)." : "";

  return valid;
}

function validatePassword(showError) {
  const value = passwordInput.value;

  const checks = {
    length: PW_LENGTH_REGEX.test(value),
    upper: PW_UPPER_REGEX.test(value),
    number: PW_NUMBER_REGEX.test(value),
  };

  pwRules.forEach((li) => {
    const rule = li.getAttribute("data-rule");
    li.classList.toggle("met", checks[rule]);
  });

  const valid = checks.length && checks.upper && checks.number;

  passwordInput.classList.toggle("is-valid", valid);
  passwordInput.classList.toggle("is-invalid", showError && !valid);
  passwordError.textContent = showError && !valid ? "Password doesn't meet the requirements above." : "";

  return valid;
}

function showBanner(message, type) {
  formBanner.textContent = message;
  formBanner.className = `form-banner show ${type}`;
}

function hideBanner() {
  formBanner.className = "form-banner";
}

// ---- Live validation while typing (no error text until they leave the field) ----
emailInput.addEventListener("input", () => validateEmail(false));
emailInput.addEventListener("blur", () => validateEmail(true));

passwordInput.addEventListener("input", () => validatePassword(false));
passwordInput.addEventListener("blur", () => validatePassword(true));

// ---- Submit -------------------------------------------------------------
form.addEventListener("submit", (event) => {
  event.preventDefault();
  hideBanner();

  const emailValid = validateEmail(true);
  const passwordValid = validatePassword(true);

  if (!emailValid || !passwordValid) {
    showBanner("Fix the highlighted fields before signing in.", "error");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const isMatch =
    email.toLowerCase() === DEMO_EMAIL.toLowerCase() && password === DEMO_PASSWORD;

  if (!isMatch) {
    showBanner("That email and password combination isn't recognized. Try the demo credentials below.", "error");
    return;
  }

  showBanner("Signed in. Redirecting…", "success");
  sessionStorage.setItem("isLoggedIn", "true");
  sessionStorage.setItem("userEmail", email);

  setTimeout(() => {
    window.location.href = "index.html";
  }, 500);
});
