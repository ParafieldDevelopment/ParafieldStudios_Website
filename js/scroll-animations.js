document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll(".scroll-on");

    const elementInView = (el, offset = 0) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
    };

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

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100) && !el.classList.contains("scroll-on-active")) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener("scroll", handleScrollAnimation);
    // Initial check
    handleScrollAnimation();
});