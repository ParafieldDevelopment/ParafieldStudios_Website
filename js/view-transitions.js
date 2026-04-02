// View Transitions API Support
// Reduced to only support the native MPA navigation where available
// Manual body swapping removed as it breaks page-specific <head> content like CSS
document.addEventListener('DOMContentLoaded', () => {
    // We rely on the CSS rule:
    // @view-transition { navigation: auto; }
    // which handles full page transitions safely in modern browsers (Chrome 126+)
    
    console.log("View Transitions active via CSS navigation: auto");
});