// Career Modal Logic (Standardized)
document.addEventListener('DOMContentLoaded', () => {
    const roleCards = document.querySelectorAll(".role-card");

    roleCards.forEach(card => {
        card.addEventListener("click", () => {
            const name = card.querySelector("h3").innerText;
            const role = card.querySelector("p").innerText;
            const descriptionEl = card.querySelector(".card-description");
            const description = descriptionEl ? descriptionEl.innerHTML : "";
            
            // Handle Icon
            const iconSvg = card.querySelector(".role-icon svg").cloneNode(true);
            const roleColor = card.getAttribute("data-color") || "#f2ae49";
            
            // Get buttons
            const cardButtons = card.querySelector(".card-buttons");
            const buttons = [];
            if (cardButtons) {
                cardButtons.querySelectorAll(".modal-btn").forEach(btn => {
                    buttons.push({
                        text: btn.innerText,
                        className: btn.className,
                        onclick: btn.getAttribute("onclick"),
                        href: btn.getAttribute("href")
                    });
                });
            }

            // Specific page logic: update the icon and badge
            const modal = document.getElementById('career-modal');
            const modalIcon = modal.querySelector(".career-modal-icon");
            const modalSide = modal.querySelector(".career-modal-side");
            
            modalIcon.innerHTML = '';
            modalIcon.appendChild(iconSvg);
            iconSvg.style.stroke = roleColor;
            modalSide.style.background = `linear-gradient(135deg, ${roleColor} 0%, #000 100%)`;

            openTechnicalModal('career-modal', {
                name,
                role,
                description,
                buttons
            });
        });
    });
});