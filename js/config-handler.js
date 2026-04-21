document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('config.json');
        const config = await response.json();

        // 1. Notice Bar
        const noticeBarData = config.noticeBar;
        if (noticeBarData && noticeBarData.enabled) {
            document.body.classList.add('has-notice-bar');
            const noticeBar = document.createElement('div');
            noticeBar.className = 'top-notice-bar';
            noticeBar.textContent = noticeBarData.text;
            document.body.prepend(noticeBar);
        }

        // 2. Secret Games
        const secretGamesData = config.secretGames;
        const secretGames = document.querySelectorAll('.showcase-static');
        if (secretGamesData && !secretGamesData.enabled) {
            secretGames.forEach(game => game.remove());
        }

        // Handle Maintenance Mode
        if (config.maintenanceMode) {
            // Optional: Redirect or show maintenance overlay
            console.log('Maintenance mode is active.');
        }

    } catch (e) {
        console.error('Config handler error:', e);
    }
});
