import 'dotenv/config';
import { estimateMeal } from '../backend/src/services/groq.js';
import { checkAndIncrement } from '../backend/src/lib/rateLimit.js';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};

const IP_LIMIT = parseInt(process.env.IP_RATE_LIMIT) || 10;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'Image base64 required' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const ipCheck = checkAndIncrement('ip', ip, IP_LIMIT);
  if (!ipCheck.allowed) {
    return res.status(429).json({
      error: `Rate limit exceeded. Max ${IP_LIMIT} requests per hour. Try again later.`,
      remaining: 0,
    });
  }

  try {
    const result = await estimateMeal(image);
    res.json({ ...result, _rateLimit: { ipRemaining: ipCheck.remaining } });
  } catch (err) {
    console.error('Estimate error:', err.message);
    res.status(500).json({ error: 'Failed to estimate meal' });
  }
}
