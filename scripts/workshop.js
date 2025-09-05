import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { firebaseConfig } from './firebase-config.js';
import promptJson from './prompts.json' assert { type: 'json' };

initializeApp(firebaseConfig);

// --- DATA STRUCTURE ---
let promptData = {};
let allPrompts = [];
let lastScrollPosition = 0;

// --- SCROLL TO TOP FUNCTIONALITY ---
const scrollToTopBtn = document.getElementById('scroll-to-top');

// Show/hide scroll to top button based on scroll position
function toggleScrollToTopButton() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Event listeners for scroll to top
window.addEventListener('scroll', toggleScrollToTopButton);
scrollToTopBtn.addEventListener('click', scrollToTop);

/**
 * Flattens the prompt data into a single array for easier searching.
 */
function flattenPrompts() {
    allPrompts = [];
    for (const categoryName in promptData) {
        const category = promptData[categoryName];
        for (const subCategoryName in category) {
            const prompts = category[subCategoryName];
            prompts.forEach(prompt => {
                allPrompts.push({
                    ...prompt,
                    category: categoryName,
                    subcategory: subCategoryName
                });
            });
        }
    }
}

function loadPrompts() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const categoryCardsContainer = document.getElementById('category-cards-container');
    loadingIndicator.classList.remove('hidden');

    try {
        const data = promptJson;
        promptData = data.promptData;
        flattenPrompts();

        const units = Array.from(new Set(allPrompts.map(p => p.unit))).sort();
        units.forEach(unit => {
            const opt = document.createElement('option');
            opt.value = unit;
            opt.textContent = unit;
            unitFilter.appendChild(opt);
        });

        const topRecruitingContainer = document.getElementById('top-recruiting-prompts-list');
        if (topRecruitingContainer) {
            const topRecruitingPrompts = allPrompts
                .filter(p => p.category === 'Recruitment' && p.featured)
                .slice(0, 5);
            topRecruitingContainer.innerHTML = topRecruitingPrompts.map(p => `
                <div class="prompt-block p-4">
                    <h3 class="font-semibold text-lg mb-2">${p.title}</h3>
                    <p class="text-sm text-gray-600 mb-2">${p.description || ''}</p>
                    <a href="#" class="text-blue-600 hover:underline text-sm" onclick="openPrompt('${p.id}','${p.category}','${p.subcategory}')">View Prompt →</a>
                </div>
            `).join('');
        }

        // Check for a prompt ID in the URL to show it directly
        const urlParams = new URLSearchParams(window.location.search);
        const promptIdToShow = urlParams.get('showPrompt');

        if (promptIdToShow) {
            const promptToShow = allPrompts.find(p => p.id === promptIdToShow);
            if (promptToShow) {
                // Use a timeout to ensure the DOM is ready for the view switch
                setTimeout(() => {
                    openPrompt(promptToShow.id, promptToShow.category, promptToShow.subcategory);
                }, 100);
            }
        }

        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = now - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        let featuredPrompt = allPrompts[dayOfYear % allPrompts.length];
        const lastSeenPromptId = localStorage.getItem('lastSeenPromptId');
        if (featuredPrompt && lastSeenPromptId === featuredPrompt.id) {
            featuredPrompt = allPrompts[(dayOfYear + 1) % allPrompts.length];
        }
        if (featuredPrompt) {
            localStorage.setItem('lastSeenPromptId', featuredPrompt.id);
            const container = document.getElementById('featured-prompt');
            if (container) {
                container.innerHTML = `
                    <div class="prompt-block p-6">
                        <h2 class="text-2xl font-semibold mb-2">${featuredPrompt.title}</h2>
                        <p class="text-gray-600 mb-4">${featuredPrompt.description || ''}</p>
                        <a href="#" class="text-blue-600 hover:underline" onclick="openPrompt('${featuredPrompt.id}','${featuredPrompt.category}','${featuredPrompt.subcategory}')">View Prompt →</a>
                    </div>`;
            }
        }

        renderHomepage(); // Initialize UI after data loads

        const promptCount = allPrompts.length;
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const heroSubtitle = document.getElementById('hero-subtitle');
        heroSubtitle.textContent = `Discover ${promptCount} Gemini prompts you have to try in ${month} ${year}!`;

        // --- Animated Subtitle Logic ---
        const animatedSubtitleEl = document.getElementById('animated-subtitle');
        if (animatedSubtitleEl) {
            const subtitles = [
                "Browse by Category...",
                "Search Specific Topics...",
                "Copy & Customize Prompts...",
                "Understand Prompt Structure...",
                "Tailor to Your Needs...",
                "Combine Multiple Prompts...",
                "Master Effective Prompting..."
            ];
            let subtitleIndex = 0;

            function cycleSubtitles() {
                animatedSubtitleEl.classList.remove('subtitle-animate-in');
                animatedSubtitleEl.classList.add('subtitle-animate-out');

                setTimeout(() => {
                    subtitleIndex = (subtitleIndex + 1) % subtitles.length;
                    animatedSubtitleEl.textContent = subtitles[subtitleIndex];
                    animatedSubtitleEl.classList.remove('subtitle-animate-out');
                    animatedSubtitleEl.classList.add('subtitle-animate-in');
                }, 500);
            }

            // Display the first subtitle immediately and then cycle
            cycleSubtitles();
            setInterval(cycleSubtitles, 3000); // Cycle every 3 seconds
        }
    } catch (error) {
        console.error('Failed to load prompts:', error);
        categoryCardsContainer.innerHTML = `
            <div class="text-center text-red-500">
                <p>Error loading prompts. Please try again later.</p>
            </div>
        `;
    } finally {
        loadingIndicator.classList.add('hidden');
        categoryCardsContainer.classList.remove('hidden');
    }
}

// --- DOM ELEMENTS ---
const homepageView = document.getElementById('homepage-view');
const detailView = document.getElementById('detail-view');
const categoryCardsContainer = document.getElementById('category-cards-container');
const promptDisplayArea = document.getElementById('prompt-display-area');
const quickLinksSidebar = document.getElementById('quick-links-sidebar');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const homepageSearchInput = document.getElementById('homepage-search');
const clearSearchBtn = document.getElementById('clear-search-btn');
const unitFilter = document.getElementById('unit-filter');
const gemModal = document.getElementById('gem-modal');
const closeGemModalBtn = document.getElementById('close-gem-modal-btn');
const generateGemBtn = document.getElementById('generate-gem-btn');
const copyGemBtn = document.getElementById('copy-gem-btn');
const generatedGemContainer = document.getElementById('generated-gem-container');
const generatedGemTextarea = document.getElementById('generated-gem');
const tabAllBtn = document.getElementById('tab-all');
const tabFavoritesBtn = document.getElementById('tab-favorites');
let currentTab = 'all';
let selectedUnit = 'All';

// ===== Helpers for Quick Start, Expected Output, and badges =====

/**
 * Highlights search terms in text
 * @param {string} text - The text to highlight
 * @param {string} searchTerm - The term to highlight
 * @returns {string} Text with highlighted search terms
 */
function highlightText(text, searchTerm) {
    if (!searchTerm || !text) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

function getFavoriteIds() {
    try {
        return JSON.parse(localStorage.getItem('favoritePromptIds')) || [];
    } catch {
        return [];
    }
}

function saveFavoriteIds(ids) {
    localStorage.setItem('favoritePromptIds', JSON.stringify(ids));
}

function toggleFavorite(id) {
    const ids = getFavoriteIds();
    const index = ids.indexOf(id);
    if (index >= 0) {
        ids.splice(index, 1);
    } else {
        ids.push(id);
    }
    saveFavoriteIds(ids);
}

function isFavorite(id) {
    return getFavoriteIds().includes(id);
}

function createDifficultyBadge(difficulty) {
    if (!difficulty) return '';
    const map = {
        beginner: { label: 'Beginner', class: 'difficulty-beginner' },
        intermediate: { label: 'Intermediate', class: 'difficulty-intermediate' },
        advanced: { label: 'Advanced', class: 'difficulty-advanced' },
    };
    const cfg = map[difficulty] || map.beginner;
    return `<span class="difficulty-badge ${cfg.class}">${cfg.label}</span>`;
}

function createTimeBadge(estimatedTime) {
    if (!estimatedTime) return '';
    return `<span class="time-badge">${estimatedTime}</span>`;
}

function createQuickStartSection(quickStart) {
    if (!quickStart || !quickStart.steps || quickStart.steps.length === 0) return '';
    const stepsHTML = quickStart.steps.map(step => `<li>${step}</li>`).join('');
    const tipsHTML = quickStart.tips && quickStart.tips.length
        ? `<div class="quick-start-tips"><h4>Pro Tips</h4><ul>${quickStart.tips.map(t => `<li>${t}</li>`).join('')}</ul></div>`
        : '';
    const skin = (quickStart.skin === 'white' || quickStart.skin === 'plain') ? quickStart.skin : 'plain';
    return `
    <div class="quick-start-section ${skin}">
      <div class="quick-start-content">
        <div class="quick-start-title">Quick Start Guide</div>
        <ol class="quick-start-steps">${stepsHTML}</ol>
        ${tipsHTML}
      </div>
    </div>
  `;
}

function createExpectedOutputSection(expectedOutput) {
    if (!expectedOutput) return '';
    return `<div class="expected-output">
    <div class="expected-output-title">What to Expect</div>
    <div class="expected-output-content">${expectedOutput}</div>
  </div>`;
}

// ===== Feedback Helpers =====
const QUICK_FEEDBACK_CONFIG = {
    formAction: 'https://docs.google.com/forms/d/e/1FAIpQLSe3b6jwxKF1u9IiMaTZGi4Z0eK6Ff8g_LuwZQzQ_EimeISFYA/formResponse',
    commentEntry: 'MESSAGE_ENTRY_ID', // replace with actual entry ID for comment field
    promptEntry: 'PROMPT_TITLE_ENTRY_ID', // optional: entry ID to capture prompt title
    typeEntry: 'FEEDBACK_TYPE_ENTRY_ID',
    sectionEntry: 'RELATED_SECTION_ENTRY_ID'
};

function getFeedbackData() {
    return JSON.parse(localStorage.getItem('promptFeedback') || '{}');
}

function saveFeedbackData(data) {
    localStorage.setItem('promptFeedback', JSON.stringify(data));
}

function getUserVotes() {
    return JSON.parse(localStorage.getItem('promptVotes') || '{}');
}

function saveUserVotes(data) {
    localStorage.setItem('promptVotes', JSON.stringify(data));
}

function getFeedbackCounts(id) {
    const data = getFeedbackData();
    return data[id] || { up: 0, down: 0 };
}

function handleVote(id, type) {
    const data = getFeedbackData();
    const votes = getUserVotes();
    const counts = data[id] || { up: 0, down: 0 };
    const previous = votes[id];

    if (previous === type) {
        counts[type] = Math.max(0, counts[type] - 1);
        delete votes[id];
    } else {
        if (previous) {
            counts[previous] = Math.max(0, counts[previous] - 1);
        }
        counts[type] += 1;
        votes[id] = type;
    }

    data[id] = counts;
    saveFeedbackData(data);
    saveUserVotes(votes);
}

function sendQuickComment(prompt, comment) {
    if (!QUICK_FEEDBACK_CONFIG.formAction || QUICK_FEEDBACK_CONFIG.formAction.includes('YOUR_GOOGLE_FORM')) {
        console.warn('Feedback form not configured.');
        return;
    }

    const formData = new FormData();
    if (QUICK_FEEDBACK_CONFIG.typeEntry) formData.append(QUICK_FEEDBACK_CONFIG.typeEntry, 'Prompt Feedback');
    if (QUICK_FEEDBACK_CONFIG.sectionEntry) formData.append(QUICK_FEEDBACK_CONFIG.sectionEntry, 'GBS Prompt Library');
    if (QUICK_FEEDBACK_CONFIG.promptEntry) formData.append(QUICK_FEEDBACK_CONFIG.promptEntry, prompt.title || prompt.id);
    if (QUICK_FEEDBACK_CONFIG.commentEntry) formData.append(QUICK_FEEDBACK_CONFIG.commentEntry, comment);

    fetch(QUICK_FEEDBACK_CONFIG.formAction, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).catch(err => console.error('Quick feedback failed', err));
}

// --- RENDER FUNCTIONS ---
function renderHomepage() {
    categoryCardsContainer.innerHTML = '';
    categoryCardsContainer.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';
    if (selectedUnit !== 'All') {
        const prompts = allPrompts.filter(p => p.unit === selectedUnit);
        if (prompts.length === 0) {
            categoryCardsContainer.innerHTML = `<p class="text-center col-span-full text-gray-500">No prompts found.</p>`;
            return;
        }
        prompts.forEach(prompt => {
            const promptEl = createPromptElement(prompt, true);
            categoryCardsContainer.appendChild(promptEl);
        });
        return;
    }
    for (const categoryName in promptData) {
        const category = promptData[categoryName];
        const subCategories = Object.keys(category);

        // Calculate total prompts in this category
        let totalPrompts = 0;
        for (const subCategoryName in category) {
            totalPrompts += category[subCategoryName].length;
        }

        const card = document.createElement('div');
        card.className = 'prompt-block flex flex-col';

        let subCategoryLinks = subCategories.map(subName =>
            `<li><a href="#" class="block py-1.5 text-gray-500" data-category="${categoryName}" data-subcategory="${subName}">→ ${subName}</a></li>`
        ).join('');

        card.innerHTML = `
            <div class="p-6 text-center">
                <h2 class="text-xl font-bold main-heading accent-text">${categoryName}</h2>
                <p class="text-gray-500 text-sm mt-2">${totalPrompts} prompts available</p>
            </div>
            <div class="flex-grow px-6 category-card-list scrollable-list overflow-y-auto">
                <ul>${subCategoryLinks}</ul>
            </div>
            <div class="p-6 mt-auto">
                <button class="see-all-btn w-full py-2.5 rounded-md font-semibold" data-category="${categoryName}">Explore ${categoryName} →</button>
            </div>
        `;
        categoryCardsContainer.appendChild(card);
    }
}

/**
 * Creates a DOM element for a single prompt.
 * Enhanced: includes badges, Quick Start, and Expected Output sections when available.
 * @param {object} prompt - The prompt object.
 * @param {boolean} isSearchResult - True if the prompt is for a search result.
 * @param {string} searchTerm - The term to highlight in the prompt.
 * @returns {HTMLElement} The created prompt element.
 */
function createPromptElement(prompt, isSearchResult = false, searchTerm = '') {
    const promptEl = document.createElement('div');
    promptEl.id = prompt.id;
    const escapedContent = (prompt.content || '').replace(/"/g, '&quot;');

    const titleClass = isSearchResult ? 'text-lg' : 'text-xl';
    const breadcrumbHTML = isSearchResult
        ? `<p class="text-gray-500 text-sm mb-3"><span class="font-semibold">${prompt.category}</span> &gt; <span>${prompt.subcategory}</span></p>`
        : '';

    const descriptionHTML = prompt.description ? `<p class="text-gray-600 text-sm mb-3">${prompt.description}</p>` : '';
    const contentContainerClass = isSearchResult
        ? 'prompt-display-item p-4 text-gray-700 bg-gray-50 rounded-md'
        : 'prompt-display-item p-4 text-gray-700';

    const highlightedTitle = isSearchResult ? highlightText(prompt.title || '', searchTerm) : (prompt.title || '');
    const highlightedContent = isSearchResult ? highlightText(prompt.content || '', searchTerm) : (prompt.content || '');

    // badges + quick-start + expected output
    const difficultyBadge = createDifficultyBadge(prompt.difficulty);
    const timeBadge = createTimeBadge(prompt.estimatedTime);
    const quickStartSection = createQuickStartSection(prompt.quickStart || {});
    const expectedOutputSection = createExpectedOutputSection(prompt.expectedOutput || '');

    const feedbackSection = `
        <div class="mt-4 feedback-section" data-prompt-id="${prompt.id}" data-prompt-title="${prompt.title}">
            <div class="flex items-center space-x-2 text-xl">
                <button class="thumb-up">👍</button>
                <span class="up-count text-sm">0</span>
                <button class="thumb-down ml-4">👎</button>
                <span class="down-count text-sm">0</span>
            </div>
            <div class="mt-2 flex gap-2">
                <input type="text" class="quick-comment flex-1 border rounded px-2 py-1 text-sm" placeholder="Quick comment (optional)">
                <button class="submit-comment px-3 py-1 bg-blue-500 text-white rounded text-sm">Send</button>
            </div>
        </div>`;

    promptEl.className = isSearchResult ? 'prompt-block p-4' : 'mb-8';

    promptEl.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
                <div class="badges-container mb-2">
                  ${difficultyBadge}
                  ${timeBadge}
                </div>
                <h3 class="${titleClass} font-semibold main-heading">${highlightedTitle}</h3>
            </div>
            <div class="flex-shrink-0 ml-4 flex items-start">
                <button class="favorite-btn text-xl text-gray-300 mr-2" title="Toggle favorite">☆</button>
                <button class="copy-btn text-sm py-1 px-3 rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200" data-prompt-content="${escapedContent}">
                    Copy
                </button>
                <button class="create-gem-btn text-sm py-1 px-3 rounded-md bg-green-100 text-green-700 hover:bg-green-200 ml-2" data-prompt-content="${escapedContent}">
                    Create Gem
                </button>
            </div>
        </div>

        ${breadcrumbHTML}
        ${descriptionHTML}

        <div class="${contentContainerClass}">
            <p>${highlightedContent}</p>
        </div>

        ${quickStartSection}
        ${expectedOutputSection}
        ${feedbackSection}
    `;

    const favoriteBtn = promptEl.querySelector('.favorite-btn');
    function updateFavoriteBtn() {
        const fav = isFavorite(prompt.id);
        favoriteBtn.textContent = fav ? '★' : '☆';
        favoriteBtn.classList.toggle('text-yellow-400', fav);
        favoriteBtn.classList.toggle('text-gray-300', !fav);
    }
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(prompt.id);
        updateFavoriteBtn();
        if (currentTab === 'favorites') renderFavorites();
    });
    updateFavoriteBtn();

    const feedbackEl = promptEl.querySelector('.feedback-section');
    const upBtn = feedbackEl.querySelector('.thumb-up');
    const downBtn = feedbackEl.querySelector('.thumb-down');
    const upCountEl = feedbackEl.querySelector('.up-count');
    const downCountEl = feedbackEl.querySelector('.down-count');
    const commentInput = feedbackEl.querySelector('.quick-comment');
    const submitBtn = feedbackEl.querySelector('.submit-comment');

    function updateFeedbackUI() {
        const counts = getFeedbackCounts(prompt.id);
        const votes = getUserVotes();
        upCountEl.textContent = counts.up;
        downCountEl.textContent = counts.down;
        upBtn.classList.toggle('text-green-600', votes[prompt.id] === 'up');
        downBtn.classList.toggle('text-red-600', votes[prompt.id] === 'down');
    }

    upBtn.addEventListener('click', () => { handleVote(prompt.id, 'up'); updateFeedbackUI(); });
    downBtn.addEventListener('click', () => { handleVote(prompt.id, 'down'); updateFeedbackUI(); });
    submitBtn.addEventListener('click', () => {
        const comment = commentInput.value.trim();
        if (!comment) return;
        sendQuickComment(prompt, comment);
        commentInput.value = '';
        submitBtn.textContent = 'Sent!';
        setTimeout(() => { submitBtn.textContent = 'Send'; }, 2000);
    });

    updateFeedbackUI();

    return promptEl;
}

/**
 * Renders the results of a search query on the homepage.
 * @param {Array} results - An array of prompt objects to display.
 */
function renderSearchResults(results) {
    const searchTerm = homepageSearchInput.value.trim();
    categoryCardsContainer.innerHTML = '';
    if (results.length === 0) {
        categoryCardsContainer.innerHTML = `
        <div class="text-center text-gray-500 col-span-full py-16">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
            </svg>
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No prompts found</h3>
            <p class="mt-1 text-sm text-gray-500">We couldn’t find anything with that search term. Please try again.</p>
            <div class="mt-6">
                <button type="button" id="clear-search-suggestions-btn" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Clear Search
                </button>
            </div>
        </div>`;
        return;
    }

    categoryCardsContainer.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';

    results.forEach(prompt => {
        const promptEl = createPromptElement(prompt, true, searchTerm);
        categoryCardsContainer.appendChild(promptEl);
    });
}

function renderQuickLinks(activeCategory, activeSubCategory) {
    quickLinksSidebar.innerHTML = '';
    for (const categoryName in promptData) {
        const categoryTitle = document.createElement('h4');
        categoryTitle.className = 'font-bold mt-4 mb-2 main-heading';
        categoryTitle.innerHTML = `Gemini Prompts for <span class="accent-text">${categoryName}</span>`;
        quickLinksSidebar.appendChild(categoryTitle);

        const subList = document.createElement('ul');
        for (const subCategoryName in promptData[categoryName]) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = subCategoryName;
            link.dataset.category = categoryName;
            link.dataset.subcategory = subCategoryName;
            if (categoryName === activeCategory && subCategoryName === activeSubCategory) {
                link.className = 'active font-semibold';
            }
            li.appendChild(link);
            subList.appendChild(li);
        }
        quickLinksSidebar.appendChild(subList);
    }
}

/**
 * Renders the detail view for a specific sub-category.
 * @param {string} activeCategory - The main category to display.
 * @param {string} activeSubCategory - The sub-category to display.
 */
function renderDetailView(activeCategory, activeSubCategory) {
    promptDisplayArea.innerHTML = '';
    const subCategoryPrompts = promptData[activeCategory][activeSubCategory];

    const header = document.createElement('h1');
    header.className = 'text-3xl font-bold mb-8 main-heading';
    header.innerHTML = `Gemini Prompts for <span class="accent-text">${activeSubCategory}</span>`;
    promptDisplayArea.appendChild(header);

    subCategoryPrompts.forEach(prompt => {
        const fullPrompt = { ...prompt, category: activeCategory, subcategory: activeSubCategory };
        const promptEl = createPromptElement(fullPrompt, false);
        promptDisplayArea.appendChild(promptEl);
    });

    renderQuickLinks(activeCategory, activeSubCategory);
}

/**
 * Renders the detail view for all prompts in a specific category.
 * @param {string} activeCategory - The main category to display.
 */
function renderAllCategoryView(activeCategory) {
    promptDisplayArea.innerHTML = '';

    const header = document.createElement('h1');
    header.className = 'text-3xl font-bold mb-8 main-heading';
    header.innerHTML = `All Prompts in <span class="accent-text">${activeCategory}</span>`;
    promptDisplayArea.appendChild(header);

    const category = promptData[activeCategory];
    for (const subCategoryName in category) {
        const subCategoryPrompts = category[subCategoryName];

        const subHeader = document.createElement('h2');
        subHeader.className = 'text-2xl font-bold mt-8 mb-4 main-heading';
        subHeader.textContent = subCategoryName;
        promptDisplayArea.appendChild(subHeader);

        subCategoryPrompts.forEach(prompt => {
            const fullPrompt = { ...prompt, category: activeCategory, subcategory: subCategoryName };
            const promptEl = createPromptElement(fullPrompt, false);
            promptDisplayArea.appendChild(promptEl);
        });
    }

    renderQuickLinks(activeCategory, null);
}

function renderFavorites() {
    categoryCardsContainer.innerHTML = '';
    categoryCardsContainer.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';
    let favorites = allPrompts.filter(p => isFavorite(p.id));
    if (selectedUnit !== 'All') {
        favorites = favorites.filter(p => p.unit === selectedUnit);
    }
    if (favorites.length === 0) {
        categoryCardsContainer.innerHTML = `<p class="text-center col-span-full text-gray-500">No favorite prompts saved.</p>`;
        return;
    }
    favorites.forEach(prompt => {
        const promptEl = createPromptElement(prompt, true);
        categoryCardsContainer.appendChild(promptEl);
    });
}

// --- NAVIGATION LOGIC ---
function showDetailView(category, subCategory) {
    lastScrollPosition = window.scrollY;
    renderDetailView(category, subCategory);
    homepageView.classList.add('hidden');
    detailView.classList.remove('hidden');
    detailView.classList.add('fade-in');
    window.scrollTo(0, 0);
}
function showHomepage() {
    detailView.classList.add('hidden');
    homepageView.classList.remove('hidden');
    homepageView.classList.add('fade-in');
    setTimeout(() => { window.scrollTo(0, lastScrollPosition); }, 0);
}

function showAllCategoryView(categoryName) {
    lastScrollPosition = window.scrollY;
    renderAllCategoryView(categoryName);
    homepageView.classList.add('hidden');
    detailView.classList.remove('hidden');
    detailView.classList.add('fade-in');
    window.scrollTo(0, 0);
}

function openPrompt(promptId, category, subcategory) {
    showDetailView(category, subcategory);
    setTimeout(() => {
        const el = document.getElementById(promptId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }, 0);
}

window.openPrompt = openPrompt;

function populateGemModal(content) {
// Try to extract persona from content
const personaMatch = content.match(/act as an? (.*?)(?:\.|,|$)/i) || 
                content.match(/you are (.*?)(?:\.|,|$)/i);

if (personaMatch) {
document.getElementById('gem-persona').value = `You are ${personaMatch[1]}`;
} else {
document.getElementById('gem-persona').value = 'You are a helpful assistant';
}

// Set the task as the original content
document.getElementById('gem-task').value = content;

// Clear other fields
document.getElementById('gem-context').value = '';
document.getElementById('gem-audience').value = '';
document.getElementById('gem-tone').value = '';
document.getElementById('gem-format').value = 'Provide a clear, well-structured response';
}

function showGemModal(content) {
populateGemModal(content);
gemModal.classList.remove('hidden');
document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function hideGemModal() {
gemModal.classList.add('hidden');
generatedGemTextarea.value = '';
generatedGemContainer.classList.add('hidden');
document.body.style.overflow = ''; // Restore scrolling
}

// --- EVENT LISTENERS ---
homepageSearchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    if (searchTerm === '') {
        clearSearchBtn.classList.add('hidden');
        if (currentTab === 'favorites') {
            renderFavorites();
        } else {
            renderHomepage();
        }
        return;
    }
    clearSearchBtn.classList.remove('hidden');
    let source = currentTab === 'favorites'
        ? allPrompts.filter(p => isFavorite(p.id))
        : allPrompts;
    if (selectedUnit !== 'All') {
        source = source.filter(p => p.unit === selectedUnit);
    }
    const filteredPrompts = source.filter(prompt => {
        const titleMatch = (prompt.title || '').toLowerCase().includes(searchTerm);
        const contentMatch = (prompt.content || '').toLowerCase().includes(searchTerm);
        return titleMatch || contentMatch;
    });
    renderSearchResults(filteredPrompts);
});
clearSearchBtn.addEventListener('click', () => {
    homepageSearchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    if (currentTab === 'favorites') {
        renderFavorites();
    } else {
        renderHomepage();
    }
});

unitFilter.addEventListener('change', () => {
    selectedUnit = unitFilter.value;
    homepageSearchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    currentTab === 'favorites' ? renderFavorites() : renderHomepage();
});

function setActiveTab(tab) {
    currentTab = tab;
    if (tab === 'favorites') {
        tabFavoritesBtn.classList.add('bg-indigo-600', 'text-white');
        tabFavoritesBtn.classList.remove('bg-gray-200', 'text-gray-700');
        tabAllBtn.classList.remove('bg-indigo-600', 'text-white');
        tabAllBtn.classList.add('bg-gray-200', 'text-gray-700');
        homepageSearchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        renderFavorites();
    } else {
        tabAllBtn.classList.add('bg-indigo-600', 'text-white');
        tabAllBtn.classList.remove('bg-gray-200', 'text-gray-700');
        tabFavoritesBtn.classList.remove('bg-indigo-600', 'text-white');
        tabFavoritesBtn.classList.add('bg-gray-200', 'text-gray-700');
        homepageSearchInput.value = '';
        clearSearchBtn.classList.add('hidden');
        renderHomepage();
    }
}
tabAllBtn.addEventListener('click', () => setActiveTab('all'));
tabFavoritesBtn.addEventListener('click', () => setActiveTab('favorites'));

function handleCopyClick(e) {
    const target = e.target.closest('.copy-btn');
    if (!target) return;
    const content = target.dataset.promptContent;
    if (content) {
        navigator.clipboard.writeText(content).then(() => {
            target.textContent = 'Copied!';
            target.classList.add('bg-green-200', 'text-green-800');
            setTimeout(() => { target.textContent = 'Copy'; target.classList.remove('bg-green-200', 'text-green-800'); }, 2000);
        }).catch(err => { console.error('Failed to copy text: ', err); target.textContent = 'Error'; setTimeout(() => { target.textContent = 'Copy'; }, 2000); });
    }
}

categoryCardsContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.id === 'clear-search-suggestions-btn') { homepageSearchInput.value = ''; clearSearchBtn.classList.add('hidden'); currentTab === 'favorites' ? renderFavorites() : renderHomepage(); return; }
    if (target.closest('.copy-btn')) { handleCopyClick(e); return; }
    if (target.classList.contains('create-gem-btn')) { const content = target.dataset.promptContent; showGemModal(content); return; }
    if (target.classList.contains('see-all-btn')) { const categoryName = target.dataset.category; showAllCategoryView(categoryName); return; }
    if (target.tagName === 'A' && target.dataset.subcategory) { e.preventDefault(); showDetailView(target.dataset.category, target.dataset.subcategory); }
});

promptDisplayArea.addEventListener('click', (e) => {
    if (e.target.classList.contains('create-gem-btn')) { const content = e.target.dataset.promptContent; showGemModal(content); return; }
    handleCopyClick(e);
});

quickLinksSidebar.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.dataset.subcategory) {
        e.preventDefault();
        const category = e.target.dataset.category;
        const subCategory = e.target.dataset.subcategory;
        renderDetailView(category, subCategory);
    }
});

backToHomeBtn.addEventListener('click', showHomepage);
closeGemModalBtn.addEventListener('click', hideGemModal);

generateGemBtn.addEventListener('click', () => {
const persona = document.getElementById('gem-persona').value.trim();
const task = document.getElementById('gem-task').value.trim();
const context = document.getElementById('gem-context').value.trim();
const audience = document.getElementById('gem-audience').value.trim();
const tone = document.getElementById('gem-tone').value.trim();
const format = document.getElementById('gem-format').value.trim();

// Build the gem string with proper formatting
let gemString = '';

if (persona) {
gemString += `Persona: – "${persona}"\n\n`;
}

if (task) {
gemString += `Task: – "${task}"\n\n`;
}

if (context) {
gemString += `Context: – "${context}"\n\n`;
}

if (audience) {
gemString += `Audience: – "${audience}"\n\n`;
}

if (tone) {
gemString += `Tone & Style: – "${tone}"\n\n`;
}

if (format) {
gemString += `Format: – "${format}"`;
}

generatedGemTextarea.value = gemString;
generatedGemContainer.classList.remove('hidden');

// Scroll the modal to show the generated gem
generatedGemContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

copyGemBtn.addEventListener('click', () => {
navigator.clipboard.writeText(generatedGemTextarea.value).then(() => {
const originalText = copyGemBtn.innerHTML;
copyGemBtn.innerHTML = '✅ Copied!';
copyGemBtn.classList.add('bg-green-500');
setTimeout(() => { 
    copyGemBtn.innerHTML = originalText;
    copyGemBtn.classList.remove('bg-green-500');
}, 2000);
}).catch(err => { 
console.error('Failed to copy text: ', err); 
copyGemBtn.innerHTML = '❌ Error';
setTimeout(() => { copyGemBtn.innerHTML = '📋 Copy Gem'; }, 2000);
});
});

// --- INITIAL LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    loadPrompts();
});

