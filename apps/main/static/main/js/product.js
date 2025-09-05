/**
 * ERGONESTO Product Page - JavaScript
 * Enhanced product page functionality
 * Author: ERGONESTO Team
 * Version: 1.0.0
 */

;(() => {
  // Product page functionality
  const ProductPage = {
    // Configuration
    config: {
      animationDuration: 300,
      debounceDelay: 150,
      maxQuantity: 10,
      minQuantity: 1,
    },

    // State management
    state: {
      selectedColor: "brown",
      quantity: 1,
      activeTab: "description",
      wishlistActive: false,
      selectedImage: 0,
    },

    // DOM elements cache
    elements: {},

    // Initialize the product page
    init() {
      this.cacheElements()
      this.bindEvents()
      this.initializeTabs()
      this.initializeGallery()
      this.initializeFAQ()
      console.log("Product page initialized successfully")
    },

    // Cache DOM elements for performance
    cacheElements() {
      this.elements = {
        // Gallery elements
        mainImage: document.getElementById("main-product-image"),
        thumbnails: document.querySelectorAll(".thumbnail"),
        zoomOverlay: document.getElementById("zoom-overlay"),

        // Product options
        colorOptions: document.querySelectorAll(".color-option"),
        quantityInput: document.querySelector(".quantity-input"),
        quantityBtns: document.querySelectorAll(".quantity-btn"),

        // Action buttons
        addToCartBtn: document.querySelector(".add-to-cart"),
        buyNowBtn: document.querySelector(".buy-now"),
        wishlistBtn: document.querySelector(".wishlist-btn"),

        // Tabs
        tabBtns: document.querySelectorAll(".tab-btn"),
        tabPanels: document.querySelectorAll(".tab-panel"),

        // FAQ
        faqQuestions: document.querySelectorAll(".faq-question"),
        faqItems: document.querySelectorAll(".faq-item"),

        // Reviews
        reviewForm: document.querySelector(".review-form"),
        ratingInputs: document.querySelectorAll(".rating-input input"),
        helpfulBtns: document.querySelectorAll(".helpful-btn"),

        // Related products
        productCards: document.querySelectorAll(".product-card"),
      }
    },

    // Bind all event listeners
    bindEvents() {
      // Gallery events
      this.elements.thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener("click", () => this.changeImage(index))
        thumbnail.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            this.changeImage(index)
          }
        })
      })

      // Color selection
      this.elements.colorOptions.forEach((option) => {
        option.addEventListener("click", () => {
          const color = option.dataset.color
          this.selectColor(color)
        })
      })

      // Quantity controls
      this.elements.quantityBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.classList.contains("plus") ? "increase" : "decrease"
          this.updateQuantity(action)
        })
      })

      if (this.elements.quantityInput) {
        this.elements.quantityInput.addEventListener("change", (e) => {
          this.setQuantity(Number.parseInt(e.target.value))
        })

        this.elements.quantityInput.addEventListener("keydown", (e) => {
          // Allow only numbers and control keys
          if (!/[\d\b\t\r\n]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault()
          }
        })
      }

      // Action buttons
      if (this.elements.addToCartBtn) {
        this.elements.addToCartBtn.addEventListener("click", () => this.addToCart())
      }

      if (this.elements.buyNowBtn) {
        this.elements.buyNowBtn.addEventListener("click", () => this.buyNow())
      }

      if (this.elements.wishlistBtn) {
        this.elements.wishlistBtn.addEventListener("click", () => this.toggleWishlist())
      }

      // Tab navigation
      this.elements.tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const tabId = btn.getAttribute("aria-controls")
          this.switchTab(tabId)
        })
      })

      // FAQ accordion
      this.elements.faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
          const faqItem = question.closest(".faq-item")
          this.toggleFAQ(faqItem)
        })
      })

      // Review form
      if (this.elements.reviewForm) {
        this.elements.reviewForm.addEventListener("submit", (e) => {
          e.preventDefault()
          this.submitReview()
        })
      }

      // Helpful buttons
      this.elements.helpfulBtns.forEach((btn) => {
        btn.addEventListener("click", () => this.markHelpful(btn))
      })

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        this.handleKeyboardNavigation(e)
      })

      // Image zoom on hover (desktop only)
      if (window.innerWidth >= 768) {
        this.initializeImageZoom()
      }
    },

    // Initialize tabs functionality
    initializeTabs() {
      // Set first tab as active by default
      if (this.elements.tabBtns.length > 0) {
        const firstTab = this.elements.tabBtns[0]
        const firstPanel = firstTab.getAttribute("aria-controls")
        this.switchTab(firstPanel)
      }
    },

    // Initialize image gallery
    initializeGallery() {
      if (this.elements.thumbnails.length > 0) {
        // Set first thumbnail as active
        this.elements.thumbnails[0].classList.add("active")
      }
    },

    // Initialize FAQ accordion
    initializeFAQ() {
      // All FAQ items start closed
      this.elements.faqItems.forEach((item) => {
        const answer = item.querySelector(".faq-answer")
        if (answer) {
          answer.style.maxHeight = "0"
        }
      })
    },

    // Initialize image zoom functionality
    initializeImageZoom() {
      if (!this.elements.mainImage || !this.elements.zoomOverlay) return

      const mainImageContainer = this.elements.mainImage.parentElement

      mainImageContainer.addEventListener("mousemove", (e) => {
        const rect = mainImageContainer.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        this.elements.mainImage.style.transformOrigin = `${x}% ${y}%`
      })

      mainImageContainer.addEventListener("mouseleave", () => {
        this.elements.mainImage.style.transformOrigin = "center center"
      })
    },

    // Gallery functionality
    changeImage(index) {
      const thumbnail = this.elements.thumbnails[index]
      if (!thumbnail) return

      // Update active thumbnail
      this.elements.thumbnails.forEach((t) => t.classList.remove("active"))
      thumbnail.classList.add("active")

      // Update main image
      const newImageSrc = thumbnail.dataset.image
      const newImageAlt = thumbnail.dataset.alt

      if (this.elements.mainImage && newImageSrc) {
        this.elements.mainImage.src = newImageSrc
        this.elements.mainImage.alt = newImageAlt
        this.state.selectedImage = index
      }

      // Track event
      this.trackEvent("image_change", { image_index: index })
    },

    // Color selection
    selectColor(color) {
      if (this.state.selectedColor === color) return

      // Update active color option
      this.elements.colorOptions.forEach((option) => {
        option.classList.toggle("active", option.dataset.color === color)
      })

      this.state.selectedColor = color

      // Show notification
      const colorName = document.querySelector(`[data-color="${color}"] .color-name`).textContent
      window.ERGONESTO?.showNotification(`Обрано колір: ${colorName}`, "info")

      // Track event
      this.trackEvent("color_change", { color })
    },

    // Quantity management
    updateQuantity(action) {
      const currentQuantity = this.state.quantity
      let newQuantity = currentQuantity

      if (action === "increase" && currentQuantity < this.config.maxQuantity) {
        newQuantity = currentQuantity + 1
      } else if (action === "decrease" && currentQuantity > this.config.minQuantity) {
        newQuantity = currentQuantity - 1
      }

      this.setQuantity(newQuantity)
    },

    setQuantity(quantity) {
      // Validate quantity
      const validQuantity = Math.max(
        this.config.minQuantity,
        Math.min(this.config.maxQuantity, Number.parseInt(quantity) || 1),
      )

      this.state.quantity = validQuantity

      // Update input value
      if (this.elements.quantityInput) {
        this.elements.quantityInput.value = validQuantity
      }

      // Update button states
      this.updateQuantityButtons()

      // Track event
      this.trackEvent("quantity_change", { quantity: validQuantity })
    },

    updateQuantityButtons() {
      const minusBtn = document.querySelector(".quantity-btn.minus")
      const plusBtn = document.querySelector(".quantity-btn.plus")

      if (minusBtn) {
        minusBtn.disabled = this.state.quantity <= this.config.minQuantity
      }

      if (plusBtn) {
        plusBtn.disabled = this.state.quantity >= this.config.maxQuantity
      }
    },

    // Product actions
    addToCart() {
      const product = {
        id: "ERG-FOOT-001",
        name: "ERGONESTO Ергономічна підставка для ніг",
        price: 2499,
        color: this.state.selectedColor,
        quantity: this.state.quantity,
        image: this.elements.mainImage?.src,
      }

      // Simulate adding to cart
      const currentCount = Number.parseInt(document.getElementById("cart-count")?.textContent || "0")
      const newCount = currentCount + this.state.quantity

      // Update cart count
      window.ERGONESTO?.updateCartCount(newCount)

      // Show success notification
      window.ERGONESTO?.showNotification(`Товар додано в кошик (${this.state.quantity} шт.)`, "success")

      // Add animation to cart button
      if (this.elements.addToCartBtn) {
        this.elements.addToCartBtn.classList.add("animate")
        setTimeout(() => {
          this.elements.addToCartBtn.classList.remove("animate")
        }, this.config.animationDuration)
      }

      // Track event
      this.trackEvent("add_to_cart", product)
    },

    buyNow() {
      // Simulate immediate purchase flow
      window.ERGONESTO?.showNotification("Перенаправлення на сторінку оформлення замовлення...", "info")

      // Track event
      this.trackEvent("buy_now", {
        product_id: "ERG-FOOT-001",
        color: this.state.selectedColor,
        quantity: this.state.quantity,
      })

      // In a real application, redirect to checkout
      setTimeout(() => {
        window.ERGONESTO?.showNotification("Функція швидкої покупки буде доступна незабаром!", "info")
      }, 1000)
    },

    toggleWishlist() {
      this.state.wishlistActive = !this.state.wishlistActive

      // Update button appearance
      if (this.elements.wishlistBtn) {
        this.elements.wishlistBtn.classList.toggle("active", this.state.wishlistActive)

        const icon = this.elements.wishlistBtn.querySelector("i")
        if (icon) {
          icon.className = this.state.wishlistActive ? "fas fa-heart" : "far fa-heart"
        }
      }

      // Show notification
      const message = this.state.wishlistActive ? "Товар додано в список бажань" : "Товар видалено зі списку бажань"

      window.ERGONESTO?.showNotification(message, "info")

      // Track event
      this.trackEvent("wishlist_toggle", {
        product_id: "ERG-FOOT-001",
        action: this.state.wishlistActive ? "add" : "remove",
      })
    },

    // Tab functionality
    switchTab(tabId) {
      if (!tabId || this.state.activeTab === tabId) return

      // Update tab buttons
      this.elements.tabBtns.forEach((btn) => {
        const isActive = btn.getAttribute("aria-controls") === tabId
        btn.setAttribute("aria-selected", isActive)
        btn.classList.toggle("active", isActive)
      })

      // Update tab panels
      this.elements.tabPanels.forEach((panel) => {
        const isActive = panel.id === tabId
        panel.classList.toggle("active", isActive)
      })

      this.state.activeTab = tabId

      // Track event
      this.trackEvent("tab_change", { tab: tabId })
    },

    // FAQ functionality
    toggleFAQ(faqItem) {
      const question = faqItem.querySelector(".faq-question")
      const answer = faqItem.querySelector(".faq-answer")

      if (!question || !answer) return

      const isExpanded = question.getAttribute("aria-expanded") === "true"
      const newState = !isExpanded

      // Update ARIA attributes
      question.setAttribute("aria-expanded", newState)
      faqItem.classList.toggle("active", newState)

      // Animate answer
      if (newState) {
        answer.style.maxHeight = answer.scrollHeight + "px"
      } else {
        answer.style.maxHeight = "0"
      }

      // Track event
      this.trackEvent("faq_toggle", {
        question: question.textContent.trim(),
        action: newState ? "open" : "close",
      })
    },

    // Review functionality
    submitReview() {
      const formData = new FormData(this.elements.reviewForm)
      const reviewData = {
        rating: formData.get("rating"),
        name: formData.get("name"),
        review: formData.get("review"),
      }

      // Validate form
      if (!reviewData.rating || !reviewData.name || !reviewData.review) {
        window.ERGONESTO?.showNotification("Будь ласка, заповніть всі поля", "error")
        return
      }

      // Simulate review submission
      window.ERGONESTO?.showNotification("Дякуємо за відгук! Він буде опублікований після модерації.", "success")

      // Reset form
      this.elements.reviewForm.reset()

      // Track event
      this.trackEvent("review_submit", reviewData)
    },

    markHelpful(btn) {
      // Simulate marking review as helpful
      const currentCount = btn.textContent.match(/\d+/)?.[0] || "0"
      const newCount = Number.parseInt(currentCount) + 1

      btn.innerHTML = btn.innerHTML.replace(/\d+/, newCount)
      btn.disabled = true
      btn.style.opacity = "0.6"

      window.ERGONESTO?.showNotification("Дякуємо за оцінку!", "success")

      // Track event
      this.trackEvent("review_helpful", { review_id: btn.dataset.reviewId || "unknown" })
    },

    // Keyboard navigation
    handleKeyboardNavigation(e) {
      // Tab navigation with arrow keys
      if (this.state.activeTab && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        const currentIndex = Array.from(this.elements.tabBtns).findIndex(
          (btn) => btn.getAttribute("aria-controls") === this.state.activeTab,
        )

        if (currentIndex !== -1) {
          let newIndex
          if (e.key === "ArrowLeft") {
            newIndex = currentIndex > 0 ? currentIndex - 1 : this.elements.tabBtns.length - 1
          } else {
            newIndex = currentIndex < this.elements.tabBtns.length - 1 ? currentIndex + 1 : 0
          }

          const newTab = this.elements.tabBtns[newIndex]
          if (newTab) {
            const tabId = newTab.getAttribute("aria-controls")
            this.switchTab(tabId)
            newTab.focus()
          }
        }
      }

      // Gallery navigation with arrow keys
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        if (document.activeElement?.classList.contains("thumbnail")) {
          e.preventDefault()
          const currentIndex = this.state.selectedImage
          let newIndex

          if (e.key === "ArrowUp") {
            newIndex = currentIndex > 0 ? currentIndex - 1 : this.elements.thumbnails.length - 1
          } else {
            newIndex = currentIndex < this.elements.thumbnails.length - 1 ? currentIndex + 1 : 0
          }

          this.changeImage(newIndex)
          this.elements.thumbnails[newIndex]?.focus()
        }
      }
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
          event_category: "product_page",
          ...properties,
        })
      }

      // Console logging for development
      if (process.env.NODE_ENV === "development") {
        console.log("Product Event tracked:", eventName, properties)
      }
    },
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ProductPage.init())
  } else {
    ProductPage.init()
  }

  // Expose limited API for external use
  window.ProductPage = {
    switchTab: ProductPage.switchTab.bind(ProductPage),
    changeImage: ProductPage.changeImage.bind(ProductPage),
    addToCart: ProductPage.addToCart.bind(ProductPage),
  }
})()
