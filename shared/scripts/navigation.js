document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;
  const path = window.location.pathname;
  const depth = path.split('/').length - 2;
  const relativePath = '../'.repeat(depth > 0 ? depth : 0) + 'shared/navigation.html';
  fetch(relativePath)
    .then(res => res.text())
    .then(html => {
      placeholder.innerHTML = html;
      if (window.setupSearch) {
        window.setupSearch();
      }
    })
    .catch(err => console.error('Error loading navigation:', err));
});
