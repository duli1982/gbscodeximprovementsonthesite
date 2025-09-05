// Dynamically render hub cards on the index page
// Runs after navigation and search scripts (loaded after them with defer)
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('hub-sections');
  if (!container) return;

  fetch('/shared/config/sections.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load sections.json');
      return response.json();
    })
    .then(sections => {
      sections.forEach(section => {
        const link = document.createElement('a');
        link.href = section.url;
        link.className = 'hub-card bg-white p-8 rounded-xl block';
        // derive a section id from the url (/path/ -> path)
        const sectionId = section.id || section.url.replace(/\//g, '');
        link.setAttribute('data-section-id', sectionId);
        link.innerHTML = `
          <h3 class="google-sans text-2xl font-bold mb-2">${section.title}</h3>
          <p class="text-gray-600">${section.description}</p>
          <div class="mt-4">
            <div class="progress-bar"><div class="progress-bar-fill"></div></div>
            <div class="progress-label text-sm text-gray-600 mt-1">0% complete</div>
            <div class="badge-container mt-2"></div>
          </div>
        `;
        container.appendChild(link);
      });
    })
    .catch(error => console.error('Error loading sections:', error));
});
