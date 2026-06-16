/**
 * app.js
 * Powers the portfolio page: the login gate, the status-bar + hero
 * clocks, mobile nav, the Shift Tracker time-clock demo modal, and
 * regex validation on the contact form.
 */

// ---- Auth gate ------------------------------------------------------
// No real backend — this just checks the flag login.js set before
// letting anyone view the page directly.
if (sessionStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

document.getElementById("userEmailDisplay").textContent =
  sessionStorage.getItem("userEmail") || "";

document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("userEmail");
  window.location.href = "login.html";
});

// ---- Clocks -----------------------------------------------------------
startStatusClock("statusTime", "statusDate");
startStatusClock("heroTime", "heroDate");
document.getElementById("heroGreeting").textContent =
  `${getTimeOfDayGreeting()}, you're looking at —`;
document.getElementById("footerYear").textContent = new Date().getFullYear();

// ---- Mobile nav toggle --------------------------------------------------
const navToggle = document.getElementById("navToggle");
const navMobile = document.getElementById("navMobile");

navToggle.addEventListener("click", () => {
  const isOpen = navMobile.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navMobile.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navMobile.classList.remove("open"));
});

// =========================================================
// SHIFT TRACKER — the embedded time-clock demo project
// =========================================================
const overlay = document.getElementById("clockModalOverlay");
const openBtn = document.getElementById("openClockModal");
const closeBtn = document.getElementById("closeClockModal");
const modalTime = document.getElementById("modalClockTime");
const modalStatus = document.getElementById("modalClockStatus");
const clockInBtn = document.getElementById("clockInBtn");
const clockOutBtn = document.getElementById("clockOutBtn");
const logEmpty = document.getElementById("clockLogEmpty");
const logTable = document.getElementById("clockLogTable");
const logBody = document.getElementById("clockLogBody");

let activeClockIn = null; // Date when the current session started
let sessionCount = 0;

function tickModalClock() {
  modalTime.textContent = new Date().toLocaleTimeString();
}
tickModalClock();
setInterval(tickModalClock, 1000);

function openModal() {
  overlay.classList.add("open");
}
function closeModal() {
  overlay.classList.remove("open");
}

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
});

function formatDuration(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

clockInBtn.addEventListener("click", () => {
  activeClockIn = new Date();
  modalStatus.textContent = "Clocked in";
  modalStatus.classList.add("active");
  clockInBtn.disabled = true;
  clockOutBtn.disabled = false;
});

clockOutBtn.addEventListener("click", () => {
  if (!activeClockIn) return;
  const clockOut = new Date();
  sessionCount += 1;

  logEmpty.style.display = "none";
  logTable.style.display = "table";

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${sessionCount}</td>
    <td>${activeClockIn.toLocaleTimeString()}</td>
    <td>${clockOut.toLocaleTimeString()}</td>
    <td>${formatDuration(clockOut - activeClockIn)}</td>
  `;
  logBody.appendChild(row);

  activeClockIn = null;
  modalStatus.textContent = "Not clocked in";
  modalStatus.classList.remove("active");
  clockInBtn.disabled = false;
  clockOutBtn.disabled = true;
});

// =========================================================
// CONTACT FORM — regex validation, no real send
// =========================================================
const NAME_REGEX = /^[A-Za-z\s'-]{2,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_REGEX = /\S{10,}/; // at least 10 non-whitespace characters somewhere

const contactForm = document.getElementById("contactForm");
const cName = document.getElementById("cName");
const cEmail = document.getElementById("cEmail");
const cMessage = document.getElementById("cMessage");
const contactBanner = document.getElementById("contactBanner");

function validateField(input, errorId, regex, message) {
  const valid = regex.test(input.value.trim());
  const errorEl = document.getElementById(errorId);
  input.classList.toggle("is-invalid", !valid);
  input.classList.toggle("is-valid", valid);
  errorEl.textContent = valid ? "" : message;
  return valid;
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameValid = validateField(cName, "cNameError", NAME_REGEX, "Name should be 2–50 letters (no numbers or symbols).");
  const emailValid = validateField(cEmail, "cEmailError", EMAIL_REGEX, "Enter a valid email address.");
  const messageValid = validateField(cMessage, "cMessageError", MESSAGE_REGEX, "Message should be at least 10 characters.");

  contactBanner.className = "form-banner";

  if (!nameValid || !emailValid || !messageValid) {
    contactBanner.textContent = "Fix the highlighted fields above.";
    contactBanner.className = "form-banner show error";
    return;
  }

  contactBanner.textContent = "Message validated! (This demo doesn't actually send — wire it up to a backend or form service to go live.)";
  contactBanner.className = "form-banner show success";
  contactForm.reset();
  [cName, cEmail, cMessage].forEach((el) => el.classList.remove("is-valid", "is-invalid"));
});

