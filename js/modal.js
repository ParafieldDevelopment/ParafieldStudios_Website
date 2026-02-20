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
            const imageBackgroundImage = card.querySelector(".team-image-placeholder").style.backgroundImage;
            const imageSrc = card.getAttribute("data-image");
            
            // Get buttons from the card
            const cardButtons = card.querySelector(".card-buttons");
            const buttonsHTML = cardButtons ? cardButtons.innerHTML : "";

            modalName.innerText = name;
            modalRole.innerText = role;
            modalDescription.innerHTML = description || "No description available.";

            console.log(card.dataset);

            if (card.dataset.modalColor) {
                modalImage.style.backgroundColor = card.dataset.modalColor;
            } else {
                modalImage.style.backgroundColor = imageColor;
            }
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