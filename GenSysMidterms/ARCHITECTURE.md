# Color Picker Application - Architecture Documentation

## Overview

This is a modular multi-mode color picker application with a report generation feature. The application allows users to interactively adjust colors and generate comprehensive reports including color format conversions, audio synthesis, and AI-generated poetry.

## Directory Structure

```
GenSysMidterms/
├── index.html                  # Main color picker editor
├── report.html                 # Color palette report page
├── css/
│   ├── styles.css             # Main editor styles
│   └── report/
│       └── styles.css         # Report page styles
└── js/
    ├── config/
    │   └── apiConfig.js       # API configuration (Claude API)
    ├── shared/
    │   └── colorConversions.js # Shared color conversion utilities
    ├── report/
    │   ├── reportMain.js      # Report page orchestrator
    │   ├── colorDisplay.js    # Color swatch display
    │   ├── audioSynthesis.js  # Web Audio API integration
    │   └── poetryGenerator.js # AI poetry generation
    └── [main editor modules]
        ├── backgroundController.js
        ├── circleController.js
        ├── reportGenerator.js
        └── main.js
```

## Module Responsibilities

### Shared Modules

#### `js/shared/colorConversions.js`
- **Purpose**: Provides color conversion utilities used across the application
- **Exports**:
  - `rgbToHex(r, g, b)` - Convert RGB to hexadecimal
  - `rgbToHsv(r, g, b)` - Convert RGB to HSV color space
  - `rgbToCmyk(r, g, b)` - Convert RGB to CMYK color space
- **Used by**: Main editor, Report page

#### `js/config/apiConfig.js`
- **Purpose**: Centralized API configuration management
- **Exports**:
  - `getClaudeConfig()` - Returns Claude API configuration
  - `setClaudeApiKey(key)` - Stores API key in localStorage
- **Security**: API key stored in localStorage (development only)

### Report Page Modules

#### `js/report/reportMain.js`
- **Purpose**: Main orchestrator for the report page
- **Responsibilities**:
  - Retrieves color data from localStorage
  - Coordinates display, audio, and poetry generation
  - Handles initialization and error cases
- **Dependencies**: colorDisplay, audioSynthesis, poetryGenerator

#### `js/report/colorDisplay.js`
- **Purpose**: Renders color swatches with format information
- **Exports**:
  - `displayColorSwatches(colorData)` - Displays 4 color swatches
- **Features**: Shows HEX, RGB, HSV, and CMYK values for each color
- **Dependencies**: shared/colorConversions

#### `js/report/audioSynthesis.js`
- **Purpose**: Converts colors to musical tones
- **Exports**:
  - `playColorChord(colors)` - Plays harmonic chord from color palette
- **Algorithm**:
  - Maps hue (0-360°) to frequency (200-800 Hz)
  - Maps brightness to volume (0.1-0.3 gain)
  - Uses Web Audio API with sine wave oscillators
- **Dependencies**: shared/colorConversions

#### `js/report/poetryGenerator.js`
- **Purpose**: Generates AI-powered poetic interpretations
- **Exports**:
  - `generatePoetry(colorData)` - Creates concrete poetry from colors
- **Features**:
  - Uses Claude 3.5 Sonnet API
  - Generates experimental concrete poetry
  - Handles API errors gracefully
- **Dependencies**: shared/colorConversions, config/apiConfig

## Data Flow

### Main Editor to Report Page

```
1. User adjusts colors in main editor
   ├─> backgroundController.js (stores background RGB)
   └─> circleController.js (stores 3 circle RGBs)

2. User clicks "Generate Report"
   └─> reportGenerator.js
       ├─> Gathers color data from controllers
       ├─> Stores in localStorage as 'colorPalette'
       └─> Navigates to report.html

3. Report page loads
   └─> reportMain.js (DOMContentLoaded)
       ├─> Retrieves 'colorPalette' from localStorage
       ├─> displayColorSwatches(colorData)
       ├─> playColorChord(colorArray)
       └─> generatePoetry(colorData)
```

### localStorage Schema

```javascript
{
  "colorPalette": {
    "background": { "r": 255, "g": 249, "b": 237 },
    "circle1": { "r": 108, "g": 150, "b": 174 },
    "circle2": { "r": 156, "g": 116, "b": 129 },
    "circle3": { "r": 231, "g": 214, "b": 170 }
  },
  "CLAUDE_API_KEY": "sk-ant-api03-..." // Development only
}
```

## Module Loading

The application uses **ES6 modules** with `import`/`export` syntax:

```html
<!-- report.html -->
<script type="module" src="js/report/reportMain.js"></script>
```

### Benefits:
- Explicit dependency management
- Namespace isolation
- Better code organization
- Tree-shaking support

## API Configuration

### Security Best Practices

**Current Setup (Development):**
- API key stored in localStorage
- Retrieved via `getClaudeConfig()`
- Warning logged if key not found

**To set your API key:**
```javascript
localStorage.setItem('CLAUDE_API_KEY', 'your-key-here');
```

**Production Recommendations:**
1. Move API calls to backend service
2. Use environment variables
3. Implement rate limiting
4. Add authentication/authorization
5. Never commit API keys to version control

## Color Formats Supported

| Format | Example | Use Case |
|--------|---------|----------|
| HEX | `#FF5733` | Web design, CSS |
| RGB | `RGB: 255, 87, 51` | Digital displays |
| HSV | `HSV: 9°, 80%, 100%` | Color pickers, artistic tools |
| CMYK | `CMYK: 0%, 66%, 80%, 0%` | Print design |

## External Dependencies

1. **Web Audio API** (Browser built-in)
   - Used for audio synthesis
   - No external library required

2. **Claude API** (Anthropic)
   - Model: `claude-3-5-sonnet-20241022`
   - Endpoint: `https://api.anthropic.com/v1/messages`
   - Purpose: AI poetry generation

## Testing the Application

1. **Start a local server:**
   ```bash
   python -m http.server 8000
   # or
   npx http-server
   ```

2. **Configure API key:**
   ```javascript
   // In browser console
   localStorage.setItem('CLAUDE_API_KEY', 'your-key-here');
   ```

3. **Test workflow:**
   - Open main editor (index.html)
   - Adjust color sliders
   - Click "Generate Report"
   - Verify color display, audio playback, and poetry generation

## Migration Notes

### Changes from Original Architecture

**Before:**
- Single monolithic `report.js` (238 lines)
- Hardcoded API key in source code
- No code reuse between pages
- No module boundaries

**After:**
- 7 specialized modules with clear responsibilities
- Secure API key management via config
- Shared utilities module for color conversions
- Clear separation of concerns

### Breaking Changes

- API key must be set in localStorage
- Module paths updated in report.html
- CSS path changed to `css/report/styles.css`

### Backward Compatibility

- Color data format unchanged
- localStorage key names unchanged
- Report HTML structure unchanged
- All features preserved

## Future Enhancements

1. **Backend Integration**
   - Move API calls to server-side
   - Add user authentication
   - Implement palette saving/sharing

2. **Additional Features**
   - Export report as PDF
   - Social sharing
   - Palette history
   - Color harmony suggestions

3. **Performance**
   - Implement service worker for offline support
   - Add loading states
   - Optimize audio synthesis

4. **Accessibility**
   - Add ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Color contrast checks

## Troubleshooting

### Poetry Generation Fails

**Problem**: "Unable to generate poetic interpretation"

**Solutions**:
1. Check API key is set: `localStorage.getItem('CLAUDE_API_KEY')`
2. Verify network connection
3. Check browser console for specific errors
4. Ensure API key has valid permissions

### Audio Not Playing

**Problem**: No sound when report loads

**Solutions**:
1. Check browser audio permissions
2. Ensure volume is not muted
3. Try user-initiated audio (click button)
4. Check browser Web Audio API support

### Colors Not Displaying

**Problem**: Swatches are empty or incorrect

**Solutions**:
1. Verify localStorage has 'colorPalette' key
2. Check JSON format is correct
3. Clear cache and reload
4. Test with fresh color data from editor

## Contributing

When adding new features:
1. Create modules in appropriate directory
2. Use ES6 import/export syntax
3. Document dependencies clearly
4. Update this ARCHITECTURE.md
5. Add JSDoc comments to functions
6. Test with local server

## License

[Add your license information here]
