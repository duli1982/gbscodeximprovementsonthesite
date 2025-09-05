document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;
  const path = window.location.pathname;
  const depth = path.split('/').length - 2;
  const basePath = '../'.repeat(depth > 0 ? depth : 0) + 'shared/';
  const navPath = basePath + 'navigation.html';
  fetch(navPath)
    .then(res => res.text())
    .then(html => {
      placeholder.innerHTML = html;
      if (window.applyTheme) {
        loadScript(basePath + 'scripts/theme-toggle.js');
      } else {
        loadScript(basePath + 'scripts/theme.js', () => {
          loadScript(basePath + 'scripts/theme-toggle.js');
        });
      }
      if (window.setupSearch) {
        window.setupSearch();
      }
    })
    .catch(err => console.error('Error loading navigation:', err));

  function loadScript(src, callback) {
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    if (callback) {
      s.onload = callback;
    }
    document.head.appendChild(s);
  }
});
