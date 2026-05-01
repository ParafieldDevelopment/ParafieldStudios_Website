document.addEventListener('DOMContentLoaded', async () => {
    const introOverlay = document.querySelector('.intro-overlay');
    const topLeftPhrase = introOverlay.querySelector('.intro-phrase.top-left');
    const bottomRightPhrase = introOverlay.querySelector('.intro-phrase.bottom-right');
    const shakingText = introOverlay.querySelector('.shaking-text');

    // Ensure introOverlay exists before proceeding
    if (!introOverlay) {
        console.warn("Intro overlay element not found. Skipping intro animation.");
        return;
    }

    // 1. Check if we've already shown the intro in this session
    if (sessionStorage.getItem('parafield_intro_shown')) {
        introOverlay.classList.add('hidden'); // Hide immediately if already shown
        return;
    }

    // 2. Direct entry check: If referrer is from our own domain, don't show the intro.
    // This logic might need adjustment if the intro is desired on internal navigation.
    const referrer = document.referrer;
    if (referrer && (referrer.includes(window.location.hostname) || referrer.includes('parafieldstudios.com'))) {
        sessionStorage.setItem('parafield_intro_shown', 'true');
        introOverlay.classList.add('hidden'); // Hide immediately
        return;
    }

    try {
        // 3. Fetch config to see if intro is enabled
        const response = await fetch('config.json');
        const config = await response.json();
        
        if (!config.introEnabled) {
            introOverlay.classList.add('hidden'); // Hide immediately if disabled
            return;
        }

        // Mark as shown immediately to prevent any re-triggers
        sessionStorage.setItem('parafield_intro_shown', 'true');

        // Disable scrolling while intro is playing
        document.body.style.overflow = 'hidden';

        // Ensure the overlay is visible initially
        introOverlay.style.opacity = '1';
        introOverlay.style.pointerEvents = 'auto'; // Re-enable pointer events during intro

        // Animation Sequence for the new intro text
        await new Promise(r => setTimeout(r, 500)); // Initial brief pause

        // Reveal top-left phrase
        topLeftPhrase.classList.add('active');
        // Apply violent shake to the shaking text
        shakingText.style.animation = 'violent-shake 0.1s linear infinite';

        await new Promise(r => setTimeout(r, 1500)); // Pause after top-left appears

        // Reveal bottom-right phrase
        bottomRightPhrase.classList.add('active');

        await new Promise(r => setTimeout(r, 2500)); // Hold for a moment

        // Fade out the entire intro overlay
        introOverlay.classList.add('hidden');
        
        // Cleanup after fade-out
        setTimeout(() => {
            introOverlay.remove();
            document.body.style.overflow = ''; // Re-enable scrolling
            // Trigger a custom event to signify intro is finished
            window.dispatchEvent(new CustomEvent('parafieldIntroFinished'));
        }, 1200); // Match this duration with the CSS transition for .intro-overlay.hidden

    } catch (e) {
        console.error('Intro error:', e);
        // In case of error, ensure overlay is hidden and scrolling is re-enabled
        if (introOverlay) introOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
});
