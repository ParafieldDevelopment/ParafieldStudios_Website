document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the index.html page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const banner = document.querySelector('.banner');
        const bannerText = document.querySelector('.banner-text');
        const bannerImg = document.querySelector('.banner img');

        if (!banner || !bannerText || !bannerImg) return;

        const names = ["aprilfool", "Parafield Studios", "Careers", "Secrets"];
        const selectedName = names[Math.floor(Math.random() * names.length)];

        if (selectedName === "Parafield Studios") {
            const h1s = bannerText.querySelectorAll('h1');
            if (h1s.length >= 2) {
                h1s[0].textContent = "PARAFIELD";
                h1s[1].textContent = "STUDIOS";
            }
        } else {
            // Shared Theme Setup
            banner.classList.add('moonlight-theme');
            banner.style.backgroundSize = "cover";
            banner.style.backgroundPosition = "center";
            banner.style.backgroundColor = "#1a1a1a";
            banner.style.gap = "50px";

            if (selectedName === "Careers") {
                banner.classList.add('careers-theme');
            } else if (selectedName === "Secrets") {
                banner.classList.add('secrets-theme');
            }

            if (selectedName === "Secrets") {
                banner.style.backgroundColor = "#000";
                banner.style.backgroundImage = "none";
                bannerImg.style.display = 'none';

                bannerText.innerHTML = `
                    <div class="secrets-container">
                        <div class="banner-scanlines"></div>
                        
                        <!-- Floating 404s (Distributed across the banner) -->
                        <img src="assets/404.png" class="floating-404" style="top: 10%; left: 10%; --x: 50px; --y: 50px; --r: 360deg; --d: 15s;">
                        <img src="assets/404.png" class="floating-404" style="top: 70%; left: 15%; --x: -30px; --y: -80px; --r: -180deg; --d: 12s;">
                        <img src="assets/404.png" class="floating-404" style="top: 20%; left: 80%; --x: -60px; --y: 40px; --r: 90deg; --d: 18s;">
                        <img src="assets/404.png" class="floating-404" style="top: 80%; left: 85%; --x: 40px; --y: -50px; --r: -360deg; --d: 14s;">
                        <img src="assets/404.png" class="floating-404" style="top: 45%; left: 75%; --x: -100px; --y: -100px; --r: 45deg; --d: 20s;">
                        
                        <!-- Floating Qs (Also distributed) -->
                        <div class="floating-q" style="top: 15%; left: 25%; --x: 30px; --y: 30px; --r: 45deg; --d: 6s;">?</div>
                        <div class="floating-q" style="top: 65%; left: 40%; --x: -40px; --y: 20px; --r: -30deg; --d: 8s;">?</div>
                        <div class="floating-q" style="top: 30%; left: 60%; --x: 20px; --y: -50px; --r: 20deg; --d: 7s;">?</div>
                        <div class="floating-q" style="top: 75%; left: 20%; --x: 50px; --y: -30px; --r: 90deg; --d: 9s;">?</div>
                        
                        <div class="secrets-content">
                            <h1 class="secrets-title">Secrets... Unfolding..</h1>
                            <p class="secrets-subtitle">Secrets are hidden in the noise.</p>
                            <p class="secrets-count">0/4 secrets shown.</p>
                            <div class="scroll-indicator">
                                <span>SCROLL DOWN</span>
                                <div class="arrow-down"></div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (selectedName === "Careers") {
                banner.style.backgroundImage = "url('assets/blueprint-background.png')";
                bannerImg.style.display = 'none';
                banner.innerHTML = `
                <div class="careers-ad-container">
                    <img src="assets/logo.svg" alt="Parafield Studios Logo" class="careers-logo-animated">
                    <img src="assets/PointingFinger.png" alt="Pointing Finger" class="careers-finger-animated">
                    <div class="careers-text-animated">
                        <h1>WE WANT YOU</h1>
                        <p>...to help us procrastinate. (and make cool things)</p>
                        <a href="careers.html" class="careers-btn">Are You In?</a>
                    </div>
                </div>`;
            } else if (selectedName === "aprilfool") {
                banner.style.backgroundColor = "#000000";
                bannerImg.style.display = 'none';
                banner.innerHTML = `
                <div class="aprilfool-ad-container">
                    <img src="assets/DangerousBlades.svg" alt="Parafield Studios Logo" class="aprilfool-logo-animated">
                </div>`;
            }
        }
    }
});