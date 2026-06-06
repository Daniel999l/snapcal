import { Router } from 'express';
import { estimateMeal } from '../services/groq.js';
import { checkAndIncrement } from '../lib/rateLimit.js';

const router = Router();

const IP_LIMIT = parseInt(process.env.IP_RATE_LIMIT) || 10;

router.post('/estimate', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'Image base64 required' });

    const ip = req.ip || req.connection.remoteAddress;
    const ipCheck = checkAndIncrement('ip', ip, IP_LIMIT);
    if (!ipCheck.allowed) {
      return res.status(429).json({
        error: `Rate limit exceeded. Max ${IP_LIMIT} requests per hour. Try again later.`,
        remaining: 0,
      });
    }

    const result = await estimateMeal(image);
    res.json({
      ...result,
      _rateLimit: { ipRemaining: ipCheck.remaining },
    });
  } catch (err) {
    console.error('Estimate error:', err.message);
    if (err.response?.data) console.error('Groq API response:', err.response.data);
    res.status(500).json({ error: 'Failed to estimate meal' });
  }
});

router.get('/rate-limit-status', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const ipCheck = checkAndIncrement('ip', ip, IP_LIMIT);
  res.json({ ipRemaining: ipCheck.remaining });
});

export default router;