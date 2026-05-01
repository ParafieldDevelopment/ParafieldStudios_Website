document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll(".scroll-on");

    const displayScrollElement = (el) => {
        if (el.dataset.stagger === "true") {
            const children = el.children;
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add("glitch-reveal-flicker");
                    child.classList.add("scroll-on-active");
                }, index * 150); // Slightly slower stagger for impact
            });
            el.classList.add("scroll-on-active");
        } else {
            el.classList.add("glitch-reveal-flicker");
            el.classList.add("scroll-on-active");
        }
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                displayScrollElement(entry.target);
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    scrollElements.forEach((el) => {
        observer.observe(el);
    });

    // --- Horizontal Scroll for Games Section ---
    const gamesWrapper = document.querySelector('.games-horizontal-scroll-wrapper');
    const gamesContainer = document.querySelector('.games-horizontal-scroll-container');

    if (gamesWrapper && gamesContainer) {
        const handleHorizontalScroll = () => {
            const wrapperRect = gamesWrapper.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate how much of the wrapper is visible
            // When wrapperRect.top is 0, it's at the top of the viewport
            // When wrapperRect.bottom is viewportHeight, it's at the bottom of the viewport
            const scrollStart = wrapperRect.top - viewportHeight;
            const scrollEnd = wrapperRect.bottom;
            const scrollRange = scrollEnd - scrollStart;

            // Calculate scroll progress within the wrapper's visible range
            // Progress goes from 0 (wrapper just entering from bottom) to 1 (wrapper leaving top)
            let progress = 0;
            if (scrollRange > 0) {
                progress = (viewportHeight - wrapperRect.top) / (wrapperRect.height + viewportHeight);
                progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
            }

            // Determine the maximum scroll distance for the inner container
            const maxScroll = gamesContainer.scrollWidth - gamesContainer.clientWidth;

            // Apply translateX based on scroll progress
            // We want it to scroll left as the user scrolls down
            const translateX = -maxScroll * progress;
            gamesContainer.style.transform = `translateX(${translateX}px)`;
        };

        // Use a dedicated observer for the horizontal scroll section
        const horizontalScrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start listening to scroll events when the wrapper enters the viewport
                    window.addEventListener('scroll', handleHorizontalScroll);
                    window.addEventListener('resize', handleHorizontalScroll); // Adjust on resize
                    handleHorizontalScroll(); // Initial position
                } else {
                    // Stop listening when it leaves the viewport
                    window.removeEventListener('scroll', handleHorizontalScroll);
                    window.removeEventListener('resize', handleHorizontalScroll);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0 // Trigger as soon as any part of it is visible
        });

        horizontalScrollObserver.observe(gamesWrapper);
    }
});