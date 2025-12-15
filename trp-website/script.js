/**
 * THE REMEDY PROJECT - IMPACT REPORT
 * Interactive scroll-based animations and navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initProgressBar();
    initNavScroll();
    initFadeInAnimations();
    initSidebarNav();
    initChartTabs();
    initSmoothScroll();
    initBudgetBars();
    initProblemCarousel();
    initArtCarousel();
    initStudentCarousel();
    initCaseCategoriesChart();
});

/**
 * Progress Bar - Shows reading progress
 */
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
}

/**
 * Navigation - Adds scrolled class when scrolling
 */
function initNavScroll() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Fade-in Animations - Reveals elements as they enter viewport
 */
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after animation
                // fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });
}

/**
 * Sidebar Navigation - Sticky sidebar with step highlighting
 */
function initSidebarNav() {
    const sidebarNav = document.getElementById('sidebarNav');
    const sidebarProgress = document.getElementById('sidebarProgress');
    const sidebarSteps = document.querySelectorAll('.sidebar-step');
    const processSteps = document.querySelectorAll('.process-step');

    if (!sidebarNav || processSteps.length === 0) return;

    // Calculate which step is in view
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepNum = entry.target.dataset.step;
                updateActiveStep(stepNum);
            }
        });
    }, observerOptions);

    processSteps.forEach(step => {
        stepObserver.observe(step);
    });

    function updateActiveStep(stepNum) {
        const totalSteps = sidebarSteps.length;
        const currentStep = parseInt(stepNum);

        // Update active states
        sidebarSteps.forEach(step => {
            const num = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');

            if (num === currentStep) {
                step.classList.add('active');
            } else if (num < currentStep) {
                step.classList.add('completed');
            }
        });

        // Update progress bar
        const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        if (sidebarProgress) {
            sidebarProgress.style.height = `${progressPercent}%`;
        }
    }

    // Click handlers for sidebar steps
    sidebarSteps.forEach(step => {
        step.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = step.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

/**
 * Chart Tabs - Organization chart switcher
 */
function initChartTabs() {
    const tabs = document.querySelectorAll('.chart-tab');
    const charts = document.querySelectorAll('.org-chart');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const chartId = `chart-${tab.dataset.chart}`;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding chart
            charts.forEach(chart => {
                chart.classList.remove('active');
                if (chart.id === chartId) {
                    chart.classList.add('active');
                }
            });
        });
    });
}

/**
 * Smooth Scroll - For anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 100; // Account for fixed nav
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Budget Bars - Animate budget bars when in view
 */
function initBudgetBars() {
    const budgetBars = document.querySelectorAll('.budget-bar-fill');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // The width is set inline, just add animation class
                entry.target.style.transition = 'width 1.5s ease-out';
            }
        });
    }, observerOptions);

    budgetBars.forEach(bar => {
        // Store the target width
        const targetWidth = bar.style.width;
        // Start at 0
        bar.style.width = '0%';

        barObserver.observe(bar);

        // Set up animation trigger
        const parentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 200);
                    parentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        parentObserver.observe(bar.closest('.budget-category'));
    });
}

/**
 * Counter Animation - Animate numbers when in view
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number, .metric-number, .volunteer-number');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;

                // Extract number and suffix
                const match = text.match(/^([\d,.]+)(.*)$/);
                if (match) {
                    const endValue = parseFloat(match[1].replace(/,/g, ''));
                    const suffix = match[2];

                    animateCounter(target, 0, endValue, suffix, 2000);
                }

                counterObserver.unobserve(target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, start, end, suffix, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out quad
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const current = start + (end - start) * easeProgress;

        // Format number
        let formatted;
        if (end >= 1000) {
            formatted = current.toLocaleString('en-US', { maximumFractionDigits: 0 });
        } else if (end % 1 !== 0) {
            formatted = current.toFixed(1);
        } else {
            formatted = Math.round(current).toString();
        }

        element.textContent = formatted + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Parallax Effect - Subtle parallax for hero elements
 */
function initParallax() {
    const heroTitle = document.querySelector('.hero-title');
    const heroBgText = document.querySelector('.hero-bg-text');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (heroTitle && scrollY < window.innerHeight) {
            heroTitle.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroTitle.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
        }

        if (heroBgText && scrollY < window.innerHeight) {
            heroBgText.style.transform = `translateX(-50%) translateY(${scrollY * 0.2}px)`;
        }
    });
}
/**
 * Active Section Highlighting - For navigation
 */
function initActiveSectionHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Initialize section highlighting
initActiveSectionHighlight();

/**
 * Reveal on Scroll - Additional reveal animations
 */
function initRevealAnimations() {
    // Add reveal class to certain elements for special animations
    const storyCards = document.querySelectorAll('.story-card');

    storyCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Initialize reveal animations
initRevealAnimations();

/**
 * Typewriter Effect - Optional effect for key text
 */
function typewriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

/**
 * Lazy Load Images - Performance optimization
 */
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoad();

/**
 * Print Styles - Prepare for print
 */
window.addEventListener('beforeprint', () => {
    // Show all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('visible');
    });
});

/**
 * Accessibility - Reduce motion for users who prefer it
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations
    document.documentElement.style.setProperty('--transition-reveal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
    document.documentElement.style.setProperty('--transition-medium', '0s');

    // Show all fade-in elements immediately
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('visible');
    });
}

/**
 * Problem Carousel - Auto-rotating image carousel with fade effect
 */
function initProblemCarousel() {
    initCarousel('problemCarousel', 2500);
}

/**
 * Art Carousel - Auto-rotating image carousel for artwork
 */
function initArtCarousel() {
    initCarousel('artCarousel', 3000);
}

/**
 * Student Carousel - Auto-rotating image carousel for student photos
 */
function initStudentCarousel() {
    initCarousel('studentCarousel', 2800);
}

/**
 * Generic Carousel Initializer
 */
function initCarousel(carouselId, intervalTime) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-image');
    if (images.length === 0) return;

    let currentIndex = 0;

    function showNextImage() {
        // Remove active class from current image
        images[currentIndex].classList.remove('active');

        // Move to next image (loop back to start if at end)
        currentIndex = (currentIndex + 1) % images.length;

        // Add active class to new current image
        images[currentIndex].classList.add('active');
    }

    // Start the auto-rotation
    setInterval(showNextImage, intervalTime);
}

/**
 * Collapsible Sections - Toggle content visibility
 */
function initCollapsibleSections() {
    const toggle = document.getElementById('howItWorksToggle');
    const content = document.getElementById('howItWorksContent');

    if (!toggle || !content) return;

    // Start collapsed
    toggle.classList.add('collapsed');
    content.classList.add('collapsed');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
    });
}

/**
 * Case Categories Pie Chart - Interactive Chart.js pie chart
 */
function initCaseCategoriesChart() {
    const canvas = document.getElementById('caseCategoriesChart');
    const legendContainer = document.getElementById('chartLegend');

    if (!canvas || !legendContainer) return;

    // Data from the report - using the brand color palette
    const chartData = {
        labels: [
            'Medical Care (Mental + Physical)',
            'Staff Complaints',
            'Institution Operations',
            'Classification Matters',
            'First Step Act',
            'PREA (Prison Rape)',
            'Legal Matters',
            'Disciplinary Action Appeals',
            'Solitary Confinement',
            'Community/Pre-Release Programs',
            'Communication',
            'Programs',
            'Searches and Use of Restraints',
            'Sentence Reduction/Computation',
            'Transfers',
            'Work Assignments',
            'Food',
            'Records Management'
        ],
        values: [30.94, 28.18, 6.08, 5.52, 4.97, 4.42, 3.87, 3.31, 2.76, 2.76, 1.65, 1.10, 1.10, 1.10, 0.55, 0.55, 0.55, 0.55]
    };

    // Color palette with unique colors for each slice
    const colors = [
        '#00D4FF',  // Primary cyan
        '#FF6B6B',  // Coral red
        '#4ECDC4',  // Teal
        '#FFE66D',  // Yellow
        '#95E1D3',  // Mint green
        '#F38181',  // Salmon
        '#AA96DA',  // Lavender
        '#FCBAD3',  // Pink
        '#A8E6CF',  // Soft green
        '#FF8B94',  // Light coral
        '#6C5CE7',  // Purple
        '#FDCB6E',  // Amber
        '#00CEC9',  // Dark cyan
        '#E17055',  // Terra cotta
        '#74B9FF',  // Sky blue
        '#55A3FF',  // Bright blue
        '#FD79A8',  // Hot pink
        '#636E72'   // Slate gray
    ];

    const ctx = canvas.getContext('2d');

    // Create the chart
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartData.labels,
            datasets: [{
                data: chartData.values,
                backgroundColor: colors,
                borderColor: '#000000',
                borderWidth: 1,
                hoverBorderWidth: 2,
                hoverBorderColor: '#000000'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false // We'll create a custom legend
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 10, 0.95)',
                    titleFont: {
                        family: "'Rubik', sans-serif",
                        size: 14,
                        weight: '700'
                    },
                    bodyFont: {
                        family: "'Rubik', sans-serif",
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    boxPadding: 6,
                    callbacks: {
                        label: function(context) {
                            return ` ${context.parsed.toFixed(2)}%`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1500,
                easing: 'easeOutQuart'
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    toggleLegendItem(index);
                }
            }
        }
    });

    // Create custom legend
    chartData.labels.forEach((label, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.dataset.index = index;

        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${colors[index]}"></div>
            <span class="legend-text">${label}</span>
            <span class="legend-value">${chartData.values[index].toFixed(2)}%</span>
        `;

        legendItem.addEventListener('click', () => {
            toggleLegendItem(index);
        });

        legendContainer.appendChild(legendItem);
    });

    // Toggle legend item visibility
    function toggleLegendItem(index) {
        const meta = chart.getDatasetMeta(0);
        const legendItem = legendContainer.querySelector(`[data-index="${index}"]`);

        // Toggle the hidden state
        meta.data[index].hidden = !meta.data[index].hidden;
        legendItem.classList.toggle('inactive');

        chart.update();
    }

    // Animate chart when it comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                chart.update('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(canvas);
}

console.log('The Remedy Project - Impact Report loaded successfully');
