# AI-Powered RFP Management System

An intelligent procurement automation platform that streamlines the entire Request for Proposal (RFP) workflow - from natural language RFP creation to AI-powered proposal comparison.

## 🎯 Problem Statement

Traditional procurement processes are:
- **Slow & Manual**: Hours spent copying data from emails to spreadsheets
- **Error-Prone**: Manual data entry leads to mistakes and inconsistencies
- **Unstructured**: Vendor responses come in various formats (emails, PDFs, free-form text)
- **Time-Consuming**: Comparing multiple proposals requires extensive manual analysis

This system automates the entire workflow, reducing procurement cycle time from days to hours.

## ✨ Key Features

### 1. **Natural Language RFP Creation**
- Describe requirements in plain English
- AI (Google Gemini) automatically structures into formal RFP
- Extracts items, quantities, specs, budget, terms, and warranty
- Saves 10-15 minutes per RFP vs manual form filling

### 2. **Intelligent Vendor Management**
- Maintain vendor database with contact information
- Visual workflow status (Not Sent → Sent → Responded)
- Prevent duplicate sends with smart UI controls
- Automatic vendor creation from email responses

### 3. **Automated Email Integration**
- Send professional RFP emails via SMTP
- IMAP listener monitors for vendor responses (10-second polling)
- Unique RFP ID tracking for automatic matching
- Filters recent emails to handle large inboxes efficiently

### 4. **AI-Powered Proposal Parsing**
- Automatically extracts pricing, terms, and conditions from unstructured vendor emails
- Handles free-form text, tables, and various email formats
- Creates structured proposals without manual data entry
- Robust error handling for malformed responses

### 5. **Smart Proposal Comparison**
- Side-by-side comparison of all proposals
- AI-generated scores based on multiple factors (price, delivery, terms, compliance)
- Intelligent recommendations with reasoning
- Considers value, not just lowest price

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React + TypeScript + TailwindCSS + shadcn/ui        │  │
│  │  - Type-safe components                              │  │
│  │  - React Query for data fetching & caching           │  │
│  │  - React Router for navigation                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Node.js + Express                                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │  │
│  │  │  Routes    │→ │Controllers │→ │  Services    │  │  │
│  │  └────────────┘  └────────────┘  └──────────────┘  │  │
│  │                                                      │  │
│  │  Services:                                           │  │
│  │  • AI Service (Gemini Integration)                  │  │
│  │  • Email Listener (IMAP Polling)                    │  │
│  │  • Email Sender (SMTP)                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
    ┌───────────────────┐   ┌──────────────────┐
    │    MongoDB        │   │  Gmail SMTP/IMAP │
    │                   │   │                  │
    │  • RFPs           │   │  • Send RFPs     │
    │  • Vendors        │   │  • Receive       │
    │  • Proposals      │   │    Proposals     │
    └───────────────────┘   └──────────────────┘
                                      │
                                      ▼
                            ┌──────────────────┐
                            │  Google Gemini   │
                            │                  │
                            │  • Parse RFPs    │
                            │  • Parse         │
                            │    Proposals     │
                            │  • Compare &     │
                            │    Score         │
                            └──────────────────┘
```

## 🔄 Data Flow

### Creating an RFP
```
User Input (Natural Language)
    ↓
Frontend → POST /api/rfps/create
    ↓
Backend Controller
    ↓
AI Service (Gemini) - Parse & Structure
    ↓
MongoDB - Save RFP
    ↓
Response → Frontend Display
```

### Sending RFP to Vendors
```
User Selects Vendors
    ↓
Frontend → POST /api/rfps/:id/send
    ↓
Backend Controller
    ↓
Update RFP Status → "sent"
    ↓
Email Service (SMTP) → Send to Vendors
    ↓
Success Response
```

### Re# AI-Powered RFP Management System

Automated procurement platform that streamlines RFP workflows - from natural language creation to AI-powered proposal comparison.

## Features

- **Natural Language RFP Creation** - Describe requirements in plain English, AI structures into formal RFP
- **Intelligent Vendor Management** - Track vendor status (Not Sent → Sent → Responded)
- **Automated Email Integration** - IMAP listener monitors vendor responses (10s polling)
- **AI Proposal Parsing** - Extracts pricing and terms from unstructured emails
- **Smart Comparison** - AI scores and recommends best proposals

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, React Query  
**Backend:** Node.js, Express, MongoDB, Nodemailer, node-imap, Google Gemini AI  
**Infrastructure:** Gmail SMTP/IMAP, MongoDB Atlas

## Setup

### Prerequisites
- Node.js v18+
- MongoDB
- Gmail account with App Password
- Google Gemini API key

### Backend
```bash
cd backend
npm install
```

Create `.env`:
```env
PORT=5555
MONGODB_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

```bash
npm start
```

### Frontend
```bash
cd frontend
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:5555/api
```

```bash
npm run dev
```

Access at http://localhost:5173

## Usage

1. **Create RFP** - Describe requirements in natural language
2. **Send to Vendors** - Select vendors and send via email
3. **Receive Proposals** - Vendors reply, AI parses automatically
4. **Compare** - View AI scores and recommendations

## Key Design Decisions

- **Gemini over OpenAI** - Cost-effective, better structured output
- **MongoDB** - Flexible schema for unstructured vendor responses
- **IMAP Polling** - Simple MVP approach (production would use webhooks)
- **React Query** - Automatic caching and optimistic updates

## Known Limitations

- IMAP polling doesn't scale (production: SendGrid webhooks)
- Synchronous AI processing (production: async job queue)
- Gmail IMAP blocks cloud IPs (production: SendGrid/AWS SES)

## Contact

**Sumit Sinha**  
Email: sumitsinha1007@gmail.com  
GitHub: [sumit298](https://github.com/sumit298)
