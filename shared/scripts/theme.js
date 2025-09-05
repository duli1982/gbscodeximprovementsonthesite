tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                'brand-primary': 'var(--ai-accent)',
                'brand-primary-hover': 'var(--ai-accent-hover)',
                'brand-dark': 'var(--ai-heading)',
                'brand-body': 'var(--ai-text)',
                'brand-muted': 'var(--ai-text)', // Using main text color for muted as well for simplicity
                'brand-bg': 'var(--ai-bg)',
                'brand-card-bg': 'var(--ai-card)',
            }
        }
    }
};

const lightTheme = {
    '--ai-bg': '#ffffff',
    '--ai-text': '#1f2937',
    '--ai-heading': '#1f2937',
    '--ai-accent': '#3b82f6',
    '--ai-accent-hover': '#2563eb',
    '--ai-card': '#f3f4f6',
    '--ai-border': '#e5e7eb',
    '--ai-shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
    '--ai-shadow-md': '0 4px 6px rgba(0, 0, 0, 0.1)'
};

const darkTheme = {
    '--ai-bg': '#1f2937',
    '--ai-text': '#f9fafb',
    '--ai-heading': '#f9fafb',
    '--ai-accent': '#3b82f6',
    '--ai-accent-hover': '#60a5fa',
    '--ai-card': '#374151',
    '--ai-border': '#4b5563',
    '--ai-shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.4)',
    '--ai-shadow-md': '0 4px 6px rgba(0, 0, 0, 0.6)'
};

const themes = { light: lightTheme, dark: darkTheme };

function applyTheme(theme) {
    const palette = themes[theme] || lightTheme;
    const root = document.documentElement;
    Object.entries(palette).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

window.applyTheme = applyTheme;

const storedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', storedTheme);
applyTheme(storedTheme);
