let searchIndex;
let searchDocs = [];
let isIndexBuilt = false;

// Fetches the pre-built index and initializes lunr
async function initSearch() {
    if (isIndexBuilt) return;

    try {
        const response = await fetch('/shared/search-index.json');
        if (!response.ok) {
            console.error('Failed to load search-index.json');
            return;
        }
        searchDocs = await response.json();

        searchIndex = lunr(function () {
            this.ref('id');
            this.field('title', { boost: 10 });
            this.field('description', { boost: 5 });
            this.field('content');
            this.field('category');
            this.field('subcategory');

            searchDocs.forEach(doc => {
                this.add(doc);
            });
        });

        isIndexBuilt = true;
        console.log('Search index loaded and ready.');
    } catch (error) {
        console.error('Error initializing search:', error);
    }
}

// Renders the search results in the provided container
function renderSearchResults(results, container) {
    container.innerHTML = '';
    if (results.length === 0) {
        container.innerHTML = '<div class="p-4 text-gray-500">No results found.</div>';
        container.classList.remove('hidden');
        return;
    }

    const ul = document.createElement('ul');
    results.slice(0, 10).forEach(result => { // Show top 10 results
        const doc = searchDocs.find(d => d.id === result.ref);
        if (!doc) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <a href="${doc.url}" class="block p-3 hover:bg-gray-100 border-b border-gray-100">
                <div class="font-semibold text-blue-700">${doc.title}</div>
                <div class="text-xs text-gray-500 uppercase tracking-wider">${doc.type} &bull; ${doc.category}</div>
                <p class="text-gray-700 mt-1">${doc.description.substring(0, 100)}...</p>
            </a>
        `;
        ul.appendChild(li);
    });

    container.appendChild(ul);
    container.classList.remove('hidden');
}

// Handles the user input in the search bar
async function handleSearchInput(e) {
    const input = e.target;
    const query = input.value.trim();
    const container = input.parentElement.querySelector('[data-search-results]');

    if (!container) return;

    if (!isIndexBuilt) {
        await initSearch();
    }

    if (query.length < 2) {
        container.innerHTML = '';
        container.classList.add('hidden');
        return;
    }

    try {
        const results = searchIndex.search(`${query}*`); // Add wildcard for partial matches
        renderSearchResults(results, container);
    } catch (error) {
        console.error('Search error:', error);
        container.classList.add('hidden');
    }
}

// Sets up event listeners for all search inputs on the page
function setupSearch() {
    document.querySelectorAll('[data-search-input]').forEach(input => {
        if (input.dataset.searchBound) return;
        input.addEventListener('input', handleSearchInput);
        input.dataset.searchBound = 'true';
    });
    // Add a listener to hide results when clicking outside
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('[data-search-input]').parentElement;
        if (!searchContainer.contains(e.target)) {
            const resultsContainer = searchContainer.querySelector('[data-search-results]');
            if (resultsContainer) {
                resultsContainer.classList.add('hidden');
            }
        }
    });
}

// Initialize search on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    // Pre-load the index in the background on the main page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        initSearch();
    }
});
