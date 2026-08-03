(function () {
    'use strict';

    // Only enable on devices with a real pointer
    if (window.matchMedia('(hover: none)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-crosshair"></div>';
    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(dot);

    const style = document.createElement('style');
    style.textContent = 'html, body, a, button, [role="button"], input, select, textarea, .game-card, .team-card, .project-card { cursor: none !important; }';
    document.head.appendChild(style);

    const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, .game-card, .team-card, .project-card';

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
        document.body.classList.add('cursor-ready');
        const hit = e.target instanceof Element && e.target.closest(INTERACTIVE);
        cursor.classList.toggle('cursor-hover', !!hit);
        dot.classList.toggle('dot-hover', !!hit);
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        dot.classList.remove('dot-hover');
    });
})();
