# YouTube Save to Menu Extender

A simple Chrome extension that extends the YouTube "Save to..." playlist menu height to show more playlists without scrolling.

## What It Does

This extension increases the maximum height of YouTube's "Save to..." playlist menu from the default 383px to 80% of the viewport height (80vh). This allows you to see more playlists at once without having to scroll through the menu.

## Installation

### From Source (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the folder containing this extension
6. The extension should now be active on YouTube

## How It Works

The extension uses a content script that injects CSS into YouTube pages. It targets:

- `yt-sheet-view-model.ytSheetViewModelHost` - The main menu container
- `yt-list-view-model.ytListViewModelHost` - The playlist list container

The CSS overrides YouTube's inline styles using `!important` to ensure the new heights are applied. The menu height is set to 80vh (80% of viewport height), and the list container height is calculated as `calc(80vh - 200px)` to account for the header and footer elements.

## Technical Details

- **Manifest Version**: 3
- **Content Script**: Runs on all YouTube pages (`*://*.youtube.com/*`)
- **CSS Injection**: Both via manifest.json and dynamically via content script for reliability
- **Viewport-Based Sizing**: Uses `vh` units for responsive design across different screen sizes

## Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## License

This project is open source and available for personal use.
