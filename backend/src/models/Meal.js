import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  ingredients: [String],
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Meal', mealSchema);