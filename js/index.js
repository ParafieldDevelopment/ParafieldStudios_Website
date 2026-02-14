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

// Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("team-modal");
    if (!modal) return;

    const modalContent = document.querySelector(".modal-content");
    const modalName = document.getElementById("modal-name");
    const modalRole = document.getElementById("modal-role");
    const modalDescription = document.getElementById("modal-description");
    const modalImage = document.querySelector(".modal-image-placeholder");
    const modalButtonsContainer = document.querySelector(".modal-buttons");
    const closeModal = document.querySelector(".close-modal");

    const teamCards = document.querySelectorAll(".team-card");
    let activeCard = null;

    teamCards.forEach(card => {
        card.addEventListener("click", () => {
            activeCard = card;
            const rect = card.getBoundingClientRect();
            const name = card.querySelector("h3").innerText;
            const role = card.querySelector("p").innerText;
            
            const descriptionEl = card.querySelector(".card-description");
            const description = descriptionEl ? descriptionEl.innerHTML : card.getAttribute("data-description");
            
            const imageColor = card.querySelector(".team-image-placeholder").style.backgroundColor;
            const imageSrc = card.getAttribute("data-image");
            
            // Get buttons from the card
            const cardButtons = card.querySelector(".card-buttons");
            const buttonsHTML = cardButtons ? cardButtons.innerHTML : "";

            modalName.innerText = name;
            modalRole.innerText = role;
            modalDescription.innerHTML = description || "No description available.";
            modalImage.style.backgroundColor = imageColor;
            modalButtonsContainer.innerHTML = buttonsHTML; // Inject buttons
            
            if (imageSrc) {
                modalImage.style.backgroundImage = `url('${imageSrc}')`;
                modalImage.style.backgroundSize = 'cover';
                modalImage.style.backgroundPosition = 'center';
            } else {
                modalImage.style.backgroundImage = 'none';
            }

            // Initial state (match card)
            modal.style.display = "block"; // Use block to allow fixed positioning
            modal.classList.remove("active");
            
            modalContent.style.transition = 'none';
            modalContent.style.position = 'fixed';
            modalContent.style.top = `${rect.top}px`;
            modalContent.style.left = `${rect.left}px`;
            modalContent.style.width = `${rect.width}px`;
            modalContent.style.height = `${rect.height}px`;
            modalContent.style.margin = '0';
            modalContent.style.transform = 'none';
            modalContent.style.opacity = '1';
            modalContent.style.overflow = 'hidden';
            modalContent.style.zIndex = '2001'; // Ensure it's above everything

            // Force reflow
            void modal.offsetWidth;

            // Animate to center
            modal.classList.add("active");
            document.body.classList.add("modal-open");
            modalContent.style.transition = 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
            
            // Calculate target dimensions
            const targetWidth = Math.min(1000, window.innerWidth * 0.95); // Updated to match CSS
            // Let height be auto-ish but we need a target for animation. 
            // Let's pick a reasonable max height or calculate based on content?
            // Calculating based on content is hard because content changes width.
            // Let's just expand to a large box.
            const targetHeight = Math.min(window.innerHeight * 0.8, 800); 

            modalContent.style.top = `50%`;
            modalContent.style.left = `50%`;
            modalContent.style.width = `${targetWidth}px`;
            modalContent.style.height = `${targetHeight}px`; 
            modalContent.style.transform = 'translate(-50%, -50%)';
            
            // Allow scrolling inside modal after animation
            setTimeout(() => {
                modalContent.style.overflow = 'auto';
            }, 500);
        });
    });

    const closeAnimation = () => {
        if (!activeCard) {
            modal.style.display = "none";
            return;
        }

        const rect = activeCard.getBoundingClientRect();

        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
        
        // We need to transition from current state (centered) back to card rect.
        // Current state is top: 50%, left: 50%, transform: translate(-50%, -50%)
        // We need to remove transform and set top/left to rect.top/rect.left
        
        // First, get current computed style to lock it? No, we can just animate to new values.
        
        modalContent.style.transition = 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)';
        modalContent.style.top = `${rect.top}px`;
        modalContent.style.left = `${rect.left}px`;
        modalContent.style.width = `${rect.width}px`;
        modalContent.style.height = `${rect.height}px`;
        modalContent.style.transform = 'none'; // Remove centering transform
        modalContent.style.opacity = '0'; // Fade out content as it shrinks

        setTimeout(() => {
            modal.style.display = "none";
            modalContent.style.opacity = '1';
            modalContent.style.overflow = 'auto'; 
            modalContent.style.height = 'auto';
            activeCard = null;
        }, 400); 
    };

    if (closeModal) {
        closeModal.addEventListener("click", (e) => {
            e.stopPropagation();
            closeAnimation();
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            closeAnimation();
        }
    });
});