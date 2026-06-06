# SnapCal

AI meal photo calorie estimator. Snap a photo of your meal, get instant calorie, macro, and ingredient breakdown.

## Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js ESM + Express + MongoDB + Groq Vision (LLaMA 3.2)
- **Hosting**: Vercel (frontend) + Railway (backend) or any VPS

## Local Development

1. Clone repo
2. Copy `.env.example` to `.env` and fill in your Groq API key and MongoDB URI
3. Install dependencies: `npm install` (from root, will install both frontend and backend)
4. Run dev servers: `npm run dev` (starts backend on :5002, frontend on :5173)

## Build for Production