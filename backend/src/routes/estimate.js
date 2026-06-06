import { Router } from 'express';
import { estimateMeal } from '../services/groq.js';
import Meal from '../models/Meal.js';

const router = Router();

router.post('/estimate', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image base64 required' });
    }

    const result = await estimateMeal(image);
    const meal = await Meal.create(result);

    res.json(meal);
  } catch (err) {
    console.error('Estimate error:', err.message);
    if (err.response?.data) console.error('Groq API response:', err.response.data);
    res.status(500).json({ error: 'Failed to estimate meal' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const meals = await Meal.find().sort({ timestamp: -1 }).limit(20);
    res.json(meals);
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;