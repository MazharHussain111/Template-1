// ==========================================================================
// Theme Initialization (Prevents Flicker) - UPDATED
// ==========================================================================
(function() {
    // Set theme immediately to prevent flash - UPDATED: Light theme as default
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to light theme, only use dark if explicitly saved or system prefers dark AND no saved preference
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else if (!savedTheme && systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Add a class to indicate theme is loaded to prevent transitions during initial load
    document.documentElement.classList.add('theme-loaded');
})();