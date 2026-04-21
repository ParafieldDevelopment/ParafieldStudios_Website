document.addEventListener('DOMContentLoaded', async () => {
    const progressList = document.getElementById('progress-list');
    if (!progressList) return;

    try {
        const response = await fetch('progress.json');
        const data = await response.json();

        progressList.innerHTML = ''; 

        data.projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'dashboard-card scroll-on-active';
            
            const imagePath = project.image || 'assets/404.png';
            
            card.innerHTML = `
                <div class="dashboard-img" style="background-image: url('${imagePath}')"></div>
                <div class="dashboard-info">
                    <h3>${project.name}</h3>
                    <div class="dashboard-status-row">
                        <span class="dashboard-status">${project.status}</span>
                        <span class="dashboard-percent">${project.progress}%</span>
                    </div>
                    <div class="dashboard-progress-track">
                        <div class="dashboard-progress-bar" style="width: ${project.progress}%"></div>
                    </div>
                </div>
            `;
            
            progressList.appendChild(card);
        });

    } catch (e) {
        console.error('Error loading progress:', e);
        progressList.innerHTML = '<p style="text-align: center; color: #888; margin-top: 2rem;">Unable to load project data. Please try again later.</p>';
    }
});
