document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check if we've already shown the intro in this session
    if (sessionStorage.getItem('parafield_intro_shown')) return;

    // 2. Direct entry check: If referrer is from our own domain, don't show the intro.
    const referrer = document.referrer;
    if (referrer && (referrer.includes(window.location.hostname) || referrer.includes('parafieldstudios.com'))) {
        sessionStorage.setItem('parafield_intro_shown', 'true');
        return;
    }

    try {
        // 3. Fetch config to see if intro is enabled
        const response = await fetch('config.json');
        const config = await response.json();
        
        if (!config.introEnabled) return;

        // Mark as shown immediately to prevent any re-triggers
        sessionStorage.setItem('parafield_intro_shown', 'true');

        // 4. Create the Intro Overlay
        const introOverlay = document.createElement('div');
        introOverlay.id = 'parafield-intro';
        introOverlay.innerHTML = `
            <div class="intro-content">
                <img src="assets/logo.svg" alt="Parafield" class="intro-logo">
                <div class="intro-text-group">
                    <span class="intro-text-line">PARAFIELD</span>
                    <span class="intro-text-line">STUDIOS</span>
                </div>
            </div>
            <div class="intro-ambient-glow"></div>
        `;
        document.body.appendChild(introOverlay);

        // 5. Inject Clean CSS
        const style = document.createElement('style');
        style.innerHTML = `
            #parafield-intro {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #000000;
                z-index: 999999;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                cursor: none;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .intro-content {
                display: flex;
                align-items: center;
                gap: 20px;
                position: relative;
                z-index: 10;
            }

            .intro-logo {
                height: 110px;
                width: auto;
                filter: brightness(0) invert(1);
                opacity: 0;
                transform: scale(0.9);
                transition: all 1.2s cubic-bezier(0.19, 1, 0.22, 1);
            }

            .intro-logo.reveal {
                opacity: 1;
                transform: scale(1);
            }

            .intro-text-group {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .intro-text-line {
                color: #ffffff;
                font-size: 3.2rem;
                font-weight: 600; /* Semi-bold Segoe UI */
                margin: 0;
                letter-spacing: 0.2rem;
                opacity: 0;
                transform: translateX(10px);
                transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
                line-height: 1;
            }

            .intro-text-line.reveal {
                opacity: 1;
                transform: translateX(0);
            }

            .intro-ambient-glow {
                position: absolute;
                width: 50%;
                height: 50%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 70%);
                opacity: 0;
                transition: opacity 2s ease;
                pointer-events: none;
            }

            #parafield-intro.fade-out {
                opacity: 0;
                transition: opacity 1.2s ease-in-out;
                pointer-events: none;
            }

            @media (max-width: 768px) {
                .intro-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 15px;
                }
                .intro-text-line {
                    font-size: 2rem;
                }
                .intro-logo {
                    height: 70px;
                }
            }
        `;
        document.head.appendChild(style);

        // 6. Animation Sequence
        const logo = introOverlay.querySelector('.intro-logo');
        const textLines = introOverlay.querySelectorAll('.intro-text-line');
        const bgGlow = introOverlay.querySelector('.intro-ambient-glow');

        // Disable scrolling while intro is playing
        document.body.style.overflow = 'hidden';

        // Wait a bit for initial black screen impact
        await new Promise(r => setTimeout(r, 600));

        // Step 1: Reveal logo
        logo.classList.add('reveal');
        bgGlow.style.opacity = '1';
        await new Promise(r => setTimeout(r, 600));

        // Step 2: Reveal text lines smoothly
        for (let i = 0; i < textLines.length; i++) {
            textLines[i].classList.add('reveal');
            await new Promise(r => setTimeout(r, 150));
        }

        // Step 3: Final hold
        await new Promise(r => setTimeout(r, 2200));

        // Step 4: Fade out
        introOverlay.classList.add('fade-out');
        
        // Cleanup
        setTimeout(() => {
            introOverlay.remove();
            style.remove();
            document.body.style.overflow = '';
            // Trigger a custom event to signify intro is finished
            window.dispatchEvent(new CustomEvent('parafieldIntroFinished'));
        }, 1200);

    } catch (e) {
        console.error('Intro error:', e);
        document.body.style.overflow = '';
    }
});