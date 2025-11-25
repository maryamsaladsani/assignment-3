(function() {
    const items = document.querySelectorAll('.timeline-item');
    const filters = document.querySelectorAll('.filter-chip');

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
        });
    });
})();