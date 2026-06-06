import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function estimateMeal(base64Image) {
  const response = await groq.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'You are a nutrition expert. Analyze this food image. Estimate total calories, protein (g), carbs (g), fat (g), and list main ingredients. Also give a short descriptive meal name. Return ONLY JSON with keys: mealName (string), calories, protein, carbs, fat, ingredients (array of strings). No extra text.'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ],
    temperature: 0.2,
    max_tokens: 500
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from Groq');

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse JSON from AI response');

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    mealName: parsed.mealName || 'Unknown Meal',
    calories: Math.round(parsed.calories),
    protein: Math.round(parsed.protein),
    carbs: Math.round(parsed.carbs),
    fat: Math.round(parsed.fat),
    ingredients: parsed.ingredients || []
  };
}