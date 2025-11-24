// js/theme.js
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

// ----- Personalized Greeting with localStorage -----
(function () {
    const greetingEl = document.getElementById('greeting');
    const form = document.getElementById('usernameForm');
    const input = document.getElementById('usernameInput');
    const changeBtn = document.getElementById('changeNameBtn');

    if (!greetingEl) return; // safely exit if markup missing

    function partOfDay() {
        const h = new Date().getHours();
        return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
    }

    function canStore() {
        try {
            const k = '__t';
            localStorage.setItem(k, '1'); localStorage.removeItem(k);
            return true;
        } catch { return false; }
    }

    function render() {
        const name = canStore() ? localStorage.getItem('username') : null;
        const text = name ? `Good ${partOfDay()}, ${name}!` : `Good ${partOfDay()}!`;
        greetingEl.textContent = text;

        // Show form only if no name saved
        const hasName = Boolean(name);
        if (form) form.classList.toggle('hidden', hasName);
        if (changeBtn) changeBtn.classList.toggle('hidden', !hasName);
    }

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = input.value.trim();
        if (v.length >= 2 && canStore()) {
            localStorage.setItem('username', v);
            input.value = '';
            render();
        }
    });

    changeBtn?.addEventListener('click', () => {
        // let user update their stored name
        form.classList.remove('hidden');
        input.focus();
    });

    render();
})();

// ---- Contact form: validation + feedback + localStorage helpers  ----
(function () {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const nameEl = form.querySelector('#name');
    const emailEl = form.querySelector('#email');
    const msgEl = form.querySelector('#message');
    const statusEl = form.querySelector('#formStatus');
    const submitBtn = form.querySelector('button[type="submit"]');

    // --- Utilities ---
    const canStore = () => {
        try { localStorage.setItem('__t','1'); localStorage.removeItem('__t'); return true; } catch { return false; }
    };

    function setInlineMsg(input, text, ok=false) {
        // find or create a <small class="field-msg">
        let m = input.parentElement.querySelector('.field-msg');
        if (!m) {
            m = document.createElement('small');
            m.className = 'field-msg';
            input.parentElement.appendChild(m);
        }
        m.textContent = text || '';
        m.classList.toggle('err', Boolean(text) && !ok);
        m.classList.toggle('ok', ok);
        input.classList.toggle('input-error', Boolean(text) && !ok);
        input.setAttribute('aria-invalid', (Boolean(text) && !ok) ? 'true' : 'false');
    }

    function clearInlineMsgs() {
        form.querySelectorAll('.field-msg').forEach(el => el.textContent = '');
        form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        [nameEl, emailEl, msgEl].forEach(i => i.setAttribute('aria-invalid','false'));
    }

    function showStatus(text, ok=false, loading=false) {
        statusEl.textContent = text || '';
        statusEl.className = 'form-status' + (loading ? ' loading' : '') + (ok ? ' status-ok' : text ? ' status-err' : '');
    }

    function validate() {
        clearInlineMsgs();
        let valid = true;

        const name = nameEl.value.trim();
        const email = emailEl.value.trim();
        const msg = msgEl.value.trim();

        if (name.length < 2) {
            setInlineMsg(nameEl, 'Please enter your name (min 2 characters).');
            valid = false;
        } else {
            setInlineMsg(nameEl, 'Looks good ✓', true);
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setInlineMsg(emailEl, 'Please enter a valid email like maryasmaladsani@gmail.com.');
            valid = false;
        } else {
            setInlineMsg(emailEl, 'Looks good ✓', true);
        }

        if (msg.length < 10) {
            setInlineMsg(msgEl, 'Message must be at least 10 characters.');
            valid = false;
        } else {
            setInlineMsg(msgEl, 'Thanks for the details ✓', true);
        }

        return { valid, name, email, msg };
    }

    // Prefill from localStorage (nice touch + “data handling”)
    if (canStore()) {
        const savedName = localStorage.getItem('contact_name');
        const savedEmail = localStorage.getItem('contact_email');
        if (savedName) nameEl.value = savedName;
        if (savedEmail) emailEl.value = savedEmail;
    }

    // Live validation as the user types / leaves a field
    ['input', 'blur'].forEach(evt => {
        nameEl.addEventListener(evt, () => validate());
        emailEl.addEventListener(evt, () => validate());
        msgEl.addEventListener(evt, () => validate());
    });

    // Submit handler (simulated async “send” with loading/success/failure)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const { valid, name, email } = validate();
        if (!valid) {
            showStatus('Please fix the highlighted fields.', false, false);
            return;
        }

        // Save name/email for next time
        if (canStore()) {
            localStorage.setItem('contact_name', name);
            localStorage.setItem('contact_email', email);
        }

        // Loading state
        submitBtn.disabled = true;
        showStatus('Sending…', false, true);

        // Simulate an async request (replace with real fetch if you have an endpoint)
        setTimeout(() => {
            // RANDOMIZE a failure occasionally to demonstrate error handling
            const ok = Math.random() > 0.15; // 85% success rate for demo
            if (ok) {
                showStatus('Thanks! Your message has been sent.', true, false);
                form.reset();
                clearInlineMsgs();
            } else {
                showStatus('Could not send right now. Please try again.', false, false);
                // Add a retry button inline
                const retry = document.createElement('button');
                retry.type = 'button';
                retry.textContent = 'Retry';
                retry.style.marginLeft = '.5rem';
                retry.addEventListener('click', () => {
                    // trigger another "submit"
                    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                });
                statusEl.appendChild(retry);
            }
            submitBtn.disabled = false;
        }, 800);
    });
})();

// ---- Scroll progress line ----
(function(){
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    function update(){
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
        bar.style.width = pct + '%';
    }
    // run on load/scroll/resize
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    document.addEventListener('DOMContentLoaded', update);
    update();
})();
