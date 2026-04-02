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

        // Mark as shown immediately
        sessionStorage.setItem('parafield_intro_shown', 'true');

        // 4. Create the Intro Overlay
        const introOverlay = document.createElement('div');
        introOverlay.id = 'parafield-intro';
        introOverlay.innerHTML = `
            <div class="intro-container">
                <div class="intro-logo-wrapper">
                    <img src="assets/logo.svg" alt="Parafield" class="intro-logo">
                    <div class="intro-logo-glow"></div>
                </div>
                <div class="intro-text-wrapper">
                    <h1 class="intro-text">PARAFIELD</h1>
                    <h1 class="intro-text">STUDIOS</h1>
                </div>
            </div>
            <div class="intro-bg-glow"></div>
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
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .intro-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                position: relative;
                z-index: 10;
            }

            .intro-logo-wrapper {
                position: relative;
                width: 200px;
                height: 200px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .intro-logo {
                width: 100%;
                height: auto;
                opacity: 0;
                filter: blur(15px) brightness(0);
                transform: scale(0.5);
                transition: all 1.2s cubic-bezier(0.19, 1, 0.22, 1);
            }

            .intro-logo.reveal {
                opacity: 1;
                filter: blur(0px) brightness(1.2);
                transform: scale(1);
            }

            .intro-logo-glow {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 120%;
                height: 120%;
                background: radial-gradient(circle, #f2ae49 0%, transparent 70%);
                opacity: 0;
                transition: opacity 1s ease;
                filter: blur(20px);
                mix-blend-mode: screen;
            }

            .intro-text-wrapper {
                text-align: center;
                overflow: hidden;
            }

            .intro-text {
                color: #ffffff;
                font-size: 3.5rem;
                font-weight: 900;
                margin: 0;
                letter-spacing: 0.5rem;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
                line-height: 1.1;
            }

            .intro-text.reveal {
                opacity: 1;
                transform: translateY(0);
            }

            /* The Insanity Effects */
            .intro-container.shake {
                animation: extreme-shake 0.15s cubic-bezier(.36,.07,.19,.97) infinite;
            }

            .intro-container.chromatic {
                text-shadow: 2px 0 0 #ff0000, -2px 0 0 #00ffff;
                filter: contrast(1.5) brightness(1.2);
            }

            @keyframes extreme-shake {
                10%, 90% { transform: translate3d(-2px, 0, 0); }
                20%, 80% { transform: translate3d(4px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
                40%, 60% { transform: translate3d(6px, 0, 0); }
            }

            .intro-bg-glow {
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at center, rgba(242, 174, 73, 0.15) 0%, transparent 80%);
                opacity: 0;
                transition: opacity 2s ease;
            }

            #parafield-intro.fade-out {
                opacity: 0;
                transition: opacity 1.2s ease-in;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);

        // 6. Run Animation Sequence
        const container = introOverlay.querySelector('.intro-container');
        const logo = introOverlay.querySelector('.intro-logo');
        const logoGlow = introOverlay.querySelector('.intro-logo-glow');
        const texts = introOverlay.querySelectorAll('.intro-text');
        const bgGlow = introOverlay.querySelector('.intro-bg-glow');

        // Disable scrolling
        document.body.style.overflow = 'hidden';

        // Wait for black screen
        await new Promise(r => setTimeout(r, 800));

        // Step 1: Logo enters
        logo.classList.add('reveal');
        bgGlow.style.opacity = '1';
        await new Promise(r => setTimeout(r, 800));

        // Step 2: Logo glow activates
        logoGlow.style.opacity = '0.6';
        await new Promise(r => setTimeout(r, 400));

        // Step 3: Text reveals sequentially
        for (let i = 0; i < texts.length; i++) {
            texts[i].classList.add('reveal');
            await new Promise(r => setTimeout(r, 200));
        }
        await new Promise(r => setTimeout(r, 600));

        // Step 4: THE INSANITY
        container.classList.add('shake', 'chromatic');
        logoGlow.style.opacity = '1';
        logoGlow.style.transform = 'translate(-50%, -50%) scale(1.5)';
        
        await new Promise(r => setTimeout(r, 500)); // Intense burst
        
        container.classList.remove('shake', 'chromatic');
        logoGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        logoGlow.style.opacity = '0.4';

        // Step 5: Final hold
        await new Promise(r => setTimeout(r, 1200));

        // Step 6: Fade out everything
        introOverlay.classList.add('fade-out');
        
        // Cleanup
        setTimeout(() => {
            introOverlay.remove();
            style.remove();
            document.body.style.overflow = '';
        }, 1200);

    } catch (e) {
        console.error('Intro error:', e);
        document.body.style.overflow = '';
    }
});