import { checkAndIncrement } from '../backend/src/lib/rateLimit.js';

const IP_LIMIT = parseInt(process.env.IP_RATE_LIMIT) || 10;

export default function handler(req, res) {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const ipCheck = checkAndIncrement('ip', ip, IP_LIMIT);
  res.json({ ipRemaining: ipCheck.remaining });
}
