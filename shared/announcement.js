document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const depth = path.split('/').length - 2; // account for leading/trailing slashes
  const jsonPath = '../'.repeat(depth > 0 ? depth : 0) + 'shared/announcement.json';

  fetch(jsonPath)
    .then(response => response.json())
    .then(({ message, expiry }) => {
      if (!message) return;
      if (expiry && new Date(expiry) < new Date()) return;

      const banner = document.createElement('div');
      banner.className = 'announcement-banner';
      banner.textContent = message;
      document.body.prepend(banner);
    })
    .catch(err => console.error('Error loading announcement:', err));
});
