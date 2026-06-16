/**
 * clock.js
 * Drives the live clock shown in the status bar on every page.
 * Kept separate so both login.html and index.html can share it.
 */

function formatTime(date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  return `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Starts a live-updating clock that writes into the given element IDs.
 * @param {string} timeId - id of the element that should show HH:MM:SS
 * @param {string} dateId - id of the element that should show the date (optional)
 */
function startStatusClock(timeId, dateId) {
  const timeEl = document.getElementById(timeId);
  const dateEl = dateId ? document.getElementById(dateId) : null;

  function tick() {
    const now = new Date();
    if (timeEl) timeEl.textContent = formatTime(now);
    if (dateEl) dateEl.textContent = formatDate(now);
  }

  tick();
  setInterval(tick, 1000);
}

/**
 * Returns a greeting string based on the current hour, used on the
 * portfolio hero so the page feels alive/time-aware.
 */
function getTimeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Burning the midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}
