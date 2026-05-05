/* ═══ PARAFIELD SYSTEM CORE ═══ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', async () => {
        // 1. LOAD CONFIG
        let config = null;
        try {
            const response = await fetch('config.json');
            config = await response.json();
            handleConfig(config);
        } catch (e) {
            console.error('[SYSTEM] Failed to load config:', e);
        }

        // 2. HUD INTERACTION & PARALLAX
        initHUD();

        // 3. EXTERNAL REDIRECTS
        initRedirects();
    });

    /**
     * Handles studio-wide configuration from config.json
     */
    function handleConfig(cfg) {
        if (!cfg) return;

        // Notice Bar
        if (cfg.noticeBar && cfg.noticeBar.enabled) {
            document.body.classList.add('has-notice-bar');
            const notice = document.createElement('div');
            notice.className = 'top-notice-bar';
            notice.innerHTML = `<span class="notice-hud">[ SYSTEM_BROADCAST ]</span> ${cfg.noticeBar.text}`;
            document.body.prepend(notice);
        }
    }

    /**
     * Initializes dynamic HUD elements and parallax drift
     */
    function initHUD() {
        const trHUDs = document.querySelectorAll('.hud.tr');
        const brackets = document.querySelectorAll('.bracket');

        document.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            const { innerWidth: w, innerHeight: h } = window;

            // Dynamic Coordinates
            if (trHUDs.length > 0) {
                const lat = (y / h * 90).toFixed(4);
                const lng = (x / w * 180).toFixed(4);
                trHUDs.forEach(hud => {
                    hud.innerText = `LAT: ${lat} | LNG: ${lng}`;
                });
            }

            // Subtle Parallax Drift
            const moveX = (x - w / 2) / 60;
            const moveY = (y - h / 2) / 60;

            brackets.forEach(b => {
                // Preserve the rotation/positioning from CSS if needed, 
                // but usually translate is safe here.
                b.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            // Labels parallax
            const labels = document.querySelectorAll('.hero-label, .hero-label-career');
            labels.forEach(l => {
                l.style.transform = `translate(${moveX * 0.8}px, ${moveY * 0.8}px)`;
            });
        });
    }

    /**
     * Safe External Link Interceptor
     */
    function initRedirects() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link || !link.href) return;

            try {
                const url = new URL(link.href);
                const host = url.hostname.toLowerCase();
                const internalDomains = ['parafieldstudios.com', 'localhost', '127.0.0.1'];
                
                const isInternal = internalDomains.some(d => host === d || host.endsWith('.' + d)) || host === window.location.hostname.toLowerCase();
                const href = link.getAttribute('href');
                
                // Only intercept actual external URLs
                if (!href || href.startsWith('#') || href.startsWith('javascript:') || (!href.includes('://') && !href.startsWith('//'))) return;

                if (!isInternal) {
                    e.preventDefault();
                    window.location.href = `/redirect.html?url=${encodeURIComponent(link.href)}`;
                }
            } catch (err) {
                // Ignore parsing errors for non-standard links
            }
        });
    }

})();
