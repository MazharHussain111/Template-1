// ==========================================================================
// Theme Initialization (Prevents Flicker) - UPDATED
// ==========================================================================
(function() {
    'use strict';
    
    // Set theme immediately to prevent flash - Light theme as default
    const savedTheme = localStorage.getItem('theme');
    
    // Default to light theme, only use dark if explicitly saved as 'dark'
    const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    document.documentElement.classList.add('theme-loaded');
})();