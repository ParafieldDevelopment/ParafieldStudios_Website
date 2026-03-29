// Career Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("career-modal");
    if (!modal) return;

    const modalContent = document.querySelector(".career-modal-content");
    const modalName = document.getElementById("modal-name");
    const modalRole = document.getElementById("modal-role");
    const modalDescription = document.getElementById("modal-description");
    const modalSide = document.querySelector(".career-modal-side");
    const modalIcon = document.querySelector(".career-modal-icon");
    const modalButtonsContainer = document.querySelector(".career-modal-buttons");
    const modalBadge = document.querySelector(".career-badge");
    const closeModal = modal.querySelector(".close-modal");

    const roleCards = document.querySelectorAll(".role-card");
    let activeCard = null;

    roleCards.forEach(card => {
        card.addEventListener("click", () => {
            activeCard = card;
            const rect = card.getBoundingClientRect();
            const name = card.querySelector("h3").innerText;
            const shortRole = card.querySelector("p").innerText;
            const roleColor = card.getAttribute("data-color") || "#121212";
            
            const descriptionEl = card.querySelector(".card-description");
            const description = descriptionEl ? descriptionEl.innerHTML : "No details available.";
            
            const iconSvg = card.querySelector(".role-icon svg").cloneNode(true);
            const isUnavailable = card.querySelector(".role-unavailable") !== null;
            const isPriority = card.getAttribute("data-priority") === "true";
            
            // Get buttons from the card
            const cardButtons = card.querySelector(".card-buttons");
            const buttonsHTML = cardButtons ? cardButtons.innerHTML : "";

            modalName.innerText = name;
            modalRole.innerText = shortRole;
            modalDescription.innerHTML = description;
            
            // Clear and inject icon
            modalIcon.innerHTML = '';
            modalIcon.appendChild(iconSvg);
            
            // Apply role color to modal side
            modalSide.style.background = `linear-gradient(135deg, ${roleColor} 0%, #1a1a1a 100%)`;
            
            // Apply role color to text and icon
            modalName.style.color = roleColor;
            if (iconSvg) {
                iconSvg.style.stroke = roleColor;
            }
            
            // Handle status badge
            if (isUnavailable) {
                modalBadge.innerText = "Position Closed / Misc";
                modalBadge.classList.add("closed");
                modalBadge.classList.remove("priority");
            } else if (isPriority) {
                modalBadge.innerText = "High Priority Position";
                modalBadge.classList.add("priority");
                modalBadge.classList.remove("closed");
            } else {
                modalBadge.innerText = "Open Position";
                modalBadge.classList.remove("closed");
                modalBadge.classList.remove("priority");
            }

            modalButtonsContainer.innerHTML = buttonsHTML;

            // Initial state (match card)
            modal.style.display = "block";
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
            modalContent.style.zIndex = '2001';

            // Force reflow
            void modal.offsetWidth;

            // Animate to center
            modal.classList.add("active");
            document.body.classList.add("modal-open");
            modalContent.style.transition = 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
            
            // Calculate target dimensions
            const targetWidth = Math.min(1000, window.innerWidth * 0.95);
            const targetHeight = Math.min(window.innerHeight * 0.8, 800); 

            modalContent.style.top = `50%`;
            modalContent.style.left = `50%`;
            modalContent.style.width = `${targetWidth}px`;
            modalContent.style.height = `${targetHeight}px`; 
            modalContent.style.transform = 'translate(-50%, -50%)';
            
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
        modalContent.style.transform = 'none';
        modalContent.style.opacity = '0';

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