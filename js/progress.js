/* ═══ PARAFIELD PROGRESS HANDLER ═══ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', async () => {
        const progressList = document.getElementById('progress-list');
        const updatesList = document.getElementById('updates-list');

        if (!progressList && !updatesList) return;

        // 1. LOAD PROJECTS
        try {
            const res = await fetch('progress.json');
            const data = await res.json();
            renderProjects(data.projects, progressList);
        } catch (e) {
            console.error('[PROGRESS] Failed to load projects:', e);
            if (progressList) progressList.innerHTML = '<div class="loading-hud error">[ ERROR: DATABASE_OFFLINE ]</div>';
        }

        // 2. LOAD UPDATES
        try {
            const res = await fetch('updates.json');
            const data = await res.json();
            renderUpdates(data.updates, updatesList);
        } catch (e) {
            console.error('[PROGRESS] Failed to load updates:', e);
            if (updatesList) updatesList.innerHTML = '<div class="loading-hud error">[ ERROR: LOGS_UNAVAILABLE ]</div>';
        }
    });

    function renderProjects(projects, container) {
        if (!container || !projects) return;
        container.innerHTML = '';

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            const statusClass = project.status.toLowerCase().replace(/\s+/g, '-');
            const showProgress = !project.hideProgress;

            card.innerHTML = `
                <div class="project-header">
                    <h3 class="project-title">${project.name}</h3>
                    <span class="project-status ${statusClass}">${project.status}</span>
                </div>
                <p class="project-description">${project.description || 'Accessing encrypted data...'}</p>
                ${showProgress ? `
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${project.progress}%;"></div>
                    <span class="progress-percentage">${project.progress}%</span>
                </div>
                ` : ''}
                <div class="project-details">
                    <span>CATEGORY: ${project.category.toUpperCase()}</span>
                    <span>ID: PS_PRJ_${Math.floor(Math.random() * 9000) + 1000}</span>
                </div>
            `;
            container.appendChild(card);
        });
        
        // Recalculate phases after dynamic content is added
        if (window.buildPhases) window.buildPhases();
    }

    function renderUpdates(updates, container) {
        if (!container || !updates) return;
        container.innerHTML = '';

        updates.forEach(update => {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `
                <div class="log-header">
                    <span class="log-date">[ ${update.date} ]</span>
                    <span class="log-tag">// ${update.tag}</span>
                </div>
                <h4 class="log-title">${update.title}</h4>
                <p class="log-body">${update.content}</p>
            `;
            container.appendChild(entry);
        });

        if (window.buildPhases) window.buildPhases();
    }

})();
