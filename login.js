/**
 * login.js
 * Handles regex-based validation for the sign-in form and a simple
 * client-side "auth" check against demo credentials. There is no
 * backend here — this purely demonstrates form validation with
 * regular expressions, then gates access to index.html using
 * sessionStorage.
 */

// ---- Regex patterns -------------------------------------------------
const PW_LENGTH_REGEX = /.{8,}/;
const PW_UPPER_REGEX = /[A-Z]/;
const PW_NUMBER_REGEX = /[0-9]/;

// Demo account — username must be Student.
const DEMO_USERNAME = "Student";
const DEMO_PASSWORD = "Student123";

// ---- Elements ---------------------------------------------------------
const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const usernameError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const formBanner = document.getElementById("formBanner");
const pwRules = document.querySelectorAll("#pwRules li");

// ---- Live clock + footer year -----------------------------------------
startStatusClock("statusTime", "statusDate");
const liveYearEl = document.getElementById("liveYear");
if (liveYearEl) {
  liveYearEl.textContent = new Date().getFullYear();
}

// If already signed in this session, skip straight to the portfolio.
if (sessionStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "index.html";
}

// ---- Validation helpers -------------------------------------------------
function validateUsername(showError) {
  const value = usernameInput.value.trim();
  const valid = value.toLowerCase() === DEMO_USERNAME.toLowerCase();

  usernameInput.classList.toggle("is-valid", valid && value.length > 0);
  usernameInput.classList.toggle("is-invalid", showError && !valid);
  usernameError.textContent = showError && !valid ? "Username must be Student." : "";

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
usernameInput.addEventListener("input", () => validateUsername(false));
usernameInput.addEventListener("blur", () => validateUsername(true));

passwordInput.addEventListener("input", () => validatePassword(false));
passwordInput.addEventListener("blur", () => validatePassword(true));

// ---- Submit -------------------------------------------------------------
form.addEventListener("submit", (event) => {
  event.preventDefault();
  hideBanner();

  const usernameValid = validateUsername(true);
  const passwordValid = validatePassword(true);

  if (!usernameValid || !passwordValid) {
    showBanner("Fix the highlighted fields before signing in.", "error");
    return;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  const isMatch = username === DEMO_USERNAME && password === DEMO_PASSWORD;

  if (!isMatch) {
    showBanner("That username and password combination isn't recognized. Try the demo credentials below.", "error");
    return;
  }

  showBanner("Signed in. Redirecting…", "success");
  sessionStorage.setItem("isLoggedIn", "true");
  sessionStorage.setItem("username", username);

  setTimeout(() => {
    window.location.href = "index.html";
  }, 500);
});
