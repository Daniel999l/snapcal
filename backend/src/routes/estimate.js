import { Router } from 'express';
import { estimateMeal } from '../services/groq.js';
import { getMeals, addMeal, updateMeal } from '../lib/storage.js';

const router = Router();

router.post('/estimate', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'Image base64 required' });

    const result = await estimateMeal(image);
    const meal = addMeal(result);

    res.json(meal);
  } catch (err) {
    console.error('Estimate error:', err.message);
    if (err.response?.data) console.error('Groq API response:', err.response.data);
    res.status(500).json({ error: 'Failed to estimate meal' });
  }
});

router.get('/history', (req, res) => {
  try {
    const meals = getMeals().slice(0, 20);
    res.json(meals);
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.put('/meals/:id', (req, res) => {
  try {
    const updated = updateMeal(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default router;