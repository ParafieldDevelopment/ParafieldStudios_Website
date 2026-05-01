document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll(".scroll-on");

    const displayScrollElement = (el) => {
        if (el.dataset.stagger === "true") {
            const children = el.children;
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add("scroll-on-active");
                    // If child itself is a scroll-on element, ensure it's handled
                    if (child.classList.contains('scroll-on')) {
                        child.classList.add("scroll-on-active");
                    }
                }, index * 100); // 100ms stagger
            });
            el.classList.add("scroll-on-active");
        } else {
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
});