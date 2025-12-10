(function() {
    const items = document.querySelectorAll('.timeline-item');
    const filters = document.querySelectorAll('.filter-chip');
    const timeline = document.querySelector('.volunteer-timeline');

    // Click to expand/collapse
    items.forEach(item => {
        item.addEventListener('click', function() {
            const isExpanded = this.classList.contains('expanded');

            // Close all other items
            items.forEach(i => i.classList.remove('expanded'));

            // Toggle current item
            if (!isExpanded) {
                this.classList.add('expanded');
            }
        });
    });

    // Filter functionality
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.dataset.filter;

            // Update active state
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            items.forEach(item => {
                if (filterValue === 'all') {
                    item.classList.remove('hidden');
                } else if (filterValue === 'current') {
                    if (item.classList.contains('current')) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });

            // Center the visible items if only a few are shown
            centerTimelineItems();
        });
    });

    // Function to center timeline when few items are visible
    function centerTimelineItems() {
        const visibleItems = document.querySelectorAll('.timeline-item:not(.hidden)');

        if (visibleItems.length <= 3) {
            // Calculate total width of visible items
            const totalItemsWidth = Array.from(visibleItems).reduce((sum, item) => {
                return sum + item.offsetWidth + 32; // 32px = 2rem gap
            }, 0);

            const containerWidth = timeline.offsetWidth;

            if (totalItemsWidth < containerWidth) {
                // Center by scrolling to middle and adding padding
                timeline.style.justifyContent = 'center';
            } else {
                timeline.style.justifyContent = 'flex-start';
            }
        } else {
            timeline.style.justifyContent = 'flex-start';
        }

        // Reset scroll position
        timeline.scrollLeft = 0;
    }
})();