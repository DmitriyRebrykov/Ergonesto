/**
 * ERGONESTO Catalog Page - JavaScript
 * Advanced filtering, sorting, and product management
 * Author: ERGONESTO Team
 * Version: 1.0.0
 */

;(() => {
  // Catalog page functionality
  const CatalogPage = {
    // Configuration
    config: {
      productsPerPage: 12,
      debounceDelay: 300,
      animationDuration: 300,
      maxPrice: 5000,
      minPrice: 0,
    },

    // State management
    state: {
      products: [],
      filteredProducts: [],
      currentPage: 1,
      totalPages: 1,
      currentView: "grid",
      currentSort: "popularity",
      filters: {
        search: "",
        category: [],
        material: [],
        color: [],
        rating: null,
        availability: [],
        features: [],
        priceMin: 0,
        priceMax: 5000,
      },
      loading: false,
      sidebarOpen: false,
    },

    // DOM elements cache
    elements: {},

    // Sample products data
    sampleProducts: [
      {
        id: 1,
        name: "ERGONESTO Ергономічна підставка для ніг",
        category: "footrests",
        price: 2499,
        oldPrice: 3199,
        rating: 4.9,
        reviews: 2500,
        image: "unnamed.png",
        badges: ["bestseller", "sale"],
        features: ["adjustable", "eco-friendly", "warranty"],
        material: "wood",
        colors: ["brown", "black", "gray"],
        availability: "in-stock",
        stock: 47,
        description: "Преміальна ергономічна підставка з 5 рівнями регулювання",
      },
      {
        id: 2,
        name: "Ергономічна подушка для спини Premium",
        category: "back-support",
        price: 1299,
        oldPrice: null,
        rating: 4.7,
        reviews: 1850,
        image: "/placeholder.svg?height=300&width=300&text=Подушка+спина",
        badges: ["new"],
        features: ["eco-friendly", "warranty"],
        material: "memory-foam",
        colors: ["black", "gray", "beige"],
        availability: "in-stock",
        stock: 23,
        description: "М'яка підтримка для поперекового відділу хребта",
      },
      {
        id: 3,
        name: "Підставка для монітора з органайзером",
        category: "organizers",
        price: 899,
        oldPrice: 1199,
        rating: 4.6,
        reviews: 1200,
        image: "/placeholder.svg?height=300&width=300&text=Підставка+монітор",
        badges: ["sale"],
        features: ["adjustable", "warranty"],
        material: "wood",
        colors: ["brown", "white"],
        availability: "in-stock",
        stock: 15,
        description: "Стильна підставка з відділеннями для аксесуарів",
      },
      {
        id: 4,
        name: "LED настільна лампа з бездротовою зарядкою",
        category: "lighting",
        price: 1599,
        oldPrice: null,
        rating: 4.8,
        reviews: 890,
        image: "/placeholder.svg?height=300&width=300&text=LED+лампа",
        badges: ["new"],
        features: ["adjustable", "eco-friendly"],
        material: "metal",
        colors: ["white", "black"],
        availability: "in-stock",
        stock: 8,
        description: "Розумна лампа з регулюванням яскравості та температури",
      },
      {
        id: 5,
        name: "Органайзер для столу з бамбука",
        category: "organizers",
        price: 599,
        oldPrice: null,
        rating: 4.5,
        reviews: 650,
        image: "/placeholder.svg?height=300&width=300&text=Органайзер+бамбук",
        badges: [],
        features: ["eco-friendly", "warranty"],
        material: "wood",
        colors: ["beige"],
        availability: "in-stock",
        stock: 32,
        description: "Екологічний органайзер з натурального бамбука",
      },
      {
        id: 6,
        name: "Ергономічна підставка для ноутбука",
        category: "accessories",
        price: 799,
        oldPrice: 999,
        rating: 4.4,
        reviews: 420,
        image: "/placeholder.svg?height=300&width=300&text=Підставка+ноутбук",
        badges: ["sale"],
        features: ["adjustable"],
        material: "metal",
        colors: ["gray", "black"],
        availability: "in-stock",
        stock: 19,
        description: "Складна підставка для комфортної роботи з ноутбуком",
      },
      {
        id: 7,
        name: "Масажна подушка для шиї",
        category: "back-support",
        price: 1899,
        oldPrice: null,
        rating: 4.9,
        reviews: 1100,
        image: "/placeholder.svg?height=300&width=300&text=Масажна+подушка",
        badges: ["bestseller"],
        features: ["warranty"],
        material: "memory-foam",
        colors: ["gray", "beige"],
        availability: "pre-order",
        stock: 0,
        description: "Подушка з вібромасажем для розслаблення м'язів",
      },
      {
        id: 8,
        name: "Підставка для ніг з підігрівом",
        category: "footrests",
        price: 3299,
        oldPrice: null,
        rating: 4.7,
        reviews: 780,
        image: "/placeholder.svg?height=300&width=300&text=Підставка+підігрів",
        badges: ["new"],
        features: ["adjustable", "warranty"],
        material: "plastic",
        colors: ["black", "gray"],
        availability: "in-stock",
        stock: 12,
        description: "Інноваційна підставка з функцією підігріву",
      },
      // Add more products to reach 24 total
      {
        id: 9,
        name: "Ергономічна клавіатура з підставкою",
        category: "accessories",
        price: 2199,
        oldPrice: 2599,
        rating: 4.6,
        reviews: 560,
        image: "/placeholder.svg?height=300&width=300&text=Клавіатура+ерго",
        badges: ["sale"],
        features: ["adjustable", "warranty"],
        material: "plastic",
        colors: ["black", "white"],
        availability: "in-stock",
        stock: 25,
        description: "Розділена клавіатура для природного положення рук",
      },
      {
        id: 10,
        name: "Підставка для документів регульована",
        category: "organizers",
        price: 449,
        oldPrice: null,
        rating: 4.3,
        reviews: 340,
        image: "/placeholder.svg?height=300&width=300&text=Підставка+документи",
        badges: [],
        features: ["adjustable", "eco-friendly"],
        material: "metal",
        colors: ["gray", "black"],
        availability: "in-stock",
        stock: 18,
        description: "Зручна підставка для читання документів",
      },
      {
        id: 11,
        name: "Світлодіодна панель для підсвічування",
        category: "lighting",
        price: 1299,
        oldPrice: null,
        rating: 4.5,
        reviews: 290,
        image: "/placeholder.svg?height=300&width=300&text=LED+панель",
        badges: ["new"],
        features: ["adjustable", "eco-friendly"],
        material: "metal",
        colors: ["white"],
        availability: "in-stock",
        stock: 14,
        description: "Рівномірне освітлення робочої поверхні",
      },
      {
        id: 12,
        name: "Ергономічна миша вертикальна",
        category: "accessories",
        price: 899,
        oldPrice: 1099,
        rating: 4.4,
        reviews: 670,
        image: "/placeholder.svg?height=300&width=300&text=Миша+вертикальна",
        badges: ["sale"],
        features: ["warranty"],
        material: "plastic",
        colors: ["black", "gray"],
        availability: "in-stock",
        stock: 31,
        description: "Вертикальна миша для зменшення навантаження на зап'ястя",
      },
      // Continue with more products...
      {
        id: 13,
        name: "Підставка для ніг з масажними роликами",
        category: "footrests",
        price: 1899,
        oldPrice: null,
        rating: 4.8,
        reviews: 450,
        image: "/placeholder.svg?height=300&width=300&text=Підставка+масаж",
        badges: ["bestseller"],
        features: ["warranty"],
        material: "wood",
        colors: ["brown"],
        availability: "in-stock",
        stock: 9,
        description: "Підставка з масажними роликами для стоп",
      },
      {
        id: 14,
        name: "Поясна подушка з пам'яттю форми",
        category: "back-support",
        price: 1599,
        oldPrice: 1899,
        rating: 4.7,
        reviews: 820,
        image: "/placeholder.svg?height=300&width=300&text=Подушка+поясна",
        badges: ["sale"],
        features: ["eco-friendly", "warranty"],
        material: "memory-foam",
        colors: ["black", "gray", "beige"],
        availability: "in-stock",
        stock: 16,
        description: "Анатомічна підтримка поперекового відділу",
      },
      {
        id: 15,
        name: "Настільний органайзер з зарядкою",
        category: "organizers",
        price: 1199,
        oldPrice: null,
        rating: 4.6,
        reviews: 380,
        image: "/placeholder.svg?height=300&width=300&text=Органайзер+зарядка",
        badges: ["new"],
        features: ["adjustable"],
        material: "plastic",
        colors: ["white", "black"],
        availability: "in-stock",
        stock: 22,
        description: "Органайзер з вбудованими USB-портами",
      },
      {
        id: 16,
        name: "Кільцева лампа для відеодзвінків",
        category: "lighting",
        price: 799,
        oldPrice: 999,
        rating: 4.5,
        reviews: 520,
        image: "/placeholder.svg?height=300&width=300&text=Кільцева+лампа",
        badges: ["sale"],
        features: ["adjustable"],
        material: "metal",
        colors: ["white", "black"],
        availability: "in-stock",
        stock: 27,
        description: "Професійне освітлення для відеоконференцій",
      },
      {
        id: 17,
        name: "Підставка для планшета регульована",
        category: "accessories",
        price: 349,
        oldPrice: null,
        rating: 4.2,
        reviews: 210,
        image: "/placeholder.svg?height=300&width=300&text=Підставка+планшет",
        badges: [],
        features: ["adjustable", "eco-friendly"],
        material: "wood",
        colors: ["brown", "beige"],
        availability: "in-stock",
        stock: 35,
        description: "Компактна підставка для планшетів та телефонів",
      },
      {
        id: 18,
        name: "Ергономічна підставка для ніг складна",
        category: "footrests",
        price: 1799,
        oldPrice: 2199,
        rating: 4.4,
        reviews: 390,
        image: "/placeholder.svg?height=300&width=300&text=Підставка+складна",
        badges: ["sale"],
        features: ["adjustable", "warranty"],
        material: "metal",
        colors: ["gray", "black"],
        availability: "in-stock",
        stock: 13,
        description: "Компактна складна підставка для подорожей",
      },
      {
        id: 19,
        name: "Подушка для сидіння ортопедична",
        category: "back-support",
        price: 999,
        oldPrice: null,
        rating: 4.6,
        reviews: 680,
        image: "/placeholder.svg?height=300&width=300&text=Подушка+сидіння",
        badges: [],
        features: ["eco-friendly", "warranty"],
        material: "memory-foam",
        colors: ["gray", "beige"],
        availability: "in-stock",
        stock: 28,
        description: "Ортопедична подушка для правильної постави",
      },
      {
        id: 20,
        name: "Органайзер для кабелів магнітний",
        category: "organizers",
        price: 299,
        oldPrice: 399,
        rating: 4.3,
        reviews: 150,
        image: "/placeholder.svg?height=300&width=300&text=Органайзер+кабелі",
        badges: ["sale"],
        features: [],
        material: "plastic",
        colors: ["black", "white"],
        availability: "in-stock",
        stock: 45,
        description: "Магнітний тримач для організації кабелів",
      },
      {
        id: 21,
        name: "Настільна лампа з годинником",
        category: "lighting",
        price: 1099,
        oldPrice: null,
        rating: 4.4,
        reviews: 320,
        image: "/placeholder.svg?height=300&width=300&text=Лампа+годинник",
        badges: ["new"],
        features: ["adjustable"],
        material: "plastic",
        colors: ["white", "black"],
        availability: "pre-order",
        stock: 0,
        description: "Багатофункціональна лампа з цифровим годинником",
      },
      {
        id: 22,
        name: "Підставка для ніг з підсвічуванням",
        category: "footrests",
        price: 2799,
        oldPrice: null,
        rating: 4.9,
        reviews: 180,
        image: "/placeholder.svg?height=300&width=300&text=Підставка+LED",
        badges: ["new", "bestseller"],
        features: ["adjustable", "warranty"],
        material: "plastic",
        colors: ["black", "white"],
        availability: "in-stock",
        stock: 6,
        description: "Футуристична підставка з RGB підсвічуванням",
      },
      {
        id: 23,
        name: "Ергономічна подушка для шиї в дорогу",
        category: "back-support",
        price: 699,
        oldPrice: 899,
        rating: 4.5,
        reviews: 540,
        image: "/placeholder.svg?height=300&width=300&text=Подушка+дорога",
        badges: ["sale"],
        features: ["eco-friendly"],
        material: "memory-foam",
        colors: ["gray", "beige"],
        availability: "in-stock",
        stock: 38,
        description: "Компактна подушка для комфортних подорожей",
      },
      {
        id: 24,
        name: "Підставка для книг з закладками",
        category: "organizers",
        price: 549,
        oldPrice: null,
        rating: 4.2,
        reviews: 260,
        image: "/placeholder.svg?height=300&width=300&text=Підставка+книги",
        badges: [],
        features: ["adjustable", "eco-friendly"],
        material: "wood",
        colors: ["brown", "beige"],
        availability: "in-stock",
        stock: 21,
        description: "Зручна підставка для читання з тримачем закладок",
      },
    ],

    // Initialize the catalog page
    init() {
      this.cacheElements()
      this.bindEvents()
      this.loadProducts()
      this.initializeFilters()
      this.setupPriceRange()
      console.log("Catalog page initialized successfully")
    },

    // Cache DOM elements for performance
    cacheElements() {
      this.elements = {
        // Filter controls
        mobileFilterToggle: document.querySelector("[data-filter-toggle]"),
        sidebar: document.getElementById("catalog-sidebar"),
        clearFiltersBtn: document.getElementById("clear-filters"),
        searchInput: document.getElementById("search-input"),

        // View and sort controls
        viewBtns: document.querySelectorAll(".view-btn"),
        sortSelect: document.getElementById("sort-select"),
        resultsCount: document.getElementById("results-count"),

        // Filter inputs
        filterInputs: document.querySelectorAll("[data-filter]"),
        priceMin: document.getElementById("price-min"),
        priceMax: document.getElementById("price-max"),
        priceFrom: document.getElementById("price-from"),
        priceTo: document.getElementById("price-to"),

        // Products container
        productsGrid: document.getElementById("products-grid"),
        loadingState: document.getElementById("loading-state"),
        noResults: document.getElementById("no-results"),

        // Active filters
        activeFilters: document.getElementById("active-filters"),
        activeFiltersList: document.getElementById("active-filters-list"),
        activeFiltersCount: document.getElementById("active-filters-count"),

        // Pagination
        paginationContainer: document.getElementById("pagination-container"),
      }
    },

    // Bind all event listeners
    bindEvents() {
      // Mobile filter toggle
      if (this.elements.mobileFilterToggle) {
        this.elements.mobileFilterToggle.addEventListener("click", () => {
          this.toggleSidebar()
        })
      }

      // Clear filters
      if (this.elements.clearFiltersBtn) {
        this.elements.clearFiltersBtn.addEventListener("click", () => {
          this.clearAllFilters()
        })
      }

      // Search input
      if (this.elements.searchInput) {
        this.elements.searchInput.addEventListener(
          "input",
          this.debounce((e) => {
            this.updateFilter("search", e.target.value)
          }, this.config.debounceDelay),
        )
      }

      // View toggle
      this.elements.viewBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const view = btn.dataset.view
          this.changeView(view)
        })
      })

      // Sort select
      if (this.elements.sortSelect) {
        this.elements.sortSelect.addEventListener("change", (e) => {
          this.changeSort(e.target.value)
        })
      }

      // Filter inputs
      this.elements.filterInputs.forEach((input) => {
        const filterType = input.dataset.filter

        if (input.type === "checkbox") {
          input.addEventListener("change", () => {
            this.handleCheckboxFilter(filterType, input.value, input.checked)
          })
        } else if (input.type === "radio") {
          input.addEventListener("change", () => {
            if (input.checked) {
              this.updateFilter(filterType, input.value)
            }
          })
        } else if (input.type === "range") {
          input.addEventListener(
            "input",
            this.debounce(() => {
              this.handlePriceFilter()
            }, this.config.debounceDelay),
          )
        }
      })

      // Price inputs
      if (this.elements.priceFrom) {
        this.elements.priceFrom.addEventListener(
          "input",
          this.debounce(() => {
            this.handlePriceInputs()
          }, this.config.debounceDelay),
        )
      }

      if (this.elements.priceTo) {
        this.elements.priceTo.addEventListener(
          "input",
          this.debounce(() => {
            this.handlePriceInputs()
          }, this.config.debounceDelay),
        )
      }

      // Close sidebar on overlay click (mobile)
      document.addEventListener("click", (e) => {
        if (
          this.state.sidebarOpen &&
          !this.elements.sidebar.contains(e.target) &&
          !this.elements.mobileFilterToggle.contains(e.target)
        ) {
          this.closeSidebar()
        }
      })

      // Keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.state.sidebarOpen) {
          this.closeSidebar()
        }
      })
    },

    // Load products data
    loadProducts() {
      this.state.products = this.sampleProducts
      this.state.filteredProducts = [...this.state.products]
      this.renderProducts()
      this.updateResultsCount()
      this.renderPagination()
    },

    // Initialize filters
    initializeFilters() {
      // Set initial filter states
      this.updateActiveFiltersDisplay()
    },

    // Setup price range sliders
    setupPriceRange() {
      if (this.elements.priceMin && this.elements.priceMax) {
        this.elements.priceMin.min = this.config.minPrice
        this.elements.priceMin.max = this.config.maxPrice
        this.elements.priceMax.min = this.config.minPrice
        this.elements.priceMax.max = this.config.maxPrice

        this.elements.priceMin.value = this.state.filters.priceMin
        this.elements.priceMax.value = this.state.filters.priceMax
      }

      if (this.elements.priceFrom && this.elements.priceTo) {
        this.elements.priceFrom.value = this.state.filters.priceMin
        this.elements.priceTo.value = this.state.filters.priceMax
      }
    },

    // Sidebar functionality
    toggleSidebar() {
      if (this.state.sidebarOpen) {
        this.closeSidebar()
      } else {
        this.openSidebar()
      }
    },

    openSidebar() {
      this.state.sidebarOpen = true
      this.elements.sidebar.classList.add("open")

      // Create overlay for mobile
      if (window.innerWidth <= 1024) {
        const overlay = document.createElement("div")
        overlay.className = "sidebar-overlay active"
        overlay.addEventListener("click", () => this.closeSidebar())
        document.body.appendChild(overlay)
        document.body.style.overflow = "hidden"
      }
    },

    closeSidebar() {
      this.state.sidebarOpen = false
      this.elements.sidebar.classList.remove("open")

      // Remove overlay
      const overlay = document.querySelector(".sidebar-overlay")
      if (overlay) {
        overlay.remove()
        document.body.style.overflow = ""
      }
    },

    // View functionality
    changeView(view) {
      if (this.state.currentView === view) return

      this.state.currentView = view

      // Update view buttons
      this.elements.viewBtns.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.view === view)
      })

      // Update products grid class
      this.elements.productsGrid.classList.toggle("list-view", view === "list")

      // Track event
      this.trackEvent("view_change", { view })
    },

    // Sort functionality
    changeSort(sortValue) {
      if (this.state.currentSort === sortValue) return

      this.state.currentSort = sortValue
      this.sortProducts()
      this.renderProducts()
      this.renderPagination()

      // Track event
      this.trackEvent("sort_change", { sort: sortValue })
    },

    sortProducts() {
      const sortFunctions = {
        popularity: (a, b) => b.reviews - a.reviews,
        "price-asc": (a, b) => a.price - b.price,
        "price-desc": (a, b) => b.price - a.price,
        "name-asc": (a, b) => a.name.localeCompare(b.name),
        "name-desc": (a, b) => b.name.localeCompare(a.name),
        rating: (a, b) => b.rating - a.rating,
        newest: (a, b) => {
          const aIsNew = a.badges.includes("new")
          const bIsNew = b.badges.includes("new")
          if (aIsNew && !bIsNew) return -1
          if (!aIsNew && bIsNew) return 1
          return b.id - a.id
        },
      }

      const sortFn = sortFunctions[this.state.currentSort]
      if (sortFn) {
        this.state.filteredProducts.sort(sortFn)
      }
    },

    // Filter functionality
    updateFilter(filterType, value) {
      this.state.filters[filterType] = value
      this.applyFilters()
      this.updateActiveFiltersDisplay()
    },

    handleCheckboxFilter(filterType, value, checked) {
      if (!Array.isArray(this.state.filters[filterType])) {
        this.state.filters[filterType] = []
      }

      if (checked) {
        if (!this.state.filters[filterType].includes(value)) {
          this.state.filters[filterType].push(value)
        }
      } else {
        this.state.filters[filterType] = this.state.filters[filterType].filter((v) => v !== value)
      }

      this.applyFilters()
      this.updateActiveFiltersDisplay()
    },

    handlePriceFilter() {
      const minValue = Number.parseInt(this.elements.priceMin.value)
      const maxValue = Number.parseInt(this.elements.priceMax.value)

      // Ensure min is not greater than max
      if (minValue > maxValue) {
        this.elements.priceMin.value = maxValue
        this.state.filters.priceMin = maxValue
      } else {
        this.state.filters.priceMin = minValue
      }

      this.state.filters.priceMax = maxValue

      // Update input fields
      if (this.elements.priceFrom) {
        this.elements.priceFrom.value = this.state.filters.priceMin
      }
      if (this.elements.priceTo) {
        this.elements.priceTo.value = this.state.filters.priceMax
      }

      this.applyFilters()
      this.updateActiveFiltersDisplay()
    },

    handlePriceInputs() {
      const minValue = Number.parseInt(this.elements.priceFrom.value) || this.config.minPrice
      const maxValue = Number.parseInt(this.elements.priceTo.value) || this.config.maxPrice

      // Validate and constrain values
      const constrainedMin = Math.max(this.config.minPrice, Math.min(minValue, maxValue))
      const constrainedMax = Math.min(this.config.maxPrice, Math.max(minValue, maxValue))

      this.state.filters.priceMin = constrainedMin
      this.state.filters.priceMax = constrainedMax

      // Update sliders
      if (this.elements.priceMin) {
        this.elements.priceMin.value = constrainedMin
      }
      if (this.elements.priceMax) {
        this.elements.priceMax.value = constrainedMax
      }

      // Update inputs with constrained values
      this.elements.priceFrom.value = constrainedMin
      this.elements.priceTo.value = constrainedMax

      this.applyFilters()
      this.updateActiveFiltersDisplay()
    },

    applyFilters() {
      this.state.loading = true
      this.showLoading()

      // Simulate loading delay
      setTimeout(() => {
        this.state.filteredProducts = this.state.products.filter((product) => {
          // Search filter
          if (this.state.filters.search) {
            const searchTerm = this.state.filters.search.toLowerCase()
            if (
              !product.name.toLowerCase().includes(searchTerm) &&
              !product.description.toLowerCase().includes(searchTerm)
            ) {
              return false
            }
          }

          // Category filter
          if (this.state.filters.category.length > 0) {
            if (!this.state.filters.category.includes(product.category)) {
              return false
            }
          }

          // Material filter
          if (this.state.filters.material.length > 0) {
            if (!this.state.filters.material.includes(product.material)) {
              return false
            }
          }

          // Color filter
          if (this.state.filters.color.length > 0) {
            const hasMatchingColor = this.state.filters.color.some((color) => product.colors.includes(color))
            if (!hasMatchingColor) {
              return false
            }
          }

          // Rating filter
          if (this.state.filters.rating) {
            const minRating = Number.parseFloat(this.state.filters.rating)
            if (product.rating < minRating) {
              return false
            }
          }

          // Availability filter
          if (this.state.filters.availability.length > 0) {
            if (!this.state.filters.availability.includes(product.availability)) {
              return false
            }
          }

          // Features filter
          if (this.state.filters.features.length > 0) {
            const hasMatchingFeature = this.state.filters.features.some((feature) => product.features.includes(feature))
            if (!hasMatchingFeature) {
              return false
            }
          }

          // Price filter
          if (product.price < this.state.filters.priceMin || product.price > this.state.filters.priceMax) {
            return false
          }

          return true
        })

        this.sortProducts()
        this.state.currentPage = 1
        this.state.loading = false

        this.renderProducts()
        this.updateResultsCount()
        this.renderPagination()
        this.hideLoading()

        // Track filter event
        this.trackEvent("filters_applied", {
          filters: this.state.filters,
          results_count: this.state.filteredProducts.length,
        })
      }, 300)
    },

    clearAllFilters() {
      // Reset all filters
      this.state.filters = {
        search: "",
        category: [],
        material: [],
        color: [],
        rating: null,
        availability: [],
        features: [],
        priceMin: this.config.minPrice,
        priceMax: this.config.maxPrice,
      }

      // Reset form inputs
      this.elements.filterInputs.forEach((input) => {
        if (input.type === "checkbox" || input.type === "radio") {
          input.checked = false
        } else if (input.type === "range") {
          if (input.dataset.filter === "price-min") {
            input.value = this.config.minPrice
          } else if (input.dataset.filter === "price-max") {
            input.value = this.config.maxPrice
          }
        }
      })

      if (this.elements.searchInput) {
        this.elements.searchInput.value = ""
      }

      if (this.elements.priceFrom) {
        this.elements.priceFrom.value = this.config.minPrice
      }

      if (this.elements.priceTo) {
        this.elements.priceTo.value = this.config.maxPrice
      }

      this.applyFilters()
      this.updateActiveFiltersDisplay()

      // Track event
      this.trackEvent("filters_cleared")
    },

    // Active filters display
    updateActiveFiltersDisplay() {
      const activeFilters = this.getActiveFilters()
      const hasActiveFilters = activeFilters.length > 0

      // Update filter count
      if (this.elements.activeFiltersCount) {
        this.elements.activeFiltersCount.textContent = activeFilters.length
        this.elements.activeFiltersCount.classList.toggle("has-filters", hasActiveFilters)
      }

      // Show/hide active filters section
      if (this.elements.activeFilters) {
        this.elements.activeFilters.style.display = hasActiveFilters ? "block" : "none"
      }

      // Render active filter tags
      if (this.elements.activeFiltersList) {
        this.elements.activeFiltersList.innerHTML = activeFilters
          .map(
            (filter) =>
              `<div class="filter-tag">
            <span>${filter.label}</span>
            <button class="filter-tag-remove" onclick="CatalogPage.removeFilter('${filter.type}', '${filter.value}')" aria-label="Видалити фільтр">
              <i class="fas fa-times"></i>
            </button>
          </div>`,
          )
          .join("")
      }
    },

    getActiveFilters() {
      const filters = []

      // Search
      if (this.state.filters.search) {
        filters.push({
          type: "search",
          value: this.state.filters.search,
          label: `Пошук: "${this.state.filters.search}"`,
        })
      }

      // Categories
      this.state.filters.category.forEach((category) => {
        const labels = {
          footrests: "Підставки для ніг",
          "back-support": "Підтримка спини",
          organizers: "Органайзери",
          lighting: "Освітлення",
          accessories: "Аксесуари",
        }
        filters.push({
          type: "category",
          value: category,
          label: labels[category] || category,
        })
      })

      // Materials
      this.state.filters.material.forEach((material) => {
        const labels = {
          wood: "Дерево",
          metal: "Метал",
          plastic: "Пластик",
          "memory-foam": "Memory Foam",
        }
        filters.push({
          type: "material",
          value: material,
          label: labels[material] || material,
        })
      })

      // Colors
      this.state.filters.color.forEach((color) => {
        const labels = {
          brown: "Коричневий",
          black: "Чорний",
          white: "Білий",
          gray: "Сірий",
          beige: "Бежевий",
        }
        filters.push({
          type: "color",
          value: color,
          label: labels[color] || color,
        })
      })

      // Rating
      if (this.state.filters.rating) {
        filters.push({
          type: "rating",
          value: this.state.filters.rating,
          label: `Рейтинг: ${this.state.filters.rating}+ зірок`,
        })
      }

      // Availability
      this.state.filters.availability.forEach((availability) => {
        const labels = {
          "in-stock": "В наявності",
          "pre-order": "Під замовлення",
        }
        filters.push({
          type: "availability",
          value: availability,
          label: labels[availability] || availability,
        })
      })

      // Features
      this.state.filters.features.forEach((feature) => {
        const labels = {
          adjustable: "Регульований",
          "eco-friendly": "Екологічний",
          warranty: "Гарантія 2+ роки",
        }
        filters.push({
          type: "features",
          value: feature,
          label: labels[feature] || feature,
        })
      })

      // Price range
      if (this.state.filters.priceMin > this.config.minPrice || this.state.filters.priceMax < this.config.maxPrice) {
        filters.push({
          type: "price",
          value: `${this.state.filters.priceMin}-${this.state.filters.priceMax}`,
          label: `Ціна: ${this.state.filters.priceMin}-${this.state.filters.priceMax} ₴`,
        })
      }

      return filters
    },

    removeFilter(type, value) {
      if (type === "search") {
        this.state.filters.search = ""
        if (this.elements.searchInput) {
          this.elements.searchInput.value = ""
        }
      } else if (type === "rating") {
        this.state.filters.rating = null
        // Uncheck radio buttons
        document.querySelectorAll('input[name="rating"]').forEach((input) => {
          input.checked = false
        })
      } else if (type === "price") {
        this.state.filters.priceMin = this.config.minPrice
        this.state.filters.priceMax = this.config.maxPrice
        this.setupPriceRange()
      } else if (Array.isArray(this.state.filters[type])) {
        this.state.filters[type] = this.state.filters[type].filter((v) => v !== value)
        // Uncheck corresponding checkbox
        const checkbox = document.querySelector(`input[data-filter="${type}"][value="${value}"]`)
        if (checkbox) {
          checkbox.checked = false
        }
      }

      this.applyFilters()
      this.updateActiveFiltersDisplay()
    },

    // Products rendering
    renderProducts() {
      if (!this.elements.productsGrid) return

      const startIndex = (this.state.currentPage - 1) * this.config.productsPerPage
      const endIndex = startIndex + this.config.productsPerPage
      const productsToShow = this.state.filteredProducts.slice(startIndex, endIndex)

      if (productsToShow.length === 0) {
        this.showNoResults()
        return
      }

      this.hideNoResults()

      this.elements.productsGrid.innerHTML = productsToShow.map((product) => this.createProductCard(product)).join("")

      // Bind product card events
      this.bindProductCardEvents()
    },

    createProductCard(product) {
      const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
      const badges = product.badges
        .map((badge) => {
          const badgeLabels = {
            new: "Новинка",
            sale: "Знижка",
            bestseller: "Хіт продажів",
          }
          return `<span class="product-badge badge-${badge}">${badgeLabels[badge]}</span>`
        })
        .join("")

      const stars = Array.from(
        { length: 5 },
        (_, i) => `<i class="fas fa-star${i < Math.floor(product.rating) ? "" : " far"}"></i>`,
      ).join("")

      const features = product.features
        .slice(0, 3)
        .map((feature) => {
          const featureLabels = {
            adjustable: "Регульований",
            "eco-friendly": "Екологічний",
            warranty: "Гарантія",
          }
          return `<span class="product-feature">${featureLabels[feature]}</span>`
        })
        .join("")

      const availabilityClass = product.availability === "in-stock" ? "in-stock" : "pre-order"
      const availabilityText = product.availability === "in-stock" ? "В наявності" : "Під замовлення"

      return `
        <div class="product-card" data-product-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${badges ? `<div class="product-badges">${badges}</div>` : ""}
            <div class="product-actions">
              <button class="product-action-btn wishlist-btn" title="Додати в список бажань" data-action="wishlist">
                <i class="far fa-heart"></i>
              </button>
              <button class="product-action-btn compare-btn" title="Порівняти" data-action="compare">
                <i class="fas fa-balance-scale"></i>
              </button>
              <button class="product-action-btn quick-view-btn" title="Швидкий перегляд" data-action="quick-view">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          <div class="product-info">
            <div class="product-details">
              <div class="product-category">${this.getCategoryLabel(product.category)}</div>
              <h3 class="product-title">
                <a href="product.html?id=${product.id}">${product.name}</a>
              </h3>
              <div class="product-rating">
                <div class="product-stars">${stars}</div>
                <span class="product-rating-text">${product.rating} (${product.reviews})</span>
              </div>
              ${features ? `<div class="product-features"><div class="product-features-list">${features}</div></div>` : ""}
              <div class="product-availability ${availabilityClass}">
                <i class="fas fa-${product.availability === "in-stock" ? "check" : "clock"}"></i>
                ${availabilityText}
                ${product.stock > 0 ? `<span class="stock-count">(${product.stock} шт.)</span>` : ""}
              </div>
            </div>
            <div class="product-price-actions">
              <div class="product-price">
                <span class="current-price">${product.price.toLocaleString()} ₴</span>
                ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString()} ₴</span>` : ""}
                ${discount > 0 ? `<span class="discount-percent">-${discount}%</span>` : ""}
              </div>
              <div class="product-card-actions">
                <button class="add-to-cart-btn" data-action="add-to-cart" ${product.availability !== "in-stock" ? "disabled" : ""}>
                  <i class="fas fa-shopping-cart"></i>
                  ${product.availability === "in-stock" ? "В кошик" : "Замовити"}
                </button>
                <button class="quick-view-btn" data-action="quick-view" title="Швидкий перегляд">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `
    },

    getCategoryLabel(category) {
      const labels = {
        footrests: "Підставки для ніг",
        "back-support": "Підтримка спини",
        organizers: "Органайзери",
        lighting: "Освітлення",
        accessories: "Аксесуари",
      }
      return labels[category] || category
    },

    bindProductCardEvents() {
      // Add to cart buttons
      document.querySelectorAll('[data-action="add-to-cart"]').forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault()
          const productId = Number.parseInt(btn.closest(".product-card").dataset.productId)
          this.addToCart(productId)
        })
      })

      // Wishlist buttons
      document.querySelectorAll('[data-action="wishlist"]').forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault()
          const productId = Number.parseInt(btn.closest(".product-card").dataset.productId)
          this.toggleWishlist(productId, btn)
        })
      })

      // Compare buttons
      document.querySelectorAll('[data-action="compare"]').forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault()
          const productId = Number.parseInt(btn.closest(".product-card").dataset.productId)
          this.toggleCompare(productId, btn)
        })
      })

      // Quick view buttons
      document.querySelectorAll('[data-action="quick-view"]').forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault()
          const productId = Number.parseInt(btn.closest(".product-card").dataset.productId)
          this.showQuickView(productId)
        })
      })
    },

    // Product actions
    addToCart(productId) {
      const product = this.state.products.find((p) => p.id === productId)
      if (!product) return

      // Simulate adding to cart
      const currentCount = Number.parseInt(document.getElementById("cart-count")?.textContent || "0")
      const newCount = currentCount + 1

      // Update cart count
      window.ERGONESTO?.updateCartCount(newCount)

      // Show success notification
      window.ERGONESTO?.showNotification(`${product.name} додано в кошик`, "success")

      // Add animation to button
      const btn = document.querySelector(`[data-product-id="${productId}"] [data-action="add-to-cart"]`)
      if (btn) {
        btn.classList.add("animate")
        setTimeout(() => {
          btn.classList.remove("animate")
        }, this.config.animationDuration)
      }

      // Track event
      this.trackEvent("add_to_cart", {
        product_id: productId,
        product_name: product.name,
        price: product.price,
      })
    },

    toggleWishlist(productId, btn) {
      const product = this.state.products.find((p) => p.id === productId)
      if (!product) return

      const isActive = btn.classList.contains("active")
      btn.classList.toggle("active", !isActive)

      const icon = btn.querySelector("i")
      if (icon) {
        icon.className = isActive ? "far fa-heart" : "fas fa-heart"
      }

      const message = isActive ? `${product.name} видалено зі списку бажань` : `${product.name} додано в список бажань`

      window.ERGONESTO?.showNotification(message, "info")

      // Track event
      this.trackEvent("wishlist_toggle", {
        product_id: productId,
        action: isActive ? "remove" : "add",
      })
    },

    toggleCompare(productId, btn) {
      const product = this.state.products.find((p) => p.id === productId)
      if (!product) return

      const isActive = btn.classList.contains("active")
      btn.classList.toggle("active", !isActive)

      const message = isActive ? `${product.name} видалено з порівняння` : `${product.name} додано до порівняння`

      window.ERGONESTO?.showNotification(message, "info")

      // Track event
      this.trackEvent("compare_toggle", {
        product_id: productId,
        action: isActive ? "remove" : "add",
      })
    },

    showQuickView(productId) {
      const product = this.state.products.find((p) => p.id === productId)
      if (!product) return

      // For now, redirect to product page
      window.location.href = `product.html?id=${productId}`

      // Track event
      this.trackEvent("quick_view", {
        product_id: productId,
      })
    },

    // Loading and no results states
    showLoading() {
      if (this.elements.loadingState) {
        this.elements.loadingState.style.display = "flex"
      }
      if (this.elements.productsGrid) {
        this.elements.productsGrid.style.display = "none"
      }
    },

    hideLoading() {
      if (this.elements.loadingState) {
        this.elements.loadingState.style.display = "none"
      }
      if (this.elements.productsGrid) {
        this.elements.productsGrid.style.display = "grid"
      }
    },

    showNoResults() {
      if (this.elements.noResults) {
        this.elements.noResults.style.display = "flex"
      }
      if (this.elements.productsGrid) {
        this.elements.productsGrid.style.display = "none"
      }
    },

    hideNoResults() {
      if (this.elements.noResults) {
        this.elements.noResults.style.display = "none"
      }
      if (this.elements.productsGrid) {
        this.elements.productsGrid.style.display = "grid"
      }
    },

    // Results count
    updateResultsCount() {
      if (this.elements.resultsCount) {
        this.elements.resultsCount.textContent = this.state.filteredProducts.length
      }
    },

    // Pagination
    renderPagination() {
      this.state.totalPages = Math.ceil(this.state.filteredProducts.length / this.config.productsPerPage)

      if (!this.elements.paginationContainer || this.state.totalPages <= 1) {
        if (this.elements.paginationContainer) {
          this.elements.paginationContainer.style.display = "none"
        }
        return
      }

      this.elements.paginationContainer.style.display = "flex"

      const pagination = this.elements.paginationContainer.querySelector(".pagination")
      const paginationInfo = this.elements.paginationContainer.querySelector(".pagination-info")

      // Generate pagination HTML
      let paginationHTML = `
        <button class="pagination-btn prev" type="button" aria-label="Попередня сторінка" ${this.state.currentPage === 1 ? "disabled" : ""}>
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="pagination-pages">
      `

      // Calculate page range to show
      const maxVisiblePages = 5
      let startPage = Math.max(1, this.state.currentPage - Math.floor(maxVisiblePages / 2))
      const endPage = Math.min(this.state.totalPages, startPage + maxVisiblePages - 1)

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
          <button class="pagination-page ${i === this.state.currentPage ? "active" : ""}" data-page="${i}">
            ${i}
          </button>
        `
      }

      paginationHTML += `
        </div>
        <button class="pagination-btn next" type="button" aria-label="Наступна сторінка" ${this.state.currentPage === this.state.totalPages ? "disabled" : ""}>
          <i class="fas fa-chevron-right"></i>
        </button>
      `

      pagination.innerHTML = paginationHTML

      // Update pagination info
      const startItem = (this.state.currentPage - 1) * this.config.productsPerPage + 1
      const endItem = Math.min(this.state.currentPage * this.config.productsPerPage, this.state.filteredProducts.length)

      paginationInfo.innerHTML = `
        Сторінка ${this.state.currentPage} з ${this.state.totalPages}
        (${startItem}-${endItem} з ${this.state.filteredProducts.length} товарів)
      `

      // Bind pagination events
      this.bindPaginationEvents()
    },

    bindPaginationEvents() {
      // Previous button
      const prevBtn = this.elements.paginationContainer.querySelector(".pagination-btn.prev")
      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          if (this.state.currentPage > 1) {
            this.changePage(this.state.currentPage - 1)
          }
        })
      }

      // Next button
      const nextBtn = this.elements.paginationContainer.querySelector(".pagination-btn.next")
      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          if (this.state.currentPage < this.state.totalPages) {
            this.changePage(this.state.currentPage + 1)
          }
        })
      }

      // Page buttons
      const pageButtons = this.elements.paginationContainer.querySelectorAll(".pagination-page")
      pageButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const page = Number.parseInt(btn.dataset.page)
          this.changePage(page)
        })
      })
    },

    changePage(page) {
      if (page === this.state.currentPage || page < 1 || page > this.state.totalPages) {
        return
      }

      this.state.currentPage = page
      this.renderProducts()
      this.renderPagination()

      // Scroll to top of products
      if (this.elements.productsGrid) {
        this.elements.productsGrid.scrollIntoView({ behavior: "smooth", block: "start" })
      }

      // Track event
      this.trackEvent("page_change", { page })
    },

    // Utility functions
    debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },

    // Analytics tracking
    trackEvent(eventName, properties = {}) {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag("event", eventName, {
          event_category: "catalog",
          ...properties,
        })
      }

      // Console logging for development
      if (process.env.NODE_ENV === "development") {
        console.log("Catalog Event tracked:", eventName, properties)
      }
    },
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => CatalogPage.init())
  } else {
    CatalogPage.init()
  }

  // Expose API for external use
  window.CatalogPage = {
    clearAllFilters: CatalogPage.clearAllFilters.bind(CatalogPage),
    removeFilter: CatalogPage.removeFilter.bind(CatalogPage),
    addToCart: CatalogPage.addToCart.bind(CatalogPage),
  }
})()
