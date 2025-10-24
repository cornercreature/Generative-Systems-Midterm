# API Key Setup Instructions

## How to Set Your Claude API Key (Safely)

Your API key is **NOT** stored in the code files. Instead, it's stored in your browser's localStorage.

### First Time Setup:

1. Open `index.html` in your browser
2. Open the browser console:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
   - **Safari**: Enable Developer menu, then `Cmd+Option+C`

3. In the console, paste this command (replace with your actual key):
   ```javascript
   localStorage.setItem('CLAUDE_API_KEY', 'sk-ant-api03-HEZ...uAAA')
   ```

4. Or use the helper function:
   ```javascript
   setClaudeApiKey('sk-ant-api03-HEZ...uAAA')
   ```

5. You should see: `✅ API key saved successfully to localStorage`

### That's it!

The key is now saved in your browser and will persist across page refreshes.

### To Check if Your Key is Set:

```javascript
localStorage.getItem('CLAUDE_API_KEY')
```

### To Remove Your Key:

```javascript
localStorage.removeItem('CLAUDE_API_KEY')
```

---

## Why This is Safe:

✅ **Not in code files** - Can't accidentally commit to GitHub
✅ **Browser-only** - Stored locally on your computer
✅ **Easy to remove** - Just clear localStorage or browser data
✅ **Per-browser** - Each browser has its own storage

## Important Notes:

- The key stays in your browser's localStorage (persists across sessions)
- If you clear your browser data, you'll need to set it again
- Different browsers have separate localStorage (set it in each browser you use)
- The key is only accessible from pages on the same domain/file path

---

## If You're Sharing This Project:

Since the API key is NOT in the code, you can safely:
- Share the code files
- Commit to GitHub
- Send to others

They will need to set their own API key using the same steps above.
