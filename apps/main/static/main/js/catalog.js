// catalog.js - Optimized version
class CatalogPage {
    constructor() {
        this.products = Array.from(document.querySelectorAll('.product-card'));
        this.filters = {
            category: [],
            price: { min: 0, max: 5000 },
            material: [],
            color: [],
            rating: null,
            availability: [],
            features: [],
            search: ''
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateResultsCount();
    }

    bindEvents() {
        // Filter events
        document.querySelectorAll('[data-filter]').forEach(filter => {
            filter.addEventListener('change', this.handleFilterChange.bind(this));
        });

        // Search
        document.getElementById('search-input').addEventListener('input',
            this.debounce(this.handleSearch.bind(this), 300)
        );

        // Price range
        document.getElementById('price-from').addEventListener('input',
            this.debounce(this.handlePriceChange.bind(this), 500)
        );
        document.getElementById('price-to').addEventListener('input',
            this.debounce(this.handlePriceChange.bind(this), 500)
        );

        // Clear filters
        document.getElementById('clear-filters').addEventListener('click',
            this.clearAllFilters.bind(this)
        );
        document.getElementById('clear-filters-mobile').addEventListener('click',
            this.clearAllFilters.bind(this)
        );

        // View toggle
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', this.handleViewToggle.bind(this));
        });

        // Mobile filter toggle
        document.querySelector('[data-filter-toggle]').addEventListener('click',
            this.toggleMobileFilters.bind(this)
        );

        // Sort
        document.getElementById('sort-select').addEventListener('change',
            this.handleSort.bind(this)
        );
    }

    handleFilterChange(e) {
        const filterType = e.target.getAttribute('data-filter');
        const value = e.target.value;
        const isChecked = e.target.checked;

        this.updateFilterState(filterType, value, isChecked);
        this.applyFilters();
    }

    updateFilterState(type, value, isChecked) {
        switch(type) {
            case 'category':
            case 'material':
            case 'color':
            case 'availability':
            case 'features':
                if (isChecked) {
                    this.filters[type].push(value);
                } else {
                    this.filters[type] = this.filters[type].filter(item => item !== value);
                }
                break;
            case 'rating':
                this.filters.rating = isChecked ? value : null;
                break;
        }
    }

    handleSearch(e) {
        this.filters.search = e.target.value.toLowerCase().trim();
        this.applyFilters();
    }

    handlePriceChange() {
        const min = parseInt(document.getElementById('price-from').value) || 0;
        const max = parseInt(document.getElementById('price-to').value) || 5000;

        this.filters.price = { min, max };
        this.applyFilters();
    }

    applyFilters() {
        let visibleCount = 0;

        this.products.forEach(product => {
            const matches = this.productMatchesFilters(product);
            product.style.display = matches ? 'block' : 'none';
            if (matches) visibleCount++;
        });

        this.updateUI(visibleCount);
    }

    productMatchesFilters(product) {
        const price = parseInt(product.dataset.price);
        const rating = parseFloat(product.dataset.rating);

        // Price filter
        if (price < this.filters.price.min || price > this.filters.price.max) {
            return false;
        }

        // Category filter
        if (this.filters.category.length > 0 &&
            !this.filters.category.includes(product.dataset.category)) {
            return false;
        }

        // Search filter
        if (this.filters.search) {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            if (!title.includes(this.filters.search)) {
                return false;
            }
        }

        // Rating filter
        if (this.filters.rating && rating < parseFloat(this.filters.rating)) {
            return false;
        }

        // Features filter
        if (this.filters.features.length > 0) {
            const productFeatures = product.dataset.features?.split(',') || [];
            const hasAllFeatures = this.filters.features.every(feature =>
                productFeatures.includes(feature)
            );
            if (!hasAllFeatures) return false;
        }

        // Availability filter
        if (this.filters.availability.length > 0) {
            const productAvailability = product.dataset.availability;
            if (!this.filters.availability.includes(productAvailability)) {
                return false;
            }
        }

        return true;
    }

    updateUI(visibleCount) {
        this.updateResultsCount(visibleCount);
        this.toggleNoResults(visibleCount === 0);
        this.updateActiveFilters();
    }

    updateResultsCount(count = null) {
        const resultsCount = count !== null ? count : this.products.length;
        document.getElementById('results-count').textContent = resultsCount;
    }

    toggleNoResults(show) {
        const noResults = document.getElementById('no-results');
        const productsGrid = document.getElementById('products-grid');

        noResults.style.display = show ? 'flex' : 'none';
        productsGrid.style.display = show ? 'none' : 'grid';
    }

    updateActiveFilters() {
        // Simplified active filters update
        const activeFilters = document.getElementById('active-filters');
        const hasActiveFilters = Object.values(this.filters).some(filter =>
            Array.isArray(filter) ? filter.length > 0 :
            typeof filter === 'object' ? filter.min > 0 || filter.max < 5000 :
            filter !== null && filter !== ''
        );

        activeFilters.style.display = hasActiveFilters ? 'block' : 'none';
    }

    clearAllFilters() {
        // Reset all checkboxes and inputs
        document.querySelectorAll('[data-filter]').forEach(filter => {
            filter.checked = false;
        });

        document.getElementById('price-from').value = 0;
        document.getElementById('price-to').value = 5000;
        document.getElementById('search-input').value = '';

        // Reset filter state
        this.filters = {
            category: [],
            price: { min: 0, max: 5000 },
            material: [],
            color: [],
            rating: null,
            availability: [],
            features: [],
            search: ''
        };

        this.applyFilters();
    }

    handleViewToggle(e) {
        const view = e.currentTarget.dataset.view;
        const productsGrid = document.getElementById('products-grid');

        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Toggle view
        productsGrid.classList.toggle('list-view', view === 'list');
    }

    handleSort(e) {
        const sortBy = e.target.value;
        this.sortProducts(sortBy);
    }

    sortProducts(sortBy) {
        const productsGrid = document.getElementById('products-grid');
        const products = Array.from(this.products).filter(p => p.style.display !== 'none');

        products.sort((a, b) => {
            switch(sortBy) {
                case 'price-asc':
                    return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                case 'price-desc':
                    return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                case 'name-asc':
                    return a.querySelector('.product-title').textContent.localeCompare(
                        b.querySelector('.product-title').textContent
                    );
                case 'name-desc':
                    return b.querySelector('.product-title').textContent.localeCompare(
                        a.querySelector('.product-title').textContent
                    );
                case 'rating':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                default:
                    return 0;
            }
        });

        // Reappend sorted products
        products.forEach(product => productsGrid.appendChild(product));
    }

    toggleMobileFilters() {
        const sidebar = document.getElementById('catalog-sidebar');
        sidebar.classList.toggle('open');

        // Create overlay if doesn't exist
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', this.toggleMobileFilters.bind(this));
            document.body.appendChild(overlay);
        }

        overlay.classList.toggle('active');
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CatalogPage();
});