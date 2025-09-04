import { qs, qsa } from '../shared/scripts/utils/dom-helpers.js';
import { initializeDropdown } from '../shared/scripts/components/dropdown.js';
import { initializeNavigation } from '../shared/scripts/components/navigation.js';

/**
 * Initializes all dropdown components on the page by finding
 * elements with the `data-dropdown` attribute.
 */
function initComponents() {
  try {
    // Initialize all dropdowns
    const dropdownElements = qsa('[data-dropdown]');
    dropdownElements.forEach(initializeDropdown);

    // Initialize mobile navigation
    initializeNavigation();

  } catch (error) {
    console.error("Error initializing core components:", error);
  }
}

/**
 * Initializes the back-to-top button functionality.
 */
function initBackToTopButton() {
  const backToTopBtn = qs('#back-to-top');
  if (!backToTopBtn) return; // Exit if the button isn't on the page

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  backToTopBtn.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', toggleVisibility);
  toggleVisibility(); // Initial check on page load
}

/**
 * Main function to set up the GBS AI Workshop page.
 * This function is the entry point for all JavaScript on the page.
 */
function main() {
  try {
    initComponents();
    initBackToTopButton();
    initQuiz();
    // NOTE: Other page-specific logic (like charts, simulators, etc.)
    // will be progressively moved from the inline script to this file or other modules.
    console.log("GBS AI Workshop page scripts initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize GBS AI Workshop page:", error);
  }
}

// Run the main function when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', main);

function initQuiz() {
  const form = qs('#gbs-quiz-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const answers = {
      q1: data.get('q1'),
      q2: data.get('q2')
    };
    let score = 0;
    const feedback = [];
    if (answers.q1 === 'b') {
      score++;
      feedback.push('Q1 correct! Integrating AI yields faster insights.');
    } else {
      feedback.push('Q1 incorrect. AI can provide faster insights.');
    }
    if (answers.q2 === 'b') {
      score++;
      feedback.push('Q2 correct! The framework advocates building workflows around AI.');
    } else {
      feedback.push('Q2 incorrect. The framework encourages building workflows around AI.');
    }
    localStorage.setItem('gbsWorkshopQuiz', JSON.stringify({ answers, score, date: new Date().toISOString() }));
    const feedbackEl = qs('#gbs-quiz-feedback');
    feedbackEl.innerHTML = `<p class="font-semibold">You scored ${score}/2.</p><ul class="list-disc list-inside mt-2">${feedback.map(f => `<li>${f}</li>`).join('')}</ul>`;
    const certLink = qs('#gbs-download-cert');
    const name = data.get('name') || 'Participant';
    const certText = `Certificate of Completion\n${name}\nScore: ${score}/2`;
    const blob = new Blob([certText], { type: 'text/plain' });
    certLink.href = URL.createObjectURL(blob);
    certLink.classList.remove('hidden');
  });
}
