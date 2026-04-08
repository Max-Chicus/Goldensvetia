// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Cart sidebar functionality
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');

    function openCart() {
        cartSidebar.classList.remove('translate-x-full');
        cartOverlay.classList.remove('opacity-0', 'invisible');
        cartOverlay.classList.add('opacity-100', 'visible');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartSidebar.classList.add('translate-x-full');
        cartOverlay.classList.add('opacity-0', 'invisible');
        cartOverlay.classList.remove('opacity-100', 'visible');
        document.body.style.overflow = '';
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Checkout button scroll to contact form
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            closeCart();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Form submission with Web3Forms
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check if cart is empty
            if (typeof cart !== 'undefined' && cart.length === 0) {
                if (typeof showToast === 'function') {
                    showToast('Te rog să adaugi produse în coș înainte de a trimite comanda!', 'warning');
                } else {
                    alert('Te rog să adaugi produse în coș înainte de a trimite comanda!');
                }
                return;
            }

            const submitBtn = orderForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="spinner"></div> Se trimite...';
            submitBtn.disabled = true;

            // Folosim FormData - acesta este formatul corect pentru Web3Forms
            const formData = new FormData();

            // Adăugăm TOATE câmpurile necesare
            formData.append('access_key', 'a05ac018-7afb-4f4d-abbe-364866f11acd');
            formData.append('name', document.querySelector('[name="name"]').value);
            formData.append('phone', document.querySelector('[name="phone"]').value);
            formData.append('email', document.querySelector('[name="email"]').value);
            formData.append('address', document.querySelector('[name="address"]').value);
            formData.append('subject', 'Comandă nouă - GOLDENVETIA');
            formData.append('from_name', 'GOLDENVETIA Website');
            formData.append('botcheck', '');

            // Construim mesajul cu datele din coș
            let cartText = '';
            let totalAmount = 0;

            if (typeof cart !== 'undefined' && cart.length > 0) {
                cartText = cart.map(item =>
                    `${item.name} (${item.color}, ${item.size}) x ${item.quantity} = ${item.price * item.quantity} MDL`
                ).join('\n');
                if (typeof calculateTotal === 'function') {
                    totalAmount = calculateTotal();
                }
            }

            const userMessage = document.querySelector('[name="message"]').value;
            const fullMessage = `${userMessage}\n\n📦 COMANDA:\n${cartText}\n\n💰 TOTAL: ${totalAmount} MDL`;
            formData.append('message', fullMessage);

            try {
                // NU setăm manual Content-Type - browser-ul o face automat pentru FormData
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData  // ← Important: trimitem FormData, nu JSON
                });

                const result = await response.json();

                if (result.success) {
                    if (typeof showToast === 'function') {
                        showToast('Comanda ta a fost trimisă cu succes! Vom reveni în curând.', 'success');
                    } else {
                        alert('Comanda a fost trimisă cu succes!');
                    }
                    orderForm.reset();
                    // Clear cart after successful order
                    if (typeof cart !== 'undefined' && typeof saveCart === 'function') {
                        cart.length = 0;
                        saveCart();
                    }
                    if (typeof closeCart === 'function') {
                        closeCart();
                    }
                } else {
                    console.error('Web3Forms error:', result);
                    let errorMessage = 'A apărut o eroare: ';
                    errorMessage += result.message || 'Încearcă din nou';
                    if (typeof showToast === 'function') {
                        showToast(errorMessage, 'error');
                    } else {
                        alert(errorMessage);
                    }
                }
            } catch (error) {
                console.error('Form submission error:', error);
                if (typeof showToast === 'function') {
                    showToast('Eroare de conexiune. Te rugăm să încerci din nou.', 'error');
                } else {
                    alert('Eroare de conexiune. Te rugăm să încerci din nou.');
                }
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe product cards and feature cards
    document.querySelectorAll('.product-card, .text-center.group').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Mobile Menu Toggle
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('show');
            // Change burger icon to X when open
            const icon = burgerBtn.querySelector('i');
            if (mobileMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
                const icon = burgerBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close mobile menu when clicking outside (optional)
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('show') &&
                !burgerBtn.contains(e.target) &&
                !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('show');
                const icon = burgerBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Active state for mobile navigation links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const allSections = document.querySelectorAll('section');

    if (allSections.length > 0 && mobileNavLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.pageYOffset;

            allSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollPosition >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            mobileNavLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
});