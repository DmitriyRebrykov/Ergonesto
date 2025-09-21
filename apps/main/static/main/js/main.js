        // Mobile menu functionality
        const mobileMenuBtn = document.querySelector('.mobile-menu');
        const mobileMenuPanel = document.querySelector('.mobile-menu-panel');

        if (mobileMenuBtn && mobileMenuPanel) {
            mobileMenuBtn.addEventListener('click', function() {
                const isOpen = this.getAttribute('aria-expanded') === 'true';

                this.setAttribute('aria-expanded', !isOpen);
                this.classList.toggle('mobile-menu--active');

                mobileMenuPanel.setAttribute('aria-hidden', isOpen);
                mobileMenuPanel.classList.toggle('mobile-menu-panel--visible');
            });
        }

        // Cart counter functionality
        let cartCount = 0;
        const cartCounter = document.getElementById('cart-count');
        const mobileCartCounter = document.querySelector('.mobile-actions__counter');

        function updateCartCount(count) {
            cartCount = count;
            if (cartCounter) {
                cartCounter.textContent = count;
                cartCounter.classList.toggle('header-actions__cart-counter--visible', count > 0);
            }
            if (mobileCartCounter) {
                mobileCartCounter.textContent = count;
                mobileCartCounter.classList.toggle('mobile-actions__counter--visible', count > 0);
            }
        }

        // Example: Add to cart functionality
        const orderButtons = document.querySelectorAll('.button--primary');
        orderButtons.forEach(button => {
            if (button.textContent.includes('Замовити')) {
                button.addEventListener('click', function() {
                    updateCartCount(cartCount + 1);

                    // Add animation to cart button
                    const cartBtn = document.querySelector('.header-actions__button');
                    if (cartBtn) {
                        cartBtn.classList.add('header-actions__button--animate');
                        setTimeout(() => {
                            cartBtn.classList.remove('header-actions__button--animate');
                        }, 300);
                    }
                });
            }
        });

        // Close mobile menu when clicking on links
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu-panel__link');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenuBtn && mobileMenuPanel) {
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    mobileMenuBtn.classList.remove('mobile-menu--active');
                    mobileMenuPanel.setAttribute('aria-hidden', 'true');
                    mobileMenuPanel.classList.remove('mobile-menu-panel--visible');
                }
            });
        });

        // Handle focus management for accessibility
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (mobileMenuPanel && mobileMenuPanel.classList.contains('mobile-menu-panel--visible')) {
                    mobileMenuBtn.click();
                    mobileMenuBtn.focus();
                }
            }
        });
