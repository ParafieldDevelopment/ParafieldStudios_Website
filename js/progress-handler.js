document.addEventListener('DOMContentLoaded', async () => {
    const progressContainer = document.getElementById('progress-list');
    const updatesContainer = document.getElementById('updates-list');
    const modal = document.getElementById('project-modal');
    const modalLogsContainer = document.getElementById('modal-logs-container');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabSubtitle = document.getElementById('tab-subtitle');

    if (!progressContainer || !modal) return;

    // Modal elements
    const mImg = document.getElementById('modal-project-img');
    const mName = document.getElementById('modal-project-name');
    const mStatus = document.getElementById('modal-project-status');
    const mPercent = document.getElementById('modal-project-percent');
    const mDesc = document.getElementById('modal-project-desc');
    const closeBtn = document.querySelector('.close-workstation-modal');

    let allUpdates = [];

    // Tab Switching Logic
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            if (tabId === 'progress-list') {
                tabSubtitle.textContent = "Real-time status of our creative laboratory.";
            } else {
                tabSubtitle.textContent = "Latest system transmissions and terminal logs.";
            }
        });
    });

    const renderLogs = (container, filterTag = null) => {
        container.innerHTML = '';
        const filtered = filterTag 
            ? allUpdates.filter(u => u.tag === filterTag)
            : allUpdates.filter(u => u.tag === 'GLOBAL' || u.tag === 'GENERAL UPDATE');

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="modal-logs-placeholder">
                    <p class="none-text" style="font-size: 0.9rem; border: none; padding: 0;">No updates found</p>
                </div>`;
            return;
        }

        filtered.forEach(update => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.innerHTML = `
                <div class="log-header">
                    <span class="log-date">[ ${update.date} ]</span>
                    <span class="log-title">${update.title}</span>
                </div>
                <p class="log-body">${update.content}</p>
            `;
            container.appendChild(logEntry);
        });
    };

    try {
        // Fetch Updates First
        const updatesRes = await fetch('updates.json');
        const updatesData = await updatesRes.json();
        allUpdates = updatesData.updates;

        // Render Global Updates Tab
        renderLogs(updatesContainer);

        // Fetch Projects
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
                    card.style.cursor = 'pointer';
                    
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

                    // Modal Click Logic
                    card.addEventListener('click', () => {
                        mImg.src = imagePath;
                        mImg.className = hasImage ? '' : 'is-placeholder';
                        mName.textContent = `> ${project.name}`;
                        mStatus.textContent = project.status;
                        mPercent.textContent = project.progress + '%';
                        mDesc.textContent = project.description || 'ACCESSING DATA...';
                        
                        // Load project specific logs
                        renderLogs(modalLogsContainer, project.name);

                        modal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    });

                    grid.appendChild(card);
                });
            }
            
            progressContainer.appendChild(grid);
        });

        // Close Modal Logic
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
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
