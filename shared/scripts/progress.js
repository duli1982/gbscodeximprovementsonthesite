const PROGRESS_KEY = 'sectionProgress';
const BADGE_THRESHOLDS = [1, 5, 10];
const BADGE_CLASSES = ['badge-bronze', 'badge-silver', 'badge-gold'];

function getData() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveData(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function markComplete(sectionId) {
  if (!sectionId) return;
  const data = getData();
  data[sectionId] = (data[sectionId] || 0) + 1;
  saveData(data);
  updateProgressUI(sectionId);
}

function updateProgressUI(sectionId) {
  const data = getData();
  const count = data[sectionId] || 0;
  const max = BADGE_THRESHOLDS[BADGE_THRESHOLDS.length - 1];
  const percent = Math.min((count / max) * 100, 100);

  const card = document.querySelector(`[data-section-id="${sectionId}"]`);
  if (!card) return;

  const bar = card.querySelector('.progress-bar-fill');
  if (bar) bar.style.width = `${percent}%`;

  const label = card.querySelector('.progress-label');
  if (label) label.textContent = `${Math.round(percent)}% complete`;

  const badgeContainer = card.querySelector('.badge-container');
  if (badgeContainer) {
    badgeContainer.innerHTML = '';
    BADGE_THRESHOLDS.forEach((th, idx) => {
      if (count >= th) {
        const span = document.createElement('span');
        span.className = `badge ${BADGE_CLASSES[idx]}`;
        span.textContent = BADGE_CLASSES[idx].replace('badge-', '').toUpperCase();
        badgeContainer.appendChild(span);
      }
    });
  }
}

function initProgressUI() {
  document.querySelectorAll('[data-section-id]').forEach(card => {
    const id = card.getAttribute('data-section-id');
    updateProgressUI(id);
  });
}

document.addEventListener('DOMContentLoaded', initProgressUI);

// expose API globally
window.markComplete = markComplete;
