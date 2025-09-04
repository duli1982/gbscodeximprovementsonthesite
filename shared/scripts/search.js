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
    { fetch: prefix + 'resources/index.html', url: prefix + 'resources/', category: 'resources' }
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

function renderSearchResults(results, container, prefix='') {
  container.innerHTML = '';
  const groups = {};
  results.forEach(r => {
    const doc = searchDocs.find(d => d.id === r.ref);
    if (!doc) return;
    groups[doc.category] = groups[doc.category] || [];
    groups[doc.category].push(doc);
  });

  ['training', 'prompts', 'resources'].forEach(cat => {
    if (groups[cat]) {
      const section = document.createElement('div');
      section.innerHTML = `<h3 class="font-semibold mt-2 capitalize">${cat}</h3>`;
      const ul = document.createElement('ul');
      groups[cat].forEach(doc => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${doc.url}" class="block py-1 text-blue-600 hover:underline"><span class="font-medium">${doc.title}</span><span class="block text-gray-600 text-sm">${doc.description}</span></a>`;
        ul.appendChild(li);
      });
      section.appendChild(ul);
      container.appendChild(section);
    }
  });
  container.classList.toggle('hidden', results.length === 0);
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
  renderSearchResults(results, container);
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
