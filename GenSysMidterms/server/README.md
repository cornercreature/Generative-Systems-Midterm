# Backend Proxy Server Setup

This server acts as a proxy between your frontend and the Claude API to avoid CORS issues and keep your API key secure.

## Setup Instructions

### 1. Add Your API Key

Open the `.env` file in this folder and replace `YOUR-KEY-HERE` with your actual Claude API key:

```env
CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
```

### 2. Install Dependencies (Already Done!)

```bash
npm install
```

### 3. Start the Server

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║  Color Picker Proxy Server Running    ║
╚════════════════════════════════════════╝

Server: http://localhost:3000
Status: Ready to generate poetry!
```

### 4. Keep the Server Running

Leave this terminal window open while using the application. The server needs to be running for poem generation to work.

## Using the Application

1. Start the server (this terminal): `npm start`
2. In another terminal, navigate to the parent folder and start a web server:
   ```bash
   cd ..
   python3 -m http.server 8000
   ```
3. Open your browser to: `http://localhost:8000`
4. Generate poems!

## Troubleshooting

**"API key not configured" error:**
- Make sure you've added your actual API key to the `.env` file
- Restart the server after changing the `.env` file

**"Cannot connect to server" error:**
- Make sure the server is running (`npm start`)
- Check that it's running on port 3000
- Make sure your frontend is using `http://localhost:8000` (not file://)

**Port 3000 already in use:**
- Change `PORT=3000` to `PORT=3001` in `.env`
- Update frontend code to use the new port

## Security Notes

✅ API key is stored in `.env` file (not committed to Git)
✅ Server only accepts requests from localhost
✅ No API key exposed in frontend code
