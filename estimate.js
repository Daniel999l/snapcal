catch (err) {
  console.error('Estimate error:', err.message);
  console.error('Groq response:', err.response?.data || err);
  res.status(500).json({ error: 'Failed to estimate meal' });
}