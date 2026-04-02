document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check if we've already shown the intro in this session
    if (sessionStorage.getItem('parafield_intro_shown')) return;

    // 2. Direct entry check: If referrer is from our own domain, don't show the intro.
    // This ensures it only plays when first arriving at the site (direct, bookmark, or external link)
    // and not when clicking internal links like "Home".
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
                <img src="assets/ParafieldStudiosWhite.png" alt="Parafield Studios" class="intro-logo">
                <div class="intro-glow"></div>
            </div>
        `;
        document.body.appendChild(introOverlay);

        // 5. Inject Intro CSS
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
                transition: opacity 1s ease;
            }

            .intro-content {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .intro-logo {
                width: 400px;
                max-width: 80vw;
                height: auto;
                opacity: 0;
                filter: blur(20px);
                transform: scale(0.8);
                transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
            }

            .intro-logo.reveal {
                opacity: 1;
                filter: blur(0px);
                transform: scale(1);
            }

            .intro-logo.shake {
                animation: violent-shake 0.1s linear infinite;
                filter: drop-shadow(0 0 30px #f2ae49);
            }

            @keyframes violent-shake {
                0% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(5px, 5px) rotate(2deg); }
                50% { transform: translate(-5px, -5px) rotate(-2deg); }
                75% { transform: translate(5px, -5px) rotate(2deg); }
                100% { transform: translate(-5px, 5px) rotate(-2deg); }
            }

            .intro-glow {
                position: absolute;
                width: 150%;
                height: 150%;
                background: radial-gradient(circle, rgba(242, 174, 73, 0.4) 0%, transparent 70%);
                opacity: 0;
                transition: opacity 0.5s ease, transform 0.3s ease;
                pointer-events: none;
            }

            .intro-glow.active {
                opacity: 1;
            }

            #parafield-intro.fade-out {
                opacity: 0;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);

        // 6. Run Animation Sequence
        const logo = introOverlay.querySelector('.intro-logo');
        const glow = introOverlay.querySelector('.intro-glow');

        // Disable scrolling while intro is playing
        document.body.style.overflow = 'hidden';

        // Wait for black screen impact
        await new Promise(r => setTimeout(r, 600));

        // Step 1: Reveal logo with a blur-to-clear transition
        logo.classList.add('reveal');
        await new Promise(r => setTimeout(r, 1200));

        // Step 2: Activate glow
        glow.classList.add('active');
        await new Promise(r => setTimeout(r, 400));

        // Step 3: THE INSANITY SHAKE
        logo.classList.add('shake');
        glow.style.transform = 'scale(1.3)';
        await new Promise(r => setTimeout(r, 400)); 
        logo.classList.remove('shake');
        glow.style.transform = 'scale(1)';

        // Step 4: Final hold
        await new Promise(r => setTimeout(r, 1000));

        // Step 5: Fade out
        introOverlay.classList.add('fade-out');
        
        // Cleanup
        setTimeout(() => {
            introOverlay.remove();
            style.remove();
            document.body.style.overflow = '';
        }, 1000);

    } catch (e) {
        console.error('Intro error:', e);
        document.body.style.overflow = '';
    }
});