let searchIndex;
let searchDocs = [];

async function buildSearchIndex() {
  const path = window.location.pathname;
  const depth = path.split('/').length - 2;
  const prefix = '../'.repeat(depth > 0 ? depth : 0);

  const staticPages = [
    { fetch: prefix + 'rpo-training/index.html', url: prefix + 'rpo-training/', category: 'training' },
    { fetch: prefix + 'gbs-ai-workshop/index.html', url: prefix + 'gbs-ai-workshop/', category: 'training' },
    { fetch: prefix + 'daily-focus/index.html', url: prefix + 'daily-focus/', category: 'training' },
    { fetch: prefix + 'sourcing-workshop/index.html', url: prefix + 'sourcing-workshop/', category: 'training' },
    { fetch: prefix + 'resources/index.html', url: prefix + 'resources/', category: 'resources' },
    { fetch: prefix + 'gbs-prompts/index.html', url: prefix + 'gbs-prompts/', category: 'prompts' },
    { fetch: prefix + 'ai-ethics/index.html', url: prefix + 'ai-ethics/', category: 'content' },
    { fetch: prefix + 'ai-glossary/index.html', url: prefix + 'ai-glossary/', category: 'content' },
    { fetch: prefix + 'faq/index.html', url: prefix + 'faq/', category: 'content' },
    { fetch: prefix + 'ai-sme/index.html', url: prefix + 'ai-sme/', category: 'content' },
    { fetch: prefix + 'use-cases/index.html', url: prefix + 'use-cases/', category: 'content' },
    { fetch: prefix + 'knowledge-content/index.html', url: prefix + 'knowledge-content/', category: 'content' },
    { fetch: prefix + 'events/index.html', url: prefix + 'events/', category: 'content' },
    { fetch: prefix + 'about-us/index.html', url: prefix + 'about-us/', category: 'content' }
  ];

  const docs = [];

  for (const page of staticPages) {
    try {
      const res = await fetch(page.fetch);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const title = doc.querySelector('h1')?.textContent.trim() || doc.title;
      const desc = doc.querySelector('p')?.textContent.trim() || '';
      docs.push({ id: docs.length.toString(), title, description: desc, url: page.url, category: page.category });
    } catch (err) {
      console.error('Error loading page for search index:', page.fetch, err);
    }
  }

  try {
    const res = await fetch(prefix + 'gbs-prompts/prompts.json');
    const data = await res.json();
    const promptData = data.promptData || {};
    Object.values(promptData).forEach(group => {
      Object.values(group).forEach(list => {
        list.forEach(prompt => {
          docs.push({ id: docs.length.toString(), title: prompt.title, description: prompt.description || prompt.quote || '', url: prefix + 'gbs-prompts/', category: 'prompts' });
        });
      });
    });
  } catch (err) {
    console.error('Error loading prompts for search index:', err);
  }

  searchDocs = docs;
  searchIndex = lunr(function() {
    this.ref('id');
    this.field('title');
    this.field('description');
    docs.forEach(d => this.add(d));
  });
}

const popularSearches = [
  { label: 'All Training', query: 'training' },
  { label: 'Prompts', query: 'prompt' },
  { label: 'Resources', query: 'resource' },
  { label: 'Success Stories', query: 'success' }
];

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(escapeRegExp(query), 'gi');
  return text.replace(regex, '<mark>$&</mark>');
}

function formatCategory(cat) {
  switch (cat) {
    case 'prompts':
      return 'Prompt Library';
    case 'training':
      return 'Training';
    case 'resources':
      return 'Resources';
    case 'content':
      return 'Content';
    default:
      return cat;
  }
}

function renderSearchResults(results, container, query='') {
  container.innerHTML = '';

  const suggestions = document.createElement('div');
  suggestions.className = 'px-4 py-2 border-b';
  suggestions.innerHTML = '<p class="text-xs text-gray-500 font-medium">POPULAR SEARCHES</p>';
  const tagWrap = document.createElement('div');
  tagWrap.className = 'mt-1 flex flex-wrap gap-2';
  popularSearches.forEach(s => {
    const tag = document.createElement('button');
    tag.type = 'button';
    tag.className = 'bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs';
    tag.textContent = s.label;
    tag.addEventListener('click', () => {
      const input = document.querySelector('[data-search-input]');
      if (input) {
        input.value = s.query;
        input.dispatchEvent(new Event('input'));
        input.focus();
      }
    });
    tagWrap.appendChild(tag);
  });
  suggestions.appendChild(tagWrap);
  container.appendChild(suggestions);

  if (results.length === 0) {
    container.classList.remove('hidden');
    return;
  }

  const ul = document.createElement('ul');
  results.forEach(r => {
    const doc = searchDocs.find(d => d.id === r.ref);
    if (!doc) return;
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${doc.url}" class="block py-2 px-4 hover:bg-gray-50">
        <span class="block font-medium">${highlight(doc.title, query)}</span>
        <span class="block text-gray-600 text-sm">${highlight(doc.description, query)}</span>
        <span class="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">${formatCategory(doc.category)}</span>
      </a>
    `;
    ul.appendChild(li);
  });
  container.appendChild(ul);
  container.classList.remove('hidden');
}

async function handleSearchInput(e) {
  const input = e.target;
  const query = input.value.trim();
  const container = input.parentElement.querySelector('[data-search-results]');
  if (!container) return;
  if (!searchIndex) await buildSearchIndex();
  if (query.length < 2) {
    container.innerHTML = '';
    container.classList.add('hidden');
    return;
  }
  const results = searchIndex.search(query);
  renderSearchResults(results, container, query);
}

function setupSearch() {
  document.querySelectorAll('[data-search-input]').forEach(input => {
    if (input.dataset.searchBound) return;
    input.addEventListener('input', handleSearchInput);
    input.dataset.searchBound = 'true';
  });
}

window.setupSearch = setupSearch;

document.addEventListener('DOMContentLoaded', () => {
  setupSearch();
});
