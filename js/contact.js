// Contact Form: Validation + Feedback + localStorage
// Handles real-time validation, inline error messages, and form submission with loading states

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
        try {
            localStorage.setItem('__t','1');
            localStorage.removeItem('__t');
            return true;
        } catch {
            return false;
        }
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

    // Prefill from localStorage (nice touch + "data handling")
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

    // Submit handler (simulated async "send" with loading/success/failure)
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