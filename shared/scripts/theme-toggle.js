// Toggles between light and dark themes
// and persists the choice in localStorage.
const toggleBtn = document.getElementById('theme-toggle');
if (toggleBtn) {
    const currentTheme = document.documentElement.dataset.theme || 'light';
    setIcon(currentTheme);

    toggleBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const activeTheme = html.dataset.theme === 'dark' ? 'dark' : 'light';
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (window.applyTheme) {
            window.applyTheme(newTheme);
        }
        setIcon(newTheme);
    });

    function setIcon(theme) {
        toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}
