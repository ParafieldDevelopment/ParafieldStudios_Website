// Modal Logic (Standardized)
document.addEventListener('DOMContentLoaded', () => {
    const teamCards = document.querySelectorAll(".team-card");

    teamCards.forEach(card => {
        card.addEventListener("click", () => {
            const name = card.querySelector("h3").innerText;
            const role = card.querySelector("p").innerText;
            const descriptionEl = card.querySelector(".card-description");
            const description = descriptionEl ? descriptionEl.innerHTML : "";
            const image = card.getAttribute("data-image");
            
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

            openTechnicalModal('team-modal', {
                name,
                role,
                description,
                image,
                buttons
            });
        });
    });
});