document.addEventListener('DOMContentLoaded', async () => {
    const progressContainer = document.getElementById('progress-list');
    if (!progressContainer) return;

    try {
        const response = await fetch('progress.json');
        const data = await response.json();

        progressContainer.innerHTML = ''; 

        const categories = [
            { id: 'Active', title: 'Active Projects' },
            { id: 'Paused', title: 'Paused Projects' },
            { id: 'Unfocused', title: 'Unfocused' }
        ];

        categories.forEach(cat => {
            const sectionHeader = document.createElement('h2');
            sectionHeader.className = 'category-title';
            sectionHeader.textContent = `> ${cat.title}`;
            progressContainer.appendChild(sectionHeader);

            const grid = document.createElement('div');
            grid.className = 'dashboard-grid';
            
            const catProjects = data.projects.filter(p => p.category === cat.id);

            if (catProjects.length === 0) {
                grid.innerHTML = '<p class="none-text">NONE</p>';
                grid.classList.add('empty-category');
            } else {
                catProjects.forEach(project => {
                    const card = document.createElement('div');
                    card.className = 'dashboard-card scroll-on-active';
                    
                    // Logic for placeholder vs project image
                    const hasImage = !!project.image;
                    const imagePath = project.image || 'assets/404.png';
                    const imageClass = hasImage ? 'dashboard-img' : 'dashboard-img is-placeholder';
                    
                    let barColorClass = 'bar-white';
                    if (project.category === 'Active' || project.category === 'Paused') {
                        barColorClass = 'bar-yellow';
                    }

                    const showProgress = !project.hideProgress;
                    
                    card.innerHTML = `
                        <div class="${imageClass}" style="background-image: url('${imagePath}')"></div>
                        <div class="dashboard-info">
                            <h3>${project.name}</h3>
                            <div class="dashboard-status-row">
                                <span class="dashboard-status">${project.status}</span>
                                ${showProgress ? `<span class="dashboard-percent">${project.progress}%</span>` : ''}
                            </div>
                            ${showProgress ? `
                            <div class="dashboard-progress-track">
                                <div class="dashboard-progress-bar ${barColorClass}" data-progress="${project.progress}" style="width: 0%"></div>
                            </div>
                            ` : ''}
                        </div>
                    `;
                    grid.appendChild(card);
                });
            }
            
            progressContainer.appendChild(grid);
        });

        setTimeout(() => {
            const bars = document.querySelectorAll('.dashboard-progress-bar');
            bars.forEach(bar => {
                const targetWidth = bar.getAttribute('data-progress');
                bar.getBoundingClientRect();
                bar.style.width = targetWidth + '%';
            });
        }, 100);

    } catch (e) {
        console.error('Error loading progress:', e);
        progressContainer.innerHTML = '<p style="text-align: center; color: white;">Unable to load project data.</p>';
    }
});
