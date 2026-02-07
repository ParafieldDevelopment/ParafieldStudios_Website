document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav.nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    const navToggle = document.querySelector('.nav-toggle');
    const navButtons = document.querySelector('.nav-buttons');

    if (navToggle && navButtons) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navButtons.classList.toggle('active');
        });

        // Close menu when clicking a button
        const buttons = navButtons.querySelectorAll('.nav-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navButtons.classList.remove('active');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll(".scroll-on");

    console.log(scrollElements);

    const elementInView = (el, offset = 0) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
    };

    const displayScrollElement = (el) => {
        el.classList.add("scroll-on-active");
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 100)) {
                displayScrollElement(el);
            }
        });
    };

    window.addEventListener("scroll", handleScrollAnimation);
    window.addEventListener("DOMContentLoaded", handleScrollAnimation);
});