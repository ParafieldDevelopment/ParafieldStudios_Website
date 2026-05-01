document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // 2. Custom Cursor Logic
    const cursor = document.createElement('div');
    const dot = document.createElement('div');
    cursor.className = 'custom-cursor';
    dot.className = 'custom-cursor-dot';

    // Device detection: only enable custom cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        document.body.appendChild(cursor);
        document.body.appendChild(dot);
        
        // Safety: Only hide the real cursor if we are actually showing the custom one
        document.body.style.cursor = 'none';
        
        // Handle interactive elements specifically to hide OS cursor on them
        const interactiveSelectors = 'a, button, [role="button"], input, select, textarea, .team-card, .showcase-item, .nav-button, .modal-btn, .careers-link, .isounds-btn, .careers-btn';
        const style = document.createElement('style');
        style.innerHTML = `${interactiveSelectors} { cursor: none !important; }`;
        document.head.appendChild(style);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            dot.style.left = e.clientX + 'px';
            dot.style.top = e.clientY + 'px';

            // Parallax HUD Elements
            const hudElements = document.querySelectorAll('.banner-hud-top-left, .banner-hud-top-right, .banner-hud-bottom-left, .banner-hud-bottom-right, .banner-bracket');
            const ghostText = document.querySelector('.banner-ghost-text');
            
            const moveX = (e.clientX - window.innerWidth / 2) / 50;
            const moveY = (e.clientY - window.innerHeight / 2) / 50;

            hudElements.forEach(el => {
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            if (ghostText) {
                ghostText.style.transform = `translate(calc(-50% + ${moveX * 2}px), calc(-50% + ${moveY * 2}px))`;
            }
        });

        // Hover effects
        const interactiveElements = document.querySelectorAll(interactiveSelectors);

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                dot.classList.add('dot-hover');
                cursor.innerHTML = '<div class="cursor-crosshair"></div>';
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                dot.classList.remove('dot-hover');
                cursor.innerHTML = '';
            });
        });
    }

    // 3. Magnetic Buttons
    const magneticElements = document.querySelectorAll('.nav-button, .modal-btn, .careers-link, .isounds-btn, .careers-btn');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
        });
    });

    // 4. 3D Tilt Effect (Desktop Only)
    if (!isTouchDevice) {
        const tiltElements = document.querySelectorAll('.showcase-item, .team-card');
        
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 60;
                const rotateY = (centerX - x) / 60;
                
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
            });
        });
    }
});