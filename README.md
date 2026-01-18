# YouTube Save to Menu Extender

A simple Chrome extension that extends the YouTube "Save to..." playlist menu height to show more playlists without scrolling.

## What It Does

This extension increases the maximum height of YouTube's "Save to..." playlist menu, allowing you to see more playlists at once without having to scroll through the menu. The menu height is configurable via variables in the code.

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

The CSS overrides YouTube's inline styles using `!important` to ensure the new heights are applied. The extension uses CSS custom properties (variables) for easy customization.

## Configuration

The menu height can be customized using the extension popup (click the extension icon) or by editing the configuration variables in `content.js`:

```javascript
const menuMaxHeight = '60vh';
const listMaxHeightOffset = '200px';
```

- `menuMaxHeight`: Maximum height of the main menu container (default: `60vh`, range: 30vh - 100vh)
- `listMaxHeightOffset`: Offset subtracted from menu height for the playlist list (default: `200px`, range: 200px - 500px)
  - **Note**: Minimum offset is 200px to prevent cutting off the "New playlist" button

The playlist list height is automatically calculated as `calc(menuMaxHeight - listMaxHeightOffset)`.

### Using the Popup Interface

Click the extension icon in your browser toolbar to open the popup with sliders:
- Adjust the **Menu Height** slider to change the maximum height (30vh - 100vh)
- Adjust the **Offset** slider to change the offset (200px - 500px)
- Changes apply in real-time as you drag the sliders
- Settings are automatically saved and persist across browser sessions

## Technical Details

- **Manifest Version**: 3
- **Content Script**: Runs on all YouTube pages (`*://*.youtube.com/*`)
- **CSS Injection**: Both via manifest.json and dynamically via content script for reliability
- **Variable-Based Configuration**: Uses CSS custom properties defined in JavaScript for easy customization
- **Viewport-Based Sizing**: Uses `vh` units for responsive design across different screen sizes
- **Dynamic Content Support**: Includes MutationObserver to handle YouTube's dynamically loaded content

## File Structure

- `manifest.json` - Extension manifest and configuration
- `content.js` - Content script that injects styles and handles dynamic content
- `styles.css` - CSS styles that reference the injected CSS variables

## Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## License

This project is open source and available for personal use.
