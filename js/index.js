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

    const slider = document.querySelector('.banner-slider');
    const slides = document.querySelectorAll('.banner-slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentSlide = 0;

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;
        
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });

        if (slider) {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
    }

    if (prevBtn && nextBtn && slides.length > 0) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });

        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
        
        // Optional: Auto-play
        setInterval(() => {
             showSlide(currentSlide + 1);
        }, 10000);
    }
});