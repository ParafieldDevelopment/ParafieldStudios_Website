document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the index.html page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const banner = document.querySelector('.banner');
        const bannerText = document.querySelector('.banner-text');
        const bannerImg = document.querySelector('.banner img');

        if (!banner || !bannerText || !bannerImg) return;

        const names = ["Parafield Studios", "Moonlight", "CC", "iSounds", "Careers"];
        const selectedName = names[Math.floor(Math.random() * names.length)];

        if (selectedName === "Parafield Studios") {
            const h1s = bannerText.querySelectorAll('h1');
            if (h1s.length >= 2) {
                h1s[0].textContent = "PARAFIELD";
                h1s[1].textContent = "STUDIOS";
            }
        } else {
            // Shared Theme Setup (Moonlight & CC)
            banner.classList.add('moonlight-theme');
            banner.style.backgroundSize = "cover";
            banner.style.backgroundPosition = "center";
            banner.style.backgroundColor = "#1a1a1a";
            banner.style.gap = "50px";

            if (selectedName === "CC") {
                banner.classList.add('cc-theme');
            } else if (selectedName === "iSounds") {
                banner.classList.add('isounds-theme');
            } else if (selectedName === "Careers") {
                banner.classList.add('careers-theme');
            }

            // Inject custom styles for themes
            const style = document.createElement('style');
            style.innerHTML = `
                @font-face {
                    font-family: 'BobloxClassic';
                    src: url('assets/CC/fonts/BobloxClassic-nRjl4.ttf') format('truetype');
                }
                .moonlight-theme > img {
                    height: 50vh !important;
                    width: auto !important;
                    max-width: 45vw !important;
                    object-fit: cover !important;
                    border-radius: 12px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    filter: none !important;
                    transform: translateY(50px) !important; /* Slide up animation start */
                    opacity: 0;
                    transition: transform 1s ease, opacity 1s ease !important;
                }
                .moonlight-theme.cc-theme > img {
                    height: 25vh !important; /* Smaller logo */
                    object-fit: contain !important;
                    box-shadow: none !important;
                    border-radius: 0 !important;
                }
                .moonlight-theme > img.scroll-on-active {
                    transform: translateY(0) !important;
                    opacity: 1;
                }
                .moonlight-theme .banner-text {
                    align-items: flex-start !important;
                    text-align: left !important;
                }
                /* CC Theme Layout */
                .moonlight-theme.cc-theme {
                    justify-content: space-between !important;
                    padding-left: 5vw;
                    padding-right: 5vw;
                    position: relative; /* For vignette overlay */
                }
                /* Vignette Effect */
                .moonlight-theme.cc-theme::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%);
                    pointer-events: none; /* Allow clicks through */
                    z-index: 1;
                }
                /* Ensure content is above vignette */
                .moonlight-theme.cc-theme > * {
                    z-index: 2;
                }
                
                .moonlight-theme.cc-theme .banner-text {
                    align-items: flex-end !important;
                    text-align: right !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                }
                .moonlight-theme.cc-theme .banner-text h3 {
                    font-family: 'BobloxClassic', sans-serif !important;
                }

                /* iSounds Theme */
                .isounds-theme {
                    background-color: #000000;
                    position: relative;
                    overflow: hidden;
                    justify-content: center !important;
                }

                /* Animated Blobs */
                .isounds-theme::before {
                    content: '';
                    position: absolute;
                    top: -20%;
                    left: -10%;
                    width: 60vw;
                    height: 60vw;
                    background: radial-gradient(circle, rgba(255, 115, 0, 0.3), transparent 70%);
                    filter: blur(80px);
                    animation: floatBlob1 15s infinite alternate ease-in-out;
                    z-index: 0;
                    pointer-events: none;
                }
                
                .isounds-theme::after {
                    content: '';
                    position: absolute;
                    bottom: -20%;
                    right: -10%;
                    width: 60vw;
                    height: 60vw;
                    background: radial-gradient(circle, rgba(0, 255, 255, 0.3), transparent 70%);
                    filter: blur(80px);
                    animation: floatBlob2 15s infinite alternate ease-in-out;
                    z-index: 0;
                    pointer-events: none;
                }
                
                @keyframes floatBlob1 {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(50px, 50px) scale(1.1); }
                }
                
                @keyframes floatBlob2 {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(-50px, -50px) scale(1.1); }
                }

                .isounds-theme .banner-text {
                    align-items: center !important;
                    text-align: center !important;
                    z-index: 1;
                    position: relative;
                }

                .isounds-btn {
                    display: inline-block;
                    margin-top: 30px;
                    padding: 12px 35px;
                    background-color: white;
                    color: black;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: 800;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
                }
                
                .isounds-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
                    background-color: #f8f8f8;
                }

                .careers-theme {
                    justify-content: center !important;
                    align-items: center !important;
                    position: relative;
                    overflow: hidden;
                }

                .careers-ad-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .careers-logo-animated {
                    height: 250px;
                    filter: brightness(0) invert(1);
                    animation: roll-and-bounce 2s ease-out forwards;
                    z-index: 2;
                }

                .careers-finger-animated {
                    position: absolute;
                    height: 300px;
                    z-index: 1;
                    animation: point-and-jiggle 3s ease-out 1.5s forwards;
                    opacity: 0;
                }
                
                .careers-text-animated {
                    position: absolute;
                    z-index: 3;
                    text-align: center;
                    opacity: 0;
                    animation: fadeInText 1s ease-out 2.5s forwards;
                }
                
                .careers-text-animated h1 {
                    font-size: 4rem;
                    color: white;
                    text-shadow: 2px 2px 10px rgba(0,0,0,0.7);
                    font-weight: 900;
                    margin: 0;
                }
                
                .careers-text-animated p {
                    font-size: 1.2rem;
                    color: #ccc;
                    margin-top: 5px;
                }

                .careers-btn {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 30px;
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: 700;
                    transition: all 0.3s ease;
                }

                @keyframes roll-and-bounce {
                    0% { transform: translateX(-150vw) rotate(-720deg); opacity: 0; }
                    60% { transform: translateX(0) rotate(0deg); opacity: 1; }
                    75% { transform: translateY(-30px); }
                    90% { transform: translateY(10px); }
                    100% { transform: translateY(0); }
                }

                @keyframes point-and-jiggle {
                    0% { opacity: 0; transform: scale(0.5) translateY(50px); }
                    70% { opacity: 1; transform: scale(1) translateY(0); }
                    80% { transform: rotate(-5deg); }
                    90% { transform: rotate(5deg); }
                    100% { transform: rotate(0deg); }
                }

                @keyframes fadeInText {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* Mobile Responsive Styles for Ads */
                @media (max-width: 768px) {
                    .moonlight-theme {
                        flex-direction: column !important;
                        justify-content: center !important;
                        text-align: center !important;
                        padding: 2rem !important;
                    }
                    .moonlight-theme > img {
                        height: 20vh !important;
                        max-width: 80vw !important;
                        margin-bottom: 20px !important;
                    }
                    .moonlight-theme .banner-text {
                        align-items: center !important;
                        text-align: center !important;
                        margin: 0 !important;
                        width: 100%;
                    }
                    
                    /* Moonlight Specific Mobile Fixes */
                    .moonlight-theme h1 {
                        font-size: 3rem !important; /* Reduce font size */
                    }
                    .moonlight-theme .banner-text > div {
                        flex-direction: column !important; /* Stack logo and text */
                        gap: 5px !important;
                    }
                    
                    /* CC Theme Mobile Specifics */
                    .moonlight-theme.cc-theme {
                        padding-left: 2rem !important;
                        padding-right: 2rem !important;
                        justify-content: center !important;
                    }
                    .moonlight-theme.cc-theme .banner-text {
                        align-items: center !important;
                        text-align: center !important;
                    }
                    .moonlight-theme.cc-theme h3 {
                        font-size: 2.5rem !important; /* Smaller font for mobile */
                        -webkit-text-stroke: 2px #3f002e !important; /* Thinner stroke */
                    }
                }
            `;
            document.head.appendChild(style);

            if (selectedName === "Moonlight") {
                banner.style.backgroundImage = "url('assets/Moonlight/backgroundwithstuff.png')";
                bannerImg.src = "assets/Moonlight/window.png";

                // Update Text
                bannerText.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 15px;">
                        <img src="assets/Moonlight/transparent.png" style="height: 80px !important; width: auto !important; box-shadow: none; border-radius: 0; transform: none !important; opacity: 1 !important; margin: 0;">
                        <h1 style="font-size: 5rem; margin: 0; line-height: 1; text-shadow: 0 4px 10px rgba(0,0,0,0.3);">Moonlight</h1>
                    </div>
                    <h3 style="font-size: 2rem; color: white; margin: 0; font-weight: 600; letter-spacing: 1px;">An advanced Roblox IDE</h3>
                    <p style="font-size: 1.2rem; color: #ddd; margin-top: 15px; font-style: italic; font-weight: 500;">Coming soon.. Eventually</p>
                `;
            } else if (selectedName === "CC") {
                banner.style.backgroundImage = "url('assets/CC/BetterGameBackground.png')";
                bannerImg.src = "assets/CC/CCSwords.png";

                // Random Text Logic
                const randomChance = Math.random();
                let titleText = "3 Items...";
                let titleText2 = "2 Abilities...";

                let subText = "Coming soon... Eventually";

                if (randomChance < 0.1) { // 10% chance
                    titleText = "Too many bots in TF2 casual?";
                    titleText2 = ""; // Clear second line if using alternate text
                    subText = "Try our fighting game instead, that's on the hated platform roblox!";
                }


                
                let htmlContent = '';
                if (titleText2) {
                     htmlContent = `
                        <h3 style="font-size: 4rem; color: #ff749f; margin: 0; font-weight: 600; letter-spacing: 1px; -webkit-text-stroke: 4px #3f002e;">${titleText}</h3>
                        <h3 style="font-size: 4rem; color: #ff749f; margin: 0; font-weight: 600; letter-spacing: 1px; -webkit-text-stroke: 4px #3f002e;">${titleText2}</h3>
                    `;
                } else {
                     // Alternate text case (Easter egg)
                     htmlContent = `
                        <h3 style="font-size: 3rem; color: #ff749f; margin: 0; font-weight: 600; letter-spacing: 1px; -webkit-text-stroke: 2px #3f002e;">${titleText}</h3>
                    `;
                }

                bannerText.innerHTML = `
                    ${htmlContent}
                    <p style="font-size: 1.2rem; color: #ddd; margin-top: 15px; font-style: italic; font-weight: 500;">${subText}</p>
                `;
            } else if (selectedName === "iSounds") {
                bannerImg.style.display = 'none';

                bannerText.innerHTML = `
                    <h1 style="font-size: 6rem; margin: 0; line-height: 1; text-shadow: 0 0 30px rgba(255, 115, 0, 0.4); color: #ff7300; font-weight: 900; letter-spacing: -2px;">iSounds</h1>
                    <h3 style="font-size: 2.5rem; color: white; margin: 15px 0; font-weight: 700; letter-spacing: 0.5px;">Listen to the World.</h3>
                    <p style="font-size: 1.3rem; color: #ccc; margin-top: 10px; font-weight: 400; max-width: 600px; line-height: 1.6;">Stream thousands of internet radio stations and podcasts in one place.</p>
                    <a href="https://sounds.parafieldstudios.com" class="isounds-btn">Start Listening</a>
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
            }
        }
    }
});