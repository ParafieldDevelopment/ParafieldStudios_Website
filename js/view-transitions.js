// View Transitions API Support
// Reduced to only support the native MPA navigation where available
// Manual body swapping removed as it breaks page-specific <head> content like CSS
document.addEventListener('DOMContentLoaded', () => {
    // We rely on the CSS rule:
    // @view-transition { navigation: auto; }
    // which handles full page transitions safely in modern browsers (Chrome 126+)
    
    console.log("View Transitions active via CSS navigation: auto");

    // Add manual scanline sweep for older browsers or enhanced feel
    const sweep = document.createElement('div');
    sweep.className = 'scanline-sweep';
    document.body.appendChild(sweep);

    document.querySelectorAll('a').forEach(link => {
        if (link.hostname === window.location.hostname && 
            !link.hash && 
            link.target !== '_blank' &&
            !link.href.includes('mailto:') &&
            !link.href.includes('tel:')) {
            link.addEventListener('click', e => {
                e.preventDefault();
                const target = link.href;

                sweep.classList.add('active');
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.4s ease';

                setTimeout(() => {
                    window.location.href = target;
                }, 400);
            });
        }
    });
});