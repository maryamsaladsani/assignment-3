// Personalized Greeting with localStorage
// Displays time-based greeting (morning/afternoon/evening) with user's saved name

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
            localStorage.setItem(k, '1');
            localStorage.removeItem(k);
            return true;
        } catch {
            return false;
        }
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