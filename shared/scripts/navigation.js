// Apply stored theme as early as possible
(function () {
  const applyTheme = (mode) => {
    const isDark = mode === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  };

  const initTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      applyTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    }
  };

  initTheme();

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
        const toggle = document.getElementById('theme-toggle');
        const icon = document.getElementById('theme-toggle-icon');
        const updateIcon = () => {
          const isDark = document.documentElement.classList.contains('dark');
          if (icon) icon.textContent = isDark ? '☀️' : '🌙';
        };
        updateIcon();
        if (toggle) {
          toggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcon();
          });
        }
        if (window.setupSearch) {
          window.setupSearch();
        }
      })
      .catch(err => console.error('Error loading navigation:', err));
  });
})();
