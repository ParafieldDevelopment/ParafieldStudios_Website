document.addEventListener('DOMContentLoaded', async () => {
    const progressList = document.getElementById('crt-progress-list');
    if (!progressList) return;

    try {
        const response = await fetch('progress.json');
        const data = await response.json();

        progressList.innerHTML = ''; // Clear existing

        data.projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'crt-project-card scroll-on-active';
            
            // Handle placeholders for missing images
            const imagePath = project.image || 'assets/404.png';
            
            card.innerHTML = `
                <div class="crt-project-img" style="background-image: url('${imagePath}')"></div>
                <div class="crt-project-info">
                    <h3>${project.name}</h3>
                    <div class="crt-status-row">
                        <span class="crt-status">${project.status}</span>
                        <span class="crt-percent">${project.progress}%</span>
                    </div>
                    <div class="crt-progress-track">
                        <div class="crt-progress-bar" style="width: ${project.progress}%"></div>
                    </div>
                </div>
            `;
            
            progressList.appendChild(card);
        });

    } catch (e) {
        console.error('Error loading progress:', e);
        progressList.innerHTML = '<p class="crt-status" style="color: red;">ERROR: DATA LINK SEVERED</p>';
    }
});
