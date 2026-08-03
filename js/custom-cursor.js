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
    style.textContent = 'html, body, a, button, [role="button"], input, select, textarea, .game-card, .team-card, .project-card { cursor: none !important; }'
        + 'html.os-cursor, html.os-cursor body, html.os-cursor * { cursor: auto !important; }';
    document.head.appendChild(style);

    const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, .game-card, .team-card, .project-card';
    const scrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

    /* ── CURSOR TRAIL ── */
    const TRAIL_COUNT = 8;
    const trail = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
        const t = document.createElement('div');
        t.className = 'cursor-trail';
        t.style.opacity = '0';
        document.body.appendChild(t);
        trail.push({ el: t, x: 0, y: 0, o: 0.95 - (i / TRAIL_COUNT) * 0.85 });
    }

    let mx = 0, my = 0, active = false;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
        if (!active) {
            active = true;
            document.body.classList.add('cursor-ready');
            trail.forEach(t => { t.el.style.opacity = t.o; });
        }
        const hit = e.target instanceof Element && e.target.closest(INTERACTIVE);
        cursor.classList.toggle('cursor-hover', !!hit);
        dot.classList.toggle('dot-hover', !!hit);

        /* Over the scrollbar strip: show the OS cursor, hide the custom one */
        const sb = scrollbarWidth();
        if (sb > 0 && e.clientX >= window.innerWidth - sb) {
            document.documentElement.classList.add('os-cursor');
            document.body.classList.add('cursor-hide');
        } else {
            document.documentElement.classList.remove('os-cursor');
            document.body.classList.remove('cursor-hide');
        }
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        dot.classList.remove('dot-hover');
    });

    (function trailLoop() {
        if (active) {
            let px = mx, py = my;
            trail.forEach((t, i) => {
                const k = i === 0 ? 0.45 : 0.32;
                t.x += (px - t.x) * k;
                t.y += (py - t.y) * k;
                t.el.style.left = t.x + 'px';
                t.el.style.top = t.y + 'px';
                px = t.x; py = t.y;
            });
        }
        requestAnimationFrame(trailLoop);
    })();
})();
