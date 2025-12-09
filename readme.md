# AI-Powered RFP Management System

Automated procurement platform: natural language RFP creation → AI-powered proposal comparison.

## Tech Stack
React, TypeScript, Node.js, MongoDB, Google Gemini AI, Gmail SMTP/IMAP

## Setup

**Backend:**
```bash
cd backend && npm install
```
Create `.env`:
```env
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```
```bash
npm start
```

**Frontend:**
```bash
cd frontend && npm install
```
Create `.env`:
```env
VITE_API_URL=http://localhost:5555/api
```
```bash
npm run dev
```

Access: http://localhost:5173

