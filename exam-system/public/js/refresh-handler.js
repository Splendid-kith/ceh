(function() {
    // 1. Refresh Handler: Redirect to home on reload (except for home and exam pages)
    let isReload = false;
    
    if (window.performance) {
        // Modern browsers
        if (typeof window.performance.getEntriesByType === "function") {
            const navEntries = window.performance.getEntriesByType("navigation");
            if (navEntries && navEntries.length > 0 && navEntries[0].type === "reload") {
                isReload = true;
            }
        } 
        
        // Older browsers (Safari, older IE/Edge)
        if (!isReload && window.performance.navigation) {
            if (window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD || window.performance.navigation.type === 1) {
                isReload = true;
            }
        }
    }

    if (isReload) {
        const path = window.location.pathname;
        if (path !== "/" && path !== "/index.html" && !path.includes("exam.html")) {
            window.location.href = "/";
            return;
        }
    }

    // 2. Navigation Restrictions
    function protectNavigation() {
        const path = window.location.pathname;

        if (!window.history || !window.history.pushState) return;

        // Immediately push an extra state to create a "trap"
        window.history.pushState(null, "", window.location.href);

        window.addEventListener("popstate", function(event) {
            // Disable forward button on EVERY page
            // and disable backward button specifically in ADMIN PANEL
            const is_admin = path.includes("admin.html");
            
            if (is_admin) {
                // If in admin, push again to stop back/forward completely
                window.history.pushState(null, "", window.location.href);
            } else {
                // For other pages, we force forward to prevent forward movement
                window.history.forward();
            }
        });

        // Loop to ensure the history stack stays "hot"
        if (path.includes("admin.html")) {
            let pushes = 0;
            const maxPushes = 50; // Safeguard for browsers that limit pushState
            
            const trapInterval = setInterval(() => {
                if (window.history.length < 5 || pushes < maxPushes) { 
                    try {
                        window.history.pushState(null, "", window.location.href);
                        pushes++;
                    } catch (e) {
                        clearInterval(trapInterval); // Stop on quota exceeded or security errors
                    }
                }
            }, 1000);
        }
    }

    // Initialize navigation protection
    protectNavigation();
})();
