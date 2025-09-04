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
        link.innerHTML = `
          <h3 class="google-sans text-2xl font-bold mb-2">${section.title}</h3>
          <p class="text-gray-600">${section.description}</p>
        `;
        container.appendChild(link);
      });
    })
    .catch(error => console.error('Error loading sections:', error));
});
