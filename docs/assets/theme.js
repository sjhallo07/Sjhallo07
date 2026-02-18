/* Theme toggler: supports 'light', 'dark', 'system'.
   - Persists choice to localStorage key 'site-theme'
   - If 'system', removes explicit theme classes so CSS prefers-color-scheme applies
*/
(function () {
    const KEY = 'site-theme';
    const html = document.documentElement;

    function applyTheme(theme) {
        html.classList.remove('theme-light', 'theme-dark');
        if (theme === 'light') html.classList.add('theme-light');
        else if (theme === 'dark') html.classList.add('theme-dark');
        // if 'system' or unknown, leave no explicit class (CSS will follow prefers-color-scheme)
        updateToggleButton(theme);
    }

    function getStored() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }

    function setStored(theme) {
        try { localStorage.setItem(KEY, theme); } catch (e) { /* ignore */ }
    }

    function detectSystem() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function cycleTheme() {
        const cur = getStored() || 'system';
        const order = ['system', 'light', 'dark'];
        const next = order[(order.indexOf(cur) + 1) % order.length];
        setStored(next);
        applyTheme(next);
    }

    function updateToggleButton(theme) {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;
        const effective = theme === 'system' || !theme ? (`system (${detectSystem()})`) : theme;
        let emoji = '🌗';
        if (theme === 'light') emoji = '🌞';
        if (theme === 'dark') emoji = '🌜';
        btn.innerText = emoji + ' ' + effective;
        btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }

    // Initial apply
    const stored = getStored();
    if (stored) applyTheme(stored);

    // Listen to changes in system theme if user chose 'system' (no explicit class)
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const cur = getStored();
            if (!cur || cur === 'system') updateToggleButton('system');
        });
    }

    // Expose to window for onclick handlers
    window.toggleThemeCycle = cycleTheme;
    window.applyTheme = function (t) { setStored(t); applyTheme(t); };

    // Auto-insert floating toggle button if none exists on page
    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('theme-toggle')) {
            const b = document.createElement('button');
            b.id = 'theme-toggle';
            b.className = 'btn btn-ghost';
            b.style.position = 'fixed';
            b.style.right = '12px';
            b.style.top = '12px';
            b.style.zIndex = 9999;
            b.title = 'Alternar tema (system → light → dark)';
            b.onclick = cycleTheme;
            document.body.appendChild(b);
        }
        // initialize label
        updateToggleButton(getStored() || 'system');
    });
})();
