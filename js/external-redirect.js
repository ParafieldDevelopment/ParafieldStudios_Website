(function() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || !link.href) return;

        try {
            const url = new URL(link.href);
            const host = url.hostname.toLowerCase();
            
            // Internal domains list
            const internalDomains = [
                'parafieldstudios.com'
            ];

            // Check if it's an internal link
            const isInternal = internalDomains.some(domain => 
                host === domain || host.endsWith('.' + domain)
            ) || host === window.location.hostname.toLowerCase() || host === '';

            // Also ignore relative links, anchors, and javascript
            const href = link.getAttribute('href');
            if (!href) return;
            
            const isAnchor = href.startsWith('#');
            const isJavascript = href.startsWith('javascript:');
            const isRelative = !href.includes('://') && !href.startsWith('//');

            if (!isInternal && !isAnchor && !isJavascript && !isRelative) {
                // It's an external link!
                e.preventDefault();
                
                // Construct the redirect URL
                // We use a relative path to redirect.html to ensure it works from any directory
                // (assuming redirect.html is in the root)
                const rootPath = window.location.origin;
                const redirectPage = '/redirect.html';
                window.location.href = `${redirectPage}?url=${encodeURIComponent(link.href)}`;
            }
        } catch (err) {
            // If URL parsing fails, it's likely a relative or invalid link, let it be.
            console.error('Redirect check failed:', err);
        }
    });
})();