document.addEventListener('DOMContentLoaded', () => {
    const footerGroups = document.querySelectorAll('.footer-links-group');
    
    footerGroups.forEach(group => {
        const links = group.querySelectorAll('a');
        let legalGroup = null;
        const legalLinks = [];

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.includes('privacy') || href.includes('terms') || href.includes('do-not-sell') || href.includes('health-and-safety'))) {
                legalLinks.push(link);
            }
        });

        if (legalLinks.length > 0) {
            // Create the dropdown container
            const dropdown = document.createElement('div');
            dropdown.className = 'footer-legal-dropdown';
            
            const trigger = document.createElement('button');
            trigger.className = 'footer-legal-trigger';
            trigger.innerHTML = 'Legal <span class="arrow">▾</span>';
            
            const menu = document.createElement('div');
            menu.className = 'footer-legal-menu';
            
            // Move legal links into the menu
            legalLinks.forEach(link => {
                const menuItem = link.cloneNode(true);
                menu.appendChild(menuItem);
                link.remove(); // Remove original link from footer
            });

            dropdown.appendChild(trigger);
            dropdown.appendChild(menu);
            group.appendChild(dropdown);

            // Toggle logic
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });

            // Close when clicking outside
            document.addEventListener('click', () => {
                dropdown.classList.remove('active');
            });
        }
    });
});