// YouTube Save to Menu Extender
// This content script ensures the CSS is applied to dynamically loaded content

(function() {
    'use strict';
    
    // The CSS is injected via the manifest.json, but we can also add a style element
    // to ensure it persists even if the page is dynamically updated
    const styleId = 'youtube-save-menu-extender-styles';
    
    // Configuration variables
    const menuMaxHeight = '70vh';
    const listMaxHeightOffset = '300px';
    
    // Check if styles are already injected
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            :root {
                --menu-max-height: ${menuMaxHeight};
                --list-max-height-offset: ${listMaxHeightOffset};
            }
            
            yt-sheet-view-model.ytSheetViewModelHost {
                max-height: var(--menu-max-height) !important;
            }
            
            yt-list-view-model.ytListViewModelHost {
                max-height: calc(var(--menu-max-height) - var(--list-max-height-offset)) !important;
            }
        `;
        
        // Insert at the beginning of head to ensure it loads early
        if (document.head) {
            document.head.insertBefore(style, document.head.firstChild);
        } else {
            // If head doesn't exist yet, wait for DOM
            document.addEventListener('DOMContentLoaded', function() {
                document.head.insertBefore(style, document.head.firstChild);
            });
        }
    }
    
    // Also observe for dynamically added elements (YouTube uses Shadow DOM and dynamic content)
    const observer = new MutationObserver(function(mutations) {
        // Re-apply styles if needed (though CSS should handle this)
        // This is mainly for ensuring the styles persist
    });
    
    // Start observing when DOM is ready
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
})();
