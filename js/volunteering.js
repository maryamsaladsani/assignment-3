// ============================================
// VOLUNTEERING: FILTERING & SORTING LOGIC
// ============================================
(function() {
    'use strict';

    // ============================================
    // CONFIGURATION & STATE
    // ============================================
    const state = {
        allVolunteers: [],
        currentFilter: 'all',
        currentSort: 'date-desc',
        isFiltered: false
    };

    // DOM Elements
    const volunteerSection = document.querySelector('.volunteering');
    if (!volunteerSection) return;

    const volunteerList = document.querySelector('.volunteer-list');
    const filterSelect = document.getElementById('volunteer-filter');
    const sortSelect = document.getElementById('volunteer-sort');
    const resetBtn = document.querySelector('.reset-filters');

    // ============================================
    // VOLUNTEER DATA EXTRACTION
    // ============================================
    /**
     * Extract volunteer data from DOM on page load
     * This parses existing HTML and creates data objects
     */
    function extractVolunteerData() {
        const volunteerCards = document.querySelectorAll('.volunteer');

        state.allVolunteers = Array.from(volunteerCards).map(card => {
            const title = card.querySelector('h4').textContent.trim();
            const dateText = card.querySelector('.date').textContent.trim();
            const description = card.querySelector('p:not(.date)').textContent.trim();

            // Extract role from title
            const role = extractRole(title);

            // Parse dates
            const { startDate, endDate, isCurrent } = parseDates(dateText);

            return {
                element: card,
                title,
                dateText,
                description,
                role,
                startDate,
                endDate,
                isCurrent,
                order: Array.from(volunteerCards).indexOf(card) // preserve original order
            };
        });

        console.log('📊 Extracted volunteer data:', state.allVolunteers);
    }

    /**
     * Extract role type from title
     */
    function extractRole(title) {
        const lowerTitle = title.toLowerCase();

        if (lowerTitle.includes('founder')) return 'founder';
        if (lowerTitle.includes('leader') && !lowerTitle.includes('vice')) return 'leader';
        if (lowerTitle.includes('vice leader') || lowerTitle.includes('vice-leader')) return 'vice';
        if (lowerTitle.includes('member') || lowerTitle.includes('consultant')) return 'member';

        return 'member'; // default
    }

    /**
     * Parse date strings into Date objects
     * Handles formats like "09/2025 – Present" or "10/2023 – 03/2024"
     */
    function parseDates(dateString) {
        const isCurrent = dateString.toLowerCase().includes('present');

        // Extract dates using regex
        const datePattern = /(\d{2})\/(\d{4})/g;
        const matches = [...dateString.matchAll(datePattern)];

        let startDate = null;
        let endDate = null;

        if (matches.length >= 1) {
            const [, month1, year1] = matches[0];
            startDate = new Date(parseInt(year1), parseInt(month1) - 1);
        }

        if (matches.length >= 2) {
            const [, month2, year2] = matches[1];
            endDate = new Date(parseInt(year2), parseInt(month2) - 1);
        } else if (isCurrent) {
            endDate = new Date(); // current date
        }

        return { startDate, endDate, isCurrent };
    }

    // ============================================
    // FILTERING LOGIC
    // ============================================
    /**
     * Filter volunteers based on current filter selection
     */
    function filterVolunteers() {
        const filter = state.currentFilter;

        return state.allVolunteers.filter(volunteer => {
            switch(filter) {
                case 'current':
                    return volunteer.isCurrent;
                case 'past':
                    return !volunteer.isCurrent;
                case 'all':
                default:
                    return true;
            }
        });
    }

    // ============================================
    // SORTING LOGIC
    // ============================================
    /**
     * Sort volunteers based on current sort selection
     */
    function sortVolunteers(volunteers) {
        const sort = state.currentSort;
        const sorted = [...volunteers]; // create copy to avoid mutation

        switch(sort) {
            case 'date-desc':
                // Most recent first (by start date, then by end date)
                return sorted.sort((a, b) => {
                    if (!a.startDate || !b.startDate) return 0;
                    // Compare end dates first (recent positions at top)
                    const endDiff = (b.endDate || new Date()) - (a.endDate || new Date());
                    if (endDiff !== 0) return endDiff;
                    // If end dates are same, compare start dates
                    return b.startDate - a.startDate;
                });

            case 'date-asc':
                // Oldest first
                return sorted.sort((a, b) => {
                    if (!a.startDate || !b.startDate) return 0;
                    const startDiff = a.startDate - b.startDate;
                    if (startDiff !== 0) return startDiff;
                    return (a.endDate || new Date()) - (b.endDate || new Date());
                });

            case 'role':
                // Leader → Vice → Founder → Member
                const roleOrder = { 'leader': 1, 'vice': 2, 'founder': 3, 'member': 4 };
                return sorted.sort((a, b) => {
                    const orderA = roleOrder[a.role] || 999;
                    const orderB = roleOrder[b.role] || 999;
                    if (orderA !== orderB) return orderA - orderB;
                    // If same role, sort by date (most recent first)
                    return (b.startDate || 0) - (a.startDate || 0);
                });

            default:
                return sorted;
        }
    }

    // ============================================
    // UI UPDATE LOGIC
    // ============================================
    /**
     * Main function: Apply filters, sort, and update display
     */
    function updateDisplay() {
        // Step 1: Filter
        const filtered = filterVolunteers();

        // Step 2: Sort
        const sorted = sortVolunteers(filtered);

        // Step 3: Update DOM
        renderVolunteers(sorted);

        // Step 4: Show/hide reset button
        updateResetButton();

        // Step 5: Save preferences
        savePreferences();
    }

    /**
     * Render volunteers in sorted order
     */
    function renderVolunteers(volunteers) {
        // Hide all cards first
        state.allVolunteers.forEach(v => {
            v.element.classList.add('hidden');
        });

        // Show and reorder visible cards
        volunteers.forEach((volunteer, index) => {
            volunteer.element.classList.remove('hidden');
            volunteer.element.style.order = index;
        });

        // Show "no results" message if needed
        showNoResultsMessage(volunteers.length === 0);
    }

    /**
     * Show/hide "no results" message
     */
    function showNoResultsMessage(show) {
        let noResultsEl = volunteerList.querySelector('.no-results');

        if (show && !noResultsEl) {
            noResultsEl = document.createElement('div');
            noResultsEl.className = 'no-results';
            noResultsEl.innerHTML = `
                <div class="no-results-icon">🔍</div>
                <h3>No positions found</h3>
                <p>Try adjusting your filters to see more results.</p>
            `;
            volunteerList.appendChild(noResultsEl);
        } else if (!show && noResultsEl) {
            noResultsEl.remove();
        }
    }

    /**
     * Show/hide reset button based on whether filters are active
     */
    function updateResetButton() {
        if (!resetBtn) return;

        const hasActiveFilters = state.currentFilter !== 'all' || state.currentSort !== 'date-desc';

        if (hasActiveFilters) {
            resetBtn.classList.remove('hidden');
            state.isFiltered = true;
        } else {
            resetBtn.classList.add('hidden');
            state.isFiltered = false;
        }
    }

    // ============================================
    // VISUAL ENHANCEMENTS
    // ============================================
    /**
     * Add role badges to volunteer cards
     */
    function addRoleBadges() {
        state.allVolunteers.forEach(volunteer => {
            const header = volunteer.element.querySelector('h4');
            if (!header) return;

            // Create header wrapper if it doesn't exist
            let headerWrapper = volunteer.element.querySelector('.volunteer-header');
            if (!headerWrapper) {
                headerWrapper = document.createElement('div');
                headerWrapper.className = 'volunteer-header';
                header.parentNode.insertBefore(headerWrapper, header);
                headerWrapper.appendChild(header);
            }

            // Add role badge
            if (!headerWrapper.querySelector('.role-badge')) {
                const badge = document.createElement('span');
                badge.className = `role-badge role-${volunteer.role}`;
                badge.textContent = volunteer.role === 'vice' ? 'Vice Leader' : volunteer.role;
                headerWrapper.appendChild(badge);
            }

            // Add "Current" indicator if applicable
            if (volunteer.isCurrent && !header.querySelector('.current-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'current-indicator';
                indicator.textContent = 'Current';
                header.appendChild(indicator);
            }
        });
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================
    /**
     * Handle filter change
     */
    function handleFilterChange(e) {
        state.currentFilter = e.target.value;
        updateDisplay();

        // Analytics (optional)
        console.log('🔍 Filter changed to:', state.currentFilter);
    }

    /**
     * Handle sort change
     */
    function handleSortChange(e) {
        state.currentSort = e.target.value;
        updateDisplay();

        // Analytics (optional)
        console.log('🔄 Sort changed to:', state.currentSort);
    }

    /**
     * Handle reset button click
     */
    function handleReset() {
        // Reset to defaults
        state.currentFilter = 'all';
        state.currentSort = 'date-desc';

        // Update UI controls
        if (filterSelect) filterSelect.value = 'all';
        if (sortSelect) sortSelect.value = 'date-desc';

        // Update display
        updateDisplay();

        console.log('🔄 Filters reset to defaults');
    }

    // ============================================
    // LOCALSTORAGE PERSISTENCE
    // ============================================

    /**
     * Save user preferences to localStorage
     */
    function savePreferences() {
        try {
            localStorage.setItem('volunteer-filter', state.currentFilter);
            localStorage.setItem('volunteer-sort', state.currentSort);
        } catch (e) {
            console.warn('Could not save preferences:', e);
        }
    }

    /**
     * Load user preferences from localStorage
     */
    function loadPreferences() {
        try {
            const savedFilter = localStorage.getItem('volunteer-filter');
            const savedSort = localStorage.getItem('volunteer-sort');

            if (savedFilter && filterSelect) {
                state.currentFilter = savedFilter;
                filterSelect.value = savedFilter;
            }

            if (savedSort && sortSelect) {
                state.currentSort = savedSort;
                sortSelect.value = savedSort;
            }

            if (savedFilter || savedSort) {
                console.log('✅ Loaded saved preferences:', { filter: savedFilter, sort: savedSort });
            }
        } catch (e) {
            console.warn('Could not load preferences:', e);
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        console.log('🚀 Initializing volunteering filters & sorting...');

        // Extract data from DOM
        extractVolunteerData();

        // Add visual enhancements
        addRoleBadges();

        // Load saved preferences
        loadPreferences();

        // Set up event listeners
        if (filterSelect) {
            filterSelect.addEventListener('change', handleFilterChange);
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', handleSortChange);
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', handleReset);
        }

        // Initial display
        updateDisplay();

        console.log('✅ Volunteering filters initialized successfully!');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();