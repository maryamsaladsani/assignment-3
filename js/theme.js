// Theme Toggle Logic
// Handles dark/light mode switching with localStorage persistence and system preference detection
(() => {
    const root = document.documentElement;               // <html>
    const btn  = document.getElementById('theme-toggle'); // the toggle button

    if (!btn) return; // safety

    // 1) Decide initial theme: saved value → system preference → default dark
    const saved = localStorage.getItem('theme'); // 'light' | 'dark' | null
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initial = saved ?? (systemPrefersLight ? 'light' : 'dark');

    const applyTheme = (mode) => {
        if (mode === 'light') {
            root.classList.add('theme-light');     //  CSS variables switch on this class
            btn.textContent = '☀️';
            btn.setAttribute('aria-pressed', 'true');
        } else {
            root.classList.remove('theme-light');
            btn.textContent = '🌙';
            btn.setAttribute('aria-pressed', 'false');
        }
    };

    // Apply on load
    applyTheme(initial);

    // 2) Toggle on click + persist
    btn.addEventListener('click', () => {
        const next = root.classList.contains('theme-light') ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });
})();