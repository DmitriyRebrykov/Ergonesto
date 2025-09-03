/**
 * ERGONESTO Website - Main JavaScript
 * Secure and accessible header functionality
 * Author: ERGONESTO Team
 * Version: 1.0.0
 */

;(() => {
  // Security: Prevent global namespace pollution
  const ERGONESTO = {
    // Configuration
    config: {
      animationDuration: 300,
      debounceDelay: 150,
      languages: {
        uk: { name: "Українська", code: "UA", flag: "flags/ua.png" },
        en: { name: "English", code: "EN", flag: "flags/us.png" },
        ru: { name: "Русский", code: "RU", flag: "flags/ru.png" },
      },
    },

    // State management
    state: {
      currentLanguage: "uk",
      cartCount: 0,
      mobileMenuOpen: false,
      languageDropdownOpen: false,
    },

    // DOM elements cache
    elements: {},

    // Initialize the application
    init() {
      this.cacheElements()
      this.bindEvents()
      this.loadSavedPreferences()
      this.setupAccessibility()
      console.log("ERGONESTO website initialized successfully")
    },

    // Cache DOM elements for performance
    cacheElements() {
      const elements = {
        // Mobile menu
        mobileMenuBtn: document.querySelector("[data-mobile-menu-toggle]"),
        mobileMenu: document.getElementById("mobile-menu"),

        // Language switcher
        languageBtn: document.querySelector(".language-btn"),
        languageDropdown: document.getElementById("language-dropdown"),
        languageOptions: document.querySelectorAll(".language-option"),
        languageCode: document.querySelector(".language-code"),
        currentLanguageSpan: document.querySelector(".current-language"),

        // Header actions
        searchBtn: document.querySelector('[data-action="search"]'),
        cartBtn: document.querySelector('[data-action="cart"]'),
        profileBtn: document.querySelector('[data-action="profile"]'),
        cartCount: document.getElementById("cart-count"),
        mobileCartCount: document.querySelector(".mobile-cart-count"),

        // Navigation links
        navLinks: document.querySelectorAll(".nav-link, .mobile-nav-link"),

        // Body for scroll lock
        body: document.body,
        html: document.documentElement,
      }

      // Validate critical elements exist
      const criticalElements = ["mobileMenuBtn", "mobileMenu"]
      for (const elementName of criticalElements) {
        if (!elements[elementName]) {
          console.error(`Critical element missing: ${elementName}`)
          return false
        }
      }

      this.elements = elements
      return true
    },

    // Bind all event listeners
    bindEvents() {
      // Mobile menu toggle
      if (this.elements.mobileMenuBtn) {
        this.elements.mobileMenuBtn.addEventListener(
          "click",
          this.debounce(this.toggleMobileMenu.bind(this), this.config.debounceDelay),
        )
      }

      // Language switcher
      if (this.elements.languageBtn) {
        this.elements.languageBtn.addEventListener(
          "click",
          this.debounce(this.toggleLanguageDropdown.bind(this), this.config.debounceDelay),
        )
      }

      // Language options
      this.elements.languageOptions.forEach((option) => {
        option.addEventListener("click", (e) => {
          const lang = e.currentTarget.dataset.lang
          if (lang) this.changeLanguage(lang)
        })

        // Keyboard navigation for language options
        option.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            const lang = e.currentTarget.dataset.lang
            if (lang) this.changeLanguage(lang)
          }
        })
      })

      // Header action buttons
      if (this.elements.searchBtn) {
        this.elements.searchBtn.addEventListener("click", () => this.handleAction("search"))
      }
      if (this.elements.cartBtn) {
        this.elements.cartBtn.addEventListener("click", () => this.handleAction("cart"))
      }
      if (this.elements.profileBtn) {
        this.elements.profileBtn.addEventListener("click", () => this.handleAction("profile"))
      }

      // Mobile action buttons
      document.querySelectorAll("[data-action]").forEach((btn) => {
        if (!btn.classList.contains("header-action-btn")) {
          btn.addEventListener("click", (e) => {
            const action = e.currentTarget.dataset.action
            if (action === "language") {
              this.showLanguageModal()
            } else {
              this.handleAction(action)
            }
          })
        }
      })

      // Close dropdowns when clicking outside
      document.addEventListener("click", (e) => {
        this.handleOutsideClick(e)
      })

      // Keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        this.handleKeyboardShortcuts(e)
      })

      // Smooth scrolling for navigation links
      this.elements.navLinks.forEach((link) => {
        link.addEventListener("click", this.handleNavClick.bind(this))
      })

      // Window resize handler
      window.addEventListener(
        "resize",
        this.debounce(() => {
          if (window.innerWidth >= 768 && this.state.mobileMenuOpen) {
            this.closeMobileMenu()
          }
        }, this.config.debounceDelay),
      )
    },

    // Mobile menu functionality
    toggleMobileMenu() {
      if (this.state.mobileMenuOpen) {
        this.closeMobileMenu()
      } else {
        this.openMobileMenu()
      }
    },

    openMobileMenu() {
      this.state.mobileMenuOpen = true

      // Update ARIA attributes
      this.elements.mobileMenuBtn.setAttribute("aria-expanded", "true")
      this.elements.mobileMenu.setAttribute("aria-hidden", "false")

      // Show menu with animation
      this.elements.mobileMenu.style.display = "block"

      // Force reflow for animation
      this.elements.mobileMenu.offsetHeight

      // Add animation class
      requestAnimationFrame(() => {
        this.elements.mobileMenu.setAttribute("aria-hidden", "false")
      })

      // Focus management
      const firstFocusable = this.elements.mobileMenu.querySelector("a, button")
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100)
      }

      // Prevent body scroll on mobile
      if (window.innerWidth < 768) {
        this.elements.body.style.overflow = "hidden"
      }

      this.trackEvent("mobile_menu_open")
    },

    closeMobileMenu() {
      this.state.mobileMenuOpen = false

      // Update ARIA attributes
      this.elements.mobileMenuBtn.setAttribute("aria-expanded", "false")
      this.elements.mobileMenu.setAttribute("aria-hidden", "true")

      // Restore body scroll
      this.elements.body.style.overflow = ""

      // Hide menu after animation
      setTimeout(() => {
        if (!this.state.mobileMenuOpen) {
          this.elements.mobileMenu.style.display = "none"
        }
      }, this.config.animationDuration)

      this.trackEvent("mobile_menu_close")
    },

    // Language switcher functionality
    toggleLanguageDropdown() {
      if (this.state.languageDropdownOpen) {
        this.closeLanguageDropdown()
      } else {
        this.openLanguageDropdown()
      }
    },

    openLanguageDropdown() {
      if (!this.elements.languageDropdown) return

      this.state.languageDropdownOpen = true

      // Update ARIA attributes
      this.elements.languageBtn.setAttribute("aria-expanded", "true")
      this.elements.languageDropdown.setAttribute("aria-hidden", "false")

      // Focus first option
      const firstOption = this.elements.languageDropdown.querySelector(".language-option")
      if (firstOption) {
        setTimeout(() => firstOption.focus(), 100)
      }

      this.trackEvent("language_dropdown_open")
    },

    closeLanguageDropdown() {
      if (!this.elements.languageDropdown) return

      this.state.languageDropdownOpen = false

      // Update ARIA attributes
      this.elements.languageBtn.setAttribute("aria-expanded", "false")
      this.elements.languageDropdown.setAttribute("aria-hidden", "true")

      this.trackEvent("language_dropdown_close")
    },

    // Language change functionality
    changeLanguage(langCode) {
      if (!this.config.languages[langCode]) {
        console.error(`Invalid language code: ${langCode}`)
        return
      }

      const previousLang = this.state.currentLanguage
      this.state.currentLanguage = langCode
      const language = this.config.languages[langCode]

      // Update UI elements
      if (this.elements.languageCode) {
        this.elements.languageCode.textContent = language.code
      }
      if (this.elements.currentLanguageSpan) {
        this.elements.currentLanguageSpan.textContent = language.code
      }

      // Update active language option
      this.elements.languageOptions.forEach((option) => {
        option.classList.toggle("active", option.dataset.lang === langCode)
      })

      // Update document language
      this.elements.html.lang = langCode

      // Save preference
      this.savePreference("language", langCode)

      // Add animation
      this.elements.body.classList.add("language-change-animation")
      setTimeout(() => {
        this.elements.body.classList.remove("language-change-animation")
      }, this.config.animationDuration)

      // Close dropdown
      this.closeLanguageDropdown()

      // Show notification
      this.showNotification(`Мову змінено на ${language.name}`, "success")

      // Track event
      this.trackEvent("language_change", {
        previous_language: previousLang,
        new_language: langCode,
      })

      // In a real application, you would reload content or redirect
      if (langCode !== "uk") {
        setTimeout(() => {
          this.showNotification("Переклад буде доступний в наступній версії", "info")
        }, 1000)
      }
    },

    // Show language modal for mobile
    showLanguageModal() {
      const modal = this.createLanguageModal()
      this.elements.body.appendChild(modal)

      // Show modal
      requestAnimationFrame(() => {
        modal.classList.add("show")
      })

      // Prevent body scroll
      this.elements.body.style.overflow = "hidden"

      // Focus first option
      const firstOption = modal.querySelector(".language-modal-option")
      if (firstOption) {
        setTimeout(() => firstOption.focus(), 100)
      }

      this.trackEvent("language_modal_open")
    },

    // Create language modal
    createLanguageModal() {
      const modal = document.createElement("div")
      modal.className = "language-modal"
      modal.setAttribute("role", "dialog")
      modal.setAttribute("aria-labelledby", "language-modal-title")
      modal.setAttribute("aria-modal", "true")

      const languages = Object.entries(this.config.languages)
      const optionsHTML = languages
        .map(
          ([code, lang]) => `
                <div class="language-modal-option ${code === this.state.currentLanguage ? "active" : ""}"
                     data-lang="${code}"
                     role="button"
                     tabindex="0">
                    <img src="${lang.flag}" alt="${lang.name}" class="flag-icon" width="20" height="15">
                    <span class="language-name">${lang.name}</span>
                    <span class="language-native">${lang.code}</span>
                </div>
            `,
        )
        .join("")

      modal.innerHTML = `
                <div class="language-modal-content">
                    <div class="language-modal-header">
                        <h3 id="language-modal-title" class="language-modal-title">Оберіть мову</h3>
                        <button class="language-modal-close" type="button" aria-label="Закрити">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="language-modal-options">
                        ${optionsHTML}
                    </div>
                </div>
            `

      // Bind events
      const closeBtn = modal.querySelector(".language-modal-close")
      const options = modal.querySelectorAll(".language-modal-option")

      closeBtn.addEventListener("click", () => this.hideLanguageModal(modal))

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.hideLanguageModal(modal)
        }
      })

      options.forEach((option) => {
        option.addEventListener("click", () => {
          const lang = option.dataset.lang
          if (lang) {
            this.changeLanguage(lang)
            this.hideLanguageModal(modal)
          }
        })

        option.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            const lang = option.dataset.lang
            if (lang) {
              this.changeLanguage(lang)
              this.hideLanguageModal(modal)
            }
          }
        })
      })

      return modal
    },

    // Hide language modal
    hideLanguageModal(modal) {
      modal.classList.remove("show")
      this.elements.body.style.overflow = ""

      setTimeout(() => {
        if (modal.parentNode) {
          modal.remove()
        }
      }, this.config.animationDuration)

      this.trackEvent("language_modal_close")
    },

    // Handle header action buttons
    handleAction(action) {
      switch (action) {
        case "search":
          this.showNotification("Функція пошуку буде доступна незабаром!", "info")
          this.trackEvent("search_click")
          break

        case "cart":
          if (this.elements.cartBtn) {
            this.elements.cartBtn.classList.add("animate")
            setTimeout(() => {
              this.elements.cartBtn.classList.remove("animate")
            }, this.config.animationDuration)
          }

          if (this.state.cartCount === 0) {
            this.showNotification("Ваш кошик порожній. Додайте товари для покупки!", "info")
          } else {
            this.showNotification(`У вашому кошику ${this.state.cartCount} товарів`, "info")
          }
          this.trackEvent("cart_click")
          break

        case "profile":
          this.showNotification("Увійдіть в акаунт або зареєструйтесь", "info")
          this.trackEvent("profile_click")
          break

        default:
          console.warn(`Unknown action: ${action}`)
      }
    },

    // Handle navigation clicks
    handleNavClick(e) {
      const href = e.currentTarget.getAttribute("href")

      // Handle internal links with smooth scrolling
      if (href && href.startsWith("#")) {
        e.preventDefault()
        const target = document.querySelector(href)

        if (target) {
          // Close mobile menu if open
          if (this.state.mobileMenuOpen) {
            this.closeMobileMenu()
          }

          // Smooth scroll to target
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })

          // Update focus for accessibility
          target.focus({ preventScroll: true })

          this.trackEvent("navigation_click", { target: href })
        }
      }
    },

    // Handle outside clicks
    handleOutsideClick(e) {
      // Close language dropdown if clicking outside
      if (
        this.state.languageDropdownOpen &&
        this.elements.languageBtn &&
        this.elements.languageDropdown &&
        !this.elements.languageBtn.contains(e.target) &&
        !this.elements.languageDropdown.contains(e.target)
      ) {
        this.closeLanguageDropdown()
      }

      // Close mobile menu if clicking outside (on mobile)
      if (
        this.state.mobileMenuOpen &&
        this.elements.mobileMenu &&
        !this.elements.mobileMenu.contains(e.target) &&
        !this.elements.mobileMenuBtn.contains(e.target)
      ) {
        this.closeMobileMenu()
      }
    },

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
      // Escape key closes all dropdowns and modals
      if (e.key === "Escape") {
        if (this.state.languageDropdownOpen) {
          this.closeLanguageDropdown()
        }
        if (this.state.mobileMenuOpen) {
          this.closeMobileMenu()
        }

        // Close language modal
        const languageModal = document.querySelector(".language-modal.show")
        if (languageModal) {
          this.hideLanguageModal(languageModal)
        }
      }

      // Alt + L to open language switcher
      if (e.altKey && e.key === "l") {
        e.preventDefault()
        if (window.innerWidth >= 768) {
          this.toggleLanguageDropdown()
        } else {
          this.showLanguageModal()
        }
      }

      // Alt + M to toggle mobile menu
      if (e.altKey && e.key === "m" && window.innerWidth < 768) {
        e.preventDefault()
        this.toggleMobileMenu()
      }
    },

    // Cart functionality
    updateCartCount(count) {
      this.state.cartCount = Math.max(0, Number.parseInt(count) || 0)

      // Update cart count displays
      if (this.elements.cartCount) {
        this.elements.cartCount.textContent = this.state.cartCount
        this.elements.cartCount.classList.toggle("has-items", this.state.cartCount > 0)
      }

      if (this.elements.mobileCartCount) {
        this.elements.mobileCartCount.textContent = this.state.cartCount
        this.elements.mobileCartCount.classList.toggle("has-items", this.state.cartCount > 0)
      }

      // Save to localStorage
      this.savePreference("cartCount", this.state.cartCount)
    },

    // Notification system
    showNotification(message, type = "info") {
      // Remove existing notifications
      document.querySelectorAll(".notification").forEach((notification) => {
        notification.remove()
      })

      const notification = document.createElement("div")
      notification.className = `notification notification-${type}`
      notification.setAttribute("role", "alert")
      notification.setAttribute("aria-live", "polite")

      const icons = {
        success: "✅",
        error: "❌",
        info: "ℹ️",
      }

      notification.innerHTML = `
                <div class="notification-content">
                    <div class="notification-icon">${icons[type] || icons.info}</div>
                    <div class="notification-message">${this.escapeHtml(message)}</div>
                    <button class="notification-close" type="button" aria-label="Закрити повідомлення">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `

      // Add close functionality
      const closeBtn = notification.querySelector(".notification-close")
      closeBtn.addEventListener("click", () => notification.remove())

      // Add to page
      this.elements.body.appendChild(notification)

      // Auto-remove after 4 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = "slideInNotification 0.3s ease-out reverse"
          setTimeout(() => notification.remove(), 300)
        }
      }, 4000)

      this.trackEvent("notification_shown", { type, message })
    },

    // Accessibility setup
    setupAccessibility() {
      // Add skip link functionality
      const skipLink = document.querySelector(".skip-link")
      if (skipLink) {
        skipLink.addEventListener("click", (e) => {
          e.preventDefault()
          const target = document.querySelector(skipLink.getAttribute("href"))
          if (target) {
            target.focus()
            target.scrollIntoView({ behavior: "smooth" })
          }
        })
      }

      // Announce page changes to screen readers
      const announcer = document.createElement("div")
      announcer.setAttribute("aria-live", "polite")
      announcer.setAttribute("aria-atomic", "true")
      announcer.className = "sr-only"
      announcer.id = "announcer"
      this.elements.body.appendChild(announcer)
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

    escapeHtml(text) {
      const div = document.createElement("div")
      div.textContent = text
      return div.innerHTML
    },

    // Preferences management
    savePreference(key, value) {
      try {
        localStorage.setItem(`ergonesto_${key}`, JSON.stringify(value))
      } catch (e) {
        console.warn("Could not save preference to localStorage:", e)
      }
    },

    loadPreference(key, defaultValue = null) {
      try {
        const saved = localStorage.getItem(`ergonesto_${key}`)
        return saved ? JSON.parse(saved) : defaultValue
      } catch (e) {
        console.warn("Could not load preference from localStorage:", e)
        return defaultValue
      }
    },

    loadSavedPreferences() {
      // Load saved language
      const savedLanguage = this.loadPreference("language", "uk")
      if (savedLanguage !== this.state.currentLanguage && this.config.languages[savedLanguage]) {
        this.changeLanguage(savedLanguage)
      }

      // Load saved cart count
      const savedCartCount = this.loadPreference("cartCount", 0)
      this.updateCartCount(savedCartCount)
    },

    // Analytics tracking
    trackEvent(eventName, properties = {}) {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag("event", eventName, {
          event_category: "engagement",
          ...properties,
        })
      }

      // Console logging for development
      if (process.env.NODE_ENV === "development") {
        console.log("Event tracked:", eventName, properties)
      }
    },
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => ERGONESTO.init())
  } else {
    ERGONESTO.init()
  }

  // Expose limited API for external use
  window.ERGONESTO = {
    updateCartCount: ERGONESTO.updateCartCount.bind(ERGONESTO),
    showNotification: ERGONESTO.showNotification.bind(ERGONESTO),
    changeLanguage: ERGONESTO.changeLanguage.bind(ERGONESTO),
  }
})()
