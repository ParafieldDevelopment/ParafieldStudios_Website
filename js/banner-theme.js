document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the index.html page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const banner = document.querySelector('.banner');
        const bannerText = document.querySelector('.banner-text');
        const bannerImg = document.querySelector('.banner img');

        if (!banner || !bannerText || !bannerImg) return;

        const names = ["aprilfool"]; // "Parafield Studios", "Moonlight", "CC", "Careers"
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

            if (selectedName === "Moonlight") {
                banner.style.backgroundImage = "url('assets/Moonlight/backgroundwithstuff.png')";
                bannerImg.src = "assets/Moonlight/window.png";

                // Update Text
                bannerText.innerHTML = `
                    <div class="moonlight-text-header">
                        <img src="assets/Moonlight/transparent.png" class="moonlight-logo-small">
                        <h1 class="moonlight-title">Moonlight</h1>
                    </div>
                    <h3 class="moonlight-subtitle">An advanced Roblox IDE</h3>
                    <p class="theme-coming-soon">Coming soon.. Eventually</p>
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
                        <h3 class="cc-title">${titleText}</h3>
                        <h3 class="cc-title">${titleText2}</h3>
                    `;
                } else {
                     // Alternate text case (Easter egg)
                     htmlContent = `
                        <h3 class="cc-title-alt">${titleText}</h3>
                    `;
                }

                bannerText.innerHTML = `
                    ${htmlContent}
                    <p class="theme-coming-soon">${subText}</p>
                `;
            // } else if (selectedName === "iSounds") {
            //     bannerImg.style.display = 'none';
            //
            //     bannerText.innerHTML = `
            //         <h1 style="font-size: 6rem; margin: 0; line-height: 1; text-shadow: 0 0 30px rgba(255, 115, 0, 0.4); color: #ff7300; font-weight: 900; letter-spacing: -2px;">iSounds</h1>
            //         <h3 style="font-size: 2.5rem; color: white; margin: 15px 0; font-weight: 700; letter-spacing: 0.5px;">Listen to the World.</h3>
            //         <p style="font-size: 1.3rem; color: #ccc; margin-top: 10px; font-weight: 400; max-width: 600px; line-height: 1.6;">Stream thousands of internet radio stations and podcasts in one place.</p>
            //         <a href="https://sounds.parafieldstudios.com" class="isounds-btn">Start Listening</a>
            //     `;
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