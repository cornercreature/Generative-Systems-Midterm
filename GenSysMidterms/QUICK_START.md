# Quick Start Guide

## 🚀 How to Run Your Color Picker Application

### **Method 1: Single Command (Easiest!)**

Open **one terminal** and run:

```bash
cd /Users/nicolesun/Documents/Generative-Systems-Midterm/GenSysMidterms
./start.sh
```

Then open your browser to: **http://localhost:8080**

To stop: Press `Ctrl+C` in the terminal

---

### **Method 2: Manual (Two Terminals)**

If the script doesn't work, use this method:

#### **Terminal 1: Backend Server**
```bash
cd /Users/nicolesun/Documents/Generative-Systems-Midterm/GenSysMidterms/server
npm start
```

#### **Terminal 2: Frontend Server**
```bash
cd /Users/nicolesun/Documents/Generative-Systems-Midterm/GenSysMidterms
python3 -m http.server 8080
```

#### **Browser**
Open: **http://localhost:8080**

---

## 📋 Checklist Before Starting:

- [ ] Make sure you've set your API key in `server/.env`
- [ ] Make sure Node.js is installed (`node --version`)
- [ ] Make sure you've run `npm install` in the `server/` folder (one-time setup)

---

## 🛑 How to Stop:

**If using the script:**
- Press `Ctrl+C` in the terminal

**If using two terminals:**
- Press `Ctrl+C` in both terminals

---

## ❓ Troubleshooting:

**"Port already in use" error:**
- Kill existing processes:
  ```bash
  lsof -ti:3000 | xargs kill -9
  lsof -ti:8080 | xargs kill -9
  ```

**"Permission denied" when running script:**
- Make script executable:
  ```bash
  chmod +x start.sh
  ```

**Backend shows "API key not configured":**
- Check `server/.env` file has your real API key
- Restart the backend server

---

## 🎨 You're Ready!

Once both servers are running, you can:
1. Adjust colors with the sliders
2. Move circles around
3. Click "Generate Report" to see:
   - Color swatches with RGB, CMYK, HSV, HEX
   - Canvas preview of your circles
   - AI-generated poetry based on your palette!

Enjoy! ✨
