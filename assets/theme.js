// Simple theme toggler for presentation pages
(function () {
    const key = 'site-theme';
    const html = document.documentElement;

    // theme: 'light' | 'dark' | 'system'
    function applyTheme(t) {
        html.classList.remove('theme-light', 'theme-dark');
        if (t === 'light') html.classList.add('theme-light');
        if (t === 'dark') html.classList.add('theme-dark');
        // if 'system' we remove forced classes and let prefers-color-scheme apply
    }

    function storedOrSystem() {
        const s = localStorage.getItem(key);
        if (s === 'light' || s === 'dark' || s === 'system') return s;
        return 'system';
    }

    let theme = storedOrSystem();
    applyTheme(theme);

    function nextTheme(curr) {
        // cycle: system -> light -> dark -> system
        if (curr === 'system') return 'light';
        if (curr === 'light') return 'dark';
        return 'system';
    }

    function updateButtonUI(btn, t) {
        if (!btn) return;
        btn.dataset.theme = t;
        if (t === 'system') btn.textContent = '🌗';
        else if (t === 'light') btn.textContent = '🔆';
        else btn.textContent = '🌙';
        btn.title = t === 'system' ? 'Tema: sistema (clic para alternar)' : `Tema: ${t} (clic para alternar)`;
    }

    window.toggleTheme = function () {
        theme = nextTheme(theme);
        try { localStorage.setItem(key, theme); } catch (e) { /* ignore */ }
        applyTheme(theme);
        const btn = document.getElementById('theme-toggle');
        updateButtonUI(btn, theme);
    };

    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('theme-toggle');
        updateButtonUI(btn, theme);
        if (btn) btn.addEventListener('click', () => window.toggleTheme());

        // if user changes system preference, and stored setting is 'system', update
        if (window.matchMedia) {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            mq.addEventListener && mq.addEventListener('change', () => {
                if (localStorage.getItem(key) === 'system') applyTheme('system');
            });
        }
    });
})();
