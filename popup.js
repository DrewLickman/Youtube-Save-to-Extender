// Popup script for YouTube Save to Menu Extender
// Handles slider interactions and saves to chrome.storage

(function() {
    'use strict';
    
    const DEFAULT_MENU_HEIGHT = 60;
    const DEFAULT_OFFSET = 200;
    
    const menuHeightSlider = document.getElementById('menuHeight');
    const menuHeightValue = document.getElementById('menuHeightValue');
    const offsetSlider = document.getElementById('offset');
    const offsetValue = document.getElementById('offsetValue');
    
    // Load saved values from storage
    function loadSettings() {
        chrome.storage.sync.get(['menuMaxHeight', 'listMaxHeightOffset'], function(result) {
            let menuHeight = DEFAULT_MENU_HEIGHT;
            let offset = DEFAULT_OFFSET;
            
            if (result.menuMaxHeight) {
                // Extract numeric value from "60vh"
                const match = result.menuMaxHeight.match(/(\d+)/);
                if (match) {
                    menuHeight = parseInt(match[1], 10);
                }
            }
            
            if (result.listMaxHeightOffset) {
                // Extract numeric value from "200px"
                const match = result.listMaxHeightOffset.match(/(\d+)/);
                if (match) {
                    offset = parseInt(match[1], 10);
                }
            }
            
            // Update UI
            menuHeightSlider.value = menuHeight;
            menuHeightValue.textContent = menuHeight + 'vh';
            
            offsetSlider.value = offset;
            offsetValue.textContent = offset + 'px';
        });
    }
    
    // Debounce timer for storage saves
    let saveTimeout = null;
    const DEBOUNCE_DELAY = 300; // milliseconds
    
    // Throttle timer for real-time updates
    let updateTimeout = null;
    const THROTTLE_DELAY = 50; // milliseconds - update CSS every 50ms max
    
    // Send real-time update to content script (throttled)
    function sendRealtimeUpdate(menuHeight, offset) {
        // Clear existing timeout
        if (updateTimeout) {
            return; // Already scheduled
        }
        
        // Schedule update
        updateTimeout = setTimeout(function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateStyles',
                        menuMaxHeight: menuHeight + 'vh',
                        listMaxHeightOffset: offset + 'px'
                    }).catch(function() {
                        // Ignore errors (content script might not be ready)
                    });
                }
            });
            updateTimeout = null;
        }, THROTTLE_DELAY);
    }
    
    // Save settings to storage (debounced)
    function saveSettings(menuHeight, offset) {
        // #region agent log
        fetch('http://127.0.0.1:7248/ingest/13920c43-58a7-43e7-bb1d-1d3d08a61fb4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'popup.js:47',message:'saveSettings called',data:{menuHeight,offset},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Send real-time update immediately (throttled)
        sendRealtimeUpdate(menuHeight, offset);
        
        // Clear existing timeout
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        
        // Set new timeout to save after user stops dragging
        saveTimeout = setTimeout(function() {
            chrome.storage.sync.set({
                menuMaxHeight: menuHeight + 'vh',
                listMaxHeightOffset: offset + 'px'
            }, function() {
                // #region agent log
                fetch('http://127.0.0.1:7248/ingest/13920c43-58a7-43e7-bb1d-1d3d08a61fb4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'popup.js:52',message:'storage.set callback',data:{error:chrome.runtime.lastError?chrome.runtime.lastError.message:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                // #endregion
                if (chrome.runtime.lastError) {
                    console.error('Error saving settings:', chrome.runtime.lastError);
                }
            });
            saveTimeout = null;
        }, DEBOUNCE_DELAY);
    }
    
    // Update menu height
    menuHeightSlider.addEventListener('input', function() {
        // #region agent log
        fetch('http://127.0.0.1:7248/ingest/13920c43-58a7-43e7-bb1d-1d3d08a61fb4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'popup.js:59',message:'menuHeight input event',data:{value:this.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        const value = parseInt(this.value, 10);
        menuHeightValue.textContent = value + 'vh';
        saveSettings(value, parseInt(offsetSlider.value, 10));
    });
    
    // Update offset
    offsetSlider.addEventListener('input', function() {
        // #region agent log
        fetch('http://127.0.0.1:7248/ingest/13920c43-58a7-43e7-bb1d-1d3d08a61fb4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'popup.js:66',message:'offset input event',data:{value:this.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        const value = parseInt(this.value, 10);
        offsetValue.textContent = value + 'px';
        saveSettings(parseInt(menuHeightSlider.value, 10), value);
    });
    
    // Load settings when popup opens
    loadSettings();
})();
