# SnapCal

AI meal photo calorie estimator. Snap a photo of your meal, get instant calorie, macro, and ingredient breakdown.

## Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js ESM + Express + Groq Vision (Llama 4 Scout)
- **Rate Limiting**: Per-IP (10 req/hour) to protect Groq free trial

## Hosting

- Frontend on Vercel, backend on Railway (or any VPS)

## Local Development

1. Clone repo
2. Copy `.env.example` to `.env` and fill in your Groq API key
3. `npm install`
4. `npm run dev` (backend :5002, frontend :5173)

## Rate Limits

- Per IP: 10 requests per hour (independent per user)
- Rate limit counters persist across restarts (stored in `data/rateLimits.json`)
- Check remaining: `GET /api/rate-limit-status`