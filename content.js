// YouTube Save to Menu Extender
// This content script ensures the CSS is applied to dynamically loaded content

(function() {
    'use strict';
    
    // The CSS is injected via the manifest.json, but we can also add a style element
    // to ensure it persists even if the page is dynamically updated
    const styleId = 'youtube-save-menu-extender-styles';
    
    // Default configuration values
    const DEFAULT_MENU_MAX_HEIGHT = '60vh';
    const DEFAULT_LIST_MAX_HEIGHT_OFFSET = '200px';
    
    // Function to apply styles with given values
    function applyStyles(menuMaxHeight, listMaxHeightOffset) {
        // #region agent log
        fetch('http://127.0.0.1:7248/ingest/13920c43-58a7-43e7-bb1d-1d3d08a61fb4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'content.js:16',message:'applyStyles called',data:{menuMaxHeight,listMaxHeightOffset},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            
            // Insert at the beginning of head to ensure it loads early
            if (document.head) {
                document.head.insertBefore(styleElement, document.head.firstChild);
            } else {
                // If head doesn't exist yet, wait for DOM
                document.addEventListener('DOMContentLoaded', function() {
                    document.head.insertBefore(styleElement, document.head.firstChild);
                });
            }
        }
        
        styleElement.textContent = `
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
        // #region agent log
        fetch('http://127.0.0.1:7248/ingest/13920c43-58a7-43e7-bb1d-1d3d08a61fb4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'content.js:47',message:'styles applied',data:{styleElementExists:!!styleElement},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
    }
    
    // Load initial values from storage
    chrome.storage.sync.get(['menuMaxHeight', 'listMaxHeightOffset'], function(result) {
        // #region agent log
        fetch('http://127.0.0.1:7248/ingest/13920c43-58a7-43e7-bb1d-1d3d08a61fb4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'content.js:51',message:'initial storage load',data:{result},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        const menuMaxHeight = result.menuMaxHeight || DEFAULT_MENU_MAX_HEIGHT;
        const listMaxHeightOffset = result.listMaxHeightOffset || DEFAULT_LIST_MAX_HEIGHT_OFFSET;
        applyStyles(menuMaxHeight, listMaxHeightOffset);
    });
    
    // Listen for messages from popup for real-time updates
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        // #region agent log
        fetch('http://127.0.0.1:7248/ingest/13920c43-58a7-43e7-bb1d-1d3d08a61fb4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'content.js:67',message:'message received',data:{action:request.action},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (request.action === 'updateStyles') {
            applyStyles(request.menuMaxHeight, request.listMaxHeightOffset);
            sendResponse({success: true});
        }
        return true; // Keep channel open for async response
    });
    
    // Listen for storage changes and update styles dynamically
    chrome.storage.onChanged.addListener(function(changes, areaName) {
        // #region agent log
        fetch('http://127.0.0.1:7248/ingest/13920c43-58a7-43e7-bb1d-1d3d08a61fb4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'content.js:58',message:'storage.onChanged event',data:{changes,areaName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        if (areaName === 'sync') {
            chrome.storage.sync.get(['menuMaxHeight', 'listMaxHeightOffset'], function(result) {
                const menuMaxHeight = result.menuMaxHeight || DEFAULT_MENU_MAX_HEIGHT;
                const listMaxHeightOffset = result.listMaxHeightOffset || DEFAULT_LIST_MAX_HEIGHT_OFFSET;
                applyStyles(menuMaxHeight, listMaxHeightOffset);
            });
        }
    });
    
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
