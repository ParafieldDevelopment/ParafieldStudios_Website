document.addEventListener('DOMContentLoaded', () => {
    // Initialize any hardcoded dropdowns first
    document.querySelectorAll('.footer-legal-dropdown').forEach(setupDropdown);

    // Then, for groups without a dropdown, try to merge flat links
    const footerGroups = document.querySelectorAll('.footer-links-group');
    
    footerGroups.forEach(group => {
        // Skip if this group already has a dropdown
        if (group.querySelector('.footer-legal-dropdown')) return;

        // Get only direct child links to avoid picking up links inside existing sub-structures
        const links = Array.from(group.children).filter(child => child.tagName === 'A');
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
            
            // Insert the dropdown before the first legal link
            const firstLegalLink = legalLinks[0];
            group.insertBefore(dropdown, firstLegalLink);

            // Move legal links into the menu
            legalLinks.forEach(link => {
                menu.appendChild(link);
            });

            dropdown.appendChild(trigger);
            dropdown.appendChild(menu);
            
            setupDropdown(dropdown);
        }
    });

    function setupDropdown(dropdown) {
        const trigger = dropdown.querySelector('.footer-legal-trigger');
        if (!trigger || trigger.dataset.initialized) return;

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            document.querySelectorAll('.footer-legal-dropdown').forEach(other => {
                if (other !== dropdown) other.classList.remove('active');
            });
            
            dropdown.classList.toggle('active');
        });
        
        trigger.dataset.initialized = "true";
    }

    // Close when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.footer-legal-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
});
