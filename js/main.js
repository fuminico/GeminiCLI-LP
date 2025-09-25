// Main JavaScript for Modern Home Theater Projector Landing Page

document.addEventListener('DOMContentLoaded', function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        initAnimations();
        if (typeof gsap !== 'undefined') {
            initGSAPAnimations();
        }
    }

    initInteractions();
    initProgressBar();
    initTestimonialsCarousel();
    initFAQ();
    initFixedCTA();
    initPerformanceMonitoring();
});

// Intersection Observer for reveal animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}

// GSAP Animations for a more refined feel
function initGSAPAnimations() {
    // Hero elements stagger animation
    gsap.timeline({ delay: 0.2 })
        .from('.hero-badge', { y: 30, opacity: 0, duration: 1, ease: 'expo.out' })
        .from('.hero-title', { y: 50, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.8')
        .from('.hero-lead', { y: 30, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.8')
        .from('.hero-cta', { y: 30, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.8');
}

// General user interactions
function initInteractions() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // CTA button click simulation
    document.querySelectorAll('.cta-primary, .cta-secondary, .final-cta button, #fixed-cta button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.add('loading');
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>処理中...';

            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = originalText;
                alert('在庫確認ページに移動します。\n（実際のサイトでは購入ページにリダイレクトされます）');
            }, 1500);
        });
    });
}

// Scroll-based progress bar
function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }, { passive: true });
}

// Testimonials carousel functionality (Pixel-based for accuracy)
function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.testimonials-track');
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector('.testimonials-prev');
    const nextBtn = carousel.querySelector('.testimonials-next');
    const dots = carousel.querySelectorAll('.testimonials-dots .dot');
    
    if (slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateCarousel(instant = false) {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const offset = (slideWidth + gap) * currentIndex;

        if (instant) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        }

        track.style.transform = `translateX(-${offset}px)`;

        // Force reflow to apply instant transition correctly
        if (instant) {
            track.offsetHeight; 
            track.style.transition = '';
        }

        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    // Swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
    track.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) nextSlide();
        if (touchStartX - touchEndX < -50) prevSlide();
    }, { passive: true });

    // Recalculate on resize for responsive accuracy
    new ResizeObserver(() => updateCarousel(true)).observe(carousel);
}

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = question.classList.toggle('active');
            answer.classList.toggle('show', isActive);

            // Close other open FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-question').classList.remove('active');
                    otherItem.querySelector('.faq-answer').classList.remove('show');
                }
            });
        });
    });
}

// Fixed CTA bar visibility
function initFixedCTA() {
    const fixedCTA = document.getElementById('fixed-cta');
    const heroSection = document.getElementById('hero');
    if (!fixedCTA || !heroSection) return;

    const observer = new IntersectionObserver(([entry]) => {
        fixedCTA.classList.toggle('show', !entry.isIntersecting);
    }, { threshold: 0.1 });

    observer.observe(heroSection);
}

// Basic performance monitoring
function initPerformanceMonitoring() {
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const p = performance.timing;
            console.log(`Page load time: ${p.loadEventEnd - p.navigationStart}ms`);
        }
    });
}
