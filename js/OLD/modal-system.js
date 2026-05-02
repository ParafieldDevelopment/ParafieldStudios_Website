/**
 * Unified Technical Modal System (Parafield_OS)
 * Handles high-tech dark modals for Team, Careers, and Projects.
 */

function openTechnicalModal(modalId, data) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Fill data
    if (data.name) {
        const nameEl = modal.querySelector('[id$="-name"]');
        if (nameEl) nameEl.innerText = data.name;
    }
    
    if (data.role) {
        const roleEl = modal.querySelector('[id$="-role"]');
        if (roleEl) roleEl.innerText = data.role;
    }
    
    if (data.description) {
        const descEl = modal.querySelector('[id$="-description"]') || modal.querySelector('[id$="-desc"]');
        if (descEl) descEl.innerHTML = data.description;
    }
    
    if (data.image) {
        const imgPlaceholder = modal.querySelector('.modal-image-placeholder') || modal.querySelector('.workstation-modal-left');
        if (imgPlaceholder) {
            const img = imgPlaceholder.querySelector('img');
            if (img) {
                img.src = data.image;
                img.classList.remove('is-placeholder');
            } else {
                imgPlaceholder.style.backgroundImage = `url('${data.image}')`;
            }
        }
    }

    // Handle Buttons (for Team/Career)
    const buttonContainer = modal.querySelector('.modal-buttons') || modal.querySelector('.career-modal-buttons');
    if (buttonContainer && data.buttons) {
        buttonContainer.innerHTML = '';
        data.buttons.forEach(btn => {
            const a = document.createElement('a');
            a.className = btn.className || 'modal-btn primary';
            a.innerText = btn.text;
            if (btn.onclick) {
                a.setAttribute('onclick', btn.onclick);
            } else if (btn.href) {
                a.href = btn.href;
                a.target = '_blank';
            }
            buttonContainer.appendChild(a);
        });
    }

    // Show Modal
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Dispatch event for any specific page logic (like scanlines)
    window.dispatchEvent(new CustomEvent('technicalModalOpened', { detail: { modalId, data } }));
}

function closeTechnicalModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Global setup for close buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.close-modal, .close-workstation-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal') || btn.closest('.workstation-modal');
            if (modal) closeTechnicalModal(modal.id);
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('workstation-modal')) {
            closeTechnicalModal(e.target.id);
        }
    });
});
